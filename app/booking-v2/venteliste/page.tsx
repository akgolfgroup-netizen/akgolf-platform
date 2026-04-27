import { Stepper } from "@/components/booking-v2/Stepper";
import { WaitlistForm } from "@/components/booking-v2/WaitlistForm";

export default function VentelistePage() {
  return (
    <>
      <Stepper current={4} />
      <section className="step-page active" data-step="empty">
        <p className="eyebrow">
          <span className="num">04 / 07</span>
          Venteliste
        </p>
        <h1 className="t-section">
          Få beskjed når en <em>tid</em> blir ledig.
        </h1>
        <p className="lede">
          Når noen avbestiller, sender vi et varsel — og du kan ta tiden på sekundet.
          Ingen forpliktelse, du takker bare ja om det passer.
        </p>

        <div className="dt-grid">
          <WaitlistForm />

          <aside className="recap-card">
            <h4>Slik fungerer ventelisten</h4>
            <div className="line">
              <span className="l">01 · Avbestilling</span>
              <span className="v">Vi får varsel</span>
            </div>
            <div className="line">
              <span className="l">02 · Varsel</span>
              <span className="v">Du får SMS + e-post</span>
            </div>
            <div className="line">
              <span className="l">03 · Bekreft</span>
              <span className="v">Klikk for å ta plassen</span>
            </div>
            <div className="line">
              <span className="l">04 · Ferdig</span>
              <span className="v">Bekreftelse + ICS</span>
            </div>
            <p className="policy" style={{ marginTop: 18 }}>
              Vi prioriterer i kø-rekkefølge. Du står på listen til du takker ja eller melder deg av —
              ingen automatisk fjerning.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
