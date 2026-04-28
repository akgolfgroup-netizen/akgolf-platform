import type { HubActivity } from "./types";

const TONE_BG: Record<HubActivity["tone"], string> = {
  default: "bg-white/[0.05]",
  green: "bg-[rgba(42,125,90,0.30)]",
  amber: "bg-[rgba(232,185,103,0.20)]",
  purple: "bg-[rgba(175,82,222,0.18)]",
};

const TONE_FG: Record<HubActivity["tone"], string> = {
  default: "text-white/70",
  green: "text-[#6FCBA1]",
  amber: "text-[#E8B967]",
  purple: "text-[#C99CF3]",
};

export function ActivityPanel({ activity }: { activity: HubActivity[] }) {
  return (
    <section className="rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23] px-6 py-[22px]">
      <h3 className="m-0 mb-3.5 flex items-center justify-between text-[15px] font-bold text-white">
        Aktivitet · siste 24 timer
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          SE ALLE
        </span>
      </h3>

      <ul>
        {activity.map((row, idx) => {
          const Icon = row.icon;
          return (
            <li
              key={row.id}
              className={`grid grid-cols-[28px_1fr_auto] items-center gap-3 py-[11px] ${
                idx > 0 ? "border-t border-white/[0.04]" : ""
              }`}
            >
              <div
                className={`grid h-7 w-7 place-items-center rounded-md ${TONE_BG[row.tone]}`}
              >
                <Icon
                  className={`h-[13px] w-[13px] ${TONE_FG[row.tone]}`}
                  strokeWidth={1.8}
                />
              </div>
              <div className="text-[13px] leading-[1.45] text-white/85">
                <strong className="font-bold text-white">
                  {row.emphasis}
                </strong>{" "}
                {row.body}
              </div>
              <span className="font-mono text-[10px] tracking-[0.06em] text-white/50">
                {row.when}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
