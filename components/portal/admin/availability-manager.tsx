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
          className="text-sm rounded-xl px-3 py-2 text-[var(--color-snow)] bg-[rgba(10,25,41,0.7)] border border-[rgba(15,41,80,0.4)]"
        >
          {instructors.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.user.name ?? "Ukjent"}
            </option>
          ))}
        </select>

        {/* Tabs */}
        <div className="flex bg-[rgba(15,41,80,0.3)] rounded-xl p-0.5">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === "schedule"
                ? "bg-[var(--color-gold)] text-white"
                : "text-[var(--color-snow)]/50"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Faste tider
          </button>
          <button
            onClick={() => setActiveTab("blocked")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === "blocked"
                ? "bg-[var(--color-gold)] text-white"
                : "text-[var(--color-snow)]/50"
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            Blokkert tid
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[var(--color-snow)]/50">Laster...</div>
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
          <div className="rounded-2xl border border-[rgba(15,41,80,0.4)] bg-[rgba(10,25,41,0.7)] backdrop-blur-md">
            {blockedTimes.length === 0 ? (
              <p className="text-sm text-[var(--color-snow)]/50 p-6 text-center">
                Ingen blokkerte tider
              </p>
            ) : (
              <ul className="divide-y divide-[rgba(15,41,80,0.4)]">
                {blockedTimes.map((bt) => (
                  <li
                    key={bt.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--color-snow)]">
                        {format(new Date(bt.startTime), "d. MMM yyyy HH:mm", {
                          locale: nb,
                        })}{" "}
                        —{" "}
                        {format(new Date(bt.endTime), "d. MMM yyyy HH:mm", {
                          locale: nb,
                        })}
                      </p>
                      {bt.reason && (
                        <p className="text-xs text-[var(--color-snow)]/50">{bt.reason}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteBlocked(bt.id)}
                      className="p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.15)] text-[var(--color-snow)]/40 hover:text-[#FCA5A5] transition-colors"
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
