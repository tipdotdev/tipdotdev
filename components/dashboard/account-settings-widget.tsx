"use client";

import { user as userSchema } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import GitHubLogo from "@/public/icons/github.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { InferSelectModel } from "drizzle-orm";
import { KeyIcon, LinkIcon, MailIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import posthog from "posthog-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

type Account = {
    provider: string;
    accountId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    scopes: string[];
};

export function AccountSettingsWidget({
    user,
    accounts
}: {
    user: Partial<InferSelectModel<typeof userSchema>>;
    accounts: Account[];
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [connectedAccounts, setConnectedAccounts] = useState(() => {
        const accountsWithStatus = accounts.map((account) => {
            return {
                provider: account.provider,
                id: account.accountId,
                name: account.provider === "github" ? "GitHub" : "Google",
                connected: true
            };
        });

        // if either github or google is not connected, add it to the connectedAccounts array with connected set to false
        if (!accountsWithStatus.some((account) => account.provider === "github")) {
            accountsWithStatus.push({
                provider: "github",
                id: "",
                name: "GitHub",
                connected: false
            });
        }

        if (!accountsWithStatus.some((account) => account.provider === "google")) {
            accountsWithStatus.push({
                provider: "google",
                id: "",
                name: "Google",
                connected: false
            });
        }

        return accountsWithStatus;
    });

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Account Settings</h2>
            </div>

            <div className="space-y-6">
                {/* Email Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <MailIcon className="size-4 text-muted-foreground/60" />
                        <Label className="text-sm font-medium">Email Address</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm">{user?.email}</p>
                        {user?.emailVerified ? (
                            <Badge
                                variant="outline"
                                className="border-green-400 bg-green-400/10 text-green-400"
                            >
                                Verified
                            </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className="border-red-400 bg-red-400/10 text-red-400"
                            >
                                Unverified
                            </Badge>
                        )}
                    </div>
                    {!user?.emailVerified && (
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                            onClick={async () => {
                                setIsLoading(true);
                                const { error } = await authClient.sendVerificationEmail({
                                    email: user.email!,
                                    callbackURL: "/dashboard/settings"
                                });

                                if (error) {
                                    toast.error("Failed to send email verification", {
                                        description: error.message ?? "Unknown error"
                                    });
                                } else {
                                    toast.success("Verification email sent", {
                                        description: "Check your email for a verification link",
                                        duration: 10000
                                    });
                                }
                                setIsLoading(false);
                            }}
                        >
                            Verify Email
                        </Button>
                    )}
                    <p className="text-xs text-foreground/60">
                        Your email address is used for login and notifications. Currently, you
                        cannot change your email address.
                    </p>
                </div>

                <Separator />

                {/* Connected Logins Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <LinkIcon className="size-4 text-muted-foreground/60" />
                        <Label className="text-sm font-medium">Login Methods</Label>
                    </div>
                    <div className="space-y-3">
                        {connectedAccounts.map((account) => {
                            return (
                                <div
                                    key={account.provider}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-8 items-center justify-center rounded bg-muted">
                                            {account.provider === "github" ? (
                                                <GitHubLogo className="size-4 fill-white" />
                                            ) : (
                                                <Image
                                                    src="/icons/google.svg"
                                                    alt="Google Logo"
                                                    width={14}
                                                    height={14}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{account.name}</p>
                                            {account.id && (
                                                <p className="text-xs text-foreground/60">
                                                    ID: {account.id}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {account.connected ? (
                                            <>
                                                <Badge
                                                    variant="outline"
                                                    className="border-green-400 bg-green-400/10 text-green-400"
                                                >
                                                    Connected
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={isLoading}
                                                    onClick={async () => {
                                                        setIsLoading(true);
                                                        const { error } =
                                                            await authClient.unlinkAccount({
                                                                providerId: account.provider,
                                                                accountId: account.id
                                                            });

                                                        if (error) {
                                                            posthog.capture(
                                                                "error.dashboard.account.disconnected",
                                                                {
                                                                    profileId: user.id,
                                                                    provider: account.provider,
                                                                    error: error.message
                                                                }
                                                            );
                                                            toast.error(
                                                                "Failed to disconnect account",
                                                                {
                                                                    description:
                                                                        error.message ??
                                                                        "Unknown error"
                                                                }
                                                            );
                                                        } else {
                                                            posthog.capture(
                                                                "dashboard.account.disconnected",
                                                                {
                                                                    profileId: user.id,
                                                                    provider: account.provider
                                                                }
                                                            );
                                                            toast.success("Account disconnected");
                                                            setConnectedAccounts((prev) =>
                                                                prev.map((acc) =>
                                                                    acc.provider ===
                                                                    account.provider
                                                                        ? {
                                                                              ...acc,
                                                                              connected: false,
                                                                              id: ""
                                                                          }
                                                                        : acc
                                                                )
                                                            );
                                                        }
                                                        setIsLoading(false);
                                                    }}
                                                >
                                                    Disconnect
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={isLoading}
                                                onClick={async () => {
                                                    setIsLoading(true);
                                                    const { error } = await authClient.linkSocial({
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        provider: account.provider as any,
                                                        callbackURL: "/dashboard/settings"
                                                    });

                                                    if (error) {
                                                        posthog.capture(
                                                            "error.dashboard.account.connected",
                                                            {
                                                                profileId: user.id,
                                                                provider: account.provider,
                                                                error: error.message
                                                            }
                                                        );
                                                        toast.error("Failed to connect account", {
                                                            description:
                                                                error.message ?? "Unknown error"
                                                        });
                                                    } else {
                                                        posthog.capture(
                                                            "dashboard.account.connected",
                                                            {
                                                                profileId: user.id,
                                                                provider: account.provider
                                                            }
                                                        );
                                                        toast.success("Account connected");
                                                        setConnectedAccounts((prev) =>
                                                            prev.map((acc) =>
                                                                acc.provider === account.provider
                                                                    ? { ...acc, connected: true }
                                                                    : acc
                                                            )
                                                        );
                                                    }
                                                    setIsLoading(false);
                                                }}
                                            >
                                                Connect
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Magic Link Section */}
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded bg-muted">
                                    <KeyIcon className="size-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Magic Link</p>
                                    <p className="text-xs text-foreground/60">
                                        Login with email verification
                                    </p>
                                </div>
                            </div>
                            {user.emailVerified ? (
                                <Badge
                                    variant="outline"
                                    className="border-blue-400 bg-blue-400/10 text-blue-400"
                                >
                                    Available
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="border-red-400 bg-red-400/10 text-red-400"
                                >
                                    Not Available
                                </Badge>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-foreground/60">
                        Manage your login methods. You need at least one connected account or magic
                        link to access your account.
                    </p>
                </div>

                <Separator />

                {/* Danger Zone */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <TrashIcon className="size-4 text-red-500" />
                        <Label className="text-sm font-medium text-red-500">Danger Zone</Label>
                    </div>
                    <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-100">Delete Account</p>
                                <p className="text-xs text-red-300/80">
                                    Permanently delete your account and all associated data.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="border-red-600 bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                    posthog.capture("dashboard.account.delete_account_clicked", {
                                        profileId: user.id
                                    });
                                    setIsDeleteModalOpen(true);
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            <DeleteAccountModal
                username={user.email || ""}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}

const deleteAccountSchema = z.object({
    confirmationText: z.string().min(1, "Please enter the confirmation text")
});

function DeleteAccountModal({
    username,
    isOpen,
    onClose
}: {
    username: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const form = useForm<z.infer<typeof deleteAccountSchema>>({
        resolver: zodResolver(deleteAccountSchema),
        defaultValues: {
            confirmationText: ""
        }
    });

    const confirmationText = `delete ${username}`;
    const isValid = form.watch("confirmationText") === confirmationText;

    async function onSubmit(values: z.infer<typeof deleteAccountSchema>) {
        if (values.confirmationText !== confirmationText) {
            form.setError("confirmationText", {
                message: `Please type "delete ${username}" exactly as shown`
            });
            return;
        }

        setIsDeleting(true);

        const { error } = await authClient.deleteUser({
            callbackURL: "/goodbye"
        });

        if (error) {
            toast.error("Failed to delete account", {
                description: error.message ?? "Unknown error"
            });
        }

        setEmailSent(true);
        setIsDeleting(false);
    }

    const handleClose = () => {
        form.reset();
        setEmailSent(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                {!emailSent ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-500">
                                <TrashIcon className="size-5" />
                                Delete Account
                            </DialogTitle>
                            <DialogDescription className="mt-4 gap-8 text-left">
                                <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                                    <p className="text-sm font-medium text-red-100">
                                        ⚠️ This action is irreversible
                                    </p>
                                    <p className="text-sm text-red-300/80">
                                        This will permanently delete your account and all associated
                                        data. You will not be able to recover this information.
                                    </p>
                                </div>

                                <div className="mt-4 gap-2">
                                    <p className="text-sm text-foreground">
                                        The following data will be permanently deleted:
                                    </p>
                                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                        <li>• Your profile and account information</li>
                                        <li>• All connected social accounts</li>
                                        <li>• Transaction history and earnings</li>
                                        <li>• Settings and preferences</li>
                                    </ul>
                                </div>
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="confirmationText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Type{" "}
                                                <code className="rounded bg-muted px-1 py-0.5 text-red-500">
                                                    delete {username}
                                                </code>{" "}
                                                to continue
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={`Type "delete ${username}" here`}
                                                    className="font-mono text-sm"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        className="flex-1"
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        className="flex-1"
                                        disabled={!isValid || isDeleting}
                                    >
                                        {isDeleting
                                            ? "Sending Email..."
                                            : "Send Confirmation Email"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-blue-500">
                                <MailIcon className="size-5" />
                                Confirmation Email Sent
                            </DialogTitle>
                            <DialogDescription className="mt-4 gap-8 text-left">
                                <div className="mt-4 rounded-lg border border-blue-500/50 bg-blue-500/10 p-3">
                                    <p className="text-sm font-medium text-blue-100">
                                        📧 Check your email
                                    </p>
                                    <p className="text-sm text-blue-300/80">
                                        We&apos;ve sent a confirmation email to{" "}
                                        <strong>{username}</strong>
                                    </p>
                                </div>

                                <div className="mt-4 gap-2">
                                    <p className="text-sm text-foreground">
                                        To complete the account deletion:
                                    </p>
                                    <ol className="space-y-1 text-sm text-muted-foreground">
                                        <li>1. Check your email inbox</li>
                                        <li>2. Click the confirmation link</li>
                                        <li>3. Your account will be permanently deleted</li>
                                    </ol>
                                </div>

                                <div className="mt-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3">
                                    <p className="text-xs text-yellow-200/80">
                                        The confirmation link will expire in 1 hour. If you change
                                        your mind, simply ignore the email and your account will
                                        remain active.
                                    </p>
                                </div>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="pt-2">
                            <Button variant="outline" onClick={handleClose} className="w-full">
                                Close
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
