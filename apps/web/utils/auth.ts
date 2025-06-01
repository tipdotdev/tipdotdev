import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous, magicLink } from "better-auth/plugins";
import {
    sendAccountDeletion,
    sendEmailChangeConfirmation,
    sendMagicLink,
    sendVerifyEmail
} from "./email";

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
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }) => {
            const { success, error } = await sendVerifyEmail(user.email, url, token);
            if (!success) {
                throw new Error(error ?? "Failed to send email verification");
            }
        },
        autoSignInAfterVerification: true,
        sendOnSignUp: true
    },
    user: {
        changeEmail: {
            enabled: false,
            sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
                const { success, error } = await sendEmailChangeConfirmation(
                    user.email,
                    newEmail,
                    url,
                    token
                );
                if (!success) {
                    throw new Error(error ?? "Failed to send email change confirmation");
                }
            }
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url, token }) => {
                const { success, error } = await sendAccountDeletion(user.email, url, token);
                if (!success) {
                    throw new Error(error ?? "Failed to send delete account verification");
                }
            }
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
