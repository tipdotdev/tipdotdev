"use server";

import { createServerClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

interface OAuthData {
    provider: string;
    url: string;
}

export async function signInWithGitHubAction(): Promise<OAuthData | null> {
    const supabase = await createServerClient();
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

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    // Normalize username: trim whitespace and convert to lowercase
    const normalized = username.trim().toLowerCase();

    // Validate length: must be between 2 and 50 characters
    if (normalized.length < 2 || normalized.length > 50) {
        return false;
    }

    // Validate URL-safe characters: allow only lowercase letters, numbers, hyphens, and underscores
    if (!/^[a-z0-9\-_]+$/.test(normalized)) {
        return false;
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", normalized)
        .maybeSingle();

    if (error) {
        console.error("Error checking username availability:", error);
        throw new Error("Error checking username availability");
    }

    // Return true if no matching user exists, false otherwise
    return data === null;
}

export async function insertUsername(username: string) {
    // Normalize username: trim whitespace and convert to lowercase
    const normalized = username.trim().toLowerCase();

    // Validate length: must be between 2 and 50 characters
    if (normalized.length < 2 || normalized.length > 50) {
        throw new Error("Username must be between 2 and 50 characters.");
    }

    // Validate URL-safe characters: allow only lowercase letters, numbers, hyphens, and underscores
    if (!/^[a-z0-9\-_]+$/.test(normalized)) {
        throw new Error(
            "Username must be URL-safe (only lowercase letters, digits, hyphens, and underscores allowed)."
        );
    }

    const supabase = await createServerClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        username: normalized
    });

    if (error) {
        console.error("Error setting username:", error);
        throw new Error("Error setting username");
    }
}
