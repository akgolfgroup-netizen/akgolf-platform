export interface TrainingSession {
  id: string;
  title: string;
  duration: number;
  focus: 'FYS' | 'TEK' | 'SLAG' | 'SPILL' | 'TURN';
  dayOfWeek: number;
  startH: number;
  startM: number;
  exercises: Exercise[];
  completed?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  pyramid: 'FYS' | 'TEK' | 'SLAG' | 'SPILL' | 'TURN';
  area: string;
  duration?: number;
  lPhase?: string | null;
  cs?: string | null;
  m?: string | null;
  pr?: string | null;
}

export interface StandardTemplate {
  id: string;
  title: string;
  duration: number;
  focus: 'FYS' | 'TEK' | 'SLAG' | 'SPILL' | 'TURN';
  exercises: Exercise[];
}

export interface WeekDay {
  date: Date;
  dayName: string;
  sessions: TrainingSession[];
}
