-- AK Golf Content Library
-- Generert innhold (drills, exercises, tester, aktiviteter, konkurranseforberedelse)
-- som krever manuell godkjenning før det er tilgjengelig i treningsplanleggeren.

-- CreateEnum
CREATE TYPE "LibraryItemType" AS ENUM (
  'DRILL',
  'EXERCISE',
  'TEST',
  'ACTIVITY',
  'COMPETITION_PREP'
);

-- CreateEnum
CREATE TYPE "LibraryItemStatus" AS ENUM (
  'DRAFT',
  'APPROVED',
  'REJECTED',
  'ARCHIVED'
);

-- CreateEnum
CREATE TYPE "LibraryItemSource" AS ENUM (
  'AK_METHODOLOGY',
  'WEB_INSPIRED',
  'MANUAL'
);

-- AlterEnum (Capability — legg til library-kapabiliteter)
ALTER TYPE "Capability" ADD VALUE 'LIBRARY_VIEW';
ALTER TYPE "Capability" ADD VALUE 'LIBRARY_GENERATE';
ALTER TYPE "Capability" ADD VALUE 'LIBRARY_APPROVE';

-- CreateTable
CREATE TABLE "LibraryItem" (
  "id" TEXT NOT NULL,
  "type" "LibraryItemType" NOT NULL,
  "status" "LibraryItemStatus" NOT NULL DEFAULT 'DRAFT',
  "source" "LibraryItemSource" NOT NULL DEFAULT 'AK_METHODOLOGY',

  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,

  -- Taksonomi (speiler lib/portal/training/ak-taxonomy.ts)
  "pyramid" TEXT NOT NULL, -- FYS | TEK | SLAG | SPILL | TURN
  "area" TEXT NOT NULL,    -- TEE | INN200 | INN150 | ... | PUTT0-3 | ...
  "subArea" TEXT,
  "lPhase" TEXT,           -- L-KROPP | L-ARM | L-KØLLE | L-BALL | L-AUTO
  "playerLevels" TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Treningsstruktur
  "difficulty" INTEGER NOT NULL DEFAULT 2,
  "minDurationMinutes" INTEGER NOT NULL DEFAULT 5,
  "maxDurationMinutes" INTEGER NOT NULL DEFAULT 30,
  "equipment" TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Innhold (markdown)
  "setup" TEXT,
  "execution" TEXT,
  "scoring" TEXT,
  "variations" TEXT,
  "coachingCues" TEXT,

  -- Generering
  "generatedBy" TEXT,           -- 'claude-sonnet-4-6' | 'kimi-manual' | 'manual'
  "generatedPrompt" TEXT,
  "sourceUrl" TEXT,
  "generatedAt" TIMESTAMP(3),

  -- Godkjenning
  "approvedById" TEXT,
  "approvedAt" TIMESTAMP(3),
  "rejectedById" TEXT,
  "rejectedAt" TIMESTAMP(3),
  "rejectionReason" TEXT,
  "createdById" TEXT,

  -- Bruk
  "usageCount" INTEGER NOT NULL DEFAULT 0,
  "rating" DOUBLE PRECISION,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],

  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "LibraryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LibraryItem_status_type_idx" ON "LibraryItem"("status", "type");
CREATE INDEX "LibraryItem_type_pyramid_area_idx" ON "LibraryItem"("type", "pyramid", "area");
CREATE INDEX "LibraryItem_status_idx" ON "LibraryItem"("status");
CREATE INDEX "LibraryItem_area_idx" ON "LibraryItem"("area");

-- AddForeignKey
ALTER TABLE "LibraryItem"
  ADD CONSTRAINT "LibraryItem_approvedById_fkey"
  FOREIGN KEY ("approvedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LibraryItem"
  ADD CONSTRAINT "LibraryItem_rejectedById_fkey"
  FOREIGN KEY ("rejectedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LibraryItem"
  ADD CONSTRAINT "LibraryItem_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
