-- Atomic subscription-quota RPC-funksjoner for AK Golf-bookingsystemet.
-- Erstatter race-condition-utsatt SELECT+UPDATE-fallback i lib/portal/booking/subscription-quota.ts.
-- Postgres serialiserer UPDATE på samme rad, så ett kall garanterer atomisk telling med kvotesjekk.

CREATE OR REPLACE FUNCTION increment_sessions_used(p_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE "SubscriptionQuota"
  SET "sessionsUsed" = "sessionsUsed" + 1,
      "updatedAt" = NOW()
  WHERE "userId" = p_user_id
    AND "sessionsUsed" < "sessionsAllowed";
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_sessions_used(p_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE "SubscriptionQuota"
  SET "sessionsUsed" = "sessionsUsed" - 1,
      "updatedAt" = NOW()
  WHERE "userId" = p_user_id
    AND "sessionsUsed" > 0;
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;
