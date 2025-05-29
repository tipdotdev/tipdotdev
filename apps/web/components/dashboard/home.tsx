"use client";

import { getRecentTransactions } from "@/actions/user";
import { CopyIcon } from "lucide-react";
import ms from "ms";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WelcomeBack({ profile, user }: { profile: any; user: any }) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center justify-start gap-3">
                <Avatar className="hidden md:flex">
                    <AvatarFallback>{profile.username}</AvatarFallback>
                    <AvatarImage
                        src={profile.avatarUrl}
                        alt={profile.username + "'s profile picture on tip.dev"}
                    />
                </Avatar>
                <div className="flex flex-col items-start justify-center">
                    <p className="text-xl font-bold">Welcome back, {profile.username}</p>
                    <div
                        className="flex items-center justify-start gap-1 text-foreground/40"
                        onClick={() => copyToClipboard(`tip.dev/${profile.username}`)}
                    >
                        <p className="text-mono text-sm">tip.dev/{profile.username}</p>
                        <CopyIcon className="size-3 cursor-pointer transition-colors hover:text-foreground" />
                    </div>
                </div>
            </div>
            <div className="text-mono flex flex-col items-end justify-center gap-1 text-end text-xs text-foreground/60">
                <p>
                    Joined{" "}
                    {ms(
                        Date.now() -
                            new Date((new Date(user.createdAt).getTime() / 1000) * 1000).getTime(),
                        {
                            long: true
                        }
                    )}{" "}
                    ago
                </p>
                <p>
                    Updated{" "}
                    {ms(
                        Date.now() -
                            new Date((new Date(user.updatedAt).getTime() / 1000) * 1000).getTime(),
                        {
                            long: true
                        }
                    )}{" "}
                    ago
                </p>
            </div>
        </div>
    );
}

export function RecentTransactions({ userId }: { userId: string }) {
    const [transactions, setTransactions] = useState<
        Array<{
            id: number;
            fromUserEmail: string | null;
            amount: number;
            createdAt: string;
        }>
    >([]);

    useEffect(() => {
        getRecentTransactions(userId).then((data) => {
            setTransactions(
                data.map((transaction) => ({
                    ...transaction,
                    createdAt: new Date(transaction.createdAt).toLocaleString()
                }))
            );
        });
    }, [userId]);

    return (
        <div className="flex w-full flex-col items-start justify-start gap-2">
            <h3 className="text-lg font-bold">Recent Transactions</h3>
            <div className="mt-4 flex w-full flex-col gap-2">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex w-full flex-row items-center justify-between"
                    >
                        <p className="text-sm font-bold">{transaction.fromUserEmail}</p>
                        <p className="text-sm text-foreground/60">${transaction.amount / 100}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
