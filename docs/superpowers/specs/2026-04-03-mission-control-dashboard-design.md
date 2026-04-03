# AK Golf Mission Control — Design Specification

**Dato:** 2026-04-03
**Status:** Oppdatert etter review (v2)
**Mockups:** `.superpowers/brainstorm/66555-1775161249/`

---

## 1. Oversikt

Mission Control er et NASA-inspirert admin dashboard for AK Golf Academy med Apple Light design. Systemet gir sanntidsoversikt over tre divisjoner og automatiserer rutineoppgaver via AI-agenter.

### 1.1 Divisjoner

| Divisjon | Fargekode | Scope |
|----------|-----------|-------|
| AK Golf (Coaching) | `#1D1D1F` (svart) | Voksencoaching, Performance-pakker |
| Junior Academy | `#007AFF` (blå) | Barn/ungdom 6-18 år |
| GFGK Junior | `#34C759` (grønn) | Greåker Fotball/Golf Kombinert |

### 1.2 Designprinsipper

- **NASA Mission Control:** Data-tett, sanntidsstatus, alert-basert
- **Apple Light:** Monokrom (#1D1D1F), Manrope font, hvit bakgrunn, grey-100 til grey-900
- **Notion Calendar:** Drag-and-drop, venstresidefelt med kalendere/databaser, høyre AI-panel

### 1.3 Tilgangskontroll

| Rolle | Tilgang |
|-------|---------|
| ADMIN | Full tilgang til alle sider |
| INSTRUCTOR | Hub, Kalender, Elever, Coaching-notater, Bookinger |

Bruker eksisterende `requirePortalUser()` + `lib/portal/rbac.ts`.

---

## 2. Sidestruktur (14 sider)

### 2.1 Hub

| Side | Fil | Beskrivelse |
|------|-----|-------------|
| Hub — Oversikt | `final-design.html` | 3-kolonne divisjonsvisning med KPI-strip |
| Hub — Focus Mode | `page-hub-focus.html` | Enkelt-divisjon med Notion Projects/Tasks |

**Focus Mode Features:**
- Divisjonsvelger i header (AK Golf / Junior Academy / GFGK Junior)
- Notion Projects med progress bars per divisjon
- Notion Tasks med prioritetsnivåer (Haster, Viktig, Normal)
- Kompakt dagskalender med økter

### 2.2 Kalender & Bookinger

| Side | Fil | Beskrivelse |
|------|-----|-------------|
| Kalender | `page-kalender.html` | Notion Calendar-stil med AI Agent-panel |
| Bookinger | `page-bookinger.html` | Kommende/tidligere økter |
| Godkjenninger | `page-godkjenninger.html` | Booking-requests, AI-svar-godkjenning |
| Tilgjengelighet | `page-tilgjengelighet.html` | Ukesmal med divisjonsblokker |

**Kalender Features:**
- Venstre sidebar: Mini-kalender, kalender-liste, Notion-databaser, draggbare uplanlagte oppgaver
- Hovedområde: Ukesvisning med tidsgrid, divisjonsfarger
- Høyre sidebar: AI Agent-panel med status-toggles, handlingslogg, kommandoinput

### 2.3 Elever & Coaching

| Side | Fil | Beskrivelse |
|------|-----|-------------|
| Elever | `page-elever.html` | Søkbar elevliste med filtrering |
| Elevprofil | `page-elevprofil.html` | Detaljert visning med HCP-utvikling |
| Coaching-notater | `page-coaching-notater.html` | Alle øktnotater med AI-innsikt |

### 2.4 Kommunikasjon & AI

| Side | Fil | Beskrivelse |
|------|-----|-------------|
| Meldinger | `page-meldinger.html` | Unified inbox (e-post, SMS, app) |
| AI-assistent | `page-ai-assistent.html` | Chat-interface for treningsplaner |
| Agenter | `page-agenter.html` | 10 AI-agenter med avatarer og status |

### 2.5 Analyse & Økonomi

| Side | Fil | Beskrivelse |
|------|-----|-------------|
| Rapporter | `page-rapporter.html` | KPIer, retensjon, omsetning |
| Økonomi | `page-okonomi.html` | Revenue MTD, fakturering, abonnementer |

---

## 3. AI Agenter

### 3.1 Agentliste

| Navn | Type | Ikon | Gradient | Scope |
|------|------|------|----------|-------|
| Coach | Akademi-direktør | Mortarboard | #1D1D1F → #3a3a3c | AK Golf, Junior, GFGK |
| Mercury | CMO | Megafon | #F97316 → #EF4444 | AK Golf, Junior, GFGK |
| Atlas | CFO | Chart | #14B8A6 → #0D9488 | AK Golf, Junior, GFGK |
| Themis | Juridisk | Scale | #8B5CF6 → #7C3AED | AK Golf, Junior, GFGK |
| Guardian | Brand Enforcer | Shield | #EC4899 → #DB2777 | AK Golf, Junior, GFGK |
| Inspector | Code Reviewer | Magnifier | #06B6D4 → #8B5CF6 | Developer |
| Validator | Test Runner | Checkmark | #10B981 → #EC4899 | Developer |
| Architect | Dev Tech Lead | Cog | #6366F1 → #4F46E5 | Developer |
| Oracle | Supabase Expert | Database | #3ECF8E → #1C7C4E | Developer |
| Ops | Operations Assistant | Clipboard | #F472B6 → #FBBF24 | Operations |

### 3.2 Agentteam

- **Ledergruppen:** Coach, Mercury, Atlas, Themis
- **Kvalitet & Merkevare:** Guardian, Inspector
- **Teknisk Team:** Validator, Architect, Oracle, Ops

### 3.3 AI Agent Panel (i kalender)

- Toggle per agent (aktiv/inaktiv)
- Handlingslogg med tidsstempler
- Kommandoinput for naturlig språk
- Scope-indikatorer (AK Golf / Junior / GFGK / Dev)

---

## 4. Notion-integrasjon

### 4.1 Databaser per divisjon

| Divisjon | Projects DB | Tasks DB |
|----------|-------------|----------|
| AK Golf | AK Golf Projects | AK Golf Tasks |
| Junior Academy | Junior Projects | Junior Tasks |
| GFGK Junior | GFGK Projects | GFGK Tasks |

### 4.2 Drag-and-drop workflow

1. Uplanlagte tasks vises i venstre sidebar
2. Dra til kalenderens tidsgrid for å planlegge
3. Synkroniserer tilbake til Notion

### 4.3 Progress tracking

- Projects viser progress bar (% fullført)
- Tasks har prioritetsnivåer med fargekoder:
  - Haster: `#FF3B30`
  - Viktig: `#FF9500`
  - Normal: `#34C759`

---

## 5. Design Tokens

### 5.1 Farger

```css
/* Primær */
--color-black: #1D1D1F;
--color-white: #FFFFFF;

/* Grånyanser (komplett skala fra globals.css) */
--color-grey-50: #FBFBFD;
--color-grey-100: #F5F5F7;
--color-grey-200: #E8E8ED;
--color-grey-300: #D2D2D7;
--color-grey-400: #86868B;
--color-grey-500: #6E6E73;
--color-grey-600: #48484A;
--color-grey-700: #3A3A3C;
--color-grey-800: #2C2C2E;
--color-grey-900: #1D1D1F;

/* Divisjoner */
--division-coaching: #1D1D1F;
--division-junior: #007AFF;
--division-gfgk: #34C759;

/* Semantisk */
--color-success: #34C759;
--color-error: #FF3B30;
--color-warning: #FF9500;
--color-info: #007AFF;
```

### 5.2 Typografi

- **Font:** Manrope (via `next/font/local`, ManropeVariable.woff2)
- **H1:** 32px, weight 700
- **H2:** 20px, weight 600
- **Body:** 14px, weight 400
- **Small:** 12px, weight 400

**Merk:** HTML-mockups bruker Inter for prototyping. Produksjonskode bruker Manrope.

### 5.3 Spacing

- **Sidebar width:** 260px (venstre), 320px (høyre)
- **Card radius:** 16px
- **Card padding:** 20px
- **Grid gap:** 16px
- **Section gap:** 40px

---

## 6. Komponenter

### 6.1 KPI Strip

```
┌─────────────────────────────────────────────────────────────┐
│  Aktive elever    Økter i dag    Ventende      Inntekt MTD  │
│     47 (+3)          12            5              127.500    │
└─────────────────────────────────────────────────────────────┘
```

**KPI-definisjoner:**

| KPI | Beregning | Endring |
|-----|-----------|---------|
| Aktive elever | `User WHERE role=STUDENT AND lastBooking > NOW() - 30 days` | vs forrige måned |
| Økter i dag | `Booking WHERE date = TODAY AND status IN (CONFIRMED, PENDING)` | — |
| Ventende | `Booking WHERE status = PENDING` | — |
| Inntekt MTD | `SUM(PaymentTransaction.amount) WHERE createdAt >= MONTH_START` | vs forrige MTD |

### 6.2 Divisjonskort

```
┌─────────────────────────────┐
│ ● AK Golf Academy           │  ← Divisjonsfarge
│ ─────────────────────────── │
│ Neste økt: 10:00            │
│ Erik Larsen - Performance   │
│                             │
│ [Status badges] [Actions]   │
└─────────────────────────────┘
```

### 6.3 Agent Avatar

```
┌────────────────────────────────────────┐
│  ┌──────┐                              │
│  │ SVG  │  Coach                       │
│  │ ikon │  Akademi-direktør            │
│  └──────┘  AK Golf · Junior · GFGK     │
│            [Siste handling: 5 min]     │
└────────────────────────────────────────┘
```

---

## 7. Interaksjoner

### 7.1 Drag-and-drop

- Tasks kan dras fra sidebar til kalender
- Visuell feedback: skygge + opacity endring
- Drop-zone highlighting på gyldig tidspunkt

### 7.2 Agent toggles

- Klikk for å aktivere/deaktivere
- Smooth transition (0.2s ease)
- Status-indikator (grønn prikk = aktiv)

### 7.3 Divisjonsbytte (Focus Mode)

- Header-knapper for divisjonsvalg
- Fade-transition ved bytte
- Persistert valg i localStorage

---

## 8. Responsivitet

### 8.1 Breakpoints

- **Desktop:** 1200px+, full layout
- **Tablet:** 768-1199px, collapsed sidebars
- **Mobile:** <768px, stacked layout

### 8.2 Mobile tilpasninger

- Sidebars blir slide-in drawers
- Kalender: dagvisning default
- KPI strip: horizontal scroll

**Agent Panel på mobil:**
- Bottom sheet med drag handle
- Navigasjon via FAB-knapp nederst til høyre
- State persisteres ved navigasjon (via React context)
- Swipe ned for å lukke

### 8.3 Feilhåndtering

| Scenario | Håndtering |
|----------|------------|
| Notion-sync feiler | Toast: "Kunne ikke synkronisere. Prøver igjen..." + retry |
| Agent-kall timeout | Toast: "Agenten bruker lenger tid. Sjekk logg." |
| Offline | Banner: "Du er offline. Endringer lagres lokalt." |

**Loading states:**
- Skeleton loaders for kort og lister
- Spinner i agent-toggle ved invokering
- Progress bar for langvarige agent-operasjoner

---

## 9. Integrasjoner

### 9.1 Notion API

Bruker `@notionhq/client` via eksisterende `lib/notion.ts`. Nye API-endepunkter:

```typescript
// GET /api/portal/admin/notion/projects
// Henter Projects-database for valgt divisjon
const response = await notion.databases.query({
  database_id: process.env.NOTION_PROJECTS_DB_ID,
  filter: {
    property: "Division",
    select: { equals: divisionName }
  }
});

// PATCH /api/portal/admin/notion/tasks/:id
// Oppdaterer task med ny tid (drag-and-drop)
await notion.pages.update({
  page_id: taskId,
  properties: {
    "Scheduled": { date: { start: newDateTime } }
  }
});
```

**Environment Variables:**
- `NOTION_PROJECTS_DB_ID` — Projects database UUID
- `NOTION_TASKS_DB_ID` — Tasks database UUID

**Sync-strategi:**
- Polling hvert 30. sekund for kalendervisning
- Optimistisk UI-oppdatering ved drag-and-drop
- Toast-melding ved synkroniseringsfeil

### 9.2 Supabase

- Bookinger: `Booking` tabell
- Elever: `User` tabell med `role: STUDENT`
- Økter: `CoachingSession` tabell
- Meldinger: `UnifiedMessage` tabell

### 9.3 Agent-implementasjon

Agentene er Claude Code-agenter definert i `~/.claude/agents/`. I Mission Control UI vises de som toggles og handlingslogg.

**Backend-implementasjon:**

```typescript
// POST /api/portal/admin/agents/invoke
// Kjører agent-prompt via Anthropic Claude
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();
const agentPrompts = {
  coach: await readFile("~/.claude/agents/ak-academy-director.md"),
  mercury: await readFile("~/.claude/agents/ak-cmo.md"),
  // ...
};

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  system: agentPrompts[agentName],
  messages: [{ role: "user", content: userPrompt }]
});
```

**Agent toggle-state:** Lagres i `AgentConfig`-tabell (se seksjon 9.4).

### 9.4 Nye database-modeller

Legg til i `prisma/schema.prisma`:

```prisma
model AgentConfig {
  id        String   @id @default(cuid())
  userId    String
  agentName String   // "coach", "mercury", "atlas", etc.
  isActive  Boolean  @default(true)
  scope     String[] // ["AK_GOLF", "JUNIOR", "GFGK"]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  User      User     @relation(fields: [userId], references: [id])

  @@unique([userId, agentName])
}

model AgentActionLog {
  id        String   @id @default(cuid())
  agentName String
  action    String
  details   Json?
  userId    String?
  timestamp DateTime @default(now())
}
```

---

## 10. Neste steg

1. **Spec review** — Verifiser at alle komponenter er dekket
2. **Implementation plan** — Prioritert utvikling av sider
3. **Component library** — Felles komponenter på tvers av sider
4. **API-endepunkter** — Backend for kalender og agent-integrasjon
5. **Testing** — E2E-tester for kritiske flyter

---

## 11. Mockup-filer

Alle mockups ligger i `.superpowers/brainstorm/66555-1775161249/`:

```
├── index.html              # Oversikt over alle 14 sider
├── final-design.html       # Hub — Oversikt
├── page-hub-focus.html     # Hub — Focus Mode
├── page-kalender.html      # Kalender (Notion-stil)
├── page-bookinger.html     # Bookinger
├── page-godkjenninger.html # Godkjenninger
├── page-tilgjengelighet.html # Tilgjengelighet
├── page-elever.html        # Elever
├── page-elevprofil.html    # Elevprofil
├── page-coaching-notater.html # Coaching-notater
├── page-meldinger.html     # Meldinger
├── page-ai-assistent.html  # AI-assistent
├── page-agenter.html       # Agenter
├── page-rapporter.html     # Rapporter
└── page-okonomi.html       # Økonomi
```

**Preview:** `npx -y serve -p 64102` fra mockups-mappen
