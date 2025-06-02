import { Code, DollarSign, Heart, Shield, Zap } from "lucide-react";
import { BlurFade } from "../magicui/blur-fade";
import { MagicCard } from "../magicui/magic-card";
import SectionHeading from "./section-heading";

export default function Features() {
    return (
        <section id="features" className="py-20">
            <div className="mx-auto max-w-6xl px-4">
                <SectionHeading
                    text="features --list"
                    description="Everything you need to fund your passion"
                />
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        title="Developer-First"
                        description="Built by developers, for developers. Simple API, clean docs, no BS."
                        icon={<Code className="mb-4 h-8 w-8" />}
                        delay={0.1}
                    />
                    <FeatureCard
                        title="Instant Setup"
                        description="Get your tip page live in under 60 seconds. No complex onboarding."
                        icon={<Zap className="mb-4 h-8 w-8" />}
                        delay={0.2}
                    />
                    <FeatureCard
                        title="Secure & Private"
                        description="Bank-level security. Your data stays yours. No tracking, no ads."
                        icon={<Shield className="mb-4 h-8 w-8" />}
                        delay={0.3}
                    />
                    <FeatureCard
                        title="Low Fees"
                        description="Just 4.5% + payment processing. No hidden fees, no monthly charges."
                        icon={<DollarSign className="mb-4 h-8 w-8" />}
                        delay={0.4}
                    />
                    <FeatureCard
                        title="Fan Engagement"
                        description="Let supporters leave messages and build a community around your work."
                        icon={<Heart className="mb-4 h-8 w-8" />}
                        delay={0.5}
                    />
                    <FeatureCard
                        title="Developer-First"
                        description="Built by developers, for developers."
                        icon={<Code className="mb-4 h-8 w-8" />}
                        delay={0.6}
                    />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({
    title,
    description,
    icon,
    delay
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    delay: number;
}) {
    return (
        <BlurFade inView delay={delay}>
            <MagicCard
                gradientFrom="#FFFFFF"
                gradientTo="#000000"
                className="flex h-full flex-col rounded-lg p-6"
            >
                {icon}
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="text-foreground/60">{description}</p>
            </MagicCard>
        </BlurFade>
    );
}
