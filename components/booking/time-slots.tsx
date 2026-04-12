"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock, User, Check } from "lucide-react";
import { type ServiceType, type InstructorOption, formatPrice } from "./booking-types";

interface TimeSlotsProps {
  service: ServiceType;
  instructor: InstructorOption;
  slot: string;
  date: Date;
  onConfirm: () => void;
  onBack: () => void;
}

export function TimeSlots({
  service,
  instructor,
  slot,
  date,
  onConfirm,
  onBack,
}: TimeSlotsProps) {
  const slotDate = new Date(slot);

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
        Bekreft tidspunkt
      </h2>
      <p className="text-[var(--color-muted)] mb-8">
        Sjekk at alt stemmer for du gar videre
      </p>

      {/* Confirmation card */}
      <div className="rounded-2xl border border-[var(--color-grey-200)] bg-white shadow-sm p-6 mb-8">
        <div className="space-y-4">
          <DetailRow
            icon={<div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color ?? "var(--color-primary)" }} />}
            label="Tjeneste"
            value={service.name}
          />
          <DetailRow
            icon={<User className="w-4 h-4 text-[var(--color-primary)]" />}
            label="Instruktoer"
            value={instructor.user.name ?? ""}
          />
          <DetailRow
            icon={<Calendar className="w-4 h-4 text-[var(--color-primary)]" />}
            label="Dato"
            value={format(date, "EEEE d. MMMM yyyy", { locale: nb })}
          />
          <DetailRow
            icon={<Clock className="w-4 h-4 text-[var(--color-primary)]" />}
            label="Klokkeslett"
            value={`${format(slotDate, "HH:mm")} (${service.duration} min)`}
          />
        </div>

        <div className="flex items-center justify-between pt-5 mt-5 border-t border-[var(--color-grey-200)]">
          <span className="text-sm text-[var(--color-muted)]">Pris</span>
          <span className="text-2xl font-semibold text-[var(--color-grey-900)]">
            {formatPrice(service.price)}
          </span>
        </div>
      </div>

      <button
        onClick={onConfirm}
        className="
          w-full py-4 rounded-2xl text-base font-semibold
          bg-[var(--color-grey-900)] text-white
          shadow-lg hover:shadow-xl
          active:scale-[0.99] transition-all duration-200
          flex items-center justify-center gap-2
        "
      >
        <Check className="w-5 h-5" />
        Fortsett til betaling
      </button>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-9 h-9 rounded-lg bg-[var(--color-grey-50)] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-[var(--color-grey-400)] font-medium">
          {label}
        </p>
        <p className="text-sm font-medium text-[var(--color-grey-900)]">
          {value}
        </p>
      </div>
    </div>
  );
}
