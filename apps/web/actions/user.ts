"use server";

import { db } from "@/db";
import { transaction } from "@/db/schema";
import { auth } from "@/utils/auth";
import { desc, eq } from "drizzle-orm";
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
        .where(eq(transaction.toUserId, userId))
        .orderBy(desc(transaction.createdAt));

    return transactions;
}
