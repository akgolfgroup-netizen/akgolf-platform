"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserCircle, User, Calendar, Receipt, ChevronLeft, ChevronRight, Clock, BadgeCheck, ArrowRight, Flag, Check } from "@/components/shared/icons";

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
      <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#154212]"></div>
      </div>
    );
  }

  if (error || !service || !instructor) {
    return (
      <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center">
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
      <header className="bg-[#fdf9f0] sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <Link href="/" className="text-xl font-bold text-[#154212] tracking-tighter">AK Golf Academy</Link>
          <nav className="hidden md:flex items-center space-x-8 font-semibold uppercase tracking-wider">
            <Link href="/landing/pricing" className="text-[#154212]/60 hover:text-[#154212] transition-colors">Coaching</Link>
            <Link href="/booking/select-service" className="text-[#154212]">Booking</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <UserCircle className="w-6 h-6 text-[#154212]" />
          </div>
        </div>
        <div className="bg-[#f7f3ea] h-px w-full"></div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <aside className="h-screen w-64 fixed left-0 top-0 bg-[#154212] flex flex-col py-8 z-40">
          <div className="px-8 mb-12">
            <div className="text-white font-black text-lg">AK Golf Academy</div>
            <div className="text-[#d2f000] font-medium uppercase text-[10px] tracking-widest mt-1">Fredrikstad & Miklagard</div>
          </div>
          <nav className="flex flex-col space-y-2">
            <Link 
              href={`/booking/select-service?serviceTypeId=${serviceTypeId}`}
              className="text-white/70 py-3 px-8 font-medium uppercase text-xs flex items-center gap-3 hover:bg-white/10 transition-all"
            >
              <Calendar className="w-4 h-4" />Coaching
            </Link>
            <div className="bg-[#d2f000] text-[#154212] rounded-r-full mr-4 py-3 px-8 font-medium uppercase text-xs flex items-center gap-3 shadow-md">
              <Calendar className="w-4 h-4" />Tid
            </div>
            <div className="text-white/70 py-3 px-8 font-medium uppercase text-xs flex items-center gap-3 opacity-50">
              <Receipt className="w-4 h-4" />Betal
            </div>
          </nav>
          <div className="mt-auto px-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/40 text-[10px] font-mono uppercase mb-2">Valgt pakke</p>
              <p className="text-white font-semibold text-sm">{service?.name}</p>
              <p className="text-[#d2f000] text-xs">
                {service?.price === 0 ? "Gratis" : `${service?.price?.toLocaleString("nb-NO")} kr`}
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-64 p-12 bg-[#fdf9f0] min-h-screen">
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="font-mono text-xs text-[#154212] uppercase tracking-widest">Steg 02/03</span>
                <h1 className="text-4xl font-bold text-[#154212] tracking-tight mt-1">Velg tid</h1>
              </div>
              <div className="flex gap-3">
                <div className={`w-10 h-1.5 rounded-full ${1 <= 2 ? 'bg-[#d2f000]' : 'bg-[#154212]/10'}`}></div>
                <div className={`w-10 h-1.5 rounded-full bg-[#d2f000]`}></div>
                <div className={`w-10 h-1.5 rounded-full bg-[#154212]/10`}></div>
              </div>
            </div>

            {/* Coach Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/10 shadow-[0_4px_16px_rgba(45,90,39,0.04)] mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#154212] flex items-center justify-center">
                  <User className="w-7 h-7 text-[#d2f000]" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-mono uppercase text-[#72796e] tracking-wider">Din coach</p>
                  <p className="text-lg font-bold text-[#154212]">{instructor?.User?.name || "Instruktør"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono uppercase text-[#72796e] tracking-wider">Varighet</p>
                  <p className="text-lg font-bold text-[#154212]">{service?.duration || 20} min</p>
                </div>
              </div>
            </div>

            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={goToPreviousWeek}
                disabled={weekOffset === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-[#154212] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Forrige uke
              </button>
              <div className="text-center">
                <h2 className="text-xl font-bold text-[#154212]">{getWeekLabel()}</h2>
                <p className="text-xs text-[#72796e] font-mono uppercase tracking-wider">Uke {weekOffset + 1}</p>
              </div>
              <button 
                onClick={goToNextWeek}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-[#154212] hover:bg-white transition-colors"
              >
                Neste uke
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Week Calendar Grid */}
            {loadingSlots ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#154212]"></div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/10 shadow-[0_4px_16px_rgba(45,90,39,0.04)]">
                <div className="grid grid-cols-5 gap-4">
                  {weekData?.days.slice(0, 5).map((day) => {
                    const isSelected = selectedDate === day.date;
                    const hasAvailableSlots = day.slots.some(s => s.available);
                    
                    return (
                      <div 
                        key={day.date}
                        onClick={() => hasAvailableSlots && handleDateSelect(day.date)}
                        className={`rounded-xl p-4 transition-all ${
                          isSelected 
                            ? 'bg-[#154212] text-white' 
                            : hasAvailableSlots
                              ? 'bg-[#f7f3ea] hover:bg-[#d2f000]/20 cursor-pointer'
                              : 'bg-[#f7f3ea]/50 opacity-60'
                        }`}
                      >
                        <div className="text-center mb-3">
                          <p className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? 'text-white/70' : 'text-[#72796e]'}`}>
                            {day.dayName}
                          </p>
                          <p className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-[#154212]'}`}>
                            {day.dayNumber}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
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
                                className={`w-full py-2 rounded-lg font-mono text-sm transition-all ${
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
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {weekData?.days.slice(5).map((day) => {
                    const isSelected = selectedDate === day.date;
                    const hasAvailableSlots = day.slots.some(s => s.available);
                    
                    return (
                      <div 
                        key={day.date}
                        onClick={() => hasAvailableSlots && handleDateSelect(day.date)}
                        className={`rounded-xl p-4 transition-all ${
                          isSelected 
                            ? 'bg-[#154212] text-white' 
                            : hasAvailableSlots
                              ? 'bg-[#f7f3ea] hover:bg-[#d2f000]/20 cursor-pointer'
                              : 'bg-[#f7f3ea]/50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? 'text-white/70' : 'text-[#72796e]'}`}>
                              {day.dayName}
                            </p>
                            <p className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-[#154212]'}`}>
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
                                className={`py-2 rounded-lg font-mono text-sm transition-all ${
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
              <div className="mt-8 bg-[#154212] p-6 rounded-2xl text-white shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-white/60 font-mono text-[10px] uppercase tracking-widest">Din booking</p>
                    <p className="text-xl font-bold mt-1">
                      {new Date(selectedDate).getDate()}. {new Date(selectedDate).toLocaleDateString("nb-NO", { month: "long" })}, {selectedTime}
                    </p>
                    <p className="text-white/60 text-sm">{service?.duration || 20} minutter med {instructor?.User?.name?.split(" ")[0] || "coach"}</p>
                  </div>
                  <BadgeCheck className="w-6 h-6 text-[#d2f000]" />
                </div>
                <button 
                  onClick={handleContinue}
                  className="w-full bg-[#d2f000] text-[#154212] font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Book nå <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Info om begrenset utvalg */}
            <div className="mt-8 bg-[#f7f3ea] rounded-xl p-6">
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
          </section>
        </main>
      </div>
    </>
  );
}
