import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getSupabase } from '../services/supabase.js';
import { success, error, handleSupabaseError } from '../services/responses.js';
import { TrainingPlanGenerateInput, TrainingPlanGetInput } from '../schemas/index.js';
import { DISTRIBUTION_TEMPLATES, HOURS_PER_WEEK, type PlayerCategory } from '../constants.js';
import { z } from 'zod';

export function registerTrainingTools(server: McpServer): void {

  server.registerTool('ak_training_analyze', {
    title: 'Analyze Recent Training', description: `Comprehensive 7-day analysis: sessions, TrackMan, voice notes, test results, breaking points. Compares actual vs Masterdokument target distribution. Flags invariant violations.

This is the primary input for training plan generation.

Args: player_id (UUID)

Returns:
  { player: {...}, training_last_7_days: { actual vs target distribution, gaps }, trackman, coaching_notes, latest_test, breaking_points, invariant_violations[] }`,
    inputSchema: z.object({ player_id: z.string().uuid() }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const { data: player, error: pErr } = await sb.from('players').select('*').eq('id', params.player_id).single();
    if (pErr || !player) return error('Spiller ikke funnet', 'Bruk ak_player_list for gyldige IDer.');
    const cat = player.category as PlayerCategory;
    const period = player.current_period ?? 'GRUNN';
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const dateStr = weekAgo.toISOString().split('T')[0];

    // Sessions
    const { data: sessions } = await sb.from('sessions').select('*').eq('player_id', params.player_id).gte('date', dateStr).order('date', { ascending: false });
    const sl = sessions ?? [];
    const totalMin = sl.reduce((s, x) => s + x.duration_minutes, 0);
    const byPyr: Record<string, number> = {};
    for (const s of sl) byPyr[s.pyramid_level] = (byPyr[s.pyramid_level] ?? 0) + s.duration_minutes;
    const actualPct = Object.fromEntries(Object.entries(byPyr).map(([k, v]) => [k, totalMin > 0 ? Math.round(v / totalMin * 100) : 0]));
    const targetPct = DISTRIBUTION_TEMPLATES[`${cat}_${period}`] ?? {};
    const gaps = Object.entries(targetPct).filter(([k, v]) => Math.abs((actualPct[k] ?? 0) - (v as number)) > 10).map(([k, v]) => `${k}: ${actualPct[k] ?? 0}% vs mål ${v}%`);

    // TrackMan
    const { data: tmS } = await sb.from('trackman_sessions').select('id').eq('player_id', params.player_id).gte('date', dateStr);
    let tmSummary = 'Ingen TrackMan-data siste 7 dager';
    if (tmS?.length) {
      const { data: shots } = await sb.from('trackman_shots').select('id').in('trackman_session_id', tmS.map(s => s.id));
      tmSummary = `${shots?.length ?? 0} slag fra ${tmS.length} økter`;
    }

    // Voice notes
    const { data: notes } = await sb.from('voice_notes').select('summary, key_points, created_at').eq('player_id', params.player_id).gte('created_at', weekAgo.toISOString()).order('created_at', { ascending: false }).limit(5);

    // Latest test
    const { data: tests } = await sb.from('test_results').select('*').eq('player_id', params.player_id).order('test_date', { ascending: false }).limit(1);

    // Breaking points
    const { data: bps } = await sb.from('breaking_points').select('*').eq('player_id', params.player_id).gte('recorded_at', weekAgo.toISOString());

    // Invariant check
    const violations: string[] = [];
    if (totalMin > 0 && (actualPct['TEK'] ?? 0) < 15) violations.push(`#1: TEK er ${actualPct['TEK'] ?? 0}% — minimum 15%`);
    const turnCount = sl.filter(s => s.pyramid_level === 'TURN').length;
    if (['H','I','J','K'].includes(cat) && turnCount > 1) violations.push(`#5: Kat ${cat} maks 1 turneringshelg, fant ${turnCount} TURN-økter`);

    return success({
      player: { id: player.id, name: player.name, category: cat, period, handicap: player.handicap, avg_score: player.avg_score },
      training_last_7_days: { total_sessions: sl.length, total_minutes: totalMin, total_hours: Math.round(totalMin / 60 * 10) / 10, actual_pct: actualPct, target_pct: targetPct, target_hours: HOURS_PER_WEEK[cat], gaps },
      trackman: tmSummary,
      coaching_notes: (notes ?? []).map(n => ({ summary: n.summary, key_points: n.key_points })),
      latest_test: tests?.[0] ?? null,
      breaking_points: bps ?? [],
      invariant_violations: violations,
    });
  });

  server.registerTool('ak_training_plan_save', {
    title: 'Save Training Plan', description: `Save generated weekly plan with daily schedule and drill references.\n\nArgs: player_id, week_start (YYYY-MM-DD Monday), period, week_type, focus_areas\nReturns: Saved plan with auto-calculated distribution from Masterdokument.`,
    inputSchema: TrainingPlanGenerateInput,
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const { data: player } = await sb.from('players').select('category, current_period').eq('id', params.player_id).single();
    if (!player) return error('Spiller ikke funnet');
    const p = params.period ?? player.current_period ?? 'GRUNN';
    const wt = params.week_type ?? 'TRENINGSUKE';
    const cat = player.category as PlayerCategory;
    const month = new Date(params.week_start).getMonth() + 1;
    const hours = HOURS_PER_WEEK[cat][month >= 4 && month <= 9 ? 'summer' : 'winter'];
    let tKey = `${cat}_${p}`;
    if (p === 'TURN') tKey = wt === 'TURNERINGSUKE' ? `${cat}_TURN_T` : `${cat}_TURN_TR`;
    const dist = DISTRIBUTION_TEMPLATES[tKey] ?? {};
    const plan = { player_id: params.player_id, week_start: params.week_start, period: p, week_type: wt, total_hours: (hours[0] + hours[1]) / 2, distribution: dist, daily_plan: {}, rationale: `Kat ${cat}, ${p}, ${wt}. Mål: ${hours[0]}–${hours[1]} t/uke.` };
    const { data, error: err } = await sb.from('training_plans').insert(plan).select().single();
    if (err) return handleSupabaseError(err, 'ak_training_plan_save');
    return success(data as Record<string, unknown>);
  });

  server.registerTool('ak_training_plan_get', {
    title: 'Get Training Plan', description: `Get active plan for a player. Defaults to current week.\n\nArgs: player_id, week_start (optional YYYY-MM-DD)`,
    inputSchema: TrainingPlanGetInput,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    let q = sb.from('training_plans').select('*').eq('player_id', params.player_id);
    if (params.week_start) q = q.eq('week_start', params.week_start);
    else q = q.eq('is_active', true);
    const { data, error: err } = await q.order('week_start', { ascending: false }).limit(1);
    if (err) return handleSupabaseError(err, 'ak_training_plan_get');
    if (!data?.length) return error('Ingen treningsplan funnet.', 'Bruk ak_training_analyze + ak_training_plan_save for å generere en.');
    return success(data[0] as Record<string, unknown>);
  });
}
