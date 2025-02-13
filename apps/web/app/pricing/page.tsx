import TUINavbar from "@/components/tui/tui-navbar";
import { cn } from "@/lib/utils";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center font-mono font-normal">
            <TUINavbar active="pricing" />
            <section className="relative mt-12 flex w-full max-w-4xl flex-col items-center justify-center px-4 py-8">
                <div className="flex w-full flex-col gap-2">
                    <h1 className="text-xl text-[#fff]">tip.dev is free, for everyone, forever.</h1>
                    <p className="mt-2 text-sm">
                        We believe in empowering developers without barriers. That’s why our
                        platform is completely free to use—no subscriptions, no hidden fees, and no
                        gimmicks. Whether you’re just starting out or scaling your projects, tip.dev
                        gives you the tools to connect with your supporters effortlessly.
                    </p>
                    <p className="mt-2 text-sm">
                        We take a{" "}
                        <span className="font-extrabold text-[#fff] underline">4.5% fee</span> on
                        each transaction to cover development costs and keep the lights on. We only
                        make money when you do. This ensures that we are focused on building the
                        best platform possible, and not on making cheap money-grab features.
                    </p>
                </div>

                <div className="my-16 h-0 w-full border-t border-dashed border-[#AAA]/40" />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <FeatureCard
                        className="md:col-span-2"
                        title="Flat 4.5% Fee"
                        description="You never have to guess how much you’ll make. We take a flat 4.5% fee on each transaction, so you can focus on creating and connecting."
                    />
                    <FeatureCard
                        title="Instant Payouts"
                        description="Through our payment providers, you get instant access to your tips. No waiting periods, no minimum thresholds. Get paid as soon as you earn."
                    />
                    <FeatureCard
                        title="Analytics"
                        description="Understand your audience and track your earnings with our dashboard. See where your tips are coming from and how much you’re making over time."
                    />
                </div>
            </section>
        </div>
    );
}

function FeatureCard({
    className,
    title,
    description
}: {
    className?: string;
    title: string;
    description: string;
}) {
    return (
        <div
            className={cn(
                className,
                "flex h-full w-full flex-col items-start justify-center border border-dashed border-[#AAA]/40 p-4 text-start"
            )}
        >
            <h3 className="text-lg text-[#fff]">{title}</h3>
            <p className="mt-2 text-sm">{description}</p>
        </div>
    );
}
