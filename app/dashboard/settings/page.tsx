import { getSelfProfile } from "@/actions/profile";
import { AccountSettingsWidget } from "@/components/dashboard/account-settings-widget";
import { BillingSettingsWidget } from "@/components/dashboard/billing-settings-widget";
import DashboardGrid, { DashboardGridItem } from "@/components/dashboard/grid";
import { IntegrationsWidget } from "@/components/dashboard/integrations-widget";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
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

    if (!user || user.isAnonymous) {
        redirect("/auth/sign-in");
    }

    if (!profile) {
        redirect("/onboarding/username");
    }

    const accounts = await auth.api.listUserAccounts({
        headers: await headers()
    });

    return (
        <div className="flex min-h-screen flex-col items-center justify-center font-normal">
            <section className="relative mt-1 flex h-full w-full flex-col items-start justify-start px-4 py-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center justify-start gap-2">
                        <SidebarTrigger className="flex md:hidden" />
                        <h1 className="text-3xl font-bold">Settings</h1>
                    </div>
                </div>
                <Breadcrumb className="font-mono text-xs">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            <BreadcrumbSeparator />
                            <BreadcrumbLink href="/dashboard/settings">Settings</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <DashboardGrid>
                    <DashboardGridItem className="col-span-4">
                        <BillingSettingsWidget profile={profile} />
                    </DashboardGridItem>

                    <DashboardGridItem className="col-span-4 md:col-span-2">
                        <AccountSettingsWidget user={user} accounts={accounts} />
                    </DashboardGridItem>

                    <DashboardGridItem className="col-span-4 md:col-span-2">
                        <IntegrationsWidget />
                    </DashboardGridItem>
                </DashboardGrid>
            </section>
        </div>
    );
}
