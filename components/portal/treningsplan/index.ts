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
