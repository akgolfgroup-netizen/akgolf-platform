"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, X } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ACTIVITY_TYPE_COLORS } from "./facility-legend";
import type { Facility } from "./facility-selector";

const ACTIVITY_TYPES = [
  { value: "TOURNAMENT_CLUB", label: "Klubbturnering" },
  { value: "TOURNAMENT_REGION", label: "Regionturnering" },
  { value: "TOURNAMENT_JUNIOR", label: "Juniorturnering" },
  { value: "VTG_COURSE", label: "VTG-kurs" },
  { value: "GFGK_JUNIOR", label: "GFGK Junior" },
  { value: "AK_GOLF", label: "AK Golf" },
  { value: "AK_GOLF_JUNIOR_ACADEMY", label: "AK Golf Junior Academy" },
  { value: "SPONSOR_EVENT", label: "Sponsorevent" },
  { value: "INTERNAL", label: "Internt" },
  { value: "CLOSURE", label: "Stengt" },
  { value: "OTHER", label: "Annet" },
];

interface Props {
  facilities: Facility[];
  onSubmit: (data: ActivityFormData) => Promise<void>;
  onCancel: () => void;
  initialDate?: Date;
  initialFacilityId?: string;
}

export interface ActivityFormData {
  facilityId: string;
  title: string;
  description: string;
  activityType: string;
  startDate: string;
  startTime: string;
  endTime: string;
  color?: string;
}

export function ActivityForm({
  facilities,
  onSubmit,
  onCancel,
  initialDate,
  initialFacilityId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ActivityFormData>({
    facilityId: initialFacilityId ?? facilities[0]?.id ?? "",
    title: "",
    description: "",
    activityType: "OTHER",
    startDate: initialDate ? format(initialDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke opprette aktivitet");
    } finally {
      setLoading(false);
    }
  };

  const selectedType = ACTIVITY_TYPES.find((t) => t.value === formData.activityType);
  const typeColor = ACTIVITY_TYPE_COLORS[formData.activityType]?.color ?? "#86868B";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-[#FF3B30]/10 text-[#FF3B30] text-sm">
          {error}
        </div>
      )}

      {/* Fasilitet */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-grey-700)] mb-2">
          <MapPin className="w-4 h-4 inline mr-1.5" />
          Fasilitet
        </label>
        <select
          value={formData.facilityId}
          onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)] focus:border-transparent transition-[border-color,box-shadow]"
          required
        >
          {facilities.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Aktivitetstype */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-grey-700)] mb-2">
          Type aktivitet
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ACTIVITY_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, activityType: type.value })}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-[background-color,border-color,box-shadow] ${
                formData.activityType === type.value
                  ? "ring-2 ring-[var(--color-grey-900)] bg-[var(--color-grey-100)]"
                  : "border border-[var(--color-grey-200)] hover:border-[var(--color-grey-400)]"
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: ACTIVITY_TYPE_COLORS[type.value]?.color }}
              />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tittel */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-grey-700)] mb-2">
          Tittel
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder={`F.eks. "${selectedType?.label ?? "Aktivitet"}"`}
          className="w-full px-4 py-3 rounded-xl border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)] focus:border-transparent transition-[border-color,box-shadow]"
          required
        />
      </div>

      {/* Beskrivelse */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-grey-700)] mb-2">
          Beskrivelse (valgfritt)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)] focus:border-transparent transition-[border-color,box-shadow] resize-none"
        />
      </div>

      {/* Dato og tid */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-grey-700)] mb-2">
            <Calendar className="w-4 h-4 inline mr-1.5" />
            Dato
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)] focus:border-transparent transition-[border-color,box-shadow]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-grey-700)] mb-2">
            <Clock className="w-4 h-4 inline mr-1.5" />
            Fra
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)] focus:border-transparent transition-[border-color,box-shadow]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-grey-700)] mb-2">
            Til
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)] focus:border-transparent transition-[border-color,box-shadow]"
            required
          />
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 rounded-xl bg-[var(--color-grey-50)] border border-[var(--color-grey-200)]">
        <p className="text-xs text-[var(--color-grey-500)] mb-2">Forhåndsvisning</p>
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-10 rounded-full"
            style={{ backgroundColor: typeColor }}
          />
          <div>
            <p className="font-medium text-[var(--color-grey-900)]">
              {formData.title || "Aktivitetstittel"}
            </p>
            <p className="text-sm text-[var(--color-grey-500)]">
              {formData.startTime} - {formData.endTime}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-grey-200)] text-[var(--color-grey-700)] font-medium hover:bg-[var(--color-grey-100)] transition-colors"
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-grey-900)] text-white font-medium hover:bg-[var(--color-grey-800)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Lagrer..." : "Opprett aktivitet"}
        </button>
      </div>
    </form>
  );
}
