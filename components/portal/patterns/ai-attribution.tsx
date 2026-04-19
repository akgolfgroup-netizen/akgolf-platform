/**
 * AIAttribution — Pattern P-05 (v3.1)
 *
 * Context-chips i AI-svar som viser hvilke datakilder som ble brukt.
 * Bygger tillit hos elite-brukere som ønsker å validere AI-anbefalinger.
 *
 * Brukes i AI Coach-meldinger, Statistikk AI-narrativ, Analyse-innsikter.
 *
 * Kilde: /tmp/ak-golf-design/screens/aicoach.html
 */

import { cn } from "@/lib/utils";
import { MonoLabel } from "./mono-label";
import {
  Flag,
  Zap,
  MessageSquare,
  Calendar,
  BookOpen,
  Activity,
  type LucideIcon,
} from "lucide-react";

export type AttributionSourceType =
  | "runde"
  | "trackman"
  | "coach-notat"
  | "booking"
  | "treningslogg"
  | "handicap";

export interface AttributionSource {
  type: AttributionSourceType;
  id: string;
  label: string;
  href?: string;
}

interface AIAttributionProps {
  sources: AttributionSource[];
  className?: string;
}

const SOURCE_ICONS: Record<AttributionSourceType, LucideIcon> = {
  runde: Flag,
  trackman: Zap,
  "coach-notat": MessageSquare,
  booking: Calendar,
  treningslogg: BookOpen,
  handicap: Activity,
};

const SOURCE_LABELS: Record<AttributionSourceType, string> = {
  runde: "Runde",
  trackman: "TrackMan",
  "coach-notat": "Coach",
  booking: "Booking",
  treningslogg: "Log",
  handicap: "HCP",
};

export function AIAttribution({ sources, className }: AIAttributionProps) {
  if (sources.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <MonoLabel size="xs" uppercase className="text-ai-text">
        Kilder
      </MonoLabel>
      {sources.map((source) => {
        const Icon = SOURCE_ICONS[source.type];
        const typeLabel = SOURCE_LABELS[source.type];
        const content = (
          <>
            <Icon className="w-3 h-3 shrink-0" />
            <MonoLabel size="xs" className="text-ai-text/80">
              {typeLabel}
            </MonoLabel>
            <span className="text-[11px] text-grey-600">{source.label}</span>
          </>
        );

        const baseClasses =
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ai-light border border-ai/20 transition-colors";

        if (source.href) {
          return (
            <a
              key={`${source.type}-${source.id}`}
              href={source.href}
              className={cn(baseClasses, "hover:bg-ai/10 cursor-pointer")}
            >
              {content}
            </a>
          );
        }

        return (
          <span key={`${source.type}-${source.id}`} className={baseClasses}>
            {content}
          </span>
        );
      })}
    </div>
  );
}
