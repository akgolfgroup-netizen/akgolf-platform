"use client";

import { useState } from "react";
import { submitDetails } from "@/app/booking-v2/actions";

export interface DetailsFormHidden {
  serviceTypeId?: string;
  instructorId?: string;
  service: string;
  trainer: string;
  date: string;
  time: string;
}

export interface DetailsFormPrefill {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  handicap?: string;
  note?: string;
  consent?: boolean;
}

interface DetailsFormProps {
  hidden: DetailsFormHidden;
  prefill?: DetailsFormPrefill;
  /** Feilmeldingskode fra server-action (?error=...). */
  error?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  "missing-service": "Tjenesten mangler — gå tilbake til steg 2.",
  "invalid-date": "Datoen er ugyldig — velg på nytt i steg 4.",
  "invalid-time": "Tidspunktet er ugyldig — velg på nytt i steg 4.",
  "missing-name": "Skriv inn både fornavn og etternavn.",
  "invalid-email": "Skriv inn en gyldig e-postadresse.",
  "invalid-phone": "Skriv inn et gyldig mobilnummer.",
  "missing-consent": "Du må godta vilkårene for å booke.",
};

export function DetailsForm({ hidden, prefill, error }: DetailsFormProps) {
  const [mode, setMode] = useState<"new" | "returning">("new");
  const errorMessage = error ? ERROR_MESSAGES[error] ?? null : null;

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
        <form action={submitDetails}>
          {hidden.serviceTypeId ? (
            <input type="hidden" name="serviceTypeId" value={hidden.serviceTypeId} />
          ) : null}
          {hidden.instructorId ? (
            <input type="hidden" name="instructorId" value={hidden.instructorId} />
          ) : null}
          <input type="hidden" name="service" value={hidden.service} />
          <input type="hidden" name="trainer" value={hidden.trainer} />
          <input type="hidden" name="date" value={hidden.date} />
          <input type="hidden" name="time" value={hidden.time} />

          {errorMessage ? (
            <div role="alert" className="form-error">
              {errorMessage}
            </div>
          ) : null}

          <div className="form-grid">
            <div className="field">
              <label htmlFor="bv2-firstName">Fornavn</label>
              <input
                id="bv2-firstName"
                name="firstName"
                type="text"
                defaultValue={prefill?.firstName ?? ""}
                placeholder="Marie"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="bv2-lastName">Etternavn</label>
              <input
                id="bv2-lastName"
                name="lastName"
                type="text"
                defaultValue={prefill?.lastName ?? ""}
                placeholder="Berg"
                required
              />
            </div>
            <div className="field span2">
              <label htmlFor="bv2-email">E-post</label>
              <input
                id="bv2-email"
                name="email"
                type="email"
                defaultValue={prefill?.email ?? ""}
                placeholder="marie@example.no"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="bv2-phone">Mobil</label>
              <input
                id="bv2-phone"
                name="phone"
                type="tel"
                defaultValue={prefill?.phone ?? ""}
                placeholder="+47 412 33 901"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="bv2-handicap">HCP (valgfritt)</label>
              <input
                id="bv2-handicap"
                name="handicap"
                type="text"
                defaultValue={prefill?.handicap ?? ""}
                placeholder="14,2"
              />
            </div>
            <div className="field span2">
              <label htmlFor="bv2-note">Notat til trener</label>
              <textarea
                id="bv2-note"
                name="note"
                rows={3}
                defaultValue={prefill?.note ?? ""}
                placeholder="Eks: vil jobbe med wedge-distanser, høyreknesmerter"
              />
            </div>
          </div>
          <label className="consent">
            <input
              type="checkbox"
              name="consent"
              defaultChecked={prefill?.consent ?? false}
            />
            <span>
              Jeg godtar <a href="/vilkar">vilkårene</a> og{" "}
              <a href="/personvern">avbestillingsreglene</a>. AK Golf kan sende påminnelser til
              e-posten min.
            </span>
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Til betaling →
            </button>
          </div>
        </form>
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
              <label htmlFor="bv2-magic-email">E-post</label>
              <input
                id="bv2-magic-email"
                type="email"
                placeholder="anders@example.no"
              />
            </div>
            <button type="button" className="btn btn-primary">
              Send lenke →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
