# Mission Control (Admin) — Audit 2026-04-11

## Sammendrag

- **27 sider** (inkl. layout)
- **17 bruker reelle data** (Supabase/Prisma via actions.ts)
- **6 har mock/hardkodet data**
- RBAC via `canAccessMissionControl()` i layout.tsx
- Alle sider har server/client-split der nodvendig

## Status per side

| Side | Data | Status |
|------|------|--------|
| Layout | Reell (requirePortalUser + RBAC) | OK |
| Hub (page.tsx) | Reell (bookings, students, revenue) | OK |
| Agenter | Reell (getAgents, getAgentStats) | OK |
| AI-assistent | Reell (streaming fra /api/portal/ai/admin-chat) | OK |
| **Analytics** | **MOCK** | Hardkodede KPIer, trender, heatmap |
| Bookinger | Reell (searchBookings + paginering) | OK |
| Bookinger/ny | Reell (getServiceTypes, getInstructors) | OK |
| Denne-uken | Reell (getThisWeekBookings, getWeekStats) | OK |
| E-postmaler | Reell (getTemplates) | OK |
| Elever | Reell (fetchStudents + paginering) | OK |
| Elever/[id] | Reell (getStudentProfile, HCP, A-K) | OK |
| Fasiliteter | Reell (getFacilities, getTodaySchedule) | OK |
| **Fasiliteter/ny-aktivitet** | **MOCK** | Mock facility list, simulert skjema |
| **Fasiliteter/innstillinger** | **MOCK** | Mock facilities og instructor defaults |
| **Focus** | **MOCK** | Mock divisions, prosjekter, tasks |
| Godkjenninger | Reell (getPendingItems) | OK |
| Kalender | Reell (getBookingsForPeriod, getInstructors) | OK |
| Kapasitet | Reell (getCapacityData) | OK |
| **Meldinger** | **MOCK** | Mock conversations og messages |
| Mission-board | Delvis (API-kall, men mock visualisering) | Delvis |
| Notifications | Reell (push til spillere) | OK |
| Okonomi | Reell (getOkonomiData, ADMIN-only) | OK |
| Okter | Reell (getSessionOverview) | OK |
| **Rapporter** | **MOCK** | Mock rapporttyper og schedulerte rapporter |
| Tilgjengelighet | Reell (getAvailability, getBlockedTimes) | OK |
| Treningsplan | Reell (getStudentPlans/getExistingPlans) | OK |
| Turneringer | Ikke auditert separat | - |

## Kritiske funn

### 1. Analytics — helt mock

- Hardkodede KPIer, trenddata, heatmap, "student health"
- Ingen reell datahenting
- **Handling:** Implementer aggregering fra bookings, subscriptions, coaching-sessions

### 2. Focus — mock prosjektstyring

- Hardkodede divisjoner, prosjekter og oppgaver
- **Handling:** Koble til reell prosjektdata eller fjern/redesign

### 3. Meldinger — mock chat

- Hardkodede samtaler og meldinger
- **Handling:** Implementer reell meldingssystem (portal meldinger er reelle)

### 4. Rapporter — mock rapportgenerering

- Mock rapporttyper og planlagte rapporter
- **Handling:** Implementer faktisk rapportgenerering fra eksisterende data

### 5. Fasiliteter sub-sider — mock

- Ny-aktivitet og innstillinger har mock-data
- Hovedsiden fasiliteter er reell
- **Handling:** Koble sub-sider til reelle data

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
