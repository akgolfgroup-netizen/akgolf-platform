"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import type {
  BookingServiceType,
  BookingInstructor,
  BookingStep,
  BookingMode,
  BookingWizardState,
} from "./booking-types";
import { getVisibleSteps } from "./booking-types";

interface UseBookingWizardOptions {
  mode: BookingMode;
  onBookingComplete?: (data: { bookingId: string; redirectUrl?: string; isNewUser?: boolean }) => void;
}

export function useBookingWizard({ mode, onBookingComplete }: UseBookingWizardOptions) {
  const [state, setState] = useState<BookingWizardState>({
    step: "service",
    selectedService: null,
    selectedInstructor: null,
    selectedDate: null,
    selectedSlot: null,
    availableSlots: [],
    loadingSlots: false,
    booking: false,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const visibleSteps = getVisibleSteps(mode);

  const setStep = useCallback((step: BookingStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const selectService = useCallback(
    (service: BookingServiceType) => {
      if (service.instructors.length === 1) {
        setState((prev) => ({
          ...prev,
          selectedService: service,
          selectedInstructor: service.instructors[0],
          step: "datetime",
        }));
      } else {
        setState((prev) => ({
          ...prev,
          selectedService: service,
          selectedInstructor: null,
          step: "datetime",
        }));
      }
    },
    []
  );

  const selectInstructor = useCallback((instructor: BookingInstructor) => {
    setState((prev) => ({
      ...prev,
      selectedInstructor: instructor,
      selectedDate: null,
      selectedSlot: null,
      availableSlots: [],
    }));
  }, []);

  const selectDate = useCallback(
    async (date: Date) => {
      if (!state.selectedService || !state.selectedInstructor) return;

      setState((prev) => ({
        ...prev,
        selectedDate: date,
        selectedSlot: null,
        availableSlots: [],
        loadingSlots: true,
      }));

      try {
        const dateStr = format(date, "yyyy-MM-dd");
        const res = await fetch(
          `/api/portal/public/slots?serviceTypeId=${state.selectedService.id}&instructorId=${state.selectedInstructor.id}&date=${dateStr}`
        );
        const slots = await res.json();
        setState((prev) => ({
          ...prev,
          availableSlots: Array.isArray(slots) ? slots : [],
          loadingSlots: false,
        }));
      } catch {
        setState((prev) => ({ ...prev, availableSlots: [], loadingSlots: false }));
      }
    },
    [state.selectedService, state.selectedInstructor]
  );

  const selectSlot = useCallback(
    (slot: string) => {
      const nextStep = mode === "portal" ? "confirm" : "details";
      setState((prev) => ({ ...prev, selectedSlot: slot, step: nextStep }));
    },
    [mode]
  );

  const setCustomerField = useCallback(
    (field: "customerName" | "customerEmail" | "customerPhone", value: string) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validateCustomerDetails = useCallback((): boolean => {
    if (mode === "portal") return true;
    const { customerName, customerEmail } = state;
    if (!customerName.trim() || customerName.length < 2) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(customerEmail);
  }, [mode, state.customerName, state.customerEmail]);

  const goBack = useCallback(() => {
    const currentIndex = visibleSteps.indexOf(state.step);
    if (currentIndex > 0) {
      const prevStep = visibleSteps[currentIndex - 1];
      if (prevStep === "service") {
        setState((prev) => ({
          ...prev,
          step: "service",
          selectedService: null,
          selectedInstructor: null,
          selectedDate: null,
          selectedSlot: null,
          availableSlots: [],
        }));
      } else {
        setState((prev) => ({ ...prev, step: prevStep }));
      }
    }
  }, [state.step, visibleSteps]);

  const handleBook = useCallback(
    async (paymentMethod: "STRIPE" = "STRIPE") => {
      const { selectedService, selectedInstructor, selectedSlot, customerEmail, customerName } = state;
      if (!selectedService || !selectedInstructor || !selectedSlot) return;

      setState((prev) => ({ ...prev, booking: true }));

      try {
        const body: Record<string, string> = {
          serviceTypeId: selectedService.id,
          instructorId: selectedInstructor.id,
          startTime: selectedSlot,
          paymentMethod,
        };

        if (mode === "public") {
          body.email = customerEmail.trim().toLowerCase();
          body.name = customerName.trim();
        }

        const res = await fetch("/api/booking/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          onBookingComplete?.(data);
        } else {
          const error = await res.json().catch(() => ({ error: "Ukjent feil" }));
          alert(error.error || "Booking feilet. Prøv igjen.");
        }
      } catch {
        alert("Noe gikk galt. Prøv igjen.");
      } finally {
        setState((prev) => ({ ...prev, booking: false }));
      }
    },
    [state, mode, onBookingComplete]
  );

  return {
    state,
    visibleSteps,
    setStep,
    selectService,
    selectInstructor,
    selectDate,
    selectSlot,
    setCustomerField,
    validateCustomerDetails,
    goBack,
    handleBook,
  };
}
