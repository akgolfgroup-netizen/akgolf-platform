# AK Golf - Heritage Grid Komplett Dokument

## 📋 INNHOLDSFORTEGNELSE

1. [Design System](#1-design-system)
2. [Tekst & Innhold](#2-tekst--innhold)
3. [Skjerm-prompts](#3-skjerm-prompts)
4. [Brukerflyt](#4-brukerflyt)

---

## 1. DESIGN SYSTEM

### Brand DNA
**"Quiet Luxury meets Clinical Precision"**
Rolex/Tennis aesthetic. Warm, inviting, mathematically precise. Light mode only.

### Fargepalett (STRIKT - bruk eksakt disse)

| Token | Hex | Bruk |
|-------|-----|------|
| Background | #F5F1E8 | Page background (Warm Alabaster) |
| Surface | #FFFFFF | Cards, modals |
| Surface Muted | #FAF8F3 | Secondary cards |
| Primary | #2D5A27 | Forest Green - sidebar, headers |
| Primary Dark | #1E3D1A | Hover states |
| Accent/CTA | #DFFF00 | Vibrant Lime - buttons only |
| Accent Hover | #B8D400 | Lime hover |
| Text Primary | #333333 | Main text (Rich Grey) |
| Text Secondary | #666666 | Descriptions |
| Text Muted | #999999 | Metadata |
| Border | rgba(45,90,39,0.1) | Subtle borders |
| Success | #22C55E | Status indicators |
| Error | #EF4444 | Errors |

**VIKTIG: NO DARK MODE - Light mode ONLY**

### Typografi
- **Headlines:** DM Sans, 600-700 weight
- **Body:** DM Sans, 400 weight
- **Labels:** DM Sans, 500, uppercase, tracking wide
- **Monospace:** JetBrains Mono for data/numbers

### Spacing (4px base)
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px

### Border Radius
- sm: 8px (inputs, small elements)
- md: 12px (buttons)
- lg: 16px (cards)
- xl: 24px (large containers)
- full: 9999px (pills, avatars)

### Komponenter

#### Primary Button
- Background: #DFFF00 (Vibrant Lime)
- Text: #2D5A27 (Forest Green)
- Padding: 12px 24px
- Radius: 12px (md)
- Font: 14px, 600 weight, uppercase
- Shadow: subtle 0 2px 8px rgba(223,255,0,0.3)

#### Secondary Button
- Background: transparent
- Border: 1.5px solid #2D5A27
- Text: #2D5A27
- Same padding/radius

#### Cards
- Background: #FFFFFF
- Radius: 16px (lg)
- Padding: 24px
- Shadow: 0 4px 16px rgba(45,90,39,0.06)
- Border: 1px solid rgba(45,90,39,0.08)

#### Sidebar (Forest Green)
- Background: #2D5A27
- Width: 260px
- Active item: #DFFF00 background, #2D5A27 text
- Inactive item: transparent, #E5E1D8 text
- Hover: rgba(223,255,0,0.1) background

#### Input Fields
- Background: #FAF8F3
- Border: 1px solid rgba(45,90,39,0.15)
- Radius: 12px
- Height: 48px
- Focus: border-color #2D5A27

### Layout Principles
- Bento-grid: CSS Grid, 12-column system
- Gap: 24px between cards
- Page padding: 32px
- Max-width: 1440px centered

### Data Visualization
- Charts: Forest Green (#2D5A27) primary line
- Accent: Lime (#DFFF00) for highlights
- Grid lines: rgba(45,90,39,0.1)
- Background: transparent or white

### Animations (150ms default)
- Transitions: ease-out
- Hover scale: 1.02
- Card lift: translateY(-2px) on hover

### The "No Decoration" Rule
- No gradients except lime CTA buttons
- No heavy shadows
- No borders stronger than 10% opacity
- Whitespace defines hierarchy

---

## 2. TEKST & INNHOLD

### 2.1 Globale Tekster

#### Navigasjon
| Element | Tekst |
|---------|-------|
| Logo | "AK GOLF" |
| Nav Item 1 | "Programs" |
| Nav Item 2 | "Coaches" |
| Nav Item 3 | "Pricing" |
| Nav Item 4 | "About" |
| Nav CTA | "Sign In" |

#### Footer
| Seksjon | Lenker |
|---------|--------|
| About | About Us, Our Story, Careers, Press |
| Programs | Private Lessons, Group Clinics, Playing Lessons, Junior Academy |
| Support | Help Center, Contact Us, FAQs, Accessibility |
| Connect | Instagram, Facebook, Twitter, YouTube |
| Copyright | "© 2025 AK Golf Academy. All rights reserved." |

### 2.2 Landing Page Tekster

#### Hero Section
| Element | Tekst |
|---------|-------|
| Hovedoverskrift | "Master Your Game" |
| Undertekst | "Elite golf coaching for players who demand excellence" |
| CTA Primary | "START YOUR JOURNEY" |
| CTA Secondary | "VIEW PROGRAMS" |

#### Features Section
| Kort | Tittel | Beskrivelse |
|------|--------|-------------|
| 1 | "Personal Coaching" | "One-on-one sessions with certified PGA professionals tailored to your game." |
| 2 | "Track Progress" | "Advanced analytics and statistics to measure your improvement over time." |
| 3 | "Book Sessions" | "Seamless online scheduling. Book your preferred coach and time slot in seconds." |
| 4 | "Elite Community" | "Join a network of dedicated golfers. Share experiences and grow together." |

#### Stats Bar
| Tall | Label |
|------|-------|
| "500+" | "Players Trained" |
| "50+" | "Certified Coaches" |
| "98%" | "Satisfaction Rate" |

#### Testimonial
| Element | Tekst |
|---------|-------|
| Sitat | "AK Golf transformed my game. The personalized coaching and detailed analytics helped me lower my handicap by 8 strokes in just 6 months." |
| Navn | "Marcus Johansen" |
| Tittel | "PGA Tour Player" |

#### Final CTA
| Element | Tekst |
|---------|-------|
| Overskrift | "Ready to Elevate Your Game?" |
| Undertekst | "Join hundreds of golfers who have transformed their game with AK Golf Academy." |
| CTA Primary | "GET STARTED TODAY" |
| CTA Secondary | "Learn more about our programs →" |

### 2.3 Login Tekster

| Element | Tekst |
|---------|-------|
| Venstre overskrift | "Welcome Back" |
| Venstre undertekst | "Continue your journey to mastering the game." |
| Quote | "The harder you work, the luckier you get." |
| Form tittel | "Sign In to Your Account" |
| Email label | "EMAIL ADDRESS" |
| Password label | "PASSWORD" |
| Remember me | "Remember me" |
| Forgot password | "Forgot password?" |
| Sign in button | "SIGN IN" |
| Divider | "OR" |
| Google login | "Continue with Google" |
| Apple login | "Continue with Apple" |
| Sign up link | "Don't have an account? Sign up" |
| Security badge | "🔒 Secured with 256-bit encryption" |

### 2.4 Dashboard Tekster

| Element | Tekst |
|---------|-------|
| Velkomst | "Good morning, Marcus" |
| Dato format | "Wednesday, January 15, 2025" |
| Next Session label | "UPCOMING SESSION" |
| Session tittel | "Driver Fitting with Coach Andersen" |
| Session tid | "Tomorrow, 10:00 AM - 11:30 AM" |
| Session sted | "Driving Range, Bay 3" |
| Handicap label | "HANDICAP INDEX" |
| Last Round label | "LAST ROUND" |
| Weekly Goals label | "WEEKLY GOALS" |
| Recent Feedback label | "RECENT FEEDBACK" |
| Coach navn | "Coach Hansen" |
| Coach note | "Great improvement on your iron play. Focus on tempo for next session." |
| Quick Actions | "Book Session" | "View Stats" | "Message Coach" | "Upload Round" |

### 2.5 Booking Tekster

| Element | Tekst |
|---------|-------|
| Page title | "Book a Session" |
| Page subtitle | "Choose the type of session you want to book" |
| Step 1 | "Service" |
| Step 2 | "Coach" |
| Step 3 | "Confirm" |
| Service 1 tittel | "Private Lesson" |
| Service 1 beskrivelse | "One-on-one coaching tailored to your specific needs. Perfect for focused improvement." |
| Service 1 tid | "60 or 90 minutes" |
| Service 1 pris | "From 1,200 NOK" |
| Service 1 features | "Personalized instruction" | "Video analysis included" | "Practice plan provided" |
| Service 2 tittel | "Group Clinic" |
| Service 2 beskrivelse | "Learn alongside other golfers. Great for social learning and cost-effective coaching." |
| Service 2 tid | "120 minutes" |
| Service 2 pris | "From 600 NOK" |
| Service 2 features | "Small groups (max 6)" | "Specific focus areas" | "Social atmosphere" |
| Service 3 tittel | "Playing Lesson" |
| Service 3 beskrivelse | "On-course coaching. Learn strategy, course management, and shot selection in real play." |
| Service 3 tid | "9 or 18 holes" |
| Service 3 pris | "From 2,500 NOK" |
| Service 3 features | "Course strategy" | "Shot selection" | "Mental game coaching" |
| Filter tabs | "All" | "Beginner" | "Intermediate" | "Advanced" |
| Continue button | "Continue" |
| Back link | "Back" |

### 2.6 Profil Tekster

| Element | Tekst |
|---------|-------|
| Navn | "Marcus Johansen" |
| Handle | "@marcusj" |
| Badge | "Pro Member" |
| Bio | "Aspiring scratch golfer. Working on my short game and mental approach." |
| Lokasjon | "Oslo, Norway" |
| Member since | "January 2023" |
| Edit Profile | "Edit Profile" |
| Share Profile | "Share Profile" |
| Performance header | "PERFORMANCE" |
| View Details | "View Details →" |
| Stats labels | "Scoring Average" | "Fairways Hit" | "Greens in Reg" | "Putts per Round" |
| Recent Rounds header | "RECENT ROUNDS" |
| View All | "View All" |
| Coaching History header | "COACHING SESSIONS" |
| Book Next Session | "Book Next Session" |
| Achievements header | "ACHIEVEMENTS" |
| My Bag header | "MY BAG" |
| Update Equipment | "Update Equipment" |

### 2.7 Statistikk Tekster

| Element | Tekst |
|---------|-------|
| Page title | "Performance Analytics" |
| Date range | "Last 30 Days" |
| Export Report | "Export Report" |
| Compare toggle | "Compare to previous period" |
| Filter tabs | "Overview" | "Scoring" | "Driving" | "Approach" | "Short Game" | "Putting" |
| Chart header | "SCORING TREND" |
| Stats labels | "SCORING AVERAGE" | "SCORING STD DEV" | "HANDICAP TREND" | "ROUNDS THIS MONTH" |
| Driving section | "DRIVING" |
| Approach section | "APPROACH SHOTS" |
| Short Game section | "SHORT GAME" |
| Putting section | "PUTTING" |
| AI Insights badge | "AI INSIGHTS" |
| AI Insights text | "Your driving accuracy has improved 8% since last month. Focus on approach shots from 100-150 yards for maximum scoring improvement." |
| View practice plan | "View personalized practice plan →" |
| Comparison header | "How you compare" |
| CTAs | "Schedule Practice Session" | "Share with Coach" | "Download Full Report" |

### 2.8 Coach Dashboard Tekster

| Element | Tekst |
|---------|-------|
| Welcome | "Welcome back, Coach Hansen" |
| Notification | "You have 4 sessions today" |
| Quick actions | "Block Time" | "Add Note" | "Message" |
| Today header | "TODAY - WEDNESDAY, JAN 15" |
| Sessions | "09:00 - Marcus Johansen - Driver Fitting" | "10:30 - Emma Larsen - Putting Lesson" | "13:00 - Ole Pedersen - Playing Lesson" | "15:30 - Group Clinic - 6 players" |
| Check In button | "Check In" |
| In Progress badge | "In Progress" |
| Prepare button | "Prepare" |
| View Roster | "View Roster" |
| Players header | "ACTIVE PLAYERS (24)" |
| Recent Notes header | "RECENT SESSION NOTES" |
| Metrics | "Sessions This Month" | "Player Satisfaction" | "Revenue" |
| Events header | "Group Clinics This Week" |
| Quick stats | "Average session rating: 4.8" | "Response time: 2.3 hours" | "Player retention: 94%" |

---

## 3. SKJERM-PROMPTS

### 3.1 Landing Page

```
Create a premium landing page for AK Golf Academy with Heritage Grid design system.

HERO SECTION:
- Full-width hero with Warm Alabaster (#F5F1E8) background
- Large headline: "[LANDING_HERO_HEADLINE]" in Forest Green (#2D5A27), 48px, DM Sans 700 weight
- Subheadline: "[LANDING_HERO_SUBHEADLINE]" in Text Secondary (#666666), 18px
- Two CTAs side by side:
  * Primary: "[LANDING_CTA_PRIMARY]" - Vibrant Lime (#DFFF00) background, Forest Green text, 12px radius, uppercase, 14px 600 weight, padding 12px 24px
  * Secondary: "[LANDING_CTA_SECONDARY]" - transparent background, 1.5px Forest Green border, Forest Green text
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
- Card 1: "[LANDING_FEATURE_1_TITLE]" - "[LANDING_FEATURE_1_DESC]"
- Card 2: "[LANDING_FEATURE_2_TITLE]" - "[LANDING_FEATURE_2_DESC]"
- Card 3: "[LANDING_FEATURE_3_TITLE]" - "[LANDING_FEATURE_3_DESC]"
- Card 4: "[LANDING_FEATURE_4_TITLE]" - "[LANDING_FEATURE_4_DESC]"

STATS BAR:
- Full-width section with Surface Muted (#FAF8F3) background
- 3 columns centered:
  * "[LANDING_STAT_1_NUMBER]" / "[LANDING_STAT_1_LABEL]" - Numbers in JetBrains Mono, 32px, Forest Green
  * "[LANDING_STAT_2_NUMBER]" / "[LANDING_STAT_2_LABEL]" - Numbers in Lime (#DFFF00) for accent
  * "[LANDING_STAT_3_NUMBER]" / "[LANDING_STAT_3_LABEL]" - Numbers in Forest Green
- Labels: DM Sans 500, uppercase, 12px, letter-spacing 0.05em, #999999

TESTIMONIAL SECTION:
- White card, 16px radius, centered, max-width 800px
- Large quote icon in Forest Green at top
- Quote text: "[LANDING_TESTIMONIAL_QUOTE]" - DM Sans 400 italic, 20px, #333333
- Avatar: 64px circle, Forest Green border 2px
- Name: "[LANDING_TESTIMONIAL_NAME]" - DM Sans 600, 16px
- Title: "[LANDING_TESTIMONIAL_TITLE]" - DM Sans 400, 14px, #666666

FINAL CTA SECTION:
- Forest Green (#2D5A27) background
- Heading: "[LANDING_FINAL_CTA_HEADLINE]" - White text, 36px, DM Sans 700
- Subtext: "[LANDING_FINAL_CTA_SUBTEXT]" - White 80% opacity, 16px
- Primary CTA: "[LANDING_FINAL_CTA_BUTTON]" - Vibrant Lime background, Forest Green text, pill-shaped (full radius)
- Secondary link: "[LANDING_FINAL_CTA_LINK] →" - White text, underline on hover

NAVIGATION (Sticky):
- Height: 64px, white background with subtle shadow
- Logo: "[LOGO_TEXT]" - Forest Green, DM Sans 700, 24px
- Nav items: "[NAV_ITEM_1]" | "[NAV_ITEM_2]" | "[NAV_ITEM_3]" | "[NAV_ITEM_4]" - DM Sans 500, 14px, #333333
- CTA: "[NAV_CTA]" - Forest Green text, 12px radius border

FOOTER:
- Surface Muted background
- 4 columns: "[FOOTER_COL_1]" | "[FOOTER_COL_2]" | "[FOOTER_COL_3]" | "[FOOTER_COL_4]"
- Copyright: "[COPYRIGHT_TEXT]"
- Social icons: Forest Green, 24px
```

### 3.2 Login / Authentication

```
Create an elegant login screen for AK Golf Academy with Heritage Grid design system.

LAYOUT:
- Split-screen design: Left side content, Right side form
- Left side (45%): Full-height Forest Green (#2D5A27) background
  * Large heading: "[LOGIN_LEFT_HEADLINE]" - White text, 48px, DM Sans 700
  * Subtext: "[LOGIN_LEFT_SUBTEXT]" - White 80%, 18px
  * Decorative golf ball illustration (subtle, 10% opacity white)
  * Quote at bottom: "[LOGIN_QUOTE]" - White 60%, 14px italic

Right side (55%): Warm Alabaster (#F5F1E8) background
- Centered form container, max-width 400px
- Logo at top: "[LOGO_TEXT]" - Forest Green, 32px
- Form title: "[LOGIN_FORM_TITLE]" - #333333, 24px, DM Sans 600
- Input fields:
  * Email: Label "[LOGIN_EMAIL_LABEL]" uppercase, DM Sans 500, 12px, #666666
    Input: #FAF8F3 background, 12px radius, 48px height, 1px border rgba(45,90,39,0.15)
    Focus: border-color #2D5A27
  * Password: Label "[LOGIN_PASSWORD_LABEL]" uppercase
    Same styling + "Show/Hide" toggle icon
- "[LOGIN_REMEMBER_ME]" checkbox: Custom styled, Forest Green when checked
- "[LOGIN_FORGOT_PASSWORD]" link: Forest Green, 14px, right-aligned
- Primary CTA: "[LOGIN_BUTTON]" - Vibrant Lime background, Forest Green text, full-width, 48px height
- Divider: "[LOGIN_DIVIDER]" with horizontal lines, #999999, 12px
- Social login buttons:
  * "[LOGIN_GOOGLE]" - White background, subtle shadow, Google icon
  * "[LOGIN_APPLE]" - White background, subtle shadow, Apple icon
- Bottom text: "[LOGIN_BOTTOM_TEXT]" - #666666 + Forest Green link

SECURITY BADGE:
- Small text at bottom: "[LOGIN_SECURITY]" - #999999, 12px
```

### 3.3 Player Dashboard (Bento Grid)

```
Create a player dashboard with bento-grid layout for AK Golf Academy using Heritage Grid design system.

PAGE STRUCTURE:
- Sidebar (260px fixed): Forest Green (#2D5A27) background
  * Logo: "[LOGO_TEXT]" at top, white text, 24px
  * Navigation items with icons:
    - Dashboard (active): Lime (#DFFF00) background pill, Forest Green text
    - My Schedule
    - Statistics
    - Coaching
    - Community
    - Settings
  * User profile at bottom: Avatar + "[USER_NAME]" + "[USER_BADGE]" badge

- Main content: Warm Alabaster (#F5F1E8) background
  * Header: "[DASHBOARD_WELCOME], [USER_FIRST_NAME]" - 32px, DM Sans 700, #333333
  * Date: "[CURRENT_DATE]" - 14px, #999999

BENTO GRID LAYOUT (12-column):

CARD 1 - NEXT SESSION (spans 8 columns):
- White background, 16px radius
- Header: "[DASHBOARD_NEXT_SESSION_LABEL]" - Label uppercase, 12px, #999999
- Content:
  * "[SESSION_TITLE]" - 24px, DM Sans 600
  * "[SESSION_TIME]" - 16px, #666666
  * Location icon + "[SESSION_LOCATION]"
- Footer: "[ACTION_RESCHEDULE]" (text link) + "[ACTION_CHECK_IN]" (Lime button)

CARD 2 - HANDICAP INDEX (spans 4 columns):
- White background, 16px radius
- "[DASHBOARD_HANDICAP_LABEL]" label
- Large number: "[HANDICAP_VALUE]" - JetBrains Mono, 48px, Forest Green
- Trend: "[HANDICAP_TREND]" - Lime color, small arrow
- Sparkline chart showing trend

CARD 3 - RECENT STATS (spans 4 columns):
- White background, 16px radius
- "[DASHBOARD_LAST_ROUND_LABEL]" label
- Score: "[LAST_SCORE]" - 36px, Forest Green
- Course: "[LAST_COURSE]" - 14px, #666666
- Stats row: "[STAT_FAIRWAYS]" | "[STAT_GIR]" | "[STAT_PUTTS]"

CARD 4 - PRACTICE GOALS (spans 4 columns):
- White background, 16px radius
- "[DASHBOARD_WEEKLY_GOALS_LABEL]" label
- Progress ring: "[GOALS_PERCENT]"% complete
- "[GOALS_COMPLETED]"
- Next: "[NEXT_PRACTICE]"

CARD 5 - COACH NOTES (spans 4 columns):
- White background, 16px radius
- "[DASHBOARD_RECENT_FEEDBACK_LABEL]" label
- Coach avatar + "[COACH_NAME]"
- "[COACH_NOTE_TEXT]" - 14px italic
- "[ACTION_VIEW_ALL_NOTES] →"

CARD 6 - QUICK ACTIONS (spans 12 columns, horizontal):
- White background, 16px radius
- 4 action buttons side by side:
  * "[ACTION_BOOK_SESSION]" + Calendar icon
  * "[ACTION_VIEW_STATS]" + Chart icon
  * "[ACTION_MESSAGE_COACH]" + Chat icon
  * "[ACTION_UPLOAD_ROUND]" + Upload icon
- Each: White card, subtle border, icon in Forest Green

BOTTOM ROW:
- Recent Activity feed (spans 8)
- Upcoming Tournaments (spans 4)
```

### 3.4 Booking - Select Service

```
Create a booking flow step 1: Select Service for AK Golf Academy with Heritage Grid design system.

PAGE STRUCTURE:
- Header: "[BOOKING_TITLE]" - 32px, DM Sans 700, centered
- Subheader: "[BOOKING_SUBTITLE]" - 16px, #666666
- Progress indicator: Step 1 of 3 ("[STEP_1]" → "[STEP_2]" → "[STEP_3]")
  * Active step: Forest Green circle with number
  * Inactive: Gray circle
  * Connector line: Forest Green between steps

SERVICE CARDS (3 options, grid layout):

CARD 1 - PRIVATE LESSON:
- White background, 16px radius, hover: translateY(-2px)
- Selected state: 2px Forest Green border
- Icon: User/Coach, 48px, Forest Green
- Title: "[SERVICE_1_TITLE]" - 24px, DM Sans 600
- Description: "[SERVICE_1_DESC]"
- Duration: "[SERVICE_1_DURATION]"
- Price: "[SERVICE_1_PRICE]" - Forest Green, 18px
- Features list:
  * "[SERVICE_1_FEATURE_1]"
  * "[SERVICE_1_FEATURE_2]"
  * "[SERVICE_1_FEATURE_3]"
- "[ACTION_SELECT]" button: Outline style

CARD 2 - GROUP CLINIC:
- Same card structure
- Icon: Users, 48px
- Title: "[SERVICE_2_TITLE]"
- Description: "[SERVICE_2_DESC]"
- Duration: "[SERVICE_2_DURATION]"
- Price: "[SERVICE_2_PRICE]"
- Features:
  * "[SERVICE_2_FEATURE_1]"
  * "[SERVICE_2_FEATURE_2]"
  * "[SERVICE_2_FEATURE_3]"

CARD 3 - PLAYING LESSON:
- Same card structure
- Icon: Flag/Golf, 48px
- Title: "[SERVICE_3_TITLE]"
- Description: "[SERVICE_3_DESC]"
- Duration: "[SERVICE_3_DURATION]"
- Price: "[SERVICE_3_PRICE]"
- Features:
  * "[SERVICE_3_FEATURE_1]"
  * "[SERVICE_3_FEATURE_2]"
  * "[SERVICE_3_FEATURE_3]"

BOTTOM BAR (sticky):
- Warm Alabaster background, subtle top border
- "[LABEL_SELECTED]: [SELECTED_SERVICE]" - left side
- "[SELECTED_PRICE]" - price
- "[ACTION_CONTINUE]" button: Vibrant Lime, Forest Green text - right side
- "[ACTION_BACK]" link: text only, left of continue

FILTER OPTIONS (above cards):
- Tabs: "[FILTER_ALL]" | "[FILTER_BEGINNER]" | "[FILTER_INTERMEDIATE]" | "[FILTER_ADVANCED]"
- Active tab: Forest Green background pill, white text
- Inactive: transparent, Forest Green text
```

### 3.5 Player Profile

```
Create a player profile page for AK Golf Academy with Heritage Grid design system.

PAGE STRUCTURE:
- Two-column layout: Left (320px) sticky sidebar, Right (flex) main content

LEFT SIDEBAR:
- White card, 16px radius, sticky top 32px
- Profile header:
  * Large avatar: 120px circle, Forest Green border 3px
  * Name: "[USER_FULL_NAME]" - 24px, DM Sans 700
  * Handle: "[USER_HANDLE]" - 14px, #999999
  * "[USER_BADGE]" badge: Lime background, Forest Green text, pill-shaped
- Stats row:
  * "[STAT_HANDICAP]" / "[LABEL_HANDICAP]"
  * "[STAT_ROUNDS]" / "[LABEL_ROUNDS]"
  * "[STAT_SESSIONS]" / "[LABEL_SESSIONS]"
- Bio: "[USER_BIO]"
- Location: "[USER_LOCATION]" with pin icon
- "[LABEL_MEMBER_SINCE]": "[MEMBER_DATE]"
- "[ACTION_EDIT_PROFILE]" button: Outline style, full width
- "[ACTION_SHARE_PROFILE]" link: text only

RIGHT CONTENT:

SECTION 1 - PERFORMANCE OVERVIEW:
- White card, 16px radius
- Header: "[PROFILE_PERFORMANCE_HEADER]" with "[ACTION_VIEW_DETAILS] →" link
- 4 stat cards in a row:
  * "[STAT_LABEL_1]" - "[STAT_VALUE_1]" - "[STAT_TREND_1]"
  * "[STAT_LABEL_2]" - "[STAT_VALUE_2]" - "[STAT_TREND_2]"
  * "[STAT_LABEL_3]" - "[STAT_VALUE_3]" - "[STAT_TREND_3]"
  * "[STAT_LABEL_4]" - "[STAT_VALUE_4]" - "[STAT_TREND_4]"
- Mini trend chart below

SECTION 2 - RECENT ROUNDS:
- White card, 16px radius
- Header: "[PROFILE_RECENT_ROUNDS_HEADER]" + "[ACTION_VIEW_ALL]"
- List of 5 rounds:
  * Each row: Date | Course | Score | Differential
  * Best score highlighted with Lime accent
  * Hover: Surface Muted background
- "[ACTION_UPLOAD_ROUND]" button: Lime CTA

SECTION 3 - COACHING HISTORY:
- White card, 16px radius
- Header: "[PROFILE_COACHING_HEADER]"
- Timeline view:
  * Vertical line: Forest Green, 2px
  * Dots: Lime for completed, gray for upcoming
  * Each item: Date | Coach Name | Session Type | Notes preview
- "[ACTION_BOOK_NEXT]" button

SECTION 4 - ACHIEVEMENTS:
- White card, 16px radius
- Header: "[PROFILE_ACHIEVEMENTS_HEADER]"
- Badge grid (3x3):
  * "[ACHIEVEMENT_1]"
  * "[ACHIEVEMENT_2]"
  * "[ACHIEVEMENT_3]"
  * "[ACHIEVEMENT_4]"
  * "[ACHIEVEMENT_5]"
  * "[ACHIEVEMENT_6]"
- Locked badges: Grayscale, 50% opacity

SECTION 5 - EQUIPMENT:
- White card, 16px radius
- Header: "[PROFILE_EQUIPMENT_HEADER]"
- Category tabs: "[TAB_WOODS]" | "[TAB_IRONS]" | "[TAB_WEDGES]" | "[TAB_PUTTER]"
- List with brand/model for each club
- "[ACTION_UPDATE_EQUIPMENT]" link
```

### 3.6 Statistics / Analytics Dashboard

```
Create a comprehensive statistics dashboard for AK Golf Academy with Heritage Grid design system.

PAGE HEADER:
- "[STATS_TITLE]" - 32px, DM Sans 700
- Date range selector: "[DATE_RANGE]" dropdown
- "[ACTION_EXPORT_REPORT]" button: Outline style
- "[TOGGLE_COMPARE]" toggle: Compare to previous period

FILTER BAR:
- Tabs: "[TAB_OVERVIEW]" | "[TAB_SCORING]" | "[TAB_DRIVING]" | "[TAB_APPROACH]" | "[TAB_SHORT_GAME]" | "[TAB_PUTTING]"
- Active: Forest Green background, white text
- Inactive: transparent, Forest Green text

MAIN CHART SECTION (full width):
- White card, 16px radius
- "[CHART_HEADER]" header
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
- "[STATS_LABEL_1]" label
- "[STATS_VALUE_1]" - JetBrains Mono, 48px, Forest Green
- Sparkline showing trend
- "[STATS_DETAIL_1]"

CARD 2 - CONSISTENCY:
- "[STATS_LABEL_2]" label
- "[STATS_VALUE_2]" - 48px
- "[STATS_DETAIL_2]"
- Progress bar

CARD 3 - IMPROVEMENT:
- "[STATS_LABEL_3]" label
- "[STATS_VALUE_3]" - Lime color, large
- "[STATS_DETAIL_3]"
- Area chart

CARD 4 - ROUNDS PLAYED:
- "[STATS_LABEL_4]" label
- "[STATS_VALUE_4]" - 48px
- "[STATS_DETAIL_4]"
- Calendar heatmap mini

DETAILED BREAKDOWN (accordion sections):

SECTION 1 - DRIVING:
- Expandable header
- Stats grid:
  * "[DRIVING_STAT_1]"
  * "[DRIVING_STAT_2]"
  * "[DRIVING_STAT_3]"
- Bar chart: Distance distribution

SECTION 2 - APPROACH SHOTS:
- "[APPROACH_STAT_1]"
- "[APPROACH_STAT_2]"
- "[APPROACH_STAT_3]"
- Scatter plot: Distance vs Proximity

SECTION 3 - SHORT GAME:
- "[SHORT_GAME_STAT_1]"
- "[SHORT_GAME_STAT_2]"
- "[SHORT_GAME_STAT_3]"
- Pitch shot accuracy by distance

SECTION 4 - PUTTING:
- "[PUTTING_STAT_1]"
- "[PUTTING_STAT_2]"
- "[PUTTING_STAT_3]"
- "[PUTTING_STAT_4]"
- Heat map: Putting success by distance

INSIGHTS SECTION:
- White card with Lime left border (4px)
- "[INSIGHTS_BADGE]" badge
- "[INSIGHTS_TEXT]"
- "[ACTION_VIEW_PLAN] →"

COMPARISON SECTION:
- "[COMPARISON_HEADER]" to:
  * Your handicap group
  * All AK Golf members
  * PGA Tour averages
- Radar chart showing 6 skill areas

BOTTOM CTAs:
- "[ACTION_SCHEDULE]" - Lime button
- "[ACTION_SHARE_COACH]" - Outline button
- "[ACTION_DOWNLOAD]" - Text link
```

### 3.7 Coach Dashboard

```
Create a coach dashboard for AK Golf Academy with Heritage Grid design system.

SIDEBAR (Coach view):
- Forest Green background
- "[COACH_PORTAL_LOGO]" logo
- Navigation:
  * Dashboard (active)
  * My Schedule
  * My Players
  * Session Notes
  * Analytics
  * Earnings

MAIN CONTENT:

HEADER:
- "[COACH_WELCOME], [COACH_NAME]" - 32px
- "[COACH_NOTIFICATION]" - notification
- Quick actions: "[ACTION_BLOCK_TIME]" | "[ACTION_ADD_NOTE]" | "[ACTION_MESSAGE]"

TODAY'S SCHEDULE (priority card):
- White card, full width
- "[TODAY_HEADER]" header
- Timeline view (vertical):
  * "[SESSION_1]"
  * "[SESSION_2]"
  * "[SESSION_3]"
  * "[SESSION_4]"
- Each item: Time | Player avatar + name | Session type | Location | Status/Action

MY PLAYERS GRID:
- "[PLAYERS_HEADER] ([PLAYERS_COUNT])" header with search
- Player cards (4 per row):
  * Avatar, Name, Handicap
  * "[LABEL_LAST_SESSION]": "[LAST_SESSION_DATE]"
  * "[LABEL_NEXT_SESSION]": "[NEXT_SESSION_DATE]"
  * Progress indicator: "[STATUS_ON_TRACK]" / "[STATUS_ATTENTION]"
  * Quick actions: Message | Schedule | Notes

RECENT ACTIVITY:
- White card
- "[RECENT_NOTES_HEADER]" header
- List:
  * "[NOTE_1]"
  * "[NOTE_2]"
  * "[NOTE_3]"
- "[ACTION_VIEW_ALL_NOTES]" link

PERFORMANCE METRICS:
- 3 cards:
  * "[METRIC_1_LABEL]" - "[METRIC_1_VALUE]" - "[METRIC_1_TREND]"
  * "[METRIC_2_LABEL]" - "[METRIC_2_VALUE]" - "[METRIC_2_DETAIL]"
  * "[METRIC_3_LABEL]" - "[METRIC_3_VALUE]" - "[METRIC_3_DETAIL]"

UPCOMING EVENTS:
- "[EVENTS_HEADER]"
- "[EVENT_1]"
- "[EVENT_2]"

QUICK STATS:
- "[QUICK_STAT_1]"
- "[QUICK_STAT_2]"
- "[QUICK_STAT_3]"
```

### 3.8 Mobile Dashboard

```
Create a mobile dashboard for AK Golf Academy with Heritage Grid design system.

SPECIFICATIONS:
- Width: 390px (iPhone standard)
- Full Heritage Grid styling
- Touch-friendly targets (min 44px)
- Bottom navigation bar

HEADER:
- Hamburger menu (left)
- "[LOGO_TEXT]" logo (center)
- Notification bell with badge (right)

WELCOME SECTION:
- "[MOBILE_WELCOME], [USER_FIRST_NAME]" - 24px
- "[CURRENT_DATE]" - 14px, #999999
- Weather widget: "[LOCATION] | [TEMPERATURE] | [WEATHER_ICON]"

NEXT SESSION CARD (prominent):
- Full width, white, 16px radius
- "[MOBILE_UPCOMING_LABEL]" label
- "[SESSION_TITLE]" - 20px
- "[SESSION_TIME]" - 16px
- "[SESSION_COACH_LABEL]": "[COACH_NAME]" - 14px
- "[ACTION_CHECK_IN]" button: Full width, Lime

QUICK STATS (horizontal scroll):
- Cards: "[STAT_HANDICAP_LABEL]" [HANDICAP_VALUE] | "[STAT_LAST_SCORE_LABEL]" [LAST_SCORE] | "[STAT_ROUNDS_LABEL]" [ROUNDS_VALUE]
- Each: White card, 120px width

RECENT ACTIVITY:
- "[MOBILE_RECENT_ROUNDS]" header + "[ACTION_VIEW_ALL]"
- List items (3):
  * "[ROUND_1]"
  * "[ROUND_2]"
- Score in Forest Green or red based on target

ACTIONS GRID (2x2):
- "[ACTION_BOOK]" | "[ACTION_STATS]"
- "[ACTION_MESSAGE]" | "[ACTION_UPLOAD]"
- Icon + text, white cards

BOTTOM NAVIGATION:
- 5 icons: Home | Schedule | Stats | Coach | Profile
- Active: Forest Green
- Inactive: #999999
- Height: 64px + safe area
```

---

## 4. BRUKERFLYT

### Hovedflyter

```
FLOW 1: FØRSTEGANGSBRUKER
Splash → Welcome → Registration → Choose Path → Dashboard

FLOW 2: INNLOGGING
Splash → Login → Dashboard

FLOW 3: BOOKING
Dashboard → Booking Hub → Select Service → Choose Coach → Confirmation

FLOW 4: TRENING
Dashboard → Training Hub → My Plan / Book Coach

FLOW 5: STATISTIKK
Dashboard → Stats Overview → Detailed Analytics

FLOW 6: SPILL
Dashboard → Game Hub → New Round / History

FLOW 7: KOMMUNIKASJON
Dashboard → Inbox → Chat / Notifications

FLOW 8: PROFIL
Dashboard → Profile Hub → Edit Profile / Settings
```

### Skjermkoblinger

```
Dashboard Widgets → Screens:
├── Next Session Widget → Booking Detail
├── Stats Widget → Analytics
├── Training Widget → Coaching
├── Messages Widget → Inbox
└── Quick Book Widget → Booking Flow

Main Navigation:
Home ↔ Schedule ↔ Training ↔ Stats ↔ Game ↔ Messages ↔ Profile
```

---

## 📝 SLIK BRUKER DU DETTE DOKUMENTET

1. **Finn seksjonen** du vil endre (Tekst, Prompt, etc.)
2. **Endre teksten** i hakeparenteser [LIK_DETTE]
3. **Kopier prompten** du vil bruke
4. **Gå til Stitch** og generer skjermen
5. **Gjenta** for neste skjerm

**Tips:** Søk etter tekst i hakeparenteser for å finne alt som kan tilpasses!
