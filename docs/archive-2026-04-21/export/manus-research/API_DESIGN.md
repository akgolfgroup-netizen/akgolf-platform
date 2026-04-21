# API Design
## World Class Golf Platform

---

## 1. Shot-by-Shot API

### POST /api/portal/rounds/{roundId}/shots
Registrer et nytt slag i runden.

```typescript
// Request
{
  "shotNumber": 2,
  "from": {
    "lie": "FAIRWAY",
    "distanceToPin": 145,
    "elevation": "FLAT"
  },
  "club": "8-iron",
  "intendedShape": "DRAW",
  "intendedDistance": 140,
  "result": {
    "lie": "GREEN",
    "distanceToPin": 12,
    "proximity": 12
  },
  // TrackMan-data (valgfritt)
  "trackmanData": {
    "ballSpeed": 115.2,
    "launchAngle": 18.5,
    "spin": 7200,
    "carry": 138,
    "total": 142,
    "offline": 3
  }
}

// Response
{
  "shotId": "shot_abc123",
  "strokesGained": 0.3,
  "sgCategory": "APP",
  "baseline": 2.82,  // Forventet slag fra 145m fairway
  "actual": 2.5,     // 1 slag + 0.5 forventet putt fra 12m
  "message": "Great shot! +0.3 SG vs Tour average"
}
```

### GET /api/portal/rounds/{roundId}/sg-summary
Hent SG-oppsummering for runden.

```typescript
// Response
{
  "holesPlayed": 7,
  "totalSG": 1.4,
  "byCategory": {
    "OTT": { "sg": 0.8, "shots": 7 },
    "APP": { "sg": 0.5, "shots": 14 },
    "ARG": { "sg": 0.2, "shots": 8 },
    "PUTT": { "sg": -0.1, "shots": 21 }
  },
  "byDistance": {
    "100-125": { "sg": 0.4, "shots": 3 },
    "125-150": { "sg": 0.2, "shots": 4 },
    "150-175": { "sg": -0.1, "shots": 2 }
  },
  "tourScore": 68,  // "Du er på 68% av Tour-nivå denne runden"
  "projectedScore": 76  // Forventet 18-hull score basert på SG
}
```

---

## 2. Test API

### POST /api/portal/tests/{testId}/start
Start en ny test-session.

```typescript
// Request
{
  "location": "Mulligan Sarpsborg",
  "weather": "SUNNY",
  "usedTrackMan": true,
  "trackmanSessionId": "tm_123"  // Hvis TrackMan er koblet
}

// Response
{
  "sessionId": "session_xyz",
  "test": {
    "name": "100m Approach Challenge",
    "protocol": {
      "shots": 10,
      "distance": 100,
      "target": "circle-20ft"
    }
  },
  "tourBenchmark": 21.0,  // feet (for spillerens kategori)
  "roryBenchmark": 14.2   // Rory's best
}
```

### POST /api/portal/tests/sessions/{sessionId}/complete
Fullfør test og få resultater.

```typescript
// Request
{
  "shots": [
    { "distanceFromTarget": 18.5 },
    { "distanceFromTarget": 22.3 },
    // ... 8 flere
  ],
  "notes": "Litt vind i dag"
}

// Response
{
  "sessionId": "session_xyz",
  "rawScore": 19.8,      // Gj.sn. proximity
  "tourScore": 72,       // 72% av Tour (21.0/19.8 * 100, capped)
  "roryScore": 71.7,     // 71.7% av Rory (14.2/19.8 * 100)
  
  "categoryLevel": "SILVER",  // Based on requirements
  
  "improvement": {
    "fromLast": 2.3,     // % forbedring fra forrige test
    "trend": "UP",       // UP, DOWN, FLAT
    "personalBest": false
  },
  
  "rankings": {
    "inAcademy": 12,     // #12 av 150
    "inCategory": 3,     // #3 av 45 i kategori F
    "percentile": 78     // Bedre enn 78% av alle
  },
  
  "nextMilestone": {
    "target": 18.0,      // feet
    "current": 19.8,
    "neededImprovement": 1.8,
    "estimatedSessions": 3  // Basert på historisk fremgang
  },
  
  "shareText": "Jeg fikk 72% Tour Score på 100m Approach Test! 🏆 #AKGolf",
  "shareImageUrl": "https://akgolf.no/api/share/test-session_xyz.png"
}
```

### GET /api/portal/tests/leaderboard
Hent leaderboard for en test.

```typescript
// Query params: testId, period (all/month/week), category (optional)

// Response
{
  "test": { "name": "100m Approach Challenge" },
  "filters": { "period": "month", "category": "F" },
  "leaderboard": [
    {
      "rank": 1,
      "name": "Anders K.",
      "category": "F",
      "rawScore": 16.2,
      "tourScore": 86,
      "improvement": 5.2,
      "trend": "📈"
    },
    // ... 9 flere
  ],
  "userRank": {
    "rank": 12,
    "total": 45,
    "percentile": 73
  },
  "statistics": {
    "categoryAverage": 21.5,
    "bestThisMonth": 14.8,
    "averageImprovement": 1.2
  }
}
```

---

## 3. Tour Comparison API

### GET /api/portal/tour-comparison
Hent komplett sammenligning med Tour.

```typescript
// Response
{
  "player": {
    "name": "Mikael",
    "category": "F",
    "handicap": 16.2,
    "roundsAnalyzed": 8
  },
  
  "sgProfile": {
    "total": -2.1,
    "offTheTee": -0.7,
    "approach": -0.8,
    "aroundGreen": -0.4,
    "putting": -0.2
  },
  
  "tourComparison": {
    "median": {
      "total": 0,
      "offTheTee": 0,
      "approach": 0,
      "aroundGreen": 0,
      "putting": 0
    },
    "gap": {
      "total": -2.1,
      "offTheTee": -0.7,
      "approach": -0.8,
      "aroundGreen": -0.4,
      "putting": -0.2
    },
    "tourScore": {
      "total": 62,
      "byCategory": {
        "offTheTee": 58,
        "approach": 55,
        "aroundGreen": 65,
        "putting": 72
      }
    }
  },
  
  "peerComparison": {
    "category": "F",
    "categoryAverage": -2.3,
    "playerVsCategory": "+0.2",  // Bedre enn snitt i kategori
    "percentileInCategory": 65
  },
  
  "improvementPotential": [
    {
      "category": "APPROACH",
      "currentSG": -0.8,
      "targetSG": -0.5,  // Neste nivå (kategori E)
      "potentialGain": 0.3,
      "handicapImpact": -1.5,  // ca. 3 slag HCP
      "priority": 1
    },
    {
      "category": "OFF_THE_TEE",
      "currentSG": -0.7,
      "targetSG": -0.6,
      "potentialGain": 0.1,
      "handicapImpact": -0.5,
      "priority": 2
    }
  ],
  
  "proComparison": {
    "similarTo": [
      {
        "player": "Zach Johnson",
        "similarity": 0.82,
        "reason": "Both excel in short game, work in progress on approach"
      }
    ],
    "vsRory": {
      "rorySG": { "total": 1.8, "approach": 0.6 },
      "gapToRory": -3.9,
      "roryScore": 52  // "Du er på 52% av Rory's nivå"
    }
  }
}
```

---

## 4. Training Prescription API

### POST /api/portal/training/generate
Generer ny treningsplan.

```typescript
// Request
{
  "timeAvailable": 5,  // timer per uke
  "facilities": ["range", "putting_green", "simulator"],
  "goalHandicap": 12,
  "focusPreference": "APPROACH"  // optional override
}

// Response
{
  "prescriptionId": "rx_123",
  "validFor": {
    "from": "2026-04-15",
    "to": "2026-04-28"
  },
  
  "analysis": {
    "basedOn": {
      "rounds": 8,
      "tests": 5,
      "trackmanSessions": 3
    },
    "findings": [
      "Approach er 0.3 SG bak kategori E-krav",
      "100m test viser 68% Tour Score (trenger 73%)",
      "Putting er styrke (72% Tour Score)"
    ]
  },
  
  "focusAreas": [
    {
      "area": "APPROACH",
      "priority": 9,
      "timeAllocation": 40,
      "reason": "Størst gap til neste nivå. 0.3 SG = -1.5 HCP",
      "keyTests": ["100m-approach", "150m-approach"],
      "drills": [
        {
          "name": "100m Target Practice",
          "description": "10 slag mot 100m target, fokus på proximity",
          "duration": 20,
          "frequency": "2x per uke"
        }
      ]
    },
    {
      "area": "PUTTING",
      "priority": 5,
      "timeAllocation": 20,
      "reason": "Vedlikehold styrke",
      "keyTests": ["putt-ladder-6ft"],
      "drills": [...]
    }
  ],
  
  "weeklyPlan": {
    "week1": {
      "totalHours": 4.5,
      "sessions": [
        {
          "day": "mon",
          "duration": 45,
          "type": "TRACKMAN",
          "focus": "APPROACH",
          "exercises": ["100m-10-shots", "150m-10-shots"],
          "target": "Tour Score 68% → 71%"
        },
        {
          "day": "wed",
          "duration": 60,
          "type": "RANGE",
          "focus": "MIXED",
          "exercises": [...]
        }
        // ... flere økter
      ]
    }
  },
  
  "goals": {
    "sgTarget": -1.8,  // Fra -2.1
    "testTargets": [
      { "testId": "100m-approach", "from": 68, "to": 73 }
    ],
    "projectedHandicap": 14.5  // Om 4 uker med denne planen
  }
}
```

### GET /api/portal/training/current
Hent aktiv treningsplan.

```typescript
// Response
{
  "prescription": { /* som over */ },
  "progress": {
    "week": 2,
    "sessionsCompleted": 5,
    "sessionsTotal": 8,
    "testsCompleted": [
      { "testId": "100m-approach", "score": 70, "target": 73, "status": "CLOSE" }
    ],
    "sgTrend": -2.1 → -1.9  // På rett vei!
  },
  "adaptations": [
    {
      "type": "INCREASE_DIFFICULTY",
      "reason": "100m-test viser rask forbedring",
      "change": "Øk til 15 slag per økt"
    }
  ]
}
```

---

## 5. Course Intelligence API

### GET /api/portal/courses/{courseId}/guide
Hent personlig bane-guide.

```typescript
// Response
{
  "course": {
    "name": "Oslo Golfklubb",
    "difficulty": 8.2,
    "slope": 135,
    "comparison": "Ligner på TPC Boston (trange fairways)"
  },
  
  "personalizedStrategy": {
    "playerStrengths": ["Short game", "Putting"],
    "playerWeaknesses": ["Driver accuracy", "Long approach"],
    
    "holeStrategies": [
      {
        "hole": 3,
        "par": 4,
        "length": 380,
        "difficulty": "HIGH",
        "strategy": {
          "recommendation": "Legg opp med 3-tre",
          "reason": "Din driver: 35% fairway. 3-tre: 60% fairway + wedge-inn",
          "riskReward": "Konservativt = 4.2 forventet. Aggressivt = 4.8 forventet",
          "targetArea": "150m fra green, venstre side"
        }
      }
      // ... flere hull
    ]
  },
  
  "expectedScore": {
    "withStrategy": 85,
    "withoutStrategy": 89,
    "categoryAverage": 88,
    "bestPossible": 82
  }
}
```

---

## 6. Webhooks for Real-time

### Webhook: test.completed
```json
{
  "event": "test.completed",
  "userId": "user_123",
  "data": {
    "testId": "100m-approach",
    "tourScore": 72,
    "isPersonalBest": true
  }
}
```

### Webhook: category.advanced
```json
{
  "event": "category.advanced",
  "userId": "user_123",
  "data": {
    "from": "F",
    "to": "E",
    "reason": "Test results + round performance",
    "newGoals": [...]
  }
}
```

---

## Error Handling

```typescript
// Standard error format
{
  "error": {
    "code": "INSUFFICIENT_DATA",
    "message": "Trenger minst 3 runder for å generere treningsplan",
    "details": {
      "required": 3,
      "current": 1
    },
    "suggestion": "Spill 2 runder til og prøv igjen"
  }
}
```

## Rate Limiting

- Shot registration: 100/min (under runde)
- Test completion: 10/min
- Training generation: 5/min
- Tour comparison: 30/min

---

## Neste steg

1. Implementer endepunkter i rekkefølge:
   1. Shot API (kritisk for SG-beregning)
   2. Test API (kritisk for tracking)
   3. Tour Comparison (kritisk for motivasjon)
   4. Training Prescription (kritisk for verdi)

2. Sett opp webhook-endepunkter for real-time updates

3. Lag OpenAPI/Swagger-dokumentasjon
