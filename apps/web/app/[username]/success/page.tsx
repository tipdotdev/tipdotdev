"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const transactionId = searchParams.get("payment_intent");

    // make a post request to the success route
    useEffect(() => {
        setIsLoading(true);

        // get the username from the url
        // the url is /[username]/success?payment_intent=[transactionId]
        const url = new URL(window.location.href);
        const username = url.pathname.split("/")[1];
        setUsername(username);

        if (!transactionId) {
            setError("No transaction ID");
            setIsLoading(false);
            return;
        }

        fetch("/api/stripe/success", {
            method: "POST",
            body: JSON.stringify({ payment_intent: transactionId })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [transactionId]);

    // if the transactionId is not found, return a 404
    if (error) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-1">
                    <XCircleIcon className="h-12 w-12 text-red-500" />

                    <h1 className="text-2xl font-bold">Something went wrong</h1>
                    <p className="text-sm text-foreground/80">
                        Your payment was successful, but something on our end went wrong.
                    </p>
                    <Button variant="secondary" size="lg" className="mt-8 w-full" asChild>
                        <Link href={`/${username}`}>Go back to {username}&apos;s profile</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-1">
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
                <h1 className="mt-8 text-2xl font-bold">Payment successful</h1>
                <p className="text-sm text-foreground/80">Thank you for supporting {username}!</p>

                <Button variant="secondary" size="lg" className="mt-8 w-full" asChild>
                    <Link href={`/${username}`}>Go back to {username}&apos;s profile</Link>
                </Button>
            </div>
        </div>
    );
}
