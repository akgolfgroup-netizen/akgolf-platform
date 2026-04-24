-- TrackMan AI-insights: cachet generert innsikt med 24t cooldown per bruker
CREATE TABLE "TrackManInsight" (
  "id"            TEXT NOT NULL,
  "userId"        TEXT NOT NULL,
  "insights"      JSONB NOT NULL,
  "generatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "cooldownUntil" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TrackManInsight_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TrackManInsight_userId_generatedAt_idx"
  ON "TrackManInsight"("userId", "generatedAt");

ALTER TABLE "TrackManInsight"
  ADD CONSTRAINT "TrackManInsight_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
