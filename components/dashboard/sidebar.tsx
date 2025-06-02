import { Home, Settings, User } from "lucide-react";

import { getProfileByUserId } from "@/actions/profile";
import { getSelfUser } from "@/actions/user";
import {
    Sidebar as Sb,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import AccountDropdown from "./account-dropdown";

// Menu items.
const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings
    }
];

export async function Sidebar() {
    const user = await getSelfUser();
    const profile = await getProfileByUserId(user?.id || "");

    return (
        <Sb collapsible="icon" variant="inset">
            <SidebarHeader className="border-0">
                <p className="text-md font-mono">{"{$}"}</p>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex flex-row items-center justify-between">
                    {/* <SidebarTrigger /> */}
                    <AccountDropdown profile={profile} />
                </div>
            </SidebarFooter>
        </Sb>
    );
}
