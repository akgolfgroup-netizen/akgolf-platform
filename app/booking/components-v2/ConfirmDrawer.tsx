"use client";



import { Icon } from "@/components/ui/icon";
import { Drawer } from "./Drawer";
import { FocusAreaChips } from "./FocusAreaChips";
import type { BookingState, TrainerService } from "./types";

interface ConfirmDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  state: BookingState;
  updateState: (patch: Partial<BookingState>) => void;
  service: TrainerService | null;
  trainerName: string;
  isLoggedIn: boolean;
  hasSubscription: boolean;
}

export function ConfirmDrawer({
  isOpen,
  onClose,
  onContinue,
  state,
  updateState,
  service,
  trainerName,
  isLoggedIn,
  hasSubscription,
}: ConfirmDrawerProps) {
  if (!service || !state.date || !state.time) return null;

  const periodLabel = service.isSubscription ? "kr/mnd" : "kr";
  const dateObj = new Date(state.date);
  const dateStr = dateObj.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const endTime = new Date(new Date(state.slotIso ?? "").getTime() + service.duration * 60_000);
  const endStr = endTime.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });

  const canContinue =
    state.acceptedTerms && state.name.trim().length > 0 && state.email.trim().length > 0;

  const toggleFocus = (id: string) => {
    updateState({
      focusAreas: state.focusAreas.includes(id)
        ? state.focusAreas.filter((x) => x !== id)
        : [...state.focusAreas, id],
    });
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="text-lg font-bold text-on-surface">Bekreft din booking</div>
      <div className="text-xs text-on-surface-variant mb-5">Sjekk detaljene og bekreft</div>

      <div className="bg-primary rounded-2xl p-5 text-surface mb-5">
        <SummaryRow label="Trener" value={trainerName} />
        <SummaryRow label="Tjeneste" value={service.name} />
        <SummaryRow label="Dato" value={dateStr} />
        <SummaryRow label="Tid" value={`${state.time} — ${endStr} (${service.duration} min)`} />
        <SummaryRow label="Sted" value="Gamle Fredrikstad GK" />
        <div className="flex justify-between items-end mt-3 pt-3 border-t border-white/15">
          <div className="text-[10px] uppercase tracking-wider text-surface/40">Total</div>
          <div>
            <span className="text-[28px] font-extrabold text-secondary-fixed tracking-tight">
              {service.price.toLocaleString("nb-NO")}
            </span>
            <span className="text-[11px] text-surface/40 ml-1">{periodLabel}</span>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-on-surface-variant mb-2.5">
          Hva vil du jobbe med? (valgfritt)
        </div>
        <Icon name="center_focus_strong"AreaChips selected={state.focusAreas} onToggle={toggleFocus} />
        <textarea
          rows={2}
          value={state.notes}
          onChange={(e) => updateState({ notes: e.target.value })}
          placeholder="Beskriv utfordringen din (valgfritt)..."
          maxLength={500}
          className="w-full mt-2.5 px-3.5 py-3 rounded-[10px] bg-surface border-2 border-transparent focus:border-primary outline-none text-[13px] text-on-surface resize-none"
        />
      </div>

      <div className="mb-5">
        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-on-surface-variant mb-2.5">
          Dine opplysninger
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <FormField
            label="Navn *"
            value={state.name}
            onChange={(v) => updateState({ name: v })}
            prefilled={isLoggedIn && state.name.length > 0}
          />
          <FormField
            label="E-post *"
            type="email"
            value={state.email}
            onChange={(v) => updateState({ email: v })}
            prefilled={isLoggedIn && state.email.length > 0}
          />
          <FormField
            label="Telefon"
            type="tel"
            value={state.phone}
            onChange={(v) => updateState({ phone: v })}
            prefilled={isLoggedIn && state.phone.length > 0}
          />
          <FormField
            label="Handicap"
            value={state.handicap}
            onChange={(v) => updateState({ handicap: v })}
            placeholder="f.eks. 12.5"
          />
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-surface">
        <button
          type="button"
          onClick={() => updateState({ acceptedTerms: !state.acceptedTerms })}
          className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all mt-0.5 ${
            state.acceptedTerms
              ? "bg-primary border-primary"
              : "bg-surface-container-lowest border-outline-variant"
          }`}
        >
          {state.acceptedTerms && (
            <svg className="w-3 h-3 text-surface" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
        <div className="text-[11px] text-on-surface leading-relaxed">
          {hasSubscription ? (
            <>Jeg bekrefter bookingen. Denne timen er inkludert i mitt abonnement. Avbestilling minst 24 timer for.</>
          ) : service.isSubscription ? (
            <>
              Jeg godkjenner at belopet pa <strong>{service.price.toLocaleString("nb-NO")} {periodLabel}</strong> trekkes automatisk, og bekrefter at jeg har lest{" "}
              <a href="/vilkar" className="text-primary font-semibold">kanselleringspolicyen</a>. Avbestilling minst 24 timer for.
            </>
          ) : (
            <>
              Jeg godtar{" "}
              <a href="/vilkar" className="text-primary font-semibold">vilkarene</a> og bekrefter at jeg har lest{" "}
              <a href="/vilkar" className="text-primary font-semibold">kanselleringspolicyen</a>. Avbestilling minst 24 timer for.
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full mt-5 py-4 rounded-[14px] bg-secondary-fixed text-primary text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-95 hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Ga til betaling
        <Icon name="chevron_right" className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </Drawer>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/8 last:border-0">
      <span className="text-xs text-surface/50">{label}</span>
      <span className="text-[13px] font-semibold">{value}</span>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  prefilled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  prefilled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`px-3.5 py-3 rounded-[10px] border-2 border-transparent focus:border-primary outline-none text-[13px] text-on-surface ${
          prefilled ? "bg-surface" : "bg-surface"
        }`}
      />
    </div>
  );
}
