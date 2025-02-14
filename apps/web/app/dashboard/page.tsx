import DashboardGrid, { DashboardGridItem } from "@/components/dashboard/grid";
import { WelcomeBack } from "@/components/dashboard/home";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createServerClient } from "@/utils/supabase/server";
import { CircleIcon } from "lucide-react";
import Image from "next/image";
import { getSelfProfile } from "../actions";

export default async function Page() {
    const sb = await createServerClient();
    const profile = await getSelfProfile();
    const {
        data: { user },
        error
    } = await sb.auth.getUser();

    if (!profile || error) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center font-normal">
            <section className="relative mt-1 flex h-full w-full flex-col items-start justify-start px-4 py-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center justify-start gap-2">
                        <SidebarTrigger className="flex md:hidden" />
                        <h1 className="text-3xl font-bold">Home</h1>
                    </div>
                    <Image
                        src={profile.avatar_url}
                        alt={"Profile picture"}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                </div>
                <div className="mt-2 flex items-center justify-start font-mono text-xs">
                    <CircleIcon className="mr-2 size-3 fill-green-400 text-green-400" />
                    <p>
                        Your page is live at{" "}
                        <span className="cursor-pointer hover:underline">
                            <a href={`https://tip.dev/${profile.username}`} target="_blank">
                                tip.dev/{profile.username}
                            </a>
                        </span>
                    </p>
                </div>
                <DashboardGrid>
                    <DashboardGridItem className="col-span-4">
                        <WelcomeBack profile={profile} user={user} />
                    </DashboardGridItem>
                </DashboardGrid>
            </section>
        </div>
    );
}
