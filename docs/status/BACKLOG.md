# Backlog — Prioritert gjenstående arbeid

Sist oppdatert: 2026-04-20

> **Les først:** [`PLATFORM_FUNCTION_MAP.md`](./PLATFORM_FUNCTION_MAP.md) — komplett funksjonskartlegging per spiller-fase (PLANLEGGE → GJENNOMFØRE → EVALUERE → ADMINISTRERE), 112 Prisma-modeller, 10 integrasjoner, 21 CRON-jobs, 25 MCP-verktøy og gap-analyse. Sprint-rekkefølgen nedenfor er begrunnet i kartets seksjon 9.

---

## P1 — UI/UX design-arbeid (gjeldende sprint)

Tokens, fonter og sidebar/nav er migrert til Heritage Grid. Nå må hver side få riktig layout, komponent-struktur og innhold-hierarki mot Heritage-referansen.

**Referansebibliotek:** `design-ref/stitch/heritage/` (195 godkjente Stitch-skjermer).
**Design-system:** `.claude/rules/design-system.md` (én sannhet).

### Workflow per side
1. Åpne app-siden + Heritage-referanse-skjerm side-om-side
2. Vurder gap (struktur, komponenter, innhold-hierarki)
3. Rewrite eller justér — bruk Heritage-klasser 1:1
4. Skjermbilde for godkjenning før neste

---

### 1.1 Landingpages (8 sider)

| # | Side | Rute | Heritage-ref | Status | Prioritet |
|---|---|---|---|---|---|
| 1.1.1 | Forside | `/` | `landing_homepage` (ekskludert av bruker) | OK (nav ferdig) | Lav |
| 1.1.2 | Academy | `/academy` | `landing_pricing`-struktur | Rewrite | Høy |
| 1.1.3 | Academy abonnement | `/academy/abonnement` | `landing_pricing` | Rewrite | Høy |
| 1.1.4 | Junior Academy | `/junior-academy` | `landing_contact`-mønster | Rewrite | Medium |
| 1.1.5 | Utvikling | `/utvikling` | Ingen direkte — adapt `landing_pricing` | Rewrite | Lav |
| 1.1.6 | Landing pricing | `/landing/pricing` | `landing_pricing` | Rewrite | Høy |
| 1.1.7 | Landing contact | `/landing/contact` | `landing_contact` | Rewrite | Medium |
| 1.1.8 | Personvern | `/personvern` | `legal_pages` | Rewrite | Lav |

**Felles grep:** Hero-seksjon med JetBrains Mono eyebrow + stor serif-bold headline. Bento-grid under. Lime-accent-CTA. "Engineered for precision"-estetikk.

### 1.2 Booking-system (4-5 skjermer i flyt)

| # | Steg | Rute | Heritage-ref | Status | Prioritet |
|---|---|---|---|---|---|
| 1.2.1 | Velg tjeneste | `/booking` eller `/portal/bookinger/ny` | `booking_select_service` | Rewrite | Høy |
| 1.2.2 | Velg coach | (steg i wizard) | `booking_coach_selection` | Rewrite | Høy |
| 1.2.3 | Dato + tid | (steg i wizard) | `booking_date_time` | Rewrite | Høy |
| 1.2.4 | Review + betal | (steg i wizard) | `booking_review_confirm` | Rewrite | Høy |
| 1.2.5 | Bekreftelse | `/booking/[id]/confirmation` | `booking_confirmed` | Rewrite | Høy |
| 1.2.6 | Reschedule | `/portal/bookinger/[id]/endre` | `reschedule_booking` | Rewrite | Medium |
| 1.2.7 | Avlys | `/booking/[id]/cancel` | Adapt `booking_confirmed` | Rewrite | Medium |

**Felles grep:** Wizard med progress-indikator. Store kort per steg. Lime-CTA for "neste". Summary-sidebar til høyre. Mobilflyt prioritert.

### 1.3 Spillerportal (~30 sider)

**Kjerneopplevelse** (høyeste prioritet):

| # | Side | Rute | Heritage-ref | Status | Prioritet |
|---|---|---|---|---|---|
| 1.3.1 | Dashboard | `/portal` | `dashboard_mission_control` (adapt) | Full rewrite | Kritisk |
| 1.3.2 | Statistikk | `/portal/statistikk` | `analytics_strokes_gained` | Full rewrite | Høy |
| 1.3.3 | Kartlegging | `/portal/kartlegging` | `coach_player_view` | Juster (M3 bygget) | Høy |
| 1.3.4 | Dagbok | `/portal/dagbok` | `log_practice_diary` | Rewrite | Høy |
| 1.3.5 | Ny runde | `/portal/runde/ny` | Adapt `log_practice_diary` | Rewrite | Høy |
| 1.3.6 | Live runde | `/portal/runde/[id]` | `coach_live_session` | Juster | Medium |
| 1.3.7 | Treningsplan | `/portal/treningsplan` | `iup_12_week_training_plan` | Rewrite | Høy |
| 1.3.8 | Min plan | `/portal/min-plan` | Adapt `iup_12_week_training_plan` | Rewrite | Medium |
| 1.3.9 | Bookinger | `/portal/bookinger` | `sessions_calendar_view` | Juster | Medium |
| 1.3.10 | Profil | `/portal/profil` | `settings_profile` | Juster | Medium |

**Sekundær opplevelse** (medium prioritet):

| # | Side | Rute | Heritage-ref |
|---|---|---|---|
| 1.3.11 | Kalender | `/portal/kalender` | `sessions_calendar_view` |
| 1.3.12 | Meldinger | `/portal/meldinger` | `coach_messages` |
| 1.3.13 | Sosialt | `/portal/sosialt` | `social_feed_community` |
| 1.3.14 | Turneringer | `/portal/turneringer` | `tournaments_competitions` |
| 1.3.15 | Analyse | `/portal/analyse` | `analytics_strokes_gained` (variant) |
| 1.3.16 | Benchmark | `/portal/benchmark` | `analytics_leaderboard` |
| 1.3.17 | Sammenligning | `/portal/sammenligning` | `head_to_head_versus` |
| 1.3.18 | AI-coach | `/portal/ai-coach` | Adapt — ingen direkte match |
| 1.3.19 | Coaching-historikk | `/portal/coaching-historikk` | `coach_session_review` |
| 1.3.20 | TrackMan | `/portal/trackman` | Adapt `analytics_strokes_gained` |
| 1.3.21 | Tester | `/portal/tester` | `coach_drills_library` |
| 1.3.22 | Bag | `/portal/bag` | Adapt `settings_profile` |
| 1.3.23 | Spill | `/portal/spill` | `challenges_quests` |
| 1.3.24 | Mental | `/portal/mental` | Adapt `coach_observations` |
| 1.3.25 | Strategi | `/portal/strategi` | Adapt `coach_prepare_session` |
| 1.3.26 | Apper | `/portal/apper` | `integration_directory` |
| 1.3.27 | Abonnement | `/portal/abonnement` | `settings_billing` + `upgrade_plan` |
| 1.3.28 | Onboarding | `/portal/onboarding` | `onboarding_wizard` |
| 1.3.29 | Profil innst. | `/portal/profil/innstillinger` | `settings_user_preferences` |

### 1.4 Mission Control (~25 sider)

**Kjerne** (kritisk):

| # | Side | Rute | Heritage-ref | Status | Prioritet |
|---|---|---|---|---|---|
| 1.4.1 | Hub-oversikt | `/admin` | `mission_control_command_center` | Rewrite | Kritisk |
| 1.4.2 | Mission Board | `/admin/mission-board` | `dashboard_mission_control` | Rewrite | Kritisk |
| 1.4.3 | Coaching Mission Board | `/admin/coaching-board` | `coach_my_day` | Juster (M4 bygget) | Høy |
| 1.4.4 | Elever | `/admin/elever` | `admin_player_management` | Rewrite | Høy |
| 1.4.5 | Elev-detalj | `/admin/elever/[id]` | `admin_player_profile` | Rewrite | Høy |
| 1.4.6 | Team + tilgang | `/admin/team` | `team_setup` | Juster (M1 bygget) | Medium |
| 1.4.7 | Audit-logg | `/admin/team/audit` | `mission_control_audit_log` | Juster (M1 bygget) | Lav |
| 1.4.8 | Bookinger | `/admin/bookinger` | `booking_review_confirm` | Rewrite | Høy |

**Operasjon** (medium):

| # | Side | Rute | Heritage-ref |
|---|---|---|---|
| 1.4.9 | Kalender | `/admin/kalender` | `sessions_calendar_view` |
| 1.4.10 | Godkjenninger | `/admin/godkjenninger` | Adapt `booking_review_confirm` |
| 1.4.11 | Tilgjengelighet | `/admin/tilgjengelighet` | `coach_set_hours` |
| 1.4.12 | Kapasitet | `/admin/kapasitet` | `mission_control_capacity_forecast` |
| 1.4.13 | Focus | `/admin/focus` | Adapt `coach_my_day` |
| 1.4.14 | Denne uken | `/admin/denne-uken` | Adapt `coach_my_day` |
| 1.4.15 | Økter | `/admin/okter` | `coach_session_review` |
| 1.4.16 | Treningsplaner | `/admin/treningsplan` | `iup_12_week_training_plan` |
| 1.4.17 | Turneringer | `/admin/turneringer` | `tournaments_competitions` |
| 1.4.18 | Fasiliteter | `/admin/fasiliteter` | Adapt `admin_player_management` |

**Kommunikasjon** (lav):

| # | Side | Rute | Heritage-ref |
|---|---|---|---|
| 1.4.19 | Meldinger | `/admin/meldinger` | `inbox_main` |
| 1.4.20 | E-postmaler | `/admin/e-postmaler` | `email_templates` |
| 1.4.21 | Push-varsler | `/admin/notifications` | `push_notifications` |

**AI + Analyse**:

| # | Side | Rute | Heritage-ref |
|---|---|---|---|
| 1.4.22 | AI-assistent | `/admin/ai-assistent` | Adapt `automated_responses` |
| 1.4.23 | Agenter | `/admin/agenter` | Adapt `developer_console` |
| 1.4.24 | Analytics | `/admin/analytics` | `analytics_live_dashboard` |
| 1.4.25 | Økonomi | `/admin/okonomi` | `analytics_financials` |
| 1.4.26 | Rapporter | `/admin/rapporter` | `analytics_generated_report` |

---

## Foreslått sprint-rekkefølge

**Sprint A — Spillerportal kjerneopplevelse (2-3 dager):**
- 1.3.1 Dashboard → 1.3.2 Statistikk → 1.3.4 Dagbok → 1.3.5 Ny runde → 1.3.7 Treningsplan

**Sprint B — Mission Control kjerne (2 dager):**
- 1.4.1 Hub → 1.4.2 Mission Board → 1.4.4/5 Elever + detalj → 1.4.8 Bookinger

**Sprint C — Booking-system (1-2 dager):**
- 1.2.1-1.2.5 Full flyt

**Sprint D — Landingpages (1-2 dager):**
- 1.1.2-1.1.4 Academy + Junior + Pricing

**Sprint E — Sekundære portal-sider (2-3 dager):**
- 1.3.11-1.3.29 Batch-rewrites gruppert etter likhet

**Sprint F — Sekundære MC-sider (1-2 dager):**
- 1.4.9-1.4.26 Batch-rewrites

**Totalt:** ~10-14 arbeidsdager for full visuell matching.

---

## P2 — Viktig (funksjonalitet mangler)

- **Go-live (#39)**: Vercel-env-vars må settes, `prisma migrate deploy` må kjøres mot prod, DNS må verifiseres. Alt annet er klart. Se `docs/status/GO_LIVE_CHECKLIST.md`.

## P3 — Forbedringer (kode-kvalitet)

- **45 lint-warnings (ubrukte vars)** — auto-removal av unused imports gjort. Gjenværende er unused vars som må prefixes med `_` eller slettes manuelt.
- **95 gjenværende `lucide-react`-imports** (ref/prop-bruk, ikke JSX) — fjernes når komponentene rewrites.
- **grey-* aliaser** — 900+ forekomster mapper til Heritage surface-container. Kan renames for klarhet når alle sider er rewritet.
- **Notion-import (#41)**: Manuell import av `docs/notion-import-master-todo.json` til Notion-database.

## Fullført 2026-04-20 natt (Heritage-migrering autonomt)

- ~~Steg 6b: MC-sidebar 1:1 Heritage~~ (emerald-950 bg, lime-aktiv) — commit 8606d02
- ~~Steg 6c: fjern ViewSwitcher-tabs fra dashboard~~ — commit f677cf8
- ~~Steg 6d: landing-nav Heritage-stil~~ — commit b223ac1
- ~~Steg 7: opprydding + ny design-system.md~~ — commit c99d734 + 785f304
- ~~Demo-oversikt over alle ~80 sider~~ — `design-ref/app-demo.html`

## Fullført 2026-04-19

- ~~Heritage design-migrering Steg 1-5~~ — tokens, fonter, bulk-rename (portal-*, --hg-*), ikoner (Lucide→Material Symbols 275 filer), spot-sjekk
- ~~Steg 6a: Portal-sidebar 1:1 Heritage~~ — commit 59ee65d
- ~~P1 Build-feil (React 19 / Next.js 16 SSG useContext)~~ — workaround via `--experimental-build-mode compile`. (6bbd752)
- ~~P2 app/setup-admin~~ — slettet (hardkodet passord). (6bbd752)
- ~~P3 10 ESLint-errors~~ — dagbok/page, weekly-stats, trackman-analytics-card, revenue-chart, dashboard-actions. (6bbd752)
- ~~Lint-warnings reduksjon~~ — 87 → 45 via eslint-plugin-unused-imports. (6bbd752)

## Fullført 2026-04-18

- ~~Turneringsplanlegger komplett (#42):~~ 6 kilder aktive — Olyo Juniortour, Østlandstour, Garmin Norgescup, Srixon Tour, Nordic Golf Tour, JMI Sweden, Global Junior Tour.
- ~~E2E-dekning booking (#30):~~ 3 nye Playwright-spec-filer med totalt 28 test-cases.
- ~~Go-live-sjekkliste:~~ `docs/status/GO_LIVE_CHECKLIST.md` opprettet.
- ~~TrackMan AI-innsikter~~ (f1f1986)
- ~~Prediktiv HCP-trend~~ (1152b44)
- ~~Auto treningsplan-justering CRON~~ (9250059)

## Nye ideer / neste kvartal

- Admin: Real-time Mission Board med WebSocket/SSE (Supabase Realtime — 2-3 t sprint)
- Kalibrering av auto-plan-terskler i `training-plan-adjustment.ts` etter første CRON-kjøringer
- Stripe-webhook redundancy check (Vercel Cron hver 30 min som backup)
