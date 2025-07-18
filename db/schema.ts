import {
    boolean,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp
} from "drizzle-orm/pg-core";

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
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    bannerUrl: text("banner_url"),
    bannerKey: text("banner_key"),
    avatarKey: text("avatar_key"),
    bio: text("bio"),
    website: text("website"),
    socialMedia: jsonb("social_media").$defaultFn(() => ({
        twitter: null,
        github: null,
        instagram: null
    })),
    showTips: boolean("show_tips").default(true),
    allowTips: boolean("allow_tips").default(true),
    stripeAcctID: text("stripe_acct_id"),
    stripeConnected: boolean("stripe_connected")
        .$defaultFn(() => false)
        .notNull()
});

export const transaction = pgTable("transaction", {
    id: serial("id").primaryKey(),
    fromUserId: text("from_user_id").references(() => user.id, { onDelete: "set null" }),
    toUserId: text("to_user_id").references(() => user.id, { onDelete: "set null" }),
    amount: integer("amount").notNull(),
    applicationFee: integer("application_fee")
        .$defaultFn(() => 0)
        .notNull(),
    stripeFee: integer("stripe_fee")
        .$defaultFn(() => 0)
        .notNull(),
    netAmount: integer("net_amount").notNull(),
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

export const waitlist = pgTable("waitlist", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    isSubscribed: boolean("is_subscribed")
        .$defaultFn(() => true)
        .notNull()
});

export const notificationPreferences = pgTable("notification_preferences", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: "cascade" }),
    emailOnTip: boolean("email_on_tip").notNull().default(true),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull()
});

export const webhook = pgTable("webhook", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    endpointUrl: text("endpoint_url").notNull(),
    secret: text("secret").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    eventTypes: text("event_types").notNull().array().default([]),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull()
});

const statusEnum = pgEnum("status", ["success", "error", "pending"]);
export const webhookLog = pgTable("webhook_log", {
    id: serial("id").primaryKey(),
    webhookId: integer("webhook_id")
        .notNull()
        .references(() => webhook.id, { onDelete: "cascade" }),
    status: statusEnum("status").notNull().default("pending"),
    response: jsonb("response"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull()
});
