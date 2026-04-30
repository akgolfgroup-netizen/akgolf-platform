# SPILL Modul - Research & Spesifikasjon
## Komplett Dokumentasjon for Tour-Level Caddy System

**Prosjekt:** AK Golf Platform  
**Dato:** April 2026  
**Status:** Research Fase - Klar for Implementasjon

---

## DOKUMENT-OVERSIKT

Dette er hovedmappen for all research og spesifikasjon relatert til **SPILL**-modulen i AK Golf Platform.

### Mapperstruktur

```
docs/research/
├── README.md                              <- Du er her
├── spill-funksjon/
│   └── SPILL_MODUS_KOMPLETT_SPEC.md       # Kravspec for alle spill-moduser
├── demade-algoritme/
│   └── DECADE_ALGORITME_KOMPLETT.md       # DECADE strategy implementasjon
├── mental-tracking/
│   └── MENTAL_SCORECARD_SPEC.md           # Mental scorecard & tracking
├── ui-ux/
│   └── SPILL_UI_DESIGN.md                 # Interface design & mockups
└── trackman-import/
    └── TRACKMAN_IMPORT_STRATEGI.md        # Import av sprednings-data
```

---

## HOVEDFUNKSJONER

### 1. Tre Spill-Moduser

| Modus | Mental Scorecard | DECADE Caddy | Notater | Bruks-case |
|-------|------------------|--------------|---------|------------|
| 🏆 **Konkurranse** | Påkrevd | Full | Begrenset | Turneringer, viktige runder |
| ⛳ **Innspill** | Valgfritt | Læringsmodus | Full | Forberedelse til turnering |
| 🎮 **Casual** | Nei | Basis | Nei | Runder med venner |

### 2. Innspill-Funksjon (Pre-Round)

- **Hull-spesifikke notater**
  - Fairway-tilstand (tørr/fuktig/frost)
  - Flagg-plasseringer (estimat vs faktisk)
  - "Smart miss" soner
  - Startlinjer
  - Layup-mål (par 5)

- **Baneguide med kart**
  - Satellite view med overlays
  - Vind-retning per hull
  - Visuelle soner (safe/danger)
  - Spiller-tegnede linjer

### 3. DECADE Caddy

Basert på Scott Fawcett's DECADE-strategi:

- **5% Buffer Regel**: Sikte på "fat part" minus buffer
- **Shotgun Pattern**: Din spredning er en hagle, ikke rifle
- **Bogey Avoidance**: Prioriter å unngå dobbel-bogey
- **Personlig Spredning**: Bruker TrackMan-data, ikke estimater

### 4. Mental Tracking

- **PR1-PR5 Press-skala** (integrert med AK-Formula)
- **Pre-shot rutine** (8-second rule)
- **Post-shot evaluering**
- **Trend-analyse** over tid

---

## DATA-FLYT

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA-FLYT FOR SPILL                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. TRACKMAN IMPORT                                             │
│     ↓                                                            │
│     CSV/API → Parse → Clean → Calculate Dispersion              │
│     ↓                                                            │
│  2. SPILLER-PROFIL                                              │
│     ↓                                                            │
│     ClubDispersion: Trening vs Konkurranse                      │
│     ↓                                                            │
│  3. RUNDE-START                                                 │
│     ↓                                                            │
│     Velg modus → Sync vær (YR.no) → Last notater                │
│     ↓                                                            │
│  4. PER HULL                                                    │
│     ↓                                                            │
│     DECADE Caddy: Beregner strategi basert på:                  │
│     - Din spredning (kontekst-avhengig)                         │
│     - Hull-geometri                                             │
│     - Vind                                                      │
│     - Buffer-regel                                              │
│     ↓                                                            │
│     Mental Scorecard (hvis aktivert):                           │
│     - Pre-shot: Fokus, selvtillit, press, visualisering        │
│     - Post-shot: Resultat, prosess, emosjon, accept            │
│     ↓                                                            │
│  5. POST-RUNDE                                                  │
│     ↓                                                            │
│     - Score & statistikk                                        │
│     - DECADE compliance score                                   │
│     - Mental rapport                                            │
│     - Lagre notater for fremtidig bruk                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## IMPLEMENTASJONSPRIORITET

### Fase 1: MVP (Uke 1-2)
1. [ ] Spill-modus velger (Konkurranse/Innspill/Casual)
2. [ ] Enkel scorecard-føring
3. [ ] Basis DECADE-caddy (uten sprednings-data)

### Fase 2: Innspill (Uke 3-4)
1. [ ] Notat-funksjon per hull
2. [ ] Kart-integrasjon (Google/Apple Maps)
3. [ ] Flagg-plassering
4. [ ] Vær-sync (YR.no)

### Fase 3: DECADE Algoritme (Uke 5-6)
1. [ ] TrackMan CSV import
2. [ ] Sprednings-beregning
3. [ ] Kontekst-separering (trening vs konkurranse)
4. [ ] Buffer-regel implementasjon

### Fase 4: Mental Tracking (Uke 7-8)
1. [ ] Mental scorecard UI
2. [ ] Pre/post shot spørsmål
3. [ ] Press-tracking (PR1-PR5)
4. [ ] Trend-analyse dashboard

---

## VIKTIGE BESLUTNINGER

### Mental Scorecard Obligatorisk
- **Påkrevd for**: Konkurranse-modus, Turneringer
- **Valgfritt for**: Innspill-modus
- **Ikke tilgjengelig**: Casual-modus

### DECADE Caddy Aggressivitet
```typescript
const AGGRESSIVENESS = {
  tournament:    0.3,  // 30% - Svært konservativ
  prep:          0.5,  // 50% - Moderat
  casual:        0.7,  // 70% - Mer fleksibel
};
```

### Sprednings-Data
- Minimum 30 slag per kølle per kontekst
- Oppdateres månedlig
- Hvis manglende data: Bruk estimater basert på HCP

---

## INTEGRASJONER

### Eksterne API-er

| Tjeneste | Bruk | Status |
|----------|------|--------|
| **YR.no** | Vær-data, vind | Planlagt |
| **TrackMan Golf** | Sprednings-data | Planlagt |
| **Google Maps** | Satellite kart | Planlagt |

### Interne Systemer

| System | Integrasjon |
|--------|-------------|
| **AK-Formula** | PR/M-skala, treningskontekst |
| **DECADE Engine** | Hull-strategi, beslutnings-evaluering |
| **Spiller-Profil** | Dispersion, mental profil |

---

## RESSURSER

### Dokumenter å Lese
1. [SPILL_MODUS_KOMPLETT_SPEC.md](./spill-funksjon/SPILL_MODUS_KOMPLETT_SPEC.md) - Kravspec
2. [DECADE_ALGORITME_KOMPLETT.md](./demade-algoritme/DECADE_ALGORITME_KOMPLETT.md) - Algoritme
3. [MENTAL_SCORECARD_SPEC.md](./mental-tracking/MENTAL_SCORECARD_SPEC.md) - Mental tracking
4. [SPILL_UI_DESIGN.md](./ui-ux/SPILL_UI_DESIGN.md) - Design
5. [TRACKMAN_IMPORT_STRATEGI.md](./trackman-import/TRACKMAN_IMPORT_STRATEGI.md) - TrackMan

### Referanse
- [DECADE App](https://www.decadegolf.com/) - Scott Fawcett's system
- [TrackMan](https://trackmangolf.com/) - Launch monitor
- [YR.no API](https://api.met.no/) - Vær-data

---

## NØKKEL-BEGREPER

| Begrep | Forklaring |
|--------|------------|
| **5% Buffer** | Sikte på midt av "fat part" minus 5% margin |
| **Shotgun Pattern** | Din spredning er bred, ikke ett punkt |
| **PR1-PR5** | Press-nivå skala (Ingen → Maks) |
| **8-Second Rule** | Visualiser innen 8 sekunder |
| **Smart Miss** | Beste sted å miss for up-and-down |
| **Dispersion** | Standardavvik i lateral/distanse |

---

**Neste steg:** Start med Fase 1 implementasjon - Spill-modus velger og basis scorecard.

**Kontakt:** For spørsmål om spesifikasjon, se respektive dokumenter i undermapper.
