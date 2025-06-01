import { getProfile, getSelfProfile } from "@/actions/profile";
import PaymentCard from "@/components/profile/payment-card";
import { ProfileHeader } from "@/components/profile/profile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GitHubLogo from "@/public/icons/github.svg";
import InstagramLogo from "@/public/icons/instagram.svg";
import TwitterLogo from "@/public/icons/twitter.svg";
import { auth } from "@/utils/auth";
import { LinkIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ username: string }>;
};

// Define the social media type based on the schema
type SocialMediaData = {
    twitter?: string | null;
    github?: string | null;
    instagram?: string | null;
};

export default async function Page({ params }: Props) {
    const username = (await params).username;
    const profile = await getProfile(username);
    const authData = await auth.api.getSession({
        headers: await headers()
    });
    const sn = authData?.session !== undefined;
    const user = await getSelfProfile();
    const isOwner = user?.username == username;

    // If the profile doesn't exist, show a 404 page
    if (!profile) notFound();

    return (
        <div className="flex min-h-screen flex-col items-center justify-start font-normal">
            <section className="relative mt-1 flex h-full w-full flex-col items-center justify-start px-4 py-4">
                <div className="flex w-full max-w-full flex-col items-center justify-center gap-2 md:max-w-5xl">
                    <ProfileHeader profile={profile} isOwner={isOwner} isSignedIn={sn} />
                    <Separator className="my-4" />
                    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
                        <AboutCard
                            bio={profile.bio || "We don't know much about this user yet."}
                            website={profile.website || undefined}
                            socials={profile.socialMedia as SocialMediaData}
                        />
                        <PaymentCard
                            username={username}
                            stripeAcctID={profile.stripeAcctID || ""}
                            isSignedIn={sn}
                            disabled={!profile.stripeConnected || !profile.allowTips}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function AboutCard({
    bio,
    website,
    socials
}: {
    bio?: string;
    website?: string;
    socials?: SocialMediaData;
}) {
    // Get the available social media platforms that have URLs
    const availableSocials = socials
        ? Object.entries(socials).filter(([, url]) => url && url.trim() !== "")
        : [];

    return (
        <Card className="h-fit w-full border-border/40 bg-card/40 p-4">
            <CardHeader className="p-0">
                <CardTitle className="text-foreground/60">About</CardTitle>
            </CardHeader>
            <CardContent className="mt-2 p-0">
                {bio && <p className="text-sm">{bio}</p>}
                {website && (
                    <div className="mt-4 flex items-center justify-start gap-1 text-sm">
                        <LinkIcon className="size-4 text-foreground/40" />
                        <Link
                            href={website}
                            target="_blank"
                            className="text-blue-400 transition-all hover:text-blue-600 hover:underline"
                        >
                            {website.split("://")[1]}
                        </Link>
                    </div>
                )}
                {availableSocials.length > 0 && (
                    <div className="mt-4 flex flex-row gap-3">
                        {availableSocials.map(([platform, url]) => (
                            <Social
                                key={platform}
                                platform={platform as keyof SocialMediaData}
                                url={url!}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function Social({ platform, url }: { platform: keyof SocialMediaData; url: string }) {
    return (
        <Link href={url} target="_blank">
            {platform === "twitter" && (
                <TwitterLogo className="size-4 fill-foreground/40 transition-all hover:fill-foreground" />
            )}
            {platform === "github" && (
                <GitHubLogo className="size-4 fill-foreground/40 transition-all hover:fill-foreground" />
            )}
            {platform === "instagram" && (
                <InstagramLogo className="size-4 fill-foreground/40 transition-all hover:fill-foreground" />
            )}
        </Link>
    );
}
