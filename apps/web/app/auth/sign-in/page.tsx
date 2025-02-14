import TUINavbar from "@/components/tui/tui-navbar";
import { Button } from "@/components/ui/button";
import GitHubLogo from "@/public/images/svg/github.svg";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col font-mono font-normal">
            <TUINavbar active="sign-in" />
            {/* Full-height Hero Section */}
            <section className="relative flex h-screen flex-col items-center justify-center px-4 py-8">
                <div className="flex w-full max-w-md flex-col gap-2">
                    <h2 className="text-xl text-white">Who are you?</h2>
                    <p className="text-xs">
                        Sign in to your account to access your dashboard. If you don&apos;t have an
                        account, don&apos;t worry—we will get you set up.
                    </p>

                    <div className="jsustify-center mt-8 flex w-full flex-col items-center gap-2 font-sans">
                        <Button className="w-full">
                            <GitHubLogo className="h-full w-full fill-black" />
                            Continue with GitHub
                        </Button>
                        <Button className="w-full" variant="outline">
                            <Image
                                src="/images/svg/google.svg"
                                alt="Google Logo"
                                width={16}
                                height={16}
                            />
                            Continue with Google
                        </Button>
                    </div>

                    <p className="mt-4 text-start text-xs text-foreground/40">
                        By continuing you agree to our{" "}
                        <Link href="/terms" className="text-foreground hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-foreground hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    );
}
