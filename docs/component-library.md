# Komponentbibliotek — AK Golf Platform

Sjekk her FØR du bygger nye komponenter. Oppdater etter nye komponenter.

## Portal-komponenter (`components/portal/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| Admin booking-liste | `admin/admin-booking-list.tsx` | Booking-oversikt i MC |
| Admin booking-skjema | `admin/admin-create-booking-form.tsx` | Ny booking i MC |
| Sidebar | `layout/portal-sidebar.tsx` | Portal-navigasjon |
| Topbar | `layout/portal-topbar.tsx` | Portal-header |

## Markedsside-komponenter (`components/website/`)

| Komponent | Fil | Bruk |
|-----------|-----|------|
| Logo | `AKLogo.tsx` | K-mark logo |
| Navigasjon | `WebsiteNav.tsx` | Markedsside-nav |
| Footer | `WebsiteFooter.tsx` | Markedsside-footer |
| Søknadsskjema | `ApplicationForm.tsx` | Søknad om plass |

## Motion-wrappers (`components/motion/`)

| Komponent | Bruk |
|-----------|------|
| `FadeIn` | Fade-in animasjon |
| `SlideUp` | Slide-up animasjon |

## UI-komponenter (`components/ui/`)

shadcn/ui-baserte komponenter. Sjekk her før du installerer nye.

## Regler

- Lucide-ikoner kan ikke sendes som props Server → Client. Bruk `iconName` string + ICON_MAP.
- Client components skal aldri importere `prisma`. Splitt til `*-types.ts` + `*-service.ts`.
- Se `.claude/rules/design-system.md` for farger og tokens.
- Se `.claude/rules/ui-patterns.md` for layout-mønstre.
