-- =============================================================================
-- RLS Policies for AK Golf Portal
-- Opprettet: 2026-04-01
-- Status: DISABLED by default (aktiveres etter testing)
-- =============================================================================

-- Kill-switch: Sett til FALSE for å deaktivere alle policies
DO $$
BEGIN
  PERFORM set_config('app.rls_enabled', 'false', false);
END $$;

-- -----------------------------------------------------------------------------
-- Helper function: Get current user ID
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION current_user_id() RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- User table policies
-- -----------------------------------------------------------------------------
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON "User" FOR SELECT
USING (
  current_setting('app.rls_enabled', true) = 'false'
  OR id = current_user_id()
  OR "supabaseId" = auth.uid()::text
);

CREATE POLICY "Users can update own profile"
ON "User" FOR UPDATE
USING (
  current_setting('app.rls_enabled', true) = 'false'
  OR id = current_user_id()
  OR "supabaseId" = auth.uid()::text
);

-- -----------------------------------------------------------------------------
-- Booking table policies
-- -----------------------------------------------------------------------------
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own bookings"
ON "Booking" FOR SELECT
USING (
  current_setting('app.rls_enabled', true) = 'false'
  OR "studentId" = current_user_id()
);

CREATE POLICY "Instructors can view their bookings"
ON "Booking" FOR SELECT
USING (
  current_setting('app.rls_enabled', true) = 'false'
  OR "instructorId" IN (
    SELECT id FROM "Instructor" WHERE "userId" = current_user_id()
  )
);

-- -----------------------------------------------------------------------------
-- Notification table policies
-- -----------------------------------------------------------------------------
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON "Notification" FOR SELECT
USING (
  current_setting('app.rls_enabled', true) = 'false'
  OR "userId" = current_user_id()
);

CREATE POLICY "Users can update own notifications"
ON "Notification" FOR UPDATE
USING (
  current_setting('app.rls_enabled', true) = 'false'
  OR "userId" = current_user_id()
);

-- -----------------------------------------------------------------------------
-- HandicapEntry table policies
-- -----------------------------------------------------------------------------
ALTER TABLE "HandicapEntry" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own handicap"
ON "HandicapEntry" FOR SELECT
USING (
  current_setting('app.rls_enabled', true) = 'false'
  OR "userId" = current_user_id()
);

-- -----------------------------------------------------------------------------
-- Public tables (no RLS needed)
-- -----------------------------------------------------------------------------
-- ServiceType, Instructor, Location, InstructorAvailability
-- These are public data, no row-level restrictions needed

-- -----------------------------------------------------------------------------
-- Activation script (run after testing)
-- -----------------------------------------------------------------------------
-- To activate RLS:
-- SET app.rls_enabled = 'true';
--
-- To deactivate (emergency kill-switch):
-- SET app.rls_enabled = 'false';
