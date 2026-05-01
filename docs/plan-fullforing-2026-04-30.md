# Helhetlig plan — fullforing av AK Golf Platform

**Dato:** 2026-04-30 (etter D.6 + D.7 commit `5668adf3`)
**Formal:** Komplett oversikt over alle gjenstaende oppgaver med prioritering, estimater og anbefalt rekkefolge.

---

## A. Hva som er FERDIG og pushed

| # | Oppgave | Commit |
|---|---|---|
| A | Wire 9 widget-actions til real data | `57571ec` |
| B2a | Hub-oversikt pixel-rebuild | `10ff7b6d` |
| B2b | 3-panel coach-arbeidsflate `/admin/elever` | `d029dbc5` |
| B2c | Dagens fokus med real signals/KPIs | `8c01a15e` |
| D.6 | Coach-tracking `/admin/elever/[id]/tester` | `5668adf3` |
| D.7 | Retest-reminder-agent + CRON | `5668adf3` |
| C Sprint A | Round/UpGame Pro Prisma-modeller (GPS + ClubInBag + RoundLiveState) | tidligere |
| E | Bildekomprimering 25 MB spart | tidligere |
| /simplify v1 + v2 | 20+ kvalitets-fikser | `7916e45` + `bcb0010` |

**Dokumenter levert:**
- `docs/tekst-revisjon-2026-04-29.md` (1087 linjer) — venter pa Anders manuelt
- `docs/kimi-code-prompt-v2-2026-04-29.md` (786 linjer) — Kimi Code jobber parallelt
- `docs/plan-b1-b2-b6-d-2026-04-29.md` (447 linjer) — denne planen er en oppdatering

---

## B. Hva som er DELVIS bygget (fortsetter)

### B1 — Treningsplan pixel-rebuild
**Status:** Scaffolding lagt, mye gjenstar.
**Eksisterer:**
- `app/portal/(dashboard)/treningsplan/v2/page.tsx` (115 linjer)
- `components/portal/treningsplan-v2/{day-card, session-pill, types, week-strip}.tsx`

**Mangler:**
- `okt-detalj`-side (`v2/[sessionId]/page.tsx`) — IKKE startet
- `mini-stat`, `exercise-card`, `exercise-row`, `library-grid` — IKKE startet
- Mobil-tilpasning
- Aktivering via `?v=2` query

**Estimat for fullforing:** 3-4 dager

### B2d — Coaching Board
**Status:** Mest ferdig, trenger pixel-validering mot mockup.
**Eksisterer:**
- `app/admin/(authed)/coaching-board/page.tsx` (35) + `coaching-board-client.tsx` (77) + `coaching-board-dark-client.tsx` (120) + `actions.ts` (652)

**Mangler:**
- Pixel-match-validering mot `d3-coaching-board.html`-mockup
- Real data der mock fortsatt brukes
- Eventuelle felles-komponenter med Hub-oversikt

**Estimat:** 0.5-1 dag

### B6 — TrackMan UI-rebuild
**Status:** Scaffolding lagt.
**Eksisterer:**
- `app/portal/(dashboard)/trackman/v2/page.tsx` (33)
- `components/portal/trackman-v2/{filter-bar, kpi-row, shots-table, trackman-v2-client}.tsx`

**Mangler:**
- Charts-integrasjon (gjenbruk av eksisterende dynamic-loaded charts)
- Real data hookup
- Mobil-tilpasning
- Aktivering via `?v=2` query

**Estimat:** 1.5-2 dager

### D — 20 golftester polish (kun D.4 polish gjenstaar)
**Mangler:**
- 5 dedikerte input-komponenter i `components/portal/tester/inputs/` (mappa er tom):
  - `single-number-input.tsx`
  - `distance-array-input.tsx`
  - `percentage-attempts-input.tsx` (hit/miss-checkboxes)
  - `score-per-attempt-input.tsx` (0-2 per slag)
  - `distance-past-hole-input.tsx`
- Generic `<TestInputForm>` discriminator
- Trend-graf i resultat-side
- Lenke fra spillerprofil 360° til `/admin/elever/[id]/tester`

**Estimat:** 1-1.5 dag (lavprioritet, eksisterende generic input fungerer)

---

## C. Hva som er BLOKKERT av Kimi Code

Kimi jobber parallelt pa F1-F4 fra `docs/kimi-code-prompt-v2-2026-04-29.md`.
Filer Kimi har lagt til (TS-feil — mangler npm install):
- `components/portal/round/{hole-map, map-overlay-layers, round-map-mode}.tsx`
- `lib/portal/round/lie-detection.ts`

**Krever:** `npm install mapbox-gl react-map-gl @turf/turf @turf/distance @turf/boolean-point-in-polygon @types/geojson`

**Status:** Anders bestiller Kimi Code, vi venter pa rapport. Mapbox-relaterte filer skal IKKE fikses av Claude — Kimi installerer dependencies.

---

## D. Helt IKKE startet (fra opprinnelig planen)

### Sprint 6.3 — Sekundaere sider visuell matching (12-15 stk)
**Portal-sider:** Kalender, Meldinger, Sosialt, Turneringer, Analyse, Benchmark, Sammenligning, AI-coach, Coaching-historikk, Tester, Bag, Mental, Strategi, Apper, Abonnement, Profil-innst.

**Admin-sider:** Tilgjengelighet, Kapasitet, Focus, Denne-uken, E-postmaler, Push-varsler, AI-assistent, Analytics.

**Estimat per side:** 30-60 min (med eksisterende Brand Guide V2.0-tokens)
**Total:** 12-15 timer

### Sprint 6.4 — Treningsplan-features
| # | Oppgave | Estimat |
|---|---|---|
| TP-1 | "Foresla i stedet"-knapp pa SessionCard | 2t |
| TP-3 | `PlanChangeLog`-modell + UI | 4t |
| TP-5 | PyramidActuals header-bar | 2t |
| TP-6 | Fjern hardkodet `periodType: "grunnperiode"` (`actions.ts:1379`) | 1t |
| TP-8 | `/admin/periodisering/[playerId]` UI | 4t |

**Total:** ~13 timer (~1.5 dag)

### Sprint 7 — Tester + dokumentasjon
- Vitest unit-tester for alle agenter — happy-path per agent (~6t)
- Vitest for `lib/portal/booking/*.ts` — slot-availability (~3t)
- Playwright E2E booking-flyt utvidelse (~4t)
- Playwright E2E portal-login + dashboard-load (~3t)
- WORKLOG + BACKLOG oppdatering (~2t)

**Total:** ~18 timer (~2 dager)

### C Sprint B-E — Round/UpGame Pro (overlapper med Kimi F2+F3)
Kimi tar dette i F2 (manuell) + F3 (Mapbox). **Sjekk Kimis status for ikke aa duplikere arbeid.**

### Tekst-revisjon (Anders' oppgave)
Anders fyller inn `docs/tekst-revisjon-2026-04-29.md` manuelt. Nar ferdig, sier "kjor tekst-revisjonen", og Claude oppdaterer kodebasen automatisk.

**Estimat for Claudes del:** 2-3 timer etter Anders har fylt ut.

---

## E. Anbefalt eksekverings-rekkefolge

### Uke 1 (denne uken): Lukk de delvis-bygde oppgavene

| Dag | Oppgave | Estimat | Output |
|---|---|---|---|
| 1 | B2d Coaching Board fullforing | 0.5 dag | Pixel-match + real data |
| 1-2 | B6 TrackMan v2 fullforing | 1.5 dag | Charts integrert + mobil + aktivering |
| 3-6 | B1 Treningsplan v2 fullforing | 4 dager | Okt-detalj + bibliotek + mobil + aktivering |

### Uke 2: Polish + sekundaere sider

| Dag | Oppgave | Estimat |
|---|---|---|
| 7 | D.4 polish — 5 input-komponenter | 1 dag |
| 8 | Sprint 6.4 Treningsplan-features (TP-1 til TP-8) | 1 dag |
| 9-10 | Sprint 6.3 sekundaere sider (12-15 sider) | 2 dager |
| 11 | Tekst-revisjon (etter Anders' input) | 0.5 dag |

### Uke 3: Tester + docs

| Dag | Oppgave | Estimat |
|---|---|---|
| 12-13 | Sprint 7 Vitest + Playwright | 2 dager |
| 14 | WORKLOG + BACKLOG + component-library | 0.5 dag |
| 14 | Smoke-test alt + buffer | 0.5 dag |

**Total estimat for fullstendig lukking:** ~14 dager (3 uker fokusert arbeid)

---

## F. Lansering-kritiske vs nice-to-have

### Lansering-kritisk (MA gjores for full bruk)
1. ✅ Booking fungerer (gjort)
2. ✅ Hub-oversikt + Dagens fokus + Coach-arbeidsflate (gjort)
3. 🟡 B2d Coaching Board polish (1 dag)
4. 🟡 B6 TrackMan UI-rebuild (1.5 dag)
5. ❌ Treningsplan v2 (4 dager) — ELLER bruk eksisterende v1 ved lansering
6. ❌ Sprint 6.3 sekundaere sider (~2 dager) — ELLER aksepter Heritage-stil pa sekundaere

### Nice-to-have (kan gjores etter lansering)
- D.4 input-komponent-polish
- Sprint 6.4 Treningsplan-features (TP-1 til TP-8)
- Sprint 7 utvidede tester
- Tekst-revisjon (etter Anders' gjennomgang)

### Pa Kimi Codes ansvar (parallelt, ingen Claude-handling)
- F1 TrackMan-upload via Vision (3-4 dager)
- F2 Stats UpGame manuell (3 dager)
- F3 Baneguide Mapbox (5-7 dager)
- F4 Treningsanalyse-modul (2-3 dager)

---

## G. Beslutninger som ma tas av Anders

1. **Skal B1 Treningsplan v2 fullfores for lansering, eller bruker vi v1?**
   - Hvis ja: 4 dagers arbeid
   - Hvis nei: lansere med Heritage-style treningsplan, oppgrader senere

2. **Skal Sprint 6.3 sekundaere sider (12-15 stk) gjores for lansering?**
   - Hvis ja: 2 dagers arbeid
   - Hvis nei: aksepter at noen sider mangler Brand Guide V2.0 til etter lansering

3. **Tekst-revisjon — har du tid til a fylle ut nu?**
   - Hvis ja: Claude oppdaterer kodebasen pa 2-3 timer
   - Hvis nei: utsetter til etter lansering

4. **Hvor avhengig er du av Kimi Codes F1-F4?**
   - Hvis kritisk for lansering: koordiner status-meldinger
   - Hvis nice-to-have: lanser uten dem

---

## H. Verifikasjon for lansering

**Pre-lansering sjekkliste:**
```bash
# 1. TS + lint
npx tsc --noEmit          # 0 errors (ekskluder Kimis Mapbox-filer)
npx eslint app/ components/ lib/

# 2. Tester
npm run test
npm run test:e2e

# 3. Build
npm run build

# 4. Manuell smoke-test
- Logg inn som spiller, bookinger, treningsplan, statistikk
- Logg inn som coach, hub, dagens fokus, spillerprofil
- Tester-flow: utfor en test, sjekk resultat
- Mobile: iPhone 14 Pro + Pixel 7

# 5. Stripe + cron
- Test booking-betaling med kort 4242
- Verifiser cron-runs i Vercel logs
```

**Akseptansekriterier per delfeature** — se hver Sprint-tabell ovenfor.

---

## I. Hva trenger Anders a gjore

1. **Bestem rekkefolge** ved a svare pa beslutninger i del G ovenfor
2. **Tekst-revisjon** (1-2 timer) hvis han vil ha det inn for lansering
3. **Kimi Code koordinering** — sjekk om de er pa F1, F2, F3 eller F4
4. **Manuell QA** etter hver Sprint-fullforing pa dev-server
5. **Beslutning om lansering-dato** — neste uke (mandag) hvis vi tar lansering-kritisk-oppgavene

---

## J. Tre alternativer for resten av uken

### Alternativ 1: Minimum viable launch (2-3 dager)
- Fullfor B2d + B6 (2 dager)
- Aksepter Heritage-style pa Treningsplan og sekundaere sider
- Lanser fredag/mandag

### Alternativ 2: Premium launch (7-8 dager)
- Fullfor B2d + B6 + B1 + D.4-polish + tekst-revisjon
- Sprint 6.3 sekundaere sider gjores
- Lanser 7-8 dager fra na

### Alternativ 3: Komplett (14 dager)
- Alle Sprint 6 + Sprint 7 + tekst-revisjon
- Polish overalt
- Lanser om ~2-3 uker
