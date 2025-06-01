import { ourFileRouter } from "@/lib/uploadthing";
import { createRouteHandler } from "uploadthing/next";

export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
    config: {
        token: process.env.UPLOADTHING_TOKEN
    }
});
