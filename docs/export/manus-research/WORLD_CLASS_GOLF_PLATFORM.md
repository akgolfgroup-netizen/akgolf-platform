# 🏆 WORLD CLASS GOLF PLATFORM
## Strategidokument: Fra Data til Mestring
**Versjon:** 1.0 | **Dato:** April 2026 | **Visjon:** Verdens beste golf-analyseplattform

---

# 📋 EXECUTIVE SUMMARY

## Visjon
**"Hver golfspiller fortjener en personlig Tour-caddie i lommen"**

Vi skal skape den første plattformen som kombinerer:
- 🎯 **DataGolf's** PGA Tour-data
- 📊 **TrackMan's** presisjonsmålinger  
- 🧠 **DECADE's** course management
- 📱 **Mobil-first** runde-registrering
- 🤖 **AI-drevet** treningsplanlegging

## Konkurransefortrinn
| Feature | Arccos | ShotScope | V1 Game | **AK Golf** |
|---------|--------|-----------|---------|-------------|
| Strokes Gained | ✅ | ✅ | ✅ | ✅ **+ DataGolf-sammenligning** |
| TrackMan-import | ❌ | ❌ | ❌ | ✅ **+ Test-integrasjon** |
| Norsk banedatabase | ❌ | ❌ | ❌ | ✅ **+ 150+ baner** |
| Trener-integrasjon | ❌ | ❌ | ❌ | ✅ **+ IUP-system** |
| Kravprofiler per nivå | ❌ | ❌ | ❌ | ✅ **+ DataGolf-basert** |
| Pris | 1999 kr/år | 2499 kr | 1299 kr | **599 kr/år** |

---

# 🏗️ DEL 1: PLATTFORM-ARKITEKTUR

## 1.1 Dataflyt (The Data Pipeline)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA KILDER                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ TrackMan │  │  Manual  │  │  Runde   │  │ DataGolf │            │
│  │  Import  │  │  Tester  │  │  Input   │  │   API    │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
└───────┼─────────────┼─────────────┼─────────────┼──────────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STROKES GAINED ENGINE                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  • Baseline-beregning (hvor skulle ballen vært)             │   │
│  │  • Faktisk resultat vs baseline                             │   │
│  │  • SG per kategori: OTT | APP | ARG | PUTT                  │   │
│  │  • SG per avstand: 75-100m | 100-125m | 125-150m | etc.    │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ANALYSE & INNSIKT                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   Tour      │  │   Gap       │  │   Trening   │  │   Nivå-    │ │
│  │Comparison   │  │  Analysis   │  │Prescription │  │   test     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    TRENING & UTVIKLING                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  • Personlig treningsplan basert på SG-gap                   │   │
│  │  • TrackMan-økter med Tour-benchmarks                        │   │
│  │  • Tester med progresjons-tracking                           │   │
│  │  • DECADE-strategi for neste runde                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## 1.2 Kjernemoduler

### A. SG Calculation Engine
```typescript
// Kernefunksjon for SG-beregning
interface SGCalculation {
  // Baseline: Hvor mange slag forventes fra denne posisjonen?
  baselineStrokes: number;  // Fra DataGolf/historikk
  
  // Faktisk: Hvor mange slag brukte spilleren?
  actualStrokes: number;
  
  // SG = Baseline - Faktisk
  strokesGained: number;
  
  // Kategorisering
  category: 'OTT' | 'APP' | 'ARG' | 'PUTT';
  distance?: number;  // For approach
  lie?: 'tee' | 'fairway' | 'rough' | 'sand' | 'green';
}
```

### B. Tour Comparison Matrix
```typescript
interface TourComparison {
  playerSG: PlayerSG;
  tourMedian: DataGolfSG;  // Fra DataGolf API
  tourP90: DataGolfSG;      // Top 10%
  
  // Normalisert score (0-100)
  tourScore: {
    total: number;     // "Du er på 62% av Tour-nivå"
    perCategory: Record<SGCategory, number>;
    perDistance: Record<DistanceBucket, number>;
  };
  
  // Gap til neste nivå
  gapToNext: {
    category: SGCategory;
    strokesNeeded: number;
    estimatedTime: string;  // "3-4 uker med fokusert trening"
  };
}
```

### C. Training Prescription Engine
```typescript
interface TrainingPrescription {
  generatedAt: Date;
  validFor: { from: Date; to: Date };
  
  // Basert på
  basedOn: {
    lastRounds: number;     // Siste 5 runder
    trackmanSessions: number;
    testsCompleted: number;
  };
  
  // Anbefaling
  focusAreas: Array<{
    area: SGCategory;
    priority: number;       // 1-10
    timeAllocation: number; // % av total treningstid
    specificTests: string[]; // Hvilke tester å gjøre
    drills: Drill[];
  }>;
  
  // Mål for perioden
  goals: {
    sgTarget: number;
    handicapTarget?: number;
    testImprovements: Array<{ testId: string; targetScore: number }>;
  };
}
```

---

# 🎯 DEL 2: SPILL EN RUNDE 2.0

## 2.1 Hull-for-hull SG-input (The Shot Tracker)

### Visjon: Registrer hvert slag som en Tour-caddie ville notert det

```typescript
interface ShotData {
  shotNumber: number;
  
  // Startposisjon
  from: {
    lie: 'tee' | 'fairway' | 'rough' | 'sand' | 'green' | 'recovery';
    distanceToPin: number;  // meter
    elevation?: 'uphill' | 'downhill' | 'flat';
    wind?: 'head' | 'tail' | 'left' | 'right' | 'none';
  };
  
  // Klubbvalg
  club: string;
  intendedShape: 'draw' | 'fade' | 'straight';
  intendedDistance: number;
  
  // Resultat
  result: {
    distanceToPin: number;  // Etter slaget
    lie: 'fairway' | 'green' | 'rough' | 'sand' | 'hazard' | 'oob';
    proximity?: number;     // Hvis på green (meter fra hull)
  };
  
  // SG-beregning (auto)
  strokesGained: number;
}

interface HoleData {
  holeNumber: number;
  par: number;
  shots: ShotData[];
  
  // Hurtig-input alternativ
  quickEntry?: {
    score: number;
    putts: number;
    fairwayHit?: boolean;
    gir: boolean;
    proximityMeter?: number;  // Hvis GIR
  };
}
```

### UI-Flyt: Fra enkel til avansert

```
┌─────────────────────────────────────────────────────────┐
│  NIVÅ 1: Hurtig (15 sek per hull)                       │
│  ├── Score: [3] [4] [5] [6]                             │
│  ├── Putts: [1] [2] [3]                                 │
│  ├── Fairway: [Treff] [Bom]                             │
│  └── GIR: [Ja] [Nei]                                    │
└─────────────────────────────────────────────────────────┘
            ↓ (Trykk "Detaljer" for nivå 2)
┌─────────────────────────────────────────────────────────┐
│  NIVÅ 2: Medium (45 sek per hull)                       │
│  ├── Avslått fra: [100m] [Fairway]                      │
│  ├── Chip/putt resultat: [1m] [3m] [6m]                 │
│  ├── Bunker: [Redning ja/nei]                           │
│  └── Up & Down: [Ja] [Nei]                              │
└─────────────────────────────────────────────────────────┘
            ↓ (Trykk "Full sporing" for nivå 3)
┌─────────────────────────────────────────────────────────┐
│  NIVÅ 3: Full Shot-by-Shot (2 min per hull)             │
│  ├── Slag 1: Driver, 380m, Fairway                      │
│  ├── Slag 2: 8-jern, 145m, 12m fra hull                 │
│  ├── Slag 3: Chip, 12m, 1m fra hull                     │
│  └── Slag 4: Putt, 1m, INN!                             │
│  └── Real-time SG: [+0.4] [+0.2] [-0.1] [+0.1] = +0.6   │
└─────────────────────────────────────────────────────────┘
```

## 2.2 Bane-kart Integrasjon

### Features:
1. **GPS-posisjonering** - Se hvor du er på banen
2. **Avstandsmåling** - Trykk på kartet for avstand
3. **Slag-sporing** - Se dine slag som prikker på kartet
4. **Heatmap** - Hvor bommer du oftest?
5. **Strategi-overlay** - DECADE-anbefaling vist på kartet

### Datakilder for norske baner:
- **Google Maps API** - Basis kart
- **Bane-import** - GPS-koordinater fra klubbene
- **Crowd-sourcing** - Spillere bidrar med hull-posisjoner
- **Satellitt** + **manuelle målinger**

### Teknisk implementasjon:
```typescript
interface CourseMap {
  courseId: string;
  holes: Array<{
    holeNumber: number;
    par: number;
    
    // Tee-posisjoner
    tees: Array<{
      color: string;
      lat: number;
      lng: number;
      elevation: number;
    }>;
    
    // Green (polygon)
    green: {
      center: { lat: number; lng: number };
      polygon: Array<{ lat: number; lng: number }>;
      diameter: number;
    };
    
    // Viktige features
    features: Array<{
      type: 'bunker' | 'water' | 'tree' | 'fairway';
      polygon: Array<{ lat: number; lng: number }>;
    }>;
    
    // Hull-posisjon (varierer daglig)
    pinPositions: Array<{
      date: string;
      lat: number;
      lng: number;
    }>;
  }>;
}
```

## 2.3 Real-time SG-beregning

### Under runden:
```
Hull 7 | Par 4 | 380m
━━━━━━━━━━━━━━━━━━━━━━━━
Din score: 4 (Par) ✅

Slag-for-slag:
1. Drive: 240m fairway      SG: +0.3 ✅
2. 7-jern: 140m, 15m green  SG: +0.1 ✅  
3. Chip: 15m, 2m fra hull   SG: +0.2 ✅
4. Putt: 2m, INN!           SG: +0.0 ➖

Total SG hull 7: +0.6 🔥
Runde SG: +1.4 (Tar igjen 1.4 slag på feltet!)
Tour Score: 68% (Bedre enn 2/3 av PGA Tour!)
```

---

# 🧪 DEL 3: TESTBASEN (The Skill Lab)

## 3.1 Test-kategorier

### A. TrackMan-baserte tester (Auto-scoring)

| Test | Hva måles | DataGolf-referanse | Output |
|------|-----------|-------------------|--------|
| **Driver Efficiency** | Smash factor + carry/distance ratio | Tour median: 1.48 SF | % av Tour-effektivitet |
| **Approach Precision** | Proximity from 100/150/175 yards | Tour median: 18/25/35 ft | "Du er 73% av Tour" |
| **Wedge Mastery** | Avstandskontroll 50-100 yards | Tour: ±3 yards | Consistency score |
| ** dispersion Control** | Lateral spredning per klubb | Tour: 5-8% av carry | "Din 7-jern spredning = Tour 6-jern" |

### B. Manuelle range-tester

| Test | Format | Scoring | DataGolf-link |
|------|--------|---------|---------------|
| **100m Challenge** | 10 slag mot 100m target | Gj.sn. proximity | Sammenlign med Tour prox |
| **Putt Ladder** | 3/6/9/12/15 fot | Make % per avstand | Tour make % benchmark |
| **Up & Down** | 10 chip+putt situasjoner | Conversion rate | Tour scrambling % |
| **Bunker Blitz** | 10 bunker-slag | Proximity, out-rate | Tour sand save % |

### C. Bane-baserte tester

| Test | Format | Data |
|------|--------|------|
| **9-hull Scoring** | Komplett runde | Sammenlign med handicap-forventning |
| **Stress Test** | Siste 3 hull med "press" | Sammenlign første 6 vs siste 3 |
| **Recovery Rating** | Etter dårlige slag | SG på "rescue shots" |

## 3.2 Test-progresjon (Nivå-system)

```
NIVÅ 1: Explorer (HCP 36+)
├── Tester: Enkle målinger
├── Krav: Fullføre testen
└── Belønning: "Første steg!" badge

NIVÅ 2: Challenger (HCP 20-36)
├── Tester: Standard scoring
├── Krav: Bestemte %-score
└── Belønning: Kategori-merker (Bronse/Sølv/Gull)

NIVÅ 3: Competitor (HCP 10-20)
├── Tester: Med DataGolf-sammenligning
├── Krav: % av Tour-nivå
└── Belønning: "70% av Tour" etc.

NIVÅ 4: Elite (HCP <10)
├── Tester: Proff-nivå presisjon
├── Krav: Nærme Tour-median
└── Belønning: "Tour Ready" sertifisering
```

## 3.3 The "Beat Rory" Test Suite

### Konsept:
Rory McIlroy's statistikk som ultimate benchmark:

```typescript
const RORY_BENCHMARKS = {
  driver: {
    carry: 305,        // yards
    dispersion: 18,    // yards lateral
    fairwayHit: 62,    // %
  },
  approach: {
    100: { proximity: 14.2 },   // feet
    150: { proximity: 19.8 },
    175: { proximity: 26.4 },
    200: { proximity: 35.1 },
  },
  shortGame: {
    scrambling: 68,     // %
    sandSaves: 54,      // %
    proximity50: 6.2,   // feet fra 50 yards
  },
  putting: {
    make3ft: 99,
    make6ft: 78,
    make10ft: 42,
    make15ft: 28,
    puttsPerRound: 29.2,
  }
};

// Spillerens "Rory Score"
function calculateRoryScore(playerResult: TestResult, roryBenchmark: number): number {
  return Math.min(100, (playerResult / roryBenchmark) * 100);
}
// Eksempel: 100m proximity = 20ft → (14.2/20)*100 = 71% "Rory Score"
```

### UI:
```
┌─────────────────────────────────────────┐
│  🏆 BEAT RORY CHALLENGE                 │
├─────────────────────────────────────────┤
│                                         │
│  100m Approach Test                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│  Ditt resultat:     18.4 ft             │
│  Rory's best:       14.2 ft             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ████████████████████░░░░░░░░░ │   │
│  │  77% AV RORY'S NIVÅ           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Neste nivå: 15.0 ft (82%) 🎯           │
│                                         │
│  Historikk:                             │
│  Apr: 18.4 ft ████░░░░░ +2%             │
│  Mar: 19.8 ft ███░░░░░░ -1%             │
│  Feb: 21.2 ft ██░░░░░░░ -3%             │
│                                         │
│  [DEL PÅ INSTAGRAM] [PRØV IGJEN]        │
│                                         │
└─────────────────────────────────────────┘
```

---

# 📊 DEL 4: KRAVPROFILER & NIVÅSYSTEM

## 4.1 Komplett nivåmatrise (A-K)

| Kat | HCP | Snitt | Tour Score | Driver | 7-jern | Putting | Kjennetegn |
|-----|-----|-------|------------|--------|--------|---------|------------|
| **A** | +3-0 | 72 | 95-100% | 290+m | 165m ±5m | 28 putts | Elite amatør/proff |
| **B** | 0-5 | 78 | 85-95% | 270m | 155m ±8m | 30 putts | Konkurransespiller |
| **C** | 5-9 | 82 | 75-85% | 250m | 145m ±12m | 32 putts | Sterk klubbspiller |
| **D** | 9-12 | 85 | 65-75% | 230m | 135m ±15m | 33 putts | God amatør |
| **E** | 12-15 | 88 | 55-65% | 210m | 125m ±18m | 34 putts | Middels amatør |
| **F** | 15-19 | 92 | 45-55% | 195m | 115m ±22m | 35 putts | Utviklende |
| **G** | 19-24 | 97 | 35-45% | 175m | 105m ±28m | 36 putts | Regelmessig |
| **H** | 24-29 | 103 | 25-35% | 155m | 95m ±35m | 37 putts | Hobby |
| **I** | 29-36 | 108 | 15-25% | 135m | 85m ±42m | 38 putts | Nybegynner+ |
| **J** | 36-45 | 115 | 10-15% | 115m | 75m ±50m | 39 putts | Nybegynner |
| **K** | 45+ | 125+ | <10% | <100m | <70m | 40+ putts | Helt fersk |

## 4.2 Krav per kategori (detaljert)

### Kategori A (Elite)
```yaml
Driver:
  carry: 290+ yards
  smash_factor: 1.48+
  fairway_hit: 60%+
  
Approach:
  100m: <15ft proximity
  150m: <22ft proximity
  200m: <35ft proximity
  
ShortGame:
  scrambling: 65%+
  sand_save: 50%+
  up_and_down: 60%+
  
Putting:
  make_6ft: 75%+
  make_10ft: 40%+
  putts_per_round: <29
  
Mental:
  stress_score: <5% scoreøkning på siste 3 hull
  strategy_adherence: 80%+
```

### Kategori F (Utviklende - eksempel på midten)
```yaml
Driver:
  carry: 195+ yards
  smash_factor: 1.42+
  fairway_hit: 35%+
  
Approach:
  100m: <35ft proximity
  150m: <50ft proximity
  
ShortGame:
  scrambling: 25%+
  sand_save: 15%+
  
Putting:
  make_3ft: 90%+
  make_6ft: 50%+
  putts_per_round: <35
```

## 4.3 Progresjonssti (Veien videre)

```
Kategori F → E (15 → 12 HCP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tid: 3-6 måneder
Fokus: Approach (40%) + Putting (30%)

Milepæler:
□ 100m proximity: 35ft → 28ft
□ GIR: 25% → 35%
□ Putts/runde: 35 → 33
□ 7-jern spredning: ±22m → ±18m

Tester å bestå:
• 100m Challenge: 70% av Tour-nivå
• Putt Ladder: 55% makes fra 6ft
• 9-hull: 3 runder på rad under 45 poeng
```

---

# 🌍 DEL 5: NORSK BANEANALYSE

## 5.1 Bane-sammenligning

### Metodikk:
```typescript
interface CourseAnalysis {
  courseId: string;
  
  // Vanskelighetsgrad
  difficulty: {
    rating: number;        // 1-10
    slopeRating: number;   // Offisiell
    courseRating: number;  // Offisiell
  };
  
  // Sammenligning med Tour-baner
  tourComparison: {
    similarTo: string[];   // ["TPC Sawgrass", "Torrey Pines"]
    difficultyVsTour: number; // % av Tour-bane vanskelighet
  };
  
  // Spesifikke utfordringer
  challenges: Array<{
    type: 'narrow_fairways' | 'thick_rough' | 'fast_greens' | 'water';
    severity: number;
    holes: number[];
  }>;
  
  // Forventet scoring per nivå
  expectedScores: Record<Category, {
    average: number;
    best10Percent: number;
  }>;
}
```

### Eksempel: Oslo Golfklubb
```
Oslo Golfklubb (Haga)
━━━━━━━━━━━━━━━━━━━━━━
Vanskelighet: 8.2/10 (Vanskelig)

Sammenligning:
• Ligner: TPC Boston (trange fairways)
• Vanskeligere enn: Gjennomsnittlig PGA Tour bane (+2.3 slag)

Spesifikke utfordringer:
• Trange fairways (hull 3, 7, 12, 15)
• Dyp rough (straff: +0.8 slag vs fairway)
• Raske greener (11.5 på stimpmeter)

Forventet score:
• Kategori A: 74 (+2) 
• Kategori D: 88 (+16)
• Kategori G: 102 (+30)

Din statistikk her:
• Gj.sn. score: 87 (+15) 
• Beste: 82 (+10)
• vs D-kategori: 1 slag bedre ✅
• Tour Score på denne banen: 42%
```

## 5.2 Personlig bane-guide

For hver bane spilleren besøker:
```
Mikael, Oslo GK er utfordrende for deg:

DIN SVAKE SIDE → BANE-STRATEGI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Hull 3 (Par 4, 380m)
   Din driver: 195m, 35% fairway
   → Anbefaling: 3-tre (220m carry, 60% fairway)
   → Strategi: Legg opp til wedge-inn
   
2. Hull 7 (Par 3, 165m)
   Din 6-jern: 135m
   → Anbefaling: 5-jern + chip
   → Unngå bunkeren høyre!

3. Hull 12 (Par 5, 480m)
   Din scrambling: 25%
   → Anbefaling: Konservativt, legg opp til 3 på green
   → Unngå å gå for green i 2 (rough-straff: +0.8)

Forventet resultat med strategi: 85 (+13)
vs uten strategi: 89 (+17)
```

---

# 🧠 DEL 6: AI-DREVET TRENING

## 6.1 The Training Engine

### Input-data:
```typescript
interface TrainingInput {
  // Historikk
  lastRounds: Round[];           // Siste 5-10 runder
  lastTests: TestResult[];       // Siste tester
  trackmanSessions: TrackManSession[];
  
  // Mål
  goalHandicap?: number;
  targetCategory?: Category;
  timeAvailable: number;         // Timer per uke
  
  // Begrensninger
  facilities: ('range' | 'course' | 'simulator' | 'putting_green')[];
  injuries?: string[];
}
```

### Output: Personlig treningsplan
```typescript
interface WeeklyPlan {
  weekNumber: number;
  totalHours: number;
  
  sessions: Array<{
    day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
    duration: number;  // minutes
    type: 'trackman' | 'range' | 'short_game' | 'course' | 'putting';
    focus: SGCategory;
    
    // Detaljert innhold
    exercises: Exercise[];
    testsToDo?: string[];
    
    // Mål for økten
    targetMetrics: {
      metric: string;
      target: number;
      current: number;
    }[];
  }>;
  
  // Ukentlige mål
  weeklyGoal: {
    description: string;
    successCriteria: string;
  };
}
```

## 6.2 Eksempel: Treningsplan for kategori F-spiller

```
UKE 12 | Mål: Forbedre approach +0.3 SG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MANDAG (45 min) - TrackMan
├─ Oppvarming: 10 slag med wedge
├─ Hovedøkt: 100m approach (30 slag)
│  ├─ Mål: <30ft gj.sn. proximity
│  └─ Tour Score siste uke: 68% → Mål: 73%
├─ Test: 100m Challenge (registreres)
└─ Nedtrapping: 10 putter

ONSDAG (60 min) - Range
├─ Driver: 20 slag (fokus: fairway)
├─ 7-jern: 30 slag (fokus: avstandskontroll)
├─ Pitching: 20 slag (50-75m)
└─ Test: Wedge Ladder

FREDAG (90 min) - Bane
├─ 9 hull med fokus på:
│  ├─ Strategi etter DECADE
│  ├─ Kun 2 putter per green maks
│  └─ Ingen "hero shots"
└─ Registrer alle slag (Shot-by-shot)

LØRDAG (30 min) - Putting green
├─ Putt Ladder: 3-6-9-12-15 ft
├─ 10 x 2-putt fra 30ft
└─ Test: Make % fra 6ft

UKENS TEST-MÅL:
□ 100m Challenge: 68% → 73% Tour Score
□ Putt Ladder 6ft: 50% → 55% makes
□ GIR i runde: 25% → 30%
```

## 6.3 Adaptive Training

Planen justeres automatisk basert på resultater:

```typescript
function adaptTraining(plan: WeeklyPlan, results: WeekResults): WeeklyPlan {
  // Hvis testene viser forbedring → Øk vanskelighetsgrad
  if (results.testImprovement > 0.1) {
    plan.nextWeek.increaseDifficulty = true;
  }
  
  // Hvis stagnasjon → Endre fokusområde
  if (results.testImprovement < 0.05 && results.weeksStagnant > 2) {
    plan.nextWeek.shiftFocus = 'different_category';
  }
  
  // Hvis tilbakegang → Reduser, fokuser på grunnleggende
  if (results.testImprovement < -0.1) {
    plan.nextWeek.simplify = true;
    plan.nextWeek.addFundamentals = true;
  }
  
  return plan;
}
```

---

# 💰 DEL 7: FORRETNINGSMODELL

## 7.1 Priser

| Nivå | Pris | Inkluderer |
|------|------|------------|
| **Gratis** | 0 kr | 5 runder/år, basis tester |
| **Player** | 599 kr/år | Ubegrenset, alle tester, TrackMan |
| **Pro** | 1299 kr/år | + Trener-dashboard, AI-treningsplan |
| **Academy** | 2999 kr/år | + Videoanalyse, prioritert support |

## 7.2 Konkurransefordeler

1. **Kun plattform med DataGolf-sammenligning**
2. **Kun plattform med norsk banedatabase**
3. **Kun plattform med TrackMan-test-integrasjon**
4. **Kun plattform med IUP/trener-system**
5. **Pris: 50-75% lavere enn konkurrentene**

---

# 🛠️ DEL 8: IMPLEMENTASJONSPLAN

## Fase 1: Foundation (Måned 1-2)
- [ ] Database-utvidelser (Shot, Test, CourseMap)
- [ ] Forbedret runde-input (shot-by-shot)
- [ ] Bane-kart MVP (GPS-posisjon)

## Fase 2: Testing (Måned 3-4)
- [ ] Testbase (15 standard-tester)
- [ ] TrackMan-test-integrasjon
- [ ] Tour-benchmark visning

## Fase 3: Intelligence (Måned 5-6)
- [ ] Training Engine MVP
- [ ] Kravprofiler for A-K
- [ ] Bane-analyse

## Fase 4: Polish (Måned 7-8)
- [ ] AI-coach-integrasjon
- [ ] Social features (leaderboards)
- [ ] Mobil-app (PWA)

---

# 📈 SUKSESSKRITERIER

## 6 måneder etter lansering:
- [ ] 1000+ aktive brukere
- [ ] 50+ runder registrert per dag
- [ ] 200+ tester gjennomført per uke
- [ ] Gjennomsnittlig HCP-reduksjon: 3 slag
- [ ] NPS-score: >50

## 12 måneder:
- [ ] 5000+ brukere
- [ ] Partnerskap med 10+ norske golfklubber
- [ ] Integrasjon med GolfBox
- [ ] Eksport til Europa

---

**Dette blir verdens beste golfplattform fordi:**
1. Den er **data-drevet** (ikke gjetting)
2. Den er **personlig** (ikke one-size-fits-all)
3. Den er **motiverende** (gamification + Tour-sammenligning)
4. Den er **tilgjengelig** (pris + språk)
5. Den er **helhetlig** (treningsplan + analyse + testing)
