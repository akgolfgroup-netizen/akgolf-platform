# Matematisk Rammeverk: Unified Skill Index & DataGolf-Drevet Treningsplanlegging

> **Mål:** Bygge verdens mest komplette verktøy for matematisk nivåestimering, sammenligning og prediktiv treningsplanlegging.
> 
> **Dato:** 2026-04-15  
> **Status:** Strategisk rammeverk — klar for implementering

---

## 1. Visjon: Fra Data til Matematisk Presisjon

### Problemet med dagens golfanalyse
- **Handicap** er en historisk glidende gjennomsnitt som reagerer sakte og ignorerer ferdighetskomponenter.
- **Strokes Gained (SG)** er det beste vi har, men det er støyfullt fra runde til runde og gir ingen prediksjon.
- **TrackMan** gir biomekanikk, men alene sier det ingenting om hvordan dette oversettes til score på banen.
- **DataGolf** gir proff-benchmarks, men skalerer ikke til amatørnivå.

### Vår løsning: Unified Skill Index (USI)
En **latent variabel-modell** som kombinerer alle datakilder til én kontinuerlig, prediktiv og sammenlignbar skår. USI er ikke ett tall — det er en **multidimensjonal vektor** i et felles matematisk rom, der hver spiller kan sammenlignes med:
- Seg selv over tid
- Andre amatører
- PGA Tour-proffer (via DataGolf)
- Ideelle "future self"-mål

---

## 2. Teoretisk Fundament

### 2.1 Strokes Gained som Benchmark-Funksjon

Mark Broadies fundamentale formel:

```
SG(shot) = J(start) − J(end) − 1
```

der **J(d, c)** er forventede slag til hull ut fra avstand *d* og lie *c*.

**Nøkkelinnsikt:** SG er egentlig en **differanse mot en benchmark-funksjon**. Dette betyr at vi kan:
1. Velge enhver benchmark (PGA Tour, scratch, 10-handicap)
2. Beregne SG relativt til den
3. Derivere forventet score på enhver bane

**Praktisk implikasjon for oss:**
```
ExpectedScore(player, course) = Σ J_course(tee_i) − Σ SG_player,category_i
```

### 2.2 Latent Skill og Empirisk Bayes

Forskning (Brill & Wyner 2025) viser at **tee-to-green-skill er substansiell og estimérbar**, mens putting er "nearly indistinguishable from noise" på kort sikt.

Dette betyr at en Bayesian hierarkisk modell er optimal:

```
θ_player ~ N(μ_population, Σ_population)     // Latent true skill
y_obs | θ ~ N(θ, Σ_noise)                    // Noisy observations
```

Hvor:
- **θ** = latent skill-vektor [SG_OTT, SG_APP, SG_ARG, SG_PUTT, TrackMan_speed, TrackMan_consistency, ...]
- **Σ_noise** = varierer per datakilde (TrackMan har lav varians, putting-SG har høy varians)
- **Posterior**: `p(θ | y) ∝ p(y | θ) · p(θ)` — gir oss den beste sannsynlighetsestimeringen av ekte ferdighet.

### 2.3 Random Forest-studien: TrackMan → Handicap

Johansson et al. (2015) viste at 28 TrackMan-parametre predikerer handicap med nøyaktighet **sammenlignbar med PGA-profesjonelle**.

**Viktigste features (rangert):**
1. Ball speed
2. Konsistens i face angle (std dev)
3. Konsistens i club path
4. Smash factor
5. Dynamic loft

**Implikasjon:** Vi kan bygge en **TrackMan-submodell** som predikerer forventet SG/Handicap uavhengig av on-course data.

---

## 3. Unified Skill Index (USI) — Matematisk Definisjon

### 3.1 Dimensjoner

USI er en vektor i ℝ⁹:

| Dimensjon | Symbol | Datakilder |
|-----------|--------|------------|
| Off-the-Tee | θ_OTT | RoundStats.sgOffTheTee, TrackMan driver consistency |
| Approach | θ_APP | RoundStats.sgApproach, approach100-200+, TrackMan iron data |
| Around Green | θ_ARG | RoundStats.sgAroundTheGreen, TestResult (short game) |
| Putting | θ_PUT | RoundStats.sgPutting, TestResult (putting) |
| Ball Speed | θ_SPEED | TrackManShotData.ballSpeed, clubSpeed |
| Consistency | θ_CONS | TrackMan std dev per klubb, dispersion metrics |
| Pressure Performance | θ_PRESS | MentalScorecardEntry, RoundStats under PR3-PR5 |
| Training Efficiency | θ_TRAIN | TrainingLog volum vs. RoundStats-forbedring |
| Trend Momentum | θ_TREND | Tidsderivert av θ over siste 90 dager |

### 3.2 Bayesian Hierarchical Model

```typescript
// Pseudokode for USI-beregning

interface ObservationBlock {
  source: "round_sg" | "trackman" | "test" | "mental" | "training";
  values: number[];
  reliability: number; // 0-1, basert på sample size og historisk varians
  mappingMatrix: number[][]; // Hvilke USI-dimensjoner denne blokken påvirker
}

function computeUSI(
  blocks: ObservationBlock[],
  priorMean: number[],
  priorCov: number[][]
): USI {
  // Kalman-filter-lignende oppdatering
  let posteriorMean = priorMean;
  let posteriorCov = priorCov;

  for (const block of blocks) {
    const H = block.mappingMatrix;
    const R = block.reliability; // observation noise covariance skalert
    
    // Kalman gain
    const S = H * posteriorCov * H^T + R;
    const K = posteriorCov * H^T * inv(S);
    
    // Update
    const predictedObs = H * posteriorMean;
    const observedMean = mean(block.values);
    posteriorMean = posteriorMean + K * (observedMean - predictedObs);
    posteriorCov = (I - K * H) * posteriorCov;
  }

  return posteriorMean;
}
```

**I praksis:** Vi bruker ikke en hjemmesnekret Kalman-filter, men en **Empirical Bayes-approksimasjon** eller et ferdig Bayesian inference-bibliotek (f.eks. Stan, PyMC, eller en enklere normal-normal conjugate prior-løsning i TypeScript/Python).

### 3.3 Konkret Mapping fra Eksisterende Data

#### A. RoundStats → θ_SG (de fire første dimensjonene)

```
For hver kategori c ∈ {OTT, APP, ARG, PUTT}:
  
  y_c = weighted_avg( RoundStats.sg_{c} over siste N runder )
  
  N = min(20, antall runder siste 90 dager)
  
  Vekt = exponential_decay(dager_siden_runde, halveringstid=30)
  
  reliability_c = N / (N + τ_c)
  
  hvor τ_c er en "støy-terskel" basert på kategoriens inherente varians:
    τ_OTT = 5   (lav varians)
    τ_APP = 5   (lav varians)
    τ_ARG = 8   (medium varians)
    τ_PUT = 15  (høy varians — Brill & Wyner)
```

#### B. TrackMan → θ_SPEED og θ_CONS

```
θ_SPEED = normalize(avgBallSpeed_last10Drivers, tour_avg, tour_std)

θ_CONS = 1 / (1 + avg_std_dev_per_klubb)
         // Invers relasjon: lavere std dev → høyere konsistens-skår

// For hver klubb k:
  lateralConsistency_k = 1 / (1 + lateralStdDev_k / carryDistance_k)
  distanceConsistency_k = 1 / (1 + distanceStdDev_k / carryDistance_k)

θ_CONS = mean( lateralConsistency_k · distanceConsistency_k ) over alle klubber
```

#### C. TestResult → θ_APP/θ_ARG/θ_PUT

```
// Normaliser testresultater til 0-1 skala
for hver test t:
  normalized_t = (player_best_t − worst_amateur_t) / (pro_avg_t − worst_amateur_t)

// Map til relevant θ-dimensjon
θ_APP_test = weighted_avg( normalized_t for alle approach-tester )
θ_ARG_test = weighted_avg( normalized_t for alle short-game-tester )
θ_PUT_test = weighted_avg( normalized_t for alle putting-tester )

reliability_test = sample_size / (sample_size + 3)
```

#### D. MentalScorecardEntry → θ_PRESS

```
// Sammenlign PR1 (lavt press) vs PR5 (høyt press)
pr1_performance = avg(score or SG when pressureLevel=1)
pr5_performance = avg(score or SG when pressureLevel=5)

θ_PRESS = pr5_performance / pr1_performance
// > 1.0 = bedre under press (sjelden)
// < 1.0 = faller under press (vanlig)
```

#### E. Training Efficiency → θ_TRAIN

```
// Korrelasjonstrening → resultat
// Bruk 30-dagers vinduer

trainingHours = sum(TrainingLog.durationMinutes) / 60
improvementRate = slope( SG_total over siste 90 dager )

θ_TRAIN = improvementRate / trainingHours
// slag forbedret per time trening
```

### 3.4 Samlet USI: Vektet Kombinasjon

```
θ_player = [θ_OTT, θ_APP, θ_ARG, θ_PUT, θ_SPEED, θ_CONS, θ_PRESS, θ_TRAIN, θ_TREND]

// Hver dimensjon normaliseres til Z-score relativt populasjonen
for hver dimensjon j:
  z_j = (θ_j − μ_j) / σ_j

// Total USI-skår (kan brukes til ranking og sammenligning)
USI_total = Σ w_j · z_j

// Vekter kan settes empirisk basert på prediktiv kraft:
w_OTT   = 0.20  // ~20% av score-varians
w_APP   = 0.30  // ~30% av score-varians (viktigste)
w_ARG   = 0.15  // ~15% av score-varians
w_PUT   = 0.10  // ~10% av score-varians (mye støy)
w_SPEED = 0.10  // proxy for fremtidig potensial
w_CONS  = 0.10  // konsistens er kritisk for amatører
w_PRESS = 0.03  // mental game
w_TRAIN = 0.01  // treningskultur
w_TREND = 0.01  // momentum
```

**Sum = 1.0. Vektene kalibreres mot faktisk score-forbedring i en regresjon.**

---

## 4. DataGolf: Matematiske Muligheter og Begrensninger

### 4.1 Hva DataGolf Gir Oss

DataGolf er **verdens beste proff-benchmark**. API-et gir:

1. **Skill Decompositions**: SG_OTT, SG_APP, SG_ARG, SG_PUTT for alle tour-spillere
2. **Approach Skill**: Proximity og SG per avstandsbøtte (75-100y, 100-125y, etc.)
3. **Skill Ratings**: Rangeringer per kategori
4. **Historical Rounds**: Round-level SG tilbake til 1983 for majors

### 4.2 Den Kritiske Broen: Fra Proff til Amatør

**DataGolf mangler amatør-benchmarks.** Vi må bygge denne broen selv.

#### Metode A: Log-lineær SG → Handicap-mapping

Basert på empiriske data (Arccos, Shot Scope, Golfity) og våre egne `SG_BENCHMARKS`:

```
HCP_est(SG_total) ≈ a · exp(−b · SG_total) + c
```

Med en forenklet lineær tilnærming for vårt nåværende spenn:

```
HCP_est ≈ max(0, −2.0 · SG_total + 1.5)

// Eksempler fra våre SG_BENCHMARKS:
// SG = −0.3 (Elite/A)  → HCP ≈ 0-2   ✓
// SG = −2.0 (Avansert/E) → HCP ≈ 10-12 (vi har 12-14, litt avvik)
// SG = −4.0 (Utviklende/I) → HCP ≈ 28-30 (vi har 30-36, i ballpark)
```

**Forbedret modell:** Bruk våre 11 A-K-kategorier som **kontrollpunkter** for en spline-interpolasjon:

```typescript
function sgToHandicap(sgTotal: number): number {
  // Spline-interpolasjon mellom SG_BENCHMARKS
  // Input: sgTotal
  // Output: estimert handicap
  
  const points = SG_BENCHMARKS.map(b => ({
    sg: b.sg.total,
    hcp: (b.handicapRange[0] + b.handicapRange[1]) / 2
  }));
  
  return cubicSplineInterpolate(sgTotal, points);
}
```

#### Metode B: Kategori-spesifikk HCP

```
HCP_OTT = sgToHandicapCategory(sgOffTheTee, "offTheTee")
HCP_APP = sgToHandicapCategory(sgApproach, "approach")
HCP_ARG = sgToHandicapCategory(sgAroundTheGreen, "aroundTheGreen")
HCP_PUT = sgToHandicapCategory(sgPutting, "putting")

// Kombinert:
HCP_combined = 0.20·HCP_OTT + 0.35·HCP_APP + 0.25·HCP_ARG + 0.20·HCP_PUT
```

Dette gir den berømte setningen: **"Du putter som en 8-handicapper, men innspillet ditt er på 18-nivå."**

### 4.3 DataGolf-Drevet Treningsplanlegging — Matematisk Ramme

#### Steg 1: Identifiser Gap mot Valgt Proff

```
For hver kategori c:
  gap_c = θ_player,c − θ_pro,c
  
  // Hvis gap_c < −0.5 (dvs spilleren er >0.5 SG bak proffen):
  flag_c = "HIGH_PRIORITY"
  
  // Hvis gap_c mellom −0.5 og 0:
  flag_c = "MAINTAIN"
  
  // Hvis gap_c > 0:
  flag_c = "STRENGTH"
```

#### Steg 2: Oversett SG-Gap til TrackMan-Mål

Dette er det unike konseptuelle gjennombruddet vårt. Vi bygger en **lookup-tabell** som mapper SG-svakheter til mekaniske mål.

```typescript
interface SGToTrackManMap {
  symptom: string;           // f.eks. "SG_OTT = -1.5"
  likelyCauses: string[];    // f.eks. ["low ball speed", "high dispersion"]
  trackmanTargets: {
    metric: string;
    currentEstimate: number;  // basert på spillerens TrackMan-data
    targetValue: number;      // basert på hvilket SG-nivå de vil nå
    priority: number;
  }[];
}

// Eksempel:
{
  symptom: "SG_OTT < -1.0",
  likelyCauses: ["insufficient carry", "poor accuracy"],
  trackmanTargets: [
    { metric: "driverBallSpeed", targetValue: 155, priority: 1 },
    { metric: "driverOfflineStdDev", targetValue: 12, priority: 2 },
    { metric: "smashFactor", targetValue: 1.48, priority: 3 }
  ]
}
```

**Matematisk:** Dette er egentlig en **implisitt funksjon**. Vi lærer mappingen fra data:
- For alle spillere med kjent SG_OTT og TrackMan-driverdata
- Kjør en multippel regresjon: `SG_OTT ~ ballSpeed + offlineStdDev + smashFactor + ...`
- Inverter regresjonskoeffisientene for å finne hvilke TrackMan-endringer som kreves for å øke SG_OTT med Δ

#### Steg 3: Prediktiv HCP-Trend (fra PLAN.md, men nå matematisk presis)

```
HCP(t) = HCP_0 · exp(−λ · t) + HCP_equilibrium

hvor:
  λ = f(trainingVolume, trainingQuality, θ_TRAIN)
  HCP_equilibrium = sgToHandicap(USI_total)
  
// For en 3-måneders prognose:
HCP(90d) = HCP_0 + (HCP_equilibrium − HCP_0) · (1 − exp(−λ · 90))
```

**λ** (læringsrate) estimeres fra spillerens historikk:
```
λ = baseline_λ · θ_TRAIN · age_factor · consistency_bonus

baseline_λ ≈ 0.01 per dag for dedikerte amatører
age_factor = max(0.5, 1 − (alder − 30) / 100)
consistency_bonus = 1 + 0.5 · θ_CONS
```

---

## 5. Treningsplanlegging som Optimaliseringsproblem

### 5.1 Målfunksjon

Gitt en spiller med nåværende USI θ₀ og et mål USI* (f.eks. "nå 5-handicap innen 1. juni"), finn den treningsplanen som **maksimerer sannsynligheten for å nå målet** innen tidsfristen.

```
maximize P( ||θ(t) − θ*|| < ε | trainingPlan )

underlagt:
  timeConstraint: sum(sessionDuration) ≤ availableHoursPerWeek
  recoveryConstraint: consecutiveHardDays ≤ 3
  varietyConstraint: min(focusArea Diversity) ≥ threshold
```

### 5.2 Gradient-Ascent på USI

For hver fokusområde f (driver, approach, putting, etc.), estimer den **forventede endringen i USI per time trening**:

```
∂USI/∂hours_f = historical_average(ΔUSI / hours_f for players similar to current user)
```

Dette er en **gradient** i treningsrommet. Vi velger fokusområder der:
1. Gradienten er høy (mye igjen for pengene)
2. Gapet mot målet er stort
3. Spilleren ikke er "overtrent" i dette området

```
allocation_f ∝ gradient_f · gap_f · freshness_f

hvor freshness_f = 1 / (1 + hours_f_last7days)
```

### 5.3 Periodisering via Dynamic Programming

En 4-ukers treningsplan kan optimaliseres med dynamisk programmering:

```
V_t(θ) = max_a [ E[ V_{t+1}(θ + Δθ(a)) ] − cost(a) ]

hvor:
  t = uke 1..4
  θ = nåværende skill-state
  a = treningsaksjon (f.eks. "2t driver, 1t approach")
  Δθ(a) = stokastisk skill-endring (modellert som normalfordelt)
  cost(a) = tidskostnad + overtreningsrisiko
```

**I praksis:** Vi løser ikke dette eksakt. Vi bruker en **greedy heuristikk** med 1-ukers horisont og justerer basert på faktisk logget progresjon.

---

## 6. Implementeringsarkitektur

### 6.1 Nye Prisma-Modeller

```prisma
/// Unified Skill Index cache per player
model UnifiedSkillIndex {
  id        String   @id @default(cuid())
  userId    String   @unique
  
  // Core SG dimensions
  sgOtt     Float
  sgApp     Float
  sgArg     Float
  sgPutt    Float
  
  // Biomechanical
  ballSpeedScore    Float
  consistencyScore  Float
  
  // Mental / contextual
  pressureScore     Float
  trainingEfficiency Float
  trendMomentum     Float
  
  // Composite
  totalUsi          Float
  estimatedHandicap Float
  estimatedScore    Float // på referansebane
  
  // Pro comparison
  vsTourAvgPct      Float // f.eks. 73% = "73% av tour-snitt"
  dataGolfDgId      Int?   // Kobling hvis spiller har proff-data
  
  updatedAt DateTime @updatedAt
  User      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

/// TrackMan → SG mapping coefficients (lært fra data)
model SkillMapping {
  id       String @id @default(cuid())
  category String // OTT, APP, etc.
  
  // Regresjonskoeffisienter
  intercept Float
  ballSpeedCoeff Float?
  offlineStdDevCoeff Float?
  smashFactorCoeff Float?
  spinRateCoeff Float?
  
  rSquared  Float
  sampleSize Int
  updatedAt DateTime @updatedAt
}

/// Player-specific training prescription
model TrainingPrescription {
  id            String   @id @default(cuid())
  userId        String
  generatedAt   DateTime @default(now())
  
  focusAreas    String[] // f.eks. ["driver_speed", "approach_100m"]
  weeklyHours   Float
  
  // Prediksjon
  predictedHcpChange Float // f.eks. -1.2
  confidence     Float    // 0-1
  
  // Underlying math
  gradientJson   Json     // ∂USI/∂hours per fokusområde
  gapAnalysisJson Json    // gap vs target per kategori
  
  User User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, generatedAt])
}
```

### 6.2 Beregningspipeline

```
CRON (hver natt kl 03:00):
  
  1. For hver aktiv spiller:
     a. Hent siste 20 RoundStats
     b. Hent siste 12 TrackManSessionAnalytics
     c. Hent siste TestResult
     d. Hent siste 30 TrainingLog
     e. Hent MentalScorecardEntry
  
  2. Kjør USI-beregning:
     a. Beregn θ_SG fra RoundStats
     b. Beregn θ_SPEED/θ_CONS fra TrackMan
     c. Beregn θ_PRESS fra mental data
     d. Beregn θ_TRAIN fra treningsdata
     e. Kombiner til θ_player
  
  3. Kjør DataGolf-sammenligning (hvis PRO+ abonnement):
     a. Hent tour-benchmarks
     b. Beregn gap og vsTourAvgPct
  
  4. Generer treningspreskripsjon:
     a. Beregn gradienter
     b. Identifiser største gap
     c. Lag 1-ukers forslag
  
  5. Oppdater UnifiedSkillIndex
  6. Send push-varsling hvis betydelig endring i USI
```

### 6.3 API-Endepunkter

```typescript
// GET /api/portal/usi/current
interface USIResponse {
  dimensions: Record<string, number>;
  total: number;
  estimatedHandicap: number;
  vsTourAvgPct: number;
  percentileAmongUsers: number;
}

// GET /api/portal/usi/projection?targetHcp=5&weeks=12
interface USIProjectionResponse {
  current: number;
  target: number;
  projected: number;
  probability: number; // P(reach target | current training)
  requiredWeeklyHours: number;
  optimalFocusAreas: string[];
}

// POST /api/portal/training/prescription
interface TrainingPrescriptionRequest {
  goalType: "handicap" | "category" | "pro_comparison";
  targetValue: number;
  deadline: string;
  maxWeeklyHours: number;
}
```

---

## 7. Fra Visjon til Kode — Faseplan

### Fase 1: USI v0.1 — Regelbasert (2 uker)
- Implementer `computeUSI()` med enkle vekter (ingen Bayes enda)
- Bruk eksisterende `SG_BENCHMARKS` for HCP-estimering
- Lag en enkel `TrainingPrescription`-generator basert på gap-analyse
- Vis USI på "Statistikk"-siden

### Fase 2: DataGolf-Broen (2 uker)
- Bygg amateur-to-pro mapping-tabell
- Integrer `vsTourAvgPct` i benchmark-siden
- Lag "HCP-prognose"-chart med prediktiv kurve

### Fase 3: ML-Submodeller (4 uker)
- Samle treningsdata og resultater fra alle brukere
- Tren Random Forest: `TrackMan → SG_OTT/SG_APP`
- Tren XGBoost meta-learner: ` kombinert data → HCP `
- Erstatt regelbasert USI med ensemble-modell

### Fase 4: Bayesiansk Kalman-Filter (4 uker)
- Implementer state-space model for tidsvarierende skill
- Legg til Empirical Bayes-shrinkage på støyfulle kilder
- Implementer dynamisk treningsplan-optimalisering

### Fase 5: Full Autonomi — "AI Coach 2.0" (4 uker)
- MCP-agent med tilgang til USI og treningspreskripsjon
- Auto-genererte tester basert på usikkerhet i θ
- Personaliserte kurs basert på θ-dimensjoner

---

## 8. Konkurransedyktige Fordeler

### Hva som gjør dette unikt:

1. **DataGolf + TrackMan + Mental + Training = én modell**
   - Ingen andre golfplattformer kombinerer alle disse kildene matematisk.

2. **Latent skill fremfor rå SG**
   - Vi estimerer "ekte ferdighet", ikke bare støyfulle runderesultater.

3. **Prediktiv treningsplanlegging**
   - Vi sier ikke bare "du er svak på approach" — vi sier "hvis du trener 3t approach denne uken, er forventet HCP-reduksjon 0.3".

4. **Proff-sammenligning som er matematisk gyldig**
   - Vår bro fra amatør-SG til DataGolf-proff-SG gir meningsfulle sammenligninger på tvers av nivå.

5. **Selvforbedrende**
   - Jo flere brukere og jo mer data, jo bedre blir ML-mappingene.

---

## 9. Oppsummering

> **Spørsmålet var: "Hvordan gjør man dette matematisk, og hvilke muligheter finnes med DataGolf?"**

**Svar:**
- Matematisk bygger vi en **Bayesiansk latent variabel-modell (USI)** som fusjonerer Strokes Gained, TrackMan, tester, mental scorecard og treningsdata til én prediktiv skill-vektor.
- **DataGolf** gir oss verdens beste proff-benchmark, men vi må bygge en **amatør-proff-bro** via spline-interpolering av våre A-K-kategorier.
- Treningsplanlegging blir et **optimaliseringsproblem** der vi finner gradienten av USI per trenings time, og allokerer trening der avkastningen er høyest.
- Veien fra nå til mål går via: regelbasert USI → DataGolf-integrasjon → ML-submodeller → Bayesiansk filter → autonom AI-coach.

**Neste steg:** Bestem om vi skal starte med **Fase 1 (regelbasert USI + HCP-estimering)** umiddelbart.
