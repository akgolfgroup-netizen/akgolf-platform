import { cn } from "@/lib/portal/utils/cn";
import type { AkTagKind } from "./types";

const TAG_STYLES: Record<AkTagKind, string> = {
  tech: "bg-[rgba(126,158,255,0.18)] text-[#8AA8FF]",
  skill: "bg-[rgba(118,193,156,0.18)] text-[#6FCBA1]",
  score: "bg-[rgba(232,185,103,0.18)] text-[#E8B967]",
  mental: "bg-[rgba(200,150,232,0.18)] text-[#C896E8]",
  fysisk: "bg-[rgba(244,146,131,0.18)] text-[#F49283]",
};

const LABELS: Record<AkTagKind, string> = {
  tech: "Teknikk",
  skill: "Skill",
  score: "Score",
  mental: "Mental",
  fysisk: "Fysisk",
};

export function AkTag({
  kind,
  label,
  className,
}: {
  kind: AkTagKind;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
        "font-mono text-[9px] font-bold uppercase tracking-[0.08em]",
        TAG_STYLES[kind],
        className,
      )}
    >
      {label ?? LABELS[kind]}
    </span>
  );
}
