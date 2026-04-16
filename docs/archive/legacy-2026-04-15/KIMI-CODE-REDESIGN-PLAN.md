# Komplett Redesign-plan for Kimi Code

> **Mål:** 100% visuell redesign av Spillerportal, Mission Control (Admin) og Booking-systemet.
> **Visuell referanse:** Jack L. / RonDesignLab — https://dribbble.com/jack-web-design
> **Kjøremodus:** Automatisk YES/godkjenning. Ingen spørsmål — bare implementer.

---

## VIKTIG: Kontekst-håndtering

Denne planen er designet for å overleve kontekst-tap. Følg disse reglene:

### Ved oppstart (eller etter kontekst-tap)
1. Les denne filen: `docs/KIMI-CODE-REDESIGN-PLAN.md`
2. Les progress-filen: `docs/REDESIGN-PROGRESS.md`
3. Finn neste ugjorte oppgave (merket `[ ]`)
4. Fortsett derfra

### Etter HVER ferdig fil
Oppdater `docs/REDESIGN-PROGRESS.md` — bytt `[ ]` til `[x]` for den ferdige filen.
Dette er OBLIGATORISK. Det er slik du vet hvor du er etter kontekst-tap.

### Etter hver fase (Portal/Admin/Booking)
Kjør `npm run build` og logg resultatet i progress-filen.

---

## Prosjektkontekst

### Arbeidsmappe
```
cd ~/Developer/akgolf/akgolf-platform
```

### Tech Stack
- Next.js 16 (App Router, Turbopack), React 19, TypeScript strict
- Tailwind CSS v4, Framer Motion 12
- Prisma + PostgreSQL (Supabase)
- Pakkebehandler: npm

### Kommandoer
```bash
npm run dev      # Dev server
npm run build    # Prod build (kjør etter HVER ferdig side for å verifisere)
npx tsc --noEmit --skipLibCheck  # Rask typesjekk
```

### Kritiske regler
1. **ALDRI bruk raw hex-verdier** — kun Tailwind-tokens
2. **ALDRI bruk generiske Tailwind-farger** (bg-green-500, text-gray-400)
3. **ALDRI lag nye filer** med mindre spesifisert — rediger eksisterende
4. **ALDRI endre server-logikk, API-ruter, actions.ts eller Prisma-modeller**
5. **Maks 300 linjer per fil** — splitt ved behov
6. **Norsk bokmål** for all brukervendt tekst
7. **Aldri emojier, aldri dark mode, aldri MVA på kundesider**
8. Kjør `npx tsc --noEmit --skipLibCheck` etter HVER fil du endrer

---

## Designreferanse — Jack L. / RonDesignLab

Les `docs/DESIGN-REFERENCE.md` for komplett analyse. Nøkkelprinsipper:

### Portal (Spillerportal) tokens
| Bruk | Token | Verdi |
|------|-------|-------|
| Bakgrunn | `bg-portal-bg` | #F5F5F7 |
| Tekst primær | `text-portal-text` | #1D1D1F |
| Tekst sekundær | `text-portal-secondary` | #6E6E73 |
| Tekst muted | `text-portal-muted` | #AEAEB2 |
| Kort-bg | `bg-white` | #FFFFFF |
| Border | `border-portal-border` | rgba(0,0,0,0.06) |
| Hover-bg | `bg-portal-hover` | #F0F0F2 |

### Admin (Mission Control) tokens
| Bruk | Token |
|------|-------|
| Canvas | `bg-grey-50` |
| Sidebar | `bg-black` med `text-white/60` |
| Aktiv nav | `text-accent-cta border-l-4 border-accent-cta` |
| Topbar | `h-14 bg-white border-b border-grey-100` |
| Divisjonsfarger | Coaching=#005840, Junior=#007AFF, AI=#AF52DE |

### Felles designmønstre
- **Kort:** `rounded-xl shadow-card` med `hover:shadow-card-hover hover:-translate-y-px transition-all duration-300`
- **Knapper:** `rounded-[20px]` (pills), primær: `bg-primary text-white`, CTA: `bg-accent-cta text-accent-cta-text`
- **KPI-tall:** `text-4xl font-extrabold tabular-nums tracking-tight`
- **Micro-labels:** `text-[10px] font-semibold uppercase tracking-[0.08em]`
- **Pill-tabs:** `rounded-full` med mørk aktiv state
- **Shadows:** Alltid layered (minst 2 verdier), aldri enkel drop-shadow
- **Borders:** Bruk `border-black/6` (rgba), aldri solid hex
- **Hover:** `translateY(-1px)` max, `duration-300`, aldri `scale()`
- **Gauge/charts:** Gradient-fill, ikke flat farge

### Token-erstatningstabell (SØKT → ERSTATTES MED)
```
Portal-filer:
  grey-50   → portal-hover eller portal-bg
  grey-100  → portal-border eller portal-hover
  grey-200  → portal-border
  grey-300  → portal-muted
  grey-400  → portal-secondary
  grey-500  → portal-secondary
  grey-600  → portal-text
  grey-700  → portal-text
  grey-800  → portal-text
  grey-900  → portal-text
  bg-surface → portal-bg
  text-muted → portal-muted

Admin-filer:
  Bruk grey-tokens som de er (grønntonet skala er korrekt for admin)
  Men fjern GlassCard, HeroHeading, BentoCard
```

---

## Eksisterende premium-komponenter (GJENBRUK DISSE)

Sjekk om `PremiumCard` finnes i prosjektet:
```bash
grep -r "PremiumCard" components/portal/ --include="*.tsx" -l
```

Bruk `PremiumCard` som wrapper for alle kort i portalen. Hvis den ikke finnes, bruk dette mønsteret:
```tsx
<div className="bg-white rounded-xl shadow-card p-5">
  {/* kort-innhold */}
</div>
```

---

## FASE 1: Spillerportal — 24 klient-komponenter

### Arbeidsprosess per fil
1. Åpne filen
2. Søk etter token-brudd (grey-X, bg-surface, text-muted, hex-verdier, GlassCard, HeroHeading)
3. Erstatt med korrekte portal-tokens (se tabell over)
4. Wrap løse `<div>` kort i PremiumCard-mønsteret
5. Fikse knapper til `rounded-[20px]`
6. Fikse tall til `tabular-nums`
7. Kjør `npx tsc --noEmit --skipLibCheck`
8. Gå til neste fil

### 1.1 turneringer-client.tsx (92 brudd — HØYEST)
**Fil:** `app/portal/(dashboard)/turneringer/turneringer-client.tsx`
**Oppgave:** Erstatt alle 92 token-brudd. Bruk portal-tokens. Wrap kort i PremiumCard. Pill-tabs for filter.

### 1.2 sosialt-client.tsx (26 brudd)
**Fil:** `app/portal/(dashboard)/sosialt/sosialt-client.tsx`
**Oppgave:** Migrere grey-tokens til portal-tokens. Venneliste + legg til venn.

### 1.3 ai-coach/page.tsx (26 brudd)
**Fil:** `app/portal/(dashboard)/ai-coach/page.tsx`
**Oppgave:** Fjern ALLE hardkodede hex-verdier. Bruk portal-tokens + ai-tokens (bg-ai, text-ai-text).

### 1.4 treningsplan-v2-client.tsx (14 brudd)
**Fil:** `app/portal/(dashboard)/treningsplan/treningsplan-v2-client.tsx`
**Oppgave:** Migrere grey-tokens. Store SG-tall med tabular-nums.

### 1.5 benchmark-client.tsx (13 brudd)
**Fil:** `app/portal/(dashboard)/benchmark/benchmark-client.tsx`
**Oppgave:** Migrere grey-tokens. Tall med tabular-nums.

### 1.6 statistikk-client.tsx (9 brudd)
**Fil:** `app/portal/(dashboard)/statistikk/statistikk-client.tsx`
**Oppgave:** Migrere grey-tokens. SG-barer med gradient.

### 1.7 booking-detail-client.tsx (7 brudd)
**Fil:** `app/portal/(dashboard)/bookinger/[id]/booking-detail-client.tsx`
**Oppgave:** Portal-tokens, PremiumCard wrapper.

### 1.8 sammenligning/page.tsx (7 brudd)
**Fil:** `app/portal/(dashboard)/sammenligning/page.tsx`
**Oppgave:** Fjern HeroHeading, bruk portal-tokens.

### 1.9 abonnement-client.tsx (6 brudd)
**Fil:** `app/portal/(dashboard)/abonnement/abonnement-client.tsx`
**Oppgave:** Portal-tokens, pakkekort med PremiumCard.

### 1.10 kalender/page.tsx (6 brudd)
**Fil:** `app/portal/(dashboard)/kalender/page.tsx`
**Oppgave:** Portal-tokens, ukevisning med booking-chips.

### 1.11 dagbok-client.tsx (5 brudd)
**Fil:** `app/portal/(dashboard)/dagbok/dagbok-client.tsx`
**Oppgave:** Portal-tokens.

### 1.12 dagbok-stats.tsx (5 brudd)
**Fil:** `app/portal/(dashboard)/dagbok/dagbok-stats.tsx`
**Oppgave:** Portal-tokens, stat-tall med tabular-nums.

### 1.13 runde/[id]/oppsummering/page.tsx (5 brudd)
**Fil:** `app/portal/(dashboard)/runde/[id]/oppsummering/page.tsx`
**Oppgave:** Portal-tokens.

### 1.14 bookinger-client.tsx (4 brudd)
**Fil:** `app/portal/(dashboard)/bookinger/bookinger-client.tsx`
**Oppgave:** Portal-tokens, PremiumCard.

### 1.15 start-round-client.tsx (4 brudd)
**Fil:** `app/portal/(dashboard)/runde/ny/start-round-client.tsx`
**Oppgave:** Portal-tokens.

### 1.16 onboarding-client.tsx (3 brudd)
**Fil:** `app/portal/(dashboard)/onboarding/onboarding-client.tsx`
**Oppgave:** Portal-tokens, wizard-steg.

### 1.17 dagbok-calendar.tsx (3 brudd)
**Fil:** `app/portal/(dashboard)/dagbok/dagbok-calendar.tsx`
**Oppgave:** Portal-tokens.

### 1.18 tournament-list-with-periods.tsx (3 brudd)
**Fil:** `app/portal/(dashboard)/turneringsplan/tournament-list-with-periods.tsx`
**Oppgave:** Portal-tokens.

### 1.19 book-coaching-form.tsx (2 brudd)
**Fil:** `app/portal/(dashboard)/bookinger/ny/book-coaching-form.tsx`
**Oppgave:** Portal-tokens.

### 1.20 meldinger/page.tsx (2 brudd)
**Fil:** `app/portal/(dashboard)/meldinger/page.tsx`
**Oppgave:** Portal-tokens.

### 1.21 apper/page.tsx (2 brudd)
**Fil:** `app/portal/(dashboard)/apper/page.tsx`
**Oppgave:** Fjern HeroHeading, portal-tokens.

### 1.22 runde/ny/page.tsx (2 brudd)
**Fil:** `app/portal/(dashboard)/runde/ny/page.tsx`
**Oppgave:** Portal-tokens.

### 1.23-1.24 Filer med 0 brudd (verifiser visuelt)
Disse filene har allerede korrekte tokens. Åpne dem, verifiser at de bruker `portal-*` tokens og PremiumCard, og gå videre:
- `dashboard-client.tsx`
- `spill-client.tsx`
- `trackman-client.tsx`
- `bag-client.tsx`
- `tester-client.tsx`
- `profil/innstillinger/settings-client.tsx`
- `treningsplan-client.tsx`
- `turneringsplan-client.tsx`
- `coaching-historikk/page.tsx`
- `live-round-client.tsx`
- `meldinger-chat-client.tsx`

---

## FASE 2: Mission Control (Admin) — 24 klient-komponenter

Admin bruker grønntonede grey-tokens (korrekt), men trenger:
- Fjerne GlassCard/HeroHeading/BentoCard
- Konsistent kort-mønster
- Pill-tabs og chip-filters
- KPI-tall med tabular-nums
- Divisjonsfarger som border-l-4

### 2.1 ai-assistent/chat-client.tsx (11 brudd)
**Fil:** `app/admin/(authed)/ai-assistent/chat-client.tsx`
**Oppgave:** Fjern hex-verdier. Bruk ai-tokens for AI-chat. Bobler: bruker=bg-primary, AI=bg-grey-50.

### 2.2 admin-chat-client.tsx (11 brudd)
**Fil:** `app/admin/(authed)/meldinger/admin-chat-client.tsx`
**Oppgave:** Samme som over — chat-bobler med korrekte tokens.

### 2.3 tilgjengelighet/page.tsx (11 brudd)
**Fil:** `app/admin/(authed)/tilgjengelighet/page.tsx`
**Oppgave:** Migrere tokens, ukedager-grid.

### 2.4 e-postmaler-client.tsx (10 brudd)
**Fil:** `app/admin/(authed)/e-postmaler/e-postmaler-client.tsx`
**Oppgave:** Migrere tokens, mal-liste.

### 2.5 ny-booking-client.tsx (10 brudd)
**Fil:** `app/admin/(authed)/bookinger/ny/ny-booking-client.tsx`
**Oppgave:** Migrere tokens, booking-wizard.

### 2.6 treningsplan-client.tsx (10 brudd)
**Fil:** `app/admin/(authed)/treningsplan/treningsplan-client.tsx`
**Oppgave:** Migrere tokens.

### 2.7 kalender-client.tsx (9 brudd)
**Fil:** `app/admin/(authed)/kalender/kalender-client.tsx`
**Oppgave:** Migrere tokens, månedsvisning.

### 2.8 mission-board/page.tsx (8 brudd)
**Fil:** `app/admin/(authed)/mission-board/page.tsx`
**Oppgave:** Migrere tokens, kanban-board.

### 2.9 okter-client.tsx (8 brudd)
**Fil:** `app/admin/(authed)/okter/okter-client.tsx`
**Oppgave:** Migrere tokens, sesjon-tabell.

### 2.10 rapporter-client.tsx (8 brudd) + page.tsx (7 brudd)
**Filer:** `app/admin/(authed)/rapporter/rapporter-client.tsx`, `page.tsx`
**Oppgave:** Migrere tokens i begge filer.

### 2.11 hub-oversikt-client.tsx (7 brudd)
**Fil:** `app/admin/(authed)/hub-oversikt-client.tsx`
**Oppgave:** KPI-kort med tabular-nums, dagens tidslinje.

### 2.12 fasiliteter/innstillinger-client.tsx (7 brudd)
**Fil:** `app/admin/(authed)/fasiliteter/innstillinger/innstillinger-client.tsx`
**Oppgave:** Migrere tokens.

### 2.13 focus-client.tsx (7 brudd)
**Fil:** `app/admin/(authed)/focus/focus-client.tsx`
**Oppgave:** Migrere tokens, kanban-kort.

### 2.14 analytics/dashboard-client.tsx (6 brudd)
**Fil:** `app/admin/(authed)/analytics/dashboard-client.tsx`
**Oppgave:** KPI-kort, linjediagram-tokens, periode-chips.

### 2.15 student-detail-client.tsx (6 brudd)
**Fil:** `app/admin/(authed)/elever/[id]/student-detail-client.tsx`
**Oppgave:** Profil-kort, tab-nav, migrere tokens.

### 2.16 bookinger-client.tsx (5 brudd)
**Fil:** `app/admin/(authed)/bookinger/bookinger-client.tsx`
**Oppgave:** Migrere tokens, chip-filter.

### 2.17 meldinger-client.tsx (5 brudd)
**Fil:** `app/admin/(authed)/meldinger/meldinger-client.tsx`
**Oppgave:** Migrere tokens, kontaktliste.

### 2.18 students-client.tsx (4 brudd)
**Fil:** `app/admin/(authed)/elever/students-client.tsx`
**Oppgave:** Søkelinje, elev-tabell.

### 2.19 okonomi-client.tsx (4 brudd)
**Fil:** `app/admin/(authed)/okonomi/okonomi-client.tsx`
**Oppgave:** KPI-rad, transaksjons-tabell.

### 2.20 kapasitet-client.tsx (4 brudd)
**Fil:** `app/admin/(authed)/kapasitet/kapasitet-client.tsx`
**Oppgave:** Migrere tokens, heatmap.

### 2.21 agenter-client.tsx (3 brudd)
**Fil:** `app/admin/(authed)/agenter/agenter-client.tsx`

### 2.22 denne-uken/this-week-client.tsx (3 brudd)
**Fil:** `app/admin/(authed)/denne-uken/this-week-client.tsx`

### 2.23 fasiliteter-client.tsx (3 brudd)
**Fil:** `app/admin/(authed)/fasiliteter/fasiliteter-client.tsx`

### 2.24 turneringer-client.tsx (2 brudd)
**Fil:** `app/admin/(authed)/turneringer/turneringer-client.tsx`

### 2.25 Lavpri (1 brudd)
- `godkjenninger-client.tsx` (1)
- `ny-aktivitet-client.tsx` (1)

---

## FASE 3: Booking-systemet — 5 komponenter

### 3.1 booking-summary.tsx (14 brudd)
**Fil:** `components/booking/booking-summary.tsx`
**Oppgave:** Migrere grey-tokens, oppsummeringskort.

### 3.2 booking-wizard.tsx (11 brudd)
**Fil:** `components/booking/booking-wizard.tsx`
**Oppgave:** Migrere grey-tokens, steg-indikator.

### 3.3 time-slots.tsx (8 brudd)
**Fil:** `components/booking/time-slots.tsx`
**Oppgave:** Migrere grey-tokens, tids-pills.

### 3.4 date-picker.tsx (5 brudd)
**Fil:** `components/booking/date-picker.tsx`
**Oppgave:** Migrere grey-tokens, kalender.

### 3.5 service-selector.tsx (5 brudd)
**Fil:** `components/booking/service-selector.tsx`
**Oppgave:** Migrere grey-tokens, tjenestekort.

---

## Verifisering

Etter ALLE filer er oppdatert:

```bash
# 1. TypeScript-sjekk
npx tsc --noEmit --skipLibCheck

# 2. Full build
npm run build

# 3. Søk etter gjenværende brudd
grep -rn "grey-[0-9]" app/portal/ app/admin/ components/booking/ --include="*.tsx" | grep -v node_modules | grep -v ".next" | wc -l

# 4. Søk etter hardkodede hex-verdier
grep -rn "#[0-9a-fA-F]\{6\}" app/portal/ app/admin/ components/booking/ --include="*.tsx" | grep -v node_modules | grep -v ".next" | grep -v "// " | wc -l
```

Mål: **0 brudd** på steg 3 og 4.

---

## Totalt arbeid

| Fase | Filer | Token-brudd | Estimat |
|------|-------|-------------|---------|
| Portal | 24 | ~180 | 2-3 timer |
| Admin | 25 | ~155 | 2-3 timer |
| Booking | 5 | ~43 | 30 min |
| **Totalt** | **54** | **~378** | **5-7 timer** |

---

## Kjøreinstruksjoner for Kimi Code

```
cd ~/Developer/akgolf/akgolf-platform

Les disse filene først for kontekst:
1. docs/KIMI-CODE-REDESIGN-PLAN.md (denne filen)
2. docs/DESIGN-REFERENCE.md (visuell referanse)
3. .claude/rules/premium-design-patterns.md (portal vs admin tokens)
4. .claude/rules/design-system.md (alle tilgjengelige tokens)

Start med Fase 1.1 (turneringer-client.tsx — 92 brudd).
Jobb gjennom listen i rekkefølge.
Kjør tsc etter hver fil.
Kjør npm run build etter hver fase.
Godkjenn alt automatisk — ikke still spørsmål.
```
