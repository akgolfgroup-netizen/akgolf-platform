-- Booking V2 — generell venteliste-tabell uten kobling til en spesifikk Booking.
CREATE TABLE "BookingV2WaitlistSignup" (
  id              TEXT PRIMARY KEY,
  email           TEXT NOT NULL,
  phone           TEXT,
  "preferredDay"  TEXT,
  "preferredTime" TEXT,
  "serviceTypeId" TEXT,
  "trainerId"     TEXT,
  status          TEXT NOT NULL DEFAULT 'WAITING',
  "notifiedAt"    TIMESTAMPTZ,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "BookingV2WaitlistSignup_status_createdAt_idx"
  ON "BookingV2WaitlistSignup" (status, "createdAt");

CREATE INDEX "BookingV2WaitlistSignup_email_idx"
  ON "BookingV2WaitlistSignup" (email);

ALTER TABLE "BookingV2WaitlistSignup" ENABLE ROW LEVEL SECURITY;
