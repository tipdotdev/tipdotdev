import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import MagicLinkTemplate from "@/emails/magic-link-template";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import { SES } from "@aws-sdk/client-ses";
import { render } from "@react-email/components";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous, magicLink } from "better-auth/plugins";

const ses = new SES({
    region: process.env.AWS_SES_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});
const fromEmail = "tip.dev <no-reply@mail.tip.dev>";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            session,
            account,
            verification
        }
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }
    },
    plugins: [
        anonymous(),
        magicLink({
            sendMagicLink: async ({ email, url, token }) => {
                const emailHTML = await render(MagicLinkTemplate({ url, token }));
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
                            Data: "tip.dev Magic Link"
                        }
                    }
                };
                const res = await ses.sendEmail(params);

                if (res.$metadata.httpStatusCode !== 200) {
                    console.error(
                        "[ERROR] Failed to send magic link:",
                        res.$metadata.httpStatusCode
                    );
                    throw new Error("Failed to send magic link");
                }
            }
        })
    ]
});
