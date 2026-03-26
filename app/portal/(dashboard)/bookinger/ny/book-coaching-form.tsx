"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";
import { Clock, User, Calendar, ChevronRight, Loader2, CreditCard, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    // Prisene er lagret i kroner (ikke øre)
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

  const handleBook = async (paymentMethod: "STRIPE" | "VIPPS") => {
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
        if (data.bookingId) {
          if (paymentMethod === "STRIPE" && data.clientSecret) {
            router.push(`/booking/${data.bookingId}/pay`);
          } else {
            router.push(`/booking/${data.bookingId}/confirmation`);
          }
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
    <div className="max-w-2xl mx-auto">
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--color-gold)] text-white border-none"
                        : isCompleted
                          ? "bg-[rgba(176,125,79,0.2)] text-white border-2 border-[var(--color-gold)]"
                          : "bg-[rgba(15,41,80,0.3)] text-[var(--color-snow)]/70 border-2 border-[rgba(15,41,80,0.4)]"
                    }`}
                    whileHover={!isActive ? { scale: 1.05 } : {}}
                  >
                    {isCompleted && s !== step ? (
                      <Check className={`w-5 h-5 ${isActive ? "text-white" : "text-[var(--color-gold)]"}`} />
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isActive ? "text-[var(--color-gold)]" : "text-[var(--color-snow)]/70"
                    }`}
                  >
                    {stepLabels[s]}
                  </span>
                </div>
                {index < arr.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      isCompleted ? "bg-[var(--color-gold)]" : "bg-[rgba(15,41,80,0.4)]"
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
              <h1 className="text-3xl font-semibold mb-3 text-[var(--color-snow)]">
                Velg din treningsform
              </h1>
              <p className="text-[var(--color-snow)]/70">
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
                  <div className="rounded-2xl p-6 transition-all duration-300 border bg-[rgba(10,25,41,0.7)] border-[rgba(15,41,80,0.4)] hover:border-[rgba(176,125,79,0.4)]">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: svc.color ?? "#B07D4F" }}
                          />
                          <h3 className="text-lg font-semibold transition-colors text-[var(--color-snow)]">
                            {svc.name}
                          </h3>
                        </div>
                        {svc.description && (
                          <p className="text-sm leading-relaxed mb-4 text-[var(--color-snow)]/70">
                            {svc.description}
                          </p>
                        )}
                        <div className="flex items-center gap-6">
                          <span className="flex items-center gap-2 text-sm text-[var(--color-snow)]/70">
                            <Clock className="w-4 h-4 text-[var(--color-gold)]" />
                            {svc.duration} minutter
                          </span>
                          <span className="flex items-center gap-2 text-sm text-[var(--color-snow)]/70">
                            <User className="w-4 h-4 text-[var(--color-gold)]" />
                            {svc.maxStudents === 1 ? "Individuell" : `Gruppe (max ${svc.maxStudents})`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-semibold text-[var(--color-gold)]">
                          {formatPrice(svc.price)}
                        </span>
                        <ChevronRight className="w-5 h-5 mt-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-gold)]" />
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
              className="flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-70 text-[var(--color-snow)]/70"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbake til tjenester
            </button>

            <h1 className="text-3xl font-semibold mb-2 text-[var(--color-snow)]">
              Velg instruktør
            </h1>
            <p className="mb-8 text-[var(--color-snow)]/70">
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
                  <div className="rounded-2xl p-5 flex items-center gap-5 transition-all duration-300 border bg-[rgba(10,25,41,0.7)] border-[rgba(15,41,80,0.4)] hover:border-[rgba(176,125,79,0.4)]">
                    {inst.user.image ? (
                      <img
                        src={inst.user.image}
                        alt=""
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-[rgba(15,41,80,0.4)]"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold)] text-white">
                        {inst.user.name?.charAt(0) ?? "?"}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 text-[var(--color-snow)]">
                        {inst.user.name}
                      </h3>
                      {inst.title && (
                        <p className="text-[var(--color-snow)]/70">{inst.title}</p>
                      )}
                    </div>
                    <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all text-[var(--color-gold)]" />
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
              className="flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-70 text-[var(--color-snow)]/70"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbake
            </button>

            <h1 className="text-3xl font-semibold mb-2 text-[var(--color-snow)]">
              Velg dato og tid
            </h1>
            <p className="mb-8 text-[var(--color-snow)]/70">
              {selectedService.name} med {selectedInstructor.user.name}
            </p>

            {/* Date Pills */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-[var(--color-snow)]/50">
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
                      className={`flex-shrink-0 rounded-2xl p-4 text-center min-w-[80px] transition-all duration-200 ${
                        isSelected
                          ? "bg-[var(--color-gold)] border-none"
                          : "bg-[rgba(10,25,41,0.7)] border border-[rgba(15,41,80,0.4)]"
                      }`}
                      style={{ opacity: isWeekend ? 0.4 : 1 }}
                      whileHover={!isWeekend ? { scale: 1.02 } : {}}
                      whileTap={!isWeekend ? { scale: 0.98 } : {}}
                    >
                      <p className={`text-xs uppercase tracking-wide mb-1 ${isSelected ? "text-white" : "text-[var(--color-snow)]/50"}`}>
                        {format(date, "EEE", { locale: nb })}
                      </p>
                      <p className={`text-2xl font-semibold mb-1 ${isSelected ? "text-white" : "text-[var(--color-snow)]"}`}>
                        {format(date, "d")}
                      </p>
                      <p className={`text-xs ${isSelected ? "text-white/80" : "text-[var(--color-snow)]/70"}`}>
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
                <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-[var(--color-snow)]/50">
                  Ledige tider — {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
                </h3>

                {loading ? (
                  <div className="flex items-center gap-3 py-12 text-[var(--color-snow)]/70">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Henter tilgjengelige tider...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="rounded-2xl p-8 text-center border bg-[rgba(15,41,80,0.3)] border-[rgba(15,41,80,0.4)]">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-[var(--color-snow)]/50" />
                    <p className="text-[var(--color-snow)]/70">
                      Ingen ledige tider denne dagen.
                    </p>
                    <p className="text-sm mt-1 text-[var(--color-snow)]/50">
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
                          className="rounded-xl py-4 text-sm font-medium transition-all duration-200 border bg-[rgba(10,25,41,0.7)] border-[rgba(15,41,80,0.4)] text-[var(--color-snow)] hover:border-[var(--color-gold)]"
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
              className="flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-70 text-[var(--color-snow)]/70"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbake til tidspunkt
            </button>

            <h1 className="text-3xl font-semibold mb-2 text-[var(--color-snow)]">
              Bekreft din booking
            </h1>
            <p className="mb-8 text-[var(--color-snow)]/70">
              Gjennomgå detaljene før betaling
            </p>

            {/* Summary Card */}
            <div className="rounded-3xl p-8 mb-8 border bg-[rgba(10,25,41,0.7)] border-[rgba(15,41,80,0.4)]">
              {/* Header */}
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-[rgba(15,41,80,0.4)]">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedService.color ?? "#B07D4F" }}
                />
                <h3 className="text-xl font-semibold text-[var(--color-snow)]">
                  {selectedService.name}
                </h3>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(176,125,79,0.15)]">
                    <User className="w-5 h-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[var(--color-snow)]/50">Instruktør</p>
                    <p className="font-medium text-[var(--color-snow)]">{selectedInstructor.user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(176,125,79,0.15)]">
                    <Calendar className="w-5 h-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[var(--color-snow)]/50">Dato og tid</p>
                    <p className="font-medium text-[var(--color-snow)]">
                      {format(new Date(selectedSlot), "EEEE d. MMMM yyyy 'kl.' HH:mm", { locale: nb })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(176,125,79,0.15)]">
                    <Clock className="w-5 h-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[var(--color-snow)]/50">Varighet</p>
                    <p className="font-medium text-[var(--color-snow)]">{selectedService.duration} minutter</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-6 border-t border-[rgba(15,41,80,0.4)]">
                <span className="text-[var(--color-snow)]/70">Totalpris</span>
                <span className="text-3xl font-semibold text-[var(--color-gold)]">
                  {formatPrice(selectedService.price)}
                </span>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="space-y-4">
              <p className="text-sm text-center uppercase tracking-wide text-[var(--color-snow)]/50">
                Velg betalingsmetode
              </p>

              <motion.button
                onClick={() => handleBook("STRIPE")}
                disabled={booking}
                className="w-full py-5 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-white"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {booking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Behandler...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Betal med kort</span>
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={() => handleBook("VIPPS")}
                disabled={booking}
                className="w-full py-5 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 border-2 bg-transparent text-[#FF5B24] border-[#FF5B24] hover:bg-[#FF5B24] hover:text-white"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {booking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Behandler...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.5 4C15.1 4 13 5.7 12 8.1C11 5.7 8.9 4 6.5 4C3.5 4 1 6.5 1 9.5C1 15.5 12 21 12 21C12 21 23 15.5 23 9.5C23 6.5 20.5 4 17.5 4Z"/>
                    </svg>
                    <span>Betal med Vipps</span>
                  </>
                )}
              </motion.button>
            </div>

            <p className="text-xs text-center mt-6 text-[var(--color-snow)]/50">
              Alle betalinger er sikre og krypterte. Du møter til timen selv om betalingen ikke er gjennomført ennå.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
