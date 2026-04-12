"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import {
  type ServiceType,
  type InstructorOption,
  type BookingStep,
  type BookingState,
  STEP_LABELS,
  INITIAL_BOOKING_STATE,
  getVisibleSteps,
} from "./booking-types";
import { ServiceSelector } from "./service-selector";
import { BookingDatePicker } from "./date-picker";
import { TimeSlots } from "./time-slots";
import { BookingSummary } from "./booking-summary";

const STEP_INITIAL = { opacity: 0, x: 40 };
const STEP_ANIMATE = { opacity: 1, x: 0 };
const STEP_EXIT = { opacity: 0, x: -40 };
const STEP_TRANSITION = { duration: 0.25, ease: "easeInOut" as const };

export function BookingWizard() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [state, setState] = useState<BookingState>(INITIAL_BOOKING_STATE);
  const [step, setStep] = useState<BookingStep>("service");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetch("/api/portal/public/service-types")
      .then((res) => res.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setLoadingServices(false);
      })
      .catch(() => setLoadingServices(false));
  }, []);

  const visibleSteps = getVisibleSteps(
    (state.service?.instructors.length ?? 0) > 1
  );

  const handleSelectService = useCallback((svc: ServiceType) => {
    setState((s) => ({ ...s, service: svc, instructor: null, date: null, slot: null }));
    if (svc.instructors.length === 1) {
      setState((s) => ({ ...s, instructor: svc.instructors[0] }));
      setStep("date");
    } else {
      setStep("instructor");
    }
  }, []);

  const handleSelectInstructor = useCallback((inst: InstructorOption) => {
    setState((s) => ({ ...s, instructor: inst, date: null, slot: null }));
    setStep("date");
  }, []);

  const handleSelectDate = useCallback(
    async (date: Date) => {
      setState((s) => ({ ...s, date, slot: null }));
      setAvailableSlots([]);
      setLoadingSlots(true);
      try {
        const dateStr = format(date, "yyyy-MM-dd");
        const res = await fetch(
          `/api/portal/public/slots?serviceTypeId=${state.service!.id}&instructorId=${state.instructor!.id}&date=${dateStr}`
        );
        const slots = await res.json();
        setAvailableSlots(Array.isArray(slots) ? slots : []);
      } catch {
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [state.service, state.instructor]
  );

  const handleSelectSlot = useCallback((slot: string) => {
    setState((s) => ({ ...s, slot }));
    setStep("time");
  }, []);

  const handleConfirmTime = useCallback(() => {
    setStep("summary");
  }, []);

  const handleUpdateCustomer = useCallback(
    (field: "customerName" | "customerEmail" | "customerPhone", value: string) => {
      setState((s) => ({ ...s, [field]: value }));
    },
    []
  );

  const handleBook = useCallback(async () => {
    if (!state.service || !state.instructor || !state.slot) return;
    setBooking(true);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTypeId: state.service.id,
          instructorId: state.instructor.id,
          startTime: state.slot,
          paymentMethod: "STRIPE",
          email: state.customerEmail.trim().toLowerCase(),
          name: state.customerName.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
          return;
        }
        router.push(`/booking/${data.bookingId}/confirmation`);
        router.refresh();
      } else {
        const error = await res.json().catch(() => ({ error: "Ukjent feil" }));
        alert(error.error || "Booking feilet. Prov igjen.");
      }
    } catch {
      alert("Noe gikk galt. Prov igjen.");
    } finally {
      setBooking(false);
    }
  }, [state, router]);

  const handleBack = useCallback(() => {
    const idx = visibleSteps.indexOf(step);
    if (idx > 0) {
      setStep(visibleSteps[idx - 1]);
    }
  }, [step, visibleSteps]);

  if (loadingServices) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-[var(--color-muted)]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Laster tilgjengelige tjenester...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-container max-w-3xl py-12">
      {/* Progress bar */}
      <StepProgress steps={visibleSteps} currentStep={step} />

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === "service" && (
          <motion.div key="service" initial={STEP_INITIAL} animate={STEP_ANIMATE} exit={STEP_EXIT} transition={STEP_TRANSITION}>
            <ServiceSelector
              services={services}
              onSelect={handleSelectService}
            />
          </motion.div>
        )}

        {step === "instructor" && state.service && (
          <motion.div key="instructor" initial={STEP_INITIAL} animate={STEP_ANIMATE} exit={STEP_EXIT} transition={STEP_TRANSITION}>
            <ServiceSelector
              services={services}
              onSelect={handleSelectService}
              instructorMode
              selectedService={state.service}
              onSelectInstructor={handleSelectInstructor}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {step === "date" && state.service && state.instructor && (
          <motion.div key="date" initial={STEP_INITIAL} animate={STEP_ANIMATE} exit={STEP_EXIT} transition={STEP_TRANSITION}>
            <BookingDatePicker
              serviceName={state.service.name}
              instructorName={state.instructor.user.name ?? ""}
              selectedDate={state.date}
              onSelectDate={handleSelectDate}
              availableSlots={availableSlots}
              loadingSlots={loadingSlots}
              onSelectSlot={handleSelectSlot}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {step === "time" && state.service && state.slot && (
          <motion.div key="time" initial={STEP_INITIAL} animate={STEP_ANIMATE} exit={STEP_EXIT} transition={STEP_TRANSITION}>
            <TimeSlots
              service={state.service}
              instructor={state.instructor!}
              slot={state.slot}
              date={state.date!}
              onConfirm={handleConfirmTime}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {step === "summary" && state.service && state.slot && (
          <motion.div key="summary" initial={STEP_INITIAL} animate={STEP_ANIMATE} exit={STEP_EXIT} transition={STEP_TRANSITION}>
            <BookingSummary
              state={state}
              onUpdateCustomer={handleUpdateCustomer}
              onBook={handleBook}
              booking={booking}
              onBack={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Progress indicator ─── */

function StepProgress({
  steps,
  currentStep,
}: {
  steps: BookingStep[];
  currentStep: BookingStep;
}) {
  const currentIdx = steps.indexOf(currentStep);

  return (
    <nav aria-label="Bookingsteg" className="mb-10">
      <ol className="flex items-center justify-center gap-0">
        {steps.map((s, i) => {
          const isActive = s === currentStep;
          const isCompleted = i < currentIdx;

          return (
            <li key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    text-sm font-semibold transition-all duration-300
                    ${isActive
                      ? "bg-[var(--color-grey-900)] text-white"
                      : isCompleted
                        ? "border-2 border-[var(--color-grey-900)] bg-transparent text-[var(--color-grey-900)]"
                        : "border-2 border-[var(--color-grey-200)] bg-[var(--color-grey-50)] text-[var(--color-muted)]"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`
                    text-xs mt-2 font-medium transition-colors duration-300
                    ${isActive ? "text-[var(--color-grey-900)]" : "text-[var(--color-muted)]"}
                  `}
                >
                  {STEP_LABELS[s]}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`
                    w-12 sm:w-16 h-0.5 mx-2 transition-colors duration-300
                    ${isCompleted ? "bg-[var(--color-grey-900)]" : "bg-[var(--color-grey-200)]"}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
