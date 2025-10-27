"use server";

import { db } from "@/db";
import { profile } from "@/db/schema";
import { deleteUploadThingFile } from "@/lib/uploadthing";
import { auth } from "@/utils/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import posthog from "posthog-js";
import { createNotificationPreferences, updateNotificationPreferences } from "./notifications";

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    // Normalize username: trim whitespace and convert to lowercase
    const normalized = username.trim().toLowerCase();

    // Validate length: must be between 2 and 50 characters
    if (normalized.length < 2 || normalized.length > 50) {
        return false;
    }

    // Validate URL-safe characters: allow only lowercase letters, numbers, hyphens, and underscores
    if (!/^[a-z0-9\-_]+$/.test(normalized)) {
        return false;
    }

    const data = await db.select().from(profile).where(eq(profile.username, normalized));

    // Return true if no matching user exists, false otherwise
    return data.length === 0;
}

export async function insertUsername(username: string) {
    // Normalize username: trim whitespace and convert to lowercase
    const normalized = username.trim().toLowerCase();

    // Validate length: must be between 2 and 50 characters
    if (normalized.length < 2 || normalized.length > 50) {
        throw new Error("Username must be between 2 and 50 characters.");
    }

    // Validate URL-safe characters: allow only lowercase letters, numbers, hyphens, and underscores
    if (!/^[a-z0-9\-_]+$/.test(normalized)) {
        throw new Error(
            "Username must be URL-safe (only lowercase letters, digits, hyphens, and underscores allowed)."
        );
    }

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("User not authenticated");
    }

    const { error } = await db.insert(profile).values({
        userId: session.user.id,
        username: normalized,
        avatarUrl: session.user.image
    });

    if (error) {
        console.error("Error setting username:", error);
        throw new Error("Error setting username");
    }

    posthog.capture("profile.created", {
        profileId: session.user.id
    });

    // create the notification preferences
    await createNotificationPreferences(session.user.id);
}

export async function getSelfProfile() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return null;
    }

    return await getProfileByUserId(session.user.id);
}

export async function getProfile(username: string) {
    const data = await db.select().from(profile).where(eq(profile.username, username));

    if (data.length === 0) {
        return null;
    }

    return data[0];
}

export async function getProfileByUserId(userId: string) {
    const data = await db.select().from(profile).where(eq(profile.userId, userId));

    if (data.length === 0) {
        return null;
    }

    return data[0];
}

export async function getProfileByStripeAcctID(stripeAcctID: string) {
    const data = await db.select().from(profile).where(eq(profile.stripeAcctID, stripeAcctID));

    if (data.length === 0) {
        return null;
    }

    return data[0];
}

export async function updateProfilePersonalInfo(
    userId: string,
    displayName: string,
    bio: string,
    website: string
): Promise<{ success: boolean; error: string | null }> {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("User not authenticated");
    }

    const { error } = await db
        .update(profile)
        .set({
            displayName: displayName,
            bio: bio,
            website: website
        })
        .where(eq(profile.userId, userId));

    if (error) {
        console.error("Error updating profile:", error);
        throw new Error("Error updating profile");
    }

    posthog.capture("profile.updated.personal_info", {
        profileId: userId
    });

    return { success: true, error: null };
}

export async function updateProfileSocialMedia(
    userId: string,
    twitter: string,
    github: string,
    instagram: string
): Promise<{ success: boolean; error: string | null }> {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("User not authenticated");
    }

    const socialMediaData = {
        twitter: twitter || null,
        github: github || null,
        instagram: instagram || null
    };

    const { error } = await db
        .update(profile)
        .set({
            socialMedia: socialMediaData
        })
        .where(eq(profile.userId, userId));

    if (error) {
        console.error("Error updating profile social media:", error);
        throw new Error("Error updating profile social media");
    }

    posthog.capture("profile.updated.social_media", {
        profileId: userId
    });

    return { success: true, error: null };
}

export async function updateProfileSettings(
    userId: string,
    showTips: boolean,
    allowTips: boolean,
    emailOnTip: boolean
): Promise<{ success: boolean; error: string | null }> {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("User not authenticated");
    }

    try {
        // Update profile settings
        const { error: profileError } = await db
            .update(profile)
            .set({
                showTips: showTips,
                allowTips: allowTips
            })
            .where(eq(profile.userId, userId));

        if (profileError) {
            console.error("Error updating profile settings:", profileError);
            throw new Error("Error updating profile settings");
        }

        // Update notification preferences
        const notificationResult = await updateNotificationPreferences(userId, {
            emailOnTip: emailOnTip
        });

        if (!notificationResult) {
            console.error("Error updating notification preferences");
            throw new Error("Error updating notification preferences");
        }

        posthog.capture("profile.updated.settings", {
            profileId: userId
        });

        return { success: true, error: null };
    } catch (error) {
        console.error("Error updating profile settings:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function updateProfileAvatar(
    userId: string,
    avatarUrl: string | null
): Promise<{ success: boolean; error: string | null }> {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("User not authenticated");
    }

    try {
        // If removing avatar (setting to null), delete the existing file from UploadThing first
        if (avatarUrl === null) {
            const currentProfile = await db
                .select({ avatarKey: profile.avatarKey })
                .from(profile)
                .where(eq(profile.userId, userId))
                .limit(1);

            if (currentProfile[0]?.avatarKey) {
                const deleteResult = await deleteUploadThingFile(currentProfile[0].avatarKey);
                if (!deleteResult.success) {
                    console.warn(
                        "Failed to delete old avatar from UploadThing:",
                        deleteResult.error
                    );
                    // Continue with database update even if file deletion fails
                }
            }
        }

        const { error } = await db
            .update(profile)
            .set({
                avatarUrl: avatarUrl,
                avatarKey: avatarUrl === null ? null : undefined // Clear key when removing, keep existing when updating
            })
            .where(eq(profile.userId, userId));

        if (error) {
            console.error("Error updating profile avatar:", error);
            throw new Error("Error updating profile avatar");
        }

        posthog.capture("profile.updated.avatar", {
            profileId: userId
        });

        return { success: true, error: null };
    } catch (error) {
        console.error("Error updating profile avatar:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function updateProfileBanner(
    userId: string,
    bannerUrl: string | null
): Promise<{ success: boolean; error: string | null }> {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("User not authenticated");
    }

    try {
        // If removing banner (setting to null), delete the existing file from UploadThing first
        if (bannerUrl === null) {
            const currentProfile = await db
                .select({ bannerKey: profile.bannerKey })
                .from(profile)
                .where(eq(profile.userId, userId))
                .limit(1);

            if (currentProfile[0]?.bannerKey) {
                const deleteResult = await deleteUploadThingFile(currentProfile[0].bannerKey);
                if (!deleteResult.success) {
                    console.warn(
                        "Failed to delete old banner from UploadThing:",
                        deleteResult.error
                    );
                    // Continue with database update even if file deletion fails
                }
            }
        }

        const { error } = await db
            .update(profile)
            .set({
                bannerUrl: bannerUrl,
                bannerKey: bannerUrl === null ? null : undefined // Clear key when removing, keep existing when updating
            })
            .where(eq(profile.userId, userId));

        if (error) {
            console.error("Error updating profile banner:", error);
            throw new Error("Error updating profile banner");
        }

        posthog.capture("profile.updated.banner", {
            profileId: userId
        });

        return { success: true, error: null };
    } catch (error) {
        console.error("Error updating profile banner:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}
