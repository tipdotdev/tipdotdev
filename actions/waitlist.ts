"use server";

import { db } from "@/db";
import { waitlist } from "@/db/schema";
import { count } from "drizzle-orm";

export async function addToWaitlist(email: string): Promise<{
    success: boolean;
    error?: string;
}> {
    const result = await db
        .insert(waitlist)
        .values({
            email
        })
        .catch(() => {
            return null;
        });

    if (!result) {
        return {
            success: false,
            error: "You're already on the waitlist"
        };
    }

    return {
        success: true
    };
}

export async function getWaitlistLength() {
    const result = await db.select({ count: count() }).from(waitlist);

    return result[0].count;
}
