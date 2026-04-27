import type { DagensFokusSignal, SignalKind } from "./mock-data";
import { DAGENS_FOKUS_ICON_MAP } from "./icon-map";

const KIND_STYLES: Record<
  SignalKind,
  { card: string; corner: string; icon: string; primaryBtn: string }
> = {
  urgent: {
    card: "border-[rgba(184,66,51,0.30)] bg-[rgba(184,66,51,0.10)]",
    corner: "text-[#F49283]",
    icon: "text-[#F49283]",
    primaryBtn:
      "border border-white/10 bg-white/5 text-white/90 hover:bg-white/10",
  },
  attention: {
    card: "border-[rgba(196,138,50,0.30)] bg-[rgba(196,138,50,0.10)]",
    corner: "text-[#E8B967]",
    icon: "text-[#E8B967]",
    primaryBtn:
      "border border-white/10 bg-white/5 text-white/90 hover:bg-white/10",
  },
  opportunity: {
    card: "border-[rgba(209,248,67,0.30)] bg-[rgba(209,248,67,0.16)] shadow-[0_0_24px_rgba(209,248,67,0.20)]",
    corner: "text-accent",
    icon: "text-accent",
    primaryBtn:
      "border border-accent bg-accent text-ink hover:bg-[#C7EE3F]",
  },
};

function SignalCard({ signal }: { signal: DagensFokusSignal }) {
  const styles = KIND_STYLES[signal.kind];
  const Icon = DAGENS_FOKUS_ICON_MAP[signal.iconName];
  const PrimaryIcon = DAGENS_FOKUS_ICON_MAP[signal.primaryAction.iconName];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-[18px] ${styles.card}`}
    >
      <span
        className={`absolute right-3.5 top-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] ${styles.corner}`}
      >
        {signal.cornerLabel}
      </span>
      {Icon ? <Icon className={`h-[22px] w-[22px] ${styles.icon}`} strokeWidth={1.8} /> : null}
      <div className="mt-6 text-[36px] font-bold leading-none tracking-[-0.03em] text-white">
        {signal.count}{" "}
        <small className="text-[14px] font-medium text-white/45">
          {signal.unit}
        </small>
      </div>
      <p className="mt-2.5 text-[13px] leading-snug text-white/70">
        {signal.description}
      </p>
      <div className="mt-3.5 flex gap-2">
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${styles.primaryBtn}`}
        >
          {PrimaryIcon ? <PrimaryIcon className="h-3 w-3" strokeWidth={1.8} /> : null}
          {signal.primaryAction.label}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-white/80 transition hover:bg-white/5"
        >
          {signal.secondaryAction.label} →
        </button>
      </div>
    </div>
  );
}

export function SignalsGrid({ signals }: { signals: DagensFokusSignal[] }) {
  return (
    <div className="mb-[18px] grid grid-cols-3 gap-3.5">
      {signals.map((signal) => (
        <SignalCard key={signal.kind} signal={signal} />
      ))}
    </div>
  );
}
