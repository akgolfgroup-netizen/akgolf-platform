# Komponentbibliotek — AK Golf Platform

Sjekk her FOR du bygger nye komponenter. Oppdater etter nye komponenter.

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

## Portal — Premium UI (`components/portal/premium/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| GlassCard | `glass-card.tsx` | Glassmorfisme-kort (light/dark, padding) |
| HeroHeading | `index.ts` | Hero-overskrift med label, title, actions |
| Shimmer | `index.ts` | Shimmer-animasjon for knapper |

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
