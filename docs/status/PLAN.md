# Utviklingsplan — Neste kvartal

> Opprettet: 2026-04-15
> Basert på: `BACKLOG.md`, `PORTAL_AUDIT.md`, `ADMIN_AUDIT.md`

---

## Sammendrag

Alle P1–P3-oppgaver er fullført. Platformen er 100 % mock-fri i både portal og admin.
Dette er planen for neste kvartal — 4 hovedinitiativer med estimert innsats og avhengigheter.

| # | Initiativ | Kompleksitet | Avhengigheter |
|---|-----------|--------------|---------------|
| 1 | AI-genererte TrackMan-innsikter | Medium | Anthropic SDK, `TrackManSessionAnalytics` |
| 2 | Prediktiv HCP-trend | Medium | `RoundStats`, `TrainingLog`, `TrackManSessionAnalytics` |
| 3 | Automatisk treningsplan-justering | Høy | `TrainingPlan`, `TrainingLog`, AI-innsikter |
| 4 | Real-time Mission Board | Lav-Medium | WebSocket eller SSE, admin-kanaler |

---

## 1. TrackMan: AI-genererte innsikter

**Mål:** Konvertere `TrackManSessionAnalytics` til personlige, actionbare coaching-innsikter per spiller.

### Steg
1. **Data-pipeline**
   - Utvid `getTrackManOverview()` til å serialisere analytics som ren JSON-prompt-kontekst
   - Lag prompt-template i `lib/portal/ai/prompts/trackman-insights.ts`

2. **AI-generering**
   - Ny server action: `generateTrackManInsights(userId: string)`
   - Kall Anthropic med strukturert output (zod / json-mode)
   - Cache resultat i `TrackManInsight`-tabell (ny modell) for å unngå duplikate kall

3. **UI-integrering**
   - Vis AI-innsikter øverst i `TrackManAnalyticsCard`
   - Regenerer-knapp med 24t cooldown
   - Highlight "anbefalt fokus" som egen visuell blokk

### Suksesskriterier
- [ ] Spiller får 3–5 personlige innsikter etter hver TrackMan-sesjon
- [ ] Innsiktene er basert på faktiske tall (carry, spredning, klubbhastighet)
- [ ] Responstid < 3 sekunder (cache treff)

---

## 2. Statistikk: Prediktiv HCP-trend

**Mål:** Gi spilleren en visuell prognose på handicap-utvikling basert på treningsvolum og runde-historikk.

### Steg
1. **Datagrunnlag**
   - `getGolfProfileSummary()` utvides til å hente:
     - Siste 90 dagers `TrainingLog` (antall timer per kategori)
     - Siste 20 `RoundStats` (score vs par, trend)
     - Siste 12 `TrackManSessionAnalytics` (frekvens)

2. **Prediksjonsmodell (v1: regelbasert)**
   - Treningsvolum-skår (0–100) basert på timer/uke
   - Runde-konsistens-skår (0–100) basert på standardavvik i score
   - Kombiner skårene til en prognose:
     - `+/- X HCP` om 30 dager
     - `+/- Y HCP` om 90 dager
   - Lag som en ny server action: `getHcpProjection(userId)`

3. **Visualisering**
   - Ny komponent: `HcpProjectionChart`
   - Linjediagram: faktisk HCP (historisk) + projisert trend (fremtid)
   - Tooltip med forklaring på hva som driver prognosen

4. **v2 (senere):** Vurder ML-basert modell hvis vi får nok data

### Suksesskriterier
- [ ] Prognosen oppdateres automatisk når nye runder eller treningslogger legges inn
- [ ] Chart vises i `statistikk`-siden under "Din Golfprofil"
- [ ] Spiller forstår hvorfor prognosen er slik den er

---

## 3. Dagbok: Automatisk treningsplan-justering

**Mål:** Systemet foreslår justeringer i treningsplanen basert på faktisk logget progresjon.

### Steg
1. **Progresjons-måling**
   - Sammenlign `TrainingPlanExercise.targetReps/sets/duration` med `TrainingLog.achievedReps/sets/duration`
   - Beregn % oppnådd per øvelse og per uke

2. **Justeringsregler (v1)**
   - `> 90 % oppnådd 2 uker på rad` → øk vanskelighetsgrad (mer reps, tyngre vekt, lengre fokus)
   - `< 60 % oppnådd 2 uker på rad` → reduser volum, foreslå alternativ øvelse
   - `0 % oppnådd` → spørsmål: "Vil du flytte denne øvelsen til neste uke?"

3. **AI-assistert v2**
   - Prompt med treningslogg + TrackMan-data → få forslag til økt-struktur
   - `generatePlanAdjustmentSuggestion(userId, planId)`

4. **UI-integrering**
   - Utvid `PlanProgressTracker` med justeringsforslag
   - Godkjenn/avslå-knapper direkte i tracker
   - Ved godkjenning: oppdater `TrainingPlanExercise` via Prisma

### Suksesskriterier
- [ ] Spiller ser justeringsforslag innen 24t etter en uke er avsluttet
- [ ] Justeringer er ett klikk unna å bli aktivert
- [ ] Instruktør kan overstyre automatiske forslag i MC

---

## 4. Admin: Real-time Mission Board

**Mål:** Live oppdatering av admin-dashboard uten manuell refresh.

### Steg
1. **Teknologi-valg**
   - **Alt 1 (anbefalt):** SSE (`EventSource`) fra Next.js API Route
   - **Alt 2:** WebSocket via egen Node-server (mer kompleks)
   - **Alt 3:** Polling med 30s intervall (enklest, dårligst UX)

2. **Implementering (SSE)**
   - Ny route: `/api/portal/admin/sse`
   - Autentisering: `requirePortalUser()` + `canAccessMissionControl()`
   - Publiser event ved:
     - Ny booking opprettet
     - Booking kansellert
     - Betaling mottatt
   - Admin `MissionBoard` abonnerer på event-stream

3. **Optimalisering**
   - Throttle oppdateringer (maks 1/s)
   - Kun push diff (ikke full payload)
   - Koble til eksisterende `getMissionBoardCharts()` for data-reload

### Suksesskriterier
- [ ] Admin ser nye bookinger innen 2 sekunder
- [ ] Ingen full side-reload nødvendig
- [ ] Fungerer på mobil og desktop

---

## Tverrgående avhengigheter

| Avhengighet | Blokkerer | Status |
|-------------|-----------|--------|
| `TrackManSessionAnalytics`-tabell | #1, #2 | Eksisterer |
| `TrainingLog` ↔ `TrainingPlanExercise` mapping | #3 | Eksisterer |
| Anthropic SDK med `ai`-biblioteket | #1, #3 | Konfigurert |
| Admin RBAC | #4 | `canAccessMissionControl()` |

---

## Foreslått rekkefølge

1. **Uke 1:** TrackMan AI-innsikter (#1) — rask seier, høy verdi for spillere
2. **Uke 2–3:** Prediktiv HCP-trend (#2) — bygger på samme data-pipeline
3. **Uke 4–5:** Automatisk treningsplan-justering (#3) — største funksjonelle løft
4. **Uke 6:** Real-time Mission Board (#4) — admin-UX forbedring

---

## Notater

- Alle nye Prisma-modeller skal følge eksisterende navnekonvensjoner (PascalCase, engelsk)
- Markedsside-tekst skal fortsatt ligge i `lib/website-constants.ts`
- Oppdater denne planen ved endringer — den skal være levende dokumentasjon
