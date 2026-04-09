# AK Golf - Stitch Prompts v2
## Rollebasert Arkitektur: Spillerportal + Mission Control

> To separate økosystemer med rollebasert tilgangskontroll (RBAC)

---

## ARKITEKTUR-OVERSIKT

```
┌─────────────────────────────────────────────────────────────┐
│                    OFFENTLIG LANDING                        │
│                    (akgolf.no)                              │
│  ┌──────────────────┐      ┌──────────────────────────────┐ │
│  │  SPILLER-INNLOGG │      │  TRENER/COACH INNLOGG        │ │
│  │  "Spillerportal" │      │  "Mission Control"           │ │
│  │                  │      │                              │ │
│  │  • Elever        │      │  • Super Admin (deg)         │ │
│  │  • Juniorer      │      │  • Hovedtrenere              │ │
│  │  • Academy       │      │  • Assistent-trenere         │ │
│  │  • Drop-in       │      │  • Inviterte (gjeste-coacher)│ │
│  └────────┬─────────┘      └──────────────┬───────────────┘ │
└───────────┼───────────────────────────────┼─────────────────┘
            │                               │
            ▼                               ▼
┌──────────────────────────┐  ┌──────────────────────────────────────┐
│    SPILLER-PORTAL        │  │        MISSION CONTROL               │
│    (Elev-dashboard)      │  │        (Admin-dashboard)             │
│                          │  │                                      │
│  ┌────────────────────┐  │  │  Rollebasert tilgang:                │
│  │ OVERSIKT           │  │  │  ┌─────────────────────────────────┐ │
│  │ Mine Bookinger     │  │  │  │ SUPER ADMIN (deg)               │ │
│  │ Treningsplan       │  │  │  │ • Full tilgang til alt          │ │
│  │ Treningsdagbok     │  │  │  │ • Brukeradministrasjon          │ │
│  │ Statistikk         │  │  │  │ • Økonomi & rapporter           │ │
│  │ Kalender           │  │  │  │ • System-innstillinger          │ │
│  ├────────────────────┤  │  │  │ • Rolle-tildeling               │ │
│  │ TRENING:           │  │  │  └─────────────────────────────────┘ │
│  │ • Trackman Tester  │  │  │  ┌─────────────────────────────────┐ │
│  │ • Øvelser          │  │  │  │ HOVEDTRENER                     │ │
│  ├────────────────────┤  │  │  │ • Mission Board                 │ │
│  │ KONTO:             │  │  │  │ • Alle elever & bookinger       │ │
│  │ • Profil           │  │  │  │ • Kalender & tilgjengelighet    │ │
│  │ • Historikk        │  │  │  │ • Analyse & rapporter           │ │
│  └────────────────────┘  │  │  │ • Fasiliteter                   │ │
│                          │  │  └─────────────────────────────────┘ │
│  Abonnement-nivåer:      │  │  ┌─────────────────────────────────┐ │
│  • VISITOR (begrenset)   │  │  │ ASSISTENT-TRENER                │ │
│  • ACADEMY (standard)    │  │  │ • Egen kalender                 │ │
│  • STARTER (utvidet)     │  │  │ • Egne elever                   │ │
│  • PRO (avansert)        │  │  │ • Begrenset analyse             │ │
│  • ELITE (premium)       │  │  │ • Ikke: økonomi, system         │ │
│                          │  │  └─────────────────────────────────┘ │
└──────────────────────────┘  │  ┌─────────────────────────────────┐ │
                              │  │ INVITERT/ GJESTE-COACH          │ │
                              │  │ • Begrenset tids-periode        │ │
                              │  │ • Spesifikke elever tildelt     │ │
                              │  │ • Kun visning, ikke admin       │ │
                              │  └─────────────────────────────────┘ │
                              └──────────────────────────────────────┘
```

---

## DEL 1: INNLOGGINGSSIDER

### LANDINGSSIDE - VALG AV PORTAL

**PROMPT - Portal Selector Landing:**
```
Create a dual-portal landing page for AK Golf Academy with two distinct entry points.

LAYOUT STRUCTURE:
- Hero section with AK Golf branding and tagline
- Two large portal cards side by side:
  
  LEFT CARD - "Spillerportal":
  * Icon: Golf player silhouette or club icon
  * Title: "Spillerportal"
  * Subtitle: "For elever og medlemmer"
  * Description: "Se dine bookinger, treningsplan, statistikk og mer"
  * CTA: "Logg inn som spiller"
  * Visual: Light, warm atmosphere (#FDF9F0)
  * Accent: AK Golf green (#2D6A4F)
  
  RIGHT CARD - "Mission Control":
  * Icon: Dashboard/control tower icon
  * Title: "Mission Control"
  * Subtitle: "For trenere og coacher"
  * Description: "Administrer bookinger, elever og academy-oversikt"
  * CTA: "Logg inn som trener"
  * Visual: Dark, professional atmosphere (#0A0D0A)
  * Accent: Neon lime (#D2F000)

VISUAL STYLE:
- Split design with clear visual distinction
- Left side: Warm, inviting, player-focused
- Right side: Professional, tech-forward, admin-focused
- Hover effects that slightly expand the cards
- Background: Subtle gradient or texture

INTERACTIONS:
- Cards lift and glow on hover
- Smooth transition to respective login pages
- Remember portal choice for returning users
- Quick contact/help link at bottom

MOBILE:
- Cards stack vertically
- Clear visual separation maintained
- Swipe hint between options
```

---

### SPILLERPORTAL - INNLOGGING

**PROMPT - Spillerportal Login:**
```
Create a player-focused login page for AK Golf Spillerportal.

LAYOUT STRUCTURE:
- Left side (or top on mobile): 
  * Large AK Golf Academy logo
  * Welcome message: "Velkommen tilbake"
  * Tagline: "Din vei til bedre golf"
  * Visual: Golf-related imagery or subtle patterns
  
- Right side (form area):
  * Login form with email/password
  * "Glemt passord?" link
  * "Opprett konto" for new players
  * Social login options (Google, Apple)
  * Subscription tier showcase (Academy, Starter, Pro, Elite)

VISUAL STYLE:
- Warm off-white background (#FDF9F0)
- AK Golf green accents (#2D6A4F)
- Clean, friendly typography
- Subtle golf ball texture or pattern
- Card-based form with soft shadow

FEATURES:
- Remember me checkbox
- Show/hide password toggle
- Error messages with helpful hints
- Success animation on login
- Onboarding flow for new users

BRANDING:
- Player-focused messaging
- Benefit-oriented copy
- Trust indicators (reviews, member count)
- "Hva får du?" feature preview section
```

---

### MISSION CONTROL - INNLOGGING

**PROMPT - Mission Control Login:**
```
Create a professional login page for AK Golf Mission Control.

LAYOUT STRUCTURE:
- Full dark mode design (#0A0D0A background)
- Centered login card with:
  * Mission Control logo (AK Golf + control tower icon)
  * "Mission Control" title with neon lime accent
  * Subtitle: "Professional Coaching Dashboard"
  * Email/password form
  * Role indicator (shows after first login)
  * "Forespør tilgang" for new coaches
  
- Security features visible:
  * Encryption badges
  * "Secure login" indicators
  * Session timeout info

VISUAL STYLE:
- Dark theme with neon lime (#D2F000) accents
- Glassmorphism card effect
- Tech-forward, professional aesthetic
- Subtle grid/tech pattern background
- Pulsing status indicators

FEATURES:
- Two-factor authentication option
- "Husk denne enheten" for trusted devices
- Role-based redirect after login
- Access request form for new trainers
- System status indicator ("All systems operational")

DIFFERENTIATION:
- Clearly different from player portal
- More security-focused messaging
- Professional, no-nonsense design
- Quick support contact for access issues
```

---

## DEL 2: ROLLEBASERT TILGANGSKONTROLL (RBAC)

### SUPER ADMIN - TILGANGSSTYRING

**PROMPT - Brukeradministrasjon / Rolle-tildeling:**
```
Create a user role management interface for Super Admin.

LAYOUT STRUCTURE:
- Header: "Brukere & Tilganger"
- User list with:
  * Name and email
  * Current role badge
  * Last active
  * Status (Active/Inactive/Pending)
  * Quick action dropdown
- Role assignment modal/panel:
  * User profile preview
  * Role selector dropdown:
    - Super Admin
    - Hovedtrener  
    - Assistent-trener
    - Invitert/Gjeste-coach
    - Spiller (Elev)
  * Permission matrix (visual grid)
  * Time-limited access toggle
  * Specific student assignments (for limited roles)

PERMISSION MATRIX VISUAL:
Grid showing:
- Rows: Features (Mission Board, Elever, Økonomi, etc.)
- Columns: Roles
- Cells: Checkmark/X/Partial
- Color coding: Full (green), Read-only (yellow), None (gray)

ROLE DESCRIPTIONS:
- Hover over role shows description
- Warning for sensitive permissions
- Inheritance indicator (Assistent < Hovedtrener)

AUDIT LOG:
- Recent permission changes
- Who granted access to whom
- Time stamps
- Revocation history

QUICK ACTIONS:
- Invite new user (with pre-selected role)
- Bulk role changes
- Deactivate/reactivate users
- Export user list
```

---

### SKJERM: TILGANGS-NIVÅ INDikATOR

**PROMPT - Top Bar med Rolle-indikator:**
```
Create a persistent top bar showing current user role and permissions.

LAYOUT:
- Fixed top bar across all Mission Control screens
- Left: Page title/breadcrumbs
- Center: Current role badge (color-coded)
  * Super Admin: Purple badge
  * Hovedtrener: Neon lime badge  
  * Assistent: Blue badge
  * Invitert: Orange badge with expiration date
- Right: 
  * User avatar
  * Notification bell
  * Quick switch (if multiple roles)
  * Logout

ROLE BADGE:
- Distinctive colors per role
- Hover shows permission summary
- Click expands to "Your Access" panel
- Expiration warning for time-limited roles

"YOUR ACCESS" PANEL:
- List of accessible features
- "Why can't I see X?" help links
- Request additional access button
- Current limitations explained

CONTEXTUAL HELP:
- Role-specific tooltips
- "As a [role], you can..." hints
- Upgrade path suggestions (for assistants)
```

---

## DEL 3: MISSION CONTROL - ROLLE-SPESSIFIKKE SKJERMER

### SUPER ADMIN - FULL DASHBOARD

**PROMPT - Super Admin Mission Board:**
```
Create the complete Mission Board for Super Admin with full system access.

FULL ACCESS INCLUDES:
1. Mission Board (standard)
2. User Management (roles, permissions, invites)
3. System Settings (global configurations)
4. Financial Overview (all revenue, payouts)
5. Academy Analytics (comprehensive KPIs)
6. All Coach Dashboards (view as any coach)
7. Global Calendar (all instructors)
8. Facility Management (all locations)
9. Content Management (email templates, exercises)
10. Integration Settings (Stripe, Google, etc.)

ADMIN-ONLY WIDGETS:
- System health status
- Revenue across all coaches
- New signups this week
- Churn rate indicator
- Coach performance comparison
- Integration status (all green checkmarks)
- Pending access requests

USER MANAGEMENT CARD:
- Quick stats: Total users, Active coaches, New this week
- Pending invitations list
- Recently deactivated users
- "Impersonate" button to view as other user

AUDIT SECTION:
- Recent system changes
- Permission modifications
- Financial transactions
- Security events

NAVIGATION:
- Expanded sidebar with admin-only items
- "Administration" section expanded by default
- Quick links to system-critical functions
- Search across all users and data
```

---

### HOVEDTRENER - MISSION BOARD

**PROMPT - Hovedtrener Dashboard:**
```
Create Mission Board for Head Coaches with comprehensive but limited access.

ACCESS SCOPE:
- All their own students
- All academy students (view-only for others)
- Full booking management
- Calendar and availability
- Analytics for their performance
- Facility booking
- Tournament management
- Reporting tools

NO ACCESS TO:
- System settings
- Financial overview (only their own revenue)
- User role management
- Other coaches' private notes
- Global configurations

DASHBOARD WIDGETS:
- Personal Mission Board stats
- Their students' progress overview
- Upcoming lessons (all their bookings)
- Student achievement highlights
- Facility usage this week
- Tournament preparation checklist

STUDENT OVERVIEW:
- Grid of all students (theirs + academy's)
- Visual distinction: "My students" vs "Academy students"
- Quick filter by: Handicap, Activity, Goals
- Student comparison tool

COLLABORATION:
- Hand-off notes to other coaches
- Shared student insights
- Group lesson planning
- Academy-wide announcements

ANALYTICS:
- Personal coaching metrics
- Student improvement rates
- Lesson type popularity
- Revenue tracking (personal only)
```

---

### ASSISTENT-TRENER - BEGRENSET DASHBOARD

**PROMPT - Assistent-trener Dashboard:**
```
Create a focused dashboard for Assistant Coaches with limited access.

ACCESS SCOPE:
- Only their assigned students
- Own calendar and availability
- Basic booking management (own only)
- Limited analytics (own performance only)
- View exercises and content

NO ACCESS TO:
- Other coaches' students
- Financial reports
- System settings
- User management
- Global analytics
- Other coaches' calendars

SIMPLIFIED LAYOUT:
- Clean, focused interface
- "My Students" as primary view
- Quick daily schedule
- Simple stat cards (less detailed)
- Guided workflows

STUDENT LIST:
- Only assigned students visible
- Clear assignment indicator
- Progress tracking per student
- Notes and homework management

BOOKING MANAGEMENT:
- Can create bookings for own students only
- Cannot modify other coaches' bookings
- Can view but not edit global calendar
- Availability settings for self only

UPGRADE PATH:
- "Become a Head Coach" information
- Requirements checklist
- Application button
- Progress toward promotion

SUPPORT:
- Help button prominently placed
- "Ask Head Coach" feature
- Tutorial videos
- Best practices guide
```

---

### INVITERT/GJESTE-COACH - TEMPORÆR TILGANG

**PROMPT - Invitert Coach View:**
```
Create a time-limited, restricted view for invited guest coaches.

ACCESS SCOPE:
- Specific students assigned by admin
- View-only for most data
- Can add notes and observations
- Cannot create bookings
- Cannot access financial data

TIME-LIMITED INDICATORS:
- Prominent expiration date banner
- Days remaining counter
- Renewal request button
- Automatic logout warning

RESTRICTED INTERFACE:
- "Guest Mode" watermark/badge
- Limited navigation (only essential items)
- Cannot export data
- Cannot delete anything
- All actions logged

STUDENT VIEW:
- Only pre-assigned students visible
- View student profile and history
- Add coaching notes
- Upload video analysis
- Cannot modify student data

COLLABORATION TOOLS:
- Share observations with head coach
- Suggest drill/exercise additions
- Comment on existing plans
- Message assigned students

EXPIRATION HANDLING:
- Grace period warnings (7, 3, 1 days)
- Automatic extension request
- Data preservation (notes remain after expiry)
- Reactivation process
```

---

## DEL 4: SPILLERPORTAL SKJERMER (Oppdaterte)

### SPILLERPORTAL - OVERSIKT

**PROMPT - Spiller Dashboard (Elev):**
```
Create a welcoming player dashboard for the Spillerportal.

CONTEXT:
- Player has logged in via Spillerportal landing
- Personalized, encouraging atmosphere
- Focus on progress and upcoming activities

LAYOUT:
- Welcome header with name and handicap
- Subscription tier badge (Academy/Starter/Pro/Elite)
- Bento grid layout:
  * Large: Next lesson countdown with instructor photo
  * Medium: Weekly training plan progress
  * Medium: Recent stats/handicap trend
  * Small: Quick actions (Book, Log, View Stats)
  * Wide: AI coaching insight
  * Small: Upcoming tournaments

PERSONALIZATION:
- Weather at home course
- Preferred instructor highlighted
- Recent achievements celebrated
- Suggested next steps

UPGRADE PROMPTS (if applicable):
- "Upgrade to Pro for AI training plans"
- Feature comparison teaser
- Trial upgrade button

ENCOURAGEMENT:
- Progress celebrations
- "Streak" indicators (consecutive weeks with activity)
- Peer comparisons (anonymized)
- Goal progress visualization

QUICK ACTIONS:
- Book next lesson (primary CTA)
- Log practice session
- View swing videos
- Contact coach
```

---

### SPILLERPORTAL - ABONNEMENT & TILGANG

**PROMPT - Spiller Abonnement Side:**
```
Create a subscription management page showing tier-based access.

SUBSCRIPTION TIERS DISPLAY:
- Current tier highlighted
- Side-by-side comparison of all tiers
- Visual feature checklist per tier

TIERS:
1. VISITOR (gratis/begrenset)
   - Basic profile
   - View public content
   - Limited statistics
   
2. ACADEMY (standard)
   - Full player dashboard
   - Book individual lessons
   - Basic training log
   
3. STARTER (utvidet)
   - Everything in Academy
   - AI training suggestions
   - Trackman test history
   
4. PRO (avansert)
   - Everything in Starter
   - Full AI training plans
   - Video analysis
   - Priority booking
   
5. ELITE (premium)
   - Everything in Pro
   - Unlimited AI coaching
   - Personal tournament planning
   - Direct coach messaging
   - Exclusive content

UPGRADE WORKFLOW:
- Feature comparison tool
- Pricing display
- Stripe integration
- Prorated upgrade calculation
- Confirmation and receipt

DOWNGRADE/PAUSE:
- Save data warning
- Pause option (for vacations)
- Downgrade path
- Refund policy info
```

---

## DEL 5: FELLES KOMPONENTER

### ROLLE-VISNING KOMPONENT

**PROMPT - Role-Based Component Wrapper:**
```
Create a reusable component system for role-based visibility.

COMPONENTS:

1. <RequireRole roles={['SUPER_ADMIN', 'HEAD_COACH']}>
   - Wraps content only visible to specific roles
   - Shows "No access" message for others
   - Optional: redirect to authorized area

2. <PermissionGate permission="MANAGE_BOOKINGS">
   - Granular permission checking
   - Can show read-only version if no write access
   - Graceful degradation

3. <FeatureToggle feature="AI_ASSISTANT">
   - Shows feature only if enabled for role
   - Upgrade prompt if not available
   - Beta indicator for new features

4. <RoleBadge role={user.role} />
   - Visual role indicator
   - Color-coded by role level
   - Hover for permission summary

5. <AccessRequest feature="analytics" />
   - Button to request additional access
   - Form with justification
   - Status tracking
   - Notification to admin

BEHAVIOR:
- Client-side role checking
- Server-side validation (security)
- Loading states while checking
- Error boundaries for access failures
```

---

## DEL 6: NAVIGASJONS-STRUKTUR

### SUPER ADMIN SIDEBAR

```
┌─ AK Golf Academy
├─ Mission Board ⭐
├─ ADMINISTRASJON
│  ├─ Brukere & Roller 👥
│  ├─ Tilganger & Permisjoner 🔐
│  ├─ System-innstillinger ⚙️
│  └─ Integrasjoner 🔌
├─ AKADEMY OVERSIKT
│  ├─ Alle Elever 👤
│  ├─ Alle Bookinger 📅
│  ├─ Kalender (Global) 🗓️
│  ├─ Fasiliteter 🏌️
│  ├─ Turneringer 🏆
│  └─ Økonomi 💰
├─ ANALYSE
│  ├─ Academy Analytics 📊
│  ├─ Coach Performance 👨‍🏫
│  ├─ Student Progress 📈
│  └─ Rapporter 📄
├─ INNHOLD
│  ├─ E-postmaler ✉️
│  ├─ Øvelser 🏋️
│  └─ Notifikasjoner 🔔
└─ MIN PROFIL
```

### HOVEDTRENER SIDEBAR

```
┌─ AK Golf Academy
├─ Mission Board ⭐
├─ MIN AKADEMY
│  ├─ Mine Elever 👤
│  ├─ Mine Bookinger 📅
│  ├─ Kalender 🗓️
│  ├─ Tilgjengelighet ⏰
│  └─ Kapasitet 📊
├─ AKADEMY (view-only for others)
│  ├─ Alle Elever (view) 👀
│  ├─ Fasiliteter 🏌️
│  └─ Turneringer 🏆
├─ ANALYSE
│  ├─ Min Analyse 📊
│  └─ Rapporter 📄
├─ VERKTØY
│  ├─ AI Assistent 🤖
│  ├─ Meldinger 💬
│  └─ E-postmaler ✉️
└─ MIN PROFIL
```

### ASSISTENT-TRENER SIDEBAR

```
┌─ AK Golf Academy
├─ Min Oversikt ⭐
├─ MINE ELEVER 👤
│  ├─ Student List
│  ├─ Bookinger
│  └─ Fremgang
├─ MIN KALENDER 🗓️
│  ├─ Timeplan
│  └─ Tilgjengelighet
├─ VERKTØY
│  ├─ Øvelser 🏋️
│  └─ Notater 📝
└─ MIN PROFIL
   └─ Be om mer tilgang ⬆️
```

### SPILLERPORTAL SIDEBAR

```
┌─ Spillerportal
├─ Oversikt ⭐
├─ BOOKING 📅
│  ├─ Mine Bookinger
│  ├─ Ny Booking
│  └─ Kalender
├─ TRENING 💪
│  ├─ Treningsplan
│  ├─ Treningsdagbok
│  ├─ Trackman Tester
│  └─ Øvelser
├─ STATISTIKK 📊
│  ├─ Min Statistikk
│  ├─ Strokes Gained
│  └─ Sammenligning
├─ HISTORIKK 📚
│  └─ Coaching-historikk
└─ KONTO 👤
   ├─ Min Profil
   ├─ Mål & Prestasjoner
   └─ Abonnement
```

---

## DEL 7: STITCH GENERERING - ANBEFALT REKKEFØLGE

### FASE 1: Infrastruktur (Start her)
1. **Portal Selector Landing** - Velg spiller/trener
2. **Spillerportal Login** - Elev-innlogging
3. **Mission Control Login** - Trener-innlogging

### FASE 2: Spillerportal (Elev-sider)
4. **Spiller Oversikt** - Hoveddashboard
5. **Mine Bookinger** - Bookingliste
6. **Treningsplan** - AI-plan visning
7. **Statistikk** - Spiller-statistikk

### FASE 3: Mission Control - Super Admin
8. **Super Admin Mission Board** - Full dashboard
9. **Brukeradministrasjon** - Rolle-tildeling
10. **System-innstillinger** - Globale configs

### FASE 4: Mission Control - Trenere
11. **Hovedtrener Dashboard** - Full trener-view
12. **Assistent-trener Dashboard** - Begrenset view
13. **Invitert Coach View** - Temporær tilgang

### FASE 5: Fellefunksjoner
14. **Kalender (alle roller)** - Rolle-tilpasset
15. **Elever/Spillere liste** - Ulike nivåer av detaljer
16. **Booking-håndtering** - Ulike permissions

---

## VIKTIGE DESIGN-PRINSIPPER

### 1. Tydelig Rolle-Indikator
- ALLTID vis hvilken rolle brukeren har
- Fargekoding på alle nivåer
- Tydelig på hva de IKKE har tilgang til

### 2. Sikkerhetsskiller
- Spillerportal og Mission Control skal føles helt forskjellige
- Aldri samme URL-struktur
- Separate autentiseringssystemer (kan være samme backend, men forskjellig UI)

### 3. Graceful Degradation
- Hvis en trener mister tilgang, vis "Lesemodus" i stedet for feil
- Behold data synlig, men ikke redigerbar
- Tydelig melding om hva som skjedde

### 4. Oppgraderingsstier
- Assistenter skal se hvordan de blir hovedtrenere
- Spillere skal se fordelene med høyere tier
- Tydelige CTA-er for å be om mer tilgang

---

*Generert for AK Golf Academy - Rollebasert Arkitektur*
*Spillerportal + Mission Control med RBAC*
