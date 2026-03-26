import { z } from 'zod';
import { getSupabase } from '../services/supabase.js';
import { success, handleSupabaseError } from '../services/responses.js';
import { DrillCreateInput, DrillSearchInput, DrillApproveInput, DrillOutput, PaginatedOutput } from '../schemas/index.js';
export function registerDrillTools(server) {
    server.registerTool('ak_drill_create', {
        title: 'Create Drill',
        description: `Create a new drill in the AK Golf Academy library with full AK-formula tagging.

Args:
  - name: Drill name (e.g. "Gate Drill — Face Control")
  - pyramid_level: FYS|TEK|SLAG|SPILL|TURN
  - training_areas: Array of areas (TEE, INN150, CHIP, PUTT5-10, etc.)
  - l_phases: Array of phases (L-KROPP through L-AUTO)
  - environments: Array of M0–M5

Returns: { id, name, pyramid_level, is_approved, created_at }

Examples:
  - TEK putting drill: pyramid_level="TEK", training_areas=["PUTT5-10"], l_phases=["L-BALL"]
  - FYS drill: pyramid_level="FYS", training_areas=["TEE"], l_phases=["L-KROPP"]

Error: Returns actionable message if required fields missing or enums invalid.`,
        inputSchema: DrillCreateInput,
        outputSchema: DrillOutput,
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    }, async (params) => {
        const sb = getSupabase();
        const { data, error: err } = await sb.from('drills').insert(params).select().single();
        if (err)
            return handleSupabaseError(err, 'ak_drill_create');
        return success(data);
    });
    server.registerTool('ak_drill_search', {
        title: 'Search Drills',
        description: `Search drill library with filters matching the AK training formula. All filters combinable.

Args:
  - pyramid_level, training_area, l_phase, environment, difficulty (enum filters)
  - category: Find drills suitable for player category A–K
  - trackman_metric: Match drills targeting a metric (face_angle, club_path, etc.)
  - sg_area: Strokes Gained area (tee, approach, short_game, putting)
  - query: Free text search
  - approved_only: Default true
  - limit/offset: Pagination

Returns: { total, count, offset, has_more, drills[] }`,
        inputSchema: DrillSearchInput,
        outputSchema: PaginatedOutput.extend({ drills: z.array(DrillOutput) }),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async (params) => {
        const sb = getSupabase();
        let q = sb.from('drills').select('*', { count: 'exact' });
        if (params.approved_only)
            q = q.eq('is_approved', true).eq('is_active', true);
        if (params.pyramid_level)
            q = q.eq('pyramid_level', params.pyramid_level);
        if (params.training_area)
            q = q.contains('training_areas', [params.training_area]);
        if (params.l_phase)
            q = q.contains('l_phases', [params.l_phase]);
        if (params.environment)
            q = q.contains('environments', [params.environment]);
        if (params.difficulty)
            q = q.eq('difficulty', params.difficulty);
        if (params.trackman_metric)
            q = q.contains('trackman_metrics', [params.trackman_metric]);
        if (params.sg_area)
            q = q.eq('sg_area', params.sg_area);
        if (params.tag)
            q = q.contains('tags', [params.tag]);
        if (params.query)
            q = q.or(`name.ilike.%${params.query}%,description.ilike.%${params.query}%,goal.ilike.%${params.query}%`);
        if (params.category) {
            const cats = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
            const idx = cats.indexOf(params.category);
            q = q.in('min_category', cats.slice(idx)).in('max_category', cats.slice(0, idx + 1));
        }
        q = q.order('name').range(params.offset, params.offset + params.limit - 1);
        const { data, error: err, count } = await q;
        if (err)
            return handleSupabaseError(err, 'ak_drill_search');
        const drills = data ?? [];
        const total = count ?? 0;
        const hasMore = total > params.offset + drills.length;
        return success({ total, count: drills.length, offset: params.offset, has_more: hasMore, next_offset: hasMore ? params.offset + drills.length : undefined, drills });
    });
    server.registerTool('ak_drill_approve', {
        title: 'Approve or Reject Drill',
        description: `Set approval status. Only approved drills appear in training plans.\n\nArgs: drill_id (UUID), approved (boolean)\nReturns: { id, name, is_approved }`,
        inputSchema: DrillApproveInput,
        outputSchema: z.object({ id: z.string(), name: z.string(), is_approved: z.boolean() }),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async (params) => {
        const sb = getSupabase();
        const { data, error: err } = await sb.from('drills').update({ is_approved: params.approved }).eq('id', params.drill_id).select('id, name, is_approved').single();
        if (err)
            return handleSupabaseError(err, 'ak_drill_approve');
        return success(data, `Drill "${data.name}" ${data.is_approved ? '✓ godkjent' : '✗ avvist'}`);
    });
    server.registerTool('ak_drill_stats', {
        title: 'Drill Library Statistics',
        description: `Overview stats: total, approved, by pyramid/difficulty/SG. Use to find gaps.\n\nReturns: { total, approved, active, byPyramid, byDifficulty, bySG }`,
        inputSchema: z.object({}),
        outputSchema: z.object({ total: z.number(), approved: z.number(), active: z.number(), byPyramid: z.record(z.number()), byDifficulty: z.record(z.number()), bySG: z.record(z.number()) }),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async () => {
        const sb = getSupabase();
        const { data, error: err } = await sb.from('drills').select('pyramid_level, difficulty, is_approved, is_active, sg_area');
        if (err)
            return handleSupabaseError(err, 'ak_drill_stats');
        const drills = data ?? [];
        const byPyramid = {};
        const byDifficulty = {};
        const bySG = {};
        for (const d of drills) {
            byPyramid[d.pyramid_level] = (byPyramid[d.pyramid_level] ?? 0) + 1;
            byDifficulty[d.difficulty] = (byDifficulty[d.difficulty] ?? 0) + 1;
            if (d.sg_area)
                bySG[d.sg_area] = (bySG[d.sg_area] ?? 0) + 1;
        }
        return success({ total: drills.length, approved: drills.filter(d => d.is_approved).length, active: drills.filter(d => d.is_active).length, byPyramid, byDifficulty, bySG });
    });
}
//# sourceMappingURL=drills.js.map