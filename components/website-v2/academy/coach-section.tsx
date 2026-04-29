import { WebPhoto } from "../web-photo";
import { ACADEMY_COACH_V3 } from "@/lib/website-constants";

export function AcademyCoachSection() {
  const s = ACADEMY_COACH_V3;
  return (
    <section
      className="px-10 py-[100px] text-white"
      style={{ background: "var(--akgolf-ink, #0A1F18)" }}
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-15 md:grid-cols-[1fr_1.4fr]">
        <WebPhoto
          ratio="3-4"
          variant="default"
          src={s.portraitSrc}
          description={s.portraitDescription}
          tag="[Portrett]"
        />
        <div>
          <div
            className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--akgolf-accent, #D1F843)",
            }}
          >
            {s.eyebrow}
          </div>
          <h2
            className="mb-6 text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-white"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            {s.headingLead}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-accent, #D1F843)",
              }}
            >
              {s.headingItalic}
            </em>
          </h2>
          <p className="mb-7 max-w-[52ch] text-[19px] leading-[1.55] text-white/85 text-pretty">
            {s.description}
          </p>
          {s.credits.length > 0 ? (
            <div
              className="grid grid-cols-3 gap-6 border-t pt-8"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            >
              {s.credits.map((c) => (
                <div key={c.l} className="flex flex-col gap-1">
                  <div
                    className="text-[24px] font-extrabold tracking-[-0.02em] text-white"
                    style={{
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                    }}
                  >
                    {c.v}
                  </div>
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {c.l}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
