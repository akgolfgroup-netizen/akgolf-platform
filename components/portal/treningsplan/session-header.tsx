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
    <div className="rounded-2xl border border-[#c2c9bb]/50 bg-white overflow-hidden shadow-sm">
      {/* Top bar with title and action */}
      <div className="flex items-center justify-between p-5 border-b border-[#c2c9bb]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-[#1c1c16]">{session.title}</h2>
            <AreaCategoryBadge category={areaData.category} />
          </div>
          {session.description && (
            <p className="text-sm text-[#6b7366]">{session.description}</p>
          )}
        </div>

        {onStartSession && !isActive && (
          <button
            onClick={onStartSession}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d2f000] text-[#154212] font-semibold hover:bg-[#b8d600] transition-colors"
          >
            <Play className="w-4 h-4" />
            Start okt
          </button>
        )}

        {isActive && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-[#6b7366]">Fremgang</p>
              <p className="text-lg font-semibold text-[#1c1c16]">
                {completedCount}/{totalExercises}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#f7f3ea] flex items-center justify-center">
              {progress === 100 ? (
                <CheckCircle className="w-6 h-6 text-[#22c55e]" />
              ) : (
                <span className="text-sm font-semibold text-[#154212]">{Math.round(progress)}%</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Session info grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5">
        {/* Objective */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#154212]" />
            <span className="text-[11px] text-[#6b7366] uppercase font-medium">Malsetning</span>
          </div>
          <p className="text-sm text-[#1c1c16]">{session.objective}</p>
          {session.focusPoints.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {session.focusPoints.map((point, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#f7f3ea] text-[#42493e]"
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
            <Clock className="w-4 h-4 text-[#154212]" />
            <span className="text-[11px] text-[#6b7366] uppercase font-medium">Varighet</span>
          </div>
          <p className="text-sm text-[#1c1c16]">{session.durationMinutes} minutter</p>
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
            <Wrench className="w-4 h-4 text-[#154212]" />
            <span className="text-[11px] text-[#6b7366] uppercase font-medium">Hjelpemidler</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {session.equipment.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#f7f3ea] text-[#42493e]"
              >
                {item}
              </span>
            ))}
            {session.equipment.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#f7f3ea] text-[#6b7366]">
                +{session.equipment.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AK-formelen section */}
      <div className="flex items-center justify-between p-5 border-t border-[#c2c9bb]/30 bg-[#fdf9f0]">
        <div className="flex items-center gap-4">
          {/* Pyramid visualization */}
          <div className="hidden sm:block w-24">
            <PyramidStack activeLevel={session.primaryPyramid} compact />
          </div>

          {/* Session ID display */}
          <div>
            <p className="text-[11px] text-[#6b7366] uppercase mb-1.5">AK-formel</p>
            <SessionIdDisplay
              pyramid={session.primaryPyramid}
              area={session.primaryArea}
              compact
            />
          </div>

          {/* Secondary areas */}
          {session.secondaryAreas && session.secondaryAreas.length > 0 && (
            <div className="hidden md:block">
              <p className="text-[11px] text-[#6b7366] uppercase mb-1.5">Sekundaere omrader</p>
              <div className="flex gap-1">
                {session.secondaryAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-white border border-[#c2c9bb]/50 text-[#6b7366]"
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
        <div className="h-1 bg-[#f7f3ea]">
          <div
            className="h-full bg-[#d2f000] transition-[width] duration-300"
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
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        isCompleted
          ? "bg-[#22c55e]/5 border-[#22c55e]/30"
          : "bg-white border-[#c2c9bb]/50 hover:border-[#c2c9bb] hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <div className="w-10 h-10 rounded-xl bg-[#22c55e]/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#22c55e]" />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${intensity.color}20` }}
            >
              <Target className="w-5 h-5" style={{ color: intensity.color }} />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-medium ${isCompleted ? "text-[#6b7366]" : "text-[#1c1c16]"}`}>
                {session.title}
              </h3>
              <SessionIdDisplay
                pyramid={session.primaryPyramid}
                area={session.primaryArea}
                compact
              />
            </div>
            <p className="text-sm text-[#6b7366]">
              {session.durationMinutes} min - {intensity.name} intensitet
            </p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-[#c2c9bb]" />
      </div>
    </button>
  );
}
