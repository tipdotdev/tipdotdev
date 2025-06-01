"use client";

import { updateProfileSettings } from "@/actions/profile";
import {
    notificationPreferences as notificationPreferencesSchema,
    profile as profileSchema
} from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellIcon, EyeIcon, ShieldIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

const formSchema = z.object({
    showTips: z.boolean(),
    allowTips: z.boolean(),
    emailOnTip: z.boolean()
});

export function ProfileSettingsWidget({
    profile: userProfile,
    notificationPreferences: userNotificationPreferences
}: {
    profile: typeof profileSchema.$inferSelect;
    notificationPreferences: typeof notificationPreferencesSchema.$inferSelect | null;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            showTips: userProfile.showTips ?? true,
            allowTips: userProfile.allowTips ?? true,
            emailOnTip: userNotificationPreferences?.emailOnTip ?? true
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { dirtyFields } = form.formState;

        const showTips = dirtyFields.showTips ? values.showTips : (userProfile.showTips ?? true);
        const allowTips = dirtyFields.allowTips
            ? values.allowTips
            : (userProfile.allowTips ?? true);
        const emailOnTip = dirtyFields.emailOnTip
            ? values.emailOnTip
            : (userNotificationPreferences?.emailOnTip ?? true);

        const { success, error } = await updateProfileSettings(
            userProfile.userId,
            showTips,
            allowTips,
            emailOnTip
        );

        if (success) {
            toast.success("Settings updated successfully");
        } else {
            toast.error(error || "Failed to update settings");
        }
    }

    const settings = [
        {
            id: "showTips" as const,
            label: "Show Tips Received",
            description: "Display total tips received on your profile",
            icon: EyeIcon
        },
        {
            id: "allowTips" as const,
            label: "Accept Tips",
            description: "Allow people to send you tips",
            icon: ShieldIcon
        },
        {
            id: "emailOnTip" as const,
            label: "Email Notifications",
            description: "Receive email notifications for tips and messages",
            icon: BellIcon
        }
    ];

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Privacy & Settings</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {settings.map((setting, index) => {
                        const Icon = setting.icon;

                        return (
                            <div key={setting.id}>
                                <FormField
                                    control={form.control}
                                    name={setting.id}
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center justify-center gap-3">
                                                    <Icon className="size-4 text-muted-foreground/60" />
                                                    <div className="flex-1">
                                                        <FormLabel className="text-sm font-medium">
                                                            {setting.label}
                                                        </FormLabel>
                                                        <p className="text-xs text-foreground/60">
                                                            {setting.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {index < settings.length - 1 && <Separator className="mt-4" />}
                            </div>
                        );
                    })}

                    <div className="pt-2">
                        <Button className="w-full" type="submit">
                            Save Settings
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
