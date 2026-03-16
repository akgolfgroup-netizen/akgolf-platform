"use client";

import { useState } from "react";
import { AvailabilityWeekGrid } from "./availability-week-grid";
import { BlockedTimeForm } from "./blocked-time-form";
import { getAvailability, getBlockedTimes, upsertAvailability, deleteBlockedTime } from "@/app/portal/(dashboard)/admin/tilgjengelighet/actions";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Trash2, Clock, Ban } from "lucide-react";

interface Props {
  instructors: Array<{ id: string; user: { name: string | null; image: string | null } }>;
}

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface BlockedTime {
  id: string;
  instructorId: string | null;
  startTime: Date;
  endTime: Date;
  reason: string | null;
}

export function AvailabilityManager({ instructors }: Props) {
  const [selectedInstructorId, setSelectedInstructorId] = useState(
    instructors[0]?.id ?? ""
  );
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"schedule" | "blocked">("schedule");

  const fetchData = async (instructorId: string) => {
    setLoading(true);
    try {
      const [avail, blocked] = await Promise.all([
        getAvailability(instructorId),
        getBlockedTimes(instructorId),
      ]);
      setSlots(
        avail.map((a) => ({
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
        }))
      );
      setBlockedTimes(blocked as BlockedTime[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [initialized, setInitialized] = useState(false);
  if (!initialized && selectedInstructorId) {
    setInitialized(true);
    fetchData(selectedInstructorId);
  }

  const handleInstructorChange = (id: string) => {
    setSelectedInstructorId(id);
    fetchData(id);
  };

  const handleSave = async (updatedSlots: AvailabilitySlot[]) => {
    setSaving(true);
    try {
      await upsertAvailability(selectedInstructorId, updatedSlots);
      setSlots(updatedSlots);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlocked = async (id: string) => {
    try {
      await deleteBlockedTime(id);
      setBlockedTimes((prev) => prev.filter((bt) => bt.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructor selector */}
      <div className="flex items-center gap-4">
        <select
          value={selectedInstructorId}
          onChange={(e) => handleInstructorChange(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          {instructors.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.user.name ?? "Ukjent"}
            </option>
          ))}
        </select>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === "schedule"
                ? "bg-white text-[#0F2950] shadow-sm"
                : "text-gray-500"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Faste tider
          </button>
          <button
            onClick={() => setActiveTab("blocked")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === "blocked"
                ? "bg-white text-[#0F2950] shadow-sm"
                : "text-gray-500"
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            Blokkert tid
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Laster...</div>
      ) : activeTab === "schedule" ? (
        <AvailabilityWeekGrid
          slots={slots}
          onSave={handleSave}
          saving={saving}
        />
      ) : (
        <div className="space-y-4">
          <BlockedTimeForm
            instructorId={selectedInstructorId}
            onCreated={() => fetchData(selectedInstructorId)}
          />

          {/* Blocked time list */}
          <div className="bg-white rounded-xl border border-gray-200">
            {blockedTimes.length === 0 ? (
              <p className="text-sm text-gray-400 p-6 text-center">
                Ingen blokkerte tider
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {blockedTimes.map((bt) => (
                  <li
                    key={bt.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {format(new Date(bt.startTime), "d. MMM yyyy HH:mm", {
                          locale: nb,
                        })}{" "}
                        —{" "}
                        {format(new Date(bt.endTime), "d. MMM yyyy HH:mm", {
                          locale: nb,
                        })}
                      </p>
                      {bt.reason && (
                        <p className="text-xs text-gray-500">{bt.reason}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteBlocked(bt.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
