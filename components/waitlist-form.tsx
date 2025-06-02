"use client";

import { addToWaitlist, getWaitlistLength } from "@/actions/waitlist";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email({
        message: "Invalid email address"
    })
});

export default function WaitlistForm({
    setFormFocused
}: {
    setFormFocused: (focused: boolean) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [waitlistLength, setWaitlistLength] = useState(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const result = await addToWaitlist(values.email);
        if (result.success) {
            form.reset();
            toast.success("You're on the waitlist!", {
                description: "We'll notify you when we launch"
            });
            setWaitlistLength(waitlistLength + 1);
        } else {
            toast.error("Failed to add to waitlist", {
                description: result.error || "Please try again later."
            });
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getWaitlistLength().then((length) => {
            setWaitlistLength(length);
        });
    }, []);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-row items-end gap-2"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <p className="text-sm text-muted-foreground">
                                Join the waitlist{" "}
                                <span className="text-[10px] opacity-70">
                                    ({waitlistLength} already did)
                                </span>
                            </p>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    placeholder="hi@tip.dev"
                                    {...field}
                                    onFocus={() => setFormFocused(true)}
                                    onBlur={() => setFormFocused(false)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={
                        form.formState.isSubmitting ||
                        !form.formState.isValid ||
                        !form.getValues("email") ||
                        isLoading
                    }
                >
                    {isLoading ? <Spinner size={16} /> : <ArrowRight className="h-4 w-4" />}
                </Button>
            </form>
        </Form>
    );
}
