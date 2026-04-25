-- Create TrainingGroup table
CREATE TABLE "TrainingGroup" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "coachId" TEXT NOT NULL,
  "description" TEXT,
  "periodType" TEXT NOT NULL DEFAULT 'grunnperiode',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TrainingGroup_pkey" PRIMARY KEY ("id")
);

-- Create GroupMembership table
CREATE TABLE "GroupMembership" (
  "id" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'PLAYER',
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "GroupMembership_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint on groupId + userId
CREATE UNIQUE INDEX "GroupMembership_groupId_userId_key" ON "GroupMembership"("groupId", "userId");

-- Add indexes
CREATE INDEX "TrainingGroup_coachId_idx" ON "TrainingGroup"("coachId");
CREATE INDEX "GroupMembership_groupId_idx" ON "GroupMembership"("groupId");
CREATE INDEX "GroupMembership_userId_idx" ON "GroupMembership"("userId");

-- Add foreign keys
ALTER TABLE "TrainingGroup" ADD CONSTRAINT "TrainingGroup_coachId_fkey"
  FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_groupId_fkey"
  FOREIGN KEY ("groupId") REFERENCES "TrainingGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GroupMembership" ADD CONSTRAINT "GroupMembership_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add groupId to TrainingPlan
ALTER TABLE "TrainingPlan" ADD COLUMN "groupId" TEXT;

-- Add foreign key from TrainingPlan to TrainingGroup
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_groupId_fkey"
  FOREIGN KEY ("groupId") REFERENCES "TrainingGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add index on TrainingPlan.groupId
CREATE INDEX "TrainingPlan_groupId_idx" ON "TrainingPlan"("groupId");
