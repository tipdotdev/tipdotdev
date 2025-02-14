"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

interface OAuthData {
    provider: string;
    url: string;
}

export async function signInWithGitHubAction(): Promise<OAuthData | null> {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo: `${origin}/auth/callback`
        }
    });

    if (error) {
        console.error("Error signing in with GitHub:", error);
        return null;
    }

    return data;
}
