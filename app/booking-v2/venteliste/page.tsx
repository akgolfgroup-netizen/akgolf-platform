import Link from "next/link";
import { Stepper } from "@/components/booking-v2/Stepper";
import { WaitlistForm } from "@/components/booking-v2/WaitlistForm";

export default function VentelistePage() {
  return (
    <>
      <Stepper current={4} />
      <section className="step-page active" data-step="empty">
        <p className="eyebrow">
          <span className="num">04 / 07</span>
          Velg dato og tid
        </p>
        <h1 className="t-section">
          Ikke en eneste <em>ledig</em> tid neste 14 dager.
        </h1>
        <p className="lede">
          Anders er fullbooket til og med 12. mai. La oss sette deg på ventelisten — du blir
          varslet i samme sekund noen avbestiller.
        </p>

        <div className="empty-figure">
          <span className="glyph">·</span>
        </div>

        <div className="dt-grid">
          <WaitlistForm />

          <aside className="recap-card">
            <h4>Andre alternativer</h4>
            <div className="line">
              <span className="l">Markus</span>
              <span className="v">3 ledige denne uken</span>
            </div>
            <div className="line">
              <span className="l">Banecoaching</span>
              <span className="v">12. mai · ledig</span>
            </div>
            <div className="line">
              <span className="l">Flex 20</span>
              <span className="v">Drop-in søn 09:00</span>
            </div>
            <p className="policy" style={{ marginTop: 18 }}>
              Ingen forpliktelse — varselet kommer som SMS eller e-post, og du takker bare ja om det
              passer.
            </p>
            <Link
              href="/booking-v2/velg-trener?service=performance&trainer=markus"
              className="btn btn-secondary"
              style={{ marginTop: 18 }}
            >
              Bytt trener →
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
