import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware();

export const config = {
    matcher: [
        "/api/onboarding/profile",
        "/api/onboarding/connect-stripe",
    ]
}