"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useEffect } from "react";
import Image from "next/image";

import { motion, AnimatePresence } from "framer-motion";
import type { BookingServiceType, BookingMode, BookingStep } from "./booking-types";
import { STEP_CONFIG } from "./booking-types";
import { useBookingWizard } from "./use-booking-wizard";
import { ServiceSelector } from "./service-selector";
import { BookingDatePicker } from "./date-picker";
import { TimeSlots } from "./time-slots";
import { BookingSummary } from "./booking-summary";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";

interface InstructorPickerProps {
  service: BookingServiceType;
  onSelect: (inst: BookingServiceType["instructors"][0]) => void;
  selected: BookingServiceType["instructors"][0] | null;
}

function InstructorPicker({ service, onSelect, selected }: InstructorPickerProps) {
  if (service.instructors.length <= 1) return null;

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-grey-400 uppercase tracking-wider mb-3">
        Velg instruktør
      </p>
      <div className="flex gap-2 flex-wrap">
        {service.instructors.map((inst) => {
          const isActive = selected?.id === inst.id;
          return (
            <button
              key={inst.id}
              onClick={() => onSelect(inst)}
              className={[
                "flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-grey-200 hover:border-grey-300",
              ].join(" ")}
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
                <div className="w-6 h-6 rounded-full bg-[#F5F8F7] flex items-center justify-center text-xs font-bold text-grey-400">
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

/* ---- Progress Bar ---- */

function ProgressBar({ steps, currentStep }: { steps: BookingStep[]; currentStep: BookingStep }) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((s, i) => {
        const isActive = s === currentStep;
        const isCompleted = i < currentIndex;
        return (
          <div key={s} className="flex items-center gap-1">
            <div
              className={[
                "flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-300",
                isActive
                  ? "bg-[#0A1F18] text-white"
                  : isCompleted
                    ? "bg-[#E8F5EF] text-success border-2 border-success"
                    : "bg-[#F5F8F7] text-grey-400 border border-grey-200",
              ].join(" ")}
            >
              {isCompleted ? <Icon name="check" className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span
              className={[
                "text-xs font-medium hidden sm:inline",
                isActive ? "text-[#0A1F18]" : "text-grey-400",
              ].join(" ")}
            >
              {STEP_CONFIG[s].label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={[
                  "w-8 h-0.5 mx-1",
                  isCompleted ? "bg-success" : "bg-grey-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---- Main Wizard ---- */

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
      <div className="flex items-center justify-center py-20 gap-3 text-grey-400">
        <Icon name="progress_activity" className="w-5 h-5 animate-spin" />
        <span>Laster tilgjengelige tjenester...</span>
      </div>
    );
  }

  return (
    <PremiumCard className="w-full max-w-2xl mx-auto" padding="lg">
      <ProgressBar steps={visibleSteps} currentStep={state.step} />

      {showBackButton && (
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-sm text-grey-400 hover:text-black transition-colors mb-4"
        >
          <Icon name="arrow_back" className="w-3.5 h-3.5" />
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
            <h2 className="text-2xl font-semibold text-black mb-1 tracking-tight">
              Velg dato og tid
            </h2>
            <p className="text-sm text-grey-400 mb-6">
              {state.selectedService.name}
              {state.selectedInstructor ? ` med ${state.selectedInstructor.user.name}` : ""}
            </p>

            <InstructorPicker
              service={state.selectedService}
              onSelect={wizard.selectInstructor}
              selected={state.selectedInstructor}
            />

            {state.selectedInstructor && (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6">
                <div className="bg-white rounded-xl border border-grey-200 p-4">
                  <BookingDatePicker
                    selected={state.selectedDate}
                    onSelect={wizard.selectDate}
                  />
                </div>
                <div className="bg-white rounded-xl border border-grey-200 p-4">
                  <TimeSlots
                    date={state.selectedDate}
                    slots={state.availableSlots}
                    loading={state.loadingSlots}
                    selectedSlot={state.selectedSlot}
                    onSelect={wizard.selectSlot}
                  />
                </div>
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
    </PremiumCard>
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
