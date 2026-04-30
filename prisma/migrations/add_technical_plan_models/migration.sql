-- CreateEnum
CREATE TYPE "TechnicalPlanStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');
-- CreateEnum
CREATE TYPE "PhaseStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');
-- CreateEnum
CREATE TYPE "TrainingArea" AS ENUM ('TEE_OFF_THE_TEE', 'APPROACH_200_PLUS', 'APPROACH_150_200', 'APPROACH_100_150', 'APPROACH_50_100', 'CHIP_PITCH_10_50', 'BUNKER', 'PUTTING', 'COURSE_MANAGEMENT', 'MENTAL_GAME', 'PHYSICAL');

-- CreateTable
CREATE TABLE "Drill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "TrainingArea" NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "recommendedReps" INTEGER,
    "recommendedSets" INTEGER,
    "mediaUrls" TEXT[],
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Drill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalPlan" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TechnicalPlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechnicalPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalPlanPhase" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "phaseCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "drillId" TEXT,
    "customName" TEXT,
    "customDescription" TEXT,
    "customMediaUrls" TEXT[],
    "targetReps" INTEGER NOT NULL,
    "targetHours" DOUBLE PRECISION,
    "targetBalls" INTEGER,
    "area" "TrainingArea" NOT NULL,
    "environment" TEXT NOT NULL,
    "completedReps" INTEGER NOT NULL DEFAULT 0,
    "completedHours" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "completedBalls" INTEGER NOT NULL DEFAULT 0,
    "status" "PhaseStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "TechnicalPlanPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalPlanSession" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "trainingLogId" TEXT,
    "repsDone" INTEGER NOT NULL DEFAULT 0,
    "hoursDone" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "ballsDone" INTEGER,
    "qualityScore" INTEGER,
    "notes" TEXT,
    "verifiedByCoach" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "coachNote" TEXT,
    "trackManSessionId" TEXT,
    "trackManVerified" BOOLEAN NOT NULL DEFAULT false,
    "autoMatched" BOOLEAN NOT NULL DEFAULT false,
    "matchScore" INTEGER,
    "matchWarnings" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechnicalPlanSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Drill_category_isActive_idx" ON "Drill"("category", "isActive");

-- CreateIndex
CREATE INDEX "TechnicalPlan_playerId_status_idx" ON "TechnicalPlan"("playerId", "status");

-- CreateIndex
CREATE INDEX "TechnicalPlan_coachId_idx" ON "TechnicalPlan"("coachId");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalPlanPhase_planId_phaseCode_key" ON "TechnicalPlanPhase"("planId", "phaseCode");

-- CreateIndex
CREATE INDEX "TechnicalPlanPhase_planId_status_idx" ON "TechnicalPlanPhase"("planId", "status");

-- CreateIndex
CREATE INDEX "TechnicalPlanPhase_planId_order_idx" ON "TechnicalPlanPhase"("planId", "order");

-- CreateIndex
CREATE INDEX "TechnicalPlanSession_phaseId_idx" ON "TechnicalPlanSession"("phaseId");

-- CreateIndex
CREATE INDEX "TechnicalPlanSession_trainingLogId_idx" ON "TechnicalPlanSession"("trainingLogId");

-- AddForeignKey
ALTER TABLE "TechnicalPlan" ADD CONSTRAINT "TechnicalPlan_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalPlan" ADD CONSTRAINT "TechnicalPlan_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalPlanPhase" ADD CONSTRAINT "TechnicalPlanPhase_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TechnicalPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalPlanPhase" ADD CONSTRAINT "TechnicalPlanPhase_drillId_fkey" FOREIGN KEY ("drillId") REFERENCES "Drill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalPlanSession" ADD CONSTRAINT "TechnicalPlanSession_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "TechnicalPlanPhase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
