# Booking V2 — designreferanse

Klikkbar HTML-prototype av booking-flyten. Brukes som visuell fasit når Next.js-implementasjonen bygges på `/booking-v2`. Følger `public/design-reference/`-mønsteret som `playerhq-reference.html`, `coachhq-reference.html` og `student-360-reference.html`.

## Filer

| Fil | Innhold |
|---|---|
| `booking-v2.html` | 7 booking-steg + 2 edge-skjermer. Klikkbar via prototype-baren øverst. |
| `design-tokens.css` | Delte design-konstanter — palett, fonts, type-skala, knapper, kort. Skal gjenbrukes i landing-v2. |
| `booking-v2.css` | Booking-spesifikke styles. Hentet fra Claude Designs export, V1-palett-overrides fjernet så V2-tokens vinner. |
| `booking-v2.js` | Vanilla JS for steg-navigering, flow-toggle, edge-toggle, skjemaveksling. |
| `assets/logos/` | AK-logo i 4 varianter (primær, hvit, sort, hvit-på-grønn). |

## Slik åpner du

```
npm run dev
# Åpne i nettleser:
http://localhost:3000/design-reference/booking-v2/booking-v2.html
```

Eller dobbeltklikk filen direkte i Finder/Explorer.

## Prototype-bar (øverst)

| Kontroll | Funksjon |
|---|---|
| **Flyt** | Veksler innhold mellom Abonnement / Flex / Banecoaching / Bedrift |
| **Edge** | Hopper til en av 4 edge-skjermer: Slot tatt / Avbrutt betaling / Kvota brukt / Ingen ledige |
| **1–7** | Hopp direkte til steg |

## Innhold endret fra original Claude Design-export

Originalen brukte fiktivt innhold som ikke matcher AK Golf-virkeligheten eller bryter med `gotchas.md`. Følgende endringer er gjort:

| # | Original | AK Golf-virkelighet |
|---|---|---|
| 1 | Anders **Kjær** | Anders **Kristiansen** |
| 2 | **Kristine Lund** (kvinne, junior-spesialist) | **Markus R. Pedersen** (College-golf USA) |
| 3 | "PGA Class A · 14 års erfaring" som badge | Fjernet — `gotchas.md`: aldri vis sertifiseringer (PGA, TPI, TrackMan, etc.) |
| 4 | Tjenester: Putte-time, Performance Audit, Svingtime, Performance Block, Speed & Power | Faktiske: Performance / Performance Pro / Express / Express Pro / Flex 20 / Flex 50 / Banecoaching 9 hull / First Tee |
| 5 | Priser: 990 / 1 690 / 1 290 / 14 950 / 6 950 kr | Faktiske: 1 400 / 2 500 / 800 / 1 400 / 450 / 800–1 500 / 3 000 / 1 295 kr (fra `lib/website-constants.ts`) |
| 6 | "Mva. (25 %) 198 kr" på betalingssiden | Fjernet — `gotchas.md`: aldri vis MVA på kundesider |
| 7 | Avbestilling: > 24t / 24–6t / < 6t | Endret til 24t / 8–24t / < 8t (matcher `lib/portal/booking/refund-policy.ts`) |
| 8 | Stats "−4,2 HCP-fall snitt", "280 spillere" (oppfunnet) | Erstattet med faktiske attributter (15 år erfaring, PlayersHQ, VTG-kurs) |
| 9 | Booking-vinduer ikke nevnt | Lagt til: "Performance 4 uker frem · Flex 3 uker frem" (matcher `lib/portal/booking/subscription-quota.ts`) |
| 10 | Performance Pro kvota i edge: ikke spesifisert | Endret til 4 økter / mnd (matcher faktisk kvota) |

## Punkter som krever bekreftelse fra Anders (`// VERIFY` i HTML)

1. **Sitatet i hero** — bytt til ekte spillertestimonial
2. **Org.nr 925 110 887** — bekreft at dette er korrekt
3. **Markus' portrettbilde** — har ingen fil ennå, viser solid grønn flate. Trenger `/images/team/markus-pedersen.jpg`
4. **Anders' tilgjengelighet "5 ledige denne uken"** og Markus' "3 ledige" — placeholder-tall, kommer fra slot-API i ekte impl.

## Tre konflikter som ikke er løst

1. **Bookingvinduer ikke synlige før steg 4** — kan være forvirrende for førstegangsbruker. Vurder å vise det allerede i tjeneste-steget.
2. **Telefonnummer i toppen** — fjernet helt. Vurder om Anders' direktelink `+47 909 67 995` skal være synlig på steg 6 (betaling) som trygghetsfaktor.
3. **Bedriftspakker har ikke faktisk pris-katalog** — flow-toggle "Bedrift" viser "Faktura" som plassholder. Trenger ekte pakker fra Anders før Next.js-impl.

## Neste steg — Next.js-implementasjon

Når Anders har OK-et innholdet:

1. Branch: `claude/frontend-design-TQRoN` (allerede satt opp)
2. Lever på `/booking-v2` (parallell — gammel `/booking` urørt)
3. Importer server-logikk fra `lib/portal/booking/*` (slots, conflict-check, locking, validation, subscription-quota, refund-policy, waitlist) — aldri dupliser
4. Importer Stripe-helpers fra `lib/portal/stripe/*` — `chargeOffSession()` for Flex, `createInvoiceForBooking()` for bedrift
5. Bruk `design-tokens.css` som token-grunnlag i `app/globals.css` (ny `@layer v2`)
6. Splitt HTML-en i React-komponenter under `components/booking-v2/`
7. Stopp før swap til `/` — Anders bestemmer tidspunkt

## Status

Designreferanse klar for visuell verifikasjon. Ikke produksjonskode.
