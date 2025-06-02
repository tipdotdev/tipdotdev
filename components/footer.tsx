import Link from "next/link";
import { AnimatedLogo } from "./tui/tui-navbar";

export default function Footer() {
    return (
        <footer className="border-t border-sidebar-border bg-sidebar py-12">
            <div className="w-full px-4">
                <div className="grid w-full grid-cols-1 px-8 md:grid-cols-5">
                    <div>
                        <div className="mb-4 flex items-center space-x-2 font-mono">
                            {/* <span className="text-lg font-bold">{"{$}"}</span> */}
                            <AnimatedLogo />
                            <span className="text-xl font-bold">tip.dev</span>
                        </div>
                        <p className="text-sm text-foreground/60">
                            Make money doing what you love. Built for developers, by developers.
                        </p>
                        <div className="mt-4 border-t border-dashed border-border pt-4 text-xs text-foreground/60">
                            <p>© {new Date().getFullYear()} tip.dev. All rights reserved.</p>
                            <p className="mt-2 font-mono">
                                {">"} console.log(&quot;happy tipping! 🚀&quot;)
                            </p>
                        </div>
                    </div>
                    <div></div>
                    <div>
                        <h4 className="mb-4 font-semibold">Product</h4>
                        <ul className="space-y-2 text-sm text-foreground/60">
                            <li>
                                <Link href="#features" className="hover:text-white">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-white">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="https://docs.tip.dev" className="hover:text-white">
                                    API Docs
                                </Link>
                            </li>
                            <li>
                                <Link href="/changelog" className="hover:text-white">
                                    Changelog
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold">Company</h4>
                        <ul className="space-y-2 text-sm text-foreground/60">
                            <li>
                                <Link href="/about" className="hover:text-white">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-white">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="hover:text-white">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold">Legal</h4>
                        <ul className="space-y-2 text-sm text-foreground/60">
                            <li>
                                <Link href="/privacy" className="hover:text-white">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-white">
                                    Terms
                                </Link>
                            </li>
                            <li>
                                <Link href="/security" className="hover:text-white">
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export function SmallFooter() {
    return (
        <footer className="py-4">
            <div className="w-full px-4">
                <div className="flex flex-col-reverse items-center justify-between gap-2 px-8 md:flex-row">
                    <div className="flex items-center space-x-2 font-mono text-xs text-foreground/60">
                        <AnimatedLogo />
                        <p>© {new Date().getFullYear()} tip.dev. All rights reserved.</p>
                    </div>
                    <div className="flex flex-row items-center space-x-4 text-xs text-foreground/60">
                        <Link
                            href="/privacy"
                            className="transition-colors ease-in-out hover:text-foreground"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className="transition-colors ease-in-out hover:text-foreground"
                        >
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
