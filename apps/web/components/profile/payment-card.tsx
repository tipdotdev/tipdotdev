"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
    amount: z.number().int().positive().min(3).max(1000),
    email: z.string().email(),
    message: z.string().max(1000).optional()
});

export default function PaymentCard({ username }: { username: string }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 5,
            email: "",
            message: ""
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Card className="w-full border-border/40 bg-card/40 p-4">
            <CardHeader className="p-0">
                <CardTitle className="text-foreground/60">Support {username}</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 p-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-2xl text-foreground/60">
                                                $
                                            </span>
                                            <Input
                                                placeholder="5"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(parseInt(e.target.value) || 0);
                                                }}
                                                className="h-12 pl-8 font-extrabold"
                                                style={{ fontSize: "1.5rem" }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Message (optional)"
                                            className="h-32 resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" size="lg">
                            Tip {username} ${form.getValues("amount") || "0"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
