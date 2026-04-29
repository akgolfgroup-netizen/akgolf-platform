"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import type { BookingServiceType, BookingMode, BookingStep } from "./booking-types";
import { STEP_CONFIG } from "./booking-types";
import { useBookingWizard } from "./use-booking-wizard";
import { ServiceSelector } from "./service-selector";
import { BookingDatePicker } from "./date-picker";
import { TimeSlots } from "./time-slots";
import { BookingSummary } from "./booking-summary";

interface InstructorPickerProps {
  service: BookingServiceType;
  onSelect: (inst: BookingServiceType["instructors"][0]) => void;
  selected: BookingServiceType["instructors"][0] | null;
}

function InstructorPicker({ service, onSelect, selected }: InstructorPickerProps) {
  if (service.instructors.length <= 1) return null;

  return (
    <div className="mb-6">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted mb-3">
        Velg instruktør
      </p>
      <div className="flex gap-2 flex-wrap">
        {service.instructors.map((inst) => {
          const isActive = selected?.id === inst.id;
          return (
            <button
              key={inst.id}
              type="button"
              onClick={() => onSelect(inst)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-ink text-card border-ink"
                  : "bg-card text-ink border-line hover:border-ink/30"
              }`}
            >
              {inst.user.image ? (
                <Image
                  src={inst.user.image}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary-soft flex items-center justify-center text-[11px] font-bold text-primary">
                  {inst.user.name?.charAt(0) ?? "?"}
                </div>
              )}
              {inst.user.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Progress Bar — Brand Guide V2.0 ---- */

function ProgressBar({ steps, currentStep }: { steps: BookingStep[]; currentStep: BookingStep }) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
      {steps.map((s, i) => {
        const isActive = s === currentStep;
        const isCompleted = i < currentIndex;
        return (
          <div key={s} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-[22px] h-[22px] rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-ink text-card"
                    : isCompleted
                      ? "bg-success text-card"
                      : "bg-line-soft text-ink"
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3" strokeWidth={3} /> : <span className="text-[10px] font-bold">{i + 1}</span>}
              </div>
              <span
                className={`hidden sm:inline ${
                  isActive ? "text-ink" : "text-ink-muted"
                }`}
              >
                {STEP_CONFIG[s].label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-9 h-px transition-colors ${
                  isCompleted ? "bg-success" : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---- Main Wizard — Brand Guide V2.0 ---- */

interface BookingWizardProps {
  mode: BookingMode;
  services?: BookingServiceType[];
  onComplete?: (data: { bookingId: string; redirectUrl?: string; isNewUser?: boolean }) => void;
}

export function BookingWizard({ mode, services: preloadedServices, onComplete }: BookingWizardProps) {
  const [services, setServices] = useState<BookingServiceType[]>(preloadedServices ?? []);
  const [loadingServices, setLoadingServices] = useState(!preloadedServices);

  useEffect(() => {
    if (preloadedServices) return;
    fetch("/api/portal/public/service-types")
      .then((res) => res.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false));
  }, [preloadedServices]);

  const wizard = useBookingWizard({ mode, onBookingComplete: onComplete });
  const { state, visibleSteps, goBack } = wizard;
  const showBackButton = state.step !== "service";

  if (loadingServices) {
    return (
      <div className="bg-card border border-line rounded-2xl p-12 flex items-center justify-center gap-3 text-ink-muted">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-[14px]">Laster tilgjengelige tjenester...</span>
      </div>
    );
  }

  return (
    <div className="bg-card border border-line rounded-2xl p-6 sm:p-8 w-full max-w-2xl mx-auto shadow-card">
      <ProgressBar steps={visibleSteps} currentStep={state.step} />

      {showBackButton && (
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-1.5 text-[13px] font-medium text-ink-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
          Tilbake
        </button>
      )}

      <AnimatePresence mode="wait">
        {state.step === "service" && (
          <StepWrapper key="service">
            <ServiceSelector services={services} onSelect={wizard.selectService} />
          </StepWrapper>
        )}

        {state.step === "datetime" && state.selectedService && (
          <StepWrapper key="datetime">
            <div className="mb-6">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">
                / Steg 2 — Velg dato og tid
              </div>
              <h2 className="font-inter-tight text-[24px] font-bold leading-tight tracking-tight text-ink mb-1">
                {state.selectedService.name}
              </h2>
              {state.selectedInstructor && (
                <p className="text-[13px] text-ink-muted">
                  med {state.selectedInstructor.user.name}
                </p>
              )}
            </div>

            <InstructorPicker
              service={state.selectedService}
              onSelect={wizard.selectInstructor}
              selected={state.selectedInstructor}
            />

            {state.selectedInstructor && (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
                <BookingDatePicker
                  selected={state.selectedDate}
                  onSelect={wizard.selectDate}
                />
                <TimeSlots
                  date={state.selectedDate}
                  slots={state.availableSlots}
                  loading={state.loadingSlots}
                  selectedSlot={state.selectedSlot}
                  onSelect={wizard.selectSlot}
                />
              </div>
            )}
          </StepWrapper>
        )}

        {state.step === "details" && state.selectedService && state.selectedInstructor && state.selectedSlot && (
          <StepWrapper key="details">
            <BookingSummary
              mode={mode}
              service={state.selectedService}
              instructor={state.selectedInstructor}
              slot={state.selectedSlot}
              customerName={state.customerName}
              customerEmail={state.customerEmail}
              customerPhone={state.customerPhone}
              onSetField={wizard.setCustomerField}
              onBook={wizard.handleBook}
              booking={state.booking}
              showDetails={true}
              isDetailsValid={wizard.validateCustomerDetails()}
              onProceedToConfirm={() => wizard.setStep("confirm")}
            />
          </StepWrapper>
        )}

        {state.step === "confirm" && state.selectedService && state.selectedInstructor && state.selectedSlot && (
          <StepWrapper key="confirm">
            <BookingSummary
              mode={mode}
              service={state.selectedService}
              instructor={state.selectedInstructor}
              slot={state.selectedSlot}
              customerName={state.customerName}
              customerEmail={state.customerEmail}
              customerPhone={state.customerPhone}
              onSetField={wizard.setCustomerField}
              onBook={wizard.handleBook}
              booking={state.booking}
              showDetails={false}
              isDetailsValid={wizard.validateCustomerDetails()}
            />
          </StepWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
