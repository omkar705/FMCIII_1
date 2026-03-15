-- Create judges table
CREATE TABLE IF NOT EXISTS "judges" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);

-- Insert 4 default judges
INSERT INTO "judges" ("name") VALUES
  ('Judge #1'),
  ('Judge #2'),
  ('Judge #3'),
  ('Judge #4')
ON CONFLICT DO NOTHING;

-- Add judge_ref_id to scorecards (references judges table)
ALTER TABLE "scorecards" ADD COLUMN IF NOT EXISTS "judge_ref_id" integer REFERENCES "judges"("id") ON DELETE SET NULL;

-- Add status to scorecards
ALTER TABLE "scorecards" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'pending';

-- Create scorecard_parameters table
CREATE TABLE IF NOT EXISTS "scorecard_parameters" (
  "id" serial PRIMARY KEY,
  "scorecard_id" integer NOT NULL REFERENCES "scorecards"("id") ON DELETE CASCADE,
  "parameter_name" text NOT NULL,
  "marks" integer,
  "max_marks" integer NOT NULL DEFAULT 15
);
