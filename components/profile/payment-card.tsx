"use client";

import { createPaymentIntent } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { PaymentIntentSimple } from "@/types/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import StripeCard from "./stripe-card";

const formSchema = z.object({
    amount: z.number().int().positive().min(3).max(1000),
    email: z.string().email(),
    message: z.string().max(500).optional(),
    coverAllFees: z.boolean().default(false)
});

export default function PaymentCard({
    username,
    stripeAcctID,
    isSignedIn,
    disabled
}: {
    username: string;
    stripeAcctID: string;
    isSignedIn: boolean;
    disabled: boolean;
}) {
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntentSimple | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 5,
            email: "",
            message: "",
            coverAllFees: false
        }
    });

    // Watch the amount and coverAllFees values to calculate total
    const amount = form.watch("amount");
    const coverAllFees = form.watch("coverAllFees");

    // Calculate fees and total amount
    const platformFee = amount ? Math.round(amount * 0.045 * 100) / 100 : 0;

    // Always calculate what the total would be if covering all fees (for display purposes)
    const totalAmountWithAllFees = amount
        ? Math.round(((amount * 1.045 + 0.3) / 0.971) * 100) / 100
        : 0;

    // Determine actual amounts based on user selection
    let totalAmount = amount;
    let estimatedStripeFee = 0;

    if (coverAllFees) {
        totalAmount = totalAmountWithAllFees;
        estimatedStripeFee = Math.round((totalAmount * 0.029 + 0.3) * 100) / 100;
    } else {
        estimatedStripeFee = Math.round((amount * 0.029 + 0.3) * 100) / 100;
    }

    // Anonymous sign-in on mount (if not already signed in)
    useEffect(() => {
        if (!isSignedIn) {
            authClient.signIn
                .anonymous()
                .then(() => {
                    console.log("Anonymous sign in successful");
                })
                .catch((error) => {
                    console.error("Anonymous sign-in error:", error);
                    toast.error("Error signing in anonymously", {
                        description: "Please try again later."
                    });
                });
        }
    }, [isSignedIn]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true); // Disable button and show loading state

        try {
            const sai: string = stripeAcctID as string; // Type assertion
            const pi = await createPaymentIntent(totalAmount, sai, values.email, undefined, {
                message: values.message || "No message",
                feeOption: values.coverAllFees ? "all" : "none",
                originalAmount: values.amount.toString(),
                platformFee: platformFee.toString(),
                estimatedStripeFee: estimatedStripeFee.toString()
            });
            setPaymentIntent(pi as PaymentIntentSimple);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error creating payment intent:", error);
            toast.error("Error creating payment intent", {
                description: "Please try again later."
            });
        } finally {
            setIsLoading(false); // Re-enable button
        }
    }

    return (
        <>
            {disabled ? (
                <Card className="h-fit w-full border-border/40 bg-card/40 p-4">
                    <CardContent className="flex h-full flex-col items-center justify-center p-0">
                        <p className="text-sm">
                            {username} is unable to receive tips at the moment.
                            <br />
                            <span className="text-xs text-muted-foreground">
                                This user has not enabled tips or has not connected their Stripe
                                account.
                            </span>
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="w-full border-border/40 bg-card/40 p-4">
                    <CardHeader className="p-0">
                        <CardTitle className="text-foreground/60">Support {username}</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-4 p-0">
                        {!paymentIntent ? (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span
                                                            className="absolute inset-y-0 left-0 flex items-center pl-3 text-2xl text-foreground/60"
                                                            aria-label="Amount in dollars"
                                                        >
                                                            $
                                                        </span>
                                                        <Input
                                                            placeholder="5"
                                                            value={field.value || ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Only allow positive integers
                                                                if (/^\d*$/.test(value)) {
                                                                    field.onChange(
                                                                        value ? parseInt(value) : ""
                                                                    );
                                                                }
                                                            }}
                                                            className="h-12 pl-8 font-extrabold"
                                                            style={{ fontSize: "1.5rem" }}
                                                            type="number"
                                                            min="3"
                                                            max="1000"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Email"
                                                        {...field}
                                                        type="email"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Message (optional)"
                                                        className="h-32 resize-none"
                                                        maxLength={500}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="coverAllFees"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex items-start space-x-3 rounded-md border border-border p-4">
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="mt-0.5"
                                                        />
                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="text-sm font-medium">
                                                                    Cover fees (+$
                                                                    {(
                                                                        totalAmountWithAllFees -
                                                                        amount
                                                                    ).toFixed(2)}
                                                                    )
                                                                </p>
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <button
                                                                            type="button"
                                                                            className="text-xs text-primary underline hover:no-underline"
                                                                        >
                                                                            Learn More
                                                                        </button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-w-md">
                                                                        <DialogHeader>
                                                                            <DialogTitle>
                                                                                Complete Fee
                                                                                Coverage
                                                                            </DialogTitle>
                                                                            <DialogDescription className="space-y-3 text-left">
                                                                                <p>
                                                                                    This option
                                                                                    attempts to
                                                                                    cover both
                                                                                    platform and
                                                                                    Stripe
                                                                                    processing fees
                                                                                    so{" "}
                                                                                    <strong>
                                                                                        {username}
                                                                                    </strong>{" "}
                                                                                    receives as
                                                                                    close to your
                                                                                    full intended
                                                                                    tip as possible.
                                                                                </p>
                                                                                <div className="space-y-2 rounded-lg bg-muted p-3">
                                                                                    <div>
                                                                                        <p className="text-sm font-medium">
                                                                                            Platform
                                                                                            Fee
                                                                                            (4.5%)
                                                                                        </p>
                                                                                        <p className="text-xs text-muted-foreground">
                                                                                            $
                                                                                            {platformFee.toFixed(
                                                                                                2
                                                                                            )}{" "}
                                                                                            -{" "}
                                                                                            <strong>
                                                                                                Completely
                                                                                                covered
                                                                                            </strong>
                                                                                        </p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-sm font-medium">
                                                                                            Stripe
                                                                                            Processing
                                                                                            Fee
                                                                                            (~2.9% +
                                                                                            $0.30)
                                                                                        </p>
                                                                                        <p className="text-xs text-muted-foreground">
                                                                                            ~$
                                                                                            {estimatedStripeFee.toFixed(
                                                                                                2
                                                                                            )}{" "}
                                                                                            -{" "}
                                                                                            <strong>
                                                                                                Estimated
                                                                                                coverage
                                                                                            </strong>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950/20">
                                                                                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                                                        Important
                                                                                        Note
                                                                                    </p>
                                                                                    <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                                                                                        Stripe fees
                                                                                        vary based
                                                                                        on card
                                                                                        type,
                                                                                        country,
                                                                                        currency
                                                                                        conversion,
                                                                                        and other
                                                                                        factors.
                                                                                        While we
                                                                                        attempt to
                                                                                        cover these
                                                                                        fees, we
                                                                                        cannot
                                                                                        guarantee
                                                                                        100%
                                                                                        coverage due
                                                                                        to this
                                                                                        variability.
                                                                                    </p>
                                                                                </div>
                                                                                <p>
                                                                                    Our 4.5%
                                                                                    platform fee is
                                                                                    completely
                                                                                    covered, and{" "}
                                                                                    <strong>
                                                                                        {username}
                                                                                    </strong>{" "}
                                                                                    will receive
                                                                                    approximately $
                                                                                    {amount}{" "}
                                                                                    (potentially
                                                                                    slightly more or
                                                                                    less depending
                                                                                    on actual Stripe
                                                                                    fees).
                                                                                </p>
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                Help {username} receive the full tip
                                                                amount
                                                            </p>
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            "Processing..."
                                        ) : (
                                            <>
                                                Tip {username} $
                                                {totalAmount > 0 ? totalAmount.toFixed(2) : "0.00"}
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 p-2">
                                <StripeCard
                                    amount={(coverAllFees ? totalAmount : amount) * 100}
                                    accountID={stripeAcctID}
                                    clientSecret={paymentIntent?.client_secret || ""}
                                    username={username}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </>
    );
}
