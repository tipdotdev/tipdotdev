import { getSelfProfile } from "@/actions/profile";
import DashboardGrid, { DashboardGridItem } from "@/components/dashboard/grid";
import { WelcomeBack } from "@/components/dashboard/home";
import IncomeWidget from "@/components/dashboard/income-widget";
import RecentTransactionsWidget from "@/components/dashboard/recent-transactions";
import SupportersWidget from "@/components/dashboard/supporters-widget";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    const profile = await getSelfProfile();
    const authData = await auth.api.getSession({
        headers: await headers()
    });
    const user = authData?.user;

    if (!user) {
        redirect("/login");
    }

    if (!profile) {
        redirect("/onboarding/username");
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center font-normal">
            <section className="relative mt-1 flex h-full w-full flex-col items-start justify-start px-4 py-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center justify-start gap-2">
                        <SidebarTrigger className="flex md:hidden" />
                        <h1 className="text-3xl font-bold">Home</h1>
                    </div>
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
                        <IncomeWidget userId={user.id} />
                    </DashboardGridItem>

                    <DashboardGridItem className="col-span-4 md:col-span-2">
                        <SupportersWidget userId={user.id} />
                    </DashboardGridItem>

                    <DashboardGridItem className="col-span-4">
                        <RecentTransactionsWidget userId={user.id} />
                    </DashboardGridItem>
                </DashboardGrid>

                {/* <StripeDashboard userId={user.id} /> */}
            </section>
        </div>
    );
}
