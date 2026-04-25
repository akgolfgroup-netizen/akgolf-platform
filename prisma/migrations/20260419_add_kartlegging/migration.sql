-- CreateEnum
CREATE TYPE "CoachPlayerStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ENDED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "dataConsentAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "dataConsentScope" JSONB;

-- CreateTable
CREATE TABLE "CoachPlayerRelation" (
    "id" TEXT NOT NULL,
    "coachUserId" TEXT NOT NULL,
    "playerUserId" TEXT NOT NULL,
    "status" "CoachPlayerStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachPlayerRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoachPlayerRelation_coachUserId_playerUserId_key" ON "CoachPlayerRelation"("coachUserId", "playerUserId");

-- CreateIndex
CREATE INDEX "CoachPlayerRelation_coachUserId_status_idx" ON "CoachPlayerRelation"("coachUserId", "status");

-- CreateIndex
CREATE INDEX "CoachPlayerRelation_playerUserId_status_idx" ON "CoachPlayerRelation"("playerUserId", "status");

-- AddForeignKey
ALTER TABLE "CoachPlayerRelation" ADD CONSTRAINT "CoachPlayerRelation_coachUserId_fkey" FOREIGN KEY ("coachUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachPlayerRelation" ADD CONSTRAINT "CoachPlayerRelation_playerUserId_fkey" FOREIGN KEY ("playerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
