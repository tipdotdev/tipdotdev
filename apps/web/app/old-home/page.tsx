import FeaturesGrid from "@/components/features-grid";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Particles } from "@/components/ui/particles";

export default function Home() {
    const comingSoon = true;

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar comingSoon={comingSoon} />

            {/* Full-height Hero Section */}
            <section className="relative flex h-screen items-center justify-center">
                <div className="z-10 flex flex-col items-center justify-center gap-4 px-4 text-center">
                    {comingSoon && (
                        <Badge className="mb-8 bg-purple-500/20 font-mono text-purple-300 hover:bg-purple-500/20">
                            Coming Soon
                        </Badge>
                    )}
                    <h1 className="font-serif text-3xl font-extrabold sm:text-5xl">
                        Make money doing what you love
                    </h1>
                    <p className="max-w-xl font-serif text-sm text-muted-foreground sm:text-lg">
                        tip.dev is a platform for <span className="text-primary">developers</span>{" "}
                        to get paid by fans of their work. Embed a link anywhere and get paid from
                        almost everywhere.
                    </p>
                </div>
                <Particles
                    className="absolute inset-0"
                    quantity={500}
                    ease={80}
                    color={"#ffffff"}
                    refresh
                />
            </section>

            {/* Animated Features Section */}
            <FeaturesGrid />

            <Footer />
        </div>
    );
}
