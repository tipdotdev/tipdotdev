import { createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // The `/auth/callback` route is required for the server-side auth flow implemented
    // by the SSR package. It exchanges an auth code for the user's session.
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

    if (code) {
        const supabase = await createServerClient();
        await supabase.auth.exchangeCodeForSession(code);
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Error getting user:", error);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in`);
        }

        // if the user was created in teh last 30 seconds, redirect to the onboarding page
        const createdAt = new Date(data.user.created_at);
        const now = new Date();
        const diff = Math.abs(now.getTime() - createdAt.getTime());
        const diffSeconds = Math.floor(diff / 1000);
        if (diffSeconds < 30) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/username`);
        }
    }

    if (redirectTo) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}${redirectTo}`);
    }

    // URL to redirect to after sign up process completes
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
}
