# DECADE Algoritme - Komplett Implementasjon
## Scott Fawcett's DECADE Strategy System

**Mappe:** `/docs/research/decade-algoritme/`  
**Basert på:** DECADE App + Scott Fawcett's Tour Strategy  
**Status:** Algoritme-Design

---

## INNHOLDSFORTEGNELSE

1. [Kjerne-Prinsipper](#1-kjerne-prinsipper)
2. [5% Buffer-Algoritmen](#2-5-buffer-algoritmen)
3. [Dispersion-Kalkulasjon](#3-dispersion-kalkulasjon)
4. [Hull-Strategi Generator](#4-hull-strategi-generator)
5. [Decision Framework](#5-decision-framework)
6. [Shotgun vs Rifle Pattern](#6-shotgun-vs-rifle-pattern)
7. [Bogey Avoidance Prioritet](#7-bogey-avoidance-prioritet)
8. [Implementasjon](#8-implementasjon)

---

## 1. KJERNE-PRINSIPPER

### 1.1 DECADE's Hoved-Regler

```typescript
const DECADE_PRINCIPLES = {
  // Regel #1: Sannsynlighets-basert beslutningstaking
  // "Spill mot flagget du kan treffe, ikke det du vil treffe"
  probabilityBased: true,
  
  // Regel #2: 5% Buffer (7% for >10 HCP)
  // Hvis fairway er 30m bred, sikte på 26.1m "fat part"
  bufferRule: {
    tourPro: 0.05,      // 5%
    amateur: 0.07,      // 7%
  },
  
  // Regel #3: Shotgun Pattern
  // Din spredning er en "shotgun", ikke "rifle shot"
  // "Du kan ikke konsistent treffe et punkt"
  shotgunPattern: true,
  
  // Regel #4: Bogey Avoidance > Birdie Chasing
  // Unngå dobbel-bogey viktigere enn å jage birdie
  bogeyAvoidancePriority: 0.6,  // 60% vekt på å unngå trouble
  
  // Regel #5: Tilpasning basert på egen spredning
  // Ikke bruk standarddata - bruk DINE tall
  usePersonalDispersion: true,
};
```

---

## 2. 5% BUFFER-ALGORITMEN

### 2.1 Hva er Buffer-Regelen?

```
EKSEMPEL: Hull 1, 400m Par 4

FAIRWAY:
├─ Venstre rough: 5m
├─ Venstre side: 15m
├─ MIDT (feteste delen): 30m ← "Fat part"
├─ Høyre side: 15m  
└─ Høyre rough: 10m

Total fairway bredde: 75m

5% BUFFER KALKULASJON:
• Tour Pro (5%): 30m * 0.05 = 1.5m fra hver kant
• Siktepunkt: 15m + 1.5m = 16.5m fra venstre kant
• "Safe zone": 16.5m til 58.5m fra venstre kant (42m bred)

7% BUFFER FOR AMATØR (>10 HCP):
• 30m * 0.07 = 2.1m fra hver kant
• Siktepunkt: 15m + 2.1m = 17.1m fra venstre kant
```

### 2.2 Buffer-Algoritme

```typescript
interface BufferCalculation {
  fairwayWidth: number;
  playerHandicap: number;
  bufferPercent: number;
  safeAimpoint: number;      // Meter fra venstre kant
  safeZoneWidth: number;
}

function calculateBufferZone(
  fairway: FairwayGeometry,
  playerHandicap: number
): BufferCalculation {
  // 1. Beregn buffer-prosent
  const bufferPercent = playerHandicap <= 10 ? 0.05 : 0.07;
  
  // 2. Finn "fat part" (bredeste del av fairway)
  const fatPartWidth = findFatPartWidth(fairway);
  
  // 3. Beregn buffer-sonen
  const bufferWidth = fatPartWidth * bufferPercent;
  const safeZoneWidth = fatPartWidth - (bufferWidth * 2);
  
  // 4. Beregn siktepunkt
  const fatPartCenter = findFatPartCenter(fairway);
  const safeAimpoint = fatPartCenter;  // Midt i buffer-sonen
  
  return {
    fairwayWidth: fairway.totalWidth,
    playerHandicap,
    bufferPercent,
    safeAimpoint,
    safeZoneWidth,
  };
}

// Hjelpefunksjon: Finn bredeste punkt på fairway
function findFatPartWidth(fairway: FairwayGeometry): number {
  // Analyser fairway-geometri
  const crossSections = fairway.crossSections;
  
  // Finn bredeste seksjon
  const maxWidth = Math.max(...crossSections.map(cs => cs.width));
  
  return maxWidth;
}
```

---

## 3. DISPERSION-KALKULASJON

### 3.1 Personlig Sprednings-Data

```typescript
interface PlayerDispersion {
  playerId: string;
  
  // Per kølle, per kontekst
  clubs: Map<string, ClubDispersion>;
  
  // Kontekst: Trening vs Konkurranse
  contexts: {
    training: ClubDispersionSet;
    casual: ClubDispersionSet;
    competition: ClubDispersionSet;
  };
}

interface ClubDispersion {
  club: string;              // "8-jern"
  carryDistance: number;     // Gjennomsnittlig carry
  totalDistance: number;     // Carry + rull
  
  // Spredning (standardavvik)
  dispersion: {
    lateral: number;         // Meter (venstre/høyre)
    distance: number;        // Meter (kort/lang)
  };
  
  // 95% konfidensintervall (2 sigma)
  confidence95: {
    lateral: number;         // = lateral * 2
    distance: number;        // = distance * 2
  };
  
  // Shot shape tendens
  typicalShape: 'DRAW' | 'FADE' | 'STRAIGHT' | 'INCONSISTENT';
  shapeBias: number;         // Grader fra rett
}

// EKSEMPEL: Spiller med HCP 12
const exampleDispersion = {
  club: '8-jern',
  context: 'competition',
  
  carryDistance: 125,
  
  // Standardavvik
  dispersion: {
    lateral: 12,      // 68% av slag innenfor 12m
    distance: 6,      // 68% av slag innenfor 6m av target
  },
  
  // 95% sikkerhet
  confidence95: {
    lateral: 24,      // 95% av slag innenfor 24m
    distance: 12,     // 95% av slag innenfor 12m
  },
};
```

### 3.2 Sprednings-Visualisering

```
SPREDNING FOR 8-JERN (125m) I KONKURRANSE:

                68% (1 sigma)
                    │
                    ▼
           ┌───────────────────┐
           │     ┌───────┐     │
    TEE    │     │   ⭕   │     │
     │     │     │  YOU  │     │
     ▼     │     │   📍   │     │
   ╔═══════════════════════════════════╗
   ║ ████████████████████████████████ ║ ← 95% av alle slag
   ║ ██                            ██ ║
   ║ ██    ┌────────────────┐     ██ ║
   ║ ██    │   🎯 TARGET    │     ██ ║
   ║ ██    │                │     ██ ║
   ║ ██    └────────────────┘     ██ ║
   ║ ██                            ██ ║
   ║ ████████████████████████████████ ║
   ╚═══════════════════════════════════╝
                    ▲
                    │
              95% (2 sigma)

MÅL: Midt green (ikke flagg!)
- Med 24m lateral spredning: Du vil treffe green ~70% av gangene
- Med flagg på kanten: Bare ~40% treffrate
```

---

## 4. HULL-STRATEGI GENERATOR

### 4.1 Algoritme for Hull-Analyse

```typescript
interface HullStrategi {
  hull: number;
  par: number;
  
  // Tee-shot strategi
  teeShot: {
    recommendedClub: string;
    target: GPSCoordinate;
    aimDescription: string;
    
    // Risiko-analyse
    riskAssessment: {
      leftRough: { probability: number; consequence: string };
      rightRough: { probability: number; consequence: string };
      fairway: { probability: number; expectedOutcome: string };
    };
    
    // Buffer-kompliant?
    followsBufferRule: boolean;
    bufferWarning?: string;
  };
  
  // Approach strategi
  approach: {
    targetZone: GPSPolygon;
    aimPoint: GPSCoordinate;
    avoidHazards: Hazard[];
    
    // DECADE-reasoning
    reasoning: string;
    expectedScore: number;     // Forventet score basert på strategi
  };
  
  // Mentalt
  mental: {
    pressureLevel: 1-5;
    preShotRoutine: string;
    visualization: string;
  };
}

// HOVEDALGORITME
function generateHullStrategi(
  hull: HoleLayout,
  playerDispersion: PlayerDispersion,
  playerHandicap: number,
  mentalScorecard: MentalProfile
): HullStrategi {
  
  // 1. TEE-SHOT ANALYSE
  const teeStrategy = analyzeTeeShot(
    hull.tee,
    hull.fairway,
    playerDispersion.clubs.get('driver'),
    playerHandicap
  );
  
  // 2. APPROACH ANALYSE
  const approachStrategy = analyzeApproach(
    hull.green,
    playerDispersion,
    mentalScorecard.pressureTolerance
  );
  
  // 3. RISIKO-VURDERING
  const risk = calculateRiskProfile(
    teeStrategy,
    approachStrategy,
    mentalScorecard
  );
  
  return {
    hull: hull.number,
    par: hull.par,
    teeShot: teeStrategy,
    approach: approachStrategy,
    risk,
  };
}

// TEE-SHOT ANALYSE
function analyzeTeeShot(
  tee: TeeBox,
  fairway: FairwayGeometry,
  driverDispersion: ClubDispersion,
  handicap: number
): TeeStrategy {
  
  // 1. Beregn buffer-sone
  const buffer = calculateBufferZone(fairway, handicap);
  
  // 2. Sjekk om driver passer innenfor buffer
  const driverLateralRisk = driverDispersion.confidence95.lateral;
  const driverSafe = driverLateralRisk < (buffer.safeZoneWidth / 2);
  
  // 3. Hvis for risikabelt, vurder 3-tre
  if (!driverSafe) {
    return {
      recommendedClub: '3-tre',
      reasoning: `Driver (${driverLateralRisk}m spredning) er for risikabelt. ` +
                 `Fairway "fat part" er ${buffer.safeZoneWidth}m med ${buffer.bufferPercent*100}% buffer.`,
      target: calculateSafeAimpoint(fairway, '3-wood'),
      followsBufferRule: true,
    };
  }
  
  // 4. Hvis driver er OK
  return {
    recommendedClub: 'driver',
    reasoning: `Driver (${driverLateralRisk}m spredning) passer innenfor ` +
               `${buffer.safeZoneWidth}m safe zone (${buffer.bufferPercent*100}% buffer).`,
    target: buffer.safeAimpoint,
    followsBufferRule: true,
  };
}

// APPROACH ANALYSE
function analyzeApproach(
  green: GreenLayout,
  playerDispersion: PlayerDispersion,
  pressureTolerance: number
): ApproachStrategy {
  
  // 1. Finn relevant kølle for distanse
  const approachClub = selectClub(green.distanceToCenter);
  const dispersion = playerDispersion.clubs.get(approachClub);
  
  // 2. Beregn siktepunkt basert på spredning
  const lateralSpread = dispersion.confidence95.lateral;
  
  // 3. Velg siktepunkt
  // Hvis spredning > 50% av green-bredde: Sikte midt green
  // Hvis spredning < 30% av green-bredde: Kan vurdere flagg
  const greenWidth = green.width;
  const spreadRatio = lateralSpread / greenWidth;
  
  let targetPoint: GPSCoordinate;
  let reasoning: string;
  
  if (spreadRatio > 0.5) {
    // Stor spredning - sikte midt
    targetPoint = green.center;
    reasoning = `Din ${lateralSpread}m spredning er ${(spreadRatio*100).toFixed(0)}% av green-bredden. ` +
                `Sikte på midt gir 80%+ sjanse for green-treff.`;
  } else if (green.pinLocation && spreadRatio < 0.3) {
    // Liten spredning, pin er "safe"
    targetPoint = calculateSafePinTarget(green.pinLocation, dispersion);
    reasoning = `Din ${lateralSpread}m spredning er lav. ` +
                `Pin er plassert i "safe" del av green. Sikte på pin OK.`;
  } else {
    // Mellomsituasjon
    targetPoint = calculateWeightedTarget(green, dispersion);
    reasoning = `Sikte på "fat part" av green, tilpasset pin-plassering.`;
  }
  
  return {
    targetZone: calculateTargetZone(targetPoint, dispersion),
    aimPoint: targetPoint,
    reasoning,
    expectedScore: calculateExpectedScore(green, targetPoint, dispersion),
  };
}
```

---

## 5. DECISION FRAMEWORK

### 5.1 Beslutnings-Vurdering

```typescript
type DecisionGrade = 'SMART' | 'NEUTRAL' | 'RISKY' | 'POOR';

interface DecisionEvaluation {
  grade: DecisionGrade;
  score: number;              // 0-100
  
  // Begrunnelser
  positives: string[];
  negatives: string[];
  
  // Alternativ
  alternative?: string;
  alternativeExpectedScore?: number;
}

function evaluateDecision(
  situation: GolfSituation,
  decision: PlayerDecision,
  playerProfile: PlayerProfile
): DecisionEvaluation {
  
  const positives: string[] = [];
  const negatives: string[] = [];
  let score = 50; // Start neutrally
  
  // 1. Buffer-regel sjekk
  if (followsBufferRule(decision, situation)) {
    positives.push("Følger 5% buffer-regelen");
    score += 20;
  } else {
    negatives.push("Bryter buffer-regelen - økt risiko");
    score -= 25;
  }
  
  // 2. Sprednings-sjekk
  const dispersionFit = checkDispersionFit(decision, playerProfile.dispersion);
  if (dispersionFit.safe) {
    positives.push(`Siktepunkt passer din ${dispersionFit.lateralSpread}m spredning`);
    score += 15;
  } else {
    negatives.push(`Siktepunkt er for aggressivt for din ${dispersionFit.lateralSpread}m spredning`);
    score -= 20;
  }
  
  // 3. Press-nivå sjekk
  const pressureAppropriate = checkPressureAppropriateness(
    decision, 
    situation.pressureLevel,
    playerProfile.mental.pressureTolerance
  );
  if (pressureAppropriate) {
    positives.push("Beslutning passer press-nivået");
    score += 10;
  } else {
    negatives.push("For aggressivt i høyt press");
    score -= 15;
  }
  
  // 4. Bogey avoidance
  const bogeyRisk = calculateBogeyRisk(decision, situation);
  if (bogeyRisk < 0.2) {
    positives.push("Lav risiko for dobbel-bogey");
    score += 10;
  } else if (bogeyRisk > 0.4) {
    negatives.push("Høy risiko for dobbel-bogey");
    score -= 20;
  }
  
  // 5. Bestem grade
  let grade: DecisionGrade;
  if (score >= 80) grade = 'SMART';
  else if (score >= 60) grade = 'NEUTRAL';
  else if (score >= 40) grade = 'RISKY';
  else grade = 'POOR';
  
  return {
    grade,
    score: Math.max(0, Math.min(100, score)),
    positives,
    negatives,
  };
}
```

### 5.2 Real-Time Caddy Feedback

```
EKSEMPEL: Du står på hull 7, par 4

┌─────────────────────────────────────────────────────────────────┐
│  DECADE CADDY - HULL 7                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SITUASJON:                                                      │
│  • Distanse til green: 145m                                      │
│  • Pin: Bak-høyre                                                │
│  • Vind: 3 m/s fra venstre                                       │
│  • Din 8-jern spredning: ±12m (konkurranse)                      │
│                                                                  │
│  🎯 ANBEFALT STRATEGI:                                           │
│                                                                  │
│  Kølle: 8-jern (125m) + 9-jern (135m) rull?                     │
│  Nei, hold deg til 8-jern med smooth tempo                       │
│                                                                  │
│  Sikte: MIDT GREEN (ikke flagg!)                                │
│  Grunn: Din 24m (95%) spredning tilsier midt-sikte             │
│                                                                  │
│  Visuelt:                                                        │
│  ┌─────────────────────────────────────────┐                     │
│  │              GREEN                      │                     │
│  │         ┌───────────┐                   │                     │
│  │         │    ⭕     │ ← Sikte her       │                     │
│  │         │   (YOU)   │                   │                     │
│  │         └───────────┘                   │                     │
│  │               🔴                        │                     │
│  │              (PIN)   ❌ Ikke sikte her  │                     │
│  │                                         │                     │
│  └─────────────────────────────────────────┘                     │
│                                                                  │
│  FORVENTET RESULTAT:                                             │
│  • 78% sjanse for green-treff                                    │
│  • 15% birdie-putt (hvis pin er bak)                            │
│  • 60% par eller bedre                                           │
│                                                                  │
│  ⚠️ HVIS DU SIKTER PÅ FLAGGET:                                   │
│  • 42% sjanse for green-treff                                    │
│  • 30% i bunker høyre (dobbel-bogey fare!)                      │
│                                                                  │
│  [FØLG RÅD] [OVERSKRIV]                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. SHOTGUN VS RIFLE PATTERN

### 6.1 Visuell Forklaring

```
MISFORSTÅELSE: "Rifle Shot" (Feil!)
                    
         🏌️                                     
          │                                     
          │ ← "Jeg sikter på dette punktet"
          │                                     
          ▼                                     
         🎯                                     
         │                                     
         │ ← "Jeg treffer dette punktet"
         │                                     
         ▼                                     
       GREEN                                   
       [🎯] ← Ball lander nøyaktig her        
       
REALITET: "Shotgun Pattern" (Korrekt!)

         🏌️                                     
          │                                     
          │ ← "Jeg sikter på midt green"      
          │                                     
          ▼                                     
         🎯                                     
     ╔═══════════╗                             
     ║  SPREDNING ║ ← 95% av dine slag lander  
     ║   ⭕⭕⭕    ║    et sted i denne sonen   
     ║  ⭕🎯⭕    ║                             
     ║   ⭕⭕⭕    ║                             
     ╚═══════════╝                             
          │                                     
          ▼                                     
       GREEN                                   
    ┌───────────────┐                          
    │  ⭕ ⭕ ⭕ ⭕  │                          
    │ ⭕  🎯  ⭕  │ ← Ballen lander spredt   
    │  ⭕ ⭕ ⭕ ⭕  │                          
    └───────────────┘                          
    
IMPLIKASJON:
• Du kan ikke kontrollere NØYAKTIG hvor ballen lander
• Du kan kontrollere HVOR MIDT I SPREDNINGEN du sikter
• Derfor: Sikte på "fat part" av green, ikke flagget
```

---

## 7. BOGEY AVOIDANCE PRIORITET

### 7.1 Poeng-Budsjett

```
SCOTT FAWCETT'S POENG-BUDSJETT:

Gjennomsnittlig PGA Tour spiller:
• Birdies per runde: 3.5 (±1)
• Bogeys per runde: 2.5 (±1)
• Dobbelt-bogeys: 0.3 (maks!)

BUDSJETT FOR AMATØR (HCP 10):
• Birdies: 0.5 (ikke jakt på disse!)
• Pars: 9-10 (målet)
• Bogeys: 6-7 (akseptabelt)
• Dobbelt-bogeys: 0-1 (UNNGÅ FOR ENHVER PRIS!)

STRATEGI:
Hvis du unngår dobbel-bogey, kan du "kjøpe" 1-2 ekstra birdie-forsøk
per runde. Men ALDRI hvis det øker dobbel-bogey risikoen.
```

### 7.2 Bogey-Avoidance Algoritme

```typescript
function calculateBogeyRisk(
  decision: PlayerDecision,
  situation: GolfSituation,
  playerProfile: PlayerProfile
): number {
  
  let risk = 0;
  
  // 1. Hindere i spill?
  if (decision.targetNearHazard) {
    risk += 0.3;
  }
  
  // 2. Spredning vs margin
  const dispersion = playerProfile.dispersion.clubs.get(decision.club);
  const targetMargin = calculateTargetToHazardMargin(decision);
  
  if (dispersion.confidence95.lateral > targetMargin) {
    // Din spredning overlapper med fare!
    risk += 0.4;
  }
  
  // 3. Press-faktor
  if (situation.pressureLevel >= 4) {
    // Under høyt press øker spredning med ~30%
    const pressureAdjustedSpread = dispersion.confidence95.lateral * 1.3;
    if (pressureAdjustedSpread > targetMargin) {
      risk += 0.2;
    }
  }
  
  // 4. Hull-vanskelighetsgrad
  if (situation.holeStrokeIndex <= 5) {
    // Vanskelig hull - ekstra forsiktig
    risk += 0.1;
  }
  
  return Math.min(1.0, risk);
}

function shouldPlayConservative(
  bogeyRisk: number,
  birdieChance: number
): boolean {
  // DECADE-regel: Unngå dobbel-bogey først!
  if (bogeyRisk > 0.3) {
    return true; // Spill konservativt
  }
  
  // Hvis birdie-sjanse er høy OG risiko er lav
  if (birdieChance > 0.25 && bogeyRisk < 0.15) {
    return false; // Kan være aggressiv
  }
  
  return true; // Default til konservativt
}
```

---

## 8. IMPLEMENTASJON

### 8.1 Backend Servicer

```typescript
// lib/portal/golf/decade-engine.ts

export class DecadeEngine {
  constructor(
    private playerService: PlayerService,
    private courseService: CourseService,
    private dispersionService: DispersionService
  ) {}
  
  /**
   * Generer komplett hull-strategi
   */
  async generateHoleStrategy(
    playerId: string,
    courseId: string,
    holeNumber: number,
    context: 'TRAINING' | 'CASUAL' | 'COMPETITION'
  ): Promise<HullStrategi> {
    
    // 1. Hent data
    const player = await this.playerService.get(playerId);
    const hole = await this.courseService.getHole(courseId, holeNumber);
    const dispersion = await this.dispersionService.get(
      playerId, 
      context
    );
    
    // 2. Beregn buffer
    const buffer = this.calculateBuffer(
      hole.fairway, 
      player.handicap
    );
    
    // 3. Analyser tee-shot
    const teeStrategy = this.analyzeTeeShot(
      hole,
      dispersion,
      buffer
    );
    
    // 4. Analyser approach
    const approachStrategy = this.analyzeApproach(
      hole,
      dispersion,
      player.mentalProfile
    );
    
    // 5. Returner
    return {
      hull: holeNumber,
      par: hole.par,
      teeShot: teeStrategy,
      approach: approachStrategy,
    };
  }
  
  /**
   * Evaluer en spiller-beslutning
   */
  async evaluateDecision(
    playerId: string,
    decision: PlayerDecision,
    situation: GolfSituation
  ): Promise<DecisionEvaluation> {
    
    const player = await this.playerService.get(playerId);
    
    return evaluateDecision(decision, situation, player);
  }
}
```

### 8.2 Frontend-Komponenter

```typescript
// app/(portal)/spill/[roundId]/decade-caddy.tsx

export function DecadeCaddy({ 
  hull, 
  playerProfile,
  onAdviceFollowed 
}: DecadeCaddyProps) {
  
  const { data: strategy } = useHullStrategi(hull.id);
  const [playerDecision, setPlayerDecision] = useState<PlayerDecision>();
  
  return (
    <Card className="decade-caddy">
      <CardHeader>
        <CardTitle>🎯 DECADE Caddy</CardTitle>
        <CardDescription>
          Hull {hull.number} - Strategi basert på din spredning
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Anbefalt strategi */}
        <StrategyRecommendation strategy={strategy} />
        
        {/* Sprednings-visualisering */}
        <DispersionVisualization 
          club={strategy.recommendedClub}
          dispersion={playerProfile.dispersion}
        />
        
        {/* Spiller-input */}
        <PlayerDecisionForm 
          onSubmit={setPlayerDecision}
        />
        
        {/* Evaluering */}
        {playerDecision && (
          <DecisionEvaluation 
            decision={playerDecision}
            evaluation={strategy.evaluate(playerDecision)}
          />
        )}
      </CardContent>
    </Card>
  );
}
```

---

## OPPSUMMERING

### Nøkkel-Algoritmer

1. **Buffer-Kalkulasjon**: 5% (7% for >10 HCP) av "fat part"
2. **Dispersion-Matching**: Siktepunkt må passe spillerens spredning
3. **Shotgun Pattern**: Aksepter at du har spredning
4. **Bogey Avoidance**: Prioriter å unngå dobbel-bogey
5. **Decision Grading**: SMART/NEUTRAL/RISKY/POOR

### Data-Kilder

- Player dispersion (TrackMan/estimat)
- Course geometry (GPS/mapping)
- Mental profile (spillerens press-toleranse)
- Weather (vind-påvirkning)

### Output

- Hull-spesifikk strategi
- Real-time beslutnings-støtte
- Post-round analyse
