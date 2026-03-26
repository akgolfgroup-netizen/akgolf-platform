// ════════════════════════════════════════════════════════════
// DataGolf API Client — Full implementation
// Base URL: https://feeds.datagolf.com
// Rate limit: 45 requests/minute
// ════════════════════════════════════════════════════════════

const BASE_URL = "https://feeds.datagolf.com";

function getApiKey(): string {
  const key = process.env.DATAGOLF_API_KEY ?? null;
  if (!key) throw new Error("DATAGOLF_API_KEY is not configured");
  return key;
}

type FileFormat = "json" | "csv";
type OddsFormat = "american" | "decimal" | "fraction";
type Tour = "pga" | "euro" | "kft" | "liv" | "opp" | "alt";

// ════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════

export interface DataGolfPlayer {
  dg_id: number;
  player_name: string;
  country: string;
  country_code: string;
  amateur: boolean;
}

export interface DGRanking {
  dg_id: number;
  player_name: string;
  country: string;
  dg_skill_estimate: number;
  dg_rank: number;
  owgr_rank: number | null;
  primary_tour: string;
}

export interface SkillDecomposition {
  dg_id: number;
  player_name: string;
  sg_total: number | null;
  sg_ott: number | null;      // Off the tee
  sg_app: number | null;      // Approach
  sg_arg: number | null;      // Around the green
  sg_putt: number | null;     // Putting
  driving_acc: number | null;
  driving_dist: number | null;
}

export interface SkillRating {
  dg_id: number;
  player_name: string;
  sg_total: number;
  sg_total_rank: number;
  sg_ott: number;
  sg_ott_rank: number;
  sg_app: number;
  sg_app_rank: number;
  sg_arg: number;
  sg_arg_rank: number;
  sg_putt: number;
  sg_putt_rank: number;
}

export interface ApproachSkill {
  dg_id: number;
  player_name: string;
  // Distance buckets (yards)
  "75-100": number | null;
  "100-125": number | null;
  "125-150": number | null;
  "150-175": number | null;
  "175-200": number | null;
  "200-225": number | null;
  "225+": number | null;
}

export interface TourScheduleEvent {
  event_id: string;
  event_name: string;
  course: string;
  location: string;
  start_date: string;
  end_date: string;
  winner_name?: string;
  winner_dg_id?: number;
}

export interface FieldUpdate {
  dg_id: number;
  player_name: string;
  country: string;
  status: "in" | "wd" | "cut";
  tee_time?: string;
  start_hole?: number;
}

export interface PreTournamentPrediction {
  dg_id: number;
  player_name: string;
  country: string;
  win_prob: number;
  top_5_prob: number;
  top_10_prob: number;
  top_20_prob: number;
  make_cut_prob: number;
}

export interface LivePrediction {
  dg_id: number;
  player_name: string;
  current_pos: string;
  current_score: number;
  thru: number | string;
  today: number;
  win_prob: number;
  top_5_prob: number;
  top_10_prob: number;
  top_20_prob: number;
}

export interface LiveTournamentStat {
  dg_id: number;
  player_name: string;
  position: string;
  total_score: number;
  sg_total: number | null;
  sg_ott: number | null;
  sg_app: number | null;
  sg_arg: number | null;
  sg_putt: number | null;
  gir_pct: number | null;
  driving_acc: number | null;
  driving_dist: number | null;
  putts_per_round: number | null;
}

export interface HistoricalRound {
  dg_id: number;
  player_name: string;
  event_id: string;
  event_name: string;
  year: number;
  round_num: number;
  course_name: string;
  score: number;
  sg_total: number | null;
  sg_ott: number | null;
  sg_app: number | null;
  sg_arg: number | null;
  sg_putt: number | null;
  tee_time: string | null;
}

export interface EventFinish {
  dg_id: number;
  player_name: string;
  fin_pos: string;
  total_score: number;
  earnings: number;
  fedex_pts: number | null;
  dg_pts: number | null;
}

export interface OutrightOdds {
  dg_id: number;
  player_name: string;
  dg_win_prob: number;
  // Sportsbook odds
  draftkings?: number;
  fanduel?: number;
  betmgm?: number;
  caesars?: number;
  pointsbet?: number;
  bet365?: number;
  betrivers?: number;
  unibet?: number;
  pinnacle?: number;
  betfred?: number;
  skybet?: number;
}

export interface Matchup {
  p1_dg_id: number;
  p1_name: string;
  p2_dg_id: number;
  p2_name: string;
  dg_prob_p1: number;
  dg_prob_p2: number;
  dg_prob_tie: number;
  // Book odds
  book_odds_p1?: number;
  book_odds_p2?: number;
  book_odds_tie?: number;
}

export interface FantasyProjection {
  dg_id: number;
  player_name: string;
  salary: number;
  proj_ownership: number;
  proj_points: number;
  proj_ceiling: number;
  proj_floor: number;
}

// ════════════════════════════════════════════════════════════
// API FUNCTIONS
// ════════════════════════════════════════════════════════════

async function fetchAPI<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {},
  revalidate = 3600
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("key", getApiKey());
  url.searchParams.set("file_format", "json");

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), { next: { revalidate } });

  if (!res.ok) {
    throw new Error(`DataGolf API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ── General Use ──────────────────────────────────────────────

/**
 * Get all players on major tours since 2018
 */
export async function getPlayerList(): Promise<DataGolfPlayer[]> {
  const data = await fetchAPI<DataGolfPlayer[] | { players: DataGolfPlayer[] }>("/get-player-list");
  return Array.isArray(data) ? data : data.players ?? [];
}

/**
 * Get tour schedule for a season
 */
export async function getTourSchedule(
  tour: Tour = "pga",
  season?: number,
  upcomingOnly = false
): Promise<TourScheduleEvent[]> {
  const data = await fetchAPI<{ schedule: TourScheduleEvent[] }>("/get-schedule", {
    tour,
    season,
    upcoming_only: upcomingOnly,
  });
  return data.schedule ?? [];
}

/**
 * Get field updates (entries, withdrawals, tee times)
 */
export async function getFieldUpdates(tour: Tour = "pga"): Promise<FieldUpdate[]> {
  const data = await fetchAPI<{ field: FieldUpdate[] }>("/field-updates", { tour }, 300);
  return data.field ?? [];
}

// ── Model Predictions ────────────────────────────────────────

/**
 * Get Data Golf rankings (top 500 players)
 */
export async function getDGRankings(): Promise<DGRanking[]> {
  const data = await fetchAPI<{ rankings: DGRanking[] }>("/preds/get-dg-rankings");
  return data.rankings ?? [];
}

/**
 * Get pre-tournament predictions
 */
export async function getPreTournamentPredictions(
  tour: Tour = "pga",
  oddsFormat: OddsFormat = "decimal"
): Promise<PreTournamentPrediction[]> {
  const data = await fetchAPI<{ baseline: PreTournamentPrediction[] }>("/preds/pre-tournament", {
    tour,
    odds_format: oddsFormat,
  }, 1800);
  return data.baseline ?? [];
}

/**
 * Get player skill decompositions (SG breakdown)
 */
export async function getSkillDecompositions(tour: Tour = "pga"): Promise<SkillDecomposition[]> {
  const data = await fetchAPI<SkillDecomposition[] | { players: SkillDecomposition[] }>(
    "/preds/player-decompositions",
    { tour }
  );
  return Array.isArray(data) ? data : data.players ?? [];
}

/**
 * Get player skill ratings with ranks
 */
export async function getSkillRatings(display: "value" | "rank" = "value"): Promise<SkillRating[]> {
  const data = await fetchAPI<{ players: SkillRating[] }>("/preds/skill-ratings", { display });
  return data.players ?? [];
}

/**
 * Get approach skill by distance bucket
 */
export async function getApproachSkill(period: "l24" | "l12" | "ytd" = "l24"): Promise<ApproachSkill[]> {
  const data = await fetchAPI<{ players: ApproachSkill[] }>("/preds/approach-skill", { period });
  return data.players ?? [];
}

// ── Live Model ───────────────────────────────────────────────

/**
 * Get live in-play predictions (updates every 5 min during tournaments)
 */
export async function getLivePredictions(
  tour: Tour = "pga",
  oddsFormat: OddsFormat = "decimal"
): Promise<LivePrediction[]> {
  const data = await fetchAPI<{ live_stats: LivePrediction[] }>("/preds/in-play", {
    tour,
    odds_format: oddsFormat,
  }, 300);
  return data.live_stats ?? [];
}

/**
 * Get live tournament stats (SG, traditional stats)
 */
export async function getLiveTournamentStats(
  stats: "sg" | "traditional" | "all" = "all",
  round: number | "event" = "event"
): Promise<LiveTournamentStat[]> {
  const data = await fetchAPI<{ live_stats: LiveTournamentStat[] }>("/preds/live-tournament-stats", {
    stats,
    round,
  }, 300);
  return data.live_stats ?? [];
}

// ── Betting Tools ────────────────────────────────────────────

/**
 * Get outright odds from sportsbooks with DG predictions
 */
export async function getOutrightOdds(
  tour: Tour = "pga",
  market: "win" | "top_5" | "top_10" | "top_20" | "make_cut" = "win",
  oddsFormat: OddsFormat = "decimal"
): Promise<OutrightOdds[]> {
  const data = await fetchAPI<{ outrights: OutrightOdds[] }>("/betting-tools/outrights", {
    tour,
    market,
    odds_format: oddsFormat,
  }, 1800);
  return data.outrights ?? [];
}

/**
 * Get matchup odds
 */
export async function getMatchupOdds(
  tour: Tour = "pga",
  market: "tournament" | "round" | "3_balls" = "tournament",
  oddsFormat: OddsFormat = "decimal"
): Promise<Matchup[]> {
  const data = await fetchAPI<{ matchups: Matchup[] }>("/betting-tools/matchups", {
    tour,
    market,
    odds_format: oddsFormat,
  }, 1800);
  return data.matchups ?? [];
}

// ── Historical Data ──────────────────────────────────────────

/**
 * Get list of available historical events
 */
export async function getHistoricalEventList(tour: Tour = "pga"): Promise<Array<{ event_id: string; event_name: string }>> {
  const data = await fetchAPI<{ events: Array<{ event_id: string; event_name: string }> }>(
    "/historical-raw-data/event-list",
    { tour }
  );
  return data.events ?? [];
}

/**
 * Get historical round-level data
 */
export async function getHistoricalRounds(
  tour: Tour = "pga",
  eventId: string,
  year: number
): Promise<HistoricalRound[]> {
  const data = await fetchAPI<{ rounds: HistoricalRound[] }>("/historical-raw-data/rounds", {
    tour,
    event_id: eventId,
    year,
  });
  return data.rounds ?? [];
}

/**
 * Get historical event finishes
 */
export async function getEventFinishes(
  tour: Tour = "pga",
  eventId: string,
  year: number
): Promise<EventFinish[]> {
  const data = await fetchAPI<{ event: EventFinish[] }>("/historical-event-data/events", {
    tour,
    event_id: eventId,
    year,
  });
  return data.event ?? [];
}

// ── Fantasy/DFS ──────────────────────────────────────────────

/**
 * Get fantasy projections
 */
export async function getFantasyProjections(
  tour: Tour = "pga",
  site: "draftkings" | "fanduel" | "yahoo" = "draftkings",
  slate: "main" | "showdown" | "weekend" = "main"
): Promise<FantasyProjection[]> {
  const data = await fetchAPI<{ projections: FantasyProjection[] }>("/preds/fantasy-projection-defaults", {
    tour,
    site,
    slate,
  }, 1800);
  return data.projections ?? [];
}

// ════════════════════════════════════════════════════════════
// LEGACY EXPORT (backwards compatibility)
// ════════════════════════════════════════════════════════════

export interface DataGolfPlayerLegacy {
  player_name: string;
  dg_id: number;
  sg_total: number | null;
  sg_ott: number | null;
  sg_app: number | null;
  sg_atg: number | null;
  sg_putt: number | null;
}

export async function fetchPlayerSkillDecomp(tour: Tour = "pga"): Promise<DataGolfPlayerLegacy[]> {
  const players = await getSkillDecompositions(tour);
  return players.map(p => ({
    player_name: p.player_name,
    dg_id: p.dg_id,
    sg_total: p.sg_total,
    sg_ott: p.sg_ott,
    sg_app: p.sg_app,
    sg_atg: p.sg_arg, // Note: arg -> atg for legacy
    sg_putt: p.sg_putt,
  }));
}

// ════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ════════════════════════════════════════════════════════════

/**
 * Get all available data for a specific player
 */
export async function getPlayerProfile(dgId: number, tour: Tour = "pga") {
  const [rankings, skills, approach] = await Promise.all([
    getDGRankings(),
    getSkillDecompositions(tour),
    getApproachSkill(),
  ]);

  const ranking = rankings.find(r => r.dg_id === dgId);
  const skill = skills.find(s => s.dg_id === dgId);
  const approachData = approach.find(a => a.dg_id === dgId);

  return {
    ranking,
    skill,
    approach: approachData,
  };
}

/**
 * Get current tournament overview
 */
export async function getCurrentTournament(tour: Tour = "pga") {
  const [field, predictions, live] = await Promise.all([
    getFieldUpdates(tour),
    getPreTournamentPredictions(tour).catch(() => []),
    getLivePredictions(tour).catch(() => []),
  ]);

  return {
    field,
    predictions,
    live: live.length > 0 ? live : null,
    isLive: live.length > 0,
  };
}

/**
 * Get betting overview for current tournament
 */
export async function getBettingOverview(tour: Tour = "pga") {
  const [outrights, matchups] = await Promise.all([
    getOutrightOdds(tour),
    getMatchupOdds(tour),
  ]);

  return { outrights, matchups };
}
