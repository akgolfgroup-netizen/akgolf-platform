-- Foreldre/foresatte til juniorspillere (Fase I)
-- Maks 2 foreldre per barn — håndheves i server-action, ikke DB.

-- Utvid UserRole med PARENT
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'PARENT';

CREATE TABLE "ParentChildRelation" (
  "id" TEXT PRIMARY KEY,
  "parentId" TEXT NOT NULL,
  "childId" TEXT NOT NULL,
  "relationType" TEXT NOT NULL DEFAULT 'PARENT',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "ParentChildRelation_parent_fk"
    FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "ParentChildRelation_child_fk"
    FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "ParentChildRelation_no_self" CHECK ("parentId" <> "childId")
);

CREATE UNIQUE INDEX "ParentChildRelation_parent_child_key"
  ON "ParentChildRelation" ("parentId", "childId");

CREATE INDEX "ParentChildRelation_childId_idx" ON "ParentChildRelation" ("childId");
CREATE INDEX "ParentChildRelation_parentId_idx" ON "ParentChildRelation" ("parentId");
