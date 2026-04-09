# AK Golf - Ferdige Prompts (Klar til Bruk)

## Ingen variabler. Ingen endringer nødvendig. Kopier og lim inn i Stitch.

---

## 1. LANDING PAGE

```
Create a premium landing page for AK Golf Academy.

HERO SECTION (Full viewport height):
- Background: Cinematic golf course photo, professional player mid-swing on green
- Left overlay gradient: linear-gradient(90deg, rgba(27,58,27,0.95) 0%, rgba(27,58,27,0.7) 50%, transparent 100%)
- Content positioned left, vertically centered

NAVIGATION (Fixed top, transparent → solid on scroll):
- Logo: "AK GOLF" - DM Sans 700, 24px, white
- Nav items: Hjem | Trenere ▼ | Medlemmer ▼ | Ressurser ▼ | Vår AI
  * Font: DM Sans 14px 500
  * Color: rgba(255,255,255,0.8)
  * Hover: #C8E846
- Right side:
  * Menu icon (hamburger)
  * Search icon
  * "Bli Medlem" button: #C8E846 bg, #1B3A1B text, 14px 600, 8px radius

HERO CONTENT (Left side, max-width 600px):
- Tagline pill: "Bli en del av vinnerlaget"
  * Background: rgba(255,255,255,0.1)
  * Border: 1px solid rgba(200,232,70,0.3)
  * Border-radius: 9999px
  * Padding: 8px 16px
  * Font: Inter 12px 500, white
  * Icon: Trophy left of text

- Headline: "Forbedre Ditt Golfspill"
  * Font: DM Sans 64px 700
  * Color: white
  * Line-height: 1.1
  * Margin-top: 24px

- Subheadline: "Lås opp ditt potensial og oppnå mestring på greenen med våre ekspertledede økter."
  * Font: Inter 18px 400
  * Color: rgba(255,255,255,0.8)
  * Line-height: 1.6
  * Margin-top: 16px

- Email signup:
  * Input: "Meld deg på nyhetsbrevet"
    - Background: rgba(255,255,255,0.1)
    - Border: 1px solid rgba(200,232,70,0.3)
    - Border-radius: 8px 0 0 8px
    - Padding: 16px 20px
    - Width: 280px
  * Button: "Meld på"
    - Background: rgba(255,255,255,0.2)
    - Border: 1px solid rgba(200,232,70,0.3)
    - Border-radius: 0 8px 8px 0
    - Padding: 16px 24px
    - Font: DM Sans 14px 600
    - Color: white

- Trust badges:
  * 4 small course photos in rounded rectangles (8px radius)
  * "50+ Eksklusive Golfbaner" badge
  * Star icon + "Få Fordelen med Elite Coaching"

RIGHT PANEL (Floating card, right side):
- Background: white
- Border-radius: 16px
- Padding: 24px
- Width: 320px
- Shadow: 0 20px 60px rgba(0,0,0,0.3)

- Header: "Daglig AK Golf"
  * Font: DM Sans 12px 500, uppercase
  * Color: #999

- Title: "Høynivå Økter For Produktive Utøvere 24/7"
  * Font: DM Sans 20px 600
  * Color: #1B3A1B
  * Line-height: 1.4

- CTA: "Planlegg din økt"
  * Background: #C8E846
  * Color: #1B3A1B
  * Full width
  * Padding: 16px
  * Border-radius: 8px
  * Font: DM Sans 14px 600
  * Margin-top: 16px

- Social proof:
  * 3 avatar circles (overlapping)
  * "Stolt av over 20 000 utøvere"
  * Font: Inter 12px, #666

- Pricing card:
  * "Abonnement" label
  * Tabs: Månedlig | Årlig -30% rabatt
  * "Månedlig" selected: #C8E846 bg pill
  * Price: "1 490 kr" large, "/måned" small
  * Features:
    - "22 Økter"
    - "Tilgang til alle baner"
    - "Sporing av fremgang"
  * Check icons in lime

FOOTER BAR (Bottom):
- Left: "Kontakt oss" + social icons
- Center: Partner logos (Nike Golf, TaylorMade, Titleist)
- Right: "E-post: post@akgolf.no"

RESPONSIVE:
- Mobile: Stack vertically, full-width panels
- Tablet: 2-column grid
- Desktop: Full layout as described
```

---

## 2. LOGIN / INNLOGGING

```
Create an elegant login screen for AK Golf Academy.

LAYOUT:
- Full height, dark green (#1B3A1B) background
- Split: Left 55% (image), Right 45% (form)
- Or: Centered card on dark background (mobile)

LEFT SIDE (Desktop):
- Full-bleed golf course image
- Overlay: linear-gradient(90deg, transparent 0%, rgba(27,58,27,0.9) 100%)
- Quote overlay (bottom-left):
  * "Jo hardere du trener, jo heldigere blir du."
  * Font: Playfair Display 24px italic, white
  * Attribution: "- Gary Player"

RIGHT SIDE (Form):
- Centered card:
  * Background: linear-gradient(135deg, rgba(45,74,45,0.95) 0%, rgba(27,58,27,0.9) 100%)
  * Border: 1px solid rgba(200,232,70,0.2)
  * Border-radius: 16px
  * Padding: 48px
  * Width: 420px
  * Backdrop-filter: blur(10px)

- Logo: "AK GOLF" (centered, top)
  * Font: DM Sans 32px 700
  * Color: white
  * Margin-bottom: 32px

- Title: "Velkommen Tilbake"
  * Font: DM Sans 28px 600
  * Color: white
  * Text-align: center

- Subtitle: "Logg inn for å fortsette din reise"
  * Font: Inter 14px 400
  * Color: rgba(255,255,255,0.6)
  * Text-align: center
  * Margin-bottom: 32px

- Email field:
  * Label: "EPOSTADRESSE" (uppercase, 12px, rgba(255,255,255,0.6))
  * Input: 
    - Background: rgba(255,255,255,0.1)
    - Border: 1px solid rgba(200,232,70,0.3)
    - Border-radius: 8px
    - Padding: 16px
    - Color: white
    - Placeholder: "din@epost.no"

- Password field:
  * Same as email
  * Label: "PASSORD"
  * Show/hide toggle icon (eye)

- Remember me + Forgot password row:
  * Checkbox: "Husk meg"
  * Link: "Glemt passord?" - #C8E846, right-aligned

- Sign In button:
  * Background: #C8E846
  * Color: #1B3A1B
  * Full width
  * Padding: 16px
  * Border-radius: 8px
  * Font: DM Sans 14px 600
  * Text: "LOGG INN"
  * Margin-top: 24px

- Divider: "ELLER"
  * Horizontal lines with text in center
  * Color: rgba(255,255,255,0.3)

- Social buttons:
  * "Fortsett med Google" - white bg, dark text, Google icon
  * "Fortsett med Apple" - white bg, dark text, Apple icon
  * Border-radius: 8px
  * Padding: 14px
  * Margin: 8px 0

- Sign up link:
  * "Har du ikke konto? Registrer deg"
  * "Registrer deg" in #C8E846
  * Text-align: center
  * Margin-top: 24px
```

---

## 3. SPILLER DASHBOARD

```
Create a player dashboard for AK Golf Academy.

LAYOUT:
- Full-screen dark green (#1B3A1B) background
- 3-column layout:
  * Left sidebar: 280px (navigation)
  * Center: Flexible (hull-kart)
  * Right: 400px (scorekort)

LEFT SIDEBAR:
- Background: rgba(15,31,15,0.95)
- Border-right: 1px solid rgba(200,232,70,0.1)
- Padding: 24px

- Logo: "AK GOLF" (top)
- User profile (bottom):
  * Avatar: 48px circle
  * Name: "Marcus Johansen"
  * Handicap: "HCP: 12,4"

- Navigation:
  * "The Open" - tournament badge (lime)
  * "St Andrews - Links" - course name
  * Divider line
  * Menu items:
    - Scorekort (active, lime accent)
    - Banekart
    - Analyse
    - Bag
    - Regler
  * Each with icon, white text, hover lime

- Bottom CTA: "NY RUNDE"
  * Background: #C8E846
  * Color: #1B3A1B
  * Full width
  * Border-radius: 8px
  * Padding: 16px

CENTER PANEL (Hull-kart):
- Background: linear-gradient(135deg, rgba(45,74,45,0.95) 0%, rgba(27,58,27,0.9) 100%)
- Border-radius: 16px
- Padding: 24px

- Header:
  * "Hull 4" - large, white
  * "PAR 4 • 385m" - secondary info
  * "AKTUELL" badge: lime bg, dark text

- Map area:
  * Top-down view of hole 4
  * Fairway: #4A7C4A
  * Green: #5A9A5A
  * Bunkers: #D4C4A8
  * Water: #4A7A9A (if applicable)
  * Rough: #3A5A3A
  * Your position: Yellow marker with pulse animation
  * Flag: White with red

- Distance markers:
  * "100m" | "150m" | "200m" circles

- Bottom stats:
  * "Kjøresti: 220m venstre"
  * "Vind: 12km/h SL"

RIGHT PANEL (Scorekort):
- Background: #F0ECD8 (paper texture)
- Border-radius: 8px
- Padding: 24px
- Font-family: Playfair Display

- Header:
  * "AK GOLF" - centered, elegant
  * "OFFISIELL KAMP SCOREKORT"
  * "The Old Course at St Andrews, 15.06.2025"

- Table:
  * Columns: HULL | PAR | LENGDE | SCORE | PUTTS | FAIRWAY | GIR
  * Rows 1-4 visible
  * Row 3 (current): Highlighted with lime tint
  * Handwritten-style numbers

- "Out Total" row
- Signature line: "Medspiller: [blank]"
- Player signature: "Marcus Johansen" (handwritten font)
- HCP: 12,4

- Bottom CTA: "AVSLUTT RUNDE"
  * Background: #C8E846
  * Color: #1B3A1B
  * Border-radius: 9999px (pill)
  * Padding: 16px 32px
  * Position: bottom-right of card

TOP BAR:
- Tabs: RUNDE | LEDERTAVLE | STATISTIKK
- Active: RUNDE (lime underline)
- Right icons: Del | Innstillinger | Profil
```

---

## 4. BOOKING - VELG TJENESTE

```
Create a booking flow for AK Golf Academy.

LAYOUT:
- Dark green (#1B3A1B) background
- Centered content, max-width 1200px
- Padding: 64px 32px

HEADER:
- "Book Din Økt" - DM Sans 48px 700, white, centered
- "Velg den perfekte coaching-opplevelsen for ditt spill" - Inter 16px, rgba(255,255,255,0.7), centered
- Margin-bottom: 48px

PROGRESS STEPS:
- 3 steps: Tjeneste → Trener → Bekreft
- Visual: Connected circles with lines
- Active step: Lime (#C8E846) fill
- Completed: Lime with checkmark
- Future: Outline only, rgba(255,255,255,0.3)
- Labels below each step

SERVICE CARDS (3-column grid):

CARD 1: Privatetime
- Background: linear-gradient(135deg, rgba(45,74,45,0.95) 0%, rgba(27,58,27,0.9) 100%)
- Border: 1px solid rgba(200,232,70,0.2)
- Border-radius: 16px
- Padding: 32px
- Hover: Border becomes lime, subtle lift

- Icon: Golf player silhouette (lime)
- Title: "Privatetime" - DM Sans 24px 600, white
- Description: "En-til-en coaching tilpasset dine spesifikke behov. Perfekt for fokusert forbedring." - Inter 14px, rgba(255,255,255,0.7)
- Duration: "60 eller 90 minutter" - small, rgba(255,255,255,0.5)
- Price: "Fra 1 200 kr" - DM Sans 32px 700, #C8E846
- Features:
  * "Personlig instruksjon"
  * "Videoanalyse inkludert"
  * "Treningsplan inkludert"
- "Velg" button: Outline style, lime border

CARD 2: Gruppeklinikk
- Same structure
- Icon: Multiple players
- Title: "Gruppeklinikk"
- Description: "Lær sammen med andre golfere. Flott for sosial læring."
- Duration: "120 minutter"
- Price: "Fra 600 kr"
- Features: "Små grupper (maks 6)", "Spesifikke fokusområder", "Sosial atmosfære"

CARD 3: Spillende Leksjon
- Same structure
- Icon: Flag on course
- Title: "Spillende Leksjon"
- Description: "Coaching på banen. Lær strategi og slagvalg i ekstern kamp."
- Duration: "9 eller 18 hull"
- Price: "Fra 2 500 kr"
- Features: "Banestrategi", "Slagvalg", "Mentalt spill"

FILTER TABS (above cards):
- "Alle" | "Nybegynner" | "Middels" | "Avansert"
- Active: Lime background pill
- Inactive: Transparent, white text

BOTTOM BAR (sticky):
- Background: rgba(15,31,15,0.95)
- Border-top: 1px solid rgba(200,232,70,0.2)
- Padding: 16px 32px
- Position: fixed bottom

- Left: "Valgt: Privatetime"
- Center: "1 200 kr"
- Right: "Fortsett" button (lime bg) + "Tilbake" link
```

---

## 5. SPILLER PROFIL

```
Create a player profile page for AK Golf Academy.

LAYOUT:
- Dark green (#1B3A1B) background
- 2-column: Left 300px (sticky sidebar), Right flexible

LEFT SIDEBAR:
- Position: sticky, top: 32px
- Background: linear-gradient(135deg, rgba(45,74,45,0.95) 0%, rgba(27,58,27,0.9) 100%)
- Border: 1px solid rgba(200,232,70,0.2)
- Border-radius: 16px
- Padding: 32px

- Avatar: 120px circle, border: 3px solid #C8E846
- Name: "Marcus Johansen" - DM Sans 24px 600, white
- Handle: "@marcusj" - Inter 14px, rgba(255,255,255,0.5)
- Badge: "Pro Medlem" - lime bg pill

- Stats row (3 columns):
  * "12,4" / "Handicap"
  * "47" / "Runder"
  * "23" / "Økter"

- Bio: "Aspirerende scratch-golfer. Jobber med kortspillet mitt."
- Location: "Oslo, Norge" with pin icon
- Member since: "Januar 2023"

- Buttons:
  * "Rediger Profil" - outline, lime border
  * "Del Profil" - text only, lime color

RIGHT CONTENT (sections):

SECTION 1: Ytelsesoversikt
- Background: panel style
- Title: "Ytelse" with "Se Detaljer →"
- 4 stat cards:
  * "Scoring Snitt" - 78,4 - "↓ 1,2 vs i fjor"
  * "Fairways Traff" - 68% - "↑ 5% vs i fjor"
  * "Green i Reg" - 62% - "↑ 3% vs i fjor"
  * "Putts per Runde" - 32,1 - "↓ 0,8 vs i fjor"
- Mini trend chart

SECTION 2: Nylige Runder
- Title: "Nylige Runder" + "Se Alle"
- List of 5 rounds (scorekort-style cards)
- Each: Dato | Bane | Score | Differensial
- Best score: Lime highlight
- "Last Opp Ny Runde" button

SECTION 3: Coaching Historie
- Timeline view
- Vertical line with dots
- Each session: Dato | Trener | Type | Notat forhåndsvisning

SECTION 4: Prestasjoner
- Badge grid (3x3)
- Unlocked: Full color
- Locked: Grayscale, 50% opacity

SECTION 5: Min Bag
- Tabs: Woods | Jern | Wedges | Putter
- List with brand/model
```

---

## 6. STATISTIKK / ANALYSE

```
Create a statistics dashboard for AK Golf Academy.

LAYOUT:
- Dark green (#1B3A1B) background
- Padding: 32px

HEADER:
- "Ytelsesanalyse" - 32px, white
- Date range selector: "Siste 30 Dager" dropdown
- "Eksporter Rapport" button: outline style

FILTER TABS:
- Oversikt | Scoring | Driving | Approach | Kortspill | Putting
- Active: Lime bg, dark text
- Inactive: Transparent, white text

MAIN CHART:
- Large panel
- Title: "Scoring Trend"
- Line chart:
  * Forest green line, 2px
  * Gradient fill below
  * Grid lines: subtle
  * Average line: Lime, dashed

STATS GRID (4 cards):
- Scoring Snitt: 78,4 (Forest Green)
- Konsistens: 3,2
- Forbedring: ↓ 1,8 (Lime)
- Runder: 8

DETAILED SECTIONS (accordion):
- Driving statistikk
- Approach statistikk
- Kortspill statistikk
- Putting statistikk

INSIGHTS:
- Card with lime left border
- "AI Innsikt" badge
- Personlig anbefaling
```

---

## 7. TRENER DASHBOARD

```
Create a coach dashboard for AK Golf Academy.

LAYOUT:
- Dark green (#1B3A1B) background
- Sidebar + main content

SIDEBAR:
- "Trener Portal" logo
- Navigation: Dashboard | Timeplan | Spillere | Notater | Analyse | Inntekter
- User profile at bottom

MAIN CONTENT:

HEADER:
- "Velkommen tilbake, Trener Hansen"
- "Du har 4 økter i dag"
- Quick actions: Blokker Tid | Legg Til Notat | Melding

DAGENS TIMEPLAN (priority):
- Panel with timeline
- 4 sessions listed
- Each: Tid | Spiller | Type | Sted | Action button

MINE SPILLERE:
- Grid of player cards
- Avatar, name, handicap
- Last session, next session
- Quick actions

NYLIGE NOTATER:
- List of recent session notes
- Player name, date, summary

METRICS:
- Økter denne måneden: 47
- Tilfredshet: 4,9/5
- Inntekt: 45 600 kr
```

---

## 8. BANEKART / GPS

```
Create an interactive course map for AK Golf Academy.

LAYOUT:
- Full-screen dark green
- Map takes center stage
- Overlays for info

MAP:
- Top-down view of golf course
- Full 18 holes visible
- Zoom and pan functionality
- Hole selection

VISUAL STYLE:
- Fairway: #4A7C4A
- Green: #5A9A5A
- Bunker: #D4C4A8
- Water: #4A7A9A
- Rough: #3A5A3A
- Trees: Dark green circles
- Cart path: Light gray line

HOLE INFO PANEL (click to open):
- Hull nummer
- Par
- Distanse
- Handicap indeks
- Aerial photo
- Tips fra proff

GPS MODE:
- Your position marker
- Distance to green
- Distance to hazards
- Club recommendation
```

---

## 9. MOBILE DASHBOARD

```
Create mobile dashboard for AK Golf Academy.

SPECIFICATIONS:
- Width: 390px
- Full Heritage styling
- Bottom navigation

HEADER:
- Hamburger menu
- "AK GOLF" logo
- Notification bell

CONTENT:
- Welcome message: "God morgen, Marcus"
- Weather widget: "Oslo | 8°C | Delvis skyet"
- Next session card (prominent):
  * "Neste Økt: Driver Fitting"
  * "I dag, 10:00"
  * "Trener: Andersen"
  * "Sjekk Inn" button

- Quick stats (horizontal scroll):
  * Handicap: 12,4
  * Siste Score: 78
  * Runder: 47

- Recent rounds list (3 items)

- Actions grid (2x2):
  * Book Økt | Se Stats
  * Melding | Last Opp

BOTTOM NAV:
- 5 icons: Hjem | Timeplan | Stats | Trener | Profil
- Active: Lime
- Height: 64px + safe area
```

---

## 10. LEDERTAVLE

```
Create a tournament leaderboard for AK Golf Academy.

LAYOUT:
- Dark green background
- Tournament header with image
- Filter tabs: Totalt | Etter Kategori | Etter Hull

LEADERBOARD TABLE:
- Position column (1, 2, 3...)
- Player name + avatar
- Country flag
- Score (relative to par)
- I dag column
- Gjennom column (holes played)

TOP 3 HIGHLIGHT:
- Special styling for 1st, 2nd, 3rd
- Gold, silver, bronze accents

PLAYER CARD (click to expand):
- Detailed stats
- Round breakdown
- Scorecard view
```

---

## 11. INNSTILLINGER

```
Create settings page for AK Golf Academy.

LAYOUT:
- Dark green background
- 2-column: Sidebar menu | Content area

SIDEBAR:
- Konto
- Varsler
- Personvern
- Utseende
- Betaling
- Hjelp

CONTENT SECTIONS:
- Profil innstillinger
- Passord endring
- E-post preferanser
- Push varsler
- Personvern innstillinger
- Tema (mørk/lys)
- Betalingsmetoder
- Abonnement detaljer

FORM ELEMENTS:
- Inputs with lime focus
- Toggle switches (lime when on)
- Save buttons (lime bg)
```

---

## 12. ONBOARDING / VELKOMMEN

```
Create onboarding flow for AK Golf Academy.

LAYOUT:
- Full-screen dark green
- 3-4 steps

STEP 1: Velkommen
- Large "AK GOLF" logo
- Tagline: "Løft Ditt Spill"
- "Kom Igang" button

STEP 2: Profil Oppsett
- Upload photo
- Enter name
- Set handicap
- Select home course

STEP 3: Preferanser
- What do you want to improve?
- How often do you play?
- Preferred coach style

STEP 4: Complete
- Welcome message
- "Start Din Reise" button
- Skip option to dashboard
```

---

## 13. VARSler / INNBOKS

```
Create notifications center for AK Golf Academy.

LAYOUT:
- Dark green background
- List of notifications

NOTIFICATION ITEMS:
- Icon (lime accent)
- Title
- Message preview
- Time
- Unread indicator

CATEGORIES:
- Alle | Økter | Sosialt | System

EMPTY STATE:
- "Ingen nye varsler"
- Bell icon
```

---

## 14. PRISING / MEDLEMSKAP

```
Create pricing page for AK Golf Academy.

LAYOUT:
- Dark green background
- Centered content

HEADER:
- "Velg Ditt Medlemskap"
- "Lås opp ditt fulle potensial"

PRICING CARDS (3):
- Starter: 129 kr/måned
- Pro (populær): 179 kr/måned
- Enterprise: 970 kr/måned

CARD STYLING:
- Dark panel with border
- Pro card: Lime border highlight
- "Populær" badge on Pro
- Feature list with checkmarks
- CTA button per card

FEATURES COMPARISON:
- Table below cards
- Checkmarks for included features
```

---

## 15. HJELP / STØTTE

```
Create help center for AK Golf Academy.

LAYOUT:
- Dark green background
- Search bar (prominent)
- Category cards

CATEGORIES:
- Komme Igang
- Booke Økter
- Registrere Scores
- Bruke Analyse
- Konto Innstillinger
- Kontakt Støtte

FAQ ACCORDION:
- Expandable questions
- Lime accent on open

CONTACT:
- Email form
- Live chat button
- Phone number
```

---

## 16. TURNERINGER / ARRANGEMENTER

```
Create tournaments page for AK Golf Academy.

LAYOUT:
- Dark green background
- Upcoming events list

EVENT CARD:
- Tournament image
- Name
- Date
- Location
- Entry fee
- "Meld På" button

TABS:
- Kommende | Påmeldt | Tidligere

DETAIL VIEW:
- Full tournament info
- Registration form
- Leaderboard (if live)
- Course info
```

---

## 17. KLUBBHUS / SAMFUNN

```
Create community page for AK Golf Academy.

LAYOUT:
- Dark green background
- Feed-style layout

SECTIONS:
- Aktivitet feed
- Grupper/Klubber
- Utfordringer
- Ledertavler

ACTIVITY CARD:
- User avatar
- Action (played round, booked session, etc.)
- Like/comment buttons

GROUPS:
- Group cards with member count
- Join button

CHALLENGES:
- Active challenges
- Progress bars
- Rewards
```

---

## 18. UTSTYR / BAG

```
Create equipment manager for AK Golf Academy.

LAYOUT:
- Dark green background
- Visual bag representation

BAG VIEW:
- 3D or 2D bag graphic
- Click slots to see clubs

CLUB DETAIL:
- Brand/model
- Specs (loft, length, shaft)
- Purchase date
- Rounds played
- Stats with this club

ADD CLUB:
- Form to add new club
- Brand selector
- Photo upload
```

---

## 19. VIDEO ANALYSE

```
Create video analysis page for AK Golf Academy.

LAYOUT:
- Dark green background
- Large video player

FEATURES:
- Upload swing video
- Side-by-side comparison
- Drawing tools (lines, angles)
- Slow motion
- Frame-by-frame
- Coach annotations
- Share with coach button
```

---

## 20. NY RUNDE - OPPSETT

```
Create new round setup page for AK Golf Academy.

LAYOUT:
- Dark green background
- Centered form

FORM:
- Select course (dropdown/search)
- Select tees (Herre | Dame | Senior)
- Select playing partners
- Select game type (Stroke play | Stableford | Match)
- Set wager (optional)
- Weather conditions
- Notes

- "Start Runde" button: Lime bg
- "Avbryt" link
```

---

## 21. RUNDE I GANG - SCORE REGISTRERING

```
Create score entry page for AK Golf Academy.

LAYOUT:
- Dark green background
- Simple, quick-entry focused

CURRENT HOLE:
- Large hole number
- Par
- Distance
- Your score (big, tappable)
- Putts
- Fairway hit (yes/no)
- GIR (yes/no)

NAVIGATION:
- Previous hole | Next hole
- Quick jump to any hole

SUMMARY:
- Running total
- vs par
- Points (if Stableford)
```

---

## 22. RUNDE OVERSIKT - ETTER SPILL

```
Create post-round summary for AK Golf Academy.

LAYOUT:
- Dark green background
- Scorekort display
- Stats summary

SCOREKORT:
- Full 18-hole card
- Highlights (birdies, eagles, etc.)

STATS:
- Fairways hit: X/14
- GIR: X/18
- Putts: XX
- Scrambling: X%
- Up & downs: X/X

SOCIAL:
- "Del Runde" button
- Upload photos
- Add notes/reflections

SAVE:
- "Lagre Runde" button: Lime bg
```

---

## 📝 BRUK I STITCH

1. Kopier hele prompten for skjermen du vil lage
2. Lim inn i Stitch
3. Generer skjermen
4. Ferdig! Ingen endringer nødvendig.

**Alle tekster er på norsk og klare til bruk!**
