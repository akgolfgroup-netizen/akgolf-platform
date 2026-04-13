# Beta Test: "Beat Rory at Augusta"
## Manuell 100m Approach & Driver Test
### Basert på Rory McIlroy's 2025/2026 Stats + Augusta National

---

## 📊 RORY MCILROY - FAKTISKE STATS (2025 PGA TOUR)

```
┌────────────────────────────────────────────────────────────────┐
│  RORY MCILROY - DataGolf/PGA Tour Stats (2025)                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  STROKES GAINED RANKINGS:                                      │
│  • SG: Total:          #1  (+2.319)                            │
│  • SG: Off-the-Tee:    #1  (+0.857)                            │
│  • SG: Approach:       #19 (+0.592)                            │
│  • SG: Putting:        #10 (+0.593)                            │
│                                                                │
│  KEY STATS:                                                    │
│  • Driving Distance:   315.2 yards (6th)                       │
│  • GIR:                67.5% (53rd)                            │
│  • Putts Per Round:    28.00 (17th)                            │
│                                                                │
│  APPROACH SKILL (DataGolf):                                    │
│  • 100-125 yards:      18.4 feet (5.6m) proximity              │
│  • 125-150 yards:      21.8 feet (6.6m) proximity              │
│                                                                │
│  DRIVER (Fairway Accuracy):                                    │
│  • Fairways Hit:       ~58% (Tour snitt ~62%)                  │
│  • Spredning:          ~35-40 yards (95% av slag)              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ AUGUSTA NATIONAL JUSTERTE STATS

### Hvorfor Augusta er annerledes:
- **Små, faste greens** (krever nøyaktighet)
- **Doglegs** på mange hull (viktig med spredning)
- **Høy rough** (straff for å miss)
- **Bermuda grass** (påvirker approach)

### Rory's estimerte Augusta-stats (justert):

| Stat | Normal Tour | Augusta | Endring |
|------|-------------|---------|---------|
| **100m Proximity** | 5.6m | **6.2m** | +10% (vanskeligere) |
| **GIR %** | 67.5% | **63%** | -4.5% (små greens) |
| **Fairway Hit %** | 58% | **54%** | -4% (trenger å treffe) |
| **Spredning (driver)** | 35-40m | **32-38m** | Litt bedre (fokus) |

---

## 🎯 TEST 1: 100m APPROACH (110 yards)

### Test-oppsett:
```
OPPGAVE: Slå 10 baller til 100 meter mål

MÅL: Enten et flagg på range, eller velg et område (f.eks. mellom to trær)
     som representerer en "green" på Augusta

     🎯 Target (100m)
        │
        │ 100m
        │
      [YOU]
```

### Hva du måler:
For hver ball, noter **avstand fra målet i meter** (rett linje, ikke sidelengs)

```
Eksempel:
Ball 1: 4.5m fra målet
Ball 2: 8.2m fra målet
Ball 3: 3.1m fra målet
...
```

### RORY'S BENCHMARK (Augusta-justert):

**Basert på DataGolf + Augusta-faktor:**

```
RORY McILROY - 100m Approach fra Fairway på Augusta:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Gjennomsnittlig proximity:     6.2 meter (20.3 feet)
• "Make rate" (innenfor 6m):     6.5 av 10 slag (65%)
• Beste slag:                    ~2.5m fra flagget
• Dårligste slag (normal):       ~12m fra flagget
• "Chunk/Miss":                  ~1 av 10 (10%)

Distribusjon av 10 slag (estimat):
├─ Innenfor 3m:     2 slag (20%)
├─ 3-6m:            4.5 slag (45%)
├─ 6-9m:            2.5 slag (25%)
└─ Over 9m:         1 slag (10%)

RORY'S 10 SLAG (simulert):
Shot 1:  4.2m
Shot 2:  2.8m ✨ (nærme!)
Shot 3:  7.1m
Shot 4:  5.9m
Shot 5:  3.4m
Shot 6:  8.8m
Shot 7:  6.2m
Shot 8:  5.1m
Shot 9:  11.2m (miss)
Shot 10: 4.7m

Gj.sn: 5.9m
Makes (innenfor 6m): 6/10
```

### INPUT-SKJEMA (for app):

```typescript
interface Test100mAugusta {
  playerName: string;
  date: string;
  
  // Dine 10 slag (avstand fra mål i meter)
  shots: [
    { shot: 1, proximity: number },  // f.eks. 5.2
    { shot: 2, proximity: number },  // f.eks. 3.8
    { shot: 3, proximity: number },  // f.eks. 8.1
    { shot: 4, proximity: number },
    { shot: 5, proximity: number },
    { shot: 6, proximity: number },
    { shot: 7, proximity: number },
    { shot: 8, proximity: number },
    { shot: 9, proximity: number },
    { shot: 10, proximity: number },
  ];
  
  // Ekstra info
  lie: 'MAT' | 'FAIRWAY_GRASS';
  wind: 'NONE' | 'LIGHT' | 'MODERATE';
  clubUsed: string;  // f.eks. "PW" eller "48°"
}
```

### SCORING:

```
BEREGNING:
━━━━━━━━━━━━

Dine stats:
• Din gj.sn. proximity:    [auto-kalkulert]
• Din "make rate":         Antall innenfor 6m / 10

vs RORY:
• Rory's gj.sn:            6.2m
• Rory's makes:            6.5/10 (65%)

SCORE:
• Gj.sn. diff:             Din proximity - 6.2m
  (Negativ = du er bedre!)
  
• Make diff:               Dine makes - 6.5
  (Positiv = flere innenfor 6m)

% AV RORY'S NIVÅ:
• 100%+ = Du slo Rory! 🏆
• 80-99% = Tour nivå 🥇
• 60-79% = God amatør 🥈
• 40-59% = OK, men tren mer 🥉
• <40% = Mye å gå på 📚
```

### RESULTAT-KATEGORIER:

| Nivå | Gj.sn. Proximity | Makes (innenfor 6m) | % av Rory |
|------|------------------|---------------------|-----------|
| 🏆 Tour Winner | <5.5m | 7-10/10 | 105%+ |
| 🥇 Tour Pro | 5.5-6.5m | 5-7/10 | 80-100% |
| 🥈 God Amatør | 6.5-8.5m | 4-5/10 | 60-79% |
| 🥉 Utvikling | 8.5-12m | 2-3/10 | 40-59% |
| 📚 Nybegynner | >12m | 0-2/10 | <40% |

---

## 🏌️ TEST 2: DRIVER SPREDNING (60m Fairway)

### Test-oppsett:
```
OPPGAVE: Treffe en 60 meter bred "fairway"

SETT OPP:
• Finn to markører (trær, skilt, staker) som er 60m fra hverandre
• Dette er din "Augusta fairway"
• Slå 10 drivere og noter hvor de lander

VISUALISERING:

    │←──────── 60m bred fairway ────────→│
    │                                    │
   🌳                                  🌳
    │      🏌️  DRIVER (10 slag)        │
    │        ↓  ↓  ↓  ↓  ↓             │
    │       [landing områder]          │
    │                                    │
    └────────────────────────────────────┘

VENSTRE SIDE        MIDT (fairway)      HØYRE SIDE
   (miss)              (hit)              (miss)
```

### Hva du måler:

For **hver drive**, noter:

1. **Treffet du fairway?** (JA/NEI)
2. **Hvis NEI:** Hvor langt ut? (ca. meter fra fairway-kanten)
3. **Hvilken side?** (Venstre / Høyre)

```
Eksempel:
Drive 1: JA (innenfor 60m)
Drive 2: NEI, 5m til venstre
Drive 3: JA
Drive 4: NEI, 12m til høyre
Drive 5: JA
...
```

### RORY'S BENCHMARK (Augusta-justert):

**RORY McILROY - Driver på Augusta National:**
```
• Fairways treff:        54% (5.4 av 10)
• Venstre miss:          24% (2.4 av 10)
• Høyre miss:            22% (2.2 av 10)

SPREDNING (lateral deviation):
• Gj.sn. miss:           18m fra fairway-kant
• 95% av slag:           Innenfor 38m fra midtlinje
• Verste miss (normal):  ~45m ut
• "Big miss":            ~1-2 av 10 (mer enn 40m ut)

RORY'S 10 DRIVERE (simulert):
Drive 1:  HIT ✓
Drive 2:  Miss Venstre 8m
Drive 3:  HIT ✓
Drive 4:  HIT ✓
Drive 5:  Miss Høyre 22m (big miss)
Drive 6:  HIT ✓
Drive 7:  Miss Venstre 12m
Drive 8:  HIT ✓
Drive 9:  Miss Høyre 6m
Drive 10: HIT ✓

Fairways: 6/10 (60%)
Gj.sn. miss: 12m
```

### INPUT-SKJEMA:

```typescript
interface DriverTestAugusta {
  playerName: string;
  date: string;
  fairwayWidth: 60;  // meter
  
  // 10 drivere
  drives: [
    { 
      drive: 1, 
      fairwayHit: boolean,           // true = innenfor 60m
      missSide?: 'LEFT' | 'RIGHT',   // hvis miss
      missDistance?: number          // meter fra kant
    },
    // ... 10 drivere
  ];
  
  wind: 'NONE' | 'LIGHT' | 'MODERATE' | 'STRONG';
  notes?: string;
}
```

### SCORING:

```
BEREGNING:
━━━━━━━━━━━━

Dine stats:
• Fairways treff:          Antall / 10
• Fairway %:               (treff / 10) × 100
• Gj.sn. miss (hvis miss): Gjennomsnittlig meter ut
• "Big miss" (40m+):       Antall

vs RORY:
• Rory's fairways:         5.4/10 (54%)
• Rory's gj.sn. miss:      18m
• Rory's big miss:         ~1/10

SCORE:
• Fairway diff:            Dine treff - 5.4
  (Positiv = flere fairways enn Rory!)
  
• Spredning score:         Dine gj.sn. miss vs 18m
  (Lavere = bedre)

SPREDNING-KATEGORI:
• <15m gj.sn. miss = "Rifle" (konsistent)
• 15-25m = Normal Tour-spredning
• 25-35m = "Shotgun" (trenger konsistens)
• >35m = Veldig spredt (tren driver)
```

### RESULTAT-KATEGORIER:

| Nivå | Fairways Hit | Gj.sn. Miss (hvis miss) | Spredning |
|------|--------------|-------------------------|-----------|
| 🏆 Tour Winner | 7-10/10 | <10m | "Rifle" |
| 🥇 Tour Pro | 5-7/10 | 10-20m | Normal |
| 🥈 God Amatør | 3-5/10 | 20-30m | "Shotgun" |
| 🥉 Utvikling | 2-3/10 | 30-40m | Veldig spredt |
| 📚 Nybegynner | 0-2/10 | >40m | Trenger trening |

---

## 📊 KOMBINERT RESULTAT

### Total Score:

```
ETTER BEGGE TESTENE:
━━━━━━━━━━━━━━━━━━━━━

100m Approach:
• Din gj.sn:          __.__m
• Rory's gj.sn:       6.2m
• Din % av Rory:      ___%

Driver:
• Dine fairways:      __/10
• Rory's fairways:    5.4/10
• Din % av Rory:      ___%

SAMLET SCORE:
• 100% eller mer = Du slo Rory! 🏆
• 80-99% = Tour nivå 🥇
• 60-79% = God amatør 🥈
• 40-59% = OK, men tren mer 🥉
• <40% = Fortsatt læring 📚
```

---

## 🎯 HVORDAN BRUKE RESULTATENE

### Eksempel-analyse:

```
DITT RESULTAT:
━━━━━━━━━━━━━━

100m Approach:     7.8m gj.sn. (64% av Rory)
Driver:            4/10 fairways (74% av Rory)
SAMLET:            69% av Rory = God Amatør 🥈

ANALYSE:
• Approach er styrken (konsistent)
• Driver trenger mer konsistens
• Fokuser på driver-trening denne uken

MÅL (neste test):
• 100m: Forbedre fra 7.8m til 7.0m
• Driver: Øke fra 4/10 til 5/10
```

---

## 📱 APP-IMPLEMENTASJON (Beta)

### Skjerm 1: Velg Test
```
┌────────────────────────────────────────┐
│  BEAT RORY AT AUGUSTA 🏆               │
│  Beta Test - Manuell Input             │
├────────────────────────────────────────┤
│                                        │
│  Velg test:                            │
│                                        │
│  [🎯 100m Approach]                    │
│     Augusta National green             │
│     10 slag fra 100m                   │
│     Rory: 6.2m gj.sn.                  │
│                                        │
│  [🏌️ Driver Challenge]                 │
│     60m fairway                        │
│     10 drivere                         │
│     Rory: 5.4/10 fairways              │
│                                        │
└────────────────────────────────────────┘
```

### Skjerm 2: 100m Input
```
┌────────────────────────────────────────┐
│  100m APPROACH - Slag ___/10           │
├────────────────────────────────────────┤
│                                        │
│  Mål avstand fra flagg (meter):        │
│                                        │
│  [____.__] m                           │
│                                        │
│  Referanse:                            │
│  • 2-3m = Tour nivå                    │
│  • 4-6m = God amatør                   │
│  • 7-9m = OK                           │
│  • 10m+ = Miss                         │
│                                        │
│  [✓ LAGRE]                             │
│                                        │
│  Så langt:                             │
│  Snitt: __._m                          │
│                                        │
└────────────────────────────────────────┘
```

### Skjerm 3: Driver Input
```
┌────────────────────────────────────────┐
│  DRIVER - Drive ___/10                 │
├────────────────────────────────────────┤
│                                        │
│  Treffet du 60m fairway?               │
│                                        │
│  [✓ JA]  [✗ NEI]                       │
│                                        │
│  ───────────────────────────           │
│  Hvis NEI:                             │
│                                        │
│  Side:  [← Venstre]  [Høyre →]         │
│                                        │
│  Ca. meter ut: [____] m                │
│                                        │
│  [✓ LAGRE]                             │
│                                        │
│  Fairways så langt: __/10              │
│                                        │
└────────────────────────────────────────┘
```

### Skjerm 4: Resultat
```
┌────────────────────────────────────────┐
│  RESULTAT: 100m APPROACH               │
├────────────────────────────────────────┤
│                                        │
│  🥈 GOD AMATØR                          │
│                                        │
│  DITT RESULTAT:                        │
│  • Gj.sn. proximity: 7.8m              │
│  • Innenfor 6m: 5/10 (50%)             │
│  • Beste: 3.2m                         │
│                                        │
│  RORY MCILROY (Augusta):               │
│  • Gj.sn. proximity: 6.2m              │
│  • Innenfor 6m: 6.5/10 (65%)           │
│                                        │
│  DU VS RORY:                           │
│  • 64% av Rory's nivå                  │
│  • +1.6m fra Rory's snitt              │
│                                        │
│  [Se alle slag] [Del] [Neste test]     │
│                                        │
└────────────────────────────────────────┘
```

---

## ✅ SJEKKLISTE FOR GJENNOMFØRING

### Før test:
- [ ] Oppdatert Rory's stats fra DataGolf (gjort i denne filen)
- [ ] Forstår hva du skal måle
- [ ] Har målebånd/turfglass klar
- [ ] Har markører for 60m fairway (driver-test)

### Under test:
- [ ] Slår 10 baller på rad (ikke velge bort dårlige)
- [ ] Måler nøyaktig (ikke gjetting)
- [ ] Noterer umiddelbart (ikke stole på hukommelse)

### Etter test:
- [ ] Legger inn i app
- [ ] Sjekker resultat
- [ ] Ser på sammenligning med Rory
- [ ] Identifiserer forbedringsområder

---

**Klar til å teste deg mot Rory på Augusta?** 🏆
