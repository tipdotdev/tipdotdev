"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TUINavbar({
    active,
    disableKeyboardNavigation
}: {
    active: undefined | "home" | "about" | "pricing" | "sign-in";
    disableKeyboardNavigation?: boolean;
}) {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const keyToLinkMap: { [key: string]: string } = {
                "0": "/",
                "1": "/about",
                "2": "/pricing",
                "3": "/auth/sign-in"
            };

            if (keyToLinkMap[e.key] !== undefined) {
                // Navigate to the corresponding route when the key is pressed
                router.push(keyToLinkMap[e.key]);
            }
        };

        if (!disableKeyboardNavigation) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            if (!disableKeyboardNavigation) {
                window.removeEventListener("keydown", handleKeyDown);
            }
        };
    }, [router, disableKeyboardNavigation]);

    return (
        <nav className="absolute top-0 z-50 flex w-full items-center justify-between px-4 py-2 font-mono">
            <div className="flex w-1/3 flex-row items-center gap-2">
                <AnimatedLogo />
            </div>
            <div className="flex w-1/3 flex-row items-center justify-center gap-2">
                <TUILink href="/" text="[0] home" isActive={active === "home"} />
                <TUILink href="/about" text="[1] about" isActive={active === "about"} />
                <TUILink href="/pricing" text="[2] pricing" isActive={active === "pricing"} />
            </div>
            {/* <TUILink href="/auth/sign-in" text="[3] sign in" isActive={active === "sign-in"} /> */}
            <div className="w-1/3" />
        </nav>
    );
}

function TUILink({
    text,
    href,
    target,
    isActive
}: {
    text: string;
    href: string;
    target?: "_blank" | "_self";
    isActive?: boolean;
}) {
    return (
        <Link
            href={href}
            target={target}
            className={`px-1 py-0 text-sm ${isActive ? "bg-white text-black" : "hover:bg-white/20"}`}
        >
            {text}
        </Link>
    );
}

export function AnimatedLogo({ className }: { className?: string }) {
    return (
        <Link className={cn("group inline-block", className)} href="/">
            <span className="inline-block transform transition-transform duration-300 group-hover:-translate-x-1">
                {"{"}
            </span>
            <span className="inline-block transform transition-transform duration-300 group-hover:rotate-[360deg]">
                {"$"}
            </span>
            <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-1">
                {"}"}
            </span>
        </Link>
    );
}
