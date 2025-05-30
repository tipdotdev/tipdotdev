import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous, magicLink } from "better-auth/plugins";
import { sendMagicLink } from "./email";

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
                const { success, error } = await sendMagicLink(email, url, token);
                if (!success) {
                    throw new Error(error);
                }
            }
        })
    ]
});
