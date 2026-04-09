# Heritage Grid - Komplette Prompts for AK Golf

## Prosjekt: AK Golf - Heritage Grid Design System
**Base Design System:** Heritage Grid v1.0 (Quiet Luxury meets Clinical Precision)

---

## 📋 STANDARD DESIGN SYSTEM REFERANSE

**Farger (STRIKT - bruk eksakt disse):**
- Background: #F5F1E8 (Warm Alabaster)
- Surface: #FFFFFF (Cards, modals)
- Surface Muted: #FAF8F3 (Secondary cards)
- Primary: #2D5A27 (Forest Green - sidebar, headers)
- Primary Dark: #1E3D1A (Hover states)
- Accent/CTA: #DFFF00 (Vibrant Lime - buttons only)
- Accent Hover: #B8D400 (Lime hover)
- Text Primary: #333333 (Main text)
- Text Secondary: #666666 (Descriptions)
- Text Muted: #999999 (Metadata)
- Border: rgba(45,90,39,0.1) (Subtle borders)
- Success: #22C55E
- Error: #EF4444

**Typography:**
- Headlines: DM Sans, 600-700 weight
- Body: DM Sans, 400 weight
- Labels: DM Sans, 500, uppercase, tracking wide
- Monospace: JetBrains Mono for data/numbers

**Spacing (4px base):**
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px

**Border Radius:**
- sm: 8px, md: 12px, lg: 16px, xl: 24px, full: 9999px

**Layout:**
- Bento-grid: CSS Grid, 12-column system
- Gap: 24px between cards
- Page padding: 32px
- Max-width: 1440px centered

**"No Decoration" Rule:**
- No gradients except lime CTA buttons
- No heavy shadows
- No borders stronger than 10% opacity
- Whitespace defines hierarchy

---

## 🏠 1. LANDING PAGE

### Prompt:
```
Create a premium landing page for AK Golf Academy with Heritage Grid design system.

HERO SECTION:
- Full-width hero with Warm Alabaster (#F5F1E8) background
- Large serif-style headline "Master Your Game" in Forest Green (#2D5A27), 48px, DM Sans 700 weight
- Subheadline "Elite golf coaching for players who demand excellence" in Text Secondary (#666666), 18px
- Two CTAs side by side:
  * Primary: "START YOUR JOURNEY" - Vibrant Lime (#DFFF00) background, Forest Green text, 12px radius, uppercase, 14px 600 weight, padding 12px 24px
  * Secondary: "VIEW PROGRAMS" - transparent background, 1.5px Forest Green border, Forest Green text
- Hero image: Professional golfer mid-swing, positioned right with intentional asymmetry
- Subtle radial gradient overlay: ellipse 600px 400px at 30% 20%, rgba(45,90,39,0.03)

FEATURES BENTO GRID (4 cards):
- White (#FFFFFF) cards, 16px radius, shadow: 0 4px 16px rgba(45,90,39,0.06)
- 24px gap between cards
- Each card has:
  * Forest Green icon (48px) at top
  * Title: DM Sans 600, 18px, #333333
  * Description: DM Sans 400, 14px, #666666
  * 24px padding inside card
- Cards:
  1. "Personal Coaching" - Icon: User/Coach. "One-on-one sessions with certified PGA professionals tailored to your game."
  2. "Track Progress" - Icon: Chart/Graph. "Advanced analytics and statistics to measure your improvement over time."
  3. "Book Sessions" - Icon: Calendar. "Seamless online scheduling. Book your preferred coach and time slot in seconds."
  4. "Elite Community" - Icon: Users. "Join a network of dedicated golfers. Share experiences and grow together."

STATS BAR:
- Full-width section with Surface Muted (#FAF8F3) background
- 3 columns centered:
  * "500+" / "Players Trained" - Numbers in JetBrains Mono, 32px, Forest Green
  * "50+" / "Certified Coaches" - Numbers in Lime (#DFFF00) for accent
  * "98%" / "Satisfaction Rate" - Numbers in Forest Green
- Labels: DM Sans 500, uppercase, 12px, letter-spacing 0.05em, #999999

TESTIMONIAL SECTION:
- White card, 16px radius, centered, max-width 800px
- Large quote icon in Forest Green at top
- Quote text: "AK Golf transformed my game. The personalized coaching and detailed analytics helped me lower my handicap by 8 strokes in just 6 months." - DM Sans 400 italic, 20px, #333333
- Avatar: 64px circle, Forest Green border 2px
- Name: "Marcus Johansen" - DM Sans 600, 16px
- Title: "PGA Tour Player" - DM Sans 400, 14px, #666666

FINAL CTA SECTION:
- Forest Green (#2D5A27) background
- Heading: "Ready to Elevate Your Game?" - White text, 36px, DM Sans 700
- Subtext: "Join hundreds of golfers who have transformed their game with AK Golf Academy." - White 80% opacity, 16px
- Primary CTA: "GET STARTED TODAY" - Vibrant Lime background, Forest Green text, pill-shaped (full radius)
- Secondary link: "Learn more about our programs →" - White text, underline on hover

NAVIGATION (Sticky):
- Height: 64px, white background with subtle shadow
- Logo: "AK GOLF" - Forest Green, DM Sans 700, 24px
- Nav items: Programs, Coaches, Pricing, About - DM Sans 500, 14px, #333333
- CTA: "SIGN IN" - Forest Green text, 12px radius border

FOOTER:
- Surface Muted background
- 4 columns: About, Programs, Support, Connect
- Copyright: "© 2025 AK Golf Academy. All rights reserved."
- Social icons: Forest Green, 24px
```

---

## 🔐 2. LOGIN / AUTHENTICATION

### Prompt:
```
Create an elegant login screen for AK Golf Academy with Heritage Grid design system.

LAYOUT:
- Split-screen design: Left side content, Right side form
- Left side (45%): Full-height Forest Green (#2D5A27) background
  * Large heading: "Welcome Back" - White text, 48px, DM Sans 700
  * Subtext: "Continue your journey to mastering the game." - White 80%, 18px
  * Decorative golf ball illustration (subtle, 10% opacity white)
  * Quote at bottom: "The harder you work, the luckier you get." - White 60%, 14px italic

Right side (55%): Warm Alabaster (#F5F1E8) background
- Centered form container, max-width 400px
- Logo at top: "AK GOLF" - Forest Green, 32px
- Form title: "Sign In to Your Account" - #333333, 24px, DM Sans 600
- Input fields:
  * Email: Label "EMAIL ADDRESS" uppercase, DM Sans 500, 12px, #666666
    Input: #FAF8F3 background, 12px radius, 48px height, 1px border rgba(45,90,39,0.15)
    Focus: border-color #2D5A27
  * Password: Label "PASSWORD" uppercase
    Same styling + "Show/Hide" toggle icon
- "Remember me" checkbox: Custom styled, Forest Green when checked
- "Forgot password?" link: Forest Green, 14px, right-aligned
- Primary CTA: "SIGN IN" - Vibrant Lime background, Forest Green text, full-width, 48px height
- Divider: "OR" with horizontal lines, #999999, 12px
- Social login buttons:
  * "Continue with Google" - White background, subtle shadow, Google icon
  * "Continue with Apple" - White background, subtle shadow, Apple icon
- Bottom text: "Don't have an account? Sign up" - #666666 + Forest Green link

SECURITY BADGE:
- Small text at bottom: "🔒 Secured with 256-bit encryption" - #999999, 12px
```

---

## 📊 3. PLAYER DASHBOARD (Bento Grid)

### Prompt:
```
Create a player dashboard with bento-grid layout for AK Golf Academy using Heritage Grid design system.

PAGE STRUCTURE:
- Sidebar (260px fixed): Forest Green (#2D5A27) background
  * Logo: "AK GOLF" at top, white text, 24px
  * Navigation items with icons:
    - Dashboard (active): Lime (#DFFF00) background pill, Forest Green text
    - My Schedule
    - Statistics
    - Coaching
    - Community
    - Settings
  * User profile at bottom: Avatar + Name + "Pro Member" badge

- Main content: Warm Alabaster (#F5F1E8) background
  * Header: "Good morning, Marcus" - 32px, DM Sans 700, #333333
  * Date: "Wednesday, January 15, 2025" - 14px, #999999

BENTO GRID LAYOUT (12-column):

CARD 1 - NEXT SESSION (spans 8 columns):
- White background, 16px radius
- Header: "UPCOMING SESSION" - Label uppercase, 12px, #999999
- Content:
  * "Driver Fitting with Coach Andersen" - 24px, DM Sans 600
  * "Tomorrow, 10:00 AM - 11:30 AM" - 16px, #666666
  * Location icon + "Driving Range, Bay 3"
- Footer: "Reschedule" (text link) + "Check In" (Lime button)

CARD 2 - HANDICAP INDEX (spans 4 columns):
- White background, 16px radius
- "HANDICAP INDEX" label
- Large number: "12.4" - JetBrains Mono, 48px, Forest Green
- Trend: "↓ 0.3 this month" - Lime color, small arrow
- Sparkline chart showing trend

CARD 3 - RECENT STATS (spans 4 columns):
- White background, 16px radius
- "LAST ROUND" label
- Score: "78" - 36px, Forest Green
- Course: "Oslo Golf Club" - 14px, #666666
- Stats row: Fairways 12/14 | GIR 11/18 | Putts 32

CARD 4 - PRACTICE GOALS (spans 4 columns):
- White background, 16px radius
- "WEEKLY GOALS" label
- Progress ring: 75% complete
- "3 of 4 sessions completed"
- Next: "Putting practice - Today 4PM"

CARD 5 - COACH NOTES (spans 4 columns):
- White background, 16px radius
- "RECENT FEEDBACK" label
- Coach avatar + "Coach Hansen"
- "Great improvement on your iron play. Focus on tempo for next session." - 14px italic
- "View all notes →"

CARD 6 - QUICK ACTIONS (spans 12 columns, horizontal):
- White background, 16px radius
- 4 action buttons side by side:
  * "Book Session" + Calendar icon
  * "View Stats" + Chart icon
  * "Message Coach" + Chat icon
  * "Upload Round" + Upload icon
- Each: White card, subtle border, icon in Forest Green

BOTTOM ROW:
- Recent Activity feed (spans 8)
- Upcoming Tournaments (spans 4)
```

---

## 📅 4. BOOKING - SELECT SERVICE

### Prompt:
```
Create a booking flow step 1: Select Service for AK Golf Academy with Heritage Grid design system.

PAGE STRUCTURE:
- Header: "Book a Session" - 32px, DM Sans 700, centered
- Subheader: "Choose the type of session you want to book" - 16px, #666666
- Progress indicator: Step 1 of 3 (Service → Coach → Confirm)
  * Active step: Forest Green circle with number
  * Inactive: Gray circle
  * Connector line: Forest Green between steps

SERVICE CARDS (3 options, grid layout):

CARD 1 - PRIVATE LESSON:
- White background, 16px radius, hover: translateY(-2px)
- Selected state: 2px Forest Green border
- Icon: User/Coach, 48px, Forest Green
- Title: "Private Lesson" - 24px, DM Sans 600
- Description: "One-on-one coaching tailored to your specific needs. Perfect for focused improvement."
- Duration: "60 or 90 minutes"
- Price: "From 1,200 NOK" - Forest Green, 18px
- Features list:
  * Personalized instruction
  * Video analysis included
  * Practice plan provided
- "Select" button: Outline style

CARD 2 - GROUP CLINIC:
- Same card structure
- Icon: Users, 48px
- Title: "Group Clinic"
- Description: "Learn alongside other golfers. Great for social learning and cost-effective coaching."
- Duration: "120 minutes"
- Price: "From 600 NOK"
- Features:
  * Small groups (max 6)
  * Specific focus areas
  * Social atmosphere

CARD 3 - PLAYING LESSON:
- Same card structure
- Icon: Flag/Golf, 48px
- Title: "Playing Lesson"
- Description: "On-course coaching. Learn strategy, course management, and shot selection in real play."
- Duration: "9 or 18 holes"
- Price: "From 2,500 NOK"
- Features:
  * Course strategy
  * Shot selection
  * Mental game coaching

BOTTOM BAR (sticky):
- Warm Alabaster background, subtle top border
- "Selected: Private Lesson" - left side
- "1,200 NOK" - price
- "Continue" button: Vibrant Lime, Forest Green text - right side
- "Back" link: text only, left of continue

FILTER OPTIONS (above cards):
- Tabs: "All" | "Beginner" | "Intermediate" | "Advanced"
- Active tab: Forest Green background pill, white text
- Inactive: transparent, Forest Green text
```

---

## 👤 5. PLAYER PROFILE

### Prompt:
```
Create a player profile page for AK Golf Academy with Heritage Grid design system.

PAGE STRUCTURE:
- Two-column layout: Left (320px) sticky sidebar, Right (flex) main content

LEFT SIDEBAR:
- White card, 16px radius, sticky top 32px
- Profile header:
  * Large avatar: 120px circle, Forest Green border 3px
  * Name: "Marcus Johansen" - 24px, DM Sans 700
  * Handle: "@marcusj" - 14px, #999999
  * "Pro Member" badge: Lime background, Forest Green text, pill-shaped
- Stats row:
  * "12.4" / "Handicap"
  * "47" / "Rounds"
  * "23" / "Sessions"
- Bio: "Aspiring scratch golfer. Working on my short game and mental approach."
- Location: "Oslo, Norway" with pin icon
- Member since: "January 2023"
- "Edit Profile" button: Outline style, full width
- "Share Profile" link: text only

RIGHT CONTENT:

SECTION 1 - PERFORMANCE OVERVIEW:
- White card, 16px radius
- Header: "PERFORMANCE" with "View Details →" link
- 4 stat cards in a row:
  * "Scoring Average" - 78.4 - "↓ 1.2 vs last year"
  * "Fairways Hit" - 68% - "↑ 5% vs last year"
  * "Greens in Reg" - 62% - "↑ 3% vs last year"
  * "Putts per Round" - 32.1 - "↓ 0.8 vs last year"
- Mini trend chart below

SECTION 2 - RECENT ROUNDS:
- White card, 16px radius
- Header: "RECENT ROUNDS" + "View All"
- List of 5 rounds:
  * Each row: Date | Course | Score | Differential
  * Best score highlighted with Lime accent
  * Hover: Surface Muted background
- "Upload New Round" button: Lime CTA

SECTION 3 - COACHING HISTORY:
- White card, 16px radius
- Header: "COACHING SESSIONS"
- Timeline view:
  * Vertical line: Forest Green, 2px
  * Dots: Lime for completed, gray for upcoming
  * Each item: Date | Coach Name | Session Type | Notes preview
- "Book Next Session" button

SECTION 4 - ACHIEVEMENTS:
- White card, 16px radius
- Header: "ACHIEVEMENTS"
- Badge grid (3x3):
  * First Eagle
  * Birdie Streak (5+)
  * Sub-80 Round
  * Handicap Under 15
  * 50 Rounds Played
  * 10 Sessions Completed
- Locked badges: Grayscale, 50% opacity

SECTION 5 - EQUIPMENT:
- White card, 16px radius
- Header: "MY BAG"
- Category tabs: Woods | Irons | Wedges | Putter
- List with brand/model for each club
- "Update Equipment" link
```

---

## 📈 6. STATISTICS / ANALYTICS DASHBOARD

### Prompt:
```
Create a comprehensive statistics dashboard for AK Golf Academy with Heritage Grid design system.

PAGE HEADER:
- "Performance Analytics" - 32px, DM Sans 700
- Date range selector: "Last 30 Days" dropdown
- "Export Report" button: Outline style
- "Compare" toggle: Compare to previous period

FILTER BAR:
- Tabs: "Overview" | "Scoring" | "Driving" | "Approach" | "Short Game" | "Putting"
- Active: Forest Green background, white text
- Inactive: transparent, Forest Green text

MAIN CHART SECTION (full width):
- White card, 16px radius
- "SCORING TREND" header
- Large line chart:
  * X-axis: Dates (last 30 days)
  * Y-axis: Score (68-95 range)
  * Line: Forest Green, 2px stroke
  * Fill: Gradient from rgba(45,90,39,0.1) to transparent
  * Grid lines: rgba(45,90,39,0.05)
  * Average line: Dashed Lime
- Legend: Score | Trend | Target (78)
- Hover tooltip: Date, Score, Course

STATS GRID (4 cards):

CARD 1 - SCORING:
- "SCORING AVERAGE" label
- "78.4" - JetBrains Mono, 48px, Forest Green
- Sparkline showing trend
- "Best: 74 | Worst: 84"

CARD 2 - CONSISTENCY:
- "SCORING STD DEV" label
- "3.2" - 48px
- "More consistent than 68% of players"
- Progress bar

CARD 3 - IMPROVEMENT:
- "HANDICAP TREND" label
- "↓ 1.8" - Lime color, large
- "Last 6 months"
- Area chart

CARD 4 - ROUNDS PLAYED:
- "ROUNDS THIS MONTH" label
- "8" - 48px
- "+2 vs last month"
- Calendar heatmap mini

DETAILED BREAKDOWN (accordion sections):

SECTION 1 - DRIVING:
- Expandable header
- Stats grid:
  * Fairways Hit: 68% (12.2/round avg)
  * Left Miss: 18% | Right Miss: 14%
  * Avg Distance: 268 yards
- Bar chart: Distance distribution

SECTION 2 - APPROACH SHOTS:
- GIR: 62%
- Proximity to hole: 18.5 yards avg
- Strokes Gained: Approach: +0.4
- Scatter plot: Distance vs Proximity

SECTION 3 - SHORT GAME:
- Up & Down: 42%
- Sand Saves: 38%
- Chips per round: 4.2
- Pitch shot accuracy by distance

SECTION 4 - PUTTING:
- Putts per round: 32.1
- One-putt percentage: 28%
- Three-putt avoidance: 92%
- Average putt distance made: 4.8ft
- Heat map: Putting success by distance

INSIGHTS SECTION:
- White card with Lime left border (4px)
- "AI INSIGHTS" badge
- "Your driving accuracy has improved 8% since last month. Focus on approach shots from 100-150 yards for maximum scoring improvement."
- "View personalized practice plan →"

COMPARISON SECTION:
- "How you compare" to:
  * Your handicap group
  * All AK Golf members
  * PGA Tour averages
- Radar chart showing 6 skill areas

BOTTOM CTAs:
- "Schedule Practice Session" - Lime button
- "Share with Coach" - Outline button
- "Download Full Report" - Text link
```

---

## 🎯 7. COACH DASHBOARD

### Prompt:
```
Create a coach dashboard for AK Golf Academy with Heritage Grid design system.

SIDEBAR (Coach view):
- Forest Green background
- "COACH PORTAL" logo
- Navigation:
  * Dashboard (active)
  * My Schedule
  * My Players
  * Session Notes
  * Analytics
  * Earnings

MAIN CONTENT:

HEADER:
- "Welcome back, Coach Hansen" - 32px
- "You have 4 sessions today" - notification
- Quick actions: "Block Time" | "Add Note" | "Message"

TODAY'S SCHEDULE (priority card):
- White card, full width
- "TODAY - WEDNESDAY, JAN 15" header
- Timeline view (vertical):
  * 09:00 - Marcus Johansen - Driver Fitting - Bay 3 - "Check In" button
  * 10:30 - Emma Larsen - Putting Lesson - Green - "In Progress" badge
  * 13:00 - Ole Pedersen - Playing Lesson - Course - "Prepare" button
  * 15:30 - Group Clinic - 6 players - Range - "View Roster"
- Each item: Time | Player avatar + name | Session type | Location | Status/Action

MY PLAYERS GRID:
- "ACTIVE PLAYERS (24)" header with search
- Player cards (4 per row):
  * Avatar, Name, Handicap
  * Last session: "2 days ago"
  * Next session: "Tomorrow 10AM"
  * Progress indicator: "On track" / "Needs attention"
  * Quick actions: Message | Schedule | Notes

RECENT ACTIVITY:
- White card
- "RECENT SESSION NOTES" header
- List:
  * Marcus J. - Yesterday - "Significant improvement in iron contact. Recommended drill: towel under arms."
  * Emma L. - 2 days ago - "Putting stroke more consistent. Speed control still needs work."
  * Group Clinic - 3 days ago - "All players showing better alignment."
- "View All Notes" link

PERFORMANCE METRICS:
- 3 cards:
  * "Sessions This Month" - 47 - "+12 vs last month"
  * "Player Satisfaction" - 4.9/5.0 - "Based on 38 reviews"
  * "Revenue" - 45,600 NOK - "On track for monthly goal"

UPCOMING EVENTS:
- "Group Clinics This Week"
- "Tournament Preparation Camp - Jan 20-22"
- "Junior Academy Launch - Feb 1"

QUICK STATS:
- "Average session rating: 4.8"
- "Response time: 2.3 hours"
- "Player retention: 94%"
```

---

## 📱 8. MOBILE SCREENS (Responsive)

### Mobile Dashboard Prompt:
```
Create a mobile dashboard for AK Golf Academy with Heritage Grid design system.

SPECIFICATIONS:
- Width: 390px (iPhone standard)
- Full Heritage Grid styling
- Touch-friendly targets (min 44px)
- Bottom navigation bar

HEADER:
- Hamburger menu (left)
- "AK GOLF" logo (center)
- Notification bell with badge (right)

WELCOME SECTION:
- "Good morning, Marcus" - 24px
- Date - 14px, #999999
- Weather widget: "Oslo | 8°C | ☁️"

NEXT SESSION CARD (prominent):
- Full width, white, 16px radius
- "UPCOMING" label
- "Driver Fitting" - 20px
- "Today, 10:00 AM" - 16px
- "Coach: Andersen" - 14px
- "Check In" button: Full width, Lime

QUICK STATS (horizontal scroll):
- Cards: Handicap 12.4 | Last Score 78 | Rounds 47
- Each: White card, 120px width

RECENT ACTIVITY:
- "RECENT ROUNDS" header + "View All"
- List items (3):
  * Oslo GC | 78 | +6 | Yesterday
  * Bærum GK | 82 | +10 | 3 days ago
- Score in Forest Green or red based on target

ACTIONS GRID (2x2):
- Book Session | My Stats
- Message Coach | Upload Round
- Icon + text, white cards

BOTTOM NAVIGATION:
- 5 icons: Home | Schedule | Stats | Coach | Profile
- Active: Forest Green
- Inactive: #999999
- Height: 64px + safe area
```

---

## 📝 BRUK DISSE PROMPTS I STITCH:

1. Kopier prompten du vil bruke
2. Gå til Stitch (stitch.withgoogle.com)
3. Velg prosjektet "AK Golf - Heritage Grid Design System"
4. Klikk "+ New Screen" eller "Generate"
5. Lim inn prompten
6. Juster om nødvendig
7. Generer skjermen

**Tips:** Start med Landing Page og Dashboard, så bygger du videre fra der! 🚀
