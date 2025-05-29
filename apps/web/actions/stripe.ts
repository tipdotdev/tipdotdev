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

    // Create the payment intent
    const pi = await stripe.paymentIntents.create(
        {
            amount: amount * 100,
            currency: "usd",
            receipt_email: fromEmail,
            application_fee_amount: Math.round(amount * 100 * 0.05), // Ensure it's an integer
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

    // save the payment intent to the transaction table
    // const { error } = await sb.from("transactions").insert({
    //     to_user_id: user.id,
    //     from_user_id: selfUser.id,
    //     from_user_name: selfProfile?.username || "Anonymous",
    //     message: metadata?.message || null,
    //     amount: amount * 100,
    //     stripe_id: pi.id,
    //     type: "tip",
    //     is_completed: false,
    //     from_user_email: fromEmail
    // });
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

    return {
        success: true
    };
}
