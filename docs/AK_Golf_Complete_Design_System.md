# AK Golf - Komplett Design System & Alle Skjermer

## Basert på: Heritage Golf Coaching Landing Page

---

## 1. VISUELL IDENTITET

### Fargepalett

| Token | HEX | Bruk |
|-------|-----|------|
| **Primary Green** | `#1B3A1B` | Bakgrunn, hovedfarge |
| **Dark Green** | `#0F1F0F` | Dyp bakgrunn, footer |
| **Light Green** | `#2D4A2D` | Paneler, kort |
| **Accent Lime** | `#C8E846` | CTA knapper, highlights |
| **Accent Yellow** | `#E8F04A` | Sekundær accent |
| **White** | `#FFFFFF` | Tekst på mørk bakgrunn |
| **Off-White** | `#F5F5F0` | Tekst på lys bakgrunn |
| **Cream** | `#E8E4D9` | Scorekort bakgrunn |
| **Paper** | `#F0ECD8` | Autentisk papir-tekstur |
| **Sand** | `#D4C4A8` | Bunkere i kart |
| **Fairway** | `#4A7C4A` | Fairway i kart |
| **Green** | `#5A9A5A` | Green i kart |
| **Water** | `#4A7A9A` | Vann i kart |
| **Rough** | `#3A5A3A` | Rough i kart |

### Gradienter
- **Panel Gradient**: `linear-gradient(135deg, rgba(45,74,45,0.95) 0%, rgba(27,58,27,0.9) 100%)`
- **Scorekort**: `linear-gradient(180deg, #F0ECD8 0%, #E8E4D9 100%)`
- **Hero Overlay**: `linear-gradient(90deg, rgba(27,58,27,0.95) 0%, rgba(27,58,27,0.7) 50%, transparent 100%)`

### Typografi

| Element | Font | Størrelse | Vekt | Farge |
|---------|------|-----------|------|-------|
| Logo | DM Sans | 24px | 700 | White |
| H1 (Hero) | DM Sans | 64px | 700 | White |
| H2 (Section) | DM Sans | 48px | 600 | White |
| H3 (Card) | DM Sans | 24px | 600 | White/Off-White |
| Body | Inter | 16px | 400 | Off-White |
| Label | Inter | 12px | 500 | White (uppercase) |
| Button | DM Sans | 14px | 600 | Dark Green |
| Scorekort Header | Playfair Display | 18px | 700 | #1B3A1B |
| Scorekort Body | Playfair Display | 14px | 400 | #2D4A2D |
| Handwritten | Caveat | 16px | 400 | #1B3A1B |

### Komponenter

#### Primary CTA Button
```
Background: #C8E846 (Lime)
Text: #1B3A1B (Dark Green)
Padding: 16px 32px
Border-radius: 8px
Font: DM Sans 14px 600
Hover: #E8F04A (lighter), scale(1.02)
Shadow: 0 4px 20px rgba(200,232,70,0.3)
```

#### Secondary Button
```
Background: transparent
Border: 2px solid #C8E846
Text: #C8E846
Padding: 14px 30px
Border-radius: 8px
Hover: Background rgba(200,232,70,0.1)
```

#### Panel/Card
```
Background: linear-gradient(135deg, rgba(45,74,45,0.95) 0%, rgba(27,58,27,0.9) 100%)
Border: 1px solid rgba(200,232,70,0.2)
Border-radius: 16px
Padding: 24px
Backdrop-filter: blur(10px)
Shadow: 0 8px 32px rgba(0,0,0,0.3)
```

#### Scorekort
```
Background: #F0ECD8 (Paper)
Border: 1px solid rgba(27,58,27,0.1)
Border-radius: 8px
Padding: 20px
Font-family: Playfair Display
Texture: Subtle paper grain overlay
```

#### Input Field
```
Background: rgba(255,255,255,0.1)
Border: 1px solid rgba(200,232,70,0.3)
Border-radius: 8px
Padding: 14px 16px
Font: Inter 16px
Color: White
Placeholder: rgba(255,255,255,0.5)
Focus: Border #C8E846, glow effect
```

#### Navigation Item
```
Font: DM Sans 14px 500
Color: rgba(255,255,255,0.8)
Hover: #C8E846
Active: #C8E846 with underline
```

### Layout System

#### Grid
- 12-column grid
- Gap: 24px
- Max-width: 1400px
- Padding: 0 32px

#### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

#### Border Radius
- sm: 4px
- md: 8px
- lg: 16px
- xl: 24px
- full: 9999px

---

## 2. LANDING PAGE (Hero)

### Prompt:
```
Create a premium landing page for AK Golf Academy.

HERO SECTION (Full viewport height):
- Background: Cinematic golf course photo, player mid-swing
- Left overlay gradient: linear-gradient(90deg, rgba(27,58,27,0.95) 0%, rgba(27,58,27,0.7) 50%, transparent 100%)
- Content positioned left, vertically centered

NAVIGATION (Fixed top, transparent → solid on scroll):
- Logo: "AK GOLF" - DM Sans 700, 24px, white
- Nav items: Home | Coaches ▼ | Members ▼ | Resources ▼ | Our AI
  * Font: DM Sans 14px 500
  * Color: rgba(255,255,255,0.8)
  * Hover: #C8E846
- Right side:
  * Menu icon (hamburger)
  * Search icon
  * "Be a Member" button: #C8E846 bg, #1B3A1B text, 14px 600, 8px radius

HERO CONTENT (Left side, max-width 600px):
- Tagline pill: "Join the Community of Champions"
  * Background: rgba(255,255,255,0.1)
  * Border: 1px solid rgba(200,232,70,0.3)
  * Border-radius: 9999px
  * Padding: 8px 16px
  * Font: Inter 12px 500, white
  * Icon: Trophy/star left of text

- Headline: "Refine Your Golf Skills"
  * Font: DM Sans 64px 700
  * Color: white
  * Line-height: 1.1
  * Margin-top: 24px

- Subheadline: "Unlock your potential and achieve mastery on the green with our expert-guided sessions."
  * Font: Inter 18px 400
  * Color: rgba(255,255,255,0.8)
  * Line-height: 1.6
  * Margin-top: 16px

- Email signup:
  * Input: "Subscribe to newsletter"
    - Background: rgba(255,255,255,0.1)
    - Border: 1px solid rgba(200,232,70,0.3)
    - Border-radius: 8px 0 0 8px
    - Padding: 16px 20px
    - Width: 280px
  * Button: "Subscribe"
    - Background: rgba(255,255,255,0.2)
    - Border: 1px solid rgba(200,232,70,0.3)
    - Border-radius: 0 8px 8px 0
    - Padding: 16px 24px
    - Font: DM Sans 14px 600
    - Color: white

- Trust badges:
  * 4 small course photos in rounded rectangles (8px radius)
  * "50+ Exclusive Golf Courses" badge
  * Star icon + "Get the Edge with Elite Coaching"

RIGHT PANEL (Floating card, right side):
- Background: white
- Border-radius: 16px
- Padding: 24px
- Width: 320px
- Shadow: 0 20px 60px rgba(0,0,0,0.3)

- Header: "Everyday AK Golf"
  * Font: DM Sans 12px 500, uppercase
  * Color: #999

- Title: "High Level Sessions For Productive Athletes 24/7"
  * Font: DM Sans 20px 600
  * Color: #1B3A1B
  * Line-height: 1.4

- CTA: "Plan your session"
  * Background: #C8E846
  * Color: #1B3A1B
  * Full width
  * Padding: 16px
  * Border-radius: 8px
  * Font: DM Sans 14px 600
  * Margin-top: 16px

- Social proof:
  * 3 avatar circles (overlapping)
  * "Trusted by over +20K Athletes"
  * Font: Inter 12px, #666

- Pricing card:
  * "Subscription" label
  * Tabs: Monthly | Yearly -30% off
  * "Monthly" selected: #C8E846 bg pill
  * Price: "$149" large, "/Month" small
  * Features:
    - "22 Sessions"
    - "Spec all course"
    - "Tracking tools"
  * Check icons in lime

FOOTER BAR (Bottom):
- Left: "Contact us" + social icons
- Center: Partner logos (Nike Golf, TaylorMade, Titleist)
- Right: "Email: AKgolf@info.com"

RESPONSIVE:
- Mobile: Stack vertically, full-width panels
- Tablet: 2-column grid
- Desktop: Full layout as described
```

---

## 3. LOGIN / AUTHENTICATION

### Prompt:
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
  * "The harder you practice, the luckier you get."
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

- Title: "Welcome Back"
  * Font: DM Sans 28px 600
  * Color: white
  * Text-align: center

- Subtitle: "Sign in to continue your journey"
  * Font: Inter 14px 400
  * Color: rgba(255,255,255,0.6)
  * Text-align: center
  * Margin-bottom: 32px

- Email field:
  * Label: "EMAIL ADDRESS" (uppercase, 12px, rgba(255,255,255,0.6))
  * Input: 
    - Background: rgba(255,255,255,0.1)
    - Border: 1px solid rgba(200,232,70,0.3)
    - Border-radius: 8px
    - Padding: 16px
    - Color: white
    - Placeholder: "your@email.com"

- Password field:
  * Same as email
  * Label: "PASSWORD"
  * Show/hide toggle icon (eye)

- Remember me + Forgot password row:
  * Checkbox: "Remember me"
  * Link: "Forgot password?" - #C8E846, right-aligned

- Sign In button:
  * Background: #C8E846
  * Color: #1B3A1B
  * Full width
  * Padding: 16px
  * Border-radius: 8px
  * Font: DM Sans 14px 600
  * Margin-top: 24px

- Divider: "OR"
  * Horizontal lines with text in center
  * Color: rgba(255,255,255,0.3)

- Social buttons:
  * "Continue with Google" - white bg, dark text, Google icon
  * "Continue with Apple" - white bg, dark text, Apple icon
  * Border-radius: 8px
  * Padding: 14px
  * Margin: 8px 0

- Sign up link:
  * "Don't have an account? Sign up"
  * "Sign up" in #C8E846
  * Text-align: center
  * Margin-top: 24px
```

---

## 4. PLAYER DASHBOARD

### Prompt:
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
  * Handicap: "HCP: 12.4"

- Navigation:
  * "The Open" - tournament badge (lime)
  * "St Andrews - Links" - course name
  * Divider line
  * Menu items:
    - Scorecard (active, lime accent)
    - Course Map
    - Analytics
    - Bag
    - Rules
  * Each with icon, white text, hover lime

- Bottom CTA: "NEW ROUND"
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
  * "CURRENT" badge: lime bg, dark text

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
  * "Kjøresti: 220m Left"
  * "Vind: 12km/h SL"

RIGHT PANEL (Scorekort):
- Background: #F0ECD8 (paper texture)
- Border-radius: 8px
- Padding: 24px
- Font-family: Playfair Display

- Header:
  * "AK GOLF" - centered, elegant
  * "OFFICIAL MATCH SCORECARD"
  * "The Old Course at St Andrews, 2025-06-15"

- Table:
  * Columns: HULL | PAR | LENGDE | SCORE | PUTTS | FAIRWAY | GIR
  * Rows 1-4 visible
  * Row 3 (current): Highlighted with lime tint
  * Handwritten-style numbers

- "Out Total" row
- Signature line: "Playing partner: [blank]"
- Player signature: "Marcus Johansen" (handwritten font)
- HCP: 12.4

- Bottom CTA: "AVSLUTT RUNDE"
  * Background: #C8E846
  * Color: #1B3A1B
  * Border-radius: 9999px (pill)
  * Padding: 16px 32px
  * Position: bottom-right of card

TOP BAR:
- Tabs: ROUND | LEADERBOARD | STATS
- Active: ROUND (lime underline)
- Right icons: Share | Settings | Profile
```

---

## 5. BOOKING - SELECT SERVICE

### Prompt:
```
Create a booking flow for AK Golf Academy.

LAYOUT:
- Dark green (#1B3A1B) background
- Centered content, max-width 1200px
- Padding: 64px 32px

HEADER:
- "Book Your Session" - DM Sans 48px 700, white, centered
- "Choose the perfect coaching experience for your game" - Inter 16px, rgba(255,255,255,0.7), centered
- Margin-bottom: 48px

PROGRESS STEPS:
- 3 steps: Service → Coach → Confirm
- Visual: Connected circles with lines
- Active step: Lime (#C8E846) fill
- Completed: Lime with checkmark
- Future: Outline only, rgba(255,255,255,0.3)
- Labels below each step

SERVICE CARDS (3-column grid):

CARD 1: Private Lesson
- Background: linear-gradient(135deg, rgba(45,74,45,0.95) 0%, rgba(27,58,27,0.9) 100%)
- Border: 1px solid rgba(200,232,70,0.2)
- Border-radius: 16px
- Padding: 32px
- Hover: Border becomes lime, subtle lift

- Icon: Golf player silhouette (lime)
- Title: "Private Lesson" - DM Sans 24px 600, white
- Description: "One-on-one coaching tailored to your specific needs. Perfect for focused improvement." - Inter 14px, rgba(255,255,255,0.7)
- Duration: "60 or 90 minutes" - small, rgba(255,255,255,0.5)
- Price: "From $120" - DM Sans 32px 700, #C8E846
- Features:
  * "Personalized instruction"
  * "Video analysis included"
  * "Practice plan provided"
- "Select" button: Outline style, lime border

CARD 2: Group Clinic
- Same structure
- Icon: Multiple players
- Title: "Group Clinic"
- Description: "Learn alongside other golfers. Great for social learning."
- Duration: "120 minutes"
- Price: "From $60"
- Features: "Small groups (max 6)", "Specific focus areas", "Social atmosphere"

CARD 3: Playing Lesson
- Same structure
- Icon: Flag on course
- Title: "Playing Lesson"
- Description: "On-course coaching. Learn strategy and shot selection in real play."
- Duration: "9 or 18 holes"
- Price: "From $250"
- Features: "Course strategy", "Shot selection", "Mental game coaching"

FILTER TABS (above cards):
- "All" | "Beginner" | "Intermediate" | "Advanced"
- Active: Lime background pill
- Inactive: Transparent, white text

BOTTOM BAR (sticky):
- Background: rgba(15,31,15,0.95)
- Border-top: 1px solid rgba(200,232,70,0.2)
- Padding: 16px 32px
- Position: fixed bottom

- Left: "Selected: Private Lesson"
- Center: "$120"
- Right: "Continue" button (lime bg) + "Back" link
```

---

## 6. PLAYER PROFILE

### Prompt:
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
- Badge: "Pro Member" - lime bg pill

- Stats row (3 columns):
  * "12.4" / "Handicap"
  * "47" / "Rounds"
  * "23" / "Sessions"

- Bio: "Aspiring scratch golfer. Working on my short game."
- Location: "Oslo, Norway" with pin icon
- Member since: "January 2023"

- Buttons:
  * "Edit Profile" - outline, lime border
  * "Share Profile" - text only, lime color

RIGHT CONTENT (sections):

SECTION 1: Performance Overview
- Background: panel style
- Title: "Performance" with "View Details →"
- 4 stat cards:
  * "Scoring Average" - 78.4 - "↓ 1.2 vs last year"
  * "Fairways Hit" - 68% - "↑ 5% vs last year"
  * "Greens in Reg" - 62% - "↑ 3% vs last year"
  * "Putts per Round" - 32.1 - "↓ 0.8 vs last year"
- Mini trend chart

SECTION 2: Recent Rounds
- Title: "Recent Rounds" + "View All"
- List of 5 rounds (scorekort-style cards)
- Each: Date | Course | Score | Differential
- Best score: Lime highlight
- "Upload New Round" button

SECTION 3: Coaching History
- Timeline view
- Vertical line with dots
- Each session: Date | Coach | Type | Notes preview

SECTION 4: Achievements
- Badge grid (3x3)
- Unlocked: Full color
- Locked: Grayscale, 50% opacity

SECTION 5: My Bag
- Tabs: Woods | Irons | Wedges | Putter
- List with brand/model
```

---

## 7. STATISTICS / ANALYTICS

### Prompt:
```
Create a statistics dashboard for AK Golf Academy.

LAYOUT:
- Dark green (#1B3A1B) background
- Padding: 32px

HEADER:
- "Performance Analytics" - 32px, white
- Date range selector: "Last 30 Days" dropdown
- "Export Report" button: outline style

FILTER TABS:
- Overview | Scoring | Driving | Approach | Short Game | Putting
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
- Scoring Average: 78.4 (Forest Green)
- Consistency: 3.2
- Improvement: ↓ 1.8 (Lime)
- Rounds: 8

DETAILED SECTIONS (accordion):
- Driving stats
- Approach stats
- Short game stats
- Putting stats

INSIGHTS:
- Card with lime left border
- "AI Insights" badge
- Personalized recommendation
```

---

## 8. COACH DASHBOARD

### Prompt:
```
Create a coach dashboard for AK Golf Academy.

LAYOUT:
- Dark green (#1B3A1B) background
- Sidebar + main content

SIDEBAR:
- "Coach Portal" logo
- Navigation: Dashboard | Schedule | Players | Notes | Analytics | Earnings
- User profile at bottom

MAIN CONTENT:

HEADER:
- "Welcome back, Coach Hansen"
- "You have 4 sessions today"
- Quick actions: Block Time | Add Note | Message

TODAY'S SCHEDULE (priority):
- Panel with timeline
- 4 sessions listed
- Each: Time | Player | Type | Location | Action button

MY PLAYERS:
- Grid of player cards
- Avatar, name, handicap
- Last session, next session
- Quick actions

RECENT NOTES:
- List of recent session notes
- Player name, date, summary

METRICS:
- Sessions this month: 47
- Satisfaction: 4.9/5
- Revenue: $4,560
```

---

## 9. COURSE MAP / GPS

### Prompt:
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
- Hole number
- Par
- Distance
- Handicap index
- Aerial photo
- Tips from pro

GPS MODE:
- Your position marker
- Distance to green
- Distance to hazards
- Club recommendation
```

---

## 10. MOBILE SCREENS

### Mobile Dashboard Prompt:
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
- Welcome message
- Weather widget
- Next session card (prominent)
- Quick stats (horizontal scroll)
- Recent rounds list
- Actions grid (2x2)

BOTTOM NAV:
- 5 icons: Home | Schedule | Stats | Coach | Profile
- Active: Lime
- Height: 64px + safe area
```

---

## 11. LEADERBOARD

### Prompt:
```
Create a tournament leaderboard for AK Golf Academy.

LAYOUT:
- Dark green background
- Tournament header with image
- Filter tabs: Overall | By Category | By Hole

LEADERBOARD TABLE:
- Position column (1, 2, 3...)
- Player name + avatar
- Country flag
- Score (relative to par)
- Today column
- Thru column (holes played)

TOP 3 HIGHLIGHT:
- Special styling for 1st, 2nd, 3rd
- Gold, silver, bronze accents

PLAYER CARD (click to expand):
- Detailed stats
- Round breakdown
- Scorecard view
```

---

## 12. SETTINGS

### Prompt:
```
Create settings page for AK Golf Academy.

LAYOUT:
- Dark green background
- 2-column: Sidebar menu | Content area

SIDEBAR:
- Account
- Notifications
- Privacy
- Appearance
- Payment
- Help

CONTENT SECTIONS:
- Profile settings
- Password change
- Email preferences
- Push notifications
- Privacy settings
- Theme toggle (dark/light)
- Payment methods
- Subscription details

FORM ELEMENTS:
- Inputs with lime focus
- Toggle switches (lime when on)
- Save buttons (lime bg)
```

---

## 13. ONBOARDING / WELCOME

### Prompt:
```
Create onboarding flow for AK Golf Academy.

LAYOUT:
- Full-screen dark green
- 3-4 steps

STEP 1: Welcome
- Large "AK GOLF" logo
- Tagline: "Elevate Your Game"
- "Get Started" button

STEP 2: Profile Setup
- Upload photo
- Enter name
- Set handicap
- Select home course

STEP 3: Preferences
- What do you want to improve?
- How often do you play?
- Preferred coach style

STEP 4: Complete
- Welcome message
- "Start Your Journey" button
- Skip option to dashboard
```

---

## 14. NOTIFICATIONS / INBOX

### Prompt:
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
- All | Sessions | Social | System

EMPTY STATE:
- "No new notifications"
- Bell icon
```

---

## 15. PRICING / MEMBERSHIP

### Prompt:
```
Create pricing page for AK Golf Academy.

LAYOUT:
- Dark green background
- Centered content

HEADER:
- "Choose Your Membership"
- "Unlock your full potential"

PRICING CARDS (3):
- Starter: $12/month
- Pro (popular): $17/month
- Enterprise: $97/month

CARD STYLING:
- Dark panel with border
- Pro card: Lime border highlight
- "Popular" badge on Pro
- Feature list with checkmarks
- CTA button per card

FEATURES COMPARISON:
- Table below cards
- Checkmarks for included features
```

---

## 16. HELP / SUPPORT

### Prompt:
```
Create help center for AK Golf Academy.

LAYOUT:
- Dark green background
- Search bar (prominent)
- Category cards

CATEGORIES:
- Getting Started
- Booking Sessions
- Tracking Scores
- Using Analytics
- Account Settings
- Contact Support

FAQ ACCORDION:
- Expandable questions
- Lime accent on open

CONTACT:
- Email form
- Live chat button
- Phone number
```

---

## 17. TOURNAMENTS / EVENTS

### Prompt:
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
- "Register" button

TABS:
- Upcoming | Registered | Past

DETAIL VIEW:
- Full tournament info
- Registration form
- Leaderboard (if live)
- Course info
```

---

## 18. CLUBHOUSE / COMMUNITY

### Prompt:
```
Create community page for AK Golf Academy.

LAYOUT:
- Dark green background
- Feed-style layout

SECTIONS:
- Activity feed
- Groups/Clubs
- Challenges
- Leaderboards

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

## 19. EQUIPMENT / BAG

### Prompt:
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

## 20. VIDEO ANALYSIS

### Prompt:
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

## 📝 BRUK I STITCH

1. Kopier prompten for skjermen du vil lage
2. Erstatt [VARIABLER] med ønsket innhold
3. Lim inn i Stitch
4. Generer skjermen
5. Juster basert på resultat

**Tips:** Alle skjermer følger samme design system for konsistens!
