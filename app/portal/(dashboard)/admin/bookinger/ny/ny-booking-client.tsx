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
  Zap,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import {
  MCTopbar,
  useMCSidebar,
} from "@/components/portal/mission-control";
import Link from "next/link";
import { format, addDays, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import {
  adminCreateBooking,
  searchStudentsForBooking,
} from "../actions";
import type {
  ServiceTypeOption,
  InstructorOption,
  StudentOption,
} from "../actions";

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
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceTypeOption | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorOption | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);

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
    [selectedService, selectedInstructor]
  );

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  // ── Submit ──

  const handleSubmit = () => {
    if (!selectedStudent || !selectedService || !selectedInstructor || !selectedSlot) return;
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
        router.push("/portal/admin/bookinger");
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

      <div className="p-5 max-w-4xl mx-auto">
        {/* Tilbake */}
        <Link
          href="/portal/admin/bookinger"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors mb-5"
        >
          <ChevronLeft className="w-4 h-4" />
          Tilbake til bookinger
        </Link>

        {/* Steg-indikator */}
        <div className="rounded-xl border border-[var(--color-grey-200)] bg-white p-4 mb-5">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                    s.complete
                      ? "bg-[var(--color-success)] text-white"
                      : step === i + 1
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-grey-200)] text-[var(--color-muted)]"
                  )}
                >
                  {s.complete ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    step === i + 1
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-muted)]"
                  )}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-1 hidden sm:block",
                      s.complete
                        ? "bg-[var(--color-success)]"
                        : "bg-[var(--color-grey-200)]"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steg-innhold */}
        <div className="rounded-xl border border-[var(--color-grey-200)] bg-white p-5">
          {/* Steg 1: Velg elev */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Velg elev
              </h2>

              <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-grey-200)] rounded-lg px-3 py-2.5">
                <Search className="w-4 h-4 text-[var(--color-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sok etter elev..."
                  className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none"
                  autoFocus
                />
                {searchLoading && (
                  <Loader2 className="w-4 h-4 text-[var(--color-muted)] animate-spin" />
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
                        ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]"
                        : "hover:bg-[var(--color-surface)]"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-semibold">
                      {getInitials(student.name, student.email)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--color-text)]">
                        {student.name ?? student.email}
                      </div>
                      <div className="text-xs text-[var(--color-muted)]">
                        {student.email}
                      </div>
                    </div>
                    {selectedStudent?.id === student.id && (
                      <Check className="w-4 h-4 text-[var(--color-primary)]" />
                    )}
                  </button>
                ))}
                {!searchLoading && students.length === 0 && searchQuery && (
                  <p className="text-sm text-[var(--color-muted)] text-center py-4">
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
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Velg tjeneste
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
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
                      "p-4 rounded-lg border text-left transition-all",
                      selectedService?.id === service.id
                        ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]"
                        : "bg-[var(--color-surface)] border-[var(--color-grey-200)] hover:border-[var(--color-grey-400)]"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Briefcase className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-lg font-bold text-[var(--color-text)]">
                        {service.price.toLocaleString("nb-NO")} kr
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-[var(--color-text)]">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[var(--color-muted)] mt-1">
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
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Velg coach
                </h2>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
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
                      "w-full flex items-center gap-3 p-4 rounded-lg border transition-all text-left",
                      selectedInstructor?.id === instructor.id
                        ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]"
                        : "bg-[var(--color-surface)] border-[var(--color-grey-200)] hover:border-[var(--color-grey-400)]"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-semibold">
                      {instructor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--color-text)]">
                        {instructor.name}
                      </div>
                      {instructor.title && (
                        <div className="text-xs text-[var(--color-muted)]">
                          {instructor.title}
                        </div>
                      )}
                    </div>
                    {selectedInstructor?.id === instructor.id && (
                      <Check className="w-4 h-4 text-[var(--color-primary)]" />
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
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Velg tidspunkt
                </h2>
                <button
                  onClick={() => setStep(3)}
                  className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
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
                      className="text-center text-xs font-medium text-[var(--color-muted)] py-2"
                    >
                      {day}
                    </div>
                  )
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
                          ? "bg-[var(--color-primary)] text-white"
                          : isPast
                            ? "bg-[var(--color-surface)] text-[var(--color-grey-400)] cursor-not-allowed"
                            : "bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-grey-200)]"
                      )}
                    >
                      <span className="font-medium">{format(date, "d")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tilgjengelige tider */}
              {selectedDate && (
                <div className="pt-4 border-t border-[var(--color-grey-200)]">
                  <h3 className="text-sm font-medium text-[var(--color-text)] mb-3">
                    Tilgjengelige tider for{" "}
                    {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
                  </h3>

                  {slotsLoading ? (
                    <div className="flex items-center gap-2 py-4 text-sm text-[var(--color-muted)]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Henter ledige tider...
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-[var(--color-muted)] py-4">
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
                              ? "bg-[var(--color-primary)] text-white"
                              : "bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-grey-200)]"
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
            <div className="rounded-xl border border-[var(--color-grey-200)] bg-white shadow-sm mt-5 p-5">
              <h3 className="text-sm font-medium text-[var(--color-text)] mb-4">
                Oppsummering
              </h3>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--color-muted)]" />
                  <span className="text-sm text-[var(--color-text)]">
                    {selectedStudent.name ?? selectedStudent.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[var(--color-muted)]" />
                  <span className="text-sm text-[var(--color-text)]">
                    {selectedService.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--color-muted)]" />
                  <span className="text-sm text-[var(--color-text)]">
                    {selectedInstructor.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--color-muted)]" />
                  <span className="text-sm text-[var(--color-text)]">
                    {format(selectedSlot.date, "d. MMMM", { locale: nb })} kl{" "}
                    {selectedSlot.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-grey-200)]">
                <div>
                  <span className="text-xs text-[var(--color-muted)]">
                    Total pris
                  </span>
                  <div className="text-xl font-bold text-[var(--color-primary)]">
                    {selectedService.price.toLocaleString("nb-NO")} kr
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors",
                    isPending
                      ? "bg-[var(--color-primary)]/60 cursor-not-allowed"
                      : "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                  )}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {isPending ? "Oppretter..." : "Bekreft booking"}
                </button>
              </div>
            </div>
          )}
      </div>
    </>
  );
}
