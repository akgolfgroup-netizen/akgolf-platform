"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreateBooking } from "@/app/portal/(dashboard)/admin/bookinger/actions";
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
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <Check className="w-8 h-8 text-green-500 mx-auto mb-3" />
        <p className="text-green-800 font-semibold">Booking opprettet!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Kundens e-post</label>
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="ola@eksempel.no"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Kundens navn</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="Ola Nordmann"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1">Tjeneste</label>
        <select
          value={serviceTypeId}
          onChange={(e) => setServiceTypeId(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {serviceTypes.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name} ({st.duration} min — kr {(st.price / 100).toLocaleString("nb-NO")})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1">Instruktor</label>
        <select
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {instructors.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.user.name ?? "Ukjent"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1">Dato og tid</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 px-4 bg-[#0F2950] text-white font-medium rounded-lg hover:bg-[#0F2950]/90 disabled:opacity-50 transition-colors"
      >
        {submitting ? "Oppretter..." : "Opprett booking"}
      </button>
    </form>
  );
}
