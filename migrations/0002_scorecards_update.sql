ALTER TABLE "scorecards" ALTER COLUMN "application_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "scorecards" ALTER COLUMN "judge_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "scorecards" ADD COLUMN IF NOT EXISTS "startup_name" text;--> statement-breakpoint
ALTER TABLE "scorecards" ADD COLUMN IF NOT EXISTS "judge_name" text;--> statement-breakpoint
ALTER TABLE "scorecards" ADD COLUMN IF NOT EXISTS "score" integer;--> statement-breakpoint
ALTER TABLE "scorecards" ADD COLUMN IF NOT EXISTS "feedback" text;--> statement-breakpoint
ALTER TABLE "scorecards" ADD COLUMN IF NOT EXISTS "evaluation_date" text;--> statement-breakpoint
ALTER TABLE "scorecards" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "scorecards" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();
