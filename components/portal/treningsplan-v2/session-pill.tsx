/**
 * Fargekodet pill for én økt i ukestripen (a5).
 *
 * Pixel-nær a5-treningsplan.html `.session-pill.{putt|iron|short|driver|round|coach}`.
 */

import { cn } from "@/lib/portal/utils/cn";
import { pillLabel, type SessionPillKind } from "./types";

const PILL_STYLES: Record<SessionPillKind, string> = {
  putt: "bg-[rgba(118,193,156,0.20)] text-[#6FCBA1]",
  iron: "bg-[rgba(126,158,255,0.22)] text-[#8AA8FF]",
  short: "bg-[rgba(232,185,103,0.20)] text-[#E8B967]",
  driver: "bg-[rgba(244,146,131,0.20)] text-[#F49283]",
  round: "bg-[rgba(209,248,67,0.18)] text-[#D1F843]",
  coach: "bg-[rgba(209,248,67,0.10)] text-white/70",
};

export function SessionPill({
  kind,
  durationMinutes,
  label,
  className,
}: {
  kind: SessionPillKind;
  durationMinutes?: number;
  /** Overstyrer auto-label hvis angitt (f.eks. "Range 30m"). */
  label?: string;
  className?: string;
}) {
  const text =
    label ??
    (durationMinutes != null
      ? `${pillLabel(kind)} ${durationMinutes}m`
      : pillLabel(kind));

  return (
    <span
      className={cn(
        "block w-full rounded-md px-1.5 py-1",
        "font-mono text-[9px] font-semibold uppercase tracking-[0.04em]",
        PILL_STYLES[kind],
        className,
      )}
    >
      {text}
    </span>
  );
}
