"use server";

import { createServerClient } from "@/utils/supabase/server";

export async function getSelfUser() {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.error("Error getting user:", error);
        return null;
    }

    return data.user;
}
