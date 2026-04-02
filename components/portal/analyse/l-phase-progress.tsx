"use client";

import { useState, useMemo } from "react";
import { Clock, User, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import {
  L_PHASES,
  type LPhase,
  type ShotType,
  SHOT_TYPES,
} from "@/lib/portal/training/l-phase-service";

// =============================================================================
// TYPES
// =============================================================================

export interface LPhaseEntry {
  shotType: string;
  lPhase: string;
  setAt: Date;
  setBy: string | null;
  notes: string | null;
}

interface LPhaseProgressProps {
  /** Current L-phase data per shot type */
  currentPhases: Record<ShotType, LPhaseEntry | null>;
  /** Full history of L-phase changes per shot type */
  history: Record<ShotType, LPhaseEntry[]>;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SHOT_TYPE_LABELS: Record<ShotType, string> = {
  DRIVER: "Driver",
  IRON: "Jern",
  WEDGE: "Naerspill",
  PUTT: "Putting",
};

const L_PHASE_DESCRIPTIONS: Record<LPhase, string> = {
  KROPP: "Fokus pa kroppens posisjon og bevegelse",
  ARM: "Fokus pa armer og hender",
  KØLLE: "Fokus pa kollehodets bane og posisjon",
  BALL: "Fokus pa ballkontakt og ballflukt",
  AUTO: "Automatisert utforelse uten bevisst tanke",
};

// =============================================================================
// COMPONENT
// =============================================================================

export function LPhaseProgress({ currentPhases, history }: LPhaseProgressProps) {
  return (
    <div className="space-y-4">
      {/* Grid of 4 shot types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SHOT_TYPES.map((shotType) => (
          <ShotTypeCard
            key={shotType}
            shotType={shotType}
            currentPhase={currentPhases[shotType]}
            history={history[shotType] || []}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-2 text-xs text-[var(--color-grey-500)]">
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3" />
          <span>Satt av coach</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3 w-3" />
          <span>Satt av deg selv</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function ShotTypeCard({
  shotType,
  currentPhase,
  history,
}: {
  shotType: ShotType;
  currentPhase: LPhaseEntry | null;
  history: LPhaseEntry[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentLPhase = currentPhase?.lPhase as LPhase | undefined;
  const phaseIndex = currentLPhase ? L_PHASES.indexOf(currentLPhase) : -1;

  // Determine who set the current phase
  const setByCoach =
    currentPhase?.setBy &&
    currentPhase.setBy !== currentPhase.setBy.toLowerCase();

  return (
    <div className="bg-white border border-[var(--color-grey-200)] rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--color-grey-900)]">
          {SHOT_TYPE_LABELS[shotType]}
        </h3>
        {currentPhase && (
          <div
            className="flex items-center gap-1 text-[var(--color-grey-400)]"
            title={setByCoach ? "Satt av coach" : "Satt av deg selv"}
          >
            {setByCoach ? (
              <User className="h-3 w-3" />
            ) : (
              <BookOpen className="h-3 w-3" />
            )}
          </div>
        )}
      </div>

      {/* Current phase display */}
      {currentPhase ? (
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--color-grey-900)]">
              L-{currentLPhase}
            </span>
            <span className="text-xs text-[var(--color-grey-400)]">
              ({phaseIndex + 1}/5)
            </span>
          </div>

          {/* Phase progress indicator */}
          <PhaseProgressBar currentIndex={phaseIndex} />

          {/* Description */}
          {currentLPhase && (
            <p className="text-[11px] text-[var(--color-grey-500)] leading-snug">
              {L_PHASE_DESCRIPTIONS[currentLPhase]}
            </p>
          )}

          {/* Set date */}
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-grey-400)]">
            <Clock className="h-3 w-3" />
            <span>
              {formatDate(new Date(currentPhase.setAt))}
            </span>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center">
          <p className="text-sm text-[var(--color-grey-400)]">
            Ikke satt
          </p>
          <p className="text-[10px] text-[var(--color-grey-400)] mt-1">
            Coach vil sette L-fase
          </p>
        </div>
      )}

      {/* History toggle */}
      {history.length > 1 && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            <span>
              {isExpanded ? "Skjul historikk" : `Vis historikk (${history.length - 1})`}
            </span>
          </button>

          {isExpanded && (
            <div className="pt-2 border-t border-[var(--color-grey-100)]">
              <HistoryTimeline history={history.slice(1)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PhaseProgressBar({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="flex gap-1">
      {L_PHASES.map((phase, index) => (
        <div
          key={phase}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            index <= currentIndex
              ? "bg-[var(--color-grey-900)]"
              : "bg-[var(--color-grey-200)]"
          }`}
          title={phase}
        />
      ))}
    </div>
  );
}

function HistoryTimeline({ history }: { history: LPhaseEntry[] }) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-2">
      {history.map((entry, index) => {
        const setByCoach =
          entry.setBy && entry.setBy !== entry.setBy.toLowerCase();

        return (
          <div
            key={`${entry.shotType}-${index}`}
            className="flex items-start gap-2 text-[11px]"
          >
            {/* Timeline dot */}
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-grey-300)] flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--color-grey-700)]">
                  L-{entry.lPhase}
                </span>
                <span className="text-[var(--color-grey-400)]">
                  {formatDate(new Date(entry.setAt))}
                </span>
                {setByCoach && (
                  <User className="h-2.5 w-2.5 text-[var(--color-grey-400)]" />
                )}
              </div>
              {entry.notes && (
                <p className="text-[var(--color-grey-500)] mt-0.5 truncate">
                  {entry.notes}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// UTILITIES
// =============================================================================

function formatDate(date: Date): string {
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return "I dag";
  } else if (diffDays === 1) {
    return "I gar";
  } else if (diffDays < 7) {
    return `${diffDays} dager siden`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} uke${weeks > 1 ? "r" : ""} siden`;
  } else {
    return date.toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "short",
      year: diffDays > 365 ? "numeric" : undefined,
    });
  }
}
