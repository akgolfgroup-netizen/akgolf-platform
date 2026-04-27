-- Per-trening RSVP for gruppe-økter (Fase H)
-- Spilleren kan si "ja" eller "nei" til hver enkelt forekomst av en
-- gjentakende gruppe-økt. Default = ingen rad (regnes som "venter/ingen
-- avklaring") — det vi viser som "kommende" inntil spilleren har valgt.

CREATE TABLE "GroupSessionRSVP" (
  "id" TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "occurrenceDate" DATE NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'GOING',
  "respondedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "note" TEXT,
  CONSTRAINT "GroupSessionRSVP_session_fk"
    FOREIGN KEY ("sessionId") REFERENCES "GroupSession"("id") ON DELETE CASCADE,
  CONSTRAINT "GroupSessionRSVP_user_fk"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "GroupSessionRSVP_session_user_date_key"
  ON "GroupSessionRSVP" ("sessionId", "userId", "occurrenceDate");

CREATE INDEX "GroupSessionRSVP_user_idx" ON "GroupSessionRSVP" ("userId");
