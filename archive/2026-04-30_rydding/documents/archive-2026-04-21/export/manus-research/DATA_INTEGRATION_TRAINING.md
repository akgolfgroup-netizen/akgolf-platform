# Data Integrasjon: Treningsplanlegger & Analyse
## Hvordan kombinere DataGolf API + App-data for verdens beste coaching

---

## 📊 Eksisterende Datakilder (I Dag)

### 1. App-data (Allerede tilgjengelig)
```typescript
// TrainingLog
{
  focusArea: "APPROACH",
  durationMinutes: 45,
  rating: 8,
  notes: "God kontakt på 8-jern",
  deviatedFromPlan: false
}

// RoundStats
{
  sgTotal: -1.2,
  sgOffTheTee: -0.3,
  sgApproach: -0.5,      // ← VIKTIG for fokus
  sgAroundTheGreen: -0.2,
  sgPutting: -0.2,
  totalScore: 85
}

// CoachingSession (AI-generert)
{
  aiSummary: "Spilleren sliter med approach fra 100-150m",
  aiFocusAreas: ["APPROACH", "DISTANCE_CONTROL"],
  aiActionItems: ["Øv 100m slag", "Test proximity"]
}
```

### 2. DataGolf Data (Tilgjengelig via API)
```typescript
// Skill Decompositions
{
  player_name: "Scottie Scheffler",
  sg_approach: 0.6,           // +0.6 SG per runde på approach
  sg_total: 1.8
}

// Approach Skill (per avstand)
{
  player_name: "Scottie Scheffler",
  "100-125": 16.2,           // 16.2 feet proximity
  "125-150": 19.8
}

// Historical Rounds (aggregert)
{
  event_name: "The Masters",
  year: 2024,
  round_num: 1,
  sg_approach: 1.2           // SG for denne runden
}
```

---

## 🎯 Integrasjons-Strategi

### Nivå 1: Tour Benchmark Integration (Enkel)
**Hva:** Sammenligne spillerens stats med Tour-gjennomsnitt

```typescript
// I weakness-analysis.ts - Utvidet med DataGolf

interface TourBenchmarkComparison {
  category: string;
  playerValue: number;
  tourMedian: number;
  tourP90: number;
  gapToMedian: number;      // Negativ = under Tour
  gapToP90: number;         // Negativ = under Elite
}

// Eksempel på analyse:
const analysis = {
  playerSG: { approach: -0.5 },
  tourMedian: { approach: 0 },
  tourP90: { approach: 0.6 },
  
  // Gap-beregning
  gapAnalysis: {
    approach: {
      gapToMedian: -0.5,     // Spilleren taper 0.5 slag/runde
      gapToP90: -1.1,        // 1.1 slag fra elite
      estimatedHandicapCost: 2.5  // Ca. 2.5 HCP-poeng
    }
  }
};
```

**Output til spilleren:**
```
DIN APPROACH-ANALYSE
━━━━━━━━━━━━━━━━━━━━

Din SG Approach: -0.5
Tour median: 0.0
Gap: -0.5 slag per runde

Dette koster deg ca. 2.5 handicappoeng!

For å komme til Tour median:
• Øv 100m approach 2x per uke
• Mål: 21 feet proximity (du er på 28 feet)
• Tidsramme: 3-4 måneder med fokusert trening
```

---

### Nivå 2: Predictive Training Plan (Avansert)
**Hva:** Bruk DataGolf + spillerens data til å forutsi fremgang

```typescript
// AI Training Plan med DataGolf-kontekst

interface DataDrivenTrainingPlan {
  // Hvor er spilleren nå?
  currentState: {
    category: 'F',                    // A-K
    sgTotal: -2.1,
    hoursPerWeek: 4,
    lastTestResults: {
      '100m-approach': { proximity: 28, tourScore: 65 }
    }
  };
  
  // Hva sier DataGolf om gap?
  dataGolfInsights: {
    approachGap: -0.8,                // vs kategori E
    priorityRank: 1,                  // #1 område å forbedre
    trainingEfficiency: 0.7           // 0.7 SG per time (historisk)
  };
  
  // Forventet utvikling
  projection: {
    weeksToTarget: 12,
    weeklyImprovement: 0.05,          // SG per uke
    confidence: 0.78                  // 78% sannsynlighet
  };
  
  // Tilpasset plan
  recommendedPlan: {
    focusArea: 'APPROACH',
    timeAllocation: { approach: 50, putting: 20, other: 30 },
    weeklyHours: 4,
    
    // Øvelser basert på gap
    drills: [
      {
        name: "100m Precision Challenge",
        frequency: "2x per uke",
        target: "25 feet proximity → 22 feet",
        source: "DataGolf benchmark for kategori E"
      }
    ]
  };
}
```

**AI Prompt (Claude) med all data:**
```typescript
const prompt = `
Du er en AI golfcoach med tilgang til verdens beste data.

SPILLERENS DATA:
- Kategori: F (HCP 16)
- SG Approach: -0.8 (siste 10 runder)
- Tilgjengelig tid: 4t/uke
- Forrige test: 100m = 28ft proximity (65% Tour Score)

DATAGOLF BENCHMARKS:
- Kategori E (HCP 12): SG Approach = -0.5
- Tour median: SG Approach = 0.0
- Spilleren må forbedre 0.3 SG for neste nivå
- Historisk data viser: 0.7 SG forbedring per 10 timer fokusert trening

ANALYSER:
1. Hvor mange uker trengs for å nå kategori E?
2. Hva er optimal tidsallokering?
3. Hvilke spesifikke øvelser anbefales?

Svar med JSON:
{
  "weeksToTarget": number,
  "timeAllocation": { "approach": %, "putting": %, "other": % },
  "weeklyDrills": [...],
  "confidence": %
}
`;
```

---

### Nivå 3: "What If" Simulator (Ekspert)
**Hva:** Simulere "hvis jeg forbedrer X, hva skjer med Y?"

```typescript
interface WhatIfScenario {
  // Scenario
  changes: {
    improveApproachBy: 0.3,      // +0.3 SG på approach
    improvePuttingBy: 0.2        // +0.2 SG på putting
  };
  
  // Simulering basert på DataGolf-data
  projectedOutcome: {
    newSGTotal: -1.6,             // Fra -2.1
    newHandicap: 13.5,            // Fra 16.2
    scoreImprovement: 3,          // 3 slag per runde
    category: 'E',                // Oppgradering!
    
    // Sammenligning
    tourPercentile: 55,           // Fra 45%
    
    // Bane-spesifikt
    onCourse: {
      averageScore: 82,           // Fra 85
      girPercentage: 32,          // Fra 25%
      puttsPerRound: 33           // Fra 35
    }
  };
  
  // Hva kreves?
  requirements: {
    trainingHours: 40,            // Totalt
    weeks: 16,                    // 4 måneder
    weeklyCommitment: {
      approach: 2.5,              // timer
      putting: 1.0,
      play: 0.5                   // 9 hull
    }
  };
}
```

**UI for spilleren:**
```
🎯 "WHAT IF" SIMULATOR

Dra på sliderne for å se effekten:

[========|========] Approach:  +0.3 SG
[====|==============] Putting:   +0.2 SG
[======|==========] Driving:   +0.1 SG

PROGNOSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Din nåværende HCP: 16.2
Din fremtidige HCP: 13.5 🔥

Forbedring: -2.7 slag!

Du vil:
• Gå fra kategori F til E ✅
• Øke GIR fra 25% til 32%
• Redusere putts fra 35 til 33
• Score ca. 82 i snitt (ikke 85)

For å oppnå dette:
• 16 uker med fokusert trening
• 2.5t approach + 1t putting per uke
• 75% sannsynlighet for suksess

[LAG EN PLAN FOR DETTE MÅLET]
```

---

## 🔄 Data-Flyt Arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA KILDER                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   App Data   │  │  DataGolf    │  │   TrackMan   │     │
│  │  (Spiller)   │  │   (Tour)     │  │  (Teknisk)   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 DATA FUSION LAYER                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • Normaliser alle data til samme format           │   │
│  │  • Beregn gaps (Spiller vs Tour vs Target)         │   │
│  │  • Identifiser mønstre og trender                │   │
│  │  • Beregn trenbarhet og ROI per område           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI ANALYSE ENGINE                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Weakness   │  │   Focus     │  │   Predictive       │ │
│  │  Analysis   │  │Recommendation│  │   Modeling         │ │
│  │             │  │             │  │   ("What If")      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                 TRENINGSPRODUKSJON                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • Generer øvelser basert på gap-analyse           │   │
│  │  • Alloker tid basert på trenbarhet                │   │
│  │  • Sett mål basert på DataGolf-benchmarks          │   │
│  │  • Track fremgang mot Tour-nivå                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    SPILLER-OUTPUT                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Personal   │  │   Drill     │  │   Progress         │ │
│  │  Dashboard  │  │   Prescription│  │   Tracking       │ │
│  │             │  │             │  │   (vs Tour)        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Konkrete Implementasjoner

### 1. Utvidet Weakness Analysis

```typescript
// lib/portal/ai/weakness-analysis-v2.ts

export async function analyzeWeaknessV2(
  userId: string,
  includeDataGolf: boolean = true
): Promise<WeaknessAnalysisV2> {
  
  // 1. Hent app-data (eksisterende)
  const appData = await fetchAppData(userId);
  
  // 2. Hent DataGolf-data (NYTT)
  const dataGolfData = includeDataGolf ? await fetchDataGolfComparison(userId) : null;
  
  // 3. Beregn gaps
  const gaps = calculateGaps(appData.sgProfile, dataGolfData?.tourBenchmarks);
  
  // 4. Prioriter basert på:
  //    - Gap-størrelse
  //    - Trenbarhet (hva gir raskest resultat?)
  //    - Frekvens (hvor ofte skjer dette i runden?)
  const prioritizedGaps = prioritizeGaps(gaps);
  
  // 5. AI-analyse med ALL data
  const analysis = await claude.messages.create({
    model: "claude-sonnet-4-5",
    prompt: buildComprehensivePrompt(appData, dataGolfData, prioritizedGaps)
  });
  
  return {
    ...analysis,
    dataGolfInsights: {
      tourComparison: dataGolfData?.playerVsTour,
      percentile: dataGolfData?.percentile,
      gapToNextLevel: dataGolfData?.gapToNextCategory
    }
  };
}

// Hjelpefunksjon for gap-beregning
function calculateGaps(
  playerSG: SGProfile,
  tourBenchmarks?: TourBenchmarks
): GapAnalysis[] {
  
  const categories: SGCategory[] = ['offTheTee', 'approach', 'aroundGreen', 'putting'];
  
  return categories.map(cat => {
    const playerValue = playerSG[cat];
    const tourMedian = tourBenchmarks?.median[cat] ?? 0;
    const tourP90 = tourBenchmarks?.p90[cat] ?? 0.5;
    
    return {
      category: cat,
      playerValue,
      tourMedian,
      tourP90,
      gapToMedian: playerValue - tourMedian,
      gapToP90: playerValue - tourP90,
      
      // Hvor mange slag "taper" spilleren per runde?
      strokesLost: Math.abs(playerValue - tourMedian),
      
      // Hvor mye HCP kan forbedres?
      estimatedHandicapImpact: Math.abs(playerValue - tourMedian) * 2.5
    };
  });
}
```

### 2. Smart Session Planner

```typescript
// lib/portal/ai/smart-session-planner.ts

export interface SmartSessionRequest {
  userId: string;
  duration: number;           // 60 min
  availableEquipment: string[]; // ['TrackMan', 'PuttingGreen']
  focusPreference?: string;    // 'AUTO' | 'APPROACH' | etc.
}

export async function generateSmartSession(
  request: SmartSessionRequest
): Promise<SmartSessionPlan> {
  
  // 1. Hent all relevant data
  const [
    weaknessAnalysis,
    recentRounds,
    dataGolfComparison,
    trainingHistory
  ] = await Promise.all([
    analyzeWeaknessV2(request.userId),
    getRecentRounds(request.userId, 5),
    getDataGolfComparison(request.userId),
    getTrainingHistory(request.userId, 30)
  ]);
  
  // 2. Bestem fokus (hvis ikke spesifisert)
  const focusArea = request.focusPreference === 'AUTO' 
    ? weaknessAnalysis.primaryWeakness 
    : request.focusPreference;
  
  // 3. Hent DataGolf-benchmark for dette fokusområdet
  const benchmark = dataGolfComparison.getBenchmark(focusArea);
  
  // 4. Generer øvelser som adresserer gap
  const drills = await generateTargetedDrills({
    focusArea,
    playerCurrentLevel: weaknessAnalysis.playerLevel,
    tourBenchmark: benchmark,
    availableEquipment: request.availableEquipment,
    duration: request.duration
  });
  
  // 5. Lag plan med "Tour Target"
  return {
    summary: `${focusArea} — Mål: ${benchmark.targetProximity}ft proximity`,
    warmup: generateWarmup(focusArea),
    mainDrills: drills.map(d => ({
      ...d,
      target: `Tour-nivå: ${benchmark.makeRate}/10`,
      playerCurrent: `${d.playerCurrent}/10`
    })),
    test: generateTestForFocus(focusArea),
    cooldown: generateCooldown()
  };
}
```

### 3. Progress Tracker med DataGolf

```typescript
// components/portal/training/ProgressTracker.tsx

interface ProgressData {
  // Spillerens fremgang
  playerProgress: {
    date: string;
    sgApproach: number;
    testScore: number;
  }[];
  
  // DataGolf referanser
  dataGolfLines: {
    tourMedian: number;
    tourP90: number;
    categoryTarget: number;  // F.eks. kategori E
  };
}

// Visualisering:
// - Graf med spillerens SG over tid
// - Horisontale linjer for Tour median, P90
// - Animasjon når spilleren krysser en linje
// - Prediksjon basert på trend
```

---

## 📱 UI-Komponenter

### 1. "Din vei til Tour" Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  DIN VEI TIL TOUR-NIVÅ                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │          [VISUALISERING - VERTIKAL]                │   │
│  │                                                     │   │
│  │  🏆 Tour P90 (Elite)      SG: +0.8               │   │
│  │     ─────────────────────────────                  │   │
│  │  🥇 Tour Median           SG: 0.0                │   │
│  │     ─────────────────────────────                  │   │
│  │  📍 Kategori A (0 HCP)    SG: -0.3               │   │
│  │     ─────────────────────────────                  │   │
│  │  📍 Kategori B (5 HCP)    SG: -0.8  ← Du er her! │   │
│  │     ▲                                             │   │
│  │  📍 Kategori C (9 HCP)    SG: -1.3               │   │
│  │     ─────────────────────────────                  │   │
│  │  📍 Kategori D (12 HCP)   SG: -1.7               │   │
│  │                                                     │   │
│  │  Avstand til neste nivå: 0.5 SG (ca. 3 måneder)  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  DIN APPROACH-FREMGANG:                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Jan    Feb    Mar    Apr    Mai                   │   │
│  │  -1.2   -1.1   -0.9   -0.8   [Mål: -0.5]          │   │
│  │   ▲      ▲      ▲      ▲                          │   │
│  │   │      │      │      └─ Du er her!               │   │
│  │   │      │      │                                │   │
│  │  ─┴──────┴──────┴─────────────────── Tour median   │   │
│  │                                                     │   │
│  │  Fremgang: +0.4 SG på 4 måneder! 🎉               │   │
│  │  Trend: På vei til kategori A innen august        │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Se detaljert plan]  [Juster mål]  [Del fremgang]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. "Beat the Pro" i Treningsøkter

```
┌─────────────────────────────────────────────────────────────┐
│  ØKT: Approach 100m (45 min)                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎯 DAGENS MÅL: Slå Viktor Hovland!                         │
│                                                             │
│  Viktor fra 100m:                                           │
│  • 3.5 av 10 innenfor 6m (35%)                              │
│  • Gj.sn. proximity: 19.8ft                                 │
│                                                             │
│  Din utfordring: Få 4 av 10 innenfor 6m!                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ØVELSE 1: 100m Precision (20 min)                 │   │
│  │                                                     │   │
│  │  • 10 slag mot 100m target                         │   │
│  │  • Tell hvor mange innenfor 6m                     │   │
│  │  • Mål: 4/10 (slå Viktors 3.5!)                   │   │
│  │                                                     │   │
│  │  [Start øvelse]                                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📊 LIVE-TRACKING:                                          │
│  Slag 1: 5.2m  ✓ INNENFOR (1/1)                            │
│  Slag 2: 8.1m  ✗ Utenfor   (1/2)                           │
│  Slag 3: 4.8m  ✓ INNENFOR (2/3) 🔥                         │
│  ...                                                        │
│                                                             │
│  Resultat: 4/10 = 40%  🎉 DU SLO VIKTOR!                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Implementasjons-Prioritering

### Fase 1: Foundation (Uke 1-2)
- [ ] Utvid `weakness-analysis.ts` med DataGolf-gaps
- [ ] Lag Tour-benchmark visning i dashboard
- [ ] Koble test-resultater til DataGolf-sammenligning

### Fase 2: Smart Planlegging (Uke 3-4)
- [ ] Integrer DataGolf i `focus-recommendation.ts`
- [ ] Lag "Din vei til Tour" dashboard-komponent
- [ ] Implementer "Beat the Pro" i økter

### Fase 3: Prediksjon (Uke 5-6)
- [ ] Bygg "What If" simulator
- [ ] Lag fremgangs-projeksjon basert på trend
- [ ] Implementer smart mål-setting

### Fase 4: Polering (Uke 7-8)
- [ ] Forbedre AI-prompts med all data
- [ ] Lag mobil-optimalisert visning
- [ ] Test med ekte spillere

---

## 📈 Forventet Impact

| Metrikk | Før DataGolf | Etter DataGolf | Forbedring |
|---------|-------------|----------------|------------|
| **Treningsmotivasjon** | 6.5/10 | 8.5/10 | +30% |
| **Plan adherence** | 60% | 80% | +33% |
| **Forståelse av gap** | Lav | Høy | +200% |
| **HCP-reduksjon** | 2/år | 4/år | +100% |
| **Spiller-retention** | 70% | 90% | +29% |

---

**Konklusjon:** Ved å integrere DataGolf får spillerne en klar forståelse av HVOR de er, HVOR de skal, og HVA som skal til for å komme dit. Dette gjør treningsplanleggingen fra "gjetting" til "data-drevet vitenskap".
