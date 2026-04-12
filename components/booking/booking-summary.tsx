"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Clock, User, Calendar, Mail, Phone, CreditCard, Loader2 } from "lucide-react";
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
  const slotDate = new Date(slot);

  if (showDetails && mode === "public") {
    return <CustomerDetailsForm
      customerName={customerName}
      customerEmail={customerEmail}
      customerPhone={customerPhone}
      onSetField={onSetField}
      isValid={isDetailsValid}
      onProceed={onProceedToConfirm!}
      service={service}
      instructor={instructor}
      slot={slot}
    />;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-black mb-6 tracking-tight">
        Bekreft din booking
      </h2>

      {/* Summary card */}
      <div className="bg-white rounded-xl border border-grey-200 shadow-card overflow-hidden mb-6">
        <div className="p-5 border-b border-grey-100">
          <div className="flex items-center gap-2.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: service.color ?? undefined }}
            />
            <h3 className="text-lg font-semibold text-black">{service.name}</h3>
          </div>
        </div>

        <div className="p-5 space-y-4">
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

        <div className="px-5 py-4 bg-grey-50 flex items-center justify-between">
          <span className="text-sm text-muted">Totalpris</span>
          <span className="text-2xl font-semibold text-black tabular-nums">
            {formatBookingPrice(service.price)}
          </span>
        </div>
      </div>

      {/* Payment */}
      <motion.button
        onClick={onBook}
        disabled={booking}
        className="w-full py-4 rounded-[20px] bg-primary text-white font-semibold flex items-center justify-center gap-2.5 hover:bg-primary-alt transition-colors disabled:opacity-50"
        whileTap={{ scale: 0.99 }}
      >
        {booking ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Behandler...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Betal med kort
          </>
        )}
      </motion.button>

      <p className="text-xs text-grey-300 text-center mt-4">
        Sikker betaling via Stripe. Du mottar bekreftelse på e-post.
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
  const slotDate = new Date(slot);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-black mb-2 tracking-tight">
        Dine opplysninger
      </h2>
      <p className="text-sm text-muted mb-6">
        Fyll inn kontaktinformasjon for bookingen
      </p>

      {/* Mini summary */}
      <div className="bg-grey-50 rounded-xl p-4 mb-6 text-sm space-y-1.5">
        <p className="font-medium text-black">{service.name}</p>
        <p className="text-muted">
          {instructor.user.name} — {format(slotDate, "EEE d. MMM 'kl.' HH:mm", { locale: nb })}
        </p>
      </div>

      {/* Form */}
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
          hint="Har du booket før med denne e-posten, kobles timen til din profil."
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
        onClick={onProceed}
        disabled={!isValid}
        className="w-full mt-6 py-4 rounded-[20px] bg-primary text-white font-semibold hover:bg-primary-alt transition-colors disabled:opacity-50"
        whileTap={{ scale: 0.99 }}
      >
        Fortsett til betaling
      </motion.button>
    </div>
  );
}

/* ---- Helpers ---- */

function SummaryRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-grey-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-black truncate">{value}</p>
        {sub && <p className="text-xs text-muted truncate">{sub}</p>}
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
  icon: Icon,
  hint,
}: {
  label: string;
  required?: boolean;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon?: React.ComponentType<{ className?: string }>;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1.5">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            "w-full py-3 rounded-lg border border-grey-200 bg-white text-text placeholder:text-grey-300",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors",
            Icon ? "pl-10 pr-4" : "px-4",
          ].join(" ")}
        />
      </div>
      {hint && <p className="text-xs text-grey-300 mt-1">{hint}</p>}
    </div>
  );
}
