"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserCircle, User, Calendar, Receipt, ChevronLeft, ChevronRight, Clock, BadgeCheck, ArrowRight, Flag, Check } from "@/components/shared/icons";
import { BookingProgress } from "../components/BookingProgress";
import { BookingNavSidebar } from "../components/BookingNavSidebar";

interface ServiceType {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Instructor {
  id: string;
  User: {
    name: string | null;
  };
}

interface SmartSlot {
  time: string;
  available: boolean;
  isoString?: string;
}

interface DayData {
  date: string;
  dayName: string;
  dayNumber: number;
  slots: SmartSlot[];
}

interface WeekData {
  weekOffset: number;
  weekStart: string;
  instructor: {
    id: string;
    name: string;
  };
  days: DayData[];
}

export default function BookingDateTimePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceTypeId = searchParams.get("serviceTypeId");
  const instructorIdParam = searchParams.get("instructorId");

  const [service, setService] = useState<ServiceType | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SmartSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Restore saved selection from LocalStorage
  useEffect(() => {
    if (serviceTypeId) {
      const saved = localStorage.getItem(`booking_selection_${serviceTypeId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedDate) setSelectedDate(parsed.selectedDate);
        if (parsed.selectedTime) setSelectedTime(parsed.selectedTime);
      }
    }
  }, [serviceTypeId]);

  // Hent service og instructor info
  useEffect(() => {
    if (!serviceTypeId) {
      router.push("/booking/select-service");
      return;
    }

    fetch("/api/portal/public/service-types")
      .then((res) => res.json())
      .then((data) => {
        const foundService = data.find((s: ServiceType) => s.id === serviceTypeId);
        if (foundService) {
          setService(foundService);
          
          // Hvis instructorId er spesifisert, bruk den - ellers ta første tilgjengelige
          let targetInstructor = null;
          if (instructorIdParam) {
            targetInstructor = data.flatMap((s: any) => s.Instructor).find((i: Instructor) => i.id === instructorIdParam);
          }
          if (!targetInstructor && foundService.Instructor?.length > 0) {
            targetInstructor = foundService.Instructor[0];
          }
          
          if (targetInstructor) {
            setInstructor(targetInstructor);
          } else {
            setError("Ingen instruktør tilgjengelig");
          }
        } else {
          setError("Tjeneste ikke funnet");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Kunne ikke laste data");
        setLoading(false);
      });
  }, [serviceTypeId, instructorIdParam, router]);

  // Hent smart slots for uken
  const fetchWeekData = useCallback(async () => {
    if (!serviceTypeId || !instructor) return;
    
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/booking/smart-slots?serviceTypeId=${serviceTypeId}&instructorId=${instructor.id}&weekOffset=${weekOffset}`);
      const data = await res.json();
      
      if (data.days) {
        setWeekData(data);
        
        // Smart defaults: velg første tilgjengelige dag og tid hvis ikke allerede valgt
        if (!selectedDate && !selectedTime) {
          const firstAvailableDay = data.days.find((day: DayData) => 
            day.slots.some((slot: SmartSlot) => slot.available)
          );
          
          if (firstAvailableDay) {
            setSelectedDate(firstAvailableDay.date);
            // Default til 15:00 hvis tilgjengelig, ellers første tilgjengelige
            const defaultSlot = firstAvailableDay.slots.find((s: SmartSlot) => s.time === "15:00" && s.available) 
              || firstAvailableDay.slots.find((s: SmartSlot) => s.available);
            if (defaultSlot) {
              setSelectedTime(defaultSlot.time);
              setSelectedSlot(defaultSlot);
            }
          }
        }
      }
    } catch {
      // Silent error
    } finally {
      setLoadingSlots(false);
    }
  }, [serviceTypeId, instructor, weekOffset, selectedDate, selectedTime]);

  useEffect(() => {
    if (instructor) {
      fetchWeekData();
    }
  }, [fetchWeekData, instructor]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedSlot(null);
    
    // Finn første tilgjengelige tid for denne dagen
    const day = weekData?.days.find((d) => d.date === date);
    if (day) {
      const defaultSlot = day.slots.find((s) => s.time === "15:00" && s.available) 
        || day.slots.find((s) => s.available);
      if (defaultSlot) {
        setSelectedTime(defaultSlot.time);
        setSelectedSlot(defaultSlot);
      }
    }
  };

  const handleTimeSelect = (slot: SmartSlot) => {
    if (!slot.available) return;
    setSelectedTime(slot.time);
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (selectedSlot?.isoString && instructor) {
      // Save selection to LocalStorage
      if (serviceTypeId) {
        localStorage.setItem(`booking_selection_${serviceTypeId}`, JSON.stringify({
          selectedDate,
          selectedTime,
        }));
      }
      router.push(
        `/booking/review-confirm?serviceTypeId=${serviceTypeId}&instructorId=${instructor.id}&startTime=${encodeURIComponent(selectedSlot.isoString)}`
      );
    }
  };

  const goToPreviousWeek = () => {
    if (weekOffset > 0) {
      setWeekOffset(weekOffset - 1);
    }
  };

  const goToNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  // Formater ukeperiode for visning
  const getWeekLabel = () => {
    if (!weekData?.days.length) return "";
    const firstDay = weekData.days[0];
    const lastDay = weekData.days[6];
    const firstDate = new Date(firstDay.date);
    const lastDate = new Date(lastDay.date);
    
    const formatDate = (d: Date) => `${d.getDate()}. ${d.toLocaleDateString("nb-NO", { month: "short" })}`;
    return `${formatDate(firstDate)} – ${formatDate(lastDate)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center lg:ml-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#154212]"></div>
      </div>
    );
  }

  if (error || !service || !instructor) {
    return (
      <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center lg:ml-64">
        <div className="text-center">
          <p className="text-[#ba1a1a] mb-4">{error || "Manglende informasjon"}</p>
          <Link href="/booking/select-service" className="px-6 py-3 bg-[#154212] text-white rounded-lg inline-block">
            Start på nytt
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Progress Bar - Desktop only */}
      <div className="hidden lg:block">
        <BookingProgress 
          currentStep={2} 
          serviceTypeId={serviceTypeId || undefined}
        />
      </div>

      {/* Navigation Sidebar */}
      <BookingNavSidebar 
        currentStep={2}
        serviceTypeId={serviceTypeId || undefined}
        serviceName={service?.name}
        servicePrice={service?.price}
        isPriceMonthly={service?.name?.includes("Performance")}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen bg-[#fdf9f0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
          {/* Mobile Title */}
          <div className="lg:hidden mb-6">
            <span className="font-mono text-xs text-[#154212] uppercase tracking-widest">Steg 2 av 3</span>
            <h1 className="text-2xl font-bold text-[#154212] tracking-tight mt-1">Velg tid</h1>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block mb-6">
            <span className="font-mono text-xs text-[#154212] uppercase tracking-widest">Steg 2 av 3</span>
            <h1 className="text-4xl font-bold text-[#154212] tracking-tight mt-1">Velg tid</h1>
          </div>

          {/* Coach Info Card */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 border border-[#c2c9bb]/10 shadow-[0_4px_16px_rgba(45,90,39,0.04)] mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-[#154212] flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 lg:w-7 lg:h-7 text-[#d2f000]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono uppercase text-[#72796e] tracking-wider">Din coach</p>
                <p className="text-base lg:text-lg font-bold text-[#154212] truncate">{instructor?.User?.name || "Instruktør"}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-mono uppercase text-[#72796e] tracking-wider">Varighet</p>
                <p className="text-base lg:text-lg font-bold text-[#154212]">{service?.duration || 20} min</p>
              </div>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={goToPreviousWeek}
              disabled={weekOffset === 0}
              className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium text-sm text-[#154212] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Forrige uke</span>
            </button>
            <div className="text-center">
              <h2 className="text-lg lg:text-xl font-bold text-[#154212]">{getWeekLabel()}</h2>
              <p className="text-xs text-[#72796e] font-mono uppercase tracking-wider">Uke {weekOffset + 1}</p>
            </div>
            <button 
              onClick={goToNextWeek}
              className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium text-sm text-[#154212] hover:bg-white transition-colors"
            >
              <span className="hidden sm:inline">Neste uke</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Week Calendar Grid */}
          {loadingSlots ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#154212]"></div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 lg:p-6 border border-[#c2c9bb]/10 shadow-[0_4px_16px_rgba(45,90,39,0.04)]">
              {/* Weekdays */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
                {weekData?.days.slice(0, 5).map((day) => {
                  const isSelected = selectedDate === day.date;
                  const hasAvailableSlots = day.slots.some(s => s.available);
                  
                  return (
                    <div 
                      key={day.date}
                      onClick={() => hasAvailableSlots && handleDateSelect(day.date)}
                      className={`rounded-xl p-3 lg:p-4 transition-all ${
                        isSelected 
                          ? 'bg-[#154212] text-white' 
                          : hasAvailableSlots
                            ? 'bg-[#f7f3ea] hover:bg-[#d2f000]/20 cursor-pointer'
                            : 'bg-[#f7f3ea]/50 opacity-60'
                      }`}
                    >
                      <div className="text-center mb-2 lg:mb-3">
                        <p className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? 'text-white/70' : 'text-[#72796e]'}`}>
                          {day.dayName}
                        </p>
                        <p className={`text-xl lg:text-2xl font-bold ${isSelected ? 'text-white' : 'text-[#154212]'}`}>
                          {day.dayNumber}
                        </p>
                      </div>
                      
                      <div className="space-y-1.5 lg:space-y-2">
                        {day.slots.map((slot) => {
                          const isTimeSelected = isSelected && selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (slot.available) {
                                  handleDateSelect(day.date);
                                  handleTimeSelect(slot);
                                }
                              }}
                              disabled={!slot.available}
                              className={`w-full py-1.5 lg:py-2 rounded-lg font-mono text-xs lg:text-sm transition-all ${
                                isTimeSelected
                                  ? 'bg-[#d2f000] text-[#154212] font-bold'
                                  : slot.available
                                    ? isSelected
                                      ? 'bg-white/20 text-white hover:bg-white/30'
                                      : 'bg-white border border-[#c2c9bb]/30 text-[#154212] hover:border-[#154212]'
                                    : 'bg-transparent text-[#c2c9bb] line-through cursor-not-allowed'
                              }`}
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Weekend days */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mt-3 lg:mt-4">
                {weekData?.days.slice(5).map((day) => {
                  const isSelected = selectedDate === day.date;
                  const hasAvailableSlots = day.slots.some(s => s.available);
                  
                  return (
                    <div 
                      key={day.date}
                      onClick={() => hasAvailableSlots && handleDateSelect(day.date)}
                      className={`rounded-xl p-3 lg:p-4 transition-all ${
                        isSelected 
                          ? 'bg-[#154212] text-white' 
                          : hasAvailableSlots
                            ? 'bg-[#f7f3ea] hover:bg-[#d2f000]/20 cursor-pointer'
                            : 'bg-[#f7f3ea]/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 lg:mb-3">
                        <div>
                          <p className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? 'text-white/70' : 'text-[#72796e]'}`}>
                            {day.dayName}
                          </p>
                          <p className={`text-xl lg:text-2xl font-bold ${isSelected ? 'text-white' : 'text-[#154212]'}`}>
                            {day.dayNumber}
                          </p>
                        </div>
                        <Clock className={`w-5 h-5 ${isSelected ? 'text-white/50' : 'text-[#c2c9bb]'}`} />
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {day.slots.map((slot) => {
                          const isTimeSelected = isSelected && selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (slot.available) {
                                  handleDateSelect(day.date);
                                  handleTimeSelect(slot);
                                }
                              }}
                              disabled={!slot.available}
                              className={`py-1.5 lg:py-2 rounded-lg font-mono text-xs lg:text-sm transition-all ${
                                isTimeSelected
                                  ? 'bg-[#d2f000] text-[#154212] font-bold'
                                  : slot.available
                                    ? isSelected
                                      ? 'bg-white/20 text-white hover:bg-white/30'
                                      : 'bg-white border border-[#c2c9bb]/30 text-[#154212] hover:border-[#154212]'
                                    : 'bg-transparent text-[#c2c9bb] line-through cursor-not-allowed'
                              }`}
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Booking Summary */}
          {selectedSlot?.available && selectedDate && (
            <div className="mt-6 lg:mt-8 bg-[#154212] p-4 lg:p-6 rounded-2xl text-white shadow-xl">
              <div className="flex justify-between items-start mb-4 lg:mb-6">
                <div>
                  <p className="text-white/60 font-mono text-[10px] uppercase tracking-widest">Din booking</p>
                  <p className="text-lg lg:text-xl font-bold mt-1">
                    {new Date(selectedDate).getDate()}. {new Date(selectedDate).toLocaleDateString("nb-NO", { month: "long" })}, {selectedTime}
                  </p>
                  <p className="text-white/60 text-sm">{service?.duration || 20} minutter med {instructor?.User?.name?.split(" ")[0] || "coach"}</p>
                </div>
                <BadgeCheck className="w-6 h-6 text-[#d2f000] flex-shrink-0" />
              </div>
              <button 
                onClick={handleContinue}
                className="w-full bg-[#d2f000] text-[#154212] font-bold uppercase tracking-widest py-3 lg:py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Book nå <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Info om begrenset utvalg */}
          <div className="mt-6 lg:mt-8 bg-[#f7f3ea] rounded-xl p-4 lg:p-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#d2f000] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-[#154212]" />
              </div>
              <div>
                <p className="font-bold text-[#154212] text-sm">Forenklet booking</p>
                <p className="text-[#42493e] text-sm mt-1">
                  Vi viser kun de mest populære tidspunktene (10:00, 13:00, 15:00, 17:00). 
                  Trenger du et annet tidspunkt? Kontakt oss på <a href="mailto:anders@akgolf.no" className="text-[#154212] underline">anders@akgolf.no</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
