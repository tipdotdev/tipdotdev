"use server";

import { db } from "@/db";
import { transaction } from "@/db/schema";
import { PaymentIntentSimple } from "@/types/stripe";
import { eq } from "drizzle-orm";
import posthog from "posthog-js";
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
    // Check if user is covering the fee
    const isCoveringFee = metadata?.coverFee === "true";
    const originalAmount = metadata?.originalAmount ? parseFloat(metadata.originalAmount) : amount;
    const platformFeeAmount = metadata?.platformFee ? parseFloat(metadata.platformFee) : 0;

    let finalAmount: number;
    let applicationFee: number;

    if (isCoveringFee) {
        // User is covering the fee, so the full amount goes to the recipient
        // The amount passed in already includes the platform fee
        finalAmount = amount * 100; // Convert to cents
        applicationFee = Math.round(platformFeeAmount * 100); // Platform fee in cents
    } else {
        // Standard flow - fee is deducted from the tip
        finalAmount = amount * 100; // Convert to cents
        applicationFee = Math.round(amount * 100 * 0.045); // 4.5% fee in cents
    }

    const paymentIntentData = {
        amount: finalAmount,
        currency: "usd",
        receipt_email: fromEmail,
        application_fee_amount: applicationFee,
        metadata: {
            ...metadata,
            isCoveringFee: isCoveringFee.toString(),
            originalTipAmount: originalAmount.toString(),
            platformFeeAmount: platformFeeAmount.toString()
        }
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
        amount: finalAmount,
        fromUserId: selfUser.id,
        toUserId: user.userId,
        stripeId: pi.id,
        type: "tip",
        isCompleted: false,
        netAmount: 0,
        stripeFee: 0,
        applicationFee: applicationFee,
        message: metadata?.message || "No message",
        fromUserEmail: fromEmail
    });

    if (error) {
        throw new Error("Error creating transaction");
    }

    posthog.capture("stripe.payment_intent.created", {
        profileId: selfUser.id,
        amount: finalAmount,
        type: "tip",
        stripeId: pi.id
    });

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

    const profile = await getProfileByUserId(existingTransaction.toUserId || "");

    try {
        const { balanceTransaction } = await getStripeTransaction(
            transactionId,
            profile?.stripeAcctID || ""
        );

        // If balance transaction is not available yet, we can't complete the transaction
        if (!balanceTransaction) {
            throw new Error(
                "Balance transaction not available yet - charge may still be processing"
            );
        }

        const netAmount = balanceTransaction.net;
        const stripeFee = balanceTransaction.fee_details?.find(
            (fee) => fee.type === "stripe_fee"
        )?.amount;
        const applicationFee = balanceTransaction.fee_details?.find(
            (fee) => fee.type === "application_fee"
        )?.amount;
        const grossAmount = balanceTransaction.amount;

        // Only proceed with completion if not already completed
        const [updatedTransaction] = await db
            .update(transaction)
            .set({
                amount: Number(grossAmount),
                isCompleted: true,
                netAmount: Number(netAmount),
                stripeFee: Number(stripeFee),
                applicationFee: Number(applicationFee),
                updatedAt: new Date()
            })
            .where(eq(transaction.stripeId, transactionId))
            .returning();

        if (!updatedTransaction) {
            throw new Error("Error completing transaction");
        }

        const p = await stripe.paymentIntents.retrieve(transactionId, {
            stripeAccount: profile?.stripeAcctID || undefined
        });
        const pm = await stripe.paymentMethods.retrieve(p.payment_method?.toString() || "", {
            stripeAccount: profile?.stripeAcctID || undefined
        });

        posthog.capture("stripe.transaction.completed", {
            profileId: updatedTransaction.fromUserId || undefined,
            amount: updatedTransaction.amount,
            type: "tip",
            stripeId: transactionId
        });

        return {
            transaction: updatedTransaction,
            success: true,
            paymentMethod:
                pm.type === "card" ? (pm.card?.last4 ?? null) : (pm.type?.toString() ?? null),
            alreadyProcessed: false
        };
    } catch (error) {
        // If we get a balance transaction error, the payment might still be processing
        if (error instanceof Error && error.message.includes("balance_transaction")) {
            throw new Error("Payment is still processing - please try again in a few moments");
        }
        throw error;
    }
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

export async function getStripeTransaction(paymentIntentId: string, stripeAcctID: string) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        stripeAccount: stripeAcctID
    });

    const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string, {
        stripeAccount: stripeAcctID
    });

    // Check if balance_transaction is available before trying to retrieve it
    if (!charge.balance_transaction) {
        return {
            paymentIntent,
            charge,
            balanceTransaction: null
        };
    }

    const balanceTransaction = await stripe.balanceTransactions.retrieve(
        charge.balance_transaction as string,
        {
            stripeAccount: stripeAcctID
        }
    );

    return { paymentIntent, charge, balanceTransaction };
}
