import Link from "next/link";
import { ArrowRight, Calendar, MapPin, User, CreditCard } from "lucide-react";
import { BookingStepper } from "@/components/booking-v2/BookingStepper";
import { ENTRY } from "@/components/booking-v2/copy";

export default function BookingV2EntryPage() {
  return (
    <>
      <BookingStepper current={1} />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <div
            className="mb-3 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em]"
            style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <span className="h-px w-5" style={{ background: "var(--color-ink)" }} />
            Booking
          </div>

          <h1
            className="mb-6 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em]"
            style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
          >
            {ENTRY.hero}{" "}
            <em className="not-italic" style={{ color: "var(--color-primary)" }}>
              {ENTRY.heroEm}
            </em>
            {ENTRY.heroDot}
          </h1>

          <p
            className="mb-8 max-w-md text-base leading-relaxed md:text-lg"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {ENTRY.lede}
          </p>

          <Link
            href="/booking-v2/lokasjon"
            className="mb-10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
            style={{ background: "var(--color-accent)", color: "var(--color-ink)" }}
          >
            Start booking
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </Link>

          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-ink)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Slik fungerer det
            </h3>
            <ol className="space-y-3">
              {[
                { icon: <MapPin className="h-4 w-4" />, text: "Velg lokasjon — klubben der du vil trene" },
                { icon: <User className="h-4 w-4" />, text: "Velg trener — coachene på den lokasjonen" },
                { icon: <Calendar className="h-4 w-4" />, text: "Velg tjeneste og tid — ledige slots vises automatisk" },
                { icon: <CreditCard className="h-4 w-4" />, text: "Bekreft og betal — trygt via Stripe" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Quote aside */}
        <div
          className="relative hidden overflow-hidden rounded-3xl p-8 lg:flex lg:flex-col lg:justify-between lg:p-10"
          style={{
            background: "var(--color-ink)",
            color: "var(--color-card)",
            minHeight: 480,
          }}
        >
          <div
            className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full blur-[60px]"
            style={{ background: "var(--color-accent)", opacity: 0.18 }}
          />
          <div className="relative z-10">
            <span
              className="mb-6 block text-6xl leading-none"
              style={{ color: "var(--color-accent)", fontFamily: "var(--font-inter-tight)" }}
            >
              &ldquo;
            </span>
            <blockquote
              className="text-xl font-medium italic leading-relaxed md:text-2xl"
              style={{ color: "var(--color-card)", fontFamily: "var(--font-inter-tight)" }}
            >
              {ENTRY.quote}
            </blockquote>
          </div>
          <div className="relative z-10 mt-8 flex items-center gap-3">
            <span className="h-px w-6" style={{ background: "var(--color-accent)" }} />
            <span className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
              {ENTRY.quoteCredit}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
