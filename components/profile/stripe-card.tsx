"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

function CheckoutForm({ amount, username }: { amount: number; username: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/${username}/success`
                }
            });

            if (error) {
                toast.error("Payment failed", {
                    description: error.message || "Please try again."
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error("Payment failed", {
                description: err.message || "An unexpected error occurred. Please try again."
            });
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full gap-2">
            <PaymentElement className="w-full" />
            <Button className="mt-8 w-full" type="submit" size="lg" disabled={isProcessing}>
                {isProcessing
                    ? "Processing..."
                    : `Pay $${(amount / 100).toFixed(2).toLocaleString()}`}
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
                All transactions are securely processed by{" "}
                <Link
                    className="underline underline-offset-2 transition-colors hover:text-foreground"
                    href="https://stripe.com"
                >
                    Stripe
                </Link>
                .
            </p>
            <br />
            <p className="text-xs text-foreground/40">
                By continuing, you agree to our{" "}
                <Link
                    href="/terms"
                    className="underline underline-offset-2 transition-colors hover:text-foreground"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="/privacy"
                    className="underline underline-offset-2 transition-colors hover:text-foreground"
                >
                    Privacy Policy
                </Link>
                .
            </p>
        </form>
    );
}

export default function StripeCard({
    clientSecret,
    accountID,
    amount,
    username
}: {
    clientSecret: string;
    accountID: string;
    amount: number;
    username: string;
}) {
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!, {
        stripeAccount: accountID
    });

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            variables: {
                colorBackground: "#0F0F0F",
                colorPrimary: "#fff",
                colorTextSecondary: "#fff",
                colorText: "#fff"
            }
        }
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm amount={amount} username={username} />
        </Elements>
    );
}
