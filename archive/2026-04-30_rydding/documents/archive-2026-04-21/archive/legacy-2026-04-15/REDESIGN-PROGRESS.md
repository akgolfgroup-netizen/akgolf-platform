# Redesign Progress Tracker

> Oppdater denne filen etter HVER ferdig fil. Bytt `[ ]` til `[x]`.
> Ved kontekst-tap: les denne filen for å finne hvor du er.

## FASE 1: Spillerportal

- [ ] 1.1  `app/portal/(dashboard)/turneringer/turneringer-client.tsx` (92 brudd)
- [ ] 1.2  `app/portal/(dashboard)/sosialt/sosialt-client.tsx` (26 brudd)
- [ ] 1.3  `app/portal/(dashboard)/ai-coach/page.tsx` (26 brudd)
- [ ] 1.4  `app/portal/(dashboard)/treningsplan/treningsplan-v2-client.tsx` (14 brudd)
- [ ] 1.5  `app/portal/(dashboard)/benchmark/benchmark-client.tsx` (13 brudd)
- [ ] 1.6  `app/portal/(dashboard)/statistikk/statistikk-client.tsx` (9 brudd)
- [ ] 1.7  `app/portal/(dashboard)/bookinger/[id]/booking-detail-client.tsx` (7 brudd)
- [ ] 1.8  `app/portal/(dashboard)/sammenligning/page.tsx` (7 brudd)
- [ ] 1.9  `app/portal/(dashboard)/abonnement/abonnement-client.tsx` (6 brudd)
- [ ] 1.10 `app/portal/(dashboard)/kalender/page.tsx` (6 brudd)
- [ ] 1.11 `app/portal/(dashboard)/dagbok/dagbok-client.tsx` (5 brudd)
- [ ] 1.12 `app/portal/(dashboard)/dagbok/dagbok-stats.tsx` (5 brudd)
- [ ] 1.13 `app/portal/(dashboard)/runde/[id]/oppsummering/page.tsx` (5 brudd)
- [ ] 1.14 `app/portal/(dashboard)/bookinger/bookinger-client.tsx` (4 brudd)
- [ ] 1.15 `app/portal/(dashboard)/runde/ny/start-round-client.tsx` (4 brudd)
- [ ] 1.16 `app/portal/(dashboard)/onboarding/onboarding-client.tsx` (3 brudd)
- [ ] 1.17 `app/portal/(dashboard)/dagbok/dagbok-calendar.tsx` (3 brudd)
- [ ] 1.18 `app/portal/(dashboard)/turneringsplan/tournament-list-with-periods.tsx` (3 brudd)
- [ ] 1.19 `app/portal/(dashboard)/bookinger/ny/book-coaching-form.tsx` (2 brudd)
- [ ] 1.20 `app/portal/(dashboard)/meldinger/page.tsx` (2 brudd)
- [ ] 1.21 `app/portal/(dashboard)/apper/page.tsx` (2 brudd)
- [ ] 1.22 `app/portal/(dashboard)/runde/ny/page.tsx` (2 brudd)
- [ ] 1.23 `app/portal/(dashboard)/bookinger/[id]/endre/page.tsx` (2 brudd)

**Fase 1 build-resultat:** _ikke kjørt ennå_

## FASE 2: Mission Control (Admin)

- [ ] 2.1  `app/admin/(authed)/ai-assistent/chat-client.tsx` (11 brudd)
- [ ] 2.2  `app/admin/(authed)/meldinger/admin-chat-client.tsx` (11 brudd)
- [ ] 2.3  `app/admin/(authed)/tilgjengelighet/page.tsx` (11 brudd)
- [ ] 2.4  `app/admin/(authed)/e-postmaler/e-postmaler-client.tsx` (10 brudd)
- [ ] 2.5  `app/admin/(authed)/bookinger/ny/ny-booking-client.tsx` (10 brudd)
- [ ] 2.6  `app/admin/(authed)/treningsplan/treningsplan-client.tsx` (10 brudd)
- [ ] 2.7  `app/admin/(authed)/kalender/kalender-client.tsx` (9 brudd)
- [ ] 2.8  `app/admin/(authed)/mission-board/page.tsx` (8 brudd)
- [ ] 2.9  `app/admin/(authed)/okter/okter-client.tsx` (8 brudd)
- [ ] 2.10 `app/admin/(authed)/rapporter/rapporter-client.tsx` (8 brudd)
- [ ] 2.11 `app/admin/(authed)/rapporter/page.tsx` (7 brudd)
- [ ] 2.12 `app/admin/(authed)/hub-oversikt-client.tsx` (7 brudd)
- [ ] 2.13 `app/admin/(authed)/fasiliteter/innstillinger/innstillinger-client.tsx` (7 brudd)
- [ ] 2.14 `app/admin/(authed)/focus/focus-client.tsx` (7 brudd)
- [ ] 2.15 `app/admin/(authed)/analytics/dashboard-client.tsx` (6 brudd)
- [ ] 2.16 `app/admin/(authed)/elever/[id]/student-detail-client.tsx` (6 brudd)
- [ ] 2.17 `app/admin/(authed)/bookinger/bookinger-client.tsx` (5 brudd)
- [ ] 2.18 `app/admin/(authed)/meldinger/meldinger-client.tsx` (5 brudd)
- [ ] 2.19 `app/admin/(authed)/elever/students-client.tsx` (4 brudd)
- [ ] 2.20 `app/admin/(authed)/okonomi/okonomi-client.tsx` (4 brudd)
- [ ] 2.21 `app/admin/(authed)/kapasitet/kapasitet-client.tsx` (4 brudd)
- [ ] 2.22 `app/admin/(authed)/agenter/agenter-client.tsx` (3 brudd)
- [ ] 2.23 `app/admin/(authed)/denne-uken/this-week-client.tsx` (3 brudd)
- [ ] 2.24 `app/admin/(authed)/fasiliteter/fasiliteter-client.tsx` (3 brudd)
- [ ] 2.25 `app/admin/(authed)/turneringer/turneringer-client.tsx` (2 brudd)
- [ ] 2.26 `app/admin/(authed)/godkjenninger/godkjenninger-client.tsx` (1 brudd)
- [ ] 2.27 `app/admin/(authed)/fasiliteter/ny-aktivitet/ny-aktivitet-client.tsx` (1 brudd)

**Fase 2 build-resultat:** _ikke kjørt ennå_

## FASE 3: Booking-system

- [ ] 3.1 `components/booking/booking-summary.tsx` (14 brudd)
- [ ] 3.2 `components/booking/booking-wizard.tsx` (11 brudd)
- [ ] 3.3 `components/booking/time-slots.tsx` (8 brudd)
- [ ] 3.4 `components/booking/date-picker.tsx` (5 brudd)
- [ ] 3.5 `components/booking/service-selector.tsx` (5 brudd)

**Fase 3 build-resultat:** _ikke kjørt ennå_

## Sluttverifisering

- [ ] `npx tsc --noEmit --skipLibCheck` — 0 feil
- [ ] `npm run build` — OK
- [ ] `grep -rn "grey-[0-9]" app/portal/ app/admin/ components/booking/ --include="*.tsx" | wc -l` — 0
- [ ] `grep -rn "#[0-9a-fA-F]\{6\}" app/portal/ app/admin/ components/booking/ --include="*.tsx" | grep -v "// " | wc -l` — 0
