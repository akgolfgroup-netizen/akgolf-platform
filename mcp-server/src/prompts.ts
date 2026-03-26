import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PLAYER_CATEGORIES, PERIODS, WEEK_TYPES } from './constants.js';

export function registerPrompts(server: McpServer): void {

  // ── Weekly Plan Workflow ───────────────────────────────────
  server.registerPrompt(
    'ak_weekly_plan',
    {
      title: 'Generate Weekly Training Plan',
      description: 'Complete workflow: analyze last 7 days, find drill gaps, generate plan. Use as starting point for weekly planning.',
      argsSchema: {
        player_name: z.string().describe('Player name to generate plan for'),
        week_type: z.enum(WEEK_TYPES).optional().describe('TURNERINGSUKE or TRENINGSUKE'),
      },
    },
    ({ player_name, week_type }) => ({
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Generer en komplett treningsplan for ${player_name}${week_type ? ` (${week_type})` : ''}.

Workflow:
1. Bruk ak_player_get for å finne spilleren
2. Bruk ak_training_analyze for å se siste 7 dagers trening
3. Bruk ak_test_compare for å se testresultater vs benchmarks
4. Bruk ak_bp_history for å se breaking points
5. Bruk ak_drill_suggest for svakhetsområdene
6. Generer ukeplan med konkrete driller, tider og mål
7. Bruk ak_training_plan_save for å lagre planen

Følg Masterdokumentets pyramidefordeling og respekter alle invarianter.`,
        },
      }],
    })
  );

  // ── Player Assessment ─────────────────────────────────────
  server.registerPrompt(
    'ak_player_assessment',
    {
      title: 'Full Player Assessment',
      description: 'Comprehensive assessment: tests, TrackMan, breaking points, coaching notes. Use for quarterly review.',
      argsSchema: {
        player_name: z.string().describe('Player name to assess'),
      },
    },
    ({ player_name }) => ({
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Gjennomfør en komplett spillervurdering for ${player_name}.

1. ak_player_get — hent profil og kategori
2. ak_test_compare — sammenlign siste test mot benchmarks
3. ak_test_history — vis progresjon over tid
4. ak_trackman_analyze — 30 dagers slagdata
5. ak_bp_progression — er breaking points i bedring?
6. ak_session_history med days=30 — treningsvolum siste måned
7. ak_voice_search — siste coaching-notater

Oppsummer: styrker, svakheter, opprykksklarhet, anbefalinger for neste periode.`,
        },
      }],
    })
  );

  // ── Drill Library Builder ─────────────────────────────────
  server.registerPrompt(
    'ak_build_drill_library',
    {
      title: 'Build Drill Library',
      description: 'Find coverage gaps and generate drills to fill them.',
      argsSchema: {
        focus_area: z.string().optional().describe('Specific area to focus on, e.g. "putting" or "TEK"'),
      },
    },
    ({ focus_area }) => ({
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Bygg ut drill-biblioteket${focus_area ? ` med fokus på ${focus_area}` : ''}.

1. Bruk ak_drill_stats for å se nåværende dekning
2. Bruk ak_drill_coverage_gaps for å finne hull
3. For hvert hull: generer 2-3 driller med full AK-formel-tagging
4. Bruk ak_drill_import_batch for å importere dem (source="ai_generated")
5. Vis oversikt over hva som ble lagt til og hva som fortsatt mangler

Husk: AI-genererte driller starter som uapproved. Vis meg listen så jeg kan godkjenne.`,
        },
      }],
    })
  );

  // ── Post-Session Debrief ──────────────────────────────────
  server.registerPrompt(
    'ak_session_debrief',
    {
      title: 'Post-Session Debrief',
      description: 'Quick debrief after a coaching session: log data, note observations, update breaking points.',
      argsSchema: {
        player_name: z.string().describe('Player name'),
        session_notes: z.string().describe('Quick notes from the session'),
      },
    },
    ({ player_name, session_notes }) => ({
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Post-session debrief for ${player_name}.

Notater: ${session_notes}

1. ak_player_get — finn spilleren
2. Basert på notatene: ak_session_log med riktig AK-formel
3. Hvis breaking points ble observert: ak_bp_log
4. ak_voice_save med notatene som transcript
5. Oppsummer hva som ble logget`,
        },
      }],
    })
  );
}
