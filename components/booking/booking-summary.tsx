"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Clock,
  User,
  Calendar,
  Mail,
  Phone,
  CreditCard,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { BookingServiceType, BookingInstructor, BookingMode } from "./booking-types";
import { formatBookingPrice } from "./booking-types";

interface BookingSummaryProps {
  mode: BookingMode;
  service: BookingServiceType;
  instructor: BookingInstructor;
  slot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSetField: (field: "customerName" | "customerEmail" | "customerPhone", value: string) => void;
  onBook: () => void;
  booking: boolean;
  showDetails: boolean;
  isDetailsValid: boolean;
  onProceedToConfirm?: () => void;
}

export function BookingSummary({
  mode,
  service,
  instructor,
  slot,
  customerName,
  customerEmail,
  customerPhone,
  onSetField,
  onBook,
  booking,
  showDetails,
  isDetailsValid,
  onProceedToConfirm,
}: BookingSummaryProps) {
  const slotDate = useMemo(() => new Date(slot), [slot]);

  if (showDetails && mode === "public") {
    return (
      <CustomerDetailsForm
        customerName={customerName}
        customerEmail={customerEmail}
        customerPhone={customerPhone}
        onSetField={onSetField}
        isValid={isDetailsValid}
        onProceed={onProceedToConfirm!}
        service={service}
        instructor={instructor}
        slot={slot}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">
          / Steg 3 — Bekreft
        </div>
        <h2 className="font-inter-tight text-[24px] font-bold leading-tight tracking-tight text-ink">
          Bekreft din booking.
        </h2>
      </div>

      <div className="bg-surface-soft border border-line rounded-2xl overflow-hidden mb-6">
        <div className="p-5 border-b border-line">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: service.color ?? "var(--color-primary)" }}
            />
            <h3 className="font-inter-tight text-[18px] font-bold tracking-tight text-ink">
              {service.name}
            </h3>
          </div>
        </div>

        <div className="p-5 space-y-4 bg-card">
          <SummaryRow icon={User} label="Instruktor" value={instructor.user.name ?? ""} />
          <SummaryRow
            icon={Calendar}
            label="Dato og tid"
            value={format(slotDate, "EEEE d. MMMM yyyy 'kl.' HH:mm", { locale: nb })}
          />
          <SummaryRow icon={Clock} label="Varighet" value={`${service.duration} minutter`} />
          {mode === "public" && customerName && (
            <SummaryRow icon={Mail} label="Kunde" value={customerName} sub={customerEmail} />
          )}
        </div>

        <div className="px-5 py-4 bg-surface-soft flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Totalpris
          </span>
          <span className="font-inter-tight text-[24px] font-bold tracking-tight text-ink tabular-nums">
            {formatBookingPrice(service.price)}
          </span>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onBook}
        disabled={booking}
        aria-busy={booking ? "true" : undefined}
        className="w-full py-3.5 rounded-full bg-accent text-ink font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-accent-deep focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        whileTap={{ scale: 0.99 }}
      >
        {booking ? (
          <span role="status" aria-live="polite" className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Behandler...
          </span>
        ) : (
          <>
            <CreditCard className="w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
            Betal med kort
          </>
        )}
      </motion.button>

      <p className="text-[12px] text-ink-subtle text-center mt-4">
        Sikker betaling via Stripe. Du mottar bekreftelse pa e-post.
      </p>
    </div>
  );
}

/* ---- Customer Details Form (public mode) ---- */

interface CustomerDetailsFormProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSetField: (field: "customerName" | "customerEmail" | "customerPhone", value: string) => void;
  isValid: boolean;
  onProceed: () => void;
  service: BookingServiceType;
  instructor: BookingInstructor;
  slot: string;
}

function CustomerDetailsForm({
  customerName,
  customerEmail,
  customerPhone,
  onSetField,
  isValid,
  onProceed,
  service,
  instructor,
  slot,
}: CustomerDetailsFormProps) {
  const slotDate = useMemo(() => new Date(slot), [slot]);

  return (
    <div>
      <div className="mb-6">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">
          / Steg 3 — Dine opplysninger
        </div>
        <h2 className="font-inter-tight text-[24px] font-bold leading-tight tracking-tight text-ink mb-1">
          Dine opplysninger.
        </h2>
        <p className="text-[13px] text-ink-muted">
          Fyll inn kontaktinformasjon for bookingen.
        </p>
      </div>

      <div className="bg-surface-soft border border-line rounded-xl p-4 mb-6 text-[13px] space-y-1">
        <p className="font-semibold text-ink">{service.name}</p>
        <p className="text-ink-muted">
          {instructor.user.name} — {format(slotDate, "EEE d. MMM 'kl.' HH:mm", { locale: nb })}
        </p>
      </div>

      <div className="space-y-4">
        <InputField
          label="Fullt navn"
          required
          type="text"
          value={customerName}
          onChange={(v) => onSetField("customerName", v)}
          placeholder="Ditt navn"
        />
        <InputField
          label="E-postadresse"
          required
          type="email"
          value={customerEmail}
          onChange={(v) => onSetField("customerEmail", v)}
          placeholder="din@epost.no"
          icon={Mail}
          hint="Har du booket for med denne e-posten, kobles timen til din profil."
        />
        <InputField
          label="Telefonnummer"
          type="tel"
          value={customerPhone}
          onChange={(v) => onSetField("customerPhone", v)}
          placeholder="+47 000 00 000"
          icon={Phone}
        />
      </div>

      <motion.button
        type="button"
        onClick={onProceed}
        disabled={!isValid}
        className="w-full mt-6 py-3.5 rounded-full bg-ink text-card font-semibold text-[14px] hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        whileTap={{ scale: 0.99 }}
      >
        Fortsett til betaling
      </motion.button>
    </div>
  );
}

/* ---- Helpers ---- */

function SummaryRow({
  icon: IconComp,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary-soft flex items-center justify-center shrink-0">
        <IconComp className="w-4 h-4 text-primary" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          {label}
        </p>
        <p className="text-[13px] font-semibold text-ink truncate">{value}</p>
        {sub && <p className="text-[12px] text-ink-muted truncate">{sub}</p>}
      </div>
    </div>
  );
}

function InputField({
  label,
  required,
  type,
  value,
  onChange,
  placeholder,
  icon: IconComp,
  hint,
}: {
  label: string;
  required?: boolean;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon?: LucideIcon;
  hint?: string;
}) {
  // Stabil id basert pa label — kobler <label htmlFor> <input id> for skjermlesere.
  const inputId = `booking-input-${label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return (
    <div>
      <label htmlFor={inputId} className="block text-[13px] font-semibold text-ink mb-1.5">
        {label}
        {required && (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        )}
        {required && <span className="sr-only"> (pakrevd)</span>}
      </label>
      <div className="relative">
        {IconComp && (
          <IconComp
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle"
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required ? "true" : undefined}
          aria-describedby={hintId}
          className={`w-full py-3 rounded-lg border border-line bg-card text-[14px] text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors ${
            IconComp ? "pl-10 pr-4" : "px-4"
          }`}
        />
      </div>
      {hint && (
        <p id={hintId} className="text-[12px] text-ink-subtle mt-1">
          {hint}
        </p>
      )}
    </div>
  );
}
