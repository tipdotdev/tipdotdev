"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import GitHubLogo from "@/public/icons/github.svg";
import Image from "next/image";
import { useState } from "react";

export default function AuthButtons() {
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = async (provider: "google" | "github") => {
        setLoading(true);
        await authClient.signIn.social({
            provider,
            callbackURL: "/dashboard"
        });
        setLoading(false);
    };

    return (
        <div className="jsustify-center mt-8 flex w-full flex-col items-center gap-2 font-sans">
            <Button className="w-full" onClick={() => handleClick("github")} disabled={loading}>
                <GitHubLogo className="h-full w-full fill-black" />
                Continue with GitHub
            </Button>
            <Button
                className="w-full"
                variant="outline"
                onClick={() => handleClick("google")}
                disabled={loading}
            >
                <Image src="/icons/google.svg" alt="Google Logo" width={14} height={14} />
                Continue with Google
            </Button>
        </div>
    );
}
