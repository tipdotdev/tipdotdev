"use client";

import { motion } from "motion/react";
import { NumberTicker } from "../magicui/number-ticker";

export default function Stats() {
    return (
        <section className="py-16">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
                    <AnimatedStat
                        end={2.5}
                        delay={0.1}
                        prefix="$"
                        suffix="M+"
                        label="Raised for Developers"
                    />
                    <AnimatedStat end={15} delay={0.2} suffix="K+" label="Active Developers" />
                    <AnimatedStat end={50} delay={0.3} suffix="K+" label="Tips Processed" />
                </div>
            </div>
        </section>
    );
}

function AnimatedStat({
    end,
    delay,
    prefix,
    suffix,
    label
}: {
    end: number;
    delay: number;
    prefix?: string;
    suffix?: string;
    label: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay }}
            viewport={{ once: true }}
        >
            <div className="mb-2 text-3xl font-bold">
                <span className="text-3xl font-bold">{prefix}</span>
                <AnimatedCounter end={end} />
                <span className="text-3xl font-bold">{suffix}</span>
            </div>
            <div className="font-mono text-foreground/60">{label}</div>
        </motion.div>
    );
}

const AnimatedCounter = ({ end }: { end: number }) => {
    return (
        <NumberTicker
            decimalPlaces={end.toString().includes(".") ? end.toString().split(".")[1].length : 0}
            value={end}
            className="text-3xl font-bold text-foreground"
        />
    );
};
