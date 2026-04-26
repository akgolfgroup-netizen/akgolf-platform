"use client";

import { useState } from "react";

export function DetailsForm() {
  const [mode, setMode] = useState<"new" | "returning">("new");

  return (
    <div>
      <div className="auth-toggle">
        <button
          type="button"
          aria-pressed={mode === "new"}
          onClick={() => setMode("new")}
        >
          Ny kunde
        </button>
        <button
          type="button"
          aria-pressed={mode === "returning"}
          onClick={() => setMode("returning")}
        >
          Har konto
        </button>
      </div>

      {mode === "new" ? (
        <div>
          <div className="form-grid">
            <div className="field">
              <label>Fornavn</label>
              <input type="text" defaultValue="" placeholder="Marie" />
            </div>
            <div className="field">
              <label>Etternavn</label>
              <input type="text" defaultValue="" placeholder="Berg" />
            </div>
            <div className="field span2">
              <label>E-post</label>
              <input type="email" defaultValue="" placeholder="marie@example.no" />
            </div>
            <div className="field">
              <label>Mobil</label>
              <input type="tel" defaultValue="" placeholder="+47 412 33 901" />
            </div>
            <div className="field">
              <label>HCP (valgfritt)</label>
              <input type="text" defaultValue="" placeholder="14,2" />
            </div>
            <div className="field span2">
              <label>Notat til trener</label>
              <textarea
                rows={3}
                placeholder="Eks: vil jobbe med wedge-distanser, høyreknesmerter"
              />
            </div>
          </div>
          <label className="consent">
            <input type="checkbox" defaultChecked />
            <span>
              Jeg godtar <a href="/vilkar">vilkårene</a> og{" "}
              <a href="/personvern">avbestillingsreglene</a>. AK Golf kan sende påminnelser til
              e-posten min.
            </span>
          </label>
        </div>
      ) : (
        <div>
          <h3 className="t-card-title" style={{ margin: "0 0 16px" }}>
            Logg inn for raskere booking
          </h3>
          <p style={{ color: "var(--ink-muted)", margin: "0 0 24px", fontSize: 15 }}>
            Vi sender en sikker innloggingslenke til e-posten din — ingen passord å huske.
          </p>
          <div className="magic-row">
            <div className="field">
              <label>E-post</label>
              <input type="email" placeholder="anders@example.no" />
            </div>
            <button type="button" className="btn btn-primary">Send lenke →</button>
          </div>
        </div>
      )}
    </div>
  );
}
