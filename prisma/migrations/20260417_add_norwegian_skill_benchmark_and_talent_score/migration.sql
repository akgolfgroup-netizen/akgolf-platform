-- CreateEnum
CREATE TYPE "NorwegianAgeGroup" AS ENUM ('U10', 'U12', 'U14', 'U16', 'U18', 'U21', 'SENIOR', 'VETERAN');

-- CreateEnum
CREATE TYPE "NorwegianGender" AS ENUM ('MALE', 'FEMALE', 'MIXED');

-- CreateEnum
CREATE TYPE "NorwegianRegion" AS ENUM ('OST', 'VEST', 'MIDT', 'NORD', 'SOR', 'ALL');

-- CreateTable
CREATE TABLE "NorwegianSkillBenchmark" (
    "id" TEXT NOT NULL,
    "ageGroup" "NorwegianAgeGroup" NOT NULL,
    "gender" "NorwegianGender" NOT NULL,
    "region" "NorwegianRegion" NOT NULL,
    "category" TEXT NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "sgOttMean" DOUBLE PRECISION NOT NULL,
    "sgAppMean" DOUBLE PRECISION NOT NULL,
    "sgArgMean" DOUBLE PRECISION NOT NULL,
    "sgPuttMean" DOUBLE PRECISION NOT NULL,
    "sgTotalMean" DOUBLE PRECISION NOT NULL,
    "sgOttPercentiles" JSONB NOT NULL,
    "sgAppPercentiles" JSONB NOT NULL,
    "sgArgPercentiles" JSONB NOT NULL,
    "sgPuttPercentiles" JSONB NOT NULL,
    "sgTotalPercentiles" JSONB NOT NULL,
    "ballSpeedMean" DOUBLE PRECISION,
    "ballSpeedStdDev" DOUBLE PRECISION,
    "driverCarryMean" DOUBLE PRECISION,
    "ironCarryMean" DOUBLE PRECISION,
    "clubSpeedMean" DOUBLE PRECISION,
    "smashFactorMean" DOUBLE PRECISION,
    "offlineStdDevMean" DOUBLE PRECISION,
    "testResultsJson" JSONB NOT NULL,
    "mentalScoreMean" DOUBLE PRECISION,
    "dataAsOf" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NorwegianSkillBenchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TalentScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentUsiScore" DOUBLE PRECISION NOT NULL,
    "progressionScore" DOUBLE PRECISION NOT NULL,
    "ceilingProjection" DOUBLE PRECISION NOT NULL,
    "biomechanicScore" DOUBLE PRECISION NOT NULL,
    "physicalScore" DOUBLE PRECISION NOT NULL,
    "mentalScore" DOUBLE PRECISION NOT NULL,
    "contextScore" DOUBLE PRECISION NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "nationalRank" INTEGER,
    "ageGroupRank" INTEGER,
    "percentile" DOUBLE PRECISION,
    "projectedHcp1Year" DOUBLE PRECISION,
    "projectedHcp3Years" DOUBLE PRECISION,
    "projectedPeakHcp" DOUBLE PRECISION,
    "projectedPeakAge" INTEGER,
    "similarPlayerUserIds" TEXT[],
    "similarityJson" JSONB NOT NULL,
    "strengthsJson" JSONB NOT NULL,
    "weaknessesJson" JSONB NOT NULL,
    "recommendationsJson" JSONB NOT NULL,
    "benchmarkId" TEXT,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TalentScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NorwegianSkillBenchmark_ageGroup_gender_region_category_key" ON "NorwegianSkillBenchmark"("ageGroup", "gender", "region", "category");

-- CreateIndex
CREATE INDEX "NorwegianSkillBenchmark_ageGroup_category_idx" ON "NorwegianSkillBenchmark"("ageGroup", "category");

-- CreateIndex
CREATE INDEX "NorwegianSkillBenchmark_region_category_idx" ON "NorwegianSkillBenchmark"("region", "category");

-- CreateIndex
CREATE UNIQUE INDEX "TalentScore_userId_key" ON "TalentScore"("userId");

-- CreateIndex
CREATE INDEX "TalentScore_totalScore_computedAt_idx" ON "TalentScore"("totalScore", "computedAt");

-- CreateIndex
CREATE INDEX "TalentScore_nationalRank_idx" ON "TalentScore"("nationalRank");

-- CreateIndex
CREATE INDEX "TalentScore_ageGroupRank_idx" ON "TalentScore"("ageGroupRank");

-- AddForeignKey
ALTER TABLE "TalentScore" ADD CONSTRAINT "TalentScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentScore" ADD CONSTRAINT "TalentScore_benchmarkId_fkey" FOREIGN KEY ("benchmarkId") REFERENCES "NorwegianSkillBenchmark"("id") ON DELETE SET NULL ON UPDATE CASCADE;
