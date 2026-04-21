# Komponentbibliotek — AK Golf Platform

Sjekk her FOR du bygger nye komponenter. Oppdater etter nye komponenter.

## Booking Wizard (`components/booking/`)

Gjenbrukbar booking-flyt (Cal.com-inspirert). Brukes i `/academy/booking` og `/portal/bookinger/ny`.

| Komponent | Fil | Bruk |
|-----------|-----|------|
| BookingWizard | `booking-wizard.tsx` | Steg-container med progress-indikator, AnimatePresence |
| ServiceSelector | `service-selector.tsx` | Velg tjeneste (kort med pris) + instruktoer-liste |
| BookingDatePicker | `date-picker.tsx` | Dato-pills + slot-henting fra API |
| TimeSlots | `time-slots.tsx` | Bekreft valgt tidspunkt med oppsummering |
| BookingSummary | `booking-summary.tsx` | Kundedetaljer + Stripe-betaling |

### Typer (`booking-types.ts`)
- `ServiceType` — id, name, description, category, duration, price, color, maxStudents, instructors
- `InstructorOption` — id, title, user (name, image)
- `BookingStep` — "service" | "instructor" | "date" | "time" | "summary"
- `BookingState` — service, instructor, date, slot, customerName/Email/Phone
- `formatPrice(price)` — formatterer kroner til "X kr"
- `getVisibleSteps(hasMultipleInstructors)` — returnerer synlige steg

## Portal — Booking (`components/portal/booking/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| BookingStatusBadge | `booking-status-badge.tsx` | Fargekodet badge (success/warning/cancelled) |
| UpcomingBookingCard | `upcoming-booking-card.tsx` | Kort for kommende booking med ikon, tid, instruktor |
| NextBookingHero | `next-booking-hero.tsx` | Uthevet hero for neste booking |
| PastBookingList | `past-booking-list.tsx` | Liste over tidligere bookinger |
| CancellationRulesCard | `cancellation-rules-card.tsx` | Avbestillingsregler |
| RescheduleForm | `reschedule-form.tsx` | Skjema for endring av tidspunkt (portal) |
| BookingHoverCardGroup | `booking-hover-card.tsx` | Hover-effekt wrapper for kort |

### Typer (`booking-types.ts`)
- `BookingViewModel` — id, serviceName, instructorName, startTime, duration, location, status, type
- `BookingStatusVariant` — `"success" | "warning" | "cancelled"`
- `CancellationRule` — hours, rule, fee
- `getStatusConfig(booking)` — mapper status til label + variant

## Portal — Booking detalj (`app/portal/(dashboard)/bookinger/[id]/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| BookingDetailClient | `booking-detail-client.tsx` | Fullstendig booking-visning med kansellering |

Viser: dato, tid, instruktor, sted, status (BookingStatusBadge), betaling, notater.
Handlinger: Endre tidspunkt (lenke til /endre), Avbestill med bekreftelse.

## Portal — Treningsplan (`app/portal/(dashboard)/treningsplan/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| TreningsplanClient | `treningsplan-client.tsx` | Ukesvelger, dagskort-grid, pyramide-tags |

Gjenbruker: SubNavTabs, HeroHeading, GlassCard, PyramidTag, staggerContainer.

## Portal — Statistikk (`app/portal/(dashboard)/statistikk/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| StatistikkClient | `statistikk-client.tsx` | Stat-kort, SG-barer, AI-anbefaling |
| StatistikkCharts | `statistikk-charts.tsx` | ScoreTrend, SGRadar, TrainingVolume charts |

Gjenbruker: SubNavTabs, HeroHeading, PremiumStatCard, GlassCard, AnimatedNumber.

## Portal — Dagbok (`app/portal/(dashboard)/dagbok/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| DagbokClient | `dagbok-client.tsx` | Stats-kort, logg-liste, filter, view-toggle |
| DagbokCalendar | `dagbok-calendar.tsx` | Kalendervisning med aktivitetsprikker |
| DagbokStats | `dagbok-stats.tsx` | Kategorier-breakdown, streak-milestones |

Gjenbruker: SubNavTabs, HeroHeading, DarkStatCard, GlassCard, Shimmer, LogSessionModal, StreakMilestone.

## Portal — Premium UI (`components/portal/premium/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| GlassCard | `glass-card.tsx` | Glassmorfisme-kort (light/dark, padding, delay) |
| HeroHeading | `hero-heading.tsx` | Hero-overskrift med label, title, actions |
| Shimmer | `tilt-card.tsx` | Shimmer-animasjon for knapper |
| PremiumStatCard | `premium-stat-card.tsx` | Stat-kort med spotlight, trend, AnimatedNumber |
| DarkStatCard | `dark-stat-card.tsx` | Mork stat-kort (default/accent/primary variant) |
| AnimatedNumber | `animated-number.tsx` | Spring-animert tall-teller |
| PremiumBentoCard | `premium-bento-card.tsx` | Bento-kort med colSpan/rowSpan |
| PremiumBentoGrid | `premium-bento-card.tsx` | CSS Grid wrapper (2/3/4 kolonner) |
| PortalHeader | `portal-header.tsx` | Enklere header enn HeroHeading |
| PortalCard | `portal-card.tsx` | Server-safe kort (default/soft/bold) |
| TiltCard | `tilt-card.tsx` | 3D tilt-effekt med musen |
| AtmosphericBackground | `atmospheric-background.tsx` | Aurora-bakgrunn for portal |

### Motion presets (eksportert fra `motion-presets.ts`)
- `fadeInUp` — slide opp 20px + fade
- `fadeIn` — ren fade
- `staggerContainer` — orkestrerer barn-animasjoner (0.08s mellom)
- `scaleIn` — 0.95 -> 1 skalering
- `EASE` / `EASE_OUT_EXPO` — easing-kurver

## Admin — Mission Control UI (`components/portal/mission-control/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| MCTopbar | `mc-topbar.tsx` | Topbar med tittel, undertittel, hamburger |
| AdminCard | `ui/AdminCard.tsx` | Basis-kort |
| AdminButton | `ui/AdminButton.tsx` | Knapp (primary/secondary) |
| AdminBadge | `ui/AdminBadge.tsx` | Badge (muted/success/error/info) |
| AdminEmptyState | `ui/AdminEmptyState.tsx` | Tom tilstand med ikon |
| AdminStatCard | `ui/AdminStatCard.tsx` | KPI-kort med label, verdi, ikon |
| AdminDataTable | `ui/AdminDataTable.tsx` | Tabell med sok, sortering, paginering |
| AdminDialog | `ui/AdminDialog.tsx` | Modal dialog |
| AdminSelect | `ui/AdminSelect.tsx` | Select/dropdown |
| AdminInput | `ui/AdminInput.tsx` | Input-felt |
| AdminDateRangePicker | `ui/AdminDateRangePicker.tsx` | Datovelger (fra/til) |
| AdminDropdown | `ui/AdminDropdown.tsx` | Kontekstmeny |
| AdminPageHeader | `ui/AdminPageHeader.tsx` | Sideheader med tittel og actions |

## Admin — Bookinger (`app/admin/(authed)/bookinger/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| AdminBookingList | `components/portal/admin/admin-booking-list.tsx` | Booking-oversikt i MC |
| AdminCreateBookingForm | `components/portal/admin/admin-create-booking-form.tsx` | Ny booking i MC |
| RescheduleDialog | `reschedule-dialog.tsx` | Endre booking-tidspunkt med kalender |
| BookingDetailDrawer | `booking-detail-drawer.tsx` | Booking-detaljer i sidepanel |

## Admin — Focus kanban (`app/admin/(authed)/focus/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| FocusClient | `focus-client.tsx` | Kanban-board (Todo/InProgress/Done) med divisjonsfilter |
| CreateTaskDialog | `create-task-dialog.tsx` | Opprett ny oppgave med prioritet og divisjon |

Bruker AdminTask Prisma-modell. Divisjoner: Coaching, Junior, GFGK.

## Admin — Meldinger (`app/admin/(authed)/meldinger/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| AdminChatClient | `admin-chat-client.tsx` | Chat med samtaleliste, sok, optimistisk sending |
| MeldingerClient | `meldinger-client.tsx` | UnifiedMessage/AI-response godkjenning |

AdminChatClient bruker Conversation/Message via `chat-actions.ts`.
MeldingerClient bruker UnifiedMessage/AIResponse via `actions.ts`.

## Markedsside (`components/website/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| AKLogo | `AKLogo.tsx` | K-mark logo |
| WebsiteNav | `WebsiteNav.tsx` | Markedsside-nav |
| WebsiteFooter | `WebsiteFooter.tsx` | Markedsside-footer |
| ApplicationForm | `ApplicationForm.tsx` | Soknadsskjema |

## Portal — Layout (`components/portal/layout/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| SubNavTabs | `sub-nav-tabs.tsx` | Pills-navigasjon for sub-sider (aktiv = primary bg) |
| Sidebar | `portal-sidebar.tsx` | Portal-navigasjon |
| Topbar | `portal-topbar.tsx` | Portal-header |

## Portal — Treningsplan tags (`components/portal/treningsplan/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| PyramidTag | `ak-formula-tags.tsx` | Fargekodet pyramideniva-badge (FYS/TEK/SLAG/SPILL/TURN) |
| PyramidIndicator | `pyramid-indicator.tsx` | Visuell pyramide-stack |
| GeneratePlanButton | `generate-plan-button.tsx` | AI-generer treningsplan |
| ManualPlanButton | `manual-plan-button.tsx` | Manuell planopprettelse |

## Motion-wrappers (`components/motion/`)

| Komponent | Bruk |
|-----------|------|
| `FadeIn` | Fade-in animasjon |
| `SlideUp` | Slide-up animasjon |

## Regler

- Lucide-ikoner kan ikke sendes som props Server -> Client. Bruk `iconName` string + ICON_MAP.
- Client components skal aldri importere `prisma`. Splitt til `*-types.ts` + `*-service.ts`.
- Se `.claude/rules/design-system.md` for farger og tokens.
- Se `.claude/rules/ui-patterns.md` for layout-monstre.
