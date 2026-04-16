/**
 * DataViz Components Index
 * 
 * Samlet import for alle nye DataViz-komponenter (Oppgaver #25-27)
 * 
 * Bruk:
 * import { 
 *   HCPTrendChart, 
 *   Sparkline, 
 *   TrainingDistribution,
 *   SGBreakdownBars,
 *   SkillRadar,
 *   ClubWaveform,
 *   ClubComparison 
 * } from "@/components/portal/dataviz-index";
 */

// Oppgave #25: Dashboard grafer og trender
export { HCPTrendChart } from "./dashboard/hcp-trend-chart";
export { Sparkline, SparklineCompact } from "./dashboard/sparkline";
export { TrainingDistribution } from "./dashboard/training-distribution";

// Oppgave #26: Statistikk SG-breakdown
export { SGBreakdownBars } from "./statistikk/sg-breakdown-bars";
export { SkillRadar } from "./statistikk/skill-radar";

// Oppgave #27: TrackMan-trender
export { ClubWaveform } from "./trackman/club-waveform";
export { ClubComparison } from "./trackman/club-comparison";
