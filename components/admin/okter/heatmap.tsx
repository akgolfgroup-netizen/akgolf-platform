import type { CoachHeatRow } from "@/app/admin/(authed)/okter/okter-data";

type Props = {
  rows: CoachHeatRow[];
};

function levelClass(n: number): string {
  if (n === 0) return "";
  if (n <= 1) return "bg-[rgba(209,248,67,0.20)]";
  if (n <= 2) return "bg-[rgba(209,248,67,0.40)]";
  if (n <= 3) return "bg-[rgba(209,248,67,0.65)]";
  return "bg-[#D1F843]";
}

export function OkterHeatmap({ rows }: Props) {
  return (
    <div
      className="rounded-[14px] border bg-white/[0.04] p-[18px]"
      style={{ borderColor: "rgba(255,255,255,0.10)" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3
            className="text-[14px] font-semibold text-white"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            Aktivitet · 4 uker
          </h3>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
            Per coach
          </div>
        </div>
        <div className="flex items-center gap-2.5 font-mono text-[11px] text-white/50">
          MINDRE
          <span className="inline-flex gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-white/[0.04]" />
            <span className="h-2.5 w-2.5 rounded-sm bg-[rgba(209,248,67,0.20)]" />
            <span className="h-2.5 w-2.5 rounded-sm bg-[rgba(209,248,67,0.40)]" />
            <span className="h-2.5 w-2.5 rounded-sm bg-[rgba(209,248,67,0.65)]" />
            <span className="h-2.5 w-2.5 rounded-sm bg-[#D1F843]" />
          </span>
          MER
        </div>
      </div>

      {rows.length === 0 && (
        <div className="py-4 text-center text-[12px] text-white/50">
          Ingen aktivitet siste 4 uker.
        </div>
      )}

      {rows.map((row) => (
        <div
          key={row.name}
          className="grid items-center gap-[3px] py-1.5"
          style={{ gridTemplateColumns: "80px repeat(28, 1fr)" }}
        >
          <div className="text-[11px] text-white/70">{row.name}</div>
          {row.cells.map((n, i) => (
            <div
              key={i}
              className={"aspect-square rounded-sm " + (n === 0 ? "bg-white/[0.04]" : levelClass(n))}
              title={`${n} økter`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
