import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
    Sidebar as Sb,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
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
        url: "#",
        icon: Home
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar
    },
    {
        title: "Search",
        url: "#",
        icon: Search
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings
    }
];

export function Sidebar() {
    return (
        <Sb collapsible="icon" variant="floating">
            <SidebarHeader>
                <p className="text-md font-mono">{"{$}"}</p>
            </SidebarHeader>
            <SidebarContent className="border-0">
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
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
