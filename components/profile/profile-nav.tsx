"use client";

import { Copy, Facebook, MessageCircle, Share2, Twitter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { AnimatedLogo } from "../tui/tui-navbar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

export default function ProfileNav({ username }: { username: string }) {
    const [shareOpen, setShareOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-20 backdrop-blur-lg">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 transition-colors ease-in-out hover:text-foreground/80"
                        >
                            <AnimatedLogo />
                            <span className="font-mono">tip.dev</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" onClick={() => setShareOpen(true)}>
                            Share
                        </Button>
                        <Button asChild>
                            <Link href="/auth/sign-in?ref=profile">Create Profile</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <ShareModal username={username} open={shareOpen} setOpen={setShareOpen} />
        </nav>
    );
}

function ShareModal({
    open,
    setOpen,
    username
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    username: string;
}) {
    const profileUrl = `${typeof window !== "undefined" ? window.location.origin : "https://tip.dev"}/${username}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            toast.success("Profile link copied to clipboard!");
        } catch {
            toast.error("Failed to copy link");
        }
    };

    const shareOnTwitter = () => {
        const text = `Check out ${username}'s profile on tip.dev!`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`;
        window.open(url, "_blank");
    };

    const shareOnFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
        window.open(url, "_blank");
    };

    const shareOnWhatsApp = () => {
        const text = `Check out ${username}'s profile on tip.dev: ${profileUrl}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
    };

    const shareNative = async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: `${username}'s Profile`,
                    text: `Check out ${username}'s profile on tip.dev!`,
                    url: profileUrl
                });
            } catch {
                // User cancelled the share
            }
        }
    };

    const hasNativeShare = typeof navigator !== "undefined" && navigator.share;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Share {username}
                        {"'"}s Profile
                    </DialogTitle>
                    <DialogDescription>
                        Share this profile with your friends and help {username} get more tips!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Profile URL with Copy Button */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Profile Link</label>
                        <div className="flex space-x-2">
                            <Input value={profileUrl} readOnly className="flex-1" />
                            <Button onClick={copyToClipboard} variant="outline">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Social Media Sharing Buttons */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Share on Social Media</label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                onClick={shareOnTwitter}
                                variant="outline"
                                className="justify-start"
                            >
                                <Twitter className="mr-2 h-4 w-4" />
                                Twitter
                            </Button>
                            <Button
                                onClick={shareOnFacebook}
                                variant="outline"
                                className="justify-start"
                            >
                                <Facebook className="mr-2 h-4 w-4" />
                                Facebook
                            </Button>
                            <Button
                                onClick={shareOnWhatsApp}
                                variant="outline"
                                className="justify-start"
                            >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                WhatsApp
                            </Button>
                            {hasNativeShare && (
                                <Button
                                    onClick={shareNative}
                                    variant="outline"
                                    className="justify-start"
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    More...
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
