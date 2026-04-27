import { UTVIKLING_HERO_V2 } from "@/lib/website-constants";

const h = UTVIKLING_HERO_V2;

export function UtviklingHeroSection() {
  return (
    <section
      className="relative px-10 pb-15 pt-[150px]"
      style={{ background: "var(--akgolf-surface, #ECF0EF)" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div
          className="mb-[22px] inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em]"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            color: "var(--akgolf-primary, #005840)",
          }}
        >
          <span
            className="block h-px w-[34px]"
            style={{ background: "var(--akgolf-primary, #005840)" }}
          />
          {h.label}
        </div>

        <h1
          className="mb-7 max-w-[16ch] text-[clamp(56px,7vw,108px)] font-extrabold leading-[0.94] tracking-[-0.045em] text-[var(--akgolf-ink,#0A1F18)]"
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          {h.headingStart}{" "}
          <em
            className="block font-medium not-italic"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontStyle: "italic",
              color: "var(--akgolf-primary, #005840)",
              letterSpacing: "-0.03em",
            }}
          >
            {h.headingEm}
          </em>
        </h1>

        <p
          className="mb-10 max-w-[56ch] text-[21px] leading-[1.55] text-[var(--akgolf-text,#324D45)]"
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          {h.description}
        </p>

        <div
          className="relative mt-[30px] overflow-hidden rounded-3xl"
          style={{
            aspectRatio: "21 / 9",
            background:
              "linear-gradient(135deg, var(--akgolf-primary, #005840), #0A1F18)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 16px, rgba(255,255,255,0) 16px 32px)",
            }}
          />
          <span
            className="absolute left-[60px] top-[30%] max-w-[18ch] text-[clamp(28px,3.4vw,42px)] font-medium leading-[1.2] text-white"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontStyle: "italic",
              letterSpacing: "-0.02em",
            }}
          >
            {h.bannerQuote}
          </span>
          <span
            className="absolute bottom-6 left-[30px] text-[11px] font-medium tracking-[0.14em] text-white/70"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            {h.bannerLab}
          </span>
        </div>
      </div>
    </section>
  );
}
