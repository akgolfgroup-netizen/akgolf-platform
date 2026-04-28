import { getCoachingSessions } from "./actions";
import { HistorikkClientV2 } from "@/components/portal/coaching-historikk/v2/historikk-client-v2";
import type { TimelineSession } from "@/components/portal/coaching-historikk/v2/timeline-types";

export default async function CoachingHistorikkPage() {
  const rawSessions = await getCoachingSessions();

  const sessions: TimelineSession[] = rawSessions.map((s) => ({
    id: s.id,
    sessionDate:
      s.sessionDate instanceof Date
        ? s.sessionDate.toISOString()
        : String(s.sessionDate),
    primaryFocus: s.primaryFocus ?? null,
    secondaryFocus: s.secondaryFocus ?? null,
    techniquesCovered: s.techniquesCovered ?? [],
    drillsAssigned: s.drillsAssigned ?? [],
    studentNotes: s.studentNotes ?? null,
    instructorNotes: s.instructorNotes ?? null,
    aiKeyPoints: s.aiKeyPoints ?? [],
    aiFocusAreas: s.aiFocusAreas ?? [],
    aiActionItems: s.aiActionItems ?? [],
    aiGeneratedAt: s.aiGeneratedAt
      ? s.aiGeneratedAt instanceof Date
        ? s.aiGeneratedAt.toISOString()
        : String(s.aiGeneratedAt)
      : null,
    videoUrls: s.videoUrls ?? [],
    studentName: s.User?.name ?? null,
    studentImage: s.User?.image ?? null,
    instructorName: s.Instructor?.User?.name ?? null,
    instructorTitle: s.Instructor?.title ?? null,
    durationMinutes: null,
  }));

  return <HistorikkClientV2 sessions={sessions} />;
}
