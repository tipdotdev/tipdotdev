"use client";

import { useSession } from "@/lib/auth-client";
import posthog from "posthog-js";
import { useEffect } from "react";

export function PosthogProvider({ children }: { children: React.ReactNode }) {
    // onload, check if user is logged in
    const { data: session } = useSession();
    useEffect(() => {
        if (session?.user) {
            posthog.identify(session.user.id);
        }
    }, [session?.user]);

    return <>{children}</>;
}
