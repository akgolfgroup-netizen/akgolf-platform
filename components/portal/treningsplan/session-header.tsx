"use client";

import {
  Target,
  Clock,
  Wrench,
  Zap,
  Play,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import type { TrainingSessionData } from "@/lib/portal/golf/exercise-types";
import { TRAINING_AREAS, INTENSITY_LEVELS } from "@/lib/portal/golf/exercise-types";
import { PyramidStack } from "./pyramid-indicator";
import { SessionIdDisplay, FormulaBar, AreaCategoryBadge } from "./ak-formula-tags";
import { generateSessionId } from "@/lib/portal/golf/ak-formula";

interface SessionHeaderProps {
  session: TrainingSessionData;
  onStartSession?: () => void;
  isActive?: boolean;
  completedCount?: number;
  totalExercises?: number;
}

export function SessionHeader({
  session,
  onStartSession,
  isActive = false,
  completedCount = 0,
  totalExercises = 0,
}: SessionHeaderProps) {
  const areaData = TRAINING_AREAS[session.primaryArea];
  const intensity = INTENSITY_LEVELS[session.intensity];

  // Generate session ID if we have enough data
  const sessionId = session.sessionId || (
    session.mainBlock?.[0] ? generateSessionId({
      pyramid: session.primaryPyramid,
      area: session.primaryArea,
      lPhase: session.mainBlock[0].lPhase,
      cs: session.mainBlock[0].clubSpeed,
      environment: session.mainBlock[0].environment,
      press: session.mainBlock[0].pressLevel,
    }) : undefined
  );

  const progress = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

  return (
    <div className="rounded-xl border border-[#333] bg-[#1a1a1a] overflow-hidden">
      {/* Top bar with title and action */}
      <div className="flex items-center justify-between p-4 border-b border-[#333]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-white">{session.title}</h2>
            <AreaCategoryBadge category={areaData.category} />
          </div>
          {session.description && (
            <p className="text-sm text-[#737373]">{session.description}</p>
          )}
        </div>

        {onStartSession && !isActive && (
          <button
            onClick={onStartSession}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-black)] text-white font-medium hover:bg-[var(--color-grey-900)] transition-colors"
          >
            <Play className="w-4 h-4" />
            Start okt
          </button>
        )}

        {isActive && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-[#737373]">Fremgang</p>
              <p className="text-lg font-semibold text-white">
                {completedCount}/{totalExercises}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#262626] flex items-center justify-center">
              {progress === 100 ? (
                <CheckCircle className="w-6 h-6 text-[#2D6A4F]" />
              ) : (
                <span className="text-sm font-semibold text-[var(--color-grey-900)]">{Math.round(progress)}%</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Session info grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {/* Objective */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[var(--color-grey-900)]" />
            <span className="text-[11px] text-[#737373] uppercase font-medium">Malsetning</span>
          </div>
          <p className="text-sm text-white">{session.objective}</p>
          {session.focusPoints.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {session.focusPoints.map((point, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#262626] text-[#A3A3A3]"
                >
                  {point}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Duration & Intensity */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[var(--color-grey-900)]" />
            <span className="text-[11px] text-[#737373] uppercase font-medium">Varighet</span>
          </div>
          <p className="text-sm text-white">{session.durationMinutes} minutter</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Zap className="w-3 h-3" style={{ color: intensity.color }} />
            <span className="text-[11px]" style={{ color: intensity.color }}>
              {intensity.name} intensitet
            </span>
          </div>
        </div>

        {/* Equipment */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-[var(--color-grey-900)]" />
            <span className="text-[11px] text-[#737373] uppercase font-medium">Hjelpemidler</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {session.equipment.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#262626] text-[#A3A3A3]"
              >
                {item}
              </span>
            ))}
            {session.equipment.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#262626] text-[#737373]">
                +{session.equipment.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AK-formelen section */}
      <div className="flex items-center justify-between p-4 border-t border-[#333] bg-[#0f0f0f]">
        <div className="flex items-center gap-4">
          {/* Pyramid visualization */}
          <div className="hidden sm:block w-24">
            <PyramidStack activeLevel={session.primaryPyramid} compact />
          </div>

          {/* Session ID display */}
          <div>
            <p className="text-[11px] text-[#737373] uppercase mb-1.5">AK-formel</p>
            <SessionIdDisplay
              pyramid={session.primaryPyramid}
              area={session.primaryArea}
              compact
            />
          </div>

          {/* Secondary areas */}
          {session.secondaryAreas && session.secondaryAreas.length > 0 && (
            <div className="hidden md:block">
              <p className="text-[11px] text-[#737373] uppercase mb-1.5">Sekundaere omrader</p>
              <div className="flex gap-1">
                {session.secondaryAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#262626] text-[#737373]"
                  >
                    {TRAINING_AREAS[area].name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Full formula bar */}
        {sessionId && (
          <FormulaBar sessionId={sessionId} className="hidden lg:flex" />
        )}
      </div>

      {/* Progress bar */}
      {isActive && (
        <div className="h-1 bg-[#262626]">
          <div
            className="h-full bg-[var(--color-grey-900)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Compact version for list views
interface SessionCardCompactProps {
  session: TrainingSessionData;
  onClick?: () => void;
  isCompleted?: boolean;
}

export function SessionCardCompact({
  session,
  onClick,
  isCompleted = false,
}: SessionCardCompactProps) {
  const intensity = INTENSITY_LEVELS[session.intensity];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-[border-color,background-color] ${
        isCompleted
          ? "bg-[#2D6A4F]/5 border-[#2D6A4F]/30"
          : "bg-[#1a1a1a] border-[#333] hover:border-[#444]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <div className="w-10 h-10 rounded-lg bg-[#2D6A4F]/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#2D6A4F]" />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${intensity.color}20` }}
            >
              <Target className="w-5 h-5" style={{ color: intensity.color }} />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-medium ${isCompleted ? "text-[#737373]" : "text-white"}`}>
                {session.title}
              </h3>
              <SessionIdDisplay
                pyramid={session.primaryPyramid}
                area={session.primaryArea}
                compact
              />
            </div>
            <p className="text-sm text-[#737373]">
              {session.durationMinutes} min - {intensity.name} intensitet
            </p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-[#737373]" />
      </div>
    </button>
  );
}
