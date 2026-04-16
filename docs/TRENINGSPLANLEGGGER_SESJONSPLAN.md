# Treningsplanlegger — Sesjonsplan
## Fullføre Notion Calendar-lignende UI med drag & drop

**Dato:** April 2026  
**Varighet:** 1 arbeidsøkt (4-6 timer)  
**Mål:** Ferdigstille kjernefunksjonalitet i treningsplanleggeren

---

## KONTEKST

### Hva finnes allerede
- ✅ Backend: 100% operativt (CRUD, logging, AI-generering)
- ✅ page.tsx med view-switcher (calendar/viewer)
- ✅ actions.ts med alle server actions
- ✅ TrainingPlanViewer (lesemodus)
- ✅ TrainingPlannerV2 (71KB — påbegynt)
- ✅ Dagbok/Treningslogg integrering

### Hva mangler for MVP
- ❌ Drag & drop mellom dager
- ❌ Sidemeny med øvelsesbank
- ❌ Treningspyramide-filter
- ❌ Standard økter (templates)
- ❌ Flytte økter mellom uker
- ❌ Fullføre/redigere økter inline

---

## FASE 1: Refactor & Arkitektur (1 time)

### 1.1 Splitte treningsplan-v2-client.tsx
**Problem:** Filen er 71KB — for stor og uoversiktlig

**Løsning:** Splitte i moduler:
```
components/portal/treningsplan/
├── TrainingPlannerContainer.tsx    # Hoved-komponent
├── WeekCalendar.tsx                # Uke-kalender grid
├── DayColumn.tsx                   # Enkel dag-kolonne
├── SessionCard.tsx                 # Økt-kort (drag & drop)
├── SidePanel.tsx                   # Sidemeny med øvelser
├── ExerciseBank.tsx                # Øvelsesbank med filter
├── PyramidFilter.tsx               # Treningspyramide filter
├── StandardSessions.tsx            # Standard økter
├── SessionDetailModal.tsx          # Detalj/redigering modal
└── useDragAndDrop.ts               # Drag & drop logikk
```

**Oppgaver:**
- [ ] 1.1.1 Lage mappen `components/portal/treningsplan/`
- [ ] 1.1.2 Ekstrahere SessionCard-komponent
- [ ] 1.1.3 Ekstrahere WeekCalendar-komponent
- [ ] 1.1.4 Ekstrahere SidePanel-komponent
- [ ] 1.1.5 Oppdatere imports i page.tsx

---

## FASE 2: Drag & Drop (1.5 timer)

### 2.1 Implementere @dnd-kit
**Mål:** Full drag & drop funksjonalitet

**Oppgaver:**
- [ ] 2.1.1 Installere `@dnd-kit/core`, `@dnd-kit/sortable`
- [ ] 2.1.2 Lage `DndContext` wrapper i TrainingPlannerContainer
- [ ] 2.1.3 Gjøre SessionCard draggable
- [ ] 2.1.4 Gjøre DayColumn droppable
- [ ] 2.1.5 Håndtere `onDragEnd` — flytte økt til ny dag/tid
- [ ] 2.1.6 Kalle `moveSessionToDay` action ved drop
- [ ] 2.1.7 Visuell feedback under dragging (ghost, highlight)

**Akseptansekriterier:**
- Bruker kan dra økt fra én dag til en annen
- Bruker kan dra økt til nytt tidspunkt samme dag
- Økt persisteres i database etter flytting
- Smooth animasjon (300ms ease)

---

## FASE 3: Sidemeny & Øvelsesbank (1.5 timer)

### 3.1 Lage SidePanel-komponent
**Mål:** Notion-lignende sidemeny

**Oppgaver:**
- [ ] 3.1.1 Lage SidePanel layout (fast bredde 320px)
- [ ] 3.1.2 Seksjon: "Standard Økter" (6 forhåndsdefinerte)
- [ ] 3.1.3 Seksjon: "Favoritt Øvelser" (hent fra DB)
- [ ] 3.1.4 Seksjon: "Treningspyramiden" (visuell)
- [ ] 3.1.5 Seksjon: "Hurtigfilter" (knapper per kategori)
- [ ] 3.1.6 Drag & drop fra sidemeny til kalender

### 3.2 Treningspyramide-filter
**Oppgaver:**
- [ ] 3.2.1 Vise 5 nivåer: FYS, TEK, SLAG, SPILL, TURN
- [ ] 3.2.2 Horisontal bar per nivå (progress)
- [ ] 3.2.3 Klikk på nivå filtrerer øvelser
- [ ] 3.2.4 Fargekoding: FYS (blå), TEK (grønn), SLAG (gul), SPILL (oransje), TURN (rød)

### 3.3 Standard Økter
**Forhåndsdefinerte templates:**
| Navn | Varighet | Fokus | Øvelser |
|------|----------|-------|---------|
| Putting-drill | 20 min | TEK | Gate drill, Clock drill |
| Short game | 30 min | SLAG | Chip-and-run, Bunker |
| Driving range | 45 min | SLAG | Fade/draw, Distance |
| Styrke-økt | 50 min | FYS | Kjerne, Mobilitet |
| Spill 9 hull | 120 min | SPILL | On-course, Scoring |
| Svinganalyse | 40 min | TEK | Video, Impact |

---

## FASE 4: SessionCard Forbedringer (1 time)

### 4.1 Forbedre visning
**Nåværende:** Enkel tittel
**Mål:** Informativt kort

**Oppgaver:**
- [ ] 4.1.1 Vise tittel, varighet, fokusområde
- [ ] 4.1.2 Fargekoding etter pyramide-nivå
- [ ] 4.1.3 Vise antall øvelser (badge)
- [ ] 4.1.4 Vise completed-status (checkmark)
- [ ] 4.1.5 Drag handle ikon
- [ ] 4.1.6 Menu (tre prikker) med: Rediger, Dupliser, Slett

### 4.2 Inline redigering
**Oppgaver:**
- [ ] 4.2.1 Klikk på kort åpner SessionDetailModal
- [ ] 4.2.2 Redigere tittel, varighet, fokus
- [ ] 4.2.3 Legge til/fjerne øvelser
- [ ] 4.2.4 Lagre endringer (kall updateSessionTime)

---

## FASE 5: Kalender-forbedringer (1 time)

### 5.1 WeekCalendar polish
**Oppgaver:**
- [ ] 5.1.1 Uke-navigasjon (forrige/neste uke)
- [ ] 5.1.2 Vise ukenummer og datoer
- [ ] 5.1.3 Marker dagens dato
- [ ] 5.1.4 Tidsindikator (rød linje på nåværende tid)
- [ ] 5.1.5 Tom-dag plassholder ("Dra økt hit")
- [ ] 5.1.6 Scroll til 07:00 som standard

### 5.2 Tomme dager
**Oppgaver:**
- [ ] 5.2.1 Vise "+ Legg til økt" knapp på tomme dager
- [ ] 5.2.2 Klikk åpner "Ny økt" modal
- [ ] 5.2.3 Velge fra standard økter eller custom

---

## FASE 6: Integrasjon & Testing (0.5-1 time)

### 6.1 Koble til eksisterende data
**Oppgaver:**
- [ ] 6.1.1 Verifisere at alle actions fungerer
- [ ] 6.1.2 Teste drag & drop med reell data
- [ ] 6.1.3 Teste logging av økt
- [ ] 6.1.4 Teste plan-oppdatering

### 6.2 Edge cases
**Teste:**
- [ ] 6.2.1 Flytte økt til tid som overlapper med annen økt
- [ ] 6.2.2 Slette økt som er logget
- [ ] 6.2.3 Drag & drop på mobil (touch)
- [ ] 6.2.4 Tom kalender (ingen plan)

---

## LEVERANSE-KRITERIER

### MVP Ferdig når:
1. ✅ Bruker kan se uke-kalender med egne økter
2. ✅ Bruker kan dra økter mellom dager
3. ✅ Bruker kan opprette ny økt fra standard templates
4. ✅ Bruker kan redigere eksisterende økt
5. ✅ Bruker kan filtrere øvelser etter treningspyramide
6. ✅ Endringer persisteres til database
7. ✅ Logging fungerer (koblet til dagbok)

### Nice-to-have (hvis tid):
- Månedsvisning (komprimert)
- Dagvisning (detaljert)
- AI-forslag til justeringer
- Drag & drop av enkeltøvelser (ikke bare hele økter)

---

## FIL-STRUKTUR (etter refactor)

```
app/portal/(dashboard)/treningsplan/
├── page.tsx                          # Server component (eksisterende)
├── actions.ts                        # Server actions (eksisterende)
├── loading.tsx                       # (eksisterende)
├── error.tsx                         # (eksisterende)
├── layout.tsx                        # Wrapper med DndContext
├── [sessionId]/                      # (eksisterende)
│
components/portal/treningsplan/
├── TrainingPlannerContainer.tsx      # Hoved-komponent
├── WeekCalendar.tsx                  # Uke-visning
├── DayColumn.tsx                     # Dag-kolonne
├── SessionCard.tsx                   # Økt-kort (draggable)
├── SessionDetailModal.tsx            # Redigering modal
├── SidePanel.tsx                     # Sidemeny container
├── ExerciseBank.tsx                  # Øvelsesbank
├── PyramidFilter.tsx                 # Treningspyramide
├── StandardSessions.tsx              # Standard økter
├── NewSessionModal.tsx               # Ny økt modal
├── useDragAndDrop.ts                 # DnD logikk hook
└── types.ts                          # TypeScript typer
```

---

## TEKNISKE AVHENGIGHETER

### Installere:
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Endre i page.tsx:
```typescript
// Fra
<TrainingPlannerV2 ... />

// Til
<TrainingPlannerContainer ... />
```

---

## DESIGN-REFERANSE

### Farger (fra design-system):
- Bakgrunn: `#0F172A` (dark)
- Kort: `#1E293B`
- FYS: `#3B82F6` (blå)
- TEK: `#16A34A` (grønn)
- SLAG: `#D4AF37` (gul/gull)
- SPILL: `#F97316` (oransje)
- TURN: `#EF4444` (rød)

### Spacing:
- Kalender grid gap: 8px
- Kort padding: 16px
- Sidemeny bredde: 320px

---

## NESTE STEG (etter denne sesjonen)

1. **AI-genererte justeringer** — Analysere logget data og foreslå endringer
2. **Treningsanalyse-side** — Dashboard med grafer og trender
3. **Mission Board integrasjon** — Coach kan se og justere planer
4. **Notifikasjoner** — Påminnelse om planlagte økter

---

**Klar til å starte?** Velg en fase, så begynner vi! 🚀
