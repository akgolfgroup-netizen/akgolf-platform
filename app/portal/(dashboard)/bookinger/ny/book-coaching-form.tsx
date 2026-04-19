"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format, addDays, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";

import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";

interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  category: string;
  duration: number;
  price: number;
  color: string | null;
  maxStudents: number;
  instructors: {
    id: string;
    title: string | null;
    user: { name: string | null; image: string | null };
  }[];
}

interface Props {
  serviceTypes: ServiceType[];
}

type Step = "service" | "instructor" | "date" | "confirm";

export function BookCoachingForm({ serviceTypes }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<ServiceType["instructors"][0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  const formatPrice = (price: number) => {
    // Prisene er lagret i kroner
    return price.toLocaleString("nb-NO", { minimumFractionDigits: 0 }) + " kr";
  };

  const handleSelectService = (svc: ServiceType) => {
    setSelectedService(svc);
    if (svc.instructors.length === 1) {
      setSelectedInstructor(svc.instructors[0]);
      setStep("date");
    } else {
      setStep("instructor");
    }
  };

  const handleSelectInstructor = (inst: ServiceType["instructors"][0]) => {
    setSelectedInstructor(inst);
    setStep("date");
  };

  const handleSelectDate = async (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setLoading(true);

    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const res = await fetch(
        `/api/portal/public/slots?serviceTypeId=${selectedService!.id}&instructorId=${selectedInstructor!.id}&date=${dateStr}`
      );
      const slots = await res.json();
      setAvailableSlots(Array.isArray(slots) ? slots : []);
    } catch {
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (paymentMethod: "STRIPE") => {
    if (!selectedService || !selectedInstructor || !selectedSlot) return;
    setBooking(true);

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTypeId: selectedService.id,
          instructorId: selectedInstructor.id,
          startTime: selectedSlot,
          paymentMethod,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.redirectUrl) {
          // Stripe checkout returnerer full URL, interne stier er relative
          if (data.redirectUrl.startsWith("http")) {
            window.location.href = data.redirectUrl;
          } else {
            router.push(data.redirectUrl);
          }
        } else if (data.bookingId) {
          router.push(`/booking/${data.bookingId}/confirmation`);
        } else {
          router.push("/portal/bookinger");
        }
        router.refresh();
      } else {
        const error = await res.json().catch(() => ({ error: "Ukjent feil" }));
        alert(error.error || "Booking feilet. Prøv igjen.");
      }
    } catch {
      alert("Noe gikk galt. Prøv igjen.");
    } finally {
      setBooking(false);
    }
  };

  const dates = Array.from({ length: 14 }, (_, i) => addDays(startOfDay(new Date()), i + 1));

  const stepLabels = {
    service: "Tjeneste",
    instructor: "Trener",
    date: "Tidspunkt",
    confirm: "Bekreft",
  };

  return (
    <PremiumCard className="max-w-2xl mx-auto" noHover>
      {/* Progress Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-center">
          {(Object.keys(stepLabels) as Step[]).map((s, index, arr) => {
            const isActive = s === step;
            const isCompleted =
              (step === "instructor" && s === "service") ||
              (step === "date" && (s === "service" || s === "instructor")) ||
              (step === "confirm" && s !== "confirm");

            return (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-[background-color,border-color,color] duration-300 ${
                      isActive
                        ? "bg-on-surface text-white border-none"
                        : isCompleted
                          ? "bg-outline-variant text-white border-2 border-on-surface"
                          : "bg-surface-container text-on-surface-variant border-2 border-outline-variant"
                    }`}
                    whileHover={!isActive ? { scale: 1.05 } : {}}
                  >
                    {isCompleted && s !== step ? (
                      <Icon name="check" className={`w-5 h-5 ${isActive ? "text-white" : "text-on-surface"}`} />
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isActive ? "text-on-surface" : "text-on-surface-variant"
                    }`}
                  >
                    {stepLabels[s]}
                  </span>
                </div>
                {index < arr.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      isCompleted ? "bg-on-surface" : "bg-surface-container"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Service Selection */}
        {step === "service" && (
          <motion.div
            key="service"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold mb-3 text-on-surface">
                Velg din treningsform
              </h1>
              <p className="text-on-surface-variant">
                Alle våre coaching-timer inkluderer TrackMan-analyse og personlig tilpasning
              </p>
            </div>

            <div className="space-y-4">
              {serviceTypes.map((svc, index) => (
                <motion.button
                  key={svc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectService(svc)}
                  className="w-full text-left group"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="rounded-[20px] p-6 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border bg-surface border-outline-variant hover:border-on-surface/20 hover:-translate-y-px hover:shadow-lg">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: svc.color ?? "#0A1F18" }}
                          />
                          <h3 className="text-lg font-semibold transition-colors text-on-surface">
                            {svc.name}
                          </h3>
                        </div>
                        {svc.description && (
                          <p className="text-sm leading-relaxed mb-4 text-on-surface-variant">
                            {svc.description}
                          </p>
                        )}
                        <div className="flex items-center gap-6">
                          <span className="flex items-center gap-2 text-sm text-on-surface-variant tabular-nums">
                            <Icon name="schedule" className="w-4 h-4 text-on-surface" />
                            {svc.duration} minutter
                          </span>
                          <span className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <Icon name="person" className="w-4 h-4 text-on-surface" />
                            {svc.maxStudents === 1 ? "Individuell" : `Gruppe (max ${svc.maxStudents})`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-semibold text-on-surface tabular-nums">
                          {formatPrice(svc.price)}
                        </span>
                        <Icon name="chevron_right" className="w-5 h-5 mt-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-on-surface" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Instructor Selection */}
        {step === "instructor" && selectedService && (
          <motion.div
            key="instructor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => { setStep("service"); setSelectedService(null); }}
              className="flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-70 text-on-surface-variant"
            >
              <Icon name="arrow_back" className="w-4 h-4" />
              Tilbake til tjenester
            </button>

            <h1 className="text-3xl font-semibold mb-2 text-on-surface">
              Velg instruktør
            </h1>
            <p className="mb-8 text-on-surface-variant">
              {selectedService.name}
            </p>

            <div className="space-y-4">
              {selectedService.instructors.map((inst, index) => (
                <motion.button
                  key={inst.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectInstructor(inst)}
                  className="w-full text-left group"
                  whileHover={{ x: 4 }}
                >
                  <div className="rounded-[20px] p-5 flex items-center gap-5 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border bg-surface border-outline-variant hover:border-on-surface/20 hover:shadow-lg">
                    {inst.user.image ? (
                      <Image
                        src={inst.user.image}
                        alt=""
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-outline-variant"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold bg-surface-container text-on-surface border-2 border-outline-variant">
                        {inst.user.name?.charAt(0) ?? "?"}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 text-on-surface">
                        {inst.user.name}
                      </h3>
                      {inst.title && (
                        <p className="text-on-surface-variant">{inst.title}</p>
                      )}
                    </div>
                    <Icon name="chevron_right" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-on-surface" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Date & Time */}
        {step === "date" && selectedService && selectedInstructor && (
          <motion.div
            key="date"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => {
                if (selectedService.instructors.length === 1) {
                  setStep("service");
                  setSelectedService(null);
                  setSelectedInstructor(null);
                } else {
                  setStep("instructor");
                  setSelectedInstructor(null);
                }
              }}
              className="flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-70 text-on-surface-variant"
            >
              <Icon name="arrow_back" className="w-4 h-4" />
              Tilbake
            </button>

            <h1 className="text-3xl font-semibold mb-2 text-on-surface">
              Velg dato og tid
            </h1>
            <p className="mb-8 text-on-surface-variant">
              {selectedService.name} med {selectedInstructor.user.name}
            </p>

            {/* Date Pills */}
            <div className="mb-8">
              <h3 className="text-[11px] font-semibold mb-4 uppercase tracking-[0.08em] text-outline">
                Velg dato
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                {dates.map((date) => {
                  const isSelected = selectedDate && format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                  return (
                    <motion.button
                      key={date.toISOString()}
                      onClick={() => !isWeekend && handleSelectDate(date)}
                      disabled={isWeekend}
                      className={`flex-shrink-0 rounded-[20px] p-4 text-center min-w-[80px] transition-all duration-200 ${
                        isSelected
                          ? "bg-on-surface border-none shadow-lg"
                          : "bg-surface border border-outline-variant hover:border-on-surface/20"
                      }`}
                      style={{ opacity: isWeekend ? 0.4 : 1 }}
                      whileHover={!isWeekend ? { scale: 1.02 } : {}}
                      whileTap={!isWeekend ? { scale: 0.98 } : {}}
                    >
                      <p className={`text-xs uppercase tracking-wide mb-1 ${isSelected ? "text-white" : "text-outline"}`}>
                        {format(date, "EEE", { locale: nb })}
                      </p>
                      <p className={`text-2xl font-semibold mb-1 tabular-nums ${isSelected ? "text-white" : "text-on-surface"}`}>
                        {format(date, "d")}
                      </p>
                      <p className={`text-xs ${isSelected ? "text-white/80" : "text-on-surface-variant"}`}>
                        {format(date, "MMM", { locale: nb })}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-[11px] font-semibold mb-4 uppercase tracking-[0.08em] text-outline">
                  Ledige tider — {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
                </h3>

                {loading ? (
                  <div className="flex items-center gap-3 py-12 text-on-surface-variant">
                    <Icon name="progress_activity" className="w-5 h-5 animate-spin" />
                    <span>Henter tilgjengelige tider...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="rounded-[20px] p-8 text-center border bg-surface border-outline-variant">
                    <Icon name="calendar_today" className="w-12 h-12 mx-auto mb-4 text-outline" />
                    <p className="text-on-surface-variant">
                      Ingen ledige tider denne dagen.
                    </p>
                    <p className="text-sm mt-1 text-outline">
                      Prøv en annen dato.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => {
                      const slotDate = new Date(slot);
                      const timeStr = format(slotDate, "HH:mm");

                      return (
                        <motion.button
                          key={slot}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setStep("confirm");
                          }}
                          className="rounded-[20px] py-4 text-sm font-medium transition-all duration-200 border bg-surface border-outline-variant text-on-surface hover:border-on-surface tabular-nums"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {timeStr}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {step === "confirm" && selectedService && selectedInstructor && selectedSlot && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setStep("date")}
              className="flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-70 text-on-surface-variant"
            >
              <Icon name="arrow_back" className="w-4 h-4" />
              Tilbake til tidspunkt
            </button>

            <h1 className="text-3xl font-semibold mb-2 text-on-surface">
              Bekreft din booking
            </h1>
            <p className="mb-8 text-on-surface-variant">
              Gjennomgå detaljene før betaling
            </p>

            {/* Summary Card */}
            <div className="rounded-[20px] p-8 mb-8 border bg-surface border-outline-variant">
              {/* Header */}
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-outline-variant">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedService.color ?? "#0A1F18" }}
                />
                <h3 className="text-xl font-semibold text-on-surface">
                  {selectedService.name}
                </h3>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container">
                    <Icon name="person" className="w-5 h-5 text-on-surface" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.08em] text-outline">Instruktør</p>
                    <p className="font-medium text-on-surface">{selectedInstructor.user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container">
                    <Icon name="calendar_today" className="w-5 h-5 text-on-surface" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.08em] text-outline">Dato og tid</p>
                    <p className="font-medium text-on-surface tabular-nums">
                      {format(new Date(selectedSlot), "EEEE d. MMMM yyyy 'kl.' HH:mm", { locale: nb })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container">
                    <Icon name="schedule" className="w-5 h-5 text-on-surface" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.08em] text-outline">Varighet</p>
                    <p className="font-medium text-on-surface tabular-nums">{selectedService.duration} minutter</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-6 border-t border-outline-variant">
                <span className="text-on-surface-variant">Totalpris</span>
                <span className="text-3xl font-semibold text-on-surface tabular-nums">
                  {formatPrice(selectedService.price)}
                </span>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="space-y-4">
              <p className="text-[11px] text-center uppercase tracking-[0.08em] text-outline">
                Velg betalingsmetode
              </p>

              <motion.button
                onClick={() => handleBook("STRIPE")}
                disabled={booking}
                className="w-full py-5 rounded-[20px] text-base font-semibold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 bg-primary text-white hover:opacity-85 hover:scale-[1.01] active:scale-[0.99] active:opacity-75"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {booking ? (
                  <>
                    <Icon name="progress_activity" className="w-5 h-5 animate-spin" />
                    <span>Behandler...</span>
                  </>
                ) : (
                  <>
                    <Icon name="credit_card" className="w-5 h-5" />
                    <span>Betal med kort</span>
                  </>
                )}
              </motion.button>

            </div>

            <p className="text-xs text-center mt-6 text-outline">
              Alle betalinger er sikre og krypterte. Du møter til timen selv om betalingen ikke er gjennomført ennå.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </PremiumCard>
  );
}
