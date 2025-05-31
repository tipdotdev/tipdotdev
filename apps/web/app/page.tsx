"use client";

import TUINavbar from "@/components/tui/tui-navbar";
import WaitlistForm from "@/components/waitlist-form";
import { useState } from "react";

export default function Home() {
    const [formFocused, setFormFocused] = useState(false);
    return (
        <div className="flex min-h-screen flex-col font-mono font-normal">
            <TUINavbar active="home" disableKeyboardNavigation={formFocused} />
            {/* Full-height Hero Section */}
            <section className="relative flex h-screen flex-col items-center justify-center px-4 py-8">
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

                <div className="mt-8 w-full max-w-md border-t border-dashed border-border" />

                <div className="mt-8 flex w-full max-w-md flex-col items-start gap-2">
                    {/* <TUIBadge text="Coming Soon" /> */}
                    <WaitlistForm setFormFocused={setFormFocused} />
                </div>
            </section>
        </div>
    );
}
