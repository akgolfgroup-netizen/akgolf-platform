# Spill-Modul UI/UX Design
## Komplett Interface-Spesifikasjon

**Mappe:** `/docs/research/ui-ux/`  
**Status:** Design-Spesifikasjon

---

## INNHOLDSFORTEGNELSE

1. [Hoved-Flyt](#1-hoved-flyt)
2. [Spill-Modus Velger](#2-spill-modus-velger)
3. [Innspill-Modus UI](#3-innspill-modus-ui)
4. [Konkurranse-Modus UI](#4-konkurranse-modus-ui)
5. [Baneguide Kart](#5-baneguide-kart)
6. [Mental Scorecard UI](#6-mental-scorecard-ui)
7. [DECADE Caddy Overlay](#7-decade-caddy-overlay)
8. [Notat-Input](#8-notat-input)

---

## 1. HOVED-FLYT

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HOVED-FLYT                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [START SPILL]                                                      │
│      │                                                              │
│      ▼                                                              │
│  ┌──────────────────┐                                               │
│  │ VELG MODUS       │                                               │
│  │                  │                                               │
│  │ 🏆 Konkurranse   │───► Påkrevd mental scorecard                  │
│  │ ⛳ Innspill       │───► Notater + valgfritt mental                │
│  │ 🎮 Casual        │───► Enkel logging                             │
│  └──────────────────┘                                               │
│      │                                                              │
│      ▼                                                              │
│  ┌──────────────────┐                                               │
│  │ VELG BANE        │                                               │
│  │ • Søk            │                                               │
│  │ • Nylige         │                                               │
│  │ • Mine notater   │                                               │
│  └──────────────────┘                                               │
│      │                                                              │
│      ▼                                                              │
│  ┌──────────────────┐                                               │
│  │ VÆR-SYNC         │                                               │
│  │ • YR.no data     │                                               │
│  │ • Per-hull vind  │                                               │
│  └──────────────────┘                                               │
│      │                                                              │
│      ▼                                                              │
│  ┌──────────────────┐    ┌──────────────────┐                       │
│  │ HULL-FOR-HULL    │◄──►│ MENTAL SCORECARD │ (hvis aktivert)       │
│  │                  │    │                  │                       │
│  │ • Scorecard      │    │ • Pre-shot       │                       │
│  │ • DECADE caddy   │    │ • Post-shot      │                       │
│  │ • Kart/notater   │    │ • Press-track    │                       │
│  └──────────────────┘    └──────────────────┘                       │
│      │                                                              │
│      ▼                                                              │
│  ┌──────────────────┐                                               │
│  │ RAPPORT          │                                               │
│  │ • Score          │                                               │
│  │ • Stats          │                                               │
│  │ • Mental analyse │                                               │
│  │ • DECADE score   │                                               │
│  └──────────────────┘                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. SPILL-MODUS VELGER

```
╔══════════════════════════════════════════════════════════════════╗
║  ⛳ START NY RUNDE                                              ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Velg modus:                                                     ║
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  🏆 KONKURRANSE                                           │   ║
║  │                                                           │   ║
║  │  For turneringer og viktige runder                        │   ║
║  │                                                           │   ║
║  │  ✓ Full statistikk                                        │   ║
║  │  ✓ Påkrevd mental scorecard                               │   ║
║  │  ✓ DECADE-caddy med mental coaching                       │   ║
║  │  ✓ Post-runde analyse                                     │   ║
║  │                                                           │   ║
║  │  [VELG]                                                   │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  ⛳ INNSPILL / TRENINGSRUNDE                              │   ║
║  │                                                           │   ║
║  │  Forbered deg til turnering                               │   ║
║  │                                                           │   ║
║  │  ✓ Lag detaljerte notater per hull                        │   ║
║  │  ✓ Flagg-plasseringer                                     │   ║
║  │  ✓ "Smart miss" soner                                     │   ║
║  │  ✓ Vind-retninger                                         │   ║
║  │  ✓ Valgfritt mental scorecard                             │   ║
║  │                                                           │   ║
║  │  [VELG]                                                   │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  🎮 CASUAL SPILL                                          │   ║
║  │                                                           │   ║
║  │  Enkel logging med venner                                 │   ║
║  │                                                           │   ║
║  │  ✓ Hurtig score-føring                                    │   ║
║  │  ✓ Basis-statistikk                                       │   ║
║  │  ✓ Ingen mental tracking                                  │   ║
║  │                                                           │   ║
║  │  [VELG]                                                   │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 3. INNSPILL-MODUS UI

### 3.1 Innspill Hovedskjerm

```
╔══════════════════════════════════════════════════════════════════╗
║  ⛳ INNSPILL: MIKLAGARD GK                                       ║
║  Dato: 15. april 2026                                            ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │                                                          │   ║
║  │  🗺️ BANEGUIDE MED KART                                   │   ║
║  │                                                          │   ║
║  │  ┌────────────────────────────────────────────────────┐ │   ║
║  │  │                                                    │ │   ║
║  │  │  [SATELLITT KART - HULL 3]                         │ │   ║
║  │  │                                                    │ │   ║
║  │  │      🏌️ TEE                                       │ │   ║
║  │  │         │                                          │ │   ║
║  │  │         │ 🟢 Startlinje                            │ │   ║
║  │  │         ▼                                          │ │   ║
║  │  │      ╔═══════════════╗                             │ │   ║
║  │  │      ║  FAIRWAY      ║  [TØRR +25m]                │ │   ║
║  │  │      ╚═══════════════╝                             │ │   ║
║  │  │             │                                       │ │   ║
║  │  │             ▼                                       │ │   ║
║  │  │      ┌───────────────┐                             │ │   ║
║  │  │      │  GREEN        │                             │ │   ║
║  │  │      │ 🔴⚪🔵        │  ← Flagg-posisjoner        │ │   ║
║  │  │      │ 🟢 Safe miss  │  ← Smart miss sone         │ │   ║
║  │  │      └───────────────┘                             │ │   ║
║  │  │                                                    │ │   ║
║  │  │  💨 3 m/s fra venstre                              │ │   ║
║  │  │                                                    │ │   ║
║  │  └────────────────────────────────────────────────────┘ │   ║
║  │                                                          │   ║
║  │  [🔍 Zoom] [📍 Min posisjon] [🏷️ Legg til notat]       │   ║
║  │                                                          │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  📝 NOTATER FOR HULL 3                                   │   ║
║  │                                                          │   ║
║  │  ┌─ Fairway ──────────────────────────────────────────┐  │   ║
║  │  │ Status: 🔴 Ekstremt tørr                           │  │   ║
║  │  │ Ekstra rull: +25-30 meter                          │  │   ║
║  │  │ Notat: "Landingsområdet er knusktørt"             │  │   ║
║  │  └────────────────────────────────────────────────────┘  │   ║
║  │                                                          │   ║
║  │  ┌─ Flagg-plassering ─────────────────────────────────┐  │   ║
║  │  │ 🔴 Front (estimert i går)                         │  │   ║
║  │  │ ⚪ Midt (sett i dag 08:30)                        │  │   ║
║  │  │ 🔵 Bak (estimert)                                 │  │   ║
║  │  └────────────────────────────────────────────────────┘  │   ║
║  │                                                          │   ║
║  │  ┌─ Smart Miss ────────────────────────────────────────┐  │   ║
║  │  │ 🟢 PREFERRED: Venstre side                          │  │   ║
║  │  │    Lett chip oppover, 65% up-and-down               │  │   ║
║  │  │ 🔴 AVOID: Høyre bunker                              │  │   ║
║  │  │    Kun 25% up-and-down, dobbel-bogey fare          │  │   ║
║  │  └────────────────────────────────────────────────────┘  │   ║
║  │                                                          │   ║
║  │  [✏️ REDIGER NOTATER]                                   │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  [⬅️ FORRIGE HULL]    [HULL 3 AV 18]    [NESTE HULL ➡️]        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### 3.2 Notat-Redigering

```
╔══════════════════════════════════════════════════════════════════╗
║  ✏️ REDIGER NOTATER - HULL 3                                    ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─ FAIRWAY TILSTAND ─────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │ Velg tilstand:                                              │ ║
║  │ [🟢 Normal] [🟡 Fuktig] [🔴 Ekstrem tørr] [❄️ Frost]        │ ║
║  │                                                             │ ║
║  │ Ekstra rull ved "tørr": [____25____] meter                │ ║
║  │                                                             │ ║
║  │ Tilleggsnotat:                                              │ ║
║  │ ┌─────────────────────────────────────────────────────┐    │ ║
║  │ │ Landingsområdet er knusktørt. Ballen ruller 25-30m │    │ ║
║  │ │ lenger enn normalt. Bruk 3-tre i stedet for driver │    │ ║
║  │ │ hvis du vil unngå å gå gjennom fairway.            │    │ ║
║  │ └─────────────────────────────────────────────────────┘    │ ║
║  │                                                             │ ║
║  │ [TEGN STARTLINJE PÅ KARTET]                                │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ FLAGG-PLASSERING ─────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │ Legg til flagg:                                             │ ║
║  │ [🔴 Front] [⚪ Midt] [🔵 Bak] [📍 Annen posisjon]          │ ║
║  │                                                             │ ║
║  │ Når er dette fra?                                           │ ║
║  │ (•) Sett i dag        ( ) Estimat fra tidligere            │ ║
║  │                                                             │ ║
║  │ Eksisterende:                                               │ ║
║  │ • 🔴 Front (estimert 14.04) [🗑️]                          │ ║
║  │ • ⚪ Midt (sett i dag 08:30) [🗑️]                         │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ SMART MISS SONER ─────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │ [TEGN SONE PÅ KARTET]                                      │ ║
║  │                                                             │ ║
║  │ 🟢 PREFERRED MISS:                                         │ ║
║  │    Side: [Venstre ▼]                                       │ ║
║  │    Grunn: [Lett chip oppover ▼]                            │ ║
║  │    Sannsynlighet for up-and-down: [65%]                    │ ║
║  │                                                             │ ║
║  │ 🔴 AVOID MISS:                                             │ ║
║  │    Side: [Høyre ▼]                                         │ ║
║  │    Grunn: [Dyp bunker ▼]                                   │ ║
║  │    Risiko: [Dobbel-bogey]                                  │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ STARTLINJE ───────────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │ [TEGN PÅ KARTET]                                           │ ║
║  │                                                             │ ║
║  │ Primær siktepunkt:                                         │ ║
║  │ Beskrivelse: Høyre fairway, la draw komme tilbake         │ ║
║  │                                                            │ ║
║  │ Alternativ:                                                │ ║
║  │ Beskrivelse: Venstre side hvis vinden er sterkere         │ ║
║  │                                                            │ ║
║  │ Farlig område:                                             │ ║
║  │ Beskrivelse: Ikke venstre rough - trær blokkerer           │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ LAYUP (hvis par 5) ───────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │ Maks avstand fra green: [___100___] meter                 │ ║
║  │                                                            │ ║
║  │ Target: 100m stake på venstre side                         │ ║
║  │ Unngå: Bunker ved 80m markering                            │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  [LAGRE] [AVBRYT]                                               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 4. KONKURRANSE-MODUS UI

### 4.1 Konkurranse Scorecard

```
╔══════════════════════════════════════════════════════════════════╗
║  🏆 KONKURRANSE - MIKLAGARD GK                                   ║
║  Klubbmesterskap - Runde 1 av 2                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─ SCORECARD ─────────────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Hull │ Par │ Slag │ Putts │ FW │ GIR │ Mntl │ DECADE      │ ║
║  │  ─────┼─────┼──────┼───────┼────┼─────┼──────┼──────        │ ║
║  │   1   │  4  │   5  │   2   │ ❌ │  ❌ │  ✓   │ SMART       │ ║
║  │   2   │  3  │   4  │   2   │  - │  ❌ │  ✓   │ NEUTRAL     │ ║
║  │   3   │  4  │   4  │   2   │ ✓  │  ✓  │  ✓   │ SMART       │ ║
║  │   4   │  5  │   5  │   1   │ ✓  │  ✓  │  ✓   │ SMART ⭐    │ ║
║  │   5   │  4  │   -  │   -   │  - │  -  │  -   │ -           │ ║
║  │   6   │  3  │   -  │   -   │  - │  -  │  -   │ -           │ ║
║  │  ...  │ ... │  ... │  ...  │ .. │  .. │  ..  │ ...         │ ║
║  │                                                             │ ║
║  │  TOTAL: +2 (etter 4 hull)                                   │ ║
║  │  Plassering: 12 av 32                                       │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ NÅVÆRENDE HULL: #5 ───────────────────────────────────────┐ ║
║  │  Par 4, 380m                                                │ ║
║  │                                                             │ ║
║  │  🎯 DECADE CADDY:                                           │ ║
║  │  Sikte: Midt-venstre fairway                                │ ║
║  │  Kølle: Driver (buffer OK)                                  │ ║
║  │  Grunn: Din 28m spredning passer innenfor 35m safe zone    │ ║
║  │                                                             │ ║
║  │  [🧠 MENTAL SCORECARD]  [🗺️ SE KART]  [📝 NOTATER]        │ ║
║  │                                                             │ ║
║  │  Registrer slag:                                            │ ║
║  │  [FAIRWAY] [ROUGH V] [ROUGH H] [BUNKER] [WATER] [OB]        │ ║
║  │                                                             │ ║
║  │  Avstand til green: 145m                                    │ ║
║  │  [REGISTRER NESTE SLAG]                                     │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  💨 Vind: 4 m/s fra venstre │ 🌡️ 14°C │ ☁️ Overskyet          ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 5. BANEGUIDE KART

### 5.1 Kart med Overlays

```
╔══════════════════════════════════════════════════════════════════╗
║  🗺️ BANEGUIDE - HULL 7                                          ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─ LEGENDE ───────────────────────────────────────────────────┐ ║
║  │  🟢 Startlinje  │  🔴 Flagg  │  🟢 Safe miss  │  🔴 Danger │ ║
║  │  ⭕ Spredning   │  💨 Vind    │  🎯 Siktepunkt              │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ KART ──────────────────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │          N                                                  │ ║
║  │          ↑                                                  │ ║
║  │     W ←────→ E     💨 3 m/s fra vest                       │ ║
║  │          ↓                                                  │ ║
║  │          S                                                  │ ║
║  │                                                             │ ║
║  │      🏌️ TEE                                                 │ ║
║  │         │                                                   │ ║
║  │         │ 🟢────────────── Startlinje                        │ ║
║  │         │  (sikte høyre fairway)                            │ ║
║  │         ▼                                                   │ ║
║  │      ╔═══════════════╗                                      │ ║
║  │      ║  FAIRWAY      ║  [TØRR] +25m rull                    │ ║
║  │      ║    ╔═══╗      ║   🔴 Vann høyre                      │ ║
║  │      ║    ║   ║      ║                                      │ ║
║  │      ╚════╩═══╩══════╝                                      │ ║
║  │             │                                               │ ║
║  │             ▼                                               │ ║
║  │      ┌───────────────┐                                      │ ║
║  │      │    GREEN      │                                      │ ║
║  │      │ ┌───────────┐ │                                      │ ║
║  │      │ │    ⭕     │ │  ← 95% spredning (24m radius)       │ ║
║  │      │ │   🎯      │ │     Sikte her!                       │ ║
║  │      │ └───────────┘ │                                      │ ║
║  │      │      🔴       │  ← Flagg (ikke sikte her!)           │ ║
║  │      │ 🟢         🔴 │  🟢=Safe  🔴=Danger                  │ ║
║  │      └───────────────┘                                      │ ║
║  │                                                             │ ║
║  │      🟢 Safe miss: Venstre rough, lett chip                │ ║
║  │      🔴 Danger: Høyre bunker, nedoverbakke                 │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ HULL-INFO ─────────────────────────────────────────────────┐ ║
║  │  Hull 7 │ Par 4 │ 380m │ SI 8                               │ ║
║  │  Dine notater: "Tørr fairway, legg 25m til driver"          │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  [⬅️] [🔍+] [🔍-] [📍 Min pos] [🔄 Bytt karttype] [➡️]        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 6. MENTAL SCORECARD UI

### 6.1 Pre-Shot Screen

```
╔══════════════════════════════════════════════════════════════════╗
║  🧠 MENTAL SCORECARD - HULL 7, SLÅG 2                           ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─ SITUASJON ─────────────────────────────────────────────────┐ ║
║  │  145m til green │ 8-jern │ Vind: 3 m/s fra venstre          │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ 8-SECOND RULE ────────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Visualiser skuddet ditt:                                   │ ║
║  │                                                             │ ║
║  │  ⏱️ [ 00:05 / 08:00 ]                                       │ ║
║  │                                                             │ ║
║  │  ┌─────────────────────────────────────────────────────┐   │ ║
║  │  │                                                     │   │ ║
║  │  │  "Jeg ser ballen treffe midt green...               │   │ ║
║  │  │   ...rulle ut mot høyre...                          │   │ ║
║  │  │   ...stoppe 5m fra hullet."                         │   │ ║
║  │  │                                                     │   │ ║
║  │  └─────────────────────────────────────────────────────┘   │ ║
║  │                                                             │ ║
║  │  [⏹️ JEG SÅ DET KLART!]                                    │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ SELVEVALUERING ───────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  FOKUS:                                                     │ ║
║  │  Sliten [●───────────────────────────] Skarp               │ ║
║  │            1    2    3    4    5    6    7    8    9   10  │ ║
║  │                      ●───●───●                              │ ║
║  │                      [7]                                    │ ║
║  │                                                             │ ║
║  │  SELVTILLIT:                                                │ ║
║  │  Usikker [●───────────────────────────] Confident          │ ║
║  │            1    2    3    4    5    6    7    8    9   10  │ ║
║  │                            ●───●───●                        │ ║
║  │                            [8]                              │ ║
║  │                                                             │ ║
║  │  PRESS-NIVÅ:                                                │ ║
║  │  [PR1]  [PR2]  [PR3]  [PR4 ●]  [PR5]                       │ ║
║  │  Ingen   Lav   Mod    HØYT    Maks                         │ ║
║  │                                                             │ ║
║  │  Press-kilder:                                              │ ║
║  │  [✓] Viktig hull │ [ ] Motspiller │ [ ] Tilskuere         │ ║
║  │  [✓] Vil prestere                                           │ ║
║  │                                                             │ ║
║  │  Fulgte du rutinen? [✓ Ja] [ ] Nei                         │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  [REGISTRER SLAG]                                               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### 6.2 Post-Shot Screen

```
╔══════════════════════════════════════════════════════════════════╗
║  🧠 MENTAL SCORECARD - ETTER SLAG                               ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─ RESULTAT ──────────────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Hvordan var resultatet?                                    │ ║
║  │                                                             │ ║
║  │  [🟢 PERFEKT]  [🟡 BRA]  [🟠 OK]  [🔴 DÅRLIG]  [⚫ KATAST]  │ ║
║  │                                                             │ ║
║  │  Beskrivelse: Ballen landet 3m fra green, lett chip        │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ PROSESS ───────────────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Score din prosess:                                         │ ║
║  │                                                             │ ║
║  │  [●───────────────────────────]                             │ ║
║  │   1    2    3    4    5    6    7    8    9   10            │ ║
║  │                       ●───●───●                             │ ║
║  │                       [7]                                   │ ║
║  │                                                             │ ║
║  │  Hadde du klar plan?        [✓ Ja]  [ ] Nei                │ ║
║  │  Fulgte du rutinen?         [✓ Ja]  [ ] Nei                │ ║
║  │  Var du committed?          [✓ Ja]  [ ] Nei                │ ║
║  │  Siste-sekund tvil?         [ ] Ja  [✓ Nei]                │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ EMOSJON ───────────────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Hvordan føler du deg?                                      │ ║
║  │                                                             │ ║
║  │  [😊 Fornøyd]  [😐 Nøytral]  [😤 Irritert]  [😡 Sinna]      │ ║
║  │                                                             │ ║
║  │  Intensitet:                                                │ ║
║  │  [●───────────────────────────]                             │ ║
║  │            Svak                              Sterk          │ ║
║  │                    ●───●                                    │ ║
║  │                    [3]                                      │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ ACCEPT ────────────────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Har du akseptert resultatet?                               │ ║
║  │                                                             │ ║
║  │  [✓ JA, jeg er klar for neste slag]                        │ ║
║  │  [ ] NEI, jeg grubler fortsatt på...                       │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  [LAGRE OG FORTSETT]                                            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 7. DECADE CADDY OVERLAY

```
╔══════════════════════════════════════════════════════════════════╗
║  🎯 DECADE CADDY                                                ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─ DIN SPREDNING (8-jern, 125m) ─────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Kontekst: [Trening 🔧]  [Spill ⛳]  [Konkurranse 🏆●]     │ ║
║  │                                                             │ ║
║  │  Spredning i konkurranse: ±24m (95%)                       │ ║
║  │                                                             │ ║
║  │  ┌─────────────────────────────────────────┐               │ ║
║  │  │              GREEN                      │               │ ║
║  │  │         ┌───────────┐                   │               │ ║
║  │  │         │    ⭕     │ ← Din spredning  │               │ ║
║  │  │         │   (YOU)   │                   │               │ ║
║  │  │         └───────────┘                   │               │ ║
║  │  │               🔴                        │               │ ║
║  │  │              (PIN)                      │               │ ║
║  │  └─────────────────────────────────────────┘               │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ ANBEFALING ────────────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  🎯 SIKTE: MIDT GREEN                                       │ ║
║  │                                                             │ ║
║  │  Grunn: Din 24m spredning tilsier at du vil treffe         │ ║
║  │  green 78% av gangene hvis du sikter på midt.              │ ║
║  │                                                             │ ║
║  │  Hvis du sikter på flagget (bak-høyre):                    │ ║
║  │  • Bare 42% sjanse for green-treff                         │ ║
║  │  • 30% risiko for bunker høyre                             │ ║
║  │                                                             │ ║
║  │  💡 "Smart å miss til venstre. Lett chip oppover."         │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  ┌─ DIN BESLUTNING ────────────────────────────────────────────┐ ║
║  │                                                             │ ║
║  │  Hva gjorde du?                                             │ ║
║  │                                                             │ ║
║  │  [Jeg fulgte rådet]    [Jeg siktet på flagget]              │ ║
║  │  [Jeg var mer konservativ]  [Annet]                         │ ║
║  │                                                             │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 8. NOTAT-INPUT

### 8.1 Hurtig Notat-Modal

```
╔══════════════════════════════════════════════════════════════════╗
║  📝 NYTT NOTAT - HULL 7                                         ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Kategori:                                                       ║
║  [Fairway] [Flagg] [Smart Miss] [Vind] [Startlinje] [Annet]    ║
║                                                                  ║
║  ┌─ FAIRWAY ───────────────────────────────────────────────────┐ ║
║  │  Tilstand:                                                  │ ║
║  │  [🟢 Normal] [🟡 Fuktig] [🔴 Tørr] [❄️ Frost]              │ ║
║  │                                                             │ ║
║  │  Ekstra rull: [___25___] meter                            │ ║
║  │                                                             │ ║
║  │  Notat:                                                     │ ║
║  │  ┌─────────────────────────────────────┐                   │ ║
║  │  │ Ekstremt tørr fairway. Ballen     │                   │ ║
║  │  │ ruller 25m lengre.                │                   │ ║
║  │  └─────────────────────────────────────┘                   │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║                                                                  ║
║  [LAGRE] [AVBRYT]                                               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## RESPONSIVE DESIGN

### Mobil Layout

```
┌─────────────────────────┐
│ ⛳ HULL 7    PAR 4  ▓▓░ │
├─────────────────────────┤
│                         │
│    [KART VISNING]       │
│                         │
├─────────────────────────┤
│ 🎯 Sikte: Midt green    │
│ 🏌️ Kølle: 8-jern        │
├─────────────────────────┤
│ 📝 [NOTATER] 🧠 [MENTAL]│
├─────────────────────────┤
│  REGISTRER SLAG:        │
│  [FW] [R] [B] [G] [OB]  │
├─────────────────────────┤
│  +3  (etter 7 hull)     │
└─────────────────────────┘
```

---

## OPPSUMMERING

### Nøkkel-Skjermbilder

1. **Modus-velger**: Konkurranse/Innspill/Casual
2. **Innspill-modus**: Kart + notater per hull
3. **Konkurranse-modus**: Scorecard + DECADE + mental
4. **Baneguide**: Kart med overlays (flagg, miss-soner, vind)
5. **Mental scorecard**: Pre/post shot tracking
6. **DECADE overlay**: Spredning + anbefaling

### Interaksjoner

- Tegn på kartet (startlinjer, miss-soner)
- Trykk for å plassere flagg
- Slider for scoring (1-10)
- Hurtig-knapper for vanlige valg
