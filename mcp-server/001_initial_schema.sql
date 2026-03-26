-- AK Golf Academy MCP Server — Supabase Schema
-- Based on AK Masterdokument v2.0

-- ============================================================
-- ENUMS (direkte fra Masterdokumentet)
-- ============================================================

CREATE TYPE player_category AS ENUM ('A','B','C','D','E','F','G','H','I','J','K');

CREATE TYPE pyramid_level AS ENUM ('FYS','TEK','SLAG','SPILL','TURN');

CREATE TYPE training_area AS ENUM (
  -- Full swing (5)
  'TEE','INN200','INN150','INN100','INN50',
  -- Nærspill (4)
  'CHIP','PITCH','LOB','BUNKER',
  -- Putting (7)
  'PUTT0-3','PUTT3-5','PUTT5-10','PUTT10-15','PUTT15-25','PUTT25-40','PUTT40+'
);

CREATE TYPE l_phase AS ENUM ('L-KROPP','L-ARM','L-KØLLE','L-BALL','L-AUTO');

CREATE TYPE cs_level AS ENUM ('CS0','CS20','CS30','CS40','CS50','CS60','CS70','CS80','CS90','CS100');

CREATE TYPE environment AS ENUM ('M0','M1','M2','M3','M4','M5');

CREATE TYPE press_level AS ENUM ('PR1','PR2','PR3','PR4','PR5');

CREATE TYPE life_code AS ENUM ('LIFE-SELV','LIFE-SOS','LIFE-EMO','LIFE-KAR','LIFE-RES');

CREATE TYPE period AS ENUM ('GRUNN','SPES','TURN');

CREATE TYPE week_type AS ENUM ('TURNERINGSUKE','TRENINGSUKE');

CREATE TYPE breaking_point_type AS ENUM ('CS','M','PR');

CREATE TYPE fys_subtype AS ENUM ('FYS_STYRKE_M0','FYS_MOBILITET_M0','FYS_POWER_M0');

CREATE TYPE turn_subtype AS ENUM ('TURN_RES','TURN_UTV','TURN_TRE');

CREATE TYPE putting_focus AS ENUM ('GREEN','SIKTE','TEKN','BALL','SPEED');

CREATE TYPE putting_phase AS ENUM ('S','B','I','F');

CREATE TYPE drill_source AS ENUM ('ak_original','external','ai_generated');

CREATE TYPE drill_difficulty AS ENUM ('nybegynner','rekrutt','klubb','regional','nasjonal','elite');

-- ============================================================
-- PLAYERS
-- ============================================================

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  birth_date DATE,
  category player_category NOT NULL DEFAULT 'K',
  avg_score NUMERIC(4,1),
  handicap NUMERIC(4,1),
  max_cs_driver NUMERIC(5,1),   -- mph
  max_cs_7iron NUMERIC(5,1),
  max_cs_wedge NUMERIC(5,1),
  current_period period DEFAULT 'GRUNN',
  facilities JSONB DEFAULT '[]',  -- tilgjengelige M-miljøer
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- DRILLS (Treningsøvelser)
-- ============================================================

CREATE TABLE drills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  goal TEXT NOT NULL,                          -- hva trener den
  instructions TEXT,                           -- steg-for-steg
  duration_minutes INT NOT NULL DEFAULT 15,
  
  -- Kobling til AK-formelen
  pyramid_level pyramid_level NOT NULL,
  training_areas training_area[] NOT NULL,     -- kan dekke flere områder
  l_phases l_phase[] NOT NULL,                 -- hvilke L-faser den passer for
  cs_min cs_level,                             -- minimum CS for denne drillen
  cs_max cs_level,                             -- maksimum CS
  environments environment[] NOT NULL,         -- hvilke miljøer den kan gjøres i
  press_levels press_level[] DEFAULT '{PR1}',  -- anbefalt pressnivå
  p_positions TEXT[],                          -- P1.0-P10.0 den fokuserer på
  life_codes life_code[],                      -- LIFE-dimensjoner
  fys_subtype fys_subtype,                     -- for FYS-driller
  turn_subtype turn_subtype,                   -- for TURN-driller
  putting_focus putting_focus,                 -- for putting-driller
  
  -- Kategorier og nivå
  min_category player_category DEFAULT 'K',    -- laveste kategori som kan bruke den
  max_category player_category DEFAULT 'A',    -- høyeste kategori
  difficulty drill_difficulty NOT NULL DEFAULT 'nybegynner',
  
  -- Utstyrskrav
  equipment TEXT[] DEFAULT '{}',               -- TrackMan, alignment sticks, etc.
  players_min INT DEFAULT 1,
  players_max INT DEFAULT 1,
  
  -- TrackMan-tags for matching
  trackman_metrics TEXT[] DEFAULT '{}',        -- clubface, swing_path, smash_factor etc.
  
  -- Metadata
  source drill_source NOT NULL DEFAULT 'ak_original',
  source_url TEXT,
  source_author TEXT,
  tags TEXT[] DEFAULT '{}',
  is_approved BOOLEAN DEFAULT false,           -- trener godkjent
  is_active BOOLEAN DEFAULT true,
  
  -- Strokes Gained kobling
  sg_area TEXT,  -- tee, approach, short_game, putting
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indekser for rask drill-søk
CREATE INDEX idx_drills_pyramid ON drills (pyramid_level);
CREATE INDEX idx_drills_areas ON drills USING GIN (training_areas);
CREATE INDEX idx_drills_l_phases ON drills USING GIN (l_phases);
CREATE INDEX idx_drills_environments ON drills USING GIN (environments);
CREATE INDEX idx_drills_trackman ON drills USING GIN (trackman_metrics);
CREATE INDEX idx_drills_tags ON drills USING GIN (tags);
CREATE INDEX idx_drills_approved ON drills (is_approved, is_active);
CREATE INDEX idx_drills_difficulty ON drills (difficulty);

-- ============================================================
-- SESSIONS (Treningsøkter)
-- ============================================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  formula_id TEXT,                             -- AK-formel økt-ID
  pyramid_level pyramid_level NOT NULL,
  training_area training_area,
  l_phase l_phase,
  cs_level cs_level,
  environment environment,
  press_level press_level,
  p_positions TEXT[],
  life_code life_code,
  period period,
  week_type week_type,
  duration_minutes INT NOT NULL,
  drill_ids UUID[] DEFAULT '{}',              -- driller brukt i økten
  notes TEXT,
  coach_notes TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),  -- spillerens egenvurdering
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sessions_player ON sessions (player_id, date DESC);
CREATE INDEX idx_sessions_period ON sessions (period, week_type);

-- ============================================================
-- TRACKMAN DATA
-- ============================================================

CREATE TABLE trackman_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  session_id UUID REFERENCES sessions(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'screenshot',  -- screenshot, csv, api
  raw_data JSONB,                    -- original parsed data
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE trackman_shots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trackman_session_id UUID NOT NULL REFERENCES trackman_sessions(id),
  club TEXT,                    -- Driver, 7-Iron, PW, etc.
  club_speed NUMERIC(5,1),     -- mph
  ball_speed NUMERIC(5,1),
  smash_factor NUMERIC(3,2),
  launch_angle NUMERIC(4,1),
  spin_rate INT,
  carry_distance NUMERIC(5,1), -- meter
  total_distance NUMERIC(5,1),
  face_angle NUMERIC(4,1),     -- grader
  club_path NUMERIC(4,1),
  attack_angle NUMERIC(4,1),
  face_to_path NUMERIC(4,1),
  apex_height NUMERIC(5,1),    -- meter
  landing_angle NUMERIC(4,1),
  lateral_landing NUMERIC(5,1), -- meter fra mål
  shot_number INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_trackman_shots_session ON trackman_shots (trackman_session_id);
CREATE INDEX idx_trackman_sessions_player ON trackman_sessions (player_id, date DESC);

-- ============================================================
-- VOICE NOTES (Coaching-notater fra tale)
-- ============================================================

CREATE TABLE voice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  session_id UUID REFERENCES sessions(id),
  author_type TEXT NOT NULL DEFAULT 'coach',  -- coach, player
  audio_url TEXT,
  transcript TEXT NOT NULL,
  summary TEXT,                                -- AI-generert oppsummering
  key_points TEXT[],                           -- AI-ekstraherte nøkkelpunkter
  tags TEXT[] DEFAULT '{}',
  duration_seconds INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_voice_notes_player ON voice_notes (player_id, created_at DESC);
CREATE INDEX idx_voice_notes_session ON voice_notes (session_id);

-- ============================================================
-- TRAINING PLANS (generert av Treningsplanlegger)
-- ============================================================

CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  week_start DATE NOT NULL,
  period period NOT NULL,
  week_type week_type NOT NULL,
  total_hours NUMERIC(4,1),
  distribution JSONB NOT NULL,  -- {TEK: 35, SLAG: 15, SPILL: 5, TURN: 0, FYS: 45}
  daily_plan JSONB NOT NULL,    -- array av dager med økter og driller
  rationale TEXT,               -- AI-forklaring for valg
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_training_plans_player ON training_plans (player_id, week_start DESC);

-- ============================================================
-- TEST RESULTS (Testprotokoller sek. 16)
-- ============================================================

CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  -- Fart
  driver_cs NUMERIC(5,1),
  iron7_cs NUMERIC(5,1),
  wedge_cs NUMERIC(5,1),
  -- Presisjon
  driver_pei NUMERIC(4,1),
  iron7_pei NUMERIC(4,1),
  wedge_pei NUMERIC(4,1),
  approach_50m_distance NUMERIC(4,1),  -- meter til hull
  approach_100m_distance NUMERIC(4,1),
  -- Putting
  putt_3ft_pct NUMERIC(4,1),
  putt_6ft_pct NUMERIC(4,1),
  putt_15ft_distance NUMERIC(4,1),  -- fot til hull
  putt_30ft_distance NUMERIC(4,1),
  -- Banespill
  stableford_9 INT,
  stableford_18 INT,
  scramble_pct NUMERIC(4,1),
  -- Fysisk
  flexibility_score INT,    -- av 6
  plank_seconds INT,
  balance_seconds INT,
  -- Mentalt
  focus_test TEXT,          -- Konsistent/Godkjent/null
  preshot_score INT,        -- av 10
  -- Metadata
  notes TEXT,
  tested_by TEXT,
  categories_passed INT,    -- av 7, for opprykk
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_test_results_player ON test_results (player_id, test_date DESC);

-- ============================================================
-- BREAKING POINTS
-- ============================================================

CREATE TABLE breaking_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  session_id UUID REFERENCES sessions(id),
  bp_type breaking_point_type NOT NULL,
  threshold TEXT NOT NULL,  -- CS70, M2, PR4 etc.
  description TEXT,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_breaking_points_player ON breaking_points (player_id, recorded_at DESC);

-- ============================================================
-- HELPER: Updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER drills_updated_at BEFORE UPDATE ON drills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
