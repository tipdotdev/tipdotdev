import { getSelfProfile } from "@/actions/profile";
import AccountDropdown from "@/components/dashboard/account-dropdown";
import DashboardGrid, { DashboardGridItem } from "@/components/dashboard/grid";
import { WelcomeBack } from "@/components/dashboard/home";
import PercentChange from "@/components/dashboard/percent-change";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList
} from "@/components/ui/breadcrumb";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createServerClient } from "@/utils/supabase/server";
import { SquareIcon } from "lucide-react";

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
                    <AccountDropdown profile={profile} />
                </div>
                <Breadcrumb className="font-mono text-xs">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <DashboardGrid>
                    <DashboardGridItem className="col-span-4">
                        <WelcomeBack profile={profile} user={user} />
                    </DashboardGridItem>

                    <DashboardGridItem className="col-span-4 md:col-span-2">
                        <div className="flex w-full flex-row items-start justify-between">
                            <h3 className="text-lg font-bold">Income</h3>
                            <Select>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="All-time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All-time">All-time</SelectItem>
                                    <SelectItem value="Today">Today</SelectItem>
                                    <SelectItem value="Past-7-days">Past 7 Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-2 flex items-center justify-start gap-4">
                            <p className="text-4xl font-extrabold">$5,383.29</p>
                            <PercentChange value={12.5} positive showText />
                        </div>

                        <div className="mt-4 flex w-full flex-row items-center gap-4">
                            <div className="flex flex-row items-center justify-center gap-1">
                                <SquareIcon className="size-3 fill-green-400 text-green-400" />
                                <p className="font-mono text-xs text-foreground/60">$3.4k Tips</p>
                            </div>
                            <div className="flex flex-row items-center justify-center gap-1">
                                <SquareIcon className="size-3 fill-blue-400 text-blue-400" />
                                <p className="font-mono text-xs text-foreground/60">$1.9k Subs</p>
                            </div>
                        </div>
                    </DashboardGridItem>
                    <DashboardGridItem className="col-span-4 md:col-span-2">
                        <div className="flex w-full flex-row items-start justify-between">
                            <h3 className="text-lg font-bold">Supporters</h3>
                            <Select>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="All-time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All-time">All-time</SelectItem>
                                    <SelectItem value="Today">Today</SelectItem>
                                    <SelectItem value="Past-7-days">Past 7 Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-2 flex items-center justify-start gap-4">
                            <p className="text-4xl font-extrabold">240</p>
                            <PercentChange value={100} positive showText />
                        </div>

                        <div className="mt-4 flex w-full flex-row items-center gap-4">
                            <div className="flex flex-row items-center justify-center gap-1">
                                <SquareIcon className="size-3 fill-green-400 text-green-400" />
                                <p className="font-mono text-xs text-foreground/60">219 Tips</p>
                            </div>
                            <div className="flex flex-row items-center justify-center gap-1">
                                <SquareIcon className="size-3 fill-blue-400 text-blue-400" />
                                <p className="font-mono text-xs text-foreground/60">21 Subs</p>
                            </div>
                        </div>
                    </DashboardGridItem>
                </DashboardGrid>
            </section>
        </div>
    );
}
