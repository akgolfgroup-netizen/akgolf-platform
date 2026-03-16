export type PlanLevel = "A" | "B" | "C";
export type GoalType = "prestasjon" | "utvikling" | "trening";
export type TournamentLevel =
  | "nasjonal"
  | "regional"
  | "lokal"
  | "internasjonal";

export type TournamentSource = "golfbox" | "nordic_golf_tour" | "jmi_sweden" | "global_junior_tour" | "manual";

export interface Tournament {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date | null;
  level: TournamentLevel;
  course?: string | null;
  location?: string | null;
  registrationDeadline?: Date | null;
  seriesUrl?: string | null;
  externalUrl?: string | null;
  golfboxId?: number | null;
  source?: TournamentSource | null;
  sourceId?: string | null;
  numberOfHoles?: number | null;
  series?: string | null;
  createdById?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImportableTournament {
  source: TournamentSource;
  sourceId: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  venue?: string;
  numberOfHoles?: number;
  registrationDeadline?: Date;
  series: string;
  externalUrl?: string;
  level?: TournamentLevel;
}

export interface TournamentPlanWithStudent extends PlayerTournamentPlan {
  student: { id: string; name: string | null; image: string | null };
  tournament: Tournament;
}

export interface TournamentWithPlayers extends Tournament {
  playerPlans: (PlayerTournamentPlan & {
    student: { id: string; name: string | null; image: string | null };
  })[];
}

export interface PlayerTournamentPlan {
  id: string;
  studentId: string;
  tournamentId: string;
  planLevel: PlanLevel;
  goalType: GoalType;
  notes?: string | null;
  isRegistered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TournamentWithPlan extends Tournament {
  playerPlan?: PlayerTournamentPlan | null;
}

export interface PlanTournamentInput {
  studentId: string;
  tournamentId: string;
  planLevel: PlanLevel;
  goalType: GoalType;
  notes?: string;
}

export interface CreateTournamentInput {
  name: string;
  startDate: Date;
  endDate?: Date;
  level: TournamentLevel;
  course?: string;
  location?: string;
  registrationDeadline?: Date;
  seriesUrl?: string;
  externalUrl?: string;
  createdById?: string;
}

// ============================================================
// TOURNAMENT PREP
// ============================================================

export interface HoleStrategy {
  hole: number;
  par: number;
  targetScore: number;
  keyShot: string;
  notes: string;
}

export interface PrepChecklist {
  equipment: { label: string; checked: boolean }[];
  mental: { label: string; checked: boolean }[];
  physical: { label: string; checked: boolean }[];
  logistics: { label: string; checked: boolean }[];
}

export interface TournamentPrepData {
  id: string;
  tournamentId: string;
  userId: string;
  courseStrategy: HoleStrategy[] | null;
  checklist: PrepChecklist | null;
  readinessScore: number | null;
  mentalPrepNotes: string | null;
  warmupPlan: string | null;
  createdAt: Date;
  updatedAt: Date;
}
