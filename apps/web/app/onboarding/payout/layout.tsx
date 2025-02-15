import { getSelfProfile } from "@/actions/profile";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const profile = await getSelfProfile();
    if (profile?.stripe_account_id) {
        redirect("/dashboard");
    }

    return children;
}
