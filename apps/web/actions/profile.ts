"use server";

import { createServerClient } from "@/utils/supabase/server";

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
        username: normalized,
        avatar_url: user.user_metadata.avatar_url || null
    });

    if (error) {
        console.error("Error setting username:", error);
        throw new Error("Error setting username");
    }
}

export async function getSelfProfile() {
    const supabase = await createServerClient();
    const userData = await supabase.auth.getUser();
    if (!userData || userData.error) {
        return null;
    }

    if (userData.data.user.is_anonymous) {
        return null;
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.data?.user.id)
        .single();

    if (error) {
        console.error("Error getting self profile:", error);
        return null;
    }

    return data;
}

export async function getProfile(username: string) {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

    if (error) {
        console.error("Error getting profile:", error);
        return null;
    }

    return data;
}

export async function getProfileByStripeAcctID(stripeAcctID: string) {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("stripe_account_id", stripeAcctID)
        .single();

    if (error) {
        console.error("Error getting profile by stripe account id:", error);
        return null;
    }

    return data;
}
