# CoachHQ MCP-server

MCP-server som eksponerer CoachHQ-data og verktøy til Claude Code / Kimi Claw.

## Installasjon

```bash
npm install @modelcontextprotocol/sdk
```

## Registrering

Legg til i `~/.claude.json` (global) eller `.mcp.json` i prosjektet:

```json
{
  "mcpServers": {
    "ak-coach": {
      "command": "tsx",
      "args": [
        "/Users/anderskristiansen/Developer/akgolf/akgolf-platform/scripts/mcp-coach-hq/server.ts"
      ],
      "env": {
        "DATABASE_URL": "<fra .env>",
        "DIRECT_URL": "<fra .env>",
        "ANTHROPIC_API_KEY": "<fra .env>",
        "OPENAI_API_KEY": "<fra .env>"
      }
    }
  }
}
```

## Verktøy

| Tool | Bruk |
|---|---|
| `list-students` | Søk etter elever |
| `get-student-context` | 5 siste sesjoner, mål, HCP, TrackMan-data |
| `get-session-transcript` | Full transkripsjon + sammendrag |
| `generate-next-session` | Generer komplett neste-økt-utkast |
| `search-drills` | Søk i øvelsesbiblioteket |
| `log-training-note` | Legg til treningslogg for elev |

## Bruk fra Claude Code

Etter registrering kan du spørre Claude Code:

- "Bruk ak-coach til å vise meg kontekst for Markus"
- "Generer neste-økt-utkast for Erik via ak-coach"
- "Søk ak-coach etter putting-drills"

## Neste steg

- Legg til `publish-session-summary` (MCP kan publisere utkast)
- Legg til `assign-drill-pack` for batch-tildeling
- OAuth-autentisering mot Supabase for multi-coach-bruk
