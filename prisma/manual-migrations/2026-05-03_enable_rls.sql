-- prisma/manual-migrations/2026-05-03_enable_rls.sql
-- Aktiver RLS på sensitive tabeller + stram EmailTemplate
-- Kjør via Supabase SQL Editor i prod
-- Rollback: se nederst i filen
--
-- Forutsetter at kode-PR allerede er deployet (5 filer som bytter fra
-- createServerSupabase() til createServiceClient() der RLS-beskyttede
-- tabeller leses for andre brukere enn auth'd selv).

BEGIN;

-- =============================================================================
-- 2.1 Round
-- =============================================================================

ALTER TABLE "Round" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "round_select_own" ON "Round" FOR SELECT
  USING ("userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

CREATE POLICY "round_insert_own" ON "Round" FOR INSERT
  WITH CHECK ("userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

CREATE POLICY "round_update_own" ON "Round" FOR UPDATE
  USING ("userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

CREATE POLICY "round_delete_own" ON "Round" FOR DELETE
  USING ("userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

-- =============================================================================
-- 2.2 HoleResult (joine via Round)
-- =============================================================================

ALTER TABLE "HoleResult" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hole_result_select_via_round" ON "HoleResult" FOR SELECT
  USING ("roundId" IN (
    SELECT r.id FROM "Round" r JOIN "User" u ON r."userId" = u.id
    WHERE u."supabaseId" = (auth.uid())::text
  ));

CREATE POLICY "hole_result_insert_via_round" ON "HoleResult" FOR INSERT
  WITH CHECK ("roundId" IN (
    SELECT r.id FROM "Round" r JOIN "User" u ON r."userId" = u.id
    WHERE u."supabaseId" = (auth.uid())::text
  ));

CREATE POLICY "hole_result_update_via_round" ON "HoleResult" FOR UPDATE
  USING ("roundId" IN (
    SELECT r.id FROM "Round" r JOIN "User" u ON r."userId" = u.id
    WHERE u."supabaseId" = (auth.uid())::text
  ));

CREATE POLICY "hole_result_delete_via_round" ON "HoleResult" FOR DELETE
  USING ("roundId" IN (
    SELECT r.id FROM "Round" r JOIN "User" u ON r."userId" = u.id
    WHERE u."supabaseId" = (auth.uid())::text
  ));

-- =============================================================================
-- 2.3 TrackmanSession
-- =============================================================================

ALTER TABLE "TrackmanSession" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trackman_session_select_own" ON "TrackmanSession" FOR SELECT
  USING ("userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

CREATE POLICY "trackman_session_insert_own" ON "TrackmanSession" FOR INSERT
  WITH CHECK ("userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

CREATE POLICY "trackman_session_update_own" ON "TrackmanSession" FOR UPDATE
  USING ("userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

CREATE POLICY "trackman_session_delete_own" ON "TrackmanSession" FOR DELETE
  USING ("userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

-- =============================================================================
-- 2.4 TrainingGroup
-- =============================================================================

ALTER TABLE "TrainingGroup" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "training_group_select_member_or_coach" ON "TrainingGroup" FOR SELECT
  USING (
    "coachId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text)
    OR id IN (
      SELECT "groupId" FROM "GroupMembership" gm
      JOIN "User" u ON gm."userId" = u.id
      WHERE u."supabaseId" = (auth.uid())::text AND gm.active = true
    )
  );

CREATE POLICY "training_group_mutate_coach_only" ON "TrainingGroup" FOR ALL
  USING ("coachId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text))
  WITH CHECK ("coachId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

-- =============================================================================
-- 2.5 GroupMembership
-- =============================================================================

ALTER TABLE "GroupMembership" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_membership_select_self_or_coach" ON "GroupMembership" FOR SELECT
  USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text)
    OR "groupId" IN (
      SELECT id FROM "TrainingGroup" tg JOIN "User" u ON tg."coachId" = u.id
      WHERE u."supabaseId" = (auth.uid())::text
    )
  );

CREATE POLICY "group_membership_mutate_coach_only" ON "GroupMembership" FOR ALL
  USING ("groupId" IN (
    SELECT id FROM "TrainingGroup" tg JOIN "User" u ON tg."coachId" = u.id
    WHERE u."supabaseId" = (auth.uid())::text
  ))
  WITH CHECK ("groupId" IN (
    SELECT id FROM "TrainingGroup" tg JOIN "User" u ON tg."coachId" = u.id
    WHERE u."supabaseId" = (auth.uid())::text
  ));

-- =============================================================================
-- 2.6 GroupSession
-- =============================================================================

ALTER TABLE "GroupSession" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_session_select_member_or_coach" ON "GroupSession" FOR SELECT
  USING (
    "groupId" IN (
      SELECT tg.id FROM "TrainingGroup" tg JOIN "User" u ON tg."coachId" = u.id
      WHERE u."supabaseId" = (auth.uid())::text
    )
    OR "groupId" IN (
      SELECT gm."groupId" FROM "GroupMembership" gm JOIN "User" u ON gm."userId" = u.id
      WHERE u."supabaseId" = (auth.uid())::text AND gm.active = true
    )
  );

CREATE POLICY "group_session_mutate_coach_only" ON "GroupSession" FOR ALL
  USING ("groupId" IN (
    SELECT tg.id FROM "TrainingGroup" tg JOIN "User" u ON tg."coachId" = u.id
    WHERE u."supabaseId" = (auth.uid())::text
  ))
  WITH CHECK ("groupId" IN (
    SELECT tg.id FROM "TrainingGroup" tg JOIN "User" u ON tg."coachId" = u.id
    WHERE u."supabaseId" = (auth.uid())::text
  ));

-- =============================================================================
-- 2.7 GroupSessionRSVP
-- =============================================================================

ALTER TABLE "GroupSessionRSVP" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_session_rsvp_select_self_or_coach" ON "GroupSessionRSVP" FOR SELECT
  USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text)
    OR "sessionId" IN (
      SELECT gs.id FROM "GroupSession" gs
      JOIN "TrainingGroup" tg ON gs."groupId" = tg.id
      JOIN "User" u ON tg."coachId" = u.id
      WHERE u."supabaseId" = (auth.uid())::text
    )
  );

CREATE POLICY "group_session_rsvp_insert_self" ON "GroupSessionRSVP" FOR INSERT
  WITH CHECK ("userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

CREATE POLICY "group_session_rsvp_update_self" ON "GroupSessionRSVP" FOR UPDATE
  USING ("userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

CREATE POLICY "group_session_rsvp_delete_self" ON "GroupSessionRSVP" FOR DELETE
  USING ("userId" IN (SELECT id FROM "User" WHERE "supabaseId" = (auth.uid())::text));

-- =============================================================================
-- 2.8 EmailTemplate (DROP + CREATE)
-- =============================================================================

DROP POLICY "email_template_select_all" ON "EmailTemplate";

CREATE POLICY "email_template_service_role_only" ON "EmailTemplate" FOR SELECT
  USING (auth.role() = 'service_role');

COMMIT;

-- =============================================================================
-- ROLLBACK (kjør IKKE som del av deploy — kun ved brekkasje)
-- =============================================================================
-- BEGIN;
-- ALTER TABLE "Round" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "HoleResult" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "TrackmanSession" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "GroupSession" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "GroupSessionRSVP" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "GroupMembership" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "TrainingGroup" DISABLE ROW LEVEL SECURITY;
-- DROP POLICY "email_template_service_role_only" ON "EmailTemplate";
-- CREATE POLICY "email_template_select_all" ON "EmailTemplate" FOR SELECT USING (true);
-- COMMIT;
