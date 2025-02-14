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

                <DataItem label="ID" value={user.id} />
                <DataItem label="Username" value={profile.data.username} />
                <DataItem label="Email" value={user.email || "undefined"} />
                <DataItem label="Stripe ID" value={profile.data.stripe_account_id || "undefined"} />
                <DataItem label="Created at" value={user.created_at} />
                <DataItem label="Updated at" value={user.updated_at || "undefined"} />

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

function DataItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex w-full items-center justify-between">
            <p>{label}:</p>
            <p className="font-mono">{value}</p>
        </div>
    );
}
