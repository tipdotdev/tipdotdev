"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import GitHubLogo from "@/public/icons/github.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const emailFormSchema = z.object({
    email: z.string().email()
});

const tokenFormSchema = z.object({
    token: z.string().min(6)
});

export default function AuthButtons() {
    const [loading, setLoading] = useState<boolean>(false);
    const [emailSelected, setEmailSelected] = useState<boolean>(false);
    const [magicLinkSent, setMagicLinkSent] = useState<boolean>(false);
    const [enterToken, setEnterToken] = useState<boolean>(false);

    const emailForm = useForm<z.infer<typeof emailFormSchema>>({
        resolver: zodResolver(emailFormSchema),
        defaultValues: {
            email: ""
        }
    });

    const tokenForm = useForm<z.infer<typeof tokenFormSchema>>({
        resolver: zodResolver(tokenFormSchema),
        defaultValues: {
            token: ""
        }
    });

    const handleClick = async (provider: "google" | "github" | "email") => {
        setLoading(true);
        if (provider === "email") {
            setEmailSelected(true);
        } else {
            await authClient.signIn.social({
                provider,
                callbackURL: "/dashboard"
            });
        }
        setLoading(false);
    };

    async function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
        setLoading(true);
        const { error } = await authClient.signIn.magicLink({
            email: values.email,
            callbackURL: "/dashboard"
        });
        if (error) {
            toast.error("Something went wrong", {
                description: error.message
            });
        } else {
            setMagicLinkSent(true);
        }
        setLoading(false);
    }

    async function onTokenSubmit(values: z.infer<typeof tokenFormSchema>) {
        setLoading(true);
        const { error } = await authClient.magicLink.verify({
            query: {
                token: values.token
            }
        });
        if (error) {
            toast.error("Invalid token", {
                description: error.message
            });
        } else {
            toast.success("Signed in successfully");
            redirect("/dashboard");
        }
        setLoading(false);
    }

    return (
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-2 font-sans">
            {!emailSelected ? (
                <>
                    <Button
                        className="w-full"
                        onClick={() => handleClick("github")}
                        disabled={loading}
                    >
                        <GitHubLogo className="h-full w-full fill-black" />
                        Continue with GitHub
                    </Button>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleClick("google")}
                        disabled={loading}
                    >
                        <Image src="/icons/google.svg" alt="Google Logo" width={14} height={14} />
                        Continue with Google
                    </Button>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleClick("email")}
                        disabled={loading}
                    >
                        <MailIcon width={14} height={14} />
                        Continue with Email
                    </Button>
                </>
            ) : (
                <>
                    {magicLinkSent && !enterToken ? (
                        <div className="flex w-full flex-col gap-2 rounded-lg border border-green-500 bg-green-500/10 p-4">
                            <h2 className="text-lg font-bold">Magic link sent!</h2>
                            <p className="text-sm text-muted-foreground">
                                Check your email to continue.
                            </p>
                            <Button className="mt-4 w-full" onClick={() => setEnterToken(true)}>
                                Enter token manually
                            </Button>
                        </div>
                    ) : enterToken ? (
                        <Form {...tokenForm}>
                            <form
                                onSubmit={tokenForm.handleSubmit(onTokenSubmit)}
                                className="w-full space-y-8"
                            >
                                <FormField
                                    control={tokenForm.control}
                                    name="token"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Enter the token sent to your email
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="1as94kf91..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex w-full flex-col gap-2">
                                    <Button className="w-full" type="submit" disabled={loading}>
                                        Sign in
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    ) : (
                        <Form {...emailForm}>
                            <form
                                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                                className="w-full space-y-8"
                            >
                                <FormField
                                    control={emailForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Enter your email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="hi@tip.dev" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex w-full flex-col gap-2">
                                    <Button className="w-full" type="submit" disabled={loading}>
                                        Send magic link
                                    </Button>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={() => setEmailSelected(false)}
                                    >
                                        Use a different method
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </>
            )}
        </div>
    );
}
