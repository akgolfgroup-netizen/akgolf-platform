"use client";

import {
  PYRAMID_LEVELS,
  TRAINING_AREAS,
  L_PHASES,
  M_ENVIRONMENTS,
  PR_LEVELS,
  LIFE_DIMENSIONS,
  type PyramidLevel,
  type TrainingArea,
  type LPhase,
  type MEnvironment,
  type PRLevel,
  type LifeDimension,
} from "@/lib/portal/golf/ak-formula";

// =============================================================================
// INDIVIDUAL TAGS
// =============================================================================

interface TagProps {
  className?: string;
}

export function PyramidTag({ level, className = "" }: TagProps & { level: PyramidLevel }) {
  const pyramid = PYRAMID_LEVELS[level];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold text-white ${className}`}
      style={{ backgroundColor: pyramid.color }}
    >
      {pyramid.id}
    </span>
  );
}

export function AreaTag({ area, className = "" }: TagProps & { area: TrainingArea }) {
  const areaData = TRAINING_AREAS[area];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#262626] text-white ${className}`}
    >
      {areaData.name}
    </span>
  );
}

export function LPhaseTag({ phase, className = "" }: TagProps & { phase: LPhase }) {
  const phaseData = L_PHASES[phase];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#333] text-[#A3A3A3] ${className}`}
      title={phaseData.description}
    >
      L-{phaseData.id}
    </span>
  );
}

export function ClubSpeedTag({ cs, className = "" }: TagProps & { cs: number }) {
  const getColor = () => {
    if (cs <= 40) return "bg-green-500/20 text-green-400";
    if (cs <= 60) return "bg-yellow-500/20 text-yellow-400";
    if (cs <= 80) return "bg-orange-500/20 text-orange-400";
    return "bg-red-500/20 text-red-400";
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${getColor()} ${className}`}
      title={`Club Speed: ${cs}% av maks`}
    >
      CS{cs}
    </span>
  );
}

export function EnvironmentTag({ env, className = "" }: TagProps & { env: MEnvironment }) {
  const envData = M_ENVIRONMENTS[env];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/20 text-blue-400 ${className}`}
      title={envData.description}
    >
      M{env}
    </span>
  );
}

export function PressTag({ press, className = "" }: TagProps & { press: PRLevel }) {
  const pressData = PR_LEVELS[press];
  const getColor = () => {
    if (press <= 2) return "bg-green-500/20 text-green-400";
    if (press === 3) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${getColor()} ${className}`}
      title={pressData.description}
    >
      PR{press}
    </span>
  );
}

export function LifeTag({ dimension, className = "" }: TagProps & { dimension: LifeDimension }) {
  const lifeData = LIFE_DIMENSIONS[dimension];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-white ${className}`}
      style={{ backgroundColor: lifeData.color }}
      title={lifeData.description}
    >
      {lifeData.id}
    </span>
  );
}

// =============================================================================
// COMBINED SESSION ID DISPLAY
// =============================================================================

interface SessionIdDisplayProps {
  pyramid: PyramidLevel;
  area: TrainingArea;
  lPhase?: LPhase;
  clubSpeed?: number;
  environment?: MEnvironment;
  press?: PRLevel;
  life?: LifeDimension;
  compact?: boolean;
}

export function SessionIdDisplay({
  pyramid,
  area,
  lPhase,
  clubSpeed,
  environment,
  press,
  life,
  compact = false,
}: SessionIdDisplayProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-1">
        <PyramidTag level={pyramid} />
        <AreaTag area={area} />
        {lPhase && <LPhaseTag phase={lPhase} />}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <PyramidTag level={pyramid} />
      <AreaTag area={area} />
      {lPhase && <LPhaseTag phase={lPhase} />}
      {clubSpeed !== undefined && <ClubSpeedTag cs={clubSpeed} />}
      {environment !== undefined && <EnvironmentTag env={environment} />}
      {press !== undefined && <PressTag press={press} />}
      {life && <LifeTag dimension={life} />}
    </div>
  );
}

// =============================================================================
// FORMULA BAR (full session ID string)
// =============================================================================

interface FormulaBarProps {
  sessionId: string;
  className?: string;
}

export function FormulaBar({ sessionId, className = "" }: FormulaBarProps) {
  return (
    <div
      className={`inline-flex items-center px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#333] font-mono text-xs text-[#A3A3A3] ${className}`}
    >
      <span className="text-[var(--color-grey-900)] mr-1">AK</span>
      <span>{sessionId}</span>
    </div>
  );
}

// =============================================================================
// AREA CATEGORY BADGE
// =============================================================================

interface AreaCategoryBadgeProps {
  category: "FULL_SWING" | "SHORT_GAME" | "PUTTING";
  className?: string;
}

export function AreaCategoryBadge({ category, className = "" }: AreaCategoryBadgeProps) {
  const config = {
    FULL_SWING: { label: "Full Swing", color: "bg-blue-500/20 text-blue-400" },
    SHORT_GAME: { label: "Naerspill", color: "bg-green-500/20 text-green-400" },
    PUTTING: { label: "Putting", color: "bg-purple-500/20 text-purple-400" },
  };

  const { label, color } = config[category];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${color} ${className}`}
    >
      {label}
    </span>
  );
}
