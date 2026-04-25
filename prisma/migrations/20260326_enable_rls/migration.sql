-- ============================================================================
-- AK Golf: Enable Row Level Security (RLS) on all tables
-- Generated: 2026-03-26
-- ============================================================================
-- VIKTIG: Kjør denne i Supabase SQL Editor (ikke via Prisma migrate)
-- Prisma bruker service_role som bypasser RLS automatisk.
-- ============================================================================

-- ============================================================================
-- STEG 1: AKTIVER RLS PÅ ALLE TABELLER
-- ============================================================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Goal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TrainingPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TrainingPlanWeek" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TrainingPlanSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TrainingLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HandicapEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RoundStats" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PlayerAchievement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PlayerTournamentPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PeriodizationPeriod" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserExerciseBank" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SubscriptionQuota" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CustomerPaymentPreference" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppSubscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DashboardAccess" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CoachingSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GroupParticipant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WaitlistEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PaymentTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Instructor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InstructorAvailability" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ServiceType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Location" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Resource" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlockedTime" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tournament" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TournamentPrep" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExerciseDefinition" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AchievementDefinition" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppBundle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BundleItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppModule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContentItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CommunicationLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_InstructorToServiceType" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEG 2: KATEGORI E - SYSTEM/AUTH (BLOKKER DIREKTE TILGANG)
-- Disse tabellene skal KUN være tilgjengelige via service_role
-- ============================================================================

-- Account (inneholder access_token, refresh_token)
CREATE POLICY "account_no_direct_access" ON "Account"
  FOR ALL USING (false);

-- Session (auth sessions)
CREATE POLICY "session_no_direct_access" ON "Session"
  FOR ALL USING (false);

-- VerificationToken (inneholder sensitive tokens)
CREATE POLICY "verification_token_no_direct_access" ON "VerificationToken"
  FOR ALL USING (false);

-- CommunicationLog (intern logging)
CREATE POLICY "communication_log_no_direct_access" ON "CommunicationLog"
  FOR ALL USING (false);

-- ============================================================================
-- STEG 3: KATEGORI A - BRUKER-EIDE DATA
-- Bruker kan kun se/endre egne rader (basert på supabaseId match)
-- ============================================================================

-- User: Bruker kan se og oppdatere egen profil
CREATE POLICY "user_select_own" ON "User"
  FOR SELECT USING (auth.uid()::text = "supabaseId");

CREATE POLICY "user_update_own" ON "User"
  FOR UPDATE USING (auth.uid()::text = "supabaseId");

-- Goal
CREATE POLICY "goal_select_own" ON "Goal"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "goal_insert_own" ON "Goal"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "goal_update_own" ON "Goal"
  FOR UPDATE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "goal_delete_own" ON "Goal"
  FOR DELETE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- TrainingPlan
CREATE POLICY "training_plan_select_own" ON "TrainingPlan"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "training_plan_insert_own" ON "TrainingPlan"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "training_plan_update_own" ON "TrainingPlan"
  FOR UPDATE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "training_plan_delete_own" ON "TrainingPlan"
  FOR DELETE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- TrainingPlanWeek (via TrainingPlan)
CREATE POLICY "training_plan_week_select_own" ON "TrainingPlanWeek"
  FOR SELECT USING (
    "planId" IN (
      SELECT id FROM "TrainingPlan"
      WHERE "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
    )
  );

CREATE POLICY "training_plan_week_insert_own" ON "TrainingPlanWeek"
  FOR INSERT WITH CHECK (
    "planId" IN (
      SELECT id FROM "TrainingPlan"
      WHERE "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
    )
  );

CREATE POLICY "training_plan_week_update_own" ON "TrainingPlanWeek"
  FOR UPDATE USING (
    "planId" IN (
      SELECT id FROM "TrainingPlan"
      WHERE "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
    )
  );

CREATE POLICY "training_plan_week_delete_own" ON "TrainingPlanWeek"
  FOR DELETE USING (
    "planId" IN (
      SELECT id FROM "TrainingPlan"
      WHERE "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
    )
  );

-- TrainingPlanSession (via TrainingPlanWeek)
CREATE POLICY "training_plan_session_select_own" ON "TrainingPlanSession"
  FOR SELECT USING (
    "weekId" IN (
      SELECT tpw.id FROM "TrainingPlanWeek" tpw
      JOIN "TrainingPlan" tp ON tpw."planId" = tp.id
      WHERE tp."userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
    )
  );

CREATE POLICY "training_plan_session_insert_own" ON "TrainingPlanSession"
  FOR INSERT WITH CHECK (
    "weekId" IN (
      SELECT tpw.id FROM "TrainingPlanWeek" tpw
      JOIN "TrainingPlan" tp ON tpw."planId" = tp.id
      WHERE tp."userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
    )
  );

CREATE POLICY "training_plan_session_update_own" ON "TrainingPlanSession"
  FOR UPDATE USING (
    "weekId" IN (
      SELECT tpw.id FROM "TrainingPlanWeek" tpw
      JOIN "TrainingPlan" tp ON tpw."planId" = tp.id
      WHERE tp."userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
    )
  );

CREATE POLICY "training_plan_session_delete_own" ON "TrainingPlanSession"
  FOR DELETE USING (
    "weekId" IN (
      SELECT tpw.id FROM "TrainingPlanWeek" tpw
      JOIN "TrainingPlan" tp ON tpw."planId" = tp.id
      WHERE tp."userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
    )
  );

-- TrainingLog
CREATE POLICY "training_log_select_own" ON "TrainingLog"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "training_log_insert_own" ON "TrainingLog"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "training_log_update_own" ON "TrainingLog"
  FOR UPDATE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "training_log_delete_own" ON "TrainingLog"
  FOR DELETE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- HandicapEntry
CREATE POLICY "handicap_entry_select_own" ON "HandicapEntry"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "handicap_entry_insert_own" ON "HandicapEntry"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "handicap_entry_update_own" ON "HandicapEntry"
  FOR UPDATE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "handicap_entry_delete_own" ON "HandicapEntry"
  FOR DELETE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- RoundStats
CREATE POLICY "round_stats_select_own" ON "RoundStats"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "round_stats_insert_own" ON "RoundStats"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "round_stats_update_own" ON "RoundStats"
  FOR UPDATE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "round_stats_delete_own" ON "RoundStats"
  FOR DELETE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- PlayerAchievement
CREATE POLICY "player_achievement_select_own" ON "PlayerAchievement"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "player_achievement_insert_own" ON "PlayerAchievement"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- PlayerTournamentPlan
CREATE POLICY "player_tournament_plan_select_own" ON "PlayerTournamentPlan"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "player_tournament_plan_insert_own" ON "PlayerTournamentPlan"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "player_tournament_plan_update_own" ON "PlayerTournamentPlan"
  FOR UPDATE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "player_tournament_plan_delete_own" ON "PlayerTournamentPlan"
  FOR DELETE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- PeriodizationPeriod
CREATE POLICY "periodization_period_select_own" ON "PeriodizationPeriod"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "periodization_period_insert_own" ON "PeriodizationPeriod"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "periodization_period_update_own" ON "PeriodizationPeriod"
  FOR UPDATE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "periodization_period_delete_own" ON "PeriodizationPeriod"
  FOR DELETE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- UserExerciseBank
CREATE POLICY "user_exercise_bank_select_own" ON "UserExerciseBank"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "user_exercise_bank_insert_own" ON "UserExerciseBank"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "user_exercise_bank_delete_own" ON "UserExerciseBank"
  FOR DELETE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- SubscriptionQuota
CREATE POLICY "subscription_quota_select_own" ON "SubscriptionQuota"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- CustomerPaymentPreference
CREATE POLICY "customer_payment_pref_select_own" ON "CustomerPaymentPreference"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "customer_payment_pref_insert_own" ON "CustomerPaymentPreference"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "customer_payment_pref_update_own" ON "CustomerPaymentPreference"
  FOR UPDATE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- AppSubscription
CREATE POLICY "app_subscription_select_own" ON "AppSubscription"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- DashboardAccess
CREATE POLICY "dashboard_access_select_own" ON "DashboardAccess"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- ============================================================================
-- STEG 4: KATEGORI B - BOOKING-DATA (BRUKER + INSTRUKTØR)
-- ============================================================================

-- Booking: Bruker ser egne, instruktør ser tilknyttede
CREATE POLICY "booking_select_own_or_instructor" ON "Booking"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
    OR
    "instructorId" IN (
      SELECT i.id FROM "Instructor" i
      JOIN "User" u ON i."userId" = u.id
      WHERE u."supabaseId" = auth.uid()::text
    )
  );

CREATE POLICY "booking_insert_own" ON "Booking"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "booking_update_own_or_instructor" ON "Booking"
  FOR UPDATE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
    OR
    "instructorId" IN (
      SELECT i.id FROM "Instructor" i
      JOIN "User" u ON i."userId" = u.id
      WHERE u."supabaseId" = auth.uid()::text
    )
  );

-- CoachingSession (via Booking)
CREATE POLICY "coaching_session_select_via_booking" ON "CoachingSession"
  FOR SELECT USING (
    "bookingId" IN (
      SELECT id FROM "Booking" WHERE
        "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
        OR
        "instructorId" IN (
          SELECT i.id FROM "Instructor" i
          JOIN "User" u ON i."userId" = u.id
          WHERE u."supabaseId" = auth.uid()::text
        )
    )
  );

CREATE POLICY "coaching_session_update_instructor" ON "CoachingSession"
  FOR UPDATE USING (
    "bookingId" IN (
      SELECT id FROM "Booking" WHERE
        "instructorId" IN (
          SELECT i.id FROM "Instructor" i
          JOIN "User" u ON i."userId" = u.id
          WHERE u."supabaseId" = auth.uid()::text
        )
    )
  );

-- GroupParticipant
CREATE POLICY "group_participant_select_own" ON "GroupParticipant"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
    OR
    "bookingId" IN (
      SELECT id FROM "Booking" WHERE
        "instructorId" IN (
          SELECT i.id FROM "Instructor" i
          JOIN "User" u ON i."userId" = u.id
          WHERE u."supabaseId" = auth.uid()::text
        )
    )
  );

-- WaitlistEntry
CREATE POLICY "waitlist_entry_select_own" ON "WaitlistEntry"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "waitlist_entry_insert_own" ON "WaitlistEntry"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "waitlist_entry_delete_own" ON "WaitlistEntry"
  FOR DELETE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- PaymentTransaction
CREATE POLICY "payment_transaction_select_own" ON "PaymentTransaction"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- ============================================================================
-- STEG 5: KATEGORI C - INSTRUKTØR-ADMINISTRERT (PUBLIC READ)
-- ============================================================================

-- Instructor (alle kan lese)
CREATE POLICY "instructor_select_all" ON "Instructor"
  FOR SELECT USING (true);

CREATE POLICY "instructor_update_own" ON "Instructor"
  FOR UPDATE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- InstructorAvailability (alle kan lese, instruktør kan endre egne)
CREATE POLICY "instructor_availability_select_all" ON "InstructorAvailability"
  FOR SELECT USING (true);

CREATE POLICY "instructor_availability_insert_own" ON "InstructorAvailability"
  FOR INSERT WITH CHECK (
    "instructorId" IN (
      SELECT i.id FROM "Instructor" i
      JOIN "User" u ON i."userId" = u.id
      WHERE u."supabaseId" = auth.uid()::text
    )
  );

CREATE POLICY "instructor_availability_update_own" ON "InstructorAvailability"
  FOR UPDATE USING (
    "instructorId" IN (
      SELECT i.id FROM "Instructor" i
      JOIN "User" u ON i."userId" = u.id
      WHERE u."supabaseId" = auth.uid()::text
    )
  );

CREATE POLICY "instructor_availability_delete_own" ON "InstructorAvailability"
  FOR DELETE USING (
    "instructorId" IN (
      SELECT i.id FROM "Instructor" i
      JOIN "User" u ON i."userId" = u.id
      WHERE u."supabaseId" = auth.uid()::text
    )
  );

-- ServiceType (alle kan lese)
CREATE POLICY "service_type_select_all" ON "ServiceType"
  FOR SELECT USING (true);

-- Location (alle kan lese)
CREATE POLICY "location_select_all" ON "Location"
  FOR SELECT USING (true);

-- Resource (alle kan lese)
CREATE POLICY "resource_select_all" ON "Resource"
  FOR SELECT USING (true);

-- BlockedTime (instruktør ser egne)
CREATE POLICY "blocked_time_select_own" ON "BlockedTime"
  FOR SELECT USING (
    "instructorId" IN (
      SELECT i.id FROM "Instructor" i
      JOIN "User" u ON i."userId" = u.id
      WHERE u."supabaseId" = auth.uid()::text
    )
  );

CREATE POLICY "blocked_time_insert_own" ON "BlockedTime"
  FOR INSERT WITH CHECK (
    "instructorId" IN (
      SELECT i.id FROM "Instructor" i
      JOIN "User" u ON i."userId" = u.id
      WHERE u."supabaseId" = auth.uid()::text
    )
  );

CREATE POLICY "blocked_time_update_own" ON "BlockedTime"
  FOR UPDATE USING (
    "instructorId" IN (
      SELECT i.id FROM "Instructor" i
      JOIN "User" u ON i."userId" = u.id
      WHERE u."supabaseId" = auth.uid()::text
    )
  );

CREATE POLICY "blocked_time_delete_own" ON "BlockedTime"
  FOR DELETE USING (
    "instructorId" IN (
      SELECT i.id FROM "Instructor" i
      JOIN "User" u ON i."userId" = u.id
      WHERE u."supabaseId" = auth.uid()::text
    )
  );

-- Tournament (alle kan lese)
CREATE POLICY "tournament_select_all" ON "Tournament"
  FOR SELECT USING (true);

-- TournamentPrep (bruker ser egne)
CREATE POLICY "tournament_prep_select_own" ON "TournamentPrep"
  FOR SELECT USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "tournament_prep_insert_own" ON "TournamentPrep"
  FOR INSERT WITH CHECK (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "tournament_prep_update_own" ON "TournamentPrep"
  FOR UPDATE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

CREATE POLICY "tournament_prep_delete_own" ON "TournamentPrep"
  FOR DELETE USING (
    "userId" IN (SELECT id FROM "User" WHERE "supabaseId" = auth.uid()::text)
  );

-- ============================================================================
-- STEG 6: KATEGORI D - OFFENTLIG INNHOLD (PUBLIC READ)
-- ============================================================================

CREATE POLICY "exercise_definition_select_all" ON "ExerciseDefinition"
  FOR SELECT USING (true);

CREATE POLICY "achievement_definition_select_all" ON "AchievementDefinition"
  FOR SELECT USING (true);

CREATE POLICY "app_bundle_select_all" ON "AppBundle"
  FOR SELECT USING (true);

CREATE POLICY "bundle_item_select_all" ON "BundleItem"
  FOR SELECT USING (true);

CREATE POLICY "app_module_select_all" ON "AppModule"
  FOR SELECT USING (true);

CREATE POLICY "content_item_select_all" ON "ContentItem"
  FOR SELECT USING (true);

CREATE POLICY "email_template_select_all" ON "EmailTemplate"
  FOR SELECT USING (true);

-- ============================================================================
-- STEG 7: JUNCTION TABLES
-- ============================================================================

CREATE POLICY "instructor_service_type_select_all" ON "_InstructorToServiceType"
  FOR SELECT USING (true);

-- ============================================================================
-- FERDIG! Verifiser med:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- ============================================================================
