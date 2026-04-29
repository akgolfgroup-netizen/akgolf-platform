import type { MapPin } from "./mock-data";

const PIN_COLORS: Record<MapPin["variant"], { dot: string; ring: string; glow: string }> = {
  primaer: {
    dot: "#D1F843",
    ring: "rgba(209,248,67,0.20)",
    glow: "0 0 20px rgba(209,248,67,0.40)",
  },
  partner: {
    dot: "#6BB1FF",
    ring: "rgba(107,177,255,0.20)",
    glow: "0 0 18px rgba(107,177,255,0.40)",
  },
  indoor: {
    dot: "#C99CF3",
    ring: "rgba(175,82,222,0.20)",
    glow: "none",
  },
};

const MAP_BG =
  "radial-gradient(circle at 30% 60%, rgba(209,248,67,0.06), transparent 40%), " +
  "radial-gradient(circle at 70% 35%, rgba(107,177,255,0.06), transparent 40%), " +
  "repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 80px), " +
  "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 80px), #0A1F18";

export function LocationsMap({ pins }: { pins: MapPin[] }) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D2E23]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <h3 className="m-0 text-[14px] font-bold tracking-tight text-white">
          Kart · Oslo &amp; Akershus
        </h3>
        <div className="font-mono text-[10px] uppercase tracking-[0.10em] text-white/50">
          {pins.length} LOKASJONER · KLIKK PIN FOR DETALJ
        </div>
      </div>

      <div className="relative h-[360px]" style={{ background: MAP_BG }}>
        {pins.map((pin) => {
          const color = PIN_COLORS[pin.variant];
          return (
            <div
              key={pin.id}
              className="absolute cursor-pointer"
              style={{
                top: pin.top,
                left: pin.left,
                width: 36,
                height: 36,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div
                className="mx-auto rounded-full"
                style={{
                  width: 14,
                  height: 14,
                  background: color.dot,
                  boxShadow: `0 0 0 4px ${color.ring}, ${color.glow}`,
                }}
              />
              <div
                className="absolute whitespace-nowrap rounded-md border border-white/15 bg-black/70 px-2 py-1 text-[11px] font-semibold text-white"
                style={{ left: 22, top: -6 }}
              >
                {pin.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-[18px] border-t border-white/[0.06] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.10em] text-white/55">
        <div className="flex items-center gap-1.5">
          <span
            className="block h-2 w-2 rounded-full"
            style={{ background: "#D1F843" }}
          />
          Primær (3)
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="block h-2 w-2 rounded-full"
            style={{ background: "#C99CF3" }}
          />
          Indoor (1)
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="block h-2 w-2 rounded-full"
            style={{ background: "#6BB1FF" }}
          />
          Partnerklubb (2)
        </div>
      </div>
    </section>
  );
}
