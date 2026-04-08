# AK Golf Platform — System Architecture Map

**Version:** 2.0 | **Date:** April 2026  
**Concept:** "Aktiv livet ut" (Active for Life) — Inclusive golf ecosystem from ages 3 to 90+

---

## 1. High-Level Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Next.js 16 App Router<br/>React 19 + TypeScript]
        PWA[PWA Manifest<br/>Installable App]
        MOB[Mobile-First<br/>Responsive Design]
    end

    subgraph "Presentation Layer"
        UI[UI Components<br/>Tailwind CSS v4]
        MOTION[Framer Motion<br/>Animations]
        CHART[Recharts<br/>Data Visualization]
    end

    subgraph "Application Layer"
        AUTH[Auth Service<br/>Supabase Auth]
        API[API Routes<br/>Next.js API]
        ACTIONS[Server Actions<br/>Mutations]
        RBAC[RBAC Middleware<br/>Role-based Access]
    end

    subgraph "Business Logic Layer"
        BOOKING[Booking Engine]
        COACHING[Coaching System]
        TRACKMAN[TrackMan Integration]
        MATCHI[Matchi API Gateway]
        STRIPE[Stripe Payments]
        AI[AI Services<br/>Claude API]
    end

    subgraph "Data Layer"
        PRISMA[Prisma ORM]
        POSTGRES[(PostgreSQL)]
        REDIS[(Redis Cache<br/>Sessions + Rate Limit)]
        STORAGE[(Supabase Storage<br/>Videos + Files)]
    end

    subgraph "External Integrations"
        STRIPE_API[Stripe API]
        MATCHI_API[Matchi API]
        TRACKMAN_API[TrackMan API]
        DATAGOLF[DataGolf API]
        NOTION[Notion API]
        RESEND[Resend Email]
        TWILIO[Twilio SMS]
        GOOGLE[Google Calendar]
    end

    WEB --> UI
    UI --> MOTION
    WEB --> API
    WEB --> ACTIONS
    
    API --> AUTH
    ACTIONS --> AUTH
    AUTH --> RBAC
    
    API --> BOOKING
    API --> COACHING
    API --> TRACKMAN
    API --> STRIPE
    API --> AI
    
    BOOKING --> MATCHI
    
    BOOKING --> PRISMA
    COACHING --> PRISMA
    TRACKMAN --> PRISMA
    STRIPE --> PRISMA
    AI --> PRISMA
    
    PRISMA --> POSTGRES
    PRISMA --> REDIS
    
    TRACKMAN --> TRACKMAN_API
    MATCHI --> MATCHI_API
    STRIPE --> STRIPE_API
    AI --> DATAGOLF
    COACHING --> NOTION
    BOOKING --> RESEND
    BOOKING --> TWILIO
    COACHING --> GOOGLE
```

---

## 2. Module Interaction Diagram

```mermaid
graph LR
    subgraph "Landing Pages"
        LP_MAIN[Main Landing<br/>AK Golf Group]
        LP_ACADEMY[Academy Landing]
        LP_JUNIOR[Junior Academy]
        LP_VTG[Veien til Golf]
    end

    subgraph "Booking System"
        B_PUBLIC[Public Booking]
        B_PORTAL[Portal Booking]
        B_MATCHI[Matchi Sync]
        B_PRICING[Dynamic Pricing]
    end

    subgraph "Member Portal"
        P_DASH[Personal Dashboard]
        P_TRACKMAN[Data Vault<br/>TrackMan]
        P_COACHING[Coaching History]
        P_TRAINING[Training Plans]
        P_SOCIAL[Community Spaces]
    end

    subgraph "Admin Dashboard"
        A_ANALYTICS[Mission Control<br/>KPI Tracking]
        A_CALENDAR[Calendar Management]
        A_CRM[Student CRM]
        A_FINANCE[Revenue & Billing]
        A_CONTENT[Content Management]
    end

    LP_MAIN --> B_PUBLIC
    LP_ACADEMY --> B_PUBLIC
    LP_JUNIOR --> B_PUBLIC
    
    B_PUBLIC --> B_MATCHI
    B_PORTAL --> B_MATCHI
    B_MATCHI --> B_PRICING
    
    P_DASH --> P_TRACKMAN
    P_DASH --> P_COACHING
    P_DASH --> P_TRAINING
    P_DASH --> P_SOCIAL
    
    A_ANALYTICS --> A_CRM
    A_ANALYTICS --> A_FINANCE
    A_CRM --> P_DASH
    A_CALENDAR --> B_PUBLIC
```

---

## 3. Data Flow: Booking with Matchi Integration

```mermaid
sequenceDiagram
    participant User as User
    participant Portal as Portal UI
    participant API as API Gateway
    participant Booking as Booking Engine
    participant Matchi as Matchi API
    participant Stripe as Stripe API
    participant DB as PostgreSQL
    participant Email as Email Service

    User->>Portal: Select service & time
    Portal->>API: GET /slots?date=&service=
    API->>Booking: fetchAvailableSlots()
    Booking->>Matchi: checkAvailability()
    Matchi-->>Booking: return slots
    Booking-->>API: available slots
    API-->>Portal: display slots
    
    User->>Portal: Confirm booking
    Portal->>API: POST /booking
    API->>Booking: createBooking()
    Booking->>Matchi: reserveSlot()
    Matchi-->>Booking: reservation confirmed
    
    alt Payment Required
        Booking->>Stripe: createPaymentIntent()
        Stripe-->>Booking: client_secret
        Booking-->>API: payment required
        API-->>Portal: redirect to payment
        User->>Stripe: complete payment
        Stripe-->>API: webhook: payment.success
        API->>Booking: confirmPayment()
    end
    
    Booking->>Matchi: confirmReservation()
    Booking->>DB: save booking
    Booking->>Email: sendConfirmation()
    Email-->>User: booking confirmed
```

---

## 4. TrackMan Data Integration Flow

```mermaid
sequenceDiagram
    participant User as Student
    participant Portal as Portal UI
    participant API as API Gateway
    participant TrackMan as TrackMan Import
    participant Analysis as AI Analysis
    participant DB as PostgreSQL

    User->>Portal: Upload CSV / Connect Device
    Portal->>API: POST /trackman/import
    API->>TrackMan: parseSessionData()
    TrackMan->>TrackMan: validateFormat()
    TrackMan->>DB: storeRawData()
    
    TrackMan->>Analysis: generateInsights()
    Analysis->>DB: fetchHistoricalData()
    DB-->>Analysis: previous sessions
    Analysis->>Analysis: compareMetrics()
    Analysis->>Analysis: identifyPatterns()
    Analysis->>DB: storeInsights()
    
    API-->>Portal: import complete
    Portal->>API: GET /trackman/sessions
    API->>DB: fetchSessions()
    DB-->>API: session data + insights
    API-->>Portal: display data vault
    
    User->>Portal: View trends
    Portal->>API: GET /trackman/analytics
    API->>DB: aggregateMetrics()
    DB-->>API: trends & benchmarks
    API-->>Portal: render charts
```

---

## 5. Component Hierarchy

```mermaid
graph TD
    subgraph "Root Layout"
        RL[layout.tsx]
    end

    subgraph "Route Groups"
        RG_MARKETING[(marketing)]
        RG_PORTAL[(portal)]
        RG_API[(api)]
    end

    subgraph "Marketing Routes"
        M_HOME[page.tsx<br/>Hero + Stats]
        M_ACADEMY[academy/page.tsx]
        M_JUNIOR[junior-academy/page.tsx]
        M_BOOKING[booking/page.tsx]
    end

    subgraph "Portal Routes"
        P_LAYOUT[(dashboard)/layout.tsx<br/>Sidebar + Auth]
        P_DASH[(dashboard)/page.tsx]
        P_ADMIN[admin/analytics/page.tsx]
        P_TRACKMAN[trackman/page.tsx]
        P_BOOKINGS[bookinger/page.tsx]
    end

    subgraph "Shared Components"
        C_UI[components/ui/]
        C_PORTAL[components/portal/]
        C_WEBSITE[components/website/]
    end

    RL --> RG_MARKETING
    RL --> RG_PORTAL
    RL --> RG_API
    
    RG_MARKETING --> M_HOME
    RG_MARKETING --> M_ACADEMY
    RG_MARKETING --> M_JUNIOR
    RG_MARKETING --> M_BOOKING
    
    RG_PORTAL --> P_LAYOUT
    P_LAYOUT --> P_DASH
    P_LAYOUT --> P_ADMIN
    P_LAYOUT --> P_TRACKMAN
    P_LAYOUT --> P_BOOKINGS
    
    M_HOME --> C_WEBSITE
    M_ACADEMY --> C_WEBSITE
    P_DASH --> C_PORTAL
    P_ADMIN --> C_PORTAL
```

---

## 6. Database Schema Relationships (Simplified)

```mermaid
erDiagram
    USER ||--o{ BOOKING : makes
    USER ||--o{ COACHING_SESSION : attends
    USER ||--o{ TRACKMAN_SESSION : owns
    USER ||--o{ HANDICAP_ENTRY : has
    USER ||--o{ TRAINING_LOG : creates
    USER ||--o{ TOURNAMENT_PLAN : plans
    
    INSTRUCTOR ||--o{ BOOKING : receives
    INSTRUCTOR ||--o{ COACHING_SESSION : conducts
    INSTRUCTOR ||--o{ SERVICE_TYPE : offers
    
    BOOKING ||--|| COACHING_SESSION : extends
    BOOKING ||--o{ GROUP_PARTICIPANT : includes
    BOOKING ||--o{ PAYMENT_TRANSACTION : generates
    
    SERVICE_TYPE ||--o{ BOOKING : categorizes
    SERVICE_TYPE ||--o{ PRICING_RULE : applies
    
    TRACKMAN_SESSION ||--o{ TRACKMAN_SHOT : contains
    
    TRAINING_PLAN ||--o{ TRAINING_PLAN_WEEK : contains
    TRAINING_PLAN_WEEK ||--o{ TRAINING_PLAN_SESSION : schedules
    
    TOURNAMENT ||--o{ PLAYER_TOURNAMENT_PLAN : planned
    USER ||--o{ PLAYER_TOURNAMENT_PLAN : participates

    USER {
        string id
        string email
        string name
        UserRole role
        SubscriptionTier tier
        float handicap
    }

    BOOKING {
        string id
        datetime startTime
        datetime endTime
        BookingStatus status
        int amount
        PaymentMethod paymentMethod
    }

    COACHING_SESSION {
        string id
        string aiSummary
        string[] aiKeyPoints
        string[] techniquesCovered
        int progressRating
    }

    TRACKMAN_SESSION {
        string id
        datetime sessionDate
        json shots
        json averages
    }
```

---

## 7. Infrastructure & Deployment

```mermaid
graph TB
    subgraph "Vercel Edge Network"
        CDN[Global CDN<br/>Static Assets]
        EDGE[Edge Functions<br/>Middleware]
    end

    subgraph "Vercel Platform"
        FUNCTIONS[Serverless Functions<br/>API Routes]
        SSR[SSR/ISR<br/>Page Rendering]
        BUILD[Build Pipeline<br/>Next.js]
    end

    subgraph "Data Services"
        NEON[(Neon PostgreSQL<br/>Serverless DB)]
        UPSTASH[(Upstash Redis<br/>Rate Limit + Cache)]
        SUPABASE[(Supabase Storage<br/>Media Files)]
    end

    subgraph "External APIs"
        EXT_STRIPE[Stripe]
        EXT_MATCHI[Matchi]
        EXT_TRACKMAN[TrackMan]
        EXT_AI[Anthropic Claude]
    end

    CDN --> EDGE
    EDGE --> FUNCTIONS
    EDGE --> SSR
    
    FUNCTIONS --> NEON
    FUNCTIONS --> UPSTASH
    FUNCTIONS --> SUPABASE
    
    FUNCTIONS --> EXT_STRIPE
    FUNCTIONS --> EXT_MATCHI
    FUNCTIONS --> EXT_TRACKMAN
    FUNCTIONS --> EXT_AI
```

---

## 8. Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        WAF[Cloudflare WAF]
        RATE[Rate Limiting<br/>Upstash Redis]
        AUTH[Supabase Auth<br/>JWT Tokens]
        RBAC[Role-Based Access]
        ENCRYPT[Encryption<br/>At Rest + Transit]
    end

    subgraph "Compliance"
        GDPR[GDPR Compliance]
        PRIVACY[Privacy by Design]
        AUDIT[Audit Logging]
    end

    CLIENT[Client Browser] --> WAF
    WAF --> RATE
    RATE --> AUTH
    AUTH --> RBAC
    RBAC --> API[API Routes]
    
    API --> ENCRYPT
    ENCRYPT --> DB[(Database)]
    
    API --> GDPR
    API --> PRIVACY
    API --> AUDIT
```

---

## 9. API Gateway Structure

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/portal/public/*` | GET | Public data (slots, services) | None |
| `/api/portal/bookings/*` | POST/PUT | Booking CRUD operations | Required |
| `/api/portal/trackman/*` | POST/GET | TrackMan data import/query | Required |
| `/api/portal/ai/*` | POST | AI coaching analysis | Required |
| `/api/portal/admin/*` | ALL | Admin-only operations | Admin only |
| `/api/portal/webhooks/stripe` | POST | Stripe webhooks | Signature |
| `/api/portal/cron/*` | GET | Scheduled tasks | Cron secret |

---

## 10. Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript | App framework |
| **Styling** | Tailwind CSS v4, CSS Variables | Design system |
| **Animation** | Framer Motion 12.x | UI animations |
| **Auth** | Supabase Auth | Identity management |
| **Database** | PostgreSQL (Neon), Prisma ORM | Data persistence |
| **Cache** | Upstash Redis | Session + rate limiting |
| **Storage** | Supabase Storage | File uploads |
| **Payments** | Stripe | Billing & subscriptions |
| **Email** | Resend, React Email | Transactional emails |
| **SMS** | Twilio | Booking reminders |
| **AI** | Anthropic Claude | Coaching insights |
| **External** | Matchi API, TrackMan API, DataGolf | Golf integrations |

---

**Next Steps:** See `/docs/IMPLEMENTATION.md` for detailed component specifications and `/docs/DATA_MODEL.md` for complete database schema.
