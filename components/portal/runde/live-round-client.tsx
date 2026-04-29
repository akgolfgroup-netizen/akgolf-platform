"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { ShotForm } from "./shot-form";
import { ShotList } from "./shot-list";
import {
  logShot,
  completeHole,
  completeRound,
} from "@/lib/portal/round/shot-actions";
import { togglePauseRound } from "@/lib/portal/round/live-actions";

interface HoleData {
  id: string;
  holeNumber: number;
  par: number;
  lengthMeter: number;
}

interface ShotData {
  shotNumber: number;
  club: string;
  fromLie: string;
  fromDistance: number;
  toLie: string;
  toDistance: number;
  strokesGained: number;
}

interface Props {
  roundId: string;
  courseName: string;
  coursePar: number;
  holes: HoleData[];
  clubs: string[];
  initialShots: Record<number, ShotData[]>;
  liveState: {
    currentHoleNumber: number;
    currentShotNumber: number;
    isPaused: boolean;
  };
}

export function LiveRoundClient({
  roundId,
  courseName,
  coursePar,
  holes,
  clubs,
  initialShots,
  liveState,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentHoleIdx, setCurrentHoleIdx] = useState(
    Math.min(
      Math.max(0, liveState.currentHoleNumber - 1),
      holes.length - 1
    )
  );
  const [shotsByHole, setShotsByHole] = useState(initialShots);
  const [isPaused, setIsPaused] = useState(liveState.isPaused);
  const [lastSg, setLastSg] = useState<number | null>(null);
  const [error, setError] = useState("");

  const hole = holes[currentHoleIdx];
  const shots = shotsByHole[hole.holeNumber] ?? [];
  const nextShotNumber = shots.length + 1;

  // Forrige slags "to" blir neste slags "from"
  const defaultFromLie = shots.length > 0
    ? shots[shots.length - 1].toLie
    : "tee";
  const defaultFromDistance = shots.length > 0
    ? shots[shots.length - 1].toDistance
    : hole.lengthMeter;

  // Forenklet: vi viser bare antall loggede slag.
  const loggedShotsCount = Object.values(shotsByHole).reduce(
    (s, list) => s + list.length,
    0
  );
  const holesWithShots = Object.keys(shotsByHole).length;

  const handleLogShot = useCallback(
    (data: {
      club: string;
      fromLie: string;
      fromDistance: number;
      toLie: string;
      toDistance: number;
    }) => {
      setError("");
      startTransition(async () => {
        try {
          const result = await logShot(roundId, {
            holeNumber: hole.holeNumber,
            holeId: hole.id,
            shotNumber: nextShotNumber,
            club: data.club,
            fromLie: data.fromLie,
            fromDistance: data.fromDistance,
            toLie: data.toLie,
            toDistance: data.toDistance,
            par: hole.par,
          });

          const newShot: ShotData = {
            shotNumber: nextShotNumber,
            club: data.club,
            fromLie: data.fromLie,
            fromDistance: data.fromDistance,
            toLie: data.toLie,
            toDistance: data.toDistance,
            strokesGained: result.sgEstimate,
          };

          setShotsByHole((prev) => ({
            ...prev,
            [hole.holeNumber]: [...(prev[hole.holeNumber] ?? []), newShot],
          }));
          setLastSg(result.sgEstimate);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Feil ved logging");
        }
      });
    },
    [roundId, hole, nextShotNumber]
  );

  function handleCompleteHole() {
    setError("");
    const putts = shots.filter((s) => s.fromLie === "green").length;
    // Hvis siste slag endte på green, anta 1 putt til hull (hvis ikke allerede logget)
    const finalPutts = putts + (shots.length > 0 && shots[shots.length - 1].toLie === "green" && putts === 0 ? 1 : putts);
    const finalScore = shots.length + (shots.length > 0 && shots[shots.length - 1].toLie === "green" && putts === 0 ? 1 : 0);

    startTransition(async () => {
      try {
        await completeHole(roundId, hole.holeNumber, finalScore || shots.length + 1, finalPutts);

        if (currentHoleIdx < holes.length - 1) {
          setCurrentHoleIdx(currentHoleIdx + 1);
          setLastSg(null);
        } else {
          await completeRound(roundId);
          router.push(`/portal/runde/${roundId}/oppsummering`);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Feil ved lagring");
      }
    });
  }

  function handleTogglePause() {
    const next = !isPaused;
    setIsPaused(next);
    startTransition(async () => {
      await togglePauseRound(roundId, next);
    });
  }

  function navigate(dir: "prev" | "next") {
    if (dir === "prev" && currentHoleIdx > 0) {
      setCurrentHoleIdx(currentHoleIdx - 1);
      setLastSg(null);
    } else if (dir === "next" && currentHoleIdx < holes.length - 1) {
      setCurrentHoleIdx(currentHoleIdx + 1);
      setLastSg(null);
    }
  }

  const vsPar = loggedShotsCount - coursePar; // grov estimat

  return (
    <div className="max-w-lg mx-auto space-y-4 pb-24">
      {/* Header */}
      <PremiumCard padding="md" className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-on-surface text-sm">{courseName}</h1>
          <p className="text-xs text-on-surface-variant">
            {holesWithShots} av {holes.length} hull •{" "}
            <span className={cn("font-medium", vsPar > 0 ? "text-danger" : vsPar < 0 ? "text-success" : "text-on-surface")}>
              {vsPar > 0 ? "+" : ""}{vsPar}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePause}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              isPaused
                ? "bg-warning/10 text-warning"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
            )}
            aria-label={isPaused ? "Fortsett runde" : "Pause runde"}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <div className="text-right">
            <p className="text-xl font-bold text-on-surface font-mono tabular-nums">
              {loggedShotsCount || "–"}
            </p>
            <p className="text-[10px] text-on-surface-variant">Slag</p>
          </div>
        </div>
      </PremiumCard>

      {/* Hole info */}
      <PremiumCard padding="md" className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{hole.holeNumber}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">
              Hull {hole.holeNumber} av {holes.length}
            </p>
            <p className="text-xs text-on-surface-variant">
              Par {hole.par} • {hole.lengthMeter} m
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-on-surface-variant">Slag {nextShotNumber}</p>
          {lastSg !== null && (
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-xs font-bold tabular-nums",
                lastSg > 0 ? "text-success" : lastSg < 0 ? "text-danger" : "text-on-surface-variant"
              )}
            >
              SG {lastSg > 0 ? "+" : ""}{lastSg.toFixed(2)}
            </motion.span>
          )}
        </div>
      </PremiumCard>

      {/* Pause overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-card rounded-3xl p-8 text-center space-y-4 max-w-xs mx-4"
            >
              <Pause className="w-12 h-12 text-warning mx-auto" />
              <h2 className="text-xl font-bold text-on-surface">Runden er pauset</h2>
              <p className="text-sm text-on-surface-variant">
                Trykk Fortsett når du er klar til å spille videre.
              </p>
              <button
                onClick={handleTogglePause}
                className="w-full py-3.5 rounded-2xl bg-accent text-ink font-bold"
              >
                Fortsett
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shot form */}
      <PremiumCard padding="lg">
        <ShotForm
          clubs={clubs.length > 0 ? clubs : ["Driver", "Jern 7", "Pitching Wedge", "Putter"]}
          defaultFromLie={defaultFromLie}
          defaultFromDistance={Math.round(defaultFromDistance)}
          onSubmit={handleLogShot}
          isPending={isPending}
        />
      </PremiumCard>

      {/* Error */}
      {error && (
        <div className="text-sm text-danger bg-danger/10 rounded-xl p-3">
          {error}
        </div>
      )}

      {/* Shot list */}
      {shots.length > 0 && (
        <PremiumCard padding="lg">
          <ShotList shots={shots} />
        </PremiumCard>
      )}

      {/* Hull-navigator + Fullfør hull */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("prev")}
          disabled={currentHoleIdx === 0}
          className="flex items-center gap-1 px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface-variant font-medium disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Forrige</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCompleteHole}
          disabled={isPending}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all",
            currentHoleIdx === holes.length - 1
              ? "bg-success text-surface"
              : "bg-primary text-surface",
            "disabled:opacity-50"
          )}
        >
          {currentHoleIdx === holes.length - 1 ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Fullfør runde
            </>
          ) : (
            <>
              <Flag className="w-4 h-4" />
              Neste hull
            </>
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("next")}
          disabled={currentHoleIdx === holes.length - 1}
          className="flex items-center gap-1 px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface-variant font-medium disabled:opacity-40"
        >
          <span className="hidden sm:inline">Neste</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Hull-dots */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {holes.map((h, idx) => {
          const isCurrent = idx === currentHoleIdx;
          const hasShots = (shotsByHole[h.holeNumber] ?? []).length > 0;
          return (
            <button
              key={h.holeNumber}
              onClick={() => {
                setCurrentHoleIdx(idx);
                setLastSg(null);
              }}
              className={cn(
                "w-8 h-8 rounded-full text-xs font-semibold transition-all",
                isCurrent
                  ? "bg-accent text-ink shadow-lg shadow-accent/30"
                  : hasShots
                    ? "bg-on-surface text-surface"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
              )}
            >
              {h.holeNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}
