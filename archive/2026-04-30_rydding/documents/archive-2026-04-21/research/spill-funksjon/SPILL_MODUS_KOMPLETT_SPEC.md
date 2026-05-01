# SPILL Modul - Komplett Spesifikasjon
## Konkurranse, Innspill & Treningsrunde

**Mappe:** `/docs/research/spill-funksjon/`  
**Dato:** 13. april 2026  
**Status:** Kravsamling & Analyse

---

## INNHOLDSFORTEGNELSE

1. [Overblikk](#1-overblikk)
2. [Spill-Moduser](#2-spill-moduser)
3. [Innspill-funksjon (Pre-Round)](#3-innspill-funksjon-pre-round)
4. [Baneguide med Kart](#4-baneguide-med-kart)
5. [Notater & Observasjoner](#5-notater--observasjoner)
6. [Vær & Vind Integrasjon](#6-vær--vind-integrasjon)
7. [Slag-Spredning Visning](#7-slag-spredning-visning)
8. [Data-Integrasjon](#8-data-integrasjon)

---

## 1. OVERBLIKK

### Tre Hovedmoduser

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPILL MENY                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🏆 [ KONKURRANSE ]                                             │
│     Full statistikk, mental scorecard, DECADE-caddy             │
│     Obligatorisk: Mental scorecard per slag                     │
│                                                                  │
│  ⛳ [ INNSPILL / TRENINGSRUNDE ]                                │
│     Forberedelse til turnering, notater, baneguide              │
│     Valgfritt: Mental scorecard                                 │
│                                                                  │
│  🎮 [ CASUAL SPILL ]                                            │
│     Enkel logging, fokus på score                               │
│     Ingen mental scorecard                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. SPILL-MODUSER

### 2.1 Konkurranse-Modus

```typescript
interface CompetitionMode {
  type: 'TOURNAMENT' | 'CLUB_CHAMPIONSHIP' | 'QUALIFIER';
  
  // Påkrevd
  mentalScorecard: {
    enabled: true;           // ALLTID på
    mandatory: true;         // Kan ikke skippe
    detailLevel: 'FULL';     // Alle spørsmål
  };
  
  // DECADE Caddy
  caddy: {
    enabled: true;
    aggressiveness: 'TOURNAMENT';  // Konservativ
    mentalCoaching: true;
  };
  
  // Statistikk
  stats: {
    strokesGained: true;
    fairways: true;
    gir: true;
    putts: true;
    proximity: true;
    scrambling: true;
  };
  
  // Post-round
  analysis: {
    decadeCompliance: true;    // Fulgte du strategien?
    mentalReport: true;        // Mentalt highlight/lowlight
    vsExpected: true;          // Sammenligning med forventet
  };
}
```

### 2.2 Innspill/Treningsrunde-Modus

```typescript
interface PrepRoundMode {
  type: 'PREP_ROUND' | 'COURSE_PRACTICE';
  
  // Hovedfokus: NOTATER
  notepad: {
    enabled: true;
    features: [
      'FAIRWAY_CONDITIONS',
      'GREEN_LOCATIONS', 
      'MISS_STRATEGY',
      'WIND_PATTERNS',
      'START_LINES',
      'LAYUP_TARGETS'
    ];
  };
  
  // Mental scorecard (valgfritt)
  mentalScorecard: {
    enabled: true;
    mandatory: false;          // Spiller velger
    detailLevel: 'STANDARD';   // Kortere enn konkurranse
  };
  
  // DECADE Caddy
  caddy: {
    enabled: true;
    aggressiveness: 'LEARNING';  // Mer fleksibel
    showAlternatives: true;      // Vis flere valg
  };
  
  // Viktig: Lagre notater for fremtidig konkurranse
  saveNotes: true;
}
```

### 2.3 Casual Spill-Modus

```typescript
interface CasualMode {
  type: 'CASUAL';
  
  // Enkel logging
  mentalScorecard: {
    enabled: false;
  };
  
  caddy: {
    enabled: true;
    aggressiveness: 'CASUAL';
    mentalCoaching: false;
  };
  
  // Kun basis-statistikk
  stats: {
    score: true;
    putts: true;
    fairways: false;  // Valgfritt
    gir: false;       // Valgfritt
  };
}
```

---

## 3. INNSPILL-FUNKSJON (PRE-ROUND)

### 3.1 Notater per Hull - Komplett Liste

```typescript
interface HullNotater {
  hullNummer: number;
  par: number;
  
  // === TEE-SLAG ===
  tee: {
    fairwayCondition: {
      type: 'DRY' | 'WET' | 'FROST' | 'NORMAL';
      // EKSEMPEL: "Hull 3 - Tørr fairway"
      dryFairwayRoll: number;    // Ekstra rull i meter (f.eks. 25m)
      notes: string;
    };
    
    startLinjer: {
      // Spiller tegner på kartet
      primary: { aimPoint: GPSCoordinate; description: string };
      alternative?: { aimPoint: GPSCoordinate; description: string };
      danger: { area: GPSPolygon; description: string };
    };
    
    clubSelection: {
      primary: string;       // F.eks. "Driver"
      alternative: string;   // F.eks. "3-tre"
      reasoning: string;     // "Driver ruller 25m ekstra pga tørr fairway"
    };
  };
  
  // === INNSPILL ===
  innspill: {
    greenLocation: {
      // PIN-PLASSERING
      pins: Array<{
        id: string;
        position: GPSCoordinate;
        source: 'ESTIMATED' | 'ACTUAL';  // ESTIMATED = gjetning, ACTUAL = sett
        color: string;  // Visualisering: rød=front, hvit=middels, blå=bak
        date: Date;
      }>;
      
      // EKSEMPEL: Hull 4
      // "Flagg ca 4m inn på green, green opphøyd 10m"
      elevationToGreen: number;  // Meter opp/ned
      greenDepth: number;        // Front til back
      greenWidth: number;
    };
    
    missStrategy: {
      // HVOR ER DET SMART Å "MISS"?
      optimalMiss: {
        area: GPSPolygon;
        // "Miss til venstre - lett chip oppover"
        reason: string;
        upAndDownProbability: number;  // 0-100%
      };
      dangerMiss: {
        area: GPSPolygon;
        // "Miss til høyre - vanskelig bunker, dobbel-bogey fare"
        reason: string;
      };
      
      // Visuelt på kart:
      // 🟢 Grønt område = Smart miss
      // 🔴 Rødt område = Farlig miss
    };
    
    approachZones: {
      // DECADE-baserte soner
      safeZone: GPSPolygon;      // "Fat part" av green
      dangerZone: GPSPolygon;    // Nær kant/hindere
      pinZone?: GPSPolygon;      // Hvis pin er safe
    };
  };
  
  // === PAR 5 LAYUP ===
  layup?: {
    maxDistance: number;         // "Legg opp maks 100m fra green"
    targetZone: GPSPolygon;
    reasoning: string;           // "Unngå bunkeren 40m fra green"
  };
  
  // === GENERELT ===
  generelt: {
    windImpact: 'NONE' | 'MODERATE' | 'SEVERE';
    mentalNote: string;          // "Hold deg rolig her, lett å bli for aggressiv"
    previousRounds: string[];    // "Sist: Driver i vannet, bruk 3-tre!"
  };
}
```

### 3.2 Visualisering: Innspill-Notater

```
╔══════════════════════════════════════════════════════════════════╗
║  HULL 4 - PAR 4, 380m    [LAGRE] [NESTE HULL]                   ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  📝 DINE NOTATER:                                               ║
║                                                                  ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │  TEE-SLAG                                             │     ║
║  │  • Fairway: Tørr (+25m rull) ⚠️                       │     ║
║  │  • Sikte: Høyre fairway (draw kommer tilbake)         │     ║
║  │  • Driver ruller til 260m (normalt 235m)              │     ║
║  │                                                       │     ║
║  │  [SETT STARTLINJE PÅ KARTET]                         │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │  GREEN / FLAGG                                        │     ║
║  │                                                       │     ║
║  │  📍 Flagg-posisjoner:                                 │     ║
║  │  🔴 Front (4m inn) - ESTIMAT fra i går                │     ║
║  │  ⚪ Midt - FAKTISK sett i dag                         │     ║
║  │  🔵 Bak - ESTIMAT                                     │     ║
║  │                                                       │     ║
║  │  Green: Opphøyd 10m fra approach-sonen               │     ║
║  │                                                       │     ║
║  │  [SETT FLAGG PÅ KARTET]    [LEGG TIL NYTT FLAGG]     │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │  "SMART MISS" STRATEGI                                │     ║
║  │                                                       │     ║
║  │  🟢 SIKKER: Miss til venstre                          │     ║
║  │     - Lett chip oppover                               │     ║
║  │     - 65% up-and-down statistikk                      │     ║
║  │                                                       │     ║
║  │  🔴 FARLIG: Miss til høyre                            │     ║
║  │     - Dyp bunker                                      │     ║
║  │     - Nedoverbakke chip                               │     ║
║  │     - Kun 25% up-and-down                             │     ║
║  │                                                       │     ║
║  │  [TEGN SONE PÅ KARTET]                               │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │  💨 VIND PÅ DETTE HULL                                │     ║
║  │                                                       │     ║
║  │  Fra venstre, 3 m/s                                    │     ║
║  │  [SYNK MED YR] [ENDRE MANUELT]                       │     ║
║  │                                                       │     ║
║  │  Påvirkning: +5m på approach                          │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 4. BANEGUIDE MED KART

### 4.1 Kart-Funksjonalitet

```typescript
interface BaneKart {
  courseId: string;
  courseName: string;
  
  // Basis kart
  satelliteImage: string;      // Google Maps/Apple Maps
  holeOverlays: HoleOverlay[]; // Hull-grenser
  
  // Spiller-spesifikk overlay
  playerAnnotations: {
    // Tegnet av spiller i Innspill-modus
    startLines: Array<{
      hull: number;
      from: GPSCoordinate;
      to: GPSCoordinate;
      color: string;           // Spiller velger farge
      label?: string;          // F.eks. "Safe line"
    }>;
    
    flagPositions: Array<{
      hull: number;
      position: GPSCoordinate;
      color: 'RED' | 'WHITE' | 'BLUE' | 'CUSTOM';
      date: Date;
      source: 'ESTIMATED' | 'ACTUAL';
    }>;
    
    missZones: Array<{
      hull: number;
      polygon: GPSPolygon;
      type: 'GOOD' | 'BAD';
      note: string;
    }>;
    
    layupTargets: Array<{
      hull: number;
      position: GPSCoordinate;
      maxDistance: number;
      note: string;
    }>;
  };
  
  // DECADE-overlay
  decadeOverlay: {
    bufferZones: GPSPolygon[];     // 5-8% buffer visuelt
    safeAimpoints: GPSCoordinate[];
    hazardZones: GPSPolygon[];
  };
  
  // Vind-overlay
  windOverlay: {
    direction: number;             // Grader (0-360)
    strength: number;              // m/s
    gusts?: number;
    perHole: Map<number, WindData>;  // Vind kan variere per hull
  };
}
```

### 4.2 Kart-Visualisering

```
╔══════════════════════════════════════════════════════════════════╗
║  BANEGUIDE: MIKLAGARD GK - HULL 7                               ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │                                                          │   ║
║  │   🌐 SATELLITT KART (Hull 7)                             │   ║
║  │                                                          │   ║
║  │      💨 3 m/s (fra venstre)                              │   ║
║  │         ↘                                                │   ║
║  │                                                          │   ║
║  │   🏌️ TEE                                                 │   ║
║  │      │                                                   │   ║
║  │      │ ←── Startlinje (grønn)                            │   ║
║  │      │ ←── Alternativ (gul, stippel)                     │   ║
║  │      ▼                                                   │   ║
║  │   ╔══════════════╗     ┌──────┐                         │   ║
║  │   ║  FAIRWAY     ║     │WATER │ ❌                       │   ║
║  │   ║  [DRY +25m]  ║     └──────┘                         │   ║
║  │   ╚══════════════╝                                       │   ║
║  │          │                                               │   ║
║  │          ▼                                               │   ║
║  │   ┌──────────────┐                                       │   ║
║  │   │   GREEN      │                                       │   ║
║  │   │   🔴⚪🔵     │  ← Flagg-posisjoner                   │   ║
║  │   │ 🟢SAFE  🔴DAN│  ← Miss-soner                          │   ║
║  │   └──────────────┘                                       │   ║
║  │                                                          │   ║
║  │   [🔍 Zoom] [📍 Min posisjon] [🗺️ Full bane]            │   ║
║  │                                                          │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  FARGER:                                                         ║
║  🟢 Grønn sone = Smart å miss                                    ║
║  🔴 Rød sone = Farlig å miss                                     ║
║  🔴 Rød flagg = Front-posisjon                                   ║
║  ⚪ Hvit flagg = Midt-posisjon                                   ║
║  🔵 Blå flagg = Bak-posisjon                                     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 5. NOTATER & OBSERVASJONER

### 5.1 Detaljerte Notat-Typer

```typescript
// EKSEMPEL: Hull 3 notat
type Hull3Notat = {
  hull: 3;
  par: 4;
  
  fairwayCondition: {
    status: 'EXTREMELY_DRY';
    observation: "Landingsområdet er ekstremt tørt";
    rollEffect: 25-30;  // meter ekstra rull
    implication: "Driver ruller 25m lenger enn vanlig";
    clubAdjustment: "Bruk 3-tre i stedet for driver, 
                      eller sikte mer venstre";
  };
  
  // PIN-PLASSERING (Flere mulige)
  pinLocations: [
    {
      id: 'pin-3-2026-04-15-morning';
      position: { lat: 59.123, lng: 10.456 };
      source: 'ESTIMATED';  // Spiller gjetter basert på vanlig posisjon
      location: 'FRONT_LEFT';
      color: 'RED';
      confidence: 0.7;  // 70% sikker
    },
    {
      id: 'pin-3-2026-04-15-actual';
      position: { lat: 59.124, lng: 10.457 };
      source: 'ACTUAL';  // Spiller så faktisk pin
      location: 'MIDDLE';
      color: 'WHITE';
      confidence: 1.0;
      seenAt: '2026-04-15T08:30:00Z';
    }
  ];
  
  // HULL 4 - SPESIFIKK
  greenDetails: {
    elevation: {
      fromApproachArea: +10;  // meter opp
      implication: "Ballen stopper raskere på green";
    };
    pinLocation: {
      distanceFromFront: 4;  // meter
      note: "Flagg ca 4m inn på green";
    };
  };
  
  // SMART MISS
  missStrategy: {
    preferred: {
      side: 'LEFT';
      reason: "Oppover chip, 65% up-and-down rate";
      safeArea: "Venstre rough, 10m fra green";
    };
    avoid: {
      side: 'RIGHT';
      reason: "Dyp bunker, nedoverbakke, 25% up-and-down";
      dangerArea: "Høyre bunker";
    };
  };
  
  // VIND PÅ DETTE HULL
  wind: {
    direction: 'LEFT_TO_RIGHT';
    strength: 3;  // m/s
    impact: "Legg på 5m på approach";
    startLineAdjustment: "Sikte 5m venstre for mål";
  };
  
  // STARTLINJE
  startLine: {
    primary: {
      aim: "Høyre fairway";
      reasoning: "Draw bringer ballen tilbake til midt";
    };
    danger: {
      area: "Venstre rough";
      consequence: "Trær blokkerer andre slag";
    };
  };
  
  // LAYUP (hvis par 5)
  layup?: {
    maxDistance: 100;  // meter fra green
    target: "100m stake";
    avoid: "Bunker ved 80m markering";
  };
};
```

### 5.2 Notat-Input UI

```
╔══════════════════════════════════════════════════════════════════╗
║  NOTATER - HULL 3                                               ║
╠════════════════════════════════────────────────══════════════════╣
║                                                                  ║
║  🌡️ FAIRWAY TILSTAND                                             ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │ [🟢 Normal] [🟡 Fuktig] [🔴 Ekstremt tørr] [❄️ Frost] │     ║
║  └────────────────────────────────────────────────────────┘     ║
║  Valgt: 🔴 Ekstremt tørr                                         ║
║                                                                  ║
║  Ekstra rull: [____25____] meter                                ║
║  Notat: __Landingsområdet er knusktørt, ballen__               ║
║         __ruller 25-30m lenger enn normalt__                    ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  🚩 FLAGG-PLASSERING                                             ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │ Legg til flagg: [🔴 Front] [⚪ Midt] [🔵 Bak] [📍 Annen]│     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  Eksisterende flagg:                                             ║
║  • 🔴 Front (estimert i går) [🗑️]                              ║
║  • ⚪ Midt (sett i dag 08:30) [🗑️]                             ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  🎯 SMART MISS                                                   ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │                                                       │     ║
║  │  [TEGN SONE PÅ KARTET]                               │     ║
║  │                                                       │     ║
║  │  🟢 PREFERRED MISS: Venstre side                      │     ║
║  │     Lett chip oppover, god sjanse for par            │     ║
║  │                                                       │     ║
║  │  🔴 AVOID: Høyre bunker                               │     ║
║  │     Vanskelig redning, dobbel-bogey fare             │     ║
║  │                                                       │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  💨 VIND (Spesifikt for dette hull)                             ║
║  Retning:  [◀️ Venstre] [▶️ Høyre] [⬆️ Mot] [⬇️ Med]            ║
║  Styrke:   [ 3 ] m/s                                            ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  📝 EGNE NOTATER                                                 ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │ Sist brukte driver her, gikk i vannet.              │     ║
║  │ 3-tre er smartere valg!                             │     ║
║  │                                                     │     ║
║  │ Mental: Hold deg rolig, lett å bli for aggressiv   │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 6. VÆR & VIND INTEGRASJON

### 6.1 Vær-Sync (YR.no / Meteorologisk Institutt)

```typescript
interface VaerIntegrasjon {
  // Kilde: YR.no API (gratis)
  source: 'MET_NO' | 'YR_NO' | 'OPENWEATHERMAP';
  
  // Data som synkes
  weatherData: {
    // Nåværende
    current: {
      temperature: number;        // °C
      windSpeed: number;          // m/s
      windDirection: number;      // Grader (0-360)
      windGusts?: number;         // m/s
      precipitation: number;      // mm
      conditions: 'CLEAR' | 'CLOUDY' | 'RAIN' | 'FOG';
    };
    
    // Prognose (per time)
    hourly: Array<{
      time: Date;
      temp: number;
      windSpeed: number;
      windDir: number;
      rain: number;
    }>;
    
    // Spesifikt for golfbanen
    courseMicroClimate: {
      // YR.no gir generell data for området
      // Vi justerer basert på banens egenskaper
      windAdjustment: number;     // F.eks. +2 m/s på kystbane
      tempAdjustment: number;     // F.eks. -2°C i dal
    };
  };
  
  // Per hull-vind
  // Vind kan være annerledes på ulike hull pga terreng
  perHoleWind: Map<number, {
    adjustment: number;         // +/- grader fra hovedvind
    strengthFactor: number;     // 0.8-1.2 (dempet/forsterket)
    notes: string;              // "Hull 7 ligger i le, vindstille"
  }>;
}

// Synk-funksjon
async function syncWeather(courseId: string): Promise<WeatherData> {
  // 1. Hent golfbanens koordinater
  const course = await getCourse(courseId);
  
  // 2. Kall YR.no API
  const yrData = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${course.lat}&lon=${course.lon}`);
  
  // 3. Parse og tilpass
  const weather = parseYRData(yrData);
  
  // 4. Juster for banens mikroklima
  const adjusted = applyCourseAdjustments(weather, course);
  
  // 5. Beregn per-hull vind (basert på terreng)
  const perHole = calculatePerHoleWind(adjusted, course.topography);
  
  return { ...adjusted, perHoleWind: perHole };
}
```

### 6.2 Vind-Kart Visualisering

```
╔════════════════────────────────══════════════════════════════════╗
║  VIND-OVERSIKT - MIKLAGARD GK                                   ║
╠════════════════════════════════────────────────══════════════════╣
║                                                                  ║
║  🔄 SIST SYNKRONISERT: 10:15 (YR.no)                             ║
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │                                                          │   ║
║  │          N                                               │   ║
║  │          ↑                                               │   ║
║  │     ←  💨  →  Hovedvind: 3 m/s fra vest                │   ║
║  │          ↓                                               │   ║
║  │          S                                               │   ║
║  │                                                          │   ║
║  │   HULL 1:  ↗  4 m/s (kyst-vind)                         │   ║
║  │   HULL 2:  →  3 m/s                                     │   ║
║  │   HULL 3:  →  2 m/s (i le av skog)                     │   ║
║  │   HULL 4:  ↘  5 m/s (åpent mot vann)                   │   ║
║  │   ...                                                   │   ║
║  │                                                          │   ║
║  │   [🔄 OPPDATER]  [⚙️ MANUELL JUSTERING]                 │   ║
║  │                                                          │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  PROGNOSE:                                                       ║
║  12:00 - 3 m/s fra vest                                          ║
║  14:00 - 5 m/S fra sørvest ⚠️ (Øker)                            ║
║  16:00 - 6 m/s fra sørvest                                       ║
║                                                                  ║
║  [SE DETALJER FOR HULL 7]                                        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 7. SLAG-SPREDNING VISNING

### 7.1 Kontekst-Avhengig Spredning

```typescript
interface SlagSpredning {
  club: string;
  distance: number;  // meter
  
  // Spredning varierer basert på kontekst!
  contextDispersions: {
    training: {
      // På range, ingen press
      lateralStdDev: 8;    // meter
      distanceStdDev: 5;   // meter
      confidence: 0.95;    // 95% innenfor dette
    };
    casual: {
      // På bane med venner
      lateralStdDev: 12;
      distanceStdDev: 8;
      confidence: 0.95;
    };
    competition: {
      // I turnering
      lateralStdDev: 18;   // Større spredning under press!
      distanceStdDev: 12;
      confidence: 0.95;
    };
  };
  
  // Visualisering
  visualization: {
    // Sirkel som viser 95% sannsynlighet
    radius: number;
    color: string;
    opacity: number;
  };
}

// EKSEMPEL: 8-jern fra 125m
const spredningEksempel = {
  club: '8-jern',
  distance: 125,
  
  trening: {
    radius: 15,  // meter
    note: "15m spredning - Du treffer nesten alltid green!"
  },
  
  konkurranse: {
    radius: 35,  // meter
    note: "35m spredning - Sikte midt green gir 85% treff"
  }
};
```

### 7.2 Spredning-Visning i App

```
╔════════════════════════════════────────────────══════════════════╗
║  SLAG-SPREDNING - HULL 7                                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Velg kontekst:                                                  ║
║  [Trening 🔧]  [Spill ⛳]  [Konkurranse 🏆]                      ║
║                                                                  ║
║  Valgt: 🏆 KONKURRANSE                                           ║
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │                                                          │   ║
║  │  8-JERN FRA 125m                                         │   ║
║  │                                                          │   ║
║  │         🏌️                                               │   ║
║  │          │                                               │   ║
║  │          ▼                                               │   ║
║  │   ╔══════════════╗                                       │   ║
║  │   ║  GREEN       ║                                       │   ║
║  │   ║   ┌──────┐   ║                                       │   ║
║  │   ║   │  ⭕   │   ║  ← 95% av slag lander her            │   ║
║  │   ║   │      │   ║    (radius: 35m)                      │   ║
║  │   ║   └──────┘   ║                                       │   ║
║  │   ╚══════════════╝                                       │   ║
║  │                                                          │   ║
║  │   🔵 Siktepunkt (midt green)                            │   ║
║  │   🔴 Flagg (bak-høyre)                                  │   ║
║  │                                                          │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  DIN SPREDNING I KONKURRANSE:                                    ║
║  • Lateral: ±35 meter (95% sjanse)                              ║
║  • Distanse: ±12 meter                                           ║
║                                                                  ║
║  🎯 Hvis du sikter på MIDT GREEN:                                ║
║  • 85% sjanse for å treffe green                                 ║
║  • 15% sjanse for miss (7% venstre, 8% høyre)                   ║
║                                                                  ║
║  ⚠️ Hvis du sikter på FLAGG (bak-høyre):                        ║
║  • 45% sjanse for å treffe green                                 ║
║  • 55% sjanse for miss (i bunker høyre!)                        ║
║                                                                  ║
║  💡 DECADE-RÅD:                                                  ║
║  "Sikte på midt-venstre green. Din spredning tilsier at du      ║
║   vil ha 2-3 putter for birdie 20% av gangene likevel."         ║
║                                                                  ║
║  ─────────────────────────────────────────────────────────────   ║
║                                                                  ║
║  SAMMENLIGNING:                                                  ║
║                                                                  ║
║  Trening:   [████████░░] 15m spredning  (90% green-treff)       ║
║  Spill:     [████████████░░] 25m spredning  (75% treff)         ║
║  Konkurranse:[████████████████░░] 35m spredning  (60% treff)    ║
║                                                                  ║
║  ⚠️ Du treffer 30% færre greener i konkurranse!                 ║
║  [SE TRENINGSPROGRAM FOR Å FORBEDRE DETTE]                      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 8. DATA-INTEGRASJON

### 8.1 Hvilke Data Lagres

```typescript
// Backend: Fullstendig datamodell

interface SpillRunde {
  id: string;
  playerId: string;
  courseId: string;
  
  // Metadata
  mode: 'COMPETITION' | 'PREP_ROUND' | 'CASUAL';
  date: Date;
  teeTime: Date;
  weather: WeatherData;
  
  // Innspill-notater (hvis PREP_ROUND)
  prepNotes?: {
    createdAt: Date;
    notes: HoleNotes[];
    pinLocations: PinLocation[];
    startLines: StartLine[];
    missZones: MissZone[];
  };
  
  // Slag-for-slag
  shots: Shot[];
  
  // Mental scorecard
  mentalScorecard?: MentalScorecard;
  
  // DECADE
  decadeDecisions: DecadeDecision[];
  
  // Resultat
  score: number;
  stats: RoundStats;
}

interface Shot {
  hole: number;
  shotNumber: number;
  
  // Fysisk
  fromPosition: GPSCoordinate;
  toPosition: GPSCoordinate;
  club: string;
  intendedShape: 'DRAW' | 'FADE' | 'STRAIGHT';
  
  // Forhold
  lie: LieType;
  wind: WindEffect;
  
  // Mentalt
  mentalState: {
    pressure: 1-10;
    confidence: 1-10;
    focus: 1-10;
    routineCompleted: boolean;
  };
  
  // DECADE
  caddyAdvice?: CaddyAdvice;
  followedAdvice: boolean;
  targetType: 'PIN' | 'CENTER' | 'SAFE' | 'AVOID_HAZARD';
  
  // Resultat
  result: ShotResult;
  strokesGained: number;
}
```

---

## KONKLUSJON

Denne spesifikasjonen dekker:

1. ✅ Tre spill-moduser (Konkurranse, Innspill, Casual)
2. ✅ Detaljerte notater (fairway, flagg, miss-strategi)
3. ✅ Baneguide med kart og overlays
4. ✅ Vær-sync fra YR.no
5. ✅ Per-hull vind-justering
6. ✅ Startlinjer og layup-mål
7. ✅ Slag-spredning basert på kontekst
8. ✅ Full backend-datamodell

**Neste steg:**
- [ ] DECADE-algoritme detaljer
- [ ] Mental tracking spesifikasjon
- [ ] UI/UX design-skisser
- [ ] TrackMan import-strategi
