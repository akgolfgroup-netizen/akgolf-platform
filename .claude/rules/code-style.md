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

### Design tokens (Brand Guide V2.0 · 2026)

Se `docs/ART-DIRECTION.md` for komplett visuell spesifikasjon.

Kjernefarger (Brand Guide V2.0):
- Primary: #005840 (--color-primary) — hovedfarge, bakgrunner
- Accent: #D1F843 (--color-accent-cta) — CTA-knapper, uthevinger
- Surface: #ECF0EF (--color-surface) — bakgrunner, kort
- Text: #324D45 (--color-text) — brodtekst, overskrifter
- Muted: #A5B2AD (--color-muted) — hjelpetekst, rammer

Semantikk: Success=#2A7D5A, Error=#B84233, Warning=#C48A32 (Brand Guide V2.0 §04).
AI: Lilla #AF52DE (--color-ai).

**ALDRI bruk:** `--color-gold`, `--apple-gold-*`, `#B07D4F`, `--color-ink-*`, `--hg-*`, #2D6A4F (gammel brand), #34C759 (gammel success), #FF3B30 (gammel error), #FF9500 (gammel warning), #1D1D1F (gammel svart)

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
