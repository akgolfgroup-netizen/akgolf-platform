"use client";

import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface HoleNavigatorProps {
  currentHole: number;
  totalHoles: number;
  completedHoles: number[];
  onNavigate: (direction: "prev" | "next") => void;
  onJumpToHole: (holeIndex: number) => void;
  className?: string;
}

export function HoleNavigator({
  currentHole,
  totalHoles,
  completedHoles,
  onNavigate,
  onJumpToHole,
  className,
}: HoleNavigatorProps) {
  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      onNavigate("prev");
    } else if (e.key === "ArrowRight") {
      onNavigate("next");
    }
  }, [onNavigate]);

  // Swipe handling
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          onNavigate("next");
        } else {
          onNavigate("prev");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleKeyDown, onNavigate]);

  const holes = Array.from({ length: totalHoles }, (_, i) => i + 1);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Navigation controls */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate("prev")}
          disabled={currentHole === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-grey-200 text-grey-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-grey-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Forrige</span>
        </motion.button>

        <div className="text-center">
          <p className="text-xs text-grey-400 uppercase tracking-wide">Hull</p>
          <p className="text-2xl font-bold text-black">
            {currentHole + 1} <span className="text-grey-300">/ {totalHoles}</span>
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate("next")}
          disabled={currentHole === totalHoles - 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-grey-200 text-grey-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-grey-300 transition-colors"
        >
          <span className="hidden sm:inline">Neste</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Hole dots */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {holes.map((holeNum, idx) => {
          const isCurrent = idx === currentHole;
          const isCompleted = completedHoles.includes(holeNum);
          const isPar3 = holeNum === 3 || holeNum === 6 || holeNum === 9 || 
                         holeNum === 12 || holeNum === 15 || holeNum === 18;

          return (
            <motion.button
              key={holeNum}
              onClick={() => onJumpToHole(idx)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative w-8 h-8 rounded-full text-xs font-semibold transition-all",
                isCurrent
                  ? "bg-accent-cta text-black shadow-lg shadow-accent-cta/30"
                  : isCompleted
                    ? "bg-black text-white"
                    : "bg-grey-100 text-grey-400 hover:bg-grey-200"
              )}
            >
              {holeNum}
              
              {/* Par 3 indicator */}
              {isPar3 && !isCurrent && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-400 rounded-full" />
              )}
              
              {/* Completion indicator */}
              {isCompleted && !isCurrent && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Swipe hint (mobile) */}
      <p className="text-xs text-grey-300 text-center sm:hidden">
        Sveip for å navigere ← →
      </p>

      {/* Keyboard hint (desktop) */}
      <p className="text-xs text-grey-300 text-center hidden sm:block">
        Bruk piltastene ← → for å navigere
      </p>
    </div>
  );
}
