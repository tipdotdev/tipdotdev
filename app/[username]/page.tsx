import { getProfile } from "@/actions/profile";
import { getRecentTransactions } from "@/actions/user";
import { SmallFooter } from "@/components/footer";
import { NumberTicker } from "@/components/magicui/number-ticker";
import PaymentCard from "@/components/profile/payment-card";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileNav from "@/components/profile/profile-nav";
import { Separator } from "@/components/ui/separator";
import { profile as profileSchema, transaction as transactionSchema } from "@/db/schema";
import { cn } from "@/lib/utils";
import GitHubLogo from "@/public/icons/github.svg";
import InstagramLogo from "@/public/icons/instagram.svg";
import TwitterLogo from "@/public/icons/twitter.svg";
import { auth } from "@/utils/auth";
import { formatNumberShort } from "@/utils/number";
import { DollarSign, Heart, Users } from "lucide-react";
import ms from "ms";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

type Transaction = typeof transactionSchema.$inferSelect;

type Props = {
    params: Promise<{ username: string }>;
};

export default async function Page({ params }: Props) {
    const username = (await params).username;
    const profile = await getProfile(username);
    const authData = await auth.api.getSession({
        headers: await headers()
    });
    const sn = authData?.session !== undefined;
    const transactions = await getRecentTransactions(profile?.userId || "", "Past-30-days");

    // If the profile doesn't exist, show a 404 page
    if (!profile) notFound();

    const tipsThisMonth = transactions.filter((t) => t.type === "tip").length;
    const supportersThisMonth = new Set(
        transactions
            .filter((t) => t.type === "tip")
            .map((t) => t.fromUserEmail)
            .filter(Boolean)
    ).size;
    const earnedThisMonth =
        transactions.filter((t) => t.type === "tip").reduce((acc, t) => acc + t.amount, 0) / 100;
    const earnedThisMonthFormatted = formatNumberShort(earnedThisMonth);

    return (
        <div className="min-h-screen">
            <ProfileNav username={profile.username} />

            <div className="mx-auto max-w-7xl px-4 py-8 pb-24">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column - Profile Info */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <ProfileHeader profile={profile} />
                        <Separator />

                        {/* Bio */}
                        <ProfileCard title="about.md">
                            <p className="leading-relaxed text-foreground/60">
                                {profile.bio || "No bio yet..."}
                            </p>
                        </ProfileCard>

                        <ProfileCard title="social_links.json">
                            <div className="flex flex-col gap-4">
                                {profile.socialMedia
                                    ? Object.entries(profile.socialMedia).map(([platform, url]) => (
                                          <Social
                                              key={platform}
                                              platform={
                                                  platform as keyof typeof profile.socialMedia
                                              }
                                              url={url!}
                                          />
                                      ))
                                    : null}
                            </div>
                        </ProfileCard>

                        {profile.showTips && (
                            <>
                                {/* Stats */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <StatsCard
                                        Icon={Heart}
                                        title="Tips This Month"
                                        value={tipsThisMonth}
                                        color="red"
                                    />
                                    <StatsCard
                                        Icon={Users}
                                        title="Supporters This Month"
                                        value={supportersThisMonth}
                                        color="blue"
                                    />
                                    <StatsCard
                                        Icon={DollarSign}
                                        title="Earned This Month"
                                        value={Number(earnedThisMonthFormatted.slice(0, -1))}
                                        color="green"
                                        prefix="$"
                                        suffix={
                                            earnedThisMonthFormatted[
                                                earnedThisMonthFormatted.length - 1
                                            ]
                                        }
                                    />
                                </div>

                                {/* Recent Supporters */}
                                <ProfileCard title="recent_supporters.json">
                                    <div className="space-y-4">
                                        {transactions.length === 0 && (
                                            <p className="text-sm text-foreground/60">
                                                No recent supporters
                                            </p>
                                        )}
                                        {transactions.slice(0, 5).map((transaction) => (
                                            <RecentTransaction
                                                key={transaction.id}
                                                transaction={transaction}
                                            />
                                        ))}
                                    </div>
                                </ProfileCard>
                            </>
                        )}
                    </div>

                    {/* Right Column - Tip Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-16">
                            <PaymentCard
                                username={profile.username}
                                stripeAcctID={profile.stripeAcctID || ""}
                                isSignedIn={sn}
                                user={authData?.user}
                                disabled={!profile.stripeAcctID || !profile.allowTips}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <SmallFooter />
        </div>
    );
}

function ProfileCard({
    title,
    children,
    className
}: {
    title?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex flex-col rounded-lg border border-sidebar-border bg-sidebar p-6",
                className
            )}
        >
            {title && (
                <h2 className="mb-4 font-mono text-xl font-semibold">
                    <span className="text-foreground/60">{">"}</span> {title}
                </h2>
            )}
            {children}
        </div>
    );
}

function Social({
    platform,
    url
}: {
    platform: keyof typeof profileSchema.socialMedia;
    url: string;
}) {
    const className = "size-5";
    return (
        <Link
            href={url}
            target="_blank"
            className="flex w-fit items-center gap-2 fill-foreground/40 text-foreground/60 transition-all hover:fill-foreground hover:text-foreground"
        >
            {platform === ("twitter" as string) && <TwitterLogo className={className} />}
            {platform === ("github" as string) && <GitHubLogo className={className} />}
            {platform === ("instagram" as string) && <InstagramLogo className={className} />}
            <span className="text-sm">@{url.replace("https://", "").split("/")[1]}</span>
        </Link>
    );
}

function StatsCard({
    Icon,
    title,
    value,
    color,
    prefix,
    suffix
}: {
    Icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: number;
    color: string;
    prefix?: string;
    suffix?: string;
}) {
    return (
        <ProfileCard>
            <div className="flex flex-col items-center justify-center">
                <Icon className={`mb-2 h-5 w-5 text-${color}-400`} />
                {/* <div className="text-2xl font-bold">{value}</div> */}
                <span className="text-2xl font-bold">
                    {prefix}
                    <NumberTicker
                        value={value}
                        className="text-2xl font-bold text-foreground"
                        decimalPlaces={value.toString().split(".")[1]?.length || 0}
                    />
                    {suffix}
                </span>
                <div className="text-sm text-foreground/60">{title}</div>
            </div>
        </ProfileCard>
    );
}

function RecentTransaction({ transaction }: { transaction: Transaction }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-border">
                    <span className="text-sm font-bold">
                        {transaction.fromUserEmail ? transaction.fromUserEmail[0] : "TD"}
                    </span>
                </div>
                <div>
                    <div className="flex flex-row items-center justify-start gap-1">
                        <p className="font-semibold">Someone ·</p>
                        <p className="text-sm text-foreground/60">
                            {ms(new Date().getTime() - transaction.createdAt.getTime())} ago
                        </p>
                    </div>
                    <p className="text-sm text-foreground/60">
                        {transaction.message || "No message"}
                    </p>
                </div>
            </div>
            <p className="font-semibold text-green-400">
                {(transaction.amount / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD"
                })}
            </p>
        </div>
    );
}
