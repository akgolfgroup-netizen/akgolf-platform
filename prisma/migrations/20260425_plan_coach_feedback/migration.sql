-- Sprint 4 / Epic 9: Coach-kommentar på plan-nivå

ALTER TABLE "TrainingPlan"
ADD COLUMN "coachFeedback" TEXT,
ADD COLUMN "coachFeedbackAt" TIMESTAMP(3),
ADD COLUMN "coachFeedbackById" TEXT;

ALTER TABLE "TrainingPlan"
ADD CONSTRAINT "TrainingPlan_coachFeedbackById_fkey"
FOREIGN KEY ("coachFeedbackById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "TrainingPlan_coachFeedbackById_idx" ON "TrainingPlan"("coachFeedbackById");
