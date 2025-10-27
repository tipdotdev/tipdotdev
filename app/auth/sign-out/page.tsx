import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import posthog from "posthog-js";

export default async function Page() {
    await auth.api.signOut({
        headers: await headers()
    });
    posthog.capture("auth.signed_out");
    return redirect("/auth/sign-in");
}
