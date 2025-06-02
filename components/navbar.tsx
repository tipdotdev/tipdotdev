import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const features: { title: string; href: string; description: string }[] = [
    {
        title: "Free for everyone",
        href: "/#features",
        description: "tip.dev is free for everyone, we take a small fee on every transaction."
    },
    {
        title: "Intuitive Dashboard",
        href: "/#features",
        description: "Get all your stats ine one place, quickly and easily."
    },
    {
        title: "Quick Payouts",
        href: "/#features",
        description:
            "Through our payment partners, tip.dev can quickly and easily payout your tips."
    },
    {
        title: "Open Source",
        href: "/#features",
        description: "tip.dev is fully open source, and we welcome all contributions."
    },
    {
        title: "Privacy Focused",
        href: "/#features",
        description:
            "We take your privacy seriously. We collect as little personal data as possible."
    },
    {
        title: "Easy to Use",
        href: "/#features",
        description: "tip.dev is easy to use, and we're constantly working to improve it."
    }
];

const resources: { title: string; href: string; description: string }[] = [
    {
        title: "Documentation",
        href: "/docs",
        description: "Learn how to use tip.dev, everything from creating a page, to using our API."
    },
    {
        title: "Blog",
        href: "/blog",
        description: "Read the latest news and updates on our platform"
    },
    {
        title: "GitHub",
        href: "https://github.com/tipdotdev",
        description: "tip.dev is fully open source, and we welcome all contributions."
    }
];

export default function Navbar({ comingSoon = false }: { comingSoon?: boolean }) {
    return (
        <nav className="absolute top-0 z-50 flex w-full items-center py-2">
            <div className="flex w-1/3 pl-4">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-foreground/5"
                >
                    <Image src="/images/svg/logo.svg" alt="tip.dev logo" width={32} height={32} />
                    <h1 className="font-serif text-xl font-extrabold">tip.dev</h1>
                </Link>
            </div>
            <div className="flex w-1/3 justify-center">
                <NavMenuItems />
            </div>
            <div className="flex w-1/3 justify-end gap-4 pr-6">
                {comingSoon ? (
                    <Button>Coming Soon</Button>
                ) : (
                    <>
                        <Button variant="ghost" asChild>
                            <Link href="/sign-in">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
}

export function NavMenuItems() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {features.map((feature) => (
                                <ListItem
                                    key={feature.title}
                                    title={feature.title}
                                    href={feature.href}
                                >
                                    {feature.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/pricing" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Pricing
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {resources.map((resource) => (
                                <ListItem
                                    key={resource.title}
                                    title={resource.title}
                                    href={resource.href}
                                >
                                    {resource.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = "ListItem";
