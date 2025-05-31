"use server";

import { db } from "@/db";
import { transaction, user } from "@/db/schema";
import { auth } from "@/utils/auth";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function getSelfUser() {
    const authData = await auth.api.getSession({
        headers: await headers()
    });

    return authData?.user;
}

export async function getRecentTransactions(userId: string, timePeriod: string) {
    let dateCondition;

    switch (timePeriod) {
        case "Today":
            dateCondition = gte(transaction.createdAt, sql`CURRENT_DATE`);
            break;
        case "Past-7-days":
            dateCondition = gte(transaction.createdAt, sql`CURRENT_DATE - INTERVAL '7 days'`);
            break;
        case "Past-30-days":
            dateCondition = gte(transaction.createdAt, sql`CURRENT_DATE - INTERVAL '30 days'`);
            break;
        case "Past-90-days":
            dateCondition = gte(transaction.createdAt, sql`CURRENT_DATE - INTERVAL '90 days'`);
            break;
        case "Past-180-days":
            dateCondition = gte(transaction.createdAt, sql`CURRENT_DATE - INTERVAL '180 days'`);
            break;
        case "Past-365-days":
            dateCondition = gte(transaction.createdAt, sql`CURRENT_DATE - INTERVAL '365 days'`);
            break;
        case "All-time":
        default:
            dateCondition = undefined;
            break;
    }

    const whereConditions = [eq(transaction.toUserId, userId), eq(transaction.isCompleted, true)];

    if (dateCondition) {
        whereConditions.push(dateCondition);
    }

    const transactions = await db
        .select()
        .from(transaction)
        .where(and(...whereConditions))
        .orderBy(desc(transaction.createdAt));

    return transactions;
}

export async function getPreviousPeriodTransactions(userId: string, timePeriod: string) {
    let startDateCondition;
    let endDateCondition;

    switch (timePeriod) {
        case "Today":
            startDateCondition = gte(transaction.createdAt, sql`CURRENT_DATE - INTERVAL '1 day'`);
            endDateCondition = sql`${transaction.createdAt} < CURRENT_DATE`;
            break;
        case "Past-7-days":
            startDateCondition = gte(transaction.createdAt, sql`CURRENT_DATE - INTERVAL '14 days'`);
            endDateCondition = sql`${transaction.createdAt} < CURRENT_DATE - INTERVAL '7 days'`;
            break;
        case "Past-30-days":
            startDateCondition = gte(transaction.createdAt, sql`CURRENT_DATE - INTERVAL '60 days'`);
            endDateCondition = sql`${transaction.createdAt} < CURRENT_DATE - INTERVAL '30 days'`;
            break;
        case "Past-90-days":
            startDateCondition = gte(
                transaction.createdAt,
                sql`CURRENT_DATE - INTERVAL '180 days'`
            );
            endDateCondition = sql`${transaction.createdAt} < CURRENT_DATE - INTERVAL '90 days'`;
            break;
        case "Past-180-days":
            startDateCondition = gte(
                transaction.createdAt,
                sql`CURRENT_DATE - INTERVAL '360 days'`
            );
            endDateCondition = sql`${transaction.createdAt} < CURRENT_DATE - INTERVAL '180 days'`;
            break;
        case "Past-365-days":
            startDateCondition = gte(
                transaction.createdAt,
                sql`CURRENT_DATE - INTERVAL '730 days'`
            );
            endDateCondition = sql`${transaction.createdAt} < CURRENT_DATE - INTERVAL '365 days'`;
            break;
        case "All-time":
        default:
            // For all-time, compare to same period last year
            startDateCondition = gte(
                transaction.createdAt,
                sql`CURRENT_DATE - INTERVAL '730 days'`
            );
            endDateCondition = sql`${transaction.createdAt} < CURRENT_DATE - INTERVAL '365 days'`;
            break;
    }

    const whereConditions = [
        eq(transaction.toUserId, userId),
        eq(transaction.isCompleted, true),
        startDateCondition,
        endDateCondition
    ];

    const transactions = await db
        .select()
        .from(transaction)
        .where(and(...whereConditions))
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
