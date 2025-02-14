"use client";

import { signInWithGitHubAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import GitHubLogo from "@/public/images/svg/github.svg";
import { useState } from "react";
import { toast } from "sonner";

export default function AuthButtons() {
    const [loading, setLoading] = useState<boolean>(false);

    const ghbtnclick = () => {
        setLoading(true);
        signInWithGitHubAction().then((data) => {
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
            <Button className="w-full" onClick={ghbtnclick} disabled={loading}>
                <GitHubLogo className="h-full w-full fill-black" />
                Continue with GitHub
            </Button>
            {/* <Button className="w-full" variant="outline">
                <GoogleLogo className="size-12" />
                Continue with Google
            </Button> */}
        </div>
    );
}
