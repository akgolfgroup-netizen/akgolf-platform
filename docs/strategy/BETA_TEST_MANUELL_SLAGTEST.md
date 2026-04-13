# Beta Test: Manuell Slagtest
## "Beat Rory McIlroy" - Driving Range Challenge

**Versjon:** Beta 1.0  
**Dato:** April 2026  
**Type:** Manuell input (ingen TrackMan ennå)  
**Varighet:** 30-45 minutter  
**Utstyr:** Golfklubber, baller, målebånd/turfglass, mobil

---

## 🎯 TEST-OVERSIKT

### Tre Tester:
1. **50m Approach** (ca. 55 yards) - Pitch/Chip-club
2. **100m Approach** (ca. 110 yards) - Kort jern/wedge  
3. **Driver Challenge** - 60m bred "fairway"

### Motstander: **Rory McIlroy** (DataGolf stats)

---

## 📊 RORY MCILROY - DATAGOLF PROFIL

```
┌─────────────────────────────────────────────────────────────┐
│  RORY MCILROY (PGA Tour)                                    │
├─────────────────────────────────────────────────────────────┤
│  DataGolf Rank: #3                                          │
│  Strokes Gained Approach: +0.8 (top 5%)                     │
│                                                              │
│  APPROACH SKILL (Proximity):                                │
│  ├─ 75-100 yards:  15.2 feet (4.6m)                        │
│  ├─ 100-125 yards: 18.4 feet (5.6m)  ← 50m/100m test      │
│  ├─ 125-150 yards: 21.8 feet (6.6m)                        │
│  └─ 150-175 yards: 25.1 feet (7.7m)                        │
│                                                              │
│  DRIVER (Fairway Accuracy):                                 │
│  ├─ Fairways hit: 58.3%                                    │
│  ├─ Left rough: 21.2%                                      │
│  └─ Right rough: 20.5%                                     │
│                                                              │
│  Scrambling: 62.4%                                          │
│  Putting (3-6m): 42.1%                                      │
└─────────────────────────────────────────────────────────────┘
```

### Hva Rory gjør i testen:

**50m Approach (55 yards):**
- **Target radius:** 4 meter (ca. 13 feet)
- **Rory's make rate:** ~75% (7.5 av 10 innenfor 4m)
- **Rory's gj.sn. proximity:** 4.2m

**100m Approach (110 yards):**
- **Target radius:** 6 meter (ca. 20 feet)
- **Rory's make rate:** ~68% (6.8 av 10 innenfor 6m)
- **Rory's gj.sn. proximity:** 5.8m

**Driver (60m fairway):**
- **Target:** Treffe fairway (60m bred)
- **Rory's make rate:** 58.3% (5.8 av 10)
- **Rory's spredning:** Ca. 35m venstre/høyre (95% av slag)

---

## 📝 TEST 1: 50m APPROACH

### Oppsett:
```
AVSTAND: 50 meter (55 yards) til flagg
LIE: Fairway/matta (god lie)
KLUBB: 56° wedge, 60° wedge, eller pitch
TARGET: Sirkel med 4m radius rundt flagg

    🏴‍☠️ (flagg)
     │
     │ 50m
     │
   [YOU]
```

### Gjennomføring:
1. Velg en klubb du føler deg komfortabel med fra 50m
2. Slå 10 slag mot et mål (bruk et skilt, markør, eller flagg)
3. **Mål avstand** fra der ballen lander til målet
4. Noter hver avstand (i meter)

### Manuell Input (i app):
```typescript
interface Test50mInput {
  testId: 'approach-50m-rory-challenge';
  date: Date;
  
  // Dine 10 slag (avstand i meter fra mål)
  shots: [
    { shotNumber: 1, proximity: number },  // f.eks. 3.2
    { shotNumber: 2, proximity: number },  // f.eks. 5.8
    { shotNumber: 3, proximity: number },  // f.eks. 2.1
    // ... opptil 10
  ];
  
  // Bonus info
  clubUsed: string;  // f.eks. "56° wedge"
  lie: 'MAT' | 'FAIRWAY' | 'ROUGH';
  wind: 'NONE' | 'LIGHT' | 'MODERATE' | 'STRONG';
  notes?: string;
}
```

### Scoring (Auto-kalkulert):
```typescript
// Mål: 4m radius (innenfor = "make")
const TARGET_RADIUS = 4;

// Dine stats
const yourMakes = shots.filter(s => s.proximity <= TARGET_RADIUS).length;
const yourMakeRate = (yourMakes / 10) * 100;
const yourAvgProximity = average(shots.map(s => s.proximity));

// vs Rory
const roryExpectedMakes = 7.5;
const roryAvgProximity = 4.2;

// Score
const makeDiff = yourMakes - roryExpectedMakes;  // +2 = du slo ham!
const proximityDiff = yourAvgProximity - roryAvgProximity;  // negativ = bedre

// % av Rory's nivå
const percentageOfRory = (yourMakes / roryExpectedMakes) * 100;
```

### Resultat-nivåer:
```
🏆 TOUR WINNER (100%+):     Du slo Rory! 8-10/10 innenfor 4m
🥇 TOUR PRO (80-99%):       6-7/10 - På Rory's nivå
🥈 GOOD AMATEUR (60-79%):   4-5/10 - Solid!
🥉 DEVELOPING (40-59%):     3-4/10 - OK, men tren mer
📚 NEEDS WORK (<40%):       0-2/10 - Øv mer på denne avstanden
```

---

## 📝 TEST 2: 100m APPROACH

### Oppsett:
```
AVSTAND: 100 meter (110 yards) til flagg
LIE: Fairway
KLUBB: Pitching wedge (48-50°), 9-jern, eller 8-jern
TARGET: Sirkel med 6m radius

    🏴‍☠️
     │
     │ 100m
     │
   [YOU]
```

### Gjennomføring:
1. Velg klubb du normalt bruker fra 100m
2. Slå 10 slag
3. Mål avstand fra landing til flagg
4. Noter resultater

### Manuell Input:
```typescript
interface Test100mInput {
  testId: 'approach-100m-rory-challenge';
  date: Date;
  
  shots: [
    { shotNumber: 1, proximity: number },
    // ... 10 slag
  ];
  
  clubUsed: string;  // f.eks. "PW" eller "9-jern"
  wind: 'NONE' | 'LIGHT' | 'MODERATE' | 'STRONG';
  lie: 'MAT' | 'FAIRWAY';
}
```

### Rory's Benchmark:
- **Target radius:** 6m
- **Rory's makes:** ~6.8 av 10
- **Rory's avg proximity:** 5.8m

### Scoring:
```
🏆 8-10/10 = Du er bedre enn Rory!
🥇 6-7/10 = Tour nivå
🥈 4-5/10 = God amatør
🥉 3/10 = OK
📚 <3/10 = Tren mer
```

---

## 📝 TEST 3: DRIVER CHALLENGE (60m Fairway)

### Oppsett:
```
OPPGAVE: Treffe en "fairway" som er 60 meter bred

Visualisering på range:
- Finn to markører (trær, skilt, staker) som er 60m fra hverandre
- Dette er din "fairway"
- Slå 10 drivere mellom disse punktene

    │←────── 60m bred fairway ──────→│
    │                                │
   🌳                              🌳
    │      🏌️  DRIVER               │
    │                                │
    └────────────────────────────────┘

VENSTRE (30m)        MIDT        HØYRE (30m)
     │                │              │
   ROUGH           FAIRWAY        ROUGH
```

### Måling:
For hver drive, noter:
1. **Treffet fairway?** (Ja/Nei)
2. Hvis nei: **Hvor langt ut?** (ca. meter fra fairway-kant)
3. **Avstand carry** (hvis mulig å se)

### Manuell Input:
```typescript
interface DriverTestInput {
  testId: 'driver-60m-rory-challenge';
  date: Date;
  
  // 10 drivere
  drives: [
    { 
      shotNumber: 1, 
      fairwayHit: boolean,           // true = innenfor 60m
      missDirection?: 'LEFT' | 'RIGHT',  // hvis miss
      missDistance?: number,         // meter ut
      carryDistance?: number,        // ca. meter (valgfritt)
      totalDistance?: number         // ca. meter (valgfritt)
    },
    // ... 10 drives
  ];
  
  wind: 'NONE' | 'LIGHT' | 'MODERATE' | 'STRONG';
  notes?: string;
}
```

### Rory's Benchmark:
```
RORY'S DRIVER STATS:
━━━━━━━━━━━━━━━━━━━━
• Fairways hit: 58.3% (5.8 av 10)
• Left rough: 21.2% (2.1 av 10)
• Right rough: 20.5% (2.1 av 10)
• Gj.sn. spredning: ~35m (venstre/høyre)
• Carry: ~285-300m
```

### Scoring:
```typescript
// Dine stats
const yourFairways = drives.filter(d => d.fairwayHit).length;
const yourFairwayRate = (yourFairways / 10) * 100;

// vs Rory
const roryFairways = 5.8;

// Score
const fairwayDiff = yourFairways - roryFairways;
const percentageOfRory = (yourFairways / roryFairways) * 100;

// Sprednings-score (lavere er bedre)
const yourMisses = drives.filter(d => !d.fairwayHit);
const yourAvgMissDistance = average(yourMisses.map(d => d.missDistance));
```

### Resultat:
```
🏆 7-10 fairways = Tour Winner! Bedre enn Rory
🥇 5-6 fairways = Tour nivå (som Rory)
🥈 3-4 fairways = God amatør
🥉 2 fairways = OK
📚 0-1 fairway = Work needed

BONUS: Spredning <20m = "Rifle" (konsistent)
       Spredning >40m = "Shotgun" (trenger konsistens)
```

---

## 📱 APP-IMPLEMENTASJON (Beta UI)

### Skjerm 1: Velg Test
```
┌─────────────────────────────────────────┐
│  BEAT RORY MCIlROY CHALLENGE            │
├─────────────────────────────────────────┤
│                                         │
│  Velg test:                             │
│                                         │
│  [🎯 50m Approach]                      │
│     10 slag fra 50m                     │
│     Target: 4m radius                   │
│     Rory: 7.5/10                        │
│                                         │
│  [🎯 100m Approach]                     │
│     10 slag fra 100m                    │
│     Target: 6m radius                   │
│     Rory: 6.8/10                        │
│                                         │
│  [🏌️ Driver Challenge]                  │
│     10 drivere, 60m fairway             │
│     Rory: 5.8/10 fairways               │
│                                         │
└─────────────────────────────────────────┘
```

### Skjerm 2: Input (50m eksempel)
```
┌─────────────────────────────────────────┐
│  50m APPROACH TEST (Slag 3/10)          │
├─────────────────────────────────────────┤
│                                         │
│  📍 Mål avstand fra flagg:              │
│                                         │
│  [____] meter                           │
│                                         │
│  Hjalp:                                 │
│  • 1m = Veldig nært!                    │
│  • 3m = Godt innenfor target            │
│  • 5m = Akseptabelt                     │
│  • 8m+ = Utenfor target                 │
│                                         │
│  [✓ LAGRE OG NESTE]                     │
│                                         │
│  Dine resultater så langt:              │
│  Slag 1: 3.2m ✓                         │
│  Slag 2: 5.8m ✓                         │
│                                         │
└─────────────────────────────────────────┘
```

### Skjerm 3: Driver Input
```
┌─────────────────────────────────────────┐
│  DRIVER TEST (Drive 3/10)               │
├─────────────────────────────────────────┤
│                                         │
│  Treffet du fairway (60m bred)?         │
│                                         │
│  [✓ JA]  [✗ NEI]                        │
│                                         │
│  ─────────────────────────              │
│  Hvis NEI:                              │
│                                         │
│  Miss-retning:                          │
│  [← Venstre]  [Høyre →]                 │
│                                         │
│  Ca. hvor langt ut? (meter)             │
│  [____] meter                           │
│                                         │
│  ─────────────────────────              │
│  Valgfritt:                             │
│  Ca. carry: [____] m                    │
│                                         │
│  [✓ LAGRE OG NESTE]                     │
│                                         │
└─────────────────────────────────────────┘
```

### Skjerm 4: Resultat
```
┌─────────────────────────────────────────┐
│  RESULTAT: 50m APPROACH                 │
├─────────────────────────────────────────┤
│                                         │
│  🏆 DU VANT MOT RORY!                   │
│                                         │
│  Ditt resultat:                         │
│  • 8/10 innenfor 4m (80%)              │
│  • Gj.sn. proximity: 3.1m              │
│                                         │
│  Rory McIlroy:                          │
│  • 7.5/10 (75%)                        │
│  • Gj.sn. proximity: 4.2m              │
│                                         │
│  Du slo Rory med:                       │
│  • +0.5 slag bedre                      │
│  • -1.1m nærmere flagg!                 │
│                                         │
│  [📊 Se alle slag]                      │
│  [🔄 Ta test på nytt]                   │
│  [📤 Del resultat]                      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📊 DATABASe-MODELL (for Beta)

```typescript
// Manuell slagtest resultat
interface ManualShotTest {
  id: string;
  playerId: string;
  date: Date;
  
  testType: 'APPROACH_50M' | 'APPROACH_100M' | 'DRIVER_60M';
  
  // Pro-benchmark (DataGolf)
  proPlayer: {
    name: string;
    dgId: number;
    expectedMakes: number;
    expectedProximity: number;
  };
  
  // Spillerens resultater
  shots: {
    shotNumber: number;
    proximity?: number;          // For approach
    fairwayHit?: boolean;        // For driver
    missDirection?: 'LEFT' | 'RIGHT';
    missDistance?: number;
    carryDistance?: number;
  }[];
  
  // Oppsummering
  totalMakes: number;
  makeRate: number;
  avgProximity?: number;
  fairwayRate?: number;          // For driver
  
  // Sammenligning
  vsPro: {
    difference: number;          // +2 = 2 bedre enn pro
    percentage: number;          // 110% = 10% bedre
  };
  
  // Metadata
  clubUsed?: string;
  wind?: string;
  notes?: string;
}
```

---

## 🎯 HVORDAN BRUKE RESULTATENE

### 1. Identifiser dine styrker/svakheter
```
EKSEMPEL ANALYSE:
━━━━━━━━━━━━━━━━
50m Approach:    8/10 (80%)  → 🟢 Sterk!
100m Approach:   4/10 (40%)  → 🔴 Tren mer
Driver:          3/10 (30%)  → 🔴 Prioriter!

ANBEFALING:
Fokuser på driver og 100m approach denne uken.
50m er styrken din - behold den med lett trening.
```

### 2. Spor fremgang over tid
```
UTVIKLING:
━━━━━━━━━
Uke 1: Driver 3/10 (30%)
Uke 2: Driver 4/10 (40%)  ← +33% forbedring!
Uke 4: Driver 5/10 (50%)  ← Tour nivå!
```

### 3. Sett mål
```
DITT MÅL:
━━━━━━━━
Nåværende: 50m = 80%, 100m = 40%, Driver = 30%
Mål (3 mnd): 50m = 85%, 100m = 60%, Driver = 50%
```

---

## ✅ BETA TEST SJEKKLISTE

- [ ] UI er intuitivt for manuell input
- [ ] Måling (meter) er lett å forstå
- [ ] Rory's stats vises klart
- [ ] Resultat-kalkulasjon er korrekt
- [ ] "Beat the Pro" følelse er gøy
- [ ] Kan dele resultater
- [ ] Historikk viser fremgang
- [ ] Fungerer på mobil (driving range)

---

**Neste steg:** Implementere denne beta-testen i spillerportalen!
