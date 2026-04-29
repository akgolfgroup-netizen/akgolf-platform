import { Settings2 } from "lucide-react";

interface Props {
  blurb: string;
}

export function AutomationCard({ blurb }: Props) {
  // Splitt "~14 godkjenninger" til accent
  const before = blurb.split("~14 godkjenninger")[0] ?? "";
  const after = blurb.split("~14 godkjenninger")[1] ?? "";

  return (
    <div
      className="mt-[18px] grid items-center gap-5 rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] px-5 py-[18px]"
      style={{ gridTemplateColumns: "1fr auto" }}
    >
      <div>
        <h3 className="m-0 text-[13px] font-semibold text-white">
          Automatiseringsregler aktive
        </h3>
        <p className="mt-1.5 text-[12px] leading-[1.6] text-white/65">
          {before}
          <strong className="text-accent">~14 godkjenninger</strong>
          {after}
        </p>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] text-white/85 transition hover:bg-white/10"
      >
        <Settings2 className="h-3.5 w-3.5" strokeWidth={1.8} /> Endre regler
      </button>
    </div>
  );
}
