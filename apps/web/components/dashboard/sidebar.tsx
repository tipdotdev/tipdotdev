import { Home, Settings, User } from "lucide-react";

import {
    Sidebar as Sb,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger
} from "@/components/ui/sidebar";

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

export function Sidebar() {
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
                <SidebarTrigger />
            </SidebarFooter>
        </Sb>
    );
}
