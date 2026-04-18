# Spillerkartlegging — Produktspesifikasjon

**Versjon:** 1.0  
**Dato:** 2026-04-18  
**Forfatter:** Anders Kristiansen / AK Golf Group AS  
**Status:** Klar for implementering

---

## 0. Anbefaling: Bygg dette inn i AK Golf Platform

Spillerkartleggingssystemet skal bygges som en modul i den eksisterende AK Golf Platform-appen. Ikke et eget verktøy.

Begrunnelse: Plattformen har allerede 90% av infrastrukturen som trengs. UnifiedSkillIndex (USI) med 9 dimensjoner, A-K-kategorisystem, SG-benchmarks, TrackMan-integrasjon, treningslogger, talent-scoring og Kalman-prognose — alt er på plass i databasen og beregningslogikken. Det som mangler er en samlet kartleggingsvisning som kobler disse delene sammen til en forståelig spillerprofil, pluss multi-coach-tilgang.

Å bygge dette separat ville krevd duplisering av Prisma-schema, auth-flyt, Supabase-integrasjon, og hele USI-beregningspipelinen. Arkitekturmessig passer det perfekt inn i eksisterende portal-struktur (`/portal/(dashboard)/kartlegging/`) med Mission Control-visning for coacher (`/portal/admin/kartlegging/`).

---

## 1. Hva systemet gjør

Spillerkartlegging gir hver spiller én samlet profil som svarer på fire spørsmål:

1. **Hvor er jeg nå?** — Nivå, kategori, styrker og svakheter
2. **Hvordan utvikler jeg meg?** — Trend over tid, progresjon
3. **Hva mangler for neste nivå?** — Konkrete gap med tall
4. **Hva skal jeg trene på?** — Prioriterte fokusområder basert på data

Coachen ser det samme for alle sine spillere, pluss gruppeoversikt og sammenligning.

---

## 2. Tre datakilder

### 2.1 Turneringsresultater (allerede tilgjengelig)

Kilde: 6117 resultater fra Srixon Tour, Olyo, Norgescup, Østlandstour. Publiserte resultater (GDPR-OK).

Datapunkter som hentes ut per spiller:

| Datapunkt | Beskrivelse | Beregning |
|-----------|-------------|-----------|
| Snitt-score relativt til par | Gjennomsnittlig +/- par over siste 10 runder | Vektet snitt, nyere runder teller mer (30-dagers halvverdi) |
| Beste score | Laveste score relativt til par siste 12 mnd | Direkte fra turneringsdata |
| Konsistens | Standardavvik på score | Lav = jevn spiller, høy = uforutsigbar |
| Plasserings-percentil | Gjennomsnittlig plassering i % av feltet | (plassering / deltakere) * 100, vektet snitt |
| Turneringsfrekvens | Antall turneringer siste 12 mnd | Direkte telling |
| Utvikling | Score-trend over tid | Lineær regresjon på siste 8 turneringer |
| Pressure-score (turnering) | Prestasjon i siste 6 hull vs. resten | Score siste 6 hull minus forventet basert på resten |

Mapping til eksisterende modeller: `RoundStats` (scoreToPar, sgTotal, bounceBackCount), `UnifiedSkillSnapshot` (trendMomentum), turneringsdata-API.

### 2.2 Testresultater (ny innsamling via appen)

Standardiserte tester som coacher gjennomfører med spillere. Alle resultater lagres som persondata (krever samtykke).

**Kategori A: TrackMan-tester (allerede delvis i systemet)**

| Test | Hva måles | Måleverdi | Eksisterende modell |
|------|-----------|-----------|---------------------|
| Driver ballhastighet | Kraft | mph | TrackManShotData.ballSpeed |
| Driver carry | Lengde | meter | TrackManShotData.carryDistance |
| Driver spredning | Presisjon | meter offline std.avvik | ClubDispersionData |
| Jern carry (7-jern) | Kontroll | meter | TrackManShotData.carryDistance |
| Jern spredning | Presisjon | meter offline std.avvik | ClubDispersionData |
| Wedge avstandskontroll | Nøyaktighet | % innenfor 3m av mål | Ny: TestResult |
| Smash factor | Effektivitet | ratio | TrackManShotData.smashFactor |

**Kategori B: Kortspill-tester (ny)**

| Test | Hva måles | Protokoll | Måleverdi |
|------|-----------|-----------|-----------|
| Up-and-down 10-punkt | Rundt green | 10 slag fra ulike posisjoner, score 0-2 per slag | Poeng av 20 |
| Bunkertest 5-punkt | Bunker | 5 slag, avstand til hull måles | Snittavstand i meter |
| Pitch presisjon | Pitch 20-50m | 10 slag til mål, avstand måles | Snittavstand i meter |
| Flop/lob kontroll | Spesialslag | 5 slag over hindring, landing innenfor sone | Antall innenfor sone |

**Kategori C: Putting-tester (ny)**

| Test | Hva måles | Protokoll | Måleverdi |
|------|-----------|-----------|-----------|
| Putting 1m (make%) | Kort putt | 10 putter fra 1m, hull i ring | % innhull |
| Putting 3m (make%) | Medium putt | 10 putter fra 3m | % innhull |
| Putting 6m (make%) | Lang putt | 10 putter fra 6m | % innhull |
| Fartskontroll 10m | Lag putting | 10 putter fra 10m, avstand forbi hull | Snittavstand forbi hull i cm |
| Lesing-test | Grønlesing | 5 putter med break, score korrekt linje vs. feil | Poeng av 5 |

**Kategori D: Fysisk/mobilitet (ny)**

| Test | Hva måles | Protokoll | Måleverdi |
|------|-----------|-----------|-----------|
| Rotasjonsmobilitet | Hofte/thorax | Seated rotation test | Grader |
| Balanse | Stabilitet | Enkeltbens stå med lukkede øyne | Sekunder |
| Eksplosivitet | Kraft | Medisinball-kast | Meter |

**Kategori E: Mental/kognitivt (ny)**

| Test | Hva måles | Protokoll | Måleverdi |
|------|-----------|-----------|-----------|
| Kognitivt under press | Beslutninger, fokus | Scenariobasert vurdering under tidspress | Poeng |

Denne testen gjenspeiler Masterdokumentets L-faser (L-KROPP → L-AUTO) og LIFE-rammeverket (SELV, SOS, EMO, KAR, RES). Coachen scorer spilleren basert på observasjon i turneringssituasjon og treningsøkt.

### 2.3 Treningsmengde (delvis i systemet)

Kilde: TrainingLog-modellen som allerede finnes.

| Datapunkt | Beskrivelse | Eksisterende modell |
|-----------|-------------|---------------------|
| Timer/uke | Gjennomsnittlig treningstid per uke siste 8 uker | TrainingLog.durationMinutes aggregert |
| Treningsfordeling | % per kategori (langspill, kortspill, putting, spill, fysisk) | TrainingLog.focusArea |
| Øktfrekvens | Antall økter per uke | TrainingLog count per uke |
| Planfølging | % av planlagte økter gjennomført | TrainingLog vs TrainingPlanSession |
| Treningseffektivitet | SG-forbedring per treningstime | UnifiedSkillIndex.trainingEfficiency |

---

## 3. Spillernivå — Composite Score

### 3.1 Eksisterende USI-score

Plattformen har allerede `totalUsi` som beregnes nattlig:

```
totalUsi = 0.20*sgOtt + 0.30*sgApp + 0.15*sgArg + 0.10*sgPutt
         + 0.15*biomechanical + 0.10*contextual
```

Der biomechanical = (ballSpeedScore + consistencyScore) / 2 og contextual = (pressureScore + trainingEfficiency + trendMomentum) / 3.

Denne scoren er god for intern tracking, men den er abstrakt. Spillere forstår den ikke.

### 3.2 Ny: Kartleggingsprofil (wrapper rundt USI)

Kartleggingsprofilen oversetter USI til noe spilleren forstår. Den beregner IKKE en ny score — den presenterer eksisterende data i kontekst.

**Primær visning: A-K-kategori med underkategorier**

Hver spiller får sin A-K-kategori (allerede beregnet i `estimatedCategory`), MEN vi viser også per-dimensjon-kategori:

| Dimensjon | Spillerens kategori | Benchmark for spillerens totalkategori |
|-----------|--------------------|-----------------------------------------|
| Langspill (OTT) | D | E |
| Innspill (APP) | F | E |
| Kortspill (ARG) | E | E |
| Putting | D | E |

I eksempelet over er spilleren totalt en E-spiller (snittscore 76-78), men har D-nivå (bedre enn forventet) på langspill og putting, og F-nivå (svakere) på innspill. Kortspill er på forventet nivå.

Beregning per dimensjon: Bruk eksisterende `sgToHandicapCategory()` per SG-dimensjon. Sammenlign med `SG_BENCHMARKS[totalCategory]` for å finne gap.

**Sekundær visning: Test-basert nivå**

For spillere med testresultater, vis percentil innenfor sin A-K-kategori og aldersgruppe. Hent fra `NorwegianSkillBenchmark.testResultsJson` og `*Percentiles`-feltene.

**Tertiær visning: Treningsindeks**

| Indikator | Verdi | Tolkning |
|-----------|-------|----------|
| Timer/uke | 4.2 | Under anbefalt for kategori E (12-15 timer sommer) |
| Planfølging | 78% | Akseptabelt (mål: 85%+) |
| Effektivitet | +0.12 SG/time/mnd | God (snitt for E: +0.08) |

### 3.3 Nivåer og kategorier — Autoritativt A-K-system

Kilde: AK Golf Academy Masterdokument v2.0 (april 2026), seksjon 2.1. Dette er det eneste gyldige kategorisystemet. Kategorisering er basert på **snittscore**, ikke handicap.

| Kat | Nivå | Snittscore | Alder | Beskrivelse | Typisk turneringsmiljø |
|-----|------|-----------|-------|-------------|----------------------|
| A | Verdenselite | < 68 | 18-22 | OWGR Topp 150. Viktor Hovland, Kristoffer Ventura. | PGA Tour, DP World Tour |
| B | Nasjonal elite | 68-72 | 17-20 | Team Norway, topp norske amatører | Norgescup, Srixon Tour Elite |
| C | Nasjonal U21 | 72-74 | 16-19 | Landslag U21, NTG-spillere | Srixon Tour, nasjonale mesterskap |
| D | Regional elite | 74-76 | 15-18 | VG2-VG3, sterke juniorer | Srixon Tour, Østlandstour Klasse A |
| E | Regional U18 | 76-78 | 14-17 | VG1-VG2 satsende spillere | Østlandstour, regionale mesterskap |
| F | Klubbspiller sr. | 78-80 | 15-17 | 10.kl-VG1, aktive klubbspillere | Olyo, Østlandstour Klasse B/C |
| G | Klubbspiller jr. | 80-85 | 14-16 | 9.-10.kl, jevnt aktive | Klubbturneringer, Olyo |
| H | Rekrutt senior | 85-90 | 13-15 | 8.-9.kl, i utvikling | Klubbturneringer, lav terskel |
| I | Rekrutt junior | 90-95 | 12-14 | 7.-8.kl, aktiv start | Introduksjon til turnering |
| J | Nybegynner sr. | 95-100 | 11-13 | Starter golf aktivt | Noen klubbturneringer |
| K | Nybegynner jr. | 100+ | 8-11 | Introduksjon til golf | Lekbaserte interne konkurranser |

**Viktig forskjell fra koden:** `SG_BENCHMARKS` og `SKILL_LEVELS` i kodebasen bruker i dag HCP-ranges (A = HCP 0-2, score 78). Masterdokumentet definerer A som snittscore < 68 (verdenselite). Koden MÅ oppdateres til å matche masterdokumentet. Se implementeringssteg 1.7 i seksjon 9.

**Kategoriprogresjon:** Spillere avanserer kun når treneren godkjenner opprykk. Opprykk krever minst 5 av 7 testkategorier bestått på neste nivå (20 offisielle tester, se seksjon 8.1). Spillere rykkes IKKE automatisk ned — kategori gjenspeiler høyeste oppnådde nivå.

**Treningsvolum per kategori (sommer):**

| Kat | Timer/uke sommer | Timer/uke vinter | Turneringsrunder/år |
|-----|-----------------|-----------------|-------------------|
| A | 30-35 | 20-25 | 25-30 |
| B | 25-30 | 18-22 | 25-30 |
| C | 20-25 | 15-18 | 30-35 |
| D | 15-20 | 12-15 | 25-30 |
| E | 12-15 | 10-12 | 20-25 |
| F | 10-12 | 8-10 | 15-20 |
| G | 8-10 | 6-8 | 10-15 |
| H | 6-8 | 4-6 | 8-12 |
| I | 4-6 | 3-4 | 6-10 |
| J | 3-4 | 2-3 | 4-8 |
| K | 2-3 | 1-2 | 2-4 |

Disse tallene brukes i treningsindeksen (seksjon 5.1, seksjon 4) for å vise anbefalt vs. faktisk treningsmengde.

---

## 4. «Du er her — dette mangler for neste nivå»

### 4.1 Gap-analyse

For hver spiller beregnes gapet til neste kategori. Eksempel for en E-spiller (snittscore 77.1) som vil bli D (snittscore 74-76):

```
NÅVÆRENDE NIVÅ: E — Regional U18 (snittscore 77.1)
MÅL: D — Regional elite (snittscore < 76)

GAP PER DIMENSJON:
                  Nå        Mål (D)    Gap      Prioritet
Langspill (OTT):  -0.6 SG   -0.5 SG   +0.1 SG   Lav (nesten der)
Innspill (APP):   -1.1 SG   -0.7 SG   +0.4 SG   HØY (størst gap)
Kortspill (ARG):  -0.4 SG   -0.3 SG   +0.1 SG   Lav
Putting:          -0.2 SG   -0.2 SG    0.0 SG   Ingen gap

KONKLUSJON: Innspill er flaskehalsen. 0.4 SG forbedring kreves.
Med nåværende treningseffektivitet (0.12 SG/time/mnd) og 12-15 timer/uke (anbefalt for E→D):
→ Estimert tid til mål: 3-4 måneder med fokus på innspill.
```

Beregning: Bruk `SG_BENCHMARKS[currentCategory]` vs `SG_BENCHMARKS[targetCategory]` per dimensjon. Prioriter dimensjonen med størst gap. Tidsestimat via `trainingEfficiency` fra USI. SG-benchmarks per kategori må rekalibreres til snittscore-basert system (se steg 1.7).

### 4.2 Anbefalinger

Basert på gap-analysen genereres konkrete anbefalinger:

1. **Største gap** → Primært treningsfokus (kobles til TrainingPrescription.focusAreas)
2. **Nesten der** → Vedlikeholdsfokus
3. **Allerede bedre enn mål** → Styrke å bygge videre på

Disse mates inn i eksisterende `TrainingPrescription.gapAnalysisJson` som allerede brukes av auto-justerings-CRON-jobben.

### 4.3 Benchmarks fra turneringsdata

Vi har 6117 turneringsresultater og 701 spillere. Fra denne dataen beregnes faktiske benchmarks:

| Metric | Slik beregnes det | Oppdateringsfrekvens |
|--------|-------------------|---------------------|
| Snitt-score per kategori | Median score for alle spillere i kategorien | Ukentlig CRON |
| Top 10% terskel | P90 score innenfor kategorien | Ukentlig CRON |
| Konsistens-benchmark | Median standardavvik per kategori | Ukentlig CRON |
| Turneringsfrekvens-benchmark | Median antall turneringer per kategori | Månedlig |
| Sesong-utvikling | Gjennomsnittlig snittscore-endring per sesong per kategori | Årlig |

Disse lagres i `NorwegianSkillBenchmark`-tabellen som allerede finnes, utvidet med turneringsspesifikke felter.

---

## 5. Dashboard-design

> **Designreferanse:** Alle tokens hentet fra `app/globals.css` (faktisk kildekode).
> Portal bruker Apple-grå palett (`--color-portal-*`), ikke markedssidems grønntonede farger.
> Markedsside bruker Alabaster/Forest/Lime-paletten.
> Kartlegging er en portal-side og følger portal-tokens konsekvent.

### 5.0 Design-tokens — hurtigreferanse for kartlegging

**Bakgrunn og flater:**

| Bruk | CSS-variabel | Verdi | Tailwind |
|------|-------------|-------|----------|
| Side-bakgrunn | `--color-portal-bg` | `#F5F5F7` | `bg-portal-bg` |
| Kort-bakgrunn | `--color-portal-card` | `#FFFFFF` | `bg-portal-card` |
| Hover-bakgrunn | `--color-portal-hover` | `#F0F0F2` | `bg-portal-hover` |

**Tekst:**

| Bruk | CSS-variabel | Verdi | Tailwind |
|------|-------------|-------|----------|
| Primærtekst | `--color-portal-text` | `#1D1D1F` | `text-portal-text` |
| Sekundærtekst | `--color-portal-secondary` | `#6E6E73` | `text-portal-secondary` |
| Muted/label | `--color-portal-muted` | `#AEAEB2` | `text-portal-muted` |
| On-surface (markedsside) | `--color-on-surface` | `#1c1c16` | `text-on-surface` |

**Brand-farger (aksenter i portalen):**

| Bruk | CSS-variabel | Verdi | Tailwind |
|------|-------------|-------|----------|
| Primær (CTA, lenker) | `--color-forest` | `#154212` | `bg-forest` / `text-forest` |
| Performance-lime | `--color-performance` | `#D1F843` | `bg-performance` |
| Performance-soft | `--color-performance-soft` | `rgba(209,248,67,0.16)` | `bg-performance-soft` |
| Data-sage (success) | `--color-data-sage` | `#2A7D5A` | `text-data-sage` |
| Data-coral (error/gap) | `--color-data-coral` | `#E85D4E` | `text-data-coral` |
| AI-lilla | `--color-ai` | `#AF52DE` | `bg-ai` |

**Borders og shadows:**

| Bruk | CSS-variabel | Tailwind |
|------|-------------|----------|
| Kort-border | `--color-portal-border` | `border-portal-border` |
| Subtil border | `--color-portal-border-subtle` | `border-portal-border-subtle` |
| Kort-shadow | `--shadow-portal-card` | `shadow-portal-card` |
| Kort-hover | `--shadow-portal-card-hover` | `shadow-portal-card-hover` |
| Grønn glow (stat) | `--shadow-portal-glow-green` | `shadow-portal-glow-green` |
| Lime glow (achievement) | `--shadow-portal-glow-lime` | `shadow-portal-glow-lime` |
| AI glow | `--shadow-portal-glow-ai` | `shadow-portal-glow-ai` |
| Ambient (data-kort) | `--shadow-ambient` | `shadow-ambient` |

**Typografi for tall/stats:**

| Bruk | CSS-variabel | Verdi |
|------|-------------|-------|
| Hero stat (kategori-bokstav) | `--text-stat-xl` | `56px` |
| Primær stat (SG-verdi) | `--text-stat-lg` | `44px` |
| Sekundær stat (HCP) | `--text-stat-md` | `32px` |
| Kompakt stat | `--text-stat-sm` | `24px` |
| Stat letter-spacing | `--tracking-stat` | `-0.02em` |
| Stat line-height | `--leading-stat` | `1` |
| Font-family stats | `--font-stats` | Inter (var) |

Alle stat-tall bruker `tabular-nums` for alignment og `font-extrabold` (800) for visuell tyngde.

**Radius:**

| Bruk | CSS-variabel | Verdi | Tailwind |
|------|-------------|-------|----------|
| Standard kort | `--radius-lg` | `16px` | `rounded-2xl` |
| Data-kort (premium) | `--radius-data-card` | `32px` | `rounded-[2rem]` |
| Knapper | `--radius-md` | `12px` | `rounded-xl` |
| Pills/badges | `--radius-full` | `9999px` | `rounded-full` |

**Motion:**

| Bruk | CSS-variabel | Verdi |
|------|-------------|-------|
| Standard hover | `--ease-apple` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Bounce (progress) | `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Normal duration | `--duration-normal` | `300ms` |
| Slow (page enter) | `--duration-slow` | `500ms` |

### 5.1 Spillervisning — «Min kartlegging»

Rute: `/portal/(dashboard)/kartlegging/`

Layout: Full-bredde side på `bg-portal-bg`. Fire seksjoner vertikalt med `gap-6` mellom dem. Container: `max-w-5xl mx-auto px-4 md:px-6`.

---

**Seksjon 1: Overordnet nivå (hero-kort)**

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│   DIN KATEGORI                                                │  ← text-[10px] font-semibold
│                                                               │     uppercase tracking-[0.08em]
│                E                                              │     text-portal-muted
│                                                               │
│          Snittscore 77.1                                      │  ← text-stat-xl (56px)
│                                                               │     font-extrabold tracking-stat
│   ████████████████████░░░░░░░░  68% til D                     │     text-portal-text tabular-nums
│                                                               │
│   Regional U18 · Østlandstour · Olyo                          │  ← text-stat-md (32px)
│                                                               │     text-portal-secondary
└─────────────────────────────────────────────────────────────┘     tracking-heading (-0.025em)

                                                                  ← text-sm text-portal-muted

                                                                  ← Progress: track bg-portal-hover
                                                                    fill bg-forest rounded-full h-2
                                                                    Glow: shadow-portal-glow-green

                                                                  ← text-xs text-portal-secondary
```

Komponent: `PlayerLevelHero`

```tsx
// Kort-container
<div className="
  bg-portal-card rounded-[2rem] p-8 text-center
  shadow-portal-card
  transition-shadow duration-300 ease-[var(--ease-apple)]
  hover:shadow-portal-card-hover
">
  {/* Micro-label */}
  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
    Din kategori
  </span>

  {/* Kategori-bokstav — bruker SKILL_LEVELS fargekoding */}
  <div className="mt-2" style={{ fontSize: 'var(--text-stat-xl)', lineHeight: 'var(--leading-stat)', letterSpacing: 'var(--tracking-stat)' }}>
    <span className="font-extrabold tabular-nums" style={{ color: skillLevelColor }}>
      {category}
    </span>
  </div>

  {/* Snittscore (primær) + HCP (sekundær) */}
  <p className="mt-1" style={{ fontSize: 'var(--text-stat-md)', letterSpacing: 'var(--tracking-heading)' }}>
    <span className="font-bold text-portal-text tabular-nums">Snittscore {averageScore}</span>
  </p>
  <p className="mt-0.5 text-sm text-portal-muted tabular-nums">
    HCP {handicap}
  </p>

  {/* Progress bar */}
  <div className="mt-6 mx-auto max-w-sm">
    <div className="h-2 rounded-full bg-portal-hover overflow-hidden">
      <div
        className="h-full rounded-full bg-forest shadow-portal-glow-green transition-all duration-700 ease-[var(--ease-spring)]"
        style={{ width: `${progressPct}%` }}
      />
    </div>
    <p className="mt-2 text-xs text-portal-secondary">
      {progressPct}% til {targetCategory}
    </p>
  </div>

  {/* Turneringsklasse */}
  <p className="mt-3 text-sm text-portal-muted">
    {tournamentClasses}
  </p>
</div>
```

---

**Seksjon 2: Dimensjons-breakdown (4 kort i grid)**

Grid: `grid grid-cols-2 lg:grid-cols-4 gap-4`

Hvert kort:

```
┌──────────────────┐
│ LANGSPILL         │  ← text-[10px] font-semibold uppercase
│                   │     tracking-[0.08em] text-portal-muted
│       D           │  ← text-stat-lg (44px) font-extrabold
│                   │     Farge fra SKILL_LEVELS
│    -0.6 SG        │  ← text-sm tabular-nums text-portal-secondary
│                   │
│   ↑ Styrke        │  ← Badge: bg-data-sage-light text-data-sage
│                   │     eller bg-data-coral-light text-data-coral
└──────────────────┘     rounded-full px-2.5 py-0.5 text-[11px]
```

Komponent: `DimensionCard`

```tsx
<div className="
  bg-portal-card rounded-2xl p-5 text-center
  shadow-portal-glow-green
  border border-portal-border-subtle
  transition-all duration-300 ease-[var(--ease-apple)]
  hover:-translate-y-px hover:shadow-portal-card-hover
">
  {/* Micro-label */}
  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
    {dimensionLabel}
  </span>

  {/* Kategori-bokstav */}
  <div className="mt-2" style={{ fontSize: 'var(--text-stat-lg)', lineHeight: 1, letterSpacing: '-0.02em' }}>
    <span className="font-extrabold tabular-nums" style={{ color: skillLevelColor }}>
      {dimCategory}
    </span>
  </div>

  {/* SG-verdi */}
  <p className="mt-1 text-sm tabular-nums text-portal-secondary">
    {sgValue} SG
  </p>

  {/* Gap-badge */}
  <div className="mt-3">
    {gap === 'styrke' && (
      <span className="inline-flex items-center rounded-full bg-data-sage-light px-2.5 py-0.5 text-[11px] font-medium text-data-sage">
        Styrke
      </span>
    )}
    {gap === 'gap' && (
      <span className="inline-flex items-center rounded-full bg-data-coral-light px-2.5 py-0.5 text-[11px] font-medium text-data-coral">
        Gap
      </span>
    )}
    {gap === 'level' && (
      <span className="inline-flex items-center rounded-full bg-portal-hover px-2.5 py-0.5 text-[11px] font-medium text-portal-secondary">
        Pa niva
      </span>
    )}
  </div>
</div>
```

---

**Seksjon 3: Gap-analyse til neste niva**

Kort med `rounded-[2rem]` (data-card radius). Horisontale barer.

```
┌─────────────────────────────────────────────────────────────┐
│  VEIEN TIL D                                                 │
│                                                               │
│  Innspill     ████████████████░░░░░░  +0.4 SG    Flaskehals  │
│  Langspill    ██████████████████░░░░  +0.1 SG    Nesten der  │
│  Kortspill    ██████████████████░░░░  +0.1 SG    Nesten der  │
│  Putting      ████████████████████░░  0.0 SG     Ingen gap   │
│                                                               │
│  Estimert tid: 3-4 maneder                                    │
│  Forutsetning: 6 timer/uke med fokus pa innspill              │
└─────────────────────────────────────────────────────────────┘
```

Styling per bar-rad:

```tsx
{/* Dimensjons-label */}
<span className="w-24 text-sm font-medium text-portal-text">
  {label}
</span>

{/* Bar-track */}
<div className="flex-1 h-[5px] rounded-full bg-portal-hover">
  <div
    className="h-full rounded-full transition-all duration-700 ease-[var(--ease-spring)]"
    style={{
      width: `${fillPct}%`,
      background: isBottleneck
        ? 'var(--color-data-coral)'
        : 'var(--color-data-sage)'
    }}
  />
</div>

{/* Gap-verdi */}
<span className={`w-20 text-right text-sm font-semibold tabular-nums ${
  isBottleneck ? 'text-data-coral' : 'text-data-sage'
}`}>
  {gapValue} SG
</span>

{/* Status-tekst */}
<span className="w-24 text-right text-[11px] text-portal-muted">
  {statusLabel}
</span>
```

Estimert tid vises under barene:

```tsx
<div className="mt-6 pt-4 border-t border-portal-border-subtle">
  <p className="text-sm text-portal-secondary">
    Estimert tid: <span className="font-semibold text-portal-text">{timeEstimate}</span>
  </p>
  <p className="mt-1 text-xs text-portal-muted">
    Forutsetning: {assumption}
  </p>
</div>
```

Hele kortet:

```tsx
<div className="
  bg-portal-card rounded-[2rem] p-6 md:p-8
  shadow-portal-card
  border border-portal-border-subtle
">
```

---

**Seksjon 4: Treningsindeks + testresultater (2-kolonne grid)**

Grid: `grid grid-cols-1 md:grid-cols-2 gap-4`

Hvert kort bruker standard portal-kort:

```tsx
<div className="
  bg-portal-card rounded-2xl p-5
  shadow-portal-card
  border border-portal-border-subtle
">
```

Interne stat-rader:

```tsx
{/* Stat-rad */}
<div className="flex items-center justify-between py-2.5 border-b border-portal-border-subtle last:border-0">
  <span className="text-sm text-portal-secondary">{label}</span>
  <span className="text-sm font-semibold tabular-nums text-portal-text">{value}</span>
</div>
```

Percentil-badge (i test-kortet):

```tsx
<span className="
  inline-flex items-center rounded-full px-2 py-0.5
  text-[11px] font-medium tabular-nums
  bg-performance-soft text-forest
">
  P{percentile}
</span>
```

CTA-lenke nederst i kort:

```tsx
<a className="
  mt-4 inline-flex items-center gap-1.5
  text-sm font-medium text-forest
  hover:opacity-80 transition-opacity duration-200
">
  Se treningsplan
  <ChevronRight className="w-4 h-4" />
</a>
```

### 5.2 Coach-visning — «Mine spillere» i Mission Control

Rute: `/portal/admin/kartlegging/`

Tilgjengelig for: ADMIN og INSTRUCTOR (via eksisterende `canAccessMCPage()`).

Mission Control bruker HG-tokens (Heritage Grid) for admin-sider:

| Bruk | CSS-variabel | Verdi |
|------|-------------|-------|
| Bakgrunn | `--hg-bg` | `#F5F8F7` |
| Kort/surface | `--hg-surface` | `#FFFFFF` |
| Primartekst | `--hg-text` | `#0A1F18` |
| Sekundartekst | `--hg-text-secondary` | `#324D45` |
| Muted tekst | `--hg-text-muted` | `#7A8C85` |
| Border | `--hg-border` | `#D5DFDB` |
| Subtil border | `--hg-border-subtle` | `#ECF0EF` |

---

**Oversikt: Spillerliste med kartleggingsstatus**

Tabell-layout (MC bruker tabeller for data-tunge views, i motsetning til portalen som bruker kort):

```tsx
<div className="bg-[var(--hg-surface)] rounded-xl border border-[var(--hg-border-subtle)] overflow-hidden">
  {/* Header */}
  <div className="px-6 py-4 border-b border-[var(--hg-border-subtle)] flex items-center justify-between">
    <h2 className="text-lg font-semibold text-[var(--hg-text)]" style={{ letterSpacing: 'var(--tracking-heading)' }}>
      Spillerkartlegging
    </h2>
    <div className="flex gap-2">
      {/* Filter-pills */}
      <div className="flex gap-1.5 rounded-[10px] bg-[var(--hg-surface-raised)] p-[3px]">
        <button className="rounded-[7px] bg-forest px-3 py-1.5 text-[13px] font-medium text-white">
          Alle
        </button>
        <button className="rounded-[7px] px-3 py-1.5 text-[13px] font-medium text-[var(--hg-text-muted)] hover:text-[var(--hg-text-secondary)]">
          A-D
        </button>
        <button className="rounded-[7px] px-3 py-1.5 text-[13px] font-medium text-[var(--hg-text-muted)]">
          E-H
        </button>
      </div>
    </div>
  </div>

  {/* Tabell */}
  <table className="w-full">
    <thead>
      <tr className="border-b border-[var(--hg-border-subtle)]">
        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
          Spiller
        </th>
        {/* ... flere kolonner */}
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-[var(--hg-border-subtle)] hover:bg-[var(--hg-surface-raised)] transition-colors duration-150 cursor-pointer">
        <td className="px-6 py-3">
          <span className="text-sm font-medium text-[var(--hg-text)]">{name}</span>
        </td>
        <td className="px-6 py-3">
          <span className="text-sm font-bold tabular-nums" style={{ color: skillLevelColor }}>
            {category}
          </span>
        </td>
        <td className="px-6 py-3">
          <span className="text-sm tabular-nums text-[var(--hg-text-secondary)]">{avgScore}</span>
        </td>
        <td className="px-6 py-3">
          {/* Trend-indikator */}
          <span className={`text-sm font-medium tabular-nums ${
            trend > 0 ? 'text-data-sage' : trend < 0 ? 'text-data-coral' : 'text-[var(--hg-text-muted)]'
          }`}>
            {trend > 0 ? '+' : ''}{trend}
          </span>
        </td>
        <td className="px-6 py-3">
          <span className="text-sm text-data-coral font-medium">{gapPriority}</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

**Spillerdetalj i MC: Samme som spillervisning, men med coach-verktoy**

Ekstra for coach — knappegruppe oppe i kortet:

```tsx
<div className="flex gap-3">
  {/* Primer knapp */}
  <button className="
    inline-flex items-center gap-2 px-4 py-2.5
    rounded-xl bg-forest text-white text-sm font-medium
    hover:opacity-90 transition-opacity duration-200
  ">
    <ClipboardCheck className="w-4 h-4" />
    Registrer testresultat
  </button>

  {/* Sekundar knapp */}
  <button className="
    inline-flex items-center gap-2 px-4 py-2.5
    rounded-xl border border-[var(--hg-border)] text-sm font-medium text-[var(--hg-text-secondary)]
    hover:bg-[var(--hg-surface-raised)] transition-colors duration-200
  ">
    <Brain className="w-4 h-4" />
    Generer treningsplan
  </button>
</div>
```

---

**Gruppeoversikt: Kategori-fordeling**

Horisontalt stolpediagram i MC:

```tsx
<div className="bg-[var(--hg-surface)] rounded-xl border border-[var(--hg-border-subtle)] p-6">
  <h3 className="text-sm font-semibold text-[var(--hg-text)]" style={{ letterSpacing: 'var(--tracking-heading)' }}>
    Fordeling mine spillere
  </h3>

  <div className="mt-4 space-y-2">
    {categories.map(({ letter, count, maxCount }) => (
      <div key={letter} className="flex items-center gap-3">
        <span className="w-4 text-xs font-bold tabular-nums" style={{ color: skillLevelColor(letter) }}>
          {letter}
        </span>
        <div className="flex-1 h-[5px] rounded-full bg-[var(--hg-surface-raised)]">
          <div
            className="h-full rounded-full bg-forest transition-all duration-700 ease-[var(--ease-spring)]"
            style={{ width: `${(count / maxCount) * 100}%` }}
          />
        </div>
        <span className="w-8 text-right text-xs tabular-nums text-[var(--hg-text-muted)]">
          {count}
        </span>
      </div>
    ))}
  </div>

  <p className="mt-4 text-xs text-[var(--hg-text-muted)]">
    Totalt: {totalPlayers} spillere
  </p>
</div>
```

---

## 6. Tilgangskontroll og multi-coach-deling

### 6.1 Eksisterende rolle-system

Plattformen har allerede fire roller: ADMIN, INSTRUCTOR, STUDENT, INVITED. RBAC er implementert i `lib/portal/rbac.ts`. Instructor-modellen kobler en bruker til coaching-funksjoner via `Instructor.userId`.

### 6.2 Coach-til-spiller-kobling

Booking-systemet kobler allerede spillere til instruktører via `Booking.instructorId`. For kartlegging trenger vi en eksplisitt coach-spiller-relasjon som er uavhengig av enkeltbookinger.

**Ny modell: CoachPlayerRelation**

```prisma
model CoachPlayerRelation {
  id            String   @id @default(cuid())
  coachUserId   String
  playerUserId  String
  status        CoachPlayerStatus @default(ACTIVE)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  Coach         User     @relation("CoachRelations", fields: [coachUserId], references: [id])
  Player        User     @relation("PlayerRelations", fields: [playerUserId], references: [id])

  @@unique([coachUserId, playerUserId])
  @@index([coachUserId])
  @@index([playerUserId])
}

enum CoachPlayerStatus {
  ACTIVE
  PAUSED
  ENDED
}
```

### 6.3 Hvem ser hva

| Rolle | Ser | Tilgang til |
|-------|-----|-------------|
| STUDENT | Kun sin egen kartlegging | Les egen profil, testresultater, gap-analyse |
| INSTRUCTOR | Sine egne spillere (via CoachPlayerRelation) | Les/skriv testresultater for sine spillere, generere planer |
| ADMIN | Alle spillere | Alt. Kan tildele spillere til coaches |
| INVITED | Begrenset MC-tilgang | Se oversikt, ikke endre data |

Implementering: Utvid `canAccessMCPage()` med ny side `kartlegging`. Legg til server-side sjekk i kartlegging-actions:

```typescript
// I actions.ts for kartlegging
async function getMyPlayers(coachUserId: string) {
  return prisma.coachPlayerRelation.findMany({
    where: { coachUserId, status: 'ACTIVE' },
    include: { Player: { include: { UnifiedSkillIndex: true } } }
  });
}

async function canViewPlayer(viewerUserId: string, playerUserId: string) {
  if (viewerUserId === playerUserId) return true; // Spiller ser seg selv
  const user = await getUser(viewerUserId);
  if (user.role === 'ADMIN') return true;
  const relation = await prisma.coachPlayerRelation.findUnique({
    where: { coachUserId_playerUserId: { coachUserId: viewerUserId, playerUserId } }
  });
  return relation?.status === 'ACTIVE';
}
```

### 6.4 Hvordan Anders deler tilgang med kollegaer

**Enkleste løsning: Invitasjonslenke**

1. Anders (ADMIN) går til Mission Control → Innstillinger → Team
2. Klikker «Inviter coach»
3. Fyller inn e-post og rolle (INSTRUCTOR eller INVITED)
4. Systemet sender en magic link via Supabase Auth
5. Kollegaen klikker lenken, setter passord, får INSTRUCTOR-rolle
6. Anders tildeler spillere til den nye coachen i MC → Kartlegging → Tilordne coach

**Implementering:**

Ny side: `/portal/admin/team/` med invitasjons-skjema. Bruker eksisterende Supabase `auth.admin.inviteUserByEmail()` (allerede tilgjengelig via admin-API). Etter opprettelse settes `User.role = INSTRUCTOR` og det opprettes en `Instructor`-rad.

**Alternativ for rask onboarding:** Admin kan også opprette brukere direkte og sende innloggingsinfo manuelt. Eksisterende `set-password`-flyt i `/auth/set-password` håndterer dette.

### 6.5 Spiller-samtykke for deling

Når en coach tildeles en spiller, sender systemet en notifikasjon til spilleren: «Coach [navn] har fått tilgang til din kartlegging.» Spilleren kan se hvilke coaches som har tilgang under Profil → Personvern.

---

## 7. GDPR og personvern

### 7.1 Datakategorier

| Datakilde | Type | GDPR-grunnlag |
|-----------|------|---------------|
| Turneringsresultater | Publisert data | Berettiget interesse (allerede offentlig) |
| Testresultater | Persondata | Samtykke (eksplisitt ved første test) |
| Treningslogger | Persondata | Avtale (del av coaching-tjenesten) |
| USI-score/kategori | Avledet persondata | Samtykke + avtale |

### 7.2 Samtykke-flyt

Ved første gang en spiller åpner kartlegging-siden, vises et samtykke-skjema:

```
Vi samler inn og analyserer data for å gi deg bedre coaching:
☐ Testresultater fra TrackMan og manuelle tester
☐ Treningslogg og aktivitet
☐ Beregnet spillernivå og kategori
☐ Deling av kartlegging med min coach

[Godkjenn] [Les mer om personvern]
```

Lagres i ny kolonne `User.dataConsentAt: DateTime?` og `User.dataConsentScope: Json?`.

### 7.3 Rettigheter

- **Innsyn:** Spilleren ser all sin data i portalen
- **Sletting:** «Slett mine testresultater» under Profil → Personvern. Sletter TestResult-rader, nullstiller test-relaterte USI-dimensjoner
- **Dataportabilitet:** «Eksporter mine data» genererer JSON/CSV med alle datapunkter
- **Trekke samtykke:** Deaktiverer datainnsamling, skjuler kartlegging-side

---

## 8. Ny datamodell: TestResult

```prisma
model TestResult {
  id              String       @id @default(cuid())
  userId          String
  testType        TestType
  testCategory    TestCategory
  value           Float        // Primærverdi (make%, avstand, hastighet, etc.)
  unit            String       // "percent", "meter", "mph", "seconds", "points"
  rawData         Json?        // Detaljert data per forsøk
  notes           String?
  conductedBy     String?      // Coach userId som gjennomførte testen
  conductedAt     DateTime
  environment     String?      // "indoor", "outdoor", "simulator"
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  User            User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, testType])
  @@index([userId, conductedAt])
  @@index([conductedBy])
}

enum TestType {
  // TrackMan
  DRIVER_BALL_SPEED
  DRIVER_CARRY
  DRIVER_DISPERSION
  IRON_CARRY
  IRON_DISPERSION
  WEDGE_DISTANCE_CONTROL
  SMASH_FACTOR
  // Kortspill
  UP_AND_DOWN_10
  BUNKER_5
  PITCH_PRECISION
  FLOP_CONTROL
  // Putting
  PUTTING_1M
  PUTTING_3M
  PUTTING_6M
  LAG_PUTTING_10M
  GREEN_READING
  // Fysisk
  ROTATION_MOBILITY
  BALANCE
  EXPLOSIVENESS
  // Mental
  PRESSURE_COGNITIVE
}

enum TestCategory {
  TRACKMAN
  SHORT_GAME
  PUTTING
  PHYSICAL
  MENTAL
}
```

### 8.1 Benchmark-tabell for tester

Ny tabell som utvider `NorwegianSkillBenchmark` med testresultat-percentiler:

```prisma
model TestBenchmark {
  id            String       @id @default(cuid())
  testType      TestType
  category      String       // A-K
  ageGroup      String?      // U14, U16, U18, Senior, etc.
  gender        String?      // MALE, FEMALE
  p10           Float
  p25           Float
  p50           Float        // Median
  p75           Float
  p90           Float
  sampleSize    Int
  dataAsOf      DateTime
  updatedAt     DateTime     @updatedAt

  @@unique([testType, category, ageGroup, gender])
}
```

Initialt fylles denne med benchmarks fra Masterdokument v2.0 seksjon 16. Masterdokumentet definerer 20 offisielle tester fordelt på 7 kategorier med konkrete benchmark-verdier per kategorigruppe (A-C, D-E, F-G, H-I, J-K). Etter hvert som testdata samles inn i appen, oppdateres med faktiske tall.

### 8.2 Offisielle tester fra Masterdokument v2.0

Masterdokumentet definerer 20 tester i 7 kategorier. Disse mapper til `TestType`-enum slik:

| # | Masterdokument-test | TestType-enum | Kategori | Måleenhet |
|---|---------------------|---------------|----------|-----------|
| 1 | Driver ballhastighet | DRIVER_BALL_SPEED | TRACKMAN | mph |
| 2 | Driver carry | DRIVER_CARRY | TRACKMAN | meter |
| 3 | Driver spredning | DRIVER_DISPERSION | TRACKMAN | meter |
| 4 | 7-jern carry | IRON_CARRY | TRACKMAN | meter |
| 5 | 7-jern spredning | IRON_DISPERSION | TRACKMAN | meter |
| 6 | Wedge avstandskontroll | WEDGE_DISTANCE_CONTROL | TRACKMAN | prosent |
| 7 | Smash factor | SMASH_FACTOR | TRACKMAN | ratio |
| 8 | Up-and-down 10-punkt | UP_AND_DOWN_10 | SHORT_GAME | poeng/20 |
| 9 | Bunkertest 5-punkt | BUNKER_5 | SHORT_GAME | meter |
| 10 | Pitch presisjon | PITCH_PRECISION | SHORT_GAME | meter |
| 11 | Flop/lob kontroll | FLOP_CONTROL | SHORT_GAME | antall/5 |
| 12 | Putting 1m | PUTTING_1M | PUTTING | prosent |
| 13 | Putting 3m | PUTTING_3M | PUTTING | prosent |
| 14 | Putting 6m | PUTTING_6M | PUTTING | prosent |
| 15 | Fartskontroll 10m | LAG_PUTTING_10M | PUTTING | cm |
| 16 | Grønlesing | GREEN_READING | PUTTING | poeng/5 |
| 17 | Rotasjonsmobilitet | ROTATION_MOBILITY | PHYSICAL | grader |
| 18 | Balanse | BALANCE | PHYSICAL | sekunder |
| 19 | Eksplosivitet | EXPLOSIVENESS | PHYSICAL | meter |
| 20 | Kognitivt under press | PRESSURE_COGNITIVE | MENTAL | poeng |

Merk: Test 20 (PRESSURE_COGNITIVE) er lagt til i TestType-enum basert på Masterdokumentets L-faser og mental trening. Testet via standardisert scenariobasert vurdering.

### 8.3 Kategoriopprykk via tester

Masterdokumentet krever at minst **5 av 7 testkategorier** bestås på neste nivå for opprykk. Coachen godkjenner manuelt. Systemet flagger spillere som oppfyller kriteriene:

```
OPPRYKKSSJEKK: Erik Hansen (E → D)
✅ TrackMan (5/7 tester på D-nivå)
✅ Kortspill (3/4 tester på D-nivå)
✅ Putting (4/5 tester på D-nivå)
✅ Fysisk (2/3 tester på D-nivå)
❌ Mental (0/1 tester på D-nivå)
✅ Snittscore i range (75.8 < 76)
✅ Turneringsfrekvens OK (22 runder/år, krav: 20-25)

Resultat: 5/7 kategorier bestått → KLAR FOR OPPRYKK
Venter på coach-godkjenning.
```

---

## 9. Implementeringsplan

### Fase 1: Database og grunnlag (2-3 dager)

| Steg | Hva | Kompleksitet | Avhengighet |
|------|-----|-------------|-------------|
| 1.1 | Opprett `TestResult`-modell i Prisma schema | Lav | Ingen |
| 1.2 | Opprett `TestBenchmark`-modell | Lav | 1.1 |
| 1.3 | Opprett `CoachPlayerRelation`-modell | Lav | Ingen |
| 1.4 | Legg til `dataConsentAt` og `dataConsentScope` på User | Lav | Ingen |
| 1.5 | Kjør `prisma migrate dev` | Lav | 1.1-1.4 |
| 1.6 | Seed TestBenchmark med initielle verdier basert på SG_BENCHMARKS | Medium | 1.2, 1.5 |
| 1.7 | Rekalibrere SG_BENCHMARKS og SKILL_LEVELS til snittscore-basert system (Masterdokument v2.0) | Høy | Ingen |
| 1.8 | Oppdater sgToHandicapCategory() til sgToScoreCategory() i sg-to-handicap.ts | Medium | 1.7 |
| 1.9 | Oppdater compute-usi.ts: estimatedCategory basert på snittscore, ikke HCP | Medium | 1.7, 1.8 |

**Steg 1.7 i detalj — Rekalibrering til Masterdokument v2.0:**

`sg-benchmarks.ts` og `skill-levels.ts` bruker i dag HCP-ranges (A = HCP 0-2, score 78). Masterdokumentet definerer A som snittscore < 68 (Hovland-nivå). Hele A-K-skalaen må oppdateres:

1. Endre `handicapRange` i `SG_BENCHMARKS` til `scoreRange` basert på snittscore (A: [0, 68], B: [68, 72], C: [72, 74], ... K: [100, 150])
2. Rekalibrere SG-verdier per kategori. Nåværende verdier (A total: -0.3) er for en HCP 0-2 spiller. En snittscore < 68 spiller (tour-pro) har SG total rundt +3.0 til +5.0. Bruk PGA Tour/DP World Tour gjennomsnitt som referanse for A-B, norsk amatørdata for C-K.
3. Endre `SKILL_LEVELS` tilsvarende: erstatt `handicapRange` med `scoreRange`, oppdater `description` til snittscore-range.
4. Legg til `tournamentContext: string` per kategori (f.eks. "PGA Tour, DP World Tour" for A, "Srixon Tour Elite" for B-C, etc.)
5. Legg til `trainingVolumeSummer: [number, number]` og `trainingVolumeWinter: [number, number]` per kategori fra Masterdokument-tabellen.
6. Oppdater alle imports og bruksområder av `getBenchmarkByHandicap()` til ny `getBenchmarkByScore()`.

**Leveranse:** Database klar. Kategori-system oppdatert. Ingen UI ennå.

### Fase 2: Beregningslogikk (2-3 dager)

| Steg | Hva | Kompleksitet | Avhengighet |
|------|-----|-------------|-------------|
| 2.1 | `getPlayerProfile()` — henter USI + beregner per-dimensjon-kategori | Medium | Fase 1 |
| 2.2 | `getGapAnalysis(userId, targetCategory)` — beregner gap per dimensjon og estimert tid | Medium | 2.1 |
| 2.3 | `getTrainingIndex(userId)` — aggregerer treningsdata siste 8 uker | Medium | Fase 1 |
| 2.4 | `getTestHistory(userId)` — henter testresultater med percentil-beregning | Medium | 1.6 |
| 2.5 | `getPlayerSummaryForCoach(coachUserId)` — liste over alle spillere med nøkkeltall | Medium | 2.1, 1.3 |
| 2.6 | `canViewPlayer()` — tilgangssjekk coach→spiller | Lav | 1.3 |
| 2.7 | `recordTestResult()` — server action for å registrere testresultat | Lav | Fase 1 |

**Leveranse:** All forretningslogikk klar. Kan testes med seed-data.

### Fase 3: Spillervisning — «Min kartlegging» (3-4 dager)

| Steg | Hva | Kompleksitet | Avhengighet |
|------|-----|-------------|-------------|
| 3.1 | Samtykke-dialog (`DataConsentDialog`) | Lav | 1.4 |
| 3.2 | `PlayerLevelHero` — kategori-bokstav, HCP, progress-bar, turneringsklasse | Medium | 2.1 |
| 3.3 | `DimensionBreakdownGrid` — 4 SG-kort med kategori og gap-indikator | Medium | 2.1 |
| 3.4 | `GapAnalysisCard` — barer med gap per dimensjon, tidsestimat | Medium | 2.2 |
| 3.5 | `TrainingIndexCard` — timer/uke, planfølging, effektivitet | Medium | 2.3 |
| 3.6 | `TestResultsSummaryCard` — siste tester med percentil | Medium | 2.4 |
| 3.7 | Sideoppsett `/portal/(dashboard)/kartlegging/page.tsx` | Medium | 3.1-3.6 |
| 3.8 | Legg til «Kartlegging» i portal sidebar | Lav | 3.7 |

**Leveranse:** Spillere kan se sin kartlegging i portalen.

### Fase 4: Coach-visning i Mission Control (3-4 dager)

| Steg | Hva | Kompleksitet | Avhengighet |
|------|-----|-------------|-------------|
| 4.1 | `CoachPlayerList` — tabell med spillere, kategori, trend, gap | Medium | 2.5 |
| 4.2 | Filter-pills (kategori, trend, aldersgruppe) | Lav | 4.1 |
| 4.3 | Spillerdetalj — gjenbruk spillervisning med coach-verktøy | Medium | Fase 3 |
| 4.4 | `TestRegistrationForm` — skjema for å registrere testresultat | Medium | 2.7 |
| 4.5 | `CategoryDistributionChart` — stolpediagram kategori-fordeling | Lav | 2.5 |
| 4.6 | `PlayerComparisonView` — velg 2-3 spillere, vis side om side | Høy | 2.1 |
| 4.7 | Sideoppsett `/portal/admin/kartlegging/page.tsx` + MC sidebar-lenke | Medium | 4.1-4.5 |
| 4.8 | Oppdater `canAccessMCPage()` med «kartlegging» | Lav | 4.7 |

**Leveranse:** Coacher kan se, filtrere og registrere data for sine spillere.

### Fase 5: Multi-coach og deling (2-3 dager)

| Steg | Hva | Kompleksitet | Avhengighet |
|------|-----|-------------|-------------|
| 5.1 | `CoachInviteForm` — inviter coach via e-post | Medium | 1.3 |
| 5.2 | `AssignPlayerToCoach` — tildel spiller til coach | Lav | 1.3 |
| 5.3 | Team-side `/portal/admin/team/` | Medium | 5.1, 5.2 |
| 5.4 | Spiller-notifikasjon ved coach-tildeling | Lav | 5.2 |
| 5.5 | Personvern-side for spiller: se coaches, trekke samtykke | Medium | 1.3, 1.4 |

**Leveranse:** Andre coacher kan inviteres og se sine spillere.

### Fase 6: Turneringsdata-kobling (1-2 dager)

| Steg | Hva | Kompleksitet | Avhengighet |
|------|-----|-------------|-------------|
| 6.1 | Beregn turneringsbenchmarks fra eksisterende 6117 resultater | Medium | Fase 1 |
| 6.2 | Ukentlig CRON for oppdatering av turneringsbenchmarks | Lav | 6.1 |
| 6.3 | Koble spillerprofiler til turneringsresultater (match på navn/klubb) | Høy | 6.1 |

**Leveranse:** Faktiske benchmarks fra norsk turneringsdata.

### Fase 7: Kvalitetssikring (1-2 dager)

| Steg | Hva | Kompleksitet | Avhengighet |
|------|-----|-------------|-------------|
| 7.1 | E2E-tester for spillervisning og coach-visning | Medium | Fase 3, 4 |
| 7.2 | Tilgangstest: coach ser kun egne spillere | Lav | Fase 5 |
| 7.3 | GDPR-test: sletting av data, eksport, samtykke-tilbaketrekking | Medium | Fase 3, 5 |
| 7.4 | Visuell gjennomgang mot design-system tokens | Lav | Fase 3, 4 |

**Leveranse:** Produksjonsklar modul.

### Totalt estimat

| Fase | Dager | Hva |
|------|-------|-----|
| 1 | 3-4 | Database + rekalibrering |
| 2 | 2-3 | Logikk |
| 3 | 3-4 | Spillervisning |
| 4 | 3-4 | Coach-visning |
| 5 | 2-3 | Multi-coach |
| 6 | 1-2 | Turneringsdata |
| 7 | 1-2 | QA |
| **Totalt** | **15-23** | **Claude Code-dager** |

Med en halvdags-økt per dag (ettermiddag) er dette 3-5 uker kalenderrealistisk. Fase 1-3 kan lanseres som MVP etter ca. 2 uker — spillere ser sin kartlegging. Fase 4-5 legger til coach-funksjonalitet i uke 3-4.

---

## 10. Tekniske detaljer

### Filstruktur (nye filer)

```
app/portal/(dashboard)/kartlegging/
├── page.tsx                    # Server component, requirePortalUser()
├── kartlegging-client.tsx      # Klient-container
├── actions.ts                  # Server actions
└── components/
    ├── player-level-hero.tsx
    ├── dimension-breakdown-grid.tsx
    ├── gap-analysis-card.tsx
    ├── training-index-card.tsx
    ├── test-results-summary.tsx
    └── data-consent-dialog.tsx

app/portal/(dashboard)/admin/kartlegging/
├── page.tsx
├── kartlegging-admin-client.tsx
├── actions.ts
└── components/
    ├── coach-player-list.tsx
    ├── test-registration-form.tsx
    ├── category-distribution-chart.tsx
    └── player-comparison-view.tsx

app/portal/(dashboard)/admin/team/
├── page.tsx
├── actions.ts
└── components/
    ├── coach-invite-form.tsx
    └── assign-player-coach.tsx

lib/portal/kartlegging/
├── player-profile.ts           # getPlayerProfile(), getGapAnalysis()
├── training-index.ts           # getTrainingIndex()
├── test-results.ts             # getTestHistory(), recordTestResult()
├── coach-access.ts             # canViewPlayer(), getMyPlayers()
└── tournament-benchmarks.ts    # beregn benchmarks fra turneringsdata

prisma/migrations/YYYYMMDD_kartlegging/
└── migration.sql               # TestResult, TestBenchmark, CoachPlayerRelation, User-felter
```

### Maks 300 linjer per fil

Alle nye komponenter følger prosjektets regel om maks 300 linjer. Komplekse komponenter splittes i sub-komponenter.

### Design tokens

Alle nye portal-komponenter bruker tokens fra `app/globals.css`:

**Spillervisning (portal):** `bg-portal-bg` bakgrunn, `bg-portal-card` kort, `text-portal-text` primærtekst, `text-portal-secondary` sekundær, `text-portal-muted` labels. Kort: `shadow-portal-card`, hover: `shadow-portal-card-hover`. Stat-kort bruker `shadow-portal-glow-green`. Radius: `rounded-[2rem]` for hero/data-kort, `rounded-2xl` for standard kort.

**Coach-visning (MC):** `--hg-bg` bakgrunn, `--hg-surface` kort, `--hg-text` primærtekst, `--hg-text-secondary` sekundær, `--hg-text-muted` labels. Border: `--hg-border-subtle`. Filter-pills bruker `bg-forest text-white` for aktiv.

**Aksenter:** `bg-forest` (#154212) for CTA-knapper og primærhandlinger. `bg-performance` (#D1F843) for achievement/lime-glow. `text-data-sage` (#2A7D5A) for positive verdier. `text-data-coral` (#E85D4E) for gap/negative. `bg-ai` for AI-relaterte elementer.

**Stats-typografi:** `--text-stat-xl` (56px) for kategori-bokstav, `--text-stat-lg` (44px) for primær SG-verdi, `--text-stat-md` (32px) for HCP, `--text-stat-sm` (24px) for kompakte tall. Alle med `tabular-nums`, `font-extrabold`, `tracking-stat` (-0.02em).

**Kategoribokstaver:** Farger fra `SKILL_LEVELS` i `lib/portal/golf/skill-levels.ts` (K=grå, I=lilla, G=blå, E=grønn, C=amber, A=rød).

**Aldri bruk:** `bg-[#154212]` (bruk `bg-forest`), `text-gray-500` (bruk `text-portal-secondary`), `border-gray-200` (bruk `border-portal-border`), Midnight Navy #0F2950 eller Soft Gold #B8975C (ikke i kodebasen).

---

## 11. Hva dette IKKE er

- Ikke et separat produkt. Det er en modul i AK Golf Platform.
- Ikke en erstatning for USI. Det er en presentasjonslagg over USI.
- Ikke et SaaS-produkt for andre golfklubber (ennå). Men arkitekturen med CoachPlayerRelation og multi-coach gjør det mulig å skalere dit senere.
- Ikke en mobilapp. Det er en responsiv webside som fungerer på mobil.
- Ikke en erstatter for coachens vurdering. Det er et verktøy som gir coachen data — coachen tar beslutningene.
