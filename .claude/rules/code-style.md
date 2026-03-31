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

Monokrom Apple-inspirert design. **Ingen aksent-farger** (ingen bronse/gull):
```css
--color-black: #1D1D1F;       /* Tekst, logo, knapper */
--color-white: #FFFFFF;        /* Bakgrunn */
--color-grey-100: #F5F5F7;    /* Sekundær bakgrunn */
--color-grey-200: #E8E8ED;    /* Borders, dividers */
--color-grey-400: #86868B;    /* Muted text */
--color-grey-500: #6E6E73;    /* Secondary text */
--color-grey-900: #1D1D1F;    /* Primary text */
```

### Farger — KUN monokrom
| Element | Farge |
|---------|-------|
| Primær tekst | `#1D1D1F` (svart) |
| Sekundær tekst | `#6E6E73` (grey-500) |
| Borders | `#E8E8ED` (grey-200) |
| Bakgrunn | `#FFFFFF` (hvit) |
| Sekundær bg | `#F5F5F7` (grey-100) |
| Knapper primær | `#1D1D1F` bg, `#FFFFFF` tekst |
| Success | `#34C759` |
| Error | `#FF3B30` |

**ALDRI bruk:** `--color-gold`, `--apple-gold-*`, `#B07D4F` (bronse), `--color-ink-*` (dark theme)

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
