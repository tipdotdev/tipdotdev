/* eslint-disable @next/next/no-img-element */
"use client";

import { updateProfileAvatar, updateProfileBanner } from "@/actions/profile";
import { profile as profileSchema } from "@/db/schema";
import { useUploadThing } from "@/utils/uploadthing";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { FileInput } from "../ui/file-input";

export function AvatarBannerWidget({ profile }: { profile: typeof profileSchema.$inferSelect }) {
    const router = useRouter();
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const [isBannerUploading, setIsBannerUploading] = useState(false);
    const [isAvatarRemoving, setIsAvatarRemoving] = useState(false);
    const [isBannerRemoving, setIsBannerRemoving] = useState(false);

    const { startUpload: startAvatarUpload } = useUploadThing("avatarUploader", {
        onClientUploadComplete: async (res) => {
            if (res?.[0]?.ufsUrl) {
                toast.success("Avatar updated successfully");
                router.refresh();
            }
            setIsAvatarUploading(false);
        },
        onUploadError: (error) => {
            toast.error(`Avatar upload failed: ${error.message}`);
            setIsAvatarUploading(false);
        },
        onUploadBegin: () => {
            setIsAvatarUploading(true);
        }
    });

    const { startUpload: startBannerUpload } = useUploadThing("bannerUploader", {
        onClientUploadComplete: async (res) => {
            if (res?.[0]?.ufsUrl) {
                toast.success("Banner updated successfully");
                router.refresh();
            }
            setIsBannerUploading(false);
        },
        onUploadError: (error) => {
            toast.error(`Banner upload failed: ${error.message}`);
            setIsBannerUploading(false);
        },
        onUploadBegin: () => {
            setIsBannerUploading(true);
        }
    });

    const handleAvatarUpload = async (files: File[]) => {
        if (files.length > 0) {
            await startAvatarUpload(files);
        }
    };

    const handleBannerUpload = async (files: File[]) => {
        if (files.length > 0) {
            await startBannerUpload(files);
        }
    };

    const handleRemoveAvatar = async () => {
        setIsAvatarRemoving(true);
        const { success, error } = await updateProfileAvatar(profile.userId, null);
        if (success) {
            toast.success("Avatar removed successfully");
            router.refresh();
        } else {
            toast.error(error || "Failed to remove avatar");
        }
        setIsAvatarRemoving(false);
    };

    const handleRemoveBanner = async () => {
        setIsBannerRemoving(true);
        const { success, error } = await updateProfileBanner(profile.userId, null);
        if (success) {
            toast.success("Banner removed successfully");
            router.refresh();
        } else {
            toast.error(error || "Failed to remove banner");
        }
        setIsBannerRemoving(false);
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Avatar & Banner</h2>
            </div>

            <div className="space-y-6">
                {/* Avatar Section */}
                <div>
                    <h3 className="mb-3 text-sm font-medium">Profile Avatar</h3>
                    <div className="flex items-center gap-4">
                        <Avatar className="size-16">
                            <AvatarFallback className="text-lg">
                                {profile.username?.charAt(0)}
                            </AvatarFallback>
                            <AvatarImage
                                src={profile.avatarUrl || undefined}
                                alt={profile.username + "'s profile picture"}
                            />
                        </Avatar>
                        <div className="flex flex-wrap items-center gap-2">
                            <FileInput accept="image/*" onFileSelect={handleAvatarUpload}>
                                <Button variant="outline" size="sm" disabled={isAvatarUploading}>
                                    <UploadIcon className="mr-2 size-4" />
                                    {isAvatarUploading ? "Uploading..." : "Upload New Avatar"}
                                </Button>
                            </FileInput>
                            {profile.avatarUrl && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isAvatarRemoving}
                                    onClick={handleRemoveAvatar}
                                    className="border-destructive/40 bg-destructive/10 text-red-500 hover:bg-destructive/40 hover:text-red-500"
                                >
                                    <XIcon className="mr-2 size-4" />
                                    {isAvatarRemoving ? "Removing..." : "Remove"}
                                </Button>
                            )}
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-foreground/60">
                        Recommended: Square image, at least 400x400px. Max file size: 4MB.
                    </p>
                </div>

                {/* Banner Section */}
                <div>
                    <h3 className="mb-3 text-sm font-medium">Profile Banner</h3>
                    <Card className="relative aspect-[4/1] w-full overflow-hidden">
                        {profile.bannerUrl ? (
                            <div className="relative h-full w-full">
                                <img
                                    src={profile.bannerUrl}
                                    alt="Profile banner"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="absolute right-2 top-2"
                                    disabled={isBannerRemoving}
                                    onClick={handleRemoveBanner}
                                >
                                    <XIcon className="mr-2 size-4" />
                                    {isBannerRemoving ? "Removing..." : "Remove"}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center bg-sidebar/50">
                                <ImageIcon className="mb-2 size-8 text-muted" />
                                <p className="mb-4 text-sm text-foreground/60">No banner image</p>
                                <FileInput accept="image/*" onFileSelect={handleBannerUpload}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={isBannerUploading}
                                    >
                                        <UploadIcon className="mr-2 size-4" />
                                        {isBannerUploading ? "Uploading..." : "Upload Banner"}
                                    </Button>
                                </FileInput>
                            </div>
                        )}
                    </Card>
                    <p className="mt-2 text-xs text-foreground/60">
                        Recommended: 1500x500px or similar 4:1 aspect ratio. Max file size: 8MB.
                    </p>
                </div>
            </div>
        </div>
    );
}
