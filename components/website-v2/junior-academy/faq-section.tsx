import { Plus } from "lucide-react";
import { JUNIOR_FAQ_V3 } from "@/lib/website-constants";

export function JuniorFaqSection() {
  const s = JUNIOR_FAQ_V3;
  return (
    <section
      className="px-10 py-[100px]"
      style={{ background: "var(--akgolf-surface, #ECF0EF)" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <div
            className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--akgolf-primary, #005840)",
            }}
          >
            {s.eyebrow}
          </div>
          <h2
            className="text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-[var(--akgolf-ink,#0A1F18)]"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            {s.heading}
          </h2>
        </div>
        <div className="mx-auto mt-15 flex max-w-[800px] flex-col gap-3">
          {s.items.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border bg-white px-7 py-6"
              style={{ borderColor: "var(--akgolf-line-light, #e0e8e5)" }}
            >
              <summary
                className="flex cursor-pointer items-center justify-between text-[17px] font-bold tracking-[-0.015em] text-[var(--akgolf-ink,#0A1F18)] [&::-webkit-details-marker]:hidden"
                style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
              >
                {item.q}
                <Plus
                  className="h-[18px] w-[18px] flex-shrink-0 transition-transform group-open:rotate-45"
                  style={{ color: "var(--akgolf-muted, #A5B2AD)" }}
                  strokeWidth={2}
                />
              </summary>
              <div className="mt-3 text-[15px] leading-[1.55] text-[var(--akgolf-text,#324D45)] text-pretty">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
