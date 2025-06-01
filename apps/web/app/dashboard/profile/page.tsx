import { getNotificationPreferences } from "@/actions/notifications";
import { getSelfProfile } from "@/actions/profile";
import { AvatarBannerWidget } from "@/components/dashboard/avatar-banner-widget";
import DashboardGrid, { DashboardGridItem } from "@/components/dashboard/grid";
import { PersonalInfoWidget } from "@/components/dashboard/personal-info-widget";
import { ProfileSettingsWidget } from "@/components/dashboard/profile-settings-widget";
import { SocialMediaWidget } from "@/components/dashboard/social-media-widget";
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

    if (!user) {
        redirect("/login");
    }

    if (!profile) {
        redirect("/onboarding/username");
    }

    const notificationPreferences = await getNotificationPreferences(user.id);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center font-normal">
            <section className="relative mt-1 flex h-full w-full flex-col items-start justify-start px-4 py-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center justify-start gap-2">
                        <SidebarTrigger className="flex md:hidden" />
                        <h1 className="text-3xl font-bold">Profile</h1>
                    </div>
                </div>
                <Breadcrumb className="font-mono text-xs">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            <BreadcrumbSeparator />
                            <BreadcrumbLink href="/dashboard/profile">Profile</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <DashboardGrid>
                    <DashboardGridItem className="col-span-4 md:col-span-2">
                        <PersonalInfoWidget profile={profile} />
                    </DashboardGridItem>

                    <DashboardGridItem className="col-span-4 md:col-span-2">
                        <AvatarBannerWidget profile={profile} />
                    </DashboardGridItem>

                    <DashboardGridItem className="col-span-4 md:col-span-2">
                        <SocialMediaWidget profile={profile} />
                    </DashboardGridItem>

                    <DashboardGridItem className="col-span-4 md:col-span-2">
                        <ProfileSettingsWidget
                            profile={profile}
                            notificationPreferences={notificationPreferences}
                        />
                    </DashboardGridItem>
                </DashboardGrid>
            </section>
        </div>
    );
}
