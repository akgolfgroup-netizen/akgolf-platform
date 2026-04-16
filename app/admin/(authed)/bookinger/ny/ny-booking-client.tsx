"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  User,
  Briefcase,
  Calendar,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { Button } from "@/components/ui/button";
import {
  AdminInput,
} from "@/components/portal/mission-control/ui";
import Link from "next/link";
import { format, addDays, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { adminCreateBooking, searchStudentsForBooking } from "../create-actions";
import type {
  ServiceTypeOption,
  InstructorOption,
  StudentOption,
} from "../create-actions";

// ── Props ──

type Props = {
  serviceTypes: ServiceTypeOption[];
  instructors: InstructorOption[];
};

// ── Component ──

export function NyBookingClient({ serviceTypes, instructors }: Props) {
  const router = useRouter();
  const { toggle } = useMCSidebar();
  const [isPending, startTransition] = useTransition();

  // Steg-state
  const [step, setStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(
    null,
  );
  const [selectedService, setSelectedService] =
    useState<ServiceTypeOption | null>(null);
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorOption | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    time: string;
  } | null>(null);

  // Elevsøk
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Slots
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Submit-feil
  const [error, setError] = useState<string | null>(null);

  // ── Elevsøk med debounce ──

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchLoading(true);
      searchStudentsForBooking(searchQuery)
        .then(setStudents)
        .finally(() => setSearchLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── Hent slots for valgt dato ──

  const fetchSlots = useCallback(
    async (date: Date) => {
      if (!selectedService || !selectedInstructor) return;
      setSlotsLoading(true);
      setSlots([]);
      try {
        const dateStr = format(date, "yyyy-MM-dd");
        const params = new URLSearchParams({
          instructorId: selectedInstructor.id,
          serviceTypeId: selectedService.id,
          date: dateStr,
        });
        const res = await fetch(`/api/portal/public/slots?${params}`);
        if (res.ok) {
          const data: string[] = await res.json();
          setSlots(data);
        }
      } finally {
        setSlotsLoading(false);
      }
    },
    [selectedService, selectedInstructor],
  );

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  // ── Submit ──

  const handleSubmit = () => {
    if (
      !selectedStudent ||
      !selectedService ||
      !selectedInstructor ||
      !selectedSlot
    )
      return;
    setError(null);

    startTransition(async () => {
      try {
        const dateStr = format(selectedSlot.date, "yyyy-MM-dd");
        await adminCreateBooking({
          studentEmail: selectedStudent.email,
          studentName: selectedStudent.name ?? selectedStudent.email,
          serviceTypeId: selectedService.id,
          instructorId: selectedInstructor.id,
          startTime: `${dateStr}T${selectedSlot.time}:00`,
        });
        router.push("/admin/bookinger");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Noe gikk galt");
      }
    });
  };

  // ── Hjelpe-funksjoner ──

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const steps = [
    { label: "Elev", complete: !!selectedStudent },
    { label: "Tjeneste", complete: !!selectedService },
    { label: "Coach", complete: !!selectedInstructor },
    { label: "Tidspunkt", complete: !!selectedSlot },
  ];

  // ── Kalender: 5 uker fra mandag denne uken ──

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  return (
    <>
      <MCTopbar
        title="Ny Booking"
        subtitle="Book en ny okt for en elev"
        onMenuClick={toggle}
      />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Tilbake */}
        <Link
          href="/admin/bookinger"
          className="inline-flex items-center gap-1 text-sm text-grey-400 hover:text-black transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Tilbake til bookinger
        </Link>

        {/* Steg-indikator */}
        <div className="bg-white border border-grey-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                    s.complete
                      ? "bg-success-text text-white"
                      : step === i + 1
                        ? "bg-black text-white"
                        : "bg-grey-200 text-grey-400",
                  )}
                >
                  {s.complete ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    step === i + 1
                      ? "text-black"
                      : "text-grey-400",
                  )}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-1 hidden sm:block",
                      s.complete
                        ? "bg-success-text"
                        : "bg-grey-200",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steg-innhold */}
        <div className="bg-white border border-grey-200 rounded-xl p-6">
          {/* Steg 1: Velg elev */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black">
                Velg elev
              </h2>

              <div className="relative">
                <Search className="w-4 h-4 text-grey-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <AdminInput
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sok etter elev..."
                  className="pl-9"
                  autoFocus
                />
                {searchLoading && (
                  <Loader2 className="w-4 h-4 text-grey-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>

              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setStep(2);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                      selectedStudent?.id === student.id
                        ? "bg-grey-50 border border-success-text"
                        : "hover:bg-grey-50",
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                      {getInitials(student.name, student.email)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-black">
                        {student.name ?? student.email}
                      </div>
                      <div className="text-xs text-grey-400">
                        {student.email}
                      </div>
                    </div>
                    {selectedStudent?.id === student.id && (
                      <Check className="w-4 h-4 text-success-text" />
                    )}
                  </button>
                ))}
                {!searchLoading && students.length === 0 && searchQuery && (
                  <p className="text-sm text-grey-400 text-center py-4">
                    Ingen elever funnet
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Steg 2: Velg tjeneste */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black">
                  Velg tjeneste
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-grey-400 hover:text-black"
                >
                  Tilbake
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceTypes.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setStep(3);
                    }}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      selectedService?.id === service.id
                        ? "bg-grey-50 border-success-text"
                        : "bg-grey-50 border-grey-200 hover:border-grey-300",
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Briefcase className="w-5 h-5 text-success-text" />
                      <span className="text-lg font-bold text-black tabular-nums">
                        {service.price.toLocaleString("nb-NO")} kr
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-black">
                      {service.name}
                    </h3>
                    <p className="text-xs text-grey-400 mt-1">
                      {service.duration} min
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Steg 3: Velg coach */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black">
                  Velg coach
                </h2>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-grey-400 hover:text-black"
                >
                  Tilbake
                </button>
              </div>

              <div className="space-y-2">
                {instructors.map((instructor) => (
                  <button
                    key={instructor.id}
                    onClick={() => {
                      setSelectedInstructor(instructor);
                      setSelectedSlot(null);
                      setSelectedDate(null);
                      setSlots([]);
                      setStep(4);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                      selectedInstructor?.id === instructor.id
                        ? "bg-grey-50 border-success-text"
                        : "bg-grey-50 border-grey-200 hover:border-grey-300",
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                      {instructor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-black">
                        {instructor.name}
                      </div>
                      {instructor.title && (
                        <div className="text-xs text-grey-400">
                          {instructor.title}
                        </div>
                      )}
                    </div>
                    {selectedInstructor?.id === instructor.id && (
                      <Check className="w-4 h-4 text-success-text" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Steg 4: Velg tidspunkt */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black">
                  Velg tidspunkt
                </h2>
                <button
                  onClick={() => setStep(3)}
                  className="text-xs text-grey-400 hover:text-black"
                >
                  Tilbake
                </button>
              </div>

              {/* Kalender-grid */}
              <div className="grid grid-cols-7 gap-1">
                {["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-grey-400 py-2"
                    >
                      {day}
                    </div>
                  ),
                )}
                {Array.from({ length: 35 }).map((_, i) => {
                  const date = addDays(weekStart, i);
                  const isPast = date < new Date(new Date().toDateString());
                  const isSelected =
                    selectedDate &&
                    format(selectedDate, "yyyy-MM-dd") ===
                      format(date, "yyyy-MM-dd");

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      disabled={isPast}
                      className={cn(
                        "aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors",
                        isSelected
                          ? "bg-black text-white"
                          : isPast
                            ? "bg-grey-50 text-grey-400 cursor-not-allowed"
                            : "bg-grey-50 text-black hover:bg-grey-200",
                      )}
                    >
                      <span className="font-medium">{format(date, "d")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tilgjengelige tider */}
              {selectedDate && (
                <div className="pt-4 border-t border-grey-200">
                  <h3 className="text-sm font-medium text-black mb-3">
                    Tilgjengelige tider for{" "}
                    {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
                  </h3>

                  {slotsLoading ? (
                    <div className="flex items-center gap-2 py-4 text-sm text-grey-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Henter ledige tider...
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-grey-400 py-4">
                      Ingen ledige tider denne dagen
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {slots.map((time) => (
                        <button
                          key={time}
                          onClick={() =>
                            setSelectedSlot({ date: selectedDate, time })
                          }
                          className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                            selectedSlot?.time === time &&
                              selectedSlot.date === selectedDate
                              ? "bg-black text-white"
                              : "bg-grey-50 text-black hover:bg-grey-200",
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Oppsummering og bekreft */}
        {selectedStudent &&
          selectedService &&
          selectedInstructor &&
          selectedSlot && (
            <div className="bg-white border border-grey-200 rounded-xl p-6 mt-5">
              <h3 className="text-sm font-medium text-black mb-4">
                Oppsummering
              </h3>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-error-light text-error text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-grey-400" />
                  <span className="text-sm text-black">
                    {selectedStudent.name ?? selectedStudent.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-grey-400" />
                  <span className="text-sm text-black">
                    {selectedService.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-grey-400" />
                  <span className="text-sm text-black">
                    {selectedInstructor.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-grey-400" />
                  <span className="text-sm text-black">
                    {format(selectedSlot.date, "d. MMMM", { locale: nb })} kl{" "}
                    {selectedSlot.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-grey-200">
                <div>
                  <span className="text-xs text-grey-400">
                    Total pris
                  </span>
                  <div className="text-xl font-bold text-success-text tabular-nums">
                    {selectedService.price.toLocaleString("nb-NO")} kr
                  </div>
                </div>
                <Button
                  variant="accent"
                  onClick={handleSubmit}
                  isLoading={isPending}
                >
                  {!isPending && <Check className="w-4 h-4" />}
                  {isPending ? "Oppretter..." : "Bekreft booking"}
                </Button>
              </div>
            </div>
          )}
      </div>
    </>
  );
}
