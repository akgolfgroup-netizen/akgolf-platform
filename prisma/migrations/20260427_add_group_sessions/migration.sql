-- Gruppe-sesjoner med RRULE (Fase F)

CREATE TABLE "GroupSession" (
  "id" TEXT PRIMARY KEY,
  "groupId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "locationId" TEXT,
  "startTime" TIMESTAMPTZ NOT NULL,
  "endTime" TIMESTAMPTZ NOT NULL,
  "recurrenceRule" TEXT,
  "recurrenceUntil" TIMESTAMPTZ,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "GroupSession_group_fk"
    FOREIGN KEY ("groupId") REFERENCES "TrainingGroup"("id") ON DELETE CASCADE,
  CONSTRAINT "GroupSession_location_fk"
    FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL
);

CREATE INDEX "GroupSession_groupId_idx" ON "GroupSession" ("groupId");
CREATE INDEX "GroupSession_startTime_idx" ON "GroupSession" ("startTime");

-- Per-occurrence override (kun for kanselleringer eller flyttinger;
-- normale gjentakelser ekspanderes fra recurrenceRule on-demand).
CREATE TABLE "GroupSessionOccurrence" (
  "id" TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL,
  "originalDate" DATE NOT NULL,
  "isCancelled" BOOLEAN NOT NULL DEFAULT false,
  "overrideStartTime" TIMESTAMPTZ,
  "overrideEndTime" TIMESTAMPTZ,
  "overrideLocationId" TEXT,
  "note" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "GroupSessionOccurrence_session_fk"
    FOREIGN KEY ("sessionId") REFERENCES "GroupSession"("id") ON DELETE CASCADE,
  CONSTRAINT "GroupSessionOccurrence_location_fk"
    FOREIGN KEY ("overrideLocationId") REFERENCES "Location"("id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX "GroupSessionOccurrence_session_date_key"
  ON "GroupSessionOccurrence" ("sessionId", "originalDate");
