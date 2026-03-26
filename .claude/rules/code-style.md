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

### Design tokens (Brand System v5.0 Final)
Definert i `globals.css` med `@theme inline`:
```css
--color-navy: #000000;         /* Svart */
--color-gold: #B07D4F;         /* Bronse */
--color-ink-deep: #000000;     /* Svart */
```

### Sub-brand farger (Monokrom + Signal)
| Side | Aksent |
|------|--------|
| Academy | Bronse #B07D4F |
| Software | Blå #38BDF8 |
| Utvikling | Grønn #10B981 |

### Font
Manrope via `next/font/local` — ALDRI importer fra Google Fonts direkte.

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
