# OrbitAI — Komplett designanalyse

> Kilde: https://orbitaix.webflow.io (crawlet 2026-04-04)
> Bygget med Webflow. 3 sider totalt.

---

## 1. Sidehierarki og navigasjon

### Sidestruktur
| URL | Formaal | Type |
|-----|---------|------|
| `/` | Landingsside — hero, features, pricing, CTA | Markedsside |
| `/sign-up` | Registrering — skjema + Google OAuth | Auth |
| `/sign-in` | Innlogging — skjema + Google OAuth | Auth |

Ingen dashboard, app eller portal er offentlig tilgjengelig — alt bak auth.

### Navigasjon
- **Sticky nav** med glassmorfisme (ingen synlige lenker i crawl — trolig skjult/hamburger pa mobil)
- Logo venstre, CTA-knapp hoyre
- Ingen undersider/dropdown — hele siden er en one-pager med anchor-seksjoner

### Seksjonsrekkefolge (landing)
1. Hero (video + animert tekst)
2. Audience ("Designed For" — Founders, Creators, Builders, Freelancers)
3. Bento Grid ("Goodbye to Daily Chaos" — 5 kort)
4. Dashboard showcase (fullbredde screenshot)
5. Deep Features (4 seksjoner med bilde + tekst, alternerende)
6. 3-Step Flow
7. Testimonials (slider med 4 sitater)
8. Pricing (tabs: Monthly/Yearly, 2 planer)
9. Social proof (10K+ users, 4.9 rating)
10. Final CTA
11. Footer (minimal)

---

## 2. Designsystem

### Fargepalett
| Token | Hex | Bruk |
|-------|-----|------|
| Background | `#050707` | Hele siden — nattsvart |
| Text primary | `#ACB5C4` | Broedtekst — dempet hvit-blaa |
| Text secondary | `#55657A` | Labels, meta — moerk graa-blaa |
| Accent / CTA | `#3E9CFF` | Knapper, lenker, hover — klar blaa |
| Card bg | `#0C0F14` / `#1F242C` | Kortbakgrunn — nesten svart |
| Highlight card | cyanskjaer | Bento-kort med `is-highlight` |

**Kjennetegn:** Monokromatisk mork med EN aksent (blaa). Ekstremt begrenset fargebruk. Kontrasten mellom #050707 og #3E9CFF er det eneste "fargeelementet".

### Typografi
| Element | Font | Storrelse | Vekt |
|---------|------|-----------|------|
| H1 (hero) | Manrope | 64px | 700-800 |
| H2 (seksjoner) | Manrope | 42px | 700 |
| H3 (korttitler) | Manrope | ~24px | 600-700 |
| H4 | Manrope | ~18px | 600 |
| Body | Inter | 24px (!!) | 400 |
| Small/labels | Inter | 14-16px | 400-500 |
| Mono (kode/tips) | JetBrains Mono | variabel | 400 |
| Alt heading | Plus Jakarta Sans | variabel | — |

**Kjennetegn:** Uvanlig stor body-tekst (24px). Dramatisk storrelseskontrast mellom overskrifter og labels. Manrope for overskrifter gir en mykere, mer "vennlig" feeling enn ren Inter.

### Spacing og layout
- **Base unit:** 4px grid
- **Border radius:** 6px (subtilt) — men knapper er 90px (pill)
- **Seksjonspadding:** `.padding-section-large` — generost, anslagsvis 120-160px vertikalt
- **Container:** `.container-large` — maks ~1200px
- **Bento grid:** Varierende kortstorrelser med `.card_type1`, `.card_type3`, `.bento-card_*`

### Knapper
| Type | Bakgrunn | Tekst | Border |
|------|----------|-------|--------|
| Primary | `#3E9CFF` | `#0C0F14` (mork) | ingen |
| Secondary | `#1F242C` | `#3E9CFF` | 1px `#3E9CFF` |
| Begge: | border-radius: 90px (pill) | | |

### Skygger og effekter
- Ellipse glow-effekter (`.ellipse_shadow-softwhite`, `.ellipse_bottom-shade`) — store ufokuserte lysflekker bak innhold
- Galaxy/nebula bakgrunnsbilder (`.hero_background-desktop` — fantasy-style-galaxy-background)
- Subtile partikelanimasjoner (`.hero_background-particles`)
- Gradientoverlays pa bilder (`.illustration-_bottom-overlay`)
- Stagger-animasjoner pa lister og kort (`.stagger`)
- Lenis smooth scroll

### Kort-design
- **Bento-kort:** Mork bg (#0C0F14-ish), subtil border, dekorative bakgrunnsbilder (`.bento-card_background`, `.card-illustration_wrap`)
- **Feature-kort:** Fullbredde bilde med overlay-gradient pa bunnen
- **Pricing-kort:** Mork bg, pill-badges for features, tydelig prisvisning
- **Testimonial-kort:** Avatar + sitat, slider-basert

---

## 3. Dashboard-oppsett (fra screenshots og alt-tekst)

Dashboard er ikke offentlig, men alt-tekster og screenshots avslorer:

### Dashboard-elementer
Fra alt-tekst: *"OrbitAI dashboard showing a personalized task schedule with focus mode timer set to 25 minutes, daily focus score of 89, productivity rhythm bar chart, and task completion rate of 91 percent."*

| Element | Beskrivelse |
|---------|-------------|
| **Task Schedule** | Personalisert dagsplan med tidsblokker |
| **Focus Mode Timer** | 25 min (Pomodoro-stil) med 25/50/custom valg |
| **Focus Protection** | Muted notifications, locked task switching, blocked meetings |
| **Daily Focus Score** | 89/100 — sirkulaer gauge |
| **Productivity Rhythm** | Bar chart — peak 9-11 AM |
| **Task Completion** | 91% rate |
| **Weekly Stats** | 14.5 timer fokustid, 27 tasks completed, 7-day streak |

### Feature-seksjoner (fra deep features)
1. **Smart Schedule** — AI-optimert dagsplan med energiflow-matching
2. **Task Intelligence** — Naturlig spraak-input, auto-parsing til strukturerte tasks
3. **Focus Mode** — Timer, nudges, ambient sounds, end-of-day summaries
4. **Insights** — Focus score, productivity rhythm, task completion trends, weekly progress

---

## 4. Integrasjoner og verktoy

| Verktoy | Bruk |
|---------|------|
| **Webflow** | CMS og hosting |
| **Wistia** | Video hosting (hero-video) |
| **Lenis** | Smooth scroll-bibliotek |
| **Google OAuth** | Sign-in/sign-up |
| **Webflow Forms** | Registreringsskjema |
| **CDN** | cdn.prod.website-files.com for alle assets |

### Tekniske detaljer
- Webflow IX2/IX3 animasjoner (`.w-mod-ix`, `.w-mod-ix3`)
- Tab-komponent for pricing (`.w-tabs`)
- Slider for testimonials (`.w-slider`)
- CSS custom properties brukt minimalt — mesteparten er Webflow-generert klasser
- Responsive: medium breakpoint collapse for nav

---

## 5. Hva gjoer OrbitAI visuelt unikt (vs "AI-slop")

### Det de gjoer riktig:
1. **Ekstrem fargerestriksjon** — kun svart + en blaa. Ingen gradienter, ingen multi-farger
2. **Atmosfaerisk dybde** — galaxy-bakgrunn, ellipse glow, partikler gir "romfart"-foelelse uten a vaere tacky
3. **Uvanlig stor body-tekst** (24px) — gir ro og lesbarhet, foeles premium
4. **Stagger-animasjoner overalt** — elementer glir inn sekvensielt, aldri alt pa en gang
5. **Dashboard som "hero-bilde"** — viser produktet i bruk, ikke generisk illustrasjon
6. **Alternerende feature-seksjoner** — bilde venstre/hoyre veksler, med live screenshots
7. **Focus timer som UI-element** — ikke bare beskrevet, men vist som interaktiv mockup
8. **Lenis smooth scroll** — silkemyk scrolling som foeles "premium"
9. **Pill-knapper med tydelig CTA-hierarki** — primary (blaa) vs secondary (outline)
10. **Social proof integrert naturlig** — "10K+ Active Users" som tynn stripe, ikke dominerende

### Det som er relevant for AK Golf:
- **En farge som aksent** (vi har allerede dette: #2D6A4F)
- **Dashboard-screenshot som markedsside-hero** — vis portalen i bruk
- **Stagger-animasjoner** pa kort og lister
- **Stor typografi med mye luft** — 24px body er overfoerbart
- **Feature-seksjoner med live screenshots** av portalen
- **Focus/insight-konseptet** mapper direkte til SG-analyse og AI-innsikt
- **Atmosfaerisk bakgrunn** — ikke galaxy, men subtile gradienter/glow pa morke seksjoner
