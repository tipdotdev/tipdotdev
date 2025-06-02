"use client";

import Footer from "@/components/footer";
import CTA from "@/components/landing/cta";
import Features from "@/components/landing/features";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Pricing from "@/components/landing/pricing";
import Stats from "@/components/landing/stats";
import Testimonials from "@/components/landing/testimonials";
import TUINavbar from "@/components/tui/tui-navbar";
import { useState } from "react";

export default function LandingPage() {
    const prelaunch = true;
    const [formFocused, setFormFocused] = useState(false);

    return (
        <div className="min-h-screen">
            <TUINavbar active="home" disableKeyboardNavigation={formFocused} />
            <Hero prelaunch={prelaunch} setFormFocused={setFormFocused} />
            <Stats />
            <Features />
            <HowItWorks />
            <Pricing prelaunch={prelaunch} />
            <Testimonials />
            <CTA prelaunch={prelaunch} setFormFocused={setFormFocused} />

            <p className="mb-4 text-center text-sm text-foreground/30">
                As we are still in pre-launch, the stats and testimonials on this page are for
                demonstration purposes only.
            </p>
            <Footer />
        </div>
    );
}
