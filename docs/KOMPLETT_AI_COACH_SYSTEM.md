# AI Coach System — Komplett Dokumentasjon
## Treningsplanlegger, Treningsanalyse & AI-Drevet Planlegging

**Versjon:** 1.0  
**Dato:** 13. april 2026  
**Forfatter:** AK Golf Group  

---

## INNHOLDSFORTEGNELSE

1. [Eksisterende Funksjonalitet](#1-eksisterende-funksjonalitet)
2. [AI Coach Datainnsamling](#2-ai-coach-datainnsamling)
3. [Baneanalyse & Vanskelighetsgrad](#3-baneanalyse--vanskelighetsgrad)
4. [Score Estimering på Kjente Baner](#4-score-estimering-på-kjente-baner)
5. [Treningsfasilitetsanalyse](#5-treningsfasilitetsanalyse)
6. [AI Treningsplan Generator](#6-ai-treningsplan-generator)
7. [Integrasjon & Dataflyt](#7-integrasjon--dataflyt)

---

## 1. EKSISTERENDE FUNKSJONALITET

### 1.1 Treningsplanlegger (Backend 100% Operativ)

#### Kjernekomponenter

| Komponent | Beskrivelse | Status |
|-----------|-------------|--------|
| **TrainingPlan** | Overordnet plan med periodisering | ✅ |
| **TrainingPlanWeek** | Ukesvis planlegging med fokus | ✅ |
| **TrainingPlanSession** | Daglige økter med øvelser | ✅ |
| **TrainingLog** | Loggført gjennomføring | ✅ |
| **TrainingLogExercise** | Per-øvelse detaljer | ✅ |

#### AK-Formel Integrasjon

Hver økt kodes med:
- **Pyramide:** FYS → TEK → SLAG → SPILL → TURN
- **Område:** TEE, INN200, INN150, INN100, INN50, CHIP, PITCH, etc.
- **L-Fase:** KROPP, ARM, KØLLE, BALL, AUTO
- **CS:** Club Speed % (20-100%)
- **Miljø (M):** 0-5 (Isolert → Konkurranse)
- **Press (PR):** 1-5 (Ingen → Maks)
- **P-Posisjon:** P1-P9 (svingposisjoner)

**Eksempel økt-ID:**
```
SLAG_INN100_L-BALL_CS80_M3_PR3_P6-P7
```

#### Funksjoner

| Funksjon | Beskrivelse |
|----------|-------------|
| `createManualPlan()` | Opprette plan med uker og økter |
| `getActivePlan()` | Hente aktiv plan |
| `addExerciseToSession()` | Legge til øvelse |
| `toggleSessionComplete()` | Markere fullført |
| `saveSessionProgress()` | Lagre fremdrift (reps, score, rating) |
| `logSessionWithExercises()` | Detaljert logging |
| `repeatLastSession()` | Gjenta siste økt |

---

### 1.2 Treningsanalyse (Backend 100% Operativ)

#### Statistikkmoduler

| Modul | Data | Visualisering |
|-------|------|---------------|
| **KPI-rad** | Snitt score, HCP, Runder, SG Total | Tall med trend-piler |
| **SG-barer** | Tee/Approach/Short/Putting | Horisontale barer |
| **Score-trend** | Utvikling over tid | Sparkline |
| **Treningsvolum** | Minutter per kategori | Stacked bar |
| **Konsistens-heatmap** | Aktivitet 84 dager | GitHub-stil rutenett |
| **HCP-utvikling** | 12 måneder | Linjediagram |
| **Radar-diagram** | SG vs Tour-snitt | 4-akset radar |

#### Datamodeller

**RoundStats (per runde):**
- totalScore, scoreToPar
- sgTotal, sgOffTheTee, sgApproach, sgAroundGreen, sgPutting
- drivingDistance, fairwaysHit, fairwaysTotal
- gir, girTotal, putts, proxToHole
- approach100, approach150, approach200

---

## 2. AI COACH DATAINNSAMLING

### 2.1 Spillerprofil (Basisdata)

```typescript
interface PlayerProfile {
  // Demografi
  name: string;
  age: number;              // Viktig for aldersjustering
  gender: 'M' | 'F';        // Påvirker distanse-normer
  height: number;           // cm
  weight: number;           // kg
  dominantHand: 'right' | 'left';
  
  // Golf-historie
  yearsPlaying: number;
  handicap: number;         // Nåværende
  handicapTrend: number;    // Endring siste 12 mnd
  averageScore: number;     // Siste 20 runder
  bestScore: number;
  
  // Spillemønster
  homeCourse: string;       // Hjemmebane
  averageCourseLength: number;  // Meter
  roundsPerMonth: number;
  
  // Mål
  targetHandicap: number;
  targetDate: Date;
  primaryGoal: 'competition' | 'social' | 'improvement';
}
```

### 2.2 Siste 15 Runder (Detaljert Analyse)

```typescript
interface RoundHistory {
  rounds: {
    date: Date;
    course: string;
    courseLength: number;      // Meter
    courseRating: number;      // CR (hvis tilgjengelig)
    slopeRating: number;       // Slope (hvis tilgjengelig)
    
    // Score
    totalScore: number;
    scoreToPar: number;
    
    // Nøkkel-stats
    fairwaysHit: number;
    fairwaysTotal: number;
    gir: number;
    girTotal: number;
    putts: number;
    
    // Strokes Gained
    sgTotal: number;
    sgOffTheTee: number;
    sgApproach: number;
    sgAroundGreen: number;
    sgPutting: number;
    
    // Avstander
    drivingDistance: number;
    proxToHole: number;        // Gj.sn. avstand fra hull
    
    // DECADE
    strategyAdherence: number; // %
    mentalScorecard?: MentalScorecard; // Hvis tilgjengelig
  }[];
}
```

---

## 3. BANEANALYSE & VANSKELIGHETSGRAD

### 3.1 Banevurderingsalgoritme

For hver runde spilleren har spilt, beregnes:

```typescript
interface CourseAnalysis {
  // Innsamlet data
  courseName: string;
  courseLength: number;        // Meter
  totalPar: number;            // 70, 71, 72
  
  // Beregnede verdier
  estimatedCourseRating: number;   // F.eks. 71.2
  estimatedSlopeRating: number;    // F.eks. 128
  difficultyIndex: number;         // 0-100 (100 = hardest)
  
  // Spillerens prestasjon
  playerAverageScore: number;
  playerAverageToPar: number;
  
  // Normalisert score (som om banen var Par 72, 6000m)
  normalizedScore: number;     // Juster for lengde/vanskelighet
}
```

### 3.2 Estimering av CR/Slope

Når offisielle rating ikke finnes:

```typescript
function estimateCourseDifficulty(
  courseLength: number,    // Meter
  totalPar: number,        // 70-72
  terrainType: 'flat' | 'rolling' | 'hilly',
  waterHazards: 'few' | 'moderate' | 'many',
  bunkers: 'few' | 'moderate' | 'many',
  treeLining: 'open' | 'moderate' | 'tight'
): { courseRating: number; slopeRating: number } {
  
  // Basert på lengde (Par 72)
  const lengthBase = courseLength < 5500 ? 68.0 :
                     courseLength < 6000 ? 70.0 :
                     courseLength < 6500 ? 71.5 :
                     courseLength < 7000 ? 73.0 : 74.5;
  
  // Juster for terreng
  const terrainAdj = terrainType === 'flat' ? 0 :
                     terrainType === 'rolling' ? 0.5 : 1.0;
  
  // Juster for hindere
  const hazardAdj = (waterHazards === 'many' ? 0.8 : 0) +
                    (bunkers === 'many' ? 0.4 : 0) +
                    (treeLining === 'tight' ? 0.6 : 0);
  
  const courseRating = lengthBase + terrainAdj + hazardAdj;
  
  // Slope (113 = normal)
  const slopeBase = 113;
  const slopeAdj = Math.round((courseRating - 68) * 8);
  const slopeRating = Math.min(155, Math.max(85, slopeBase + slopeAdj));
  
  return { courseRating, slopeRating };
}
```

### 3.3 Normalisering av Score

```typescript
function normalizeScore(
  actualScore: number,
  courseRating: number,
  slopeRating: number,
  targetCR: number = 72.0,    // Standard referanse
  targetSlope: number = 113   // Normal slope
): number {
  // Differanse Course Rating
  const crDiff = targetCR - courseRating;
  
  // Slope-faktor
  const slopeFactor = targetSlope / slopeRating;
  
  // Normalisert score
  const normalized = (actualScore - crDiff) * slopeFactor;
  
  return Math.round(normalized * 10) / 10;
}
```

**Eksempel:**
- Spiller: 85 slag på hjemmebane
- Hjemmebane: 5200m, Par 70, CR 68.5, Slope 115
- Normalisert: (85 - (-3.5)) * (113/115) = **82.2**

Dette betyr: Spilleren presterer som en 82-spiller på standardbane.

---

## 4. SCORE ESTIMERING PÅ KJENTE BANER

### 4.1 Referansebaner Database

```typescript
const REFERENCE_COURSES = {
  AUGUSTA_NATIONAL: {
    name: "Augusta National Golf Club",
    location: "Augusta, Georgia, USA",
    lengthMeter: 6850,
    par: 72,
    courseRating: 76.2,
    slopeRating: 148,
    difficulty: "Extreme",
    characteristics: {
      greens: "Lightning fast, severe slopes",
      fairways: "Wide but strategic",
      rough: "Second cut punishing",
      bunkers: "White sand, steep faces",
      water: "On 6 holes, critical on 11-13-15-16"
    }
  },
  
  ST_ANDREWS_OLD: {
    name: "St Andrews Old Course",
    location: "St Andrews, Scotland",
    lengthMeter: 6450,
    par: 72,
    courseRating: 73.1,
    slopeRating: 132,
    difficulty: "High",
    characteristics: {
      greens: "Large, undulating, double greens",
      fairways: "Wide but with strategy",
      rough: "Heavy in summer",
      bunkers: "Deep pot bunkers",
      weather: "Wind is major factor"
    }
  },
  
  BAY_HILL: {
    name: "Bay Hill Club & Lodge",
    location: "Orlando, Florida, USA",
    lengthMeter: 6650,
    par: 72,
    courseRating: 74.8,
    slopeRating: 143,
    difficulty: "High",
    characteristics: {
      greens: "Fast, sloping towards water",
      fairways: "Tree-lined, demanding",
      rough: "Thick Bermuda",
      water: "On 15 of 18 holes"
    }
  },
  
  // Norske referansebaner
  MIKLAGARD: {
    name: "Miklagard Golf",
    location: "Kløfta, Norge",
    lengthMeter: 6200,
    par: 72,
    courseRating: 71.5,
    slopeRating: 128,
    difficulty: "Medium-High"
  },
  
  OSLO_GK: {
    name: "Oslo Golfklubb",
    location: "Bogstad, Norge",
    lengthMeter: 6100,
    par: 71,
    courseRating: 70.8,
    slopeRating: 126,
    difficulty: "Medium"
  }
};
```

### 4.2 Score Estimeringsalgoritme

```typescript
interface EstimatedScore {
  course: string;
  expectedScore: number;
  scoreRange: { low: number; high: number };
  confidence: number;        // 0-100%
  breakdown: {
    par3Average: number;
    par4Average: number;
    par5Average: number;
  };
  reasoning: string[];
}

function estimateScoreOnCourse(
  playerProfile: PlayerProfile,
  roundHistory: RoundHistory,
  targetCourse: ReferenceCourse
): EstimatedScore {
  
  // 1. Beregn spillerens "true ability"
  const normalizedScores = roundHistory.rounds.map(r => 
    normalizeScore(r.totalScore, r.courseRating, r.slopeRating)
  );
  const trueAbility = normalizedScores.reduce((a,b) => a+b, 0) / normalizedScores.length;
  
  // 2. Juster for banekarakteristikk
  let adjustment = 0;
  
  // Lengde
  const lengthDiff = targetCourse.lengthMeter - playerProfile.averageCourseLength;
  adjustment += (lengthDiff / 100) * 0.8;  // 0.8 slag per 100m
  
  // Vanskelighet
  const playerHomeSlope = roundHistory.rounds[0]?.slopeRating || 113;
  const slopeDiff = targetCourse.slopeRating - playerHomeSlope;
  adjustment += (slopeDiff / 10) * 1.5;  // 1.5 slag per 10 slope-poeng
  
  // CR-diff
  const playerHomeCR = roundHistory.rounds[0]?.courseRating || 72;
  const crDiff = targetCourse.courseRating - playerHomeCR;
  adjustment += crDiff;
  
  // 3. Spesifikke ferdigheter
  const sgData = calculateAverageSG(roundHistory);
  
  // Augusta krever god approach (raske greener)
  if (targetCourse.name.includes('Augusta')) {
    if (sgData.approach < -0.5) adjustment += 3;  // Straff for svak approach
    if (sgData.putting < -0.3) adjustment += 2;   // Straff for svak putting
  }
  
  // St Andrews krever god short game (vind, pot bunkers)
  if (targetCourse.name.includes('St Andrews')) {
    if (sgData.aroundGreen < -0.5) adjustment += 3;
    if (sgData.offTheTee < -0.5) adjustment += 2;  // Viktig å unngå pot bunkers
  }
  
  // Bay Hill krever nøyaktighet (vann)
  if (targetCourse.name.includes('Bay Hill')) {
    if (sgData.approach < -0.5) adjustment += 2;
    if (sgData.offTheTee < -0.5) adjustment += 2;
  }
  
  // 4. Beregn estimert score
  const expectedScore = trueAbility + adjustment;
  const variance = calculateVariance(normalizedScores);
  
  return {
    course: targetCourse.name,
    expectedScore: Math.round(expectedScore),
    scoreRange: {
      low: Math.round(expectedScore - variance),
      high: Math.round(expectedScore + variance)
    },
    confidence: Math.round((1 - (variance / 10)) * 100),
    breakdown: {
      par3Average: estimatePar3Score(playerProfile, targetCourse),
      par4Average: estimatePar4Score(playerProfile, targetCourse),
      par5Average: estimatePar5Score(playerProfile, targetCourse)
    },
    reasoning: generateReasoning(playerProfile, targetCourse, adjustment)
  };
}
```

### 4.3 Eksempel: Freddrik Fredriksen

```
╔══════════════════════════════════════════════════════════════════╗
║     SCORE ESTIMERING: FREDRik FREDRiKSEN                         ║
║     HCP 16.2 | Snitt 85 | Hjemmebane: 5200m                      ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  BASERT PÅ DINE 15 SISTE RUNDER:                                ║
║  • Normalisert snitt: 82.2 (justert for banelengde)             ║
║  • Variance: ±4.3 slag                                          ║
║  • Sterkeste: Putting (SG -0.2)                                 ║
║  • Svakeste: Approach (SG -0.8) ⚠️                              ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  ⛳ AUGUSTA NATIONAL (6850m, CR 76.2, Slope 148)                 ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │                                                        │     ║
║  │  Forventet score:              94 slag (+22)          │     ║
║  │  Range:                        90-98 slag             │     ║
║  │  Konfidens:                    72%                     │     ║
║  │                                                        │     ║
║  │  HULL-TYPE:                                            │     ║
║  │  • Par 3 (4 stk):     Gj.sn. 4.2 (bogey+)             │     ║
║  │  • Par 4 (10 stk):    Gj.sn. 5.1 (+1.1)               │     ║
║  │  • Par 5 (4 stk):     Gj.sn. 5.8 (+0.8)               │     ║
║  │                                                        │     ║
║  │  🚨 UTFORDRINGER:                                      │     ║
║  │  • Raske greener krever bedre approach (+3 slag)      │     ║
║  │  • Lengde: +1650m vs din hjemmebane (+13 slag)        │     ║
║  │  • Slope 148 vs 115 (+5 slag)                         │     ║
║  │                                                        │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  ⛳ ST ANDREWS OLD COURSE (6450m, CR 73.1, Slope 132)            ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │                                                        │     ║
║  │  Forventet score:              88 slag (+16)          │     ║
║  │  Range:                        84-92 slag             │     ║
║  │  Konfidens:                    78%                     │     ║
║  │                                                        │     ║
║  │  🟢 MULIGHETER:                                        │     ║
║  │  • Brede fairways passer din driver (+2 vs tight)     │     ║
║  │  • Vind: Kan påvirke negativt (hvis sterk)            │     ║
║  │                                                        │     ║
║  │  ⚠️ UTFORDRINGER:                                      │     ║
║  │  • Pot bunkers krever god short game (+3 slag)        │     ║
║  │  • Store greener krefer putting-presisjon             │     ║
║  │                                                        │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  ⛳ BAY HILL (6650m, CR 74.8, Slope 143)                         ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │                                                        │     ║
║  │  Forventet score:              91 slag (+19)          │     ║
║  │  Range:                        87-95 slag             │     ║
║  │  Konfidens:                    75%                     │     ║
║  │                                                        │     ║
║  │  🚨 STØRSTE RISIKO: Vann på 15 av 18 hull              │     ║
║  │  • Din SG Approach -0.8 vil straffe deg hardt         │     ║
║  │  • Råd: Spill konservativt, aksepter høyere score     │     ║
║  │                                                        │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 5. TRENINGSFASILITETSANALYSE

### 5.1 Fasilitetsinventar

```typescript
interface TrainingFacilities {
  // Teknologi
  technology: {
    hasTrackMan: boolean;
    trackManType: 'outdoor' | 'simulator' | 'both' | 'none';
    hasFlightScope: boolean;
    hasGarminR10: boolean;
    videoAnalysis: boolean;
  };
  
  // Driving Range
  drivingRange: {
    available: boolean;
    maxDistance: number;           // Meter (hvor langt kan man slå?)
    ballQuality: 'range' | 'premium' | 'tournament';
    hasTargets: boolean;
    hasFlags: boolean;
    covered: boolean;
    lighting: boolean;
  };
  
  // Nærspill
  shortGame: {
    chippingGreen: boolean;
    chippingAreaSize: number;      // kvm (ca.)
    maxChipDistance: number;       // Meter
    hasBunker: boolean;
    bunkerType: 'practice' | 'course' | 'none';
    lobArea: boolean;              // Plass til høye slag?
  };
  
  // Putting
  putting: {
    greenAvailable: boolean;
    greenSize: number;             // kvm (ca.)
    maxPuttDistance: number;       // Meter
    greenSpeed: 'slow' | 'medium' | 'fast' | 'tournament';
    hasMultipleHoles: boolean;
    hasSlopes: boolean;
  };
  
  // Bane-tilgang
  courseAccess: {
    hasShortCourse: boolean;       // Par 3, korthullsbane
    shortCourseHoles: number;
    canPlayAlone: boolean;
    practiceHoles: boolean;        // Lov til å spille flere baller?
    twilightRates: boolean;
  };
  
  // Innendørs
  indoor: {
    simulator: boolean;
    simulatorCourses: string[];
    puttingGreen: boolean;
    gymAccess: boolean;
  };
}
```

### 5.2 Fasilitets-Score & Begrensninger

```typescript
interface FacilityScore {
  overallScore: number;          // 0-100
  categoryScores: {
    technology: number;          // 0-100
    drivingRange: number;
    shortGame: number;
    putting: number;
    courseAccess: number;
    indoor: number;
  };
  
  // Begrensninger som påvirker trening
  limitations: {
    maxDriverDistance: number;   // Kan ikke teste driver hvis range er kort
    maxChipDistance: number;     // Begrenset nærspill
    shortGameQuality: 'limited' | 'adequate' | 'excellent';
    puttingRealism: number;      // 0-100 (sammenlignet med banen)
  };
  
  // Anbefalinger
  recommendations: {
    drillsThatWork: string[];    // Øvelser som passer fasilitetene
    drillsToAvoid: string[];     // Øvelser som ikke er mulige
    alternativeSolutions: string[]; // Work-arounds
  };
}

function analyzeFacilities(facilities: TrainingFacilities): FacilityScore {
  const scores = {
    technology: facilities.technology.hasTrackMan ? 100 : 
                facilities.technology.hasFlightScope ? 80 : 
                facilities.technology.videoAnalysis ? 60 : 40,
    
    drivingRange: facilities.drivingRange.maxDistance > 250 ? 100 :
                  facilities.drivingRange.maxDistance > 200 ? 80 :
                  facilities.drivingRange.maxDistance > 150 ? 60 : 40,
    
    shortGame: facilities.shortGame.hasBunker && facilities.shortGame.lobArea ? 100 :
               facilities.shortGame.hasBunker ? 80 :
               facilities.shortGame.chippingGreen ? 60 : 40,
    
    putting: facilities.putting.greenSpeed === 'tournament' ? 100 :
             facilities.putting.greenSpeed === 'fast' ? 80 :
             facilities.putting.greenSpeed === 'medium' ? 60 : 40,
    
    courseAccess: facilities.courseAccess.hasShortCourse ? 100 :
                  facilities.courseAccess.practiceHoles ? 80 : 50,
    
    indoor: facilities.indoor.simulator ? 100 :
            facilities.indoor.puttingGreen ? 70 : 40
  };
  
  const overall = Object.values(scores).reduce((a,b) => a+b, 0) / 6;
  
  return {
    overallScore: Math.round(overall),
    categoryScores: scores,
    limitations: calculateLimitations(facilities),
    recommendations: generateRecommendations(facilities, scores)
  };
}
```

### 5.3 Eksempel: Fasilitetsanalyse

```
╔══════════════════════════════════════════════════════════════════╗
║           DIN TRENINGSFASILITET                                  ║
║           Golfklubb: Losby GK                                    ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  SAMLET SCORE: 72/100 (Bra)                                     ║
║                                                                  ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │  KATEGORI              SCORE     STATUS                │     ║
║  ├────────────────────────────────────────────────────────┤     ║
║  │  🖥️ Teknologi          85/100    ✅ TrackMan Outdoor   │     ║
║  │  ⛳ Driving Range       70/100    ✅ 230m (OK)          │     ║
║  │  🏝️ Nærspill            75/100    ✅ Bunker + Pitch     │     ║
║  │  ⭕ Putting             80/100    ✅ God green          │     ║
║  │  🏌️ Bane-tilgang        50/100    ⚠️ Korthullsbane?     │     ║
║  │  🏠 Innendørs           60/100    ✅ Simulator          │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  BEGRENSNINGER:                                                 ║
║  ⚠️ Maks driver: 230m (ikke nok for å teste full driver)        ║
║  ⚠️ Range baller: Standard (flyr 10% kortere enn Pro V1)        ║
║  ⚠️ Korthullsbane: Nei (begrenser spill-trening)                ║
║                                                                  ║
║  ANBEFALINGER:                                                  ║
║  🟢 GODE ØVELSER FOR DINE FASILITETER:                          ║
║  • TrackMan-testing av approach (100-150m)                      ║
║  • Bunker-teknikk (du har god bunker)                           ║
║  • Putting fra 3-6m (realistisk green)                          ║
║                                                                  ║
║  🔴 ØVELSER SOM IKKE FUNGERER:                                  ║
║  • Full driver-testing (range for kort)                         ║
║  • 200m+ innspill (må gjøres på bane)                           ║
║                                                                  ║
║  💡 ALTERNATIVER:                                               ║
║  • Bruk simulator for driver-testing                            ║
║  • Spill treningsrunder for langt spill (200m+)                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 6. AI TRENINGSPLAN GENERATOR

### 6.1 Input-Parametere

```typescript
interface AITrainingPlanRequest {
  // Spillerdata (obligatorisk)
  playerProfile: PlayerProfile;
  
  // Historikk (obligatorisk)
  roundHistory: RoundHistory;
  
  // Fasiliteter (obligatorisk)
  facilities: TrainingFacilities;
  
  // Tilgjengelighet (obligatorisk)
  availability: {
    hoursPerWeek: number;        // 2, 3, 4, 5, 6, 8, 10+
    preferredSessionLength: number;  // 30, 60, 90, 120 min
    availableDays: string[];     // ['monday', 'wednesday', 'friday']
    preferredTimes: string[];    // ['morning', 'evening']
  };
  
  // Mål (obligatorisk)
  goals: {
    targetHandicap: number;
    targetDate: Date;
    priorityAreas: string[];     // ['approach', 'putting']
  };
  
  // Valgfritt
  constraints?: {
    injuries?: string[];
    focusPreference?: 'technical' | 'performance' | 'competition';
    coachNotes?: string;
  };
}
```

### 6.2 AI Analyse & Beslutning

```typescript
interface AITrainingAnalysis {
  // Styrker & Svakheter
  strengthWeakness: {
    strengths: Array<{
      area: string;
      sgValue: number;
      percentile: number;
    }>;
    weaknesses: Array<{
      area: string;
      sgValue: number;
      priority: number;          // 1-5 (1 = høyest prioritet)
      estimatedImprovement: number;  // SG-gain potensial
    }>;
  };
  
  // Tidsallokering
  timeAllocation: {
    priorityArea: string;        // F.eks. 'APPROACH'
    secondaryArea: string;
    maintenanceArea: string;
    percentages: {
      priority: number;          // F.eks. 50%
      secondary: number;         // F.eks. 30%
      maintenance: number;       // F.eks. 20%
    };
  };
  
  // Fasilitets-tilpasning
  facilityAdaptations: {
    drillsToInclude: string[];
    drillsToModify: Array<{
      original: string;
      modification: string;
      reason: string;
    }>;
    alternativeVenues: string[];
  };
  
  // Progresjon
  progression: {
    phase1: { weeks: number; focus: string; target: string };
    phase2: { weeks: number; focus: string; target: string };
    phase3: { weeks: number; focus: string; target: string };
  };
  
  // Forventet resultat
  projectedOutcome: {
    estimatedHandicapIn3Months: number;
    estimatedHandicapIn6Months: number;
    confidenceLevel: number;     // 0-100%
    keyMilestones: string[];
  };
}
```

### 6.3 Plan-Genereringsalgoritme

```typescript
async function generateAITrainingPlan(
  request: AITrainingPlanRequest
): Promise<TrainingPlan> {
  
  // 1. Analyser svakheter
  const weaknessAnalysis = await analyzeWeaknesses(
    request.playerProfile,
    request.roundHistory
  );
  
  // 2. Analyser fasiliteter
  const facilityAnalysis = analyzeFacilities(request.facilities);
  
  // 3. Beregn tidsallokering
  const timeAllocation = calculateOptimalTimeAllocation(
    weaknessAnalysis,
    request.availability.hoursPerWeek
  );
  
  // 4. Generer øvelser basert på:
  //    - Svakheter
  //    - Fasiliteter
  //    - AK-formelen (Pyramide, L-fase, etc.)
  const drills = await generateDrills({
    targetAreas: [timeAllocation.priorityArea, timeAllocation.secondaryArea],
    facilities: request.facilities,
    playerCategory: getPlayerCategory(request.playerProfile.averageScore),
    availableTime: request.availability.preferredSessionLength
  });
  
  // 5. Lag ukeplan
  const weeklySchedule = buildWeeklySchedule({
    drills,
    timeAllocation,
    availability: request.availability,
    facilityConstraints: facilityAnalysis.limitations
  });
  
  // 6. Sett mål og milepæler
  const goals = defineGoals({
    playerProfile: request.playerProfile,
    targetHandicap: request.goals.targetHandicap,
    weaknessAnalysis
  });
  
  // 7. Generer plan-struktur
  return {
    title: `AI Plan: ${request.playerProfile.name} - ${timeAllocation.priorityArea} Focus`,
    description: generatePlanDescription(weaknessAnalysis, timeAllocation),
    periodType: determinePeriodType(request.playerProfile),
    startDate: new Date(),
    endDate: addMonths(new Date(), 3),
    weeks: buildPlanWeeks(weeklySchedule, goals),
    projectedOutcome: calculateProjectedOutcome(
      request.playerProfile,
      weaknessAnalysis,
      request.goals
    )
  };
}
```

### 6.4 Eksempel: Freddrik's AI-Genererte Plan

```
╔══════════════════════════════════════════════════════════════════╗
║     AI TRENINGSPLAN: FREDRik FREDRiKSEN                          ║
║     Generert: 13. april 2026                                     ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  DIN SITUASJON:                                                  ║
║  • Kategori: F (HCP 16.2)                                        ║
║  • Hovedsvakhet: Approach fra 90-120m (SG -0.8)                 ║
║  • Tilgjengelig tid: 4 timer/uke                                 ║
║  • Fasiliteter: TrackMan, 230m range, godt nærspill              ║
║                                                                  ║
║  MÅL: HCP 13 innen 1. september 2026 (20 uker)                   ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  🎯 TIDSALLOKERING (4t/uke):                                     ║
║                                                                  ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │  APPROACH (50%)        ██  2t/uke  |  PR3-PR4           │     ║
║  │  Mål: 90-120m presisjon, reduser miss mot hinder       │     ║
║  │                                                        │     ║
║  │  SHORT GAME (25%)      █   1t/uke  |  PR2-PR3          │     ║
║  │  Mål: Scrambling 35% → 45%                             │     ║
║  │                                                        │     ║
║  │  PUTTING (15%)         ▌   36min/uke | PR2             │     ║
║  │  Mål: Vedlikeholde (allerede sterk)                    │     ║
║  │                                                        │     ║
║  │  PLAY (10%)            ▌   24min/uke | M4-PR3          │     ║
║  │  Mål: 9 hull med mental scorecard                      │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  📅 UKESPLAN (Eksempel uke 1):                                   ║
║                                                                  ║
║  MANDAG (60 min) - TrackMan Økt:                                ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │  Oppvarming (10 min)                                   │     ║
║  │  • 10 slag PW, fokus på rytme                          │     ║
║  │                                                        │     ║
║  │  Hoveddel (40 min)                                     │     ║
║  │  • "100m Precision Challenge"                          │     ║
║  │    - 30 slag mot 100m target                           │     ║
║  │    - Target: 6m radius (mål: 40% treff)                │     ║
║  │    - Miljø: M3 (bane-lignende)                         │     ║
║  │    - Press: PR3 (konkurranse mot seg selv)             │     ║
║  │    - AK-Formel: SLAG_INN100_L-BALL_CS80_M3_PR3         │     ║
║  │                                                        │     ║
║  │  Test (10 min)                                         │     ║
║  │  • Registrer score i appen                             │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  ONSDAG (60 min) - Nærspill:                                    ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │  "Up-and-Down Challenge" (50 min)                      │     ║
║  │  • 10 baller rundt green (tilfeldige posisjoner)       │     ║
║  │  • Mål: 4/10 up-and-down (40%)                         │     ║
║  │  • Fokus: Landingssone, ikke flagg                     │     ║
║  │                                                        │     ║
║  │  AK-Formel: SLAG_CHIP_L-BALL_CS70_M3_PR3               │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  TORSDAG (60 min) - Putting:                                    ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │  "Clock Drill" + "Lag Putting"                         │     ║
║  │  • 8 putter 1.5m (alle retninger)                      │     ║
║  │  • 10 putter 8m (avstandskontroll)                     │     ║
║  │  • AK-Formel: SLAG_PUTT_L-AUTO_CS60_M2_PR2             │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  LØRDAG (60 min) - Bane med Mental Scorecard:                   ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │  Spill 9 hull på Losby GK                              │     ║
║  │  • Fokus: Approach-slag (hull 3, 7, 12, 15)            │     ║
║  │  • Mål: Fullfør mental scorecard på alle approach      │     ║
║  │  • Etterpå: Gjennomgang med AI Coach                   │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  📈 PROGRESJON (20 uker):                                        ║
║                                                                  ║
║  FASE 1 (Uke 1-4): Grunnlag                                      ║
║  • Fokus: Teknisk presisjon 90-120m                              ║
║  • Miljø: M2-M3 (Range → Øvingshull)                             ║
║  • Press: PR2-PR3 (Lavt → Moderat)                               ║
║  • Mål: 35% treffrate på 100m                                    ║
║                                                                  ║
║  FASE 2 (Uke 5-12): Overføring                                   ║
║  • Fokus: Spill-lignende trening                                 ║
║  • Miljø: M3-M4 (Øvingshull → Bane)                              ║
║  • Press: PR3-PR4 (Moderat → Høyt)                               ║
║  • Mål: 45% treffrate, mental stabilitet                         ║
║                                                                  ║
║  FASE 3 (Uke 13-20): Konkurranse                                 ║
║  • Fokus: Turneringssimulering                                   ║
║  • Miljø: M4-M5 (Bane → Konkurranse)                             ║
║  • Press: PR4-PR5 (Høyt → Maks)                                  ║
║  • Mål: Reduser gap trening-konkurranse til < 15%                ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  🎯 FORVENTET RESULTAT:                                          ║
║                                                                  ║
║  HCP Utvikling:                                                  ║
║  • Nå: 16.2                                                      ║
║  • Etter 3 mnd: 14.5 (-1.7)                                     ║
║  • Etter 6 mnd: 12.8 (-3.4) 🎯 Mål nådd!                         ║
║                                                                  ║
║  SG Approach:                                                    ║
║  • Nå: -0.8                                                      ║
║  • Etter 6 mnd: -0.3 (+0.5)                                     ║
║                                                                  ║
║  Konfidens: 78% (basert på din treningshistorikk)                ║
║                                                                  ║
║  Hvis du følger planen 80%: 85% sannsynlighet for mål            ║
║  Hvis du følger planen 60%: 55% sannsynlighet for mål            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 7. INTEGRASJON & DATAFLYT

### 7.1 Systemarkitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATAKILDER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Spiller  │  │ TrackMan │  │ UpGame/  │  │ DataGolf │        │
│  │ Input    │  │ Data     │  │ GolfBox  │  │ API      │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
└───────┼─────────────┼─────────────┼─────────────┼───────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA FUSION LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  • Normalisering (alle baner → standard)               │    │
│  │  • Gap-analyse (Spiller vs Tour)                       │    │
│  │  • Mønster-gjenkjenning (trender)                      │    │
│  │  • Bane-vurdering (CR/Slope estimering)                │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI ANALYSE ENGINE                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Svakhets-    │  │ Score-       │  │ Fasilitets-          │  │
│  │ analyse      │  │ estimering   │  │ analyse              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
│         └─────────────────┼──────────────────────┘              │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              AI COACH DECISION ENGINE                     │  │
│  │  • Hva skal prioriteres?                                 │  │
│  │  • Hvordan allokere tid?                                 │  │
│  │  • Hvilke øvelser passer?                                │  │
│  │  • Hva er realistiske mål?                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      OUTPUT                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Trenings-    │  │ Score-       │  │ Mental               │  │
│  │ plan         │  │ estimater    │  │ scorecard            │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Dataflyt: Ny Spiller

```
1. SPILLER REGISTRERER SEG
   ↓
   - Fyller profil (alder, kjønn, HCP, mål)
   - Kobler TrackMan (hvis tilgjengelig)
   - Importerer runder (UpGame/GolfBox/manuell)
   - Beskriver fasiliteter
   ↓
2. AI ANALYSE (Automatisk)
   ↓
   - Analyserer siste 15 runder
   - Estimerer banerating for spilte baner
   - Normaliserer scores
   - Beregner SG per kategori
   - Sammenligner med Tour-data
   ↓
3. SCORE ESTIMATER (Genereres)
   ↓
   - Augusta National: 94 slag (+22)
   - St Andrews: 88 slag (+16)
   - Bay Hill: 91 slag (+19)
   - Din hjemmebane: 85 slag (+13)
   ↓
4. FASILITETSANALYSE (Genereres)
   ↓
   - Score: 72/100
   - Begrensninger identifisert
   - Anbefalte øvelser
   ↓
5. AI TRENINGSPLAN (Genereres)
   ↓
   - Prioritert område: Approach
   - Tidsallokering: 4t/uke
   - 20-ukers progresjon
   - Konkrete øvelser med AK-formel
   ↓
6. SPILLER GODTAR PLAN
   ↓
   - Plan legges inn i treningsplanlegger
   - Push-varsler aktiveres
   - Mental scorecard kobles til "Spill"-økter
   ↓
7. LØPENDE TILPASNING
   ↓
   - Etter hver økt: AI justerer basert på resultat
   - Etter hver runde: Mental scorecard analyseres
   - Hver uke: Coach-evaluering og justering
```

---

## OPPSUMMERING

Dette systemet kombinerer:

1. **Eksisterende infrastruktur** (Treningsplanlegger, treningsanalyse)
2. **Avansert analyse** (Banevurdering, score-normalisering)
3. **Tour-data** (DataGolf integrasjon)
4. **Personlig tilpasning** (Fasiliteter, tilgjengelighet, mål)
5. **AI-drevet planlegging** (Automatisk generering av treningsplaner)
6. **Mental trening** (Obligatorisk scorecard for spill/konkurranse)

Resultat: En komplett coaching-opplevelse som kjenner spilleren, tilpasser seg fasilitetene, og gir personlig veiledning basert på data - ikke gjetting.

---

**Er dette konseptet i tråd med din visjon? Skal vi gå dypere på noen av delene?**
