"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { type BookingState, formatPrice } from "./booking-types";

interface BookingSummaryProps {
  state: BookingState;
  onUpdateCustomer: (
    field: "customerName" | "customerEmail" | "customerPhone",
    value: string
  ) => void;
  onBook: () => void;
  booking: boolean;
  onBack: () => void;
}

export function BookingSummary({
  state,
  onUpdateCustomer,
  onBook,
  booking,
  onBack,
}: BookingSummaryProps) {
  const { service, instructor, slot, customerName, customerEmail, customerPhone } =
    state;

  if (!service || !instructor || !slot) return null;

  const isValid = validateCustomerDetails(customerName, customerEmail);

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm mb-6 text-[var(--color-muted)] hover:text-[var(--color-grey-900)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Tilbake
      </button>

      <h2 className="text-3xl font-semibold mb-2 text-[var(--color-grey-900)]">
        Bekreft og betal
      </h2>
      <p className="text-[var(--color-muted)] mb-8">
        Fyll inn kontaktinfo og gjennomfoer betaling
      </p>

      {/* Booking details card */}
      <div className="rounded-2xl border border-[var(--color-grey-200)] bg-white shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[var(--color-grey-200)]">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: service.color ?? "var(--color-primary)" }}
          />
          <h3 className="text-lg font-semibold text-[var(--color-grey-900)]">
            {service.name}
          </h3>
        </div>

        <div className="space-y-3 text-sm">
          <p className="flex items-center gap-2 text-[var(--color-grey-500)]">
            <User className="w-4 h-4 text-[var(--color-primary)]" />
            {instructor.user.name}
          </p>
          <p className="flex items-center gap-2 text-[var(--color-grey-500)]">
            <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
            {format(new Date(slot), "EEEE d. MMMM yyyy 'kl.' HH:mm", {
              locale: nb,
            })}
          </p>
          <p className="flex items-center gap-2 text-[var(--color-grey-500)]">
            <Clock className="w-4 h-4 text-[var(--color-primary)]" />
            {service.duration} minutter
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--color-grey-200)]">
          <span className="text-sm text-[var(--color-muted)]">Totalpris</span>
          <span className="text-2xl font-semibold text-[var(--color-grey-900)]">
            {formatPrice(service.price)}
          </span>
        </div>
      </div>

      {/* Customer form */}
      <div className="space-y-4 mb-8">
        <InputField
          label="Fullt navn"
          required
          type="text"
          value={customerName}
          onChange={(v) => onUpdateCustomer("customerName", v)}
          placeholder="Ditt navn"
        />

        <InputField
          label="E-postadresse"
          required
          type="email"
          value={customerEmail}
          onChange={(v) => onUpdateCustomer("customerEmail", v)}
          placeholder="din@epost.no"
          icon={<Mail className="w-4 h-4 text-[var(--color-primary)]" />}
          hint="Har du booket foer med denne e-posten, kobles timen til din profil."
        />

        <InputField
          label="Telefonnummer"
          type="tel"
          value={customerPhone}
          onChange={(v) => onUpdateCustomer("customerPhone", v)}
          placeholder="+47 000 00 000"
          icon={<Phone className="w-4 h-4 text-[var(--color-primary)]" />}
        />
      </div>

      {/* Pay button */}
      <button
        onClick={onBook}
        disabled={!isValid || booking}
        className="
          w-full py-4 rounded-2xl text-base font-semibold
          bg-[var(--color-grey-900)] text-white
          shadow-lg hover:shadow-xl disabled:opacity-50
          active:scale-[0.99] transition-all duration-200
          flex items-center justify-center gap-3
        "
      >
        {booking ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Behandler...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Betal med kort
          </>
        )}
      </button>

      <p className="text-xs text-center mt-4 text-[var(--color-grey-300)]">
        Alle betalinger er sikre og krypterte via Stripe.
      </p>
    </div>
  );
}

/* ─── Helpers ─── */

function validateCustomerDetails(name: string, email: string): boolean {
  if (!name.trim() || name.length < 2) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function InputField({
  label,
  required,
  type,
  value,
  onChange,
  placeholder,
  icon,
  hint,
}: {
  label: string;
  required?: boolean;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-[var(--color-grey-900)]">
        {label}
        {required && " *"}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full py-3 rounded-xl border border-[var(--color-grey-200)]
            bg-white text-[var(--color-grey-900)]
            placeholder:text-[var(--color-grey-300)]
            focus:border-[var(--color-grey-900)] focus:outline-none focus:ring-1 focus:ring-[var(--color-grey-900)]
            transition-all duration-150
            ${icon ? "pl-11 pr-4" : "px-4"}
          `}
        />
      </div>
      {hint && (
        <p className="text-xs mt-1 text-[var(--color-grey-300)]">{hint}</p>
      )}
    </div>
  );
}
