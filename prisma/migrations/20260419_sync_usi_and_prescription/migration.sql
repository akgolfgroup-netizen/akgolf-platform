-- DropIndex
DROP INDEX IF EXISTS "Booking_refundIdempotencyKey_idx";

-- DropIndex
DROP INDEX IF EXISTS "Booking_stripeRefundId_idx";

-- CreateTable
CREATE TABLE "UnifiedSkillIndex" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sgOtt" DOUBLE PRECISION NOT NULL,
    "sgApp" DOUBLE PRECISION NOT NULL,
    "sgArg" DOUBLE PRECISION NOT NULL,
    "sgPutt" DOUBLE PRECISION NOT NULL,
    "ballSpeedScore" DOUBLE PRECISION NOT NULL,
    "consistencyScore" DOUBLE PRECISION NOT NULL,
    "pressureScore" DOUBLE PRECISION NOT NULL,
    "trainingEfficiency" DOUBLE PRECISION NOT NULL,
    "trendMomentum" DOUBLE PRECISION NOT NULL,
    "totalUsi" DOUBLE PRECISION NOT NULL,
    "estimatedHandicap" DOUBLE PRECISION NOT NULL,
    "estimatedCategory" TEXT NOT NULL,
    "uncertaintyJson" JSONB NOT NULL,
    "vsTourAvgPct" DOUBLE PRECISION NOT NULL,
    "dataGolfDgId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnifiedSkillIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnifiedSkillSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sgOtt" DOUBLE PRECISION NOT NULL,
    "sgApp" DOUBLE PRECISION NOT NULL,
    "sgArg" DOUBLE PRECISION NOT NULL,
    "sgPutt" DOUBLE PRECISION NOT NULL,
    "ballSpeedScore" DOUBLE PRECISION NOT NULL,
    "consistencyScore" DOUBLE PRECISION NOT NULL,
    "pressureScore" DOUBLE PRECISION NOT NULL,
    "trainingEfficiency" DOUBLE PRECISION NOT NULL,
    "trendMomentum" DOUBLE PRECISION NOT NULL,
    "totalUsi" DOUBLE PRECISION NOT NULL,
    "estimatedHandicap" DOUBLE PRECISION NOT NULL,
    "estimatedCategory" TEXT NOT NULL,
    "vsTourAvgPct" DOUBLE PRECISION NOT NULL,
    "unifiedSkillIndexId" TEXT,

    CONSTRAINT "UnifiedSkillSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillMapping" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "intercept" DOUBLE PRECISION NOT NULL,
    "ballSpeedCoeff" DOUBLE PRECISION,
    "offlineStdDevCoeff" DOUBLE PRECISION,
    "smashFactorCoeff" DOUBLE PRECISION,
    "spinConsistencyCoeff" DOUBLE PRECISION,
    "launchConsistencyCoeff" DOUBLE PRECISION,
    "rSquared" DOUBLE PRECISION NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPrescription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "focusAreas" TEXT[],
    "weeklyHours" DOUBLE PRECISION NOT NULL,
    "suggestedFormulaIds" TEXT[],
    "predictedHcpChange" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "gradientJson" JSONB NOT NULL,
    "gapAnalysisJson" JSONB NOT NULL,

    CONSTRAINT "TrainingPrescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnifiedSkillIndex_userId_key" ON "UnifiedSkillIndex"("userId");

-- CreateIndex
CREATE INDEX "UnifiedSkillSnapshot_userId_createdAt_idx" ON "UnifiedSkillSnapshot"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "TrainingPrescription_userId_generatedAt_idx" ON "TrainingPrescription"("userId", "generatedAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CoachingForecast_userId_generatedAt_idx" ON "CoachingForecast"("userId", "generatedAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CoachingForecast_deadline_idx" ON "CoachingForecast"("deadline");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CoachingForecast_actualOutcomeMeasuredAt_idx" ON "CoachingForecast"("actualOutcomeMeasuredAt");

-- AddForeignKey
ALTER TABLE "UnifiedSkillIndex" ADD CONSTRAINT "UnifiedSkillIndex_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnifiedSkillSnapshot" ADD CONSTRAINT "UnifiedSkillSnapshot_unifiedSkillIndexId_fkey" FOREIGN KEY ("unifiedSkillIndexId") REFERENCES "UnifiedSkillIndex"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnifiedSkillSnapshot" ADD CONSTRAINT "UnifiedSkillSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPrescription" ADD CONSTRAINT "TrainingPrescription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingForecast" ADD CONSTRAINT "CoachingForecast_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
