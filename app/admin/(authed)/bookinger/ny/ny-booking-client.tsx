"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, addDays, startOfWeek, getISOWeek } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Calendar,
  Check,
  Dumbbell,
  MapPin,
  Repeat,
  Save,
  Search,
  User,
  UserCheck,
  X,
} from "lucide-react";
import {
  adminCreateBookingWithPayment,
  searchStudentsForBooking,
  getInstructorDefaultFacility,
} from "../create-actions";
import type {
  ServiceTypeOption,
  InstructorOption,
  StudentOption,
  FacilityOption,
  ManualBookingPaymentMode,
} from "../create-actions";

type Props = {
  serviceTypes: ServiceTypeOption[];
  instructors: InstructorOption[];
  facilities: FacilityOption[];
};

type Slot = { time: string; taken: boolean };

const REPEATS = [
  { id: "once", label: "Engangs" },
  { id: "weekly", label: "Hver uke" },
  { id: "biweekly", label: "Annen hver" },
  { id: "monthly", label: "Hver måned" },
];

export function NyBookingClient({ serviceTypes, instructors, facilities }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceTypeOption | null>(
    serviceTypes[0] ?? null,
  );
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorOption | null>(
    instructors[0] ?? null,
  );
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] =
    useState<ManualBookingPaymentMode>("payment-link");
  const [studentPhone, setStudentPhone] = useState("");
  const [repeat, setRepeat] = useState<string>("once");
  const [note, setNote] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Default facility
  useEffect(() => {
    if (!selectedInstructor || !selectedService) return;
    getInstructorDefaultFacility(selectedInstructor.id, selectedService.id)
      .then((id) => {
        if (id) setSelectedFacilityId(id);
      })
      .catch(() => {});
  }, [selectedInstructor, selectedService]);

  // Spiller-søk
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchLoading(true);
      searchStudentsForBooking(searchQuery)
        .then(setStudents)
        .finally(() => setSearchLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

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
          const available: string[] = await res.json();
          // Build a 09:00–17:00 30-min grid; mark unavailable as taken
          const grid: Slot[] = [];
          for (let h = 9; h < 17; h++) {
            for (const m of [0, 30]) {
              const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
              grid.push({ time, taken: !available.includes(time) });
            }
          }
          setSlots(grid);
        }
      } finally {
        setSlotsLoading(false);
      }
    },
    [selectedService, selectedInstructor],
  );

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  function handleSubmit() {
    if (!selectedStudent || !selectedService || !selectedInstructor || !selectedTime) {
      setError("Velg spiller, tjeneste, coach og tidspunkt.");
      return;
    }
    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const result = await adminCreateBookingWithPayment({
          studentEmail: selectedStudent.email,
          studentName: selectedStudent.name ?? selectedStudent.email,
          studentPhone: studentPhone || undefined,
          serviceTypeId: selectedService.id,
          instructorId: selectedInstructor.id,
          startTime: `${dateStr}T${selectedTime}:00`,
          facilityId: selectedFacilityId || null,
          paymentMode,
        });

        if (result.paymentMode === "off-session" && result.chargeStatus === "succeeded") {
          setSuccessMessage("Booking opprettet og betaling trukket fra lagret kort.");
        } else if (result.paymentMode === "payment-link") {
          const channels = [
            result.smsSent ? "SMS" : null,
            result.emailSent ? "e-post" : null,
          ]
            .filter(Boolean)
            .join(" + ");
          setSuccessMessage(
            `Booking opprettet. Betalingslenke sendt via ${channels || "ingen kanaler"}.`,
          );
        } else {
          setSuccessMessage("Booking opprettet uten betaling.");
        }
        setTimeout(() => router.push("/admin/bookinger"), 1200);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Noe gikk galt");
      }
    });
  }

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const dateStrip = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const weekNum = getISOWeek(selectedDate);

  return (
    <div className="px-7 py-6 text-white" style={{ background: "#102B1E" }}>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div
            className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "#D1F843" }}
          >
            Plan · Ny booking
          </div>
          <h1
            className="mt-2 text-[28px] font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            Bok ny økt
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] text-white/60">
            Velg spiller, type, tid og lokasjon. Konflikter og forslag oppdateres i sanntid.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/bookinger"
            className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium text-white/85 transition hover:bg-white/[0.06]"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.8} /> Avbryt
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-[18px] xl:grid-cols-[1.4fr_1fr]">
        {/* LEFT — form */}
        <div
          className="rounded-[14px] border bg-white/[0.04] p-6"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          <h2
            className="mb-1 text-[16px] font-semibold tracking-tight text-white"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            Detaljer
          </h2>
          <div className="mb-5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
            trinn 1 — fyll ut
          </div>

          {/* Spiller */}
          <Field label="Spiller" required hint="Søk eller velg">
            {selectedStudent && !showSearch ? (
              <div
                className="flex items-center gap-3 rounded-[10px] border px-3 py-2.5"
                style={{
                  background: "rgba(209,248,67,0.10)",
                  borderColor: "rgba(209,248,67,0.30)",
                }}
              >
                <div
                  className="grid h-9 w-9 place-items-center rounded-full text-[13px] font-bold"
                  style={{ background: "#D1F843", color: "#0A1F18" }}
                >
                  {initialsOf(selectedStudent)}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-white">
                    {selectedStudent.name ?? selectedStudent.email}
                  </div>
                  <div className="mt-px font-mono text-[10px] tracking-wider text-white/50">
                    {selectedStudent.email.toUpperCase()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSearch(true)}
                  className="ml-auto cursor-pointer text-[11px] font-semibold"
                  style={{ color: "#D1F843" }}
                >
                  Bytt
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-md border border-white/8 bg-white/[0.025] px-3 py-2">
                  <Search className="h-3.5 w-3.5 text-white/50" strokeWidth={1.8} />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Søk navn eller e-post…"
                    className="flex-1 border-none bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
                  />
                </div>
                <div className="max-h-56 overflow-y-auto rounded-md border border-white/8 bg-white/[0.02]">
                  {searchLoading && (
                    <div className="px-3 py-2 text-[12px] text-white/50">Søker…</div>
                  )}
                  {!searchLoading && students.length === 0 && (
                    <div className="px-3 py-2 text-[12px] text-white/50">Ingen treff</div>
                  )}
                  {students.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedStudent(s);
                        setShowSearch(false);
                      }}
                      className="flex w-full items-center gap-3 border-b border-white/5 px-3 py-2 text-left transition last:border-0 hover:bg-white/[0.04]"
                    >
                      <div
                        className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold"
                        style={{ background: "#D1F843", color: "#0A1F18" }}
                      >
                        {initialsOf(s)}
                      </div>
                      <div>
                        <div className="text-[13px] text-white">{s.name ?? s.email}</div>
                        <div className="font-mono text-[10px] text-white/50">{s.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Field>

          {/* Tjeneste */}
          <Field label="Tjeneste" required hint="Påvirker pris og varighet">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {serviceTypes.map((st) => {
                const active = selectedService?.id === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedService(st)}
                    className={
                      "rounded-[10px] border px-3 py-2.5 text-left transition " +
                      (active
                        ? "border-[#D1F843]/30 bg-[#D1F843]/10"
                        : "border-white/8 bg-white/[0.025] hover:bg-white/[0.05]")
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Dumbbell
                        className={"h-3.5 w-3.5 " + (active ? "text-[#D1F843]" : "text-white/70")}
                        strokeWidth={1.8}
                      />
                      <div className="text-[12.5px] font-semibold text-white">{st.name}</div>
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/50">
                      {st.duration} min · {st.price.toLocaleString("nb-NO")} kr
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Coach */}
          <Field label="Coach" required hint={`${instructors.length} tilgjengelig`}>
            <RadioRow>
              {instructors.map((inst) => (
                <RadioOpt
                  key={inst.id}
                  active={selectedInstructor?.id === inst.id}
                  onClick={() => setSelectedInstructor(inst)}
                >
                  <User className="h-3 w-3" strokeWidth={1.8} /> {inst.name}
                  {inst.title && <span className="opacity-70"> · {inst.title}</span>}
                </RadioOpt>
              ))}
            </RadioRow>
          </Field>

          {/* Lokasjon */}
          {facilities.length > 0 && (
            <Field label="Lokasjon">
              <RadioRow>
                <RadioOpt
                  active={selectedFacilityId === ""}
                  onClick={() => setSelectedFacilityId("")}
                >
                  Bruk standard
                </RadioOpt>
                {facilities.map((f) => (
                  <RadioOpt
                    key={f.id}
                    active={selectedFacilityId === f.id}
                    onClick={() => setSelectedFacilityId(f.id)}
                  >
                    <MapPin className="h-3 w-3" strokeWidth={1.8} /> {f.name}
                  </RadioOpt>
                ))}
              </RadioRow>
            </Field>
          )}

          {/* Dato */}
          <Field label="Dato" required hint={`Uke ${weekNum}`}>
            <div className="grid grid-cols-7 gap-1.5">
              {dateStrip.map((d) => {
                const active =
                  format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedTime(null);
                    }}
                    className={
                      "rounded-md border px-1.5 py-2.5 text-center transition " +
                      (active
                        ? "border-[#D1F843]/30 bg-[#D1F843]/10"
                        : "border-white/8 bg-white/[0.025] hover:bg-white/[0.05]")
                    }
                  >
                    <div
                      className={
                        "font-mono text-[9px] uppercase tracking-[0.12em] " +
                        (active ? "text-[#D1F843]" : "text-white/50")
                      }
                    >
                      {format(d, "EEE", { locale: nb })}
                    </div>
                    <div className="mt-0.5 text-[18px] font-bold tracking-tight tabular-nums text-white">
                      {format(d, "dd")}
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Slots */}
          <Field label="Tidspunkt" required hint={selectedInstructor?.name}>
            {slotsLoading ? (
              <div className="text-[12px] text-white/50">Laster ledige tider…</div>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
                {slots.map((s) => {
                  const active = selectedTime === s.time;
                  return (
                    <button
                      key={s.time}
                      type="button"
                      disabled={s.taken}
                      onClick={() => setSelectedTime(s.time)}
                      className={
                        "rounded-[7px] border px-1.5 py-2 text-center font-mono text-[12px] font-medium transition " +
                        (active
                          ? "border-[#D1F843] bg-[#D1F843] text-[#0A1F18] font-bold"
                          : s.taken
                            ? "cursor-not-allowed border-white/8 bg-white/[0.015] text-white/25 line-through"
                            : "border-white/8 bg-white/[0.025] text-white hover:bg-white/[0.05]")
                      }
                    >
                      {s.time}
                    </button>
                  );
                })}
              </div>
            )}
          </Field>

          {/* Notat */}
          <Field label="Notat til spiller" hint="Sendes med varsel · valgfritt">
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="«Møt opp 10 min før, ta med wedge.»"
              className="w-full rounded-md border border-white/8 bg-white/[0.025] p-3 text-[13px] text-white outline-none transition focus:border-[#D1F843]/40"
            />
          </Field>

          {/* Gjenta */}
          <Field label="Gjenta?">
            <RadioRow>
              {REPEATS.map((r) => (
                <RadioOpt key={r.id} active={repeat === r.id} onClick={() => setRepeat(r.id)}>
                  {r.label}
                </RadioOpt>
              ))}
            </RadioRow>
          </Field>
        </div>

        {/* RIGHT — sticky summary */}
        <div className="space-y-3.5">
          <div
            className="sticky top-[78px] overflow-hidden rounded-[14px] border bg-white/[0.04]"
            style={{ borderColor: "rgba(255,255,255,0.10)" }}
          >
            <div
              className="border-b px-5 py-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(209,248,67,0.10), rgba(209,248,67,0.04))",
                borderBottomColor: "rgba(255,255,255,0.10)",
              }}
            >
              <div
                className="font-mono text-[9px] uppercase tracking-[0.18em]"
                style={{ color: "#D1F843" }}
              >
                Forhåndsvisning · Live
              </div>
              <h3
                className="mt-1 text-[20px] font-medium leading-tight tracking-tight text-white"
                style={{ fontFamily: "var(--font-inter-tight)" }}
              >
                {selectedService?.name ?? "Ingen tjeneste valgt"}
              </h3>
            </div>

            <SummaryRow icon={<User className="h-3.5 w-3.5" strokeWidth={1.8} />} k="Spiller">
              {selectedStudent ? selectedStudent.name ?? selectedStudent.email : "—"}
            </SummaryRow>
            <SummaryRow icon={<Dumbbell className="h-3.5 w-3.5" strokeWidth={1.8} />} k="Tjeneste">
              {selectedService ? `${selectedService.name} · ${selectedService.duration} min` : "—"}
            </SummaryRow>
            <SummaryRow icon={<UserCheck className="h-3.5 w-3.5" strokeWidth={1.8} />} k="Coach">
              {selectedInstructor?.name ?? "—"}
            </SummaryRow>
            <SummaryRow icon={<MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />} k="Lokasjon">
              {facilities.find((f) => f.id === selectedFacilityId)?.name ?? "Standard"}
            </SummaryRow>
            <SummaryRow icon={<Calendar className="h-3.5 w-3.5" strokeWidth={1.8} />} k="Når">
              {selectedTime
                ? `${format(selectedDate, "EEEE d. MMMM", { locale: nb })} · ${selectedTime}`
                : "—"}
            </SummaryRow>
            <SummaryRow icon={<Repeat className="h-3.5 w-3.5" strokeWidth={1.8} />} k="Gjentakelse">
              {REPEATS.find((r) => r.id === repeat)?.label ?? "Engangs"}
            </SummaryRow>

            {/* Payment */}
            <div className="border-b border-white/8 px-5 py-3">
              <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
                Betaling
              </div>
              <div className="space-y-1.5">
                {(["off-session", "payment-link", "none"] as ManualBookingPaymentMode[]).map(
                  (mode) => (
                    <label
                      key={mode}
                      className="flex cursor-pointer items-start gap-2 text-[12px] text-white/85"
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMode === mode}
                        onChange={() => setPaymentMode(mode)}
                        className="mt-[3px] accent-[#D1F843]"
                      />
                      <span>
                        {mode === "off-session"
                          ? "Trekk fra lagret kort"
                          : mode === "payment-link"
                            ? "Send betalingslenke"
                            : "Uten betaling"}
                      </span>
                    </label>
                  ),
                )}
              </div>
              {paymentMode === "payment-link" && (
                <input
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+47 412 33 901 (for SMS)"
                  className="mt-2 w-full rounded-md border border-white/8 bg-white/[0.025] px-2.5 py-1.5 text-[12px] text-white outline-none focus:border-[#D1F843]/40"
                />
              )}
            </div>

            {error && (
              <div
                className="border-b px-5 py-3 text-[12px]"
                style={{
                  background: "rgba(184,66,51,0.10)",
                  color: "#F49283",
                  borderBottomColor: "rgba(255,255,255,0.10)",
                }}
              >
                {error}
              </div>
            )}
            {successMessage && (
              <div
                className="border-b px-5 py-3 text-[12px]"
                style={{
                  background: "rgba(42,125,90,0.18)",
                  color: "#6FCBA1",
                  borderBottomColor: "rgba(255,255,255,0.10)",
                }}
              >
                {successMessage}
              </div>
            )}

            <div
              className="border-t px-5 py-4"
              style={{
                background: "rgba(0,0,0,0.20)",
                borderTopColor: "rgba(255,255,255,0.10)",
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[12px] text-white/60">Pris</div>
                  <div className="mt-1 font-mono text-[22px] font-bold text-white">
                    {selectedService ? selectedService.price.toLocaleString("nb-NO") : "0"}{" "}
                    <span className="text-[12px] font-medium text-white/50">kr</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/admin/bookinger"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium text-white/85 transition hover:bg-white/[0.06]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.10)",
                  }}
                >
                  <Save className="h-3.5 w-3.5" strokeWidth={1.8} /> Avbryt
                </Link>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex flex-[2] items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-bold transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#D1F843", color: "#0A1F18" }}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2} />{" "}
                  {isPending ? "Oppretter…" : "Bekreft & bok"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function initialsOf(s: StudentOption): string {
  const src = s.name ?? s.email;
  return src
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-[18px]">
      {label && (
        <div className="mb-2 flex items-center justify-between text-[12px] font-medium text-white/70">
          <span>
            {label}
            {required && (
              <span className="ml-1" style={{ color: "#D1F843" }}>
                *
              </span>
            )}
          </span>
          {hint && (
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">
              {hint}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function RadioRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function RadioOpt({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] transition " +
        (active
          ? "border-[#D1F843]/30 bg-[#D1F843]/10 font-semibold text-[#D1F843]"
          : "border-white/8 bg-white/[0.025] text-white/85 hover:bg-white/[0.05]")
      }
    >
      {children}
    </button>
  );
}

function SummaryRow({
  icon,
  k,
  children,
}: {
  icon: React.ReactNode;
  k: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5 border-b border-white/8 px-5 py-3 text-[13px]">
      <div className="w-5 flex-shrink-0 pt-0.5 text-white/50">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">{k}</div>
        <div className="mt-0.5 truncate font-medium text-white">{children}</div>
      </div>
    </div>
  );
}
