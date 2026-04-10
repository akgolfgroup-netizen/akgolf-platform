# Gotchas — AK Golf Platform

**Les denne før du skriver kode.** Se `prisma-auth.md` for Prisma/auth-regler.

## Turbopack
`next.config.ts` MÅ ha `turbopack: { root: import.meta.dirname }`.

## Auth
- Bruk `proxy.ts` (ikke middleware.ts) for auth-redirects. Nye beskyttede ruter MÅ legges til der.
- `requirePortalUser()` i server components er backup, ikke primær guard.
- API-ruter MÅ ha `getPortalUser()` + `checkRateLimit()`. Aldri reflekter brukerinput i feilmeldinger.

## Font
Inter via `next/font/google`. Ikke lokal font-fil.

## Priser
- Database lagrer **kroner** (ikke øre). Vis direkte, aldri del på 100.
- Stripe forventer øre: `service.price * 100`.
- Aldri vis MVA på kundevendte sider.

## CSS / Design — Brand Guide V2.0
- Én `app/globals.css` for hele appen. Aldri lag globals.css i undermapper.
- Bruk kun offisielle tokens. Aldri `--color-gold`, `--apple-gold-*`, `--color-ink-*`.
- Grey-skala: `--color-grey-100` (#ECF0EF) til `--color-grey-900` (#0A1F18). Grønn-tonet, ikke nøytral.
- Primary: #005840 (--color-primary). Accent/CTA: #D1F843 (--color-accent-cta). Aldri bruk gamle #2D6A4F.
- Success: `--color-success` (#2A7D5A). Error: `--color-error` (#B84233). Warning: `--color-warning` (#C48A32). AI: `--color-ai` (#AF52DE).
- Heritage Grid er DROPPET. Aldri bruk `--hg-*` variabler. Aldri dark mode.
- Aldri bruk emojier. Bruk Lucide-ikoner.

## Komponenter
- Lucide icons kan ikke sendes som props fra Server → Client Components. Bruk `iconName` string + ICON_MAP.
- Client components skal aldri importere filer med `import { prisma }`. Splitt til `*-types.ts` + `*-service.ts`.
- TS enum includes(): Bruk `const arr: EnumType[] = [...]` eller helper-funksjon.

## Innhold
- Markedsside-tekst i `lib/website-constants.ts`, aldri hardkodet.
- Aldri vis trenersertifiseringer (PGA, TrackMan, TPI, etc.).
- Anders-pakker: Performance 1600 kr/mnd (2x20min), Performance Pro 2000 kr/mnd (4x20min), Gruppe 900 kr/mnd (2x60min).
- Markus-pakker: Express 550 kr/mnd (2x20min), Express Pro 1000 kr/mnd (4x20min), First Tee 1295 kr (kurs).
- Flex = enkeltbetaling uten binding. Flex 20/50/90 + Duo-varianter + Banecoaching 9 hull.
- Portal: Abo-pakker = lopende. Gruppe/Express/First Tee = 3 mnd. Flex/Bane = 1 mnd fra oktdato.

## Mission Control
- Admin: `/portal/admin/` med RBAC via `canAccessMissionControl()` og `canAccessMCPage()`.
- Roller: ADMIN (alt), INSTRUCTOR (coaching), INVITED (begrenset).
- All instruktør-funksjonalitet i Portal Admin. Ikke opprett separate dashboards.

## Oppdater dokumentasjon ved strukturelle endringer
Endre kode + oppdater docs = én atomisk operasjon.
