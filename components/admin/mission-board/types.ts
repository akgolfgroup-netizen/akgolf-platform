export type MissionMetric = {
  label: string;
  /** "4.2 → 3.5" */
  delta: string;
  /** 0–100 */
  percent: number;
  /** Hex til fargen på baren */
  color: string;
};

export type MissionMilestone = {
  label: string;
  when: string;
  done: boolean;
};

export type MissionDeadline =
  | { variant: "default"; label: string }
  | { variant: "near"; label: string }
  | { variant: "passed"; label: string };

export type MissionCard = {
  id: string;
  studentName: string;
  studentInitials: string;
  studentSub: string;
  avatarColor: string;
  deadline: MissionDeadline;
  goalTitle: string;
  goalSubtitle: string;
  /** Heltall 0–100 */
  ringPercent: number;
  /** Hex til ring-stroke */
  ringColor: string;
  metrics: MissionMetric[];
  milestones: MissionMilestone[];
  /** Aksjonsknapp 1 */
  primaryAction: {
    icon: "message-circle" | "users";
    label: string;
  };
  /** Indikerer at kortet skal ha lime glow */
  glow?: boolean;
};

export type MissionSummary = {
  active: number;
  /** "64%" */
  averageProgress: string;
  withinDeadline: number;
  closedQ1: number;
};
