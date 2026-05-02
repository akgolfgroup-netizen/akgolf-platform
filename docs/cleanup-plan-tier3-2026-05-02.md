# Tier 3 — Arkitektoniske beslutninger (2026-05-02)

> Audit-rapport. **Ingen filer endret, flyttet eller slettet.** Hver delseksjon krever eksplisitt godkjenning før utførelse.

---

## TIER 3B — Admin-varianter (HØYESTE PRIORITET)

### 1. Filer per variant

| Variant | Filer | Hva den eksporterer |
|---|---|---|
| `components/admin/coachhq/` | 5 | `dark-cockpit.tsx` (DARK_TOKENS, DarkPageHead, DarkButton), `IconRail.tsx`, `NameList.tsx`, `LiveStatusFooter.tsx`, `coachhq-nav-config.ts` |
| `components/admin/coachhq-dark/` | 8 + 3 undermapper (`arbeidsflate`, `d1`, `d27`) | Full shell: `CoachHQDarkShell`, `CoachHQDarkRail`, `CoachHQDarkNav`, `CoachHQDarkTopbar`, `PageHead`. **Primitives:** `Card`, `CardHeader`, `Button` (i `Primitives.tsx`) |
| `components/admin/mc-v2/` | 9 | Mc-prefiksede primitives: `McCard`, `McCardHeader`, `McButton`, `McKpiCard`, `McTable`, `McPill`, `McEmpty`, `McPageHead`, `McActivityItem` |

### 2. Hvilke routes importerer hver variant?

**`coachhq/` (4 routes — alle elev-relaterte):**
- `app/admin/(authed)/elever/[id]/spillerprofil-longpage-client.tsx`
- `app/admin/(authed)/elever/[id]/spillerprofil-tabs-client.tsx`
- `app/admin/(authed)/elever/oversikt/elev-oversikt-client.tsx`
- `app/admin/(authed)/elever/students-client.tsx`

**`coachhq-dark/` (15+ routes — DOMINANT):**
- `app/admin/(authed)/page.tsx` (admin-forsiden)
- `app/admin/(authed)/anlegg/page.tsx`
- `app/admin/(authed)/bookinger/page.tsx`
- `app/admin/(authed)/coaching-board/coaching-board-dark-client.tsx`
- `app/admin/(authed)/dagens-fokus-client.tsx`
- `app/admin/(authed)/denne-uken/this-week-dark-client.tsx`
- `app/admin/(authed)/elever/[id]/page.tsx`
- `app/admin/(authed)/elever/[id]/tester/page.tsx`
- `app/admin/(authed)/elever/oversikt/page.tsx`
- `app/admin/(authed)/elever/page.tsx`
- `app/admin/(authed)/focus/focus-dark-client.tsx`
- `app/admin/(authed)/godkjenninger/godkjenninger-dark-client.tsx`
- `app/admin/(authed)/hub/hub-client.tsx`
- `app/admin/(authed)/hub/page.tsx`
- `app/admin/(authed)/mission-board/mission-board-dark-client.tsx`
- `app/admin/(authed)/mission-board/page.tsx`

**`mc-v2/` (10 routes — alle "v2"-klienter):**
- `app/admin/(authed)/hub-client-v2.tsx`
- `app/admin/(authed)/bookinger/bookinger-client-v2.tsx`
- `app/admin/(authed)/elever/elever-client-v2.tsx`
- `app/admin/(authed)/elever/[id]/elev-detalj-client-v2.tsx`
- `app/admin/(authed)/elever/[id]/tabs/{bookinger,coaching,profil,statistikk,trening}-tab.tsx`
- `app/admin/(authed)/mission-board/mission-board-client-v2.tsx`

### 3. Funksjonell overlapping

Tre varianter eksporterer **samme primitiver under tre navnerom**:

| Komponent | coachhq-dark | mc-v2 | coachhq |
|---|---|---|---|
| Card | `Card` (Primitives.tsx) | `McCard` | — |
| CardHeader | `CardHeader` | `McCardHeader` | — |
| Button | `Button` | `McButton` | `DarkButton` (dark-cockpit.tsx) |
| PageHead | `PageHead` | `McPageHead` | `DarkPageHead` |
| Nav rail | `CoachHQDarkRail` | — | `IconRail` |
| Nav config | (i shell) | — | `coachhq-nav-config.ts` |

**Konklusjon:** `coachhq-dark/` og `mc-v2/` implementerer det samme designsystemet under ulike navn. `coachhq/` er en mindre tidlig variant (kun nav-bits + `dark-cockpit`).

### 4. Kritisk problem: parallelle klienter på samme route

Flere admin-routes har **2 ulike client-komponenter side-om-side** med ulik design:

| Route | v1-client | v2/dark-client |
|---|---|---|
| `/admin/coaching-board` | `coaching-board-client.tsx` | `coaching-board-dark-client.tsx` (uses coachhq-dark) |
| `/admin/denne-uken` | `this-week-client.tsx` | `this-week-dark-client.tsx` (uses coachhq-dark) |
| `/admin/focus` | `focus-client.tsx` | `focus-dark-client.tsx` (uses coachhq-dark) |
| `/admin/godkjenninger` | `godkjenninger-client.tsx` | `godkjenninger-dark-client.tsx` (uses coachhq-dark) |
| `/admin/mission-board` | `mission-board-client-v2.tsx` (uses mc-v2) | `mission-board-dark-client.tsx` (uses coachhq-dark) |
| `/admin/hub` | `hub/hub-client.tsx` (uses coachhq-dark) | `hub-client-v2.tsx` (uses mc-v2) |
| `/admin/elever` | `students-client.tsx` (coachhq) | `elever-client-v2.tsx` (mc-v2) |
| `/admin/elever/[id]` | `student-detail-client.tsx`, `spillerprofil-longpage-client.tsx`, `spillerprofil-tabs-client.tsx` (coachhq) | `elev-detalj-client-v2.tsx` (mc-v2) |

**Hvilken vinner per side i dag avhenger av hvilken `page.tsx` velger å rendre.** Dette er aktiv duplisering og må stoppes.

### 5. Anbefaling

**Vinneren bør være `coachhq-dark/`:**
1. Mest brukt (15+ routes vs 10 for mc-v2 vs 4 for coachhq)
2. Navn matcher Brand Guide V2.0-sannheten (`coachhq-reference.html`)
3. Har full shell (Rail + Nav + Topbar + Shell), ikke bare primitives
4. `coachhq/` er allerede en delmengde av `coachhq-dark/`

**Konsolideringsplan (separat sprint, IKKE nå):**

1. **Kartlegg overlapp:** for hver mc-v2-komponent (`McCard`, `McButton`, etc.), finn motsvarende i `coachhq-dark/Primitives.tsx`. Skriv migrasjonsmapping.
2. **Migrér `mc-v2/` → `coachhq-dark/`:** søk-og-erstatt `McCard` → `Card` osv. i alle `*-v2.tsx`-filer. Slett `mc-v2/`.
3. **Migrér `coachhq/` → `coachhq-dark/`:** flytt `dark-cockpit.tsx`-funksjonalitet inn i `coachhq-dark/Primitives.tsx`. Slett `coachhq/`.
4. **Velg én klient per route:** for hver duplikat-route (8 stk over), velg vinneren og slett taperen.

**Estimert arbeidsmengde:** 2–3 dager. Krever full regresjonstest av admin-flate.

---

## TIER 3D — `booking/` vs `bookinger/`

### 1. Filer

**`components/portal/booking/` (4 filer — etter Tier 2-rydding):**
- `booking-status-badge.tsx`
- `booking-types.ts`
- `reschedule-form.tsx`
- `upsell-card.tsx`

**`components/portal/bookinger/v2/` (9 filer):**
- `booking-row.tsx`, `booking-shell.tsx`, `booking-tabs.tsx`
- `booking-utils.ts`, `cancellation-rules.tsx`
- `day-separator.tsx`, `empty-state.tsx`
- `next-booking-hero.tsx`, `page-header.tsx`

### 2. Tjener de samme formålet?

**Nei — de tjener ulike lag:**

| Mappe | Rolle |
|---|---|
| `booking/` | **Delte typer + handlinger.** `booking-types.ts` brukes av 6 forskjellige steder (inkl. `bookinger/v2/booking-utils.ts`). `reschedule-form.tsx` er en tverrgående form. `upsell-card.tsx` brukes både av offentlig booking-confirmation OG portal. |
| `bookinger/v2/` | **Portal-spesifikke UI-shell-komponenter** for `/portal/bookinger`-route (skjelett, rad, tabs, hero). |

`bookinger/v2/booking-utils.ts` *importerer* `booking/booking-types.ts` — `booking/` er fundamentet, `bookinger/v2/` bygger på det.

### 3. Anbefaling

**IKKE slå sammen.** `booking/` er et delt typer/utilities-bibliotek på tvers av offentlig booking, portal-bookinger og portal-rescheduling. `bookinger/v2/` er portal-UI.

**Mindre opprydning som kan gjøres:**
- Rename `components/portal/booking/` → `components/portal/booking-shared/` for å gjøre rollen tydeligere. Dette er imidlertid kosmetisk og kan vente.

---

## TIER 3A — `dashboard/` vs `dashboard-bento/`

### 1. Filer

**`components/portal/dashboard/` (36 filer):** bredt sortert komponentbibliotek — KPI-kort, charts (handicap, sparkline, sg-radar, sessions-donut, performance, training-distribution), widgets (achievements, social, trackman, training-plan, week-rings, week-calendar), pulse-dot, skeletons, ai-insight-card, coach-insight-card, next-booking-card, player-profile-card, premium-card, welcome-section, shortcut-card/pills, number-ticker, training-activity-card.

**`components/portal/dashboard-bento/` (8 filer):** spesifikt nytt bento-skin — `hero-card`, `kpi-card`, `next-session-card`, `sg-card`, `streak-card`, `trend-card`, `shortcuts-row`, `ai-insight-card`.

### 2. Hvilke routes bruker hver?

**`dashboard/` (17 forbrukere — bredt anvendt):**
- `app/portal/profile/page.tsx`
- `app/portal/(dashboard)/dagbok/{dagbok-client,dagbok-calendar,dagbok-stats,training-diary-client}.tsx`
- `app/portal/(dashboard)/treningsplan/training-plan-viewer.tsx`
- `app/portal/(dashboard)/turneringsplan/{turneringsplan-client,tournament-list-with-periods}.tsx`
- `app/portal/(dashboard)/runde/[id]/{live-round-client,oppsummering/page}.tsx`
- `app/portal/(dashboard)/mental/{[roundId]/page,ny/page}.tsx`
- `app/portal/(dashboard)/spill/[gameType]/page.tsx`
- `app/portal/(dashboard)/ai-coach/ai-coach-dashboard-client.tsx`
- `app/portal/(dashboard)/bag/bag-client.tsx`
- `app/portal/(dashboard)/bookinger/[id]/booking-detail-client.tsx`
- `app/portal/(dashboard)/bookinger/ny/book-coaching-form.tsx`

**`dashboard-bento/` (kun 2 forbrukere):**
- `app/portal/(dashboard)/dashboard-bento-client.tsx`
- `app/portal/(dashboard)/dashboard-v2-client.tsx`

### 3. Visuell og funksjonell forskjell

- `dashboard/` = **delt UI-bibliotek** for spillerportalen, brukt på tvers av minst 17 sider/komponenter for KPI-kort, charts, widgets osv.
- `dashboard-bento/` = **kun nytt design-skin** for spillerportalens forside (Brand Guide V2.0 bento-layout). Det er IKKE et bredt komponentbibliotek — det er 8 nye kort som komponerer forsiden.

### 4. Anbefaling

**IKKE migrer dashboard/ til bento.** De har ulike roller:
- `dashboard-bento/` → **forsidens layout** (1 side)
- `dashboard/` → **gjenbrukbart KPI/chart-bibliotek** (17 sider)

Eventuell videre migrering bør være å gradvis erstatte gamle Heritage-stilte komponenter i `dashboard/` med Brand Guide V2.0-stil, men beholde mappen og innholdet. Slett `dashboard-bento/` kun hvis du redesigner forsiden bort fra bento — usannsynlig.

---

## TIER 3E — `portal/admin/` vs `admin/` (toppnivå)

### 1. Hva inneholder hver?

**`components/portal/admin/` (22 filer, 5 logiske områder):**
- `student-360/` (10 filer, PascalCase, engelsk): `Hero360`, `KontaktinfoCard`, `GolfCard`, `CoachingCard`, `TrainingCard`, `MentalForecastCard`, `TestsCard`, `EconomyCard`, `SignalsCard`, `shell.tsx`
- `kalender/` (2 filer): `availability-month-calendar.tsx`, `google-calendar-picker.tsx`
- `meldinger/` (3 filer): `ChannelFilter`, `MessageList`, `MessageDetail`
- Root-filer: `AdminNotificationBell`, `NotificationPanel`, `capacity-gauge`, `overbooking-alert`, `student-list`, `week-adjustment-grid`, `week-selector`

**`components/admin/` (toppnivå, 31 undermapper, 223 filer):** alt det andre — analytics, bookinger, coachhq*, coaching-board, elever, fasiliteter, godkjenninger, grupper, hub, kalender, library, lokasjoner, mc-v2, meldinger, okonomi, okter, rapporter, spillere, spillerprofil, talent, team, tilgjengelighet, tjenester, treningsplan-bygger, uke + flere.

### 2. Kritiske duplikater

| Funksjon | `portal/admin/` | `admin/` (toppnivå) |
|---|---|---|
| Spillerprofil 360 | `student-360/` (10 filer, PascalCase, engelsk) | `spillerprofil/` (15 filer, kebab-case, norsk) — `hero-360`, `coaching-card`, `golf-card`, `training-card`, `mental-card`, `signals-card`, etc. |
| Kalender | `kalender/` (2 filer) | `kalender/` (9 filer) |
| Meldinger | `meldinger/` (3 filer) | `meldinger/` (4 filer) |

**Spillerprofil er mest alvorlig:** to fullstendige implementasjoner av samme spillerprofil-side under ulike navnesystemer (PascalCase engelsk vs kebab-case norsk). Bryter også med `sprak.md`-låsen som sier "spiller, ikke student".

### 3. Hvilke routes bruker `portal/admin/`?

- `app/admin/(authed)/elever/[id]/v2/page.tsx` (student-360 PascalCase)
- `app/admin/(authed)/kalender/kalender-availability-panel.tsx`
- `app/admin/(authed)/kapasitet/week-adjustment-view.tsx`
- `app/admin/(authed)/meldinger/{actions,meldinger-client}.tsx`

### 4. Anbefaling

**Konsolider alt til `components/admin/`.**

| Steg | Handling |
|---|---|
| 1 | **Bestem vinner for spillerprofil 360:** `admin/spillerprofil/` (norsk, kebab-case, matcher språkpolicy + designsystem). |
| 2 | Migrér 5 forbrukere av `portal/admin/student-360/` til `admin/spillerprofil/`. Slett mappen. |
| 3 | Slå sammen `portal/admin/kalender/` inn i `admin/kalender/` (sjekk navnekollisjoner). |
| 4 | Slå sammen `portal/admin/meldinger/` inn i `admin/meldinger/`. |
| 5 | Flytt root-filer (`AdminNotificationBell`, `NotificationPanel`, `capacity-gauge`, `overbooking-alert`, `student-list`, `week-adjustment-grid`, `week-selector`) til `admin/` direkte eller logiske undermapper. |
| 6 | Slett `components/portal/admin/`. |

**Estimert arbeidsmengde:** 1–2 dager. Krever oppdatering av ~5 routes og full admin-regresjonstest.

---

## TIER 3C — `website/` vs `website-v2/` (kun status)

### 1. Hvilke routes bruker hver?

**`website/` (6 forbrukere — primært layout/legacy):**
- `app/layout.tsx` (root layout)
- `app/error.tsx`
- `app/home-client.tsx` (gammel forside-rest)
- `app/auth/set-password/page.tsx`
- `app/admin/login/page.tsx`
- `app/academy/booking/page.tsx`

**`website-v2/` (15 forbrukere — DOMINANT):**
- `app/page.tsx` (forsiden)
- `app/academy/page.tsx`, `app/academy/abonnement/page.tsx`
- `app/junior-academy/page.tsx`, `app/junior-academy/foreldreinfo/page.tsx`
- `app/utvikling/page.tsx`
- `app/booking/page.tsx`
- `app/kontakt/page.tsx`
- `app/landing/contact/page.tsx`
- `app/om-oss/page.tsx`
- `app/personvern/page.tsx`
- `app/pricing/page.tsx`
- `app/not-found.tsx`, `app/403/page.tsx`, `app/500/page.tsx`

### 2. Erstatningsstatus

`website-v2/` har 6 dedikerte undermapper (academy, booking, contact, junior-academy, landing-pricing, utvikling) som dekker alle hovedmarkedssidene.

**Gjenstår å migrere bort fra `website/`:**
- `app/layout.tsx` (root layout — bruker `WebsiteFooter`, `WebsiteNav`, `BackToTop`, `CookieConsent`, `PageTransition`)
- `app/error.tsx` (`AKLogo`, `RevealOnScroll`)
- `app/home-client.tsx` (legacy forside)
- `app/auth/set-password/page.tsx`, `app/admin/login/page.tsx` (`AKLogo`)
- `app/academy/booking/page.tsx` (`SectionLabel` evt.)

### 3. Estimert ferdiggrad

| Type | website/ | website-v2/ | Andel migrert |
|---|---|---|---|
| Routes | 6 | 15 | **71 %** |
| Filer | 26 | 65 | website-v2 har 2.5× mer kode (mer detaljerte sider) |

**Status:** Migrering 70 %+ ferdig. Layout/error og noen sub-sider gjenstår. Ingen handling anbefales nå — fortsett gradvis migrering når disse sidene uansett skal redesignes.

---

## SAMLET ANBEFALING

| Tier | Prioritet | Estimat | Kompleksitet |
|---|---|---|---|
| **3B — Admin-varianter** | KRITISK | 2–3 dager | Høy: 8 routes har dupliserte klienter |
| **3E — portal/admin → admin** | HØY | 1–2 dager | Medium: ~5 routes må oppdateres |
| **3C — website-migrering** | LAV | Fortløpende | Lav: vent til redesign av layout/error |
| **3A — dashboard/dashboard-bento** | INGEN | — | Begge har sin rolle, ikke slå sammen |
| **3D — booking/bookinger** | INGEN | — | Tjener ulike lag, ikke slå sammen |

**Foreslått rekkefølge:**
1. **3B først** (admin-varianter) — eliminerer duplikater i CoachHQ-flaten, mest forvirring per linje kode.
2. **3E etterpå** (portal/admin) — bygger videre på 3B siden begge berører admin-trærne.
3. **3C parkér** — fullfør sammen med fremtidig redesign.
4. **3A og 3D** — ingen handling, dokumentert konklusjon.

Forventet total reduksjon ved 3B+3E: ~50–80 filer, betydelig redusert arkitektonisk støy.
