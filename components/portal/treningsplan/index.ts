// AK-formel komponenter
export { PyramidIndicator, PyramidStack } from "./pyramid-indicator";
export {
  PyramidTag,
  AreaTag,
  LPhaseTag,
  ClubSpeedTag,
  EnvironmentTag,
  PressTag,
  LifeTag,
  SessionIdDisplay,
  FormulaBar,
  AreaCategoryBadge,
} from "./ak-formula-tags";

// Øvelse-komponenter
export { ExerciseCard } from "./exercise-card";

// Økt-komponenter
export { SessionHeader, SessionCardCompact } from "./session-header";
export { SessionView } from "./session-view";

// Drag & Drop komponenter
export { SessionCard, SessionCardStatic } from "./SessionCard";
export { WeekCalendar, WeekCalendarCompact, DragOverlayWrapper } from "./WeekCalendar";

// Modaler
export { SessionDetailModal } from "./SessionDetailModal";
export { NewSessionModal } from "./NewSessionModal";

// Sidepanel
export { SidePanel } from "./SidePanel";
export { StandardSessions } from "./StandardSessions";
export { PyramidFilter } from "./PyramidFilter";
export { ExerciseBank } from "./ExerciseBank";
export {
  useDragAndDrop,
  useSortableDay,
  groupSessionsByDay,
  DAY_NAMES,
  TIME_CONFIG,
  calculatePositionFromTime,
  calculateHeightFromDuration,
} from "./useDragAndDrop";

// Typer
export type { TrainingSession, Exercise, StandardTemplate, WeekDay } from "./types";

// Wizard for å lage ny plan
export { PlanCreatorModal } from "./plan-creator-modal";

// Samtale (coach-feedback + spiller-kommentar)
export { PlanConversationCard } from "./plan-conversation-card";
export type {
  PlanConversationMessage,
  PlanConversationCardProps,
} from "./plan-conversation-card";

// Pyramide-fordeling (FYS/TEK/SLAG/SPILL/TURN-slidere)
export {
  PyramidDistributionEditor,
  DEFAULT_DISTRIBUTION,
  PYRAMID_PRESETS,
  sumDistribution,
  isValidDistribution,
  adjustDistribution,
} from "./pyramid-distribution-editor";
export type { PyramidDistribution, PyramidPreset } from "./pyramid-distribution-editor";

// Forslags-modus (Sprint 2): coach foreslår, spiller godkjenner
export { PlanSuggestionInbox } from "./plan-suggestion-inbox";
export type { PlanSuggestionInboxProps } from "./plan-suggestion-inbox";
