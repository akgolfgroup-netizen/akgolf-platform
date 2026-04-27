import type { HubStat } from "./types";

type HubHeroProps = {
  label: string;
  greeting: string;
  greetingAccent: string;
  body: string;
  stats: HubStat[];
};

export function HubHero({
  label,
  greeting,
  greetingAccent,
  body,
  stats,
}: HubHeroProps) {
  return (
    <section
      className="mb-6 grid gap-7 rounded-[20px] border border-[rgba(209,248,67,0.25)] p-7 md:grid-cols-[1.4fr_1fr] md:items-center md:p-8"
      style={{
        background:
          "linear-gradient(160deg, rgba(209,248,67,0.08), rgba(13,46,35,0.0)), #0D2E23",
      }}
    >
      <div>
        <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-accent">
          {label}
        </div>
        <h2 className="mt-1.5 font-inter-tight text-[30px] font-extrabold tracking-[-0.025em] text-white">
          {greeting}{" "}
          <span className="not-italic text-accent">{greetingAccent}</span>
        </h2>
        <p className="mt-3.5 max-w-[55ch] text-[14px] leading-[1.6] text-white/70">
          {body}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-black/20 px-4 py-3.5"
          >
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
              {stat.label}
            </div>
            <div className="mt-1.5 text-[22px] font-extrabold leading-none tracking-[-0.02em] text-white tabular-nums">
              {stat.value}
              {stat.unit ? (
                <small className="ml-[3px] text-[12px] font-medium text-white/50">
                  {stat.unit}
                </small>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
