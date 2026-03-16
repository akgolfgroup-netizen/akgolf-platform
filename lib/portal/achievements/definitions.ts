/**
 * Achievement seed data (~15 achievements)
 */

export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: string;
  category: "training" | "consistency" | "scoring" | "coaching" | "milestone";
  threshold: number;
  tierRequired: "FREE" | "PRO" | "ELITE";
  sortOrder: number;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDef[] = [
  // Training
  { key: "first_training", title: "Første trening", description: "Logg din første treningsøkt", icon: "dumbbell", category: "training", threshold: 1, tierRequired: "FREE", sortOrder: 1 },
  { key: "training_10", title: "10 treningsdager", description: "Logg 10 treningsøkter", icon: "flame", category: "training", threshold: 10, tierRequired: "FREE", sortOrder: 2 },
  { key: "training_50", title: "50 treningsdager", description: "Logg 50 treningsøkter", icon: "star", category: "training", threshold: 50, tierRequired: "FREE", sortOrder: 3 },
  { key: "training_100", title: "Treningsmaskin", description: "Logg 100 treningsøkter", icon: "zap", category: "training", threshold: 100, tierRequired: "FREE", sortOrder: 4 },

  // Consistency
  { key: "week_streak", title: "Uke-streak", description: "Tren 7 dager på rad", icon: "calendar", category: "consistency", threshold: 7, tierRequired: "FREE", sortOrder: 10 },
  { key: "month_streak", title: "Månedsstreak", description: "Tren 30 dager på rad", icon: "trophy", category: "consistency", threshold: 30, tierRequired: "PRO", sortOrder: 11 },

  // Scoring
  { key: "first_round", title: "Første runde", description: "Registrer din første runde", icon: "flag", category: "scoring", threshold: 1, tierRequired: "FREE", sortOrder: 20 },
  { key: "under_par", title: "Under par", description: "Registrer en runde under par", icon: "medal", category: "scoring", threshold: 1, tierRequired: "FREE", sortOrder: 21 },
  { key: "hcp_under_20", title: "HCP under 20", description: "Nå handicap under 20", icon: "trending-down", category: "scoring", threshold: 1, tierRequired: "FREE", sortOrder: 22 },
  { key: "hcp_under_10", title: "HCP under 10", description: "Nå handicap under 10", icon: "trending-down", category: "scoring", threshold: 1, tierRequired: "FREE", sortOrder: 23 },
  { key: "hcp_under_5", title: "Ensifret elite", description: "Nå handicap under 5", icon: "crown", category: "scoring", threshold: 1, tierRequired: "FREE", sortOrder: 24 },

  // Coaching
  { key: "first_coaching", title: "Første coaching", description: "Gjennomfør din første coachingøkt", icon: "users", category: "coaching", threshold: 1, tierRequired: "FREE", sortOrder: 30 },
  { key: "coaching_10", title: "10 coachingøkter", description: "Gjennomfør 10 coachingøkter", icon: "book-open", category: "coaching", threshold: 10, tierRequired: "PRO", sortOrder: 31 },

  // Milestones
  { key: "tournament_debut", title: "Turneringsdebutant", description: "Opprett din første turneringsplan", icon: "map", category: "milestone", threshold: 1, tierRequired: "FREE", sortOrder: 40 },
  { key: "goal_setter", title: "Målsetter", description: "Sett ditt første mål", icon: "target", category: "milestone", threshold: 1, tierRequired: "FREE", sortOrder: 41 },
];
