---
name: test-generator
description: |
  Genererer skills-assessment tester for å måle spillerens ferdigheter.
  Inkluderer 50-100-150, 9 hull challenge, 3-putt avoidance, dispersion test.
argument-hint: |
  Bruk for å etablere baseline, måle fremgang, eller identifisere svakheter.
  Standardiserte tester med HCP-baserte mål.
allowed-tools: [ReadFile, SearchWeb]
user-invocable: true
---

# Test Generator

Genererer skills-assessment tester for å måle spillerens ferdigheter og etablere baseline.

## Når å bruke

- Ved oppstart av ny treningsperiode
- For å måle fremgang over tid
- For å identifisere svakheter vs styrker
- Ved sesongforberedelse

## Input

```typescript
{
  playerId: string;
  handicap: number;              // Nåværende HCP
  tests: string[];               // Hvilke tester å inkludere
  timeAvailable?: number;        // Total tid (default 90 min)
  courseType?: 'parkland' | 'links' | 'heathland';
}
```

## Tilgjengelige tester

| Test | Ferdighet | Varighet | Utstyr |
|------|-----------|----------|--------|
| 50-100-150 | Wedge kontroll | 20 min | 6 baller |
| 9-hull-challenge | Scoring | 2-3 timer | Full bag |
| 3-putt-avoidance | Putting press | 15 min | 10 baller |
| driver-dispersion | Nøyaktighet | 15 min | 10 baller + TrackMan |
| up-and-down | Short game | 20 min | 10 baller |
| fairways-hit | Driving nøyaktighet | 15 min | 10 baller |

## Output

```typescript
{
  testBattery: [{
    id: string;
    name: string;
    description: string;
    duration: number;
    setup: string;
    execution: string;
    scoring: string;
    targets: {
      scratch: number;
      singleDigit: number;
      midHandicap: number;
      highHandicap: number;
    };
    interpretation: string;      // Hva resultatet betyr
  }];
  totalTime: number;
  schedule: string;              // Rekkefølge og pauser
}
```

## Test-beskrivelser

### 50-100-150 Test
Måler wedge-kontroll på typiske innspillsavstander.

**Gjennomføring:**
- 2 baller fra 50m, 100m, 150m
- Mål: green (50m) eller målsone (100/150m)
- Scoring: Green/sone = 2, nærme = 1, miss = 0

**Mål (total 12 poeng):**
- Scratch: 10+
- Single digit (1-9): 8-9
- Mid handicap (10-18): 6-7
- High handicap (19+): 4-5

### 9 Hull Challenge
Scoring-test på bane under press.

**Gjennomføring:**
- Spill 9 hull (valgfrie hull)
- Registrer: score, FW, GIR, putts
- Scoring: Stableford-poeng

**Mål:**
- Scratch: 18+ poeng
- Single digit: 15-17 poeng
- Mid handicap: 12-14 poeng
- High handicap: 9-11 poeng

### 3-Putt Avoidance Test
Måler putting under progressivt press.

**Gjennomføring:**
- Runde 1: 10 putter fra 3 fot (ingen press)
- Runde 2: 10 putter fra 4 fot (selvpress)
- Runde 3: 10 putter fra 5 fot (konkurranse)

**Scoring:** 1 poeng per 2-putt eller bedre, -1 for 3-putt

**Mål:**
- Scratch: 25+
- Single digit: 20-24
- Mid handicap: 15-19
- High handicap: 10-14

### Driver Dispersion Test
Måler driving-konsistens.

**Gjennomføring:**
- 10 drives med TrackMan/radar
- Mål: 30m bred sone
- Scoring: Innen sone = 2, 50m = 1, miss = 0

**Mål (total 20):**
- Scratch: 18+
- Single digit: 15-17
- Mid handicap: 12-14
- High handicap: 8-11

## Eksempel

**Input:**
```json
{
  "playerId": "user_123",
  "handicap": 12,
  "tests": ["50-100-150", "3-putt-avoidance", "up-and-down"],
  "timeAvailable": 60
}
```

**Output:**
```json
{
  "testBattery": [{
    "name": "50-100-150 Wedge Test",
    "description": "Mål din nøyaktighet på typiske innspillsavstander",
    "duration": 20,
    "targets": {
      "scratch": 10,
      "singleDigit": 8,
      "midHandicap": 6,
      "highHandicap": 4
    },
    "interpretation": "Score <6: Fokus på teknikk. Score 6-8: God kontroll. Score 9+: Elite-nivå."
  }],
  "totalTime": 55,
  "schedule": "1. Warm-up (10 min) → 2. 50-100-150 (20 min) → 3. 3-utt (15 min) → 4. Up-and-down (20 min)"
}
```
