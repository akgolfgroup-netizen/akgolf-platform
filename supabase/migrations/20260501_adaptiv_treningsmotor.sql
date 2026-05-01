-- Adaptiv Treningsmotor — nye tabeller og enums
-- Kjøres i Supabase SQL Editor (https://supabase.com/dashboard/project/ijuecwcucbwqqvyavqan/sql)

-- Nye enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PlayerType') THEN
    CREATE TYPE "PlayerType" AS ENUM ('HOBBY', 'SCORE_REDUCTION', 'TOURNAMENT', 'FITNESS');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ClubSpeedSource') THEN
    CREATE TYPE "ClubSpeedSource" AS ENUM ('BASELINE_TEST', 'MANUAL', 'HCP_AVERAGE');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CoachAssignmentStatus') THEN
    CREATE TYPE "CoachAssignmentStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ENDED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CoachAssignmentScope') THEN
    CREATE TYPE "CoachAssignmentScope" AS ENUM ('FULL', 'READ_ONLY', 'PLAN_ONLY');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CoachAssignmentSource') THEN
    CREATE TYPE "CoachAssignmentSource" AS ENUM ('BOOKING', 'SUBSCRIPTION', 'MANUAL_GRANT');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ConsentTier') THEN
    CREATE TYPE "ConsentTier" AS ENUM ('TIER_1_SERVICE', 'TIER_2_IMPROVEMENT', 'TIER_3_AI_RESEARCH', 'TIER_4_COMMERCIAL');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ConsentSource') THEN
    CREATE TYPE "ConsentSource" AS ENUM ('ONBOARDING', 'PROFILE_PAGE', 'PARENTAL_CONSENT', 'API');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AccessorType') THEN
    CREATE TYPE "AccessorType" AS ENUM ('COACH', 'ADMIN', 'AI_PIPELINE', 'SYSTEM', 'USER');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AllocationSource') THEN
    CREATE TYPE "AllocationSource" AS ENUM ('SELF_RATED', 'HCP_BASELINE', 'IMPORTED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CalendarEventSource') THEN
    CREATE TYPE "CalendarEventSource" AS ENUM ('TRAINING_SESSION_INDIVIDUAL', 'TRAINING_SESSION_GROUP', 'TOURNAMENT', 'BOOKING');
  END IF;
END
$$;

-- Nye kolonner på User
ALTER TABLE "User" 
  ADD COLUMN IF NOT EXISTS "averageScore" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "ageYears" INTEGER,
  ADD COLUMN IF NOT EXISTS "weeklyTrainingHours" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "homeCourseId" TEXT,
  ADD COLUMN IF NOT EXISTS "playerType" "PlayerType" DEFAULT 'HOBBY';

-- Nye kolonner på ExerciseDefinition
ALTER TABLE "ExerciseDefinition"
  ADD COLUMN IF NOT EXISTS "csTargetMin" INTEGER,
  ADD COLUMN IF NOT EXISTS "csTargetMax" INTEGER,
  ADD COLUMN IF NOT EXISTS "clubKey" TEXT,
  ADD COLUMN IF NOT EXISTS "distanceBucket" TEXT;

-- Ny kolonne på GroupMembership
ALTER TABLE "GroupMembership"
  ADD COLUMN IF NOT EXISTS "active" BOOLEAN DEFAULT true;

-- HomeCourse
CREATE TABLE IF NOT EXISTS "HomeCourse" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL UNIQUE,
  "courseName" TEXT NOT NULL,
  "golfboxId" TEXT,
  "totalLengthMeters" INTEGER NOT NULL,
  par INTEGER NOT NULL,
  holes JSONB NOT NULL,
  "dominantApproachBuckets" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT "HomeCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "HomeCourse_userId_idx" ON "HomeCourse"("userId");

-- ClubSpeedProfile
CREATE TABLE IF NOT EXISTS "ClubSpeedProfile" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL UNIQUE,
  source "ClubSpeedSource" NOT NULL,
  "measuredAt" TIMESTAMPTZ DEFAULT now(),
  "testResultId" TEXT,
  clubs JSONB NOT NULL,
  "validUntil" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT "ClubSpeedProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "ClubSpeedProfile_userId_idx" ON "ClubSpeedProfile"("userId");

-- CoachAssignment
CREATE TABLE IF NOT EXISTS "CoachAssignment" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "coachId" TEXT NOT NULL,
  status "CoachAssignmentStatus" DEFAULT 'ACTIVE',
  scope "CoachAssignmentScope" DEFAULT 'FULL',
  "createdBy" "CoachAssignmentSource" NOT NULL,
  "startedAt" TIMESTAMPTZ DEFAULT now(),
  "endedAt" TIMESTAMPTZ,
  notes TEXT,
  CONSTRAINT "CoachAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
  CONSTRAINT "CoachAssignment_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "CoachAssignment_userId_status_idx" ON "CoachAssignment"("userId", status);
CREATE INDEX IF NOT EXISTS "CoachAssignment_coachId_status_idx" ON "CoachAssignment"("coachId", status);

-- ConsentGrant
CREATE TABLE IF NOT EXISTS "ConsentGrant" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  tier "ConsentTier" NOT NULL,
  granted BOOLEAN NOT NULL,
  "grantedAt" TIMESTAMPTZ DEFAULT now(),
  "revokedAt" TIMESTAMPTZ,
  "policyVersion" TEXT DEFAULT '1.0',
  source "ConsentSource" NOT NULL,
  "ipAddress" TEXT,
  CONSTRAINT "ConsentGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "ConsentGrant_userId_tier_idx" ON "ConsentGrant"("userId", tier);

-- DataAccessLog
CREATE TABLE IF NOT EXISTS "DataAccessLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "accessedBy" "AccessorType" NOT NULL,
  "accessedById" TEXT,
  purpose TEXT NOT NULL,
  fields TEXT[] DEFAULT '{}',
  "occurredAt" TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT "DataAccessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "DataAccessLog_userId_occurredAt_idx" ON "DataAccessLog"("userId", "occurredAt");

-- PlayerAllocation
CREATE TABLE IF NOT EXISTS "PlayerAllocation" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "generatedAt" TIMESTAMPTZ DEFAULT now(),
  "validFrom" TIMESTAMPTZ NOT NULL,
  "validTo" TIMESTAMPTZ NOT NULL,
  "weeklyHours" DOUBLE PRECISION NOT NULL,
  weeks JSONB NOT NULL,
  rationale TEXT[] DEFAULT '{}',
  source "AllocationSource" NOT NULL,
  "inputSnapshot" JSONB NOT NULL,
  "rationaleAi" TEXT,
  CONSTRAINT "PlayerAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "PlayerAllocation_userId_generatedAt_idx" ON "PlayerAllocation"("userId", "generatedAt");

-- CalendarEvent
CREATE TABLE IF NOT EXISTS "CalendarEvent" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  source "CalendarEventSource" NOT NULL,
  "sourceId" TEXT NOT NULL,
  title TEXT NOT NULL,
  "startsAt" TIMESTAMPTZ NOT NULL,
  "endsAt" TIMESTAMPTZ NOT NULL,
  location TEXT,
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT "CalendarEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
  UNIQUE ("userId", source, "sourceId")
);
CREATE INDEX IF NOT EXISTS "CalendarEvent_userId_startsAt_idx" ON "CalendarEvent"("userId", "startsAt");

-- TournamentRegistration
CREATE TABLE IF NOT EXISTS "TournamentRegistration" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  name TEXT NOT NULL,
  "startsAt" TIMESTAMPTZ NOT NULL,
  "endsAt" TIMESTAMPTZ,
  course TEXT,
  importance INTEGER NOT NULL,
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT "TournamentRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "TournamentRegistration_userId_startsAt_idx" ON "TournamentRegistration"("userId", "startsAt");

-- CoachAgentSession
CREATE TABLE IF NOT EXISTS "CoachAgentSession" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "coachId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  "appliedPlanId" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT "CoachAgentSession_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"(id),
  CONSTRAINT "CoachAgentSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"(id)
);
CREATE INDEX IF NOT EXISTS "CoachAgentSession_coachId_createdAt_idx" ON "CoachAgentSession"("coachId", "createdAt");
CREATE INDEX IF NOT EXISTS "CoachAgentSession_studentId_idx" ON "CoachAgentSession"("studentId");

-- RLS policies (disable for now, enable when auth layer is ready)
ALTER TABLE "HomeCourse" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClubSpeedProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CoachAssignment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConsentGrant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DataAccessLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PlayerAllocation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CalendarEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TournamentRegistration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CoachAgentSession" ENABLE ROW LEVEL SECURITY;
