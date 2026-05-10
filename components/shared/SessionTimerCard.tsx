"use client";

import { cn } from "@/lib/utils";
import { Play, Pause, Square } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface SessionTimerCardProps {
  presetDuration?: number;
  onComplete?: (elapsedSeconds: number) => void;
  className?: string;
}

type TimerState = "idle" | "running" | "paused";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function SessionTimerCard({
  presetDuration,
  onComplete,
  className,
}: SessionTimerCardProps) {
  const [elapsed, setElapsed] = useState(0);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleStart = useCallback(() => {
    if (timerState === "running") return;
    setTimerState("running");
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
  }, [timerState]);

  const handlePause = useCallback(() => {
    clearTimer();
    setTimerState("paused");
  }, [clearTimer]);

  const handleStop = useCallback(() => {
    clearTimer();
    const finalElapsed = elapsedRef.current;
    setTimerState("idle");
    setElapsed(0);
    elapsedRef.current = 0;
    onComplete?.(finalElapsed);
  }, [clearTimer, onComplete]);

  const remaining =
    presetDuration !== undefined ? Math.max(0, presetDuration - elapsed) : null;

  return (
    <div
      className={cn("flex flex-col items-center gap-5 p-6", className)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        border: "1px solid #E5E3DD",
      }}
    >
      {/* Elapsed time */}
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "48px",
          fontWeight: 700,
          lineHeight: 1,
          color: "#0A1F18",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatTime(elapsed)}
      </span>

      {/* Remaining time */}
      {remaining !== null && (
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "14px",
            fontWeight: 400,
            color: "#9C9990",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatTime(remaining)} gjenstår
        </span>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {timerState === "idle" && (
          <button
            type="button"
            onClick={handleStart}
            className="flex items-center justify-center gap-2"
            style={{
              height: 40,
              padding: "0 20px",
              borderRadius: 12,
              backgroundColor: "#005840",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <Play size={16} strokeWidth={1.75} />
            Start
          </button>
        )}

        {timerState === "running" && (
          <>
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center justify-center gap-2"
              style={{
                height: 40,
                padding: "0 20px",
                borderRadius: 12,
                backgroundColor: "#B8852A",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <Pause size={16} strokeWidth={1.75} />
              Pause
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center justify-center gap-2"
              style={{
                height: 40,
                padding: "0 20px",
                borderRadius: 12,
                backgroundColor: "#A32D2D",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <Square size={16} strokeWidth={1.75} />
              Stopp
            </button>
          </>
        )}

        {timerState === "paused" && (
          <>
            <button
              type="button"
              onClick={handleStart}
              className="flex items-center justify-center gap-2"
              style={{
                height: 40,
                padding: "0 20px",
                borderRadius: 12,
                backgroundColor: "#005840",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <Play size={16} strokeWidth={1.75} />
              Fortsett
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center justify-center gap-2"
              style={{
                height: 40,
                padding: "0 20px",
                borderRadius: 12,
                backgroundColor: "#A32D2D",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <Square size={16} strokeWidth={1.75} />
              Stopp
            </button>
          </>
        )}
      </div>
    </div>
  );
}
