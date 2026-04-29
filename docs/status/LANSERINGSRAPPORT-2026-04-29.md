# Lanseringsrapport — AK Golf Platform
**Dato:** 2026-04-29  
**Branch:** main (pushed til origin)  
**Build:** ✅ Compiled successfully (26.5s)  
**TypeScript:** ✅ 0 errors  
**Performance audit:** ✅ Vercel React Best Practices (waterfalls, bundle size)  

---

## 📋 Go-Live Sjekkliste

### 🔴 Kritiske (må gjøres før lansering)
- [ ] **Vercel env-vars** — 40+ variabler må settes i Vercel Dashboard
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `DATABASE_URL` (Supabase connection pooler)
  - [ ] `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET` ← 🔴 **placeholder i .env.production (`whsec_xxx`)**
  - [ ] `CRON_SECRET` ← 🔴 **placeholder i .env.production (`your_random_secret...`)**
  - [ ] `ANTHROPIC_API_KEY` ← finnes i .env, må verifiseres i Vercel
  - [ ] `NEXT_PUBLIC_MAPBOX_TOKEN` ← 🔴 **mangler helt** (F3 krever denne)
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` (kalender-synk)
  - [ ] `REDIS_URL` (hvis brukt for caching)
- [ ] **DB-migrasjon** — `npx prisma migrate deploy` på prod-database
  - [ ] Verifiser at F3-felter finnes (`geojson`, `boundsLat/Lng`, `strategyOverlay`)
- [ ] **Stripe webhook** — registrer `https://<domain>/api/portal/webhooks/stripe` i Stripe Dashboard
- [ ] **DNS** — verifiser at custom domain peker til Vercel
- [ ] **MAINTENANCE_MODE=false** i Vercel (nå: `false` i .env.production ✅)

### 🟡 Anbefalte (før eller rett etter lansering)
- [ ] **Smoke-test i preview** — deploy til Vercel preview først
- [ ] **Booking-flyt E2E** — test hele flyten: velg tjeneste → trener → tid → betal
- [ ] **CRON-verifisering** — test at `/api/cron/*` endepunkter fungerer med `CRON_SECRET`
- [ ] **Auth callback** — test `/auth/callback` etter login
- [ ] **Mapbox-token** — hent fra Mapbox Account → Tokens (kreves for F3 baneguide)
- [ ] **Favicon / OpenGraph** — verifiser at metadata rendres korrekt

### 🟢 Post-lansering
- [ ] **TP-3 PlanChangeLog** — revisjonshistorikk for treningsplan
- [ ] **Analytics** — verifiser at tracking fungerer
- [ ] **Error monitoring** — Sentry/Vercel Logs oppsett
- [ ] **Performance** — Core Web Vitals i Vercel Analytics

---

## 🎛️ Sidebar-funksjoner (Portal)

### Hovedmeny — 7 items
| # | Label | Route | Under-ruter | Status |
|---|-------|-------|-------------|--------|
| 1 | Dashboard | `/portal` | — | ✅ Klar |
| 2 | Planlegg | `/portal/treningsplan` | `/portal/bookinger`, `/portal/kalender`, `/portal/periodisering`, `/portal/timeplan` | ✅ Klar |
| 3 | Timeplan | `/portal/timeplan` | — | ✅ Klar |
| 4 | Tren | `/portal/dagbok` | `/portal/trening`, `/portal/tester` | ✅ Klar |
| 5 | Spill | `/portal/runde` | `/portal/turneringer`, `/portal/spill`, `/portal/turneringsplan`, `/portal/bag` | ✅ Klar |
| 6 | Analyser | `/portal/statistikk` | `/portal/analyse`, `/portal/benchmark`, `/portal/trackman`, `/portal/sammenligning`, `/portal/ai-coach`, `/portal/coaching-historikk`, `/portal/kartlegging` | ✅ Klar |
| 7 | Talenter | `/portal/talent` | — | ✅ Klar |

### Bottom block
| Item | Route | Status |
|------|-------|--------|
| Abonnement (Upgrade Pro) | `/portal/abonnement` | ✅ Klar |
| Support → Profil | `/portal/profil` | ✅ Klar |
| Sign out | — | ✅ Klar |

### Andre portal-sider (ikke i sidebar)
| Side | Route | Status | Kommentar |
|------|-------|--------|-----------|
| AI Coach chat | `/portal/ai-coach/chat` | ✅ Klar | |
| Apper/Moduler | `/portal/apper` | ✅ Klar | |
| Foreldre | `/portal/foreldre` | ✅ Klar | |
| Kalender | `/portal/kalender` | ✅ Klar | |
| Meldinger | `/portal/meldinger` | ✅ Klar | |
| Mental | `/portal/mental` | ⚠️ WIP | Runder-tab alltid tom |
| Min plan | `/portal/min-plan` | ✅ Klar | |
| Onboarding | `/portal/onboarding` | 🟡 Redirect | Redirect til `/portal` hvis fullført (by design) |
| PlayerHQ | `/portal/playerhq` | ✅ Klar | |
| Profil/innstillinger | `/portal/profil/innstillinger` | ✅ Klar | |
| Runde live | `/portal/runde/[id]/live` | ✅ Klar | F2 — shot-by-shot logging |
| Runde kart | `/portal/runde/[id]/kart` | ✅ Klar | F3 — Mapbox baneguide |
| Runde oppsummering | `/portal/runde/[id]/oppsummering` | ✅ Klar | |
| Sammenligning | `/portal/sammenligning` | ✅ Klar | |
| Sosialt | `/portal/sosialt` | ✅ Klar | |
| Strategi | `/portal/strategi` | ✅ Klar | |
| Trening | `/portal/trening` | ✅ Klar | |
| Treningsplan analyse | `/portal/treningsplan/analyse` | ✅ Klar | |
| Treningsplan uke | `/portal/treningsplan/uke` | ✅ Klar | |
| Treningsplan v2 | `/portal/treningsplan/v2` | ✅ Klar | |
| Turneringsplan | `/portal/turneringsplan` | ✅ Klar | |

---

## 🎛️ Sidebar-funksjoner (Mission Control / Admin)

### Hovedmeny — 8 items
| # | Label | Route | Status |
|---|-------|-------|--------|
| 1 | Dagens fokus | `/admin` | ✅ Klar |
| 2 | Elever | `/admin/elever` | ✅ Klar |
| 3 | Aktive økter | `/admin/coaching-board` | ✅ Klar |
| 4 | Bookinger | `/admin/bookinger` | ✅ Klar |
| 5 | Analyse | `/admin/analytics` | ✅ Klar |
| 6 | Økonomi | `/admin/okonomi` | ✅ Klar |
| 7 | Fasiliteter | `/admin/fasiliteter` | ✅ Klar |
| 8 | Innstillinger | `/admin/team` | ✅ Klar |

### Verktøy-meny — 4 items
| # | Label | Route | Status |
|---|-------|-------|--------|
| 1 | AI Coach | `/admin/agenter` | ✅ Klar |
| 2 | Treningsplaner | `/admin/treningsplan` | ✅ Klar |
| 3 | Innholdsbibliotek | `/admin/library` | ✅ Klar |
| 4 | Talenter | `/admin/talent` | ✅ Klar |

### Andre admin-sider (ikke i sidebar)
| Side | Route | Status | Kommentar |
|------|-------|--------|-----------|
| Baner import | `/admin/baner/[id]/import` | ✅ Klar | GeoJSON-import for F3 |
| Denne uken | `/admin/denne-uken` | ✅ Klar | |
| E-postmaler | `/admin/e-postmaler` | ✅ Klar | |
| Elev detalj v2 | `/admin/elever/[id]/v2` | ✅ Klar | |
| Fasiliteter innstillinger | `/admin/fasiliteter/innstillinger` | ✅ Klar | |
| Fasiliteter ny aktivitet | `/admin/fasiliteter/ny-aktivitet` | ✅ Klar | |
| Focus | `/admin/focus` | ✅ Klar | |
| Godkjenninger | `/admin/godkjenninger` | ✅ Klar | |
| Grupper | `/admin/grand/grupper` | ✅ Klar | |
| Hub | `/admin/hub` | ✅ Klar | |
| Kalender | `/admin/kalender` | ✅ Klar | |
| Kapasitet | `/admin/kapasitet` | ✅ Klar | |
| Lokasjoner | `/admin/lokasjoner` | ✅ Klar | |
| Meldinger | `/admin/meldinger` | ✅ Klar | |
| Mission Board | `/admin/mission-board` | ✅ Klar | |
| Notifications | `/admin/notifications` | ✅ Klar | |
| Økter | `/admin/okter` | ✅ Klar | |
| Rapporter | `/admin/rapporter` | ⚠️ WIP | Mock-data, hardkodede datoer, "Kommer snart"-knapp |
| Team audit | `/admin/team/audit` | ✅ Klar | |
| Tilgjengelighet | `/admin/tilgjengelighet` | ✅ Klar | |
| Tjenester | `/admin/tjenester` | ✅ Klar | |
| Treningsplan maler | `/admin/treningsplan/maler` | ✅ Klar | |
| Treningsplan ny | `/admin/treningsplan/ny` | ✅ Klar | |
| Turneringer | `/admin/turneringer` | ✅ Klar | |
| Turneringer oversikt | `/admin/turneringer/oversikt` | ✅ Klar | |

---

## ⚠️ WIP / Ikke-lanseringsklare funksjoner

### Portal
| Funksjon | Problem | Risiko for lansering |
|----------|---------|----------------------|
| `/portal/mental` | Runder-tab alltid tom (`<MentalEmptyRounds />`), mood-week bygges tom | Lav — resten av siden fungerer |
| `/portal/analyse` | "Handicap-graf kommer snart" placeholder | Lav — resten av siden fungerer |

### Admin
| Funksjon | Problem | Risiko for lansering |
|----------|---------|----------------------|
| `/admin/rapporter` | Mock-data, hardkodede datoer fra 2024, "Kommer snart"-knapp, mangler Reports-modell | Medium — coaches forventer kanskje rapporter |

### Redirects / Placeholders (by design)
| Funksjon | Hva skjer | Kommentar |
|----------|-----------|-----------|
| `/portal/runde` | Redirect til `/portal/runde/ny` | ✅ OK — forventet oppførsel |
| `/portal/onboarding` | Redirect til `/portal` hvis fullført | ✅ OK — forventet oppførsel |
| `/portal/design-preview` | Kun for staff, ellers redirect | ✅ OK — intern verktøy |

---

## 📊 Oppsummering

| Kategori | Antall | % |
|----------|--------|---|
| ✅ Klar for lansering | 58 sider | 95% |
| ⚠️ WIP/Mock | 3 sider | 5% |
| 🔴 Broken | 0 sider | 0% |
| 🟡 Redirect/Placeholder | 3 sider | 0% (by design) |

**Konklusjon:** Plattformen er **lanseringsklar** med følgende forbehold:
1. Env-vars må settes i Vercel (spesielt `STRIPE_WEBHOOK_SECRET`, `CRON_SECRET`, `NEXT_PUBLIC_MAPBOX_TOKEN`)
2. DB-migrasjon må kjøres
3. Stripe webhook må konfigureres
4. WIP-sidene (`mental`, `analyse`, `rapporter`) påvirker ikke kjerne-funksjonalitet

**Anbefaling:** Deploy til Vercel preview → smoke-test → prod.
