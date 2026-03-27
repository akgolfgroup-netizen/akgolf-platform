# Implementeringsplan: Wireframes → Produksjon

> **Versjon:** 1.0
> **Opprettet:** 27. mars 2026
> **Status:** Klar for gjennomgang

## Oversikt

Dette dokumentet beskriver planen for å implementere alle 42 wireframes i produksjon. Planen er delt inn i 6 faser over estimert 8-10 uker.

---

## Nåværende status

### Kartlegging: Wireframe → Eksisterende side

| # | Wireframe | Rute | Status | Gap |
|---|-----------|------|--------|-----|
| **Foundation** |
| 00 | Design Tokens | `globals.css` | ✅ Eksisterer | Komplett |
| 02 | Layout Patterns | `layout.tsx` | ✅ Eksisterer | Komplett |
| 03 | Interaction States | Komponenter | ⚠️ Delvis | Mangler loading/empty states |
| 05 | Component Library | — | ❌ Mangler | Intern dokumentasjon |
| **Markedsside** |
| 10 | Forside | `/` | ✅ Eksisterer | Design-oppgradering |
| 11 | Academy | `/academy` | ✅ Eksisterer | Mindre justeringer |
| 12 | Junior | `/junior` | ✅ Eksisterer | Mindre justeringer |
| 13 | Utvikling | `/utvikling` | ✅ Eksisterer | Mindre justeringer |
| 14 | Personvern | `/personvern` | ✅ Eksisterer | Komplett |
| **Booking** |
| 31 | Booking Flow | `/booking/new` | ✅ Eksisterer | Visuell polish |
| 32 | Betaling | `/booking/[id]/pay` | ✅ Eksisterer | Komplett |
| 33 | Bekreftelse | `/booking/[id]/confirmation` | ✅ Eksisterer | Komplett |
| **Portal — Bruker** |
| 22 | Login | `/portal/login` | ✅ Eksisterer | Magic link-tab |
| 40 | Dashboard | `/portal` | ✅ Eksisterer | Widget-oppgradering |
| 41 | Bookinger | `/portal/bookinger` | ✅ Eksisterer | Modal-forbedringer |
| 42 | Dagbok | `/portal/dagbok` | ✅ Eksisterer | Streak-visualisering |
| 43 | Profil | `/portal/profil` | ✅ Eksisterer | Achievement-grid |
| 44 | AI Analyse | `/portal/analyse` | ✅ Eksisterer | Komplett |
| 45 | Treningsplan | `/portal/treningsplan` | ✅ Eksisterer | Øvelsesbank-sheet |
| 46 | Sammenligning | `/portal/sammenligning` | ✅ Eksisterer | Radar-forbedringer |
| 47 | Statistikk | `/portal/statistikk` | ✅ Eksisterer | SG-grafer |
| 48 | Turneringer | `/portal/turneringsplan` | ✅ Eksisterer | Tidslinje-view |
| 49 | Coaching-historikk | `/portal/coaching-historikk` | ✅ Eksisterer | AI-oppsummering UI |
| 50 | Kalender | `/portal/kalender` | ✅ Eksisterer | Google Sync modal |
| 51 | Innstillinger | `/portal/innstillinger` | ❌ **MANGLER** | Hele siden |
| 52 | Meldinger | `/portal/meldinger` | ❌ **MANGLER** | Hele siden |
| 53 | Notifikasjoner | `/portal/notifikasjoner` | ❌ **MANGLER** | Hele siden |
| 54 | Eksport | `/portal/eksport` | ❌ **MANGLER** | Hele siden |
| **Portal — Admin** |
| 60 | Admin Dashboard | `/portal/admin` | ⚠️ Delvis | Flytt fra denne-uken |
| 61 | Elever | `/portal/admin/elever` | ✅ Eksisterer | Slide-out panel |
| 62 | Bookinger | `/portal/admin/bookinger` | ✅ Eksisterer | Kalendervisning |
| 63 | Tilgjengelighet | `/portal/admin/tilgjengelighet` | ✅ Eksisterer | Ukegrid-polish |
| 64 | E-postmaler | `/portal/admin/e-postmaler` | ✅ Eksisterer | Preview-panel |
| 65 | Kalender | `/portal/admin/kalender` | ✅ Eksisterer | Statistikk-panel |
| 66 | Turneringer | `/portal/admin/turneringer` | ✅ Eksisterer | Planleggingsmodal |

### Oppsummering

| Kategori | Totalt | Eksisterer | Mangler | Trenger oppgradering |
|----------|--------|------------|---------|---------------------|
| Foundation | 4 | 2 | 1 | 1 |
| Markedsside | 5 | 5 | 0 | 3 |
| Booking | 3 | 3 | 0 | 1 |
| Portal Bruker | 15 | 11 | 4 | 10 |
| Portal Admin | 7 | 6 | 1 | 5 |
| **Totalt** | **34** | **27** | **6** | **20** |

---

## Faser

### Fase 0: Forberedelser (Uke 1)

**Mål:** Klargjøre kodebase og design system

#### Oppgaver

1. **Design tokens audit**
   - [ ] Verifiser at alle tokens fra `00-design-tokens.html` finnes i `globals.css`
   - [ ] Legg til manglende CSS custom properties
   - [ ] Oppdater Tailwind config med tokens

2. **Komponentbibliotek-audit**
   - [ ] Liste alle eksisterende komponenter
   - [ ] Identifiser komponenter som mangler i henhold til wireframes
   - [ ] Lag en komponentmatrise (wireframe → komponent)

3. **Database-migrasjoner**
   - [ ] `Notification`-modell (finnes allerede i schema)
   - [ ] `Conversation` og `Message`-modeller (finnes allerede)
   - [ ] `UserSettings` for innstillinger (trenger opprettes)

4. **API-ruter planlegging**
   - [ ] Liste opp nye endepunkter som trengs
   - [ ] Planlegg WebSocket/SSE for meldinger

```
Nye ruter som trengs:
POST /api/portal/notifications/mark-read
GET  /api/portal/notifications
GET  /api/portal/messages
POST /api/portal/messages
GET  /api/portal/messages/[conversationId]
POST /api/portal/export/pdf
POST /api/portal/export/csv
GET  /api/portal/settings
PUT  /api/portal/settings
```

---

### Fase 1: Nye sider (Uke 2-3)

**Mål:** Implementer de 6 manglende sidene

#### 1.1 Portal Innstillinger `/portal/innstillinger`

**Wireframe:** `51-portal-innstillinger.html`

**Komponenter å lage:**
- [ ] `settings-tabs.tsx` — Profilfane, varsler, tilkoblede kontoer, abonnement, personvern
- [ ] `notification-toggles.tsx` — Toggle-switches for varslingstyper
- [ ] `connected-accounts.tsx` — Google, GolfBox, Trackman tilkoblinger
- [ ] `subscription-card.tsx` — Viser nåværende tier og oppgraderingsmuligheter
- [ ] `danger-zone.tsx` — Slett data, slett konto

**Datakilder:**
- `User` — grunnleggende profildata
- `UserSubscription` — abonnementsstatus
- Google OAuth — tilkoblingsstatus

**API-ruter:**
```typescript
// app/api/portal/settings/route.ts
GET  /api/portal/settings
PUT  /api/portal/settings

// app/api/portal/settings/notifications/route.ts
PUT  /api/portal/settings/notifications

// app/api/portal/settings/connected-accounts/route.ts
GET  /api/portal/settings/connected-accounts
DELETE /api/portal/settings/connected-accounts/[provider]
```

---

#### 1.2 Portal Meldinger `/portal/meldinger`

**Wireframe:** `52-portal-meldinger.html`

**Komponenter å lage:**
- [ ] `conversation-list.tsx` — Liste med samtaler
- [ ] `chat-panel.tsx` — Meldingsvisning med input
- [ ] `message-bubble.tsx` — Enkeltmelding
- [ ] `typing-indicator.tsx` — "skriver..."-animasjon
- [ ] `new-conversation-modal.tsx` — Start ny samtale

**Datakilder:**
- `Conversation` — samtaler
- `Message` — meldinger
- `User` / `Instructor` — deltakere

**Sanntid:**
- Server-Sent Events (SSE) for nye meldinger
- Polling som fallback

**API-ruter:**
```typescript
// app/api/portal/messages/route.ts
GET  /api/portal/messages — liste samtaler
POST /api/portal/messages — ny melding

// app/api/portal/messages/[conversationId]/route.ts
GET  /api/portal/messages/[conversationId]
POST /api/portal/messages/[conversationId]

// app/api/portal/messages/stream/route.ts
GET  /api/portal/messages/stream — SSE endpoint
```

---

#### 1.3 Portal Notifikasjoner `/portal/notifikasjoner`

**Wireframe:** `53-portal-notifikasjoner.html`

**Komponenter å lage:**
- [ ] `notification-list.tsx` — Gruppert liste (i dag, i går, tidligere)
- [ ] `notification-card.tsx` — Enkeltnotifikasjon med ikon, handling
- [ ] `notification-filters.tsx` — Alle, ulest, booking, coaching, system
- [ ] `bulk-actions.tsx` — Marker alle som lest, arkiver

**Datakilder:**
- `Notification` — eksisterende modell

**API-ruter:**
```typescript
// app/api/portal/notifications/route.ts
GET  /api/portal/notifications?filter=unread

// app/api/portal/notifications/mark-read/route.ts
POST /api/portal/notifications/mark-read
POST /api/portal/notifications/mark-all-read

// app/api/portal/notifications/[id]/route.ts
DELETE /api/portal/notifications/[id]
```

---

#### 1.4 Portal Eksport `/portal/eksport`

**Wireframe:** `54-portal-eksport.html`

**Komponenter å lage:**
- [ ] `export-format-card.tsx` — PDF, CSV, iCal, JSON valg
- [ ] `date-range-picker.tsx` — Fra/til med presets
- [ ] `data-selection.tsx` — Checkboxes for datatyper
- [ ] `export-history.tsx` — Tidligere eksporter
- [ ] `export-progress-modal.tsx` — Fremdrift og nedlasting

**Datakilder:**
- `RoundStats`, `TrainingLog`, `Booking`, `HandicapEntry` etc.

**API-ruter:**
```typescript
// app/api/portal/export/pdf/route.ts
POST /api/portal/export/pdf — generer PDF-rapport

// app/api/portal/export/csv/route.ts
POST /api/portal/export/csv — generer CSV

// app/api/portal/export/ical/route.ts
GET  /api/portal/export/ical — iCal-feed (eksisterer delvis)

// app/api/portal/export/history/route.ts
GET  /api/portal/export/history
```

---

#### 1.5 Admin Dashboard `/portal/admin`

**Wireframe:** `60-admin-dashboard.html`

**Komponenter å lage:**
- [ ] `admin-stats-grid.tsx` — Bookinger, inntekt, elever, oppmøte
- [ ] `today-schedule.tsx` — Dagens timeplan
- [ ] `revenue-chart.tsx` — Inntektsgraf (ukentlig/månedlig)
- [ ] `pending-actions.tsx` — Ventende handlinger
- [ ] `recent-activity.tsx` — Siste aktivitet

**Datakilder:**
- `Booking` — bookingstatistikk
- `PaymentTransaction` — inntekt
- `User` — elevtall
- `CoachingSession` — oppmøte

**Merknad:** Slå sammen med `/portal/admin/denne-uken` eller erstatt.

---

#### 1.6 Component Library (intern) `/portal/admin/components`

**Wireframe:** `05-component-library.html`

**Oppgave:** Lag en Storybook-lignende side for interne komponenter.

- [ ] Installer Storybook eller lag egen showcase-side
- [ ] Dokumenter alle portal-komponenter
- [ ] Inkluder interaktive eksempler

---

### Fase 2: Portal-oppgraderinger (Uke 4-5)

**Mål:** Oppgrader eksisterende portal-sider til å matche wireframes

#### Prioritert liste

| Side | Wireframe | Hovedendringer |
|------|-----------|----------------|
| Dashboard | 40 | Widgets, quick actions, trend-alerts |
| Bookinger | 41 | Forbedret modal, avbestillingsflyt |
| Dagbok | 42 | Streak-badge, kalender-heatmap |
| Profil | 43 | Achievement-grid, goal-tracking |
| Treningsplan | 45 | Øvelsesbank slide-out |
| Kalender | 50 | Google Sync-modal, hendelsesdetaljer |
| Coaching-historikk | 49 | AI-oppsummering expandable |

#### Detaljert for Dashboard (40)

**Nåværende:** Grunnleggende stats og liste over bookinger

**Wireframe viser:**
- 4 stat-kort med trender
- Kommende økter-kort
- Treningsstreak-widget
- Quick actions (ny booking, logg trening)
- Aktivitetslogg

**Komponenter å lage/oppdatere:**
- [ ] `dashboard-stats-grid.tsx` — 4 kort med sparklines
- [ ] `upcoming-sessions.tsx` — Kommende økter med CTA
- [ ] `streak-widget.tsx` — Treningsstreak med kalender
- [ ] `quick-actions.tsx` — Hurtigvalg
- [ ] `activity-feed.tsx` — Siste aktivitet

---

### Fase 3: Admin-oppgraderinger (Uke 5-6)

**Mål:** Oppgrader admin-sider til å matche wireframes

#### Prioritert liste

| Side | Wireframe | Hovedendringer |
|------|-----------|----------------|
| Elever | 61 | Slide-out panel, tier-badges |
| Bookinger | 62 | Kalendervisning toggle, fargekoding |
| Tilgjengelighet | 63 | Ukegrid-interaksjon, exceptions |
| E-postmaler | 64 | Live preview, variable-chips |
| Kalender | 65 | Statistikk-panel, current-time |
| Turneringer | 66 | Planleggingsmodal, tidslinje |

---

### Fase 4: Markedsside-polish (Uke 6-7)

**Mål:** Visuell oppgradering av markedssider

#### Oppgaver per side

**Forside (10)**
- [ ] Hero-animasjoner
- [ ] Testimonial-carousel
- [ ] Stats-seksjon med animerte tall
- [ ] Video-bakgrunn eller gradient

**Academy (11)**
- [ ] Program-kort med hover-effekter
- [ ] FAQ-accordion forbedringer
- [ ] Pris-kalkulator

**Junior (12)**
- [ ] Aldersgruppe-velger
- [ ] Foreldre-FAQ seksjon

**Utvikling (13)**
- [ ] Opptakskrav-sjekkliste
- [ ] Søknadsprosess-tidslinje

---

### Fase 5: Booking-polish (Uke 7)

**Mål:** Forbedre booking-flyten

#### Oppgaver

- [ ] Steg-indikator med animasjon
- [ ] Instruktør-kort med bio
- [ ] Kalendersvelger med tilgjengelighet
- [ ] Betalingssammendrag forbedringer
- [ ] Bekreftelsesside med CTA til portal

---

### Fase 6: Testing og QA (Uke 8)

**Mål:** Kvalitetssikring før lansering

#### Oppgaver

- [ ] Responsiv testing (mobil, tablet, desktop)
- [ ] Tilgjengelighet (a11y) audit
- [ ] Ytelsestesting (Lighthouse)
- [ ] Cross-browser testing
- [ ] E2E-tester for kritiske flyter
- [ ] Brukertest med 3-5 testbrukere

---

## Tekniske hensyn

### Database-endringer

```prisma
// Nye modeller som trengs

model UserSettings {
  id                    String   @id @default(cuid())
  userId                String   @unique
  user                  User     @relation(fields: [userId], references: [id])

  // Varsler
  emailBookingReminder  Boolean  @default(true)
  emailCoachingSummary  Boolean  @default(true)
  emailNewsletter       Boolean  @default(false)
  pushEnabled           Boolean  @default(true)

  // Personvern
  profileVisible        Boolean  @default(true)
  showInComparison      Boolean  @default(true)

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

// Eksport-historikk
model ExportHistory {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      ExportType
  format    String   // pdf, csv, ical, json
  dateFrom  DateTime
  dateTo    DateTime
  fileUrl   String?
  fileSize  Int?
  createdAt DateTime @default(now())
}

enum ExportType {
  FULL_REPORT
  STATISTICS
  BOOKINGS
  TRAINING_LOG
}
```

### Nye komponenter (prioritert)

```
Høy prioritet (Fase 1):
├── portal/settings/
│   ├── settings-tabs.tsx
│   ├── notification-toggles.tsx
│   └── connected-accounts.tsx
├── portal/messages/
│   ├── conversation-list.tsx
│   ├── chat-panel.tsx
│   └── message-bubble.tsx
├── portal/notifications/
│   ├── notification-list.tsx
│   └── notification-card.tsx
└── portal/export/
    ├── export-format-card.tsx
    └── date-range-picker.tsx

Medium prioritet (Fase 2-3):
├── portal/dashboard/
│   ├── dashboard-stats-grid.tsx
│   ├── streak-widget.tsx
│   └── quick-actions.tsx
├── portal/admin/
│   ├── admin-stats-grid.tsx
│   └── revenue-chart.tsx
└── portal/dagbok/
    └── calendar-heatmap.tsx
```

### API-struktur

```
app/api/portal/
├── settings/
│   ├── route.ts                    GET, PUT
│   ├── notifications/route.ts      PUT
│   └── connected-accounts/
│       ├── route.ts                GET
│       └── [provider]/route.ts     DELETE
├── messages/
│   ├── route.ts                    GET, POST
│   ├── [conversationId]/route.ts   GET, POST
│   └── stream/route.ts             GET (SSE)
├── notifications/
│   ├── route.ts                    GET
│   ├── mark-read/route.ts          POST
│   └── [id]/route.ts               DELETE
└── export/
    ├── pdf/route.ts                POST
    ├── csv/route.ts                POST
    ├── ical/route.ts               GET
    └── history/route.ts            GET
```

---

## Estimater

| Fase | Varighet | Hovedleveranse |
|------|----------|----------------|
| Fase 0 | 1 uke | Forberedelser, tokens, migrations |
| Fase 1 | 2 uker | 6 nye sider |
| Fase 2 | 2 uker | Portal-oppgraderinger |
| Fase 3 | 1 uke | Admin-oppgraderinger |
| Fase 4 | 1 uke | Markedsside-polish |
| Fase 5 | 0.5 uke | Booking-polish |
| Fase 6 | 1 uke | Testing og QA |
| **Totalt** | **8-9 uker** | Komplett implementering |

---

## Avhengigheter

| Avhengighet | Blokkerer | Løsning |
|-------------|-----------|---------|
| Stripe-produkter | Abonnement i innstillinger | Bekreft produkt-IDer |
| Google OAuth | Kalender-synk | Sett opp credentials |
| Twilio | SMS-varsler | Eksisterer allerede |
| Resend | E-postvarsler | Eksisterer allerede |

---

## Risiko

| Risiko | Sannsynlighet | Konsekvens | Mitigering |
|--------|---------------|------------|------------|
| Sanntidsmeldinger kompleksitet | Medium | Forsinkelse | Start med polling, migrer til SSE |
| PDF-generering ytelse | Lav | Timeout | Async jobb med Vercel Functions |
| Design-tokens mismatch | Lav | UI-bugs | Grundig audit i Fase 0 |

---

## Neste steg

1. **Godkjenn planen** — Gjennomgå og juster estimater
2. **Start Fase 0** — Design tokens audit og database-migrasjoner
3. **Parallell utvikling** — Fase 1 kan starte mens Fase 0 avsluttes

---

## Fil-referanser

- Wireframes: `/wireframes/index.html`
- Design System: `/wireframes/00-design-tokens.html`
- Komponentbibliotek: `/components/`
- API-ruter: `/app/api/`
- Database-schema: `/prisma/schema.prisma`
