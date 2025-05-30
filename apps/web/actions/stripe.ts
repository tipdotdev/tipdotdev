"use server";

import { db } from "@/db";
import { transaction } from "@/db/schema";
import { PaymentIntentSimple } from "@/types/stripe";
import { eq } from "drizzle-orm";
import { Stripe } from "stripe";
import { getProfileByStripeAcctID, getProfileByUserId } from "./profile";
import { getSelfUser } from "./user";

export async function createPaymentIntent(
    amount: number,
    toAcctID: string,
    fromEmail: string,
    fromAcctID?: string,
    metadata?: Record<string, string>
): Promise<PaymentIntentSimple> {
    console.log("createPaymentIntent called with fromEmail:", fromEmail);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });

    const fee = Math.round(amount * 100 * 0.045);

    const paymentIntentData = {
        amount: amount * 100,
        currency: "usd",
        receipt_email: fromEmail,
        application_fee_amount: fee, // take a 4.5% transaction fee
        metadata: metadata
    };

    console.log("PaymentIntent data being sent to Stripe:", paymentIntentData);
    console.log("Stripe account ID:", toAcctID);

    // Create the payment intent
    const pi = await stripe.paymentIntents.create(paymentIntentData, {
        stripeAccount: toAcctID
    });

    console.log("Created PaymentIntent ID:", pi.id, "with receipt_email:", pi.receipt_email);

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
    console.log("Completing transaction with ID:", transactionId);

    // First, let's see what transaction we're updating
    const existingTransaction = await db
        .select()
        .from(transaction)
        .where(eq(transaction.stripeId, transactionId));

    console.log("Existing transaction before update:", existingTransaction);

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

export async function getStripeDashboardLink(userId: string) {
    const user = await getProfileByUserId(userId);

    if (!user) {
        throw new Error("User not found");
    }
    if (!user.stripeAcctID) {
        throw new Error("User has no Stripe account");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });

    const link = await stripe.accounts.createLoginLink(user.stripeAcctID!);

    return link.url;
}

export async function getStripeAccountSession(userId: string) {
    const user = await getProfileByUserId(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.stripeAcctID) {
        throw new Error("User has no Stripe account");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });

    const session = await stripe.accountSessions.create({
        account: user.stripeAcctID,
        components: {
            payments: {
                enabled: true,
                features: {
                    refund_management: true,
                    dispute_management: true,
                    capture_payments: true,
                    destination_on_behalf_of_charge_management: true
                }
            },
            balances: {
                enabled: true,
                features: {
                    disable_stripe_user_authentication: false,
                    edit_payout_schedule: true,
                    external_account_collection: true,
                    instant_payouts: true,
                    standard_payouts: true
                }
            },
            notification_banner: {
                enabled: true
            }
        }
    });

    return session.client_secret;
}
