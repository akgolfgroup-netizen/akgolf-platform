# Claude Design — Emoji-rensing for alle bundles

**Status:** Mine egne filer er emoji-frie. Handoff-bundles fra Claude Design har totalt 231 emoji-instanser fordelt på 8 bundles.

**Strategi:** Anders renser ved kilden i Claude Design (alternativ A), ikke automatisk script-erstatning.

---

## Per-bundle emoji-omfang

| Bundle | Antall emojier | Prioritet |
|---|---|---|
| claude-design | 91 | Høy — primær kilde |
| golf-talent-dashboard | 50 | Medium |
| ak-design-system | 44 | Høy — autoritativ |
| markedsside | 27 | Medium |
| playerhq-bundle | 6 | Lav |
| treningsplanlegger | 5 | Lav |
| landing-v2 | 4 | Lav |
| sales-deck | 4 | Lav |

---

## Generell emoji-rensing-prompt (kjør i hvert prosjekt)

Lim inn denne i Claude Design for hvert prosjekt:

```
AK Golf Group brand-regelen er nå streng oppdatert: ingen emoji noe sted.
Alle eksisterende skjermer skal renses.

ERSTATT alle emoji med tilsvarende lucide-ikoner (eller ren tekst der
ikke applicable):

Navigasjon og UI:
- ⌂ → lucide "home"
- ☰ → lucide "menu"
- ⚑ → lucide "flag"
- ⌕ → lucide "search"
- ⚙ → lucide "settings"
- ⎈ → lucide "command" eller "anchor"
- ✉ → lucide "mail"
- 🔔 → lucide "bell"
- 🔍 → lucide "search"
- 🎤 → lucide "mic"

Status og handlinger:
- ✓ ✅ → lucide "check" eller "check-circle"
- ✗ ❌ → lucide "x" eller "x-circle"
- ⚠ → lucide "alert-triangle"
- ★ → lucide "star"
- ✦ → lucide "sparkles"

Sport og innhold:
- 🏌 → lucide "flag" (golf-flagg)
- ⛳ → lucide "flag-triangle-right"
- 🎯 → lucide "target"
- 📊 → lucide "bar-chart-3"
- 📈 → lucide "trending-up"
- 📝 → lucide "edit-3"
- 📅 → lucide "calendar"
- 📋 → lucide "clipboard-list"
- 📍 → lucide "map-pin"
- ❤ ♥ → lucide "heart"
- ⏱ → lucide "timer"
- ⚡ → lucide "zap"
- ☀ → lucide "sun"
- 🌙 → lucide "moon"
- 🤖 → lucide "bot"
- 🆕 → tekst "Ny" (ikke ikon)
- 👍 → lucide "thumbs-up"
- ⛰ → lucide "mountain"

Tastatur-shortcuts:
- ⌘ → tekst "Cmd"
- ⌘K → "Cmd K"

BEHOLD som godkjente affordance-symboler (per ak-design-system spec):
- ▾ (dropdown)
- → ↗ (link/external)
- ⋯ (more menu)
- ✕ (dismiss/close i UI-knapp)
- ● • (status dot)

Eksporter som ny handoff-bundle når du er ferdig.
```

---

## Rekkefølge på rensing

1. **ak-design-system** først — autoritativ, må være ren før vi adopterer i kode
2. **claude-design** (AK Golf Portal) — primærkilde for spillerportal
3. **markedsside** — markedsside + booking V2
4. **playerhq-bundle, treningsplanlegger, landing-v2, sales-deck** — kun 4-6 hver, raskt
5. **golf-talent-dashboard** — kan vente til vi rocker det inn i CoachHQ

---

## Etter emoji-rensing

For hvert renset bundle:
1. Eksporter handoff-bundle fra Claude Design
2. Send URL til meg ("Fetch this design file...")
3. Jeg pakker ut og erstatter den eksisterende mappen i `public/design-reference/<bundle>/`
4. Verifiserer at emoji er borte med samme script

---

## Beholdt regel: emoji er DEPRECATED for AK Golf

Denne regelen er nå låst i:
- `docs/decisions/003_final_design_2026.md` regel 6
- `~/.claude/CLAUDE.md` (din globale)
- `CLAUDE.md` (prosjekt-rot)
- `public/design-reference/ak-design-system/project/README.md` (autoritativ spec)

Aldri emojier i ny kode, nye mockups eller markedsmateriell. Lucide-ikoner alltid.
