"use client";

import { updateProfilePersonalInfo } from "@/actions/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
    displayName: z.string().max(50),
    bio: z.string().max(160),
    website: z.union([z.string().url(), z.literal("")])
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PersonalInfoWidget({ profile }: { profile: any }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: profile.displayName || "",
            bio: profile.bio || "",
            website: profile.website || ""
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { dirtyFields } = form.formState;

        const displayName = dirtyFields.displayName
            ? values.displayName.trim()
            : profile.displayName;
        const bio = dirtyFields.bio ? values.bio.trim() : profile.bio;
        const website = dirtyFields.website ? values.website.trim() : profile.website;

        const { success, error } = await updateProfilePersonalInfo(
            profile.userId,
            displayName || "",
            bio || "",
            website || ""
        );

        if (success) {
            toast.success("Profile updated successfully");
        } else {
            toast.error(error || "Failed to update profile");
        }
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your display name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell the world about yourself..."
                                        {...field}
                                        className="resize-none"
                                        rows={3}
                                        maxLength={160}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://yourwebsite.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-full" type="submit">
                        Save Changes
                    </Button>
                </form>
            </Form>
        </div>
    );
}
