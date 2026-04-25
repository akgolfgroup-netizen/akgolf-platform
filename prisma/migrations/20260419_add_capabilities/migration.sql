-- CreateEnum
CREATE TYPE "Capability" AS ENUM (
    'MB_VIEW_OWN_PLAYERS',
    'MB_VIEW_ALL_PLAYERS',
    'MB_EDIT_TRAINING_PLAN',
    'MB_REGISTER_TEST_RESULT',
    'MB_APPROVE_CATEGORY_PROMOTION',
    'MB_CREATE_COACHING_SESSION',
    'MB_VIEW_COACHING_SIGNALS',
    'SCOUTING_VIEW',
    'SCOUTING_VIEW_JUNIORS',
    'SCOUTING_LINK_TO_USER',
    'SCOUTING_EXPORT_AGGREGATED',
    'KARTLEGGING_VIEW_OWN_PROFILE',
    'KARTLEGGING_VIEW_ANY_AK_PLAYER',
    'KARTLEGGING_EDIT_ASSIGNMENTS',
    'TOURNAMENT_VIEW',
    'TOURNAMENT_CREATE',
    'TOURNAMENT_MANAGE_PREP',
    'BOOKING_VIEW_OWN',
    'BOOKING_VIEW_ALL',
    'BOOKING_MANAGE',
    'BOOKING_RESCHEDULE_OTHER_COACHES',
    'CONTENT_VIEW',
    'CONTENT_EDIT',
    'CONTENT_PUBLISH',
    'FINANCE_VIEW',
    'FINANCE_EXPORT',
    'FINANCE_REFUND',
    'USERS_VIEW',
    'USERS_INVITE',
    'USERS_ASSIGN_ROLE',
    'USERS_ASSIGN_CAPABILITIES',
    'USERS_DEACTIVATE',
    'GDPR_VIEW_REQUESTS',
    'GDPR_HANDLE_REQUESTS',
    'GDPR_VIEW_AUDIT_LOG',
    'GDPR_EXPORT_USER_DATA',
    'SYSTEM_SETTINGS',
    'SYSTEM_VIEW_LOGS',
    'SYSTEM_RUN_CRON'
);

-- CreateEnum
CREATE TYPE "CapabilityChangeAction" AS ENUM ('GRANT', 'REVOKE', 'EXPIRE');

-- CreateTable
CREATE TABLE "UserCapability" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "capability" "Capability" NOT NULL,
    "grantedBy" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "note" TEXT,

    CONSTRAINT "UserCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapabilityChangeLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "capability" "Capability" NOT NULL,
    "action" "CapabilityChangeAction" NOT NULL,
    "performedBy" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "CapabilityChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCapability_userId_capability_key" ON "UserCapability"("userId", "capability");

-- CreateIndex
CREATE INDEX "UserCapability_userId_idx" ON "UserCapability"("userId");

-- CreateIndex
CREATE INDEX "UserCapability_capability_idx" ON "UserCapability"("capability");

-- CreateIndex
CREATE INDEX "CapabilityChangeLog_userId_performedAt_idx" ON "CapabilityChangeLog"("userId", "performedAt");

-- CreateIndex
CREATE INDEX "CapabilityChangeLog_performedBy_idx" ON "CapabilityChangeLog"("performedBy");

-- AddForeignKey
ALTER TABLE "UserCapability" ADD CONSTRAINT "UserCapability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
