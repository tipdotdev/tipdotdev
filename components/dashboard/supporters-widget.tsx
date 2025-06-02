"use client";

import { getPreviousPeriodTransactions, getRecentTransactions } from "@/actions/user";
import { transaction } from "@/db/schema";
import { formatNumberShort } from "@/utils/number";
import { InferSelectModel } from "drizzle-orm";
import { SquareIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import PercentChange from "./percent-change";

interface SupportersWidgetProps {
    userId: string;
    initialTransactions?: InferSelectModel<typeof transaction>[];
    initialPreviousTransactions?: InferSelectModel<typeof transaction>[];
}

export default function SupportersWidget({
    userId,
    initialTransactions = [],
    initialPreviousTransactions = []
}: SupportersWidgetProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [transactions, setTransactions] =
        useState<InferSelectModel<typeof transaction>[]>(initialTransactions);
    const [previousTransactions, setPreviousTransactions] = useState<
        InferSelectModel<typeof transaction>[]
    >(initialPreviousTransactions);
    const [timePeriod, setTimePeriod] = useState<
        | "All-time"
        | "Today"
        | "Past-7-days"
        | "Past-30-days"
        | "Past-90-days"
        | "Past-180-days"
        | "Past-365-days"
    >("Today");
    const [percentChange, setPercentChange] = useState<number>(0);
    const [percentChangePositive, setPercentChangePositive] = useState<boolean>(true);
    const [totalSupporters, setTotalSupporters] = useState<number>(0);
    const [supportersFromTips, setSupportersFromTips] = useState<number>(0);
    const [supportersFromSubs, setSupportersFromSubs] = useState<number>(0);

    useEffect(() => {
        // Only fetch new data if the time period has changed from "Today"
        if (timePeriod === "Today") {
            // Use initial data
            setTransactions(initialTransactions);
            setPreviousTransactions(initialPreviousTransactions);
            return;
        }

        setIsLoading(true);
        const fetchTransactions = async () => {
            const [currentTransactions, prevTransactions] = await Promise.all([
                getRecentTransactions(userId, timePeriod),
                getPreviousPeriodTransactions(userId, timePeriod)
            ]);
            setTransactions(currentTransactions);
            setPreviousTransactions(prevTransactions);
            setIsLoading(false);
        };
        fetchTransactions();
    }, [userId, timePeriod, initialTransactions, initialPreviousTransactions]);

    useEffect(() => {
        // Count unique supporters by email
        const uniqueEmails = new Set(transactions.map((t) => t.fromUserEmail));
        const totalSupporters = uniqueEmails.size;

        // Count unique supporters from tips
        const tipEmails = new Set(
            transactions.filter((t) => t.type === "tip").map((t) => t.fromUserEmail)
        );
        const supportersFromTips = tipEmails.size;

        // Count unique supporters from subs (we don't have subs yet)
        const supportersFromSubs = 0;

        setTotalSupporters(totalSupporters);
        setSupportersFromTips(supportersFromTips);
        setSupportersFromSubs(supportersFromSubs);
    }, [transactions, timePeriod]);

    useEffect(() => {
        // Count unique supporters for percent change calculation
        const currentUniqueEmails = new Set(transactions.map((t) => t.fromUserEmail));
        const previousUniqueEmails = new Set(previousTransactions.map((t) => t.fromUserEmail));

        const currentTotal = currentUniqueEmails.size;
        const previousTotal = previousUniqueEmails.size;

        if (previousTotal === 0) {
            if (currentTotal > 0) {
                setPercentChange(100);
                setPercentChangePositive(true);
            } else {
                setPercentChange(0);
                setPercentChangePositive(true);
            }
        } else {
            const change = ((currentTotal - previousTotal) / previousTotal) * 100;
            setPercentChange(Math.round(Math.abs(change)));
            setPercentChangePositive(change >= 0);
        }
    }, [transactions, previousTransactions]);

    return (
        <>
            <div className="flex w-full flex-row items-start justify-between">
                <h3 className="text-lg font-bold">Supporters</h3>
                <Select
                    value={timePeriod}
                    onValueChange={(value) => setTimePeriod(value as typeof timePeriod)}
                >
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder={timePeriod} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Today">Today</SelectItem>
                        <SelectItem value="Past-7-days">Past 7 Days</SelectItem>
                        <SelectItem value="Past-30-days">Past 30 Days</SelectItem>
                        <SelectItem value="Past-90-days">Past 90 Days</SelectItem>
                        <SelectItem value="Past-180-days">Past 180 Days</SelectItem>
                        <SelectItem value="Past-365-days">Past 365 Days</SelectItem>
                        <SelectItem value="All-time">All-time</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="mt-2 flex items-center justify-start gap-4">
                {isLoading ? (
                    <Skeleton className="h-10 w-36" />
                ) : (
                    <p className="text-4xl font-extrabold">
                        {totalSupporters.toLocaleString("en-US")}
                    </p>
                )}
                <PercentChange value={percentChange} positive={percentChangePositive} showText />
            </div>

            <div className="mt-4 flex w-full flex-row items-center gap-4">
                <div className="flex flex-row items-center justify-center gap-1">
                    <SquareIcon className="size-3 fill-green-400 text-green-400" />
                    {isLoading ? (
                        <Skeleton className="h-4 w-16" />
                    ) : (
                        <p className="font-mono text-xs text-foreground/60">
                            {formatNumberShort(supportersFromTips)} Tips
                        </p>
                    )}
                </div>
                <div className="flex flex-row items-center justify-center gap-1">
                    <SquareIcon className="size-3 fill-blue-400 text-blue-400" />
                    {isLoading ? (
                        <Skeleton className="h-4 w-16" />
                    ) : (
                        <p className="font-mono text-xs text-foreground/60">
                            {formatNumberShort(supportersFromSubs)} Subs
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
