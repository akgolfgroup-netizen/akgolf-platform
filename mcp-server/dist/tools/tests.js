import { z } from 'zod';
import { getSupabase } from '../services/supabase.js';
import { success, error, handleSupabaseError } from '../services/responses.js';
import { TestLogInput, TestComparisonOutput } from '../schemas/index.js';
import { PLAYER_CATEGORIES } from '../constants.js';
const BENCH = {
    'A': { driver_cs: 110, iron7_cs: 85, driver_pei: 75, putt_3ft: 95, putt_6ft: 75, stableford_9: 20, scramble: 50, flexibility: 6, plank: 90, balance: 30, preshot: 9 },
    'B': { driver_cs: 110, iron7_cs: 85, driver_pei: 75, putt_3ft: 95, putt_6ft: 75, stableford_9: 20, scramble: 50, flexibility: 6, plank: 90, balance: 30, preshot: 9 },
    'C': { driver_cs: 100, iron7_cs: 78, driver_pei: 70, putt_3ft: 90, putt_6ft: 65, stableford_9: 17, scramble: 40, flexibility: 5, plank: 75, balance: 25, preshot: 8 },
    'D': { driver_cs: 100, iron7_cs: 78, driver_pei: 70, putt_3ft: 90, putt_6ft: 65, stableford_9: 17, scramble: 40, flexibility: 5, plank: 75, balance: 25, preshot: 8 },
    'E': { driver_cs: 90, iron7_cs: 72, driver_pei: 65, putt_3ft: 85, putt_6ft: 55, stableford_9: 14, scramble: 30, flexibility: 4, plank: 60, balance: 20, preshot: 7 },
    'F': { driver_cs: 90, iron7_cs: 72, driver_pei: 65, putt_3ft: 85, putt_6ft: 55, stableford_9: 14, scramble: 30, flexibility: 4, plank: 60, balance: 20, preshot: 7 },
    'G': { driver_cs: 80, iron7_cs: 65, driver_pei: 60, putt_3ft: 80, putt_6ft: 45, stableford_9: 11, scramble: 20, flexibility: 3, plank: 45, balance: 15, preshot: null },
    'H': { driver_cs: 80, iron7_cs: 65, driver_pei: 60, putt_3ft: 80, putt_6ft: 45, stableford_9: 11, scramble: 20, flexibility: 3, plank: 45, balance: 15, preshot: null },
    'I': { driver_cs: 65, iron7_cs: 52, driver_pei: null, putt_3ft: 70, putt_6ft: 35, stableford_9: null, scramble: null, flexibility: 2, plank: 30, balance: 10, preshot: null },
    'J': { driver_cs: 65, iron7_cs: 52, driver_pei: null, putt_3ft: 70, putt_6ft: 35, stableford_9: null, scramble: null, flexibility: 2, plank: 30, balance: 10, preshot: null },
    'K': { driver_cs: 65, iron7_cs: 52, driver_pei: null, putt_3ft: 70, putt_6ft: 35, stableford_9: null, scramble: null, flexibility: 2, plank: 30, balance: 10, preshot: null },
};
export function registerTestTools(server) {
    server.registerTool('ak_test_log', {
        title: 'Log Test Results', description: `Log standardized test results (20 tests / 7 categories from Masterdokument §16). All fields optional — log what was tested. Auto-calculates categories passed for promotion.\n\nReturns: { ...results, current_category, next_category, categories_passed, promotion_ready }`,
        inputSchema: TestLogInput,
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    }, async (params) => {
        const sb = getSupabase();
        const { data: player } = await sb.from('players').select('category').eq('id', params.player_id).single();
        if (!player)
            return error('Spiller ikke funnet', 'Bruk ak_player_list.');
        const cat = player.category;
        const idx = PLAYER_CATEGORIES.indexOf(cat);
        const nextCat = idx > 0 ? PLAYER_CATEGORIES[idx - 1] : null;
        let passed = 0;
        if (nextCat && BENCH[nextCat]) {
            const b = BENCH[nextCat];
            if (params.driver_cs && b.driver_cs && params.driver_cs >= b.driver_cs)
                passed++;
            if (params.driver_pei && b.driver_pei && params.driver_pei >= b.driver_pei)
                passed++;
            if (params.putt_3ft_pct && b.putt_3ft && params.putt_3ft_pct >= b.putt_3ft)
                passed++;
            if (params.stableford_9 && b.stableford_9 && params.stableford_9 >= b.stableford_9)
                passed++;
            if (params.scramble_pct && b.scramble && params.scramble_pct >= b.scramble)
                passed++;
            const phys = [params.flexibility_score && b.flexibility && params.flexibility_score >= b.flexibility, params.plank_seconds && b.plank && params.plank_seconds >= b.plank, params.balance_seconds && b.balance && params.balance_seconds >= b.balance].filter(Boolean).length;
            if (phys >= 2)
                passed++;
            if (params.preshot_score && b.preshot && params.preshot_score >= b.preshot)
                passed++;
        }
        const { data, error: err } = await sb.from('test_results').insert({ ...params, categories_passed: passed }).select().single();
        if (err)
            return handleSupabaseError(err, 'ak_test_log');
        return success({ ...data, current_category: cat, next_category: nextCat, promotion_ready: passed >= 5, promotion_requirement: '5 av 7 testkategorier' });
    });
    server.registerTool('ak_test_compare', {
        title: 'Compare Tests to Benchmarks', description: `Compare latest test results against benchmarks for current AND next category. Shows exact gaps for promotion.\n\nArgs: player_id\nReturns: Per-test comparison with gap analysis.`,
        inputSchema: z.object({ player_id: z.string().uuid() }).strict(),
        outputSchema: TestComparisonOutput,
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async (params) => {
        const sb = getSupabase();
        const { data: player } = await sb.from('players').select('name, category').eq('id', params.player_id).single();
        if (!player)
            return error('Spiller ikke funnet');
        const { data: tests } = await sb.from('test_results').select('*').eq('player_id', params.player_id).order('test_date', { ascending: false }).limit(2);
        if (!tests?.length)
            return error(`Ingen testresultater for ${player.name}`, 'Bruk ak_test_log for å registrere testresultater.');
        const latest = tests[0];
        const prev = tests[1] ?? null;
        const cat = player.category;
        const idx = PLAYER_CATEGORIES.indexOf(cat);
        const nextCat = idx > 0 ? PLAYER_CATEGORIES[idx - 1] : null;
        const curB = BENCH[cat] ?? {};
        const nxtB = nextCat ? BENCH[nextCat] ?? {} : {};
        const fields = [
            { key: 'driver_cs', label: 'Driver CS (mph)', bench: 'driver_cs', higher: true }, { key: 'iron7_cs', label: '7-iron CS (mph)', bench: 'iron7_cs', higher: true },
            { key: 'driver_pei', label: 'Driver PEI (%)', bench: 'driver_pei', higher: true }, { key: 'putt_3ft_pct', label: 'Putt 3ft (%)', bench: 'putt_3ft', higher: true },
            { key: 'putt_6ft_pct', label: 'Putt 6ft (%)', bench: 'putt_6ft', higher: true }, { key: 'stableford_9', label: 'Stableford 9-hull', bench: 'stableford_9', higher: true },
            { key: 'flexibility_score', label: 'Bevegelighet', bench: 'flexibility', higher: true }, { key: 'plank_seconds', label: 'Planke (sek)', bench: 'plank', higher: true },
        ];
        const comparison = fields.map(f => {
            const val = latest[f.key];
            const pVal = prev?.[f.key];
            const nb = nxtB[f.bench];
            return { test: f.label, result: val, previous: pVal, next_benchmark: nb, meets_next: nb != null && val != null ? (f.higher ? val >= nb : val <= nb) : false, gap: nb != null && val != null ? (f.higher ? nb - val : val - nb) : null };
        }).filter(c => c.result != null);
        return success({ player: player.name, current_category: cat, next_category: nextCat, test_date: latest.test_date, categories_passed: latest.categories_passed, promotion_ready: (latest.categories_passed ?? 0) >= 5, comparison });
    });
    server.registerTool('ak_test_history', {
        title: 'Test History', description: `All test results for a player over time.\n\nArgs: player_id, limit (default 5)`,
        inputSchema: z.object({ player_id: z.string().uuid(), limit: z.number().int().min(1).max(20).default(5) }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async (params) => {
        const sb = getSupabase();
        const { data, error: err } = await sb.from('test_results').select('*').eq('player_id', params.player_id).order('test_date', { ascending: false }).limit(params.limit);
        if (err)
            return handleSupabaseError(err, 'ak_test_history');
        return success({ count: (data ?? []).length, results: data ?? [] });
    });
}
//# sourceMappingURL=tests.js.map