# Premium Design Roadmap — AK Golf Platform

## Status etter dag 1

### Ferdig (konsistent premium design)
| Side | Type | Beskrivelse |
|------|------|-------------|
| Dashboard | Portal | Profil-header, ukekalender, neste coaching, statistikk, snarveier |
| Treningsplan | Portal | Ukesvelger, daglig okt, fokus, fremgang, manuell opprettelse |
| Turneringsplan | Portal | Chip-tabs, turneringskort med stat-kort |
| Statistikk | Portal | Periodevalg, 4 KPI, SG-barer, sparkline, AI-tips |
| Profil | Portal | Apple Settings-stil, sentrert 680px, avatar, nokkeltall |
| Spill | Portal | PremiumCard, Prisma-data, header med label+h1 |
| Bookinger | Portal | PremiumCard, portal-tokens, riktig spacing |
| AI Coach | Portal | Portal-tokens migrert |
| TrackMan | Portal | Portal-tokens migrert |
| Bag | Portal | PremiumCard, portal-tokens |
| Benchmark | Portal | PremiumCard, tabular-nums |
| Booking-flyt | Offentlig | Alle 19 filer token-fikset |
| Junior Academy | Landing | Token-migrert |
| Utvikling | Landing | Token-migrert |

### Gjenstår — Spillerportal (32 → 22 sider, 10 trenger premium-design)

## FASE 1: Kjerneflyt (brukes daglig)

### 1.1 Dagbok — Treningslogg
**Filer:** `dagbok/dagbok-client.tsx`, `dagbok/[sessionId]/page.tsx`, `dagbok/dagbok-stats.tsx`, `dagbok/dagbok-calendar.tsx`
**Brudd:** 12 grey-tokens i client, 41 i session-detalj, 10 i stats, 4 i calendar
**Hva den gjor:** Logger treningokter, viser historikk, ukesstatistikk
**Design:**
- Erstatt alle grey-tokens med portal-tokens
- Wrap kort i PremiumCard
- Aktiv okt-logging: stor timer, ovelsesliste med treffrate-slider
- Historikk: kompakt liste med ikon + navn + varighet + vurdering (dots)
- Ukesstatistikk: 3 tall (okter, timer, planfolging) i rad

### 1.2 Runde — Live scoring + Oppstart + Oppsummering
**Filer:** `runde/[id]/live-round-client.tsx` (43 brudd), `runde/ny/start-round-client.tsx` (15), `runde/[id]/oppsummering/page.tsx` (29)
**Hva den gjor:** Hull-for-hull scoring pa banen, rundeoppsummering med SG
**Design:**
- Mobilforst — store touch-targets (48x48px minimum)
- Score-counter: [-] 4 [+] med stor font
- Stat-toggles: FW, GIR, U&D som pill-knapper
- Hull-navigasjon: swipe eller pil-knapper
- Oppsummering: Score-ring SVG + SG-barer + AI-analyse
- Portal-tokens gjennomgaende

### 1.3 Booking — Ny booking fra portal
**Fil:** `bookinger/ny/book-coaching-form.tsx` (66 brudd — mest av alle!)
**Hva den gjor:** Booking-wizard inni portalen
**Design:**
- Migrere alle 66 grey-token-brudd til portal-tokens
- Bruk samme steg-indikator som offentlig booking
- Trenerkort med bilde
- Tidsluker som pills
- PremiumCard for hvert steg

### 1.4 Booking-detalj
**Fil:** `bookinger/[id]/booking-detail-client.tsx`
**Design:**
- PremiumCard med booking-info
- Status-badge (bekreftet/venter/avlyst)
- CTA-er: Endre tidspunkt, Avbestill
- Kompakt, ren layout

## FASE 2: Analyse & kommunikasjon (brukes ukentlig)

### 2.1 Coaching-historikk
**Fil:** `coaching-historikk/page.tsx`
**Design:**
- Tidslinje med coaching-okter
- Hvert kort: dato, instruktor, fokusomrader, AI-oppsummering
- Filtrer per instruktor og periode

### 2.2 Meldinger
**Fil:** `meldinger/meldinger-chat-client.tsx` (25 brudd)
**Design:**
- 2-panel: kontaktliste (venstre) + chat (hoyre)
- Bruker-bobler: bg-primary text-white rounded-2xl
- AI/coach-bobler: bg-portal-hover text-portal-text rounded-2xl
- Input med Send-knapp rounded-[20px]

### 2.3 Trening/ovelser
**Fil:** `trening/ovelser/page.tsx` (9 brudd)
**Design:**
- Sok + filter med chip-tabs (FYS/TEK/SLAG/SPILL/TURN)
- Treningspyramiden som visuelt filter-element
- Ovelseskort med PremiumCard

### 2.4 Trening/tester + Tester
**Filer:** `trening/tester/page.tsx` (13), `trening/tester/[id]/page.tsx` (39), `tester/tester-client.tsx` (23), `tester/page.tsx` (10)
**Design:**
- Test-protokoll-kort med PremiumCard
- Stat-kort for resultater
- "Start test" CTA rounded-[20px]

### 2.5 Analyse-side
**Fil:** `analyse/page.tsx` (16 brudd)
**Design:**
- Slaa sammen med statistikk eller fjern duplikat
- Hvis beholdes: portal-tokens + PremiumCard

### 2.6 Kalender
**Fil:** `kalender/`
**Design:**
- Ukevisning med booking-chips per dag
- Fargekoder: coaching=primary, trening=accent, turnering=ai
- Navigasjon mellom uker med pil-knapper

## FASE 3: Sekundaere sider (brukes sjelden)

### 3.1 Sammenligning
**Allerede delvis premium.** Trenger: fjerne HeroHeading, portal-tokens

### 3.2 Abonnement
**Fil:** `abonnement/abonnement-client.tsx`
**Design:** Pakke-kort med pris, features, oppgrader-CTA

### 3.3 Sosialt
**Fil:** `sosialt/sosialt-client.tsx`
**Design:** Venneliste, legg til venn, pending requests

### 3.4 Apper
**Fil:** `apper/apper-client.tsx` (5 brudd)
**Design:** App-kort med ikon, beskrivelse, installer-knapp

### 3.5 Onboarding
**Fil:** `onboarding/onboarding-client.tsx`
**Design:** Steg-for-steg wizard med progress-indikator

### 3.6 Turneringer (distinkt fra turneringsplan)
**Fil:** `turneringer/turneringer-client.tsx`
**Design:** Aktive turneringer med live leaderboard

---

## MISSION CONTROL — 24 admin-sider

### MC Fase 1: Daglig bruk (coach apen morgen)

#### MC-1.1 Hub/Dashboard
**Fil:** `hub-oversikt-client.tsx`
**Design:**
- 4 KPI-kort opp: Okter i dag, Aktive elever, Ventende bookinger, MTD inntekt
- Dagens tidslinje: 08:00-18:00 med bookinger som blokker
- 3 divisjonskort: Coaching (primary), Junior (info), GFGK (ai) med border-l-4
- Varsler: oppfolging, avbestillinger

#### MC-1.2 Denne uken
**Fil:** `denne-uken/this-week-client.tsx`
**Design:**
- 4 KPI opp (ukens bookinger, timer, elever, inntekt)
- 7-dagers kalender-grid med booking-chips
- Hver dag viser tidspunkt + elevnavn + varighet

#### MC-1.3 Bookinger
**Fil:** `bookinger/bookinger-client.tsx` + `bookinger/ny/ny-booking-client.tsx`
**Design:**
- Sok + chip-filter (Alle/I dag/Denne uken/Ventende)
- Tabell med dato, elev, tjeneste, status, handling
- Ventende: warning-bakgrunn med Godkjenn/Avvis

#### MC-1.4 Kalender
**Fil:** `kalender/kalender-client.tsx`
**Design:**
- Manedvisning med fargeprikker per instruktor
- Filter-panel til venstre (instruktor, tjeneste, status)
- Klikk dag -> dagsdetalj

#### MC-1.5 Elever + Elevdetalj
**Filer:** `elever/students-client.tsx`, `elever/[id]/student-detail-client.tsx`
**Design:**
- Elever: Sokelinje + KPI-strip + tabell med avatar, tier-badge, status
- Detalj: Profil-kort (col-4) + Tab-nav (Oversikt/Treningsdata/Bookinger/Plan/Meldinger)

### MC Fase 2: Ukentlig bruk

#### MC-2.1 Okter/Sesjoner
**Fil:** `okter/okter-client.tsx`
**Design:** KPI-strip + sesjon-tabell med sok/filter

#### MC-2.2 Treningsplaner
**Fil:** `treningsplan/treningsplan-client.tsx` + `treningsplan/ny/`
**Design:** Elev-soker + plan-oversikt + ny-plan wizard

#### MC-2.3 Analytics
**Fil:** `analytics/dashboard-client.tsx`
**Design:**
- Periode-chips (Uke/Maned/Kvartal/Ar)
- 4 KPI (inntekt, sesjoner, nye elever, churn)
- Inntektstrend linjediagram + tier-fordeling donut

#### MC-2.4 Meldinger
**Fil:** `meldinger/meldinger-client.tsx` + `meldinger/admin-chat-client.tsx`
**Design:** 3-panel (filter + liste + chat)

#### MC-2.5 Tilgjengelighet
**Fil:** `tilgjengelighet/` — allerede strukturelt ok
**Design:** Instruktor-velger + ukedager-grid med ledig/blokkert

#### MC-2.6 Kapasitet
**Fil:** `kapasitet/kapasitet-client.tsx`
**Design:** Heatmap (dager x tidslukter), utnyttelse-trend

### MC Fase 3: Manedlig / admin

#### MC-3.1 Okonomi
**Fil:** `okonomi/okonomi-client.tsx`
**Design:** KPI-rad + transaksjons-tabell + fordeling-donut

#### MC-3.2 Rapporter
**Fil:** `rapporter/rapporter-client.tsx`
**Design:** Rapport-type velger + periode + generer-knapp + siste rapporter

#### MC-3.3 Godkjenninger
**Fil:** `godkjenninger/godkjenninger-client.tsx`
**Design:** Ventende handlinger med Godkjenn/Avvis per rad

#### MC-3.4 Fasiliteter
**Filer:** `fasiliteter/fasiliteter-client.tsx`, innstillinger, ny-aktivitet
**Design:** Lokasjon-kort + aktivitets-liste + legg til-dialog

#### MC-3.5 E-postmaler
**Fil:** `e-postmaler/e-postmaler-client.tsx`
**Design:** Mal-liste med forhåndsvisning + rediger

#### MC-3.6 Turneringer (admin)
**Fil:** `turneringer/turneringer-client.tsx`
**Design:** Opprett turnering + administrer pameldinger

#### MC-3.7 AI-assistent
**Fil:** `ai-assistent/chat-client.tsx`
**Design:** Chat med naturlig sprak for a sporge om data

#### MC-3.8 Focus/Mission Board
**Fil:** `focus/focus-client.tsx`
**Design:** Kanban (Todo/InProgress/Done) med dra-og-slipp

#### MC-3.9 Agenter
**Fil:** `agenter/agenter-client.tsx`
**Design:** AI-agent dashboard med status og avatarer

#### MC-3.10 Notifications
**Fil:** `notifications/page.tsx`
**Design:** Varslingsliste med lest/ulest og handlinger

---

## Designprinsipper (gjenta aldri)

### Portal (spillerportal)
- Canvas: `bg-portal-bg` (#F5F5F7)
- Kort: `PremiumCard` (aldri raa div)
- Tekst: `text-portal-text`, `text-portal-secondary`, `text-portal-muted`
- Labels: 10-11px uppercase tracking-[0.08em]
- Tall: tabular-nums tracking-tight
- Knapper: `rounded-[20px] bg-primary text-white`
- Hover: translateY(-1px) duration-300 ease-apple
- Aldri: hex, grey-tokens, GlassCard, HeroHeading, BentoCard, gradient pa kort

### Mission Control (admin)
- Canvas: `bg-grey-50` (gronntonet)
- Sidebar: `bg-black` med `text-white/60`, aktiv: `text-accent-cta border-l-4`
- Topbar: `h-14 bg-white border-b border-grey-100`
- Kort: `AdminCard` (eller PremiumCard tilpasset)
- Divisjonsfarger som venstre-stripe: Coaching=#005840, Junior=#007AFF, AI=#AF52DE
- Tabeller: `AdminDataTable` med hover-rad
- KPI: Samme stat-kort-monster som portal

### Felles
- Aldri emojier
- Aldri dark mode
- Norsk bokmal for all tekst
- Golftermer: Tee Total, Approach, Short Game, Putting, Strokes Gained, Fairway, GIR
- Maks 300 linjer per fil

---

## Prioritert rekkefolge

| Uke | Hva | Sider | Estimat |
|-----|-----|-------|---------|
| 1 | Portal Fase 1 | Dagbok, Runde, Booking-ny, Booking-detalj | 4 sider |
| 1 | MC Fase 1 | Hub, Denne uken, Bookinger, Kalender, Elever | 6 sider |
| 2 | Portal Fase 2 | Coaching-historikk, Meldinger, Ovelser, Tester, Analyse, Kalender | 6 sider |
| 2 | MC Fase 2 | Okter, Treningsplaner, Analytics, Meldinger, Tilgjengelighet, Kapasitet | 6 sider |
| 3 | Portal Fase 3 | Sammenligning, Abonnement, Sosialt, Apper, Onboarding, Turneringer | 6 sider |
| 3 | MC Fase 3 | Okonomi, Rapporter, Godkjenninger, Fasiliteter, E-post, Turneringer, AI, Focus, Agenter, Notifications | 10 sider |

**Totalt:** 38 sider. Alle med konsistent premium-design, portal-tokens, PremiumCard.

---

## Arbeidsprosess per side

1. Les navarende kode (page.tsx + client + actions)
2. Identifiser token-brudd og strukturelle avvik
3. Migrere til portal-tokens
4. Erstatte kort-wrapper med PremiumCard
5. Fikse header (label + h1), knapper (rounded-[20px]), tall (tabular-nums)
6. Verifisere med tsc --noEmit
7. Visuell test i nettleser
8. Commit

Ingen side skal ta mer enn 30 minutter med agenter.
