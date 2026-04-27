import { UTVIKLING_COMPARE_V2 } from "@/lib/website-constants";

const c = UTVIKLING_COMPARE_V2;

const INK = "var(--akgolf-ink, #0A1F18)";
const PRIMARY = "var(--akgolf-primary, #005840)";
const TEXT = "var(--akgolf-text, #324D45)";
const MUTED = "var(--akgolf-muted, #A5B2AD)";

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
};

const FRAUNCES_INLINE: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), Georgia, serif",
  fontStyle: "italic",
  color: PRIMARY,
};

export function UtviklingCompareSection() {
  return (
    <section
      className="px-10 py-22.5"
      style={{
        background:
          "linear-gradient(180deg, transparent, rgba(0,88,64,0.04))",
        borderTop: "1px solid rgba(10,31,24,0.08)",
      }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-[680px] text-center">
          <div
            className="mb-[22px] inline-flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ ...MONO, color: PRIMARY }}
          >
            <span
              className="block h-px w-[34px]"
              style={{ background: PRIMARY }}
            />
            {c.label}
          </div>
          <h2
            className="m-0 text-[clamp(32px,4vw,42px)] font-extrabold leading-[1.05] tracking-[-0.03em]"
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: INK,
            }}
          >
            {c.headingStart}{" "}
            <em className="font-medium not-italic" style={FRAUNCES_INLINE}>
              {c.headingEm}
            </em>
          </h2>
        </div>

        <div
          className="mt-9 overflow-hidden rounded-[18px] bg-white"
          style={{ border: "1px solid rgba(10,31,24,0.10)" }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th
                  className="px-[26px] py-[18px] text-left align-top text-[10.5px] font-bold uppercase tracking-[0.14em] text-white"
                  style={{ ...MONO, background: INK }}
                />
                <th
                  className="px-[26px] py-[18px] text-left align-top text-[10.5px] font-bold uppercase tracking-[0.14em] text-white"
                  style={{ ...MONO, background: INK }}
                >
                  VANLIG PRO-TIME
                </th>
                <th
                  className="px-[26px] py-[18px] text-left align-top text-[10.5px] font-bold uppercase tracking-[0.14em] text-white"
                  style={{ ...MONO, background: PRIMARY }}
                >
                  AK GOLF AKADEMI
                </th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((row, i) => (
                <tr
                  key={row.row}
                  style={{
                    borderTop:
                      i === 0 ? undefined : "1px solid rgba(10,31,24,0.08)",
                  }}
                >
                  <td
                    className="w-[24%] px-[26px] py-[18px] align-top text-[13.5px] font-bold"
                    style={{ color: INK }}
                  >
                    {row.row}
                  </td>
                  <td
                    className="px-[26px] py-[18px] align-top text-[14px]"
                    style={{ color: MUTED }}
                  >
                    {row.them}
                  </td>
                  <td
                    className="px-[26px] py-[18px] align-top text-[14px] font-semibold"
                    style={{
                      background: "rgba(0,88,64,0.04)",
                      color: INK,
                    }}
                  >
                    {row.emphasized ? (
                      <strong style={{ color: PRIMARY }}>{row.us}</strong>
                    ) : (
                      row.us
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
