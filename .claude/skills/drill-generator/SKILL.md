---
name: drill-generator
description: |
  Genererer spesifikke golf-driller for putting, chipping, driving og jern.
  Fokus på målbare resultater og progresjon.
argument-hint: |
  Bruk når spilleren trenger konkrete driller for spesifikke områder.
  Skill-based drills med klare mål og progresjon.
allowed-tools: [ReadFile, SearchWeb]
user-invocable: true
---

# Drill Generator

Genererer spesifikke golf-driller for putting, chipping, driving og jern med målbare resultater.

## Når å bruke

- Ved teknisk trening på spesifikke slag
- For å måle fremgang over tid
- Ved forberedelse til turnering
- For å bygge selvtillit i spesifikke situasjoner

## Input

```typescript
{
  playerId: string;
  drillType: 'putting' | 'chipping' | 'driving' | 'irons' | 'bunker' | 'pitching';
  focus?: string;                // Spesifikt fokus (f.eks. "distance control")
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  timeAvailable: number;         // Minutter
  competitive?: boolean;         // Inkluder konkurransedriller
}
```

## Output

```typescript
{
  drills: [{
    id: string;
    name: string;
    category: string;
    description: string;
    setup: string;               // Hvordan sette opp drillen
    execution: string;           // Gjennomføring
    scoring: string;             // Hvordan score
    targetScore?: number;        // Mål-score basert på skillLevel
    duration: number;
    variations?: string[];       // Vanskelighetsgraderinger
  }];
}
```

## Putting-driller

### Gate Drill
- **Setup**: To tees 1 klubbehode fra hverandre, 3-6 fot fra hull
- **Execution**: Putt 10 baller gjennom porten
- **Scoring**: 1 poeng per ball i hullet
- **Targets**: Beginner 5, Intermediate 7, Advanced 8, Pro 9

### Clock Drill
- **Setup**: 4 avstander (3, 6, 9, 12 fot), 3 baller per avstand
- **Execution**: Putt alle baller i sekvens
- **Scoring**: 1 poeng per ball i hullet
- **Targets**: Beginner 6/12, Intermediate 8/12, Advanced 10/12, Pro 11/12

### Ladder Drill
- **Setup**: 3 baller ved 3, 6, 9 fot
- **Execution**: Må putte korteste ball før neste
- **Scoring**: Fullførte sett
- **Targets**: Beginner 2, Intermediate 3, Advanced 4, Pro 5 sett

## Chipping-driller

### Up-and-Down Challenge
- **Setup**: 5 forskjellige posisjoner rundt green
- **Execution**: Chip + putt for par
- **Scoring**: Par = 2 poeng, Bogey = 1 poeng
- **Targets**: Beginner 5, Intermediate 7, Advanced 8, Pro 9 av 10

### Landing Zone
- **Setup**: 3 sirkler (2, 4, 6 fot radius), 10 baller
- **Execution**: Land ball i sirkel
- **Scoring**: Senter = 3, mellom = 2, ytterkant = 1
- **Targets**: Beginner 12, Intermediate 18, Advanced 22, Pro 25

## Driving-driller

### Fairway Finder
- **Setup**: 10 baller, målrettet fairway
- **Execution**: Drive med fokus på fairway-treff
- **Scoring**: Fairway = 2, rough = 1, miss = 0
- **Targets**: Beginner 10, Intermediate 14, Advanced 16, Pro 18

### Dispersion Circle
- **Setup**: Mål på 200-250m, TrackMan/radar
- **Execution**: 10 drives, mål spread
- **Scoring**: Innen 30m = 2, 50m = 1, miss = 0
- **Targets**: Beginner 8, Intermediate 12, Advanced 16, Pro 18

## Jern-driller

### 50-100-150
- **Setup**: Mål på 50, 100, 150m (2 baller hver)
- **Execution**: Treff mål med riktig klubbe
- **Scoring**: Innnen 5m = 3, 10m = 2, 15m = 1
- **Targets**: Beginner 12, Intermediate 18, Advanced 24, Pro 28

## Eksempel

**Input:**
```json
{
  "playerId": "user_123",
  "drillType": "putting",
  "focus": "short putts",
  "skillLevel": "intermediate",
  "timeAvailable": 30
}
```

**Output:**
```json
{
  "drills": [{
    "name": "Gate Drill Progression",
    "category": "putting",
    "description": "Bygg selvtillit på korte putter med progressiv vanskelighetsgrad",
    "setup": "Plasser to tees 1 klubbehode fra hverandre i putting-linjen",
    "execution": "Nivå 1: 3 fot (5 baller), Nivå 2: 4 fot (5 baller), Nivå 3: 5 fot (5 baller). Mål fullføre nivå før neste.",
    "scoring": "1 poeng per ball i hullet",
    "targetScore": 7,
    "duration": 15,
    "variations": ["Smalere port", "Lengre avstand", "Uphill/downhill"]
  }]
}
```
