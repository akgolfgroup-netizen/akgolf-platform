"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { StepHeader } from "./StepHeader";
import Link from "next/link";

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  handicap?: string;
  experience?: string;
  goals?: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

interface Props {
  onSubmit: (data: CustomerData) => void;
}

interface FieldError {
  field: string;
  message: string;
}

export function CustomerForm({ onSubmit }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [handicap, setHandicap] = useState("");
  const [experience, setExperience] = useState("");
  const [goals, setGoals] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [errors, setErrors] = useState<FieldError[]>([]);

  function validate(): boolean {
    const newErrors: FieldError[] = [];

    if (!firstName.trim()) {
      newErrors.push({ field: "firstName", message: "Fornavn er pakrevd" });
    }
    if (!lastName.trim()) {
      newErrors.push({ field: "lastName", message: "Etternavn er pakrevd" });
    }
    if (!email.trim()) {
      newErrors.push({ field: "email", message: "E-post er pakrevd" });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.push({ field: "email", message: "Ugyldig e-postadresse" });
      }
    }
    if (!phone.trim()) {
      newErrors.push({ field: "phone", message: "Mobilnummer er pakrevd" });
    }
    if (!acceptTerms) {
      newErrors.push({ field: "acceptTerms", message: "Du ma godta vilkarene" });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }

  function getError(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      handicap: handicap.trim() || undefined,
      experience: experience || undefined,
      goals: goals.trim() || undefined,
      acceptTerms,
      acceptMarketing,
    });
  }

  return (
    <div>
      <StepHeader
        eyebrow="Steg 4"
        heading="Dine opplysninger"
        description="Vi trenger litt informasjon for a fullfoere bookingen"
      />

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* Form grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* First name */}
          <div>
            <label htmlFor="firstName" className="w-label">
              Fornavn <span className="text-error">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`w-input ${getError("firstName") ? "border-error" : ""}`}
              placeholder="Ola"
            />
            {getError("firstName") && (
              <p className="text-xs text-error mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {getError("firstName")}
              </p>
            )}
          </div>

          {/* Last name */}
          <div>
            <label htmlFor="lastName" className="w-label">
              Etternavn <span className="text-error">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`w-input ${getError("lastName") ? "border-error" : ""}`}
              placeholder="Nordmann"
            />
            {getError("lastName") && (
              <p className="text-xs text-error mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {getError("lastName")}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="w-label">
              E-post <span className="text-error">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-input ${getError("email") ? "border-error" : ""}`}
              placeholder="ola@eksempel.no"
            />
            <p className="text-xs text-ink-50 mt-1">
              Bekreftelse og paminnelser sendes hit
            </p>
            {getError("email") && (
              <p className="text-xs text-error mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {getError("email")}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="w-label">
              Mobilnummer <span className="text-error">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-input ${getError("phone") ? "border-error" : ""}`}
              placeholder="+47 912 34 567"
            />
            <p className="text-xs text-ink-50 mt-1">
              For SMS-paminnelse dagen foer
            </p>
            {getError("phone") && (
              <p className="text-xs text-error mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {getError("phone")}
              </p>
            )}
          </div>

          {/* Handicap */}
          <div>
            <label htmlFor="handicap" className="w-label">
              Handicap
            </label>
            <input
              id="handicap"
              type="text"
              value={handicap}
              onChange={(e) => setHandicap(e.target.value)}
              className="w-input"
              placeholder="f.eks. 18.4"
            />
            <p className="text-xs text-ink-50 mt-1">
              Valgfritt, men hjelper instruktoren a forberede
            </p>
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experience" className="w-label">
              Erfaring
            </label>
            <select
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-input"
            >
              <option value="">Velg...</option>
              <option value="beginner">Nybegynner (0-2 år)</option>
              <option value="intermediate">Moderat (2-5 år)</option>
              <option value="experienced">Erfaren (5+ år)</option>
            </select>
          </div>

          {/* Goals - full width */}
          <div className="sm:col-span-2">
            <label htmlFor="goals" className="w-label">
              Hva oensker du a jobbe med?
            </label>
            <textarea
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="w-input min-h-[100px] resize-y"
              placeholder="Beskriv dine mal eller utfordringer..."
            />
          </div>

          {/* Terms checkbox - full width */}
          <div className="sm:col-span-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setAcceptTerms(!acceptTerms)}
                className={`
                  w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors mt-0.5
                  ${acceptTerms
                    ? "bg-navy border-navy"
                    : getError("acceptTerms")
                    ? "border-error"
                    : "border-ink-20"
                  }
                `}
              >
                {acceptTerms && <Check size={14} className="text-white" strokeWidth={3} />}
              </button>
              <span className="text-sm text-ink-70">
                Jeg godtar{" "}
                <Link href="/vilkar" className="text-navy underline hover:no-underline">
                  vilkarene
                </Link>{" "}
                og{" "}
                <Link href="/personvern" className="text-navy underline hover:no-underline">
                  personvernerkleringen
                </Link>
              </span>
            </label>
            {getError("acceptTerms") && (
              <p className="text-xs text-error mt-2 flex items-center gap-1 ml-8">
                <AlertCircle size={12} />
                {getError("acceptTerms")}
              </p>
            )}
          </div>

          {/* Marketing checkbox - full width */}
          <div className="sm:col-span-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setAcceptMarketing(!acceptMarketing)}
                className={`
                  w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors mt-0.5
                  ${acceptMarketing ? "bg-navy border-navy" : "border-ink-20"}
                `}
              >
                {acceptMarketing && <Check size={14} className="text-white" strokeWidth={3} />}
              </button>
              <span className="text-sm text-ink-70">
                Ja, send meg tips og tilbud pa e-post (kan avmeldes nar som helst)
              </span>
            </label>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end mt-8 pt-6 border-t border-ink-10">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-btn w-btn-gold flex items-center gap-2"
          >
            Ga til betaling
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
