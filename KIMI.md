# AK Golf Platform — Kimi Context

## Tech Stack
Next.js 16, React 19, TypeScript, Tailwind CSS v4, Prisma, Supabase, Stripe

## Viktige regler
- Server Actions i actions.ts per rute
- Prisma singleton: `import { prisma } from "@/lib/portal/prisma"`
- Norsk bokmål for all brukervendt tekst
- "Sort. Hvit. Én grønn." — design-system
- Aldri emojier, aldri MVA på kundesider

## Mappestruktur
- Landing: app/landing/, components/website/
- Booking: app/booking/, components/booking/
- Portal: app/portal/(dashboard)/, components/portal/
- Admin: app/admin/, components/portal/admin/

## Kommandoer
npm run dev      # Dev server
npm run build    # Prod build
npm run lint     # ESLint
npm run test     # Vitest
