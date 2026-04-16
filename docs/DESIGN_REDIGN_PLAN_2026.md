# AK Golf Platform — Masterplan for Redesign & AI-agenter 2026

> **Mål:** Transformere alle portal-skjermer til et konsistent, premium design-system med bento-grid, samtidig som vi aktiverer AI-agenter og MCP-verktøy for å generere treningsinnhold, driller og tester basert på spillerdata.

---

## 1. Design System — Grunnlaget

### 1.1 Farger og tokens (fra `lib/design-tokens.ts`)

| Token | Verdi | Bruk |
|-------|-------|------|
| `primary.main` | `#005840` | Primærknapper, headings, borders |
| `primary.accent` | `#D1F843` | CTA, highlights, badges, lime-glow |
| `primary.surface` | `#ECF0EF` | Portal-bakgrunn (Apple-grå) |
| `primary.text` | `#324D45` | Hovedtekst |
| `primary.muted` | `#A5B2AD` | Sekundærtekst, labels |
| `primary.dark` | `#0A1F18` | Mørkeste grønn, hero-overlay, dark sidebar |
| `semantic.success` | `#2A7D5A` | Positive trender, fullført |
| `semantic.error` | `#B84233` | Feil, avbestilling, negativ SG |
| `semantic.warning` | `#C48A32` | Advarsler, ventende status |
| `ai.primary` | `#AF52DE` | AI-insikt, lilla glow |
| `data.sage` | `#2A7D5A` | Grafer, positive barer |
| `data.coral` | `#E85D4E` | Grafer, negative barer, varme aksenter |
| `data.blue` | `#007AFF` | Links, kalender-events, info |
| `data.lime` | `#D1F843` | CTA-grafer, aksent på dataviz |

### 1.2 Visuelt DNA — 5 kjennetegn

1. **Store tall, liten kontekst** — KPI i 28-44px, labels i 10-11px uppercase
2. **Layered shadows** — 2-lags shadow + inner gradient, aldri helt flat
3. **Bento asymmetri** — 12-kolonne grid, kort i 4/6/8/12 col-span
4. **Sparsom aksent** — 90% nøytral flate, maks 2-3 lime per skjerm
5. **Kontekstuell navigasjon** — Neste naturlige handling alltid synlig som CTA

### 1.3 Kort-typer (komponentbibliotek)

| Type | Bruk | Visuelt |
|------|------|---------|
| Hero-kort | Dashboard topp | Bilde + overlay + tekst + stats |
| Stat-kort | KPI | Tall + label + trend + glow |
| Action-kort | Neste booking | Grønn gradient, CTA |
| AI-kort | Innsikt | Lilla aksent, glow-line |
| Plan-kort | Ukesplan | Checklist med ikoner |
| Data-kort | Grafer | Hvit bg, subtle border, chart |
| Bilde-kort | Coaching | Foto + overlay tekst |

### 1.4 Typografi og spacing

- **Font:** Inter (sans), JetBrains Mono (data)
- **Hero:** 60px, bold, -0.02em tracking
- **H1:** 36px, bold, -0.025em
- **H2:** 30px, bold, -0.01em
- **Body:** 16px, regular, 1.7 line-height
- **Label:** 12px, semibold, 0.12em tracking, uppercase
- **Section padding:** 5rem mobile → 7rem desktop
- **Container max-width:** 1120px

---

## 2. Nåværende skjermer og status

### Tier 1 — Kjerneopplevelsen (Daily/Weekly)

| Skjerm | Status | Prioritet | Kommentar |
|--------|--------|-----------|-----------|
| Dashboard | ✅ Ferdig | P0 | Bento-grid v2 committed, både Stitch + kode |
| Treningsplan | ✅ Ferdig | P0 | WeekDaySelector, DailySessionCard, WeekFocusCard |
| Mine Bookinger | ✅ Ferdig | P0 | Hero-kort + timeline + historikk |
| Statistikk | ✅ Ferdig | P0 | KPI-rad + SG-barer + AI-anbefaling |
| Kalender | 🟡 Uferdig | P1 | Funksjonell, men trenger Apple Calendar-polish |

### Tier 2 — Engasjerende funksjoner

| Skjerm | Status | Prioritet | Kommentar |
|--------|--------|-----------|-----------|
| Dagbok | 🟡 Delvis | P1 | Logging fungerer, men trenger streak/heatmap UI |
| Coaching-historikk | 🟡 Delvis | P2 | Listevisning fungerer, men mangler AI-oppsummering-kort |
| AI Coach (chat) | 🟡 Delvis | P2 | Chat fungerer, men mangler hurtigspørsmål og data-kontekst |
| Runde-tracking | 🟡 Delvis | P1 | Scorecard fungerer, men post-runde AI-analyse er enkel |
| TrackMan Data | 🟡 Delvis | P2 | Tabellvisning, mangler waveforms og trenddiagrammer |

### Tier 3 — Utvidede funksjoner

| Skjerm | Status | Prioritet | Kommentar |
|--------|--------|-----------|-----------|
| Sammenligning/Benchmark | 🔴 Ikke startet | P3 | Konsept klart, men ikke bygget |
| Sosialt | 🔴 Ikke startet | P3 | Ide-fase |
| Turneringer | 🟡 Delvis | P3 | Listevisning, men mangler dybde |
| Turneringsplan | 🔴 Ikke startet | P3 | Konsept klart fra wireframes |
| Bag (utstyr) | 🔴 Ikke startet | P3 | Ikke prioritert |

---

## 3. Redesign-prioritering

### Fase A: Konsolider det som er ferdig (nå)
1. Dashboard v2 → test på mobile, juster shadows
2. Treningsplan v2 → koble til faktisk data, test drag-and-drop
3. Bookinger v2 → test ende-til-ende, juster timeline
4. Statistikk v2 → optimaliser Recharts for mobil

### Fase B: Fullfør halvferdige skjermer (uke 17-18)
5. Kalender — Apple Calendar-inspirert redesign
6. Dagbok — aktivitetsheatmap + streak-badges
7. AI Coach — streaming-bobler + hurtigspørsmål + data-kontekst
8. Runde-tracking — forbedret scorecard + post-runde AI-kort

### Fase C: Bygg nye skjermer (uke 19-20)
9. TrackMan Data — waveform-diagrammer, klubbe-sammenligning
10. Coaching-historikk — AI-oppsummering per sesjon
11. Sammenligning — peer benchmark med radar-diagram
12. Turneringer + Turneringsplan — integrert flyt

### Fase D: Polish og systematisering (uke 21)
13. Admin Mission Control — mørk sidebar, konsistent med spillerportal
14. Design system-dokumentasjon — Storybook eller liknende
15. Animations and micro-interactions — Framer Motion polish

---

## 4. Data-visualisering — muligheter og plan

### 4.1 Hvilke data har vi?

| Datakilde | Hva inneholder den | Visualiseringsmuligheter |
|-----------|-------------------|--------------------------|
| **TrackMan-sesjoner** | Klubbehastighet, carry, spin, launch, smash per klubbe | Waveforms, klubbe-radar, trend over tid |
| **Runder (RoundStats)** | Score, SG (4 kategorier), FW%, GIR%, putts, scrambling | SG-barer, score-trend, radar vs peers |
| **Treningslogg** | Økter per dag, varighet, fokus, vurdering, L-M-PR | Aktivitetsheatmap, volum-stacked-bar, konsistens-score |
| **Coaching-historikk** | Notater, fokusområder, video, TrackMan fra sesjon | Timeline, AI-oppsummering, fremgangs-tracker |
| **Handicap (GolfBox)** | HCP over tid | Sparkline, milepæls-badges |
| **Booking-data** | Når, hvem, hvilken tjeneste, status | Neste booking-kort, coaching-frekvens |
| **AI-analyse** | Svakhetsanalyse, fokusområder, anbefalinger | AI-insikt-kort, action-pills, progresjons-prediksjon |

### 4.2 Anbefalte grafer per skjerm

**Dashboard:**
- Score-trend: Area chart (Recharts, gradient fill)
- Ukentlig aktivitet: Bar chart
- Treningsfordeling: Donut chart
- Handicap: Sparkline
- SG-breakdown: Mini horizontal bars

**Statistikk:**
- Score-trend: Area chart (siste 10-20 runder)
- SG-breakdown: Horizontal bars med fargekoding (grønn/rød)
- HCP-utvikling: Line chart (12 måneder)
- Treningsvolum: Stacked bar per uke (FYS/TEK/SLAG/SPILL/TURN)
- Plan vs faktisk: Grouped bars
- Konsistens: GitHub-style heatmap (84 dager)
- Radar: SG på 4 akser vs tour-snitt

**TrackMan:**
- Klubbe-trender: Line chart per klubbe (carry over tid)
- Siste sesjon: Bar chart (hastighet, carry, spin)
- Svingutvikling: Waveform / area chart (hvis tidsseriedata)

**Dagbok:**
- Streak: Counter + calendary-view
- Volum: Stacked bar (kategori per uke)
- Vurdering: Smooth line chart over tid

### 4.3 Data-flywheel — konseptet

> Jo mer data spilleren logger, jo bedre blir AI-anbefalingene. Jo bedre anbefalingene, jo mer motiveres spilleren til å logge.

**Loop:**
1. Spiller logger runde / treningsøkt / TrackMan-sesjon
2. Systemet oppdaterer aggregater (SG, HCP, volum, konsistens)
3. AI analyserer trender og identifiserer svakheter
4. AI/trener genererer justert treningsplan
5. Spiller følger planen og logger ny data

---

## 5. Treningsplanlegger — redesign og funksjonalitet

### 5.1 Visjon
En **Notion Calendar-lignende** treningsplanlegger med drag-and-drop, hvor spilleren ser, tilpasser og logger sin ukesplan i én visning.

### 5.2 Layout

```
┌─────────────────────────────────────────────┬──────────────────────┐
│ KALENDER-GRID (hoved)                       │ SIDEMENY (fast)      │
│                                             │                      │
│ ← Uke 15 →   7.–13. april 2026             │ STANDARD ØKTER       │
│                                             │ ┌──────────────────┐ │
│  Man  │  Tir  │  Ons  │  Tor  │  Fre  │ Lør │ │ Putting-drill    │ │
│ ──────┼───────┼───────┼───────┼───────┼─────│ │ 20 min · TEK     │ │
│       │       │       │       │       │     │ ├──────────────────┤ │
│ [Økt] │       │ [Økt] │       │ [Økt] │     │ │ Short game       │ │
│ FYS   │       │ TEK   │       │ SLAG  │     │ │ 30 min · SLAG    │ │
│ 45min │       │ 60min │       │ 30min │     │ ├──────────────────┤ │
│       │       │       │       │       │     │ │ Driving range    │ │
│       │       │       │       │       │     │ │ 45 min · SLAG    │ │
│       │       │       │       │       │     │ └──────────────────┘ │
│       │       │       │       │       │     │                      │
│       │       │       │       │       │     │ FAVORITT ØVELSER     │
│       │       │       │       │       │     │ ┌──────────────────┐ │
│       │       │       │       │       │     │ │ Gate drill       │ │
│       │       │       │       │       │     │ │ Clock drill      │ │
│       │       │       │       │       │     │ │ Ladder drill     │ │
│       │       │       │       │       │     │ └──────────────────┘ │
│       │       │       │       │       │     │                      │
│       │       │       │       │       │     │ TRENINGSPYRAMIDEN    │
│       │       │       │       │       │     │ [TURN ▅]             │
│       │       │       │       │       │     │ [SPILL ████]         │
│       │       │       │       │       │     │ [SLAG ██████]        │
│       │       │       │       │       │     │ [TEK ████████]       │
│       │       │       │       │       │     │ [FYS ██████████]     │
│       │       │       │       │       │     │                      │
│       │       │       │       │       │     │ HURTIGFILTER         │
│       │       │       │       │       │     │ [Putting] [Chip]     │
│       │       │       │       │       │     │ [Driver] [Jern]      │
│       │       │       │       │       │     │ [Fitness] [Mental]   │
└─────────────────────────────────────────────┴──────────────────────┘
```

### 5.3 Interaksjon og funksjoner

| Handling | Resultat |
|----------|----------|
| Dra standard økt → kalender-dag | Oppretter ny økt på den dagen |
| Dra favorittøvelse → eksisterende økt | Legger til øvelse i økten |
| Dra økt mellom dager | Flytter økten |
| Klikke pyramide-nivå | Filtrerer øvelser i sidemeny |
| Klikke økt i kalender | Åpner detaljer/redigering |
| Toggle dagvisning | Fokusert visning av én dag |
| Toggle månedsvisning | Kompakt oversikt med prikker |

### 5.4 Treningspyramiden (AK-formelen)

5 nivåer fra bunn til topp:
1. **FYS** — Fysisk trening (styrke, mobilitet, kondisjon)
2. **TEK** — Teknikk (svinganalyse, video, impact)
3. **SLAG** — Slagtrening (putting, chipping, driving, jern)
4. **SPILL** — Spill (9/18 hull, scramble, match)
5. **TURN** — Turnering (konkurranser, kvalik, ranking)

Pyramiden vises som en visuell fordeling (stacked bar eller horisontale bars) både i sidemenyen og i treningsanalyse.

### 5.5 L-M-PR logging per øvelse

Hver øvelse logges med:
- **L-fase** (Læringsfase): `KOLLE` → `ARM` → `BALL` → `MÅL`
- **M** (Miljø): `LUKT` (range) → `BANE` (course) → `PRESS` (konkurranse)
- **PR** (Prestasjon): Score, treffrate %, avstand, rating 1-5

Dette gir spilleren og treneren granular innsikt i hvor øvelsen mestres.

---

## 6. Agenter og MCP — generering av innhold

### 6.1 Arkitektur: Multi-agent system

Vi bygger **MCP-servers** (Model Context Protocol) som agenter. Hver agent er et spesialisert verktøy som LLM-en kan kalle.

```
┌─────────────────────────────────────────────────────────┐
│                    Hoved-LLM (Claude)                   │
│  Spiller spør: "Hva bør jeg trene på denne uken?"       │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Agent:       │   │  Agent:       │   │  Agent:       │
│  Weakness     │   │  Exercise     │   │  Plan         │
│  Analyzer     │   │  Generator    │   │  Builder      │
└───────────────┘   └───────────────┘   └───────────────┘
```

### 6.2 Agent 1: Weakness Analyzer
**Input:** Spillerens siste 10 runder, TrackMan-data, coaching-notater, HCP-trend  
**Output:** Prioritert liste over svakheter med begrunnelse

> *"Din Approach-kategori er -2.3 SG bak peers. Du treffer kun 42% GIR med jern 6-8. Anbefalt fokus: innspillshøyde og avstandskontroll."*

### 6.3 Agent 2: Exercise Generator
**Input:** Svakhetsanalyse + treningspyramide-nivå + tilgjengelig tid + utstyr  
**Output:** Liste med øvelser (navn, beskrivelse, varighet, kategori, L-fase)

> *"Gate drill (TEK, 20 min, L-fase: BALL) — sett opp to køller 30 cm fra hverandre, sikte på å slå 10 baller mellom dem med 7-jern. Mål: 7/10 treff."*

### 6.4 Agent 3: Drill Generator
**Input:** Spesifikk teknikk (f.eks. "chipping kontakt") eller coach-instruksjon  
**Output:** Video-beskrivelse + trinn-for-trinn + suksesskriterier

> *"Clock drill (SLAG, 15 min) — plasser baller i sirkel rundt hullet (1-3-6-9). Chip til hullet fra hver posisjon. Mål: 2 putts eller bedre fra 75% av posisjonene."*

### 6.5 Agent 4: Test Generator
**Input:** Nivå (HCP), fokusområde, ønsket varighet  
**Output:** Standardiserte tester med scoring

**Tester vi skal generere:**
- 50-100-150 test (putting, chipping, pitching)
- 9 hull challenge (scramble-format, fokus på scoring)
- Driver dispersion test (TrackMan-basert)
- Green reading test (putts fra 4 avstander)
- Bunker recovery test (3 forsøk fra 5 posisjoner)

### 6.6 Agent 5: Training Plan Builder
**Input:** Mål, HCP, tilgjengelig tid/uke, svakheter, sesongfase  
**Output:** 12-ukers plan med økter fordelt på pyramide-nivåer

> *"Uke 1-4: Oppbygging (60% TEK, 20% SLAG, 20% FYS). Uke 5-8: Overgang (40% TEK, 30% SLAG, 20% SPILL, 10% FYS). Uke 9-12: Pre-season (30% TEK, 25% SLAG, 30% SPILL, 15% TURN)."*

### 6.7 Agent 6: Coaching Summary
**Input:** Coaching-sesjon (notater, video-tekst, TrackMan-data)  
**Output:** Kort AI-oppsummering + 3 konkrete takeaways + anbefalte øvelser

### 6.8 Agent 7: Post-Round Analyst
**Input:** Runde-data (scorecard, SG, putts, FW/GIR)  
**Output:** Analyse + 2-3 treningsfokus for neste uke

---

## 7. Master TODO-liste

### Design & UI (Fase A — umiddelbart)
- [ ] Definer Storybook/design-system mappestruktur
- [ ] Bygg gjenbrukbare kort-komponenter (Hero, Stat, AI, Plan, Data)
- [ ] Lag `ChartContainer`-wrapper for konsistente grafer
- [ ] Mobiloptimaliser Dashboard v2 (test på iPhone 14 Pro)
- [ ] Mobiloptimaliser Treningsplan v2
- [ ] Mobiloptimaliser Bookinger v2
- [ ] Mobiloptimaliser Statistikk v2

### Treningsplanlegger (Fase B — uke 17-18)
- [ ] Bygg kalender-grid komponent (uke/måned/dag-visning)
- [ ] Implementer drag-and-drop for økter og øvelser
- [ ] Bygg sidemeny med standardøkter, favoritter, pyramide
- [ ] Lag treningspyramide-visualisering (stacked bar)
- [ ] Koble L-M-PR logging til UI
- [ ] Lag hurtigfilter (Putting, Chip, Driver, Jern, Fitness, Mental)
- [ ] Lag økt-detalj-modal med øvelsesliste og redigering

### AI-agenter / MCP (Fase B — uke 17-18)
- [ ] Sett opp MCP-server struktur (Val Town / local Node)
- [ ] Bygg Weakness Analyzer agent
- [ ] Bygg Exercise Generator agent
- [ ] Bygg Drill Generator agent
- [ ] Bygg Test Generator agent
- [ ] Bygg Training Plan Builder agent
- [ ] Bygg Coaching Summary agent
- [ ] Bygg Post-Round Analyst agent
- [ ] Integrer agenter i portal-AI-chat og treningsplanlegger

### Dataviz & Analyse (Fase C — uke 19-20)
- [ ] Lag aktivitetsheatmap-komponent (GitHub-style)
- [ ] Lag SG horizontal bar-komponent
- [ ] Lag radar-diagram for SG vs peers
- [ ] Lag sparkline-komponent for inline-trender
- [ ] Lag TrackMan waveform/trend charts
- [ ] Lag Plan vs Faktisk grouped bar chart
- [ ] Koble alle grafer til faktiske API-endepunkter

### Booking & Auth (Ferdig / polish)
- [x] Dynamisk slot-telling (gjort optional)
- [ ] Legg til idempotency key på Stripe-refusjoner
- [ ] Staging-test av full booking-flyt
- [x] Auth-sider med Synex-design

### Admin & Mission Control (Fase C)
- [ ] Mørk sidebar redesign
- [ ] Admin dashboard med bento-grid
- [ ] Kalender-komponent for coach-tilgjengelighet
- [ ] Elevliste med progresjonsindikatorer

### Lansering & Marketing (Fase D)
- [x] Lanseringskampanje-innhold
- [ ] Publiser Instagram/Facebook poster
- [ ] Send lanserings-e-post til eksisterende spillere
- [ ] Sett opp Google Ads (valgfritt)
- [ ] Go-live: fjern maintenance mode

---

## 8. Notion-import instruksjon

CSV-filen `docs/MASTER_TODO_2026.csv` kan importeres til Notion:

1. Opprett en ny database i Notion (Table view)
2. Klikk `...` → `Merge with CSV`
3. Velg `docs/MASTER_TODO_2026.csv`
4. Notion mapper kolonnene automatisk. Juster:
   - `Priority` → Select (High / Normal / Low)
   - `Status` → Select (Pending / In Progress / Done)
   - `EstimatedHours` → Number
   - `DependsOn` → Relation (hvis du vil koble tasks)

---

## 9. Neste umiddelbare steg

1. **Du** — kjører Kimi-prompten i det andre terminalvinduet for å samle design-regler
2. **Jeg** — fullfører booking P2/P3 og begynner på MCP-agent-struktur
3. **Sammen** — reviewer wireframes for Kalender og Dagbok før implementering
4. **Deretter** — velger vi én skjerm å redesigne per dag til alt er ferdig
