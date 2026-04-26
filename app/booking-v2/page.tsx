import Link from "next/link";
import { Stepper } from "@/components/booking-v2/Stepper";
import { QuickRow } from "@/components/booking-v2/QuickRow";
import { ENTRY } from "@/components/booking-v2/copy";

export default function BookingV2EntryPage() {
  return (
    <>
      <Stepper current={1} />
      <section className="step-page active" data-step={1}>
        <div className="entry-grid">
          <div>
            <p className="eyebrow">
              <span className="num">01 / 07</span>
              {ENTRY.eyebrow}
            </p>
            <h1 className="t-hero">
              {ENTRY.hero} <em>{ENTRY.heroEm}</em>
              {ENTRY.heroDot}
            </h1>
            <p className="lede">{ENTRY.lede}</p>
            <div className="entry-cta-row">
              <Link href="/booking-v2/velg-tjeneste" className="btn btn-accent">
                {ENTRY.ctaPrimary} →
              </Link>
              <Link href="/booking-v2/velg-trener" className="btn btn-secondary">
                {ENTRY.ctaSecondary}
              </Link>
            </div>

            <div className="quick-list">
              <h3>{ENTRY.quickHeading}</h3>
              <QuickRow
                href="/booking-v2/velg-trener?service=performance"
                tag="2 × 20 min / mnd"
                name="Performance"
                detail="Anders Kristiansen · treningsabonnement"
                price="1 400 kr"
                priceUnit="/mnd"
              />
              <QuickRow
                href="/booking-v2/velg-trener?service=performance-pro"
                tag="4 × 20 min / mnd"
                name="Performance Pro"
                detail="Anders Kristiansen · for de som vil mer"
                price="2 500 kr"
                priceUnit="/mnd"
              />
              <QuickRow
                href="/booking-v2/velg-trener?service=flex-50"
                tag="50 min · enkeltsesjon"
                name="Flex 50"
                detail="en enkelt time uten binding"
                price="800 – 1 500 kr"
              />
              <QuickRow
                href="/booking-v2/velg-trener?service=banecoaching"
                tag="9 hull · på bane"
                name="Banecoaching"
                detail="strategi, beslutning og kursledelse"
                price="3 000 kr"
                priceUnit="/spiller"
              />
            </div>
          </div>

          <aside>
            <div className="entry-figure">
              <div className="entry-figure-meta">
                <p className="quote">«{ENTRY.quote}»</p>
                <span className="credit">{ENTRY.quoteCredit}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
