import { cn } from "@/lib/utils";

export default function DashboardGrid({ children }: { children: React.ReactNode }) {
    return <div className="mt-4 grid w-full grid-cols-2 gap-2 md:grid-cols-4">{children}</div>;
}

export function DashboardGridItem({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "col-span-1 h-full w-full rounded-lg border border-sidebar-border bg-sidebar p-4",
                className
            )}
        >
            {children}
        </div>
    );
}
