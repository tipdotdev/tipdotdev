import { TrendingDown, TrendingUp } from "lucide-react";

export default function PercentChange({
    value,
    positive = false,
    showText = false,
    className
}: {
    value: number;
    positive?: boolean;
    showText?: boolean;
    className?: string;
}) {
    if (positive) {
        return (
            <div className="flex flex-col items-center justify-center">
                <TrendingUp className="size-5 fill-green-400 text-green-400" />
                {showText && <span className="text-xs text-green-400">{value}%</span>}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <TrendingDown className="size-5 fill-red-400 text-red-400" />
            {showText && <span className="text-xs text-red-400">{value}%</span>}
        </div>
    );
}
