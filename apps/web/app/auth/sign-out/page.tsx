import { signOut } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function Page() {
    await signOut();
    return redirect("/auth/sign-in");
}
