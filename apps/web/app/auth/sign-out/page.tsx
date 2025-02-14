import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
    const sb = await createServerClient();
    sb.auth.signOut();
    return redirect("/auth/sign-in");
}
