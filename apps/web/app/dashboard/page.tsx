import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
    const sb = await createServerClient();
    const {
        data: { user }
    } = await sb.auth.getUser();

    if (!user) return redirect("/auth/sign-in");

    const profile = await sb.from("profiles").select("*").eq("id", user.id).single();
    if (profile.error) {
        console.error("Error getting user profile:", profile.error);
    }

    return (
        <div className="flex min-h-screen flex-col font-normal">
            <h1>dashboard</h1>
            <p>
                {user.id} - {profile.data.username}
            </p>
        </div>
    );
}
