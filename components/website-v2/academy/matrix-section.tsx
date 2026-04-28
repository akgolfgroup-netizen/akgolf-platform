import { Check, X } from "lucide-react";
import { ACADEMY_MATRIX_V3 } from "@/lib/website-constants";

export function AcademyMatrixSection() {
  const s = ACADEMY_MATRIX_V3;
  return (
    <section
      id="sammenlign"
      className="px-10 py-[100px]"
      style={{ background: "var(--akgolf-surface, #ECF0EF)" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-15 text-center">
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
            className="mx-auto max-w-[22ch] text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            {s.headingLead}{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              {s.headingItalic}
            </em>
            {s.headingTrail}
          </h2>
        </div>

        <div
          className="overflow-hidden rounded-[24px] border bg-white"
          style={{ borderColor: "var(--akgolf-line-light, #e0e8e5)" }}
        >
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
              background: "rgba(0,88,64,0.04)",
              borderBottom: "1px solid var(--akgolf-line-light, #e0e8e5)",
            }}
          >
            <div
              className="px-6 py-[18px] text-[11px] font-bold uppercase tracking-[0.14em]"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              Funksjon
            </div>
            {s.columns.map((c) => (
              <div
                key={c}
                className="px-6 py-[18px] text-center text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "var(--akgolf-primary, #005840)",
                  borderLeft: "1px solid var(--akgolf-line-light, #e0e8e5)",
                }}
              >
                {c}
              </div>
            ))}
          </div>

          {s.rows.map((row, i) => (
            <div
              key={row.feature}
              className="grid items-center"
              style={{
                gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
                borderBottom:
                  i === s.rows.length - 1
                    ? "none"
                    : "1px solid var(--akgolf-line-light, #e0e8e5)",
              }}
            >
              <div className="px-6 py-[18px]">
                <div
                  className="text-[14px] font-semibold text-[var(--akgolf-ink,#0A1F18)]"
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  {row.feature}
                </div>
                <div
                  className="mt-0.5 text-[12px] font-normal text-[var(--akgolf-muted,#A5B2AD)]"
                >
                  {row.sub}
                </div>
              </div>
              {row.values.map((v, vi) => (
                <div
                  key={vi}
                  className="flex items-center justify-center px-6 py-[18px] text-center text-[14px] font-medium text-[var(--akgolf-text,#324D45)]"
                  style={{
                    borderLeft: "1px solid var(--akgolf-line-light, #e0e8e5)",
                  }}
                >
                  {v.kind === "yes" ? (
                    <Check
                      className="h-[18px] w-[18px]"
                      style={{ color: "var(--akgolf-primary, #005840)" }}
                      strokeWidth={2.4}
                    />
                  ) : v.kind === "no" ? (
                    <X
                      className="h-[18px] w-[18px]"
                      style={{ color: "rgba(10,31,24,0.20)" }}
                      strokeWidth={2.4}
                    />
                  ) : (
                    v.text
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
