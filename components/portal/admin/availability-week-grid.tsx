"use client";

import { useState } from "react";
import { Save, Info } from "lucide-react";
import { AppleButton } from "@/components/portal/apple/apple-button";
import { AppleBadge } from "@/components/portal/apple/apple-badge";
import { motion } from "framer-motion";

const DAYS = [
  { value: 1, label: "Mandag", short: "Man" },
  { value: 2, label: "Tirsdag", short: "Tir" },
  { value: 3, label: "Onsdag", short: "Ons" },
  { value: 4, label: "Torsdag", short: "Tor" },
  { value: 5, label: "Fredag", short: "Fre" },
  { value: 6, label: "Lordag", short: "Lor" },
  { value: 0, label: "Sondag", short: "Son" },
];

const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 08:00-22:00

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Props {
  slots: AvailabilitySlot[];
  onSave: (slots: AvailabilitySlot[]) => Promise<void>;
  saving: boolean;
}

export function AvailabilityWeekGrid({ slots, onSave, saving }: Props) {
  const [localSlots, setLocalSlots] = useState<AvailabilitySlot[]>(slots);
  const [isDirty, setIsDirty] = useState(false);

  // Calculate total hours
  const totalHours = localSlots.reduce((acc, slot) => {
    const start = parseInt(slot.startTime.split(":")[0]);
    const end = parseInt(slot.endTime.split(":")[0]);
    return acc + (end - start);
  }, 0);

  // Check if a cell is active
  const isCellActive = (dayOfWeek: number, hour: number) => {
    const timeStr = `${String(hour).padStart(2, "0")}:00`;
    return localSlots.some(
      (s) =>
        s.dayOfWeek === dayOfWeek &&
        s.startTime <= timeStr &&
        s.endTime > timeStr
    );
  };

  // Toggle a single hour cell
  const toggleCell = (dayOfWeek: number, hour: number) => {
    const timeStr = `${String(hour).padStart(2, "0")}:00`;
    const nextHour = `${String(hour + 1).padStart(2, "0")}:00`;

    if (isCellActive(dayOfWeek, hour)) {
      // Remove this hour from slots — may need to split existing slots
      const updated = localSlots.flatMap((s) => {
        if (s.dayOfWeek !== dayOfWeek) return [s];
        if (s.startTime >= nextHour || s.endTime <= timeStr) return [s];

        const result: AvailabilitySlot[] = [];
        if (s.startTime < timeStr) {
          result.push({ ...s, endTime: timeStr });
        }
        if (s.endTime > nextHour) {
          result.push({ ...s, startTime: nextHour });
        }
        return result;
      });
      setLocalSlots(updated);
    } else {
      // Add this hour — try to merge with adjacent slots
      const newSlot: AvailabilitySlot = {
        dayOfWeek,
        startTime: timeStr,
        endTime: nextHour,
      };

      // Find adjacent slots for this day
      const daySlots = [...localSlots.filter((s) => s.dayOfWeek === dayOfWeek), newSlot];
      const otherSlots = localSlots.filter((s) => s.dayOfWeek !== dayOfWeek);

      // Sort and merge
      daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
      const merged: AvailabilitySlot[] = [];

      for (const slot of daySlots) {
        const last = merged[merged.length - 1];
        if (last && last.endTime >= slot.startTime) {
          last.endTime = slot.endTime > last.endTime ? slot.endTime : last.endTime;
        } else {
          merged.push({ ...slot });
        }
      }

      setLocalSlots([...otherSlots, ...merged]);
    }
    setIsDirty(true);
  };

  const handleSave = async () => {
    await onSave(localSlots);
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 px-4 py-3 bg-blue-50/80 rounded-xl border border-blue-100">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-[var(--color-grey-700)]">
            Klikk på en celle for a legge til eller fjerne tilgjengelighet.
          </p>
          <p className="text-xs text-[var(--color-grey-500)] mt-0.5">
            Endringer lagres forst nar du klikker Lagre.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <AppleBadge variant="info" size="md">
            {totalHours} timer/uke
          </AppleBadge>
        </div>
      </div>

      {/* Week Grid */}
      <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-[var(--color-grey-200)] shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--color-grey-100)]">
                <th className="w-20 px-4 py-4 text-left text-xs font-semibold text-[var(--color-grey-500)] uppercase tracking-wider">
                  Tid
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day.value}
                    className="px-2 py-4 text-center text-xs font-semibold text-[var(--color-grey-500)] uppercase tracking-wider min-w-[80px]"
                  >
                    {day.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour, rowIndex) => (
                <tr
                  key={hour}
                  className={rowIndex % 2 === 0 ? "bg-white" : "bg-[var(--color-grey-100)]/50"}
                >
                  <td className="px-4 py-0 text-xs font-medium text-[var(--color-grey-500)] w-20 border-r border-[var(--color-grey-100)]">
                    {String(hour).padStart(2, "0")}:00
                  </td>
                  {DAYS.map((day) => {
                    const active = isCellActive(day.value, hour);
                    return (
                      <td key={day.value} className="px-1 py-0.5">
                        <motion.button
                          onClick={() => toggleCell(day.value, hour)}
                          className={`w-full h-10 rounded-lg transition-colors duration-200 ${
                            active
                              ? "bg-gradient-to-br from-[var(--color-grey-900)] to-[var(--color-grey-700)] shadow-sm"
                              : "bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-200)]"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend & Save Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[var(--color-grey-900)] to-[var(--color-grey-700)]" />
            <span className="text-xs text-[var(--color-grey-600)]">Tilgjengelig</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[var(--color-grey-100)]" />
            <span className="text-xs text-[var(--color-grey-600)]">Ikke tilgjengelig</span>
          </div>
        </div>

        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AppleButton
              onClick={handleSave}
              disabled={saving}
              loading={saving}
              icon={Save}
              variant="primary"
              size="md"
            >
              {saving ? "Lagrer..." : "Lagre endringer"}
            </AppleButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}
