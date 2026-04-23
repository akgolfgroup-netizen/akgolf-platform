"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { quickLogSession } from "@/app/portal/(dashboard)/dagbok/actions";
import { cn } from "@/lib/utils";

interface QuickLogCategory {
  key: string;
  label: string;
  icon: string;
  focusArea: string;
}

const CATEGORIES: QuickLogCategory[] = [
  { key: "putting", label: "Putting", icon: "trip_origin", focusArea: "PUTTING" },
  { key: "chipping", label: "Chipping", icon: "grain", focusArea: "CHIPPING" },
  { key: "pitching", label: "Pitching", icon: "arrow_upward", focusArea: "PITCHING" },
  { key: "jern", label: "Jern", icon: "straighten", focusArea: "IRON_PLAY" },
  { key: "driver", label: "Driver", icon: "expand", focusArea: "DRIVING" },
  { key: "annet", label: "Annet", icon: "more_horiz", focusArea: "OTHER" },
];

interface QuickLogGridProps {
  onLogged: (sessionId: string, focusAreaLabel: string) => void;
  onOpenDetails: (focusArea: string) => void;
}

export function QuickLogGrid({ onLogged, onOpenDetails }: QuickLogGridProps) {
  const [isPending, setIsPending] = useState<string | null>(null);
  const [lastLogged, setLastLogged] = useState<{ key: string; sessionId: string } | null>(null);
  const [, startTransition] = useTransition();

  const handleClick = (cat: QuickLogCategory) => {
    setIsPending(cat.key);
    startTransition(async () => {
      try {
        const result = await quickLogSession(cat.focusArea);
        if (result?.sessionId) {
          setLastLogged({ key: cat.key, sessionId: result.sessionId });
          onLogged(result.sessionId, cat.label);
        }
      } catch {
        // silent
      } finally {
        setIsPending(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORIES.map((cat, idx) => {
          const active = lastLogged?.key === cat.key;
          return (
            <motion.button
              key={cat.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              disabled={isPending === cat.key}
              onClick={() => handleClick(cat)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-center transition-all",
                active
                  ? "border-secondary-fixed bg-secondary-fixed/10"
                  : "border-outline-variant/30 bg-surface-container-lowest hover:border-outline-variant/60 hover:shadow-card"
              )}
            >
              {isPending === cat.key ? (
                <Icon
                  name="progress_activity"
                  className="w-8 h-8 text-on-surface-variant animate-spin"
                  size={32}
                />
              ) : (
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    active ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-surface-container text-on-surface-variant"
                  )}
                >
                  <Icon name={cat.icon} size={24} />
                </div>
              )}
              <span
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  active ? "text-on-surface" : "text-on-surface-variant"
                )}
              >
                {isPending === cat.key ? "Logger…" : cat.label}
              </span>

              {active && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-secondary-fixed flex items-center justify-center"
                >
                  <Icon name="check" size={14} className="text-on-secondary-fixed" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {lastLogged && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3"
        >
          <p className="text-sm text-on-surface-variant">
            <span className="font-medium text-on-surface">
              {CATEGORIES.find((c) => c.key === lastLogged.key)?.label}
            </span>{" "}
            logget
          </p>
          <button
            onClick={() => {
              const cat = CATEGORIES.find((c) => c.key === lastLogged.key);
              if (cat) onOpenDetails(cat.focusArea);
            }}
            className="text-sm font-medium text-secondary-fixed hover:underline"
          >
            Legg til detaljer &rarr;
          </button>
        </motion.div>
      )}
    </div>
  );
}
