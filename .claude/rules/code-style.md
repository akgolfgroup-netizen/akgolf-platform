# Kodestil — AK Golf Website/Portal

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

### Design tokens (Brand Guide 2026 — Apple Light)

**Offisiell kilde:** `Google Drive/AK Golf Group/ak-golf-academy/branding/2026/design-tokens.css`

Se `docs/ART-DIRECTION.md` for komplett visuell spesifikasjon.

Farger: "Sort. Hvit. En gronn." — #1D1D1F base + AK Green #2D6A4F (brand).
Semantikk: Success=#34C759, Error=#FF3B30, Warning=#FF9500 (Apple-standard).
AI: Lilla #AF52DE (--color-ai). Logo-prikk: Gra #D2D2D7 som default.

**ALDRI bruk:** `--color-gold`, `--apple-gold-*`, `#B07D4F` (bronse), `--color-ink-*`, #2D6A4F for success

### Font
Inter via `next/font/google` — definert i `app/layout.tsx`.

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
