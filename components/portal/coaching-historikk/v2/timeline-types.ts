export interface TimelineSession {
  id: string;
  sessionDate: string;
  primaryFocus: string | null;
  secondaryFocus: string | null;
  techniquesCovered: string[];
  drillsAssigned: string[];
  studentNotes: string | null;
  instructorNotes: string | null;
  aiKeyPoints: string[];
  aiFocusAreas: string[];
  aiActionItems: string[];
  aiGeneratedAt: string | null;
  videoUrls: string[];
  studentName: string | null;
  studentImage: string | null;
  instructorName: string | null;
  instructorTitle: string | null;
  durationMinutes: number | null;
}

export type FilterType = "alle" | "individual" | "video" | "test" | "tournament";
