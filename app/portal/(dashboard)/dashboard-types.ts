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
}
