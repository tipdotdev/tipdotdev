"use client";

import { CopyIcon } from "lucide-react";
import ms from "ms";
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
                    <AvatarFallback>{profile.username[0]}</AvatarFallback>
                    <AvatarImage
                        src={profile.avatar_url}
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
                            new Date((new Date(user.created_at).getTime() / 1000) * 1000).getTime(),
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
                            new Date((new Date(user.updated_at).getTime() / 1000) * 1000).getTime(),
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
