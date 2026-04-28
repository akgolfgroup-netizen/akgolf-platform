interface FocusHeroProps {
  eyebrow: string;
  title: string;
  lede: string;
  clock: string;
  clockSub: string;
}

export function FocusHero({
  eyebrow,
  title,
  lede,
  clock,
  clockSub,
}: FocusHeroProps) {
  return (
    <div
      className="mb-5 grid items-center gap-6 rounded-2xl border border-accent/20 px-7 py-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(209,248,67,0.10), rgba(209,248,67,0.02) 60%)",
        gridTemplateColumns: "1fr auto",
      }}
    >
      <div>
        <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
          {eyebrow}
        </div>
        <h1 className="mt-2 font-inter-tight text-[32px] font-bold leading-[1.15] tracking-[-0.025em] text-white">
          {title}
        </h1>
        <p className="mt-2 max-w-[520px] text-[14px] text-white/70">{lede}</p>
      </div>
      <div className="text-right">
        <div className="font-mono text-[48px] font-light leading-none tracking-[-0.04em] text-accent tabular-nums">
          {clock}
        </div>
        <div className="mt-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/50">
          {clockSub}
        </div>
      </div>
    </div>
  );
}
