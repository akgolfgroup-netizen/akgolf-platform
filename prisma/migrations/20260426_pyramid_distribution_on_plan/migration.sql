-- Spillerstyrt pyramide-fordeling (FYS/TEK/SLAG/SPILL/TURN per plan)

ALTER TABLE "TrainingPlan"
  ADD COLUMN IF NOT EXISTS "pyramidDistribution" JSONB;
