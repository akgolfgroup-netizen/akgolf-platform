# AK Golf Group — Agent Ecosystem Design

**Dato:** 2026-03-27
**Status:** Godkjent
**Eier:** Anders Kristiansen

---

## 1. Mål

Automatisere driften av AK Golf Group slik at Anders kun trenger å godkjenne output. Agenter håndterer:
- Innboksovervåking (e-post, booking, coaching, SoMe, Notion)
- Innholdsproduksjon (SoMe, nyhetsbrev, SEO)
- Coaching-støtte (transkripsjon, analyse, treningsplaner, øvelser)
- Rapportering og KPI-tracking

---

## 2. Arkitektur

### 2.1 Hybrid-modell

```
┌─────────────────────────────────────────────────────────────────┐
│                         MAC MINI (Server)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Ollama    │  │   Ruflo     │  │ File Watcher│              │
│  │  (lokal AI) │  │(orchestrator)│  │  (fswatch)  │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    CLAUDE CODE                             │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │  │
│  │  │ Skills  │ │ Agents  │ │  Hooks  │ │ Memory  │          │  │
│  │  │  (90+)  │ │  (10+)  │ │(triggers)│ │(context)│          │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EKSTERNE TJENESTER                          │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│  Claude  │ Kimi K2.5│  Notion  │  Gmail   │ Telegram │ Supabase │
│   API    │   API    │   MCP    │   MCP    │   Bot    │   MCP    │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

### 2.2 Komponenter

| Komponent | Ansvar |
|-----------|--------|
| **Ruflo** | Orkestrering, scheduling, workflow-kontroll |
| **Claude Code** | Utførelse via skills og sub-agenter |
| **Ollama** | Lokal AI for kostnadseffektive oppgaver |
| **File Watcher** | Event-basert triggering (coaching inbox) |
| **Telegram Bot** | Push-notifikasjoner og raske godkjenninger |
| **Notion** | Godkjennings-inbox og detaljert review |

---

## 3. Agent Teams

### 3.1 Content Team

| Agent | Ansvar | Modell |
|-------|--------|--------|
| content-planner | Ukentlig innholdsplan | Kimi K2.5 |
| some-writer | Instagram, Facebook, LinkedIn | Kimi K2.5 |
| newsletter-writer | Månedlig nyhetsbrev | Kimi K2.5 |
| brand-validator | Sjekk mot brand guide | Ollama |

### 3.2 Coaching Team

| Agent | Ansvar | Modell |
|-------|--------|--------|
| session-transcriber | Voice memo → tekst | Whisper |
| session-analyzer | Analyse + Notion-oppdatering | Claude Sonnet |
| plan-generator | Treningsplaner fra bibliotek | Claude Sonnet |
| drill-creator | Nye øvelser (godkjenning kreves) | Claude Opus |
| progress-tracker | Spiller-utvikling over tid | Claude Haiku |

### 3.3 Operations Team

| Agent | Ansvar | Modell |
|-------|--------|--------|
| inbox-monitor | E-post triage + prioritering | Ollama |
| booking-monitor | Nye bookinger, avbestillinger | Ollama |
| reminder-sender | SMS/e-post påminnelser | Maler |
| report-generator | Ukentlig KPI-rapport | Ollama |
| calendar-sync | GolfBox, Google Calendar | Ollama |

---

## 4. Schedule & Triggers

### 4.1 Tidsbaserte triggers (cron)

| Tid | Agent | Handling |
|-----|-------|----------|
| 07:00 | inbox-monitor | Sjekk e-post, kategoriser, flag hastemeldinger |
| 07:30 | booking-monitor | Sjekk nye bookinger, send bekreftelser |
| 08:00 | content-planner | Planlegg dagens SoMe-innhold |
| 09:00 | reminder-sender | Send påminnelser for morgendagens bookinger |
| 12:00 | inbox-monitor | Middag-sjekk av e-post |
| 17:00 | some-writer | Generer og kølegg kveldens post |
| 18:00 | inbox-monitor | Kveld-sjekk av e-post |
| Mandag 08:00 | report-generator | Ukentlig KPI-rapport |
| Fredag 10:00 | newsletter-writer | Forbered ukens nyhetsbrev |

### 4.2 Event-baserte triggers

| Event | Agent | Handling |
|-------|-------|----------|
| Ny fil i coaching/inbox/ | session-transcriber | Transkriber → session-analyzer |
| Ny booking opprettet | calendar-sync | Synk til Google Calendar |
| Booking kansellert | reminder-sender | Send kanselleringsbekreftelse |
| Stripe webhook | ops-team | Oppdater betalingsstatus |
| Notion-endring | progress-tracker | Oppdater spillerprogresjon |

---

## 5. Godkjenningsflyt

### 5.1 Hva krever godkjenning

| Type | Godkjenning |
|------|-------------|
| E-post-svar til kunde | Alltid |
| SoMe-post før publisering | Alltid |
| Nye drills/øvelser | Alltid |
| Nyhetsbrev | Alltid |
| Treningsplan utenfor norm | Ved avvik |
| Booking-påminnelser | Aldri (mal) |
| Kalender-synk | Aldri |
| Transkripsjon | Aldri |

### 5.2 Interface: Telegram + Notion

**Telegram** for push-notifikasjoner og raske ja/nei-godkjenninger.
**Notion** for detaljert review, redigering og historikk.

```
Agent ferdig med innhold
        ↓
Lagres i Notion med status "Venter"
        ↓
Telegram-push med [✅ Godkjenn] [❌ Avvis] [Se full]
        ↓
Anders velger:
   ✅ Godkjenn → Agent publiserer/sender
   ✏️ Se full → Åpner Notion for redigering
   ❌ Avvis → Agent lærer av feedback
```

---

## 6. Modell-routing & kostnader

### 6.1 Modell per oppgave

| Oppgave | Modell | Begrunnelse |
|---------|--------|-------------|
| Coaching-analyse | Claude Sonnet | Kvalitet kritisk |
| Treningsplan | Claude Sonnet | Kvalitet kritisk |
| Nye drills | Claude Opus | Kreativitet + kvalitet |
| Progress-tracking | Claude Haiku | Enkel aggregering |
| SoMe-innhold | Kimi K2.5 | Kreativt, ikke kritisk |
| Nyhetsbrev | Kimi K2.5 | Kreativt, godkjennes |
| E-post triage | Ollama lokal | Enkel klassifisering |
| Rapporter | Ollama lokal | Strukturert data |
| Brand-validering | Ollama lokal | Regelbasert |

### 6.2 Månedlig kostnad

| Kategori | Kostnad |
|----------|---------|
| Claude (alle modeller) | ~$4 |
| Kimi K2.5 | ~$0.25 |
| Whisper | ~$0.50 |
| Ollama | $0 |
| **Total** | **~$5/mnd** |

### 6.3 Ollama modeller (Mac Mini)

| Modell | Bruk | RAM |
|--------|------|-----|
| qwen2.5:14b | E-post triage, kategorisering | 10GB |
| llama3.2:8b | Brand-validering, enkel analyse | 6GB |
| nomic-embed-text | Embedding for søk | 2GB |

---

## 7. Drillbibliotek

### 7.1 Eksisterende ressurser

Ligger i `content/sportsplan/`:

| Fil | Innhold |
|-----|---------|
| drillbibliotek.md | Strukturerte øvelser (LS-01, LS-02, etc.) |
| testprotokoller.md | 23 standardiserte tester |
| evalueringsskjema.md | IUP-kartlegging (A–K) |
| junior-academy-sportsplan.md | Junior-plan |
| masterplan-2026.md | Helårsplan |
| mental-trening.md | Mental coaching |

### 7.2 Utvidelse

drill-creator agent foreslår nye øvelser basert på eksisterende mønster:
1. Analyserer eksisterende drills for format og struktur
2. Genererer ny drill med samme metadata-format
3. Sender til godkjenning via Telegram
4. Ved godkjenning: legges til drillbibliotek.md

---

## 8. Implementeringsfaser

### Fase 1: Fundament (Uke 1)
- [ ] Telegram-bot oppsett
- [ ] Notion godkjennings-inbox database
- [ ] Ollama på Mac Mini (qwen2.5:14b, llama3.2:8b)
- [ ] Ruflo workflow-config (YAML)

### Fase 2: Operations Team (Uke 2)
- [ ] inbox-monitor agent
- [ ] booking-monitor agent
- [ ] reminder-sender agent
- [ ] calendar-sync agent

### Fase 3: Coaching Team (Uke 3)
- [ ] session-transcriber agent
- [ ] session-analyzer agent
- [ ] plan-generator agent
- [ ] progress-tracker agent

### Fase 4: Content Team (Uke 4)
- [ ] content-planner agent
- [ ] some-writer agent
- [ ] newsletter-writer agent
- [ ] brand-validator agent

### Fase 5: Optimalisering (Uke 5+)
- [ ] drill-creator agent
- [ ] Feedback-loop (læring fra avvisninger)
- [ ] Dashboard for agent-aktivitet

---

## 9. Suksesskriterier

| Mål | Måling |
|-----|--------|
| Anders godkjenner kun | < 30 min/dag på godkjenning |
| Ingen glemte meldinger | 100% e-post besvart innen 24t |
| Konsistent innhold | SoMe publisert 5x/uke |
| Coaching dokumentert | 100% sesjoner transkribertog analysert |
| Lav kostnad | < $10/mnd API-kostnader |

---

## 10. Neste steg

1. Opprett Telegram-bot
2. Sett opp Notion godkjennings-database
3. Installer Ollama på Mac Mini
4. Skriv første ruflo workflow (inbox-monitor)
5. Test ende-til-ende med én agent

---

*Generert av Claude Code*
*Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>*
