-- Add focusAllocation to PeriodizationPeriod
ALTER TABLE "PeriodizationPeriod"
  ADD COLUMN "focusAllocation" JSONB DEFAULT '{}';

-- Add periodizationPeriodId to TrainingPlan
ALTER TABLE "TrainingPlan"
  ADD COLUMN "periodizationPeriodId" TEXT;

-- Add foreign key relation
ALTER TABLE "TrainingPlan"
  ADD CONSTRAINT "TrainingPlan_periodizationPeriodId_fkey"
  FOREIGN KEY ("periodizationPeriodId")
  REFERENCES "PeriodizationPeriod"(id)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Add index
CREATE INDEX "TrainingPlan_periodizationPeriodId_idx"
  ON "TrainingPlan"("periodizationPeriodId");
