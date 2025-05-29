ALTER TABLE "profile" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "stripe_acct_id" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "stripe_connected" boolean NOT NULL;