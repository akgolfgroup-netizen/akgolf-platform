import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  PLAYER_CATEGORIES, PYRAMID_LEVELS, TRAINING_AREAS, L_PHASES,
  CS_LEVELS, ENVIRONMENTS, PRESS_LEVELS, LIFE_CODES, PERIODS,
  DISTRIBUTION_TEMPLATES, HOURS_PER_WEEK
} from './constants.js';

export function registerResources(server: McpServer): void {

  // ── AK Formula Reference ──────────────────────────────────
  server.registerResource(
    'ak-formula',
    'ak://reference/formula',
    {
      title: 'AK Formula Reference',
      description: 'Complete AK training formula enum values: pyramid levels, training areas, L-phases, CS levels, environments, press levels, LIFE codes, periods.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [{
        uri: 'ak://reference/formula',
        mimeType: 'application/json',
        text: JSON.stringify({
          pyramid_levels: [...PYRAMID_LEVELS],
          training_areas: [...TRAINING_AREAS],
          l_phases: [...L_PHASES],
          cs_levels: [...CS_LEVELS],
          environments: [...ENVIRONMENTS],
          press_levels: [...PRESS_LEVELS],
          life_codes: [...LIFE_CODES],
          periods: [...PERIODS],
          player_categories: [...PLAYER_CATEGORIES],
        }, null, 2),
      }],
    })
  );

  // ── Distribution Templates ────────────────────────────────
  server.registerResource(
    'ak-distributions',
    'ak://reference/distributions',
    {
      title: 'Pyramid Distribution Templates',
      description: 'Target training distribution percentages per category and period from Masterdokument §7.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [{
        uri: 'ak://reference/distributions',
        mimeType: 'application/json',
        text: JSON.stringify(DISTRIBUTION_TEMPLATES, null, 2),
      }],
    })
  );

  // ── Hours Per Week ────────────────────────────────────────
  server.registerResource(
    'ak-hours',
    'ak://reference/hours',
    {
      title: 'Training Hours Per Week',
      description: 'Target weekly training hours per category, summer and winter, from Masterdokument §5.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [{
        uri: 'ak://reference/hours',
        mimeType: 'application/json',
        text: JSON.stringify(HOURS_PER_WEEK, null, 2),
      }],
    })
  );

  // ── Invariants ────────────────────────────────────────────
  server.registerResource(
    'ak-invariants',
    'ak://reference/invariants',
    {
      title: 'Training Invariants',
      description: 'The 13 unbreakable rules from Masterdokument §12 that can never be overridden.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [{
        uri: 'ak://reference/invariants',
        mimeType: 'application/json',
        text: JSON.stringify({
          invariants: [
            { id: 1, rule: 'TEK minimum 15%', description: 'I alle uketyper hele året' },
            { id: 2, rule: 'TEK-økt innen 48 timer', description: 'Etter turneringsrunde — mandag/tirsdag er TEK-dominert' },
            { id: 3, rule: 'C–E: Maks 3–4 turneringshelger på rad', description: 'Deretter minimum 1 treningsuke' },
            { id: 4, rule: 'F–G: Maks 2 helger på rad', description: 'Deretter treningsuke' },
            { id: 5, rule: 'H–K: Maks 1 turneringshelg', description: 'Alltid treningsuke mellom' },
            { id: 6, rule: 'Ingen ny teknikk i TURN-periode', description: 'Kun vedlikehold og forsterkning' },
            { id: 7, rule: 'Tilbakefallsregel', description: 'Teknisk tilbakefall → TURN droppes, full TEK-uke' },
            { id: 8, rule: 'Maks 25–35 turneringsrunder/år', description: 'For C–E' },
            { id: 9, rule: 'Maks 4 turneringsrunder/mnd', description: 'For I–K' },
            { id: 10, rule: 'CS50 minimum for balltrening', description: 'Under dette er TEK-STAT (posisjonshold)' },
            { id: 11, rule: 'FYS-BUILD kun i grunnperioden', description: 'April–september er vedlikehold' },
            { id: 12, rule: 'LIFE integrert', description: 'I alle økter, alle perioder, alle kategorier' },
            { id: 13, rule: 'Aldersregel', description: 'Ukentlige timer ≤ spillerens alder' },
          ],
        }, null, 2),
      }],
    })
  );
}
