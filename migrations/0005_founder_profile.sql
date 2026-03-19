-- Add founder profile columns to startups table
ALTER TABLE "startups" ADD COLUMN IF NOT EXISTS "user_id" integer REFERENCES "users"("id");
ALTER TABLE "startups" ADD COLUMN IF NOT EXISTS "stage" text;
ALTER TABLE "startups" ADD COLUMN IF NOT EXISTS "location" text;
ALTER TABLE "startups" ADD COLUMN IF NOT EXISTS "website" text;

-- Seed sample Lenskart founder account (role_id=2 = Startup Founder / Incubatee)
-- Password: password123
INSERT INTO "users" ("email", "password_hash", "name", "role_id", "status")
VALUES (
  'lenskart@gmail.com',
  '$2b$10$PSS9Uwzac3anlttJj0kmp.MRqbE6DfmwFFukUSdaXtlBAJnpGSHjG',
  'Lenskart',
  2,
  'active'
)
ON CONFLICT (email) DO NOTHING;
