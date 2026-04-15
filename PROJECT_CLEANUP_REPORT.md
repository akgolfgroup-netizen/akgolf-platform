# AK Golf Platform — Oppryddingsrapport

**Dato:** 15. april 2026  
**Scannet av:** Kimi Code CLI  
**Formål:** Finne rot, duplikater, motstridende design-regler og død kode slik at du aldri mister "sonen" igjen.

---

## 🚨 Hovedfunn: 5 motstridende design-regler

Dette er kjernen i problemet ditt. Du har **flere design-system-dokumenter** som sier ulike ting:

| Dokument | Hva den sier | Konflikt |
|----------|--------------|----------|
| `.claude/rules/design-system.md` | **Sort. Hvit. Én grønn.** Brand Guide V2.0. Tailwind-tokens (`bg-primary`, `text-accent-cta`). Knapper: `rounded-[20px]` (ikke full pill). | ✅ Dette er den gjeldende kilden |
| `docs/design-system.md` | "Synex Edition" — lys-first, SaaS-dashboard, `rounded-full` på knapper, `#0A1F18` som primærtekst, generøs whitespace | ⚠️ Delvis overlappende, delvis avvikende |
| `docs/project/04_DESIGN_SYSTEM.md` | Brand Guide V2.0, men med **AppleButton** (`rounded-full` pill), **AppleCard** (glass/solid/dark), `rounded-lg`=16px | ⚠️ Motstridende radius-regler |
| `docs/decisions/002_design_system.md` | ADR som sier "alle farger via Tailwind-tokens" — **korrekt** | ✅ Bra, men lett å glemme |
| `lib/design-tokens.ts` | Eksisterer, men brukes nesten ikke (bare 5 imports) | 🔴 Nesten død kode |

### Konkrete motsetninger

1. **Knapperadius:**
   - `.claude/rules/design-system.md`: `rounded-[20px]` (nesten pill, men ikke full)
   - `docs/design-system.md`: `rounded-full` (9999px, ekte pill)
   - `docs/project/04_DESIGN_SYSTEM.md`: `rounded-full` (AppleButton)

2. **Primær bakgrunnsfarge for tekst:**
   - `.claude/rules/design-system.md`: `text-text` = `#324D45`
   - `docs/design-system.md`: `#0A1F18` (mørk grønn) som primærtekst

3. **Card radius:**
   - `.claude/rules/design-system.md`: `rounded-xl` = 16px
   - `docs/project/04_DESIGN_SYSTEM.md`: `radius 20px` for Solid-kort
   - `docs/design-system.md`: `rounded-lg` = 12px, `rounded-xl` = 16px, `rounded-2xl` = 20px

4. **Spacing/seksjoner:**
   - `.claude/rules/design-system.md`: `py-20` → `py-24` → `py-28`
   - `docs/project/04_DESIGN_SYSTEM.md`: Mobile 5rem, Tablet 6rem, Desktop 7rem

5. **Page background:**
   - `.claude/rules/design-system.md`: `bg-surface` = `#ECF0EF` ELLER `bg-background-beige` = `#fdf9f0`
   - `docs/design-system.md`: `#ECF0EF` (page) eller `#F5F8F7` (portal)

**Konsekvens:** Når du starter en ny AI-sesjon og sier "bruk design-systemet", kan AI-en plukke feil fil. Resultatet blir inkonsistent UI.

---

## 📊 Prosjektets størrelse og rot

### Filstørrelse
| Kategori | Størrelse |
|----------|-----------|
| Totalt prosjekt | **2.7 GB** |
| `node_modules/` | 1.1 GB |
| `.next/` (build) | 1.2 GB |
| `.git/` | 245 MB |
| **Faktisk kildekode + assets** | ~**200 MB** |

### Kodefilantall
| Type | Antall |
|------|--------|
| TSX/JSX komponenter/sider | 596 |
| TypeScript utilities/API | 399 |
| Markdown-dokumenter | ~165 |
| Bilder | 173 |
| CSS-filer | **1** (`app/globals.css`) |

### Død/utdatert kode funnet

#### 1. Design-preview mapper (død kode)
- `app/design-preview/synex/` — 5 filer med hardkodede farger
- **Anbefaling:** Slett. Dette er gamle preview-sider som ikke lenkes til.

#### 2. Portal-preview mapper (død kode)
- `app/portal-preview/ron/` og `app/portal-preview/ron-v2/`
- **Anbefaling:** Slett eller arkiver til `design-ref/`. Ikke i bruk.

#### 3. Booking components-v2 (duplikat/utdatert)
- `app/booking/components-v2/` — 15 filer
- Commit-historikk viser at booking ble refactoret til `components/booking/`. `components-v2` er sannsynligvis utdatert.
- **Anbefaling:** Sjekk om importert noe sted. Hvis ikke → slett.

#### 4. Design-referanse-rot
- `design-ref/` inneholder **57 MB** med:
  - 17 `design-*.jpg` (ukjent opphav, gamle?)
  - 19 `stitch-v2/dashboard-v*.html` (v1–v8 + final)
  - 4 `portal-dashboard-*.html` (preview, v2, v2-backup, v3)
  - Dribbble/Behance-scrapes, markdown-filer med UI-søk
- **Anbefaling:** Behold `stitch-v2/dashboard-final.html` + `booking-select.html` hvis de er referanse. Resten av HTML-versjonene kan arkiveres.

#### 5. Superpowers-brainstorm (midlertidig)
- `.superpowers/brainstorm/` — flere HTML-filer fra design-utforskning
- **Anbefaling:** Flytt til `design-ref/archive/` eller slett hvis ikke lenger relevant.

#### 6. Firecrawl-scrapes
- `.firecrawl/` — 24 filer med Dribbble/Behance-scrapes
- **Anbefaling:** Kan flyttes til `design-ref/research/`.

#### 7. Gammel enkeltfil
- `ak-golf-dashboard.jsx` (68 KB) ligger i rot-mappen
- **Anbefaling:** Sannsynligvis utdatert. Sjekk om innholdet finnes i `app/` eller `components/`. Hvis ja → slett.

#### 8. Ubrukte/dupliserte env-filer
- `.env.vercel-dev` og `.env.vercel-temp` — midlertidige Vercel-env
- **Anbefaling:** Slett hvis ikke i bruk.

---

## 🎨 Fargebrudd (28 filer med hardkodede farger)

Selv om ADR-002 forbyr hardkodede hex-verdier, finnes det fortsatt **28 filer** med `bg-[#...]`, `text-[#...]` eller `border-[#...]`:

### Portal-sider (15 filer)
- `app/portal/(dashboard)/ai-coach/ai-coach-client.tsx`
- `app/portal/(dashboard)/runde/ny/start-round-client.tsx`
- `app/portal/(dashboard)/mental/[roundId]/page.tsx`
- `app/portal/(dashboard)/apper/apper-client.tsx`
- `app/portal/(dashboard)/meldinger/meldinger-chat-client.tsx`
- `app/portal/(dashboard)/dashboard-client.tsx`
- `app/portal/(dashboard)/bookinger/[id]/booking-detail-client.tsx`
- `app/portal/(dashboard)/abonnement/abonnement-client.tsx`
- `app/portal/(dashboard)/sosialt/sosialt-client.tsx`
- `app/portal/(dashboard)/turneringsplan/turneringsplan-client.tsx`

### Auth/setup (3 filer)
- `app/auth/register/page.tsx`
- `app/auth/forgot-password/page.tsx`
- `app/setup-admin/page.tsx`

### Komponenter (10 filer)
- `components/ui/switch.tsx`
- `components/portal/layout/sidebar.tsx`
- `components/portal/admin/capacity-gauge.tsx`
- `components/portal/dashboard/premium-card.tsx`
- `components/portal/mission-control/mc-sidebar.tsx`
- `components/portal/mission-control/mc-layout.tsx`
- `components/booking/date-picker.tsx`
- `components/booking/booking-wizard.tsx`
- `components/shared/footer.tsx`

### Generiske Tailwind-farger (15 filer)
- `app/admin/(authed)/fasiliteter/ny-aktivitet/ny-aktivitet-client.tsx`
- `app/admin/(authed)/okonomi/okonomi-client.tsx`
- `app/portal-preview/ron-v2/page.tsx`
- `app/setup-admin/page.tsx`
- `components/portal/beta-test/RoryAugustaResult.tsx`

**Anbefaling:** Kjør en systematisk fargeopprydding. Jeg kan gjøre dette for deg.

---

## 📁 Dokumentasjonsrot

Du har **minst 6 dokumenter** om design-systemet:
1. `.claude/rules/design-system.md` ← **Brukes av AI, må være sannheten**
2. `docs/DESIGN.md`
3. `docs/DESIGN-REFERENCE.md`
4. `docs/design-system.md`
5. `docs/project/04_DESIGN_SYSTEM.md`
6. `docs/decisions/002_design_system.md`

**Anbefaling:**
- Gjør `.claude/rules/design-system.md` til **eneste sann kilde**.
- Slett eller slå sammen `docs/design-system.md` og `docs/project/04_DESIGN_SYSTEM.md` inn i den.
- Oppdater `CLAUDE.md` til å peke eksplisitt på `.claude/rules/design-system.md`.

---

## 🗺️ Hvor ligger arbeidet fra natt til 13. april?

Basert på commit-historikk og filstruktur:

### DataGolf
- **API:** `app/api/portal/datagolf/`
- **Spillersøk:** `app/api/portal/datagolf/players/route.ts`
- **Bruk i frontend:** Sannsynligvis i `app/portal/(dashboard)/turneringer/` eller `app/portal/(dashboard)/sammenligning/`

### TrackMan
- **API:** `app/api/portal/trackman/`
- **Sider:** `app/portal/(dashboard)/trackman/page.tsx` + `trackman-client.tsx`
- **Actions:** `app/portal/(dashboard)/trackman/actions.ts`
- **Prisma-modeller:** Commit `2eb7011` la til TrackMan-modeller

### Statistikk-modul
- **Side:** `app/portal/(dashboard)/statistikk/`
- **Files:** `page.tsx`, `statistikk-client.tsx`, `statistikk-charts.tsx`, `actions.ts`
- **Ny runde:** `app/portal/(dashboard)/statistikk/ny-runde/`

### Treningsdagbok
- **Side:** `app/portal/(dashboard)/dagbok/`
- **Files:** `dagbok-client.tsx`, `dagbok-calendar.tsx`, `dagbok-stats.tsx`, `actions.ts`
- **Sesjonsdetalj:** `app/portal/(dashboard)/dagbok/[sessionId]/`

### Strategi / DECADE
- **Commit:** `850ff72` — "persist DECADE strategy per hole and wire frontend"
- **Side:** `app/portal/(dashboard)/strategi/page.tsx`
- **Prisma:** `strategy`-felt på `Hole`-modellen (commit `b694fbc`)

---

## ✅ Anbefalte handlinger (i prioritert rekkefølge)

### Høy prioritet — Gjør nå
1. **Rydd design-system-dokumentasjon**
   - Slå sammen alle design-system-filer til `.claude/rules/design-system.md`
   - Slett de andre eller flytt til `docs/archive/`

2. **Slett døde preview-sider**
   - `app/design-preview/synex/`
   - `app/portal-preview/`
   - `app/booking/components-v2/` (hvis ikke i bruk)

3. **Oppdater `CLAUDE.md` med en "Fortsett der jeg slapp"-seksjon**
   - Pek på nøyaktige mapper for pågående arbeid
   - List siste commits og hva de gjorde

4. **Fiks fargebrudd i 28 filer**
   - Erstatt `bg-[#...]` med Tailwind-tokens

### Medium prioritet — Gjør i løpet av uken
5. **Arkiver design-ref**
   - Lag `design-ref/archive/` for gamle versjoner
   - Behold kun gjeldende referanser i rot

6. **Rydd `.superpowers/` og `.firecrawl/`**
   - Flytt til `design-ref/research/` eller slett

7. **Slett utdaterte env-filer**
   - `.env.vercel-dev`, `.env.vercel-temp`

8. **Vurder `ak-golf-dashboard.jsx`**
   - Slett hvis duplisert i `app/` eller `components/`

### Lav prioritet
9. **Sett opp git-hooks eller rutine for meningsfulle commits**
   - Bruk formatet: `feat(area): beskrivelse`
   - Commit ofte når du er "in the zone"

10. **Opprett `WORKLOG.md`**
    - En enkel fil der du skriver: "Jobbet med X, relevante filer: Y, Z"
    - Leses av AI ved oppstart

---

## 🎯 Hvordan aldri miste sonen igjen

### Løsning: Én sann kilde + eksplisitte pekere

1. **Når du avslutter en økt, skriv 3 linjer i `WORKLOG.md`:**
   ```markdown
   ## 2026-04-15 05:40
   - Jobbet med: TrackMan-analysevisning
   - Nøkkelfiler: app/portal/(dashboard)/trackman/trackman-client.tsx, app/api/portal/trackman/sessions/[id]/analytics/route.ts
   - Neste steg: Koble shot-chart til reelle data
   ```

2. **Når du starter en ny AI-sesjon, si:**
   > "Les WORKLOG.md og .claude/rules/design-system.md, så fortsett arbeidet med [X]."

3. **Hold `.claude/rules/design-system.md` oppdatert.**
   - Dette er den eneste filen AI garantert leser.

4. **Commit før du går.**
   - Selv uferdig kode: `git commit -m "wip: trackman chart layout"`
   - Da kan du alltid se diff fra siste commit.

---

## Neste steg

Vil du at jeg skal:

1. **Rydde opp design-system-dokumentasjonen nå** (slå sammen/slette motstridende filer)?
2. **Slette døde preview-sider og duplikater**?
3. **Fikse fargebruddene i de 28 filene**?
4. **Opprette `WORKLOG.md` og oppdatere `CLAUDE.md`**?

Si hvilke(n) du vil jeg skal starte med, så går jeg rett på det.
