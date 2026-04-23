-- Add institution field to User for WANG/GFGK/other institution affiliation
ALTER TABLE "User" ADD COLUMN "institution" TEXT;

-- Index for filtering by institution (e.g. all WANG students)
CREATE INDEX "User_institution_idx" ON "User"("institution");
