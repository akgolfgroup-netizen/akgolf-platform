# 🎨 Design-til-Kode Arbeidsflyt

> **VIKTIG:** Denne flyten sikrer at design er godkjent før koding starter.

---

## 📋 De 3 Stadiene

```
┌─────────────────────────────────────────────────────────────────┐
│                        STAGE 1: WORKBENCH                        │
│                      🧪 EKSPERIMENTER & UTFORSK                  │
├─────────────────────────────────────────────────────────────────┤
│  • Prøve ut ideer fritt i Stitch                                 │
│  • Flere varianter er OK                                         │
│  • Ingen kode skrives                                            │
│  • Mappe: .stitch/workbench/                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  DESIGN REVIEW  │
                    │  (med teamet)   │
                    └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        STAGE 2: REVIEW                           │
│                      👀 VURDERING & FINJUSTERING                 │
├─────────────────────────────────────────────────────────────────┤
│  • Velge én versjon fra workbench                                │
│  • Finjustere detaljer                                           │
│  • Klar til godkjenning                                          │
│  • Mappe: .stitch/review/                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   GODKJENNING   │
                    │  (produkteier)  │
                    └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        STAGE 3: APPROVED                         │
│                      ✅ GODKJENT - LÅST DESIGN                   │
├─────────────────────────────────────────────────────────────────┤
│  • Design er låst                                                │
│  • DESIGN.md og SPEC.md er komplette                             │
│  • FØRST NÅ: Koding starter                                      │
│  • Mappe: .stitch/approved/ (read-only etter godkjenning)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Mappestruktur

```
.stitch/
├── workbench/                          # 🧪 STAGE 1
│   ├── academy-dashboard-2026-04-06/   # Dato-prefix for sortering
│   │   ├── iterations/                 # Flere forsøk
│   │   │   ├── v1-kpi-focus.png
│   │   │   └── v2-fitness-inspired.png
│   │   └── notes.md                    # Tanker underveis
│   └── [neste-feature-YYYY-MM-DD]/
│
├── review/                             # 👀 STAGE 2
│   └── academy-dashboard-final/        # Klar til godkjenning
│       ├── screenshot.png
│       └── DESIGN.md (draft)
│
├── approved/                           # ✅ STAGE 3 (LOCKED)
│   └── academy-dashboard/              # Godkjent design
│       ├── DESIGN.md                   # Komplett design-dok
│       ├── SPEC.md                     # Teknisk spesifikasjon
│       ├── screenshot.png              # Referansebilde
│       └── CHANGELOG.md                # Endringer etter godkjenning
│
├── templates/                          # 📋 Maler
│   ├── DESIGN.md                       # Mal for design-dok
│   └── SPEC.md                         # Mal for tech-spec
│
├── DECISIONS.md                        # 📝 Beslutningslogg
├── WORKFLOW.md                         # 📖 Denne filen
└── README.md                           # Oversikt
```

---

## 🔄 Prosess per Stage

### STAGE 1: Workbench

**Hva skjer:**
- Generere screens i Stitch basert på prompts
- Prøve forskjellige stiler, layouter, farger
- Dokumentere ideer i `notes.md`

**Regler:**
- ✅ Flere varianter er OK
- ✅ Eksperimentere fritt
- ✅ Kopiere fra andre prosjekter som inspirasjon
- ❌ Ingen kode skrives
- ❌ Ikke bruk tid på perfeksjon

**Filnavn-konvensjon:**
```
{feature-navn}-{YYYY-MM-DD}/
  ├── iterations/
  │   ├── v1-{kort-beskrivelse}.png
  │   ├── v2-{kort-beskrivelse}.png
  │   └── v3-{kort-beskrivelse}.png
  └── notes.md
```

---

### STAGE 2: Review

**Hva skjer:**
- Velge én versjon fra workbench
- Flytte til `review/`
- Finjustere detaljer
- Forberede for godkjenning

**Regler:**
- ✅ Én versjon per feature
- ✅ DESIGN.md fylles ut (bruk template)
- ✅ Alle design-tokens dokumentert
- ❌ Fortsatt ingen kode

**Sjekkliste før godkjenning:**
- [ ] Farger definert (hex + CSS variable)
- [ ] Typografi dokumentert
- [ ] Spacing definert
- [ ] Komponenter beskrevet
- [ ] Animasjoner dokumentert
- [ ] Responsive breakpoints beskrevet

---

### STAGE 3: Approved

**Hva skjer:**
- Godkjenning av produkteier/stakeholder
- Flytte fra `review/` til `approved/`
- **Låse designet** (read-only)
- Lage SPEC.md for utviklere

**Regler:**
- ✅ FØRST NÅ kan koding starte
- ✅ DESIGN.md er sannheten
- ✅ Endringer krever ny godkjenning
- ❌ Ingen direkte endringer i kode uten å oppdatere DESIGN.md

**Før koding starter:**
- [ ] SPEC.md er ferdig (bruk template)
- [ ] Komponent-API er definert
- [ ] Data-flyt er dokumentert
- [ ] Test-strategi er klar

---

## 📝 Dokumentasjonskrav

### I Workbench (valgfritt)
- `notes.md` med tanker og ideer
- Screenshots av iterasjoner

### I Review (påkrevd)
- `DESIGN.md` (bruk template fra `.stitch/templates/`)
- Screenshot av design

### I Approved (påkrevd)
- `DESIGN.md` (komplett)
- `SPEC.md` (bruk template)
- `screenshot.png` (høyoppløst)
- `CHANGELOG.md` (hvis endringer etter godkjenning)

---

## 🔀 Git Workflow

### For design-arbeid (Stage 1-2)
```bash
# Egen branch for design
git checkout -b design/academy-dashboard

# Commit screenshots og docs
.gitignore må IKKE ignorere .stitch/ (unntatt workbench hvis ønskelig)
```

### For implementasjon (Stage 3)
```bash
# Ny branch fra main
git checkout -b feat/academy-dashboard-approved

# Implementer basert på .stitch/approved/academy-dashboard/

# PR tittel:
# "feat: implement academy dashboard (.stitch/approved/academy-dashboard)"

# PR beskrivelse skal inneholde:
# - Screenshot av implementasjon
# - Sammenligning med design
# - Sjekkliste mot SPEC.md
```

---

## ⚠️ Viktige Regler

### 1. Aldri kode fra workbench
Hvis designet er i `workbench/`, skal det **aldri** implementeres i kode. Vent til det er i `approved/`.

### 2. DESIGN.md er sannheten
Når design er i `approved/`, er `DESIGN.md` den autoritative kilden. Kode skal matche denne nøyaktig.

### 3. Endringer krever ny prosess
Hvis du oppdager noe som må endres under koding:
1. Ikke endre koden direkte
2. Flytt design tilbake til `review/`
3. Oppdater DESIGN.md
4. Få ny godkjenning
5. Flytt til `approved/`
6. Oppdater koden

### 4. Logg alle beslutninger
Bruk `DECISIONS.md` for å logge:
- Hva ble utforsket
- Hvilke valg som ble vurdert
- Hvorfor en løsning ble valgt

---

## 🚀 Quick Start

### Jeg vil eksperimentere med et nytt design
```bash
mkdir .stitch/workbench/min-feature-$(date +%Y-%m-%d)
# Jobb i Stitch, lag screenshots
# Dokumenter i notes.md
```

### Jeg er klar til å vise frem design
```bash
mkdir .stitch/review/min-feature-final
cp .stitch/templates/DESIGN.md .stitch/review/min-feature-final/
# Fyll ut DESIGN.md
# Legg til screenshot.png
```

### Designet er godkjent, jeg vil kode
```bash
mkdir .stitch/approved/min-feature
cp .stitch/review/min-feature-final/* .stitch/approved/min-feature/
cp .stitch/templates/SPEC.md .stitch/approved/min-feature/
# Fyll ut SPEC.md
# Start koding!
```

---

## ❓ FAQ

**Q: Kan jeg hoppe over workbench og gå rett til approved?**  
A: Nei. Alltid gjennom workbench → review → approved. Dette sikrer sporbarhet.

**Q: Hva hvis jeg finner en bug i designet under koding?**  
A: Stop koding. Flytt til review. Fiks. Ny godkjenning. Fortsett.

**Q: Kan jeg ha flere versjoner i approved?**  
A: Nei. Kun én godkjent versjon. Lag under-mapper hvis du trenger varianter (f.eks. desktop/mobile).

**Q: Hvem kan godkjenne design?**  
A: Produkteier eller design-lead. Dokumenteres i DECISIONS.md.

---

**Sist oppdatert:** 2026-04-06
