-- Talent Dashboard models
-- Aggregerer turneringsdata fra OLYO Juniortour, Srixon Tour, Titleist
-- Østlandstour, Garmin Norges Cup og DataGolf for scouting og talent-utvikling.

-- CreateEnum
CREATE TYPE "TalentSource" AS ENUM ('OLYO', 'SRIXON', 'OSTLANDSTOUR', 'NORGESCUP', 'DATAGOLF');

-- CreateEnum
CREATE TYPE "BirthYearSource" AS ENUM ('MANUAL', 'ESTIMATED', 'SCRAPED');

-- CreateTable
CREATE TABLE "TalentPlayer" (
    "id" TEXT NOT NULL,
    "ngfId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "NorwegianGender",
    "birthYear" INTEGER,
    "birthYearSource" "BirthYearSource" NOT NULL DEFAULT 'SCRAPED',
    "birthYearConfidence" DOUBLE PRECISION,
    "club" TEXT,
    "region" "NorwegianRegion",
    "wagrId" INTEGER,
    "wagrRank" INTEGER,
    "collegeId" TEXT,
    "collegeRank" INTEGER,
    "coach" TEXT,
    "photoUrl" TEXT,
    "notes" TEXT,
    "lastActiveAt" TIMESTAMP(3),
    "linkedUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TalentPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TalentTournamentResult" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "source" "TalentSource" NOT NULL,
    "tournamentName" TEXT NOT NULL,
    "tournamentDate" TIMESTAMP(3) NOT NULL,
    "classCode" TEXT NOT NULL,
    "holes" INTEGER NOT NULL,
    "par" INTEGER NOT NULL,
    "position" INTEGER,
    "totalScore" INTEGER,
    "toPar" INTEGER,
    "rounds" INTEGER[],
    "region" TEXT,
    "rawSourceId" TEXT,
    "scoreReconstructed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TalentTournamentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TalentPlayerStats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "holesSegment" INTEGER NOT NULL,
    "totalResults" INTEGER NOT NULL,
    "totalRounds" INTEGER NOT NULL,
    "avgRound" DOUBLE PRECISION,
    "bestRound" INTEGER,
    "worstRound" INTEGER,
    "top3Count" INTEGER NOT NULL DEFAULT 0,
    "top10Count" INTEGER NOT NULL DEFAULT 0,
    "cutsMade" INTEGER NOT NULL DEFAULT 0,
    "improvementPerYear" DOUBLE PRECISION,
    "dataConfidenceScore" DOUBLE PRECISION NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TalentPlayerStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TalentPlayer_ngfId_key" ON "TalentPlayer"("ngfId");

-- CreateIndex
CREATE UNIQUE INDEX "TalentPlayer_linkedUserId_key" ON "TalentPlayer"("linkedUserId");

-- CreateIndex
CREATE INDEX "TalentPlayer_lastName_firstName_idx" ON "TalentPlayer"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "TalentPlayer_club_idx" ON "TalentPlayer"("club");

-- CreateIndex
CREATE INDEX "TalentPlayer_region_idx" ON "TalentPlayer"("region");

-- CreateIndex
CREATE INDEX "TalentPlayer_birthYear_idx" ON "TalentPlayer"("birthYear");

-- CreateIndex
CREATE INDEX "TalentTournamentResult_source_tournamentDate_idx" ON "TalentTournamentResult"("source", "tournamentDate");

-- CreateIndex
CREATE INDEX "TalentTournamentResult_playerId_tournamentDate_idx" ON "TalentTournamentResult"("playerId", "tournamentDate");

-- CreateIndex
CREATE UNIQUE INDEX "TalentTournamentResult_playerId_source_tournamentDate_tourn_key" ON "TalentTournamentResult"("playerId", "source", "tournamentDate", "tournamentName", "classCode");

-- CreateIndex
CREATE INDEX "TalentPlayerStats_year_holesSegment_idx" ON "TalentPlayerStats"("year", "holesSegment");

-- CreateIndex
CREATE UNIQUE INDEX "TalentPlayerStats_playerId_year_holesSegment_key" ON "TalentPlayerStats"("playerId", "year", "holesSegment");

-- AddForeignKey
ALTER TABLE "TalentPlayer" ADD CONSTRAINT "TalentPlayer_linkedUserId_fkey" FOREIGN KEY ("linkedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentTournamentResult" ADD CONSTRAINT "TalentTournamentResult_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "TalentPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentPlayerStats" ADD CONSTRAINT "TalentPlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "TalentPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
