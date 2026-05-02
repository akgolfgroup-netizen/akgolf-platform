# Gap-analyse — 1.3.4 Dagbok mot Brand Guide V2.0

**Dato:** 2026-05-02
**Referanse:** [`public/design-reference/handoff-2026-04-27/screens/dagbok.html`](../../public/design-reference/handoff-2026-04-27/screens/dagbok.html)
**Rute:** `/portal/dagbok`
**Konklusjon (TL;DR):** **Juster — IKKE Rewrite.** En komplett v2-implementasjon eksisterer allerede under [`components/portal/dagbok/v2/`](../../components/portal/dagbok/v2/). Den følger BG V2.0-strukturen i hovedsak, men har 6 mindre gap mot referansen. Estimat: **0,5–1 dag** (small/medium).

---

## 1. UI-seksjoner i referansen (`dagbok.html`)

| # | Seksjon | Detaljer i mockup |
|---|---|---|
| **A** | Topbar | Tittel «Dagbok» + sub «Volum, streak og konsistens · siste 90 dager». Høyre: completion-pill (grønn dot + «92% fullført»), `btn-outline` «Eksporter», `btn-accent` «+ Logg økt» |
| **B** | Hero-grid (1.4fr / 1fr) | To-kolonne |
| **B1** | Hero left: Streak | Mørk gradient `linear-gradient(135deg, #0A1F18, #12302B)`. Mono-eyebrow `◎ STREAK · AKTIV` i lime. Stor `<h2>41 dager</h2>` (44px Inter Tight, «dager» i lime 30px). Sub-tekst om forrige rekord + neste milepæl. 3 inline stats (ØKTER 90D, TIMER 90D, RUNDER 90D) — hver med `+X%` delta i lime |
| **B2** | Hero right: Milepæler 2026 | Hvitt kort. Tittel + sub `MÅL · 400 ØKTER · 52 RUNDER`. SVG-graf (trajectory dashed lime + actual solid green + dot på «I DAG»-punkt + JAN/FEB/MAR/APR/MAI x-axis + label `210 ØKTER · I DAG`). Tre stats under: FULLFØRT %, ETTER PLAN +6%, ETA dato |
| **C** | Heatmap-kort | Tittel «Heatmap · 90 dager» + sub `MIN → 0 TIMER · MAKS → 4.5 TIMER`. Legenden «Mindre [□][□][□][□][■] Mer» øverst høyre. 7 rader (MAN–SØN) × 14 uker = 98 celler. Måneds-labels FEB/MAR/APR over kolonnene. Søndager = «rest»-celler med stiplet ramme om ingen aktivitet |
| **D** | Volum-grid (3 kolonner) | Tre hvite kort |
| **D1** | Pyramide-volum 30d | 5 nivåer (Turnering/Spill/Slag/Teknikk/Fysisk) som horisontale barer i grønn-gradient (`#0A1F18` → `#B8D9BF`). Hvert nivå har label, % bar og verdi. **AI-tip-boks under** med lilla `#FAF5FF` bg + `#6B21A8` tekst: `AI: Øk Teknikk med +4% for bedre chip-prestasjon.` |
| **D2** | Ukentlig timer | SVG bar-chart 8 uker (U10–U17). Mål-linje 10t i lime stiplet. Bar-farger varierer: under mål = `#B8D9BF`, akkurat på mål = `#7FB88F`, over mål = `#2A7D5A`. Sub-tekst: `Snitt: 11.4 t/uke · peak uke 16 · +14% QoQ` |
| **D3** | Typefordeling 30d | Donut SVG (5 segmenter: Range/Short/Spill/Fys/Annet) med totalt antall økter i sentrum. 2-kolonne legende under |
| **E** | Timeline «Siste økter» | Hvitt kort. Tittel + dato-range mono. Liste av 5 økter. Hver rad: dato-kolonne (10px mono dato + bold ukedag), runde dot (lime/lilla `#AF52DE`/svart=runde), kort med tittel, metrics-tekst og tags i mono |

---

## 2. Nåværende implementasjon

**Live route ([app/portal/(dashboard)/dagbok/page.tsx](../../app/portal/(dashboard)/dagbok/page.tsx)) bruker kun `DagbokV2Client`.**

### Aktive filer

| Fil | Linjer | Status |
|---|---|---|
| [`app/portal/(dashboard)/dagbok/page.tsx`](../../app/portal/(dashboard)/dagbok/page.tsx) | 119 | ✅ Server-side data-loading: `getTrainingLogs`, `getLoggedSessionIds`, `getLastSession`, `getActivePlan`. Beregner streak inline. |
| [`app/portal/(dashboard)/dagbok/actions.ts`](../../app/portal/(dashboard)/dagbok/actions.ts) | 553 | ✅ Server actions: `logSession`, `getTrainingLogs`, `deleteTrainingLog`, etc. |
| [`components/portal/dagbok/v2/dagbok-v2-client.tsx`](../../components/portal/dagbok/v2/dagbok-v2-client.tsx) | 214 | ✅ Orchestrator |
| [`components/portal/dagbok/v2/hero-streak.tsx`](../../components/portal/dagbok/v2/hero-streak.tsx) | 68 | ✅ Hero-left |
| [`components/portal/dagbok/v2/milestone-card.tsx`](../../components/portal/dagbok/v2/milestone-card.tsx) | 86 | ✅ Hero-right (med SVG-graf) |
| [`components/portal/dagbok/v2/heatmap-90d.tsx`](../../components/portal/dagbok/v2/heatmap-90d.tsx) | 94 | ✅ Heatmap |
| [`components/portal/dagbok/v2/volume-cards.tsx`](../../components/portal/dagbok/v2/volume-cards.tsx) | 106 | ✅ 3-kort grid |
| [`components/portal/dagbok/v2/timeline-list.tsx`](../../components/portal/dagbok/v2/timeline-list.tsx) | 94 | ✅ Timeline |

### Død kode (ikke importert av page.tsx)

| Fil | Status |
|---|---|
| `app/portal/(dashboard)/dagbok/dagbok-client.tsx` | DEAD — bruker bare `LogSessionModal` + `PlanProgressTracker` |
| `app/portal/(dashboard)/dagbok/training-diary-client.tsx` | DEAD — bruker 8 legacy-komponenter |
| `app/portal/(dashboard)/dagbok/dagbok-calendar.tsx` | DEAD |
| `app/portal/(dashboard)/dagbok/dagbok-stats.tsx` | DEAD |
| `components/portal/dagbok/{activity-heatmap,month-calendar,plan-progress-tracker,quick-log-grid,recent-sessions-list,streak-card,volume-pyramid,weekly-stats,log-session-modal}.tsx` | DEAD — kun referert av legacy-clients |

**Slett-kandidat:** ~13 filer kan fjernes. Hører hjemme i Tier 3-rydding (separat oppgave eller del av denne).

---

## 3. Gap-tabell pr. seksjon

| # | Seksjon | Status | Gap | Tiltak |
|---|---|---|---|---|
| **A** | Topbar | 🟡 Juster | Topbar er custom, bruker ikke `PageHead`-komponent. OK siden portal har egen topbar-pattern, men eyebrow-mono mangler. Completion-pill fungerer | Vurder å rette eyebrow-stil til BG V2.0 mono-pattern (lavt prio) |
| **B1** | Hero Streak | 🟡 Juster | Mangler **+X% delta** på alle 3 stats (mockup viser `78 +12%`, `104 +8%`, `14 +3`). Bare verdien rendres i dag | Beregn delta vs. forrige 90d-periode i `dagbok-v2-client.tsx`, vis som lime-tekst etter verdi |
| **B2** | Milestone Card | 🟡 Juster | Mangler **ETA-stat** (mockup: `ETA · 14. nov`). I dag har vi kun FULLFØRT% og ETTER PLAN | Beregn ETA basert på dagens tempo og legg til som tredje stat |
| **C** | Heatmap | 🟡 Juster | (a) Mangler **måneds-labels** (FEB/MAR/APR) over kolonnene. (b) Mangler **«rest»-celler** (stiplet ramme på søndager uten aktivitet — visuell rytme) | Legg til måneds-row + rest-styling i `heatmap-90d.tsx` |
| **D1** | Pyramide-volum | 🟠 Juster (innhold) | (a) Bar-fargene matcher ikke green-gradient i mockup. Bruker design-tokens som ikke gir riktig hierarki. (b) Mangler **AI-tip-boks** (lilla `#FAF5FF` bg + `#6B21A8` tekst) | Hardkode green-gradient `[#0A1F18, #005840, #2A7D5A, #7FB88F, #B8D9BF]` på 5 nivåer. Legg til AI-tip-blokk under (foreløpig statisk eller fra ny `getDagbokAIInsight()`-action) |
| **D2** | Ukentlig timer | 🟢 Juster (mindre) | (a) Mangler **mål-linje** ved 10t (stiplet lime). (b) Mangler **peak/QoQ** i sub-tekst | Legg til SVG-mål-linje + beregn peak-uke + QoQ-delta |
| **D3** | Typefordeling | 🔴 Rebuild | Bruker ikke donut SVG — kun stort tall i senter. Mockup har 5-segments donut med `stroke-dasharray` rotasjon | Erstatt med ekte donut SVG (samme pattern som `mockup`) |
| **E** | Timeline | 🟢 Juster (mindre) | Layout matcher. Variant-dotter matcher (default lime, chip lilla, round svart). Tags rendres OK | Sjekk at meta-tekst-formatering matcher mockup-eksempler |

**Sammendrag:** 1 rebuild (D3 donut), 6 polish-tiltak (A delvis, B1, B2, C, D1, D2), 1 OK-with-minor (E).

---

## 4. Data og avhengigheter

### Prisma-modeller i bruk

| Modell | Hvor |
|---|---|
| `TrainingLog` (id, date, durationMinutes, focusArea, notes, rating, deviatedFromPlan, deviationReason) | `getTrainingLogs()` |
| `TrainingPlanSession` | join via `getTrainingLogs()` |
| `TrainingPlan` + `TrainingPlanWeek` | `getActivePlan()` for plan-progress |
| `Achievement` | `checkAchievements()` på logging |

### Server actions ([dagbok/actions.ts](../../app/portal/(dashboard)/dagbok/actions.ts))

| Action | Bruk |
|---|---|
| `getTrainingLogs(month?)` | Henter logs (default måned, men kan ta dato) |
| `getLoggedSessionIds()` | For å vise hvilke plan-sessions som er logget |
| `getLastSession()` | Brukes i streak-beregning |
| `logSession(input)` | Skriver ny TrainingLog |
| `deleteTrainingLog(id)` | Slett |
| `updateTrainingLog(id, input)` | Rediger |

**Manglende data for full BG V2.0-paritet:**
- Pre-90d sammenligning (delta-prosenter for B1) — kan beregnes ved å hente forrige 90 dager
- Type-distribusjon-buckets (Range/Short/Spill/Fys/Annet) — finnes i `pyramid` allerede, men trenger riktig kategorisering for D3-donut
- AI-insight (D1 lilla boks) — krever ny action eller statisk placeholder
- ETA for milepæl (B2) — kan beregnes lokalt fra `currentSessions`/dato

Ingen Prisma-skjema-endringer nødvendig.

---

## 5. Coachhq-dark / shared primitiver — gjenbruk

`components/portal/dagbok/v2/` bruker direkte Tailwind/CSS-tokens, ikke `coachhq-dark/` (som er admin-only). Det er korrekt — portal-flater skal bruke design-tokens fra `app/globals.css` direkte.

**Eksisterende portal-tokens i bruk (riktig):**
- `bg-card`, `bg-surface`, `bg-surface-soft`
- `border-line`, `border-line-soft`
- `text-ink`, `text-ink-muted`, `text-ink-subtle`
- `bg-accent`, `bg-success`, `bg-primary-soft`
- `var(--font-inter-tight)`, `var(--color-accent)`, `var(--color-success)`

**Tokens som kan trenge tillegg eller verifisering:**
- Heatmap-nivå-fargene `#A5CDB1`, `#5B9B72`, `#2A7D5A` er hardkodet — vurder om disse skal registreres som tokens i `globals.css` (`--color-heatmap-l1..l4`) eller forbli inline
- AI-insight lilla bg `#FAF5FF` + tekst `#6B21A8` — finnes ikke som tokens. Hardkode inline (mockup gjør det samme)

---

## 6. Estimat

| Tiltak | Estimat |
|---|---|
| B1 — delta-prosenter på hero-stats | 1 t |
| B2 — ETA-stat | 30 min |
| C — måneds-labels + rest-celler i heatmap | 1 t |
| D1 — green-gradient pyramide + AI-tip-boks | 1,5 t |
| D2 — mål-linje + peak/QoQ-tekst | 30 min |
| D3 — rebuild typefordeling som ekte donut | 1,5 t |
| E — minor formatting | 15 min |
| Slett død kode (13 filer) | 30 min (kan utsettes) |
| Visuell verifisering + commit | 30 min |
| **Totalt (ekskl. rydding)** | **~6,5 timer (1 dag)** |

**Scope:** Small/Medium — 1 ny rebuild (donut), 5 polish-iterasjoner, ingen schema-endringer, ingen nye server actions.

---

## 7. Anbefalt rekkefølge

1. **D3 donut-rebuild** (mest synlig endring, gjør først)
2. **D1 pyramide-gradient + AI-tip** (visuelt impactful)
3. **C heatmap-polish** (måneds-labels + rest-celler)
4. **B1 delta-prosenter** (krever data-beregning, kan parallelliseres)
5. **B2 ETA-stat**
6. **D2 mål-linje + sub-tekst**
7. **E timeline minor**
8. **Visuell verifisering** mot mockup, screenshot
9. **(Valgfritt) Slett 13 dead-code filer** — eller utsett til neste Tier 3-rydding

---

## 8. Avhengigheter

- Ingen blockere
- Server actions er på plass
- Data-modell er på plass
- Design-tokens er på plass

**Klar til implementering.**
