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

export default function IncomeWidget({ userId }: { userId: string }) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [transactions, setTransactions] = useState<InferSelectModel<typeof transaction>[]>([]);
    const [previousTransactions, setPreviousTransactions] = useState<
        InferSelectModel<typeof transaction>[]
    >([]);
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
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalIncomeFromTips, setTotalIncomeFromTips] = useState<number>(0);
    const [totalIncomeFromSubs, setTotalIncomeFromSubs] = useState<number>(0);

    useEffect(() => {
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
    }, [userId, timePeriod]);

    useEffect(() => {
        const totalIncome = transactions.reduce(
            (acc, transaction) => acc + transaction.netAmount,
            0
        );
        const totalIncomeFromTips = transactions.reduce((acc, transaction) => {
            if (transaction.type === "tip") {
                return acc + transaction.netAmount;
            }
            return acc;
        }, 0);
        const totalIncomeFromSubs = 0; // we dont have a sub system yet

        setTotalIncome(totalIncome);
        setTotalIncomeFromTips(totalIncomeFromTips);
        setTotalIncomeFromSubs(totalIncomeFromSubs);
    }, [transactions, timePeriod]);

    useEffect(() => {
        const currentTotal = transactions.reduce(
            (acc, transaction) => acc + transaction.netAmount,
            0
        );
        const previousTotal = previousTransactions.reduce(
            (acc, transaction) => acc + transaction.netAmount,
            0
        );

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
                <h3 className="text-lg font-bold">Income</h3>
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
                        ${(Number(totalIncome ?? 0) / 100).toLocaleString("en-US")}
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
                            ${formatNumberShort(Number(totalIncomeFromTips ?? 0) / 100)} Tips
                        </p>
                    )}
                </div>
                <div className="flex flex-row items-center justify-center gap-1">
                    <SquareIcon className="size-3 fill-blue-400 text-blue-400" />
                    {isLoading ? (
                        <Skeleton className="h-4 w-16" />
                    ) : (
                        <p className="font-mono text-xs text-foreground/60">
                            ${formatNumberShort(Number(totalIncomeFromSubs ?? 0) / 100)} Subs
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
