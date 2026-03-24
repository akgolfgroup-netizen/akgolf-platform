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

### Design tokens
Definert i `globals.css` med `@theme inline`:
```css
--color-navy: #0F2950;
--color-gold: #B8975C;
--color-ink-deep: #0A1929;
```

### Sub-brand farger
| Side | Accent |
|------|--------|
| Academy | Navy #0F2950 |
| Junior | Blue #3B82F6 |
| Utvikling | Green #22C55E |

### Font
Inter via `next/font/local` — ALDRI importer fra Google Fonts direkte.

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
