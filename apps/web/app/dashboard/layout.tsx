import { Sidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Sidebar />
            <main className="flex min-h-screen w-screen flex-col">{children}</main>
        </SidebarProvider>
    );
}
