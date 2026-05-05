# CoachHQ — feature-kartlegging

Audit-dato: 2026-05-05. Kilde: `app/admin/`, `components/admin/`, `lib/portal/capabilities/`, `app/admin/(authed)/elever/[id]/v2/get-student-360.ts`, `prisma/schema.prisma`.

CoachHQ er coach-/admin-flaten som bor under `/admin/*` (rebrand fra Mission Control 2026-04-25). Den deler `app/admin/login/` med portalen og er ellers gruppert i `app/admin/(authed)/`. Filnavn og DB-felter beholder fortsatt "mission-control"/"MC" for bakoverkompatibilitet.

> Merknad: Mappen `components/portal/coachhq/` finnes ikke. Det reelle CoachHQ-komponenttreet er splittet i to:
> - `components/admin/coachhq-dark/` — primitiver fra Brand Guide V2.0 (Card, Pill, KpiCard, Table, Shell, Rail, Nav, Topbar, PageHead, ActivityItem, avatar). Dette er hovedtreet etter Tier 3B-konsolideringen (2026-05-02).
> - `components/admin/coachhq/` — kun byggesteiner for `CoachHQSidebar` (`IconRail.tsx`, `NameList.tsx`, `LiveStatusFooter.tsx`, `coachhq-nav-config.ts`). Ingen egne primitiver.
> Mye av admin-innholdet ligger fortsatt i `components/admin/<feature>/` eller bruker legacy `components/portal/mission-control/` (`MCLayout`, `MCTopbar`, `useMCSidebar`, `AdminToastProvider`, `AdminCommandPalette`, `AdminInput`, `AdminDialog`, `AdminDataTable`).

---

## Navigasjon og layout

| Fil | Funksjon | Status |
|---|---|---|
| `app/admin/layout.tsx` | Topp-layout (uten auth) | Ferdig |
| `app/admin/login/page.tsx` | Login-side | Ferdig |
| `app/admin/(authed)/layout.tsx` | Auth-gate via `getPortalUser()` + `canAccessMissionControl()`; redirect til `/admin/login` ved fall | Ferdig |
| `app/admin/(authed)/admin-shell.tsx` | Klient-shell. Splitter ruter mellom ny `CoachHQDarkShell` (Hub, Elever, Mission Board, Coaching Board, Focus, Godkjenninger, Denne uken) og legacy `MCLayout`. Bygger command-palette fra `MC_NAV_CONFIG` | Delvis — to parallelle shells ko-eksisterer |
| `app/admin/(authed)/error.tsx`, `loading.tsx` | Globale fallback for (authed) | Ferdig |
| `components/admin/CoachHQSidebar.tsx` | Tre-panel-sidebar (56px ikon-rail + 200px navnliste). Bruker `IconRail`, `NameList`, `LiveStatusFooter`, `coachhq-nav-config.ts` | Ferdig |
| `components/admin/coachhq/coachhq-nav-config.ts` | Nav-struktur med 6 seksjoner (I dag / Planlegg / Følg opp / Analyse / Drift / Verktøy) + HREF_ALIASES + `getActiveNavItem()` | Ferdig |
| `components/admin/coachhq-dark/CoachHQDarkShell.tsx` | Ny mørk shell (Brand Guide V2.0). Wrapper for nye Hub-/elever-sider med Rail+Nav+Topbar | Ferdig |
| `components/admin/coachhq-dark/{CoachHQDarkRail, CoachHQDarkNav, CoachHQDarkTopbar, PageHead}.tsx` | Layout-primitiver | Ferdig |
| `components/portal/mission-control/` | Legacy `MCLayout`, `MCTopbar`, `useMCSidebar`, toast/command palette. Brukes fortsatt av ca. 30 sider | Delvis (legacy, planlagt slettet) |
| `app/admin/(authed)/dagens-fokus-client.tsx` | Eksistert som klient-fil i rot — IKKE rendret fra noen page.tsx | Ubrukt/dead code |
| `app/admin/(authed)/hub-oversikt-client.tsx` | Klient-fil i rot — IKKE rendret fra noen page.tsx | Ubrukt/dead code |
| `app/admin/(authed)/dashboard/prioriterte-elever-kort.tsx` | Komponent uten egen page.tsx — sjekk om importert annetsteds | Sannsynlig ubrukt |

Auth-krav for hele området: `canAccessMissionControl(user.role)` (ADMIN, INSTRUCTOR, INVITED). Per-side gates ligger på enkelte sider (`team/`, `library/`, `coaching-board/`).

---

## Hub / Dagens fokus

| Rute | Hva | Status |
|---|---|---|
| `/admin` (`(authed)/page.tsx`) | Hub-oversikt. Henter `getHubStats`, `getHubModuleCounts`, `getHubActivity` og rendrer `HubClientV2` i `CoachHQDarkShell` | Ferdig |
| `/admin/hub` (`hub/page.tsx`) | Eldre hub-versjon — duplikat (alias til `/admin` via `HREF_ALIASES`) | Delvis — duplikat |
| `/admin/focus` | Mine oppgaver per division (TODO/IN_PROGRESS), bruker `AdminDivision` + `AdminTaskStatus` | Ferdig |
| `/admin/denne-uken` | Ukens bookinger. `getThisWeekBookings`, `getWeekStats` | Ferdig |
| `app/admin/(authed)/hub/hub-actions.ts` | `getHubStats`, `getHubModuleCounts`, `getHubActivity` | Ferdig (med fallback til 0 ved feil) |

Komponenter: `components/admin/hub/{hub-hero,activity-panel,module-strip,shortcuts-panel,mock-data,types}.tsx` og `components/admin/coachhq-dark/d27/*` (parallell variant). `mock-data.ts` flagget med TODO.

---

## Spillerliste

| Rute | Hva | Status |
|---|---|---|
| `/admin/elever` (`elever/page.tsx`) | Hovedspillerliste i `CoachHQDarkShell`. Kaller `fetchStudents()` og `EleverClientV2` | Ferdig |
| `/admin/elever/oversikt` | Alternativ tabellvisning (`elev-oversikt-client.tsx`). Kaller `getElevOversikt()` | Ferdig |
| `app/admin/(authed)/elever/elever-client-v2.tsx` | Søk + filtre (all/active/new/atRisk) + tabell. `useState` for søk og filter. **Ingen sortering** — kun standard alfabetisk fra Supabase. | Delvis (mangler eksplisitt sortering, sider/paginering vises ikke) |
| `app/admin/(authed)/elever/students-client.tsx` | Eldre liste-variant — sjekk import | Ubrukt? |
| `app/admin/(authed)/elever/ny-eleve-dialog.tsx` | Modal for ny spiller, bruker `createStudent` | Ferdig |

### Server actions

| Action | Fil | Hva |
|---|---|---|
| `fetchStudents(query, page)` | `elever/actions.ts` | Henter `User` (STUDENT) via Supabase service-client + parallelt: `HandicapEntry`, `RoundStats`, `Booking` (siste/neste/månedlige), `TrainingPlan`. Bygger `StudentRow[]`. Bruker `scoreToCategory()` (A–K-skala). |
| `searchStudents(query, page)` | samme | Legacy, bruker stort sett av `components/portal/admin/student-list.tsx` |
| `getElevOversikt()` | `elever/oversikt/actions.ts` | Tabellrad-aggregat |
| `getArbeidsflateKpis/StudentList/ActiveSession` | `elever/arbeidsflate-actions.ts` | KPI + active session |
| `createStudent(...)` | `elever/create-actions.ts` | Opprett ny student |
| `listParentsForChild`, `searchPotentialParents`, `createParentAndLink`, `linkExistingParent`, `removeParentLink` | `elever/parent-actions.ts` | Foresatte/forelderkobling |

Auth: `requirePortalUser()` + `isStaff(user.role)`. Ingen capability-gating.

A–K-kategori beregnes i `actions.ts` (`scoreToCategory`) basert på snittscore. Et **annet** A–K-mapping finnes i `get-student-360.ts` (`hcpToCategory`) basert på HCP — disse er ikke synkronisert.

---

## Spillerprofil 360°

To parallelle implementasjoner side om side:

### v2 (Brand Guide V2.0, designfasit `student-360-reference.html`)

| Rute | Fil | Status |
|---|---|---|
| `/admin/elever/[id]/v2` | `app/admin/(authed)/elever/[id]/v2/page.tsx` | Ferdig |
| Server | `app/admin/(authed)/elever/[id]/v2/get-student-360.ts` | Delvis (kjente TODO) |

`getStudent360(studentId)` returnerer `Student360Data` (9 grupper):
- `IdentityGroup` — User + UserGolfId + AppSubscription
- `GolfGroup` — HandicapEntry-historikk, hcpDelta30d, hcpHistory; `sgTotal/sgDelta/sgBreakdown` er **stub (null/0)**, `datagolfBenchmark` er **null**
- `CoachingGroup` — siste 5 CoachingSession + neste Booking
- `TrainingGroup` — TrainingPlan + TrainingPlanWeek + TrainingPlanSession + TrainingLog (completion %, hoursPerWeek, drills)
- `MentalGroup` — MentalProfile (trykktoleranse, selvtillit, aksept, fokus)
- `ForecastGroup` — siste CoachingForecast (`norwegianPercentile` er **null**)
- `TestsGroup` — TestResult + TestDefinition (personal best + retest-status)
- `EconomyGroup` — `getStudentEconomy()` fra `lib/portal/economy/student-metrics`
- `SignalsGroup` — DegradationTracking (kun TILBAKEGANG; **mangler FRAMGANG-sporing**)

Eksplisitte TODO i fil:
- SG-breakdown krever USISnapshot-modell (ikke i schema)
- DataGolf benchmark krever pgaPlayerId-mapping (Sprint 4 cache finnes)

Komponenter (alle ferdig som visning, men matet fra dels mock-data fra parent):
- `components/admin/spillerprofil-360/Hero360.tsx`
- `KontaktinfoCard.tsx`
- `GolfCard.tsx`
- `CoachingCard.tsx`
- `TrainingCard.tsx`
- `MentalForecastCard.tsx`
- `TestsCard.tsx`
- `EconomyCard.tsx`
- `SignalsCard.tsx`
- `shell.tsx` — wrapper

Layout: 4 rader med `grid-cols-12` (5/7-split, alternerende).

### v1 (eldre tabs-variant — fortsatt default)

| Rute | Fil | Status |
|---|---|---|
| `/admin/elever/[id]` (default) | `app/admin/(authed)/elever/[id]/page.tsx` → `ElevDetaljClientV2` | Ferdig |
| Tabs | `tabs/profil-tab.tsx`, `trening-tab.tsx`, `bookinger-tab.tsx`, `statistikk-tab.tsx`, `coaching-tab.tsx` | Ferdig |
| `spillerprofil-tabs-client.tsx`, `spillerprofil-longpage-client.tsx`, `student-detail-client.tsx`, `training-data-tabs.tsx` | Eldre varianter | Sannsynlig delvis ubrukt |

Tabs-id: `profil | trening | bookinger | statistikk | coaching` (ikke 360°-grupper).

### Tester-undermodul

| Rute | Hva | Status |
|---|---|---|
| `/admin/elever/[id]/tester` | Coach test-register | Ferdig |
| `tester/actions.ts` → `getCoachTestRegister(studentId)` | Henter testresultater | Ferdig |

### Coach-agent (utenfor `(authed)`-gruppe)

| Rute | Hva | Status |
|---|---|---|
| `/admin/elever/[id]/coach-agent` | AI coach-chat per student. **NB:** ligger utenfor `(authed)/` så den arver IKKE shell eller auth-redirect | Delvis (auth-gate uklar — verifiser) |
| `coach-agent/actions.ts` → `sendCoachAgentMessage`, `listCoachAgentSessions` | AI-meldinger | Delvis |

### Elev-server-actions

| Action | Fil |
|---|---|
| `getStudentProfile(studentId)`, `updateCoachingNotes` | `[id]/actions.ts` |
| `getCommunicationLogs`, `addCommunicationLog` | `[id]/communication-actions.ts` |
| `getStudentTrainingPlan/Logs/RoundStats/Rounds/Degradation/LPhases/TrackManSessions`, `setStudentLPhase`, `addCoachNote` | `[id]/student-training-actions.ts` |

---

## Booking og kalender

### Bookinger

| Rute | Fil | Status |
|---|---|---|
| `/admin/bookinger` | `bookinger/page.tsx` → `BookingerClientV2` | Ferdig |
| `/admin/bookinger/ny` | `bookinger/ny/page.tsx` → `NyBookingClient` | Ferdig |
| Detail drawer | `booking-detail-drawer.tsx` | Ferdig |
| Reschedule | `reschedule-dialog.tsx` | Ferdig |
| Session plan panel | `session-plan-panel.tsx` | Ferdig |
| Bookinger-data | `bookinger-data.ts` | Helper |

Server actions (`bookinger/actions.ts`):
- `searchBookings(...)` — filter + søk
- `adminCancelBooking(...)` — refunder + e-post + audit
- `adminRescheduleBooking(...)`
- `bulkCancelBookings(...)`

`bookinger/create-actions.ts`:
- `adminCreateBooking({...})`
- `adminCreateBookingWithPayment({...})`
- `bulkSendReminder([...])`
- `getServiceTypes()`, `getInstructors()`, `getFacilities()`, `getInstructorDefaultFacility()`, `searchStudentsForBooking(query)`

Auth: `requirePortalUser` + `isStaff`. Ingen `BOOKING_MANAGE`-capability-gate enda (defineres i katalog men ikke håndhevet).

### Kalender

| Rute | Fil | Status |
|---|---|---|
| `/admin/kalender` | `kalender/page.tsx` → `KalenderClient` | Ferdig |
| Klient | `kalender-client.tsx` | Ferdig |
| Visninger | `kalender-week-view.tsx`, `kalender-month-view.tsx`, `kalender-heatmap.tsx`, `kalender-overlays.tsx`, `kalender-sidebar.tsx`, `kalender-controls.tsx` | Ferdig |
| Tilgjengelighetspanel | `kalender-availability-panel.tsx`, `availability-blocked-times.tsx` | Ferdig |
| Helpere | `kalender-utils.ts`, `kalender-week-data.ts` | Helper |

Server actions (`kalender/actions.ts`):
- `getBookingsForPeriod`, `getBookingsForDay`, `getBookingsForWeek`
- `getInstructors`
- `markNoShow`, `markBookingCompleted`, `addAdminNote`
- `getBlockedTimesForPeriod`
- `getInstructorAvailabilityPrisma`, `upsertInstructorAvailabilityPrisma`, `deleteInstructorAvailabilityPrisma`
- `createBlockedTimePrisma`, `deleteBlockedTimePrisma`
- `getServiceTypesPrisma`

`components/admin/kalender/mock-data.ts` har TODO — erstatt med `prisma.booking.findMany()`. `capacity-manager.tsx` har TODO "Save to API".

### Kapasitet

| Rute | Fil | Status |
|---|---|---|
| `/admin/kapasitet` | `kapasitet/page.tsx` → `KapasitetClient` | Ferdig |

Server actions:
- `getCapacityData()` (`kapasitet/actions.ts`)
- `getWeekCapacityWithOverrides`, `saveWeekOverride`, `deleteWeekOverride`, `getPackageDemand`, `getInstructors` (`kapasitet/week-actions.ts`)

### Denne uken

| Rute | Hva | Status |
|---|---|---|
| `/admin/denne-uken` | Ukens bookinger | Ferdig |
| Server | `getThisWeekBookings`, `getWeekStats` | Ferdig |

---

## Tilgjengelighet

| Rute | Fil | Status |
|---|---|---|
| `/admin/tilgjengelighet` | `tilgjengelighet/page.tsx` (client component) | Delvis — bruker fortsatt legacy `MCTopbar`, `AdminInput`, `AdminDialog`, `AdminDataTable` og Material Symbols-ikoner via `Icon name="..."` |

Tre tabs: Arbeidstider, Blokkerte tider, Google Calendar.

Server actions (`tilgjengelighet/actions.ts`):
- `getInstructors()`
- `getAvailability(instructorId)`, `upsertAvailability(instructorId, slots)`
- `getBlockedTimes(instructorId?)`
- `createBlockedTime({...})`, `createClosedPeriod({...})`, `deleteBlockedTime(id)`
- `syncGoogleCalendar(instructorId)` — kaller `/api/portal/public/slots` for cache-invalidering etter lagring

Komponenter: `components/admin/tilgjengelighet/{closed-period-dialog, exceptions-panel, rules-panel, week-card, page-header, mock-data}.tsx` (mock-data har TODO). `kalender/availability-month-calendar.tsx`, `availability-settings.tsx`, `google-calendar-picker.tsx`.

---

## CBAC / Tilgangskontroll

### Capability-enum (43 totalt — `prisma/schema.prisma`)

| Gruppe | Capabilities |
|---|---|
| Mission Board (7) | MB_VIEW_OWN_PLAYERS, MB_VIEW_ALL_PLAYERS, MB_EDIT_TRAINING_PLAN, MB_REGISTER_TEST_RESULT, MB_APPROVE_CATEGORY_PROMOTION, MB_CREATE_COACHING_SESSION, MB_VIEW_COACHING_SIGNALS |
| Scouting (4) | SCOUTING_VIEW, SCOUTING_VIEW_JUNIORS, SCOUTING_LINK_TO_USER, SCOUTING_EXPORT_AGGREGATED |
| Kartlegging (3) | KARTLEGGING_VIEW_OWN_PROFILE, KARTLEGGING_VIEW_ANY_AK_PLAYER, KARTLEGGING_EDIT_ASSIGNMENTS |
| Tournament (3) | TOURNAMENT_VIEW, TOURNAMENT_CREATE, TOURNAMENT_MANAGE_PREP |
| Booking (4) | BOOKING_VIEW_OWN, BOOKING_VIEW_ALL, BOOKING_MANAGE, BOOKING_RESCHEDULE_OTHER_COACHES |
| Content (3) | CONTENT_VIEW, CONTENT_EDIT, CONTENT_PUBLISH |
| Finance (3) | FINANCE_VIEW, FINANCE_EXPORT, FINANCE_REFUND |
| Users (5) | USERS_VIEW, USERS_INVITE, USERS_ASSIGN_ROLE, USERS_ASSIGN_CAPABILITIES, USERS_DEACTIVATE |
| GDPR (4) | GDPR_VIEW_REQUESTS, GDPR_HANDLE_REQUESTS, GDPR_VIEW_AUDIT_LOG, GDPR_EXPORT_USER_DATA |
| System (3) | SYSTEM_SETTINGS, SYSTEM_VIEW_LOGS, SYSTEM_RUN_CRON |
| Library (3) | LIBRARY_VIEW, LIBRARY_GENERATE, LIBRARY_APPROVE |
| Talent (1) | TALENT_DASHBOARD_VIEW |

### Sentralfiler

| Fil | Innhold |
|---|---|
| `lib/portal/capabilities/types.ts` | `CapabilityDefinition`, `CapabilityGroup`, `CapabilityPreset`, `CapabilityGroupDefinition` |
| `lib/portal/capabilities/catalog.ts` | `CAPABILITY_GROUPS` (10 grupper, men Library og Talent mangler i `CAPABILITY_GROUPS`-listen — kun hardkodet i enum), `CAPABILITY_CATALOG` (per-capability metadata: label, description, requires, requiresMfa, juniorGated). `getCapabilityDefinition()`, `getCapabilitiesByGroup()`, `getGroupDefinition()` |
| `lib/portal/capabilities/check.ts` | Request-cache (Map), `getUserCapabilities(userId)`, `hasCapability/AnyCapability/AllCapabilities`, `requireCapability`, `requireAnyCapability`, `CapabilityDeniedError`, `clearCapabilityCache`, `defaultsForRole` |
| `lib/portal/capabilities/presets.ts` | 8 presets (coach-standard, senior-coach, junior-coach, talent-scout, analyst, finance, content, admin) + `STUDENT_DEFAULT_CAPABILITIES`, `INSTRUCTOR_DEFAULT_CAPABILITIES` (preset coach-standard + TALENT_DASHBOARD_VIEW), `ADMIN_DEFAULT_CAPABILITIES` (alle), `INVITED_DEFAULT_CAPABILITIES` (tom) |
| `lib/portal/capabilities/sensitive-guard.ts` | `requireSensitiveAuth()` — passord-bekreftelse siste 15 min |
| `lib/portal/capabilities/index.ts` | Barrel-export |

### Faktisk håndhevelse (per 2026-05-05)

Layout-nivå: `(authed)/layout.tsx` bruker bare `canAccessMissionControl()` (rolle-sjekk).

Capability-gates oppdaget i admin-koden:
- `team/page.tsx` + `team/actions.ts`: `Capability.USERS_VIEW`, `USERS_INVITE`, `USERS_ASSIGN_ROLE`, `USERS_ASSIGN_CAPABILITIES`, `USERS_DEACTIVATE`, `GDPR_VIEW_AUDIT_LOG` + `requireSensitiveAuth()` for endringer
- `team/audit/page.tsx`: `GDPR_VIEW_AUDIT_LOG` eller `USERS_ASSIGN_CAPABILITIES`
- `library/page.tsx` + `library/[id]/page.tsx`: `LIBRARY_VIEW`, `LIBRARY_APPROVE`, `LIBRARY_GENERATE`
- `coaching-board/{actions,page}.tsx`: `MB_VIEW_OWN_PLAYERS`, `MB_VIEW_ALL_PLAYERS`
- `anlegg/page.tsx`, `fasiliteter/{page,actions}.ts`: kun `canAccessMissionControl(role)`

Manglende håndhevelse:
- `BOOKING_VIEW_ALL`, `BOOKING_MANAGE`, `BOOKING_RESCHEDULE_OTHER_COACHES` — definert, men ikke gated i `bookinger/actions.ts`
- `KARTLEGGING_VIEW_ANY_AK_PLAYER` — ikke gated på `/admin/elever/*`
- `MB_EDIT_TRAINING_PLAN`, `MB_REGISTER_TEST_RESULT`, `MB_APPROVE_CATEGORY_PROMOTION`, `MB_CREATE_COACHING_SESSION`, `MB_VIEW_COACHING_SIGNALS` — ikke gated i treningsplan-/tester-/kalender-actions
- `FINANCE_VIEW`, `FINANCE_EXPORT`, `FINANCE_REFUND` — sjekk `okonomi/actions.ts` (kun `isStaff`)
- `SCOUTING_*`, `TOURNAMENT_*`, `CONTENT_*`, `SYSTEM_*` — ikke håndhevet i admin-rutes funnet i denne audit
- `TALENT_DASHBOARD_VIEW` — `/admin/talent` bruker `isStaff` i stedet

### Inkonsistens i katalog

`CAPABILITY_GROUPS` lister 10 grupper, men `Capability`-enumet inneholder **library** og **talent** som ikke er registrert som CapabilityGroup i `catalog.ts`. `CAPABILITY_CATALOG` mangler entries for `LIBRARY_VIEW/GENERATE/APPROVE` og `TALENT_DASHBOARD_VIEW`. Dette betyr `getCapabilityDefinition()` returnerer `undefined` for disse 4 capabilities.

---

## Andre admin-områder (per rute)

| Rute | Hva | Status | DB-modeller | Auth |
|---|---|---|---|---|
| `/admin/agenter` | AI-agent-toggling | Delvis (mock-data.ts) | (mock) | isStaff |
| `/admin/ai-assistent` | Coach-AI-chat | Delvis (mock-data) | — | isStaff |
| `/admin/analytics` | Dashboard + analytics-data per periode | Delvis (TODO i `analytics-data.ts`) | Booking, AppSubscription, Stripe-aggregat | isStaff |
| `/admin/anlegg` | Anlegg/fasiliteter | Ferdig | Facility, FacilityBooking | canAccessMissionControl |
| `/admin/baner/[id]/import` | Bane-import | Stub/Placeholder | Course | — |
| `/admin/bookinger` | (over) | Ferdig | Booking | isStaff |
| `/admin/coaching-board` | Kanban-tavle. To klienter (light + dark) | Ferdig | CoachingSession, AppSubscription, KanbanCard | MB_VIEW_OWN/ALL_PLAYERS |
| `/admin/dagens-fokus-client.tsx` | (rot-fil, ikke rendret) | Dead code | — | — |
| `/admin/dashboard/prioriterte-elever-kort.tsx` | Komponent uten page | Sannsynlig dead | — | — |
| `/admin/denne-uken` | (over) | Ferdig | Booking | isStaff |
| `/admin/e-postmaler` | E-post-mal-CRUD | Ferdig | EmailTemplate (tabellen er pre-launch tom) | isStaff |
| `/admin/elever[/...]` | (over) | — | User, mange | isStaff |
| `/admin/fasiliteter[/...]` | Live status, ny aktivitet, innstillinger. NB: legacy `actions-legacy.ts` finnes parallelt | Ferdig | Facility, FacilityBooking | canAccessMissionControl |
| `/admin/focus` | Coach-oppgaver per division | Ferdig | AdminTask, AdminDivision | isStaff |
| `/admin/godkjenninger` | Inbox for ventende booking/aktivitet | Delvis (mock-data) | Booking, FacilityBooking | isStaff |
| `/admin/grupper` | Grupper + medlemmer + plan + sessions | Ferdig | TrainingGroup, GroupMembership, GroupSession, GroupSessionRSVP | isStaff |
| `/admin/hub` | Duplikat av `/admin` | Delvis (duplikat) | — | isStaff |
| `/admin/kalender` | (over) | Ferdig | Booking, InstructorAvailability, BlockedTime | isStaff |
| `/admin/kapasitet` | (over) | Ferdig | InstructorAvailability, ServiceType | isStaff |
| `/admin/library[/...]` | Drill/exercise/test/aktivitet/comp-prep biblioteket | Ferdig | LibraryItem (5 typer, 4 statuser) | LIBRARY_VIEW |
| `/admin/lokasjoner` | Lokasjons-config | Ferdig | Location, ServiceTypeLocation, InstructorLocation | isStaff |
| `/admin/meldinger` | Inbox + chat (AI/manuell) | Delvis (mock i komponenter) | AIResponses, DirectMessage, Conversation | isStaff |
| `/admin/mission-board` | Kanban (legacy + dark client) | Ferdig (alias til `/admin`) | CoachingSession-status | isStaff |
| `/admin/notifications` | Push-config | Stub | NotificationPreference | — |
| `/admin/okonomi` | Stripe-aggregat | Delvis (mock i `okonomi-data.ts`) | AppSubscription, Booking, Payment | isStaff |
| `/admin/okter` | Coaching-økt-oversikt | Delvis (mock-data) | CoachingSession | isStaff |
| `/admin/rapporter` | CSV-eksport | Ferdig (CSV via `csv-stringify`) | Booking, Revenue, User | isStaff |
| `/admin/talent` | Talent-dashboard | Ferdig (egen modell) | TalentPlayer, DataConfidenceBadge | isStaff (skulle vært TALENT_DASHBOARD_VIEW) |
| `/admin/team` | Brukeradministrasjon + roller + capabilities + audit | Ferdig | User, UserCapability, CapabilityChangeLog | USERS_VIEW + sensitive |
| `/admin/team/audit` | Audit-logg-visning | Ferdig | CapabilityChangeLog | GDPR_VIEW_AUDIT_LOG |
| `/admin/teknisk-plan` | Teknisk plan + faser + drills | Ferdig | TechnicalPlan, TechnicalPlanPhase, Drill | isStaff |
| `/admin/tilgjengelighet` | (over) | Delvis | InstructorAvailability, BlockedTime | isStaff |
| `/admin/tjenester` | ServiceType CRUD | Ferdig | ServiceType | isStaff |
| `/admin/treningsplan[/...]` | Treningsplan-bygger + maler + ny | Ferdig | TrainingPlan, TrainingPlanWeek, TrainingPlanSession, TrainingPlanTemplate | isStaff |
| `/admin/turneringer[/...]` | Turneringer + coach-oversikt | Ferdig | Tournament, TournamentParticipant | isStaff |

---

## Server Actions — komplett liste

(Alle filer ligger under `app/admin/(authed)/<rute>/`. Filnavn vist som `<rute>/<fil>`.)

| Fil | Funksjoner |
|---|---|
| `agenter/actions.ts` | `getAgents`, `getAgentStats`, `toggleAgent` |
| `analytics/actions.ts` | `getAnalyticsData`, `getDashboardData` |
| `bookinger/actions.ts` | `searchBookings`, `adminCancelBooking`, `adminRescheduleBooking`, `bulkCancelBookings` |
| `bookinger/create-actions.ts` | `adminCreateBooking`, `adminCreateBookingWithPayment`, `bulkSendReminder`, `getServiceTypes`, `getInstructors`, `getFacilities`, `getInstructorDefaultFacility`, `searchStudentsForBooking` |
| `coaching-board/actions.ts` | `fetchCoachingBoardData`, `fetchKanbanBoardData` |
| `denne-uken/actions.ts` | `getThisWeekBookings`, `getWeekStats` |
| `e-postmaler/actions.ts` | `getTemplates`, `createTemplate`, `updateTemplate`, `deleteTemplate` |
| `elever/actions.ts` | `fetchStudents`, `searchStudents` |
| `elever/create-actions.ts` | `createStudent` |
| `elever/arbeidsflate-actions.ts` | `getArbeidsflateKpis`, `getArbeidsflateStudentList`, `getArbeidsflateActiveSession` |
| `elever/parent-actions.ts` | `listParentsForChild`, `searchPotentialParents`, `createParentAndLink`, `linkExistingParent`, `removeParentLink` |
| `elever/oversikt/actions.ts` | `getElevOversikt` |
| `elever/[id]/actions.ts` | `getStudentProfile`, `updateCoachingNotes` |
| `elever/[id]/communication-actions.ts` | `getCommunicationLogs`, `addCommunicationLog` |
| `elever/[id]/student-training-actions.ts` | `getStudentTrainingPlan`, `getStudentTrainingLogs`, `getStudentRoundStats`, `getStudentRounds`, `getStudentDegradation`, `getStudentLPhases`, `setStudentLPhase`, `getStudentTrackManSessions`, `addCoachNote` |
| `elever/[id]/tester/actions.ts` | `getCoachTestRegister` |
| `elever/[id]/v2/get-student-360.ts` | `getStudent360` (server action; egne TS-interfaces) |
| `app/admin/elever/[id]/coach-agent/actions.ts` | `sendCoachAgentMessage`, `listCoachAgentSessions` |
| `fasiliteter/actions.ts` | `getLiveStatus`, `getWeekBookings`, `createFacilityBooking`, `deleteFacilityBooking` (legacy: `fasiliteter/actions-legacy.ts`) |
| `focus/actions.ts` | `getTasks`, `getDivisionStats`, `getTodayBookingsByDivision`, `createTask`, `updateTaskStatus`, `updateTask`, `deleteTask` |
| `godkjenninger/actions.ts` | `getPendingItems`, `approveBooking`, `rejectBooking`, `approveActivity`, `rejectActivity` |
| `grupper/actions.ts` | `listGroups`, `createGroup`, `updateGroup`, `deleteGroup`, `listAvailablePlayers`, `getGroupMembers`, `addMember`, `removeMember`, `getGroupPlan`, `syncGroupPlanToMembers` |
| `grupper/plan-actions.ts` | `listTemplatesForGroupPlan`, `createGroupPlanFromTemplate` |
| `grupper/session-actions.ts` | `listGroupSessions`, `createGroupSession`, `updateGroupSession`, `deleteGroupSession`, `setOccurrenceOverride`, `getExpandedGroupSessions` |
| `hub/hub-actions.ts` | `getHubStats`, `getHubModuleCounts`, `getHubActivity` |
| `kalender/actions.ts` | `getBookingsForPeriod`, `getInstructors`, `getBookingsForDay`, `getBookingsForWeek`, `markNoShow`, `markBookingCompleted`, `addAdminNote`, `getBlockedTimesForPeriod`, `getInstructorAvailabilityPrisma`, `upsertInstructorAvailabilityPrisma`, `deleteInstructorAvailabilityPrisma`, `createBlockedTimePrisma`, `deleteBlockedTimePrisma`, `getServiceTypesPrisma` |
| `kapasitet/actions.ts` | `getCapacityData` |
| `kapasitet/week-actions.ts` | `getWeekCapacityWithOverrides`, `saveWeekOverride`, `deleteWeekOverride`, `getPackageDemand`, `getInstructors` |
| `lokasjoner/actions.ts` | `getLocationsConfigData`, `setInstructorLocation`, `setLocationServices`, `createLocation` |
| `meldinger/actions.ts` | `getInboxMessages`, `approveMessage`, `rejectMessage`, `regenerateAIResponse` |
| `meldinger/chat-actions.ts` | `getOrCreateConversation`, `getConversationMessages`, `sendDirectMessage`, `getMyConversations`, `markConversationAsRead` |
| `mission-board/actions.ts` | `fetchMissionBoardKanban` |
| `okonomi/actions.ts` | `getOkonomiData` |
| `okter/actions.ts` | `getSessionOverview`, `saveSessionNotes` |
| `rapporter/actions.ts` | `exportBookingsCSV`, `exportRevenueCSV`, `exportStudentsCSV` |
| `talent/actions.ts` | `fetchTalentPlayers`, `fetchTalentPlayerDetail`, `updateTalentPlayer` |
| `team/actions.ts` | `fetchTeamMembers`, `inviteTeamMember`, `updateUserRole`, `confirmSensitiveAction`, `updateUserCapabilities`, `applyPreset`, `deactivateUser`, `reactivateUser`, `fetchAuditLog`, `listPresets` |
| `teknisk-plan/actions.ts` | `getTechnicalPlansForAdmin`, `getTechnicalPlanDetail`, `createTechnicalPlanAction`, `updateTechnicalPlanAction`, `deleteTechnicalPlanAction`, `createPhaseAction`, `updatePhaseAction`, `deletePhaseAction`, `getDrillOptions`, `getPlayerOptions` |
| `tilgjengelighet/actions.ts` | `getInstructors`, `getAvailability`, `upsertAvailability`, `getBlockedTimes`, `createBlockedTime`, `createClosedPeriod`, `deleteBlockedTime`, `syncGoogleCalendar` |
| `tjenester/actions.ts` | `listServiceTypes`, `createServiceType`, `updateServiceType` |
| `treningsplan/actions.ts` | `getStudentPlans`, `updateSession`, `deleteSession`, `addSession`, `updateWeekFocus`, `duplicatePlan`, `getStudents`, `getDrills`, `getExistingPlans`, `createManualPlan`, `setPlanCoachFeedback`, `proposeSessionEdit` |
| `treningsplan/maler/actions.ts` | `listTemplatesForAdmin`, `createTemplate`, `updateTemplate`, `toggleTemplateActive`, `deleteTemplate` |
| `turneringer/actions.ts` | `getTournaments`, `deleteTournament` |
| `turneringer/oversikt/actions.ts` | `getCoachTournamentOverview` |

---

## Delte komponenter (CoachHQ-kontekst)

### `components/admin/coachhq-dark/` (Brand Guide V2.0 — primitiver)

| Eksport | Fil |
|---|---|
| `CoachHQDarkShell` | `CoachHQDarkShell.tsx` |
| `CoachHQDarkRail` | `CoachHQDarkRail.tsx` |
| `CoachHQDarkNav` | `CoachHQDarkNav.tsx` |
| `CoachHQDarkTopbar` | `CoachHQDarkTopbar.tsx` |
| `PageHead` | `PageHead.tsx` |
| `Card`, `CardHeader`, `Button`, `Pill`, `KpiCard`, `StatCard`, `Empty`, `Table<T>`, `Eyebrow`, `MonoLabel`, `TOKENS` | `Primitives.tsx` |
| `ActivityItem` + `ActivityItemData` | `ActivityItem.tsx` |
| `avatarColor`, `getInitials` | `avatar.ts` |
| `arbeidsflate/{kpi-row, students-list-panel}.tsx` | underseksjon |
| `d1/{SignalCard, Timeline}.tsx` | underseksjon |
| `d27/{activity-panel, hub-hero, module-strip, quick-actions-panel}.tsx` | underseksjon |

### `components/admin/coachhq/` (sidebar-byggesteiner)

| Eksport | Fil |
|---|---|
| `IconRail` | `IconRail.tsx` |
| `NameList` | `NameList.tsx` |
| `LiveStatusFooter` | `LiveStatusFooter.tsx` (kun brukt internt av NameList) |
| `COACHHQ_NAV`, `COACHHQ_PRIMARY_NAV`, `COACHHQ_TOOLS_NAV` (tom), `getActiveNavItem`, `HREF_ALIASES` | `coachhq-nav-config.ts` |

### Andre delte (`components/admin/`)

- `CoachHQSidebar.tsx` (toppnivå, gammel sidebar)
- `coachhq-page-head.tsx`
- `index.ts`
- `under-construction.tsx`
- `AddActivityModal.tsx`, `FacilityCalendar.tsx`, `FacilityList.tsx`, `FacilityMap.tsx` (fasiliteter)
- `notifications/AdminNotificationBell.tsx`, `NotificationPanel.tsx`
- `coach-agent/CoachAgentChat.tsx`
- `spillerprofil-360/*` (9 cards + shell — over)
- Per-feature mapper: `agenter/`, `ai-assistent/`, `analytics/{,v2}/`, `bookinger/`, `coaching-board/`, `dashboard/`, `elever/`, `facility-map/`, `fasiliteter/v2/`, `godkjenninger/`, `grupper/`, `hub/`, `kalender/`, `kapasitet/`, `library/`, `lokasjoner/`, `meldinger/`, `okonomi/`, `okter/`, `rapporter/`, `spillere/`, `talent/`, `team/`, `tilgjengelighet/`, `tjenester/`, `treningsplan-bygger/`, `uke/`

---

## Mock-data-filer (TODO: koble til ekte data)

15 mock-filer flagget med TODO:

- `components/admin/agenter/mock-data.ts`
- `components/admin/ai-assistent/mock-data.ts`
- `components/admin/analytics/v2/analytics-data.ts`
- `components/admin/coaching-board/mock-data.ts`
- `components/admin/fasiliteter/v2/mock-data.ts`
- `components/admin/godkjenninger/mock-data.ts`
- `components/admin/grupper/{detail-mock-data,mock-data}.ts`
- `components/admin/hub/mock-data.ts`
- `components/admin/kalender/mock-data.ts`
- `components/admin/library/mock-data.ts`
- `components/admin/lokasjoner/mock-data.ts`
- `components/admin/okonomi/okonomi-data.ts`
- `components/admin/okter/mock-data.ts`
- `components/admin/rapporter/rapporter-data.ts`
- `components/admin/spillere/{mock-cards-alert,mock-cards-rising,mock-data,mock-rows,types}.ts`
- `components/admin/team/mock-data.ts`
- `components/admin/tilgjengelighet/mock-data.ts`
- `components/admin/tjenester/mock-data.ts`
- `components/admin/uke/mock-data.ts`

---

## Stubs / placeholders / dead code

- `app/admin/(authed)/dagens-fokus-client.tsx` — klient-fil i rot uten tilhørende `page.tsx`
- `app/admin/(authed)/hub-oversikt-client.tsx` — samme
- `app/admin/(authed)/dashboard/prioriterte-elever-kort.tsx` — komponent uten page-rute
- `components/admin/spillere/*` — hele mappen er mockdata-basert, ikke koblet til `/admin/elever`-rutet
- `components/admin/uke/*` — mock, ingen kjent route som rendrer dette
- `app/admin/(authed)/fasiliteter/actions-legacy.ts` — eksplisitt legacy-fil parallelt med `actions.ts`
- `coachhq-nav-config.ts`: `COACHHQ_TOOLS_NAV: CoachHQNavItem[] = []` (tom)
- `app/admin/elever/[id]/coach-agent/page.tsx` — ligger UTENFOR `(authed)/`-gruppen, så hverken layout-auth eller shell. Verifiser dette er tilsiktet.
- `app/admin/(authed)/baner/[id]/import/page.tsx` — eneste fil under `baner/`, sannsynlig stub
- `app/admin/(authed)/notifications/page.tsx` — kun `notification-manager.tsx`, ingen action

---

## TODO/FIXME oppsummert

- `get-student-360.ts`: SG-breakdown (USISnapshot mangler), DataGolf benchmark (pgaPlayerId-mapping)
- `coaching-board/actions.ts:531`: prep-tracking på CoachingSession
- `kalender/capacity-manager.tsx:94`: "Save to API"
- `spillere/players-list-client.tsx:48`: ekte junior-flagg fra Player-modellen
- 15+ `mock-data.ts` flaggene over

---

## Manglende error/loading-boundaries

23 av 47 admin-pages har dedikerte `error.tsx` og `loading.tsx`. Følgende ruter mangler én eller begge:

- `/admin/login`, `/admin/anlegg`, `/admin/tjenester`, `/admin/team`, `/admin/team/audit`, `/admin/library`, `/admin/library/[id]`, `/admin/hub`, `/admin/teknisk-plan`, `/admin/treningsplan`, `/admin/treningsplan/maler`, `/admin/treningsplan/ny`, `/admin/grupper`, `/admin/lokasjoner`, `/admin/coaching-board`, `/admin/elever/oversikt`, `/admin/elever/[id]/tester`, `/admin/elever/[id]/v2`, `/admin/turneringer/oversikt`, `/admin/talent`, `/admin/notifications`, `/admin/mission-board`, `/admin/baner/[id]/import`, `/admin/elever/[id]/coach-agent` (hele `(authed)/error.tsx`+`loading.tsx` arves IKKE av denne ruten siden den ligger utenfor `(authed)/`-segmentet).
