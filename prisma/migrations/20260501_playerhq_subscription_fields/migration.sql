-- PlayerHQ-abonnement: trial fram til 1. juni 2026, deretter 299 kr/mnd via Stripe
-- Performance/Performance Pro-abonnenter har PlayerHQ inkludert (sjekkes via subscriptionTier)

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "playerhqAccessUntil" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "playerhqStripeSubscriptionId" TEXT,
  ADD COLUMN IF NOT EXISTS "playerhqStripePriceId" TEXT;

CREATE INDEX IF NOT EXISTS "User_playerhqAccessUntil_idx" ON "User"("playerhqAccessUntil");

-- Backfill: alle eksisterende brukere får trial-tilgang ut mai 2026
UPDATE "User"
SET "playerhqAccessUntil" = '2026-06-01 00:00:00'
WHERE "playerhqAccessUntil" IS NULL;
