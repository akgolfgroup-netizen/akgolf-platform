# Auto-Genereringsplan: AK Golf Platform (81 skjermer)

**NY REKKEFØLGE etter prioritering:**
1. **Booking System** (13 skjermer) → 2. **Spiller Portal** (33 skjermer) → 3. **Mission Control/Admin** (23 skjermer) → 4. **Landingsider** (8 skjermer)

**Farge-strategi:** Grayscale/placeholder tokens (farge-agnostisk)  
**Mål:** Generere alle 81 skjermer med konsistent struktur

---

## 📊 TOTAL OVERSIKT (Basert på eksisterende kodebase)

| System | Antall skjermer | Status | % |
|--------|-----------------|--------|---|
| Booking System | 13 | ⬜ | 0% |
| Spiller Portal | 33 | ⬜ | 0% |
| Mission Control / Admin | 23 | ⬜ | 0% |
| Website / Marketing | 8 | ⬜ | 0% |
| Auth | 4 | ⬜ | 0% |
| **TOTALT** | **81 skjermer** | | **0%** |

---

## 🚀 FASE 1: BOOKING SYSTEM (13 skjermer)

### 1.1 Booking Forside & Veiledning
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 1.1.1 | **Booking Forside** | `/booking` | Hero + Cards | Intro, CTA til kategori |
| 1.1.2 | **Veileder** | `/booking/veileder` | Step Wizard | "Hva skal jeg booke?" guide |

### 1.2 Kategori & Proposals
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 1.2.1 | **Kategori Oversikt** | `/booking/kategori` | Cards Grid | Coaching, fitting, simulator... |
| 1.2.2 | **Kategori Detalj** | `/booking/kategori/[category]` | Hero + Pricing | Spesifikk tjeneste info |
| 1.2.3 | **Proposal Oversikt** | `/booking/proposals` | Comparison Grid | Pakke A, B, C, D sammenligning |
| 1.2.4 | **Proposal A** | `/booking/proposals/a` | Feature List | Enkelt-time pakke |
| 1.2.5 | **Proposal B** | `/booking/proposals/b` | Feature List | 5-timers pakke |
| 1.2.6 | **Proposal C** | `/booking/proposals/c` | Feature List | 10-timers pakke |
| 1.2.7 | **Proposal D** | `/booking/proposals/d` | Feature List | Premium/medlemskap |

### 1.3 Booking Flyt & Betaling
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 1.3.1 | **Ny Booking** | `/booking/new` | Calendar + Slots | Velg dato og tid |
| 1.3.2 | **Booking Detalj** | `/booking/[id]` | Detail View | Se booking info |
| 1.3.3 | **Betaling** | `/booking/[id]/pay` | Checkout Form | Betalingsløsning |
| 1.3.4 | **Bekreftelse** | `/booking/[id]/confirmation` | Success Card | Kvittering, neste steg |

---

## 🎮 FASE 2: SPILLER PORTAL (33 skjermer)

### 2.1 Core Dashboard & Profil (3 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 2.1.1 | **Dashboard** | `/portal` | Bento Grid | KPI, AI-insikt, kommende |
| 2.1.2 | **Onboarding** | `/portal/onboarding` | Step Wizard | Første gangs oppsett |
| 2.1.3 | **Profil** | `/portal/profil` | Form Sections | Innstillinger, konto |

### 2.2 Trening & Coaching (6 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 2.2.1 | **Treningsplan** | `/portal/treningsplan` | Week Grid | Personlig ukeplan |
| 2.2.2 | **Treningsøkt Detalj** | `/portal/treningsplan/[sessionId]` | Detail View | Spesifikk økt info |
| 2.2.3 | **Dagbok** | `/portal/dagbok` | Timeline | Loggføring, refleksjon |
| 2.2.4 | **Dagbok Detalj** | `/portal/dagbok/[sessionId]` | Form + Data | Spesifikk logg |
| 2.2.5 | **Coaching Historikk** | `/portal/coaching-historikk` | Timeline | Tidligere sessions |
| 2.2.6 | **AI Coach** | `/portal/ai-coach` | Chat Interface | AI-drevet coaching chat |

### 2.3 Analyse & Data (10 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 2.3.1 | **Statistikk** | `/portal/statistikk` | Charts Dashboard | Hovedstatistikk |
| 2.3.2 | **Ny Runde** | `/portal/statistikk/ny-runde` | Form | Registrere runde |
| 2.3.3 | **Analyse** | `/portal/analyse` | Video + Data | Swing analyse |
| 2.3.4 | **Trackman** | `/portal/trackman` | Data Grid | Trackman metrics |
| 2.3.5 | **Benchmark** | `/portal/benchmark` | Comparison | Sammenligne vs andre |
| 2.3.6 | **Sammenligning** | `/portal/sammenligning` | Comparison Tool | Egne data over tid |
| 2.3.7 | **Tester Oversikt** | `/portal/tester` | Cards Grid | Ferdighetstester |
| 2.3.8 | **Trening Tester** | `/portal/trening/tester` | List View | Testhistorikk |
| 2.3.9 | **Trening Test Detalj** | `/portal/trening/tester/[id]` | Detail + Chart | Spesifikk test resultat |
| 2.3.10 | **Øvelser** | `/portal/trening/ovelser` | Grid + Filter | Øvelsesbibliotek |

### 2.4 Spill & Turneringer (6 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 2.4.1 | **Spill** | `/portal/spill` | Game Interface | Aktivt spill/spillmodus |
| 2.4.2 | **Runde Ny** | `/portal/runde/ny` | Form | Starte ny runde |
| 2.4.3 | **Runde Aktiv** | `/portal/runde/[id]` | Scorecard | Pågående runde scoring |
| 2.4.4 | **Runde Oppsummering** | `/portal/runde/[id]/oppsummering` | Summary Cards | Runde resultat |
| 2.4.5 | **Turneringer** | `/portal/turneringer` | List + Cards | Kommende turneringer |
| 2.4.6 | **Turneringsplan** | `/portal/turneringsplan` | Calendar View | Planlegge turneringer |

### 2.5 Booking & Kalender (4 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 2.5.1 | **Kalender** | `/portal/kalender` | Calendar View | Personlig kalender |
| 2.5.2 | **Bookinger** | `/portal/bookinger` | List View | Mine bookinger |
| 2.5.3 | **Booking Ny (Intern)** | `/portal/bookinger/ny` | Calendar + Slots | Ny booking intern |
| 2.5.4 | **Booking Endre** | `/portal/bookinger/[id]/endre` | Form | Endre eksisterende |

### 2.6 Sosialt & Annet (4 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 2.6.1 | **Sosialt** | `/portal/sosialt` | Feed + Friends | Venner, aktivitetsfeed |
| 2.6.2 | **Bag** | `/portal/bag` | Grid + Detail | Golfbag, køller, specs |
| 2.6.3 | **Apper** | `/portal/apper` | Cards Grid | Integrasjoner, apps |
| 2.6.4 | **Demo** | `/portal/demo` | Feature Showcase | Demo/forklaring |

---

## 🎯 FASE 3: MISSION CONTROL / ADMIN (23 skjermer)

### 3.1 Dashboard & Oversikt (3 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 3.1.1 | **Admin Dashboard** | `/portal/admin` | Dashboard Layout | Inntekter, oversikt, varsler |
| 3.1.2 | **Denne Uken** | `/portal/admin/denne-uken` | Summary View | Ukeoppsummering |
| 3.1.3 | **Focus** | `/portal/admin/focus` | Focus Mode | Fokusert arbeidsmodus |

### 3.2 Elever & Kunder (2 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 3.2.1 | **Elever** | `/portal/admin/elever` | List + Table | Elevliste, progresjon |
| 3.2.2 | **Elev Detalj** | `/portal/admin/elever/[id]` | Detail View | Spesifikk elev info |

### 3.3 Booking & Kalender (5 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 3.3.1 | **Kalender** | `/portal/admin/kalender` | Calendar + Sidebar | Admin timeplan |
| 3.3.2 | **Bookinger** | `/portal/admin/bookinger` | List + Detail | Alle bookinger, filter |
| 3.3.3 | **Ny Booking** | `/portal/admin/bookinger/ny` | Form + Calendar | Opprette ny booking |
| 3.3.4 | **Tilgjengelighet** | `/portal/admin/tilgjengelighet` | Calendar Form | Sette ledig/optatt |
| 3.3.5 | **Kapasitet** | `/portal/admin/kapasitet` | Charts + Grid | Kapasitetsoversikt |

### 3.4 Kommunikasjon (2 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 3.4.1 | **Meldinger** | `/portal/admin/meldinger` | Chat Interface | Innboks, samtaler |
| 3.4.2 | **E-postmaler** | `/portal/admin/e-postmaler` | Template List | Maler for utsending |

### 3.5 Økter & Tjenester (4 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 3.5.1 | **Økter** | `/portal/admin/okter` | List + Calendar | Økt-oversikt |
| 3.5.2 | **Fasiliteter** | `/portal/admin/fasiliteter` | Cards Grid | Anlegg, baner, simulator |
| 3.5.3 | **Fasiliteter Instillinger** | `/portal/admin/fasiliteter/innstillinger` | Form | Konfigurasjon |
| 3.5.4 | **Ny Aktivitet** | `/portal/admin/fasiliteter/ny-aktivitet` | Form Wizard | Legge til ny aktivitet |

### 3.6 Rapportering & AI (4 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 3.6.1 | **Analytics** | `/portal/admin/analytics` | Charts Dashboard | Data og grafer |
| 3.6.2 | **Rapporter** | `/portal/admin/rapporter` | Report Builder | Rapporter generering |
| 3.6.3 | **AI Assistent** | `/portal/admin/ai-assistent` | Chat Interface | AI-verktøy for coach |
| 3.6.4 | **Agenter** | `/portal/admin/agenter` | Cards Grid | AI agenter oversikt |

### 3.7 Administrasjon (3 skjermer)
| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 3.7.1 | **Økonomi** | `/portal/admin/okonomi` | Charts + Table | Inntekter, priser, faktura |
| 3.7.2 | **Godkjenninger** | `/portal/admin/godkjenninger` | List + Actions | Pending approvals |
| 3.7.3 | **Turneringer** | `/portal/admin/turneringer` | List + Form | Admin turneringer |

---

## 🌐 FASE 4: WEBSITE / MARKETING (8 skjermer)

| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 4.1 | **Forside** | `/` | Hero + Cards | Hovedlanding, konvertering |
| 4.2 | **Academy** | `/academy` | Hero + Pricing | Academy program info |
| 4.3 | **Academy Booking** | `/academy/booking` | Calendar + Form | Booking fra academy side |
| 4.4 | **Junior Academy** | `/junior-academy` | Hero + Features | Junior program |
| 4.5 | **Utvikling B2B** | `/utvikling` | Hero + Features | Bedriftsutvikling |
| 4.6 | **Personvern** | `/personvern` | Legal Text | Privacy policy |
| 4.7 | **Portal Preview** | `/portal-preview` | Demo View | Preview/demo av portal |
| 4.8 | **Maintenance** | `/maintenance` | Info Page | Vedlikeholdsside |

---

## 🔐 FASE 5: AUTH (4 skjermer)

| # | Skjerm | Route | Struktur-mønster | Hovedinnhold |
|---|--------|-------|-----------------|--------------|
| 5.1 | **Login** | `/auth/login` | Auth Form | Innlogging |
| 5.2 | **Portal Login** | `/portal/login` | Auth Form | Portal innlogging |
| 5.3 | **Callback** | `/auth/callback` | Loading State | Auth callback |
| 5.4 | **Set Password** | `/auth/set-password` | Form | Nytt passord |

---

## 🎨 Design Tokens (Placeholder/Grayscale)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-page` | `#F5F5F5` | Page background |
| `--bg-card` | `#FFFFFF` | Card surfaces |
| `--bg-sidebar` | `#FAFAFA` | Sidebar |
| `--border` | `#E5E5E5` | Subtle borders |
| `--text-primary` | `#1A1A1A` | Headings |
| `--text-secondary` | `#666666` | Body text |
| `--text-muted` | `#999999` | Labels |
| `--accent` | `#333333` | Placeholder accent |
| `--success` | `#22C55E` | Success states |
| `--warning` | `#F59E0B` | Warning states |
| `--error` | `#EF4444` | Error states |
| `--info` | `#3B82F6` | Info states |

---

## 📐 Struktur-mønstre (Gjenbrukbare)

### Mønster A: Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (64px): Logo + Nav + User Avatar + Notifications     │
├──────────────┬──────────────────────────────────────────────┤
│              │ KPI ROW: 3-4 stat cards with trends          │
│  SIDEBAR     ├──────────────────────────────────────────────┤
│  (240px)     │                                              │
│  - Nav icons │  BENTO GRID (varied card sizes)              │
│  - Labels    │  ┌──────────────────┬──────────────┐        │
│  - User      │  │                  │   KPI CARD   │        │
│  - Quick     │  │   MAIN FEATURE   ├──────────────┤        │
│    actions   │  │   (2fr wide)     │   KPI CARD   │        │
│              │  │                  ├──────────────┤        │
│              │  │                  │   ACTION     │        │
│              │  └──────────────────┴──────────────┘        │
└──────────────┴──────────────────────────────────────────────┘
```
**Bruk:** Admin Dashboard, Spiller Dashboard

### Mønster B: Calendar View
```
┌─────────────────────────────────────────────────────────────┐
│ Toolbar: [Dag] [Uke] [Måned]    [←] April 2026 [→]  [+Ny]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  UKEVISNING:                                                │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┬───────┐
│  │  Man   │  Tir   │  Ons   │  Tor   │  Fre   │  Lør   │  Søn  │
│  │  14    │  15    │  16    │  17    │  18    │  19    │  20   │
│  ├────────┼────────┼────────┼────────┼────────┼────────┼───────┤
│  │ 08:00  │ 08:00  │        │ 08:00  │        │        │       │
│  │ ┌────┐ │ ┌────┐ │        │ ┌────┐ │        │        │       │
│  │ │Event│ │ │Event│ │        │ │Event│ │        │        │       │
│  │ └────┘ │ └────┘ │        │ └────┘ │        │        │       │
│  │ 10:00  │ 10:00  │ 10:00  │ 10:00  │ 10:00  │        │       │
│  ├────────┼────────┼────────┼────────┼────────┼────────┼───────┤
│  │        │        │        │        │        │        │       │
│  └────────┴────────┴────────┴────────┴────────┴────────┴───────┘
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
**Bruk:** Kalender, Booking, Tilgjengelighet

### Mønster C: List + Detail
```
┌────────────────────────────┬─────────────────────────────────┐
│  LIST (35%)                │  DETAIL (65%)                   │
│  ┌──────────────────────┐  │  ┌─────────────────────────────┐│
│  │ 🔍 Search...         │  │  │ Header: Title          [X] ││
│  ├──────────────────────┤  │  ├─────────────────────────────┤│
│  │ Filter: [Alle ▼]     │  │  │ Status: Confirmed     [▲▼] ││
│  ├──────────────────────┤  │  ├─────────────────────────────┤│
│  │ ■ Item 1 (selected)  │  │  │                             ││
│  │   Subtitle           │  │  │  Content sections...        ││
│  │   Badge          ▶   │  │  │                             ││
│  ├──────────────────────┤  │  │                             ││
│  │ □ Item 2             │  │  │  ┌─────────────────────┐   ││
│  │   Subtitle           │  │  │  │ Related info cards  │   ││
│  │   Badge          ▶   │  │  │  └─────────────────────┘   ││
│  ├──────────────────────┤  │  │                             ││
│  │ □ Item 3             │  │  │  ┌─────────────────────┐   ││
│  │   Subtitle           │  │  │  │ Action buttons      │   ││
│  │   Badge          ▶   │  │  │  └─────────────────────┘   ││
│  └──────────────────────┘  │  │                             ││
└────────────────────────────┴─────────────────────────────────┘
```
**Bruk:** Bookinger, Elever, Meldinger

### Mønster D: Wizard/Step Flow
```
┌─────────────────────────────────────────────────────────────┐
│  Step 1 → Step 2 → Step 3 → Step 4                         │
│  [●────] [◌────] [◌────] [◌]                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Current step content                               │   │
│  │                                                     │   │
│  │  [Form/Selection/Calendar]                          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│     [Forrige]                    [Neste] [Fullfør]         │
└─────────────────────────────────────────────────────────────┘
```
**Bruk:** Booking flow, Onboarding, Ny aktivitet

### Mønster E: Hero + Features (Website)
```
┌─────────────────────────────────────────────────────────────┐
│ HERO SECTION (min-height: 70vh)                            │
│ ┌──────────────────────────┬──────────────────────────────┐│
│ │                          │                              ││
│ │  🏆 Hovedoverskrift      │                              ││
│ │                          │     [Hero Image/             ││
│ │  Undertekst som forklarer│      Illustration]           ││
│ │  verdiproposisjonen...   │                              ││
│ │                          │                              ││
│ │  [CTA Primær] [Sekundær] │                              ││
│ │                          │                              ││
│ └──────────────────────────┴──────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ TRUST BAR: Logoer | Stats | Testimonials                   │
├─────────────────────────────────────────────────────────────┤
│ 3-COLUMN FEATURES:                                         │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│ │    ⚡       │  │    🎯       │  │    📊       │         │
│ │   Feature 1 │  │   Feature 2 │  │   Feature 3 │         │
│ │   Icon      │  │   Icon      │  │   Icon      │         │
│ │   Title     │  │   Title     │  │   Title     │         │
│ │   Desc      │  │   Desc      │  │   Desc      │         │
│ └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```
**Bruk:** Forside, Academy, Junior Academy

---

## 🛠️ Prompt-mal per struktur-mønster

### Mal A: Dashboard
```
Create a [ROLE] dashboard for AK Golf Platform.

LAYOUT:
- Fixed header (64px): Logo left, breadcrumb/nav center, notifications + user avatar right
- Collapsible sidebar (240px): [NAV_ITEMS] with icons, user profile card, quick actions
- Main content: 24-32px padding, max-width 1400px

CONTENT STRUCTURE:
- Top row (full width): 3-4 KPI stat cards
  * Large number (tabular-nums)
  * Trend indicator (↑/↓ %)
  * Sparkline mini-chart
  * Label (uppercase, small)
- Main area: Bento grid layout with varied card sizes
  * Large card (2fr): [MAIN_FEATURE] - chart or data table
  * Medium cards (1fr each): [SECONDARY_FEATURES]
  * Small stacked cards: [QUICK_ACTIONS]

COMPONENTS:
- Cards: White #FFF, border 1px #E5E5E5, rounded-[16px] to [20px], padding 24px
- No heavy dividers — use spacing (24px gaps)
- Icons: Lucide style, 1.5pt stroke, consistent sizing
- Charts: Sparklines, progress rings, mini bar charts

TYPOGRAPHY (Inter):
- Page title: 30px/700/-0.025em tracking
- Card titles: 18px/600
- KPI numbers: 32px/800/tabular-nums
- Labels: 12px/600/uppercase/+0.12em tracking
- Body: 16px/400

COLORS (PLACEHOLDER - grayscale):
- Background: #F5F5F5
- Cards: #FFFFFF
- Text primary: #1A1A1A
- Text secondary: #666666
- Text muted: #999999
- Accent: #333333 (placeholder for brand color)
- Success: #22C55E
- Warning: #F59E0B
- Error: #EF4444

INTERACTION:
- Cards: hover translateY(-2px), subtle shadow
- Buttons: hover opacity 0.9
- Respect prefers-reduced-motion

Note: This is a wireframe — focus on layout, spacing, and structure. Not final colors or imagery.
```

### Mal B: Calendar
```
Create a calendar interface for [PURPOSE] in AK Golf Platform.

LAYOUT:
- Toolbar: View toggle [Dag | Uke | Måned], date navigation (← →), "I dag" button, [+ Ny] CTA
- Filter bar below: [Type ▼] [Status ▼] [Coach ▼]

WEEK VIEW (default):
- Header row: 7 columns (Man, Tir, Ons, Tor, Fre, Lør, Søn) with dates
- Time grid: 6am - 10pm in 30-min or 1-hour slots
- Current time indicator (horizontal line, prominent)
- Clickable empty slots for creating new

EVENTS/APPOINTMENTS:
- Visual blocks positioned by time
- Color-coded by type: [TYPE_COLORS]
- Show: Time, Title, optional avatar/picture
- Duration shown by block height
- Hover: subtle highlight
- Click: open detail/edit

DAY VIEW:
- Detailed time grid with more space
- Sidebar with daily summary/stats

MONTH VIEW:
- Traditional calendar grid
- Day numbers top-left
- Event dots or mini-bars
- More events = "+3 more" indicator

COMPONENTS:
- Event chip: rounded-[8px], padding 4-8px
- Today highlight: subtle colored background
- Selected slot: border highlight
- Drag handle for rescheduling

COLORS (PLACEHOLDER):
- Grid lines: #E5E5E5
- Background: #FFFFFF
- Event type A: #333 (placeholder)
- Event type B: #666 (placeholder)
- Today: #F5F5F5 background
```

### Mal C: List + Detail
```
Create a list-detail view for [PURPOSE] in AK Golf Platform.

LAYOUT:
- Two-pane: List 35%, Detail 65% (desktop)
- Mobile: List full width → Detail on selection (back button)

LIST PANE:
- Sticky header:
  * Search input with icon
  * Filter chips row (scrollable horizontally)
  * Sort dropdown
- Scrollable item list:
  * Avatar/icon left (40x40 or 48x48)
  * Title (bold, 16px)
  * Subtitle (muted, 14px)
  * Status badge right (pill shape)
  * Chevron/arrow far right
  * Selected: background shift, left border accent
  * Hover: subtle background shift

DETAIL PANE:
- Sticky header:
  * Title (large)
  * Primary action button(s)
  * Close/back (mobile)
- Status bar: Current state + quick actions
- Content sections (scrollable):
  * Section labels (uppercase, small, muted)
  * Formatted data
  * Related info cards (small grid)
- Bottom action bar (sticky or at end)

EMPTY STATES:
- List empty: Illustration + "Ingen items" + CTA
- Detail empty: "Velg et item fra listen"

INTERACTIONS:
- Click list item → smooth transition, update detail
- Search → filter in real-time
- Keyboard navigation (↑↓ to navigate, Enter to select)

COLORS (PLACEHOLDER):
- List hover: #FAFAFA
- Selected: #F0F0F0 with left border #333
- Borders: #E5E5E5
```

### Mal D: Booking Flow Wizard
```
Create step [N] of the booking wizard for AK Golf Platform.

STEP 1 - KATEGORI/TYPE:
- Header: Progress indicator (Step 1 of 4)
- Grid: 3-4 large category cards
  * Icon (48px)
  * Title (bold, 20px)
  * Short description
  * Price range (optional)
  * "Velg" button or whole card clickable
- Selected state: border highlight, checkmark

STEP 2 - TIDSPUNKT:
- Header: Progress (Step 2 of 4), tilbake button
- Calendar widget (month view, selectable dates)
- Available dates: highlighted
- Time slot grid:
  * Morning (08:00-12:00)
  * Afternoon (12:00-17:00)
  * Evening (17:00-20:00)
- Each slot: time, availability indicator
- Selected: prominent highlight

STEP 3 - DETALJER:
- Header: Progress (Step 3 of 4)
- Form fields: [RELEVANT_FIELDS]
- Summary sidebar: Running total, what's included

STEP 4 - BEKREFTELSE:
- Success animation/icon (large)
- Booking summary card:
  * Service type
  * Date & time
  * Location
  * Price breakdown
  * Add to calendar button
- CTA: "Se min booking" / "Book ny"
- Secondary: Share, Print

COLORS (PLACEHOLDER):
- Progress active: #333
- Progress inactive: #CCC
- Success: #22C55E
- Selected: #333 border
```

---

## 🚀 UTFØRELSE

### Per-fase workflow:
1. **Generate batch** (2-4 skjermer samtidig)
2. **Poll for results** (håndter MCP timeouts)
3. **Review i workbench/** - sjekk struktur
4. **Iterate** hvis nødvendig
5. **Flytt til review/** når struktur OK
6. **Fortsett til neste batch**

### Batch-størrelser:
- **Fase 1 (Booking):** 3-4 skjermer per batch = 3-4 batches
- **Fase 2 (Portal):** 3-4 skjermer per batch = 8-11 batches
- **Fase 3 (Admin):** 3-4 skjermer per batch = 6-8 batches
- **Fase 4 (Website):** 2-3 skjermer per batch = 3 batches
- **Fase 5 (Auth):** 2 skjermer per batch = 2 batches

---

## 📊 FREMDRIFT

| Fase | Skjermer | Batches | Status | Ferdig |
|------|----------|---------|--------|--------|
| 1: Booking | 13 | 4 | ⬜ | 0% |
| 2: Portal | 33 | 11 | ⬜ | 0% |
| 3: Admin | 23 | 8 | ⬜ | 0% |
| 4: Website | 8 | 3 | ⬜ | 0% |
| 5: Auth | 4 | 2 | ⬜ | 0% |
| **Total** | **81** | **28** | | **0%** |

---

## 🎯 NESTE STEG

**Fase 1.1: Booking Forside & Veileder** (2 skjermer)
- 1.1.1 Booking Forside
- 1.1.2 Veileder

**Bekreft:** Starte generering av Fase 1.1?

---

**Plan versjon:** 2.0  
**Sist oppdatert:** April 6, 2026  
**Basert på:** 78 page.tsx filer i kodebasen
