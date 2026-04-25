-- Sprint 2: Training plan extensions
-- 1) Rest-days per uke
-- 2) DismissedAdjustment for å persistere "avvis"-status på plan-deviation-banner

-- Rest days per week (array av dayOfWeek 1-7)
ALTER TABLE "TrainingPlanWeek"
ADD COLUMN "restDays" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[];

-- DismissedAdjustment: persisterer at en bruker har avvist et plan-deviation-forslag
CREATE TABLE "DismissedAdjustment" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "dismissedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DismissedAdjustment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DismissedAdjustment_userId_planId_idx" ON "DismissedAdjustment"("userId", "planId");
CREATE INDEX "DismissedAdjustment_expiresAt_idx" ON "DismissedAdjustment"("expiresAt");

ALTER TABLE "DismissedAdjustment"
ADD CONSTRAINT "DismissedAdjustment_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DismissedAdjustment"
ADD CONSTRAINT "DismissedAdjustment_planId_fkey"
FOREIGN KEY ("planId") REFERENCES "TrainingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
