-- Multi-kalender Google-synk: én rad per valgt kalender per bruker
CREATE TABLE IF NOT EXISTS "UserCalendarSubscription" (
  "id"               TEXT PRIMARY KEY,
  "userId"           TEXT NOT NULL,
  "googleCalendarId" TEXT NOT NULL,
  "displayName"      TEXT,
  "backgroundColor"  TEXT,
  "enabled"          BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserCalendarSubscription_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserCalendarSubscription_userId_googleCalendarId_key"
  ON "UserCalendarSubscription"("userId", "googleCalendarId");

CREATE INDEX IF NOT EXISTS "UserCalendarSubscription_userId_idx"
  ON "UserCalendarSubscription"("userId");
