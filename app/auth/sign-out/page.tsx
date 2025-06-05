import { auth } from "@/utils/auth";
import { op } from "@/utils/op";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    op.clear();
    await auth.api.signOut({
        headers: await headers()
    });
    return redirect("/auth/sign-in");
}
