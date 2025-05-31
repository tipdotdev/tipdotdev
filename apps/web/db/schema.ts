import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified")
        .$defaultFn(() => false)
        .notNull(),
    image: text("image"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    isAnonymous: boolean("is_anonymous")
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" })
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull()
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date())
});

export const profile = pgTable("profile", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    username: text("username").notNull().unique(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    website: text("website"),
    stripeAcctID: text("stripe_acct_id"),
    stripeConnected: boolean("stripe_connected")
        .$defaultFn(() => false)
        .notNull()
});

export const transaction = pgTable("transaction", {
    id: serial("id").primaryKey(),
    fromUserId: text("from_user_id")
        .notNull()
        .references(() => user.id, { onDelete: "no action" }),
    toUserId: text("to_user_id")
        .notNull()
        .references(() => user.id, { onDelete: "no action" }),
    amount: integer("amount").notNull(),
    // TODO: migrate this
    // applicationFee: integer("application_fee")
    //     .$defaultFn(() => 0)
    //     .notNull(),
    stripeId: text("stripe_id").notNull(),
    type: text("type").notNull(),
    isCompleted: boolean("is_completed")
        .$defaultFn(() => false)
        .notNull(),
    message: text("message"),
    fromUserEmail: text("from_user_email"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull()
});
