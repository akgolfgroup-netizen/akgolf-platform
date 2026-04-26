# Branch Triage — 2026-04-26

Generert etter MBA-sync-verifisering. Alle lokale branches uten remote-spor er allerede pushet til `origin/audit/*` som backup. **Ingenting er slettet eller merget enda** — denne filen er beslutningsgrunnlaget.

## Status main
- `main` = `origin/main` (clean, ingen uncommitted)
- HEAD: `89db8b7 feat(ai): integrer MCP-server, skills, kvalitet og whitelabel`

## Backup pushet til origin/audit/* (sikret mot tap)
| Lokal branch | Backup-branch på origin |
|---|---|
| `feature/coachhq-v2` (6 commits, ikke pushet før) | `origin/audit/coachhq-v2` |
| `backup/kimi-uncommitted-snapshot-2026-04-23` | `origin/audit/kimi-snapshot-2026-04-23` |
| `feat/ai-coach-backend` | `origin/audit/ai-coach-backend` |
| `feat/ai-coach-frontend` | `origin/audit/ai-coach-frontend` |

## Triage-tabell (anbefaling per branch)

Legend: **M** = merge til main, **R** = rebase + PR review, **K** = behold som feature, **D** = slett (stale/duplisert)

| Branch | Commits / Real | Filer | Sist | Anbefaling | Begrunnelse |
|---|---|---|---|---|---|
| `claude/frontend-design-TQRoN` | 11 / 11 | 50 | 78 min | **R** | Booking-v2 7-stegs wizard, smart packing — aktivt arbeid. Bør gjennom PR pga. ny arkitektur. Overlapper potensielt med `feature/booking-slot-fix` på `lib/portal/booking/*` |
| `claude/add-workout-summary-j6qWr` | 8 / 4 | 61 | 54 min | **R** | Treningsplan forslag-modus, AK-pyramide, 3 nye Prisma-migrasjoner. Aktivt — superset av `feature/training-planner` |
| `feature/booking-slot-fix` | 12 / 10 | 25 | 19 t | **M** | P1/P2/P3-fixer: deterministisk Stripe-idempotency, atomisk SQL-RPC for quota, dynamisk slot-telling, waitlist-UI, reconcile-CRON. Høy verdi, ferdig. Konflikt-sjekk mot `claude/frontend-design-TQRoN` først |
| `feature/facility-booking` | 8 / 8 | 24 | 23 t | **R** | GFGK fasilitets-bookingkart. Endrer `prisma/schema.prisma` — krever review. Overlapper sannsynligvis med `claude/facility-booking-map-DeK3T` |
| `claude/facility-booking-map-DeK3T` | 1 / 1 | 9 | 30 t | **D** etter sjekk | Sannsynligvis erstattet av `feature/facility-booking` (8 commits, samme tema) |
| `fix/revert-destructive-sync` | 3 / 2 | 83 | 24 t | **M** | Lint-fixer + workflow-fix. Lavt risiko, høyt antall filer pga. mange små lint-rettinger. Bør på main |
| `feature/heritage-design-rewrite` | 3 / 3 | 23 | 23 t | **D** | Heritage-tokens er DEPRECATED etter Brand Guide V2.0-rebrand 2026-04-25. Sjekk om commits inneholder noe ikke-Heritage-spesifikt før sletting |
| `feature/go-live-checklist` | 2 / 1 | 3 | 24 t | **M** | Liten doc-update + sync. Trygg å merge |
| `feature/training-planner` | 4 / 0 | 49 | 23 t | **D** | Kun `wip: sync`-commits, ingen real commits. Filer er superset i `claude/add-workout-summary-j6qWr`. Slett etter at workout-summary er merget |
| `audit/coachhq-v2` | 6 / 4 | 158 | 3 d | **D** etter sjekk | Lokalt MBA-arbeid: 4 fixer (training-plan-card, weekly-stats, log-session-modal, portal-preview). Sjekk om disse fixene er allerede inkludert via `feature/coachhq-rebrand` (PR #11 merget). Hvis ja: slett |
| `audit/kimi-snapshot-2026-04-23` | 1 / 1 | 329 | 4 d | **D** | Kimi-snapshot fra før CoachHQ-rebrand. Sannsynligvis 100% superseded av merget rebrand. Behold som backup-branch i 30 dager før sletting |
| `audit/ai-coach-backend` | 1 / 1 | 19 | 13 d | **K** eller **D** | 13 dager gammelt. Sjekk om AI coach-backend allerede er på main via Sprint 2-6 (lib/portal/ai/*) |
| `audit/ai-coach-frontend` | 1 / 1 | 12 | 13 d | **K** eller **D** | 13 dager gammelt. Sjekk overlapp mot eksisterende AI-coach UI |
| `feature/coachhq-rebrand` | ? | ? | — | **D** | Allerede merget via PR #11 (`Merge pull request #11 from akgolfgroup-netizen/feature/coachhq-rebrand`) |
| `feature/drill-of-the-day` | ? | ? | — | **K** | Sjekk status separat |
| `feature/feature-flags` | ? | ? | — | **K** | Sjekk status separat |
| `feature/landing-pages` | ? | ? | — | **K** | Sjekk — hovedmål for natten er landing-rewrite, kan være verdifull |
| `feature/realtime-mission-board` | ? | ? | — | **K** | Sjekk status separat |
| `feature/statistics-improvements` | ? | ? | — | **K** | Sjekk status separat |
| `feature/stripe-idempotency` | ? | ? | — | **D** | Trolig allerede på main via `feature/booking-slot-fix` |
| `feature/trackman-ai-insights` | ? | ? | — | **K** | Sjekk status separat |
| `feature/waitlist` | ? | ? | — | **D** | Trolig erstattet av waitlist i `feature/booking-slot-fix` |
| `feature/web-push` | ? | ? | — | **K** | Sjekk status separat |

## Konflikt-soner

Disse filene endres av flere ikke-mergede branches → må håndteres i riktig rekkefølge:

| Fil | Branches |
|---|---|
| `prisma/schema.prisma` | `claude/add-workout-summary-j6qWr`, `feature/facility-booking`, `feature/training-planner`, `fix/revert-destructive-sync` |
| `lib/portal/booking/*` | `feature/booking-slot-fix`, `claude/frontend-design-TQRoN` |
| `app/globals.css` | `audit/kimi-snapshot-2026-04-23` (alene — lavrisiko) |
| `WORKLOG.md` | Flere — løses ved manuell merge til main først |

## Anbefalt merge-rekkefølge

1. **`fix/revert-destructive-sync`** først — fjerner lint-feil som blokkerer andre rebases
2. **`feature/booking-slot-fix`** — P1/P2/P3-fixer er kritiske
3. **`feature/go-live-checklist`** — trivielt
4. **`claude/frontend-design-TQRoN`** rebases mot oppdatert main → PR review → merge
5. **`claude/add-workout-summary-j6qWr`** rebases → PR review → merge (inkl. 3 Prisma-migrasjoner)
6. **`feature/facility-booking`** rebases → PR review → merge
7. Slettinger: `feature/training-planner`, `feature/heritage-design-rewrite`, `claude/facility-booking-map-DeK3T`, `audit/*` etter verifikasjon

## Verifisering før hver merge
- `git fetch origin && git rebase origin/main` på branch
- `npm run lint && npx tsc --noEmit` lokalt
- Manuell smoke-test av berørt flyt (booking, treningsplan, etc.)
- Push og opprett PR — la CI kjøre før merge

## Sletteliste (etter Anders' godkjenning)

Lokale stale branches som kan slettes uten remote-tap:
- `cleanup-backup-20260415-004137` (0 commits ahead)
- `worktree-agent-a11cdb7e`, `-a3e4bae8`, `-a83b0d83`, `-a88307cb`, `-a90e6799`, `-acce01de` (alle samme SHA, 2 uker gamle)
- `feature/coachhq-v2`, `feat/ai-coach-backend`, `feat/ai-coach-frontend`, `backup/kimi-uncommitted-snapshot-2026-04-23` (etter at audit-backup på origin er bekreftet)

## Hva gjenstår — neste sesjon

Anders går gjennom denne fila og gir GO/NO-GO per branch. Selve mergingen og slettingene kjøres i en separat sesjon (ikke nå — denne sesjonen er kun verifisering).
