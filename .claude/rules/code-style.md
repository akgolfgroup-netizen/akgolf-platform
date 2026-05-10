# Kodestil — AK Golf HQ

## TypeScript

### ALDRI bruk `any`
```typescript
// FEIL
const data: any = await fetch(...)

// RIKTIG — definer typer
interface BookingSlot {
  id: string;
  startTime: Date;
  instructorId: string;
}
```

## Komponent-organisering

### Markedsside-komponenter
```
components/website/
├── AKLogo.tsx          # K-mark logo
├── WebsiteNav.tsx      # Navigasjon
├── WebsiteFooter.tsx   # Footer
├── ApplicationForm.tsx # Søknadsskjema
└── ...
```

### Portal-komponenter
```
components/portal/
├── admin/              # Admin-spesifikke
├── booking/            # Booking-relaterte
├── layout/             # Sidebar, topbar
└── ui/                 # Fancy UI-effekter
```

## Innhold

### Markedsside-tekst
All tekst i `lib/website-constants.ts` — ALDRI hardkodet i komponenter:
```typescript
// RIKTIG
import { HERO_CONTENT } from "@/lib/website-constants";
<h1>{HERO_CONTENT.title}</h1>

// FEIL
<h1>Bli en bedre golfer</h1>
```

### Språk
- All brukervendt tekst på norsk bokmål
- Bruk æ, ø, å korrekt
- Engelske brand-uttrykk OK (f.eks. "The Foundation Method")

## Styling

### Design tokens (Heritage M3 · 2026-04-19)

Se `.claude/rules/design-system.md` for komplett Heritage-spesifikasjon, kildebilder og pattern-bibliotek.

Kjernefarger (Heritage M3):
- Primary: `#154212` (skogsgrønn) — `--color-primary`
- Primary container: `#2d5a27` — portal-sidebar bg, `--color-primary-container`
- Accent: `#d2f000` (lime) — `--color-secondary-fixed`
- Surface: `#fdf9f0` (kremhvit) — `--color-surface`
- On surface: `#1c1c16` (brun-sort) — `--color-on-surface`
- Admin MC-sidebar: `emerald-950` / `#022c22`

**ALDRI bruk:** `#005840`, `#D1F843`, `#ECF0EF`, `--color-accent-cta`, `--color-gold`, `--apple-gold-*`, `--color-ink-*`, `--hg-*`, `--color-portal-*`, `shadow-portal-*`, `#2D6A4F` (gammel brand), Inter-font, Lucide-ikoner.

### Font
DM Sans (body/heading) + JetBrains Mono (tall) via `next/font/google`. Material Symbols Outlined for ikoner.

## Animasjoner

Bruk Framer Motion wrappers fra `components/motion/`:
```typescript
import { FadeIn, SlideUp } from "@/components/motion";

<FadeIn>
  <Card>...</Card>
</FadeIn>
```

## Server Actions

I portal-sider, plasser i `actions.ts`:
```
app/portal/(dashboard)/bookinger/
├── page.tsx
├── actions.ts    ← "use server"
└── components/
```
