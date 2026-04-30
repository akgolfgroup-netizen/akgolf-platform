# Tekst-revisjon · AK Golf Platform

**Opprettet:** 2026-04-29
**Formal:** Anders gar gjennom all brukerrettet tekst pa nettsiden, gjor endringer i denne filen, og Claude oppdaterer kodebasen basert pa endringene.

## Slik bruker du dette dokumentet

For hver tekst-blokk:
1. **Vises pa:** forteller hvor pa nettsiden teksten star
2. **Filsti:** filen i kodebasen som inneholder teksten (referanse)
3. **Original:** teksten som vises na
4. **Ny tekst:** her skriver du inn endringene du onsker. La feltet sta tomt om teksten skal beholdes.

Eksempel:
```
**Original:** "Tren golf med system."
**Ny tekst:** Tren golf — med system og struktur.
```

Nar du er ferdig, si "kjor revisjonen" og Claude oppdaterer alle felt.

---

## Innholdsfortegnelse

1. [Forsiden (`/`)](#1-forsiden-)
2. [Academy (`/academy`)](#2-academy-academy)
3. [Academy Pricing (`/landing/pricing`)](#3-academy-pricing-landingpricing)
4. [Junior Academy (`/junior-academy`)](#4-junior-academy-junior-academy)
5. [Utvikling (`/utvikling`)](#5-utvikling-utvikling)
6. [Kontakt (`/kontakt`)](#6-kontakt-kontakt)
7. [Vedlikeholdsside (`/maintenance`)](#7-vedlikeholdsside-maintenance)
8. [Booking-flyt (`/booking-v2`)](#8-booking-flyt-booking-v2)
9. [Portal-kontekst (innloggede brukere)](#9-portal-kontekst-innloggede-brukere)
10. [Navigasjon og generelle elementer](#10-navigasjon-og-generelle-elementer)

---

## 1. Forsiden (`/`)

### 1.1 Hero-seksjon (top)

**Vises pa:** Forsiden, det aller forste man ser.
**Filsti:** `lib/website-constants.ts → HERO`

| Felt | Original |
|---|---|
| eyebrow | `TRENINGSABONNEMENT FOR GOLF` |
| heading | `Tren golf med system.` |
| greenWord | `system.` (delen som markeres med primary-farge) |
| subheading | `AK Golf Academy er et treningsabonnement der du moter trener 2 eller 4 ganger i maneden. Hver sesjon er 20 minutter — fokusert, malt med TrackMan og filmet for analyse. Mellom sesjonene vet du noyaktig hva du skal trene pa.` |
| ctaPrimary | `Se treningsabonnement` |
| ctaSecondary | `Prov en enkeltsesjon` |
| statusBadge | `Sesong 2026 — begrenset kapasitet` |
| trustItems[0].label | `TrackMan-analyse hver sesjon` |
| trustItems[1].label | `Personlig treningsplan` |

**Ny tekst:**

```
eyebrow:
heading:
greenWord:
subheading:
ctaPrimary:
ctaSecondary:
statusBadge:
trustItems[0]:
trustItems[1]:
```

---

### 1.2 The Foundation Method

**Vises pa:** Forsiden, "Var metodikk"-seksjonen.
**Filsti:** `lib/website-constants.ts → FOUNDATION_METHOD`

| Felt | Original |
|---|---|
| eyebrow | `Var metodikk` |
| heading | `Varig endring. Ikke quick fixes.` |
| description | `Var tilnaerming bygger pa The Foundation Method.` |
| phases[0].title | `Analyse` |
| phases[0].description | `Vi kartlegger teknikken din med TrackMan-data og videoanalyse. Du ser noyaktig hva vi jobber med — ingen gjetning.` |
| phases[1].title | `Plan` |
| phases[1].description | `Du far en personlig treningsplan i appen, skreddersydd for ditt unike svingmonster.` |
| phases[2].title | `Oppfolging` |
| phases[2].description | `Jevnlige 1-til-1 okter sikrer at du holder rett kurs. Planen justeres lopende basert pa din utvikling.` |

**Ny tekst:**

```
eyebrow:
heading:
description:
phases[0].title:
phases[0].description:
phases[1].title:
phases[1].description:
phases[2].title:
phases[2].description:
```

---

### 1.3 Hvordan det fungerer (5 steg)

**Vises pa:** Forsiden, "Slik fungerer det"-seksjonen.
**Filsti:** `lib/website-constants.ts → HOW_IT_WORKS`

| Felt | Original |
|---|---|
| eyebrow | `Slik fungerer det` |
| heading | `Coaching som faktisk folger deg mellom sesjonene.` |
| description | `De fleste tar en golftime i ny og ne. Etterpa trener de pa egenhand uten plan. Vi gjor det annerledes.` |
| steps[0].title | `Du booker en sesjon i appen` |
| steps[0].description | `Velg tid som passer deg. 20 minutter med trener — ingen fyllminutter.` |
| steps[1].title | `Treneren maler, filmer og veileder` |
| steps[1].description | `TrackMan registrerer data. Video fanger teknikken. Du jobber med en ting om gangen.` |
| steps[2].title | `Treningsplanen din oppdateres` |
| steps[2].description | `Etter sesjonen legger treneren inn ovelser, notater og fokusomrader i PlayersHQ. Du ser det med en gang.` |
| steps[3].title | `Du trener mellom sesjonene` |
| steps[3].description | `Treningsplanleggeren viser hva du skal gjore, dag for dag. Du logger oktene dine og ser progresjonen over tid.` |
| steps[4].title | `Neste sesjon bygger videre` |
| steps[4].description | `Treneren ser hva du har trent pa. Dere plukker opp der dere slapp. Ingen repetisjon, bare fremgang.` |

**Ny tekst:**

```
eyebrow:
heading:
description:
steps[0].title:
steps[0].description:
steps[1].title:
steps[1].description:
steps[2].title:
steps[2].description:
steps[3].title:
steps[3].description:
steps[4].title:
steps[4].description:
```

---

### 1.4 Tre tjenester (Divisions)

**Vises pa:** Forsiden, oversikten over 3 tjenester.
**Filsti:** `lib/website-constants.ts → DIVISIONS`

#### Academy

| Felt | Original |
|---|---|
| title | `Academy` |
| description | `Treningsabonnement for voksne golfspillere. 1-til-1 coaching med TrackMan, PlayersHQ og personlig treningsplan.` |
| features | `20-min fokuserte sesjoner`, `TrackMan-analyse`, `Personlig treningsplan`, `PlayersHQ` |
| ctaLabel | `Se treningsabonnement` |

**Ny tekst:**
```
title:
description:
features:
ctaLabel:
```

#### Junior Academy

| Felt | Original |
|---|---|
| title | `Junior Academy` |
| description | `Treningsprogram for unge spillere fra forste turnering til elite-niva. Gruppetrening, individuell oppfolging og sesongplanlegging.` |
| features | `Nivatilpasset trening`, `Konkurranseveiledning`, `Periodisering`, `Foreldresamarbeid` |
| ctaLabel | `Se juniorprogrammet` |

**Ny tekst:**
```
title:
description:
features:
ctaLabel:
```

#### Utvikling & Teknologi

| Felt | Original |
|---|---|
| title | `Utvikling & Teknologi` |
| description | `PlayersHQ, treningsverktoy og sportslig radgiving for golfklubber og trenere.` |
| features | `Sportsplaner`, `QR-treningsskilt`, `IUP-plattform`, `Trenerutvikling` |
| ctaLabel | `Se losninger for klubber` |

**Ny tekst:**
```
title:
description:
features:
ctaLabel:
```

---

### 1.5 Final CTA (forside)

**Vises pa:** Forsiden, ned mot bunnen.
**Filsti:** `lib/website-constants.ts → FINAL_CTA`

```
Se filen for innhold. Hvis du vil endre, skriv hele teksten her under "Ny tekst".
```

**Ny tekst:**
```
(la sta tomt om uendret)
```

---

## 2. Academy (`/academy`)

### 2.1 Hero (Academy)

**Vises pa:** /academy, top.
**Filsti:** `lib/website-constants.ts → ACADEMY_HERO_V3`

| Felt | Original |
|---|---|
| eyebrow | `Academy · Voksne 18+` |
| headingLead | `Strukturert utvikling,` |
| headingItalic | `malbar fremgang.` |
| headingTrail | `` (tom) |
| description | `AK Academy kobler coaching, treningsplan og oppfolging i samme system. Hver okt logges, hver plan oppdateres av din personlige coach.` |
| ctaPrimary | `Book time` |
| ctaSecondary | `Send e-post` |

**Ny tekst:**
```
eyebrow:
headingLead:
headingItalic:
headingTrail:
description:
ctaPrimary:
ctaSecondary:
```

---

### 2.2 AK-metoden (5 niva)

**Vises pa:** /academy, "Fem nivaer, en plan"-seksjonen.
**Filsti:** `lib/website-constants.ts → ACADEMY_METHOD_V3`

| Felt | Original |
|---|---|
| eyebrow | `AK-metoden` |
| headingLead | `Fem nivaer,` |
| headingItalic | `en plan` |
| headingTrail | `.` |
| description | `Hver Performance-spiller far en personlig fordeling per niva. Vi maler hvor du star hver maned, og justerer planen — ikke gjettverk.` |
| ctaLabel | `Les hele metoden` |
| levels[0] | `L5 — Turnering & strategi` |
| levels[1] | `L4 — Spill og banehandtering` |
| levels[2] | `L3 — Slagvalg & kortspill` |
| levels[3] | `L2 — Teknikk & sving` |
| levels[4] | `L1 — Fysikk & grunnform` |

**Ny tekst:**
```
eyebrow:
headingLead:
headingItalic:
headingTrail:
description:
ctaLabel:
levels[0]:
levels[1]:
levels[2]:
levels[3]:
levels[4]:
```

---

### 2.3 Coach-presentasjon

**Vises pa:** /academy.
**Filsti:** `lib/website-constants.ts → ACADEMY_COACH_V3`

| Felt | Original |
|---|---|
| eyebrow | `Mot din hovedcoach` |
| headingLead | `Anders Kristiansen — ` |
| headingItalic | `din coach gjennom aret.` |
| description | `Anders er hovedcoach for voksne i Academy. Sesjonene foregar pa Gamle Fredrikstad Golfklubb med TrackMan og videoanalyse, og han bygger en personlig plan som du jobber med mellom oktene.` |

**Ny tekst:**
```
eyebrow:
headingLead:
headingItalic:
description:
```

---

### 2.4 FAQ Academy

**Vises pa:** /academy, FAQ-seksjonen.
**Filsti:** `lib/website-constants.ts → ACADEMY_FAQ_V3`

| Felt | Original |
|---|---|
| eyebrow | `Vanlige sporsmal` |
| heading | `Det dere lurer pa.` |
| q1 | `Hva om jeg ikke har spilt for?` |
| a1 | `Vi tar imot spillere pa alle nivaer. Vi starter med en kartleggings-okt sammen med din coach, og bygger en plan fra ditt utgangspunkt.` |
| q2 | `Kan jeg bytte mellom pakker?` |
| a2 | `Ja — ta kontakt med oss pa post@akgolf.no, sa finner vi losningen som passer.` |
| q3 | `Hvor foregar oktene?` |
| a3 | `Oktene foregar pa Gamle Fredrikstad Golfklubb med TrackMan-bay, range og bane.` |
| q4 | `Hvor mye fremgang er realistisk?` |
| a4 | `Det varierer fra spiller til spiller. Vi maler underveis med TrackMan og runde-data, og justerer planen til det vi ser at faktisk gir deg fremgang.` |
| q5 | `Hvordan kommer jeg i gang?` |
| a5 | `Book en time direkte i booking-portalen, eller send oss en e-post pa post@akgolf.no for a snakke om hva som passer for deg.` |

**Ny tekst:**
```
eyebrow:
heading:
q1:
a1:
q2:
a2:
q3:
a3:
q4:
a4:
q5:
a5:
```

---

### 2.5 Academy CTA (bunn)

**Vises pa:** /academy, bunn.
**Filsti:** `lib/website-constants.ts → ACADEMY_CTA_V3`

| Felt | Original |
|---|---|
| headingLead | `Klar for a bli` |
| headingItalic | `malbart bedre?` |
| description | `Book time direkte i booking-portalen, eller send oss en e-post for a snakke om hva som passer deg.` |
| ctaPrimary | `Book time` |
| ctaSecondary | `Send e-post` |

**Ny tekst:**
```
headingLead:
headingItalic:
description:
ctaPrimary:
ctaSecondary:
```

---

## 3. Academy Pricing (`/landing/pricing`)

### 3.1 Pricing Hero

**Vises pa:** /landing/pricing, top.
**Filsti:** `lib/website-constants.ts → ACADEMY_PRICING_V2.hero`

| Felt | Original |
|---|---|
| eyebrow | `Academy · Medlemskap` |
| headingPrefix | `Coaching som` |
| headingItalic | `varer` |
| headingSuffix | `hele sesongen.` |
| lede | `Tre veier inn i Academy. Start med Markus eller hopp rett pa Anders — du kan oppgradere nar som helst, ingen bindingstid.` |
| stats[0] | `32+ — Aktive Academy-spillere` |
| stats[1] | `−4,2 — Snitt HCP-reduksjon · ar 1` |
| stats[2] | `94% — Fornyer hvert ar` |

**Ny tekst:**
```
eyebrow:
headingPrefix:
headingItalic:
headingSuffix:
lede:
stats[0]:
stats[1]:
stats[2]:
```

---

### 3.2 Pricing — Plan-overskrift

**Filsti:** `ACADEMY_PRICING_V2.plansHead`

| Felt | Original |
|---|---|
| headingPrefix | `Tre mater a vaere` |
| headingItalic | `Academy-spiller` |
| headingSuffix | `.` |
| description | `Alle abonnement inkluderer PlayerHQ-app, treningsplan i app, TrackMan og videoanalyse. Forskjellen ligger i hvilken coach du moter og hvor mange okter per maned.` |

**Ny tekst:**
```
headingPrefix:
headingItalic:
headingSuffix:
description:
```

---

### 3.3 Pricing — 3 abonnement

**Filsti:** `ACADEMY_PRICING_V2.plans[]`

#### Performance · Markus (1 000 kr/mnd)

| Felt | Original |
|---|---|
| name | `Performance · Markus` |
| tagline | `Komme i gang med struktur` |
| description | `Klubbcoaching med Markus to ganger i maneden. For deg som vil bygge fundament uten a forplikte deg til toppniva.` |
| billed | `Ingen bindingstid · Avbestill nar som helst` |
| cta | `Velg Markus` |
| features | `2 × 20 min coaching / maned` (heavy), `Klubbcoaching med Markus`, `Selvbooking 7 dager frem`, `PlayerHQ-app inkludert`, `Treningsplan i app`, `TrackMan + videoanalyse` |

**Ny tekst:**
```
name:
tagline:
description:
billed:
cta:
features:
```

#### Performance · Anders (1 200 kr/mnd) — "Mest valgte"

| Felt | Original |
|---|---|
| name | `Performance · Anders` |
| tagline | `Strukturert utvikling med Anders` |
| description | `Individuell coaching med Anders to ganger i maneden. For deg som vil ha hovedcoachen var, men holder volumet moderat.` |
| ribbon | `Mest valgte` |
| billed | `Ingen bindingstid · Avbestill nar som helst` |
| cta | `Velg Anders` |
| features | `2 × 20 min coaching / maned`, `1-til-1 med Anders`, `TrackMan + videoanalyse`, `Selvbooking 7 dager frem`, `PlayerHQ-app inkludert`, `Treningsplan i app`, `Coach-notater etter hver okt` |

**Ny tekst:**
```
name:
tagline:
description:
ribbon:
billed:
cta:
features:
```

#### Performance Pro (2 200 kr/mnd)

| Felt | Original |
|---|---|
| name | `Performance Pro` |
| tagline | `Det Anders gjor med tour-spillere` |
| description | `Fire okter i maneden med Anders. Prioritert booking, AI-assistent og hoyeste utviklingstempo for ambisiose amatorer.` |
| billed | `Ingen bindingstid · Prioritert booking` |
| cta | `Velg Performance Pro` |
| features | `4 × 20 min coaching / maned`, `1-til-1 med Anders`, `Prioritert booking 14 dager frem`, `TrackMan + videoanalyse`, `PlayerHQ + AI-assistent`, `Personlig treningsplan i app`, `Coach-notater + ukentlig oppfolging` |

**Ny tekst:**
```
name:
tagline:
description:
billed:
cta:
features:
```

---

### 3.4 Pricing — "Inkludert"-seksjonen

**Filsti:** `ACADEMY_PRICING_V2.included.cards[]`

| Kort | Tittel | Beskrivelse |
|---|---|---|
| Strokes Gained-maling | (se navn til venstre) | `Vi maler hvor du taper og vinner slag mot ditt niva. Du ser fremgangen i tall, ikke magefolelse.` |
| PlayerHQ i lomma | (se navn til venstre) | `Treningsplan, ovelsesbank og coach-notater. Bygd sa du faktisk apner den.` |
| Videoanalyse | (se navn til venstre) | `Hver okt filmes. Du far tilbake klipp med markeringer og kommentarer fra coachen din.` |
| Aret rundt | (se navn til venstre) | `Indoor TrackMan i vintermanedene, range og bane i sesong. Du mister ikke momentum.` |
| Ingen bindingstid | (se navn til venstre) | `Avbestill nar som helst. Vi vil at du blir fordi det funker — ikke fordi du er last.` |
| Klar struktur | (se navn til venstre) | `Du vet alltid hva du skal trene pa mellom sesjonene. Treningsplanen oppdateres etter hver okt.` |

**Ny tekst:**
```
card1.title:
card1.description:
card2.title:
card2.description:
card3.title:
card3.description:
card4.title:
card4.description:
card5.title:
card5.description:
card6.title:
card6.description:
```

---

### 3.5 Pricing — FAQ

**Filsti:** `ACADEMY_PRICING_V2.faq.items[]`

| Q | A |
|---|---|
| `Hva er forskjellen pa Markus og Anders?` | `Markus er klubbcoach og fokuserer pa golfere som bygger fundament. Anders er hovedcoach og jobber med ambisiose amatorer og tour-spillere. Begge bruker samme metode og samme PlayerHQ — forskjellen er pris og volum.` |
| `Kan jeg pause abonnementet hvis jeg blir skadet?` | `Ja. Vi pauser uten kostnad hvis du blir skadet eller skal lengre reise. Bare gi beskjed i appen.` |
| `Hva skjer med ubrukte okter?` | `Inntil to ubrukte okter rulles automatisk over til neste maned. Mer enn det og du ma booke dem inn — vi vil at du faktisk bruker dem.` |
| `Kan jeg oppgradere underveis?` | `Nar som helst. Forskjellen i pris faktureres pro rata fra dagen du oppgraderer. Du kan ogsa nedgradere — det er ingen bindingstid.` |
| `Er det en intro-time?` | `Nye spillere starter med en Flex 20-okt eller en kort prat med coachen. Vi vil at du skal vite hva du gar til for du forplikter deg.` |
| `Hva med banecoaching?` | `Banecoaching (On-Course 9 og On-Course Par 3) bookes som engangsokter ved siden av abonnementet. Det er ikke inkludert — fordi vi vil at du skal velge nar du tar det med ut pa banen.` |

**Ny tekst:**
```
q1:
a1:
q2:
a2:
q3:
a3:
q4:
a4:
q5:
a5:
q6:
a6:
```

---

### 3.6 Pricing CTA (bunn)

**Filsti:** `ACADEMY_PRICING_V2.cta`

| Felt | Original |
|---|---|
| eyebrow | `Klar til a starte?` |
| headingPrefix | `Book en gratis` |
| headingItalic | `intro` |
| headingSuffix | `— sa finner vi rett niva sammen.` |
| description | `20 minutter, ingen forpliktelser. Vi snakker om hvor du star, hvor du vil, og hvilket abonnement som faktisk passer.` |
| primaryCta | `Book gratis intro` |
| secondaryCta | `Send sporsmal` |
| quote | `Etter atte maneder pa Performance Pro gikk jeg fra HCP 12 til 7. Det storste var ikke timene — det var planen mellom timene.` |
| quoteAuthor | `Kristian B.` |
| quoteContext | `Performance Pro · 14 mnd` |

**Ny tekst:**
```
eyebrow:
headingPrefix:
headingItalic:
headingSuffix:
description:
primaryCta:
secondaryCta:
quote:
quoteAuthor:
quoteContext:
```

---

## 4. Junior Academy (`/junior-academy`)

### 4.1 Junior Hero

**Filsti:** `JUNIOR_HERO_V3`

| Felt | Original |
|---|---|
| eyebrow | `Junior Academy · 6–17 ar` |
| headingLead | `Lekent,` |
| headingItalic | `strukturert` |
| headingTrail | `, og bygd for utvikling.` |
| description | `Tre aldersgrupper med egne juniortrenere. Vi tar imot alle nivaer — fra forste gang med kolle til ambisiose tenaringer som vil konkurrere.` |
| ctaPrimary | `Se aldersgrupper` |
| ctaSecondary | `Ta kontakt` |

**Ny tekst:**
```
eyebrow:
headingLead:
headingItalic:
headingTrail:
description:
ctaPrimary:
ctaSecondary:
```

---

### 4.2 Aldersgrupper (3 stk)

**Filsti:** `JUNIOR_AGE_GROUPS_V3.groups[]`

#### Mini (6–9 ar)

| Felt | Original |
|---|---|
| name | `Mini` |
| tagline | `Lekbasert intro` |
| description | `Motorikk, koordinasjon og gledesfylt forste mote med golf. Plast-koller, fargerike mal, og masse loping.` |
| features | `Mini-baner og lek-stasjoner`, `Foreldre kan delta gratis`, `Kort tilpasset (avskaret)` |
| groupSize | `8 stk pr. gruppe` |
| ctaLabel | `Mer om Mini` |

**Ny tekst:**
```
name:
tagline:
description:
features:
groupSize:
ctaLabel:
```

#### Basis/Utvikling (10–13 ar)

| Felt | Original |
|---|---|
| name | `Basis/Utvikling` |
| tagline | `Teknikk + bane` |
| description | `Strukturert teknikk-bygging og forste moter med banespill i smagruppe.` |
| features | `Smagruppe-coaching`, `Banespill`, `Teknikk-fokus` |
| groupSize | `6 stk pr. gruppe` |

**Ny tekst:**
```
name:
tagline:
description:
features:
groupSize:
```

#### Elite (14–17 ar)

| Felt | Original |
|---|---|
| name | `Elite` |
| tagline | `Talent / turnering` |
| description | `For ambisiose tenaringer som vil utvikle seg mot turneringsspill. Personlig coach og treningsplan tilpasset spilleren.` |
| features | `Personlig coach`, `Treningsplan`, `Turnering-coaching` |
| groupSize | `4 stk pr. gruppe` |

**Ny tekst:**
```
name:
tagline:
description:
features:
groupSize:
```

---

### 4.3 Junior Coach-presentasjon

**Filsti:** `JUNIOR_COACH_V3`

| Felt | Original |
|---|---|
| eyebrow | `Hovedansvarlig junior` |
| headingLead | `Markus Roinas Pedersen — ` |
| headingItalic | `juniortrener.` |

**Ny tekst:**
```
eyebrow:
headingLead:
headingItalic:
```

---

### 4.4 Junior CTA

**Filsti:** `JUNIOR_CTA_V3`

| Felt | Original |
|---|---|
| headingLead | `Vil dere` |
| headingItalic | `vite mer` |
| headingTrail | `?` |
| description | `Ta kontakt for en uforpliktende prat. Vi forteller om aldersgruppene, hvordan en typisk uke ser ut, og hjelper dere finne riktig niva for ungen.` |
| ctaPrimary | `Ta kontakt` |

**Ny tekst:**
```
headingLead:
headingItalic:
headingTrail:
description:
ctaPrimary:
```

---

## 5. Utvikling (`/utvikling`)

### 5.1 Utvikling Hero

**Filsti:** `UTVIKLING_HERO_V2` (sjekk `lib/website-constants.ts:1946`)

```
Hvis du vil endre, skriv hele teksten du vil ha.
```

**Ny tekst:**
```
(la sta tomt om uendret)
```

---

### 5.2 Utvikling Pillars

**Filsti:** `UTVIKLING_PILLARS_V2` (sjekk `lib/website-constants.ts:1956`)

**Ny tekst:**
```
(la sta tomt om uendret)
```

---

### 5.3 Utvikling CTA

**Filsti:** `UTVIKLING_CTA_V2`

**Ny tekst:**
```
(la sta tomt om uendret)
```

---

## 6. Kontakt (`/kontakt`)

**Note:** Mockup `g10-kontakt.html` skal pixel-rebuildes som del av Sprint 3. Naverende tekst er i `app/landing/kontakt/page.tsx` eller `app/kontakt/page.tsx`.

```
Hvis du vil endre noe pa kontakt-siden, beskriv det her sa endrer Claude.
```

**Ny tekst:**
```
(la sta tomt om uendret)
```

---

## 7. Vedlikeholdsside (`/maintenance`)

### 7.1 Hovedinnhold

**Vises pa:** `/maintenance` (vises nar `MAINTENANCE_MODE=true`).
**Filsti:** `app/maintenance/page.tsx`

| Felt | Original |
|---|---|
| eyebrow | `/ VEDLIKEHOLD PAGAR` |
| heading | `Book time direkte mens vi finjusterer.` (med "time direkte" i italic) |
| body | `Spillerportalen er midlertidig nede mens vi gjor de siste forbedringene. Du kan booke time hos Anders eller Markus direkte her — det tar mindre enn ett minutt.` |

**Ny tekst:**
```
eyebrow:
heading:
body:
```

### 7.2 To CTA-kort (Anders + Markus)

| Kort | Felt | Original |
|---|---|---|
| Anders | eyebrow | `Voksne · TrackMan · Bane` |
| Anders | name | `Book hos Anders` |
| Anders | description | `1:1 coaching pa Gamle Fredrikstad Golfklubb. TrackMan-analyse og videoanalyse inkludert.` |
| Markus | eyebrow | `Junior · Nybegynnere` |
| Markus | name | `Book hos Markus` |
| Markus | description | `Coaching for juniorer og nye golfere. Sesjonene foregar pa Gamle Fredrikstad Golfklubb.` |

**Ny tekst:**
```
anders.eyebrow:
anders.name:
anders.description:
markus.eyebrow:
markus.name:
markus.description:
```

### 7.3 Bunn-knapper

| Felt | Original |
|---|---|
| Se alle ledige tider-knapp | `Se alle ledige tider` |
| E-post-link | `post@akgolf.no` |
| Footer | `© 2026 AK GOLF GROUP · ORG 925 884 102` |

**Ny tekst:**
```
seeAllButton:
emailLink:
footer:
```

---

## 8. Booking-flyt (`/booking-v2`)

### 8.1 Wizard-overskrifter

**Filsti:** `components/booking/booking-wizard.tsx`, `service-selector.tsx`, `booking-summary.tsx`

| Sted | Original |
|---|---|
| Steg 1-tittel | `Velg tjeneste` |
| Steg 2-tittel | `Velg dato og tid` |
| Steg 3-tittel (portal) | `Bekreft din booking.` |
| Steg 3-tittel (public) | `Dine opplysninger.` |
| "Bekreft din booking" eyebrow | `/ Steg 3 — Bekreft` |
| Pay-knapp | `Betal med kort` |
| Loading-state | `Behandler...` |
| Disclaimer | `Sikker betaling via Stripe. Du mottar bekreftelse pa e-post.` |
| Customer details proceed | `Fortsett til betaling` |

**Ny tekst:**
```
step1Title:
step2Title:
step3PortalTitle:
step3PublicTitle:
step3Eyebrow:
payButton:
loading:
disclaimer:
detailsProceed:
```

### 8.2 Customer details form

**Filsti:** `components/booking/booking-summary.tsx → CustomerDetailsForm`

| Felt | Original |
|---|---|
| Subtittel | `Fyll inn kontaktinformasjon for bookingen.` |
| Navn-label | `Fullt navn` |
| Navn-placeholder | `Ditt navn` |
| E-post-label | `E-postadresse` |
| E-post-placeholder | `din@epost.no` |
| E-post-hint | `Har du booket for med denne e-posten, kobles timen til din profil.` |
| Telefon-label | `Telefonnummer` |
| Telefon-placeholder | `+47 000 00 000` |

**Ny tekst:**
```
subtitle:
nameLabel:
namePlaceholder:
emailLabel:
emailPlaceholder:
emailHint:
phoneLabel:
phonePlaceholder:
```

---

## 9. Portal-kontekst (innloggede brukere)

### 9.1 Dashboard velkomst

**Filsti:** `lib/website-constants.ts → PORTAL_CONTENT.dashboard`

| Felt | Original |
|---|---|
| welcomeTemplate | `Hei {name}, klar for dagens trening?` |
| emptyBookings | `Ingen kommende bookinger. Book din neste sesjon for a fortsette utviklingen.` |
| emptyPlan | `Ingen aktiv treningsplan. Generer din personlige 12-ukers treningsplan.` |
| onboardingHints[0].title | `Fullfor profilen din` |
| onboardingHints[0].description | `Legg til handicap og mal for personlige anbefalinger` |
| onboardingHints[1].title | `Book din forste sesjon` |
| onboardingHints[1].description | `Start med en Foundation Test eller coaching-sesjon` |
| onboardingHints[2].title | `Sett deg et mal` |
| onboardingHints[2].description | `Definer hva du vil oppna denne sesongen` |

**Ny tekst:**
```
welcomeTemplate:
emptyBookings:
emptyPlan:
onboardingHints[0].title:
onboardingHints[0].description:
onboardingHints[1].title:
onboardingHints[1].description:
onboardingHints[2].title:
onboardingHints[2].description:
```

---

### 9.2 Booking-status-tekster

**Filsti:** `lib/website-constants.ts → PORTAL_CONTENT.bookings`

| Felt | Original |
|---|---|
| emptyState | `Du har ingen aktive bookinger. Book en sesjon for a komme i gang!` |
| confirmationMessage | `Booking bekreftet! Du mottar en paminnelse 24 timer for.` |
| Kanselleringsregler 24+ | `Gratis kansellering — 0% gebyr` |
| Kanselleringsregler 2–24 | `Delvis gebyr — 50%` |
| Kanselleringsregler <2 | `Ingen refusjon — 100%` |

**Ny tekst:**
```
emptyState:
confirmationMessage:
cancellationRules.24+:
cancellationRules.2-24:
cancellationRules.<2:
```

---

### 9.3 Treningsplan-tekster

**Filsti:** `PORTAL_CONTENT.treningsplan`

| Felt | Original |
|---|---|
| intro | `Din personlige treningsplan er generert av AI basert pa dine mal, statistikk og tilgjengelig tid.` |
| howToUse[0] | `Folg ukeplanen dag for dag` |
| howToUse[1] | `Marker okter som fullfort i dagboken` |
| howToUse[2] | `Se progresjon over tid i statistikk-fanen` |
| emptyState | `Generer din forste treningsplan basert pa dine mal og tilgjengelig tid.` |

**Ny tekst:**
```
intro:
howToUse[0]:
howToUse[1]:
howToUse[2]:
emptyState:
```

---

### 9.4 Statistikk-tekster

**Filsti:** `PORTAL_CONTENT.statistikk`

| Felt | Original |
|---|---|
| sgIntro | `Strokes Gained maler hvor mange slag du vinner eller taper sammenlignet med en scratch-spiller pa hver del av spillet.` |
| sg.tee | `SG: Tee — Slag vunnet/tapt pa utslagene (driver og lange fairway-slag)` |
| sg.approach | `SG: Approach — Slag vunnet/tapt pa innspill til green` |
| sg.shortGame | `SG: Short Game — Slag vunnet/tapt rundt green (chipping, pitching, bunker)` |
| sg.putting | `SG: Putting — Slag vunnet/tapt pa green` |
| howToRegister | `Registrer din forste runde for a se statistikk og identifisere svakheter.` |
| emptyState | `Ingen runder registrert enna. Klikk «Legg til runde» for a komme i gang.` |

**Ny tekst:**
```
sgIntro:
sg.tee:
sg.approach:
sg.shortGame:
sg.putting:
howToRegister:
emptyState:
```

---

## 10. Navigasjon og generelle elementer

### 10.1 Toppmeny / Navigasjon

**Filsti:** `lib/website-constants.ts → NAV_LINKS` + `components/website-v2/web-nav.tsx`

| Felt | Original |
|---|---|
| NAV_LINKS[0] | `Coaching` (lenker til /academy) |

**Ny tekst:**
```
nav[0]:
```

### 10.2 Footer

**Filsti:** `components/website-v2/web-footer.tsx`

> Denne filen inneholder fotert. Hvis du vil endre, beskriv hva.

**Ny tekst:**
```
(la sta tomt om uendret)
```

---

## 11. CTA og knapper (gjennomgaende)

Disse strengene gjentas pa flere steder. Endring her oppdaterer alle steder.

| Tekst | Hvor brukt |
|---|---|
| `Book time` | Hero, CTAs, Pricing |
| `Send e-post` | CTAs |
| `Ta kontakt` | Junior CTAs |
| `Se treningsabonnement` | Hero, Forside |
| `Prov en enkeltsesjon` | Hero |
| `Se alle ledige tider` | Maintenance |

**Endringer her gjelder gjennomgaende:**

```
"Book time" -> 
"Send e-post" -> 
"Ta kontakt" -> 
"Se treningsabonnement" -> 
"Prov en enkeltsesjon" -> 
"Se alle ledige tider" -> 
```

---

## 12. Generelle kommentarer og tilbakemeldinger

Hvis det er noe du onsker a si generelt om tonen, ord, formuleringer, eller om noe mangler — skriv det her:

```
(skriv fritt)
```

---

## Slik kjor du revisjonen

Nar du har fylt ut alle de "Ny tekst:"-blokkene du onsker a endre:

1. Lagre filen
2. Si til Claude: **"kjor tekst-revisjonen"**
3. Claude vil:
   - Lese gjennom hele filen
   - Identifisere alle felt med "Ny tekst" satt (ikke tomme)
   - Oppdatere riktige steder i koden
   - Kjore `npx tsc --noEmit` for a verifisere
   - Committe og pushe
   - Lage en sammendrags-tabell over alle endringer

**Tips:**
- Du trenger ikke fylle ut alle felt — bare de du vil endre
- Tomme felt betyr "behold original"
- Du kan gjore flere runder — lagre, kjor revisjon, gjor flere endringer, kjor pa nytt
- For kortere endringer kan du bare skrive en chat-beskjed: "Endre HERO.heading til 'X'"
