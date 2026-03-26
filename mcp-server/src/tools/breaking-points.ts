import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getSupabase } from '../services/supabase.js';
import { success, error, handleSupabaseError } from '../services/responses.js';
import { BPLogInput } from '../schemas/index.js';

export function registerBreakingPointTools(server: McpServer): void {

  server.registerTool('ak_bp_log', {
    title: 'Log Breaking Point', description: `Record where technique breaks down (Masterdokument §11).\n\nTypes: CS (speed), M (environment), PR (pressure)\nExample: "Ny P5.0-P6.0 holdt til CS60, brøt ved CS70"\n\nArgs: player_id, bp_type, threshold (e.g. "CS70"), description`,
    inputSchema: BPLogInput,
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const { data, error: err } = await sb.from('breaking_points').insert(params).select().single();
    if (err) return handleSupabaseError(err, 'ak_bp_log');
    return success(data as Record<string, unknown>);
  });

  server.registerTool('ak_bp_history', {
    title: 'Breaking Point History', description: `Get all BPs for a player, optionally filtered by type.\n\nArgs: player_id, bp_type (optional), days (default 90), limit (default 20)\nReturns: { total, summary by type, breaking_points[] }`,
    inputSchema: z.object({ player_id: z.string().uuid(), bp_type: z.enum(['CS','M','PR']).optional(), days: z.number().int().default(90), limit: z.number().int().default(20) }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - params.days);
    let q = sb.from('breaking_points').select('*').eq('player_id', params.player_id).gte('recorded_at', cutoff.toISOString()).order('recorded_at', { ascending: false }).limit(params.limit);
    if (params.bp_type) q = q.eq('bp_type', params.bp_type);
    const { data, error: err } = await q;
    if (err) return handleSupabaseError(err, 'ak_bp_history');
    const bps = data ?? [];
    const byType: Record<string, string[]> = {};
    for (const bp of bps) { if (!byType[bp.bp_type]) byType[bp.bp_type] = []; byType[bp.bp_type].push(bp.threshold); }
    return success({ total: bps.length, period_days: params.days, summary: Object.fromEntries(Object.entries(byType).map(([t, th]) => [t, { count: th.length, latest: th[0], unique: [...new Set(th)] }])), breaking_points: bps });
  });

  server.registerTool('ak_bp_progression', {
    title: 'Breaking Point Progression', description: `Are thresholds improving over time? Compares oldest vs newest to show direction.\n\nArgs: player_id\nReturns: Per-type progression analysis.`,
    inputSchema: z.object({ player_id: z.string().uuid() }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const { data: bps, error: err } = await sb.from('breaking_points').select('bp_type, threshold, recorded_at').eq('player_id', params.player_id).order('recorded_at');
    if (err) return handleSupabaseError(err, 'ak_bp_progression');
    if (!bps?.length) return success({ player_id: params.player_id, total: 0, progression: {}, message: 'Ingen breaking points registrert.' });
    const extractNum = (t: string) => { const m = t.match(/\d+/); return m ? parseInt(m[0]) : 0; };
    const prog: Record<string, { first: string; latest: string; direction: string; count: number }> = {};
    for (const type of ['CS','M','PR']) {
      const tb = bps.filter(b => b.bp_type === type);
      if (!tb.length) continue;
      const fN = extractNum(tb[0].threshold); const lN = extractNum(tb[tb.length-1].threshold);
      prog[type] = { first: tb[0].threshold, latest: tb[tb.length-1].threshold, direction: lN > fN ? 'Forbedring ↑' : lN < fN ? 'Tilbakegang ↓' : 'Uendret', count: tb.length };
    }
    return success({ player_id: params.player_id, total: bps.length, progression: prog });
  });
}
