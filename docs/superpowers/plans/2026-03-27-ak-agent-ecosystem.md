# AK Golf Agent Ecosystem Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatisere AK Golf Group-drift med agent teams som overvåker innbokser, genererer innhold og støtter coaching — Anders godkjenner kun output.

**Architecture:** Ruflo orkestrerer scheduled og event-baserte workflows. Claude Code skills og sub-agenter utfører oppgaver. Ollama håndterer kostnadseffektive oppgaver lokalt. Telegram + Notion for godkjenningsflyt.

**Tech Stack:** Ruflo, Claude Code, Ollama (qwen2.5:14b), Telegram Bot API, Notion MCP, Gmail MCP, Whisper API, Claude API, Kimi K2.5 API

---

## File Structure

```
~/.claude/
├── agents/
│   ├── content-team/
│   │   ├── content-planner.md
│   │   ├── some-writer.md
│   │   ├── newsletter-writer.md
│   │   └── brand-validator.md
│   ├── coaching-team/
│   │   ├── session-transcriber.md
│   │   ├── session-analyzer.md
│   │   ├── plan-generator.md
│   │   ├── drill-creator.md
│   │   └── progress-tracker.md
│   └── ops-team/
│       ├── inbox-monitor.md
│       ├── booking-monitor.md
│       ├── reminder-sender.md
│       ├── report-generator.md
│       └── calendar-sync.md
├── workflows/
│   ├── daily-schedule.yaml
│   ├── coaching-pipeline.yaml
│   ├── content-pipeline.yaml
│   └── approval-flow.yaml
├── hooks/
│   └── coaching-inbox-watcher.sh
└── integrations/
    └── telegram-bot/
        ├── bot.ts
        └── handlers.ts

~/Developer/akgolf-website/
└── lib/
    └── agents/
        ├── telegram-client.ts
        └── approval-queue.ts
```

---

## Task 1: Telegram Bot Setup

**Files:**
- Create: `~/.claude/integrations/telegram-bot/bot.ts`
- Create: `~/.claude/integrations/telegram-bot/handlers.ts`
- Create: `~/.claude/integrations/telegram-bot/.env.example`

- [ ] **Step 1: Opprett Telegram-bot via BotFather**

1. Åpne Telegram, søk etter @BotFather
2. Send `/newbot`
3. Navn: `AK Golf Assistant`
4. Brukernavn: `akgolf_assistant_bot`
5. Kopier token

- [ ] **Step 2: Lagre token i miljøvariabler**

```bash
echo "TELEGRAM_BOT_TOKEN=<token-fra-botfather>" >> ~/.zshrc
source ~/.zshrc
```

- [ ] **Step 3: Opprett bot-mappe**

```bash
mkdir -p ~/.claude/integrations/telegram-bot
```

- [ ] **Step 4: Opprett .env.example**

```bash
cat > ~/.claude/integrations/telegram-bot/.env.example << 'EOF'
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
EOF
```

- [ ] **Step 5: Opprett bot.ts**

```typescript
// ~/.claude/integrations/telegram-bot/bot.ts
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN!;
const chatId = process.env.TELEGRAM_CHAT_ID!;

export const bot = new TelegramBot(token, { polling: false });

export async function sendApprovalRequest(params: {
  type: "some" | "email" | "drill" | "newsletter";
  title: string;
  preview: string;
  notionUrl: string;
  approvalId: string;
}) {
  const emoji = {
    some: "📱",
    email: "📧",
    drill: "🏌️",
    newsletter: "📰",
  }[params.type];

  const message = `${emoji} **Ny ${params.type} klar:**

${params.title}

_${params.preview.slice(0, 200)}..._

[Se full i Notion](${params.notionUrl})`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: "✅ Godkjenn", callback_data: `approve:${params.approvalId}` },
        { text: "❌ Avvis", callback_data: `reject:${params.approvalId}` },
      ],
      [{ text: "📝 Se full", url: params.notionUrl }],
    ],
  };

  return bot.sendMessage(chatId, message, {
    parse_mode: "Markdown",
    reply_markup: keyboard,
  });
}

export async function sendNotification(message: string) {
  return bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
}

export async function sendDailyBriefing(briefing: {
  pendingApprovals: number;
  todayBookings: number;
  unreadEmails: number;
  upcomingDeadlines: string[];
}) {
  const message = `🌅 **Daglig briefing**

📥 Venter på godkjenning: ${briefing.pendingApprovals}
📅 Dagens bookinger: ${briefing.todayBookings}
📧 Uleste e-poster: ${briefing.unreadEmails}

${briefing.upcomingDeadlines.length > 0 ? `⚠️ Frister:\n${briefing.upcomingDeadlines.map((d) => `- ${d}`).join("\n")}` : "✅ Ingen presserende frister"}`;

  return bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
}
```

- [ ] **Step 6: Opprett handlers.ts**

```typescript
// ~/.claude/integrations/telegram-bot/handlers.ts
import { bot } from "./bot";

interface ApprovalCallback {
  approvalId: string;
  action: "approve" | "reject";
  userId: number;
}

const approvalCallbacks = new Map<string, (result: ApprovalCallback) => void>();

export function registerApprovalCallback(
  approvalId: string,
  callback: (result: ApprovalCallback) => void
) {
  approvalCallbacks.set(approvalId, callback);
}

export function startPolling() {
  bot.on("callback_query", async (query) => {
    const data = query.data;
    if (!data) return;

    const [action, approvalId] = data.split(":");

    if (action === "approve" || action === "reject") {
      const callback = approvalCallbacks.get(approvalId);
      if (callback) {
        callback({
          approvalId,
          action,
          userId: query.from.id,
        });
        approvalCallbacks.delete(approvalId);

        await bot.answerCallbackQuery(query.id, {
          text: action === "approve" ? "✅ Godkjent!" : "❌ Avvist",
        });

        await bot.editMessageReplyMarkup(
          { inline_keyboard: [] },
          {
            chat_id: query.message?.chat.id,
            message_id: query.message?.message_id,
          }
        );
      }
    }
  });

  bot.startPolling();
}
```

- [ ] **Step 7: Installer dependencies**

```bash
cd ~/.claude/integrations/telegram-bot
npm init -y
npm install node-telegram-bot-api
npm install -D @types/node-telegram-bot-api typescript
```

- [ ] **Step 8: Hent chat ID**

1. Start boten: `npx ts-node bot.ts`
2. Send en melding til boten i Telegram
3. Besøk: `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Finn `chat.id` i responsen
5. Lagre: `echo "TELEGRAM_CHAT_ID=<chat-id>" >> ~/.zshrc`

- [ ] **Step 9: Test bot**

```bash
cd ~/.claude/integrations/telegram-bot
npx ts-node -e "
import { sendNotification } from './bot';
sendNotification('🎉 AK Golf Agent System er online!').then(() => console.log('Sendt!'));
"
```

- [ ] **Step 10: Commit**

```bash
cd ~/.claude
git add integrations/telegram-bot/
git commit -m "feat: add Telegram bot for approval notifications"
```

---

## Task 2: Notion Approval Database

**Files:**
- Create: Notion database "Agent Godkjenninger"
- Create: `~/.claude/skills/approval-queue/SKILL.md`

- [ ] **Step 1: Opprett Notion-database**

Via Notion MCP eller manuelt:

| Property | Type | Verdier |
|----------|------|---------|
| Tittel | Title | - |
| Type | Select | SoMe, E-post, Drill, Nyhetsbrev, Treningsplan |
| Status | Select | Venter, Godkjent, Avvist, Publisert |
| Agent | Select | some-writer, inbox-monitor, drill-creator, etc. |
| Opprettet | Date | - |
| Godkjent av | Person | - |
| Innhold | Rich text | - |
| Forhåndsvisning | Rich text | - |
| Publiserings-URL | URL | - |

- [ ] **Step 2: Hent database ID**

```bash
# Åpne databasen i Notion, kopier URL
# Format: notion.so/<workspace>/<database-id>?v=...
# Database ID er 32 tegn etter siste /
```

- [ ] **Step 3: Lagre database ID**

```bash
echo "NOTION_APPROVAL_DB_ID=<database-id>" >> ~/.zshrc
source ~/.zshrc
```

- [ ] **Step 4: Opprett approval-queue skill**

```bash
mkdir -p ~/.claude/skills/approval-queue
```

- [ ] **Step 5: Skriv SKILL.md**

```markdown
---
name: approval-queue
description: Håndterer godkjennings-køen — legger til, oppdaterer status, henter ventende items
allowed-tools: mcp__claude_ai_Notion__notion-create-pages, mcp__claude_ai_Notion__notion-update-page, mcp__claude_ai_Notion__notion-fetch, mcp__claude_ai_Notion__notion-search, Read, Write
---

# Approval Queue

Håndterer agent-output som venter på godkjenning.

## Database

Database ID: Se miljøvariabel `NOTION_APPROVAL_DB_ID`

## Operasjoner

### Legg til i kø

```
mcp__claude_ai_Notion__notion-create-pages
parent: { data_source_id: <APPROVAL_DB_ID> }
pages: [{
  properties: {
    "Tittel": "<tittel>",
    "Type": "<SoMe|E-post|Drill|Nyhetsbrev|Treningsplan>",
    "Status": "Venter",
    "Agent": "<agent-navn>",
    "Innhold": "<full innhold>",
    "Forhåndsvisning": "<første 200 tegn>"
  }
}]
```

### Oppdater status

```
mcp__claude_ai_Notion__notion-update-page
page_id: <page-id>
properties: {
  "Status": "<Godkjent|Avvist|Publisert>"
}
```

### Hent ventende

```
mcp__claude_ai_Notion__notion-fetch
data_source_id: <APPROVAL_DB_ID>
filter: Status = "Venter"
```
```

- [ ] **Step 6: Commit**

```bash
cd ~/.claude
git add skills/approval-queue/
git commit -m "feat: add approval-queue skill for Notion integration"
```

---

## Task 3: Ollama Setup (Mac Mini)

**Files:**
- Ingen filer, kun installasjon og konfigurasjon

- [ ] **Step 1: Installer Ollama**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

- [ ] **Step 2: Start Ollama-tjenesten**

```bash
ollama serve &
```

- [ ] **Step 3: Last ned modeller**

```bash
ollama pull qwen2.5:14b
ollama pull llama3.2:8b
ollama pull nomic-embed-text
```

- [ ] **Step 4: Verifiser installasjon**

```bash
ollama list
# Skal vise:
# qwen2.5:14b
# llama3.2:8b
# nomic-embed-text
```

- [ ] **Step 5: Test qwen2.5**

```bash
ollama run qwen2.5:14b "Kategoriser denne e-posten: 'Hei, vi ønsker å booke en treningstime for junior-laget vårt neste uke.' Svar med kun én kategori: BOOKING, SPØRSMÅL, KLAGE, SAMARBEID, ANNET"
```

- [ ] **Step 6: Konfigurer Ollama for ekstern tilgang**

```bash
# Legg til i ~/.zshrc
export OLLAMA_HOST=0.0.0.0:11434
```

- [ ] **Step 7: Opprett LaunchAgent for auto-start**

```bash
cat > ~/Library/LaunchAgents/com.ollama.server.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.server</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.ollama.server.plist
```

---

## Task 4: Operations Team — inbox-monitor Agent

**Files:**
- Create: `~/.claude/agents/ops-team/inbox-monitor.md`

- [ ] **Step 1: Opprett ops-team mappe**

```bash
mkdir -p ~/.claude/agents/ops-team
```

- [ ] **Step 2: Skriv inbox-monitor.md**

```markdown
---
name: inbox-monitor
description: Overvåker Gmail, kategoriserer e-poster, flagger hastemeldinger, forbereder svarutkast
tools: mcp__claude_ai_Gmail__gmail_search_messages, mcp__claude_ai_Gmail__gmail_read_message, mcp__claude_ai_Gmail__gmail_create_draft, mcp__claude_ai_Notion__notion-create-pages, Bash(curl *)
model: ollama:qwen2.5:14b
---

# Inbox Monitor

Overvåker e-post og kategoriserer meldinger for AK Golf Group.

## Kategorier

| Kategori | Handling | Prioritet |
|----------|----------|-----------|
| BOOKING | Videresend til booking-monitor | Normal |
| SPØRSMÅL | Forbered svarutkast → godkjenning | Normal |
| KLAGE | Flag som haste → Telegram-varsling | Kritisk |
| SAMARBEID | Forbered svarutkast → godkjenning | Normal |
| FAKTURA | Videresend til ak-cfo | Normal |
| SPAM | Ignorer | Lav |

## Flyt

1. Hent uleste e-poster fra siste 4 timer
2. For hver e-post:
   a. Kategoriser med Ollama
   b. Hvis KLAGE: send Telegram-varsling umiddelbart
   c. Hvis BOOKING: opprett oppgave for booking-monitor
   d. Ellers: generer svarutkast, legg i godkjennings-kø

## Svarutkast-mal

Bruk tone fra `~/.claude/references/brand-reference.md`.
Alltid på norsk bokmål.
Signer med "Med vennlig hilsen, AK Golf Team"

## Kjøreplan

- 07:00, 12:00, 18:00 daglig

## Eskalering

Hvis e-post er ubesvart > 20 timer: send Telegram-varsling
```

- [ ] **Step 3: Test kategorisering lokalt**

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:14b",
  "prompt": "Kategoriser: Hei, vi ønsker tilbud på treningsopplegg for 10 juniorer. Svar KUN med én: BOOKING, SPØRSMÅL, KLAGE, SAMARBEID, FAKTURA, SPAM",
  "stream": false
}'
```

- [ ] **Step 4: Commit**

```bash
cd ~/.claude
git add agents/ops-team/inbox-monitor.md
git commit -m "feat: add inbox-monitor agent for email triage"
```

---

## Task 5: Operations Team — booking-monitor Agent

**Files:**
- Create: `~/.claude/agents/ops-team/booking-monitor.md`

- [ ] **Step 1: Skriv booking-monitor.md**

```markdown
---
name: booking-monitor
description: Overvåker nye bookinger, sender bekreftelser, håndterer avbestillinger
tools: mcp__claude_ai_Supabase__execute_sql, mcp__claude_ai_Google_Calendar__gcal_create_event, Read, Write
model: ollama:qwen2.5:14b
---

# Booking Monitor

Overvåker booking-systemet for nye bookinger og endringer.

## Oppgaver

1. **Nye bookinger** → Send bekreftelse, synk til kalender
2. **Avbestillinger** → Send bekreftelse, oppdater kalender
3. **Endringer** → Send oppdatering, oppdater kalender
4. **No-shows** → Logg, varsle hvis gjentatt

## SQL-spørringer

### Nye bookinger (siste 30 min)
```sql
SELECT b.*, u.name, u.email, u.phone
FROM "Booking" b
JOIN "User" u ON b."userId" = u.id
WHERE b."createdAt" > NOW() - INTERVAL '30 minutes'
AND b.status = 'CONFIRMED'
```

### Avbestillinger (siste 30 min)
```sql
SELECT b.*, u.name, u.email
FROM "Booking" b
JOIN "User" u ON b."userId" = u.id
WHERE b."updatedAt" > NOW() - INTERVAL '30 minutes'
AND b.status = 'CANCELLED'
```

## E-postmaler

Bruk maler fra `lib/portal/email/templates/`:
- `booking-confirmation.tsx`
- `booking-cancellation.tsx`
- `booking-reminder.tsx`

## Kjøreplan

- Hver 30. minutt: 07:30, 08:00, ..., 18:00
```

- [ ] **Step 2: Commit**

```bash
cd ~/.claude
git add agents/ops-team/booking-monitor.md
git commit -m "feat: add booking-monitor agent"
```

---

## Task 6: Operations Team — reminder-sender Agent

**Files:**
- Create: `~/.claude/agents/ops-team/reminder-sender.md`

- [ ] **Step 1: Skriv reminder-sender.md**

```markdown
---
name: reminder-sender
description: Sender SMS og e-post påminnelser for morgendagens bookinger
tools: mcp__claude_ai_Supabase__execute_sql, Bash(curl *)
model: none
---

# Reminder Sender

Sender påminnelser for bookinger neste dag. Bruker faste maler, ingen AI.

## SQL: Morgendagens bookinger

```sql
SELECT b.*, u.name, u.email, u.phone, i.name as instructor_name
FROM "Booking" b
JOIN "User" u ON b."userId" = u.id
JOIN "Instructor" i ON b."instructorId" = i.id
WHERE DATE(b."startTime") = CURRENT_DATE + INTERVAL '1 day'
AND b.status = 'CONFIRMED'
AND b."reminderSent" = false
```

## SMS-mal

```
Hei {navn}! Påminnelse: Du har time hos {instruktør} i morgen kl {tid}. Gamle Fredrikstad GK. Velkommen! - AK Golf
```

## E-post-mal

Bruk `lib/portal/email/templates/booking-reminder.tsx`

## Etter sending

```sql
UPDATE "Booking" SET "reminderSent" = true WHERE id = '{booking_id}'
```

## Kjøreplan

- 09:00 daglig
```

- [ ] **Step 2: Commit**

```bash
cd ~/.claude
git add agents/ops-team/reminder-sender.md
git commit -m "feat: add reminder-sender agent"
```

---

## Task 7: Coaching Team — session-transcriber Agent

**Files:**
- Create: `~/.claude/agents/coaching-team/session-transcriber.md`
- Create: `~/.claude/hooks/coaching-inbox-watcher.sh`

- [ ] **Step 1: Opprett coaching-team mappe**

```bash
mkdir -p ~/.claude/agents/coaching-team
mkdir -p ~/.claude/hooks
```

- [ ] **Step 2: Skriv session-transcriber.md**

```markdown
---
name: session-transcriber
description: Transkriberer coaching-opptak fra inbox til tekst
tools: Bash(curl *), Bash(ffprobe *), Bash(mv *), Read, Write
model: whisper-1
---

# Session Transcriber

Transkriberer voice memos fra coaching-økter.

## Input

Lydfiler i: `~/Library/Mobile Documents/com~apple~CloudDocs/ak-golf-group/coaching/inbox/`

Støttede formater: .m4a, .mp3, .wav, .aac, .ogg

## Prosess

1. Sjekk filstørrelse (maks 25MB for Whisper)
2. Send til OpenAI Whisper API
3. Lagre transkripsjon til temp-fil
4. Trigger session-analyzer med transkripsjon
5. Flytt lydfil til `processed/`

## Whisper API-kall

```bash
curl -s --max-time 300 https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F file="@{AUDIO_FILE}" \
  -F model="whisper-1" \
  -F language="no" \
  -F response_format="text"
```

## Feilhåndtering

Ved feil: flytt fil til `failed/` med tidsstempel
```

- [ ] **Step 3: Skriv file watcher hook**

```bash
cat > ~/.claude/hooks/coaching-inbox-watcher.sh << 'EOF'
#!/bin/bash
# coaching-inbox-watcher.sh
# Watches for new audio files and triggers transcription

INBOX="$HOME/Library/Mobile Documents/com~apple~CloudDocs/ak-golf-group/coaching/inbox"

fswatch -0 "$INBOX" | while read -d "" event; do
  # Only process audio files
  if [[ "$event" =~ \.(m4a|mp3|wav|aac|ogg)$ ]]; then
    echo "Ny fil oppdaget: $event"

    # Wait for file to finish writing
    sleep 2

    # Trigger Claude Code with coaching-session skill
    claude --skill coaching-session "$event"
  fi
done
EOF

chmod +x ~/.claude/hooks/coaching-inbox-watcher.sh
```

- [ ] **Step 4: Opprett LaunchAgent for file watcher**

```bash
cat > ~/Library/LaunchAgents/com.akgolf.coaching-watcher.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.akgolf.coaching-watcher</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>~/.claude/hooks/coaching-inbox-watcher.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/coaching-watcher.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/coaching-watcher.err</string>
</dict>
</plist>
EOF
```

- [ ] **Step 5: Installer fswatch**

```bash
brew install fswatch
```

- [ ] **Step 6: Commit**

```bash
cd ~/.claude
git add agents/coaching-team/session-transcriber.md hooks/coaching-inbox-watcher.sh
git commit -m "feat: add session-transcriber agent with file watcher"
```

---

## Task 8: Coaching Team — plan-generator Agent

**Files:**
- Create: `~/.claude/agents/coaching-team/plan-generator.md`

- [ ] **Step 1: Skriv plan-generator.md**

```markdown
---
name: plan-generator
description: Genererer ukentlige treningsplaner basert på drillbiblioteket og spillerprofil
tools: Read, Write, mcp__claude_ai_Notion__notion-fetch, mcp__claude_ai_Notion__notion-update-page
model: claude-sonnet-4-6
skills:
  - ak-treningsplan-generator
  - ak-treningsokt
  - ak-periodisering
---

# Plan Generator

Genererer personlige treningsplaner basert på spillerprofil og drillbibliotek.

## Datakilder

- **Drillbibliotek:** `~/Developer/akgolf-website/content/sportsplan/drillbibliotek.md`
- **Testprotokoller:** `~/Developer/akgolf-website/content/sportsplan/testprotokoller.md`
- **Spillerprofiler:** Notion database `6c8f448844dd47269b6579f064aeace5`

## Input

- Spiller-ID eller navn
- Periode (Grunnperiode/Spesialisering/Turnering)
- Antall treningsdager per uke
- Fokusområder fra siste coaching-sesjon

## Output

Ukentlig treningsplan med:
- Dag-for-dag øktstruktur
- Valgte drills fra biblioteket (med ID-referanse)
- Tidsanslag per økt
- Tekniske fokuspunkter

## Prosess

1. Hent spillerprofil fra Notion
2. Hent siste 3 coaching-sesjoner
3. Identifiser fokusområder
4. Velg drills fra biblioteket som matcher
5. Strukturer ukeplan
6. Lagre til Notion spillerprofil

## Kjøreplan

- Trigges av session-analyzer etter coaching
- Manuelt på forespørsel
```

- [ ] **Step 2: Commit**

```bash
cd ~/.claude
git add agents/coaching-team/plan-generator.md
git commit -m "feat: add plan-generator agent"
```

---

## Task 9: Coaching Team — drill-creator Agent

**Files:**
- Create: `~/.claude/agents/coaching-team/drill-creator.md`

- [ ] **Step 1: Skriv drill-creator.md**

```markdown
---
name: drill-creator
description: Foreslår nye øvelser basert på eksisterende mønstre — krever godkjenning
tools: Read, Write, mcp__claude_ai_Notion__notion-create-pages
model: claude-opus-4-6
---

# Drill Creator

Genererer nye treningsøvelser basert på mønster fra drillbiblioteket.

## Viktig

**Alle nye øvelser MÅ godkjennes før de legges til biblioteket.**

## Drillbibliotek-format

```markdown
### XX-NN: Drill Navn

**Formål:** Hva øvelsen trener.
**Utstyr:** Nødvendig utstyr.
**Periode:** G, S, T (hvilke perioder)
**Nivå:** Alle / Junior 13–15 / Junior 16+ / Academy

**Gjennomføring:**
1. Steg 1
2. Steg 2
3. Steg 3

**Varianter:**
- Nivå 2: Vanskeligere variant
- Nivå 3: Turneringslignende press
```

## Kategori-prefiks

- LS: Langt spill
- JA: Jern/approach
- KS: Kort spill
- PU: Putting
- BM: Banespill & mental

## Prosess

1. Analyser eksisterende drills i kategorien
2. Identifiser hull (manglende nivåer, manglende fokusområder)
3. Generer ny drill med samme format
4. Send til godkjennings-kø med:
   - Full drill-tekst
   - Begrunnelse for hvorfor den trengs
   - Lignende eksisterende drills

## Etter godkjenning

Append ny drill til `drillbibliotek.md` med neste ledige ID.
```

- [ ] **Step 2: Commit**

```bash
cd ~/.claude
git add agents/coaching-team/drill-creator.md
git commit -m "feat: add drill-creator agent (requires approval)"
```

---

## Task 10: Content Team — some-writer Agent

**Files:**
- Create: `~/.claude/agents/content-team/some-writer.md`

- [ ] **Step 1: Opprett content-team mappe**

```bash
mkdir -p ~/.claude/agents/content-team
```

- [ ] **Step 2: Skriv some-writer.md**

```markdown
---
name: some-writer
description: Genererer SoMe-innhold for Instagram, Facebook og LinkedIn
tools: Read, Write, mcp__claude_ai_Notion__notion-create-pages, WebSearch
model: kimi-k2.5
skills:
  - ak-some-content
  - ak-brand-guardian
---

# SoMe Writer

Genererer publiseringsklart innhold for sosiale medier.

## Kanaler

| Kanal | Tone | Lengde | Hashtags |
|-------|------|--------|----------|
| Instagram | Visuell, inspirerende | < 2200 tegn | 20-30 |
| Facebook | Informativ | < 500 ord | 3-5 |
| LinkedIn | Profesjonell | < 300 ord | 1-3 |

## Brand-referanse

Les `~/.claude/references/brand-reference.md` før hver generering.

## Innholdstyper

1. **Tips-kort** — Enkelt golftips
2. **Carousel** — 5-10 slides med hook og CTA
3. **Event-promo** — Kommende arrangementer
4. **Quote** — Inspirerende sitat
5. **Resultat** — Spillerresultater

## Prosess

1. Hent dagens tema fra innholdskalender (Notion)
2. Generer innhold tilpasset kanal
3. Kjør brand-validator
4. Send til godkjennings-kø
5. Ved godkjenning: marker som klar for publisering

## Kjøreplan

- 08:00: Planlegg dagens innhold
- 17:00: Generer kveldens post

## Output-format

```
# [Kanal] — [Type]

**Tekst:**
[Innhold]

**Hashtags:**
[hashtags]

**Bildeforslag:**
[Konkret beskrivelse]

**Publiseringstid:**
[Dag og tid]

**CTA:**
[Call to action]
```
```

- [ ] **Step 3: Commit**

```bash
cd ~/.claude
git add agents/content-team/some-writer.md
git commit -m "feat: add some-writer agent for social media"
```

---

## Task 11: Content Team — brand-validator Agent

**Files:**
- Create: `~/.claude/agents/content-team/brand-validator.md`

- [ ] **Step 1: Skriv brand-validator.md**

```markdown
---
name: brand-validator
description: Validerer innhold mot brand guide — farger, tone, navn, forbudte uttrykk
tools: Read
model: ollama:llama3.2:8b
---

# Brand Validator

Sjekker alt kundevendt innhold mot AK Golf Brand Guide 2.0.

## Sjekkliste

### Selskapsnavn
- ✅ AK Golf Academy (korrekt)
- ❌ AKGolf, AK academy, AKGA
- ✅ Mulligan Indoor Golf Simulators (korrekt)
- ❌ MIG, Mulligan Golf
- ✅ Golfdrift Software (korrekt)
- ❌ Golf Drift, GolfDrift

### Tone
- Profesjonell men varm
- Aldri "opplev magien", "ta steget", "din reise"
- Aldri stockfoto-språk

### Farger (nevnt i tekst)
- Primær: Svart, bronse
- Aksent per sub-brand (se brand guide)

### Sesong
- April–Oktober: utendørs fokus
- November–Mars: simulator fokus

## Output

```json
{
  "valid": true/false,
  "issues": [
    {
      "type": "navn|tone|sesong|annet",
      "description": "Beskrivelse av problem",
      "suggestion": "Forslag til løsning"
    }
  ],
  "confidence": 0.0-1.0
}
```

## Prosess

1. Les brand-reference.md
2. Analyser innhold
3. Returner validerings-resultat
4. Hvis ikke valid: returner til avsender med issues
```

- [ ] **Step 2: Commit**

```bash
cd ~/.claude
git add agents/content-team/brand-validator.md
git commit -m "feat: add brand-validator agent (Ollama)"
```

---

## Task 12: Ruflo Workflow Configuration

**Files:**
- Create: `~/.claude/workflows/daily-schedule.yaml`
- Create: `~/.claude/workflows/coaching-pipeline.yaml`

- [ ] **Step 1: Opprett workflows mappe**

```bash
mkdir -p ~/.claude/workflows
```

- [ ] **Step 2: Skriv daily-schedule.yaml**

```yaml
# daily-schedule.yaml
# Daglig schedule for alle agenter

name: ak-golf-daily
description: Daglig kjøreplan for AK Golf agenter

schedules:
  - name: morning-inbox
    cron: "0 7 * * *"
    agent: inbox-monitor

  - name: morning-bookings
    cron: "30 7 * * *"
    agent: booking-monitor

  - name: content-planning
    cron: "0 8 * * *"
    agent: content-planner

  - name: reminders
    cron: "0 9 * * *"
    agent: reminder-sender

  - name: midday-inbox
    cron: "0 12 * * *"
    agent: inbox-monitor

  - name: evening-content
    cron: "0 17 * * *"
    agent: some-writer

  - name: evening-inbox
    cron: "0 18 * * *"
    agent: inbox-monitor

  - name: weekly-report
    cron: "0 8 * * 1"
    agent: report-generator

  - name: newsletter-prep
    cron: "0 10 * * 5"
    agent: newsletter-writer

notifications:
  telegram:
    on_error: true
    on_completion: false

model_routing:
  default: ollama:qwen2.5:14b
  overrides:
    some-writer: kimi-k2.5
    newsletter-writer: kimi-k2.5
    plan-generator: claude-sonnet-4-6
    drill-creator: claude-opus-4-6
```

- [ ] **Step 3: Skriv coaching-pipeline.yaml**

```yaml
# coaching-pipeline.yaml
# Event-drevet pipeline for coaching-sesjoner

name: coaching-pipeline
description: Prosesserer coaching-opptak automatisk
trigger: file_watch

watch:
  path: ~/Library/Mobile Documents/com~apple~CloudDocs/ak-golf-group/coaching/inbox/
  patterns:
    - "*.m4a"
    - "*.mp3"
    - "*.wav"

pipeline:
  - step: transcribe
    agent: session-transcriber
    model: whisper-1
    output: transcript

  - step: analyze
    agent: session-analyzer
    model: claude-sonnet-4-6
    input: transcript
    output: analysis

  - step: update-profile
    agent: progress-tracker
    model: claude-haiku-4-5
    input: analysis

  - step: generate-plan
    agent: plan-generator
    model: claude-sonnet-4-6
    input: analysis
    condition: new_focus_areas_detected

notifications:
  telegram:
    on_completion: true
    message: "✅ Coaching-sesjon prosessert: {player_name}"
```

- [ ] **Step 4: Commit**

```bash
cd ~/.claude
git add workflows/
git commit -m "feat: add ruflo workflow configurations"
```

---

## Task 13: Daily Briefing Integration

**Files:**
- Modify: `~/.claude/skills/briefing/SKILL.md`

- [ ] **Step 1: Les eksisterende briefing skill**

```bash
cat ~/.claude/skills/briefing/SKILL.md
```

- [ ] **Step 2: Oppdater med Telegram-integrasjon**

Legg til i slutten av SKILL.md:

```markdown
## Telegram-push

Etter generering av briefing, send til Telegram:

```typescript
import { sendDailyBriefing } from "~/.claude/integrations/telegram-bot/bot";

sendDailyBriefing({
  pendingApprovals: <antall fra godkjennings-kø>,
  todayBookings: <antall bookinger i dag>,
  unreadEmails: <antall uleste>,
  upcomingDeadlines: [<liste over frister>]
});
```
```

- [ ] **Step 3: Commit**

```bash
cd ~/.claude
git add skills/briefing/SKILL.md
git commit -m "feat: add Telegram push to daily briefing"
```

---

## Task 14: End-to-End Test

**Files:**
- Ingen nye filer

- [ ] **Step 1: Start alle tjenester**

```bash
# Terminal 1: Ollama
ollama serve

# Terminal 2: File watcher
~/.claude/hooks/coaching-inbox-watcher.sh

# Terminal 3: Telegram bot polling
cd ~/.claude/integrations/telegram-bot && npx ts-node -e "import { startPolling } from './handlers'; startPolling();"
```

- [ ] **Step 2: Test inbox-monitor**

```bash
claude --agent inbox-monitor
```

Forventet: Agent sjekker Gmail, kategoriserer, sender Telegram-varsling for nye items.

- [ ] **Step 3: Test coaching pipeline**

```bash
# Kopier en test-lydfil til inbox
cp ~/test-audio.m4a ~/Library/Mobile\ Documents/com~apple~CloudDocs/ak-golf-group/coaching/inbox/
```

Forventet: File watcher trigger, transkripsjon, analyse, Telegram-varsling.

- [ ] **Step 4: Test godkjenningsflyt**

1. Sjekk at item dukker opp i Notion godkjennings-inbox
2. Sjekk at Telegram-melding med knapper mottas
3. Trykk "Godkjenn" i Telegram
4. Verifiser at status oppdateres i Notion

- [ ] **Step 5: Test SoMe-generering**

```bash
claude --agent some-writer
```

Forventet: Genererer Instagram-post, kjører brand-validator, legger i godkjennings-kø.

- [ ] **Step 6: Dokumenter resultater**

```bash
echo "Test utført $(date): [PASS/FAIL] - [notater]" >> ~/.claude/test-log.md
```

---

## Neste steg etter plan

1. Konfigurer cron-jobs via ruflo eller launchd
2. Sett opp monitoring/logging
3. Iterér basert på faktisk bruk
4. Legg til flere agenter etter behov

---

*Plan generert av Claude Code*
*Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>*
