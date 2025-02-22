import { completeTransaction } from "@/actions/stripe";
import { createServerClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    try {
        const sb = await createServerClient();
        const {
            data: { user },
            error
        } = await sb.auth.getUser();

        if (error || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        // get the payment intent id from the request body
        const { payment_intent } = await request.json();

        // complete the transaction
        const { success } = await completeTransaction(payment_intent);

        if (!success) {
            return new Response(JSON.stringify({ error: "Transaction failed" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // return a 200 status
        return new Response(JSON.stringify({ success }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
