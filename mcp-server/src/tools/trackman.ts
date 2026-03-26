import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getSupabase } from '../services/supabase.js';
import { success, error, handleSupabaseError } from '../services/responses.js';
import { TrackmanLogInput, TrackmanAnalyzeInput, TrackmanAnalysisOutput } from '../schemas/index.js';

export function registerTrackmanTools(server: McpServer): void {

  server.registerTool('ak_trackman_log', {
    title: 'Log TrackMan Shots', description: `Store TrackMan shot data from screenshots (parsed by Claude Vision), CSV export, or manual entry. All numeric fields optional — log what you have.\n\nArgs: player_id, source (screenshot|csv|manual), shots[]\nReturns: { trackman_session_id, shots_logged, source }`,
    inputSchema: TrackmanLogInput,
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const { data: session, error: sErr } = await sb.from('trackman_sessions').insert({ player_id: params.player_id, session_id: params.session_id, source: params.source, raw_data: { shot_count: params.shots.length } }).select().single();
    if (sErr) return handleSupabaseError(sErr, 'ak_trackman_log (session)');
    const shots = params.shots.map((s, i) => ({ trackman_session_id: session.id, shot_number: i + 1, ...s }));
    const { error: shErr } = await sb.from('trackman_shots').insert(shots);
    if (shErr) return handleSupabaseError(shErr, 'ak_trackman_log (shots)');
    return success({ trackman_session_id: session.id, player_id: params.player_id, shots_logged: params.shots.length, source: params.source });
  });

  server.registerTool('ak_trackman_analyze', {
    title: 'Analyze TrackMan Data', description: `Analyze player's TrackMan data over time. Returns per-club averages + std dev.\n\nArgs: player_id, days (default 30), club (optional filter), metrics (optional focus)\nReturns: { player_id, period_days, total_shots, total_sessions, by_club: { club: { metric_avg, metric_std } } }`,
    inputSchema: TrackmanAnalyzeInput, outputSchema: TrackmanAnalysisOutput,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - params.days);
    const { data: sessions } = await sb.from('trackman_sessions').select('id').eq('player_id', params.player_id).gte('date', cutoff.toISOString().split('T')[0]);
    if (!sessions?.length) return success({ player_id: params.player_id, period_days: params.days, total_shots: 0, total_sessions: 0, by_club: {}, message: `Ingen TrackMan-data siste ${params.days} dager.` });
    let q = sb.from('trackman_shots').select('*').in('trackman_session_id', sessions.map(s => s.id)).order('created_at');
    if (params.club) q = q.eq('club', params.club);
    const { data: shots, error: err } = await q;
    if (err) return handleSupabaseError(err, 'ak_trackman_analyze');
    if (!shots?.length) return success({ player_id: params.player_id, period_days: params.days, total_shots: 0, total_sessions: sessions.length, by_club: {}, message: 'Ingen slag med disse filtrene.' });
    const byClub: Record<string, Record<string, number | null>> = {};
    const fields = ['club_speed','ball_speed','smash_factor','launch_angle','spin_rate','carry_distance','total_distance','face_angle','club_path','attack_angle','face_to_path','apex_height','landing_angle','lateral_landing'];
    const grouped: Record<string, typeof shots> = {};
    for (const s of shots) { const c = s.club ?? 'unknown'; if (!grouped[c]) grouped[c] = []; grouped[c].push(s); }
    for (const [club, cs] of Object.entries(grouped)) {
      byClub[club] = { shot_count: cs.length };
      for (const f of fields) {
        if (params.metrics?.length && !params.metrics.includes(f)) continue;
        const vals = cs.map(s => s[f as keyof typeof s] as number | null).filter((v): v is number => v != null);
        if (vals.length) { const avg = vals.reduce((a, b) => a + b, 0) / vals.length; byClub[club][`${f}_avg`] = Math.round(avg * 100) / 100; byClub[club][`${f}_std`] = Math.round(Math.sqrt(vals.reduce((s, v) => s + (v - avg) ** 2, 0) / vals.length) * 100) / 100; }
      }
    }
    return success({ player_id: params.player_id, period_days: params.days, total_shots: shots.length, total_sessions: sessions.length, by_club: byClub });
  });
}
