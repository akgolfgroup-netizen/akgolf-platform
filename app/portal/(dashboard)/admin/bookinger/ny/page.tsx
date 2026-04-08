"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  Clock,
  User,
  Briefcase,
  Calendar,
  Check,
  Zap,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar, HGCapacityBar } from "@/components/portal/mission-control";
import Link from "next/link";
import { format, addDays, startOfWeek, addHours, setHours, setMinutes } from "date-fns";
import { nb } from "date-fns/locale";

// Mock data
const mockStudents = [
  { id: "1", name: "Olav Hansen", email: "olav@example.com", initials: "OH" },
  { id: "2", name: "Mari Kristiansen", email: "mari@example.com", initials: "MK" },
  { id: "3", name: "Erik Johansen", email: "erik@example.com", initials: "EJ" },
  { id: "4", name: "Sofie Berg", email: "sofie@example.com", initials: "SB" },
];

const mockServices = [
  { id: "1", name: "Privat Coaching", duration: "50 min", price: 1200, category: "coaching" },
  { id: "2", name: "Videoanalyse", duration: "50 min", price: 950, category: "analysis" },
  { id: "3", name: "Junior Trening", duration: "60 min", price: 600, category: "junior" },
  { id: "4", name: "Gruppetrening", duration: "90 min", price: 400, category: "group" },
];

const mockCoaches = [
  { id: "1", name: "Anders Kristiansen", role: "Hovedcoach" },
  { id: "2", name: "Maria Hansen", role: "Junior Coach" },
];

// Generate available slots
const generateSlots = () => {
  const slots = [];
  const today = new Date();
  for (let day = 0; day < 7; day++) {
    const date = addDays(today, day);
    for (let hour = 9; hour <= 17; hour++) {
      if (hour !== 12) { // Skip lunch
        const isBooked = Math.random() < 0.3;
        slots.push({
          date,
          time: `${hour.toString().padStart(2, "0")}:00`,
          available: !isBooked,
        });
      }
    }
  }
  return slots;
};

const availableSlots = generateSlots();

export default function NewBookingPage() {
  const router = useRouter();
  const { toggle } = useMCSidebar();
  const [step, setStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStudentData = mockStudents.find((s) => s.id === selectedStudent);
  const selectedServiceData = mockServices.find((s) => s.id === selectedService);
  const selectedCoachData = mockCoaches.find((c) => c.id === selectedCoach);

  const handleSubmit = () => {
    // Submit booking
    router.push("/portal/admin/bookinger");
  };

  const steps = [
    { label: "Elev", complete: !!selectedStudent },
    { label: "Tjeneste", complete: !!selectedService },
    { label: "Coach", complete: !!selectedCoach },
    { label: "Tidspunkt", complete: !!selectedSlot },
  ];

  return (
    <>
      <MCTopbar
        title="Ny Booking"
        subtitle="Book en ny økt for en elev"
        onMenuClick={toggle}
      />

      <div className="p-5 max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/portal/admin/bookinger"
          className="inline-flex items-center gap-1 text-sm text-[var(--hg-text-muted)] hover:text-[var(--hg-text)] transition-colors mb-5"
        >
          <ChevronLeft className="w-4 h-4" />
          Tilbake til bookinger
        </Link>

        {/* Progress Steps */}
        <div className="hg-card p-4 mb-5">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                    s.complete
                      ? "bg-[var(--hg-success)] text-white"
                      : step === i + 1
                      ? "bg-[var(--hg-primary)] text-[var(--hg-bg)]"
                      : "bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]"
                  )}
                >
                  {s.complete ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    step === i + 1 ? "text-[var(--hg-text)]" : "text-[var(--hg-text-muted)]"
                  )}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-1 hidden sm:block",
                      s.complete ? "bg-[var(--hg-success)]" : "bg-[var(--hg-border)]"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="hg-card p-5">
          {/* Step 1: Select Student */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--hg-text)]">Velg elev</h2>
                <button className="hg-btn hg-btn-ghost text-[var(--hg-primary)]">
                  <UserPlus className="w-4 h-4" />
                  Ny elev
                </button>
              </div>

              <div className="flex items-center gap-2 bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg px-3 py-2.5">
                <Search className="w-4 h-4 text-[var(--hg-text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Søk etter elev..."
                  className="flex-1 bg-transparent text-sm text-[var(--hg-text)] placeholder:text-[var(--hg-text-muted)] outline-none"
                  autoFocus
                />
              </div>

              <div className="space-y-1 max-h-[300px] overflow-y-auto hg-scrollbar">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => {
                      setSelectedStudent(student.id);
                      setStep(2);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                      selectedStudent === student.id
                        ? "bg-[var(--hg-primary-glow)] border border-[var(--hg-primary)]"
                        : "hover:bg-[var(--hg-surface-raised)]"
                    )}
                  >
                    <div className="hg-avatar hg-avatar-sm">{student.initials}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--hg-text)]">
                        {student.name}
                      </div>
                      <div className="text-xs text-[var(--hg-text-muted)]">{student.email}</div>
                    </div>
                    {selectedStudent === student.id && (
                      <Check className="w-4 h-4 text-[var(--hg-primary)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Service */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--hg-text)]">Velg tjeneste</h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[var(--hg-text-muted)] hover:text-[var(--hg-text)]"
                >
                  Tilbake
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mockServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id);
                      setStep(3);
                    }}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all",
                      selectedService === service.id
                        ? "bg-[var(--hg-primary-glow)] border-[var(--hg-primary)]"
                        : "bg-[var(--hg-surface)] border-[var(--hg-border)] hover:border-[var(--hg-border-hover)]"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Briefcase className="w-5 h-5 text-[var(--hg-primary)]" />
                      <span className="text-lg font-bold text-[var(--hg-text)]">
                        {service.price.toLocaleString("nb-NO")} kr
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-[var(--hg-text)]">{service.name}</h3>
                    <p className="text-xs text-[var(--hg-text-muted)] mt-1">
                      {service.duration}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Coach */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--hg-text)]">Velg coach</h2>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-[var(--hg-text-muted)] hover:text-[var(--hg-text)]"
                >
                  Tilbake
                </button>
              </div>

              <div className="space-y-2">
                {mockCoaches.map((coach) => (
                  <button
                    key={coach.id}
                    onClick={() => {
                      setSelectedCoach(coach.id);
                      setStep(4);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-lg border transition-all text-left",
                      selectedCoach === coach.id
                        ? "bg-[var(--hg-primary-glow)] border-[var(--hg-primary)]"
                        : "bg-[var(--hg-surface)] border-[var(--hg-border)] hover:border-[var(--hg-border-hover)]"
                    )}
                  >
                    <div className="hg-avatar">{coach.name.split(" ").map((n) => n[0]).join("")}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--hg-text)]">
                        {coach.name}
                      </div>
                      <div className="text-xs text-[var(--hg-text-muted)]">{coach.role}</div>
                    </div>
                    {selectedCoach === coach.id && (
                      <Check className="w-4 h-4 text-[var(--hg-primary)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Select Time Slot */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--hg-text)]">Velg tidspunkt</h2>
                <button
                  onClick={() => setStep(3)}
                  className="text-xs text-[var(--hg-text-muted)] hover:text-[var(--hg-text)]"
                >
                  Tilbake
                </button>
              </div>

              {/* Quick Book Suggestion */}
              <div className="p-3 bg-[var(--hg-primary-glow)] rounded-lg border border-[var(--hg-primary)] flex items-center gap-3">
                <Zap className="w-5 h-5 text-[var(--hg-primary)]" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-[var(--hg-primary)]">
                    Neste ledige: I morgen 10:00
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedSlot({ date: addDays(new Date(), 1), time: "10:00" });
                  }}
                  className="hg-btn hg-btn-primary text-xs py-1 px-2"
                >
                  Velg
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-[var(--hg-text-muted)] py-2"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => {
                  const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
                  const daySlots = availableSlots.filter(
                    (s) => format(s.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                  );
                  const availableCount = daySlots.filter((s) => s.available).length;
                  const isSelected =
                    selectedSlot && format(selectedSlot.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const firstAvailable = daySlots.find((s) => s.available);
                        if (firstAvailable) {
                          setSelectedSlot({ date, time: firstAvailable.time });
                        }
                      }}
                      disabled={availableCount === 0}
                      className={cn(
                        "aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors",
                        isSelected
                          ? "bg-[var(--hg-primary)] text-[var(--hg-bg)]"
                          : availableCount > 0
                          ? "bg-[var(--hg-surface-raised)] text-[var(--hg-text)] hover:bg-[var(--hg-border)]"
                          : "bg-[var(--hg-surface)] text-[var(--hg-text-disabled)] cursor-not-allowed"
                      )}
                    >
                      <span className="font-medium">{format(date, "d")}</span>
                      {availableCount > 0 && (
                        <span className="text-[10px] opacity-70">{availableCount} ledige</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              {selectedSlot && (
                <div className="pt-4 border-t border-[var(--hg-border)]">
                  <h3 className="text-sm font-medium text-[var(--hg-text)] mb-3">
                    Tilgjengelige tider for{" "}
                    {format(selectedSlot.date, "EEEE d. MMMM", { locale: nb })}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSlots
                      .filter(
                        (s) =>
                          format(s.date, "yyyy-MM-dd") ===
                          format(selectedSlot.date, "yyyy-MM-dd")
                      )
                      .map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedSlot({ ...selectedSlot, time: slot.time })}
                          disabled={!slot.available}
                          className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                            selectedSlot.time === slot.time
                              ? "bg-[var(--hg-primary)] text-[var(--hg-bg)]"
                              : slot.available
                              ? "bg-[var(--hg-surface-raised)] text-[var(--hg-text)] hover:bg-[var(--hg-border)]"
                              : "bg-[var(--hg-surface)] text-[var(--hg-text-disabled)] cursor-not-allowed line-through"
                          )}
                        >
                          {slot.time}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary & Submit */}
        {selectedStudent && selectedService && selectedCoach && selectedSlot && (
          <div className="hg-card-raised mt-5 p-5">
            <h3 className="text-sm font-medium text-[var(--hg-text)] mb-4">Oppsummering</h3>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--hg-text-muted)]" />
                <span className="text-sm text-[var(--hg-text)]">{selectedStudentData?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[var(--hg-text-muted)]" />
                <span className="text-sm text-[var(--hg-text)]">{selectedServiceData?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--hg-text-muted)]" />
                <span className="text-sm text-[var(--hg-text)]">{selectedCoachData?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--hg-text-muted)]" />
                <span className="text-sm text-[var(--hg-text)]">
                  {format(selectedSlot.date, "d. MMMM", { locale: nb })} kl {selectedSlot.time}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[var(--hg-border)]">
              <div>
                <span className="text-xs text-[var(--hg-text-muted)]">Total pris</span>
                <div className="text-xl font-bold text-[var(--hg-primary)]">
                  {selectedServiceData?.price.toLocaleString("nb-NO")} kr
                </div>
              </div>
              <button onClick={handleSubmit} className="hg-btn hg-btn-primary">
                <Check className="w-4 h-4" />
                Bekreft booking
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


