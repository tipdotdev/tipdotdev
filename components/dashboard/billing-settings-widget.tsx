"use client";

import { getStripeDashboardLink } from "@/actions/stripe";
import { profile as profileSchema } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { DollarSignIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export function BillingSettingsWidget({
    profile
}: {
    profile: InferSelectModel<typeof profileSchema>;
}) {
    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Billing & Payments</h2>
            </div>

            <div className="space-y-6">
                {/* Connected Stripe Account */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <DollarSignIcon className="size-4 text-muted-foreground/60" />
                        <Label className="text-sm font-medium">Stripe Account</Label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {profile.stripeConnected ? (
                                <Badge
                                    variant="outline"
                                    className="border-green-400 bg-green-400/10 text-green-400"
                                >
                                    Connected
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="border-red-400 bg-red-400/10 text-red-400"
                                >
                                    Not Connected
                                </Badge>
                            )}
                            <span className="text-sm text-foreground/80">
                                {profile.stripeConnected
                                    ? "Receiving payments enabled"
                                    : "Receiving payments disabled"}
                            </span>
                        </div>
                        {profile.stripeConnected ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    const url = await getStripeDashboardLink(profile.userId);
                                    window.open(url, "_blank");
                                }}
                            >
                                <ExternalLinkIcon className="size-4" />
                                Stripe Dashboard
                            </Button>
                        ) : (
                            <Button size="sm">
                                <Link href="/onboarding/payout">Connect</Link>
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-foreground/60">
                        {profile.stripeConnected
                            ? "Your Stripe account is connected and ready to receive payments."
                            : "Your Stripe account is not connected. Please connect your account to receive payments."}
                    </p>
                </div>
            </div>
        </div>
    );
}
