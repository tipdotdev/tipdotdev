import { getProfileByUserId } from "@/actions/profile";
import { completeTransaction } from "@/actions/stripe";
import { getSelfUser } from "@/actions/user";
import { sendTipReceipts } from "@/utils/email";

export async function POST(request: Request) {
    try {
        const user = await getSelfUser();

        if (!user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        const profile = await getProfileByUserId(user.id);

        // get the payment intent id from the request body
        const { payment_intent } = await request.json();

        // complete the transaction
        const { success, transaction, paymentMethod, alreadyProcessed } =
            await completeTransaction(payment_intent);

        if (!success) {
            return new Response(JSON.stringify({ error: "Transaction failed" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Only send emails if this is a newly completed transaction
        if (!alreadyProcessed) {
            // send the tip emails
            const { success: senderEmailSuccess } = await sendTipReceipts({
                senderEmail: transaction.fromUserEmail || "",
                recieverEmail: user.email,
                recieverUsername: profile?.username || "",
                recieverAvatar: profile?.avatarUrl || "",
                recieverBio: undefined,
                message: transaction.message || undefined,
                amount: transaction.amount,
                processingFee: 0,
                date: new Date().toISOString(),
                tipId: transaction.id.toString(),
                paymentMethod: paymentMethod || ""
            });

            if (!senderEmailSuccess) {
                console.log("Failed to send tip receipt", senderEmailSuccess);
            }
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
