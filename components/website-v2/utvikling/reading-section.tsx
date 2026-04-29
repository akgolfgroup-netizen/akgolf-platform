import { Fragment } from "react";
import { UTVIKLING_READING_V2 } from "@/lib/website-constants";

const r = UTVIKLING_READING_V2;

const INK = "var(--akgolf-ink, #0A1F18)";
const PRIMARY = "var(--akgolf-primary, #005840)";
const TEXT = "var(--akgolf-text, #324D45)";

const FRAUNCES_INLINE: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), Georgia, serif",
  fontStyle: "italic",
  color: PRIMARY,
};

/**
 * Renderer markdown-lite:
 *  - **tekst**  -> <strong> (mørkere INK farge, semibold)
 *  - __tekst__  -> <em> i Fraunces italic (primary)
 */
function renderMarkdownLite(text: string): React.ReactNode {
  const tokens = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return tokens.map((tok, i) => {
    if (tok.startsWith("**") && tok.endsWith("**")) {
      return (
        <strong
          key={i}
          className="font-semibold"
          style={{ color: INK }}
        >
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith("__") && tok.endsWith("__")) {
      return (
        <em
          key={i}
          className="font-medium not-italic"
          style={FRAUNCES_INLINE}
        >
          {tok.slice(2, -2)}
        </em>
      );
    }
    return <Fragment key={i}>{tok}</Fragment>;
  });
}

export function UtviklingReadingSection() {
  if (!r.label && r.paragraphs.length === 0) return null;
  return (
    <article className="mx-auto max-w-[800px] px-10 py-25">
      <div
        className="mb-[22px] inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em]"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: PRIMARY,
        }}
      >
        <span
          className="block h-px w-[34px]"
          style={{ background: PRIMARY }}
        />
        {r.label}
      </div>

      <h2
        className="mb-6 text-[clamp(36px,4.6vw,46px)] font-extrabold leading-[1.05] tracking-[-0.03em]"
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          color: INK,
        }}
      >
        {r.headingStart}{" "}
        <em className="font-medium not-italic" style={FRAUNCES_INLINE}>
          {r.headingEm}
        </em>{" "}
        {r.headingEnd}
      </h2>

      {r.paragraphs.map((p, i) => (
        <p
          key={i}
          className="m-0 mb-[18px] text-[18px] leading-[1.7]"
          style={{ color: TEXT }}
        >
          {renderMarkdownLite(p)}
        </p>
      ))}

      <div
        className="my-10 py-8 text-[28px] font-medium leading-[1.35] tracking-[-0.02em]"
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontStyle: "italic",
          color: PRIMARY,
          borderTop: "1px solid rgba(10,31,24,0.10)",
          borderBottom: "1px solid rgba(10,31,24,0.10)",
        }}
      >
        <div
          className="mb-3 block text-[80px] leading-none"
          style={{ color: "rgba(0,88,64,0.30)" }}
        >
          “
        </div>
        {r.pullquote}
      </div>

      <h3
        className="mb-3.5 mt-12 text-[22px] font-bold tracking-[-0.02em]"
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          color: INK,
        }}
      >
        {r.v3Heading}
      </h3>
      <p
        className="m-0 mb-[18px] text-[18px] leading-[1.7]"
        style={{ color: TEXT }}
      >
        {r.v3Intro}
      </p>
      <ul className="m-0 mb-6 mt-3 list-none p-0">
        {r.v3Bullets.map((b, i) => (
          <li
            key={i}
            className="relative py-2.5 pl-[30px] text-[16px] leading-[1.6]"
            style={{
              color: TEXT,
              borderTop:
                i === 0 ? "none" : "1px solid rgba(10,31,24,0.08)",
            }}
          >
            <span
              className="absolute left-1 top-[18px] block h-0.5 w-3.5"
              style={{ background: PRIMARY }}
            />
            {renderMarkdownLite(b)}
          </li>
        ))}
      </ul>

      <h3
        className="mb-3.5 mt-12 text-[22px] font-bold tracking-[-0.02em]"
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          color: INK,
        }}
      >
        {r.forYouHeading}
      </h3>
      {r.forYouParagraphs.map((p, i) => (
        <p
          key={i}
          className="m-0 mb-[18px] text-[18px] leading-[1.7]"
          style={{ color: TEXT }}
        >
          {renderMarkdownLite(p)}
        </p>
      ))}
    </article>
  );
}
