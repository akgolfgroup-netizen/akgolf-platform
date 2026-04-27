# Claude Design — Oppdater AK Golf Design System

**Mål:** Oppdater **AK Golf Group Design System**-prosjektet (det med tokens, preview-sider, UI-kit) i Claude Design slik at det reflekterer alle låste regler og er emoji-fritt.

**Etter denne oppdateringen:** alt videre design-arbeid (skjermer, mockups, ny iterasjon) bygger på dette systemet automatisk via tokens.css.

---

## Lim inn denne prompten i AK Golf Design System-prosjektet

```
Oppdater hele AK Golf Group Design System til å reflektere de 12 låste
designreglene fra 2026-04-27. Mål: ingen emoji, ren brand, autoritativ
referanse for alle skjermer.

KJØR DISSE 7 ENDRINGENE:

1. EMOJI-RENSING (kritisk)
Fjern alle emoji fra hele prosjektet. Erstatt med Lucide-ikoner eller tekst.
- README.md: oppdater eksempler — bytt 🏌⏱📍❤👍⭐⚡ med tekst-beskrivelser
  ("flag-glyph", "timer", "map-pin" — uten emoji)
- preview/pills-badges.html: ⛳♥ → tekst eller fjern, bruk lucide-ikoner i stedet
- preview/iconography.html: behold "Emoji — ingen bruk i produkt" som
  advarsel, men fjern selve ✕-glyfen, bruk tekst "FORBUDT"
- ui_kits/spillerportal/DashboardCards.jsx: bytt 🏌🎯⏱📍❤ med
  <i data-lucide="flag-triangle-right">, <i data-lucide="target">,
  <i data-lucide="timer">, <i data-lucide="map-pin">, <i data-lucide="heart">
- ui_kits/spillerportal/TopNav.jsx: bytt ⛳♥📋☀🌙🔔🏌📊🎯⚙🔍📅🤖
  med tilsvarende lucide-ikoner
- ui_kits/spillerportal/layout.jsx: bytt ☀🌙⚡ med lucide sun/moon/zap

GODKJENT å beholde (Unicode affordance-glyphs):
▾ → ↗ ⋯ ✕ ● •

2. TOKENS (verifiser disse er korrekt i design-tokens.css)
--akgolf-primary: #005840
--akgolf-accent: #D1F843
--akgolf-surface: #ECF0EF
--akgolf-text: #324D45 (default body)
--akgolf-ink: #0A1F18 (kun headlines + KPI-tall)
--akgolf-muted: #A5B2AD
--akgolf-dark-bg: #0A1F18
--akgolf-card-dark: #0D2E23
--akgolf-card-light: #FFFFFF
--akgolf-success: #2A7D5A
--akgolf-warning: #C48A32
--akgolf-danger: #B84233

3. TYPOGRAFI
Inter 300-800. Aldri Inter Tight, aldri DM Sans.
Headlines: Inter 700-800, letter-spacing -0.03em (Bento-stil).
KPI-tall: Inter 600-700, tabular-nums.
Mono-labels: JetBrains Mono CAPS + 0.14em letter-spacing.

4. IKONER
Lucide via CDN: https://unpkg.com/lucide@latest
2px stroke, round line-cap, round joins.
Standardstørrelser: 14/16/18/20/24px.

5. LAYOUT-REGLER (verifiser i README.md)
- 8pt grid strikt
- Sidebar 48px ikon-rail, top nav 58px
- Max content 1400px desktop
- Mobile target: iPhone 15 Pro 390px
- Cards: 16px radius, 1px border (#1a4a3a dark / #e0e8e5 light) + soft shadow
- Glow én per view maks
- Distribusjon 60% primary+surface / 30% text+muted / 10% accent

6. PWA + DARK-FIRST
- Dark mode er primær, light mode er speilbilde
- Plattformen er PWA — alle sider responsive
- Sidebar → bunn-tab-nav under 768px

7. NORSK BOKMÅL
Alle eksempler, beskrivelser og tekst på bokmål.
Du-form, rolig skandinavisk tone, golf-flytenhet antas.
Aldri "amazing", "crush it", utropstegn i UI.

LEVER:
- Oppdatert tokens.css, design-tokens.css, design-tokens.json,
  tailwind-theme.js
- Alle 19 preview-sider rene (ingen emoji)
- UI-kit (spillerportal/) med Lucide-ikoner
- README.md oppdatert eksempel-seksjon
- Eksporter som ny handoff-bundle når ferdig
```

---

## Etter eksport

1. Send meg den nye bundle-URL-en (`api.anthropic.com/v1/design/h/...`)
2. Jeg pakker ut og erstatter `public/design-reference/ak-design-system/` med ren versjon
3. Verifiserer at emoji er fjernet via emoji-skriptet (mål: 0 instanser)
4. Oppdaterer canvas.html om nødvendig

Da er fundamentet rent og klar for videre design-arbeid.

---

## Hva som IKKE skjer i denne økten

- Skjermer (dashboard, booking, etc.) berøres ikke
- Andre bundles (claude-design, golf-talent-dashboard etc.) berøres ikke
- Kode i app/ berøres ikke
- Bare designsystemet i Claude Design oppdateres

---

## Estimert kost

$3-5 (én oppdatering, mange små endringer, ingen ny rendering).
