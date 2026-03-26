import { z } from 'zod';
import { PLAYER_CATEGORIES, PYRAMID_LEVELS, TRAINING_AREAS, L_PHASES, CS_LEVELS, ENVIRONMENTS, PRESS_LEVELS, LIFE_CODES, PERIODS, WEEK_TYPES, DRILL_SOURCES, DRILL_DIFFICULTIES, SG_AREAS, } from '../constants.js';
// ════════════════════════════════════════════════════════════
// INPUT SCHEMAS
// ════════════════════════════════════════════════════════════
// ── Drill ───────────────────────────────────────────────────
export const DrillCreateInput = z.object({
    name: z.string().min(3).max(200).describe('Drill name, e.g. "Gate Drill — Face Control"'),
    description: z.string().min(10).describe('What the drill involves'),
    goal: z.string().min(5).describe('What skill/metric this trains'),
    instructions: z.string().optional().describe('Step-by-step how-to'),
    duration_minutes: z.number().int().min(1).max(120).default(15).describe('Duration in minutes'),
    pyramid_level: z.enum(PYRAMID_LEVELS).describe('FYS | TEK | SLAG | SPILL | TURN'),
    training_areas: z.array(z.enum(TRAINING_AREAS)).min(1).describe('Training areas this drill covers'),
    l_phases: z.array(z.enum(L_PHASES)).min(1).describe('Applicable learning phases'),
    cs_min: z.enum(CS_LEVELS).optional().describe('Minimum club speed level'),
    cs_max: z.enum(CS_LEVELS).optional().describe('Maximum club speed level'),
    environments: z.array(z.enum(ENVIRONMENTS)).min(1).describe('Environments where drill can be performed'),
    press_levels: z.array(z.enum(PRESS_LEVELS)).default(['PR1']).describe('Pressure levels'),
    p_positions: z.array(z.string()).optional().describe('Swing positions P1.0–P10.0'),
    life_codes: z.array(z.enum(LIFE_CODES)).optional().describe('LIFE development dimensions'),
    min_category: z.enum(PLAYER_CATEGORIES).default('K').describe('Lowest player category'),
    max_category: z.enum(PLAYER_CATEGORIES).default('A').describe('Highest player category'),
    difficulty: z.enum(DRILL_DIFFICULTIES).default('nybegynner'),
    equipment: z.array(z.string()).default([]).describe('Required equipment'),
    players_min: z.number().int().min(1).default(1),
    players_max: z.number().int().min(1).default(1),
    trackman_metrics: z.array(z.string()).default([]).describe('TrackMan metrics this drill targets'),
    source: z.enum(DRILL_SOURCES).default('ak_original'),
    source_url: z.string().url().optional(),
    source_author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    sg_area: z.enum(SG_AREAS).optional().describe('Strokes Gained area'),
    is_approved: z.boolean().default(false),
}).strict();
export const DrillSearchInput = z.object({
    pyramid_level: z.enum(PYRAMID_LEVELS).optional(),
    training_area: z.enum(TRAINING_AREAS).optional(),
    l_phase: z.enum(L_PHASES).optional(),
    environment: z.enum(ENVIRONMENTS).optional(),
    category: z.enum(PLAYER_CATEGORIES).optional().describe('Filter drills suitable for this category'),
    difficulty: z.enum(DRILL_DIFFICULTIES).optional(),
    trackman_metric: z.string().optional().describe('Match drills targeting a specific TrackMan metric'),
    tag: z.string().optional(),
    sg_area: z.enum(SG_AREAS).optional(),
    approved_only: z.boolean().default(true),
    query: z.string().optional().describe('Free text search in name/description/goal'),
    limit: z.number().int().min(1).max(50).default(20),
    offset: z.number().int().min(0).default(0),
}).strict();
export const DrillApproveInput = z.object({
    drill_id: z.string().uuid().describe('UUID of the drill to approve/reject'),
    approved: z.boolean().describe('true = approve, false = reject'),
}).strict();
// ── Player ──────────────────────────────────────────────────
export const PlayerCreateInput = z.object({
    name: z.string().min(2).describe('Player full name'),
    email: z.string().email().optional(),
    birth_date: z.string().optional().describe('YYYY-MM-DD'),
    category: z.enum(PLAYER_CATEGORIES).default('K').describe('Player category A–K'),
    avg_score: z.number().optional().describe('Average 18-hole score'),
    handicap: z.number().optional(),
    max_cs_driver: z.number().optional().describe('Max club speed driver (mph)'),
    max_cs_7iron: z.number().optional().describe('Max club speed 7-iron (mph)'),
    max_cs_wedge: z.number().optional().describe('Max club speed wedge (mph)'),
    current_period: z.enum(PERIODS).default('GRUNN'),
    facilities: z.array(z.enum(ENVIRONMENTS)).default([]).describe('Available training environments'),
    notes: z.string().optional(),
}).strict();
export const PlayerGetInput = z.object({
    player_id: z.string().uuid().optional().describe('Exact player UUID'),
    name: z.string().optional().describe('Name search (partial match)'),
}).strict();
// ── Session ─────────────────────────────────────────────────
export const SessionLogInput = z.object({
    player_id: z.string().uuid(),
    date: z.string().optional().describe('YYYY-MM-DD, defaults to today'),
    formula_id: z.string().optional().describe('Full AK formula, e.g. TEK_TEE_L-BALL_CS60_M2_PR3_P6.0-P7.0_LIFE-EMO'),
    pyramid_level: z.enum(PYRAMID_LEVELS),
    training_area: z.enum(TRAINING_AREAS).optional(),
    l_phase: z.enum(L_PHASES).optional(),
    cs_level: z.enum(CS_LEVELS).optional(),
    environment: z.enum(ENVIRONMENTS).optional(),
    press_level: z.enum(PRESS_LEVELS).optional(),
    p_positions: z.array(z.string()).optional(),
    life_code: z.enum(LIFE_CODES).optional(),
    period: z.enum(PERIODS).optional(),
    week_type: z.enum(WEEK_TYPES).optional(),
    duration_minutes: z.number().int().min(1).describe('Session duration in minutes'),
    drill_ids: z.array(z.string().uuid()).default([]).describe('Drills used in session'),
    notes: z.string().optional(),
    coach_notes: z.string().optional(),
    rating: z.number().int().min(1).max(5).optional().describe('Player self-rating 1–5'),
}).strict();
export const SessionHistoryInput = z.object({
    player_id: z.string().uuid(),
    days: z.number().int().min(1).max(90).default(7).describe('Look back N days'),
    pyramid_level: z.enum(PYRAMID_LEVELS).optional().describe('Filter by pyramid level'),
    limit: z.number().int().min(1).max(100).default(50),
}).strict();
// ── TrackMan ────────────────────────────────────────────────
export const TrackmanShotInput = z.object({
    club: z.string().describe('Club name, e.g. "Driver", "7-Iron", "PW"'),
    club_speed: z.number().optional(),
    ball_speed: z.number().optional(),
    smash_factor: z.number().optional(),
    launch_angle: z.number().optional(),
    spin_rate: z.number().int().optional(),
    carry_distance: z.number().optional(),
    total_distance: z.number().optional(),
    face_angle: z.number().optional(),
    club_path: z.number().optional(),
    attack_angle: z.number().optional(),
    face_to_path: z.number().optional(),
    apex_height: z.number().optional(),
    landing_angle: z.number().optional(),
    lateral_landing: z.number().optional(),
});
export const TrackmanLogInput = z.object({
    player_id: z.string().uuid(),
    session_id: z.string().uuid().optional(),
    source: z.enum(['screenshot', 'csv', 'manual']).default('manual'),
    shots: z.array(TrackmanShotInput).min(1).describe('Array of shot data'),
}).strict();
export const TrackmanAnalyzeInput = z.object({
    player_id: z.string().uuid(),
    days: z.number().int().min(1).max(180).default(30).describe('Look back period'),
    club: z.string().optional().describe('Filter by club, e.g. "Driver"'),
    metrics: z.array(z.string()).optional().describe('Specific metrics to analyze'),
}).strict();
// ── Voice Notes ─────────────────────────────────────────────
export const VoiceNoteCreateInput = z.object({
    player_id: z.string().uuid().optional(),
    session_id: z.string().uuid().optional(),
    author_type: z.enum(['coach', 'player']).default('coach'),
    transcript: z.string().min(5).describe('Full transcribed text'),
    summary: z.string().optional().describe('AI-generated summary'),
    key_points: z.array(z.string()).optional().describe('Extracted key observations'),
    tags: z.array(z.string()).default([]),
    duration_seconds: z.number().int().optional(),
}).strict();
export const VoiceNoteSearchInput = z.object({
    player_id: z.string().uuid().optional(),
    query: z.string().optional().describe('Full text search in transcript and summary'),
    days: z.number().int().min(1).max(365).default(30),
    limit: z.number().int().min(1).max(50).default(20),
}).strict();
// ── Training Plan ───────────────────────────────────────────
export const TrainingPlanGenerateInput = z.object({
    player_id: z.string().uuid(),
    week_start: z.string().describe('YYYY-MM-DD, Monday of target week'),
    period: z.enum(PERIODS).optional().describe('Override player current period'),
    week_type: z.enum(WEEK_TYPES).optional().describe('Override auto-detection'),
    focus_areas: z.array(z.string()).optional().describe('Specific areas to emphasize'),
    exclude_drills: z.array(z.string().uuid()).optional(),
}).strict();
export const TrainingPlanGetInput = z.object({
    player_id: z.string().uuid(),
    week_start: z.string().optional().describe('YYYY-MM-DD, defaults to current week'),
}).strict();
// ── Tests ───────────────────────────────────────────────────
export const TestLogInput = z.object({
    player_id: z.string().uuid(),
    test_date: z.string().optional().describe('YYYY-MM-DD'),
    driver_cs: z.number().optional().describe('Driver club speed (mph)'),
    iron7_cs: z.number().optional().describe('7-iron club speed (mph)'),
    wedge_cs: z.number().optional().describe('Wedge club speed (mph)'),
    driver_pei: z.number().optional().describe('Driver PEI (%)'),
    iron7_pei: z.number().optional().describe('7-iron PEI (%)'),
    wedge_pei: z.number().optional().describe('Wedge PEI (%)'),
    approach_50m_distance: z.number().optional().describe('Approach 50m — avg distance to hole (m)'),
    approach_100m_distance: z.number().optional().describe('Approach 100m — avg distance to hole (m)'),
    putt_3ft_pct: z.number().optional().describe('Putting 3ft make rate (%)'),
    putt_6ft_pct: z.number().optional().describe('Putting 6ft make rate (%)'),
    putt_15ft_distance: z.number().optional().describe('Putting 15ft — avg distance to hole (ft)'),
    putt_30ft_distance: z.number().optional().describe('Putting 30ft — avg distance to hole (ft)'),
    stableford_9: z.number().int().optional(),
    stableford_18: z.number().int().optional(),
    scramble_pct: z.number().optional(),
    flexibility_score: z.number().int().min(0).max(6).optional(),
    plank_seconds: z.number().int().optional(),
    balance_seconds: z.number().int().optional(),
    focus_test: z.string().optional().describe('Konsistent | Godkjent'),
    preshot_score: z.number().int().min(0).max(10).optional(),
    notes: z.string().optional(),
    tested_by: z.string().optional(),
}).strict();
// ── Breaking Points ─────────────────────────────────────────
export const BPLogInput = z.object({
    player_id: z.string().uuid(),
    session_id: z.string().uuid().optional(),
    bp_type: z.enum(['CS', 'M', 'PR']).describe('Breaking point type'),
    threshold: z.string().describe('Value where technique breaks, e.g. CS70, M2, PR4'),
    description: z.string().optional().describe('What breaks down'),
}).strict();
// ════════════════════════════════════════════════════════════
// OUTPUT SCHEMAS (for structuredContent)
// ════════════════════════════════════════════════════════════
export const PaginatedOutput = z.object({
    total: z.number(),
    count: z.number(),
    offset: z.number(),
    has_more: z.boolean(),
    next_offset: z.number().optional(),
});
export const DrillOutput = z.object({
    id: z.string(),
    name: z.string(),
    goal: z.string(),
    pyramid_level: z.string(),
    training_areas: z.array(z.string()),
    difficulty: z.string(),
    duration_minutes: z.number(),
    is_approved: z.boolean(),
}).passthrough();
export const PlayerOutput = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    handicap: z.number().nullable(),
    avg_score: z.number().nullable(),
    current_period: z.string().nullable(),
}).passthrough();
export const SessionSummaryOutput = z.object({
    period_days: z.number(),
    total_sessions: z.number(),
    total_minutes: z.number(),
    total_hours: z.number(),
    distribution_pct: z.record(z.number()),
}).passthrough();
export const TrackmanAnalysisOutput = z.object({
    player_id: z.string(),
    period_days: z.number(),
    total_shots: z.number(),
    total_sessions: z.number(),
    by_club: z.record(z.record(z.number().nullable())),
}).passthrough();
export const TestComparisonOutput = z.object({
    player: z.string(),
    current_category: z.string(),
    next_category: z.string().nullable(),
    categories_passed: z.number().nullable(),
    promotion_ready: z.boolean(),
}).passthrough();
//# sourceMappingURL=index.js.map