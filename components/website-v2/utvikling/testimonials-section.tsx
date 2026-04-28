import { Star } from "lucide-react";
import { UTVIKLING_TESTIMONIALS_V2 } from "@/lib/website-constants";

const INK = "var(--akgolf-ink, #0A1F18)";
const PRIMARY = "var(--akgolf-primary, #005840)";
const MUTED = "var(--akgolf-muted, #A5B2AD)";

const FRAUNCES_INLINE: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), Georgia, serif",
  fontStyle: "italic",
  color: PRIMARY,
};

const AVATAR_STYLES: Record<"purple" | "green", string> = {
  purple: "linear-gradient(135deg, #C99CF3, #6BB1FF)",
  green: "linear-gradient(135deg, #6FCBA1, #2A7D5A)",
};

export function UtviklingTestimonialsSection() {
  return (
    <section className="px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-[18px] py-22.5 md:grid-cols-2">
          {UTVIKLING_TESTIMONIALS_V2.map(t => (
            <article
              key={t.name}
              className="rounded-[20px] bg-white px-9 py-9"
              style={{ border: "1px solid rgba(10,31,24,0.08)" }}
            >
              <div
                className="mb-3 flex items-center gap-1"
                style={{ color: PRIMARY }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
                ))}
              </div>
              <blockquote
                className="m-0 text-[18px] font-medium leading-[1.6] tracking-[-0.01em]"
                style={{ color: INK }}
              >
                «{t.quoteStart}
                <em className="font-medium not-italic" style={FRAUNCES_INLINE}>
                  {t.quoteEm}
                </em>
                {t.quoteEnd}»
              </blockquote>
              <div
                className="mt-5 flex items-center gap-3.5 pt-4.5"
                style={{ borderTop: "1px solid rgba(10,31,24,0.08)" }}
              >
                <div
                  className="h-[46px] w-[46px] flex-shrink-0 rounded-full"
                  style={{ background: AVATAR_STYLES[t.avatar] }}
                />
                <div>
                  <div
                    className="text-[14px] font-semibold"
                    style={{ color: INK }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="mt-0.5 text-[10px] font-bold tracking-[0.06em]"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      color: MUTED,
                    }}
                  >
                    {t.meta}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
