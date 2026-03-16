"use client";

import { useState } from "react";
import { Save } from "lucide-react";

const DAYS = [
  { value: 1, label: "Mandag" },
  { value: 2, label: "Tirsdag" },
  { value: 3, label: "Onsdag" },
  { value: 4, label: "Torsdag" },
  { value: 5, label: "Fredag" },
  { value: 6, label: "Lordag" },
  { value: 0, label: "Sondag" },
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
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-16 px-3 py-3 text-left text-[10px] font-medium text-gray-400 uppercase">
                  Tid
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day.value}
                    className="px-1 py-3 text-center text-[10px] font-medium text-gray-400 uppercase"
                  >
                    {day.label.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour} className="border-t border-gray-50">
                  <td className="px-3 py-0 text-[10px] text-gray-400 w-16">
                    {String(hour).padStart(2, "0")}:00
                  </td>
                  {DAYS.map((day) => {
                    const active = isCellActive(day.value, hour);
                    return (
                      <td key={day.value} className="px-0.5 py-0.5">
                        <button
                          onClick={() => toggleCell(day.value, hour)}
                          className={`w-full h-8 rounded transition-colors ${
                            active
                              ? "bg-[#B8975C] hover:bg-[#B68D40]"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
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

      {isDirty && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#0F2950] text-white rounded-lg hover:bg-[#0F2950]/90 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Lagrer..." : "Lagre endringer"}
          </button>
        </div>
      )}
    </div>
  );
}
