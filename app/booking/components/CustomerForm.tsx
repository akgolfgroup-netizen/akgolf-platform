"use client";

import { useState } from "react";
import { StepHeader } from "./StepHeader";

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

interface Props {
  onSubmit: (data: CustomerData) => void;
}

export function CustomerForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Navn og e-post er påkrevd.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Ugyldig e-postadresse.");
      return;
    }

    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  }

  return (
    <div>
      <StepHeader
        eyebrow="Steg 4"
        heading="Dine detaljer"
        description="Fyll inn kontaktinformasjon for bookingen."
      />

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="name" className="w-label">
            Fullt navn *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-input"
            placeholder="Ola Nordmann"
          />
        </div>

        <div>
          <label htmlFor="email" className="w-label">
            E-post *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-input"
            placeholder="ola@eksempel.no"
          />
        </div>

        <div>
          <label htmlFor="phone" className="w-label">
            Telefon <span className="text-ink-50">(valgfritt)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-input"
            placeholder="+47 900 00 000"
          />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <button type="submit" className="w-btn w-btn-gold w-full">
          Gå videre til betaling
        </button>
      </form>
    </div>
  );
}
