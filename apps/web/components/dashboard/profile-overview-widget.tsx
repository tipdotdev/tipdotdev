"use client";

import { ExternalLinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProfileOverviewWidget({ profile }: { profile: any }) {
    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Profile Overview</h2>
            </div>

            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                <div className="flex flex-col items-center gap-2">
                    <Avatar className="size-20">
                        <AvatarFallback className="text-lg">
                            {profile.username?.charAt(0)}
                        </AvatarFallback>
                        <AvatarImage
                            src={profile.avatarUrl}
                            alt={profile.username + "'s profile picture"}
                        />
                    </Avatar>
                    <Button variant="ghost" size="sm" className="text-xs">
                        Change Avatar
                    </Button>
                </div>

                <div className="flex-1 space-y-3 text-center md:text-left">
                    <div>
                        <h3 className="text-xl font-bold">
                            {profile.displayName || profile.username}
                        </h3>
                        <p className="text-sm text-foreground/60">@{profile.username}</p>
                    </div>

                    <p className="text-sm text-foreground/80">
                        {profile.bio || "No bio added yet. Tell people about yourself!"}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                            >
                                <ExternalLinkIcon className="size-3" />
                                {profile.website.replace(/^https?:\/\//, "")}
                            </a>
                        )}
                        {profile.location && (
                            <span className="text-xs text-foreground/60">
                                📍 {profile.location}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
