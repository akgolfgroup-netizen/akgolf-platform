"use client";

export function ContactHero() {
  return (
    <section
      className="px-10 pb-[30px] pt-[180px]"
      style={{ background: "var(--akgolf-surface, #F4F6F4)" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div
          className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            color: "var(--akgolf-primary, #005840)",
          }}
        >
          Kontakt
        </div>
        <h1
          className="mb-[22px] max-w-[18ch] text-[clamp(56px,6.6vw,92px)] font-extrabold leading-[0.96] tracking-[-0.04em] text-balance"
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            color: "var(--akgolf-ink, #0A1F18)",
          }}
        >
          Vi svarer{" "}
          <em
            className="font-medium not-italic"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontStyle: "italic",
              color: "var(--akgolf-primary, #005840)",
              letterSpacing: "-0.025em",
            }}
          >
            samme dag.
          </em>
        </h1>
        <p
          className="m-0 max-w-[56ch] text-[19px] leading-[1.6]"
          style={{ color: "var(--akgolf-text, #324D45)" }}
        >
          Skriv til oss på e-post, ring direkte, eller fyll ut skjemaet under.
          Vi har ingen call-center — det er folk fra teamet som leser hver
          melding personlig.
        </p>
      </div>
    </section>
  );
}
