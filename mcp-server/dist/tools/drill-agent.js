import { z } from 'zod';
import { getSupabase } from '../services/supabase.js';
import { success, error, handleSupabaseError } from '../services/responses.js';
import { DrillCreateInput } from '../schemas/index.js';
import { TRAINING_AREAS, DRILL_DIFFICULTIES } from '../constants.js';
export function registerDrillAgentTools(server) {
    server.registerTool('ak_drill_suggest', {
        title: 'AI Suggest Drills for Player',
        description: `Match player weaknesses to existing approved drills. Maps Norwegian coaching terms to TrackMan metrics and training areas automatically.

Args:
  - player_id (UUID): Player to suggest for (uses their category + facilities for filtering)
  - weakness (string): Free text, e.g. "slice med driver", "dårlig speed control putting"
  - max_results (int, default 5): How many suggestions

Returns: { weakness, player_category, mapped_metrics[], mapped_areas[], suggestions[] }

Examples:
  - "slice med driver" → maps to face_angle, club_path metrics + TEE area
  - "kort putt under press" → maps to PUTT0-3, PUTT3-5 areas + PR4 level`,
        inputSchema: z.object({
            player_id: z.string().uuid(),
            weakness: z.string().min(3).describe('What needs work'),
            max_results: z.number().int().min(1).max(20).default(5),
        }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async (params) => {
        const sb = getSupabase();
        const { data: player } = await sb.from('players').select('category, facilities').eq('id', params.player_id).single();
        if (!player)
            return error('Spiller ikke funnet', 'Bruk ak_player_list for gyldige IDer.');
        const w = params.weakness.toLowerCase();
        const metricMap = {
            'slice': ['face_angle', 'club_path', 'face_to_path'], 'hook': ['face_angle', 'club_path', 'face_to_path'],
            'face': ['face_angle', 'face_to_path'], 'klubbface': ['face_angle', 'face_to_path'],
            'path': ['club_path', 'face_to_path'], 'svingbane': ['club_path'],
            'fart': ['club_speed', 'ball_speed'], 'speed': ['club_speed', 'ball_speed'],
            'smash': ['smash_factor'], 'spin': ['spin_rate'], 'lengde': ['carry_distance', 'total_distance'],
        };
        const areaMap = {
            'driver': ['TEE'], 'tee': ['TEE'], 'utslag': ['TEE'],
            'innspill': ['INN200', 'INN150', 'INN100', 'INN50'], 'approach': ['INN200', 'INN150', 'INN100', 'INN50'],
            'chip': ['CHIP'], 'pitch': ['PITCH'], 'lob': ['LOB'], 'bunker': ['BUNKER'],
            'putting': ['PUTT0-3', 'PUTT3-5', 'PUTT5-10', 'PUTT10-15', 'PUTT15-25', 'PUTT25-40', 'PUTT40+'],
            'putt': ['PUTT0-3', 'PUTT3-5', 'PUTT5-10', 'PUTT10-15', 'PUTT15-25', 'PUTT25-40', 'PUTT40+'],
            'nærspill': ['CHIP', 'PITCH', 'LOB', 'BUNKER'],
        };
        const metrics = [];
        const areas = [];
        for (const [k, v] of Object.entries(metricMap)) {
            if (w.includes(k))
                metrics.push(...v);
        }
        for (const [k, v] of Object.entries(areaMap)) {
            if (w.includes(k))
                areas.push(...v);
        }
        let q = sb.from('drills').select('*').eq('is_approved', true).eq('is_active', true);
        if (metrics.length > 0)
            q = q.overlaps('trackman_metrics', [...new Set(metrics)]);
        else
            q = q.or(`name.ilike.%${params.weakness}%,description.ilike.%${params.weakness}%,goal.ilike.%${params.weakness}%`);
        const { data: drills } = await q.limit(params.max_results * 3);
        let areaDrills = [];
        if (areas.length > 0) {
            const { data: ad } = await sb.from('drills').select('*').eq('is_approved', true).overlaps('training_areas', [...new Set(areas)]).limit(params.max_results * 2);
            areaDrills = ad ?? [];
        }
        const seen = new Set();
        const all = [...(drills ?? []), ...(areaDrills ?? [])];
        const unique = all.filter(d => { if (seen.has(d.id))
            return false; seen.add(d.id); return true; });
        const scored = unique.map(d => {
            let score = 0;
            const txt = `${d.name} ${d.description} ${d.goal}`.toLowerCase();
            for (const word of w.split(/\s+/)) {
                if (word.length > 2 && txt.includes(word))
                    score += 2;
            }
            if (d.trackman_metrics)
                for (const m of metrics) {
                    if (d.trackman_metrics.includes(m))
                        score += 3;
                }
            if (d.training_areas)
                for (const a of areas) {
                    if (d.training_areas.includes(a))
                        score += 2;
                }
            return { ...d, relevance_score: score };
        }).sort((a, b) => b.relevance_score - a.relevance_score).slice(0, params.max_results);
        return success({ weakness: params.weakness, player_category: player.category, mapped_metrics: [...new Set(metrics)], mapped_areas: [...new Set(areas)],
            suggestions: scored.map(d => ({ id: d.id, name: d.name, goal: d.goal, duration_minutes: d.duration_minutes, pyramid_level: d.pyramid_level, difficulty: d.difficulty, relevance_score: d.relevance_score })),
        });
    });
    server.registerTool('ak_drill_import_batch', {
        title: 'Batch Import Drills',
        description: `Import multiple drills at once. AI-generated drills start unapproved. ak_original drills auto-approve.\n\nArgs: drills[] (same schema as ak_drill_create, max 50)\nReturns: { imported_count, auto_approved, needs_review, drills[] }`,
        inputSchema: z.object({ drills: z.array(DrillCreateInput).min(1).max(50) }).strict(),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    }, async (params) => {
        const sb = getSupabase();
        const rows = params.drills.map(d => ({ ...d, is_approved: d.source === 'ak_original', is_active: true }));
        const { data, error: err } = await sb.from('drills').insert(rows).select('id, name, source, is_approved');
        if (err)
            return handleSupabaseError(err, 'ak_drill_import_batch');
        const imported = data ?? [];
        return success({ imported_count: imported.length, auto_approved: imported.filter(d => d.is_approved).length, needs_review: imported.filter(d => !d.is_approved).length, drills: imported });
    });
    server.registerTool('ak_drill_coverage_gaps', {
        title: 'Find Drill Coverage Gaps',
        description: `Analyze library for missing coverage. Checks pyramid × area × difficulty combos.\n\nArgs: min_drills_per_combo (int, default 3)\nReturns: { total_gaps, top_gaps[] sorted by priority }`,
        inputSchema: z.object({ min_drills_per_combo: z.number().int().min(1).max(10).default(3) }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async (params) => {
        const sb = getSupabase();
        const { data, error: err } = await sb.from('drills').select('pyramid_level, training_areas, difficulty').eq('is_active', true);
        if (err)
            return handleSupabaseError(err, 'ak_drill_coverage_gaps');
        const counts = {};
        for (const d of (data ?? [])) {
            for (const area of (d.training_areas ?? [])) {
                const k = `${d.pyramid_level}|${area}|${d.difficulty}`;
                counts[k] = (counts[k] ?? 0) + 1;
            }
        }
        const pri = { TEK: 5, SLAG: 4, SPILL: 3, FYS: 2, TURN: 1 };
        const gaps = [];
        for (const pyr of ['TEK', 'SLAG', 'SPILL']) {
            for (const area of TRAINING_AREAS) {
                for (const diff of DRILL_DIFFICULTIES) {
                    const c = counts[`${pyr}|${area}|${diff}`] ?? 0;
                    if (c < params.min_drills_per_combo)
                        gaps.push({ pyramid: pyr, area, difficulty: diff, current: c, priority: (pri[pyr] ?? 1) * (params.min_drills_per_combo - c) });
                }
            }
        }
        gaps.sort((a, b) => b.priority - a.priority);
        return success({ total_gaps: gaps.length, min_threshold: params.min_drills_per_combo, top_gaps: gaps.slice(0, 30) });
    });
}
//# sourceMappingURL=drill-agent.js.map