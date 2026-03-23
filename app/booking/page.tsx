"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SubPageHero } from "@/components/website/SubPageHero";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { ProgressBar } from "./components/ProgressBar";
import { ServiceSelector } from "./components/ServiceSelector";
import { InstructorSelector } from "./components/InstructorSelector";
import { DateTimePicker } from "./components/DateTimePicker";
import { CustomerForm } from "./components/CustomerForm";
import { PaymentStep } from "./components/PaymentStep";
import { Confirmation } from "./components/Confirmation";
import type { ServiceType, Instructor } from "./types";

// All API routes are internal to this monorepo — no external proxy needed

type Step = "service" | "instructor" | "datetime" | "details" | "payment" | "confirmation";

const STEP_ORDER: Step[] = ["service", "instructor", "datetime", "details", "payment", "confirmation"];

function getStepNumber(step: Step): number {
  return STEP_ORDER.indexOf(step) + 1;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gold" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const searchParams = useSearchParams();

  const [services, setServices] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wizard state
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  // Payment state
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [creatingBooking, setCreatingBooking] = useState(false);

  // Check for payment return (Stripe redirect)
  useEffect(() => {
    const confirmed = searchParams.get("confirmed");
    const returnedBookingId = searchParams.get("bookingId");
    if (confirmed === "true" && returnedBookingId) {
      setBookingId(returnedBookingId);
      setIsNewUser(true);
      setStep("confirmation");
    }
  }, [searchParams]);

  // Fetch services
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/booking/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data);
      } catch {
        setError("Kunne ikke laste tjenester. Prøv igjen senere.");
      } finally {
        setLoadingServices(false);
      }
    }
    load();
  }, []);

  // Step handlers
  function handleServiceSelect(service: ServiceType) {
    setSelectedService(service);
    if (service.instructors.length === 1) {
      setSelectedInstructor(service.instructors[0]);
      setStep("datetime");
    } else {
      setStep("instructor");
    }
  }

  function handleInstructorSelect(instructor: Instructor) {
    setSelectedInstructor(instructor);
    setStep("datetime");
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time);
    setStep("details");
  }

  const handleCustomerSubmit = useCallback(async (data: CustomerData) => {
    setCreatingBooking(true);
    setError(null);

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTypeId: selectedService!.id,
          instructorId: selectedInstructor!.id,
          startTime: selectedTime,
          paymentMethod: "STRIPE",
          email: data.email,
          name: data.name,
          phone: data.phone || undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? "Noe gikk galt. Prøv igjen.");
        setCreatingBooking(false);
        return;
      }

      setBookingId(result.bookingId);
      setClientSecret(result.clientSecret);
      setIsNewUser(result.isNewUser ?? false);
      setStep("payment");
    } catch {
      setError("Nettverksfeil. Sjekk tilkoblingen og prøv igjen.");
    } finally {
      setCreatingBooking(false);
    }
  }, [selectedService, selectedInstructor, selectedTime]);

  function handlePaymentSuccess() {
    setStep("confirmation");
  }

  function goBack() {
    const currentIdx = STEP_ORDER.indexOf(step);
    if (currentIdx <= 0) return;

    let prevStep = STEP_ORDER[currentIdx - 1];
    if (prevStep === "instructor" && selectedService && selectedService.instructors.length === 1) {
      prevStep = "service";
    }

    setStep(prevStep);
  }

  const currentStepNum = getStepNumber(step);
  const totalSteps = 6;

  return (
    <>
      <WebsiteNav />
      <main className="min-h-screen">
        <SubPageHero
          eyebrow="Booking"
          heading="Book coaching"
          description="Velg tjeneste, trener og tidspunkt — vi tar oss av resten."
          accent="academy"
        />

        {/* Wizard content */}
        <section className="w-container pt-10 pb-20 md:pt-14 md:pb-28">
          <RevealOnScroll>
            {/* Progress bar */}
            {step !== "confirmation" && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {step !== "service" && (
                      <button
                        onClick={goBack}
                        className="p-1.5 rounded-lg hover:bg-ink-10 transition-colors text-ink-50"
                      >
                        <ArrowLeft size={18} />
                      </button>
                    )}
                    <span className="text-sm text-ink-50">
                      Steg {currentStepNum} av {totalSteps}
                    </span>
                  </div>
                  {selectedService && (
                    <span className="text-sm text-ink-50 hidden sm:block">
                      {selectedService.name}
                      {selectedInstructor ? ` · ${selectedInstructor.user.name}` : ""}
                    </span>
                  )}
                </div>
                <div className="h-1 bg-ink-10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStepNum / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 px-4 py-3 rounded-lg bg-error/5 border border-error/20 text-sm text-error"
              >
                {error}
              </motion.div>
            )}

            {/* Loading state */}
            {loadingServices ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-gold" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {step === "service" && (
                    <ServiceSelector
                      services={services}
                      onSelect={handleServiceSelect}
                    />
                  )}

                  {step === "instructor" && selectedService && (
                    <InstructorSelector
                      service={selectedService}
                      instructors={selectedService.instructors}
                      onSelect={handleInstructorSelect}
                    />
                  )}

                  {step === "datetime" && selectedService && selectedInstructor && (
                    <DateTimePicker
                      serviceTypeId={selectedService.id}
                      instructorId={selectedInstructor.id}
                      onSelect={handleTimeSelect}
                    />
                  )}

                  {step === "details" && (
                    creatingBooking ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={24} className="animate-spin text-gold mb-4" />
                        <p className="text-ink-50">Oppretter booking...</p>
                      </div>
                    ) : (
                      <CustomerForm onSubmit={handleCustomerSubmit} />
                    )
                  )}

                  {step === "payment" && clientSecret && bookingId && selectedService && (
                    <PaymentStep
                      clientSecret={clientSecret}
                      bookingId={bookingId}
                      serviceName={selectedService.name}
                      amount={selectedService.price}
                      onSuccess={handlePaymentSuccess}
                    />
                  )}

                  {step === "confirmation" && selectedService && selectedInstructor && selectedTime && (
                    <Confirmation
                      serviceName={selectedService.name}
                      instructorName={selectedInstructor.user.name ?? "Trener"}
                      dateTime={selectedTime}
                      isNewUser={isNewUser}
                    />
                  )}

                  {/* Fallback confirmation for Stripe return */}
                  {step === "confirmation" && !selectedService && (
                    <div className="text-center py-16">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6"
                      >
                        <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <h2 className="w-heading-md mb-2">Betaling mottatt!</h2>
                      <p className="text-ink-50 mb-6">
                        Bookingen din er bekreftet. Sjekk e-posten din for detaljer og innlogging.
                      </p>
                      <Link href="/" className="w-btn w-btn-primary">
                        Tilbake til forsiden
                      </Link>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </RevealOnScroll>
        </section>
      </main>
      <WebsiteFooter />
    </>
  );
}
