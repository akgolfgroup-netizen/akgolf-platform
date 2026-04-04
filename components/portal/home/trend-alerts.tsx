"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, AlertOctagon, X } from "lucide-react";

export interface TrendAlert {
  type: string;
  severity: "warning" | "critical";
  message: string;
}

const severityStyles = {
  warning:
    "bg-amber-50 border-amber-200 text-amber-800",
  critical:
    "bg-[#D14343]/5 border-red-200 text-red-800",
};

interface TrendAlertsProps {
  alerts: TrendAlert[];
}

export function TrendAlerts({ alerts }: TrendAlertsProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = alerts.filter((a) => !dismissed.includes(a.type));

  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {visible.slice(0, 3).map((alert) => (
          <motion.div
            key={alert.type}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`flex items-center gap-3 p-3 rounded-lg border ${severityStyles[alert.severity]}`}
          >
            {alert.severity === "critical" ? (
              <AlertOctagon className="h-5 w-5 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0" />
            )}
            <span className="flex-1 text-sm font-medium">{alert.message}</span>
            <button
              onClick={() => setDismissed([...dismissed, alert.type])}
              className="p-1 hover:bg-black/5 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
