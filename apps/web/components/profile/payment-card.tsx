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
import { Textarea } from "../ui/textarea";
import StripeCard from "./stripe-card";

const formSchema = z.object({
    amount: z.number().int().positive().min(3).max(1000),
    email: z.string().email(),
    message: z.string().max(500).optional()
});

export default function PaymentCard({
    username,
    stripeAcctID,
    isSignedIn
}: {
    username: string;
    stripeAcctID: string;
    isSignedIn: boolean;
}) {
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntentSimple | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 5,
            email: "",
            message: ""
        }
    });

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
            const pi = await createPaymentIntent(values.amount, sai, values.email, undefined, {
                message: values.message || "No message"
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
                                            <Input placeholder="Email" {...field} type="email" />
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
                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? (
                                    "Processing..."
                                ) : (
                                    <>
                                        Tip {username} ${form.getValues("amount") || "0"}
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 p-2">
                        <StripeCard
                            amount={form.getValues("amount") * 100}
                            accountID={stripeAcctID}
                            clientSecret={paymentIntent?.client_secret || ""}
                            username={username}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
