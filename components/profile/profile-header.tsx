import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profile as profileSchema } from "@/db/schema";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Profile = typeof profileSchema.$inferSelect;

export default function ProfileHeader({ profile }: { profile: Profile }) {
    return (
        <div>
            <Banner src={profile.bannerUrl} />

            {/* Profile Header */}
            <div className="-mt-4 flex flex-row items-center">
                <Avatar className="h-36 w-36 border-[6px] border-background">
                    <AvatarImage src={profile.avatarUrl || undefined} />
                    <AvatarFallback className="bg-sidebar text-2xl">
                        {profile.displayName ? profile.displayName[0] : profile.username[0]}
                    </AvatarFallback>
                </Avatar>
                <div className="ml-4 flex flex-col items-start">
                    <h1 className="text-2xl font-bold">
                        {profile.displayName || profile.username}
                    </h1>
                    <p className="font-mono text-sm text-foreground/60">@{profile.username}</p>
                    {profile.website && (
                        <Link
                            className="mt-2 flex items-center text-sm text-foreground/60 underline hover:text-foreground"
                            href={profile.website}
                            target="_blank"
                        >
                            {profile.website.replace("https://", "")}
                            <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export function Banner({ src }: { src: string | null }) {
    return (
        <div className="relative aspect-[4/1] overflow-hidden rounded-lg bg-sidebar">
            {src && <Image src={src} alt="Banner" fill className="h-full w-full object-cover" />}
        </div>
    );
}
