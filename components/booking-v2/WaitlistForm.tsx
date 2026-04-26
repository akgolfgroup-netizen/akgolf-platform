"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: kall server action joinWaitlist (lib/portal/booking/waitlist.ts)
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div>
        <h3 className="t-card-title" style={{ margin: "0 0 16px" }}>
          Du er på ventelisten.
        </h3>
        <p style={{ color: "var(--ink-muted)" }}>
          Vi varsler deg på <b style={{ color: "var(--ink)" }}>{email || phone}</b> så snart noen
          avbestiller. Du takker bare ja om det passer.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="t-card-title" style={{ margin: "0 0 24px" }}>
        Sett meg på ventelisten
      </h3>
      <div className="form-grid">
        <div className="field span2">
          <label>E-post</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.no"
          />
        </div>
        <div className="field">
          <label>Mobil</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+47"
          />
        </div>
        <div className="field">
          <label>Foretrukket dag</label>
          <select defaultValue="hvilken">
            <option value="hvilken">Hvilken som helst</option>
            <option value="hverdag">Bare hverdager</option>
            <option value="helg">Bare helg</option>
          </select>
        </div>
        <div className="field span2">
          <label>Tidsvindu</label>
          <select defaultValue="hvilken">
            <option value="hvilken">Hvilken som helst tid</option>
            <option value="morgen">Morgen (07–11)</option>
            <option value="ettermiddag">Ettermiddag (11–17)</option>
            <option value="kveld">Kveld (17–21)</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-accent" style={{ marginTop: 32 }}>
        Bli varslet ved første ledige →
      </button>
    </form>
  );
}
