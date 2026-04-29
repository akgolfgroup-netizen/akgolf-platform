-- Stripe-katalog-felter på ServiceType (Fase C)
-- Performance + Performance Pro = recurring (subscription).
-- Alt annet = engang (one-time payment).
ALTER TABLE "ServiceType"
  ADD COLUMN "stripeProductId"  TEXT,
  ADD COLUMN "stripePriceId"    TEXT,
  ADD COLUMN "isRecurring"      BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "recurringInterval" TEXT;

-- Markér eksisterende Performance-tjenester som recurring (~ Anders' beslutning).
UPDATE "ServiceType"
SET "isRecurring" = true,
    "recurringInterval" = 'month'
WHERE LOWER("name") LIKE 'performance%';
