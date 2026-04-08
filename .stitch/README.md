# 🎨 .stitch/ - Design Workspace

> **Isolert design-utforskning uten å påvirke produksjonskode.**

Dette mappesystemet lar designere og utviklere eksperimentere, iterere og perfeksjonere UI-design **før** det implementeres i kode.

---

## 📁 Struktur

```
.stitch/
├── workbench/              # 🧪 STAGE 1: Eksperimenter
│   └── [feature-dato]/     #    Mappe per feature
│       ├── iterations/     #    Flere forsøk
│       └── notes.md        #    Tanker underveis
│
├── review/                 # 👀 STAGE 2: Vurdering
│   └── [feature-final]/    #    Klar til godkjenning
│       ├── DESIGN.md       #    Design-dokumentasjon
│       └── screenshot.png  #    Referansebilde
│
├── approved/               # ✅ STAGE 3: Godkjent (LÅST)
│   └── [feature]/          #    Klar til koding
│       ├── DESIGN.md       #    Komplett design
│       ├── SPEC.md         #    Teknisk spec
│       ├── screenshot.png  #    Referanse
│       └── CHANGELOG.md    #    Endringer
│
├── templates/              # 📋 Maler
│   ├── DESIGN.md           #    Mal for design
│   └── SPEC.md             #    Mal for spec
│
├── DECISIONS.md            # 📝 Beslutningslogg
├── WORKFLOW.md             # 📖 Prosess-dokumentasjon
├── WIREFRAMING-PLAN.md     # 📋 Plan for alle skjermer
├── PROGRESS.md             # 📊 Sanntids fremdrift
├── QUICKSTART.md           # 🚀 Kom-i-gang guide
└── README.md               # 📖 Denne filen
```

---

## 🚀 Kom i gang (velg din vei)

### 🆕 Jeg er ny her
1. Les [`QUICKSTART.md`](./QUICKSTART.md) (5 min)
2. Les [`WORKFLOW.md`](./WORKFLOW.md) (10 min)
3. Sjekk [`WIREFRAMING-PLAN.md`](./WIREFRAMING-PLAN.md) for hva som skal designes

### 🎨 Jeg vil designe
1. Finn siden i [`WIREFRAMING-PLAN.md`](./WIREFRAMING-PLAN.md)
2. Sjekk status i [`PROGRESS.md`](./PROGRESS.md)
3. Lag mappe i `workbench/` og eksperimenter i Stitch

### 💻 Jeg vil kode
1. Sjekk [`PROGRESS.md`](./PROGRESS.md) for godkjente design
2. Finn design i `approved/`
3. Les `SPEC.md` for tekniske detaljer

### 👀 Jeg vil reviewe
1. Sjekk `review/` mappen
2. Les `DESIGN.md` i review-mappen
3. Godkjenn eller be om endringer
4. Oppdater [`DECISIONS.md`](./DECISIONS.md)

---

## 📋 Alle dokumenter

| Fil | Type | Beskrivelse |
|-----|------|-------------|
| `QUICKSTART.md` | Guide | Kom i gang på 5 minutter |
| `WORKFLOW.md` | Prosess | Detaljert arbeidsflyt |
| `WIREFRAMING-PLAN.md` | Plan | Alle 34 skjermer prioritert |
| `PROGRESS.md` | Status | Sanntidsoversikt |
| `DECISIONS.md` | Logg | Alle design-valg |
| `DESIGN.md` (root) | System | Globalt design system |
| `templates/DESIGN.md` | Mal | Kopier til review/approved |
| `templates/SPEC.md` | Mal | Kopier til approved |

---

## 🎯 De 3 Stadiene

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1: WORKBENCH     │  STAGE 2: REVIEW   │  STAGE 3: APPROVED │
│  🧪 Eksperimenter       │  👀 Vurdering      │  ✅ Låst design    │
│                         │                    │                    │
│  • Prøv ideer fritt     │  • Én versjon      │  • Kode kan starte │
│  • Flere varianter OK   │  • Finjuster       │  • Read-only       │
│  • Ingen kode           │  • Ingen kode      │  • Spec ferdig     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Status oversikt

**Siste oppdatering:** 2026-04-06

| Fase | Totalt | Påbegynt | Godkjent | Implementert |
|------|--------|----------|----------|--------------|
| Fase 1 (Kjerne) | 19 | 1 | 0 | 0 |
| Fase 2 (Forbedret) | 9 | 0 | 0 | 0 |
| Fase 3 (Avansert) | 6 | 0 | 0 | 0 |
| **Totalt** | **34** | **1** | **0** | **0** |

Se [`PROGRESS.md`](./PROGRESS.md) for detaljer.

---

## ⚠️ Viktige regler

- ✅ **Workbench:** Eksperimenter fritt
- ✅ **Review:** Dokumenter før godkjenning
- ✅ **Approved:** Komplett dokumentasjon
- ❌ **Aldri kode fra workbench/**
- ❌ **Kun kode fra approved/**
- ❌ **Godkjente design endres ikke uten ny prosess**

---

**Spørsmål?** Se [`WORKFLOW.md`](./WORKFLOW.md) eller spør i teamet.
