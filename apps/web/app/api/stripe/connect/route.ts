import { createServerClient } from "@/utils/supabase/server";
import { Stripe } from "stripe";

export async function POST() {
    try {
        // get the user making the request
        const sb = await createServerClient();
        const {
            data: { user },
            error
        } = await sb.auth.getUser();

        if (error || !user) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized: You must be signed in to perform this action"
                }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });

        const stripeAccount = await stripe.accounts.create({
            type: "express",
            country: "US",
            default_currency: "usd",
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            },
            email: user.email
        });

        // save the stripe account id to the user
        const data = await sb
            .from("profiles")
            .update({ stripe_account_id: stripeAccount.id })
            .eq("id", user.id)
            .select();

        if (data.error) {
            return new Response(
                JSON.stringify({
                    error: "An error occurred while creating your stripe account. Please try again later."
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // make an account link
        const accountLink = await stripe.accountLinks.create({
            account: stripeAccount.id,
            refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings/payout`,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
            type: "account_onboarding"
        });

        return new Response(JSON.stringify({ account_link_url: accountLink.url }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // If something goes wrong, return an error response
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
}
