"use client";

import { authClient } from "@/lib/auth-client";
import type { Session as SessionType } from "better-auth";
import { Calendar, Globe, Monitor, Shield, Smartphone, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";

export function SessionsWidget() {
    const [sessions, setSessions] = useState<SessionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRevoking, setIsRevoking] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const sessions = await authClient.listSessions();
                setSessions(sessions.data ?? []);
            } catch (error) {
                console.error("Failed to fetch sessions:", error);
                toast.error("Failed to load sessions");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const handleRevokeSession = async (sessionId: string) => {
        try {
            await authClient.revokeSession({ token: sessionId });
            setSessions((prev) => prev.filter((session) => session.id !== sessionId));
            toast.success("Session revoked successfully");
        } catch (error) {
            console.error("Failed to revoke session:", error);
            toast.error("Failed to revoke session");
        }
    };

    const handleRevokeOtherSessions = async () => {
        try {
            await authClient.revokeOtherSessions();
            // Refresh sessions list
            const updatedSessions = await authClient.listSessions();
            setSessions(updatedSessions.data ?? []);
            toast.success("Other sessions revoked successfully");
        } catch (error) {
            console.error("Failed to revoke other sessions:", error);
            toast.error("Failed to revoke other sessions");
        }
    };

    if (isLoading) {
        return (
            <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold">Active Sessions</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your active sessions and devices.
                    </p>
                </div>
                <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold">Active Sessions</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your active sessions and devices.
                    </p>
                </div>
                {sessions.length > 1 && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            setIsRevoking(true);
                            handleRevokeOtherSessions();
                        }}
                        disabled={isRevoking}
                    >
                        {isRevoking ? (
                            <Spinner className="size-4" />
                        ) : (
                            <>
                                <Trash2 className="mr-2 size-4" />
                                Revoke Others
                            </>
                        )}
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {sessions.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Shield className="mx-auto mb-4 size-12 text-muted-foreground" />
                            <p className="text-muted-foreground">No active sessions found</p>
                        </CardContent>
                    </Card>
                ) : (
                    sessions.map((session, index) => (
                        <Session
                            key={session.id}
                            session={session}
                            isCurrent={index === 0}
                            onRevoke={handleRevokeSession}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function Session({
    session,
    isCurrent,
    onRevoke
}: {
    session: SessionType;
    isCurrent: boolean;
    onRevoke: (sessionId: string) => void;
}) {
    const [isRevoking, setIsRevoking] = useState(false);

    const getDeviceIcon = (userAgent: string | null | undefined) => {
        if (!userAgent) return <Monitor className="size-4" />;
        if (
            userAgent.includes("Mobile") ||
            userAgent.includes("Android") ||
            userAgent.includes("iPhone")
        ) {
            return <Smartphone className="size-4" />;
        }
        return <Monitor className="size-4" />;
    };

    const getDeviceInfo = (userAgent: string | null | undefined) => {
        if (!userAgent) return "Unknown Browser";
        if (userAgent.includes("Chrome")) return "Chrome";
        if (userAgent.includes("Firefox")) return "Firefox";
        if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
        if (userAgent.includes("Edge")) return "Edge";
        return "Unknown Browser";
    };

    const getPlatform = (userAgent: string | null | undefined) => {
        if (!userAgent) return "Unknown Platform";
        if (userAgent.includes("Windows")) return "Windows";
        if (userAgent.includes("Mac")) return "macOS";
        if (userAgent.includes("Linux")) return "Linux";
        if (userAgent.includes("Android")) return "Android";
        if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
        return "Unknown Platform";
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    };

    return (
        <Card
            className={`transition-colors ${isCurrent ? "border-green-500 bg-green-600/10" : "bg-transparent"}`}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                            {getDeviceIcon(session.userAgent)}
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">
                                    {getDeviceInfo(session.userAgent)} on{" "}
                                    {getPlatform(session.userAgent)}
                                </span>
                                {isCurrent && <Badge>Current</Badge>}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {session.ipAddress && (
                                    <div className="flex items-center gap-1">
                                        <Globe className="size-3" />
                                        <span>{session.ipAddress}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    <span>Expires {formatDate(session.expiresAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isCurrent && (
                        <Button
                            variant={isRevoking ? "outline" : "destructive"}
                            size="icon"
                            onClick={() => {
                                setIsRevoking(true);
                                onRevoke(session.id);
                            }}
                            disabled={isRevoking}
                        >
                            {isRevoking ? (
                                <Spinner className="size-4" />
                            ) : (
                                <Trash2 className="size-4" />
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
