export interface WeekDay {
  dayLabel: string;
  dateNumber: number;
  trained: boolean;
  hasCoaching: boolean;
  isToday: boolean;
  isRest: boolean;
  completionPercent: number;
}

export interface NextBooking {
  id: string;
  instructorName: string;
  serviceName: string;
  duration: number;
  startTime: Date | string;
}

export interface CoachInsight {
  focusAreas: string[] | null;
  primaryFocus: string | null;
  summary: string | null;
  date: Date | string;
}

export interface AiInsight {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  goalProgress: {
    target: string;
    current: number;
    target_value: number;
    unit: string;
  };
  patternAnalysis: string;
}

export interface TrackManData {
  lastSession: {
    date: string;
    club: string;
    metric: string;
    value: number;
    unit: string;
  } | null;
  trends: {
    clubSpeed: number[];
    ballSpeed: number[];
    carry: number[];
  };
  improvements: {
    metric: string;
    change: number;
    period: string;
  }[];
}

export interface SocialData {
  rank: number;
  totalPlayers: number;
  challenges: {
    id: string;
    name: string;
    progress: number;
    endDate: string;
  }[];
  streak: number;
  friendsOnline: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
  progress?: number;
}

export interface SgSummary {
  total: number | null;
  offTheTee: number | null;
  approach: number | null;
  aroundTheGreen: number | null;
  putting: number | null;
  roundCount: number;
  trend: "up" | "down" | "flat";
}

export interface TrainingIndexData {
  weeklyHours: number;
  recommendedSummer: [number, number];
  recommendedWinter: [number, number];
  planAdherencePct: number;
  distribution: {
    onCourse: number;
    skillTechnical: number;
    shortGame: number;
    putting: number;
    physicalMental: number;
  };
}

export interface TestProgress {
  totalTests: number;
  completedTests: number;
  passedTests: number;
  latestTest: {
    name: string;
    passed: boolean;
    value: number;
    unit: string;
    conductedAt: string;
  } | null;
  missingCount: number;
}

export interface RoundAggregateMetrics {
  fairwayPct: number | null;
  girPct: number | null;
  scramblingPct: number | null;
  scoringAvg: number | null;
  roundCount: number;
}

export interface TodayTask {
  id: string;
  icon: string;
  label: string;
  time: string;
  durationMinutes: number;
  done: boolean;
  source: "session" | "booking" | "log";
}

export interface DashboardV3Props {
  userName: string | null;
  tier: string;
  memberSince: string | null;
  stats: { sessionsCount: number; roundsCount: number };
  handicap: { current: number | null; trend: number | null };
  handicapHistory: number[];
  nextBooking: NextBooking | null;
  weekRings: { days: WeekDay[]; weekStart: string };
  coachInsight: CoachInsight | null;
  aiInsight: AiInsight | null;
  trackManData?: TrackManData;
  socialData?: SocialData;
  achievements: Achievement[];
  totalAchievements: number;
  playerLevel: "beginner" | "intermediate" | "advanced" | "pro";
  sgSummary: SgSummary;
  trainingIndex: TrainingIndexData | null;
  testProgress: TestProgress;
  needsOnboarding?: boolean;
}
