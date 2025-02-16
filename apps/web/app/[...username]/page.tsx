import { isSignedIn } from "@/actions/auth";
import { getProfile, getSelfProfile } from "@/actions/profile";
import PaymentCard from "@/components/profile/payment-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GitHubLogo from "@/public/icons/github.svg";
import TwitterLogo from "@/public/icons/twitter.svg";
import { LinkIcon, ShareIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ username: string }>;
};

export default async function MoviePage({ params }: Props) {
    const username = (await params).username;
    const profile = await getProfile(username);
    const sn = await isSignedIn();
    const user = await getSelfProfile();
    const isOwner = user?.username == username;

    // If the profile doesn't exist, show a 404 page
    if (!profile) notFound();

    return (
        <div className="flex min-h-screen flex-col items-center justify-start font-normal">
            <section className="relative mt-1 flex h-full w-full flex-col items-center justify-start px-4 py-4">
                <div className="flex w-full max-w-full flex-col items-center justify-center gap-2 md:max-w-5xl">
                    <Banner
                        src={profile.banner_url}
                        alt={profile.username + "'s banner on tip.dev"}
                    />
                    <div className="-mt-4 flex w-full flex-row items-center justify-between gap-4">
                        <div className="flex items-center justify-center gap-4">
                            <Avatar className="h-24 w-24 border-[6px] border-background">
                                <AvatarFallback className="text-2xl">
                                    {profile.username[0].toUpperCase()}
                                </AvatarFallback>
                                <AvatarImage
                                    src={profile.avatar_url}
                                    alt={profile.username + "'s avatar on tip.dev"}
                                />
                            </Avatar>
                            <div className="flex flex-col items-start justify-center gap-1">
                                <p className="font-mono text-2xl">{username}</p>
                                <ProfileStats supporters={1240} />
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <Button variant="secondary" size="lg">
                                <ShareIcon />
                                Share
                            </Button>
                            <Button variant="secondary" size="lg" disabled={!sn}>
                                {isOwner ? "Edit Profile" : "Follow"}
                            </Button>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid w-full grid-cols-2 gap-2">
                        <AboutCard
                            bio={profile.bio || "We don't know much about this user yet."}
                            website={profile.website}
                            socials={profile.social_media}
                        />
                        <PaymentCard username={username} />
                    </div>
                </div>
            </section>
        </div>
    );
}

function Banner({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="relative h-52 w-full rounded-lg bg-muted">
            {src && (
                <Image src={src} alt={alt} layout="fill" objectFit="cover" className="rounded-lg" />
            )}
        </div>
    );
}

function ProfileStats({ supporters }: { supporters: number }) {
    return (
        <div className="flex items-center justify-center gap-1 font-mono text-sm">
            <p>{supporters}</p>
            <p className="text-foreground/40">Supporters</p>
        </div>
    );
}

type SocialMedia = {
    label: string;
    handle: string;
};

function AboutCard({
    bio,
    website,
    socials
}: {
    bio?: string;
    website?: string;
    socials?: SocialMedia[];
}) {
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
                {socials && socials.length > 0 && (
                    <div className="mt-4 flex flex-row gap-3">
                        {socials.map((social, index) => (
                            <Social key={index} social={social} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function Social({ social }: { social: SocialMedia }) {
    return (
        <Link href={`https://${social.label}.com/${social.handle}`} target="_blank">
            {social.label == "twitter" && (
                <TwitterLogo className="size-4 fill-foreground/40 transition-all hover:fill-foreground" />
            )}
            {social.label == "github" && (
                <GitHubLogo className="size-4 fill-foreground/40 transition-all hover:fill-foreground" />
            )}
        </Link>
    );
}
