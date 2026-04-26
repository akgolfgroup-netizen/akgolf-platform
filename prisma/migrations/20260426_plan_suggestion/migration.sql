-- Sprint 2: Forslags-modus — coach foreslår endringer som spilleren godkjenner.

CREATE TABLE IF NOT EXISTS "PlanSuggestion" (
  "id" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "proposedById" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT,
  "diffJson" JSONB NOT NULL,
  "rationale" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),
  "resolvedById" TEXT,
  "rejectionReason" TEXT,

  CONSTRAINT "PlanSuggestion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PlanSuggestion_planId_status_idx"
  ON "PlanSuggestion" ("planId", "status");

CREATE INDEX IF NOT EXISTS "PlanSuggestion_proposedById_idx"
  ON "PlanSuggestion" ("proposedById");

ALTER TABLE "PlanSuggestion"
  ADD CONSTRAINT "PlanSuggestion_planId_fkey"
  FOREIGN KEY ("planId") REFERENCES "TrainingPlan"("id") ON DELETE CASCADE;

ALTER TABLE "PlanSuggestion"
  ADD CONSTRAINT "PlanSuggestion_proposedById_fkey"
  FOREIGN KEY ("proposedById") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "PlanSuggestion"
  ADD CONSTRAINT "PlanSuggestion_resolvedById_fkey"
  FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL;

-- Notification-typer for forslags-modus
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'TRAINING_PLAN_SUGGESTION';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'TRAINING_PLAN_SUGGESTION_RESOLVED';
