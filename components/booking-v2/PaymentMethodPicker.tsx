"use client";

import { useState } from "react";

type Method = "card" | "apple" | "gpay" | "invoice";

const METHODS: { id: Method; label: string; sub: string; tag?: string; icon: string; iconCls?: string }[] = [
  { id: "card", label: "Bankkort", sub: "Visa, Mastercard — kryptert via Stripe", tag: "Standard", icon: "CARD" },
  { id: "apple", label: "Apple Pay", sub: "Bekreft med Touch ID eller Face ID", icon: "", iconCls: "apple" },
  { id: "gpay", label: "Google Pay", sub: "Bruk det som ligger i nettleseren din", icon: "G Pay", iconCls: "gpay" },
  { id: "invoice", label: "Faktura (bedrift)", sub: "EHF-faktura med 14 dagers forfall", tag: "Bedrift", icon: "FAKT", iconCls: "invoice" },
];

export function PaymentMethodPicker() {
  const [selected, setSelected] = useState<Method>("card");

  return (
    <div>
      <div className="pay-list">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`pay-row${selected === m.id ? " selected" : ""}`}
            onClick={() => setSelected(m.id)}
          >
            <span className="radio" />
            <span className={`pay-icon${m.iconCls ? " " + m.iconCls : ""}`}>{m.icon}</span>
            <span className="pay-text">
              <span className="l1">{m.label}</span>
              <span className="l2">{m.sub}</span>
            </span>
            {m.tag ? <span className="pay-tag">{m.tag}</span> : null}
          </button>
        ))}
      </div>

      {selected === "card" ? (
        <div className="card-fields">
          <div className="field span3">
            <label>Kortnummer</label>
            <input type="text" placeholder="•••• •••• •••• ••••" />
          </div>
          <div className="field">
            <label>Utløp</label>
            <input type="text" placeholder="MM / ÅÅ" />
          </div>
          <div className="field">
            <label>CVC</label>
            <input type="text" placeholder="•••" />
          </div>
          <div className="field">
            <label>Postnr.</label>
            <input type="text" placeholder="0150" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
