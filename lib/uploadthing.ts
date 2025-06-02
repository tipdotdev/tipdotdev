import { db } from "@/db";
import { profile } from "@/db/schema";
import { auth } from "@/utils/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();
const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

// Function to delete a file from UploadThing using the stored key
export async function deleteUploadThingFile(
    key: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await utapi.deleteFiles([key]);
        return { success: true };
    } catch (error) {
        console.error("Error deleting UploadThing file:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export const ourFileRouter = {
    avatarUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            const session = await auth.api.getSession({
                headers: await headers()
            });

            if (!session?.user) throw new UploadThingError("Unauthorized");

            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // Save both URL and key to database
            await db
                .update(profile)
                .set({
                    avatarUrl: file.ufsUrl,
                    avatarKey: file.key
                })
                .where(eq(profile.userId, metadata.userId));

            return { uploadedBy: metadata.userId, url: file.ufsUrl };
        }),

    bannerUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
        .middleware(async () => {
            const session = await auth.api.getSession({
                headers: await headers()
            });

            if (!session?.user) throw new UploadThingError("Unauthorized");

            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // Save both URL and key to database
            await db
                .update(profile)
                .set({
                    bannerUrl: file.ufsUrl,
                    bannerKey: file.key
                })
                .where(eq(profile.userId, metadata.userId));

            return { uploadedBy: metadata.userId, url: file.ufsUrl };
        })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
