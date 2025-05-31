import MagicLinkTemplate from "@/emails/magic-link-template";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import { SES } from "@aws-sdk/client-ses";
import { render } from "@react-email/components";

const ses = new SES({
    region: process.env.AWS_SES_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});
const fromEmail = "tip.dev <no-reply@mail.tip.dev>";

type EmailResponse = {
    success: boolean;
    error?: string;
};

export async function sendMagicLink(
    email: string,
    url: string,
    token: string
): Promise<EmailResponse> {
    const date = new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    const emailHTML = await render(MagicLinkTemplate({ url, token, email, date }));
    const params: SendEmailCommandInput = {
        Source: fromEmail,
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: emailHTML
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Sign in to tip.dev - Magic Link"
            }
        }
    };
    const res = await ses.sendEmail(params);

    if (res.$metadata.httpStatusCode !== 200) {
        return {
            success: false,
            error: `Failed to send magic link: ${res.$metadata.httpStatusCode}`
        };
    }

    return {
        success: true
    };
}
