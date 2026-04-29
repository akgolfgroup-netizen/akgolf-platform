import type { CalendarBlock as Block, CoachKey } from "./mock-data";

const COACH_STYLES: Record<CoachKey, { bg: string; border: string; color?: string; shadow?: string }> = {
  anders: { bg: "rgba(0,122,255,0.20)", border: "#6FB3FF" },
  maria: { bg: "rgba(175,82,222,0.20)", border: "#C896E8" },
  erik: { bg: "rgba(196,138,50,0.20)", border: "#E8B967" },
  lisa: { bg: "rgba(42,125,90,0.22)", border: "#6FCBA1" },
  live: {
    bg: "rgba(209,248,67,0.18)",
    border: "#D1F843",
    shadow: "0 0 0 1px rgba(209,248,67,0.30), 0 0 12px rgba(209,248,67,0.20)",
  },
  gym: { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.20)", color: "rgba(255,255,255,0.6)" },
};

export function CalendarBlock({ block }: { block: Block }) {
  const style = COACH_STYLES[block.coach];
  const boxShadow = block.highlight
    ? "0 0 0 2px #D1F843"
    : style.shadow ?? "0 1px 0 rgba(0,0,0,0.2)";
  const opacity = block.pending ? 0.55 : 1;

  return (
    <div
      className="absolute left-[3px] right-[3px] cursor-grab overflow-hidden rounded-md border-l-[3px] px-2 py-1.5 text-[11px] leading-snug"
      style={{
        top: block.topPx,
        height: block.heightPx,
        background: style.bg,
        borderLeftColor: style.border,
        borderStyle: block.pending ? "dashed" : undefined,
        color: style.color ?? "#fff",
        boxShadow,
        opacity,
        zIndex: 2,
      }}
    >
      <div className="font-semibold text-white">{block.who}</div>
      {block.what && (
        <div className="mt-px text-[10px] text-white/85">{block.what}</div>
      )}
      {block.when && (
        <div className="mt-0.5 font-mono text-[9px] tracking-wider text-white/70">
          {block.when}
        </div>
      )}
    </div>
  );
}
