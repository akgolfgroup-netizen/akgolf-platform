# Regler for AI-assistenter

Les alltid `.claude/rules/gotchas.md` for du skriver kode.
Les `.claude/rules/design-system.md` for UI-oppgaver — dette er ENESTE gjeldende design-system.

1. Les for du skriver — alltid les eksisterende filer for endring
2. Minimale endringer — kun det som er nodvendig
3. Folg eksisterende monster — match stil og konvensjoner
4. Test endringene — kjor `npx tsc --noEmit` for commit
5. Spor ved usikkerhet — ikke gjett pa krav
6. Oppdater gotchas.md — nar du oppdager nye feller
7. Aldri `git add -A` — bruk spesifikke filnavn

## Design & Frontend
- `.claude/rules/design-system.md` er ENESTE autoritative kilde for farger, typografi, spacing, komponenter
- Ikke bruk `docs/DESIGN_SYSTEM.md`, `docs/DESIGN.md` eller andre arkiverte filer
- Nye sider: sett sammen eksisterende komponenter fra `components/ui/` og `components/portal/`
- Ingen hardkodede hex-koder. Bruk `--color-*` CSS-variabler eller Tailwind-tokens

## Workflow
1. Sjekk `docs/component-library.md` for du bygger nye komponenter
2. Sjekk `prisma/schema.prisma` for modeller og enums
3. Markedsside-tekst i `lib/website-constants.ts`, aldri hardkodet
