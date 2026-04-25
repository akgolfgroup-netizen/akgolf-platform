-- Migration: Availability Sync System
-- Description: Extends InstructorAvailability with audit logging and adds real-time sync capabilities

-- =====================================================
-- 1. Extend InstructorAvailability table
-- =====================================================

-- Add new columns to InstructorAvailability
ALTER TABLE "InstructorAvailability" 
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "validUntil" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

-- Set updatedAt for existing rows
UPDATE "InstructorAvailability" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- Make updatedAt required
ALTER TABLE "InstructorAvailability" ALTER COLUMN "updatedAt" SET NOT NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "InstructorAvailability_instructorId_isActive_idx" 
ON "InstructorAvailability"("instructorId", "isActive");

CREATE INDEX IF NOT EXISTS "InstructorAvailability_validFrom_validUntil_idx" 
ON "InstructorAvailability"("validFrom", "validUntil");

-- =====================================================
-- 2. Add updatedAt to InstructorDateAvailability
-- =====================================================

ALTER TABLE "InstructorDateAvailability" 
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

UPDATE "InstructorDateAvailability" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;

ALTER TABLE "InstructorDateAvailability" ALTER COLUMN "updatedAt" SET NOT NULL;

-- =====================================================
-- 3. Create AvailabilityChangeType enum
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AvailabilityChangeType') THEN
        CREATE TYPE "AvailabilityChangeType" AS ENUM (
            'CREATED',
            'UPDATED',
            'DEACTIVATED',
            'REACTIVATED',
            'DELETED'
        );
    END IF;
END
$$;

-- =====================================================
-- 4. Create AvailabilityChangeLog table
-- =====================================================

CREATE TABLE IF NOT EXISTS "AvailabilityChangeLog" (
    "id" TEXT NOT NULL,
    "availabilityId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changeType" "AvailabilityChangeType" NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "changeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvailabilityChangeLog_pkey" PRIMARY KEY ("id")
);

-- Create indexes for Audit Log
CREATE INDEX IF NOT EXISTS "AvailabilityChangeLog_availabilityId_idx" 
ON "AvailabilityChangeLog"("availabilityId");

CREATE INDEX IF NOT EXISTS "AvailabilityChangeLog_instructorId_idx" 
ON "AvailabilityChangeLog"("instructorId");

CREATE INDEX IF NOT EXISTS "AvailabilityChangeLog_createdAt_idx" 
ON "AvailabilityChangeLog"("createdAt");

-- Add foreign key constraint
ALTER TABLE "AvailabilityChangeLog" 
ADD CONSTRAINT "AvailabilityChangeLog_availabilityId_fkey" 
FOREIGN KEY ("availabilityId") REFERENCES "InstructorAvailability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================
-- 5. Enable RLS on new table
-- =====================================================

ALTER TABLE "AvailabilityChangeLog" ENABLE ROW LEVEL SECURITY;
