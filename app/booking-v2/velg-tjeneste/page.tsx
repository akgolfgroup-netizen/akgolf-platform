import { Stepper } from "@/components/booking-v2/Stepper";
import { ServiceFilterBar } from "@/components/booking-v2/ServiceFilterBar";

export default function VelgTjenestePage() {
  return (
    <>
      <Stepper current={2} />
      <section className="step-page active" data-step={2}>
        <p className="eyebrow">
          <span className="num">02 / 07</span>
          Velg tjeneste
        </p>
        <h1 className="t-section">
          Hva skal vi <em>jobbe</em> med?
        </h1>
        <p className="lede">Filtrer på type eller trener. Abonnement gir lavere pris per økt.</p>
        <ServiceFilterBar />
      </section>
    </>
  );
}
