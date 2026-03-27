# Coach Hub — Unified Inbox & AI Assistant

**Dato:** 2026-03-27
**Status:** Godkjent
**Eier:** Anders Kristiansen

---

## 1. Mål

Bygge **Coach Hub** — en intern PWA for AK Golf-trenere med:
- Unified inbox for alle kommunikasjonskanaler
- AI-assistent som lærer å svare som deg
- Coaching-modus for iPad på banen
- Push-varsler for 60-minutters SLA

**Mål etter 3 måneder:** AI-en svarer automatisk på 80% av henvendelser med din tone og stil.

---

## 2. Navngivning

| App | Navn | Målgruppe |
|-----|------|-----------|
| Intern dashboard | **Coach Hub** | Trenere (Anders, Markus, etc.) |
| Spillerportal | **Player Hub** | Elever (subscription-basert) |

---

## 3. Arkitektur

### 3.1 Alt-i-ett (valgt tilnærming)

Coach Hub bygges som ny route-gruppe i eksisterende akgolf-website:

```
app/
├── portal/(dashboard)/     → Player Hub (eksisterende)
├── coach/(dashboard)/      → Coach Hub (ny)
│   ├── inbox/              → Unified inbox
│   ├── chat/               → AI-chat
│   ├── players/            → Spilleroversikt
│   ├── sessions/           → Coaching-modus (iPad)
│   └── approvals/          → Godkjenningskø
└── api/
    ├── coach/              → Coach Hub API
    └── integrations/       → Gmail, Meta, WhatsApp, iMessage
```

### 3.2 Systemdiagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         ENHETER                                  │
│  iPhone (Anders) • Android (Markus) • iPad Mini ×2 • Desktop    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COACH HUB PWA                                 │
│              akgolf.no/coach/                                    │
│  Service Worker • Push Notifications • Offline Cache            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL                                   │
│  Next.js App Router • API Routes • Edge Functions               │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    SUPABASE     │  │    MAC MINI     │  │  EKSTERNE API   │
│  PostgreSQL     │  │  Ollama (AI)    │  │  Claude API     │
│  Auth           │  │  iMessage Bridge│  │  Kimi K2.5      │
│  Realtime       │  │  File Watcher   │  │  Meta API       │
└─────────────────┘  └─────────────────┘  │  WhatsApp API   │
                                          └─────────────────┘
```

---

## 4. Unified Inbox

### 4.1 Kanaler

| Kanal | Metode | Status |
|-------|--------|--------|
| Gmail | Gmail MCP (eksisterende) | ✅ Klar |
| Instagram DM | Meta Graph API + Webhook | Ny integrasjon |
| Facebook Messenger | Messenger Platform API | Ny integrasjon |
| WhatsApp Business | WhatsApp Cloud API | Nytt nummer |
| iMessage | AppleScript på Mac Mini | Ny integrasjon |

### 4.2 Routing-regler

| Kanal/Adresse | Rutes til |
|---------------|-----------|
| anders@akgolf.no | Kun Anders |
| markus@akgolf.no | Kun Markus |
| post@akgolf.no | Alle trenere (første som godkjenner) |
| Instagram DM | Alle trenere |
| Facebook/Messenger | Alle trenere |
| WhatsApp Business | Alle trenere |
| iMessage (privat) | Kun Anders |

### 4.3 SLA

- **Mål:** Svar innen 60 minutter
- **Varsling:** Push ved 50 minutter uten svar

---

## 5. AI-system

### 5.1 Model Router

Systemet velger automatisk modell basert på oppgavetype:

| Oppgave | Modell | Kostnad |
|---------|--------|---------|
| Triage, kategorisering | Ollama (lokal) | Gratis |
| Standard svar, enkel | Claude Haiku | $ |
| Coaching, treningsplaner | Claude Sonnet | $$ |
| Kreativt innhold | Kimi K2.5 | $ |

**Budsjett:** $100/måned for API-kostnader.

### 5.2 Konfidensterskel

| Konfidensen | Handling |
|-------------|----------|
| ≥ 95% | Auto-send + notifikasjon |
| < 95% | Venter på godkjenning |

### 5.3 Læringssystem

AI-en lærer fra:
1. **Godkjente svar** — lagres som mønster
2. **Redigeringer** — hva du endrer = hva den gjorde feil
3. **Kategorier** — konfidensen øker per kategori over tid

**Progresjon:**
- Uke 1-2: 0% auto-svar (alt til godkjenning)
- Uke 3-4: ~20% auto-svar
- Måned 2: ~50% auto-svar
- Måned 3+: ~80% auto-svar

---

## 6. Coaching-modus (iPad)

Dedikert visning for iPad Mini på banen/i simulator:

### 6.1 Funksjoner

- **Spillerliste:** Dagens timer i sidebar
- **Spillervisning:** Fokusområder, treningsplan, historikk
- **Video:** Ta opp → lagres direkte i spillerprofil
- **Notater:** Tale-til-tekst → auto-lagres
- **Øvelser:** Hent fra drillbibliotek → vis på iPad

### 6.2 Tilkobling

- WiFi på treningsområdet (online-først)
- Video lastes opp over WiFi (ikke mobildata)

---

## 7. Push-varsler

### 7.1 Varslingstyper

| Type | Timing |
|------|--------|
| Ny melding (alle kanaler) | Umiddelbart |
| AI trenger godkjenning | Hver 15. minutt (samlet) |
| Ny booking | Hver 15. minutt |
| SLA-advarsel (50 min) | Umiddelbart |

### 7.2 Teknisk

- Web Push API via Service Worker
- PushSubscription lagres i Supabase
- Støtter: iPhone (iOS 16.4+), Android, iPad, Desktop

---

## 8. Integrasjoner

### 8.1 Gmail

- **Metode:** Eksisterende Gmail MCP
- **Kontoer:** post@akgolf.no, anders@akgolf.no, markus@akgolf.no
- **Polling:** Hvert 30 sekund
- **Sending:** Via Gmail API

### 8.2 Instagram & Messenger

- **Metode:** Meta Graph API / Messenger Platform API
- **Konto:** AK Golf Academy (Business)
- **Webhook:** Realtime push fra Meta
- **Krav:** Meta Business-konto (allerede opprettet)

### 8.3 WhatsApp Business

- **Metode:** WhatsApp Cloud API
- **Konto:** Nytt Business-nummer (må opprettes)
- **Webhook:** Realtime push
- **Krav:** Ekstra SIM-kort (~99 kr/mnd)

### 8.4 iMessage

- **Metode:** AppleScript + Messages.app
- **Kjører på:** Mac Mini (alltid på)
- **Polling:** Hvert 10 sekund
- **Sending:** Via AppleScript

```
~/scripts/imessage-bridge/
├── watch.sh      # Overvåker nye meldinger
├── send.sh       # Sender svar
└── sync.sh       # Syncer til Supabase
```

---

## 9. Mac Mini — Hovedbase

Mac Mini kjører følgende tjenester (LaunchAgents):

| Tjeneste | Funksjon |
|----------|----------|
| Ollama | Lokal AI (qwen2.5:7b, llama3.2:3b) |
| iMessage Bridge | AppleScript daemon |
| File Watcher | Coaching inbox (fswatch) |
| Agent Orchestration | Ruflo + Claude Code |

---

## 10. Datamodell

### 10.1 Nye Prisma-modeller

```prisma
enum Channel {
  EMAIL
  INSTAGRAM
  MESSENGER
  WHATSAPP
  IMESSAGE
}

enum MessageStatus {
  PENDING
  AI_PROCESSING
  AI_READY
  APPROVED
  SENT
  FAILED
}

enum Direction {
  INBOUND
  OUTBOUND
}

model UnifiedMessage {
  id            String        @id @default(cuid())
  channel       Channel
  direction     Direction
  externalId    String        // ID fra kildesystem
  senderName    String
  senderHandle  String        // email/handle/telefon
  subject       String?
  content       String
  receivedAt    DateTime
  status        MessageStatus @default(PENDING)
  assignedToId  String?
  assignedTo    User?         @relation(fields: [assignedToId], references: [id])
  threadId      String?
  aiResponse    AIResponse?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model AIResponse {
  id            String          @id @default(cuid())
  messageId     String          @unique
  message       UnifiedMessage  @relation(fields: [messageId], references: [id])
  draftContent  String
  finalContent  String?         // etter redigering
  confidence    Float           // 0.0 - 1.0
  category      String          // pris, booking, info, etc
  modelUsed     String          // claude-sonnet, ollama, etc
  autoSent      Boolean         @default(false)
  wasEdited     Boolean         @default(false)
  editDiff      String?         // hva ble endret
  approvedById  String?
  approvedBy    User?           @relation(fields: [approvedById], references: [id])
  approvedAt    DateTime?
  createdAt     DateTime        @default(now())
}

model AILearning {
  id          String   @id @default(cuid())
  userId      String   // hvem AI-en lærer fra
  user        User     @relation(fields: [userId], references: [id])
  category    String
  pattern     String   // input-mønster
  response    String   // godkjent svar
  confidence  Float    @default(0.5)
  usageCount  Int      @default(0)
  lastUsed    DateTime?
  corrections Json?    // historikk av endringer
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PushSubscription {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  endpoint   String
  p256dh     String
  auth       String
  deviceType String   // iphone, android, ipad, desktop
  createdAt  DateTime @default(now())
}
```

---

## 11. Design Tokens

Farger og fonts lagres som CSS-variabler for enkel bytte når ny branding er klar:

```css
:root {
  --color-primary: #000000;
  --color-accent: #B07D4F;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --font-heading: 'Manrope', sans-serif;
  --font-body: 'Manrope', sans-serif;
}
```

Endrer én fil → alle tre apper (website, Player Hub, Coach Hub) oppdateres.

---

## 12. Enheter

| Enhet | Bruker | Bruk |
|-------|--------|------|
| iPhone | Anders | Inbox, godkjenninger, varsler |
| Android | Markus | Inbox, godkjenninger, varsler |
| iPad Mini #1 | Coaching | På banen |
| iPad Mini #2 | Coaching | I simulator |
| Desktop | Admin | Full administrasjon |

---

## 13. Avhengigheter

### 13.1 Må opprettes

- [ ] WhatsApp Business-nummer (nytt SIM-kort)
- [ ] Meta App for Instagram/Messenger webhooks
- [ ] Web Push VAPID-nøkler

### 13.2 Allerede klart

- [x] Gmail MCP
- [x] Supabase (auth + database)
- [x] Ollama på Mac Mini
- [x] Meta Business-konto
- [x] Instagram Business-konto
- [x] Facebook Business-konto

---

## 14. Relaterte dokumenter

- [Agent Ecosystem Design](./2026-03-27-ak-agent-ecosystem-design.md)
- [Player Hub Tier Strategy](./2026-03-27-player-hub-tier-strategy.md)

---

## 15. Neste steg

1. Implementeringsplan via `superpowers:writing-plans`
2. Subagent-driven development for parallell utvikling
