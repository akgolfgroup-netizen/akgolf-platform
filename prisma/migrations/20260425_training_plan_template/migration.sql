-- Sprint 3: TrainingPlanTemplate (admin-redigerbare maler)
-- Erstatter hardkodede maler i lib/portal/training/standard-templates.ts

CREATE TABLE "TrainingPlanTemplate" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "iconName" TEXT,
  "badge" TEXT,
  "periodType" TEXT NOT NULL,
  "weekPattern" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "weeklyFocusTemplate" TEXT,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TrainingPlanTemplate_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TrainingPlanTemplate_isActive_isPublic_idx" ON "TrainingPlanTemplate"("isActive", "isPublic");
CREATE INDEX "TrainingPlanTemplate_createdById_idx" ON "TrainingPlanTemplate"("createdById");

ALTER TABLE "TrainingPlanTemplate"
ADD CONSTRAINT "TrainingPlanTemplate_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
