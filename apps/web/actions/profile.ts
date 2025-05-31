"use server";

import { db } from "@/db";
import { profile } from "@/db/schema";
import { auth } from "@/utils/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { createNotificationPreferences } from "./notifications";

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
