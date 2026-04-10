# Portal Design Plan — Funksjonsprioritering og visuell fremvisning

## Metode: Impact × Frequency-matrise

Prioritert etter hva som gir mest verdi for brukeren (Erik, HCP 14) sett opp mot
hvor ofte funksjonen brukes. Basert pa personas og use cases (01_PERSONAS).

---

## Tier 1: Kjerneopplevelsen (Daily/Weekly bruk)

Disse 5 skjermene utgjor 80% av brukeropplevelsen og ma designes forst.

### 1. Dashboard (Hjem)
**Frekvens:** Daglig | **Impact:** Hoy — forsteinntrykk, motivasjon
**Hva vises:**
- Hero med golfbilde + personlig hilsen + 4 KPI-tall (score, spredning, GIR, okter)
- Neste booking-kort (prominent, gronn gradient)
- AI-innsikt (lilla aksent, personlig anbefaling)
- Ukens plan (checklist med fremdrift)
- Treningsoversikt (donut + bar chart)
- Scoring & Spredning (ring-indikator + trend)

**Visuelt prinsipp:** Bento-grid med varierende kortstorrelser. Hero-bilde for emosjonell tilknytning. Data alltid med kontekst (trend, sammenligning).

---

### 2. Treningsplan
**Frekvens:** Ukentlig | **Impact:** Hoy — strukturerer all trening
**Hva vises:**
- Ukevisning med dager og okter
- Treningspyramide (FYS/TEK/SLAG/SPILL/TURN) som visuell fordeling
- Ovelsebibliotek med drag-and-drop
- AI-generer plan-knapp
- Sjekkmerker for fullforte okter
- Sesjondetalj med ovelser, tid, utstyr

**Visuelt prinsipp:** Kalender-lignende layout. Fargekodede kategorier. Tydelig fremgang (fullfort vs gjenstaar). Drag-and-drop for tilpasning.

---

### 3. Mine Bookinger
**Frekvens:** Hver 2. uke | **Impact:** Hoy — inntektskritisk, logistikk
**Hva vises:**
- Neste booking (fremhevet med countdown)
- Kommende bookinger (liste)
- Historikk (tidligere okter med coaching-notater)
- Book ny-knapp (CTA #D1F843 lime)
- Status-badges (bekreftet/venter/avlyst)
- Avbestill/endre-handlinger

**Visuelt prinsipp:** Tidslinje-layout. Neste booking er hero-element. Tydelig statusfarger (success/warning/error).

---

### 4. Statistikk
**Frekvens:** Etter runde / manedlig | **Impact:** Hoy — bevis pa fremgang
**Hva vises:**
- Score-trend (linjediagram, siste 10-20 runder)
- Strokes Gained-breakdown (Off tee, Approach, Around green, Putting)
- Spredning over tid (standardavvik)
- Handicap-utvikling
- Treningsomrade-fordeling (donut)
- Sammenligning med peers (PRO tier)
- Skill-level badge

**Visuelt prinsipp:** Dashboard med rike grafer (Recharts). Sparklines for trender. Fargekodede SG-kategorier. Tabs for tidsperiode (7d/30d/3m/aret).

---

### 5. Kalender
**Frekvens:** Ukentlig | **Impact:** Medium-hoy — oversikt over alt
**Hva vises:**
- Ukevisning med coaching, trening, turneringer
- Fargekodede event-typer
- Google Calendar-synk
- Klikk for detaljer
- iCal-eksport

**Visuelt prinsipp:** Ren kalender-grid. Minimalt, Apple Calendar-inspirert. Event-chips med farge og label.

---

## Tier 2: Engasjerende funksjoner (Weekly/Monthly bruk)

### 6. Dagbok (Treningslogg)
**Frekvens:** Etter trening | **Impact:** Medium — selvrefleksjon
**Hva vises:**
- Treningsstreak (motivasjon)
- Aktivitetstidslinje
- Loggoppforing: dato, varighet, fokus, notater, vurdering, energi
- Filtrering per type (range, bane, putting, coaching, fitness)
- Totalstatistikk (okter, minutter, snitt-vurdering)

---

### 7. Coaching-historikk
**Frekvens:** Etter sesjon | **Impact:** Medium — verdifull referanse
**Hva vises:**
- Sesjonsliste med trener, dato, fokusomrade
- Coaching-notater (hva ble gjort, hva ovelses)
- AI-oppsummering
- Link til neste booking

---

### 8. AI Coach (Chat)
**Frekvens:** Ved behov | **Impact:** Medium-hoy — differensierende funksjon
**Hva vises:**
- Chat-interface med streaming-svar
- Hurtigsporsmal-forslag
- Basert pa brukerens data (runder, treningslogg, coaching)
- Tips, analyse, planlegging

---

### 9. Runde-tracking
**Frekvens:** Hver runde (1-4x/mnd) | **Impact:** Medium — datainnsamling
**Hva vises:**
- Velg bane (norske baner)
- Hull-for-hull scorecard
- Registrer putts, fairways, greens
- Sanntidsstatistikk
- Post-runde AI-analyse og oppsummering

---

### 10. TrackMan Data
**Frekvens:** Etter sesjon | **Impact:** Medium — teknisk innsikt
**Hva vises:**
- Klubbe-for-klubbe analyse
- Nokkeltall: hastighet, spin, launch angle, carry
- Trenddiagrammer
- CSV-opplasting

---

## Tier 3: Utvidede funksjoner (Monthly / Spesialisert)

### 11. Sammenligning (Peer Benchmark)
**PRO tier** | Sammenlign SG mot peers i handicap-range

### 12. Sosialt
Utfordringer, leaderboards, fellesskap

### 13. Turneringer
Turneringsoversikt, pategning, resultater

### 14. Turneringsplan
Forberedelse til spesifikk turnering

### 15. Bag (Utstyr)
Klubbe-oversikt, tilpasninger

### 16. Apper/Moduler
Markedsplass for tilleggsfunksjoner

### 17. Benchmark
SG-profil mot pro-spillere

---

## Navigasjonsstruktur (anbefalt)

```
HOVEDNAV (sidebar/topbar — maks 6 synlige)
├── Oversikt          ← Dashboard (Tier 1)
├── Treningsplan      ← Ukentlig plan (Tier 1)
├── Bookinger         ← Mine bookinger + ny (Tier 1)
├── Statistikk        ← Grafer og analyse (Tier 1)
├── Kalender          ← Alt i en visning (Tier 1)
└── Mer...            ← Expanderbar
    ├── Dagbok
    ├── Coaching-historikk
    ├── AI Coach
    ├── Runder
    ├── TrackMan
    ├── Sosialt
    ├── Turneringer
    └── Profil / Innstillinger
```

---

## Visuell fremvisning per komponenttype

### KPI-kort
- Stort tall + label + trend-pil + sparkline
- Glow-effekt for beste verdi
- Fargekode: gronn = bra, oransje = middels, rod = trenger fokus

### Grafer (Recharts + shadcn charts)
- Area chart for scoring-trend (gradient fill)
- Donut for treningsfordeling
- Bar chart for ukentlig aktivitet
- Radar for SG-breakdown
- Sparklines for inline-trender

### Kort-typer
| Type | Bruk | Visuelt |
|------|------|---------|
| Hero-kort | Dashboard topp | Bilde + overlay + tekst + stats |
| Stat-kort | KPI | Tall + label + trend + glow |
| Action-kort | Neste booking | Gronn gradient, CTA |
| AI-kort | Innsikt | Lilla aksent, glow-line |
| Plan-kort | Ukesplan | Checklist med ikoner |
| Data-kort | Grafer | Hvit bg, subtle border, chart |
| Bilde-kort | Coaching-bilder | Foto + overlay tekst |

### Knapper (Brand Guide V2.0 §07)
| Type | Stil | Bruk |
|------|------|------|
| Primary | #005840 filled, hvit tekst | Hovedhandlinger |
| Secondary | Hvit, outlined #005840 | Sekundaere |
| Accent/CTA | #D1F843 filled, #0A1F18 tekst | Book, Kjop, Start |
| Ghost | Transparent | Tertiaere |

---

## Design-rekkefølge for Stitch + Kode

**Fase 1 — Kjernen (5 skjermer)**
1. Dashboard (allerede pastartet i Stitch)
2. Treningsplan
3. Mine Bookinger
4. Statistikk
5. Kalender

**Fase 2 — Engasjement (5 skjermer)**
6. Dagbok
7. Coaching-historikk
8. AI Coach
9. Runde-tracking (scorecard)
10. TrackMan

**Fase 3 — Utvidelse (resterende)**
11-17. Sosialt, turneringer, benchmark, etc.

---

## Neste steg

1. Generer alle Fase 1-skjermer i Stitch med Brand Guide V2.0 design system
2. Review og iterer visuelt
3. Implementer direkte i Next.js/Tailwind fra Stitch-output
4. Koble til eksisterende data/API-er
