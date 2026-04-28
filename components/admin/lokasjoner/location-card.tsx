import type { LocationCard as LocationCardType, LocationKind } from "./mock-data";

const PHOTO_BG =
  "linear-gradient(135deg, rgba(209,248,67,0.10), rgba(13,46,35,0.0)), " +
  "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 14px, rgba(255,255,255,0.04) 14px 28px), " +
  "#0D2E23";

const KIND_BADGE: Record<
  LocationKind,
  { label: string; bg: string; color: string; border: string }
> = {
  PRIMAER: {
    label: "PRIMÆR",
    bg: "rgba(209,248,67,0.20)",
    color: "#D1F843",
    border: "rgba(209,248,67,0.30)",
  },
  PARTNER: {
    label: "PARTNER",
    bg: "rgba(107,177,255,0.18)",
    color: "#6BB1FF",
    border: "rgba(107,177,255,0.25)",
  },
  INDOOR: {
    label: "INDOOR",
    bg: "rgba(175,82,222,0.18)",
    color: "#C99CF3",
    border: "rgba(175,82,222,0.25)",
  },
};

export function LocationCard({ loc }: { loc: LocationCardType }) {
  const badge = KIND_BADGE[loc.kind];

  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D2E23]">
      <div
        className="relative grid place-items-center border-b border-white/[0.06] font-mono text-[11px] uppercase tracking-[0.10em] text-white/35"
        style={{ aspectRatio: "16 / 8", background: PHOTO_BG }}
      >
        <span
          className="absolute left-3.5 top-3.5 rounded-[5px] border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
          style={{
            background: badge.bg,
            color: badge.color,
            borderColor: badge.border,
          }}
        >
          {badge.label}
        </span>
        {loc.photoLabel}
      </div>

      <div className="px-[22px] py-[18px]">
        <h3 className="m-0 font-inter-tight text-[18px] font-bold tracking-tight text-white">
          {loc.name}
        </h3>
        <div className="mt-1 font-mono text-[10.5px] tracking-[0.06em] text-white/55">
          {loc.address}
        </div>
        <p className="my-2.5 mb-3.5 text-[13px] leading-[1.55] text-white/70">
          {loc.description}
        </p>

        <div className="mb-3.5 flex flex-wrap gap-1.5">
          {loc.features.map((f) => (
            <span
              key={f}
              className="rounded-[5px] border border-white/[0.06] bg-white/[0.05] px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.10em] text-white/70"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5 border-t border-white/[0.06] pt-3.5">
          {loc.bottom.map((s) => (
            <div key={s.label} className="font-mono">
              <div className="text-[9px] uppercase tracking-[0.10em] text-white/50">
                {s.label}
              </div>
              <div className="mt-0.5 text-[14px] font-bold text-white">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
