export type {
  PlayerProfile,
  DimensionBreakdown,
  GapAnalysis,
  GapAnalysisRow,
  TrainingIndex,
  TestHistory,
  TestHistoryEntry,
} from "./types";

export { getPlayerProfile, getGapAnalysis } from "./profile";
export { getTrainingIndex } from "./training-index";
export { getTestHistory } from "./test-history";
export {
  canViewPlayer,
  getMyPlayers,
  assignPlayerToCoach,
  pausePlayerAssignment,
  endPlayerAssignment,
} from "./coach-access";
export type { CoachPlayerSummary } from "./coach-access";
