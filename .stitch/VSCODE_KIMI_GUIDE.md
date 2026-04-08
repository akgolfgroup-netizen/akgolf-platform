# Bruke Stitch Design i VSCode + Kimi

**Stitch Design Generation Workflow for AK Golf Platform**

---

## Quick Start

### 1. Åpne Stitch i VSCode/Kimi

```bash
cd /Users/anderskristiansen/Developer/akgolf/akgolf-platform
npm run kimi
```

I Kimi-terminalen:
```
/login
/project /Users/anderskristiansen/Developer/akgolf/akgolf-platform
```

### 2. Velg stitch-design skill

```
Du: "Bruk stitch-design skill"
Kimi: [Aktiverer stitch-design]
```

### 3. Beskriver skjermen du vil ha

```
"Generer ein dashboard-screen for Academy-elever med:
- Quick stats row (4 KPI cards med sparklines)
- Upcoming bookings section
- AI insight card
- Training plan preview
- Bruk AK Golf design system (.stitch/DESIGN.md)"
```

Stitch analyserer `.stitch/DESIGN.md` og genererer ein professional screen som:
- Bruker korrekt fargepalett
- Inter-typografi med rett skalering
- Bento-grid med variasjon
- AK Golf branding

### 4. Sjekk og refiner

Stitch viser eit preview. Du kan deretter:
- "Zoom in on the stat cards"
- "Change the background to grey"
- "Add an AI recommendation card"
- "Export as React component"

---

## Brukseksempler

### Eksempel 1: Lag ein Dashboard

**Prompt:**

```
"Generer Academy-dashboard-screen basert på .stitch/DESIGN.md

Layout:
- Hero section: Greeting + ai-insight card (top)
- Bento grid:
  * 2 large stat cards (score, handicap with sparklines)
  * 1 medium card (upcoming booking)
  * Small cards: streak, last session
- Secondary section: Quick actions (training, analyze, book)

Includes:
- Proper color system from DESIGN.md
- No identity grid (use bento variation)
- Data-driven: show trends, not bare numbers
- Mobile responsive"
```

**Output:** Stitch genererer ein professional Academy-dashboard med design consistency.

### Eksempel 2: Portal Admin Coaching Session View

**Prompt:**

```
"Generer Coaching Session detail screen for Mission Control Admin (/portal/admin/okter)

Screen:
- Header: Coach name, date, session length
- Session details:
  * Trainee name + image
  * Duration
  * Notes/transcript (if available)
  * TrackMan stats (if recorded)
- Action buttons: Edit, mark completed, send feedback

Style:
- Use Mission Control color scheme
- AI recommendation card if applicable
- Proper typography hierarchy
- Responsive design"
```

**Output:** Admin-screen for coaching session management.

### Eksempel 3: Marketing Website Landing Page

**Prompt:**

```
"Generer Academy landing page hero section

Include:
- Large headline (52px, weight 800)
- Subheading + CTA button 'Book coaching' (green pill)
- Feature grid below:
  * Professional coaching card
  * Personal progress tracking card
  * AI-powered insights card
- Background: Dark (#1D1D1F) with accent green
- Responsive layout"
```

**Output:** Compelling hero section for marketing.

---

## Screenshots → Generation

Når du laster opp screenshots:

```
Du: "Analyser denne Academy-booking-screenshot og generer 2 alternativer

Screenshot: [booking-flow-current.png]

Krav:
- Følg AK Golf design system (.stitch/DESIGN.md)
- Improved UX for mobile (larger touch targets)
- Keep the flow logical (service → date/time → confirm)
- Use proper color system (not random colors)"
```

Stitch:
1. Analyserer screenshotet
2. Verifiserer mot design system
3. Genererer 2 alternative designs
4. Alle følger AK Golf brand guide

---

## Design System Integration

Stitch leser automatisk `.stitch/DESIGN.md` og bruker den som "source of truth". Denne filen inkluderer:

✅ Komplett fargpalett (med CSS-variabler)
✅ Typography scale (alle størrelser, vekter, letter-spacing)
✅ Button styles (alle typer)
✅ Card layouts (stat cards, feature cards, etc.)
✅ Grid system (bento, responsive)
✅ Component library (nav, forms, badges)
✅ Animation rules
✅ Content rules (terminologi, MVA-regler, etc.)
✅ Mobile/PWA spesifikkasjoner

Så når du ber Stitch generere ein screen, kan du referere til designsystemet:

```
"Lag ein marketing-seksjon basert på .stitch/DESIGN.md → Buttons → CTA 'Book'

Use:
- Hero Display typografi
- Green pill button
- Dark background
- Feature cards in bento layout"
```

---

## Konvertering til React

Etter at Stitch har generert ein screen, kan du konvertere den til React:

```
Du: "Konverter denne Stitch-screenen til React-komponent

Bruk:
- Tailwind CSS (fra globals.css)
- Design tokens som CSS-variabler
- Lucide icons (ikke emojis)
- TypeScript
- Responsive breakpoints"
```

**react-components skill** vil generere:
```tsx
export interface DashboardProps {
  stats: StatCard[];
  bookings: Booking[];
  aiInsight?: AIInsight;
}

export default function Dashboard({ stats, bookings, aiInsight }: DashboardProps) {
  // Fully typed, accessible, responsive component
  // With proper styling from globals.css
}
```

---

## Workflow Tips

1. **Start med design rules.** Bruk `.stitch/DESIGN.md` som baseline.
2. **Batch generation.** Lag 3-5 screens på eingang, refiner iterativt.
3. **Screenshot + design.** Og ha screenshots for inspirasjon + design rules for konsistens.
4. **Version screens.** Stitch lagrer versjonar — du kan easy gå tilbake.
5. **Export often.** Få React-komponenter, PNG, Figma-file osv.

---

## Filer å ha open

- `.stitch/DESIGN.md` — Design system reference
- `docs/ART-DIRECTION.md` — Brand guide
- `.kimi/AKGOLF_INSTRUCTIONS.md` — Prosjektkontekst

Gi Stitch kontekst ved å referere til disse filene i prompter.

---

## Shortcuts i Kimi

```
# List available Stitch commands
/help stitch-design

# Generate from screenshot
"Upload [screenshot.png] and generate variations"

# Convert to component
"Export as React component"

# Get color codes
"Show color system from DESIGN.md"

# View guidelines
"Show typography rules"
```

---

**Last Updated:** April 6, 2026
