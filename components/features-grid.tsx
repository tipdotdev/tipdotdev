"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Code2, DollarSign, GithubIcon, Globe, Shield } from "lucide-react";
import { motion } from "motion/react";

export default function FeaturesGrid() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const features = [
        {
            title: "Free for Everyone",
            description:
                "Experience the power of open tipping infrastructure without any upfront costs. We maintain our platform through a minimal transaction fee, ensuring sustainability while keeping the service accessible to all developers and creators.",
            Icon: Globe,
            gradient: "from-purple-500/0 to-purple-500/40",
            size: "col-span-full md:col-span-2 md:row-span-1"
        },
        {
            title: "Intuitive Dashboard",
            description:
                "Monitor your success with our comprehensive analytics dashboard. Track earnings, engagement, and growth trends all in one beautifully designed interface.",
            Icon: BarChart,
            gradient: "from-blue-500/40 to-blue-500/0",
            size: "md:col-span-1 md:row-span-1"
        },
        {
            title: "Quick Payouts",
            description:
                "Get your earnings faster with our streamlined payout system. Through strategic partnerships with leading payment providers, we ensure your tips reach your wallet quickly and securely.",
            Icon: DollarSign,
            gradient: "from-green-500/0 to-green-500/40",
            size: "md:col-span-1 md:row-span-2"
        },
        {
            title: "Open Source",
            description:
                "Built by the community, for the community. Our codebase is fully open source, enabling transparency, trust, and collaborative improvement. Join us in shaping the future of developer monetization.",
            Icon: GithubIcon,
            gradient: "from-orange-500/40 to-orange-500/0",
            size: "md:col-span-1 md:row-span-1"
        },
        {
            title: "Privacy Focused",
            description:
                "Your privacy is our priority. We implement strict data minimalism, collecting only essential information needed to process transactions and maintain platform security.",
            Icon: Shield,
            gradient: "from-yellow-500/0 to-yellow-500/40",
            size: "md:col-span-1 md:row-span-1"
        },
        {
            title: "Easy to Use",
            description:
                "Start accepting tips in minutes with our developer-friendly integration. Simple API, comprehensive documentation, and continuous platform improvements make monetization effortless.",
            Icon: Code2,
            gradient: "from-pink-500/40 to-pink-500/0",
            size: "md:col-span-2 md:row-span-1"
        }
    ];

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeInUp}
            className="flex w-full justify-center px-4 py-24"
        >
            <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3" id="features">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        variants={fadeInUp}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={feature.size}
                    >
                        <Card className={`bg-gradient-to-br ${feature.gradient} h-full`}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-serif text-lg font-bold">
                                    <feature.Icon className={"h-5 w-5"} />
                                    {feature.title}
                                </CardTitle>
                                <CardDescription className={"text-md text-foreground/70"}>
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
