import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    await auth.api.signOut({
        headers: await headers()
    });
    return redirect("/auth/sign-in");
}
