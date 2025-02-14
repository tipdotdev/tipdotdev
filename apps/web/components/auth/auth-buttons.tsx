"use client";

import { signInWithOAuth } from "@/app/actions";
import { Button } from "@/components/ui/button";
import GitHubLogo from "@/public/images/svg/github.svg";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function AuthButtons() {
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = (provider: "google" | "github") => {
        setLoading(true);
        signInWithOAuth(provider).then((data) => {
            if (data) {
                window.location.href = data.url;
            } else {
                toast.error("Error signing in with GitHub");
            }
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
                <Image src="/images/svg/google.svg" alt="Google Logo" width={14} height={14} />
                Continue with Google
            </Button>
        </div>
    );
}
