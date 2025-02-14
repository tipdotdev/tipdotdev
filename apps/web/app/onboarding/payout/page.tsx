"use client";

import { getSelfProfile } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { LockIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
    getSelfProfile().then((profile) => {
        if (profile?.stripe_account_id) {
            window.location.href = "/dashboard";
        }
    });

    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        // make a post request to /api/stripe/connect
        setLoading(true);

        fetch("/api/stripe/connect", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            if (res.ok) {
                // get the response object
                res.json().then((data) => {
                    if (data.error) {
                        toast.error(data.error);
                    } else {
                        // redirect to the stripe account link
                        window.location.href = data.account_link_url;
                    }
                });
            } else {
                toast.error("An error occurred. Please try again later.");
            }

            setLoading(false);
        });
    };

    return (
        <div className="flex min-h-screen flex-col font-mono font-normal">
            <div className="absolute top-4 flex w-full items-center justify-center px-4">
                <Progress value={100} className="w-full md:w-1/3" />
            </div>
            <section className="relative flex h-screen flex-col items-center justify-center px-4 py-8">
                <div className="flex w-full max-w-md flex-col gap-2">
                    <p className="text-xs">Let&apos;s get you set up.</p>
                    <h2 className="text-xl text-white">How would you like to be paid?</h2>

                    <div className="mt-8 rounded-xl border border-muted-foreground/10 bg-muted p-4 font-sans">
                        <div className="flex w-full items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Stripe Connect</h3>
                            <Badge>Recommended</Badge>
                        </div>
                        <p className="mt-2 text-sm">
                            Create a Stripe Connect account to instantly start worldwide secure
                            payments.
                        </p>

                        <Button className="mt-6 w-full" disabled={loading} onClick={handleClick}>
                            {loading ? <Spinner size={16} /> : <LockIcon />}
                            Connect with Stripe
                        </Button>
                    </div>
                    <p className="mt-2 text-xs text-white/40">
                        You can change this later in your settings.
                    </p>
                </div>
            </section>
        </div>
    );
}
