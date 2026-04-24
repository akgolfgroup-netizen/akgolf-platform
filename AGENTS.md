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

## Arbeidslogg (OBLIGATORISK)

Ved avslutning av HVER sesjon SKAL du skrive arbeidslogg til Obsidian:

```bash
~/Developer/scripts/obsidian-logg.sh "<prosjektnavn>" "<verktoy>" "<sammendrag>"
```

- `<prosjektnavn>`: Mappenavnet (f.eks. `akgolf-platform`, `wang-toppidrett`)
- `<verktoy>`: `claude-code`, `kimi-code`, eller `manus`
- `<sammendrag>`: Hva ble gjort, beslutninger tatt, neste steg

Eksempel:
```bash
~/Developer/scripts/obsidian-logg.sh "akgolf-platform" "claude-code" "Fikset booking-datofeil. Neste: deploy til prod."
```

Hvis Obsidian ikke er tilgjengelig, skriv direkte til `~/ak-brain/Arbeidslogg/`.

## Design & Frontend
- `.claude/rules/design-system.md` er ENESTE autoritative kilde for farger, typografi, spacing, komponenter (Heritage M3)
- Ikke bruk noen filer under `docs/archive-2026-04-24/` eller `docs/archive-2026-04-21/` — de er arkivert pre-Heritage
- Nye sider: sett sammen eksisterende komponenter fra `components/ui/` og `components/portal/`
- Ingen hardkodede hex-koder. Bruk `--color-*` CSS-variabler eller Tailwind-tokens

## Workflow
1. Sjekk `docs/component-library.md` for du bygger nye komponenter
2. Sjekk `prisma/schema.prisma` for modeller og enums
3. Markedsside-tekst i `lib/website-constants.ts`, aldri hardkodet
