# Handover — Fase C4 (View-system tech)

> **Fra:** Claude Code (sesjon 2026-04-18)
> **Til:** Kimi Code (eller neste sesjon)
> **Status:** Wireframing 100 % ferdig (Fase A-C3). Klar til å starte Fase C4 — view-system implementering.

---

## Hva er gjort i denne sesjonen

### Fase A — Plan-oppdatering ✓
- `wireframe/MASTER_WIREFRAME_PLAN.md` v2.0 oppdatert
- 58 wireframes dokumentert + 22 nye lagt til (N01-N22)

### Fase B — compare.html ✓
- `wireframe/scripts/generate-compare.mjs` skrevet
- 80 av 80 wireframes har nå `compare.html`

### Fase C1 — Funksjonsdekning ✓
- `wireframe/FUNCTION_COVERAGE.md` skrevet (108 Prisma-modeller, 140 API-ruter, gap-analyse)

### Fase C2 — Views godkjent ✓
- `wireframe/WINNERS-archive-2026-04-18.md` (M1-M6 vinner-valg)
- `wireframe/VIEWS.md` (alle 58 godkjent: alle 5 views aktive, default via onboarding)

### Fase C3 — 22 nye wireframes ✓
- N01 Utvikling-progresjon (`wireframe/1704-nye-utvikling-progresjon/`)
- N02 Konkurranseforberedelse (`wireframe/1704-nye-konkurranse-prep/`)
- N03 Onboarding magic-link (`wireframe/1704-nye-onboarding-magic-link/`)
- N04 Coaching-meldinger (`wireframe/1704-nye-coaching-meldinger/`)
- N05 Foreldre-dashboard (`wireframe/1704-nye-foreldre-dashboard/`)
- N06 Treningstimer (`wireframe/1704-nye-trening-volum/`)
- N07 Sesongplan (`wireframe/1704-nye-sesongplan/`)
- N08 Rangering (`wireframe/1704-nye-rangering/`)
- N09 Turneringsresultater (`wireframe/1704-nye-turnering-resultater/`)
- N10 E-post-kampanjer (`wireframe/1704-nye-email-kampanjer/`)
- N11 Øvelsesbank (`wireframe/1704-nye-ovelses-bank/`)
- N12 Admin task-board (`wireframe/1704-nye-admin-oppgaver/`)
- N13 Helse (`wireframe/1704-nye-helse/`)
- N14 Utstyrsinventar (`wireframe/1704-nye-utstyrsinventar/`)
- N15 Tilbud-manager (`wireframe/1704-nye-tilbud-manager/`)
- N16 Mental trender (`wireframe/1704-nye-mental-trender/`)
- N17 Nedgangs-varsler (`wireframe/1704-nye-varsler-nedgang/`)
- N18 Turnering påmeldte (`wireframe/1704-nye-turnering-pameldte/`)
- N19 Periodisering (`wireframe/1704-nye-periodisering/`)
- N20 Module Add-ons (`wireframe/1704-nye-moduler/`)
- N21 Content Studio (`wireframe/1704-nye-content-studio/`)
- N22 Mental Performance Profile (`wireframe/1704-nye-mental-profil/`)

**Totalt: 80 wireframes** (58 eksisterende + 22 nye)

---

## Beslutninger som er tatt (godkjent av Anders)

1. **Alle 5 views aktive per portal/MC-skjerm** — ikke vinner-valg
2. **Default settes i onboarding** — bruker velger (fallback Opt 1)
3. **Drag-drop widget-dashboard** (Notion-stil) — komplekst, men matchet ambisjonsnivå
4. **Markedsside = vinner-valg** (besøkere har ikke konto)
5. **Alle 22 nye skjermer i scope**

---

## Hva som gjenstår — Fase C4 (NESTE)

### Implementasjonsplan (5 steg)

#### Steg 1: Prisma `UserPreferences`-modell
Legg til i `prisma/schema.prisma`:

```prisma
model UserPreferences {
  id                    String   @id @default(cuid())
  userId                String   @unique
  defaultViewPerScreen  Json     @default("{}")
  dashboardWidgetLayout Json     @default("{}")
  hiddenWidgets         Json     @default("[]")
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  User                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Legg til relasjon på `User`:
```prisma
UserPreferences UserPreferences?
```

Kommandoer:
```bash
cd ~/Developer/akgolf/akgolf-platform
npx prisma migrate dev --name add_user_preferences
npx prisma generate
```

**VIKTIG:** Verifiser SQL i migration-fil før `prisma migrate deploy` på prod. Anders må godkjenne før prod-migration.

#### Steg 2: View-switcher infrastruktur
- `lib/portal/views/registry.ts` — mapping skjerm → tilgjengelige views
- `lib/portal/preferences/actions.ts` — server actions for hent/sett
- `components/portal/view-switcher.tsx` — pill-tabs UI (modeller etter `components/portal/layout/sub-nav-tabs.tsx`)

#### Steg 3: Drag-drop widget-bibliotek
- `components/portal/widgets/widget-base.tsx` — felles wrapper
- `components/portal/widgets/widget-grid.tsx` — dnd-kit drag-drop grid (`@dnd-kit/core` + `@dnd-kit/sortable` allerede installert)
- `lib/portal/widgets/registry.ts` — widget-registry
- 6 nye widgets fra `wireframe/VIEWS.md` Del 5:
  - PlanProgressWidget (TrainingPlan + TrainingLog)
  - NextCompetitionWidget (Tournament + TournamentPrep)
  - TrainingVolumeWidget (TrainingLog aggregert)
  - SeasonPlanWidget (TrainingPlan måned-horisont)
  - LeaderboardWidget (User + Round aggregert)
  - CoachingFeedbackWidget (Message fra instruktør)

#### Steg 4: Dashboard-refactor
- `app/portal/(dashboard)/dashboard-client-v3.tsx` (228 lin) refaktoreres til å bruke view-system + widget-grid
- 5 dashboard-views implementeres som varianter (Athletic Grid, Focus Today, Data Rich, Progress Story, Command Center)
- Referanse: `wireframe/1704-portal-dashboard-v2/` for layout per view

#### Steg 5: Onboarding view-default-picker
- Nytt steg i `app/portal/(dashboard)/onboarding/` (eller `/portal/onboarding`)
- 5 dashboard-thumbnails som klikkbare valg
- Referanse: `wireframe/1704-nye-onboarding-magic-link/` Opt 4

---

## Eksisterende kode som er relevant

| Område | Filer | Status |
|--------|-------|--------|
| Prisma schema | `prisma/schema.prisma` | 108 modeller, mangler UserPreferences |
| Dashboard server | `app/portal/(dashboard)/page.tsx` (106 lin) | Server component, parallelle queries |
| Dashboard client | `app/portal/(dashboard)/dashboard-client-v3.tsx` (228 lin) | Aktiv versjon, må refaktorere |
| Dashboard actions | `app/portal/(dashboard)/dashboard-actions.ts` (718 lin) | 11 parallelle data-fetches |
| Dashboard widgets | `components/portal/dashboard/` (31 filer, 3122 lin) | Solide byggeklosser |
| Sidebar | `components/portal/layout/sidebar.tsx` | Klar |
| SubNavTabs | `components/portal/layout/sub-nav-tabs.tsx` | Mal for view-switcher |
| Layout | `app/portal/(dashboard)/layout.tsx` (42 lin) | View-switcher kan legges i topbar |

---

## Avhengigheter (allerede installert)

- `@dnd-kit/core@6.3.1` ✓
- `@dnd-kit/sortable@10.0.0` ✓
- `@dnd-kit/utilities@3.2.2` ✓
- `framer-motion@12.34.0` ✓
- `zustand@5.0.12` ✓
- `recharts@3.8.1` ✓

**Ingen nye pakker kreves.**

---

## Viktige regler (fra `.claude/rules/`)

- Brand Guide V2.0: `#005840`, `#D1F843`, `#ECF0EF`, `#324D45`, `#A5B2AD`, `#0A1F18`
- AI: `#AF52DE`
- Aldri raw hex i JSX — bruk `bg-primary`, `text-accent-cta` etc.
- Aldri `any` i TypeScript
- Aldri emojier — Lucide-ikoner
- Norsk bokmål for all brukervendt tekst
- Maks 300 linjer per fil
- Prisma User-oppslag: `OR: [{ supabaseId: userId }, { id: userId }]` (se `.claude/rules/prisma-auth.md`)
- PascalCase i Prisma-relasjoner: `User`, ikke `user`

---

## Master-dokumenter

- `wireframe/MASTER_WIREFRAME_PLAN.md` v2.0 — komplett plan-dokument
- `wireframe/VIEWS.md` — godkjente views per skjerm + widget-spec
- `wireframe/FUNCTION_COVERAGE.md` — datadekning-matrise
- `wireframe/WINNERS-archive-2026-04-18.md` — markedsside-vinnere (M1-M6)
- `~/.claude/plans/ja-gj-re-dette-f-rst-hashed-pretzel.md` — original plan-fil

---

## Anders-kontekst (viktig)

- ADHD — én ting om gangen, direkte og konkret
- CEO AK Golf Group — ikke programmerer
- Foretrekker: spør fremfor å anta, vis SQL/diff før kjøring av migrations
- Brand Guide V2.0 ufravikelig
- ak-sync må kjøres før maskin-bytte

---

## Påminnelse

Anders må kjøre `ak-sync` før han pakker ned maskinen for å pushe alt til git.
