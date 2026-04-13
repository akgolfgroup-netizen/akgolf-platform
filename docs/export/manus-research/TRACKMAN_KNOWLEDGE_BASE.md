# TrackMan Master Knowledge Base
## Komplett teknisk dokumentasjon for AI Coach

**Basert på:** TrackMan University, D-Plane fysikk, Ball Flight Laws  
**Formål:** Trene AI Coach til å erstatte TrackMan Master

---

## 🎯 BALL FLIGHT LOVS (NEW BALL FLIGHT LAWS)

### Den Nye Forståelsen (TrackMan Era)

```
┌─────────────────────────────────────────────────────────────────┐
│  BALL FLIGHT DETERMINANTER                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. START RETNING (85% face, 15% path)                         │
│     ├─ Face Angle (primær)                                     │
│     └─ Club Path (sekundær)                                    │
│                                                                  │
│  2. KURVE (face-to-path forhold)                               │
│     ├─ Face to Path = Face Angle - Club Path                   │
│     └─ Negativ = lukket = draw/hook                            │
│     └─ Positiv = åpen = fade/slice                             │
│                                                                  │
│  3. SPIN AXIS (fysisk manifestasjon av kurve)                  │
│     ├─ Bestemmes av Face to Path                               │
│     └─ Negativ = venstre kurve                                 │
│     └─ Positiv = høyre kurve                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Gamle vs Nye Teorier

| Gammel Teori | Ny Teori (TrackMan) |
|--------------|---------------------|
| Ball starter i retning av path | Ball starter ~85% face, 15% path |
| Face bestemmer kurve | Face bestemmer start, F2P bestemmer kurve |
| "Square face = straight" | Face kan være square men kurve pga path |
| Path er 2D (venstre/høyre) | Path er 3D (opp/ned + venstre/høyre) |

---

## 📐 D-PLANE (The Descriptor Plane)

### Definisjon
**D-Plane** er den tredimensjonale planet som beskriver kollisjonen mellom klubbe og ball. Den er definert av to vektorer:

1. **Club Head Direction** (3D path)
   - Kombinasjon av Club Path (horisontal) + Attack Angle (vertikal)
   
2. **Club Face Orientation** 
   - Kombinasjon av Face Angle (horisontal) + Dynamic Loft (vertikal)

### Kritisk Innsikt: "True Path" er 3D

```
SWING ARC I FORHOLD TIL MÅLET:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

       Opp (Driver)
         │
    ╱────┼────╲
   ╱      │      ╲  ← Svingen går OPP og til VENSTRE
  ╱       │       ╲   (når vi er etter low point)
 │        │        │
 │   LOW POINT     │  ← Her er path RETT på målet
 │    (bottom)     │
  ╲       │       ╱
   ╲      │      ╱   ← Svingen går NED og til HØYRE
    ╲────┼────╱       (før low point)
         │
       Ned (Jern)

FØR Low Point:  Path er IN-TO-OUT (høyre for mål)
ETTER Low Point: Path er OUT-TO-IN (venstre for mål)
VED Low Point:  Path er RETT på mål
```

### Konsekvens for Ball Position

| Ball Posjon | Attack Angle | Path Tendens | Shot Shape |
|-------------|--------------|--------------|------------|
| **Frem** (driver) | Positiv (+) | Mer ut-til-venstre | Trenger face åpen |
| **Midten** (jern) | Negativ (-) | Mer inn-til-høyre | Trenger face lukket |
| **Bak** (wedge) | Mer negativ | Enda mer inn-til-høyre | Lettere draw |

---

## 🔬 TRACKMAN PARAMETERE - DYP ANALYSE

### A. BALL DATA (Det ballen gjør)

#### 1. Ball Speed
- **Definisjon:** Hastighet til ballens tyngdepunkt umiddelbart etter impact
- **Formel:** Ball Speed = Club Speed × Smash Factor
- **Relasjoner:**
  - Øker med Club Speed
  - Øker med Smash Factor (kontakt-kvalitet)
  - Reduseres ved off-center treff (toe/heel)
- **Diagnostisk verdi:**
  - Lav BS med høy CS = dårlig kontakt
  - Høy BS med lav CS = god kontakt, men mangler speed

#### 2. Launch Angle
- **Definisjon:** Vertikal vinkel ballen forlater clubface
- **Relasjon til Dynamic Loft:** Launch ≈ 80-90% av Dynamic Loft
- **Påvirkes av:**
  - Attack Angle (opp/ned)
  - Dynamic Loft (loft ved impact)
  - Impact Height (høyt/lavt på face)
- **Optimaler:**
  - Driver: 10-14° (avhengig av ball speed)
  - 7-jern: 18-22°
  - PW: 24-28°

#### 3. Spin Rate
- **Definisjon:** Rotasjon per minutt (rpm)
- **Relasjon til Spin Loft:** 
  - Spin Loft = vinkelen mellom club path og face normal
  - Høyere Spin Loft = mer spin
- **Påvirkes av:**
  - Attack Angle (mer negativ = mer spin)
  - Dynamic Loft (høyere = mer spin)
  - Impact Location (lavt på face = mer spin)
- **Optimaler:**
  - Driver: 2000-2500 rpm
  - 7-jern: 6000-7000 rpm
  - PW: 8000-10000 rpm

#### 4. Spin Axis
- **Definisjon:** Tilt-vinkel på ballens rotasjonsakse
- **Betydning:** 
  - 0° = rett skudd
  - Negativ = kurve til venstre (draw/hook)
  - Positiv = kurve til høyre (fade/slice)
- **Relasjon til Face to Path:**
  - Face to Path ≈ Spin Axis (korrelasjon ~0.8-0.9)
  - Mer Face to Path = mer Spin Axis = mer kurve
- **Mål:** -2° til +2° regnes som "rett"

#### 5. Launch Direction
- **Definisjon:** Horisontal vinkel ballen starter (relativt til target)
- **Relasjon til Face Angle:**
  - Launch Direction ≈ 85% Face Angle + 15% Club Path
- **Diagnostisk verdi:**
  - Viser primært hvor face peker
  - Brukes til å bekrefte face-reading

---

### B. CLUB DATA (Det klubben gjør)

#### 1. Club Speed
- **Definisjon:** Hastighet på clubhead geometric center før impact
- **Påvirker:** 
  - Potensiell distance (1 mph ≈ 3 yards driver)
  - Ball Speed (sammen med Smash Factor)
- **Relasjoner:**
  - Ikke direkte relatert til teknikk-kvalitet
  - Men høyere CS krever bedre timing for god kontakt

#### 2. Attack Angle
- **Definisjon:** Opp/ned bevegelse av clubhead ved impact
- **Måling:** Relativ til horisonten
- **Positiv (+):** Hitter opp (driver, fairway)
- **Negativ (-):** Hitter ned (jern, wedges)
- **Kritisk relasjon til Path:**
  - Mer positiv AA = path mer til venstre
  - Mer negativ AA = path mer til høyre
- **Optimaler:**
  - Driver: +2° til +5° (max distance)
  - 7-jern: -4° til -6°
  - PW: -6° til -8°

#### 3. Club Path
- **Definisjon:** Horisontal retning clubhead beveger seg ved impact
- **Positiv (+):** In-to-out (høyre for target)
- **Negativ (-):** Out-to-in (venstre for target)
- **3D Forståelse:**
  - Path = horisontal komponent av 3D sving-retning
  - Kombineres med AA for "true path"
- **Shot shaping:**
  - In-to-out (+) = draw/hook tendens
  - Out-to-in (-) = fade/slice tendens

#### 4. Face Angle
- **Definisjon:** Horisontal retning face peker ved impact
- **Positiv (+):** Åpen (høyre for target)
- **Negativ (-):** Lukket (venstre for target)
- **VIKTIGSTE parameter for:**
  - Start retning (~85%)
  - Initial ball flight
- **Face Square ≠ Straight Shot!**
  - Face kan være square men ball kurver pga path forskjell

#### 5. Face to Path
- **Definisjon:** Forskjellen mellom Face Angle og Club Path
- **Formel:** Face to Path = Face Angle - Club Path
- **Betydning:**
  - Negativ (-): Face lukket i forhold til path = draw spin
  - Positiv (+): Face åpen i forhold til path = fade spin
  - Null (0): Face matcher path = rett (hvis centered)
- **Kurve-mengde:**
  - ±1° ≈ 10-15 yards kurve (driver)
  - ±3° ≈ 30-45 yards kurve (driver)

#### 6. Dynamic Loft
- **Definisjon:** Loft på clubface ved impact
- **Påvirkes av:**
  - Static loft (club design)
  - Attack Angle
  - Shaft bend
  - Impact location (høyt/lavt)
- **Relasjon til Launch Angle:** Launch ≈ 80-90% av DL
- **Optimaler:**
  - Driver: 12-16° (for max carry)
  - Jern: Static loft + 2-4° (typisk)

#### 7. Spin Loft
- **Definisjon:** Vinkel mellom club path og face normal
- **Betydning:** Hoveddeterminant for spin rate
- **Relasjoner:**
  - Høyere Spin Loft = mer spin
  - Lavere Spin Loft = mindre spin, mer ball speed
- **Optimal for driver:** 10-14° (balanse mellom spin og speed)

#### 8. Smash Factor
- **Definisjon:** Ratio Ball Speed / Club Speed
- **Maks teoretisk:** ~1.50 (driver)
- **Realistisk maks:** 1.45-1.48 (driver)
- **Betydning:** Mål på kontakt-effektivitet
- **Off-center treff:**
  - Toe: SF reduseres ~2-5%
  - Heel: SF reduseres ~3-7%
  - Low: SF reduseres, spin øker
  - High: SF reduseres, spin reduseres

---

## 🔗 PARAMETER RELASJONER OG KORRELASJONER

### Primære Relasjoner (Alltid sanne)

```
FUNDAMENTALE EQUATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━

1. BALL SPEED = Club Speed × Smash Factor

2. FACE TO PATH = Face Angle - Club Path

3. SPIN AXIS ≈ Face to Path (korrelasjon ~0.85)

4. LAUNCH DIRECTION ≈ (0.85 × Face Angle) + (0.15 × Club Path)

5. SPIN RATE ∝ Spin Loft (høyere loft = mer spin)

6. DYNAMIC LOFT = Static Loft + (Attack Angle × 0.7) + Shaft Bend
```

### Sekundære Relasjoner (Sammenhenger)

```
SYSTEM-DYNAMICS:
━━━━━━━━━━━━━━━━━

Ball Position Frem → Attack Angle ↑ → Path mer venstre → Trenger face mer åpen
Ball Position Bak  → Attack Angle ↓ → Path mer høyre  → Trenger face mer lukket

Høy Toe Treff → Face åpner (gear effect) → Ball går høyre men hooker tilbake
Høy Heel Treff → Face lukker (gear effect) → Ball går venstre men fader tilbake

Lavt Treff på Face → Mindre Dynamic Loft → Lavere Launch → Mer Spin
Høyt Treff på Face → Mer Dynamic Loft → Høyere Launch → Mindre Spin
```

### Diagnostiske Mønstre

#### Mønster 1: "Square Face Draw"
```
Face Angle: 0° (square til target)
Club Path: +3° (in-to-out)
Face to Path: -3°
Resultat: Ball starter rett, kurver venstre (draw)
```
**Forklaring:** Face peker på target, men path kommer fra innsiden. Face er lukket i forhold til path.

#### Mønster 2: "Square Face Fade"  
```
Face Angle: 0° (square til target)
Club Path: -3° (out-to-in)
Face to Path: +3°
Resultat: Ball starter rett, kurver høyre (fade)
```
**Forklaring:** Face peker på target, men path kommer fra utsiden. Face er åpen i forhold til path.

#### Mønster 3: "Push Draw"
```
Face Angle: +2° (åpen)
Club Path: +5° (mer in-to-out)
Face to Path: -3°
Resultat: Ball starter høyre, kurver tilbake mot target (draw)
```
**Forklaring:** Både face og path er høyre for target, men face er lukket i forhold til path.

#### Mønster 4: "Pull Fade"
```
Face Angle: -2° (lukket)
Club Path: -5° (mer out-to-in)
Face to Path: +3°
Resultat: Ball starter venstre, kurver tilbake mot target (fade)
```
**Forklaring:** Både face og path er venstre for target, men face er åpen i forhold til path.

---

## 🎯 DIAGNOSE ALGORITMER

### Algoritme 1: Miss-Diagnose

```typescript
function diagnoseMiss(
  launchDirection: number,  // Hvor ballen starter
  spinAxis: number,         // Kurve
  faceAngle: number,
  clubPath: number
): Diagnosis {
  
  // Type 1: Push (starter høyre, ingen/høyre kurve)
  if (launchDirection > 2 && spinAxis >= 0) {
    return {
      type: 'PUSH',
      cause: 'Face peker høyre, path matcher eller er mer høyre',
      fix: 'Steng face, eller aim mer venstre med samme swing'
    };
  }
  
  // Type 2: Pull (starter venstre, ingen/venstre kurve)
  if (launchDirection < -2 && spinAxis <= 0) {
    return {
      type: 'PULL',
      cause: 'Face peker venstre, path matcher eller er mer venstre',
      fix: 'Åpne face, eller aim mer høyre med samme swing'
    };
  }
  
  // Type 3: Slice (starter venstre/høyre, kurver mye høyre)
  if (spinAxis > 5) {
    return {
      type: 'SLICE',
      cause: 'Face åpen i forhold til path (F2P for positiv)',
      fix: 'Streng face i forhold til path, eller swing mer in-to-out'
    };
  }
  
  // Type 4: Hook (starter høyre/venstre, kurver mye venstre)
  if (spinAxis < -5) {
    return {
      type: 'HOOK',
      cause: 'Face lukket i forhold til path (F2P for negativ)',
      fix: 'Åpne face i forhold til path, eller swing mer out-to-in'
    };
  }
}
```

### Algoritme 2: Kontakt-Kvalitet

```typescript
function diagnoseContact(
  smashFactor: number,
  ballSpeed: number,
  clubSpeed: number,
  spinRate: number,
  launchAngle: number
): ContactDiagnosis {
  
  const optimalSF = 1.50; // Teoretisk maks
  const actualSF = smashFactor;
  
  if (actualSF < 1.40) {
    // Sjekk spin for å identifisere treffsted
    if (spinRate > 3000) {
      return { type: 'LOW_FACE', description: 'Trolig treff lavt på face' };
    }
    if (spinRate < 2000) {
      return { type: 'HIGH_FACE', description: 'Trolig treff høyt på face' };
    }
    return { type: 'HEEL_OR_TOE', description: 'Trolig off-center treff' };
  }
  
  return { type: 'CENTER', description: 'God kontakt' };
}
```

### Algoritme 3: Sprednings-Mønster

```typescript
function analyzeDispersion(
  shots: TrackManShot[]
): DispersionPattern {
  
  const offlines = shots.map(s => s.offline);
  const avgOffline = mean(offlines);
  const stdOffline = stdDev(offlines);
  
  // Konsistent draw/fade
  if (stdOffline < 10 && avgOffline !== 0) {
    return {
      pattern: avgOffline < 0 ? 'CONSISTENT_DRAW' : 'CONSISTENT_FADE',
      consistency: 'HIGH',
      recommendation: 'Juster aim eller endre F2P for rettere shot'
    };
  }
  
  // Two-way miss (stor spredning)
  if (stdOffline > 20) {
    // Sjekk om det er både hook og slice
    const hasLeft = offlines.some(o => o < -10);
    const hasRight = offlines.some(o => o > 10);
    
    if (hasLeft && hasRight) {
      return {
        pattern: 'TWO_WAY_MISS',
        consistency: 'LOW',
        recommendation: 'Face-kontroll ustabil - fokus på consistent release'
      };
    }
  }
  
  // Systematisk bias
  if (Math.abs(avgOffline) > 15) {
    return {
      pattern: 'SYSTEMATIC_BIAS',
      bias: avgOffline < 0 ? 'LEFT' : 'RIGHT',
      recommendation: `Juster aim ${avgOffline < 0 ? 'høyre' : 'venstre'} eller endre F2P`
    };
  }
}
```

---

## 🔧 FIKSE-ALGORITMER

### Problem: For mye Slice (høyre kurve)

**Data-pattern:**
- Face to Path: +3° til +6°
- Spin Axis: +5° til +10°

**Mulige årsaker:**
1. Face for åpen i forhold til path
2. Path for out-to-in
3. Kombinasjon av begge

**Diagnose-steg:**
1. Sjekk Face Angle
   - Hvis Face > +2°: Problem er åpen face
   - Hvis Face < +1°: Problem er path

2. Sjekk Club Path
   - Hvis Path < -3°: For out-to-in
   - Hvis Path > -1°: Path er OK

**Løsninger:**
```
Scenario A: Face for åpen
├── Grip: Sterkere grip (mer håndledd-rotasjon)
├── Setup: Lukk stance (aim høyre, body venstre)
└── Feel: "Release earlier" - roter håndledd tidligere

Scenario B: Path for out-to-in
├── Backswing: Mer inside takeaway
├── Downswing: Feel "swing to right field"
├── Ball position: Mer frem (driver) eller bak (jern)
└── Stance: Åpnere stance

Scenario C: Begge
└── Kombiner begge fiksene over
```

### Problem: For mye Hook (venstre kurve)

**Data-pattern:**
- Face to Path: -3° til -6°
- Spin Axis: -5° til -10°

**Løsninger (motsatt av slice):**
```
Scenario A: Face for lukket
├── Grip: Svakere grip
├── Setup: Åpn stance
└── Feel: "Hold off release" - delay håndledd-rotasjon

Scenario B: Path for in-to-out
├── Backswing: Mindre inside takeaway
├── Downswing: Feel "swing across target line"
└── Ball position: Mer bak (driver) eller frem (jern)
```

### Problem: Inconsistent Contact (variabel Smash Factor)

**Data-pattern:**
- Smash Factor varierer > 0.10 mellom slag
- Ball Speed inkonsistent

**Diagnose:**
```
Steg 1: Sjekk Attack Angle konsistens
├── Hvis AA varierer mye: Problem er low point kontroll
└── Løsning: Øv på consistent low point (brush grass drill)

Steg 2: Sjekk Spin Rate variasjon
├── Hvis Spin varierer > 1000 rpm: Impact location varierer
└── Løsning: Øv på centered contact (spray foot powder)

Steg 3: Sjekk Face Angle konsistens
├── Hvis Face varierer > 3°: Clubface kontroll mangler
└── Løsning: Øv med alignment stick, check face at address
```

---

## 📊 BALL POSITION OG DENS EFFEKTER

### Driver

| Ball Position | Attack Angle | Path Effect | Tendens | Kommentar |
|--------------|--------------|-------------|---------|-----------|
| **Too Forward** (utenfor venstre fot) | +4° eller mer | Path 3° venstre | Tendens til pull/hook | Kan gi mer carry men mindre kontroll |
| **Optimal** (innside venstre hæl) | +2° til +3° | Path 1-2° venstre | Trenger liten åpen face | Best for distance og kontroll |
| **Midten** | 0° | Path rett | Trenger square face | OK men mister carry |
| **Too Back** (høyre for midten) | -2° eller mer | Path 2-3° høyre | Tendens til push/slice | Dårlig for driver |

### Jern

| Ball Position | Attack Angle | Path Effect | Tendens |
|--------------|--------------|-------------|---------|
| **Too Forward** | -2° (for flat) | Path 2° venstre | Thin shots, loss of compression |
| **Optimal** (midt til venstre) | -4° til -6° | Path 1-2° høyre | Good compression, slight draw |
| **Too Back** (høyre for midten) | -8° (for bratt) | Path 3° høyre | Fat shots, loss of distance |

---

## 🎓 ØVELSER BASERT PÅ DATA

### Øvelse 1: "The F2P Drill" (for shot shaping)

**Formål:** Lære å kontrollere Face to Path

**Setup:**
1. Velg et mål (target)
2. Plasser alignment stick på target line
3. Plasser stick 3° åpen for draw, 3° lukket for fade

**Data-focus:**
- Sjekk at Face to Path matcher ønsket kurve
- For draw: Face 0°, Path +3° = F2P -3°
- For fade: Face 0°, Path -3° = F2P +3°

### Øvelse 2: "Low Point Control"

**Formål:** Konsistent Attack Angle

**Drill:**
1. Legg håndkle 4 inches foran ballen
2. Prøv å ikke treffe håndkleet
3. Sjekk TrackMan: AA skal være negativ for jern

**Data-focus:**
- Attack Angle: -4° til -6° for 7-jern
- Low Point skal være etter ballen

### Øvelse 3: "Gear Effect Awareness"

**Formål:** Forstå impact location effekt

**Drill:**
1. Treff ball på toe med vilje
2. Observer: Ball starter høyre (åpen face) men hooker
3. Sjekk Spin Axis: skal være negativ (hook spin)

**Læring:**
- Toe hit = åpen face + hook spin
- Heel hit = lukket face + fade spin
- Gear effect "hjelper" ballen tilbake mot target

---

## 🤖 AI COACH IMPLEMENTASJON

### System Prompt (for Claude)

```
Du er en TrackMan Master Coach. Din kunnskap inkluderer:

FYSIKK:
- Ball Flight Laws (85% face, 15% path)
- D-Plane konseptet (3D path)
- Gear Effect ved off-center treff

PARAMETRE:
- Du forstår alle 20+ TrackMan parametere
- Du kjenner deres relasjoner og korrelasjoner
- Du kan diagnostisere basert på data-mønstre

DIAGNOSE:
- Du identifiserer 1-2 hovedårsaker (ikke 10)
- Du forklarer HVORFOR noe skjer
- Du gir konkrete, trenbare løsninger

KOMMUNIKASJON:
- Bruk golf-terminologi korrekt
- Forklar komplekse konsepter enkelt
- Vær konstruktiv og motiverende

VIKTIGE REGLER:
1. Face Angle + Club Path = Start Direction + Curve
2. Face to Path bestemmer Spin Axis (kurve)
3. Attack Angle påvirker både launch OG path
4. Ball position endrer Attack Angle
5. Off-center treff påvirker resultatet

Når du analyserer data:
1. Se på spredningsmønster først
2. Identifiser Face to Path mønster
3. Sjekk for off-center treff (Smash Factor)
4. Vurder Attack Angle vs Ball Position
5. Gi 1-2 konkrete fiks
```

### Analyse-Template

```typescript
interface TrackManAnalysis {
  // Input
  shots: TrackManShot[];
  playerGoal: 'distance' | 'accuracy' | 'consistency';
  
  // Output
  summary: string;
  primaryIssue: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    dataEvidence: string;
  };
  secondaryIssue?: {
    type: string;
    dataEvidence: string;
  };
  rootCause: string;
  recommendedFixes: {
    priority: number;
    drill: string;
    expectedImprovement: string;
    focusData: string; // Hvilken parameter å sjekke
  }[];
  benchmark: {
    vsTour: Record<string, number>;
    vsHandicap: Record<string, number>;
  };
}
```

---

## 📚 REFERANSER

1. **TrackMan University** - Offisiell sertifiserings-materiell
2. **Jorgensen, T.** (1999). *The Physics of Golf*
3. **D-Plane Concept** - GolfWRX/Instructor forum diskusjoner
4. **TrackMan Blog** - trackman.com/blog (alle artikler)
5. **New Ball Flight Laws** - Moderne instruksjons-teori (2010+)

---

**Dokumentasjon laget for:** AK Golf Platform AI Coach  
**Nivå:** Master/Advanced  
**Oppdateres:** Ved nye TrackMan-funn
