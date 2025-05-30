import AuthButtons from "@/components/auth/auth-buttons";
import TUINavbar from "@/components/tui/tui-navbar";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session && !session.user.isAnonymous) return redirect("/dashboard");

    return (
        <div className="flex min-h-screen flex-col font-mono font-normal">
            <TUINavbar active="sign-in" disableKeyboardNavigation />
            <section className="relative flex h-screen flex-col items-center justify-center px-4 py-8">
                <div className="flex w-full max-w-md flex-col gap-2">
                    <h2 className="text-xl text-white">Who are you?</h2>
                    <p className="text-xs">
                        Sign in to your account to access your dashboard. If you don&apos;t have an
                        account, don&apos;t worry—we will get you set up.
                    </p>

                    <AuthButtons />

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
