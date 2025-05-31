"use server";

import { db } from "@/db";
import { transaction } from "@/db/schema";
import { PaymentIntentSimple } from "@/types/stripe";
import { eq } from "drizzle-orm";
import { Stripe } from "stripe";
import { getProfileByStripeAcctID, getProfileByUserId } from "./profile";
import { getSelfUser } from "./user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });

export async function createPaymentIntent(
    amount: number,
    toAcctID: string,
    fromEmail: string,
    fromAcctID?: string,
    metadata?: Record<string, string>
): Promise<PaymentIntentSimple> {
    const fee = Math.round(amount * 100 * 0.045);

    const paymentIntentData = {
        amount: amount * 100,
        currency: "usd",
        receipt_email: fromEmail,
        application_fee_amount: fee, // take a 4.5% transaction fee
        metadata: metadata
    };

    // Create the payment intent
    const pi = await stripe.paymentIntents.create(paymentIntentData, {
        stripeAccount: toAcctID
    });

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

export async function completeTransaction(transactionId: string): Promise<{
    success: boolean;
    transaction: typeof transaction.$inferSelect;
    paymentMethod: string | null;
    alreadyProcessed: boolean;
}> {
    // First check if the transaction is already completed
    const [existingTransaction] = await db
        .select()
        .from(transaction)
        .where(eq(transaction.stripeId, transactionId))
        .limit(1);

    if (!existingTransaction) {
        throw new Error("Transaction not found");
    }

    // If already completed, return the existing transaction without processing again
    if (existingTransaction.isCompleted) {
        return {
            transaction: existingTransaction,
            success: true,
            paymentMethod: null, // We don't need to fetch payment method again for completed transactions
            alreadyProcessed: true
        };
    }

    // Only proceed with completion if not already completed
    const [updatedTransaction] = await db
        .update(transaction)
        .set({
            isCompleted: true,
            updatedAt: new Date()
        })
        .where(eq(transaction.stripeId, transactionId))
        .returning();

    if (!updatedTransaction) {
        throw new Error("Error completing transaction");
    }

    const profile = await getProfileByUserId(updatedTransaction.toUserId);

    const p = await stripe.paymentIntents.retrieve(transactionId, {
        stripeAccount: profile?.stripeAcctID || undefined
    });
    const pm = await stripe.paymentMethods.retrieve(p.payment_method?.toString() || "", {
        stripeAccount: profile?.stripeAcctID || undefined
    });

    return {
        transaction: updatedTransaction,
        success: true,
        paymentMethod:
            pm.type === "card" ? (pm.card?.last4 ?? null) : (pm.type?.toString() ?? null),
        alreadyProcessed: false
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
