import { PosthogProvider } from "@/components/posthog-provider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist as FontSans, Nunito as FontSerif } from "next/font/google";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-geist-sans"
});

const fontSerif = FontSerif({
    subsets: ["latin"],
    variable: "--font-serif"
});

export const metadata: Metadata = {
    title: "tip.dev coming soon",
    description:
        "A platform for developers to get tipped by fans of their work. Embed a link anywhere and get paid from almost everywhere. Coming soon.",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://tip.dev",
        title: "tip.dev coming soon",
        description:
            "A platform for developers to get tipped by fans of their work. Embed a link anywhere and get paid from almost everywhere. Coming soon.",
        images: [
            {
                url: "https://tip.dev/images/png/og-image.png",
                width: 1200,
                height: 630
            }
        ]
    },
    referrer: "no-referrer-when-downgrade",
    keywords:
        "tip.dev, coming soon, tip, dev, tipdev, developers, devs, ko-fi, buymeacoffee, link in bio, money, freelance, web dev"
};

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <script defer data-domain="tip.dev" src="https://a.kyle.so/js/script.js"></script>
            </head>
            <body
                className={`min-h-screen overflow-auto bg-background font-sans antialiased ${
                    (fontSans.variable, fontSerif.variable)
                }`}
            >
                <PosthogProvider>{children}</PosthogProvider>
                <Toaster richColors />
            </body>
        </html>
    );
}
