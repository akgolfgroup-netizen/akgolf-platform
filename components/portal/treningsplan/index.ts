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
