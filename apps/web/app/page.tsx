"use client";

import { TUIBadge } from "@/components/tui/tui-badge";
import TUINavbar from "@/components/tui/tui-navbar";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col font-mono font-normal">
            <TUINavbar active="home" />
            {/* Full-height Hero Section */}
            <section className="relative flex h-screen flex-col items-center justify-center px-12 py-8">
                <div className="flex max-w-md flex-col gap-2">
                    <p className="text-sm text-[#AAA]">tip.dev</p>
                    <h1 className="text-xl text-[#fff]">Make money doing what you love</h1>
                    <span className="mt-4 text-sm">
                        tip.dev ({"{$}"}) is a platform for{" "}
                        <span className="font-extrabold text-[#fff] underline">developers</span> to
                        get paid by fans of their work. Embed a link anywhere and get paid from
                        almost everywhere.
                    </span>
                </div>

                <div className="mt-8 flex w-full max-w-md items-start gap-2">
                    {/* <ASCIIButton text="Get Started" onClick={() => console.log("Clicked")} /> */}
                    <TUIBadge text="Coming Soon" />
                </div>
            </section>
        </div>
    );
}
