/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getStripeDashboardLink } from "@/actions/stripe";
import { getRecentTransactions } from "@/actions/user";
import { transaction } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { ChevronLeft, ChevronRight, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function RecentTransactionsWidget({ userId }: { userId: string }) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [transactions, setTransactions] = useState<InferSelectModel<typeof transaction>[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedTransaction, setSelectedTransaction] = useState<InferSelectModel<
        typeof transaction
    > | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const transactionsPerPage = 10;

    useEffect(() => {
        setIsLoading(true);
        const fetchTransactions = async () => {
            const transactions = await getRecentTransactions(userId, "All-time");
            setTransactions(transactions);
            setIsLoading(false);
        };
        fetchTransactions();
    }, [userId]);

    // Calculate pagination
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    const currentTransactions = transactions.slice(startIndex, endIndex);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    };

    const formatDateLong = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }).format(date);
    };

    const formatAmount = (amount: number) => {
        return `$${(amount / 100).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleRowClick = (transactionData: InferSelectModel<typeof transaction>) => {
        setSelectedTransaction(transactionData);
        setIsModalOpen(true);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <>
            <div className="flex w-full flex-row items-start justify-between">
                <h3 className="text-lg font-bold">Recent Transactions</h3>
            </div>

            <div className="mt-4">
                {isLoading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow className="font-mono">
                                    <TableHead>From</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Net</TableHead>
                                    <TableHead>Gross</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center text-muted-foreground"
                                        >
                                            No transactions found :(
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentTransactions.map((transaction) => (
                                        <TableRow
                                            key={transaction.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleRowClick(transaction)}
                                        >
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {transaction.fromUserEmail || "Anonymous"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        transaction.type === "tip"
                                                            ? "bg-green-400 text-black"
                                                            : "bg-blue-400 text-black"
                                                    }`}
                                                >
                                                    {transaction.type === "tip"
                                                        ? "Tip"
                                                        : "Subscription"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-bold">
                                                {formatAmount(transaction.netAmount)}{" "}
                                                <span className="text-xs font-normal text-muted-foreground">
                                                    USD
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-normal">
                                                {formatAmount(transaction.amount)}{" "}
                                                <span className="text-xs font-normal text-muted-foreground">
                                                    USD
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">
                                                    {transaction.message || "—"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatDate(transaction.createdAt)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {transactions.length > transactionsPerPage && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1} to{" "}
                                    {Math.min(endIndex, transactions.length)} of{" "}
                                    {transactions.length} transactions
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-sm font-medium">{currentPage}</span>
                                        <span className="text-sm text-muted-foreground">of</span>
                                        <span className="text-sm font-medium">{totalPages}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Transaction Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                {selectedTransaction ? (
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex flex-col items-start justify-center">
                                <div className="flex flex-row items-center gap-2">
                                    <Badge
                                        className={`mb-4 ${
                                            selectedTransaction.type === "tip"
                                                ? "bg-green-400 text-black hover:bg-green-400"
                                                : "bg-blue-400 text-black hover:bg-blue-400"
                                        }`}
                                    >
                                        {selectedTransaction.type === "tip"
                                            ? "Tip"
                                            : "Subscription"}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={`mb-4 ${
                                            selectedTransaction.isCompleted
                                                ? "border border-green-400 bg-green-400/10 text-green-400"
                                                : "border border-yellow-400 bg-yellow-400/10 text-yellow-400"
                                        }`}
                                    >
                                        {selectedTransaction.isCompleted ? "Completed" : "Pending"}
                                    </Badge>
                                </div>
                                <div className="flex w-full flex-col items-start gap-2">
                                    <p className="text-3xl font-bold">
                                        {formatAmount(selectedTransaction?.netAmount ?? 0)}{" "}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            USD
                                        </span>
                                    </p>
                                    <p className="text-md font-semibold text-muted-foreground">
                                        {formatAmount(selectedTransaction?.amount ?? 0)}{" "}
                                        <span className="text-sm font-normal">(Before fees)</span>
                                    </p>
                                </div>
                                <p className="mt-2 text-sm font-normal text-muted-foreground">
                                    From {selectedTransaction?.fromUserEmail || "Anonymous"}
                                </p>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* Transaction Info */}
                            <div className="space-y-4">
                                {/* First row - horizontal layout */}
                                <div className="flex flex-row gap-8">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Created
                                        </label>
                                        <p className="text-sm">
                                            {formatDateLong(selectedTransaction.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Last Updated
                                        </label>
                                        <p className="text-sm">
                                            {formatDateLong(selectedTransaction.updatedAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Second row - horizontal layout */}
                                <div className="flex flex-row gap-8">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Transaction ID
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <code className="rounded bg-muted px-2 py-1 text-xs">
                                                #{selectedTransaction.id}
                                            </code>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        selectedTransaction.id.toString()
                                                    )
                                                }
                                                className="h-6 w-6 p-0"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Stripe Payment ID
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <code className="max-w-[150px] truncate rounded bg-muted px-2 py-1 text-xs">
                                                {selectedTransaction.stripeId}
                                            </code>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    copyToClipboard(selectedTransaction.stripeId)
                                                }
                                                className="h-6 w-6 p-0"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fee Breakdown */}
                            <div className="border-t pt-4">
                                <h4 className="mb-4 text-sm font-medium text-muted-foreground">
                                    Fee Breakdown
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Amount
                                        </span>
                                        <span className="text-sm font-medium">
                                            {formatAmount(selectedTransaction.amount)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Processing fee
                                        </span>
                                        <span className="text-sm font-medium">
                                            -
                                            {formatAmount(
                                                selectedTransaction.stripeFee +
                                                    selectedTransaction.applicationFee
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pl-4">
                                        <span className="text-sm text-muted-foreground">
                                            Stripe processing fee
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            -{formatAmount(selectedTransaction.stripeFee)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pl-4">
                                        <span className="text-sm text-muted-foreground">
                                            tip.dev fee (4.5%)
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            -{formatAmount(selectedTransaction.applicationFee)}
                                        </span>
                                    </div>

                                    <div className="mt-3 border-t pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-medium">Net</span>
                                            <span className="text-lg font-bold">
                                                {formatAmount(selectedTransaction.netAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message Section */}
                            {selectedTransaction.message && (
                                <div className="border-t pt-4">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Message
                                    </label>
                                    <div className="mt-2 rounded-lg bg-muted p-3">
                                        <p className="text-sm">{selectedTransaction.message}</p>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-2 border-t pt-4">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Close
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <Link href="mailto:support@tip.dev" target="_blank">
                                        Contact Support
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        const url = await getStripeDashboardLink(userId);
                                        window.open(url, "_blank");
                                    }}
                                    className="gap-2"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    View in Stripe
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                ) : (
                    <DialogContent>
                        <Skeleton className="h-full w-full" />
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}
