import {
  getWeekEvents,
  getActivePlan,
  getCurrentPeriodization,
  moveSessionToDay,
  createSessionForWeek,
  addExerciseToSession,
  updateSession,
  analyzePlanDeviation,
  adjustPlanVolume,
  listAvailableFacilities,
  listMyPlans,
  archivePlan,
  activatePlan,
  deletePlan,
  duplicateOwnPlan,
  duplicateSession,
  reorderSessionsInDay,
  toggleRestDay,
  dismissPlanAdjustment,
  checkSessionConflicts,
  getPlanGoalsProgress,
  setPlanPlayerComment,
  listMyPendingSuggestions,
  acceptSuggestion,
  rejectSuggestion,
  listStandardTemplates,
  applyTemplateToWeek,
} from "./actions";
import type { TemplateId } from "@/lib/portal/training/standard-templates";
import { TreningsplanPlanner } from "./treningsplan-planner";

// ---------------------------------------------------------------------
// Server component
// ---------------------------------------------------------------------

interface TreningsplanPageProps {
  searchParams: Promise<{ week?: string }>;
}

export default async function TreningsplanPage({ searchParams }: TreningsplanPageProps) {
  const { week } = await searchParams;
  const weekOffset = parseInt(week ?? "0", 10) || 0;

  const plan = await getActivePlan();
  const planId = plan?.id ?? null;
  const periodization = await getCurrentPeriodization();
  const events = await getWeekEvents(weekOffset);
  const historyEvents = await getWeekEvents(weekOffset - 1);
  const facilities = await listAvailableFacilities();
  const myPlans = await listMyPlans();
  const goalsSummary = await getPlanGoalsProgress();

  const coachFeedback = plan?.coachFeedback
    ? {
        text: plan.coachFeedback as string,
        at: plan.coachFeedbackAt ? new Date(plan.coachFeedbackAt).toISOString() : null,
      }
    : null;

  const playerComment = plan?.playerComment
    ? {
        text: plan.playerComment as string,
        at: plan.playerCommentAt ? new Date(plan.playerCommentAt).toISOString() : null,
      }
    : null;

  const pendingSuggestions = await listMyPendingSuggestions();
  const templates = await listStandardTemplates();

  // Server action wrappers bound to the user context
  async function handleMoveEvent(eventId: string, date: string, startH: number, startM: number) {
    "use server";
    const d = new Date(date);
    const day = d.getDay();
    const dayOfWeek = day === 0 ? 7 : day;
    await moveSessionToDay(eventId, dayOfWeek, startH, startM);
  }

  async function handleCreateSession(data: {
    weekOffset: number;
    dayOfWeek: number;
    title: string;
    description?: string;
    durationMinutes?: number;
    focusArea?: string;
    area?: string;
    repsTotal?: number;
    startH?: number;
    startM?: number;
    facilityId?: string;
  }) {
    "use server";
    return createSessionForWeek(data);
  }

  async function handleAddExerciseToSession(
    sessionId: string,
    exercise: {
      id: string;
      name: string;
      description?: string;
      pyramid: string;
      area: string;
      lPhase?: string;
    }
  ) {
    "use server";
    return addExerciseToSession(sessionId, exercise);
  }

  async function handleUpdateSession(
    sessionId: string,
    data: {
      title?: string;
      description?: string;
      durationMinutes?: number;
      focusArea?: string;
      area?: string | null;
      repsTotal?: number | null;
      facilityId?: string | null;
    }
  ) {
    "use server";
    return updateSession(sessionId, data);
  }

  async function handleAdjustPlan(factor: number) {
    "use server";
    return adjustPlanVolume(factor);
  }

  async function handleArchivePlan(planId: string) {
    "use server";
    return archivePlan(planId);
  }

  async function handleActivatePlan(planId: string) {
    "use server";
    return activatePlan(planId);
  }

  async function handleDeletePlan(planId: string) {
    "use server";
    return deletePlan(planId);
  }

  async function handleDuplicatePlan(planId: string) {
    "use server";
    return duplicateOwnPlan(planId);
  }

  async function handleDuplicateSession(sessionId: string) {
    "use server";
    return duplicateSession(sessionId);
  }

  async function handleReorderSessions(
    weekId: string,
    dayOfWeek: number,
    sessionIds: string[]
  ) {
    "use server";
    return reorderSessionsInDay(weekId, dayOfWeek, sessionIds);
  }

  async function handleToggleRestDay(weekId: string, dayOfWeek: number) {
    "use server";
    return toggleRestDay(weekId, dayOfWeek);
  }

  async function handleDismissAdjustment(planId: string) {
    "use server";
    return dismissPlanAdjustment(planId);
  }

  async function handleCheckConflicts(input: {
    date: string;
    startH: number;
    startM: number;
    durationMinutes: number;
    excludeSessionId?: string;
  }) {
    "use server";
    return checkSessionConflicts(input);
  }

  async function handleSavePlayerComment(text: string | null) {
    "use server";
    if (!planId) return { success: false, error: "Ingen aktiv plan" };
    return setPlanPlayerComment(planId, text);
  }

  async function handleAcceptSuggestion(suggestionId: string) {
    "use server";
    return acceptSuggestion(suggestionId);
  }

  async function handleRejectSuggestion(suggestionId: string, reason?: string) {
    "use server";
    return rejectSuggestion(suggestionId, reason);
  }

  async function handleApplyTemplate(templateId: string, offset: number) {
    "use server";
    return applyTemplateToWeek(offset, templateId as TemplateId);
  }

  const sessionCount = events.length;
  const totalMinutes = events.reduce((sum, e) => sum + (e.dur ?? 0), 0);
  const doneCount = events.filter((e) => e.done).length;
  const adherencePct = sessionCount > 0 ? Math.round((doneCount / sessionCount) * 100) : 0;

  const adjustmentSuggestion = await analyzePlanDeviation();

  return (
    <TreningsplanPlanner
      weekOffset={weekOffset}
      planId={planId}
      sessionCount={sessionCount}
      totalMinutes={totalMinutes}
      adherencePct={adherencePct}
      periodization={periodization}
      events={events}
      historyEvents={historyEvents}
      facilities={facilities}
      myPlans={myPlans}
      goalsSummary={goalsSummary}
      coachFeedback={coachFeedback}
      playerComment={playerComment}
      onSavePlayerComment={handleSavePlayerComment}
      pendingSuggestions={pendingSuggestions}
      onAcceptSuggestion={handleAcceptSuggestion}
      onRejectSuggestion={handleRejectSuggestion}
      templates={templates}
      onApplyTemplate={handleApplyTemplate}
      onCreateSession={handleCreateSession}
      onAddExerciseToSession={handleAddExerciseToSession}
      onUpdateSession={handleUpdateSession}
      adjustmentSuggestion={adjustmentSuggestion}
      onAdjustPlan={handleAdjustPlan}
      onArchivePlan={handleArchivePlan}
      onActivatePlan={handleActivatePlan}
      onDeletePlan={handleDeletePlan}
      onDuplicatePlan={handleDuplicatePlan}
      onDuplicateSession={handleDuplicateSession}
      onReorderSessions={handleReorderSessions}
      onToggleRestDay={handleToggleRestDay}
      onDismissAdjustment={handleDismissAdjustment}
      onCheckConflicts={handleCheckConflicts}
    />
  );
}
