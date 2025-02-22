"use server";

import { createServerClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

interface OAuthData {
    provider: string;
    url: string;
}

export async function signInWithOAuth(provider: "google" | "github"): Promise<OAuthData | null> {
    const supabase = await createServerClient();
    const origin = (await headers()).get("origin");

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${origin}/auth/callback`
        }
    });

    if (error) {
        console.error("Error signing in with OAuth", error);
        return null;
    }

    return data;
}

export async function isSignedIn(): Promise<boolean> {
    const supabase = await createServerClient();
    const user = await supabase.auth.getUser();
    return user.data.user !== null;
}

export async function signOut(): Promise<void> {
    const supabase = await createServerClient();
    await supabase.auth.signOut();
}

export async function signInAnonymously(): Promise<void> {
    const supabase = await createServerClient();
    const data = await supabase.auth.signInAnonymously();
    if (data.error) {
        console.error("Error signing in anonymously:", data.error);
        throw new Error("Error signing in anonymously");
    }
    console.log("Anonymous sign in successful:", data);
}
