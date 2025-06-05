import { eq } from "drizzle-orm";

import { db } from "@/db";
import { notificationPreferences } from "@/db/schema";
import { op } from "@/utils/op";
import { getUserByEmail } from "./user";

export async function createNotificationPreferences(userId: string) {
    // check if the user already has notification preferences
    const existingPreferences = await db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, userId));

    if (existingPreferences.length > 0) {
        return existingPreferences[0];
    }

    // create the notification preferences
    const newPreferences = await db
        .insert(notificationPreferences)
        .values({
            userId
            // emailOnTip is true by default
        })
        .returning();

    op.track("notifications.preferences.created", {
        profileId: userId
    });

    return newPreferences[0];
}

export async function getNotificationPreferences(userId: string) {
    const preferences = await db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, userId));

    return preferences[0];
}

export async function getNotificationPreferencesByEmail(email: string) {
    const user = await getUserByEmail(email);
    if (!user) {
        return null;
    }

    const preferences = await db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, user.id));

    return preferences[0];
}

export async function updateNotificationPreferences(
    userId: string,
    preferences: Partial<typeof notificationPreferences.$inferSelect>
) {
    // check if the user already has notification preferences
    const existingPreferences = await db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, userId));

    if (existingPreferences.length === 0) {
        return null;
    }

    const updatedPreferences = await db
        .update(notificationPreferences)
        .set(preferences)
        .where(eq(notificationPreferences.userId, userId))
        .returning();

    op.track("notifications.preferences.updated", {
        profileId: userId
    });

    return updatedPreferences[0];
}
