# AK Golf Platform — Project Brief

## Produktnavn
AK Golf Platform (akgolf-platform)

## Kort beskrivelse
Alt-i-ett plattform for premium golfcoaching. Kombinerer markedsside, booking-system, spillerportal og admin-dashboard (Mission Control) i én Next.js-applikasjon. Norskspraklig, rettet mot det norske markedet.

## Problem som loses
Golfcoaching i Norge er fragmentert: booking skjer via telefon/SMS, treningsplaner deles pa papir eller i meldinger, og trenere mangler verktoy for a folge opp elever systematisk. Det finnes ingen norsk plattform som kobler booking, coaching-data (TrackMan), treningsplaner og elevoppfolging i ett system.

## Malgruppe

| Segment | Beskrivelse | Storrelse |
|---------|-------------|-----------|
| **Voksne amatorer** | HCP 5-36, vil forbedre seg strukturert | Primaer |
| **Juniorer** | 6-18 ar, foreldre er beslutningstakere | Sekundaer |
| **Bedrifter** | After Work, teambuilding, bedriftsgolf | Tertiaaer |
| **Golfklubber** | B2B: sportsplaner, programvare, QR-skilt | Tertiaaer |

## Primaere use cases

1. **Kunde booker coaching-time** — Velger tjeneste, dato/tid, betaler med Stripe, far bekreftelse
2. **Elev bruker spillerportalen** — Ser treningsplan, logger runder, folger handicap-utvikling, leser AI-innsikter
3. **Trener bruker Mission Control** — Oversikt over dagens sessjoner, elevinformasjon, booking-handtering, coaching-notater
4. **Ny kunde oppdager tjenesten** — Lander pa markedssiden, leser om metode og priser, sender soknad eller booker direkte

## Forretningsmaal

- **Revenue-mal:** 500K USD netto profitt/ar fra coaching + digitale produkter
- **Kapasitet:** Maks 65 coaching-plasser (Performance + Performance Pro)
- **Konvertering:** Markedsside → booking → betalende elev
- **Retention:** Spillerportalen holder elever engasjert mellom sesjoner
- **Skalerbarhet:** Plattformen kan brukes av flere trenere og klubber (B2B)

## MVP (Lansering)

| Feature | Status |
|---------|--------|
| Markedsside (forside, academy, junior, utvikling) | Ferdig |
| Booking-flyt (velg tjeneste → tid → betal → bekreftelse) | 90% |
| Stripe-betaling | Ferdig |
| Spillerportal (dashboard, treningsplan, statistikk) | Ferdig (mock-data pa noen sider) |
| Mission Control admin (hub, bookinger, elever) | 20% (mesteparten mock-data) |
| E-post-bekreftelser (Resend) | Ferdig |
| SMS-paminnelser (Twilio) | Delvis |
| Auth (Supabase) | Ferdig |

## Hva som IKKE er med na

- Digital coaching (Pro, Pro+Coaching, Elite, Junior Digital abonnementer)
- Junior Prospect-program
- NGF/WANG-samarbeid
- Vipps-betaling (kode finnes, men deaktivert)
- Native mobilapp (PWA brukes)
- Flerspraklig stotte (kun norsk)
- Multi-tenant for andre trenere/klubber
- Gamification (achievements er modellert men ikke lansert)
- AI-assistent i Mission Control (stub)
- Unified inbox / meldingssystem (stub)
