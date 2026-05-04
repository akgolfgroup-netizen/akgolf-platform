# CoachHQ Inventory — 2026-05-03

**Fase 1 — Inventory (autonomt, ingen kodeendringer).**
Output fra 4 parallelle audit-agenter + verifisering. Driver Fase 2-prioritering.

**Stop-conditions:** 6 P0-bugs identifisert (under grensen på 10). Ingen schema-endringer foreslått. Ingen test-data generert.

**Korreksjoner mot tidligere antagelser i operativ-planen:**
- ✅ Stripe payment-funksjoner finnes faktisk: `lib/portal/stripe/off-session.ts` + `lib/portal/stripe/payment-link.ts` (booking-trace-agenten tok feil — disse er IKKE stubs).
- ✅ E-post + SMS finnes faktisk: `lib/portal/email/send-booking-email.ts` + `lib/portal/sms/send-booking-sms.ts` (også feilrapportert som missing).
- ✅ Seed-scripts finnes: 11 stk under `prisma/seed-*.ts` inkludert `seed-booking-implementation.ts`.
- ✅ OUT-sync branch er klar: `feat/booking-calendar-out-sync` har 2 commits foran main, beskriver "Google Calendar OUT-sync i v2-flow + kansellering" + "Google Calendar-kobling i /admin/kalender".

---

## 1. P0 — blokkerer operativ kjede (6 bugs)

| # | Bug | Fil | Estimat |
|---|---|---|---|
| **P0-1** | "Ny spiller"-knapp er død i /admin/elever — ingen `onClick`/`Link` | [elever-client-v2.tsx:58-61](app/admin/(authed)/elever/elever-client-v2.tsx) | S (15-30 min) |
| **P0-2** | Datovelger i ny booking låst til denne uken — ingen prev/next | [ny-booking-client.tsx:179-181, 386-421](app/admin/(authed)/bookinger/ny/ny-booking-client.tsx) | S (30-60 min) |
| **P0-3** | Empty state "Ingen treff" mangler "+ Opprett ny spiller"-CTA | [ny-booking-client.tsx:283-285](app/admin/(authed)/bookinger/ny/ny-booking-client.tsx) | M (1-2 t) — krever ny modal + servicelag |
| **P0-4** | Admin booking-create sender ikke bekreftelse (email/SMS) til spiller | [create-actions.ts](app/admin/(authed)/bookinger/create-actions.ts) — har `sendPaymentLinkSms`, mangler `sendBookingConfirmation`/`sendBookingConfirmationSms` | S (30-60 min) |
| **P0-5** | Admin booking-create pusher ikke til Google Calendar | [create-actions.ts](app/admin/(authed)/bookinger/create-actions.ts) — `syncBookingToCalendar` finnes i reschedule.ts men ikke i create | Allerede fikset i branch `feat/booking-calendar-out-sync` — krever **merge + verifisering** (S, 30 min) |
| **P0-6** | Kalender DAG/MÅNED/AGENDA-tabs viser "kommer snart" (3 av 4 visninger ikke implementert) | [kalender-client.tsx:231-238](app/admin/(authed)/kalender/kalender-client.tsx) | M (1-3 t) eller skjul tabs til de er klare (S, 15 min) |

**Total estimat for P0-suite:** 4-8 t (i tråd med planen). P0-5 er allerede i branch — bare merge.

### Operativ kjede — status per steg

| Steg | Status | Kommentar |
|---|---|---|
| 1. Login til CoachHQ | ✅ WORKS | Supabase signInWithPassword fungerer |
| 2. Se egen kalender | ✅ WORKS | `getBookingsForPeriod` i kalender/actions.ts |
| 3. Booking for eksisterende spiller | ⚠️ DELVIS | Selve flow fungerer, men kun for denne uken (P0-2) |
| 4. Booking for **ny** spiller | ❌ BROKEN | P0-3 — empty state mangler create-CTA |
| 5. Velge dato på ANY uke | ❌ BROKEN | P0-2 — låst til startOfWeek |
| 6. Sync til Google Calendar | ⚠️ DELVIS | Reschedule funker; create gjør IKKE (P0-5, fix i branch) |
| 7. Spiller får bekreftelse | ❌ BROKEN ved admin-create | P0-4 — public booking sender, admin gjør ikke |
| 8. Spiller kan betale | ✅ WORKS | Stripe live + `payment-link.ts`/`off-session.ts` finnes |
| 9. Endre/avlyse → Calendar oppdateres | ✅ WORKS | reschedule.ts har full Calendar-integrasjon |
| 10. Tilgjengelighet/blokkerte tider respekteres | ❓ UNCLEAR | Data-laget finnes (`getInstructorAvailabilityPrisma`, `getBlockedTimesForPeriod`); enforcement i `/api/portal/public/slots` ikke verifisert i denne audit-en |

---

## 2. P1 — Synlig rot, fungerer ikke (≥12 saker)

### Mock-data-flater (11 admin-flater driver på fiktive data)
Disse ser "ferdige" ut men viser ikke ekte data. Ikke vis til Anders/Markus før dette er løst.

| Flate | Mock-fil |
|---|---|
| /admin/lokasjoner | `components/admin/lokasjoner/mock-data.ts` |
| /admin/tjenester | `components/admin/tjenester/` |
| /admin/godkjenninger | `components/admin/godkjenninger/` |
| /admin/tilgjengelighet | `components/admin/tilgjengelighet/` |
| /admin/library | `components/admin/library/` |
| /admin/agenter | `components/admin/agenter/` |
| /admin/okter | `components/admin/okter/` |
| /admin/team | `components/admin/team/` |
| /admin/fasiliteter (v2) | `components/admin/fasiliteter/v2/` |
| /admin/grupper (detalj) | `components/admin/grupper/detail-mock-data.ts` |
| /admin/rapporter | hardkodet mock-array i [page.tsx:59](app/admin/(authed)/rapporter/page.tsx) + disabled eksport |

### Andre P1-funn
| # | Bug | Fil |
|---|---|---|
| P1-1 | /admin/lokasjoner: filter- og ny-knapp viser `alert("Filter kommer snart")` | [lokasjoner-client.tsx:164,172](app/admin/(authed)/lokasjoner/lokasjoner-client.tsx) |
| P1-2 | Spillerprofil — 5 PlaceholderTab-er ("kommer snart") | [spillerprofil-tabs-client.tsx:684-815](app/admin/(authed)/elever/[id]/spillerprofil-tabs-client.tsx) |
| P1-3 | Spillerprofil Mental: knapper med `alert("Signal avvist")`/`alert("Snoozed")` | [spillerprofil-longpage-client.tsx:773,882,905](app/admin/(authed)/elever/[id]/spillerprofil-longpage-client.tsx) |
| P1-4 | Capacity-manager lagrer ikke (`// TODO: Save to API`) | [capacity-manager.tsx:94](components/admin/kalender/capacity-manager.tsx) |
| P1-5 | Treningsplan-bygger på mock-data | [builder-client.tsx:13](components/admin/treningsplan-bygger/builder-client.tsx) |
| P1-6 | AI-assistent follow-up-tabell på mock-data | [follow-up-table.tsx:1](components/admin/ai-assistent/follow-up-table.tsx) |

---

## 3. Duplikat-/dødt-kode-rydding (P1-strukturelt)

### Cluster A — Hub/landing (5 ruter, 1 må vinne)
| Rute | Status |
|---|---|
| **/admin** (HubClientV2) | ACTIVE — primary |
| /admin/hub (HubClient) | DUPLICATE — alias mot /admin |
| /admin/mission-board | DEAD — alias mot /admin |
| /admin/focus | DEAD — alias mot /admin |
| /admin/denne-uken | STUB — alias mot /admin/kalender |

**Anbefaling:** behold /admin (HubClientV2). Slett 4 andre.

### Cluster B — Fasilitet/lokasjon (3 → 1)
| Rute | Status |
|---|---|
| **/admin/anlegg** | ACTIVE — konsolidert |
| /admin/lokasjoner | DEAD — alias |
| /admin/fasiliteter | DEAD — alias |

### Cluster C — Tilgjengelighet/kapasitet (2 → 1)
| Rute | Status |
|---|---|
| **/admin/tilgjengelighet** | ACTIVE |
| /admin/kapasitet | DEAD — alias |

### Cluster D — Kalender (overlapp mellom kalender og tilgjengelighet)
- /admin/kalender har Google Calendar-knytning + uke-visning
- /admin/tilgjengelighet har slot-redigering + blokkerte tider
- **Problem:** `kalender-availability-panel.tsx` (i /admin/kalender/) er allerede dødt kode
- **Anbefaling for Fase 4:** /admin/kalender = hovedside for Calendar-handlinger; /admin/tilgjengelighet = uke-mønster + blokkerte tider, lenker til /admin/kalender for OAuth.

### Cluster E — Meldinger (2 → 1)
| Rute | Status |
|---|---|
| **/admin/meldinger** | ACTIVE |
| /admin/notifications | STUB med RBAC, alias mot meldinger |

### Orphan-ruter (i kodebasen, ikke i nav)
- /admin/baner (ingen nav, ingen actions.ts) — slett eller dokumenter
- /admin/dashboard (orphan, antatt experimental) — slett
- `app/admin/(authed)/elever/students-client.tsx` (571 linjer, ikke importert) — slett

### To parallelle nav-config-filer
- `components/admin/coachhq/coachhq-nav-config.ts` — primary (gjeldende)
- `components/admin/coachhq-dark/CoachHQDarkNav.tsx` — referanser DEAD-ruter (mission-board, hub, focus, lokasjoner, fasiliteter, notifications)
- **Anbefaling:** synkroniser til primary, slett gamle referanser.

---

## 4. Portal-flate (informativ — ikke i operativ kjede)

**36 ruter under `app/portal/(dashboard)/`. Av disse er kun 4 i sidebar:**
- /portal (dashboard) — bruker `DashboardV2Client` (verifisert: page.tsx:20+90)
- /portal/treningsplan
- /portal/teknisk-plan
- /portal/bookinger

De andre 32 er orphaned-by-design — dokumentert i [sidebar.tsx:36-39](components/portal/layout/sidebar.tsx) som "WIP, skjult fra nav til lansering".

**Dødt kode i portal:**
- `dashboard-client-v3.tsx` + `dashboard-bento-client.tsx` — eksisterer men ikke rendered av `page.tsx`
- `dashboard-views/` — kun `athletic-grid-view.tsx` brukes (av v3 som ikke kjører)

**Stats-cluster overlapp:** /portal/analyse + /portal/statistikk + /portal/sammenligning + /portal/benchmark + /portal/talent — overlapping konsept, men alle hidden fra nav.

**Konklusjon:** Portal er IKKE blokker for operativ status. Skjult-rute-strategien er bevisst og dokumentert.

---

## 5. Anbefalt Fase 2-rekkefølge (forslag til Anders)

Sortert etter avhengighet og operativ blokkering. Anders kan justere.

```
P0-5 (merge OUT-sync branch)        ← raskest, allerede ferdig kode (S)
   ↓
P0-1 (ny spiller-knapp)              ← uavhengig, åpner elever-flyt (S)
   ↓
P0-2 (ukenavigasjon)                 ← uavhengig, åpner booking for fjerne datoer (S)
   ↓
P0-3 (opprett spiller i bookingflyt) ← bygger på P0-1 og P0-2 (M)
   ↓
P0-4 (sender bekreftelse fra admin)  ← uavhengig, men ble synlig først nå (S)
   ↓
P0-6 (skjul DAG/MÅNED/AGENDA-tabs)   ← rask kosmetisk, eller bygg dem (S/M)
   ↓
Verifisering (steg 10 — availability) ← må bekreftes manuelt med booking-test
```

**Total P0-tid:** 4-8 timer i tråd med planen.

---

## 6. Seed-data-status (informativ)

11 seed-scripts finnes:
```
prisma/seed.ts                          (hovedrute)
prisma/seed-agents.ts
prisma/seed-booking-implementation.ts   (relevant for testing)
prisma/seed-coaching.ts
prisma/seed-config.ts
prisma/seed-course-strategy.ts
prisma/seed-courses.ts
prisma/seed-modules.ts
prisma/seed-prod.ts
prisma/seed-service-types.ts
prisma/seed-simple.ts
prisma/seed-tests.ts
```

**Ikke verifisert:** om `npx prisma db seed` faktisk produserer test-spillere/instruktører for lokal testing av P0-3-fixen. Bør sjekkes når Fase 3 starter — hvis ikke, må enten `seed-simple.ts` utvides eller test-spillere opprettes via UI når P0-3 er i gang (chicken-and-egg).

---

## 7. Funn parkert til Fase 6 (postoperativ rydding)

Ikke handle på disse før operativ er nådd. Listet for kontekst:

### P2 — DB-rensing (nytt funn 2026-05-03)
- 100 test-User-rader (@example.com) fra integrasjonstester ligger i prod-DB siden 17. april
- 100+ FK-tabeller refererer potensielt til disse — kompleks rensing
- **Ikke skadelige**, ingen blokker for operativ
- Plan: egen plan-mode-sesjon — kartlegg FK-relasjoner, lag cleanup-script som sletter i riktig rekkefølge, eller skip og legg til afterAll-hook i test-suites for å unngå ny innsig
- Konsekvens for P0-1-test: nye spiller-rader Anders oppretter manuelt vil blande seg med test-radene i listen — bruk distinct emails/navn for å skille

### Annet
- 525 hardkodede hex (Brand Guide V2.0-migrering)
- 21 TS-feil i portal/login + live-round-client
- 56 smoke-tester som krever localhost
- Material Symbols → Lucide (6 filer)
- 11 filer med `console.log` i prod
- 53 TODO/FIXME-markører
- 9 npm vulnerabilities
- 3 Prisma migration drift-saker
- Slett `students-client.tsx` (orphan, 571 linjer)
- Slett `kalender-availability-panel.tsx` (orphan)
- Slett /admin/{hub,mission-board,focus,denne-uken,lokasjoner,fasiliteter,kapasitet,notifications,baner,dashboard} alias-mapper
- Sync `CoachHQDarkNav.tsx` mot `coachhq-nav-config.ts` (eller slett en av dem)

---

## 8. Tids-estimat for Fase 3 (operativ booking)

I tråd med planen — bekreftet etter inventar:

| P0-fix | Estimat | Kumulativt |
|---|---|---|
| P0-5 (merge branch) | 30 min | 0,5 t |
| P0-1 (ny spiller-knapp) | 30 min | 1,0 t |
| P0-2 (uke-nav) | 60 min | 2,0 t |
| P0-3 (opprett spiller-modal) | 2 t | 4,0 t |
| P0-4 (send bekreftelse fra admin) | 60 min | 5,0 t |
| P0-6 (skjul stub-tabs) | 30 min | 5,5 t |
| Verifisering steg 10 (availability) | 60 min | 6,5 t |
| Smoke-test alle 10 steg E2E | 60 min | 7,5 t |

**Realistisk samlet tid: 6-9 timer.** Innenfor planens 4-8 t (inkl. verifisering).

---

## 9. Hva som IKKE er gjort i denne fasen

- Ingen kodeendringer
- Ingen migrations
- Ingen test-data generert
- Ingen merge av `feat/booking-calendar-out-sync` (rapportert, ikke utført)
- Steg 10 (availability enforcement) ikke verifisert end-to-end — krever booking-test med blokkert tid for å bekrefte
- Stripe live-checkout ikke testet end-to-end (krever ekte kort eller refund-flyt)
- Ingen visuell verifisering av kalender DAG/MÅNED/AGENDA — kun lest stub-melding i kode

---

## 10. Klart for Fase 2

Anders bestemmer P0-rekkefølge i `plans/coachhq-fix-sequence.md` etter denne rapporten. Forslag i seksjon 5.

**Branch som venter på merge:** `feat/booking-calendar-out-sync` (2 commits, dekker P0-5).
