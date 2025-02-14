"use client";

import { checkUsernameAvailability, insertUsername } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    username: z.preprocess(
        (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
        z
            .string()
            .min(2, { message: "Username must be at least 2 characters." })
            .max(50, { message: "Username cannot be more than 50 characters." })
            .regex(/^[a-z0-9\-_]+$/, {
                message:
                    "Username must be URL-safe (only lowercase letters, digits, hyphens, and underscores allowed)."
            })
    )
});

export default function Page() {
    const [usernameAvailable, setUsernameAvailable] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: ""
        }
    });

    // Watch for changes in the username field.
    const usernameValue = form.watch("username");

    // Use a debounce effect: 1 second delay after the last change.
    useEffect(() => {
        // If the username is empty or too short, reset the availability.
        if (!usernameValue || usernameValue.length < 2) {
            setUsernameAvailable(false);
            return;
        }

        const handler = setTimeout(() => {
            checkUsernameAvailability(usernameValue)
                .then((available) => {
                    setUsernameAvailable(available);
                })
                .catch(() => {
                    toast.error("Error checking username availability");
                });
        }, 1000); // 1 second debounce delay

        return () => {
            clearTimeout(handler);
        };
    }, [usernameValue]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        insertUsername(values.username)
            .then(() => {
                toast.success("Username set successfully!");
                window.location.href = "/onboarding/payouts";
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }

    return (
        <div className="flex min-h-screen flex-col font-mono font-normal">
            <div className="absolute top-4 flex w-full items-center justify-center px-4">
                <Progress value={25} className="w-full md:w-1/3" />
            </div>
            <section className="relative flex h-screen flex-col items-center justify-center px-4 py-8">
                <div className="flex w-full max-w-md flex-col gap-2">
                    <p className="text-xs">Let&apos;s get you set up.</p>
                    <h2 className="text-xl text-white">Choose your username!</h2>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="mt-8 space-y-8 font-sans"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-foreground/40">
                                                    tip.dev/
                                                </span>
                                                <Input
                                                    placeholder="kyle"
                                                    {...field}
                                                    className="pl-[3.8rem] pr-16"
                                                />
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    {usernameAvailable ? (
                                                        <CheckIcon className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <XIcon className="h-5 w-5 text-red-500" />
                                                    )}
                                                </span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={!usernameAvailable}>
                                Next
                            </Button>
                        </form>
                    </Form>
                </div>
            </section>
        </div>
    );
}
