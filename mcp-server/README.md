# AK Golf MCP Server

MCP-server for AK Golf Academy. Bygget på Masterdokument v2.0 og Anthropic MCP SDK guidelines.

## Compliance med MCP-spesifikasjonen

- ✅ `ak_` namespace prefix på alle 25 tools
- ✅ `registerTool()` med `title`, `description`, `inputSchema`, `outputSchema`, `annotations`
- ✅ `structuredContent` i alle tool responses
- ✅ Zod schemas med `.strict()` og `.describe()` på alle felt
- ✅ `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` annotations
- ✅ 4 Resources for statisk referansedata (URI-basert)
- ✅ 4 Prompts for reusable coaching-workflows
- ✅ Sentralisert error handling med actionable feilmeldinger
- ✅ Pagination med `has_more`, `next_offset`, `total`
- ✅ Streamable HTTP med DNS rebinding protection (binds 127.0.0.1)
- ✅ stdio transport for Claude Desktop / Claude Code

## Arkitektur

```
Claude ←→ MCP Server ←→ Supabase (PostgreSQL)
              │
              ├── 25 Tools    (ak_drill_*, ak_player_*, ak_trackman_*, ak_voice_*, ak_training_*, ak_test_*, ak_bp_*)
              ├── 4 Resources (ak://reference/formula, distributions, hours, invariants)
              └── 4 Prompts   (ak_weekly_plan, ak_player_assessment, ak_build_drill_library, ak_session_debrief)
```

## Oppsett

```bash
# 1. Installer
npm install

# 2. Miljøvariabler
export SUPABASE_URL="https://din-prosjekt.supabase.co"
export SUPABASE_SERVICE_KEY="din-service-role-key"

# 3. Kjør SQL-migrering i Supabase SQL Editor
#    supabase/migrations/001_initial_schema.sql

# 4. Bygg og start
npm run build
npm start                    # stdio (Claude Desktop / Claude Code)
TRANSPORT=http npm start     # HTTP (claude.ai / remote)
```

### Claude Desktop config

```json
{
  "mcpServers": {
    "ak-golf": {
      "command": "node",
      "args": ["/sti/til/ak-golf-mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "https://din-prosjekt.supabase.co",
        "SUPABASE_SERVICE_KEY": "din-key"
      }
    }
  }
}
```

## Tools (25)

### ak_drill_* — Drill-bibliotek (4)
| Tool | R/W | Beskrivelse |
|------|-----|-------------|
| `ak_drill_create` | W | Opprett drill med full AK-formel-tagging |
| `ak_drill_search` | R | Søk med filtre: pyramide, område, L-fase, kategori, TrackMan-metric, SG |
| `ak_drill_approve` | W | Godkjenn/avvis (kun godkjente i treningsplaner) |
| `ak_drill_stats` | R | Bibliotek-statistikk og dekningsgrad |

### ak_drill agent — Drill-intelligens (3)
| Tool | R/W | Beskrivelse |
|------|-----|-------------|
| `ak_drill_suggest` | R | AI-matching: spillersvakheter → rangerte drill-forslag |
| `ak_drill_import_batch` | W | Masseimport (AI-genererte starter unapproved) |
| `ak_drill_coverage_gaps` | R | Analyser hull i biblioteket |

### ak_player_* / ak_session_* — Spillere og økter (5)
| Tool | R/W | Beskrivelse |
|------|-----|-------------|
| `ak_player_create` | W | Registrer spiller med kategori A–K |
| `ak_player_get` | R | Hent via UUID eller navnesøk |
| `ak_player_list` | R | List spillere, filtrer på kategori |
| `ak_session_log` | W | Logg økt med AK-formel ID |
| `ak_session_history` | R | Treningshistorikk med pyramidefordeling |

### ak_trackman_* — TrackMan (2)
| Tool | R/W | Beskrivelse |
|------|-----|-------------|
| `ak_trackman_log` | W | Lagre slagdata (screenshot/CSV/manuell) |
| `ak_trackman_analyze` | R | Trender per kølle med snitt + stddev |

### ak_voice_* — Coaching-notater (2)
| Tool | R/W | Beskrivelse |
|------|-----|-------------|
| `ak_voice_save` | W | Lagre transkribert notat (trener/spiller) |
| `ak_voice_search` | R | Søk per spiller, fritekst, tidsperiode |

### ak_training_* — Treningsplanlegger (3)
| Tool | R/W | Beskrivelse |
|------|-----|-------------|
| `ak_training_analyze` | R | 7-dagers analyse: økter, TrackMan, notater, tester, BPs, invariant-sjekk |
| `ak_training_plan_save` | W | Lagre ukeplan med Masterdokument-fordeling |
| `ak_training_plan_get` | R | Hent aktiv plan |

### ak_test_* — Testprotokoller (3)
| Tool | R/W | Beskrivelse |
|------|-----|-------------|
| `ak_test_log` | W | Logg 20 tester / 7 kategorier, auto-beregn opprykk |
| `ak_test_compare` | R | Sammenlign mot benchmarks for nåværende + neste kategori |
| `ak_test_history` | R | Testprogresjon over tid |

### ak_bp_* — Breaking Points (3)
| Tool | R/W | Beskrivelse |
|------|-----|-------------|
| `ak_bp_log` | W | Registrer CS/M/PR terskel der teknikk bryter |
| `ak_bp_history` | R | Historikk per type |
| `ak_bp_progression` | R | Progressjonsanalyse — beveger terskler seg opp? |

## Resources (4)

| URI | Innhold |
|-----|---------|
| `ak://reference/formula` | Alle AK-formel enum-verdier |
| `ak://reference/distributions` | Pyramidefordeling per kategori × periode (§7) |
| `ak://reference/hours` | Treningstimer per uke per kategori (§5) |
| `ak://reference/invariants` | 13 ubrytelige regler (§12) |

## Prompts (4)

| Prompt | Workflow |
|--------|----------|
| `ak_weekly_plan` | Analyse → driller → ukeplan (komplett planlegging) |
| `ak_player_assessment` | Tester + TrackMan + BPs → kvartalsrapport |
| `ak_build_drill_library` | Finn hull → generer driller → batch-import |
| `ak_session_debrief` | Logg økt + BPs + voice note etter coaching |

## Lisens

Proprietær — AK Golf Group AS
