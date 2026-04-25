-- Portal engagement & retention fields
ALTER TABLE "User" ADD COLUMN "lastActiveAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "onboardingGoals" JSONB;
ALTER TABLE "User" ADD COLUMN "weeklyEmailSentAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "winBackEmailStep" INTEGER NOT NULL DEFAULT 0;
