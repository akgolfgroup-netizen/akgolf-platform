-- Migration: Individuell Teknisk Plan
-- Oppretter enums, tabeller, indekser og fremmednøkler for fase-baserte utviklingsplaner

-- ─── Enums ───────────────────────────────────────────────────────────

CREATE TYPE technical_plan_status AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');
CREATE TYPE phase_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');
CREATE TYPE training_area AS ENUM (
  'TEE_OFF_THE_TEE',
  'APPROACH_200_PLUS',
  'APPROACH_150_200',
  'APPROACH_100_150',
  'APPROACH_50_100',
  'CHIP_PITCH_10_50',
  'BUNKER',
  'PUTTING',
  'COURSE_MANAGEMENT',
  'MENTAL_GAME',
  'PHYSICAL'
);

CREATE TYPE data_quality AS ENUM (
  'TRACKMAN_VERIFIED',
  'GPS_CALCULATED',
  'HYBRID_ESTIMATED',
  'SELF_REPORTED'
);

CREATE TYPE player_category AS ENUM (
  'BEGINNER',
  'CLUB',
  'SEMI_ELITE',
  'ELITE_JUNIOR',
  'PRO'
);

-- ─── Drills (øvelsesbank) ────────────────────────────────────────────

CREATE TABLE drills (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        TEXT NOT NULL,
  description TEXT,
  category    training_area NOT NULL,
  difficulty  INTEGER NOT NULL DEFAULT 1,
  recommended_reps INTEGER,
  recommended_sets INTEGER,
  media_urls  TEXT[] DEFAULT '{}',
  tags        TEXT[] DEFAULT '{}',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_by  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_drills_category_is_active ON drills(category, is_active);

-- ─── Technical Plans ─────────────────────────────────────────────────

CREATE TABLE technical_plans (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id      TEXT NOT NULL REFERENCES "User"(id),
  coach_id       TEXT NOT NULL REFERENCES "User"(id),
  title          TEXT NOT NULL,
  description    TEXT,
  status         technical_plan_status NOT NULL DEFAULT 'ACTIVE',
  player_category player_category DEFAULT 'BEGINNER',
  start_date     TIMESTAMPTZ,
  end_date       TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_technical_plans_player_status ON technical_plans(player_id, status);
CREATE INDEX idx_technical_plans_coach ON technical_plans(coach_id);

-- ─── Technical Plan Phases ───────────────────────────────────────────

CREATE TABLE technical_plan_phases (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  plan_id           TEXT NOT NULL REFERENCES technical_plans(id) ON DELETE CASCADE,
  phase_code        TEXT NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  "order"           INTEGER NOT NULL DEFAULT 0,

  drill_id          TEXT REFERENCES drills(id),
  custom_name       TEXT,
  custom_description TEXT,
  custom_media_urls TEXT[] DEFAULT '{}',

  target_reps       INTEGER NOT NULL DEFAULT 0,
  target_hours      DOUBLE PRECISION,
  target_balls      INTEGER,
  area              training_area NOT NULL,
  environment       TEXT NOT NULL DEFAULT 'M1',

  completed_reps    INTEGER NOT NULL DEFAULT 0,
  completed_hours   DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  completed_balls   INTEGER NOT NULL DEFAULT 0,
  status            phase_status NOT NULL DEFAULT 'NOT_STARTED',

  start_date        TIMESTAMPTZ,
  end_date          TIMESTAMPTZ,
  last_session_at   TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_technical_plan_phases_plan_code ON technical_plan_phases(plan_id, phase_code);
CREATE INDEX idx_technical_plan_phases_plan_status ON technical_plan_phases(plan_id, status);
CREATE INDEX idx_technical_plan_phases_plan_order ON technical_plan_phases(plan_id, "order");

-- ─── Technical Plan Sessions (loggede økter) ─────────────────────────

CREATE TABLE technical_plan_sessions (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  phase_id          TEXT NOT NULL REFERENCES technical_plan_phases(id) ON DELETE CASCADE,
  training_log_id   TEXT,

  reps_done         INTEGER NOT NULL DEFAULT 0,
  hours_done        DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  balls_done        INTEGER,
  quality_score     INTEGER,
  notes             TEXT,

  verified_by_coach BOOLEAN NOT NULL DEFAULT false,
  verified_at       TIMESTAMPTZ,
  coach_note        TEXT,

  track_man_session_id TEXT,
  track_man_verified   BOOLEAN NOT NULL DEFAULT false,

  auto_matched      BOOLEAN NOT NULL DEFAULT false,
  match_score       INTEGER,
  match_warnings    TEXT[] DEFAULT '{}',

  data_quality      data_quality DEFAULT 'SELF_REPORTED',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_technical_plan_sessions_phase ON technical_plan_sessions(phase_id);
CREATE INDEX idx_technical_plan_sessions_training_log ON technical_plan_sessions(training_log_id);

-- ─── Trigger for updated_at på technical_plans ───────────────────────

CREATE OR REPLACE FUNCTION update_technical_plan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_technical_plans_updated_at
BEFORE UPDATE ON technical_plans
FOR EACH ROW
EXECUTE FUNCTION update_technical_plan_updated_at();

-- ─── Row Level Security (RLS) ────────────────────────────────────────

ALTER TABLE technical_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_plan_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_plan_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;

-- RLS-policy: Spillere ser egne planer, coacher ser egne spillere, admins ser alt
CREATE POLICY technical_plans_select ON technical_plans
FOR SELECT USING (
  auth.uid()::text = player_id
  OR auth.uid()::text = coach_id
  OR EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'ADMIN')
);

CREATE POLICY technical_plans_insert ON technical_plans
FOR INSERT WITH CHECK (
  auth.uid()::text = coach_id
  OR EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'ADMIN')
);

CREATE POLICY technical_plans_update ON technical_plans
FOR UPDATE USING (
  auth.uid()::text = coach_id
  OR EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'ADMIN')
);

CREATE POLICY technical_plans_delete ON technical_plans
FOR DELETE USING (
  auth.uid()::text = coach_id
  OR EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'ADMIN')
);

-- Faser arver tilgang fra plan
CREATE POLICY technical_plan_phases_select ON technical_plan_phases
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM technical_plans tp
    WHERE tp.id = technical_plan_phases.plan_id
    AND (tp.player_id = auth.uid()::text OR tp.coach_id = auth.uid()::text
         OR EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'ADMIN'))
  )
);

CREATE POLICY technical_plan_phases_insert ON technical_plan_phases
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM technical_plans tp
    WHERE tp.id = technical_plan_phases.plan_id
    AND (tp.coach_id = auth.uid()::text
         OR EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'ADMIN'))
  )
);

CREATE POLICY technical_plan_phases_update ON technical_plan_phases
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM technical_plans tp
    WHERE tp.id = technical_plan_phases.plan_id
    AND (tp.coach_id = auth.uid()::text
         OR EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'ADMIN'))
  )
);

CREATE POLICY technical_plan_phases_delete ON technical_plan_phases
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM technical_plans tp
    WHERE tp.id = technical_plan_phases.plan_id
    AND (tp.coach_id = auth.uid()::text
         OR EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'ADMIN'))
  )
);

-- Sessions: spillere logger egne, coacher verifiserer
CREATE POLICY technical_plan_sessions_select ON technical_plan_sessions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM technical_plan_phases tpp
    JOIN technical_plans tp ON tp.id = tpp.plan_id
    WHERE tpp.id = technical_plan_sessions.phase_id
    AND (tp.player_id = auth.uid()::text OR tp.coach_id = auth.uid()::text
         OR EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'ADMIN'))
  )
);

CREATE POLICY technical_plan_sessions_insert ON technical_plan_sessions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM technical_plan_phases tpp
    JOIN technical_plans tp ON tp.id = tpp.plan_id
    WHERE tpp.id = technical_plan_sessions.phase_id
    AND tp.player_id = auth.uid()::text
  )
);

CREATE POLICY technical_plan_sessions_update ON technical_plan_sessions
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM technical_plan_phases tpp
    JOIN technical_plans tp ON tp.id = tpp.plan_id
    WHERE tpp.id = technical_plan_sessions.phase_id
    AND (tp.coach_id = auth.uid()::text
         OR EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'ADMIN'))
  )
);

-- Drills: alle aktive drills er lesbare for staff; eier kan redigere
CREATE POLICY drills_select ON drills
FOR SELECT USING (is_active = true);

CREATE POLICY drills_insert ON drills
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role IN ('ADMIN', 'INSTRUCTOR'))
);

CREATE POLICY drills_update ON drills
FOR UPDATE USING (
  created_by = auth.uid()::text
  OR EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'ADMIN')
);
