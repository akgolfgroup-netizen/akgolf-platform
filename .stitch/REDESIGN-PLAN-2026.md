# AK Golf Platform — Komplett Redesign Plan 2026

**Dato:** 9. april 2026  
**Status:** KLAR FOR UTFØRELSE  
**Mål:** Full redesign av alle skjermer med konsistent design system

---

## 1. OVERSIKT: NÅVÆRENDE PLATTFORM

### Eksisterende Sider (16 totalt)

| # | Side | Type | Status | Prioritet |
|---|------|------|--------|-----------|
| 1 | Landing (/) | Marketing | ✅ Eksisterer | P1 - Redesign |
| 2 | Booking Flow | Converting | ⚠️ Funksjonell, trenger UI | P1 - Redesign |
| 3 | Player Portal Dashboard | App | ⚠️ Eksisterer, trenger refresh | P1 - Redesign |
| 4 | Player Portal Stats | App | ⚠️ Eksisterer, trenger refresh | P2 - Redesign |
| 5 | Player Portal Rounds | App | ⚠️ Eksisterer, trenger refresh | P2 - Redesign |
| 6 | Player Portal Goals | App | ⚠️ Eksisterer, trenger refresh | P2 - Redesign |
| 7 | Player Portal Academy | App | ⚠️ Eksisterer, trenger refresh | P2 - Redesign |
| 8 | Admin Dashboard | App | ⚠️ Eksisterer, trenger refresh | P2 - Redesign |
| 9 | Admin Bookings | App | ⚠️ Eksisterer, trenger refresh | P2 - Redesign |
| 10 | Admin Players | App | ⚠️ Eksisterer, trenger refresh | P2 - Redesign |
| 11 | Admin Instructors | App | ⚠️ Eksisterer, trenger refresh | P2 - Redesign |
| 12 | Admin Services | App | ⚠️ Eksisterer, trenger refresh | P2 - Redesign |
| 13 | Admin Analytics | App | ⚠️ Eksisterer, trenger refresh | P2 - Redesign |
| 14 | Login / Auth | Auth | ⚠️ Eksisterer, trenger refresh | P1 - Redesign |
| 15 | Success/Cancel Pages | Converting | ⚠️ Eksisterer, trenger refresh | P3 - Redesign |
| 16 | Error Pages | System | ⚠️ Eksisterer, trenger refresh | P3 - Redesign |

---

## 2. DESIGN SYSTEM (ALLEREDE PÅ PLASS ✅)

**Fil:** `.stitch/DESIGN.md` — Brand v5.0 FINAL

### Nøkkel-elementer:
- **Farger:** Deep Emerald (#00594C), Warm Stone (#EBE7E0), Pure White
- **Typografi:** Inter, 300-700 weight, dramatisk skala 11px-72px
- **Knapper:** `rounded-full`, Inter 600
- **Cards:** Pure White, subtle border, rounded-[16px-24px]
- **Layout:** Bento grids (aldri identiske størrelser)
- **Animasjon:** Framer Motion, cubic-bezier(0.4, 0, 0.2, 1)

### Komponenter som må bygges:
- [ ] `Button` (Primary, Secondary, Outlined, Ghost)
- [ ] `Card` (Standard, Stat, AI Recommendation)
- [ ] `Input` (Text, Select, Date, Time)
- [ ] `Badge` (Success, Warning, Error, Info, AI)
- [ ] `StatCard` (med sparkline + trend)
- [ ] `BookingCard` (tjeneste-valg)
- [ ] `TimeSlotPicker` (kalender + tidsvelger)
- [ ] `Navigation` (top + sidebar)
- [ ] `Modal` / `Sheet`
- [ ] `Toast` / `Notification`
- [ ] `EmptyState`
- [ ] `Skeleton` (loading states)

---

## 3. UTFØRELSESPLAN

### FASE 1: Design System & Komponenter (2-3 dager)

**Mål:** Etablere komponent-bibliotek før skjerm-generering

```
Dag 1:
├── Oppdater globals.css med design tokens
├── Sett opp Tailwind-utvidelser
└── Lag base-komponenter (Button, Card, Input)

Dag 2:
├── Lag komplekse komponenter (StatCard, BookingCard)
├── Lag layout-komponenter (Navigation, Modal)
└── Test komponenter i isolasjon

Dag 3:
├── Lag Storybook/Playground for komponenter
├── Dokumenter bruk
└── Fiks eventuelle issues
```

**Output:** `components/ui/` mappe med alle base-komponenter

---

### FASE 2: Marketing & Landing (2 dager)

**Mål:** Redesign av landingsside med nytt design system

| Side | Prompt Fokus |
|------|--------------|
| Landing (/) | Hero med CTA, tjeneste-seksjoner, sosial bevis, booking CTA |

**Stitch Prompt:**
```
Generate a premium landing page for AK Golf Academy. 
Hero section with dramatic typography (60px headline), 
Deep Emerald (#00594C) CTA buttons, Warm Stone background.
Include: Hero, Services grid (bento layout), Testimonials, 
Booking CTA section. Professional, calm authority aesthetic.
```

---

### FASE 3: Booking Flow (3-4 dager)

**Mål:** Komplett redesign av booking-opplevelsen

| Side | Funksjon | Design Focus |
|------|----------|--------------|
| /booking | Velg tjeneste | Grid av tjeneste-kort med bilder, pris, varighet |
| /booking/instructor | Velg instruktør | Profil-kort med bilde, bio, spesialisering |
| /booking/datetime | Velg tid | Kalender + tids-slots, ledig/opptatt visuelt |
| /booking/review-confirm | Bekreft booking | Oppsummering, bruker-info skjema, betaling |
| /booking/success | Bekreftelse | Suksess-melding, booking-detaljer, neste steg |
| /booking/cancel | Avbrudd | Avbrudds-melding, tilbake til booking CTA |

**Stitch Prompt (Booking):**
```
Generate a premium booking flow for golf coaching services.
Step 1: Service selection with large cards showing 
service image, name, price (tabular nums), duration.
Step 2: Instructor selection with profile cards.
Step 3: Calendar view with available time slots.
Step 4: Review page with form fields for user details.
Use Deep Emerald for primary actions, Warm Stone background,
Pure White cards. Clean, professional, easy to scan.
```

---

### FASE 4: Player Portal (3-4 dager)

**Mål:** Komplett redesign av spiller-dashboard

| Side | Funksjon | Design Focus |
|------|----------|--------------|
| /portal | Dashboard | KPI-kort, siste runder, kommende bookinger, mål |
| /portal/stats | Statistikk | Detaljerte grafer, trender, sammenligninger |
| /portal/rounds | Runder | Liste over spilte runder, detaljer, analyse |
| /portal/goals | Mål | Mål-tracking, fremgang, AI-anbefalinger |
| /portal/academy | Academy | Kurs, progresjon, sertifiseringer |
| /portal/settings | Innstillinger | Profil, varsler, betaling |

**Stitch Prompt (Portal Dashboard):**
```
Generate a premium player dashboard for AK Golf Academy.
Bento grid layout with varied card sizes:
- Large: Handicap trend with sparkline
- Medium: Last round score, upcoming bookings
- Small: Streak counter, goals progress
Use stat cards with tabular numbers, trend indicators,
sparklines. Deep Emerald accents, Warm Stone background.
Professional, data-dense but clean.
```

---

### FASE 5: Admin Portal (3-4 dager)

**Mål:** Komplett redesign av admin-dashboard

| Side | Funksjon | Design Focus |
|------|----------|--------------|
| /admin | Dashboard | KPI-er, dagens bookinger, nye spillere |
| /admin/bookings | Booking-oversikt | Kalender/liste, filtre, handlinger |
| /admin/players | Spiller-oversikt | Tabell, søk, filter, detaljer |
| /admin/instructors | Instruktører | Profil-håndtering, tilgjengelighet |
| /admin/services | Tjenester | Priser, varighet, beskrivelser |
| /admin/analytics | Analyse | Inntekter, bookings, trends |
| /admin/settings | Innstillinger | System-innstillinger |

**Stitch Prompt (Admin Dashboard):**
```
Generate a premium admin dashboard for AK Golf Academy.
Data-dense layout with:
- KPI row: Revenue, Bookings, New players, Occupancy
- Today's schedule: Timeline view
- Recent activity: List with avatars
- Quick actions: Button row
Use tables for data, cards for summaries.
Deep Emerald for primary, Warm Stone background.
Professional, efficient, authoritative.
```

---

### FASE 6: Auth & System (1-2 dager)

**Mål:** Redesign av auth og system-sider

| Side | Funksjon | Design Focus |
|------|----------|--------------|
| /login | Innlogging | Clean form, minimal, fokusert |
| /register | Registrering | Step-by-step, progress indicator |
| /forgot-password | Glemt passord | Simple form, clear CTA |
| /error | Feilside | Hjelpsom, navigasjon tilbake |
| /404 | Ikke funnet | Brand-consistent, nyttig lenker |

---

## 4. TEKNISK IMPLEMENTASJON

### Mappestruktur

```
app/
├── (marketing)/           # Landing pages
│   ├── page.tsx
│   └── layout.tsx
├── (booking)/             # Booking flow
│   ├── booking/
│   │   ├── page.tsx
│   │   ├── instructor/
│   │   ├── datetime/
│   │   ├── review-confirm/
│   │   ├── success/
│   │   └── cancel/
│   └── layout.tsx
├── (portal)/              # Player portal
│   ├── portal/
│   │   ├── page.tsx
│   │   ├── stats/
│   │   ├── rounds/
│   │   ├── goals/
│   │   ├── academy/
│   │   └── settings/
│   └── layout.tsx
├── (admin)/               # Admin portal
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── bookings/
│   │   ├── players/
│   │   ├── instructors/
│   │   ├── services/
│   │   ├── analytics/
│   │   └── settings/
│   └── layout.tsx
├── (auth)/                # Auth pages
│   ├── login/
│   ├── register/
│   └── forgot-password/
└── error.tsx

components/
├── ui/                    # Base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   ├── stat-card.tsx
│   ├── booking-card.tsx
│   ├── time-slot-picker.tsx
│   ├── navigation.tsx
│   ├── modal.tsx
│   ├── toast.tsx
│   ├── empty-state.tsx
│   └── skeleton.tsx
├── booking/               # Booking-specific
├── portal/                # Portal-specific
└── admin/                 # Admin-specific

lib/
├── design-tokens.ts       # Farger, spacing, etc.
└── utils.ts
```

### Avhengigheter

```bash
# Allerede installert:
# - Next.js 16.2.2
# - Tailwind CSS
# - shadcn/ui
# - Framer Motion

# Sjekk/oppdater:
npm install framer-motion lucide-react
```

---

## 5. STITCH WORKFLOW

### For hver skjerm:

1. **Forberedelse:**
   ```bash
   # Les design system
   cat .stitch/DESIGN.md
   
   # Sjekk eksisterende skjerm
   cat app/booking/page.tsx
   ```

2. **Prompt Engineering:**
   ```bash
   # Bruk enhance-prompt skill
   cat .agents/skills/enhance-prompt/SKILL.md
   ```

3. **Generering:**
   ```bash
   # Stitch MCP generate_screen_from_text
   # eller edit_screens for eksisterende
   ```

4. **Konvertering:**
   ```bash
   # Konverter Stitch output til React
   python convert_stitch.py
   # eller
   python convert_all.py
   ```

5. **Integrering:**
   - Kopier til riktig mappe
   - Koble til eksisterende data fetching
   - Test funksjonalitet

6. **Review:**
   - Visuell konsistens
   - Responsivitet
   - Tilgjengelighet
   - Performance

---

## 6. TIDSPLAN

| Fase | Varighet | Start | Slutt |
|------|----------|-------|-------|
| Fase 1: Design System | 3 dager | Dag 1 | Dag 3 |
| Fase 2: Marketing | 2 dager | Dag 4 | Dag 5 |
| Fase 3: Booking | 4 dager | Dag 6 | Dag 9 |
| Fase 4: Player Portal | 4 dager | Dag 10 | Dag 13 |
| Fase 5: Admin Portal | 4 dager | Dag 14 | Dag 17 |
| Fase 6: Auth & System | 2 dager | Dag 18 | Dag 19 |
| **Buffer/Testing** | **3 dager** | **Dag 20** | **Dag 22** |
| **TOTAL** | **22 dager** | | |

**Realistisk med 50% fokus:** ~6 uker  
**Med 100% fokus:** ~3-4 uker

---

## 7. NESTE STEG (START HER)

### I dag:

1. **Godkjenn denne planen** ✅
2. **Start Fase 1** — Design System:
   ```bash
   # Oppdater globals.css med design tokens fra DESIGN.md
   # Lag components/ui/ mappe
   # Bygg Button, Card, Input komponenter
   ```

3. **Generer første skjerm** (Landing):
   ```bash
   # Bruk Stitch MCP
   # Prompt: Landing page med hero, services, testimonials
   ```

---

## 8. VURDERINGER & BESLUTNINGER

### Hva skal beholdes fra eksisterende?
- ✅ Database schema (fungerer bra)
- ✅ API routes (logikken er solid)
- ✅ Auth flow (Auth0/NextAuth)
- ✅ Stripe integrasjon
- ✅ Booking logikk

### Hva skal redesignes?
- 🔄 ALL UI (komponenter, layout, visuell design)
- 🔄 ALL CSS (nytt design system)
- 🔄 Navigasjons-struktur
- 🔄 Responsivitet
- 🔄 Animations/interactions

### Tekniske valg:
- **CSS:** Tailwind + custom design tokens
- **Components:** shadcn/ui som base, custom på toppen
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts (allerede i bruk)

---

## 9. RISIKO & MITIGERING

| Risiko | Sannsynlighet | Impact | Mitigering |
|--------|---------------|--------|------------|
| Scope creep | Medium | High | Strict prioritization, P1/P2/P3 |
| Design inconsistency | Medium | Medium | Design tokens, component library |
| Booking flow breakage | Low | High | Test thoroughly, keep old version |
| Performance issues | Low | Medium | Lazy loading, code splitting |
| Mobile responsiveness | Medium | Medium | Mobile-first approach |

---

## 10. DEFINISJON AV FERDIG

### MVP (Minimum Viable Product):
- [ ] Design system på plass
- [ ] Landing page redesignet
- [ ] Booking flow redesignet (fungerende)
- [ ] Player portal dashboard redesignet
- [ ] Admin dashboard redesignet
- [ ] Auth pages redesignet

### Full Launch:
- [ ] Alle 16 sider redesignet
- [ ] Alle komponenter dokumentert
- [ ] Responsivitet testet (mobile, tablet, desktop)
- [ ] Tilgjengelighet audit (WCAG AA)
- [ ] Performance audit (Lighthouse 90+)
- [ ] Cross-browser testing
- [ ] Booking flow E2E testet

---

**Plan laget:** 9. april 2026  
**Neste review:** Ved fullføring av Fase 1  
**Ansvarlig:** AK Golf Dev Team
