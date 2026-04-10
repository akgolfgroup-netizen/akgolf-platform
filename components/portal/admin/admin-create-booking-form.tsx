"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreateBooking } from "@/app/admin/bookinger/actions";
import { Check } from "lucide-react";

interface Props {
  serviceTypes: Array<{ id: string; name: string; duration: number; price: number }>;
  instructors: Array<{ id: string; user: { name: string | null } }>;
}

export function AdminCreateBookingForm({ serviceTypes, instructors }: Props) {
  const router = useRouter();
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState(serviceTypes[0]?.id ?? "");
  const [instructorId, setInstructorId] = useState(instructors[0]?.id ?? "");
  const [startTime, setStartTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await adminCreateBooking({
        studentEmail,
        studentName,
        serviceTypeId,
        instructorId,
        startTime,
      });
      setSuccess(true);
      setTimeout(() => router.push("/admin/bookinger"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.4)] rounded-2xl p-8 text-center">
        <Check className="w-8 h-8 text-[#10B981] mx-auto mb-3" />
        <p className="text-[#86EFAC] font-semibold">Booking opprettet!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--color-grey-200)] bg-white backdrop-blur-md p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--color-grey-400)] block mb-1">Kundens e-post</label>
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            required
            className="w-full rounded-xl px-3 py-2 text-sm text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] bg-white border border-[var(--color-grey-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/40"
            placeholder="ola@eksempel.no"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--color-grey-400)] block mb-1">Kundens navn</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
            className="w-full rounded-xl px-3 py-2 text-sm text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] bg-white border border-[var(--color-grey-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/40"
            placeholder="Ola Nordmann"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--color-grey-400)] block mb-1">Tjeneste</label>
        <select
          value={serviceTypeId}
          onChange={(e) => setServiceTypeId(e.target.value)}
          className="w-full rounded-xl px-3 py-2 text-sm text-[var(--color-grey-900)] bg-white border border-[var(--color-grey-200)]"
        >
          {serviceTypes.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name} ({st.duration} min — kr {st.price.toLocaleString("nb-NO")})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--color-grey-400)] block mb-1">Instruktør</label>
        <select
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
          className="w-full rounded-xl px-3 py-2 text-sm text-[var(--color-grey-900)] bg-white border border-[var(--color-grey-200)]"
        >
          {instructors.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.user.name ?? "Ukjent"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--color-grey-400)] block mb-1">Dato og tid</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="w-full rounded-xl px-3 py-2 text-sm text-[var(--color-grey-900)] bg-white border border-[var(--color-grey-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/40"
        />
      </div>

      {error && (
        <p className="text-sm text-[#FCA5A5] bg-[rgba(239,68,68,0.15)] rounded-xl px-4 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 px-4 bg-[var(--color-grey-900)] text-white font-medium rounded-xl hover:bg-[var(--color-grey-900)]/90 disabled:opacity-50 transition-colors"
      >
        {submitting ? "Oppretter..." : "Opprett booking"}
      </button>
    </form>
  );
}
