"use client";

import { useState } from "react";
import { ChevronRight, Lock, Calendar, Mail, Loader2 } from "lucide-react";
import { Drawer } from "./Drawer";
import type { BookingState, TrainerService } from "./types";

interface PaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: BookingState;
  service: TrainerService | null;
  trainerId: string;
  onSuccess: () => void;
}

export function PaymentDrawer({
  isOpen,
  onClose,
  state,
  service,
  trainerId,
  onSuccess,
}: PaymentDrawerProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!service) return null;

  const periodLabel = service.isSubscription ? "kr/mnd" : "kr";
  const ctaLabel = `Betal ${service.price.toLocaleString("nb-NO")} kr`;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTypeId: state.serviceId,
          instructorId: trainerId,
          startTime: state.slotIso,
          paymentMethod: "STRIPE",
          email: state.email,
          name: state.name,
          phone: state.phone,
          focusArea: state.focusAreas[0],
          playerNotes: state.notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Kunne ikke opprette booking");
        setSubmitting(false);
        return;
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else if (data.bookingId) {
        onSuccess();
      }
    } catch {
      setError("En feil oppstod. Prov igjen.");
      setSubmitting(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="text-lg font-bold text-[#0A1F18]">Bekreft og betal</div>
      <div className="text-xs text-[#A5B2AD] mb-5">
        {service.name} · {service.price.toLocaleString("nb-NO")} {periodLabel}
      </div>

      <div className="mb-4 p-4 rounded-xl bg-[#ECF0EF] text-[13px] text-[#324D45]">
        Du blir videresendt til Stripe for sikker betaling. Stripe stotter automatisk kort, Apple Pay og Google Pay avhengig av din enhet.
      </div>

      <div className="flex gap-2 mb-5">
        <TrustBadge Icon={Lock} label="SSL-kryptert" />
        <TrustBadge Icon={Calendar} label="Avbestill 24t for" />
        <TrustBadge Icon={Mail} label="E-postbekreftelse" />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-[#B84233]/10 border border-[#B84233]/20 text-xs text-[#B84233]">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-4 rounded-[14px] bg-[#D1F843] text-[#005840] text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#c8ef35] hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Behandler...
          </>
        ) : (
          <>
            {ctaLabel}
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </>
        )}
      </button>
    </Drawer>
  );
}

function TrustBadge({
  Icon,
  label,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex-1 bg-[#ECF0EF] rounded-[10px] p-3 text-center">
      <Icon className="w-4 h-4 text-[#005840] mx-auto mb-1" />
      <div className="text-[10px] font-semibold text-[#005840]">{label}</div>
    </div>
  );
}
