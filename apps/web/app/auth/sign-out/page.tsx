import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
    (await createServerClient()).auth.signOut();
    return redirect("/auth/sign-in");
}
