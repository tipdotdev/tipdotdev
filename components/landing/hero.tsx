import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import WaitlistForm from "../waitlist-form";

export default function Hero({
    prelaunch,
    setFormFocused
}: {
    prelaunch?: boolean;
    setFormFocused: (focused: boolean) => void;
}) {
    return (
        <section className="mt-32 flex-1 px-4 py-20">
            <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6">
                    <span className="font-mono text-sm text-foreground/60">
                        {">"}{" "}
                        <Link
                            href="https://github.com/tipdotdev/tipdotdev"
                            className="hover:underline"
                            target="_blank"
                        >
                            tip.dev --version 0.1.0-beta
                        </Link>
                    </span>
                </div>
                <h1 className="mb-6 text-3xl font-bold md:text-6xl">
                    <span className="animate-gradient bg-gradient-to-br from-foreground via-foreground/60 to-foreground/10 bg-[length:200%_200%] bg-clip-text text-transparent">
                        Make money doing
                        <br />
                        what you love
                    </span>
                </h1>
                <p className="mx-auto mb-8 max-w-xl font-mono text-sm text-foreground/60 md:text-lg">
                    tip.dev is a platform for{" "}
                    <span className="font-semibold text-white">developers</span> to get paid by fans
                    of their work. Embed a link anywhere and get paid from almost everywhere.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    {prelaunch ? (
                        <div className="flex w-full max-w-sm flex-col items-center justify-center gap-4 sm:flex-row">
                            <WaitlistForm setFormFocused={setFormFocused} />
                        </div>
                    ) : (
                        <>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/developers">Find a Developer</Link>
                            </Button>
                            <Button size="lg" asChild>
                                <Link href="/auth/sign-in">
                                    Start Earning
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
                <div className="mt-8 font-mono text-sm text-foreground/60">
                    <span>
                        {">"} curl -X POST{" "}
                        {prelaunch ? (
                            <>https://tip.dev/coming-soon</>
                        ) : (
                            <Link href="/auth/sign-in" className="hover:underline">
                                https://tip.dev/auth/sign-in
                            </Link>
                        )}
                    </span>
                </div>
            </div>
        </section>
    );
}
