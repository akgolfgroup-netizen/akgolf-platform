import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getSupabase } from '../services/supabase.js';
import { success, error, handleSupabaseError } from '../services/responses.js';
import { PlayerCreateInput, PlayerGetInput, SessionLogInput, SessionHistoryInput, PlayerOutput, SessionSummaryOutput } from '../schemas/index.js';
import { PLAYER_CATEGORIES } from '../constants.js';

export function registerPlayerTools(server: McpServer): void {

  server.registerTool('ak_player_create', {
    title: 'Create Player', description: `Register new player. Categories A–K based on scoring average (A=<68, K=100+).\n\nReturns: Full player object with UUID.`,
    inputSchema: PlayerCreateInput, outputSchema: PlayerOutput,
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const { data, error: err } = await sb.from('players').insert(params).select().single();
    if (err) return handleSupabaseError(err, 'ak_player_create');
    return success(data as Record<string, unknown>);
  });

  server.registerTool('ak_player_get', {
    title: 'Get Player', description: `Get player by UUID or name search.\n\nArgs: player_id (UUID) OR name (partial match)\nReturns: Player profile(s) with category, CS calibration, period, facilities.`,
    inputSchema: PlayerGetInput, outputSchema: z.array(PlayerOutput),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    if (!params.player_id && !params.name) return error('Oppgi player_id eller name.', 'Bruk ak_player_list for å se alle spillere.');
    let q = sb.from('players').select('*');
    if (params.player_id) q = q.eq('id', params.player_id);
    else if (params.name) q = q.ilike('name', `%${params.name}%`);
    const { data, error: err } = await q;
    if (err) return handleSupabaseError(err, 'ak_player_get');
    if (!data?.length) return error(`Ingen spiller funnet${params.name ? ` med navn "${params.name}"` : ''}.`, 'Sjekk stavemåte eller bruk ak_player_list.');
    return success({ players: data });
  });

  server.registerTool('ak_player_list', {
    title: 'List Players', description: `List all players, optionally filtered by category.\n\nArgs: category (A–K, optional), limit (default 50)\nReturns: Array of { id, name, category, handicap, avg_score, current_period }`,
    inputSchema: z.object({ category: z.enum(PLAYER_CATEGORIES).optional(), limit: z.number().int().min(1).max(100).default(50) }).strict(),
    outputSchema: z.object({ players: z.array(PlayerOutput) }),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    let q = sb.from('players').select('id, name, category, handicap, avg_score, current_period').order('name');
    if (params.category) q = q.eq('category', params.category);
    const { data, error: err } = await q.limit(params.limit);
    if (err) return handleSupabaseError(err, 'ak_player_list');
    return success({ players: data ?? [] });
  });

  server.registerTool('ak_session_log', {
    title: 'Log Training Session', description: `Log session using AK formula. Format: [Pyramide]_[Område]_L-[fase]_CS[nivå]_M[miljø]_PR[press]_[P-pos]_[LIFE]\n\nAttach drill_ids to link drills used. Returns: Created session record.`,
    inputSchema: SessionLogInput,
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const { data, error: err } = await sb.from('sessions').insert(params).select().single();
    if (err) return handleSupabaseError(err, 'ak_session_log');
    return success(data as Record<string, unknown>);
  });

  server.registerTool('ak_session_history', {
    title: 'Get Session History', description: `Player's sessions for last N days with pyramid distribution analysis.\n\nArgs: player_id, days (default 7), pyramid_level (optional filter)\nReturns: { period_days, total_sessions, total_minutes, total_hours, distribution_pct, sessions[] }`,
    inputSchema: SessionHistoryInput, outputSchema: SessionSummaryOutput,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - params.days);
    let q = sb.from('sessions').select('*').eq('player_id', params.player_id).gte('date', cutoff.toISOString().split('T')[0]).order('date', { ascending: false }).limit(params.limit);
    if (params.pyramid_level) q = q.eq('pyramid_level', params.pyramid_level);
    const { data, error: err } = await q;
    if (err) return handleSupabaseError(err, 'ak_session_history');
    const sessions = data ?? [];
    const totalMin = sessions.reduce((s, x) => s + x.duration_minutes, 0);
    const byPyr: Record<string, number> = {};
    for (const s of sessions) byPyr[s.pyramid_level] = (byPyr[s.pyramid_level] ?? 0) + s.duration_minutes;
    return success({ period_days: params.days, total_sessions: sessions.length, total_minutes: totalMin, total_hours: Math.round(totalMin / 60 * 10) / 10,
      distribution_pct: Object.fromEntries(Object.entries(byPyr).map(([k, v]) => [k, totalMin > 0 ? Math.round(v / totalMin * 100) : 0])), sessions });
  });
}
