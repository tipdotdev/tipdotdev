"use client";

import { getStripeAccountSession, getStripeDashboardLink } from "@/actions/stripe";
import { getSupporterCount } from "@/actions/user";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
    ConnectBalances,
    ConnectComponentsProvider,
    ConnectNotificationBanner,
    ConnectPayments
} from "@stripe/react-connect-js";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import DashboardGrid, { DashboardGridItem } from "./grid";

export function StripeDashboard({ userId }: { userId: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [supporterCount, setSupporterCount] = useState<number>(0);

    useEffect(() => {
        const initializeStripe = async () => {
            try {
                const clientSecret = await getStripeAccountSession(userId);
                const instance = loadConnectAndInitialize({
                    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!,
                    fetchClientSecret: async () => clientSecret,
                    appearance: {
                        variables: {
                            colorText: "#FFF",
                            colorBorder: "#1C1C1C",
                            colorBackground: "#0F0F0F",
                            colorSecondaryText: "#838384",
                            colorDanger: "#973131"
                        }
                    }
                });
                setStripeConnectInstance(instance);
                const supporterCount = await getSupporterCount(userId);
                setSupporterCount(supporterCount);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to initialize Stripe");
            }
        };

        initializeStripe();
    }, [userId]);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!stripeConnectInstance) {
        return (
            <>
                <Skeleton className="mt-4 h-24 w-full" />
                <Skeleton className="mt-4 h-24 w-full" />
            </>
        );
    }

    return (
        <>
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                <ConnectNotificationBanner />
            </ConnectComponentsProvider>
            <DashboardGrid>
                <DashboardGridItem className="col-span-4 -mt-1 md:col-span-2">
                    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                        <ConnectBalances />
                    </ConnectComponentsProvider>
                </DashboardGridItem>
                <DashboardGridItem className="col-span-4 -mt-1 md:col-span-2">
                    <div className="flex w-full flex-col items-start justify-start gap-2">
                        <div className="flex flex-col items-start justify-start gap-1">
                            <h3 className="text-lg font-bold">Supporters</h3>
                            <p className="text-sm font-normal text-foreground/60">
                                Unique number of people who have supported you
                            </p>
                        </div>
                        <h1 className="text-4xl font-bold">{supporterCount}</h1>
                    </div>
                </DashboardGridItem>
                <DashboardGridItem className="col-span-4">
                    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                        <ConnectPayments />
                    </ConnectComponentsProvider>
                </DashboardGridItem>
                <DashboardGridItem className="col-span-4">
                    <Button
                        className="w-full"
                        onClick={async () => {
                            const link = await getStripeDashboardLink(userId);
                            if (link) {
                                window.open(link, "_blank");
                            }
                        }}
                    >
                        <OpenInNewWindowIcon />
                        View more in your Stripe dashboard
                    </Button>
                </DashboardGridItem>
            </DashboardGrid>
        </>
    );
}
