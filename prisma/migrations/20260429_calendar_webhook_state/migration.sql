-- Sprint 7.3 — Google Calendar webhook state per Instructor
-- Lagrer aktive webhook-kanaler så `renewExpiringWebhooks()` kan
-- finne og fornye dem før Google trekker dem (max 7 dager hos Google).
--
-- Endringer på Instructor:
--   calendarWebhookChannelId    String?    — Google channel id (vår egen)
--   calendarWebhookResourceId   String?    — Google resource id (returnert ved watch)
--   calendarWebhookExpiration   DateTime?  — utløpstidspunkt fra Google
--   calendarWebhookCalendarId   String?    — kalender-id watch ble registrert mot

ALTER TABLE "Instructor"
  ADD COLUMN "calendarWebhookChannelId" TEXT,
  ADD COLUMN "calendarWebhookResourceId" TEXT,
  ADD COLUMN "calendarWebhookExpiration" TIMESTAMP(3),
  ADD COLUMN "calendarWebhookCalendarId" TEXT;

CREATE INDEX "Instructor_calendarWebhookExpiration_idx"
  ON "Instructor" ("calendarWebhookExpiration");
