-- ============================================================
-- FMCIII Portal – RBAC Schema & RLS Policies
-- Run this migration in your Supabase SQL Editor or via
-- the Supabase CLI: `supabase db push`
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Roles reference table
--    Seed the four application roles if they don't exist yet.
-- ────────────────────────────────────────────────────────────
INSERT INTO roles (id, name, description) VALUES
  (1, 'admin',           'Full access to all portal modules'),
  (2, 'startup_founder', 'Access to own startup profile, applications, mentorship and knowledge base'),
  (3, 'mentor',          'Access to mentorship, scorecards and knowledge base'),
  (4, 'investor',        'Access to funding and knowledge base')
ON CONFLICT (id) DO UPDATE
  SET name        = EXCLUDED.name,
      description = EXCLUDED.description;

-- ────────────────────────────────────────────────────────────
-- 2. Users table – ensure role_id column + FK exist
--    (Drizzle migrations handle this; included here for
--     reference / manual Supabase setup)
-- ────────────────────────────────────────────────────────────
-- ALTER TABLE users
--   ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id),
--   ADD COLUMN IF NOT EXISTS name    TEXT NOT NULL DEFAULT '',
--   ADD COLUMN IF NOT EXISTS email   TEXT NOT NULL UNIQUE,
--   ADD COLUMN IF NOT EXISTS phone   TEXT,
--   ADD COLUMN IF NOT EXISTS status  TEXT DEFAULT 'active';

-- ────────────────────────────────────────────────────────────
-- 3. Enable Row Level Security on sensitive tables
-- ────────────────────────────────────────────────────────────
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups         ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecards       ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fundings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base   ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- 4. Helper function: current user's role_id
--    (Assumes the application sets `app.current_user_id`
--     before each query via `SET LOCAL app.current_user_id = <id>`)
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION current_user_role_id()
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
  SELECT role_id
  FROM   users
  WHERE  id = NULLIF(current_setting('app.current_user_id', true), '')::INTEGER;
$$;

-- ────────────────────────────────────────────────────────────
-- 5. RLS Policies
-- ────────────────────────────────────────────────────────────

-- ── users ──────────────────────────────────────────────────
-- Admins can see all users; others can only see their own row
DROP POLICY IF EXISTS "users_select" ON users;
CREATE POLICY "users_select" ON users
  FOR SELECT USING (
    current_user_role_id() = 1                          -- admin
    OR id = NULLIF(current_setting('app.current_user_id', true), '')::INTEGER
  );

-- Only admins can update role; users can update their own name/phone
DROP POLICY IF EXISTS "users_update_admin" ON users;
CREATE POLICY "users_update_admin" ON users
  FOR UPDATE USING (current_user_role_id() = 1);

DROP POLICY IF EXISTS "users_update_self" ON users;
CREATE POLICY "users_update_self" ON users
  FOR UPDATE USING (
    id = NULLIF(current_setting('app.current_user_id', true), '')::INTEGER
  )
  WITH CHECK (
    -- Prevent self-escalation of role
    role_id IS NOT DISTINCT FROM (SELECT role_id FROM users WHERE id = users.id)
  );

-- ── startups ───────────────────────────────────────────────
DROP POLICY IF EXISTS "startups_select" ON startups;
CREATE POLICY "startups_select" ON startups
  FOR SELECT USING (
    current_user_role_id() IN (1, 3, 4)                 -- admin, mentor, investor
    OR user_id = NULLIF(current_setting('app.current_user_id', true), '')::INTEGER
  );

DROP POLICY IF EXISTS "startups_insert" ON startups;
CREATE POLICY "startups_insert" ON startups
  FOR INSERT WITH CHECK (current_user_role_id() IN (1, 2));

DROP POLICY IF EXISTS "startups_update" ON startups;
CREATE POLICY "startups_update" ON startups
  FOR UPDATE USING (
    current_user_role_id() = 1
    OR user_id = NULLIF(current_setting('app.current_user_id', true), '')::INTEGER
  );

-- ── applications ───────────────────────────────────────────
DROP POLICY IF EXISTS "applications_select" ON applications;
CREATE POLICY "applications_select" ON applications
  FOR SELECT USING (
    current_user_role_id() IN (1, 3, 4)
    OR startup_id IN (
      SELECT id FROM startups
      WHERE user_id = NULLIF(current_setting('app.current_user_id', true), '')::INTEGER
    )
  );

-- ── scorecards ─────────────────────────────────────────────
DROP POLICY IF EXISTS "scorecards_select" ON scorecards;
CREATE POLICY "scorecards_select" ON scorecards
  FOR SELECT USING (current_user_role_id() IN (1, 3));   -- admin + mentor

DROP POLICY IF EXISTS "scorecards_write" ON scorecards;
CREATE POLICY "scorecards_write" ON scorecards
  FOR ALL USING (current_user_role_id() IN (1, 3));

-- ── mentor_assignments ─────────────────────────────────────
DROP POLICY IF EXISTS "mentor_assignments_select" ON mentor_assignments;
CREATE POLICY "mentor_assignments_select" ON mentor_assignments
  FOR SELECT USING (
    current_user_role_id() IN (1, 3)
    OR startup_id IN (
      SELECT id FROM startups
      WHERE user_id = NULLIF(current_setting('app.current_user_id', true), '')::INTEGER
    )
  );

-- ── fundings ───────────────────────────────────────────────
DROP POLICY IF EXISTS "fundings_select" ON fundings;
CREATE POLICY "fundings_select" ON fundings
  FOR SELECT USING (current_user_role_id() IN (1, 4));   -- admin + investor

DROP POLICY IF EXISTS "fundings_write" ON fundings;
CREATE POLICY "fundings_write" ON fundings
  FOR ALL USING (current_user_role_id() IN (1, 4));

-- ── knowledge_base ─────────────────────────────────────────
DROP POLICY IF EXISTS "knowledge_base_select" ON knowledge_base;
CREATE POLICY "knowledge_base_select" ON knowledge_base
  FOR SELECT USING (true);                               -- all authenticated users

DROP POLICY IF EXISTS "knowledge_base_write" ON knowledge_base;
CREATE POLICY "knowledge_base_write" ON knowledge_base
  FOR ALL USING (current_user_role_id() = 1);           -- only admin can write

-- ────────────────────────────────────────────────────────────
-- 6. Summary of role permissions
-- ────────────────────────────────────────────────────────────
-- Role               | Dashboard | Startups | Applications | Mentorship | Funding | Scorecards | KnowledgeBase | Bookings | UserMgmt
-- admin (1)          |    ✓      |    ✓     |      ✓       |     ✓      |    ✓    |     ✓      |       ✓       |    ✓     |    ✓
-- startup_founder(2) |  ✗→/profile| ✗      |      ✓(own)  |     ✓      |    ✗    |     ✗      |       ✓       |    ✓     |    ✗
-- mentor (3)         |✗→/mentor-profile|✗   |      ✗       |     ✓      |    ✗    |     ✓      |       ✓       |    ✗     |    ✗
-- investor (4)       |✗→/investor-profile|✗ |      ✗       |     ✗      |    ✓    |     ✗      |       ✓       |    ✗     |    ✗
