import Link from "next/link";
import { Stepper } from "@/components/booking-v2/Stepper";

export default function KvotaPage() {
  return (
    <>
      <Stepper current={4} />
      <section className="step-page active" data-step="quota">
        <p className="eyebrow">
          <span className="num">!</span>
          Abonnement
        </p>
        <h1 className="t-section">
          Du har brukt <em>månedens</em> økter.
        </h1>
        <p className="lede">
          Performance Pro gir deg fire 1:1-økter per måned. Du har booket alle fire i april. Du kan
          velge en Flex-time som ekstrapris, eller vente til neste periode.
        </p>

        <div className="alert warn" style={{ maxWidth: 680 }}>
          <span className="ic">i</span>
          <div>
            <b>Neste periode starter onsdag 1. mai.</b>
            <p>Da nullstilles kvoten din til fire økter. Vi sender deg en påminnelse natten før.</p>
          </div>
        </div>

        <div className="confirm-meta" style={{ maxWidth: 680, margin: "32px 0" }}>
          <div className="cell dark">
            <div className="l">Brukt i april</div>
            <div className="v">
              4 / 4
              <small>03.04 · 09.04 · 14.04 · 22.04</small>
            </div>
          </div>
          <div className="cell">
            <div className="l">Tilgjengelig 1. mai</div>
            <div className="v">
              4 nye økter
              <small>Inkludert i Performance Pro</small>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/booking-v2/velg-tjeneste" className="btn btn-primary">
            Book Flex-time i tillegg
          </Link>
          <button type="button" className="btn btn-secondary">
            Sett påminnelse til 1. mai
          </button>
        </div>
      </section>
    </>
  );
}
