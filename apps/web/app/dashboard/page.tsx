import { createServerClient } from "@/utils/supabase/server";
import Link from "next/link";
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
        <div className="flex min-h-screen flex-col items-center justify-center font-normal">
            <section className="relative mt-1 flex w-full max-w-lg flex-col items-start justify-center px-4 py-8">
                <h1>User data:</h1>
                <p>
                    ID: <span className="ml-[5.35rem] font-mono">{user.id}</span>
                </p>
                <p>
                    Username:{" "}
                    <span className="ml-[1.72rem] font-mono">{profile.data.username}</span>
                </p>
                <p>
                    Email: <span className="ml-16 font-mono">{user.email}</span>
                </p>
                <p>
                    Created at: <span className="ml-[1.75rem] font-mono">{user.created_at}</span>
                </p>
                <Link
                    href="/auth/sign-out"
                    className="mt-4 underline transition-colors hover:text-white"
                >
                    Sign out
                </Link>
            </section>
        </div>
    );
}
