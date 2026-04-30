# Notion Import Guide - TrackMan & AI Coach Prosjekt
## Slik importerer du oppgavene til Notion

---

## 📥 STEG 1: Last ned CSV-filen

Filen ligger her:
```
docs/export/notion-import-trackman.csv
```

---

## 📋 STEG 2: Import til Notion

### Alternativ A: Full Database Import (Anbefalt)

1. **Åpne din Notion-database:**
   ```
   https://www.notion.so/akgolfacademy/Software-Prosjekter-...
   ```

2. **Klikk på "..." (mer)** øverst til høyre

3. **Velg "Import" → "CSV"

4. **Last opp filen:** `notion-import-trackman.csv`

5. **Kartlegg kolonner:**
   - Name → Title
   - Status → Status
   - Priority → Select
   - Assigned To → Select
   - Estimated Hours → Number
   - Phase → Select
   - Tags → Multi-select
   - Description → Text

6. **Klikk "Import"

### Alternativ B: Kopier/Paste (Hvis import ikke fungerer)

1. **Opprett nytt prosjekt** i databasen
   - Navn: "TrackMan & AI Coach - Autonomous Development"
   - Type: "AI & Data Feature"

2. **Kopier oppgavene nedenfor** én etter én inn i databasen

---

## 📊 PROSJEKT OVERSIKT (Kopier til Notion)

### Prosjektnavn:
```
TrackMan & AI Coach - Autonomous Development
```

### Beskrivelse:
```
Utvikle verdens beste TrackMan-data visualisering og AI Coach som overgår TrackMan's egen Tracy AI.

MÅL:
- Komplett TrackMan data-analyse med spredningskart, radar-chart, parameter-kort
- AI Coach som kan diagnostisere teknikk og gi personlige treningsplaner
- Range vs Course analyse for å identifisere gap
- Nivå-basert tilgang (Basic/Standard/Advanced/Pro)

RESSURSER:
- Mac Mini M4 (32GB) - Hjemme, kjører 24/7
- MacBook Air M3 (16GB) - Jobb, 10-14t daglig
- Total estimert tid: 7-10 dager
```

### Status: `Not started`
### Prioritet: `High`
### Start dato: `[Settes når du starter]`
### Slutt dato: `[+7-10 dager]`

---

## ✅ OPPGAVER (28 totalt)

### FASE 1: Foundation (6 oppgaver)
| Oppgave | Prioritet | Enhet | Timer |
|---------|-----------|-------|-------|
| Database Schema - TrackMan Sessions | High | Mac Mini M4 | 4 |
| Database Schema - Migrations | High | Mac Mini M4 | 2 |
| TrackMan Parser V2 - Alle parametere | High | Mac Mini M4 | 4 |
| TrackMan Parser V2 - Testing | Medium | Mac Mini M4 | 2 |
| Knowledge Base - TrackMan parametere | High | Mac Mini M4 | 3 |
| Pattern Detection Engine | High | Mac Mini M4 | 4 |

### FASE 2: Visualisering (4 oppgaver)
| Oppgave | Prioritet | Enhet | Timer |
|---------|-----------|-------|-------|
| Dispersion Chart Komponent | High | MacBook Air M3 | 5 |
| Parameter Cards (12 stk) | High | MacBook Air M3 | 4 |
| Technical Radar Chart | Medium | MacBook Air M3 | 3 |
| Ball Flight Visualizer | Medium | MacBook Air M3 | 4 |

### FASE 3: Context (3 oppgaver)
| Oppgave | Prioritet | Enhet | Timer |
|---------|-----------|-------|-------|
| Range vs Course Analysis | High | Mac Mini M4 | 5 |
| Shot Pattern Diagnosis | High | Mac Mini M4 | 4 |
| Data Fusion Layer | Medium | Mac Mini M4 | 3 |

### FASE 4: AI Coach (4 oppgaver)
| Oppgave | Prioritet | Enhet | Timer |
|---------|-----------|-------|-------|
| AI Coach System Prompts | High | MacBook Air M3 | 3 |
| AI Coach Engine Core | High | Mac Mini M4 | 5 |
| Drill Library | Medium | MacBook Air M3 | 3 |
| AI Chat API Backend | High | Mac Mini M4 | 3 |

### FASE 5: UI (3 oppgaver)
| Oppgave | Prioritet | Enhet | Timer |
|---------|-----------|-------|-------|
| TrackMan Dashboard V2 | High | MacBook Air M3 | 5 |
| Detailed Analysis Page | High | MacBook Air M3 | 4 |
| AI Coach Chat UI | High | MacBook Air M3 | 4 |

### FASE 6: Access (2 oppgaver)
| Oppgave | Prioritet | Enhet | Timer |
|---------|-----------|-------|-------|
| Access Control System | Medium | Mac Mini M4 | 4 |
| Premium Gates | Medium | MacBook Air M3 | 3 |

### FASE 7: Testing & Polish (6 oppgaver)
| Oppgave | Prioritet | Enhet | Timer |
|---------|-----------|-------|-------|
| Unit Tests - Parser | Medium | Mac Mini M4 | 3 |
| Unit Tests - Analysis | Medium | Mac Mini M4 | 3 |
| Unit Tests - AI Coach | Medium | Mac Mini M4 | 3 |
| Error Handling & Fallbacks | Medium | MacBook Air M3 | 2 |
| Performance Optimization | Low | Mac Mini M4 | 3 |
| Documentation | Low | MacBook Air M3 | 2 |

---

## 🏷️ TAGS (Sett opp i Notion)

Opprett disse som Multi-select:

```
Database
Prisma
Parser
CSV
AI
Knowledge
Algorithm
Analysis
UI
Charts
Recharts
Animation
Integration
Backend
Prompts
Content
Dashboard
Page
Navigation
Chat
Components
Auth
Permissions
Freemium
Testing
Quality
ErrorHandling
UX
Performance
Optimization
Documentation
```

---

## 👤 ASSIGNED TO (Sett opp i Notion)

Opprett disse som Select:

```
Mac Mini M4
MacBook Air M3
```

---

## 📅 PHASES (Sett opp i Notion)

Opprett disse som Select:

```
1 - Foundation
2 - Visualisering
3 - Context
4 - AI Coach
5 - UI
6 - Access
7 - Testing
```

---

## 📊 STATUS (Sett opp i Notion)

Opprett disse som Status (hvis tilgjengelig) eller Select:

```
Not started
In progress
In review
Blocked
Completed
```

---

## 🔄 SYNC MED KIMI CODE

Når oppgavene er i Notion:

1. **Kopier oppgave-beskrivelse** fra Notion
2. **Lim inn i Kimi Code** som instruksjon
3. **Kjør autonom modus**
4. **Oppdater Notion** når oppgaven er ferdig

---

## 📁 FILER REFERANSE

Disse filene har all informasjon:

```
docs/strategy/
├── AUTONOMOUS_AI_PLAN.md        ← Hovedplan med 28 oppgaver
├── TRACKMAN_KNOWLEDGE_BASE.md   ← Teknisk dokumentasjon
├── TRACKMAN_VISUALIZATION_PLAN.md
└── REALISTIC_TIMELINE.md        ← Tidsanslag

docs/export/
└── notion-import-trackman.csv   ← Import-fil
```

---

## 🚀 NESTE STEG

1. ✅ Importer CSV til Notion
2. ✅ Sett opp tags, assigned to, phases
3. ✅ Legg til prosjekt-beskrivelse
4. ✅ Start med første oppgave (Database Schema)
5. ✅ Kjør Kimi Code i autonom modus

---

**Har du spørsmål om importen? Spør meg!**
