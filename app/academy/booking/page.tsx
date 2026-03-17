"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";
import { 
  Clock, User, Calendar, ChevronRight, Loader2, CreditCard, 
  ArrowLeft, Check, Mail, Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { SectionLabel } from "@/components/website/SectionLabel";
import Link from "next/link";

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

type Step = "service" | "instructor" | "date" | "details" | "confirm";

const THEME = {
  bg: "#FAFBFC",
  bgElevated: "#FFFFFF",
  bgSubtle: "#F8F9FA",
  gold: "#B8975C",
  goldLight: "#E8D4B0",
  goldMuted: "#E8D4B0",
  navy: "#0F2950",
  navyLight: "#10456A",
  text: "#02060D",
  textMuted: "#64748B",
  textLight: "#9CA3AF",
  border: "#EBE5DA",
  shadow: "0 4px 20px rgba(0,0,0,0.06)",
  shadowHover: "0 8px 30px rgba(0,0,0,0.1)",
  shadowGold: "0 4px 20px rgba(184,151,92,0.2)",
};

export default function AcademyBookingPage() {
  const router = useRouter();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<ServiceType["instructors"][0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  
  // Customer details for non-authenticated booking
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingResult, setBookingResult] = useState<{bookingId: string; isNewUser: boolean} | null>(null);

  // Fetch service types on mount
  useEffect(() => {
    fetch("/api/portal/public/service-types")
      .then(res => res.json())
      .then(data => {
        setServiceTypes(Array.isArray(data) ? data : []);
        setLoadingServices(false);
      })
      .catch(err => {
        console.error("Failed to load services:", err);
        setLoadingServices(false);
      });
  }, []);

  const formatPrice = (ore: number) => {
    const kr = ore / 100;
    return kr.toLocaleString("nb-NO", { minimumFractionDigits: 0 }) + " kr";
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

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    setStep("details");
  };

  const validateCustomerDetails = () => {
    if (!customerName.trim() || customerName.length < 2) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) return false;
    return true;
  };

  const handleBook = async (paymentMethod: "STRIPE" | "VIPPS") => {
    if (!selectedService || !selectedInstructor || !selectedSlot) return;
    if (!validateCustomerDetails()) {
      alert("Vennligst fyll ut gyldig navn og e-postadresse");
      return;
    }
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
          email: customerEmail.trim().toLowerCase(),
          name: customerName.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookingResult({ bookingId: data.bookingId, isNewUser: data.isNewUser });
        
        if (paymentMethod === "STRIPE" && data.clientSecret) {
          // Stripe: gå til betalingsside
          router.push(`/booking/${data.bookingId}/pay`);
        } else if (paymentMethod === "VIPPS") {
          // Vipps: initiere betaling og redirect til Vipps
          const vippsRes = await fetch("/api/booking/vipps-initiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: data.bookingId }),
          });
          
          if (vippsRes.ok) {
            const vippsData = await vippsRes.json();
            if (vippsData.paymentUrl) {
              window.location.href = vippsData.paymentUrl;
              return;
            }
          }
          // Hvis Vipps-initiering feiler, gå til confirmation
          router.push(`/booking/${data.bookingId}/confirmation`);
        } else {
          router.push(`/booking/${data.bookingId}/confirmation`);
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
    details: "Dine opplysninger",
    confirm: "Bekreft",
  };

  if (loadingServices) {
    return (
      <>
        <WebsiteNav />
        <main className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
          <div className="flex items-center gap-3" style={{ color: THEME.textMuted }}>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Laster tilgjengelige tjenester...</span>
          </div>
        </main>
        <WebsiteFooter />
      </>
    );
  }

  return (
    <>
      <WebsiteNav />
      
      <main className="min-h-screen bg-[#FAFBFC]" id="main-content">
        <PageTransition>
          {/* Hero Section */}
          <section className="bg-[#0F2950] py-20">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#B8975C]/20 text-[#B8975C] text-sm font-medium mb-4">
                    AK Golf Academy
                  </span>
                  <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
                    Book din coaching-time
                  </h1>
                  <p className="text-white/70 max-w-lg mx-auto">
                    Velg tjeneste, trener og tidspunkt. Ingen konto nødvendig — 
                    hvis du har booket før, kobles timen automatisk til din profil.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Booking Flow */}
          <section className="py-12">
            <div className="w-container max-w-3xl">
              {/* Progress Stepper */}
              <div className="mb-10">
                <div className="flex items-center justify-center">
                  {(Object.keys(stepLabels) as Step[]).map((s, index, arr) => {
                    const isActive = s === step;
                    const isCompleted = 
                      (step === "instructor" && s === "service") ||
                      (step === "date" && (s === "service" || s === "instructor")) ||
                      (step === "details" && (s === "service" || s === "instructor" || s === "date")) ||
                      (step === "confirm" && s !== "confirm");
                    
                    return (
                      <div key={s} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <motion.div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
                            style={{
                              background: isActive 
                                ? THEME.gold 
                                : isCompleted 
                                  ? `${THEME.gold}20`
                                  : THEME.bgSubtle,
                              color: isActive || isCompleted ? "#FFFFFF" : THEME.textMuted,
                              border: isActive 
                                ? "none"
                                : isCompleted
                                  ? `2px solid ${THEME.gold}`
                                  : `2px solid ${THEME.border}`,
                            }}
                            whileHover={!isActive ? { scale: 1.05 } : {}}
                          >
                            {isCompleted && s !== step ? (
                              <Check className="w-5 h-5" style={{ color: isActive ? "#FFF" : THEME.gold }} />
                            ) : (
                              index + 1
                            )}
                          </motion.div>
                          <span
                            className="text-xs mt-2 font-medium"
                            style={{
                              color: isActive ? THEME.gold : THEME.textMuted,
                            }}
                          >
                            {stepLabels[s]}
                          </span>
                        </div>
                        {index < arr.length - 1 && (
                          <div 
                            className="w-16 h-0.5 mx-2"
                            style={{ 
                              background: isCompleted ? THEME.gold : THEME.border,
                            }}
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
                      <h2 
                        className="text-3xl font-semibold mb-3"
                        style={{ color: THEME.navy }}
                      >
                        Velg din treningsform
                      </h2>
                      <p style={{ color: THEME.textMuted }}>
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
                          <div
                            className="rounded-2xl p-6 transition-all duration-300 border"
                            style={{
                              background: THEME.bgElevated,
                              borderColor: THEME.border,
                              boxShadow: THEME.shadow,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = THEME.shadowHover;
                              e.currentTarget.style.borderColor = THEME.goldMuted;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = THEME.shadow;
                              e.currentTarget.style.borderColor = THEME.border;
                            }}
                          >
                            <div className="flex items-start justify-between gap-6">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: svc.color ?? THEME.gold }}
                                  />
                                  <h3 
                                    className="text-lg font-semibold transition-colors"
                                    style={{ color: THEME.navy }}
                                  >
                                    {svc.name}
                                  </h3>
                                </div>
                                {svc.description && (
                                  <p 
                                    className="text-sm leading-relaxed mb-4"
                                    style={{ color: THEME.textMuted }}
                                  >
                                    {svc.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-6">
                                  <span 
                                    className="flex items-center gap-2 text-sm"
                                    style={{ color: THEME.textMuted }}
                                  >
                                    <Clock className="w-4 h-4" style={{ color: THEME.gold }} />
                                    {svc.duration} minutter
                                  </span>
                                  <span 
                                    className="flex items-center gap-2 text-sm"
                                    style={{ color: THEME.textMuted }}
                                  >
                                    <User className="w-4 h-4" style={{ color: THEME.gold }} />
                                    {svc.maxStudents === 1 ? "Individuell" : `Gruppe (max ${svc.maxStudents})`}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span 
                                  className="text-2xl font-semibold"
                                  style={{ color: THEME.gold }}
                                >
                                  {formatPrice(svc.price)}
                                </span>
                                <ChevronRight 
                                  className="w-5 h-5 mt-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ color: THEME.gold }}
                                />
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
                      className="flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-70"
                      style={{ color: THEME.textMuted }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Tilbake til tjenester
                    </button>

                    <h2 
                      className="text-3xl font-semibold mb-2"
                      style={{ color: THEME.navy }}
                    >
                      Velg instruktør
                    </h2>
                    <p className="mb-8" style={{ color: THEME.textMuted }}>
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
                          <div
                            className="rounded-2xl p-5 flex items-center gap-5 transition-all duration-300 border"
                            style={{
                              background: THEME.bgElevated,
                              borderColor: THEME.border,
                              boxShadow: THEME.shadow,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = THEME.shadowHover;
                              e.currentTarget.style.borderColor = THEME.goldMuted;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = THEME.shadow;
                              e.currentTarget.style.borderColor = THEME.border;
                            }}
                          >
                            {inst.user.image ? (
                              <img 
                                src={inst.user.image} 
                                alt="" 
                                className="w-16 h-16 rounded-2xl object-cover border-2"
                                style={{ borderColor: THEME.border }}
                              />
                            ) : (
                              <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                                style={{ 
                                  background: `linear-gradient(135deg, ${THEME.goldLight}, ${THEME.gold})`,
                                  color: "#FFFFFF",
                                }}
                              >
                                {inst.user.name?.charAt(0) ?? "?"}
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 
                                className="text-lg font-semibold mb-1"
                                style={{ color: THEME.navy }}
                              >
                                {inst.user.name}
                              </h3>
                              {inst.title && (
                                <p style={{ color: THEME.textMuted }}>{inst.title}</p>
                              )}
                            </div>
                            <ChevronRight 
                              className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all"
                              style={{ color: THEME.gold }}
                            />
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
                      className="flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-70"
                      style={{ color: THEME.textMuted }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Tilbake
                    </button>

                    <h2 
                      className="text-3xl font-semibold mb-2"
                      style={{ color: THEME.navy }}
                    >
                      Velg dato og tid
                    </h2>
                    <p className="mb-8" style={{ color: THEME.textMuted }}>
                      {selectedService.name} med {selectedInstructor.user.name}
                    </p>

                    {/* Date Pills */}
                    <div className="mb-8">
                      <h3 
                        className="text-sm font-semibold mb-4 uppercase tracking-wide"
                        style={{ color: THEME.textLight }}
                      >
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
                              className="flex-shrink-0 rounded-2xl p-4 text-center min-w-[80px] transition-all duration-200"
                              style={{
                                background: isSelected ? THEME.gold : THEME.bgElevated,
                                border: isSelected ? "none" : `1px solid ${THEME.border}`,
                                boxShadow: isSelected ? THEME.shadowGold : THEME.shadow,
                                opacity: isWeekend ? 0.4 : 1,
                              }}
                              whileHover={!isWeekend ? { scale: 1.02 } : {}}
                              whileTap={!isWeekend ? { scale: 0.98 } : {}}
                            >
                              <p 
                                className="text-xs uppercase tracking-wide mb-1"
                                style={{ color: isSelected ? "#FFFFFF" : THEME.textLight }}
                              >
                                {format(date, "EEE", { locale: nb })}
                              </p>
                              <p 
                                className="text-2xl font-semibold mb-1"
                                style={{ color: isSelected ? "#FFFFFF" : THEME.navy }}
                              >
                                {format(date, "d")}
                              </p>
                              <p 
                                className="text-xs"
                                style={{ color: isSelected ? "rgba(255,255,255,0.8)" : THEME.textMuted }}
                              >
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
                        <h3 
                          className="text-sm font-semibold mb-4 uppercase tracking-wide"
                          style={{ color: THEME.textLight }}
                        >
                          Ledige tider — {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
                        </h3>
                        
                        {loading ? (
                          <div className="flex items-center gap-3 py-12" style={{ color: THEME.textMuted }}>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Henter tilgjengelige tider...</span>
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <div 
                            className="rounded-2xl p-8 text-center border"
                            style={{ 
                              background: THEME.bgSubtle,
                              borderColor: THEME.border,
                            }}
                          >
                            <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: THEME.textLight }} />
                            <p style={{ color: THEME.textMuted }}>
                              Ingen ledige tider denne dagen.
                            </p>
                            <p className="text-sm mt-1" style={{ color: THEME.textLight }}>
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
                                  onClick={() => handleSelectSlot(slot)}
                                  className="rounded-xl py-4 text-sm font-medium transition-all duration-200 border"
                                  style={{
                                    background: THEME.bgElevated,
                                    borderColor: THEME.border,
                                    color: THEME.navy,
                                    boxShadow: THEME.shadow,
                                  }}
                                  whileHover={{ 
                                    scale: 1.02,
                                    boxShadow: THEME.shadowHover,
                                    borderColor: THEME.gold,
                                  }}
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

                {/* Step 4: Customer Details */}
                {step === "details" && selectedService && selectedInstructor && selectedSlot && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => setStep("date")}
                      className="flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-70"
                      style={{ color: THEME.textMuted }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Tilbake til tidspunkt
                    </button>

                    <h2 
                      className="text-3xl font-semibold mb-2"
                      style={{ color: THEME.navy }}
                    >
                      Dine opplysninger
                    </h2>
                    <p className="mb-8" style={{ color: THEME.textMuted }}>
                      Fyll inn kontaktinformasjon for bookingen
                    </p>

                    {/* Summary Card */}
                    <div 
                      className="rounded-2xl p-6 mb-8 border"
                      style={{
                        background: THEME.bgElevated,
                        borderColor: THEME.border,
                        boxShadow: THEME.shadow,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: selectedService.color ?? THEME.gold }}
                        />
                        <h3 style={{ color: THEME.navy }} className="font-semibold">
                          {selectedService.name}
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm" style={{ color: THEME.textMuted }}>
                        <p className="flex items-center gap-2">
                          <User className="w-4 h-4" style={{ color: THEME.gold }} />
                          {selectedInstructor.user.name}
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: THEME.gold }} />
                          {format(new Date(selectedSlot), "EEEE d. MMMM yyyy 'kl.' HH:mm", { locale: nb })}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: THEME.gold }} />
                          {selectedService.duration} minutter
                        </p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: THEME.text }}
                        >
                          Fullt navn *
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ditt navn"
                          className="w-full px-4 py-3 rounded-xl border transition-all duration-200"
                          style={{
                            background: THEME.bgElevated,
                            borderColor: THEME.border,
                            color: THEME.text,
                          }}
                          onFocus={(e) => e.currentTarget.style.borderColor = THEME.gold}
                          onBlur={(e) => e.currentTarget.style.borderColor = THEME.border}
                        />
                      </div>

                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: THEME.text }}
                        >
                          E-postadresse *
                        </label>
                        <div className="relative">
                          <Mail 
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
                            style={{ color: THEME.gold }} 
                          />
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="din@epost.no"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200"
                            style={{
                              background: THEME.bgElevated,
                              borderColor: THEME.border,
                              color: THEME.text,
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = THEME.gold}
                            onBlur={(e) => e.currentTarget.style.borderColor = THEME.border}
                          />
                        </div>
                        <p className="text-xs mt-1" style={{ color: THEME.textLight }}>
                          Hvis du har booket før med denne e-posten, kobles timen til din profil.
                        </p>
                      </div>

                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: THEME.text }}
                        >
                          Telefonnummer
                        </label>
                        <div className="relative">
                          <Phone 
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
                            style={{ color: THEME.gold }} 
                          />
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+47 000 00 000"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200"
                            style={{
                              background: THEME.bgElevated,
                              borderColor: THEME.border,
                              color: THEME.text,
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = THEME.gold}
                            onBlur={(e) => e.currentTarget.style.borderColor = THEME.border}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <motion.button
                        onClick={() => validateCustomerDetails() && setStep("confirm")}
                        disabled={!validateCustomerDetails()}
                        className="w-full py-4 rounded-2xl text-base font-semibold transition-all duration-300 disabled:opacity-50"
                        style={{
                          background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.goldLight})`,
                          color: "#FFFFFF",
                          boxShadow: THEME.shadowGold,
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        Fortsett til betaling
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Confirmation */}
                {step === "confirm" && selectedService && selectedInstructor && selectedSlot && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => setStep("details")}
                      className="flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-70"
                      style={{ color: THEME.textMuted }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Tilbake
                    </button>

                    <h2 
                      className="text-3xl font-semibold mb-2"
                      style={{ color: THEME.navy }}
                    >
                      Bekreft din booking
                    </h2>
                    <p className="mb-8" style={{ color: THEME.textMuted }}>
                      Gjennomgå detaljene før betaling
                    </p>

                    {/* Summary Card */}
                    <div 
                      className="rounded-3xl p-8 mb-8 border"
                      style={{
                        background: THEME.bgElevated,
                        borderColor: THEME.border,
                        boxShadow: THEME.shadow,
                      }}
                    >
                      {/* Header */}
                      <div 
                        className="flex items-center gap-4 pb-6 mb-6 border-b"
                        style={{ borderColor: THEME.border }}
                      >
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: selectedService.color ?? THEME.gold }}
                        />
                        <h3 
                          className="text-xl font-semibold"
                          style={{ color: THEME.navy }}
                        >
                          {selectedService.name}
                        </h3>
                      </div>

                      {/* Details */}
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${THEME.gold}15` }}
                          >
                            <User className="w-5 h-5" style={{ color: THEME.gold }} />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide" style={{ color: THEME.textLight }}>Instruktør</p>
                            <p className="font-medium" style={{ color: THEME.navy }}>{selectedInstructor.user.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${THEME.gold}15` }}
                          >
                            <Calendar className="w-5 h-5" style={{ color: THEME.gold }} />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide" style={{ color: THEME.textLight }}>Dato og tid</p>
                            <p className="font-medium" style={{ color: THEME.navy }}>
                              {format(new Date(selectedSlot), "EEEE d. MMMM yyyy 'kl.' HH:mm", { locale: nb })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${THEME.gold}15` }}
                          >
                            <Clock className="w-5 h-5" style={{ color: THEME.gold }} />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide" style={{ color: THEME.textLight }}>Varighet</p>
                            <p className="font-medium" style={{ color: THEME.navy }}>{selectedService.duration} minutter</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${THEME.gold}15` }}
                          >
                            <Mail className="w-5 h-5" style={{ color: THEME.gold }} />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide" style={{ color: THEME.textLight }}>Kunde</p>
                            <p className="font-medium" style={{ color: THEME.navy }}>{customerName}</p>
                            <p className="text-sm" style={{ color: THEME.textMuted }}>{customerEmail}</p>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div 
                        className="flex items-center justify-between pt-6 border-t"
                        style={{ borderColor: THEME.border }}
                      >
                        <span style={{ color: THEME.textMuted }}>Totalpris</span>
                        <span 
                          className="text-3xl font-semibold"
                          style={{ color: THEME.gold }}
                        >
                          {formatPrice(selectedService.price)}
                        </span>
                      </div>
                    </div>

                    {/* Payment Buttons */}
                    <div className="space-y-4">
                      <p 
                        className="text-sm text-center uppercase tracking-wide"
                        style={{ color: THEME.textLight }}
                      >
                        Velg betalingsmetode
                      </p>
                      
                      <motion.button
                        onClick={() => handleBook("STRIPE")}
                        disabled={booking}
                        className="w-full py-5 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50"
                        style={{
                          background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.goldLight})`,
                          color: "#FFFFFF",
                          boxShadow: THEME.shadowGold,
                        }}
                        whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(184,151,92,0.3)" }}
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
                        className="w-full py-5 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 border-2"
                        style={{
                          background: "transparent",
                          color: "#FF5B24",
                          borderColor: "#FF5B24",
                        }}
                        whileHover={{ 
                          scale: 1.01,
                          background: "#FF5B24",
                          color: "#FFFFFF",
                        }}
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

                    <p 
                      className="text-xs text-center mt-6"
                      style={{ color: THEME.textLight }}
                    >
                      Alle betalinger er sikre og krypterte. Du møter til timen selv om betalingen ikke er gjennomført ennå.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Info Section */}
          <section className="py-12 bg-white border-t" style={{ borderColor: THEME.border }}>
            <div className="w-container max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${THEME.gold}15` }}
                  >
                    <Mail className="w-6 h-6" style={{ color: THEME.gold }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: THEME.navy }}>Bekreftelse på e-post</h3>
                  <p className="text-sm" style={{ color: THEME.textMuted }}>
                    Du mottar umiddelbar bekreftelse på bookingen
                  </p>
                </div>
                <div>
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${THEME.gold}15` }}
                  >
                    <User className="w-6 h-6" style={{ color: THEME.gold }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: THEME.navy }}>Din profil</h3>
                  <p className="text-sm" style={{ color: THEME.textMuted }}>
                    Ved første booking opprettes en profil automatisk
                  </p>
                </div>
                <div>
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${THEME.gold}15` }}
                  >
                    <Calendar className="w-6 h-6" style={{ color: THEME.gold }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: THEME.navy }}>Enkel endring</h3>
                  <p className="text-sm" style={{ color: THEME.textMuted }}>
                    Endre eller avbestill enkelt via e-postlenken
                  </p>
                </div>
              </div>
            </div>
          </section>
        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
