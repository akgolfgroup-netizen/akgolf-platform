# AK Golf - Stitch Prompts for Mission Board / Dashboard
## Komplett skjermoversikt med detaljerte design-prompts

> Basert på UI/UX Design Trends 2026 fra Skyrye Design
> Stil: AI-drevet personalisering, Bento-grid layouts, Glassmorphism, Mikro-interaksjoner

---

## DEL 1: FUNKSJONER OG MENY-OVERSIKT

### A. ELEV/SPILLER SEKSJON (Hovednavigasjon)

| # | Meny-Punkt | Path | Hovedfunksjon |
|---|------------|------|---------------|
| 1 | **Oversikt** | `/portal` | Dashboard med widgets, snarveier, status |
| 2 | **Mine Bookinger** | `/portal/bookinger` | Liste over kommende og tidligere bookinger |
| 3 | **Treningsplan** | `/portal/treningsplan` | AI-generert periodisert treningsplan |
| 4 | **Treningsdagbok** | `/portal/dagbok` | Loggføring av egne treninger |
| 5 | **Statistikk** | `/portal/statistikk` | Strokes Gained, handicap, runder |
| 6 | **Kalender** | `/portal/kalender` | Timeplan og booking-visning |

### B. TRENING SEKSJON (Undermeny)

| # | Meny-Punkt | Path | Hovedfunksjon |
|---|------------|------|---------------|
| 7 | **Trackman Tester** | `/portal/trening/tester` | Test-protokoller og resultater |
| 8 | **Øvelser** | `/portal/trening/ovelser` | Øvelsesbibliotek med instruksjoner |

### C. KONTO SEKSJON (Undermeny)

| # | Meny-Punkt | Path | Hovedfunksjon |
|---|------------|------|---------------|
| 9 | **Profil** | `/portal/profil` | Personlig info, mål, abonnement |
| 10 | **Historikk** | `/portal/coaching-historikk` | Tidligere coaching-økter |

### D. ADMIN/INSTRUKTØR SEKSJON (Mission Board + Admin)

| # | Meny-Punkt | Path | Hovedfunksjon |
|---|------------|------|---------------|
| 11 | **Mission Board** | `/portal/admin/mission-board` | Hoveddashboard for instruktører |
| 12 | **Kalender (Admin)** | `/portal/admin/kalender` | Administrasjon av timeplan |
| 13 | **Bookinger (Admin)** | `/portal/admin/bookinger` | Oversikt og håndtering av bookinger |
| 14 | **Fasiliteter** | `/portal/admin/fasiliteter` | Styringsverktøy for fasiliteter |
| 15 | **Elever** | `/portal/admin/elever` | Elevliste og detaljer |
| 16 | **Tilgjengelighet** | `/portal/admin/tilgjengelighet` | Sette tilgjengelige tidsluker |
| 17 | **Kapasitet** | `/portal/admin/kapasitet` | Kapasitetsplanlegging og analyse |
| 18 | **Analyse** | `/portal/admin/analytics` | KPI, inntekt, elevmetrikk |
| 19 | **Denne uken** | `/portal/admin/denne-uken` | Ukesoversikt for instruktører |
| 20 | **Turneringer** | `/portal/admin/turneringer` | Turneringsstyring |
| 21 | **Notifikasjoner** | `/portal/admin/notifications` | System for varsler |

### E. ANDRE SKJERMER (Sub-pages)

| # | Skjerm | Path | Beskrivelse |
|---|--------|------|-------------|
| 22 | Ny Booking (Admin) | `/portal/admin/bookinger/ny` | Opprette ny booking |
| 23 | Elev Detaljer | `/portal/admin/elever/[id]` | Profil for spesifikk elev |
| 24 | Ny Aktivitet | `/portal/admin/fasiliteter/ny-aktivitet` | Legge til fasilitet-aktivitet |
| 25 | Endre Booking | `/portal/bookinger/[id]/endre` | Reschedule/cancel |
| 26 | AI Assistent | `/portal/admin/ai-assistent` | AI-chat for instruktører |
| 27 | E-postmaler | `/portal/admin/e-postmaler` | Mal-editor |
| 28 | Meldinger | `/portal/admin/meldinger` | Unified inbox |
| 29 | Godkjenninger | `/portal/admin/godkjenninger` | Booking-godkjenninger |
| 30 | Økter | `/portal/admin/okter` | Coaching-økt administrasjon |
| 31 | Økonomi | `/portal/admin/okonomi` | Finansiell oversikt |
| 32 | Rapporter | `/portal/admin/rapporter` | Rapportgenerering |

---

## DEL 2: STITCH PROMPTS FOR HVER SKJERM

### STILRETNINGSLINJER (Gjelder alle skjermer)

```
FARGER:
- Primær: #2D6A4F (AK Golf grønn)
- Sekundær: #1D1D1F (Mørk / nærmest svart)
- Bakgrunn: #FDF9F0 (Varm off-white)
- Mørk modus: #0A0D0A (Nesten svart)
- Accent: #D2F000 (Neon-lime for highlights)
- AI-elementer: #AF52DE (Lilla, aldri grønn)
- Suksess: #34C759
- Advarsel: #FF9500
- Feil: #FF3B30

TYPOGRAFI:
- Font: Manrope (variabel)
- H1: 3.5rem, weight 700, tracking -0.03em
- H2: 2.5rem, weight 700, tracking -0.025em
- Body: 1rem, weight 400

KOMPONENTER:
- Knapper: Pill-form (border-radius: 980px)
- Cards: Radius 20px, border 1px #E8E8ED
- Header: 48px, glassmorphism (blur)
- Sidebar: 220px, hvit bakgrunn

ANIMASJONER:
- Framer Motion for alle transisjoner
- Hover: 300ms+ delay, aldri brå
- Scroll-animasjoner: RevealOnScroll
- Mikro-interaksjoner på alle klikkbare elementer

LAYOUT:
- Bento-grid med varierende kortstørrelser
- Aldri identiske grids
- Glassmorphism på overlappende elementer
- Prediktiv UI som tilpasser seg brukeratferd
```

---

### SKJERM 1: OVERSIKT (Elev Dashboard)

**PROMPT:**
```
Create a premium golf player dashboard homepage for AK Golf Academy called "Oversikt". 
Design a bento-grid layout with varying card sizes that adapts to user behavior.

LAYOUT STRUCTURE:
- Top section: Welcome greeting with player name and subscription tier badge
- Bento grid with 6-8 cards of different sizes:
  * Large card: Next upcoming booking with countdown timer and instructor photo
  * Medium card: Weekly training plan preview with progress ring (circular progress indicator)
  * Medium card: Recent statistics sparkline showing handicap trend
  * Small card: Quick action buttons (Book tid, Logg trening, Se statistikk)
  * Small card: Achievement/badge showcase with animated unlock states
  * Wide card: AI-generated weekly insight with personalized recommendation
  * Small card: Calendar preview with next 3 events

VISUAL STYLE:
- Warm off-white background (#FDF9F0)
- Cards with subtle shadows, 20px border-radius
- AK Golf green (#2D6A4F) as primary accent on active elements
- Glassmorphism effect on floating elements
- Smooth Framer Motion animations on page load (staggered card reveal)

INTERACTIONS:
- Cards have subtle hover lift effect (scale 1.02, shadow increase)
- Progress rings animate on scroll into view
- Sparkline charts show data on hover
- Quick actions have magnetic button effect
- AI insight card has typing animation effect for text

DATA VISUALIZATION:
- Circular progress indicators for weekly goals
- Mini sparkline charts for trends
- Color-coded status badges (confirmed=green, pending=yellow)

RESPONSIVE:
- Grid collapses to single column on mobile
- Cards maintain aspect ratio relationships
- Touch-friendly tap targets (min 44px)

GOLF-SPECIFIC ELEMENTS:
- Weather widget for home course
- Handicap index prominently displayed
- Strokes gained summary ( Putting, Approach, Driving)
- Next tee time with course info
```

---

### SKJERM 2: MINE BOOKINGER

**PROMPT:**
```
Create a booking management screen for golf coaching sessions called "Mine Bookinger".
Design with a timeline/list hybrid approach with AI-driven sorting.

LAYOUT STRUCTURE:
- Header with title and "Ny Booking" CTA button (pill-shaped, AK green)
- Filter tabs: Kommende, Tidligere, Alle
- Timeline view of bookings grouped by month
- Each booking card shows:
  * Date and time with visual timeline connector
  * Instructor avatar and name
  * Service type with icon (individual, group, simulator)
  * Status badge with pulse animation for confirmed
  * Location/facility
  * Action buttons (Endre, Avbestill, Se detaljer)

VISUAL STYLE:
- Timeline with vertical line connecting bookings
- Cards with left border accent color-coded by status
- Subtle background color alternating between months
- Empty state with illustration and CTA when no bookings

INTERACTIONS:
- Swipe gestures on mobile for quick actions
- Pull-to-refresh with custom golf ball spinner animation
- Booking cards expand on tap to show full details
- Smooth slide animations when filtering
- Confirmation modal with blur backdrop for cancellations

STATES:
- Confirmed: Green left border, checkmark icon
- Pending: Yellow border, clock icon with subtle pulse
- Cancelled: Red border with strikethrough text
- Completed: Grey border, trophy icon

AI ELEMENTS:
- "Smart suggestions" section showing optimal next booking times
- Personalized recommendation based on training plan
- Predictive text for booking search

RESPONSIVE:
- Timeline converts to simple list on mobile
- Action buttons become icon-only on narrow screens
```

---

### SKJERM 3: TRENINGSPLAN

**PROMPT:**
```
Create an AI-powered training plan dashboard for golfers called "Treningsplan".
Design with a periodization visualization and weekly focus modules.

LAYOUT STRUCTURE:
- Header with plan title and edit/generate buttons
- Periodization timeline showing training phases (Preparation, Competition, Transition)
- Current week highlighted with expanded view
- Weekly cards in a horizontal scrollable row:
  * Week number and date range
  * Focus area icon (Putting, Driving, Approach, etc.)
  * Session count and total duration
  * Completion percentage
- Detailed weekly breakdown with daily sessions
- AI insight panel with personalized tips

VISUAL STYLE:
- Training phases color-coded (Preparation=blue, Competition=green, Transition=orange)
- Weekly cards with progress visualization
- Session cards with exercise icons and duration
- Glassmorphism on floating AI assistant button

INTERACTIONS:
- Horizontal swipe/scroll between weeks
- Tap week to expand full details
- Sessions can be marked complete with satisfying check animation
- Drag to reorder sessions within a week
- AI button expands to chat interface

DATA VISUALIZATION:
- Progress bars for each training block
- Radar chart showing skill focus distribution
- Weekly volume chart (time/distance)

AI FEATURES:
- "Generate plan" button triggers AI with loading animation
- Adaptive recommendations based on completion rates
- Weakness analysis integration
- Predictive adjustments based on tournament schedule

GOLF ELEMENTS:
- Shot type icons (driver, iron, putter, wedge)
- Course-specific practice recommendations
- Weather integration for outdoor sessions
```

---

### SKJERM 4: TRENINGSDAGBOK

**PROMPT:**
```
Create a training log/journal for golfers called "Treningsdagbok".
Design with a calendar-meets-journal interface with rich media support.

LAYOUT STRUCTURE:
- Dual view toggle: Kalender (calendar) vs Liste (list)
- Calendar view: Month grid with activity indicators
- List view: Chronological feed of training sessions
- "Logg ny trening" floating action button (FAB)
- Each log entry shows:
  * Date and duration
  * Training type icon
  * Intensity indicator (color-coded dots)
  * Brief notes preview
  * Photo/video thumbnails if attached
  * Comments from coach

VISUAL STYLE:
- Calendar with activity heat map (darker = more activity)
- Training type icons (range, putting, short game, on-course)
- Intensity: Low (green), Medium (yellow), High (red)
- Card-based feed with rich media previews

INTERACTIONS:
- Tap date in calendar to see/filter that day's logs
- Long press on FAB for quick-log options
- Swipe entries for edit/delete
- Expandable cards for full session details
- Photo gallery with pinch-to-zoom

FORMS:
- Quick log: Type, duration, intensity, notes
- Detailed log: Add drills, shots hit, scores, feels
- Photo/video attachment with preview
- Tag system for easy filtering

AI FEATURES:
- Auto-suggest tags based on notes
- Sentiment analysis of training notes
- Pattern recognition across sessions
- Insights: "You've practiced putting 3x more than driving"

SOCIAL ELEMENTS:
- Coach comments with notification badges
- Share achievements (personal bests)
```

---

### SKJERM 5: STATISTIKK

**PROMPT:**
```
Create a comprehensive golf statistics dashboard called "Statistikk".
Design with Strokes Gained analytics and performance trends.

LAYOUT STRUCTURE:
- KPI header row with key metrics:
  * Current Handicap (large, prominent)
  * Strokes Gained Total
  * Rounds played (this month/season)
  * Trend indicator (improving/declining)
- Main content tabs: Oversikt, Strokes Gained, Runder, Sammenligning
- Oversikt tab:
  * Radar chart showing 5 skill areas
  * Recent rounds list with scores
  * Trend sparklines for each skill
- Strokes Gained tab:
  * Bar chart comparing to scratch golfer
  * Breakdown by category (Driving, Approach, Short Game, Putting)
  * Historical trend line

VISUAL STYLE:
- Dark mode friendly chart colors
- Data-rich but clean layout
- Color coding: Positive (green), Negative (red), Neutral (gray)
- Smooth chart animations on data load

DATA VISUALIZATION:
- Radar/spider chart for skill balance
- Stacked bar charts for SG breakdown
- Line charts for trends over time
- Heat map for scoring by hole type
- Scatter plot for driving distance vs accuracy

INTERACTIONS:
- Tap chart segments for detailed breakdown
- Pinch to zoom on trend charts
- Swipe between time periods (week/month/season/year)
- Drill down from summary to specific rounds

BENCHMARKING:
- Compare to handicap peers
- PGA Tour averages as reference lines
- Progress indicators toward goals

AI FEATURES:
- "Focus area" recommendation based on SG analysis
- Predicted handicap trajectory
- Weakness identification with drill suggestions
```

---

### SKJERM 6: KALENDER

**PROMPT:**
```
Create a golf-focused calendar interface called "Kalender".
Design with multiple view modes and booking integration.

LAYOUT STRUCTURE:
- View toggle: Måned, Uke, Dag, Liste
- Header with current month/year and navigation
- Booking overlay on calendar grid
- Color-coded events:
  * Booked lessons (AK green)
  * Personal practice (blue)
  * Tournaments (orange)
  * Availability windows (light gray)
- Sidebar with upcoming events list

VISUAL STYLE:
- Clean calendar grid with ample spacing
- Events as rounded pills within day cells
- Current day highlighted
- Weekends slightly different background
- Time slots in day/week view as horizontal bars

INTERACTIONS:
- Tap empty slot to start booking flow
- Drag to create multi-day events
- Long press for context menu
- Swipe to change months/weeks
- Pinch to zoom in day view

BOOKING INTEGRATION:
- "Book tid" button in empty slots
- Visual availability indicators
- Conflicting events highlighted
- Sync indicators (Google Calendar, etc.)

VIEWS:
- Month: Overview with event dots
- Week: Detailed time slots
- Day: Full schedule with 15-min increments
- List: Chronological upcoming events

NOTIFICATIONS:
- Upcoming lesson reminders
- Practice schedule alerts
- Tournament registration deadlines
```

---

### SKJERM 7: TRACKMAN TESTER

**PROMPT:**
```
Create a Trackman testing interface for golfers called "Trackman Tester".
Design with test protocols and result tracking.

LAYOUT STRUCTURE:
- Available tests grid:
  * Driver test
  * Iron consistency test
  * Wedge distance control
  * Putting test
- Each test card shows:
  * Icon representing test type
  * Difficulty level
  * Estimated duration
  * Last score/completion
  * Personal best
- Results history section
- Leaderboard/comparison

VISUAL STYLE:
- Card-based grid for test selection
- Progress rings showing improvement
- Data tables for detailed results
- Graphs showing trends over time
- Color coding by performance tier

INTERACTIONS:
- Tap test to start or view instructions
- Swipe through test history
- Expand cards for detailed metrics
- Share results button
- "Start test" prominent CTA

TEST INTERFACE:
- Live shot input screen
- Real-time statistics display
- Shot-by-shot entry
- Completion celebration animation

METRICS DISPLAYED:
- Club speed, ball speed, smash factor
- Launch angle, spin rate, peak height
- Carry distance, total distance
- Dispersion pattern visualization
- Consistency scores

HISTORY:
- Chronological test results
- Improvement indicators (trending up/down)
- Side-by-side comparison between tests
- Export to PDF option
```

---

### SKJERM 8: ØVELSER

**PROMPT:**
```
Create a golf exercise/drill library called "Øvelser".
Design with categorized drills and video integration.

LAYOUT STRUCTURE:
- Search bar with filters (Kategori, Vanskelighet, Varighet)
- Category tabs: Driving, Approach, Short Game, Putting, Mental
- Exercise cards grid:
  * Thumbnail image/video
  * Title and brief description
  * Difficulty badges (Beginner, Intermediate, Advanced)
  * Duration estimate
  * Equipment needed icons
  * "Add to plan" button
- Featured/recommended section

VISUAL STYLE:
- Grid layout with card-based exercises
- Video thumbnails with play button overlay
- Filter pills/tags for quick filtering
- Expandable cards for full instructions
- Progress tracking indicators

INTERACTIONS:
- Tap card to view full exercise details
- Video plays inline or expands
- Swipe to mark as completed
- Favorite/bookmark exercises
- Add to training plan with one tap

EXERCISE DETAIL VIEW:
- Full-screen video player
- Step-by-step instructions
- Common mistakes section
- Tips from coaches
- Related exercises

FILTERING:
- Multi-select categories
- Difficulty slider
- Equipment filter (med/uten ball, med/uten klubbe)
- Focus area filter (distance, accuracy, consistency)

PERSONALIZATION:
- "Recommended for you" based on weaknesses
- Recently viewed
- Most popular in academy
- Coach-assigned exercises highlighted
```

---

### SKJERM 9: PROFIL

**PROMPT:**
```
Create a player profile screen called "Profil".
Design with personal info, goals, and subscription management.

LAYOUT STRUCTURE:
- Profile header:
  * Large avatar with edit option
  * Name and member since date
  * Subscription tier badge (Academy/Starter/Pro/Elite)
  * Handicap index display
- Tab navigation: Info, Mål, Abonnement, Innstillinger
- Info tab: Personal details, contact, preferences
- Mål tab: Goal setting and progress
- Abonnement tab: Plan details, billing, upgrade options

VISUAL STYLE:
- Clean, personal feel
- Avatar with ring indicating tier color
- Cards for different sections
- Progress visualization for goals
- Subscription cards with feature comparison

INTERACTIONS:
- Tap to edit any field
- Avatar upload with crop/preview
- Goal progress sliders
- Subscription upgrade flow
- Notification preferences toggles

GOALS SECTION:
- Handicap goals with timeline
- Skill-specific goals
- Tournament goals
- Achievement badges grid
- Goal completion celebrations

SUBSCRIPTION:
- Current plan highlight
- Feature checklist
- Upgrade/downgrade options
- Billing history
- Payment methods

SETTINGS:
- Notification preferences
- Privacy settings
- Connected accounts (Google Calendar, etc.)
- Language preference
- Help & support links
```

---

### SKJERM 10: HISTORIKK (Coaching Historikk)

**PROMPT:**
```
Create a coaching session history screen called "Coaching Historikk".
Design with session timeline and AI-generated summaries.

LAYOUT STRUCTURE:
- Timeline view of all coaching sessions
- Each session card:
  * Date and instructor
  * Session type (individual, group, video analysis)
  * AI-generated summary excerpt
  * Key takeaways/tags
  * Attachments (videos, notes)
  * Homework/assignments
- Filter by: Dato, Instruktør, Type
- Search through session notes

VISUAL STYLE:
- Vertical timeline with connecting line
- Cards with left border color by session type
- Collapsible AI summaries
- Video thumbnails with duration
- Tag chips for quick filtering

INTERACTIONS:
- Tap to expand full session details
- Video player modal
- Swipe to add notes
- Share summary button
- Download attachments

AI SUMMARIES:
- Auto-generated session recap
- Key improvement areas highlighted
- Suggested next steps
- Comparison to previous sessions
- Progress tracking over time

SESSION DETAILS:
- Full transcription/notes
- Video analysis segments
- Trackman data if applicable
- Coach feedback
- Player self-assessment
- Goals set during session

INSIGHTS:
- Coaching frequency chart
- Improvement trajectory
- Most discussed topics word cloud
- Recommended next session type
```

---

### SKJERM 11: MISSION BOARD (Admin Dashboard)

**PROMPT:**
```
Create a mission control dashboard for golf instructors called "Mission Board".
Design with real-time metrics, alerts, and quick actions in a bento-grid layout.

LAYOUT STRUCTURE:
- Header: "Mission Board" with neon-lime accent on "Mission"
- Subtitle: "Komplett oversikt over AK Golf Academy"
- Quick Actions row (4 buttons):
  * Ny Booking (primary, lime green)
  * Send Melding (dark green)
  * Ny Elev (dark green)
  * Rapport (dark green)
- Stats Grid (4 cards):
  * Dagens Bookinger (with trend indicator)
  * Aktive Sesjoner
  * Dagens Inntekt
  * Nye Elever (uke)
- Summary cards row (3 cards):
  * Ukens bookinger count
  * Ukens inntekt
  * Avbestillinger i dag
- Main content split:
  * Left (2/3): Dagens Timeplan with timeline
  * Right (1/3): Varsler panel

VISUAL STYLE:
- Dark mode interface (#0A0D0A background)
- Neon lime (#D2F000) as primary accent
- Cards with subtle borders and glow on hover
- Glassmorphism on alerts panel
- Real-time indicator pulsing dot

INTERACTIONS:
- Cards have lift effect on hover
- Refresh button with spinning animation
- Auto-refresh every 5 minutes with subtle indicator
- Quick action buttons have satisfying press state
- Timeline items expandable

DATA VISUALIZATION:
- Sparklines on stat cards
- Trend indicators (up/down arrows with percentages)
- Status badges with pulse animation
- Color coding: Green (good), Yellow (warning), Red (alert)

ALERTS PANEL:
- Warning alerts with yellow styling
- Success alerts with green
- Info alerts with blue
- Timestamp for each alert
- Dismissible alerts

TODAY'S SCHEDULE:
- Timeline with time slots
- Student names with service type
- Instructor assignment
- Status badges (Bekreftet, Venter, etc.)
- Link to full calendar
```

---

### SKJERM 12: ADMIN KALENDER

**PROMPT:**
```
Create an instructor calendar management screen called "Kalender (Admin)".
Design with availability setting and booking overview.

LAYOUT STRUCTURE:
- Calendar grid (month/week/day views)
- Availability toggle sidebar
- Booking requests panel
- Color-coded events:
  * Confirmed bookings (solid green)
  * Pending requests (striped yellow)
  * Blocked time (gray)
  * Personal events (blue)
- Quick block/unblock time slots

VISUAL STYLE:
- Clean calendar with ample white space
- Drag-to-select for bulk actions
- Time slot granularity (15/30/60 min)
- Visual distinction between lesson types
- Today highlight

INTERACTIONS:
- Click empty slot to set availability
- Drag to create availability window
- Right-click for context menu
- Bulk edit mode
- Sync status indicators

AVAILABILITY SETTING:
- Recurring patterns (weekly templates)
- One-off adjustments
- Buffer time between lessons
- Max lessons per day setting
- Seasonal templates

BOOKING MANAGEMENT:
- Incoming requests queue
- One-click confirm/decline
- Reschedule with drag-drop
- Student notes visible on hover
- Conflict warnings

INTEGRATIONS:
- Google Calendar sync status
- iCal feed management
- Multiple instructor views
- Facility/room booking
```

---

### SKJERM 13: ADMIN BOOKINGER

**PROMPT:**
```
Create a booking management interface for instructors called "Bookinger (Admin)".
Design with list view and detailed booking cards.

LAYOUT STRUCTURE:
- Filter bar: Dato, Instruktør, Type, Status
- View toggle: Liste, Kalender, Tabell
- Booking cards list:
  * Student name and photo
  * Date/time with countdown
  * Service type with icon
  * Instructor (if multi-instructor)
  * Status badge
  * Payment status
  * Action buttons (Bekreft, Avlys, Endre)
- Bulk actions bar

VISUAL STYLE:
- List with clear hierarchy
- Status colors: Green (confirmed), Yellow (pending), Red (cancelled)
- Payment badges: Paid, Pending, Refunded
- Priority sorting (today first)
- Search bar with filters

INTERACTIONS:
- Swipe actions on mobile
- Bulk select with checkboxes
- Expand for full details
- Inline editing for quick changes
- Drag to reschedule

BOOKING DETAILS MODAL:
- Full student info
- Service details
- Payment history
- Notes/communication history
- Related bookings
- Cancel with reason

FILTERS:
- Date range picker
- Instructor dropdown
- Service type checkboxes
- Status multi-select
- Payment status

ACTIONS:
- Export to CSV
- Print schedule
- Send reminders
- Bulk confirm
- Generate invoice
```

---

### SKJERM 14: FASILITETER

**PROMPT:**
```
Create a facility management screen called "Fasiliteter".
Design with resource booking and activity scheduling.

LAYOUT STRUCTURE:
- Facility cards grid:
  * Driving range
  * Putting green
  * Simulator rooms
  * Short game area
- Each card shows:
  * Current status (Ledig/Occupied)
  * Next booking countdown
  * Today's schedule preview
  * Equipment status
- Activity management section
- Settings/innstillinger link

VISUAL STYLE:
- Card grid with status indicators
- Real-time occupancy dots
- Photo thumbnails of each facility
- Equipment checklists
- Booking calendar integration

INTERACTIONS:
- Tap to view facility details
- Book facility time
- Check equipment status
- Report issues
- View maintenance schedule

FACILITY DETAILS:
- Photo gallery
- Capacity information
- Equipment list
- Operating hours
- Rules/guidelines
- Upcoming maintenance

ACTIVITY MANAGEMENT:
- Create new activities
- Manage registrations
- Waitlist handling
- Capacity tracking
- Instructor assignments

SETTINGS:
- Operating hours
- Booking rules
- Equipment inventory
- Maintenance schedules
- Access controls
```

---

### SKJERM 15: ELEVER (Student List)

**PROMPT:**
```
Create a student management list called "Elever".
Design with searchable directory and student cards.

LAYOUT STRUCTURE:
- Search bar with filters
- View toggle: Grid, Liste, Tabell
- Student cards showing:
  * Profile photo/avatar
  * Name and contact info
  * Current handicap
  * Subscription tier badge
  * Last session date
  * Next booking
  * Progress indicator
- Quick action buttons per student

VISUAL STYLE:
- Card grid with hover effects
- Tier color coding (Academy, Starter, Pro, Elite)
- Handicap trend indicators
- Activity status (active, dormant, new)
- Alphabetical quick-jump

INTERACTIONS:
- Tap to view full profile
- Swipe for quick actions
- Bulk select mode
- Sort by various columns
- Expand for quick preview

STUDENT PROFILE SUMMARY:
- Contact information
- Handicap history sparkline
- Recent sessions list
- Upcoming bookings
- Notes/flags
- Communication history

FILTERS:
- Handicap range
- Subscription tier
- Instructor assignment
- Activity status
- Join date range

ACTIONS:
- Send message
- Schedule lesson
- View statistics
- Edit profile
- Export data
```

---

### SKJERM 16: TILGJENGELIGHET

**PROMPT:**
```
Create an availability management screen called "Tilgjengelighet".
Design with weekly schedule templates and quick adjustments.

LAYOUT STRUCTURE:
- Week view with time slots
- Availability blocks (drag to create)
- Recurring pattern templates
- Exception dates list
- Copy week to future weeks
- Buffer settings panel

VISUAL STYLE:
- Calendar grid with time on Y-axis
- Available slots in green
- Blocked time in gray
- Booked slots with student initials
- Drag handles for resizing

INTERACTIONS:
- Drag to create availability block
- Resize by dragging edges
- Click to edit details
- Right-click to delete
- Copy-paste patterns
- Undo/redo support

RECURRING PATTERNS:
- Save current week as template
- Apply template to date range
- Multiple templates per instructor
- Seasonal variations
- Holiday exceptions

SETTINGS:
- Default slot duration
- Minimum notice required
- Max bookings per day
- Buffer between lessons
- Break time preferences

CONFLICT DETECTION:
- Visual warnings for overlaps
- Double-booking prevention
- Pending booking alerts
- Sync error indicators
```

---

### SKJERM 17: KAPASITET

**PROMPT:**
```
Create a capacity planning and analysis screen called "Kapasitet".
Design with utilization metrics and forecasting.

LAYOUT STRUCTURE:
- KPI header: Utilization %, Revenue per slot, Booking rate
- Weekly capacity chart
- Heat map of busy/quiet times
- Instructor comparison table
- Forecasting section
- Optimization suggestions

VISUAL STYLE:
- Data-heavy dashboard
- Heat map with color gradient
- Bar/line charts for trends
- Comparison tables
- Alert indicators for under/over-utilization

DATA VISUALIZATION:
- Utilization percentage rings
- Time-based heat map
- Trend lines (actual vs target)
- Comparative bar charts
- Forecast confidence intervals

INSIGHTS:
- Peak hours identification
- Underutilized slots
- Revenue optimization suggestions
- Seasonal patterns
- Instructor load balancing

FORECASTING:
- AI-powered demand prediction
- Historical comparison
- Seasonal adjustments
- Growth projections
- Scenario planning

ACTIONS:
- Adjust pricing for quiet times
- Create promotions
- Block/release capacity
- Export reports
- Schedule adjustments
```

---

### SKJERM 18: ANALYSE (Coach Analytics)

**PROMPT:**
```
Create a comprehensive analytics dashboard for coaches called "Analyse".
Design with KPIs, revenue tracking, and student metrics.

LAYOUT STRUCTURE:
- Date range selector
- KPI cards row:
  * Total Revenue
  * Lessons Given
  * Unique Students
  * Retention Rate
  * Average Rating
- Charts section:
  * Revenue trend line chart
  * Lessons by type pie chart
  * Student progress scatter plot
- Student achievement table
- Goal tracking section

VISUAL STYLE:
- Executive dashboard aesthetic
- Dark mode with accent colors
- Interactive charts with tooltips
- Benchmark indicators
- Export-ready formatting

CHARTS:
- Revenue by month/quarter
- Lessons by service type
- New vs returning students
- Cancellation rate trend
- Student satisfaction scores

STUDENT METRICS:
- Handicap improvement distribution
- Lesson frequency by student
- Progress velocity tracking
- Goal completion rates
- Engagement scores

COMPARISONS:
- Period-over-period
- Instructor comparison (admin only)
- Industry benchmarks
- Target vs actual

AI INSIGHTS:
- "Students who practice X times per week improve Y% faster"
- Optimal lesson frequency recommendations
- At-risk student identification
- Upsell opportunity alerts
```

---

### SKJERM 19: DENNE UKEN

**PROMPT:**
```
Create a weekly focus dashboard called "Denne uken".
Design with upcoming schedule and weekly priorities.

LAYOUT STRUCTURE:
- Week overview header with date range
- Day columns (Mon-Sun) with:
  * Booking count per day
  * Total hours scheduled
  * Priority tasks
- This week's focus areas
- Student spotlight section
- Preparation checklist
- Upcoming deadlines/alerts

VISUAL STYLE:
- Week at a glance layout
- Day cards with booking thumbnails
- Progress bars for weekly goals
- Priority indicators (P1, P2, P3)
- Motivational quote/header

DAY CARDS:
- Date and day name
- Booking count
- Key student names
- Lesson types
- Total revenue for day
- Preparation status

PREPARATION:
- Lesson plan checklist
- Equipment preparation
- Student file review
- Follow-up reminders
- Personal development tasks

FOCUS AREAS:
- Weekly theme (e.g., "Short Game Focus")
- Student progression goals
- Academy initiatives
- Personal coaching goals

QUICK ACTIONS:
- Add lesson
- Send group message
- Review lesson plans
- Check equipment
```

---

### SKJERM 20: TURNERINGER

**PROMPT:**
```
Create a tournament management screen called "Turneringer".
Design with tournament list and planning tools.

LAYOUT STRUCTURE:
- Upcoming tournaments list
- Tournament cards with:
  * Name and logo
  * Date and location
  * Registration deadline
  * Status (Planning, Registered, Completed)
  * Student participants count
- Tournament calendar view
- Results history
- Planning checklist

VISUAL STYLE:
- Event card design
- Status badges with colors
- Location map thumbnails
- Result badges/medals
- Priority flags

TOURNAMENT DETAILS:
- Information panel
- Participant list
- Preparation checklist
- Practice schedule
- Travel arrangements
- Results entry

PLANNING TOOLS:
- Countdown timers
- Registration deadlines
- Preparation timeline
- Equipment checklist
- Strategy notes

RESULTS:
- Score entry
- Position tracking
- Statistics recording
- Photo uploads
- Post-tournament review

INTEGRATION:
- Tournament finder/import
- Registration links
- World ranking updates
- Handicap revisions
```

---

### SKJERM 21: NOTIFIKASJONER

**PROMPT:**
```
Create a notification management center called "Notifikasjoner".
Design with message templates and sending interface.

LAYOUT STRUCTURE:
- Template library
- Recipient selection panel
- Message composer
- Preview panel
- Send history/log
- Scheduled messages queue

VISUAL STYLE:
- Split pane layout
- Template cards with previews
- Rich text editor
- Variable placeholders highlighted
- Send status indicators

TEMPLATES:
- Welcome new student
- Lesson reminder
- Booking confirmation
- Payment receipt
- Follow-up after lesson
- Promotional offers
- System announcements

COMPOSER:
- Rich text formatting
- Variable insertion ({{name}}, {{date}}, etc.)
- Personalization tokens
- Preview with sample data
- Attachment support

RECIPIENTS:
- Individual selection
- Group by: Tier, Instructor, Activity
- Segment builder
- Import from CSV
- Exclude lists

SCHEDULING:
- Send now or schedule
- Recurring messages
- A/B testing setup
- Send rate limiting
- Delivery tracking
```

---

### SKJERM 22-32: SUB-PAGES (Korte prompts)

**SKJERM 22 - NY BOOKING (Admin):**
```
Create a new booking form for instructors. Multi-step wizard:
1. Select student (search + create new)
2. Select service type
3. Select date/time (availability calendar)
4. Add notes/details
5. Confirm and notify

Design with progress indicator, form validation, and inline availability checking.
```

**SKJERM 23 - ELEV DETALJER:**
```
Create a comprehensive student detail view with:
- Profile header with photo and key stats
- Tabs: Info, Statistikk, Historikk, Bookinger, Notater
- Handicap progression chart
- Recent activity feed
- Communication history
- Goal tracking
- Document attachments

Design with card-based layout and quick action buttons.
```

**SKJERM 24 - NY AKTIVITET:**
```
Create a facility activity creation form:
- Activity type and name
- Date/time selection
- Capacity setting
- Registration settings
- Description and requirements
- Instructor assignment
- Equipment checklist

Design with step-by-step flow and preview mode.
```

**SKJERM 25 - ENDRE BOOKING:**
```
Create a booking modification interface:
- Current booking details display
- Reschedule options (calendar picker)
- Service change dropdown
- Cancellation with reason
- Refund calculation display
- Confirmation modal

Design with clear before/after comparison and policy notices.
```

**SKJERM 26 - AI ASSISTENT:**
```
Create an AI coaching assistant chat interface:
- Chat message history
- Input with voice-to-text option
- Suggested prompts/quick actions
- File attachment (video analysis)
- AI response with sources/references
- Save conversation to student notes

Design with glassmorphism chat bubbles and typing indicators.
```

**SKJERM 27 - E-POSTMALER:**
```
Create an email template editor:
- Visual/WYSIWYG editor
- HTML code view option
- Variable insertion panel
- Preview with test data
- Template categories
- Version history

Design with split-pane editor and live preview.
```

**SKJERM 28 - MELDINGER:**
```
Create a unified messaging inbox:
- Message list with filters
- Source indicators (Email, SMS, Instagram)
- Priority/urgent flags
- AI-suggested responses
- Thread view
- Quick reply templates

Design with conversation view and action toolbar.
```

**SKJERM 29 - GODKJENNINGER:**
```
Create a booking approval queue:
- Pending requests list
- Request details panel
- Student information
- Conflict checking
- Approve/Decline actions
- Bulk approval option

Design with clear decision buttons and policy guidance.
```

**SKJERM 30 - ØKTER:**
```
Create a coaching session management screen:
- Session list by date
- Session templates
- Pre-session checklist
- Post-session notes
- Homework assignment
- Follow-up scheduling

Design with timeline view and template library.
```

**SKJERM 31 - ØKONOMI:**
```
Create a financial overview dashboard:
- Revenue summary cards
- Outstanding invoices list
- Payment status tracking
- Refund processing
- Financial reports
- Export to accounting

Design with secure, professional financial interface.
```

**SKJERM 32 - RAPPORTER:**
```
Create a report generation interface:
- Report type selection
- Date range picker
- Filter options
- Preview panel
- Export formats (PDF, Excel, CSV)
- Scheduled reports

Design with parameter sidebar and live preview.
```

---

## DEL 3: DESIGN SYSTEM SPECS FOR STITCH

### Fargepalett
```css
/* Primær */
--ak-green: #2D6A4F;
--ak-green-light: #40916C;
--ak-green-dark: #1B4332;

/* Bakgrunn */
--bg-light: #FDF9F0;
--bg-dark: #0A0D0A;
--card-light: #FFFFFF;
--card-dark: #1A1D1A;

/* Accent */
--accent-lime: #D2F000;
--accent-purple: #AF52DE; /* AI only */

/* Semantisk */
--success: #34C759;
--warning: #FF9500;
--error: #FF3B30;
--info: #007AFF;

/* Nøytral */
--text-primary: #1D1D1F;
--text-secondary: #6B7366;
--border: #E8E8ED;
```

### Typografi
```css
/* Overskrifter */
H1: 3.5rem, weight 700, tracking -0.03em, line-height 1.1
H2: 2.5rem, weight 700, tracking -0.025em, line-height 1.2
H3: 1.75rem, weight 600, tracking -0.02em
H4: 1.25rem, weight 600

/* Brødtekst */
Body: 1rem, weight 400, line-height 1.5
Small: 0.875rem
Caption: 0.75rem

/* Spesiell */
Stats Large: 3rem, weight 700
Stats Small: 0.875rem, weight 500, uppercase, tracking 0.05em
```

### Komponenter

**Knapper:**
- Primary: Filled, pill-shape (radius 980px), AK green bg
- Secondary: Outlined, pill-shape
- Ghost: Transparent with hover bg
- Icon: Circle or rounded square

**Cards:**
- Background: White or dark card bg
- Border: 1px solid border color
- Border-radius: 20px
- Shadow: 0 2px 8px rgba(0,0,0,0.04)
- Hover: Lift + shadow increase

**Inputs:**
- Height: 44px minimum
- Border-radius: 12px
- Focus: AK green border + subtle glow
- Error: Red border + error message

**Badges:**
- Small pill shape
- Color-coded by status
- Optional dot indicator

---

## DEL 4: STITCH IMPORT INSTRUKSJONER

For hver skjerm:
1. Kopier prompten fra denne filen
2. Lim inn i Stitch "Generate from Text"
3. Velg passende device type (Desktop for admin, Responsive for elev)
4. Juster farger til AK Golf palett
5. Eksporter som React-komponenter

### Tips for best resultat:
- Generer én skjerm om gangen
- Start med Mission Board (hovedskjermen)
- Bruk "Generate Variants" for å få alternativer
- Juster prompts basert på resultater
- Eksporter komponenter til `components/portal/[skjerm-navn]/`

---

*Generert for AK Golf Academy - Mission Board / Dashboard*
*UI/UX Design Trends 2026 - Skyrye Design inspirasjon*
