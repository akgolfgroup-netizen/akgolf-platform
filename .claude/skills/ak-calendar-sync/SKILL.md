---
name: ak-calendar-sync
description: Kalender-synkronisering for AK Golf Platform. Håndterer ICS-feed, Google Calendar OAuth, og Apple Calendar webcal. Brukes når brukeren spør om kalender, synkronisering, Google Calendar, Apple Calendar, Outlook, eller kalender-abonnement.
---

# AK Calendar Sync

Denne skillen håndterer kalender-synkronisering for AK Golf Platform.

## Hva som støttes

1. **ICS-feed** (én-veis) — Spilleren får en unik URL som abonneres på i Apple Kalender, Outlook, eller Google Kalender
2. **Google Calendar** (to-veis) — OAuth2-basert synkronisering. Bookinger og treningsplaner synces automatisk
3. **Apple Calendar** — Via ICS-feed (webcal://)

## ICS-feed

Feeden inkluderer:
- Treningsplan-sesjoner (ukentlige økter)
- Bookinger (bekreftede og ventende)
- Turneringer
- Fullførte treningslogger

URL: `/api/portal/calendar/feed/{token}`
Token genereres via: `/api/portal/calendar/token` (POST)

## Google Calendar

Auth-flow:
1. `/api/portal/calendar/google/auth` — start OAuth
2. `/api/portal/calendar/google/callback` — callback
3. `/api/portal/calendar/google/sync` — manuell sync

## Viktige filer

- `lib/portal/calendar/google-calendar.ts` — Google Calendar API
- `lib/portal/calendar/ical.ts` — ICS-generering
- `lib/portal/calendar/training-plan-sync.ts` — Treningsplan → Google Calendar
- `app/api/portal/calendar/feed/[token]/route.ts` — ICS-feed endpoint
- `components/portal/kalender/calendar-sync-settings.tsx` — UI
