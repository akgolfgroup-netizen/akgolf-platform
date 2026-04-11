# Mission Control (Admin) — Audit 2026-04-12

## Sammendrag

- **27 sider** (inkl. layout)
- **22 bruker reelle data** (Supabase/Prisma via actions.ts)
- **3 har mock/hardkodet data**
- RBAC via `canAccessMissionControl()` i layout.tsx
- Alle sider har server/client-split der nodvendig

## Status per side

| Side | Data | Status |
|------|------|--------|
| Layout | Reell (requirePortalUser + RBAC) | OK |
| Hub (page.tsx) | Reell (bookings, students, revenue) | OK |
| Agenter | Reell (getAgents, getAgentStats) | OK |
| AI-assistent | Reell (streaming fra /api/portal/ai/admin-chat) | OK |
| ~~Analytics~~ | ~~MOCK~~ Reell (actions.ts med aggregering) | OK |
| Bookinger | Reell (searchBookings + paginering + reschedule) | OK |
| Bookinger/ny | Reell (getServiceTypes, getInstructors) | OK |
| Denne-uken | Reell (getThisWeekBookings, getWeekStats) | OK |
| E-postmaler | Reell (getTemplates) | OK |
| Elever | Reell (fetchStudents + paginering) | OK |
| Elever/[id] | Reell (getStudentProfile, HCP, A-K) | OK |
| Fasiliteter | Reell (getFacilities, getTodaySchedule) | OK |
| **Fasiliteter/ny-aktivitet** | **MOCK** | Mock facility list, simulert skjema |
| **Fasiliteter/innstillinger** | **MOCK** | Mock facilities og instructor defaults |
| ~~Focus~~ | ~~MOCK~~ Reell (AdminTask CRUD, kanban, divisjoner) | OK |
| Godkjenninger | Reell (getPendingItems) | OK |
| Kalender | Reell (getBookingsForPeriod, getInstructors) | OK |
| Kapasitet | Reell (getCapacityData) | OK |
| ~~Meldinger~~ | ~~MOCK~~ Reell (Conversation + Message via Prisma) | OK |
| **Mission-board** | **Delvis** | API-kall reelle, mock visualisering |
| Notifications | Reell (push til spillere) | OK |
| Okonomi | Reell (getOkonomiData, ADMIN-only) | OK |
| Okter | Reell (getSessionOverview) | OK |
| ~~Rapporter~~ | ~~MOCK~~ Reell (CSV-eksport: bookinger, okonomi, elever) | OK |
| Tilgjengelighet | Reell (getAvailability, getBlockedTimes) | OK |
| Treningsplan | Reell (getStudentPlans/getExistingPlans) | OK |
| Turneringer | Ikke auditert separat | - |

## Fullfort 2026-04-11 → 2026-04-12

### Analytics — reell data (commit 7116690)
- Erstattet mock med `actions.ts`: aggregering fra bookinger, brukere, betalinger
- `dashboard-client.tsx` med KPIer, booking-trend, tier-fordeling

### Meldinger — koblet til Prisma (commit d509d75)
- `admin-chat-client.tsx`: bruker `getMyConversations()`, `getConversationMessages()`, `sendDirectMessage()` fra `chat-actions.ts`
- Samtaleliste med sok, ulest-teller, relativ tid
- Chat-vindu med optimistisk sending, lest-indikator

### Bookinger — reschedule-dialog (commit d509d75, 30c65ce)
- `reschedule-dialog.tsx`: endre booking-tidspunkt med kalender og ledig-slots
- Google Calendar-synk ved reschedule og kansellering

### Focus — kanban med AdminTask (commit 30c65ce)
- AdminTask Prisma-modell med CRUD via `actions.ts`
- Divisjonsfiltrering (Coaching/Junior/GFGK)
- Kanban-visning (Todo/InProgress/Done)
- `create-task-dialog.tsx` for opprettelse
- Dagens bookinger per divisjon

### Rapporter — CSV-eksport (commit 30c65ce, e231787)
- `actions.ts` med tre server actions:
  - `exportBookingsCSV(from, to)` — bookinger med elev, tjeneste, instruktor, betaling
  - `exportRevenueCSV(from, to)` — PaymentTransaction med brutto, MVA, gebyr, netto
  - `exportStudentsCSV()` — elever med HCP, klubb, tier, siste booking
- Knapper i UI koblet til ekte nedlasting via Blob

## Gjenstående mock-data

| Side | Problem | Prioritet |
|------|---------|-----------|
| Fasiliteter/ny-aktivitet | Mock facility list | P3 |
| Fasiliteter/innstillinger | Mock facilities og instructor defaults | P3 |
| Mission-board | Mock visualiseringsdata | P3 |

## RBAC-oversikt

| Rolle | Tilgang |
|-------|---------|
| ADMIN | Alt (inkl. okonomi) |
| INSTRUCTOR | Egne elever, kalender, coaching |
| INVITED | Begrenset visning |

## Arkitekturmonster

Alle admin-sider folger:
1. Auth-sjekk via layout.tsx (`canAccessMissionControl()`)
2. Server Actions i actions.ts
3. Client components for interaktivitet
4. Datoer serialiseres til ISO-strenger for client components
