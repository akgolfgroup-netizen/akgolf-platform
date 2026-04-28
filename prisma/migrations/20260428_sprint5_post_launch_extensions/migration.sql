-- Sprint 5 — Post-launch Prisma-utvidelser
-- Aktiverer 2 no-op-agenter (birthday, sponsor-report) + AI-prompts
-- + forecast-felter for HCP-prognose UI.
--
-- Endringer:
--   1. User.birthDate            DateTime? — for birthday-agenten
--   2. MentalProfile.preferredLearningStyle  enum? — for AI-coach-prompts
--   3. UnifiedSkillIndex.hcp24m/36m + CI95   Float? — for forecast-card
--   4. Sponsor + SponsorPlayerRelation       — for sponsor-report-agenten

-- ============================================================
-- 1. User.birthDate
-- ============================================================
ALTER TABLE "User" ADD COLUMN "birthDate" TIMESTAMP(3);

-- ============================================================
-- 2. MentalProfile.preferredLearningStyle
-- ============================================================
CREATE TYPE "LearningStyle" AS ENUM ('VISUAL', 'AUDITORY', 'KINESTHETIC', 'READING');
ALTER TABLE "MentalProfile" ADD COLUMN "preferredLearningStyle" "LearningStyle";

-- ============================================================
-- 3. UnifiedSkillIndex forecast-felter (24/36 mnd HCP-prognose med CI95)
-- ============================================================
ALTER TABLE "UnifiedSkillIndex"
  ADD COLUMN "hcp24mExpected" DOUBLE PRECISION,
  ADD COLUMN "hcp24mCi95Lo"   DOUBLE PRECISION,
  ADD COLUMN "hcp24mCi95Hi"   DOUBLE PRECISION,
  ADD COLUMN "hcp36mExpected" DOUBLE PRECISION,
  ADD COLUMN "hcp36mCi95Lo"   DOUBLE PRECISION,
  ADD COLUMN "hcp36mCi95Hi"   DOUBLE PRECISION;

-- ============================================================
-- 4. Sponsor + SponsorPlayerRelation
-- ============================================================
CREATE TABLE "Sponsor" (
  "id"              TEXT NOT NULL,
  "name"            TEXT NOT NULL,
  "contactName"     TEXT,
  "contactEmail"    TEXT,
  "contactPhone"    TEXT,
  "logoUrl"         TEXT,
  "websiteUrl"      TEXT,
  "tier"            TEXT NOT NULL DEFAULT 'STANDARD',
  "annualValueNok"  INTEGER,
  "contractStart"   TIMESTAMP(3),
  "contractEnd"     TIMESTAMP(3),
  "notes"           TEXT,
  "isActive"        BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Sponsor_isActive_idx" ON "Sponsor" ("isActive");

CREATE TABLE "SponsorPlayerRelation" (
  "id"            TEXT NOT NULL,
  "sponsorId"     TEXT NOT NULL,
  "userId"        TEXT NOT NULL,
  "startedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt"       TIMESTAMP(3),
  "monthlyValueNok" INTEGER,
  "notes"         TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SponsorPlayerRelation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SponsorPlayerRelation_sponsorId_userId_key"
  ON "SponsorPlayerRelation" ("sponsorId", "userId");

CREATE INDEX "SponsorPlayerRelation_userId_idx"
  ON "SponsorPlayerRelation" ("userId");

CREATE INDEX "SponsorPlayerRelation_sponsorId_idx"
  ON "SponsorPlayerRelation" ("sponsorId");

ALTER TABLE "SponsorPlayerRelation"
  ADD CONSTRAINT "SponsorPlayerRelation_sponsorId_fkey"
  FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SponsorPlayerRelation"
  ADD CONSTRAINT "SponsorPlayerRelation_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
