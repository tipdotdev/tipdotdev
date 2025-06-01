ALTER TABLE "profile" ADD COLUMN "display_name" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "banner_url" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "social_media" jsonb;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "show_tips" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "allow_tips" boolean DEFAULT true;