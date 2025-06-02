"use client";

import { profile as profileSchema } from "@/db/schema";
import { ShareIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export function ProfileHeader({
    profile,
    isOwner,
    isSignedIn
}: {
    profile: typeof profileSchema.$inferSelect;
    isOwner: boolean;
    isSignedIn: boolean;
}) {
    return (
        <>
            <Banner src={profile.bannerUrl || ""} alt={profile.username + "'s banner on tip.dev"} />
            <div className="-mt-4 flex w-full flex-col items-start justify-center gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center justify-center gap-4">
                    <Avatar className="h-24 w-24 border-[6px] border-background">
                        <AvatarFallback className="text-2xl">
                            {profile.username[0].toUpperCase()}
                        </AvatarFallback>
                        <AvatarImage
                            src={profile.avatarUrl || ""}
                            alt={profile.username + "'s avatar on tip.dev"}
                        />
                    </Avatar>
                    <div className="flex flex-col items-start justify-center">
                        <p className="font-mono text-2xl">
                            {profile.displayName || profile.username}
                        </p>
                        <p className="text-sm text-foreground/40">tip.dev/{profile.username}</p>
                    </div>
                </div>
                <div className="flex w-full items-center justify-center gap-4 md:w-fit">
                    <Button
                        variant="secondary"
                        size="lg"
                        className="w-full md:w-fit"
                        onClick={() => {
                            console.log("clicked");
                            navigator.clipboard.writeText(`https://tip.dev/${profile.username}`);
                            toast.success("Copied to clipboard");
                        }}
                    >
                        <ShareIcon />
                        Share
                    </Button>
                    {isOwner ? (
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-full md:w-fit"
                            disabled={!isSignedIn}
                            asChild
                        >
                            <Link href="/dashboard/profile">Edit Profile</Link>
                        </Button>
                    ) : (
                        <Button variant="secondary" size="lg" disabled={!isSignedIn}>
                            Follow
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}

function Banner({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="relative aspect-[4/1] w-full overflow-hidden rounded-lg bg-muted">
            {src && <img src={src} alt={alt} className="h-full w-full object-cover" />}
        </div>
    );
}
