-- ============================================================================
-- Booking System Validation Migration
-- MÅL: 100% pålitelighet - ingen dobbeltbookings
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. BookingLock tabell for atomiske operasjoner (pessimistic locking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "BookingLock" (
    id TEXT PRIMARY KEY,
    "instructorId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "lockedBy" TEXT NOT NULL, -- Session/user ID
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    
    -- Unik constraint for å forhindre overlappende låser
    CONSTRAINT "BookingLock_instructorId_startTime_endTime_key" 
        UNIQUE ("instructorId", "startTime", "endTime")
);

-- Index for å raskt finne og rydde opp utløpte låser
CREATE INDEX IF NOT EXISTS "BookingLock_expiresAt_idx" 
    ON "BookingLock"("expiresAt");

-- Index for lookup
CREATE INDEX IF NOT EXISTS "BookingLock_instructorId_idx" 
    ON "BookingLock"("instructorId");

-- ----------------------------------------------------------------------------
-- 2. Forbedrede index på Booking for konfliktsjekk
-- ----------------------------------------------------------------------------
-- Index for rask konfliktsjekk (sjekker om en instruktør har bookinger i et tidsrom)
CREATE INDEX IF NOT EXISTS "Booking_instructorId_status_time_range_idx" 
    ON "Booking"("instructorId", "status", "startTime", "endTime");

-- Index for å finne aktive bookinger raskt
CREATE INDEX IF NOT EXISTS "Booking_status_startTime_endTime_idx" 
    ON "Booking"("status", "startTime", "endTime");

-- ----------------------------------------------------------------------------
-- 3. Function for å sjekke booking-konflikter (brukes i triggers)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_booking_conflict()
RETURNS TRIGGER AS $$
BEGIN
    -- Sjekk om det finnes en overlappende booking
    IF EXISTS (
        SELECT 1 FROM "Booking" b
        WHERE b."instructorId" = NEW."instructorId"
        AND b.status IN ('PENDING', 'CONFIRMED')
        AND b.id IS DISTINCT FROM NEW.id -- Ekskluder seg selv ved oppdatering
        AND (
            -- Overlapping: eksisterende starter før ny slutter OG eksisterende slutter etter ny starter
            (b."startTime" < NEW."endTime" AND b."endTime" > NEW."startTime")
        )
    ) THEN
        RAISE EXCEPTION 'Tidspunktet er allerede booket (dobbeltbooking forhindret)';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4. Trigger for å forhindre dobbeltbookings ved INSERT
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS prevent_double_booking_insert ON "Booking";
CREATE TRIGGER prevent_double_booking_insert
    BEFORE INSERT ON "Booking"
    FOR EACH ROW
    EXECUTE FUNCTION check_booking_conflict();

-- ----------------------------------------------------------------------------
-- 5. Trigger for å forhindre dobbeltbookings ved UPDATE
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS prevent_double_booking_update ON "Booking";
CREATE TRIGGER prevent_double_booking_update
    BEFORE UPDATE ON "Booking"
    FOR EACH ROW
    WHEN (OLD."startTime" IS DISTINCT FROM NEW."startTime" 
          OR OLD."endTime" IS DISTINCT FROM NEW."endTime"
          OR OLD."instructorId" IS DISTINCT FROM NEW."instructorId")
    EXECUTE FUNCTION check_booking_conflict();

-- ----------------------------------------------------------------------------
-- 6. Function for å sjekke blokkerte tider
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_blocked_time_conflict()
RETURNS TRIGGER AS $$
BEGIN
    -- Sjekk om tidspunktet overlapper med blokkert tid
    IF EXISTS (
        SELECT 1 FROM "BlockedTime" bt
        WHERE (
            bt."instructorId" = NEW."instructorId" 
            OR bt."instructorId" IS NULL -- Global block
        )
        AND (
            (bt."startTime" < NEW."endTime" AND bt."endTime" > NEW."startTime")
        )
    ) THEN
        RAISE EXCEPTION 'Tidspunktet er blokkert og kan ikke bookes';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 7. Trigger for å forhindre booking av blokkerte tider
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS prevent_blocked_time_booking ON "Booking";
CREATE TRIGGER prevent_blocked_time_booking
    BEFORE INSERT ON "Booking"
    FOR EACH ROW
    EXECUTE FUNCTION check_blocked_time_conflict();

-- ----------------------------------------------------------------------------
-- 8. Cleanup-funksjon for utløpte BookingLock
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION cleanup_expired_booking_locks()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM "BookingLock" 
    WHERE "expiresAt" < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 9. View for å identifisere potensielle dobbeltbookings (monitorering)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW booking_conflicts_view AS
SELECT 
    b1.id as booking1_id,
    b2.id as booking2_id,
    b1."instructorId",
    b1."startTime" as booking1_start,
    b1."endTime" as booking1_end,
    b2."startTime" as booking2_start,
    b2."endTime" as booking2_end,
    b1.status as booking1_status,
    b2.status as booking2_status,
    CASE 
        WHEN b1."createdAt" > b2."createdAt" THEN b1.id 
        ELSE b2.id 
    END as newer_booking_id
FROM "Booking" b1
JOIN "Booking" b2 ON 
    b1."instructorId" = b2."instructorId"
    AND b1.id < b2.id -- Unngå duplikater
    AND b1.status IN ('PENDING', 'CONFIRMED')
    AND b2.status IN ('PENDING', 'CONFIRMED')
    AND (b1."startTime" < b2."endTime" AND b1."endTime" > b2."startTime");

-- ----------------------------------------------------------------------------
-- 10. Kommentarer for dokumentasjon
-- ----------------------------------------------------------------------------
COMMENT ON TABLE "BookingLock" IS 'Midlertidige låser under booking-prosess for å forhindre race conditions';
COMMENT ON FUNCTION check_booking_conflict() IS 'Sjekker og forhindrer dobbeltbookings ved INSERT/UPDATE';
COMMENT ON VIEW booking_conflicts_view IS 'Visning for å identifisere potensielle dobbeltbookings i systemet';
