# Spillerportal — UI Kit

The **Spillerportalen** is AK Golf Group's flagship software product — a dark-mode-first dashboard for golfers to track their handicap, activity, sessions, putting, sleep and scoring analytics. The visual language is modeled on the SyncActive fitness dashboard, rebrand in AK Golf palette and Norwegian copy.

This kit is a faithful recreation of `brand-package/07-mockups/ak-golf-spillerportal.jsx`. It is split into small reusable components so the kit can be composed into new screens.

## Structure

```
index.html            ← the interactive dashboard (dark/light toggle, period pills)
components.jsx        ← low-level primitives (Dot, Pill, Card, Icon, etc.)
charts.jsx            ← WeekBars, CircleProgress, SignalBars, Gauge, WaterBars, SleepChart, HcpBar
TopNav.jsx            ← top bar with "ak" logo, tabs, theme toggle, avatar
Sidebar.jsx           ← 48px icon rail on the left
DashboardCards.jsx    ← the specific cards (Activities, Handicap, Putting, TrackMan…)
App.jsx               ← composes the full screen
```

## Interaction
- Toggle between dark and light themes (top-right sun/moon pill).
- Period pills inside the Activities card (`Uke · Måned · År · Totalt`) swap active state.
- Hero "Siste runde" card and "Aktiviteter" can be cycled with the overlay dropdown arrows.
- All hovers follow the brand rules: card darken/lighten, no scale transforms.

## Fidelity
- Pixel-close to the source JSX mockup.
- All copy in Norwegian bokmål.
- Emoji used exactly as in the mockup for inline data glyphs — swap for Lucide if you need multi-platform rendering.
