import { cn } from "@/lib/utils";

interface SpinnerProps {
    size?: number; // size in pixels
    className?: string;
}

export function Spinner({ size = 24, className }: SpinnerProps) {
    return (
        <div
            className={cn(
                "animate-spin rounded-full border-[3px] border-border border-b-foreground border-r-foreground",
                className
            )}
            style={{
                width: size,
                height: size
            }}
        />
    );
}
