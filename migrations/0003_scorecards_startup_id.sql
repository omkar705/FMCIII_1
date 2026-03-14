ALTER TABLE "scorecards" ADD COLUMN IF NOT EXISTS "startup_id" integer REFERENCES "startups"("id");
