import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABSE_URL!;

export default defineConfig({
    out: "./drizzle",
    schema: "./db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: DATABASE_URL
    }
});
