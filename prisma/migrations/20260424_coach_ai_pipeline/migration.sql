-- CoachHQ AI pipeline: audio transcription + publishing flow + trackman linking + goals
-- Plan: ~/.claude/plans/script-som-automatisk-skriver-merry-salamander.md

-- 1) CoachingSession: raw transcript + publishing state
ALTER TABLE "CoachingSession"
  ADD COLUMN IF NOT EXISTS "rawTranscript" TEXT,
  ADD COLUMN IF NOT EXISTS "publishedToStudent" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "CoachingSession_publishedToStudent_studentId_idx"
  ON "CoachingSession" ("publishedToStudent", "studentId");

-- 2) TrackmanSession: link to coaching session + source type
ALTER TABLE "TrackmanSession"
  ADD COLUMN IF NOT EXISTS "coachingSessionId" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceType" TEXT NOT NULL DEFAULT 'manual';

ALTER TABLE "TrackmanSession"
  ADD CONSTRAINT "TrackmanSession_coachingSessionId_fkey"
  FOREIGN KEY ("coachingSessionId") REFERENCES "CoachingSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "TrackmanSession_coachingSessionId_idx"
  ON "TrackmanSession" ("coachingSessionId");

-- 3) PlayerGoals table
CREATE TABLE IF NOT EXISTS "PlayerGoals" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "goalType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "targetDate" TIMESTAMP(3),
  "targetValue" DOUBLE PRECISION,
  "currentValue" DOUBLE PRECISION,
  "priority" INTEGER NOT NULL DEFAULT 2,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "achievedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PlayerGoals_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "PlayerGoals"
  ADD CONSTRAINT "PlayerGoals_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "PlayerGoals_userId_isActive_idx" ON "PlayerGoals" ("userId", "isActive");
CREATE INDEX IF NOT EXISTS "PlayerGoals_targetDate_idx" ON "PlayerGoals" ("targetDate");
