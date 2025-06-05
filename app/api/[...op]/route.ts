import { createNextRouteHandler } from "@openpanel/nextjs/server";

export const POST = createNextRouteHandler({
    apiUrl: "https://op.kyle.so/api"
});
