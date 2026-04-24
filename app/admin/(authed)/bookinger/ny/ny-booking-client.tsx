"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useCallback, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { Button } from "@/components/ui/button";
import {
  AdminInput,
} from "@/components/portal/mission-control/ui";
import Link from "next/link";
import { format, addDays, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import {
  adminCreateBooking,
  searchStudentsForBooking,
  getInstructorDefaultFacility,
} from "../create-actions";
import type {
  ServiceTypeOption,
  InstructorOption,
  StudentOption,
  FacilityOption,
} from "../create-actions";

// ── Props ──

type Props = {
  serviceTypes: ServiceTypeOption[];
  instructors: InstructorOption[];
  facilities: FacilityOption[];
};

// ── Component ──

export function NyBookingClient({ serviceTypes, instructors, facilities }: Props) {
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

  // Fasilitet
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");

  // Submit-feil
  const [error, setError] = useState<string | null>(null);

  // Hent default-fasilitet når coach/tjeneste velges
  useEffect(() => {
    if (!selectedInstructor || !selectedService) return;
    getInstructorDefaultFacility(selectedInstructor.id, selectedService.id)
      .then((defaultId) => {
        if (defaultId) setSelectedFacilityId(defaultId);
      })
      .catch(() => {});
  }, [selectedInstructor, selectedService]);

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
          facilityId: selectedFacilityId || null,
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
          className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-6"
        >
          <Icon name="chevron_left" className="w-4 h-4" />
          Tilbake til bookinger
        </Link>

        {/* Steg-indikator */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                    s.complete
                      ? "bg-success-text text-surface"
                      : step === i + 1
                        ? "bg-on-surface text-surface"
                        : "bg-surface-variant text-on-surface-variant",
                  )}
                >
                  {s.complete ? <Icon name="check" className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    step === i + 1
                      ? "text-on-surface"
                      : "text-on-surface-variant",
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
                        : "bg-surface-variant",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steg-innhold */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          {/* Steg 1: Velg elev */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-on-surface">
                Velg elev
              </h2>

              <div className="relative">
                <Icon name="search" className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <AdminInput
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sok etter elev..."
                  className="pl-9"
                  autoFocus
                />
                {searchLoading && (
                  <Icon name="progress_activity" className="w-4 h-4 text-on-surface-variant animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
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
                        ? "bg-surface border border-success-text"
                        : "hover:bg-surface",
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-on-surface text-surface flex items-center justify-center text-xs font-semibold">
                      {getInitials(student.name, student.email)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-on-surface">
                        {student.name ?? student.email}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {student.email}
                      </div>
                    </div>
                    {selectedStudent?.id === student.id && (
                      <Icon name="check" className="w-4 h-4 text-success-text" />
                    )}
                  </button>
                ))}
                {!searchLoading && students.length === 0 && searchQuery && (
                  <p className="text-sm text-on-surface-variant text-center py-4">
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
                <h2 className="text-lg font-semibold text-on-surface">
                  Velg tjeneste
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-on-surface-variant hover:text-on-surface"
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
                        ? "bg-surface border-success-text"
                        : "bg-surface border-outline-variant/30 hover:border-outline-variant/50",
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Briefcase className="w-5 h-5 text-success-text" />
                      <span className="text-lg font-bold text-on-surface tabular-nums">
                        {service.price.toLocaleString("nb-NO")} kr
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-on-surface">
                      {service.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
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
                <h2 className="text-lg font-semibold text-on-surface">
                  Velg coach
                </h2>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-on-surface-variant hover:text-on-surface"
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
                        ? "bg-surface border-success-text"
                        : "bg-surface border-outline-variant/30 hover:border-outline-variant/50",
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-on-surface text-surface flex items-center justify-center text-sm font-semibold">
                      {instructor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-on-surface">
                        {instructor.name}
                      </div>
                      {instructor.title && (
                        <div className="text-xs text-on-surface-variant">
                          {instructor.title}
                        </div>
                      )}
                    </div>
                    {selectedInstructor?.id === instructor.id && (
                      <Icon name="check" className="w-4 h-4 text-success-text" />
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
                <h2 className="text-lg font-semibold text-on-surface">
                  Velg tidspunkt
                </h2>
                <button
                  onClick={() => setStep(3)}
                  className="text-xs text-on-surface-variant hover:text-on-surface"
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
                      className="text-center text-xs font-medium text-on-surface-variant py-2"
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
                          ? "bg-on-surface text-surface"
                          : isPast
                            ? "bg-surface text-on-surface-variant cursor-not-allowed"
                            : "bg-surface text-on-surface hover:bg-surface-variant",
                      )}
                    >
                      <span className="font-medium">{format(date, "d")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tilgjengelige tider */}
              {selectedDate && (
                <div className="pt-4 border-t border-outline-variant/30">
                  <h3 className="text-sm font-medium text-on-surface mb-3">
                    Tilgjengelige tider for{" "}
                    {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
                  </h3>

                  {slotsLoading ? (
                    <div className="flex items-center gap-2 py-4 text-sm text-on-surface-variant">
                      <Icon name="progress_activity" className="w-4 h-4 animate-spin" />
                      Henter ledige tider...
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-on-surface-variant py-4">
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
                              ? "bg-on-surface text-surface"
                              : "bg-surface text-on-surface hover:bg-surface-variant",
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
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 mt-5">
              <h3 className="text-sm font-medium text-on-surface mb-4">
                Oppsummering
              </h3>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-error-light text-error text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Icon name="person" className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-sm text-on-surface">
                    {selectedStudent.name ?? selectedStudent.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-sm text-on-surface">
                    {selectedService.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="person" className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-sm text-on-surface">
                    {selectedInstructor.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="calendar_today" className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-sm text-on-surface">
                    {format(selectedSlot.date, "d. MMMM", { locale: nb })} kl{" "}
                    {selectedSlot.time}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-on-surface-variant block mb-1">
                  Fasilitet
                </label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="w-full text-sm bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-success-text"
                >
                  <option value="">— Ingen / bruk default —</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                <div>
                  <span className="text-xs text-on-surface-variant">
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
                  {!isPending && <Icon name="check" className="w-4 h-4" />}
                  {isPending ? "Oppretter..." : "Bekreft booking"}
                </Button>
              </div>
            </div>
          )}
      </div>
    </>
  );
}
