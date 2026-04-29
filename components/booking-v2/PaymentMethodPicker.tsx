/**
 * Visuell preview av betalingsmetoder før Stripe Checkout.
 *
 * Selve metode-valget skjer på Stripe Checkout-siden — denne komponenten
 * forteller bare brukeren hva som er tilgjengelig. Ingen state, ingen form.
 */

const METHODS = [
  {
    label: "Bankkort",
    sub: "Visa, Mastercard — kryptert via Stripe",
    tag: "Standard",
    icon: "KORT",
  },
  {
    label: "Vipps",
    sub: "Betal med Vipps-appen din",
    icon: "V",
    iconCls: "vipps",
  },
  {
    label: "Apple Pay",
    sub: "Bekreft med Touch ID eller Face ID",
    icon: "",
    iconCls: "apple",
  },
  {
    label: "Google Pay",
    sub: "Bruk det som ligger i nettleseren din",
    icon: "G Pay",
    iconCls: "gpay",
  },
];

export function PaymentMethodPicker() {
  return (
    <div>
      <h3 className="card-title" style={{ marginBottom: 12 }}>
        Tilgjengelige betalingsmåter
      </h3>
      <p
        className="lede"
        style={{ marginBottom: 16, fontSize: "0.9rem", opacity: 0.8 }}
      >
        Du velger metode på neste skjerm.
      </p>
      <div className="pay-list">
        {METHODS.map((m) => (
          <div key={m.label} className="pay-row">
            <span className={`pay-icon${m.iconCls ? " " + m.iconCls : ""}`}>
              {m.icon}
            </span>
            <span className="pay-text">
              <span className="l1">{m.label}</span>
              <span className="l2">{m.sub}</span>
            </span>
            {m.tag ? <span className="pay-tag">{m.tag}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
