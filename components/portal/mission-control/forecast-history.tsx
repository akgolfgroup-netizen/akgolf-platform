"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import type { ForecastDisplayData } from "./forecast-display";

interface ForecastHistoryProps {
  forecasts: ForecastDisplayData[];
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function ForecastHistory({ forecasts }: ForecastHistoryProps) {
  if (forecasts.length === 0) {
    return (
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 text-center"
      >
        <Icon name="history" className="w-8 h-8 text-on-surface-variant/60 mx-auto mb-2" />
        <p className="text-sm text-on-surface-variant">Ingen forecasts ennå</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={item}
      initial="hidden"
      animate="show"
      className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon name="history" className="w-4 h-4 text-primary" />
        <p className="text-sm font-semibold text-on-surface">Historikk</p>
        <span className="text-xs text-on-surface-variant ml-auto">Siste {forecasts.length}</span>
      </div>

      <div className="space-y-3">
        {forecasts.map((fc) => {
          const probPct = Math.round(fc.probabilityOfSuccess * 100);
          const hasBacktest = fc.withinCi95 !== null && fc.withinCi95 !== undefined;

          return (
            <div
              key={fc.id}
              className="flex items-center justify-between p-3 rounded-lg bg-surface border border-outline-variant/20"
            >
              <div>
                <p className="text-sm font-medium text-on-surface">
                  Mål {fc.targetScoreAvg.toFixed(1)} · {format(new Date(fc.deadline), "d. MMM yyyy", { locale: nb })}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Generert {format(new Date(fc.generatedAt), "d. MMM yyyy", { locale: nb })} · {Math.round(fc.estimatedTotalHours)} t estimert
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    probPct >= 70 ? "success" : probPct >= 40 ? "warning" : "error"
                  }
                >
                  {probPct}%
                </Badge>
                {hasBacktest && (
                  <Badge variant={fc.withinCi95 ? "success" : "error"}>
                    {fc.withinCi95 ? (
                      <span className="flex items-center gap-1">
                        <Icon name="check_circle" className="w-3 h-3" />
                        Traff CI
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Icon name="cancel" className="w-3 h-3" />
                        Utenfor CI
                      </span>
                    )}
                  </Badge>
                )}
                {fc.predictionErrorSg !== null && fc.predictionErrorSg !== undefined && (
                  <span className="text-xs text-on-surface-variant tabular-nums">
                    Feil {fc.predictionErrorSg > 0 ? "+" : ""}
                    {fc.predictionErrorSg.toFixed(2)} SG
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
