"use server";

import { db } from "@/db";
import { transaction } from "@/db/schema";

interface SeedTransactionOptions {
    toUserId: string;
    count?: number;
}

export async function seedTransactions({ toUserId, count = 10 }: SeedTransactionOptions) {
    const sampleMessages = [
        "Payment for services",
        "Monthly subscription",
        "Refund for order",
        "Transfer to friend",
        "Freelance work payment",
        "Gift money",
        "Rent payment",
        "Utility bill",
        null,
        null,
        null,
        null,
        null
    ];

    const generateRandomTransaction = () => {
        const amount = Math.floor(Math.random() * 100000) + 100; // $1 to $1000
        const applicationFee = Math.floor(amount * 0.045); // 4.5% fee
        const stripeFee = Math.floor(amount * 0.029 + 30); // Stripe's typical fee
        const netAmount = amount - applicationFee - stripeFee;

        return {
            fromUserId: toUserId,
            toUserId,
            amount,
            applicationFee,
            stripeFee,
            netAmount,
            stripeId: `pi_${Math.random().toString(36).substr(2, 24)}`,
            type: "tip",
            isCompleted: Math.random() > 0.1, // 90% completed
            message: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
            fromUserEmail: "seed@tip.dev",
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date within last 30 days
            updatedAt: new Date()
        };
    };

    try {
        const transactions = Array.from({ length: count }, generateRandomTransaction);

        const result = await db.insert(transaction).values(transactions).returning();

        console.log(`Successfully seeded ${result.length} transactions for user ${toUserId}`);
        return result;
    } catch (error) {
        console.error("Error seeding transactions:", error);
        throw error;
    }
}

// Usage example:
//
