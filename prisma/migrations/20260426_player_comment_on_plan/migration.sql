-- Sprint 1: Spillerkommentar på treningsplan-nivå (speiler coach-feedback)

ALTER TABLE "TrainingPlan"
  ADD COLUMN IF NOT EXISTS "playerComment" TEXT,
  ADD COLUMN IF NOT EXISTS "playerCommentAt" TIMESTAMP(3);

-- Notification-type for når spiller kommenterer (coach varsles)
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'TRAINING_PLAN_PLAYER_COMMENT';
