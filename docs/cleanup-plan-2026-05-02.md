# Ryddeplan — components/ (2026-05-02)

> Bygger på import-audit. Tier 1 utført 2026-05-02 (commit `4167e8b`).
> Tier 2 re-auditert med transitive sibling-deps (2026-05-02).
> Hver tier krever eksplisitt godkjenning før utførelse.

## Re-audit 2026-05-02 — korrigert metode (utført)

Den opprinnelige Tier 2-tabellen telte kun **eksterne** importer per fil, ikke **transitive** sibling-avhengigheter. Korrigert metode (forsøk 1) fanget kun 1-hopps deps. Endelig metode: full BFS-traversal av `./relative` import-grafen fra hver entry-point, gjennom alle hopp.

**Endelig resultat Tier 2:** kun **6 filer** ble reelt slettet (ikke ~30, ikke 11).

| Fil | Status | Kommentar |
|---|---|---|
| `portal/playerhq/IconRail.tsx` | ✅ Slettet 2026-05-02 | Reelt død, ingen importerer |
| `portal/booking/booking-hover-card.tsx` | ✅ Slettet 2026-05-02 | Erstattet av `bookinger/v2/` |
| `portal/booking/next-booking-hero.tsx` | ✅ Slettet 2026-05-02 | Erstattet av `bookinger/v2/` |
| `portal/booking/upcoming-booking-card.tsx` | ✅ Slettet 2026-05-02 | Erstattet av `bookinger/v2/` |
| `portal/booking/past-booking-list.tsx` | ✅ Slettet 2026-05-02 | Erstattet av `bookinger/v2/` |
| `portal/booking/cancellation-rules-card.tsx` | ✅ Slettet 2026-05-02 | Erstattet av `bookinger/v2/` |

**Component-library.md:** 5 booking-oppføringer fjernet samtidig (linje 71-75).

### Tier 2-kandidater som vise seg å være I BRUK (ikke slettet)

Følgende filer ble i tidligere audit feilaktig markert som døde, men er **transitivt i bruk** via 2+ hopps sibling-import-kjeder:

| Fil | Bruks-kjede |
|---|---|
| `treningsplan-v2/session-pill.tsx` | `week-strip` (entry) → `day-card` → `session-pill` |
| `trening/v2/drill-card.tsx` | `training-client` (entry) → `category-section` → `drill-card` |
| `trening/v2/category-section.tsx` | `training-client` (entry) → `category-section` |
| `playerhq/playerhq-nav-config.ts` | `PlayerHQSidebar` (entry) → `NameList` → `playerhq-nav-config` |
| `training/analysis-filter-types.ts` | `analysis-filter-bar` (entry) → `analysis-filter-controls` → `analysis-filter-types` |
| `trackman-v2/{kpi-row,filter-bar,shots-table}.tsx` | `trackman-v2-client` (entry) → alle 3 søsken |
| `treningsplan-v2/{day-card,types}.ts(x)` | `week-strip` (entry) → `day-card`/`types` |
| `round/{hole-map,club-suggester,map-overlay-layers}.tsx` | `round-map-mode` (entry) → `hole-map` → `map-overlay-layers`; `round-map-mode` → `club-suggester` |
| `training/{analysis-filter-controls,analysis-results,analysis-trend-chart}.tsx` | I bruk via entry-points |
| `trening/v2/{training-hero,category-tabs,log-session-bar}.tsx` | `training-client` (entry) → alle 3 |
| `playerhq/{NameList,hero,row-one,row-two}.tsx` | Entries `PlayerHQSidebar` og `player-hq-dashboard` → alle 4 |

### Audit-metode fremover

For all senere ryddearbeid: **bruk `madge` eller full BFS-traversal** av import-grafen, ikke 1-hopps grep-baserte sjekker. Eksempel:

```bash
npx madge --circular --extensions ts,tsx components/
npx madge --image graph.svg --extensions ts,tsx app/portal/
```

Dette ville fanget alle transitive deps i én operasjon og spart oss for re-audit-iterasjonene over.

| Mappe | Filer | I bruk (transitivt) | Trygt å slette | Bemerkning |
|---|---|---|---|---|
| `trackman-v2/` | 4 | 4 | 0 | `trackman-v2-client` bruker alle 3 søsken |
| `treningsplan-v2/` | 4 | 3 | 1 | `session-pill.tsx` |
| `round/` | 4 | 4 | 0 | `round-map-mode` → `hole-map` → `map-overlay-layers`; `round-map-mode` → `club-suggester` |
| `training/` | 5 | 4 | 1 (verifiser) | `analysis-filter-types.ts` — sjekk barrel-export |
| `trening/` | 6 | 4 | 2 | `drill-card.tsx`, `category-section.tsx` |
| `playerhq/` | 8 | 6 | 2 | `IconRail.tsx`, `playerhq-nav-config.ts` |
| `booking/` | 9 | 4 | 5 (verifiser) | 5 filer er dokumentert i `component-library.md` men ikke importert — krever manuell beslutning |
| `min-plan/` | 10 | 10 | 0 | Bekreftet helt i bruk (transitive deps inni `v2/`) |

**Endring fra opprinnelig plan:** Tidligere lå `min-plan/` i Tier 2 som "9 av 10 dødt". Det var feil — entry-fil importerer 9 søsken transitivt. Mappen er nå merket helt i bruk.

---

## TIER 1 — Trygt å slette (DEAD, 0 importer)

Disse mappene har **null importer** fra produksjonskoden og inneholder kun mock-data eller forlatte prototyper.

| Mappe | Filer | Status | Innhold |
|---|---|---|---|
| `components/portal/playerhq-360/` | 8 | DEAD | Hero/shell/sub-nav/sections — full prototyp, ikke koblet inn |
| `components/admin/dagens-fokus/` | 8 | DEAD | Inneholder `mock-data.ts` — route bruker inline `dagens-fokus-client.tsx` |
| `components/admin/focus/` | 6 | DEAD | Inneholder `mock-data.ts` — route bruker `focus-dark-client.tsx` |
| `components/admin/mission-board/` | 5 | DEAD | Inneholder `mock-data.ts` — route bruker `mission-board-client-v2.tsx` |

**Sum:** 4 mapper, 27 filer.

**Anbefalt handling:** Slett alle 4 mappene. Verifiser med `npm run build` etter sletting.

**Verifisering før sletting:**
```bash
grep -rE "(playerhq-360|admin/dagens-fokus|admin/focus|admin/mission-board)" \
  --include="*.ts" --include="*.tsx" app lib modules hooks components
```
(Skal kun gi treff for routes/`/admin/focus`, `/admin/mission-board`, `/admin/dagens-fokus` — ikke fra components-mappene.)

---

## TIER 2 — Konsolidering (PARTIAL — få filer aktivt brukt)

### `components/portal/trackman-v2/` (4 filer, kun 1 importert)

| Fil | Importer | Anbefaling |
|---|---|---|
| `trackman-v2-client.tsx` | 1 | **Behold**, flytt til `portal/trackman/` |
| `kpi-row.tsx` | 0 | Slett |
| `shots-table.tsx` | 0 | Slett |
| `filter-bar.tsx` | 0 | Slett |

**Handling:** Flytt aktiv fil til `portal/trackman/`, slett resten av mappen.

---

### `components/portal/treningsplan-v2/` (4 filer, 2 importert)

| Fil | Importer | Anbefaling |
|---|---|---|
| `types.ts` | 1 | Behold, flytt til `portal/treningsplan/` |
| `week-strip.tsx` | 1 | Behold, flytt til `portal/treningsplan/` |
| `day-card.tsx` | 0 | Slett |
| `session-pill.tsx` | 0 | Slett |

**Handling:** Flytt 2 aktive filer til `portal/treningsplan/`, slett mappen.

---

### `components/portal/round/` (4 filer, 2 importert)

| Fil | Importer | Anbefaling |
|---|---|---|
| `round-map-mode.tsx` | 1 | Behold, flytt til `portal/runde/` |
| `hole-map.tsx` | 1 | Behold, flytt til `portal/runde/` |
| `map-overlay-layers.tsx` | 0 | Slett |
| `club-suggester.tsx` | 0 | Slett |

**Handling:** Konsolider til norsk variant `portal/runde/`. Engelsk navn bryter med språkpolicy uansett.

---

### `components/portal/playerhq/` (8 filer, kun 2 importert)

| Fil | Importer | Anbefaling |
|---|---|---|
| `PlayerHQSidebar.tsx` | 1 | Behold (PascalCase-navn er avvik fra konvensjon) |
| `player-hq-dashboard.tsx` | 1 | Behold |
| `hero.tsx`, `row-one.tsx`, `row-two.tsx`, `IconRail.tsx`, `NameList.tsx`, `playerhq-nav-config.ts` | 0 | Slett |

**Handling:** Slett 6 ubrukte filer. Vurder å rename PascalCase-fil til kebab-case.

---

### `components/portal/training/` (5 filer, 3 importert)

| Fil | Importer | Anbefaling |
|---|---|---|
| `analysis-trend-chart.tsx` | 1 | Behold |
| `analysis-filter-bar.tsx` | 1 | Behold |
| `analysis-results.tsx` | 1 | Behold |
| `analysis-filter-controls.tsx` | 0 | Slett |
| `analysis-filter-types.ts` | 0 | Slett (men sjekk om det re-exporteres fra annen fil) |

**Handling:** Slett 2 ubrukte filer. Mappenavnet `training` (engelsk) bryter med språkpolicy — vurder rename til `analyse/` siden alle filer er analyse-relaterte.

---

### `components/portal/trening/` (6 filer, kun 1 importert — alt i `v2/`-undermappe)

| Fil | Importer | Anbefaling |
|---|---|---|
| `v2/training-client.tsx` | 1 | Behold |
| `v2/{training-hero,category-tabs,log-session-bar,drill-card,category-section}.tsx` | 0 | Slett |

**Handling:** Behold kun `v2/training-client.tsx` — flytt ut av `v2/`-undermappe og slett resten. Mappen blir nesten tom — vurder full sletting hvis filen ikke er nødvendig.

---

### `components/portal/min-plan/` (10 filer, kun 1 importert — alt i `v2/`-undermappe)

| Fil | Importer | Anbefaling |
|---|---|---|
| `v2/min-plan-v2-client.tsx` | 1 | Behold |
| 9 andre filer i `v2/` | 0 | Slett |

**Handling:** 9 av 10 filer er døde. Sannsynligvis en forlatt prototyp. **Anbefales gransking** — kanskje hele mappen kan slettes hvis client-filen flyttes ett annet sted.

---

### `components/portal/booking/` (9 filer, 3 unike importert)

| Fil | Importer | Anbefaling |
|---|---|---|
| `booking-types.ts` | 6 | Behold (delt typer-fil) |
| `upsell-card.tsx` | 2 | Behold |
| `reschedule-form.tsx` | 1 | Behold |
| `booking-status-badge.tsx` | 1 | Behold |
| `upcoming-booking-card.tsx`, `cancellation-rules-card.tsx`, `booking-hover-card.tsx`, `past-booking-list.tsx`, `next-booking-hero.tsx` | 0 | Slett (men verifiser — komponentbiblioteket dokumenterer dem) |

**Merk:** `component-library.md` lister flere av disse 0-import-filene som "aktive". Det betyr de er **dokumentert men ikke importert** — duplikat-implementasjoner finnes trolig andre steder. Krever manuell verifisering før sletting.

---

## TIER 3 — Arkitektoniske beslutninger (krever Anders' avgjørelse)

Disse har **ingen objektivt riktig svar fra audit alene**. Begge/alle varianter er aktivt importert. Krever beslutning.

### A. `dashboard/` (36 filer, 28 importer) vs `dashboard-bento/` (8 filer, 17 importer)

**Situasjon:**
- `dashboard/` brukes av profilside, dagbok, gamle dashboard-flow.
- `dashboard-bento/` brukes av nye `dashboard-v2-client.tsx` og `stats-v2-client.tsx` (Brand Guide V2.0).
- Per `component-library.md` er `dashboard-bento/` valgt design (2026-04-27).

**Anbefaling:** Migrer gjenværende forbrukere (profil, dagbok) til bento-komponenter, slett `dashboard/`. Kan gjøres gradvis. Bør behandles som **separat sprint-oppgave**.

---

### B. `coachhq/` (5/4) vs `coachhq-dark/` (15/21) vs `mc-v2/` (9/12) ✅ FERDIG 2026-05-02

**Situasjon:**
- `coachhq/` — kun nav-config + lette komponenter, brukes av elev-sider.
- `coachhq-dark/` — dominerende UI-shell, brukes av admin landing, anlegg, dagens-fokus-client.
- `mc-v2/` — ennå annen variant, brukes av hub/elever-client-v2.

**Utført Tier 3B 2026-05-02:** Konsolidert til `coachhq-dark/`. Slettet `mc-v2/` (10 filer) og `coachhq/dark-cockpit.tsx`. Migrert 14 importer-filer (10 mc-v2 + 4 dark-cockpit). Utvidet `coachhq-dark/Primitives.tsx` med `KpiCard`, `StatCard`, `Empty`, `Table`, `TOKENS` + nye filer `ActivityItem.tsx` og `avatar.ts`. `coachhq/IconRail.tsx`/`NameList.tsx`/`coachhq-nav-config.ts`/`LiveStatusFooter.tsx` beholdt som byggesteiner for `CoachHQSidebar`. Netto reduksjon: −10 filer.

---

### C. `website/` (26 filer, 25 importer) vs `website-v2/` (65 filer, 24 importer)

**Situasjon:**
- `website/` — legacy, fortsatt brukt av `app/home-client.tsx`, `app/layout.tsx`, error-side.
- `website-v2/` — ny pixel-rebuild, brukt av forsiden, junior-academy, ikke-funnet-siden.

Begge har omtrent like mange importer. Migrasjon pågår.

**Anbefaling:** Fullfør migrasjon ved å flytte `home-client.tsx`, `layout.tsx`, `error.tsx` til v2-komponenter. Slett `website/` etter komplett migrering. **Separat sprint-oppgave.**

---

### D. `booking/` (8 filer, 3 importer) vs `booking-v2/` (19 filer, 28 importer)

**Situasjon:**
- `booking/` — gammel wizard, brukt av `app/academy/booking/page.tsx` og `portal/(dashboard)/bookinger/ny/portal-booking-wizard.tsx`.
- `booking-v2/` — ny flow, brukt av hele `app/booking-v2/`-rute-treet.

`booking-v2/` er klart dominant.

**Anbefaling:** Fullfør v2-migrasjon, oppdater `app/academy/booking/page.tsx` og portal-wizard, slett `booking/`. Sjekk `booking-config.ts` for delte konstanter.

---

### E. `components/portal/admin/` (22 filer, 21 importer) vs `components/admin/` (223 filer, 54 importer)

**Situasjon:**
- `components/admin/` — toppnivå, hovedflate (CoachHQ-rebrand 2026-04-25).
- `components/portal/admin/` — legacy plassering, brukt av kalender, kapasitet, elev-detaljer.

To parallelle admin-trær med uklart eierskap. Importene er nesten like mange.

**Anbefaling:** Konsolider alt til `components/admin/`. Flytt 22 filer fra `portal/admin/` opp til toppnivå (sjekk navnekollisjoner først). Oppdater alle 21 importer. Dette er **mest invasive** av Tier 3-oppgavene.

---

## Foreslått rekkefølge

1. **Godkjenn TIER 1** → slett 27 filer (lavest risiko).
2. **Godkjenn TIER 2 én-mappe-om-gangen** → flytt aktive, slett døde. Kjør `npm run build` mellom hver.
3. **TIER 3 = egne sprint-oppgaver** → ikke gjør i samme PR som ryddingen.

## Total potensial

- **TIER 1:** −27 filer umiddelbart
- **TIER 2:** ca. −30 filer etter konsolidering
- **TIER 3:** ca. −250+ filer over flere sprinter (hvis fullført)

**Reduksjon:** Fra 881 til ~570 filer i `components/` (~35 % mindre).
