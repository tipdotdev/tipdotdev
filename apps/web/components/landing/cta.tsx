import Link from "next/link";
import { Button } from "../ui/button";
import WaitlistForm from "../waitlist-form";

export default function CTA({
    prelaunch,
    setFormFocused
}: {
    prelaunch?: boolean;
    setFormFocused: (focused: boolean) => void;
}) {
    return (
        <section className="py-20">
            <div className="mx-auto max-w-4xl px-4 text-center">
                <h2 className="mb-4 text-2xl font-bold md:text-4xl">Ready to start earning?</h2>
                <p className="mb-8 text-lg text-foreground/60">
                    Join thousands of developers already making money with tip.dev
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    {prelaunch ? (
                        <div className="flex w-full max-w-sm flex-col items-start justify-start gap-4 sm:flex-row">
                            <WaitlistForm setFormFocused={setFormFocused} />
                        </div>
                    ) : (
                        <>
                            <Button size="lg" asChild>
                                <Link href="/auth/sign-in">Create Your Profile</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="https://docs.tip.dev" target="_blank">
                                    View Documentation
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
                <div className="mt-8 font-mono text-sm text-foreground/60">
                    <span>{">"} git clone https://github.com/your-username/success.git</span>
                </div>
            </div>
        </section>
    );
}
