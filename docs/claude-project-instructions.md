# AK Golf Academy — Claude Project Instructions

## Om prosjektet

Premium golfcoaching-plattform for AK Golf Group. Norskspraklig markedsside med 3 hovedsider (Coaching, Junior Academy, Utvikling) pluss komplett portal/dashboard for elever og instruktorer.

## Design-regler

### ALDRI

- Bruk emojier — bruk SVG-ikoner (Lucide) i stedet
- Nevn MVA pa kundevendte sider
- Vis trenersertifiseringer (PGA, TrackMan Certified, etc.)
- Bruk utdaterte farger (#B07D4F bronse, --apple-gold-*, --color-ink-*)

### ALLTID

- Monokrom Apple-inspirert design (svart #1D1D1F, hvit, gra-nyanser)
- Tekst pa norsk bokmal
- Priser i kroner (ikke ore)
- Ingen bindingstid-kommunikasjon

## Tjeneste-struktur

### 3 Hovedsider

| Side | Malgruppe | URL |
|------|-----------|-----|
| Coaching | Voksne amatorer + bedrift | /coaching |
| Junior Academy | Barn/ungdom + foreldre | /junior |
| Utvikling | B2B for klubber | /utvikling |

### Coaching-pakker (gjeldende)

| Pakke | Pris | Okter | Booking-vindu |
|-------|------|-------|---------------|
| Performance | 1 600 kr/mnd | 2 x 20 min | 7 dager |
| Performance Pro | 2 000 kr/mnd | 4 x 20 min | 14 dager |

**Inkludert i begge:**
- TrackMan-analyse hver okt
- Personlig treningsplan
- Full tilgang til spillerportal
- Ingen binding

### Flex/Drop-in

| Tjeneste | Pris | Varighet |
|----------|------|----------|
| Flex 50 Solo | 1 500 kr | 50 min |
| Flex 50 Duo | 1 700 kr | 50 min |
| Flex 90 Solo | 2 500 kr | 90 min |
| Flex 90 Duo | 2 800 kr | 90 min |
| Markus 20 min | 300 kr | 20 min |

### Bane og Spesial

| Tjeneste | Pris | Coach |
|----------|------|-------|
| On-Course 9 | 3 000 kr/spiller | Anders |
| On-Course Par 3 | 500 kr/spiller | Markus |
| Gameday | 2 500 kr/person | Anders |

### Nybegynner og Sosial

| Tjeneste | Pris |
|----------|------|
| Forste Sesong | 4 500 kr (8 uker) |
| 9 Hull Social/Challenge | 250 kr/kveld eller 3 500 kr sesongkort |
| Vintertrening | 3 500 kr (6 uker) |

### Bedrift (under Coaching)

| Tjeneste | Pris | Coach |
|----------|------|-------|
| After Work | 500 kr/person | Markus |
| Bedriftsgolf | 2 500 kr/person | Anders |

### Junior Academy

| Tjeneste | Pris |
|----------|------|
| Junior Academy | 2 500 kr/mnd (maks 8 spillere) |
| Junior Camp | 4 500 kr (5 dager) |

### Utvikling (B2B)

- Sportsplan — konsultasjon for klubber
- Radgiving — juniorrekruttering, sportslig utvikling
- QR-kode trening — digitale treningsskilt pa range

## Eksplisitt utelatt (lanseres senere)

- Digital coaching (Pro, Pro+Coaching, Elite)
- Junior Digital
- Junior Prospect
- NGF/WANG samarbeid

## Trenere

| Trener | Rolle |
|--------|-------|
| Anders Kristiansen | Head Coach — alle abonnement, Flex, On-Course 9, Gameday, Bedriftsgolf |
| Markus Hatlelid | Assistant Coach — Markus 20 min, On-Course Par 3, After Work, 9 Hull, Junior |

## Lokasjon

- GFGK (Gamle Fredrikstad Golfklubb) — hovedlokasjon

## Tech stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4
- Prisma + PostgreSQL
- Supabase Auth
- Stripe/Vipps betaling
- Anthropic Claude (AI-analyse)

## Farger (Brand Guide 2026)

| Token | Hex | Bruk |
|-------|-----|------|
| Svart | #1D1D1F | Tekst, logo, knapper |
| Hvit | #FFFFFF | Bakgrunn |
| Grey-100 | #F5F5F7 | Sekundaer bakgrunn |
| Grey-200 | #E8E8ED | Borders |
| Grey-500 | #6E6E73 | Sekundaer tekst |
| Success | #34C759 | Bekreftelser |
| CTA-gront | #16a34a | Coaching CTAs |

## Landingsside-struktur (Coaching)

1. **Hero** — Headline, undertekst, CTA
2. **Hva du far** — 6 verdipunkter med SVG-ikoner
3. **Pakker** — Performance vs Pro side-by-side
4. **Om treneren** — Anders Kristiansen
5. **Resultater** — Testimonials med HCP-forbedring
6. **Avsluttende CTA** — To pakke-knapper

## Nyttige filer

- `docs/coaching-pakker.md` — Komplett pakkeoversikt
- `lib/website-constants.ts` — All markedssidtekst
- `prisma/schema.prisma` — Database-modeller
