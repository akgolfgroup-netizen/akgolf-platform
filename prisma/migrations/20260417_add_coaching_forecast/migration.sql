-- CreateTable
CREATE TABLE "CoachingForecast" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelVersion" TEXT NOT NULL,
    "currentScoreAvg" DOUBLE PRECISION NOT NULL,
    "currentSgTotal" DOUBLE PRECISION NOT NULL,
    "currentSgOtt" DOUBLE PRECISION,
    "currentSgApp" DOUBLE PRECISION,
    "currentSgArg" DOUBLE PRECISION,
    "currentSgPutt" DOUBLE PRECISION,
    "currentCategory" TEXT NOT NULL,
    "currentAge" INTEGER NOT NULL,
    "currentHoursPerWk" DOUBLE PRECISION NOT NULL,
    "targetScoreAvg" DOUBLE PRECISION NOT NULL,
    "targetCategory" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "avgCourseRating" DOUBLE PRECISION NOT NULL,
    "avgSlopeRating" INTEGER NOT NULL,
    "requiredSgDelta" DOUBLE PRECISION NOT NULL,
    "deltaAllocationJson" JSONB NOT NULL,
    "estimatedTotalHours" DOUBLE PRECISION NOT NULL,
    "estimatedHoursCi95Low" DOUBLE PRECISION NOT NULL,
    "estimatedHoursCi95High" DOUBLE PRECISION NOT NULL,
    "estimatedHoursPerWeek" DOUBLE PRECISION NOT NULL,
    "hoursPerCategoryJson" JSONB NOT NULL,
    "techTactMentalPhysJson" JSONB NOT NULL,
    "probabilityOfSuccess" DOUBLE PRECISION NOT NULL,
    "confidenceInterval95" JSONB NOT NULL,
    "monteCarloRuns" INTEGER NOT NULL DEFAULT 10000,
    "primaryFocusCategory" TEXT NOT NULL,
    "rootCauseJson" JSONB NOT NULL,
    "recommendationsJson" JSONB NOT NULL,
    "assumptionsJson" JSONB NOT NULL,
    "actualScoreAvg" DOUBLE PRECISION,
    "actualSgTotal" DOUBLE PRECISION,
    "actualHoursSpent" DOUBLE PRECISION,
    "actualOutcomeMeasuredAt" TIMESTAMP(3),
    "withinCi95" BOOLEAN,
    "predictionErrorSg" DOUBLE PRECISION,

    CONSTRAINT "CoachingForecast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoachingForecast_userId_generatedAt_idx" ON "CoachingForecast"("userId", "generatedAt");

-- CreateIndex
CREATE INDEX "CoachingForecast_deadline_idx" ON "CoachingForecast"("deadline");

-- CreateIndex
CREATE INDEX "CoachingForecast_actualOutcomeMeasuredAt_idx" ON "CoachingForecast"("actualOutcomeMeasuredAt");

-- AddForeignKey
ALTER TABLE "CoachingForecast" ADD CONSTRAINT "CoachingForecast_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
