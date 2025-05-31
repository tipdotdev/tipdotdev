"use server";

import { db } from "@/db";
import { transaction, user } from "@/db/schema";
import { auth } from "@/utils/auth";
import { and, count, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getSelfUser() {
    const authData = await auth.api.getSession({
        headers: await headers()
    });

    return authData?.user;
}

export async function getRecentTransactions(userId: string) {
    const transactions = await db
        .select()
        .from(transaction)
        .where(and(eq(transaction.toUserId, userId), eq(transaction.isCompleted, true)))
        .orderBy(desc(transaction.createdAt));

    return transactions;
}

export async function getSupporterCount(userId: string) {
    const supporters = await db
        .select({ count: count() })
        .from(transaction)
        .where(and(eq(transaction.toUserId, userId), eq(transaction.isCompleted, true)))
        .groupBy(transaction.fromUserEmail);

    return supporters.length;
}

export async function getUserByEmail(email: string) {
    const userData = await db.select().from(user).where(eq(user.email, email));

    return userData[0];
}
