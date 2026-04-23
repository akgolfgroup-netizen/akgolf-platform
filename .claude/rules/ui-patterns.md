# UI Patterns — AK Golf Platform

Designspråk: Apple-minimalistisk. Data snakker — ikke dekorasjon. Hvit pusterom. Store tall. Subtile kort.

Les `design-system.md` for farger, tokens og typografi. Denne filen beskriver MÅL-mønstre og komponentoppskrifter.

---

## PORTAL — Spillerportal (Light Mode)

Canvas: `bg-grey-50` (#F5F8F7) eller `bg-white`.
Alle kort: `bg-white rounded-xl shadow-card` med `p-5` eller `p-6`.
Ingen borders på kort med mindre det er semantisk (aktiv, valgt, feil).

### Stat-kort (primærmønster)

Brukes på: Dashboard, Statistikk, Benchmark, Analyse.

```
┌─────────────────────┐
│ Label (caption)      │  ← text-muted, text-xs, font-medium
│                      │
│ 84.2                 │  ← text-4xl font-bold text-black tracking-tight
│                      │
│ −2.1 siste 30d       │  ← text-sm, grønn/rød basert på positiv/negativ
└─────────────────────┘
```

Regler:
- Label øverst, alltid. Kort, beskrivende. Ingen ikon i label.
- Nøkkeltall er visuelt dominerende — `text-3xl` til `text-5xl`, `font-bold`.
- Kontekstlinje under tallet bruker semantisk farge: `text-success` for positiv, `text-error` for negativ.
- Aldri mer enn 3 informasjonsnivåer per kort (label → tall → kontekst).
- Kortene legges i 2-kolonne grid på mobil, 4-kolonne på desktop: `grid grid-cols-2 lg:grid-cols-4 gap-4`.

### Strokes Gained-bar (horisontalt)

```
┌─────────────────────────────────────────┐
│ STROKES GAINED                          │  ← uppercase label, text-xs, font-semibold, tracking-wider
│                                         │
│ Tee      ██████████░░░░░░░░  +1.2       │  ← bar: bg-success, verdi: text-success
│ Approach ██████░░░░░░░░░░░░  +0.4       │
│ Short    ████████████░░░░░░  -1.8       │  ← bar: bg-error, verdi: text-error
│ Putting  ████░░░░░░░░░░░░░░  -0.6       │
└─────────────────────────────────────────┘
```

Regler:
- Kategori til venstre (`text-sm font-medium text-text`).
- Bar i midten: `h-2 rounded-full`. Positiv = `bg-success`, negativ = `bg-error`. Bakgrunn: `bg-grey-100`.
- Verdi til høyre: `font-semibold`, fargekodet.
- Ingen akseetiketter, ingen y-akse. Baren ER visualiseringen.

### Ukesvelger (treningsplan)

```
┌──────────────────────────────────────┐
│ Ma  [Ti]  On   To   Fr   Lø   Sø    │
│  7    8    9   10   11   12   13     │
│  •    •         •         •          │  ← grønn prikk = har aktivitet
└──────────────────────────────────────┘
```

Regler:
- Horisontalt, 7 dager. `flex gap-2`.
- Valgt dag: `bg-black text-white rounded-xl` (dark pill).
- Ikke valgt: `bg-white text-text rounded-xl`.
- Aktivitetsprikk: `w-1.5 h-1.5 rounded-full bg-success` under tallet.
- Dagsnavn (`text-xs text-muted`) over dato (`text-base font-semibold`).

### Øvelsesliste (treningsplan)

```
┌─────────────────────────────────────────┐
│ DAGENS ØKT                              │  ← uppercase label
│                                         │
│ [ikon]  Pitch 20-40 meter      20 min   │
│         Variert avstand, 30 baller      │
│ ─────────────────────────────────       │
│ [ikon]  Chip rundt green        25 min   │
│         3 posisjoner, opp-og-ned        │
└─────────────────────────────────────────┘
```

Regler:
- Hvert element: `flex items-start gap-4 py-4`. Separator: `border-b border-grey-100`.
- Ikon: `w-10 h-10 rounded-xl bg-grey-50 flex items-center justify-center` med Lucide-ikon.
- Tittel: `text-base font-semibold text-black`.
- Beskrivelse: `text-sm text-muted`.
- Tid/varighet: `text-sm text-muted` høyrejustert.

### Dashboard Widget-grid

Desktop: `grid grid-cols-12 gap-6`. Kort spenner 3, 4, 6, eller 12 kolonner.
Tablet: `grid grid-cols-6 gap-4`.
Mobil: `grid grid-cols-1 gap-4` (stablet).

Standard widget-høyder: la innholdet bestemme. Ingen fixed heights.

---

## PORTAL — Spillerprofil-kort (dashboard)

```
┌───────────────────────┐
│ [bilde]               │
│                       │
│ Erik Hansen           │  ← text-xl font-bold
│ Oslo Golfklubb        │  ← text-sm text-muted
│                       │
│ HCP    RUNDER         │
│ 14.2     24           │  ← inline stat-par
│                       │
│ [Rediger Profil]      │  ← secondary button
└───────────────────────┘
```

---

## PORTAL — Neste coaching / Neste booking

```
┌─────────────────────────────────────┐
│ NESTE COACHING                      │  ← uppercase label
│                                     │
│ Tirsdag 15. april, kl. 10:00       │  ← text-base font-semibold
│ Oslo Golfklubb · Simulator 3       │  ← text-sm text-muted
└─────────────────────────────────────┘
```

Aksent: bruk `bg-accent-cta` pill/badge for status eller som hover-indikator, aldri som hel kortfarge.

---

## PORTAL — AI-innsikt-kort

```
┌─────────────────────────────────────┐
│ [✨ ikon]  AI-INNSIKT               │  ← bg-ai-light, text-ai-text
│                                     │
│ "Kort spill er ditt største         │
│  potensial"                         │  ← text-sm, italic
│                                     │
│ SG: -2.1  |  Putts: +1.4  |  ...   │  ← inline mini-stats
│                                     │
│ [Se øvelse →]                       │  ← text-ai link
└─────────────────────────────────────┘
```

Regler:
- ALLTID `bg-ai-light` bakgrunn og `text-ai-text` tekst.
- Aldri andre lilla-nyanser. AI har sin egen fargezone.
- Ikon: Lucide `Sparkles`, aldri Material Icons.

---

## PORTAL — TrackMan Data-kort

```
┌─────────────────────────────────────┐
│ TRACKMAN DRIVER DATA                │
│                                     │
│ CLUB SPEED    CARRY     SMASH       │
│ 142 mph       245 m     2150       │  ← store tall, unit i text-muted
│                                     │
│ [~~~ waveform svg ~~~]              │  ← animert linje for live-feel
└─────────────────────────────────────┘
```

---

## MISSION CONTROL (Admin) — Dark Sidebar Variant

CoachHQ bruker PORTALEN sin light-mode canvas (`bg-grey-50`) MED en mørk sidebar.

### Sidebar
- Bredde: `w-[220px]` (var `--mc-sidebar-width`).
- Bakgrunn: `bg-black` (#0A1F18).
- Aktiv nav-item: `bg-white/10 text-accent-cta border-l-4 border-accent-cta`.
- Inaktiv: `text-white/60 hover:text-white/90 hover:bg-white/5`.
- Logo øverst: AK Golf logo i hvitt.
- CTA-knapp i bunn: `bg-accent-cta text-black rounded-xl font-bold`.

### Topbar
- Høyde: `h-14` (`--mc-topbar-height: 56px`).
- Bakgrunn: `bg-white border-b border-grey-100`.
- Tab-navigasjon: `text-sm font-medium`. Aktiv: `text-primary border-b-2 border-primary`.

### Innholdsområde
- Samme kort-regler som portal (light mode kort på light canvas).
- MC-spesifikke kort kan bruke divisjonsfarger som venstre-stripe: `border-l-4 border-[--mc-color-coaching]`.

---

## MARKEDSSIDE — Premium Editorial

### Hero
- Full bredde, sentrert tekst.
- Label over overskrift: `text-xs uppercase tracking-widest text-muted`.
- Overskrift: Hero-preset (60px, 700, tight tracking). Bruk font-weight kontrast — del av teksten i `font-light text-muted`, resten `font-bold text-black`.
- Undertekst: `text-lg text-muted max-w-2xl mx-auto`.
- CTA: `bg-primary text-white` pill-knapp med ikon.

### Seksjoner
- Romslige: `py-24 md:py-32`.
- Maks bredde innhold: `max-w-[1120px] mx-auto`.
- Veksle mellom hvit og `bg-surface` bakgrunn per seksjon.

### Feature-kort (markedsside)
- Større enn portal-kort: `rounded-2xl p-8 md:p-10`.
- Kan bruke subtil gradient eller bilde-bakgrunn.
- Tekst: H3 + body, ikke stat-tall.

---

## GENERELLE REGLER

### Aldri
- Aldri gradients på portal-kort (kun markedsside).
- Aldri mer enn 2 ikoner synlig per kort.
- Aldri fargede bakgrunner på hele kort — kun hvit/grey-50. Farge brukes i prikker, badges, barer, tekst.
- Aldri skroll-snapping eller fancy scroll-effekter i portalen.
- Aldri tabeller i portalen — bruk kort eller lister. Tabeller kun i CoachHQ for data-tunge views.

### Alltid
- Kort har `rounded-xl shadow-card`. Hover: `shadow-card-hover` med `transition-shadow duration-300`.
- Mellomrom mellom kort: `gap-4` (mobil), `gap-6` (desktop).
- Loading state: skeleton med `bg-grey-100 animate-pulse rounded-lg`.
- Empty state: Sentrert ikon + tekst + CTA. Aldri bare "Ingen data".
- Alle tall bruker `tabular-nums` for alignment.

### Farge-bruk i portalen
- Hvitt og grått: 85% av flaten.
- Primary (#005840): Nav, sidebar, primær-knapper, lenker. Maks 10%.
- Accent-CTA (#D1F843): KUN på aktive CTA-knapper og streak/gamification-elementer. Maks 5%.
- Semantiske farger: Kun i kontekst — success/error på tall, barer, badges.
- AI lilla: Kun på AI-kort og AI-funksjoner. Aldri mikset med andre farger.
