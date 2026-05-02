# Tier 3E — Migrasjonsplan: portal/admin/ → admin/ (2026-05-02)

> Audit-rapport. **Ingen filer flyttet eller endret.** Eksplisitt godkjenning kreves per steg.

---

## 1. Fil-for-fil sammenligning

`components/portal/admin/` har 22 filer fordelt på 4 logiske områder + 7 root-filer.

### A. `student-360/` ⟷ `admin/spillerprofil/` (HOVEDDUPLIKAT)

| portal/admin/student-360/ (PascalCase, engelsk) | admin/spillerprofil/ (kebab-case, norsk) | Sammenligning |
|---|---|---|
| `Hero360.tsx` (231 linjer) | `hero-360.tsx` (266 linjer) — har `Hero360Compact` + `Hero360Full` | spillerprofil/ er mer komplett (2 varianter) |
| `KontaktinfoCard.tsx` (88 linjer) | (mangler) | UNIK i student-360/ |
| `GolfCard.tsx` (154 linjer) | `golf-card.tsx` (297 linjer) + `GolfCardLong` | spillerprofil/ mer komplett |
| `CoachingCard.tsx` (136 linjer) | `coaching-card.tsx` (130 linjer) + `CoachingCardLong` | Tilsvarende |
| `TrainingCard.tsx` (87 linjer) | `training-card.tsx` (168 linjer) + `TrainingCardLong` | spillerprofil/ mer komplett |
| `MentalForecastCard.tsx` (132 linjer) | `mental-card.tsx` (119 linjer) + `MentalCardLong` | Tilsvarende, ulike navn |
| `TestsCard.tsx` (73 linjer) | (mangler) | UNIK i student-360/ |
| `EconomyCard.tsx` (157 linjer) | `equipment-economy-card.tsx` (135 linjer) + `EconomyCardLong` | Tilsvarende |
| `SignalsCard.tsx` (114 linjer) | `signals-card.tsx` (127 linjer) + `SignalsCardLong` | Tilsvarende |
| `shell.tsx` (109 linjer, har `CardShell`, `MonoLabel`) | `section-shell.tsx` (106 linjer) + `tabs-shell.tsx` (114 linjer) + `primitives.tsx` (257 linjer) | spillerprofil/ har mer komplett shell-bibliotek |
| (mangler) | `summary-card.tsx`, `activity-card.tsx`, `long-page-toc.tsx`, `mock-data.ts` (243 linjer mock-data), `types.ts` (92 linjer types) | UNIKE i spillerprofil/ |

**Totalt:** student-360/ = 10 filer/1281 linjer, spillerprofil/ = 15 filer/2417 linjer.

### Hvilken er mest komplett?

**`admin/spillerprofil/`** er klart mer omfattende:
- 15 filer vs 10 filer
- Eksporterer 50+ symboler (komponenter, types, mock-data, panels)
- Har både `Hero360Compact` og `Hero360Full`, og "Long"-varianter av hver kort
- Har full `TabsShell` + `SectionShell` + `LongPageToc`-arkitektur
- Har sentralisert types og mock-data

**`portal/admin/student-360/`** er en **enklere base-implementasjon**:
- 10 cards som hver tar typed props
- Ingen mock-data eller TabsShell
- Mer "ren" arkitektur, men mindre funksjonalitet
- Mangler `KontaktinfoCard` og `TestsCard` motpart i spillerprofil/

### Hvilke routes peker hvor?

| Route | Bruker hvilken? |
|---|---|
| `app/admin/(authed)/elever/[id]/v2/page.tsx` | `portal/admin/student-360/` (1 route) |
| `app/admin/(authed)/elever/[id]/spillerprofil-longpage-client.tsx` | **Ingen** — bruker `coachhq/dark-cockpit` |
| `app/admin/(authed)/elever/[id]/spillerprofil-tabs-client.tsx` | **Ingen** — bruker `coachhq/dark-cockpit` |
| `app/admin/(authed)/elever/[id]/student-detail-client.tsx` | **Ingen** av disse to |

**KRITISK FUNN:** `admin/spillerprofil/` (15 filer, 2417 linjer) er **DEAD CODE — ingen routes importerer den**. Klientene som heter `spillerprofil-*` bruker faktisk `coachhq/` i stedet, ikke `admin/spillerprofil/`.

### Korrekt norsk navn per `sprak.md`?

`sprak.md` sier:
- **Spiller, ikke elev/student** — så "student-360" må vekk
- Mappenavn skal være kebab-case norsk: **`spillerprofil-360/`** eller bare **`spillerprofil/`**

---

### B. `kalender/`

| portal/admin/kalender/ | admin/kalender/ | Bruk |
|---|---|---|
| `availability-month-calendar.tsx` | (mangler) | UNIK |
| `google-calendar-picker.tsx` | (mangler) | UNIK |
| | `availability-settings.tsx` | UNIK i admin/ |
| | `calendar-block.tsx`, `calendar-grid.tsx`, `calendar-toolbar.tsx`, `kalender-week-grid.tsx` | UNIKE i admin/ |
| | `capacity-manager.tsx`, `kalender-client.tsx`, `index.ts`, `mock-data.ts` | UNIKE i admin/ |

**Konklusjon:** Ingen overlapp i navn. To helt ulike sett komponenter. Kan flyttes inn uten konflikt.

**Routes:**
- `admin/kalender/` → `app/admin/(authed)/kalender/kalender-client.tsx` (hovedkalenderen)
- `portal/admin/kalender/` → `app/admin/(authed)/kalender/kalender-availability-panel.tsx` (sidepanel for tilgjengelighet)

Begge brukes side-om-side. **Anbefaling:** Flytt `portal/admin/kalender/` inn i `admin/kalender/`.

---

### C. `meldinger/`

| portal/admin/meldinger/ (PascalCase) | admin/meldinger/ (kebab-case) | Bruk |
|---|---|---|
| `ChannelFilter.tsx` | (mangler) | UNIK |
| `MessageList.tsx` | `inbox-panel.tsx` | Mulig overlapp — begge er meldingsliste |
| `MessageDetail.tsx` | `conversation-panel.tsx` | Mulig overlapp — begge er meldingsdetalj |
| | `context-panel.tsx`, `mock-data.ts` | UNIKE i admin/ |

**Routes:**
- `admin/meldinger/` → **0 routes importerer** den (death code i admin/!)
- `portal/admin/meldinger/` → `app/admin/(authed)/meldinger/meldinger-client.tsx` + `actions.ts` (AKTIV)

**KRITISK FUNN nr. 2:** `admin/meldinger/` er **DEAD CODE — 0 importer**. Den aktive meldingsfunksjonen ligger i `portal/admin/meldinger/`.

---

### D. Root-filer i `portal/admin/`

| Fil | Importeres av | Status |
|---|---|---|
| `AdminNotificationBell.tsx` | `components/portal/mission-control/mc-topbar.tsx` (legacy mission-control sidebar) | Aktiv (legacy) |
| `NotificationPanel.tsx` | `AdminNotificationBell.tsx` (sibling) | Aktiv (transitivt) |
| `capacity-gauge.tsx` | `app/admin/(authed)/kapasitet/week-adjustment-view.tsx` | Aktiv |
| `overbooking-alert.tsx` | `app/admin/(authed)/kapasitet/week-adjustment-view.tsx` | Aktiv |
| `student-list.tsx` | (ingen importerer) | DEAD |
| `week-adjustment-grid.tsx` | `app/admin/(authed)/kapasitet/week-adjustment-view.tsx` | Aktiv |
| `week-selector.tsx` | `app/admin/(authed)/kapasitet/week-adjustment-view.tsx` | Aktiv |

**Anbefalt destinasjon i `admin/`:**
- `AdminNotificationBell.tsx`, `NotificationPanel.tsx` → `admin/notifications/` (ny mappe)
- `capacity-gauge.tsx`, `overbooking-alert.tsx`, `week-adjustment-grid.tsx`, `week-selector.tsx` → `admin/kapasitet/` (ny mappe, matcher route-navn)
- `student-list.tsx` → **slett** (dead, og navnet bryter med spiller-låsen uansett)

---

## 2. Komplett migrasjonstabell

| # | Kilde | Destinasjon | Handling | Berørte routes |
|---|---|---|---|---|
| 1 | `portal/admin/student-360/` (10 filer) | `admin/spillerprofil-360/` | **Rename + flytt.** Slett først dead `admin/spillerprofil/` (15 filer). | `app/admin/(authed)/elever/[id]/v2/page.tsx` |
| 2 | `admin/spillerprofil/` (15 filer) | — | **Slett** (dead code, 0 importer) | (ingen) |
| 3 | `portal/admin/kalender/availability-month-calendar.tsx` | `admin/kalender/availability-month-calendar.tsx` | **Flytt** | `app/admin/(authed)/kalender/kalender-availability-panel.tsx` |
| 4 | `portal/admin/kalender/google-calendar-picker.tsx` | `admin/kalender/google-calendar-picker.tsx` | **Flytt** | (sjekk hvem importerer) |
| 5 | `portal/admin/meldinger/` (3 filer) | `admin/meldinger/` (rename til kebab-case) | **Flytt + rename** | `app/admin/(authed)/meldinger/meldinger-client.tsx`, `actions.ts` |
| 6 | `admin/meldinger/` (4 filer) | — | **Slett** (dead code, 0 importer) | (ingen) |
| 7 | `portal/admin/AdminNotificationBell.tsx` | `admin/notifications/AdminNotificationBell.tsx` | **Flytt** | `components/portal/mission-control/mc-topbar.tsx` |
| 8 | `portal/admin/NotificationPanel.tsx` | `admin/notifications/NotificationPanel.tsx` | **Flytt** | (sibling) |
| 9 | `portal/admin/capacity-gauge.tsx` | `admin/kapasitet/capacity-gauge.tsx` | **Flytt** | `app/admin/(authed)/kapasitet/week-adjustment-view.tsx` |
| 10 | `portal/admin/overbooking-alert.tsx` | `admin/kapasitet/overbooking-alert.tsx` | **Flytt** | (samme route) |
| 11 | `portal/admin/week-adjustment-grid.tsx` | `admin/kapasitet/week-adjustment-grid.tsx` | **Flytt** | (samme route) |
| 12 | `portal/admin/week-selector.tsx` | `admin/kapasitet/week-selector.tsx` | **Flytt** | (samme route) |
| 13 | `portal/admin/student-list.tsx` | — | **Slett** (dead + bryter spiller-lås) | (ingen) |
| 14 | `components/portal/admin/` (selve mappen) | — | **Slett** (tom etter flyttinger) | (ingen) |

---

## 3. Routes som må oppdateres

Til sammen **5 unike route-filer** må oppdatere import-stier:

| Route | Antall importer å endre |
|---|---|
| `app/admin/(authed)/elever/[id]/v2/page.tsx` | 1 (student-360 → spillerprofil-360) |
| `app/admin/(authed)/kalender/kalender-availability-panel.tsx` | 1 (kalender-undermappe) |
| `app/admin/(authed)/meldinger/meldinger-client.tsx` | 1+ (meldinger-mappe) |
| `app/admin/(authed)/meldinger/actions.ts` | 1+ (meldinger-mappe) |
| `app/admin/(authed)/kapasitet/week-adjustment-view.tsx` | 4 (capacity-gauge, overbooking, week-adjustment, week-selector) |
| `components/portal/mission-control/mc-topbar.tsx` | 1 (AdminNotificationBell) |

---

## 4. Estimert resultat

| Metrikk | Før | Etter |
|---|---|---|
| Filer i `portal/admin/` | 22 | 0 |
| Filer i `admin/spillerprofil/` (dead) | 15 | 0 |
| Filer i `admin/meldinger/` (dead) | 4 | 0 |
| Nye filer i `admin/spillerprofil-360/` | 0 | 10 |
| Nye filer i `admin/notifications/` | 0 | 2 |
| Nye filer i `admin/kapasitet/` | 0 | 4 |
| Filer flyttet til `admin/kalender/` | 0 | +2 |
| Filer flyttet til `admin/meldinger/` | 0 | +3 (fra portal/admin) |

**Netto endring:**
- **Slettet:** 22 (portal/admin) + 15 (dead spillerprofil) + 4 (dead meldinger) + 1 (dead student-list) = ~20 reelt slettet (resten er flyttet)
- **Flyttet:** 21 filer (alle bortsett fra student-list)
- **Routes berørt:** 6
- **Total reduksjon:** ~20 filer faktisk borte, og 1 helt mappe (portal/admin) eliminert

---

## 5. Foreslått rekkefølge (per steg, build-verifisert)

1. **Steg A — Slett dead spillerprofil:** Slett `admin/spillerprofil/` (0 importer). Build.
2. **Steg B — Slett dead meldinger:** Slett `admin/meldinger/` (0 importer). Build.
3. **Steg C — Slett dead student-list:** Slett `portal/admin/student-list.tsx` (0 importer). Build.
4. **Steg D — Migrér student-360:** Flytt til `admin/spillerprofil-360/`, oppdater 1 route. Build.
5. **Steg E — Migrér kalender-undermappe:** Flytt 2 filer, oppdater 1 route. Build.
6. **Steg F — Migrér meldinger:** Flytt 3 filer (rename til kebab-case?), oppdater 2 route-filer. Build.
7. **Steg G — Migrér root-filer:**
   - `notifications/`: AdminNotificationBell + NotificationPanel, oppdater mc-topbar.
   - `kapasitet/`: 4 filer, oppdater week-adjustment-view.
   Build.
8. **Steg H — Slett tom `portal/admin/`-mappe.** Build.

Hvert steg er reverserbart hvis build feiler. Estimert tid: 1–2 timer hvis ingen overraskelser.

---

## 6. Risikoer

1. **Mc-topbar (legacy)** importerer `AdminNotificationBell`. Hvis `mc-topbar.tsx` skal slettes i 3B-konsolidering uansett, kan vi slette `AdminNotificationBell` med. Sjekk avhengighet før Steg G.
2. **Spillerprofil-clientene** (`spillerprofil-longpage-client.tsx`, `spillerprofil-tabs-client.tsx`) bruker `coachhq/dark-cockpit`. Hvis vi senere bytter dem til `admin/spillerprofil-360/`, kan vi inkorporere noen "Long"-varianter fra dead `admin/spillerprofil/` før vi sletter den (skap fra et levende). Foreløpig: bare slett.
3. **Meldinger-rename:** `ChannelFilter.tsx` → `channel-filter.tsx` (kebab-case). Krever import-oppdatering. Vurder å holde PascalCase midlertidig hvis det sparer tid.
