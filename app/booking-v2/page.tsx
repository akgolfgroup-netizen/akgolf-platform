import Link from "next/link";
import { Stepper } from "@/components/booking-v2/Stepper";
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
              <Link href="/booking-v2/lokasjon" className="btn btn-accent">
                Start booking →
              </Link>
            </div>

            <div className="quick-list">
              <h3>Slik fungerer det</h3>
              <ol style={{ paddingLeft: 20, lineHeight: 1.8 }}>
                <li>
                  <strong>Velg lokasjon</strong> — klubben eller anlegget der du vil trene
                </li>
                <li>
                  <strong>Velg trener</strong> — coachene som er aktive på den lokasjonen
                </li>
                <li>
                  <strong>Velg tjeneste</strong> — abonnement, enkelt-økt eller bane
                </li>
                <li>
                  <strong>Velg tid</strong> — ledige slots vises automatisk
                </li>
                <li>
                  <strong>Bekreft og betal</strong> — Stripe Checkout, ICS-fil i e-post
                </li>
              </ol>
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
