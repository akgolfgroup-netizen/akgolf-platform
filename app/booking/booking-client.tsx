"use client";

import { useState } from "react";
import { BookingNav } from "./components-v2/BookingNav";
import { StepIndicator } from "./components-v2/StepIndicator";
import { TrainerCard } from "./components-v2/TrainerCard";
import { DateTimeDrawer } from "./components-v2/DateTimeDrawer";
import { ConfirmDrawer } from "./components-v2/ConfirmDrawer";
import { PaymentDrawer } from "./components-v2/PaymentDrawer";
import { SuccessDrawer } from "./components-v2/SuccessDrawer";
import { INITIAL_BOOKING_STATE } from "./components-v2/types";
import type { BookingState, DrawerType, TrainerWithServices } from "./components-v2/types";

interface BookingClientProps {
  trainers: TrainerWithServices[];
  prefilledUser: {
    name: string;
    email: string;
    phone: string;
  } | null;
  isLoggedIn: boolean;
  hasSubscription: boolean;
}

export function BookingClient({ trainers, prefilledUser, isLoggedIn, hasSubscription }: BookingClientProps) {
  const [state, setState] = useState<BookingState>({
    ...INITIAL_BOOKING_STATE,
    name: prefilledUser?.name ?? "",
    email: prefilledUser?.email ?? "",
    phone: prefilledUser?.phone ?? "",
  });

  const [drawer, setDrawer] = useState<DrawerType>(null);

  const selectedTrainer = trainers.find((t) => t.id === state.trainerId) ?? null;
  const selectedService = selectedTrainer?.services.find((s) => s.id === state.serviceId) ?? null;

  const currentStep: 0 | 1 | 2 | 3 | 4 = !state.trainerId
    ? 0
    : drawer === null && !state.serviceId
    ? 0
    : drawer === null && state.serviceId
    ? 1
    : drawer === "datetime"
    ? 2
    : drawer === "confirm"
    ? 3
    : drawer === "payment" || drawer === "success"
    ? 4
    : 0;

  const updateState = (patch: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleSelectTrainer = (trainerId: string) => {
    setState((prev) => ({ ...prev, trainerId, serviceId: null }));
  };

  const handleSelectService = (serviceId: string) => {
    setState((prev) => ({ ...prev, serviceId }));
    setDrawer("datetime");
  };

  const handleDateTimeConfirm = (date: string, time: string, slotIso: string) => {
    setState((prev) => ({ ...prev, date, time, slotIso }));
    setDrawer("confirm");
  };

  const handleConfirmContinue = () => {
    setDrawer("payment");
  };

  const handlePaymentSuccess = () => {
    setDrawer("success");
  };

  const trainerFirstName = selectedTrainer?.name.split(" ")[0] ?? "";

  return (
    <div className="min-h-screen bg-surface">
      <BookingNav />

      <main className="max-w-[720px] mx-auto px-5 pt-7 pb-32">
        <StepIndicator currentStep={currentStep} />

        <h1 className="text-[26px] font-bold text-on-surface tracking-tight mb-1">
          Hvem vil du trene med?
        </h1>
        <p className="text-sm text-muted mb-7">
          Velg din coach for a se tilgjengelige tjenester
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trainers.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              isSelected={state.trainerId === trainer.id}
              selectedServiceId={state.serviceId}
              onSelectTrainer={() => handleSelectTrainer(trainer.id)}
              onSelectService={handleSelectService}
            />
          ))}
        </div>
      </main>

      <DateTimeDrawer
        isOpen={drawer === "datetime"}
        onClose={() => setDrawer(null)}
        serviceTypeId={state.serviceId}
        instructorId={state.trainerId}
        serviceName={selectedService?.name ?? ""}
        trainerFirstName={trainerFirstName}
        onConfirm={handleDateTimeConfirm}
      />

      <ConfirmDrawer
        isOpen={drawer === "confirm"}
        onClose={() => setDrawer("datetime")}
        onContinue={handleConfirmContinue}
        state={state}
        updateState={updateState}
        service={selectedService}
        trainerName={selectedTrainer?.name ?? ""}
        isLoggedIn={isLoggedIn}
        hasSubscription={hasSubscription}
      />

      <PaymentDrawer
        isOpen={drawer === "payment"}
        onClose={() => setDrawer("confirm")}
        state={state}
        service={selectedService}
        trainerId={state.trainerId ?? ""}
        onSuccess={handlePaymentSuccess}
      />

      <SuccessDrawer
        isOpen={drawer === "success"}
        state={state}
        service={selectedService}
        trainerName={selectedTrainer?.name ?? ""}
      />
    </div>
  );
}
