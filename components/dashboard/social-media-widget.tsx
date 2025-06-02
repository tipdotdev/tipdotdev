"use client";

import { updateProfileSocialMedia } from "@/actions/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLinkIcon, GithubIcon, InstagramIcon, TwitterIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
    twitter: z.union([z.string().url(), z.literal("")]),
    github: z.union([z.string().url(), z.literal("")]),
    instagram: z.union([z.string().url(), z.literal("")])
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SocialMediaWidget({ profile }: { profile: any }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            twitter: profile.socialMedia?.twitter || "",
            github: profile.socialMedia?.github || "",
            instagram: profile.socialMedia?.instagram || ""
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { dirtyFields } = form.formState;

        const twitter = dirtyFields.twitter
            ? values.twitter.trim()
            : profile.socialMedia?.twitter || "";
        const github = dirtyFields.github
            ? values.github.trim()
            : profile.socialMedia?.github || "";
        const instagram = dirtyFields.instagram
            ? values.instagram.trim()
            : profile.socialMedia?.instagram || "";

        const { success, error } = await updateProfileSocialMedia(
            profile.userId,
            twitter,
            github,
            instagram
        );

        if (success) {
            toast.success("Social media updated successfully");
        } else {
            toast.error(error || "Failed to update social media");
        }
    }

    const socialPlatforms = [
        {
            name: "Twitter",
            icon: TwitterIcon,
            placeholder: "https://twitter.com/username",
            field: "twitter" as const
        },
        {
            name: "GitHub",
            icon: GithubIcon,
            placeholder: "https://github.com/username",
            field: "github" as const
        },
        {
            name: "Instagram",
            icon: InstagramIcon,
            placeholder: "https://instagram.com/username",
            field: "instagram" as const
        }
    ];

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Social Media</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {socialPlatforms.map((platform) => {
                        const Icon = platform.icon;
                        const currentValue = profile.socialMedia?.[platform.field] || "";

                        return (
                            <FormField
                                key={platform.field}
                                control={form.control}
                                name={platform.field}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Icon className="mr-2 inline size-4 text-muted-foreground/60" />
                                            {platform.name}
                                        </FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input
                                                    placeholder={platform.placeholder}
                                                    {...field}
                                                    className="flex-1"
                                                />
                                            </FormControl>
                                            {currentValue && (
                                                <Button variant="outline" asChild>
                                                    <a
                                                        href={currentValue}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLinkIcon className="size-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        );
                    })}

                    <Button className="w-full" type="submit">
                        Save Changes
                    </Button>
                </form>
            </Form>
        </div>
    );
}
