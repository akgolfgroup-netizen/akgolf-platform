# Data- og Matematikk-Appendiks til AK Golf Masterdokument

> **Formål:** Denne appendiksen er den autoritative tekniske spesifikasjonen for hvordan data fra DataGolf, TrackMan og spillerens egen statistikk kartlegges inn i AK Golf Academys metodikk som beskrevet i `ak-golf-masterdokument-v2_2026-04-12.docx`.
>
> **Hierarki:** Masterdokumentet = filosofi, metodikk og menneskelig trenervurdering. Denne appendiksen = matematisk implementasjon, data-pipeline og programvarespesifikasjon. Ved konflikt om metodikk gjelder masterdokumentet. Ved konflikt om data-implementasjon gjelder denne appendiksen.
>
> **Versjon:** 1.0  
> **Dato:** 2026-04-15

---

## Innholdsfortegnelse

1. [USI ↔ A–K Mapping](#1-usi--a--k-mapping)
2. [DataGolf-skaleringsbroen](#2-datagolf-skaleringsbroen)
3. [TrackMan → Økt-fokus](#3-trackman--økt-fokus)
4. [Testprotokoll 2.0: Fra 20 tester til USI](#4-testprotokoll-20-fra-20-tester-til-usi)
5. [App-spesifikasjons-utvidelse](#5-app-spesifikasjons-utvidelse)
6. [Database-modeller](#6-database-modeller)
7. [Dataflyt og CRON-pipeline](#7-dataflyt-og-cron-pipeline)

---

## 1. USI ↔ A–K Mapping

### 1.1 Bakgrunn

Masterdokumentet seksjon 2 definerer 11 spillerkategorier (A–K) basert primært på **snittscore**. Plattformen har imidlertid tilgang til langt rikere data: Strokes Gained per kategori, TrackMan-biomekanikk, testresultater og treningshistorikk.

**Unified Skill Index (USI)** er en 9-dimensjonal latent variabel (θ) som estimerer spillerens sanne ferdighet. For at denne skal være meningsfull i AK-sammenheng, må θ mappes tilbake til A–K-systemet.

### 1.2 Matematisk bro: SG_total → HCP → A–K

Masterdokumentets A–K-kategorier har en implisitt sammenheng med Strokes Gained gjennom `SG_BENCHMARKS` (se `lib/portal/golf/sg-benchmarks.ts`). Vi bruker disse som **kontrollpunkter** for en monoton, interpolert mapping.

| Kategori | Snittscore* | SG_total | Midt-HCP |
|----------|-------------|----------|----------|
| A | 78 | −0.3 | 1 |
| B | 81 | −0.8 | 4 |
| C | 84 | −1.3 | 7 |
| D | 87 | −1.7 | 10 |
| E | 90 | −2.0 | 13 |
| F | 93 | −2.5 | 17 |
| G | 98 | −3.0 | 22 |
| H | 103 | −3.5 | 27 |
| I | 108 | −4.0 | 33 |
| J | 115 | −5.0 | 40.5 |
| K | 125 | −6.0 | 49.5 |

\* Fra `averageScore` i `SG_BENCHMARKS`, som samsvarer med masterdokumentets A–K-definisjoner.

### 1.3 `sgToHandicap()` — Kubisk spline-interpolasjon

```typescript
// lib/portal/golf/sg-to-handicap.ts

import { SG_BENCHMARKS } from "./sg-benchmarks";

interface SgHcpPoint {
  sg: number;
  hcp: number;
  category: string;
}

const POINTS: SgHcpPoint[] = SG_BENCHMARKS.map((b) => ({
  sg: b.sg.total,
  hcp: (b.handicapRange[0] + b.handicapRange[1]) / 2,
  category: b.category,
}));

/**
 * Beregner estimert handicap fra total SG via kubisk spline.
 * Basert på A–K-benchmarks fra masterdokumentet.
 */
export function sgToHandicap(sgTotal: number): number {
  // Hvis utenfor interpolasjonsområdet, ekstrapoler lineært
  if (sgTotal >= POINTS[0].sg) {
    const slope = (POINTS[1].hcp - POINTS[0].hcp) / (POINTS[1].sg - POINTS[0].sg);
    return Math.max(0, POINTS[0].hcp + slope * (sgTotal - POINTS[0].sg));
  }
  if (sgTotal <= POINTS[POINTS.length - 1].sg) {
    const last = POINTS[POINTS.length - 1];
    const prev = POINTS[POINTS.length - 2];
    const slope = (last.hcp - prev.hcp) / (last.sg - prev.sg);
    return last.hcp + slope * (sgTotal - last.sg);
  }

  // Finn riktig intervall
  let i = 0;
  while (i < POINTS.length - 1 && sgTotal < POINTS[i + 1].sg) {
    i++;
  }

  const p0 = POINTS[i];
  const p1 = POINTS[i + 1];

  // Enkel kubisk Hermite-spline (Catmull-Rom-lignende med nulle tangenter i endene)
  const t = (sgTotal - p0.sg) / (p1.sg - p0.sg);
  const t2 = t * t;
  const t3 = t2 * t;

  const h0 = 2 * t3 - 3 * t2 + 1;
  const h1 = -2 * t3 + 3 * t2;

  return h0 * p0.hcp + h1 * p1.hcp;
}

/**
 * Runder HCP til nærmeste A–K-kategori.
 * Samsvarer med masterdokument seksjon 2.1.
 */
export function handicapToCategory(hcp: number): string {
  for (const b of SG_BENCHMARKS) {
    if (hcp >= b.handicapRange[0] && hcp <= b.handicapRange[1]) {
      return b.category;
    }
  }
  return hcp > 54 ? "K" : "A";
}

/**
 * Kombinert: SG_total → A–K-kategori
 */
export function sgToCategory(sgTotal: number): string {
  return handicapToCategory(sgToHandicap(sgTotal));
}
```

### 1.4 Kategori-spesifikk HCP («Du putter som en 8-handicapper»)

I tillegg til total SG kan vi beregne **handicap-ekvivalent per kategori**:

```
HCP_OTT  = sgToHandicapCategory(sgOffTheTee,    "offTheTee")
HCP_APP  = sgToHandicapCategory(sgApproach,     "approach")
HCP_ARG  = sgToHandicapCategory(sgAroundTheGreen,"aroundTheGreen")
HCP_PUT  = sgToHandicapCategory(sgPutting,      "putting")
```

Hver kategori har sine egne SG-kontrollpunkter fra `SG_BENCHMARKS`:

| Kat | OTT | APP | ARG | PUT |
|-----|-----|-----|-----|-----|
| A | −0.1 | −0.1 | 0.0 | −0.1 |
| B | −0.3 | −0.3 | −0.1 | −0.1 |
| C | −0.4 | −0.5 | −0.2 | −0.2 |
| D | −0.5 | −0.7 | −0.3 | −0.2 |
| E | −0.6 | −0.9 | −0.4 | −0.1 |
| F | −0.7 | −1.1 | −0.5 | −0.2 |
| G | −0.8 | −1.3 | −0.6 | −0.3 |
| H | −0.9 | −1.5 | −0.8 | −0.3 |
| I | −1.0 | −1.7 | −0.9 | −0.4 |
| J | −1.3 | −2.0 | −1.2 | −0.5 |
| K | −1.5 | −2.5 | −1.5 | −0.5 |

Dette gir masterdokumentets IUP-system en **data-drevet komponentvurdering**.

### 1.5 Relasjon til opprykk (Masterdokument seksjon 2.3)

Masterdokumentet krever at **treneren** godkjenner kategoriopprykk. USI skal aldri overstyre trenervurderingen, men skal:
- **Forslå** kategori basert på siste 90 dagers data.
- **Varsle** når en spiller konsekvent ligger i grenseland mellom to kategorier.
- **Dokumentere** hvilke kategori-spesifikke svakheter som gjenstår.

---

## 2. DataGolf-skaleringsbroen

### 2.1 Hva DataGolf gir oss

DataGolf API (`/preds/player-decompositions`, `/preds/approach-skill`, `/preds/skill-ratings`) gir **proff-nivå SG-data** for alle store tourer. Dette er verdens beste eksterne benchmark.

### 2.2 Problemet

DataGolf har **ingen amatør-benchmarks**. En 15-handicappers SG_total er ikke direkte sammenlignbar med Viktor Hovlards SG_total fordi:
1. De spiller på ulike baner (course-setup-effekt).
2. Amatør-SG er ofte beregnet mot en amatør-benchmark (f.eks. scratch), mens DataGolf er mot PGA Tour-snitt.

### 2.3 Løsning: Amatør-proff-bro via A–K-kontrollpunkter

Ved å bruke `sgToHandicap()` baklengs kan vi finne **hvilken DataGolf-SG en gitt proff har, i amatør-termer**.

**Steg 1:** For enhver proff `p` fra DataGolf:
```
proff_sg_total = DataGolf.sg_total(p)
```

**Steg 2:** Konverter proffens SG til et «amatør-ekvivalent» ved å finne hvilken A–K-kategori som matcher:
```
amatør_kategori = sgToCategory(proff_sg_total)
```

**Eksempel:**
- Viktor Hovland: SG_total ≈ +1.2 → `sgToCategory(1.2)` = «A» (elite, HCP < 2)
- PGA Tour median: SG_total ≈ 0.0 → `sgToCategory(0.0)` = «A/B-grense»

**Steg 3:** For sammenligning mellom spiller og proff, beregner vi **gapet i samme rom**:
```
gap_OTT = θ_OTT_spiller − θ_OTT_proff
gap_APP = θ_APP_spiller − θ_APP_proff
```

Fordi `θ` er normalisert mot våre egne A–K-benchmarks, blir gapet meningsfullt: *"For å matche Viktor Hovlands approach, må du heve SG:APP fra −0.8 til +0.4. Det tilsvarer å forbedre seg fra F- til A-nivå på innspill."*

### 2.4 `vsTourAvgPct` — Den procentuelle skalaen

For å gjøre sammenligningen intuitiv for spillere, introduserer vi:

```
vsTourAvgPct_c = 100 + (θ_c / |θ_A,c|) * 100
```

Hvor `θ_A,c` er A-kategoriens SG-verdi i kategori `c`.

**Eksempler:**
- A-spiller på approach: `100 + (−0.1 / 0.1) * 100` = 100% av tour-snitt
- D-spiller på approach: `100 + (−0.7 / 0.1) * 100` = 30% av tour-snitt
- F-spiller på approach: `100 + (−1.1 / 0.1) * 100` = −10% av tour-snitt

Denne skalaen brukes i benchmark-siden i appen (se `app/portal/(dashboard)/benchmark`).

---

## 3. TrackMan → Økt-fokus

### 3.1 Hvorfor denne broen er kritisk

Masterdokumentet seksjon 3.2 sier at SLAG-trening skal fordeles etter Strokes Gained. Men SG sier **hvor** slag tapes — ikke **hvorfor**. TrackMan sier **hvorfor**.

Vi bygger en **implisitt mapping** fra SG-svakhet til TrackMan-mål til økt-ID.

### 3.2 SG-symptom → TrackMan-mål

Basert på Johansson et al. (2015) — Random Forest-prediksjon av handicap fra TrackMan — er de viktigste mekaniske faktorene:
1. Ball speed
2. Face angle consistency (std dev)
3. Club path consistency
4. Smash factor
5. Dynamic loft

**Mapping-tabell (v1.0):**

| SG-symptom | Sannsynlig årsak | TrackMan-mål | Økt-fokus (Masterdokument) |
|------------|------------------|--------------|---------------------------|
| SG_OTT < −1.0 | Lav ballfart + høy spredning | Driver ball speed ↑, offline std dev ↓ | `SLAG_TEE_*`, `TEK_TEE_*` |
| SG_OTT −0.5 til −1.0 | Moderat spredning | Face angle std dev ↓, club path consistency ↑ | `TEK_TEE_L-KØLLE_*` |
| SG_APP < −1.0 | Inconsistent kontakt | Smash factor ↑ (jern), spin consistency ↓ | `SLAG_INN100_*`, `SLAG_INN150_*` |
| SG_APP −0.5 til −1.0 | Dårlig avstandskontroll | Carry std dev ↓, launch angle consistency ↑ | `TEK_INN*_L-BALL_*` |
| SG_ARG < −0.5 | Dårlig kontakt nært green | Dynamic loft kontroll (wedge) | `SLAG_CHIP_*`, `SLAG_PITCH_*` |
| SG_PUTT < −0.3 | Inconsistent face angle putting | Putt-launch consistency, speed ratio | `TEK_PUTT*` |

### 3.3 Fra TrackMan-mål til økt-ID

Masterdokumentet seksjon 9 definerer økt-ID-formatet:
```
[NIVÅ]_[OMRÅDE]_[L-FASE]_[CS]_[MILJØ]_[PR]_[P-POSISJON]
```

Når USI identifiserer at en spiller har `SG_OTT = −1.2` og `driverBallSpeed = 135 mph` (lavt), kan systemet foreslå:
```
SLAG_TEE_L-BALL_CS60_M1_PR2_P7.0
TEK_TEE_L-KØLLE_CS40_M1_PR1_P4.0-P7.0
FYS_POWER_M0
```

**Algoritme for økt-ID-forslag:**
1. Identifiser dimensjonen med størst gap mot neste kategori.
2. Se opp TrackMan-mål for den dimensjonen.
3. Velg økt-ID fra masterdokumentets øktmaler (seksjon 18) som matcher spillerens kategori + mål.
4. Alloker timer basert på gradient-ascent (se Matematisk Rammeverk seksjon 5.2).

### 3.4 Fasilitetsfilter (Masterdokument seksjon 15.4)

Masterdokumentet sier: *"Spiller uten TrackMan-tilgang får ikke M1-økter i sin plan."*

USI-respektérer dette:
- Hvis spiller ikke har TrackMan-data → `reliability_trackman = 0` → modellen vekter tungt på `RoundStats` og `TestResult` i stedet.
- Økt-ID-forslag begrenses til miljøer spilleren har tilgang til (`M2`, `M3`, etc.).

---

## 4. Testprotokoll 2.0: Fra 20 tester til USI

### 4.1 Masterdokumentets 20 tester (seksjon 16)

Masterdokumentet lister 20 standardiserte tester fordelt på 7 kategorier:
- Fart (2)
- Lengde (1)
- Presisjon (8)
- Fysisk (3)
- Putting (2)
- Scoring (1)
- Mentalt (3)

### 4.2 Testene som USI-observasjoner

I USI-modellen er hver test en **noisy observation** av en eller flere θ-dimensjoner:

| Testkategori | Masterdokument-test | USI-dimensjon | Reliability |
|--------------|---------------------|---------------|-------------|
| Fart | Driver club speed | θ_SPEED | Høy |
| Lengde | Driver carry | θ_SPEED + θ_CONS | Høy |
| Presisjon | Approach 100m proximity | θ_APP | Medium |
| Presisjon | Fairway % | θ_OTT + θ_CONS | Medium |
| Putting | 3-5 ft make % | θ_PUT | Medium |
| Fysisk | T-spine rotation | θ_SPEED (indirekte) | Lav |
| Mentalt | Fokustest | θ_PRESS | Lav-Medium |

### 4.3 Smart test-forslag

Fordi USI estimerer **usikkerhet** (`Σ_noise`) per dimensjon, kan appen foreslå tester der usikkerheten er høyest:

```
foreslå_test(dimensjon) = argmax_j ( posteriorCovariance[j][j] )
```

**Eksempel:**
- Spiller har logget 50 driver-slag på TrackMan (lav usikkerhet i θ_SPEED).
- Spiller har kun 2 runder med putting-data (høy usikkerhet i θ_PUT).
- Appen foreslår: *"Ta putting-testen denne uken for å redusere usikkerhet i din putting-profil."*

### 4.4 Opprykksvurdering (Masterdokument seksjon 2.4)

Masterdokumentet krever minst 5 av 7 testkategorier på neste nivå.

USI kan:
1. **Predikere** sannsynligheten for å bestå neste kategoris tester basert på nåværende θ.
2. **Identifisere** hvilke 2 testkategorier som er svakeste (og dermed må prioriteres).
3. **Simulere** treningsprogresjon: *"Hvis du trener approach 3t/uke i 4 uker, øker sannsynligheten for presisjon-test-bestått fra 45% til 78%."*

---

## 5. App-spesifikasjons-utvidelse

### 5.1 Kontekst

Masterdokumentet seksjon 15 definerer app-spesifikasjonen. Denne seksjonen utvider den med data-drevne komponenter.

### 5.2 Nye databasefelt (utvider seksjon 15.2)

I tillegg til `Player.category`, `Session.formulaId`, etc., må databasen støtte:

```typescript
// Se Prisma-skjema nedenfor for full definisjon

Player.unifiedSkillIndex    // USI-cache (oppdateres daglig)
Player.skillConfidence      // Usikkerhet per dimensjon
Player.datagolfComparison   // Siste proff-sammenligning
Player.trainingPrescription // Siste genererte treningsplan
Player.nextRecommendedTest  // Test med høyest usikkerhet
```

### 5.3 Nye valideringsregler (utvider seksjon 15.3)

| Regel | App-handling | Matematisk grunnlag |
|-------|--------------|---------------------|
| CS-kalibrering | Onboarding bruker TrackMan eller manuell test til å sette maxCS | `θ_SPEED` gir empirisk maxCS |
| Økt-allokering | Appen foreslår økt-fordeling basert på USI-gradient | `∂USI/∂hours_f` |
| Kategori-forslag | Appen viser estimert kategori, men krever trenergodkjenning | `sgToCategory(USI_total)` |
| Test-påminnelse | Appen varsler når usikkerhet i en dimensjon overstiger terskel | `diagonal(Σ_posterior) > threshold` |
| Proff-sammenligning | PRO+-brukere kan sammenligne seg med DataGolf-proffer | `gap = θ_player − θ_pro` |

### 5.4 Nye seksjoner i masterdokumentet

Følgende avsnitt skal legges til i masterdokumentets seksjon 15:

> **15.5 Unified Skill Index (USI)**  
> Appen beregner en latent skill-vektor (USI) som kombinerer runde-statistikk, TrackMan-data, testresultater og treningslogger. USI er ikke en erstatning for trenervurdering, men et beslutningsstøtteverktøy for data-drevet treningsplanlegging. Full matematisk spesifikasjon ligger i AK Golf Software sin Data- og Matematikk-Appendiks.

> **15.6 Prediktiv treningsplanlegging**  
> Basert på USI beregner appen hvilke fokusområder som gir høyest forventet avkastning per trenings time. Treningsplanen justeres automatisk hver uke basert på logget progresjon. Trenervurdering kan overstyre systemets forslag.

> **15.7 DataGolf-integrasjon**  
> For PRO+-brukere henter appen benchmark-data fra DataGolf for PGA Tour-spillere. Amatør-proff-sammenligningen skaleres matematisk via A–K-kontrollpunkter slik at sammenligningen er meningsfull på tvers av nivåforskjeller.

---

## 6. Database-modeller

### 6.1 Prisma-utvidelser

```prisma
/// Unified Skill Index cache per player
model UnifiedSkillIndex {
  id        String   @id @default(cuid())
  userId    String   @unique
  
  // Core SG dimensions (latent estimates)
  sgOtt     Float
  sgApp     Float
  sgArg     Float
  sgPutt    Float
  
  // Biomechanical
  ballSpeedScore     Float // θ_SPEED
  consistencyScore   Float // θ_CONS
  
  // Mental / contextual
  pressureScore      Float      // θ_PRESS
  trainingEfficiency Float      // θ_TRAIN
  trendMomentum      Float      // θ_TREND
  
  // Composite
  totalUsi           Float      // USI_total
  estimatedHandicap  Float      // sgToHandicap(USI_total)
  estimatedCategory  String     // A–K
  
  // Uncertainty (standard deviation per dimension)
  uncertaintyJson    Json       // { sgOtt: 0.12, sgApp: 0.18, ... }
  
  // External comparison
  vsTourAvgPct       Float      // Overall % of Tour avg
  dataGolfDgId       Int?       // Last compared pro
  
  updatedAt DateTime @updatedAt
  User      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

/// Learned regression: TrackMan / tests → SG prediction
model SkillMapping {
  id            String  @id @default(cuid())
  category      String  // OTT, APP, ARG, PUTT
  intercept     Float
  ballSpeedCoeff        Float?
  offlineStdDevCoeff    Float?
  smashFactorCoeff      Float?
  spinConsistencyCoeff  Float?
  launchConsistencyCoeff Float?
  
  rSquared   Float
  sampleSize Int
  updatedAt  DateTime @updatedAt
}

/// AI-generated training prescription
model TrainingPrescription {
  id            String   @id @default(cuid())
  userId        String
  generatedAt   DateTime @default(now())
  
  focusAreas         String[] // e.g. ["driver_speed", "approach_100m"]
  weeklyHours        Float
  suggestedFormulaIds String[] // Masterdocument økt-IDs
  
  predictedHcpChange Float // e.g. -1.2
  confidence         Float // 0-1
  
  gradientJson    Json // ∂USI/∂hours per focus
  gapAnalysisJson Json // gap vs target per category
  
  User User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, generatedAt])
}
```

### 6.2 Migration-strategi

1. Opprett `UnifiedSkillIndex`, `SkillMapping`, `TrainingPrescription`.
2. Kjør backfill for alle eksisterende brukere med `RoundStats`.
3. Fyll på TrackMan-baserte dimensjoner for brukere med `TrackManShotData`.
4. Aktiver CRON for inkrementell oppdatering.

---

## 7. Dataflyt og CRON-pipeline

### 7.1 Nattlig beregning (03:00)

```
for hver aktiv spiller:
  1. Hent siste 20 RoundStats
  2. Hent siste 12 TrackManSessionAnalytics
  3. Hent siste TestResult
  4. Hent siste 30 TrainingLog
  5. Hent MentalScorecardEntry
  
  → Kjør USI-beregning (Empirical Bayes / vektet snitt v0.1)
  → Kjør DataGolf-sammenligning (hvis PRO+ abonnement)
  → Generer TrainingPrescription
  → Oppdater UnifiedSkillIndex
  
  if (signifikant endring i estimatedCategory):
    send push-varsling til spiller og trener
```

### 7.2 Real-time oppdateringer

- Når spiller logger ny runde → trigger USI-oppdatering for den brukeren.
- Når spiller laster opp TrackMan CSV → trigger USI-oppdatering.
- Når spiller fullfører test → trigger usikkerhets-beregning og test-forslag.

### 7.3 Admin-dashboard (Mission Control)

Instruktører skal kunne se:
- USI-radar for hver elev
- Kategori-grenseland (elever nær opprykk)
- USI-baserte treningsforslag før hver økt
- DataGolf-proff-sammenligning for PRO+-elever

---

## Referanser

- **AK Golf Masterdokument v2.0** (`ak-golf-masterdokument-v2_2026-04-12.docx`) — Metodikk, A–K-kategorier, økt-ID-system, testprotokoller.
- **Matematisk Rammeverk** (`docs/strategy/MATHEMATICAL_FRAMEWORK.md`) — Full teoretisk utledning av USI, Bayesiansk modellering og ML-arkitektur.
- **Mark Broadie** — *Every Shot Counts* og *Assessing Golfer Performance on the PGA TOUR*.
- **Johansson et al.** — *Mining Trackman Golf Data* (CSCI 2015).
- **DataGolf** — API-dokumentasjon og prediktiv metodikk.
