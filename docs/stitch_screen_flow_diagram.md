# AK Golf Portal - Brukerflyt Diagram

## Hovedflyter (User Flows)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AK GOLF PORTAL FLOWS                              │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
FLOW 1: FØRSTEGANGSBRUKER (New User Onboarding)
═══════════════════════════════════════════════════════════════════════════════

    ┌─────────────────┐
    │  Splash Screen  │  90a3264f45114d56a4c40dae79c84288
    │   (Landing)     │
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │    Welcome      │  711019453aff4c89a8a2ceff3813d0bf
    │   Onboarding    │
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │  Registration   │  d7e6a5163e3045b4a8697ace669c7ac5
    │   (Setup Flow)  │
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │  Choose Path    │
    │  Player / Coach │
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │  Main Dashboard │  0e5825b11bc54b9f8fcf61748d3c367c
    │  (Bento Grid)   │
    └─────────────────┘

═══════════════════════════════════════════════════════════════════════════════
FLOW 2: INNLOGGING (Returning User)
═══════════════════════════════════════════════════════════════════════════════

    ┌─────────────────┐
    │  Splash Screen  │
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │   Login Screen  │  3b89fbc64a05428d9e4c0f518d33afe5
    │  (Auth Screen)  │
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │  Main Dashboard │  0e5825b11bc54b9f8fcf61748d3c367c
    └─────────────────┘

═══════════════════════════════════════════════════════════════════════════════
FLOW 3: BOOKING-FLYT (Book a Session)
═══════════════════════════════════════════════════════════════════════════════

    ┌─────────────────┐
    │    Dashboard    │  0e5825b11bc54b9f8fcf61748d3c367c
    └────────┬────────┘
             │ "Book Time"
             ▼
    ┌─────────────────┐
    │  Booking Hub    │  f725865757c84484a1b6df0072d1c56a
    │  (Overview)     │
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────┐   ┌──────────────┐
│ Calendar │   │  Quick Book  │
│  View    │   │  (Time Slot) │
│ 46485... │   │  b4cb1693... │
└────┬─────┘   └──────┬───────┘
     │                │
     └────────┬───────┘
              ▼
    ┌─────────────────┐
    │  Select Service │  3543eaae9af145df99ba7d89345e1086
    │  (Lesson Type)  │
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │  Choose Coach   │  7ff90a85d2864b5f958541ce0530d080
    │  / Facility     │
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │  Confirmation   │  182dff7afdcb4ba3ba540973825f9ccb
    └─────────────────┘

═══════════════════════════════════════════════════════════════════════════════
FLOW 4: TRENING & COACHING (Training)
═══════════════════════════════════════════════════════════════════════════════

    ┌─────────────────┐
    │    Dashboard    │
    └────────┬────────┘
             │ "Training"
             ▼
    ┌─────────────────┐
    │ Training Hub    │  eed96d62cfa44378afadc70a1eda05a1
    │ (Programs List) │
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────┐   ┌──────────────┐
│  My Plan │   │  Book Coach  │
│ 50914... │   │  63ccb5a3... │
└────┬─────┘   └──────┬───────┘
     │                │
     ▼                ▼
┌──────────┐   ┌──────────────┐
│ Session  │   │  Analytics   │
│ Detail   │   │  3c87e6e9... │
└──────────┘   └──────────────┘

═══════════════════════════════════════════════════════════════════════════════
FLOW 5: STATISTIKK & ANALYTICS (Performance)
═══════════════════════════════════════════════════════════════════════════════

    ┌─────────────────┐
    │    Dashboard    │
    └────────┬────────┘
             │ "Stats"
             ▼
    ┌─────────────────┐
    │  Stats Overview │  7857f53c8cea4b55b405908058cb88d2
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────┐   ┌──────────────┐
│ Detailed │   │  Performance │
│ Analytics│   │   Trends     │
│ 234f6... │   │  9cf7e77c... │
└────┬─────┘   └──────┬───────┘
     │                │
     └────────┬───────┘
              ▼
    ┌─────────────────┐
    │  Data Viz       │  a48c263161b6438183ff294c84ae0e2d
    │  (Charts)       │
    └─────────────────┘

═══════════════════════════════════════════════════════════════════════════════
FLOW 6: SPILL & SCORE (Game Tracking)
═══════════════════════════════════════════════════════════════════════════════

    ┌─────────────────┐
    │    Dashboard    │
    └────────┬────────┘
             │ "Play"
             ▼
    ┌─────────────────┐
    │  Game Hub       │  5bc65549d32d44428e6ff46e9ee7a4a8
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────┐   ┌──────────────┐
│ New Round│   │   History    │
│ Score    │   │   d255b...   │
│ 8e4a4... │   └──────────────┘
└────┬─────┘
     ▼
┌──────────┐
│ Round    │
│ Tracking │
└──────────┘

═══════════════════════════════════════════════════════════════════════════════
FLOW 7: KOMMUNIKASJON (Messaging)
═══════════════════════════════════════════════════════════════════════════════

    ┌─────────────────┐
    │    Dashboard    │
    └────────┬────────┘
             │ "Messages"
             ▼
    ┌─────────────────┐
    │  Inbox          │  2bd9de43b8d74906bf8c4d71196b5894
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────┐   ┌──────────────┐
│  Chat    │   │ Notifications│
│ fd137... │   │  93045b...   │
└──────────┘   └──────────────┘

═══════════════════════════════════════════════════════════════════════════════
FLOW 8: PROFIL & INNSTILLINGER (Profile & Settings)
═══════════════════════════════════════════════════════════════════════════════

    ┌─────────────────┐
    │    Dashboard    │
    └────────┬────────┘
             │ "Profile"
             ▼
    ┌─────────────────┐
    │  Profile Hub    │  51c42aa118ac4616b79fd099d3a69b8e
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────┐   ┌──────────────┐
│ Edit     │   │  Settings    │
│ Profile  │   │  bd2a1f...   │
│ bb0f6... │   └──────┬───────┘
└──────────┘          │
                      ▼
             ┌──────────────┐
             │ Preferences  │
             │ 8f71ad2d...  │
             └──────────────┘

═══════════════════════════════════════════════════════════════════════════════
FLOW 9: ADMIN (Administration)
═══════════════════════════════════════════════════════════════════════════════

    ┌─────────────────┐
    │  Admin Portal   │  44483c913a1540de821db97747fb5b53
    └────────┬────────┘
             │
    ┌────────┴────────┬────────────────┐
    │                 │                │
    ▼                 ▼                ▼
┌──────────┐   ┌──────────────┐  ┌──────────┐
│  Users   │   │   Academy    │  │  System  │
│ 4c79b... │   │   9cbb8...   │  │ 16ad6... │
└──────────┘   └──────────────┘  └──────────┘

═══════════════════════════════════════════════════════════════════════════════
FLOW 10: MOBIL-FLYTER (Mobile Flows)
═══════════════════════════════════════════════════════════════════════════════

Alle desktop-flyter har mobile ekvivalenter:

Desktop Screen → Mobile Screen
────────────────────────────────
Dashboard → 370125fb0f25480697055e6ef1d3be3a
Booking   → 210ce986508540b5ab8cefc6e309da31
Schedule  → 550e8e52e2c34f98b64208cd0512b4a9
Profile   → 90fe88d5f1cd4fd180848cbfdd16c053
Stats     → a75fb3e7ff384af582ac33b3d8e21262
Settings  → 07945b5783884a1290aa7e6827958d7d
Coaching  → 856e1431ac224a6690e79c98f6481b33
Game      → baf7f66d9fb2476b8bca100fc60a3ce2
Messages  → e08e88fb4a5e4c249c821354816de7c8
Academy   → 4192141a9bc1448caaae514dda45dad6

```

## Skjermkoblinger (Screen Connections)

### Hovednavigasjon (Main Navigation)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Dashboard  │◄───►│   Booking   │◄───►│  Training   │
│  (Home)     │     │  (Schedule) │     │  (Coaching) │
└──────┬──────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Stats     │◄───►│    Game     │◄───►│  Messages   │
│ (Analytics) │     │  (Play)     │     │  (Chat)     │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dashboard Widgets → Screens
```
Dashboard (Bento Grid)
├── Next Session Widget ──► Booking Detail
├── Stats Widget ─────────► Analytics
├── Training Widget ──────► Coaching
├── Messages Widget ──────► Inbox
└── Quick Book Widget ────► Booking Flow
```

## Anbefalt Rekkefølge i Stitch (Recommended Layout)

### Horisontal organisering (X-akse):
```
Kolonne 1: Kolonne 2:   Kolonne 3:   Kolonne 4:   Kolonne 5:
Auth/      Dashboard    Booking      Training     Stats/
Onboarding              Flow         & Coaching   Analytics

Kolonne 6:   Kolonne 7:   Kolonne 8:   Kolonne 9:
Game/        Messages     Profile/     Admin/
Score        & Comm       Settings     Management
```

### Vertikal organisering (Y-akse):
```
Rad 1 (y=0):     Splash, Login, Onboarding
Rad 2 (y=5000):  Dashboard variants
Rad 3 (y=10000): Booking screens
Rad 4 (y=15000): Training screens
Rad 5 (y=20000): Stats/Analytics
Rad 6 (y=25000): Game/Score
Rad 7 (y=30000): Messages
Rad 8 (y=35000): Profile/Settings
Rad 9 (y=40000): Admin
Rad 10 (y=80000+): Mobile screens
```
