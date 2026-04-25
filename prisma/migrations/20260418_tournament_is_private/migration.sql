-- Tournament: isPrivate-flagg for spiller-opprettede turneringer
ALTER TABLE "Tournament"
  ADD COLUMN IF NOT EXISTS "isPrivate" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "Tournament_createdById_idx"
  ON "Tournament"("createdById");

CREATE INDEX IF NOT EXISTS "Tournament_isPrivate_idx"
  ON "Tournament"("isPrivate");
