# Component Library — AK Golf Platform

Oversikt over gjenbrukbare komponenter i portalen.

## Portal — Booking

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `BookingStatusBadge` | `components/portal/booking/booking-status-badge.tsx` | Fargekodet badge for bookingstatus (success/warning/cancelled) |
| `UpcomingBookingCard` | `components/portal/booking/upcoming-booking-card.tsx` | Kort for kommende booking med ikon, tid, instruktor, sted |
| `NextBookingHero` | `components/portal/booking/next-booking-hero.tsx` | Uthevet hero-visning av neste booking |
| `PastBookingList` | `components/portal/booking/past-booking-list.tsx` | Liste over tidligere bookinger |
| `CancellationRulesCard` | `components/portal/booking/cancellation-rules-card.tsx` | Viser avbestillingsregler |
| `RescheduleForm` | `components/portal/booking/reschedule-form.tsx` | Skjema for endring av bookingtidspunkt |
| `BookingHoverCardGroup` | `components/portal/booking/booking-hover-card.tsx` | Hover-effekt wrapper for booking-kort |

### Typer

- `BookingViewModel` — Grunndata for booking-visning (id, serviceName, instructorName, startTime, duration, location, status, type)
- `BookingStatusVariant` — `"success" | "warning" | "cancelled"`
- `CancellationRule` — Avbestillingsregel (hours, rule, fee)
- `getStatusConfig(booking)` — Mapper BookingViewModel.status til label + variant

Definert i `components/portal/booking/booking-types.ts`.

## Portal — Premium UI

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `GlassCard` | `components/portal/premium/glass-card.tsx` | Glassmorfisme-kort med variant (light/dark) og padding |
| `HeroHeading` | `components/portal/premium/index.ts` | Hero-overskrift med label, title, description, actions |
| `Shimmer` | `components/portal/premium/index.ts` | Shimmer-animasjon for knapper |
| `FadeIn` / `SlideUp` | `components/motion/` | Framer Motion wrappers |

## Admin — Mission Control

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| `MCTopbar` | `components/portal/mission-control/mc-topbar.tsx` | Topbar med tittel, undertittel, hamburger |
| `AdminCard` | `components/portal/mission-control/ui/AdminCard.tsx` | Basis-kort for admin-sider |
| `AdminButton` | `components/portal/mission-control/ui/AdminButton.tsx` | Knapp med variant (primary/secondary) |
| `AdminBadge` | `components/portal/mission-control/ui/AdminBadge.tsx` | Badge med variant (muted/success/error) |
| `AdminEmptyState` | `components/portal/mission-control/ui/AdminEmptyState.tsx` | Tom tilstand med ikon, tittel, beskrivelse |

## Sider som bruker disse

| Side | Komponenter |
|------|-------------|
| `/portal/bookinger` | BookingerClient, NextBookingHero, UpcomingBookingCard, PastBookingList, CancellationRulesCard, BookingHoverCard |
| `/portal/bookinger/[id]` | BookingDetailClient, BookingStatusBadge, GlassCard |
| `/portal/bookinger/[id]/endre` | RescheduleForm |
| `/admin/meldinger` | AdminChatClient, MCTopbar, AdminCard, AdminEmptyState |
