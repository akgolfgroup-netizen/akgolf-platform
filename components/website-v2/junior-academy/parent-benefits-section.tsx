import {
  Bell,
  CalendarCheck,
  LineChart,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Users,
  type LucideIcon,
} from "lucide-react";
import { WebButton } from "../web-button";
import { JUNIOR_PARENT_V3 } from "@/lib/website-constants";

const ICON_MAP: Record<
  (typeof JUNIOR_PARENT_V3.benefits)[number]["icon"],
  LucideIcon
> = {
  bell: Bell,
  lineChart: LineChart,
  users: Users,
  shield: ShieldCheck,
  calendar: CalendarCheck,
  message: MessageSquare,
};

export function JuniorParentBenefitsSection() {
  const s = JUNIOR_PARENT_V3;
  return (
    <section
      className="px-10 py-[100px]"
      style={{ background: "var(--akgolf-surface, #ECF0EF)" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-15 grid items-end gap-10 md:grid-cols-[1fr_auto]">
          <div>
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
              className="text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.030em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
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
          <WebButton href={s.ctaHref} variant="line">
            {s.ctaLabel}
            <Smartphone className="h-4 w-4" strokeWidth={2} />
          </WebButton>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {s.benefits.map((b) => {
            const Icon = ICON_MAP[b.icon];
            return (
              <article
                key={b.title}
                className="rounded-[20px] border bg-white p-8"
                style={{
                  borderColor: "var(--akgolf-line-light, #e0e8e5)",
                }}
              >
                <div
                  className="mb-5 grid h-12 w-12 place-items-center rounded-xl"
                  style={{
                    background: "rgba(0,88,64,0.10)",
                    color: "var(--akgolf-primary, #005840)",
                  }}
                >
                  <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                </div>
                <h4
                  className="mb-2 text-[19px] font-bold tracking-[-0.020em] text-[var(--akgolf-ink,#0A1F18)]"
                  style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                  }}
                >
                  {b.title}
                </h4>
                <p className="text-[14px] leading-[1.55] text-[var(--akgolf-text,#324D45)] text-pretty">
                  {b.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
