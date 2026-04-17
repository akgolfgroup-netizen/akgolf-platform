# Design Context — AK Golf Platform

Generated: 2026-04-17

---

## App Overview

AK Golf Platform er en Next.js 16 / React 19 / Tailwind v4-applikasjon som består av tre distinkte overflater som deler én kodebase og én database:

1. **Markedsside** (`/`, `/academy`, `/junior-academy`, `/utvikling`, `/booking`) — åpen for alle, driver akkvisisjon
2. **Spillerportal** (`/portal/(dashboard)/*`) — innlogget spillerflate for treningsplanlegging, dagbok, statistikk, booking, AI-coach, TrackMan-analyse
3. **Mission Control** (`/portal/admin/*`) — instruktør/admin-arbeidsstasjon med mørk sidebar

Plattformen bygger på **Treningspyramiden** (FYS → TEK → SLAG → SPILL → TURN) — utviklet av **Norges Golfforbund** og satt i system gjennom **AK Golf sin coaching-filosofi** (15 år med 1-til-1 coaching). Portalen integrerer TrackMan, DataGolf, Stripe, Supabase Auth, Resend og Anthropic Claude (sistnevnte som AI-veiledning, ikke som produktets identitet).

---

## Strategic Priorities (styrer wireframe-prioritering)

| Flate | Rolle i forretningsmodell | Prioritet | Primær målgruppe |
|-------|---------------------------|-----------|------------------|
| **Markedsside** | Akkvirerer NYE brukere (eksisterende kunder booker direkte) | **P0 — kritisk nå** | Golfere 30–60 som ikke kjenner Anders fra før |
| **Portal** | Fremtidig hovedinntekt (SaaS-skalering fra coaching) | **P1 — strategisk** | Freemium → Pro/Elite-abonnenter |
| **Mission Control** | Operativ effektivitet som beskytter coaching-marginen | **P2 — støtte** | Anders + trenere internt |

**Kritisk innsikt:** Markedssiden skal selge **portal først, coaching sekundært**. Eksisterende coaching-kunder kjenner Anders personlig og booker direkte (via SMS, e-post, word-of-mouth) — de trenger ikke konverteres via nettsiden.

---

## Brand & Naming (ufravikelig)

### Merkevare vs. produktnavn — ikke bland sammen

| Rolle | Navn | Bruk |
|-------|------|------|
| **Merkevare / selskap** | AK Golf | Logo, om oss, fotavtrykk |
| **Produkt (digitalt)** | Portalen | Treningsplan, dagbok, statistikk, booking |
| **Tjeneste (fysisk)** | Personlig coaching | 1-til-1 økter med Anders og team |
| **Pedagogisk fundament** | Treningspyramiden | FYS → TEK → SLAG → SPILL → TURN |
| **Opphav til pyramiden** | Norges Golfforbund (NGF) | Krediter NGF ved hver bruk |
| **Metodisk rammeverk** | AK Golf sin coaching-filosofi | 15 års erfaring med NGF-pyramiden i 1-til-1 coaching |

### ALDRI bruk

- ❌ "AK-formelen" — feilattribusjon; metoden (pyramiden) er NGF sin
- ❌ "AK Portal" — dobbelt-branding; si bare "Portalen"
- ❌ "AK Coaching" — si "Personlig coaching"
- ❌ "AK Plattform" — si "Portalen"
- ❌ "AI-drevet plattform" som hovedbudskap — AI er ett verktøy blant flere

### BRUK

- ✅ "AK Golf" (merkevare, logo)
- ✅ "Portalen" (produktet)
- ✅ "Personlig coaching" (tjenesten)
- ✅ "Treningspyramiden (Norges Golfforbund)" eller "NGF sin treningspyramide" (metoden — alltid med NGF-kreditering)
- ✅ "AK Golf sin coaching-filosofi" (AK's bidrag: 15 års implementering og tilpasning av NGF-metoden)
- ✅ "AI-veiledning" (nedtones — én av flere funksjoner)

### Verdihierarki (hva som selges først)

1. **AK Golf sin coaching- og treningsfilosofi** — det faktiske som gir resultater (Anders' erfaring og metode)
2. **Treningspyramiden fra NGF** — etablert rammeverk metoden bygger på
3. **Portalen** — leveringskanalen (digital)
4. **AI-veiledning** — ett av flere verktøy i Portalen, ikke produktets identitet

### Godkjent hero-retning (for markedsside)

**Variant B — struktur-first:**
> **Slutt å trene tilfeldig. Begynn å trene med struktur.**
> AK Golf sin coaching-filosofi og Treningspyramiden fra Norges Golfforbund, samlet i Portalen. Runde-data, TrackMan og AI-veiledning gjør planen din personlig.

---

## Target Platform

**Desktop / Web (primary) + Responsive (required)**

- Markedsside og portal er desktop-first, men må fungere feilfritt på mobil (iPhone/Android)
- Mission Control er kun desktop (admin-arbeidsstasjon, 1280px+)
- Breakpoints: `sm:` 640px, `md:` 768px, `lg:` 1024px, `xl:` 1280px
- Mobile nav: fullskjerm drawer for markedsside, bottom sheet / slide-out for portal

---

## Visual Direction per Surface (tema-beslutning)

### Markedsside — "Editorial Hybrid" (Mercury-stil)

- **Base:** Light (`#F6F5F2` cream, ikke ren `#FFFFFF`)
- **Strategiske dark-seksjoner** (2–3 stk) for dramatikk: Treningspyramiden-seksjon (NGF-metode), CTA-band før pricing, footer
- **Accent:** Lime `#D1F843` for CTA-knapper og highlights
- **Typografi:** Inter (kan senere suppleres med display-font type Arcadia/Fraunces/Reckless for H1)
- **Hero-komposisjon:** Stort portal-screenshot i device-mockup (ikke illustrasjon) — forskning viser +80% konvertering
- **Primær CTA:** `"Kom i gang gratis"` (lime pill) — +47% konvertering vs `"Sign up"`
- **Sekundær CTA:** `"Møt teamet"` eller `"Book coaching"`

### Portal — "Clean Apple-minimalisme" (light mode)

- **Base:** Hvit (`#FFFFFF`) med grey-50 (`#F5F8F7`) som canvas
- **Kort:** `bg-white rounded-xl shadow-card p-5` eller `p-6`
- **Accent:** Lime `#D1F843` KUN på aktive CTA-knapper, streaks, gamification
- **Primary:** Mørk grønn `#005840` for nav, logo, primary-knapper
- **AI-features:** Lilla `#AF52DE` på egen sone (`bg-ai-light`, `text-ai-text`)
- **Data-visualisering:** SG-barer grønn/rød semantisk, inline i kort
- **Referanser:** The Athletic (`ref-01`), Nixtio HR (`ref-02`)

### Mission Control — "RonDesignLab TMS-stil" (dark topbar, light body)

- **Topbar/sidebar:** Mørk grønn/svart (`#0A1F18` eller `#242524`)
- **Hovedflate:** Hvit med strategiske data-tunge kort
- **Store KPI-tall** (4xl+) som dominerende visuelt element
- **3D-rendret hero-element** på key dashboards (som XPO's lastebil) — gir "sjel" til interne verktøy
- **Høyre drawer-panel** for kontekst/aksjoner (RonDesignLab-mønster)
- **Gantt-chart/tidslinje** for booking-oversikt
- **Accent:** Lime `#D1F843` for aktive pills og CTA (swapped fra XPO's lilla)
- **Referanser:** XPO TMS av RonDesignLab (`ref-04` — eksakt målstil), Cardiology (`ref-03`)

---

## Design Tokens (fra `lib/design-tokens.ts` + `app/globals.css`)

### Core colors

| Token | Hex | Bruk |
|-------|-----|------|
| `primary` | `#005840` | Logo, nav, primær-knapper |
| `primary-alt` | `#00594C` | Hover |
| `primary-soft` | `#E6F3F1` | Lett tint bakgrunn |
| `accent-cta` | `#D1F843` | CTA-knapper, highlights, lime-glow |
| `accent-cta-text` | `#0A1F18` | Tekst PÅ lime bakgrunn |
| `surface` | `#ECF0EF` | Seksjonsbakgrunner |
| `background-beige` | `#fdf9f0` | Varm alternativ bakgrunn (editorial) |
| `text` | `#324D45` | Brødtekst |
| `muted` | `#A5B2AD` | Sekundærtekst |
| `black` | `#0A1F18` | Mørkeste grønn / dark-seksjoner |
| `white` | `#FFFFFF` | Hvit bakgrunn |

### Grey scale (grønn-tonet)

`grey-50 #F5F8F7` · `grey-100 #ECF0EF` · `grey-200 #D5DFDB` · `grey-300 #A5B2AD` · `grey-400 #7A8C85` · `grey-500 #5A6E66` · `grey-600 #3D5249` · `grey-700 #324D45` · `grey-800 #1A3529` · `grey-900 #0A1F18`

### Semantic

`success #2A7D5A` · `success-light #E8F5EF` · `error #B84233` · `error-light #FCEAE8` · `warning #C48A32` · `warning-light #FDF4E4` · `info #007AFF` · `ai #AF52DE` · `ai-light #FAF5FF`

### Radius

`rounded-lg 8px` (små elementer) · `rounded-xl 16px` (kort, `--radius-card`) · `rounded-[20px]` (pill-knapper) · `rounded-full` (badges, pills)

### Shadows

`shadow-sm` · `shadow-card` (default for kort) · `shadow-card-hover` · `shadow-md` (dropdowns) · `shadow-lg` (modals)

---

## Typography

**Font:** Inter via `next/font/google`, variable 300–700, CSS-variabel `--font-inter`. Påført `<body>` i `app/layout.tsx`. Ingen andre fonter i dag.

**Mulig fremtidig display-font:** Arcadia, Fraunces, eller Reckless Neue for markedssidens H1 (gir editorial-tyngde). Må vurderes separat.

**Presets (bruk disse, ikke ad-hoc):**

| Preset | Størrelse | Vekt | Tracking | Line-height |
|--------|-----------|------|----------|-------------|
| Hero | 60px | 700 | -0.02em | 1.1 |
| H1 | 36px (48px for landing) | 700 | -0.025em | 1.2 |
| H2 | 30px (32px) | 700 | -0.01em | 1.25 |
| H3 | 24px | 600 | -0.01em | 1.3 |
| H4 | 20px | 600 | 0 | 1.4 |
| Body | 16px | 400 | 0 | 1.7 |
| Body Small | 14px | 400 | 0 | 1.6 |
| Label | 12px | 600 | 0.12em (uppercase) | 1.5 |
| Caption | 12px | 400 | 0 | 1.5 |

---

## Layout Patterns

### Portal (dashboard)

- Desktop: `grid grid-cols-12 gap-6` eller flex-layouts med `max-w-[1200px] mx-auto`
- Tablet: `grid grid-cols-6 gap-4`
- Mobil: `grid grid-cols-1 gap-4` (stacked)
- Widgets: 3, 4, 6, eller 12 kolonner
- Vertikal spacing mellom rader: `space-y-5`

### Mission Control

- Dark sidebar `w-[220px]` (`--mc-sidebar-width`)
- Topbar `h-14` (`--mc-topbar-height: 56px`)
- Innholdsområde: light canvas (`bg-grey-50`), samme kort-regler som portal
- MC-spesifikke kort kan ha divisjonsfarget venstre-stripe

### Markedsside

- Max-width `max-w-[1440px]` (hero) eller `max-w-[1120px]` (innhold)
- Seksjonsspacing: `py-20` (mobil) → `py-24` (tablet) → `py-28` (desktop)
- Container padding: `px-4` → `px-6` → `px-8`
- Feature-kort større enn portal: `rounded-2xl p-8 md:p-10`

---

## Navigation

### Markedsside (`components/website/WebsiteNav.tsx`)
- Fixed nav, `h-[48px]`, transparent på hero → hvit+backdrop ved scroll
- Links fra `lib/website-constants.ts` (NAV_LINKS): Coaching, Academy, Junior Academy, Utvikling
- CTA: `"Book coaching"` pill i lime
- Mobile: animert hamburger → fullskjerm-overlay

### Portal (`components/portal/layout/sidebar.tsx`)
- 6 nav-items: Oversikt, Planlegg, Tren, Spill, Analyser, + mer
- Aktiv: `bg-black text-white rounded-xl`
- Inaktiv: `text-grey-400 hover:bg-grey-50`
- Lucide-ikoner (LayoutDashboard, ClipboardList, Target, Flag, TrendingUp)
- SubNavTabs for sub-seksjoner

### Mission Control
- Dark sidebar (`bg-black` / `#0A1F18`), hvit/muted tekst
- Aktiv: `bg-white/10 text-accent-cta border-l-4 border-accent-cta`
- CTA i bunn: `bg-accent-cta text-black rounded-xl font-bold`
- Topbar under sidebar: hvit med tab-nav

---

## Page Types

### Markedsside — Forside (`/`)

**Mål:** Konvertere til portal-signup (primært) eller coaching-booking (sekundært).

**Struktur (Mercury-inspirert hybrid):**
1. **Hero (light)** — Headline + dashboard-screenshot i device-mockup + lime "Kom i gang gratis" CTA + sekundær "Se demo"
2. **Trust bar** — "Brukt av X golfere som har senket HCP med Y slag i snitt"
3. **Produktoversikt (light)** — "Alt du trenger for å bli bedre" — 4–6 feature-kort med ikon
4. **Treningspyramiden (DARK)** — Dramatisk mørk seksjon med pyramide-visualisering + forklaring (NGF-metode, AK Golf sin filosofi)
5. **Hvordan det fungerer (light)** — 3-stegs flyt: "Registrer → Følg planen → Se progresjon"
6. **Case studies (light)** — Før/etter av spillere (HCP-transformasjoner), kvote + bilde
7. **CTA-band (DARK)** — "Klar til å trene smartere?" + stor lime "Kom i gang gratis"
8. **Pricing (light)** — Tier-sammenligning: Gratis / Starter / Pro / Elite
9. **Coaching (light, sekundært spor)** — "Vil du ha personlig coaching? Møt teamet" → link til team
10. **Footer (DARK)** — Minimalistisk, få linker

**Key elements:**
- Hero H1: 60–72px, tracking-tight, klar standpunkt (ikke feature-liste)
- Device-mockup med portal-screenshot (viser ekte dashboard)
- Lime CTA-pill overalt — konsistent
- Prestasjonsbevis (tall, transformasjoner) før feature-liste

### Portal — Dashboard (`/portal`)

**Mål:** 5-sekunders oversikt + aksjonerbare insights.

**Struktur:**
- Velkomstheader + next booking (hero-kort med coral gradient)
- Ukekalender (7 dag-pills)
- KPI-rad (Handicap, Runder, Treningsøkter)
- Widget-rad (TrackMan, Sosialt, AI Insights, Prestasjoner, Snarveier)
- Coach Insight-kort

**Personalisering per tier:**
- `beginner`: skjul TrackMan, vis Training Activity
- `pro/advanced`: vis AI Insights, TrackMan, Sosialt

### Mission Control — Dashboard (`/portal/admin`)

**Mål:** Operativ oversikt + hurtigaksjoner for instruktører.

**Struktur (XPO TMS-inspirert):**
- Dark topbar med tab-nav (Oversikt / Bookinger / Elever / Kalender / Rapporter)
- KPI-rad med STORE tall (8 KPIer, 4-kolonne)
- Divisjons-bokser (Coaching / Junior / GFGK)
- Alerts-liste
- Inntektstrend (line chart)
- Dagens schedule (hurtigvisning)
- Høyre drawer (valgfri): Detaljpanel for aktiv booking/elev

### Mission Control — Kalender (`/portal/admin/kalender`)

**Struktur:**
- Ukevisning med gantt-lignende timeline (som XPO's bunn-seksjon)
- Fargekodede events per status/elev
- Klikk event → høyre drawer med detaljer + aksjoner
- Dra-og-slipp for reschedule

---

## Interaction Patterns

### Framer Motion

- Standard easing: `[0.4, 0, 0.2, 1]` (premium apple)
- Entrance: `EASE_ENTRANCE = [0.16, 1, 0.3, 1]`
- Spring: `[0.34, 1.56, 0.64, 1]`
- Durations: 200ms (fast) / 300ms (normal) / 500ms (slow)
- Stagger-pattern for lister: `staggerChildren: 0.06`, `item: y: 12, duration: 0.4`

### Modals

shadcn Dialog. Eksempler: `AddFriendDialog`, `LogSessionModal`, `UpgradeModal`. Styled med portal-palett (white bg, rounded-xl, shadow).

### Forms

`useBookingWizard` hook for multi-step booking. Sannsynlig `react-hook-form` for single-form sider. Wizard-progress øverst, enkelt steg om gangen.

### Button states

| Type | Styling |
|------|---------|
| Primary | `bg-primary text-white rounded-[20px]` → hover: `bg-primary-alt` |
| CTA (lime) | `bg-accent-cta text-accent-cta-text rounded-[20px]` |
| Secondary | `border border-grey-200 text-text rounded-[20px]` → hover: `bg-grey-50` |
| Ghost | `text-text rounded-[20px]` → hover: `bg-grey-50` |
| Danger | `bg-error text-white rounded-[20px]` |

---

## Content Hierarchy

### Kort-anatomi

1. **Label** (top) — `text-muted text-xs font-medium uppercase tracking-wide` — kategori/kontekst
2. **Verdi/tittel** — `text-3xl/4xl font-bold text-black tracking-tight tabular-nums`
3. **Kontekstlinje** — `text-sm text-success/error` — trend, endring
4. Maks 3 informasjonsnivåer per kort

### Stat-kort (portal + MC)

`grid grid-cols-2 lg:grid-cols-4 gap-4` — 4 kort i rad, label øverst, stort tall dominerer, trend under.

### Premium-prinsipper (`.claude/rules/premium-design-patterns.md`)

- Layered shadows (min 2 lag)
- Borders: rgba, ikke solid hex (`border-black/6` default)
- Inner gradient på kort for dybde (`::before` pseudo)
- Typografisk hierarki: min 3 nivåer innenfor samme kort
- Hover: kun `translateY(-1px)`, aldri mer (aldri `scale` på kort)
- Accent-lime: maks 2–3 elementer per skjerm

---

## Screenshot Observations

### `ref-01-portal-dashboard.png` — The Athletic (portal-referanse)

- **Layout:** Venstre sidebar (profil + 6 nav-items + CTA i bunn) + 3-kolonne bento-grid
- **Hero-kort (midten øverst):** "Good morning, Alex" + svak grønn-tint bakgrunn
- **Pro Status-kort (høyre):** Mørk (sort/primary) med brukerprofil — kontrast til resten
- **Next Session-kort:** Coral/rød farget (ikke lime) — gir varme
- **AI Insights-kort:** Hvit med grønn "NEW" badge
- **Ukekalender:** 7 dager horisontalt, aktiv dag = mørk grønn pill
- **KPI-kort:** Store tall (+1.2, 24, #3, 5 Days)
- **CTA:** Lime "Book Session"-knapp i sidebar-bunn
- **Match til AK Golf:** 95% — farge-DNA er nesten identisk (mørk grønn + lime + hvit base)
- **Bruk som:** Primær portal-dashboard-referanse

### `ref-02-player-dashboard-nixtio.png` — Nixtio HR (alternativ player-ref)

- **Layout:** Top-nav (ikke sidebar) + bento-grid med 3D-style kort
- **Accent:** Mørk blå (#2D4AE8) med hvit base
- **Onboarding-kort:** Mørk med gradient, progressbarer i lys blå
- **KPI-rad:** Horisontale pills med prosent-endringer
- **Progress-visualisering:** Stolpediagram + donutchart
- **Bruk som:** Alternativ referanse hvis vi vurderer top-nav i stedet for sidebar

### `ref-03-mission-control-cardiology.png` — Cardiology (MC-referanse, alternativ)

- **Layout:** Gul/lime bakgrunn rundt dashboardet (inne er hvit/lys)
- **Timeline-element:** Horisontale event-kort ("Blood Pressure", "Symptoms") med ikon + snittverdier
- **Pill-nav:** 6 tabs øverst (Treatment Dynamics, Visits, Medications, Labs, Allergies, Genetics)
- **Bunnstripe:** Ikonverktøylinje
- **Bruk som:** Inspirasjon til tidslinje-mønstre i MC, IKKE primær stil-referanse

### `ref-04-dashboard-trucks.png` — XPO TMS (MC-referanse, PRIMÆR)

- **Layout:** Dark topbar + tab-nav pills øverst + hvit hovedflate + høyre drawer-panel
- **Hero-element:** Stor 3D-rendret lastebil (gir "sjel" til interne verktøy)
- **KPI-row:** Store tall (7,340kg · 120 · 62) med fargede badges
- **Tab-nav:** Rounded pills, aktiv = dark fill, inaktiv = transparent
- **Høyre panel:** "Load Planning" settings-drawer — kontekst/aksjoner
- **Gantt-chart (bunn):** Horisontale tidslinje-barer (lilla i original, SWAPPES til lime for AK)
- **Radius:** 16–20px på kort
- **Accent:** Lilla `#1C62E2` → **mapper til lime `#D1F843` for AK**
- **Designer:** Stan D. for RonDesignLab ⭐️ (studio-stil: "Aesthetic Effectiveness")
- **Bruk som:** PRIMÆR målstil for hele Mission Control (bekreftet av bruker "100% sånn jeg vil ha det")

### Mercury.com (markedsside-referanse, scrapet live)

- **Base:** `#F6F5F2` (cream, ikke ren hvit) + text `#2A2924`
- **Typografi:** Arcadia/Arcadia Display — H1 72px, H2 48px, body 24px — ekstremt stor hero
- **Accent:** Periwinkle blå `#5266EB` — tilsvarende AK's lime-funksjon
- **Knapp-radius:** 32–40px (stor pill)
- **Seksjonsrytme (14 seksjoner):**
  1. Hero (light) med stor H1 + dashboard-visual + e-post-input CTA
  2. Trust-bar ("Loved by 300K+")
  3. Produktoversikt (light) — "Alt du gjør med penger. Ett sted."
  4. Feature-seksjon (light) — 4 features med bilde + video + beskrivelse (alternerende)
  5. Testimonial (Supabase CEO)
  6. Value-props (light) — "Get started fast"
  7. Dollar-fokus (light) — "Stop losing money to fees"
  8. Operasjonell (light) — "Run your business like a seasoned pro"
  9. Stats-rad (light) — 300K+, 1 in 3, $20B+, 4.9
  10. Security (light)
  11. Testimonials (light) — 3 kort med store portrettbilder
  12. Press (light) — Fortune, WSJ, Fast Company logoer
  13. Final CTA (light) — "Banking redesigned"
  14. For business + personal (split)
  15. Footer
- **Bruk som:** Eksakt seksjonsrytme og tonefall for AK Golf-markedsside, bortsett fra at AK bruker 2–3 DARK-seksjoner (Treningspyramiden + CTA-band + footer) for å skape hybrid-drama.

---

## UX Conventions

### Innhold

- **Språk:** Norsk bokmål for all brukervendt tekst — konsekvent, alltid. Aldri engelsk.
- **Tekst-konstanter:** Markedssidetekst lever i `lib/website-constants.ts` — aldri hardkodet i komponenter.
- **Aldri:** Emojier (bruk Lucide-ikoner), dark mode i portal, trenersertifiseringer (PGA, TrackMan, TPI), MVA på kundesider.
- **Brand voice:** "Sort. Hvit. Én grønn." — premium, presis, resultat-orientert. Ingen løfter om "bli proff på 6 uker".

### CTA-tekst (basert på forskning)

- **Primær:** `"Kom i gang gratis"` (+47% vs "Sign up")
- **Sekundær:** `"Se hvordan"` / `"Se demo"` / `"Møt teamet"`
- **Portal-interne:** `"Logg trening"`, `"Book time"`, `"Se progresjon"`

### Sosial proof

- Prestasjonsbevis > feature-lister. Atleter konverterer 2.4x høyere på "HCP 22 → 14 på 6 måneder" enn på "AI-drevet treningsplan".
- Testimonials med bilde + navn + konkret resultat slår generelle sitater.

### Tier-visning (portal-monetisering)

- Visitor (gratis) → Starter → Pro → Elite
- Midterste tier får "Mest populær"-badge (+40% velger den)
- Månedlig/årlig-toggle med "Spar X%" på årlig

### Konsistens mellom flater

- Portal + MC = 100% light mode (ingen dark mode i produkt nå)
- Markedsside = light-first med 2–3 dark-seksjoner (hybrid)
- Accent-lime `#D1F843` = konsistent identitetsmarkør overalt

---

## Priority for Wireframing (rekkefølge)

1. **Markedsside — Forside** (`/`) — driver nå-inntekt + portal-akkvisisjon
2. **Markedsside — Pricing-seksjon** (separat fokus, eller del av forside)
3. **Portal — Dashboard** (redesign-vurdering basert på "The Athletic"-ref)
4. **Mission Control — Dashboard** (P2, men viktig for AK's effektivitet)
5. **Mission Control — Kalender/Bookinger** (XPO-gantt-stil)

---

## Open Questions (å avklare før wireframing)

1. **Display-font for markedsside:** Beholde Inter overalt, eller introdusere en display-font (Arcadia/Fraunces/Reckless) KUN for markedssidens H1?
2. **Portal dark-mode på sikt:** Skal Pro/Elite-tier få valgfri dark-mode som premium-opplevelse?
3. **Coaching-posisjonering på forsiden:** "Møt teamet" (soft), eller egen pricing-kolonne side om side med portal-tiers (hard)?
4. **Sub-brand differensiering:** Skal Academy / Junior Academy / Utvikling ha distinkte fargeaksenter på markedssiden, eller holde én enhetlig AK-identitet?
