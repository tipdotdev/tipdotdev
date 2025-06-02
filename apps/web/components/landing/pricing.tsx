import Link from "next/link";
import { MagicCard } from "../magicui/magic-card";
import { Button } from "../ui/button";
import SectionHeading from "./section-heading";

export default function Pricing({ prelaunch }: { prelaunch?: boolean }) {
    return (
        <section id="pricing" className="py-20">
            <div className="mx-auto max-w-3xl px-4">
                <SectionHeading
                    text="pricing --transparent"
                    description="Simple, honest pricing. No hidden fees."
                />
                <MagicCard
                    gradientFrom="#FFFFFF"
                    gradientTo="#000000"
                    className="flex h-full flex-col rounded-lg p-6"
                >
                    <h3 className="mb-4 text-2xl font-bold">Pay Per Tip</h3>
                    <div className="mb-4 text-4xl font-bold">
                        4.5% <span className="text-lg text-foreground/60">+ 3rd party fees</span>
                    </div>
                    <p className="mb-6 text-foreground/60">
                        We only make money when you do. No monthly fees, no setup costs, nothing.
                    </p>
                    <ul className="space-y-2 text-left">
                        <li className="flex items-center">
                            <span className="mr-2 text-green-400">✓</span>
                            Unlimited tips
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2 text-green-400">✓</span>
                            Custom tip page
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2 text-green-400">✓</span>
                            Global payment support
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2 text-green-400">✓</span>
                            Analytics dashboard
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2 text-green-400">✓</span>
                            API access
                        </li>
                    </ul>
                    {!prelaunch && (
                        <Button
                            className="mt-8 w-full rounded-lg bg-white px-8 py-3 font-semibold text-black transition-colors hover:bg-gray-200"
                            asChild
                        >
                            <Link href="/auth/sign-in">Start Earning Now</Link>
                        </Button>
                    )}
                </MagicCard>
            </div>
        </section>
    );
}
