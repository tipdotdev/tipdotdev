ALTER TABLE "transaction" DROP CONSTRAINT "transaction_from_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_to_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "from_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "to_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "stripe_fee" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "net_amount" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_from_user_id_user_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_to_user_id_user_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;