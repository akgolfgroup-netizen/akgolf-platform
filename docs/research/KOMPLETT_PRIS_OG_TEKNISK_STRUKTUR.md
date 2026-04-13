# Komplett Prisstruktur & Teknisk Arkitektur
## AK Golf Platform - Fra 0 til 20.000+ Brukere

**Dato:** April 2026  
**Mål:** Skalerbar struktur for exit på 50M+ NOK

---

## DEL 1: PRISSTRUKTUR - TRE LAG

### Overordnet Filosofi

```
FREEMIUM-SKYGGE:
┌─────────────────────────────────────────────────────────────────┐
│  🎯 MÅL: 80% gratis → 15% Pro → 5% Elite                        │
│                                                                  │
│  IKKE gi for mye gratis (da oppgraderer ingen)                  │
│  IKKE gi for lite gratis (da prøver ingen)                      │
│                                                                  │
│  REGEL: Gratis skal være "nesten nok" men frustrerende         │
│  når du vil bli bedre                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Pakke 1: GRATIS (AK Golf Start)

**Pris:** 0 kr  
**Målgruppe:** Nye golfere, de som vil prøve før de kjøper

```
TRENING (Training Planner):
───────────────────────────
✓ 3 aktive treningsplaner
✓ Basis AK-Formula filter (nivå, tid)
✓ Standard drill-bibliotek (30% av totalt)
✓ Enkel logging (score, slag)
✗ IUP-test tracking
✗ Personlig tilpasning
✗ Videoanalyse

ANALYSE (Stats & Performance):
──────────────────────────────
✓ Siste 5 runder statistikk
✓ Basis Strokes Gained (vs scratch)
✓ Enkel graf-trend
✗ DataGolf sammenligning
✗ Trend-analyse over tid
✗ Coaching-rapport

SPILL (DECADE Caddy):
─────────────────────
✓ GPS-avstander til green
✓ Scorecard (ubegrenset)
✓ 3 hull med DECADE-råd per runde
✗ Full DECADE caddy
✗ Mental scorecard
✗ Baneguide/notater

COACHING (Mission Board):
─────────────────────────
✓ Se offentlige program fra AK Academy
✗ Personlig coaching
✗ Oppgavestyring
✗ Kommunikasjon med coach
```

**Gratis-begrensninger som driver konvertering:**
- Maks 3 DECADE-hull per runde (etter hull 3: "Oppgrader for full caddy")
- Kun 5 runder historikk ("Oppgrader for ubegrenset historikk")
- Ingen sammenligning med Tour-data ("Se hvordan du matcher Tour-proffer")

### Pakke 2: PRO (AK Golf Player)

**Pris:** 149 kr/mnd eller 1.490 kr/år (17% rabatt)  
**Målgruppe:** Seriøse amatører, klubbspillere, juniorer

```
TRENING:
────────
✓ Ubegrensede treningsplaner
✓ Full AK-Formula med alle filter
✓ Komplett drill-bibliotek (100+)
✓ IUP-test tracking og historikk
✓ Personlig tilpasning basert på testresultater
✓ Video-opplasting (max 10 videoer)
✓ AI-treningsforslag

ANALYSE:
────────
✓ Ubegrenset historikk
✓ DataGolf sammenligning (vs HCP-grupper)
✓ Avansert Strokes Gained (vs din historikk)
✓ Trend-analyse med prediksjoner
✓ Sesongrapport
✓ Mål-setting og tracking

SPILL:
──────
✓ Ubegrenset DECADE caddy (alle hull)
✓ Kontekst-spredning (trening vs spill)
✓ Estimert spredning (fra HCP)
✓ Enkel baneguide
✓ Vær-integrasjon
✓ Del scorecard med venner
✗ Mental scorecard
✗ TrackMan-import
✗ Avanserte notater

COACHING:
─────────
✓ Tilgang til Mission Board via coach
✓ Oppgavestyring
✓ Kommunikasjon med coach
✓ Video-feedback (fra coach)
```

### Pakke 3: ELITE (AK Golf Pro)

**Pris:** 299 kr/mnd eller 2.990 kr/år (17% rabatt)  
**Målgruppe:** Elite-amatører, proffer, TrackMan-brukere

```
TRENING:
────────
✓ Alt fra Pro
✓ Ubegrenset video-lagring
✓ Prioritert AI-analyse
✓ Custom drill-opprettelse
✓ Integrasjon med coach (real-time)

ANALYSE:
────────
✓ Alt fra Pro
✓ DataGolf sammenligning (vs Tour)
✓ Avansert statistikk (scatter plots, heat maps)
✓ Eksporter data
✓ API-tilgang (for nerder)

SPILL:
──────
✓ Alt fra Pro
✓ Mental scorecard (obligatorisk i konkurranse)
✓ TrackMan-import & faktisk spredning
✓ Avansert baneguide (alle notater)
✓ Innspill-modus for turnering
✓ Historikk-sammenligning
✓ "Smart miss" kartlegging
✓ Lag deling (team-konkurranser)

COACHING:
─────────
✓ Alt fra Pro
✓ White-label profil ("Powered by Coach Navn")
✓ Prioritert support
✓ Early access til nye features

EKSTRA:
───────
✓ Dedikert support-kanal
✓ Invitasjon til AK Golf events
✓ Samarbeid med butikker (rabatter)
```

---

## DEL 2: HVA BRUKERE BETALER FOR - PSYKOLOGI

### Verdi-Hierarki

```
BRUKERNE BETALER MEST FOR:

1. INNSIKT DE IKKE KAN FÅ ANDRE STEDER (40% av verdi)
   ────────────────────────────────────────────────────
   • "Hvorfor scorer jeg dårligere i konkurranse?"
     → Mental tracking + kontekst-spredning
   
   • "Hvilken strategi skal jeg bruke på hull 7?"
     → DECADE caddy personlig for deg
   
   • "Hva er min svakhet vs Tour-proffer?"
     → DataGolf sammenligning

2. PERSONLIG TILPASNING (25% av verdi)
   ───────────────────────────────────
   • Trening basert på DINE tester
   • Strategi basert på DIN spredning
   • Coaching basert på DINE data

3. SAMMENHENGENDE SYSTEM (20% av verdi)
   ─────────────────────────────────────
   • Trening → Analyse → Spill → Coaching
   • Alt snakker sammen
   • Slippe 4 forskjellige apper

4. BETALINGSPSYKOLOGI (15% av verdi)
   ─────────────────────────────────
   • "Jeg betaler, derfor bruker jeg det"
   • Sunk cost fallacy
   • Prestisje ("jeg er seriøs nok til å betale")
```

### Pris-Sensitivitet etter Segment

```
SEGMENT 1: Juniorer (13-19 år)
──────────────────────────────
Pris-villighet: 50-100 kr/mnd
Foreldre betaler: Ja
Hva de vil ha: Coaching, treningsplaner
Konvertering: Høy hvis coach anbefaler

SEGMENT 2: Amatører (20-40 år, HCP 10-25)
──────────────────────────────────────────
Pris-villighet: 100-200 kr/mnd
Hva de vil ha: DECADE, score-forbedring
Konvertering: Medium (prøver gratis, oppgraderer hvis de ser resultater)

SEGMENT 3: Elite-amatører (HCP 0-9)
───────────────────────────────────
Pris-villighet: 200-400 kr/mnd
Hva de vil ha: TrackMan, mental tracking, coaching
Konvertering: Høy (de betaler allerede for TrackMan, kurser, etc)

SEGMENT 4: "Leisure golfers" (HCP 20+, spiller 5x/år)
─────────────────────────────────────────────────────
Pris-villighet: 0-50 kr/mnd
Hva de vil ha: GPS, scorecard
Konvertering: Lav (blir på gratis)
→ Dette er OK! De er ikke målgruppen.
```

---

## DEL 3: POINTER AVTALE - DETALJERT STRUKTUR

### Avtale-Type: Utvikling + Royalty + Exit

```
PARTER:
• Du (AK Golf Group AS): Eier 100% av selskap og IP
• Pointer AS: Utvikler og vedlikeholder


DEL 1: UTVIKLING (År 1)
───────────────────────
Omfang: MVP av AK Golf Platform
        (Spillerportal + Mission Board grunnmur)

Kostnad: 800.000 kr (redusert fra 1.500.000 kr)
         basert på strategisk partnerskap

Betalingsplan:
• 25% (200k) ved kontraktsignering
• 25% (200k) etter design godkjent
• 25% (200k) etter beta-lansering
• 25% (200k) etter godkjent MVP (3 mnd etter lansering)

Eierskap:
• Du eier 100% av kildekode
• Pointer ever grunnmur/rammeverk de utvikler
• Pointer kan bruke rammeverk i andre prosjekter
• Pointer kan ikke lage konkurrerende golf-app i 3 år


DEL 2: ROYALTY (År 2-4)
───────────────────────
Struktur: 8% av netto omsetning til Pointer
          (ikke av overskudd, men av omsetning)

Cap: Maks 2.000.000 kr totalt
     Etter dette opphører royalty

Eksempel:
År 2: Omsetning 1.500.000 kr → Pointer får 120.000 kr
År 3: Omsetning 5.000.000 kr → Pointer får 400.000 kr
År 4: Omsetning 10.000.000 kr → Pointer får 480.000 kr
       (nærmer seg cap på 2M)
År 5+: Royalty opphørt


DEL 3: VEDLIKEHOLD (Løpende)
────────────────────────────
Pointer har førsterett på all videreutvikling

Timepriser:
• Utvikler: 1.100 kr/time
• Arkitekt: 1.400 kr/time
• Prosjektleder: 1.200 kr/time

SLA (Service Level Agreement):
• Kritiske bugs: 24t responstid
• Andre bugs: 72t responstid
• Nye features: Estimeres per prosjekt

Minste forbruk: 20 timer/mnd (22.000 kr)
                (sikrer at Pointer prioriterer deg)


DEL 4: EXIT (Ved salg av selskap)
─────────────────────────────────
Hvis AK Golf Group AS selges:

Exit-verdi ≤ 50M kr:
  → Pointer får 5% av salgssummen

Exit-verdi > 50M kr:
  → Pointer får 5% av første 50M
  → Pointer får 7.5% av beløp over 50M

Eksempler:
• Exit på 40M: Pointer får 2M
• Exit på 50M: Pointer får 2.5M
• Exit på 100M: Pointer får 2.5M + 3.75M = 6.25M

Minimumsgaranti: Hvis exit < 20M kr,
                  Pointer får minimum 1M kr


DEL 5: OPPSIGELSE
─────────────────
Avtalen kan sies opp av begge parter med 6 mnd varsel.

Ved oppsigelse:
• Du får all kildekode
• Pointer overfører all dokumentasjon
• Pointer hjelper med onboarding av ny utvikler (40 timer)
• Non-compete opphører etter 12 mnd
```

### Økonomisk Oppsummering for Deg

```
DINE KOSTNADER:

År 1: Utvikling          800.000 kr
År 2: Royalty (8%)       120.000 kr (ved 1.5M omsetning)
      Vedlikehold        264.000 kr (22k/mnd)
      ─────────────────────────
      Total År 2         384.000 kr

År 3: Royalty (8%)       400.000 kr (ved 5M omsetning)
      Vedlikehold        264.000 kr
      ─────────────────────────
      Total År 3         664.000 kr

År 4: Royalty (8%)       480.000 kr (ved 6M, nærmer cap)
      Vedlikehold        264.000 kr
      ─────────────────────────
      Total År 4         744.000 kr

År 5: Royalty            0 kr (cap nådd)
      Vedlikehold        264.000 kr
      ─────────────────────────
      Total År 5         264.000 kr

TOTAL 5 ÅR: 2.856.000 kr

DIN INNTEKT (ved suksess):
År 1: 200.000 kr
År 2: 1.500.000 kr
År 3: 5.000.000 kr
År 4: 7.000.000 kr
År 5: 10.000.000 kr

TOTAL 5 ÅR: 23.700.000 kr
OVERSKUDD: 20.844.000 kr

EXIT VED ÅR 5 (50M):
• Salgssum: 50.000.000 kr
• Til Pointer: 2.500.000 kr (5%)
• Til deg: 47.500.000 kr

TOTAL VERDI TIL DEG: 68.344.000 kr
```

---

## DEL 4: TEKNISK ARKITEKTUR - 20.000+ BRUKERE

### Overordnet Prinsipp: "Build for Scale from Day 1"

```
VI BYGGER INFRASTUKTUR SOM KAN SKALERE,
MEN BETALER KUN FOR DET VI BRUKER

Fra start:     0 kr/mnd (gratis nivåer)
Ved vekst:     Auto-skalering aktiveres
Ved 20.000:    Full enterprise setup
```

### Arkitektur-Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         KLIENT-LAG                              │
│  (React/Next.js App)                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Web App   │  │  Mobile App │  │   PWA       │             │
│  │  (Next.js)  │  │ (React Nat) │  │ (Offline)   │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│                    ┌──────┴──────┐                             │
│                    │  Vercel CDN │                             │
│                    │  (Edge)     │                             │
│                    └──────┬──────┘                             │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                           │         API-LAG                     │
│                           │  (Next.js API Routes → Serverless)  │
├───────────────────────────┼─────────────────────────────────────┤
│                           │                                     │
│                    ┌──────┴──────┐                             │
│                    │  API Gateway │                             │
│                    │  (Rate Limit)│                             │
│                    └──────┬──────┘                             │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                  │
│         │                 │                 │                  │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐            │
│  │  REST API   │  │  GraphQL    │  │ WebSocket   │            │
│  │  (CRUD)     │  │  (Complex)  │  │ (Real-time) │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         └─────────────────┼─────────────────┘                  │
│                           │                                     │
│                    ┌──────┴──────┐                             │
│                    │  Vercel     │                             │
│                    │  Functions  │                             │
│                    │  (Serverless│                             │
│                    │   Auto-scale│                             │
│                    └──────┬──────┘                             │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                           │      TJENESTE-LAG (Micro-services)  │
├───────────────────────────┼─────────────────────────────────────┤
│                           │                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    REDIS CACHE                          │   │
│  │  • Session storage                                      │   │
│  │  • Rate limiting                                        │   │
│  │  • Query cache                                          │   │
│  │  • Real-time data                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                  │
│         │                 │                 │                  │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐            │
│  │  Auth Svc   │  │  DECADE     │  │  TrackMan   │            │
│  │  (Clerk)    │  │  Engine     │  │  Import     │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                    │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐            │
│  │  Training   │  │  Analytics  │  │  Weather    │            │
│  │  Service    │  │  Service    │  │  Service    │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                    │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐            │
│  │  Mission    │  │  Payment    │  │  Notification│            │
│  │  Board      │  │  (Stripe)   │  │  (Push/SMS) │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                           │      DATA-LAG                       │
├───────────────────────────┼─────────────────────────────────────┤
│                           │                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                POSTGRESQL (Primary)                     │   │
│  │  • Neon eller Supabase (Serverless)                     │   │
│  │  • Auto-scaling storage                                 │   │
│  │  • Point-in-time recovery                               │   │
│  │  • Read replicas (ved 5k+ brukere)                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              TIME-SERIES DB (ClickHouse)               │   │
│  │  • TrackMan-shot-data                                   │   │
│  │  • Round statistics                                     │   │
│  │  • High-frequency metrics                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              OBJECT STORAGE (S3/Cloudflare)            │   │
│  │  • Video uploads                                        │   │
│  │  • User avatars                                         │   │
│  │  • Course maps                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                           │      EKSTERNE INTEGRASJONER         │
├───────────────────────────┼─────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │DataGolf  │  │TrackMan  │  │  YR.no   │  │  Maps    │        │
│  │   API    │  │   API    │  │  Weather │  │ Google/  │        │
│  └──────────┘  └──────────┘  └──────────┘  │  Apple   │        │
│                                             └──────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Teknologi-Stack (Presis)

```
FRONTEND:
─────────
Framework: Next.js 16 (App Router)
Styling: Tailwind CSS + shadcn/ui
State: Zustand + React Query
Maps: Mapbox GL JS (bedre enn Google for custom)
Charts: Recharts + D3.js

BACKEND:
────────
Runtime: Node.js 20+
Framework: Next.js API Routes + Edge Functions
Auth: Clerk (skalerer bedre enn Auth0)
Validation: Zod
API: tRPC (type-safe) + REST for eksterne

DATABASE:
─────────
Primary: PostgreSQL (Neon eller Supabase)
        - Row Level Security
        - Connection pooling
        - Auto-scaling
        
Cache: Upstash Redis (serverless)
       - Rate limiting
       - Session cache
       - Query cache
       
Time-series: ClickHouse Cloud (for TrackMan-data)
             - Billig for store datasett
             - Rask aggregering

OBJECT STORAGE:
───────────────
Provider: Cloudflare R2 (billigere enn AWS S3)
          - Videoer, bilder, exports
          - CDN integrert

INFRASTRUKTUR:
──────────────
Hosting: Vercel (frontend + API)
         - Auto-scaling
         - Edge network
         - Zero config
         
Monitoring: Vercel Analytics + Logflare
Error tracking: Sentry
Uptime: Better Uptime

SECURITY:
─────────
HTTPS/SSL: Automatisk (Let's Encrypt)
GDPR: EU-datasenter (Frankfurt)
Encryption: At rest (AES-256) + in transit (TLS 1.3)
Backup: Daglig automatisk + manuell månedlig
```

### Skalerings-Triggere

```
VIKTIG: Vi bygger for 20.000 fra dag 1,
men betaler kun når vi trenger det

TRIGGER 1: 100+ daglige aktive brukere
────────────────────────────────────────
Aktiver: Vercel Pro ($20/mnd)
         Database connection pooling
         Redis cache

TRIGGER 2: 1.000+ daglige aktive brukere  
──────────────────────────────────────────
Aktiver: Database read replicas
         CDN for statiske assets
         API rate limiting

TRIGGER 3: 5.000+ daglige aktive brukere
──────────────────────────────────────────
Aktiver: Dedicated database cluster
         Horizontal scaling (flere API-noder)
         Load balancing

TRIGGER 4: 10.000+ daglige aktive brukere
──────────────────────────────────────────
Aktiver: Multi-region deployment
         Advanced caching strategies
         Database sharding (hvis nødvendig)

TRIGGER 5: 20.000+ daglige aktive brukere
──────────────────────────────────────────
Mål: Exit-kandidat!
Infrastruktur: Enterprise-grade
Team: 2-3 utviklere, 1 DevOps
Kostnad: 50-100k kr/mnd
```

### Data-Modell for Skalering

```typescript
// VIKTIG: Designet for å skalere fra dag 1

// 1. BRUKER (Partitioning-ready)
interface User {
  id: string;                    // UUID
  email: string;
  tier: 'FREE' | 'PRO' | 'ELITE';
  handicap: number;
  createdAt: Date;
  region: 'NO' | 'SE' | 'DK' | 'FI';  // For GDPR + sharding
}

// 2. RUNDER (Time-series pattern)
interface Round {
  id: string;
  userId: string;
  courseId: string;
  date: Date;                    // Partition key
  mode: 'TRAINING' | 'CASUAL' | 'COMPETITION';
  score: number;
  stats: RoundStats;             // JSONB (flexibelt)
  // Partitioned by month for performance
}

// 3. SHOTS (Time-series, egen tabell for ClickHouse)
interface Shot {
  id: string;
  roundId: string;
  userId: string;
  timestamp: Date;               // Partition key
  club: string;
  distance: number;
  result: ShotResult;
  // Goes to ClickHouse for analytics
}

// 4. TRACKMAN_DATA (Egen database)
interface TrackManShot {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  // All TrackMan fields
  // Stored in ClickHouse for analysis
}

// 5. MENTAL_SCORECARD (JSONB for fleksibilitet)
interface MentalEntry {
  id: string;
  roundId: string;
  userId: string;
  hole: number;
  data: Json;                    // Flexible schema
  createdAt: Date;
}

// SKALERINGSTEKnikker:
// - Partitioning på date (rundeshistorikk)
// - JSONB for fleksible skjemaer
// - Separate databases for time-series
// - Index på userId + date (vanligste query)
```

### Backup & Sikkerhet

```
BACKUP-STRATEGI:

Automatisk (daglig):
• Database: Point-in-time recovery (7 dager)
• Object storage: Cross-region replication
• Code: Git (GitHub)

Manuell (månedlig):
• Full database dump
• Lagret offline (kryptert)
• Testet restore-prosedyre

GDPR COMPLIANCE:
• Data i EU (Frankfurt)
• Kryptering: AES-256
• Tilgangskontroll: Row Level Security
• Audit log: Hven så hva når
• Rett til sletting: Automatisk prosedyre

Sikkerhet:
• Dependencies: Dependabot (auto-oppdatering)
• Secrets: Vault (ikke i kode)
• API: Rate limiting, CORS, CSP
• Auth: MFA støtte, session management
```

### Kostnads-Evolusjon

```
0-100 brukere:
──────────────
Vercel:         0 kr (Hobby)
Database:       0 kr (Supabase free)
Redis:          0 kr (Upstash free)
Storage:        0 kr (Cloudflare free tier)
Analytics:      0 kr (Vercel Analytics)
────────────────────────────
TOTAL:          0 kr/mnd

100-1.000 brukere:
──────────────────
Vercel Pro:              220 kr/mnd
Database (Supabase Pro): 330 kr/mnd
Redis (Upstash):         220 kr/mnd
Storage (Cloudflare):    0-50 kr/mnd
Monitoring (Sentry):     0 kr (free tier)
────────────────────────────
TOTAL:                   ~800 kr/mnd

1.000-5.000 brukere:
────────────────────
Vercel Pro + Edge:       1.100 kr/mnd
Database (read replicas):1.500 kr/mnd
Redis (bigger plan):     550 kr/mnd
Storage:                 200 kr/mnd
Monitoring:              550 kr/mnd
────────────────────────────
TOTAL:                   ~4.000 kr/mnd

5.000-10.000 brukere:
─────────────────────
Vercel Enterprise:       5.500 kr/mnd
Database (dedicated):    8.000 kr/mnd
Redis Cluster:           2.200 kr/mnd
Storage + CDN:           1.500 kr/mnd
Monitoring:              2.200 kr/mnd
Backup:                  1.000 kr/mnd
────────────────────────────
TOTAL:                   ~20.000 kr/mnd

20.000+ brukere (Exit-kandidat):
────────────────────────────────
Full Enterprise setup:   50-100k kr/mnd
In-house DevOps:         80k kr/mnd (lønn)
────────────────────────────
TOTAL:                   ~150k kr/mnd

MEN: Ved 20.000 betalende brukere:
• Inntekt: 20.000 × 150 kr = 3.000.000 kr/mnd
• Kostnad: 150.000 kr/mnd
• Margin: 95%
```

---

## DEL 5: IMPLEMENTERINGS-REKKEFØLGE

### Fase 1: MVP (Måned 1-3)

```
Mål: Første 100 brukere

Bygge:
□ Auth (Clerk)
□ Gratis: Basis scorecard + 3 hull DECADE
□ Pro: Full DECADE + enkel analyse
□ Betaling (Stripe)

Ikke bygge ennå:
✗ Mental tracking
✗ TrackMan-import
✗ Mission Board full
✗ Avansert analyse

Stack: Vercel + Supabase (gratis nivå)
Kostnad: 0 kr
```

### Fase 2: Product-Market Fit (Måned 4-6)

```
Mål: 500 brukere, 20% betalende

Bygge:
□ Elite-tier (TrackMan-import)
□ Mental scorecard
□ Mission Board (basis)
□ Academy onboarding

Stack: Vercel Pro + Supabase Pro
Kostnad: ~800 kr/mnd
```

### Fase 3: Skalering (Måned 7-12)

```
Mål: 2.000 brukere

Bygge:
□ Nordisk støtte
□ Advanced analytics
□ B2B admin portal
□ API for integrasjoner

Stack: Read replicas, Redis
Kostnad: ~4.000 kr/mnd
```

### Fase 4: Exit-Forberedelse (År 2-3)

```
Mål: 5.000+ brukere, 50M NOK exit

Bygge:
□ Enterprise features
□ SOC 2 compliance
□ White-label løsninger
□ Advanced security

Stack: Enterprise-grade
Kostnad: ~20.000 kr/mnd
```

---

## OPPSUMMERING

### Prisstruktur

| Pakke | Pris | Hva inkluderes | Målgruppe |
|-------|------|----------------|-----------|
| **Gratis** | 0 kr | Basis DECADE (3 hull), scorecard, enkel trening | Prøvere, HCP 20+ |
| **Pro** | 149 kr/mnd | Full DECADE, analyse, trening, Mission Board | Seriøse amatører |
| **Elite** | 299 kr/mnd | TrackMan, mental tracking, alt | Elite, proffer |

### Pointer-avtale (Anbefalt)
- Utvikling: 800k kr
- Royalty: 8% inntil 2M kr
- Exit: 5% (7.5% over 50M)
- Du beholder: 95%+ av exit-verdi

### Teknisk Arkitektur
- Bygget for 20.000+ fra dag 1
- Kostnad: 0 → 800 → 4.000 → 20.000 kr/mnd
- Stack: Next.js + PostgreSQL + Redis + Vercel
- GDPR-compliant, skalerbar, sikker

### Exit-verdi ved suksess
- År 3: 50M NOK
- Din andel: 47.5M NOK
- Totalt til deg: 68M+ NOK (inkludert overskudd)
