/**
 * Skill Level Definitions (A–K)
 * Ported from akgolf-iup golf.config.ts
 */

export interface SkillLevel {
  code: string;
  label: string;
  labelNO: string;
  order: number;
  color: string;
  handicapRange: [number, number];
  description: string;
}

export const SKILL_LEVELS: SkillLevel[] = [
  { code: "K", label: "Beginner", labelNO: "Nybegynner", order: 1, color: "#9CA3AF", handicapRange: [45, 54], description: "HCP 45-54" },
  { code: "J", label: "Basic", labelNO: "Grunnleggende", order: 2, color: "#6B7280", handicapRange: [37, 44], description: "HCP 37-44" },
  { code: "I", label: "Developing", labelNO: "Utviklende", order: 3, color: "#8B5CF6", handicapRange: [30, 36], description: "HCP 30-36" },
  { code: "H", label: "Progressing", labelNO: "Fremskritt", order: 4, color: "#A78BFA", handicapRange: [25, 29], description: "HCP 25-29" },
  { code: "G", label: "Intermediate", labelNO: "Mellomnivå", order: 5, color: "#3B82F6", handicapRange: [20, 24], description: "HCP 20-24" },
  { code: "F", label: "Competent", labelNO: "Kompetent", order: 6, color: "#60A5FA", handicapRange: [15, 19], description: "HCP 15-19" },
  { code: "E", label: "Advanced", labelNO: "Avansert", order: 7, color: "#10B981", handicapRange: [12, 14], description: "HCP 12-14" },
  { code: "D", label: "Skilled", labelNO: "Dyktig", order: 8, color: "#34D399", handicapRange: [9, 11], description: "HCP 9-11" },
  { code: "C", label: "Very Skilled", labelNO: "Meget dyktig", order: 9, color: "#F59E0B", handicapRange: [6, 8], description: "HCP 6-8" },
  { code: "B", label: "Expert", labelNO: "Expert", order: 10, color: "#FBBF24", handicapRange: [3, 5], description: "HCP 3-5" },
  { code: "A", label: "Elite", labelNO: "Elite", order: 11, color: "#EF4444", handicapRange: [0, 2], description: "HCP 0-2" },
];

export function getSkillLevelByHandicap(handicap: number): SkillLevel | undefined {
  return SKILL_LEVELS.find(
    (l) => handicap >= l.handicapRange[0] && handicap <= l.handicapRange[1]
  );
}

export function getSkillLevelByCode(code: string): SkillLevel | undefined {
  return SKILL_LEVELS.find((l) => l.code === code);
}
