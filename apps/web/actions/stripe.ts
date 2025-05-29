"use server";

import { db } from "@/db";
import { transaction } from "@/db/schema";
import { PaymentIntentSimple } from "@/types/stripe";
import { eq } from "drizzle-orm";
import { Stripe } from "stripe";
import { getProfileByStripeAcctID } from "./profile";
import { getSelfUser } from "./user";

export async function createPaymentIntent(
    amount: number,
    toAcctID: string,
    fromEmail: string,
    fromAcctID?: string,
    metadata?: Record<string, string>
): Promise<PaymentIntentSimple> {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });

    const fee = Math.round(amount * 100 * 0.045);

    // Create the payment intent
    const pi = await stripe.paymentIntents.create(
        {
            amount: amount * 100,
            currency: "usd",
            receipt_email: fromEmail,
            application_fee_amount: fee, // take a 4.5% transaction fee
            metadata: metadata
        },
        {
            stripeAccount: toAcctID
        }
    );

    // get the user id from the toAcctID
    const user = await getProfileByStripeAcctID(toAcctID);
    const selfUser = await getSelfUser();
    // let selfProfile;

    if (!selfUser?.isAnonymous) {
        // selfProfile = await getSelfProfile();
    }

    if (!user) {
        throw new Error("User not found");
    }

    if (!selfUser) {
        throw new Error("Self not found");
    }

    const { error } = await db.insert(transaction).values({
        amount: amount * 100,
        fromUserId: selfUser.id,
        toUserId: user.userId,
        stripeId: pi.id,
        type: "tip",
        isCompleted: false,
        message: metadata?.message || "No message",
        fromUserEmail: fromEmail
    });

    if (error) {
        throw new Error("Error creating transaction");
    }

    // Return only the necessary data
    return {
        client_secret: pi.client_secret!,
        id: pi.id,
        status: pi.status
    };
}

export async function completeTransaction(transactionId: string): Promise<{ success: boolean }> {
    const { error } = await db
        .update(transaction)
        .set({
            isCompleted: true,
            updatedAt: new Date()
        })
        .where(eq(transaction.stripeId, transactionId));

    console.error(error);

    if (error) {
        throw new Error("Error completing transaction");
    }

    // later we will email the user and the creator of the transaction

    return {
        success: true
    };
}
