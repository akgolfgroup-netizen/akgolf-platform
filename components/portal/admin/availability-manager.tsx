"use client";

import { useState } from "react";
import { AvailabilityWeekGrid } from "./availability-week-grid";
import { BlockedTimeForm } from "./blocked-time-form";
import { getAvailability, getBlockedTimes, upsertAvailability, deleteBlockedTime } from "@/app/admin/(authed)/tilgjengelighet/actions";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Trash2, Clock, Ban, ChevronDown, User } from "lucide-react";
import { AppleButton } from "@/components/portal/apple/apple-button";
import { AppleBadge } from "@/components/portal/apple/apple-badge";
import { motion, AnimatePresence } from "framer-motion";

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

  const selectedInstructor = instructors.find(i => i.id === selectedInstructorId);

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
    } catch {
      // Error handled silently - data will remain unchanged
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
    } catch {
      // Error handled silently - slots will remain unchanged
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlocked = async (id: string) => {
    try {
      await deleteBlockedTime(id);
      setBlockedTimes((prev) => prev.filter((bt) => bt.id !== id));
    } catch {
      // Error handled silently - blocked time remains in list
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Instructor selector - Apple style dropdown */}
        <div className="relative">
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#D5DFDB] shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#0A1F18] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <select
              value={selectedInstructorId}
              onChange={(e) => handleInstructorChange(e.target.value)}
              className="bg-transparent text-sm font-medium text-[#0A1F18] pr-6 appearance-none cursor-pointer focus:outline-none"
            >
              {instructors.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.user.name ?? "Ukjent"}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#7A8C85] absolute right-4" />
          </div>
        </div>

        {/* Tab Pills - Apple segment control style */}
        <div className="flex bg-[#ECF0EF] rounded-xl p-1">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-[background-color,color] duration-300 ${ activeTab === "schedule" ? "bg-white text-[#0A1F18] shadow-sm" : "text-[#7A8C85] hover:text-[#324D45]" }`}
          >
            <Clock className="w-4 h-4" />
            Faste tider
          </button>
          <button
            onClick={() => setActiveTab("blocked")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-[background-color,color] duration-300 ${ activeTab === "blocked" ? "bg-white text-[#0A1F18] shadow-sm" : "text-[#7A8C85] hover:text-[#324D45]" }`}
          >
            <Ban className="w-4 h-4" />
            Blokkert tid
            {blockedTimes.length > 0 && (
              <AppleBadge variant="error" size="sm">
                {blockedTimes.length}
              </AppleBadge>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 flex flex-col items-center justify-center"
          >
            <motion.div
              className="w-8 h-8 border-3 border-[#0A1F18] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="mt-4 text-sm text-[#7A8C85]">Laster tilgjengelighet...</p>
          </motion.div>
        ) : activeTab === "schedule" ? (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AvailabilityWeekGrid
              slots={slots}
              onSave={handleSave}
              saving={saving}
            />
          </motion.div>
        ) : (
          <motion.div
            key="blocked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <BlockedTimeForm
              instructorId={selectedInstructorId}
              onCreated={() => fetchData(selectedInstructorId)}
            />

            {/* Blocked time list - Apple style */}
            <div className="rounded-2xl bg-white border border-[#D5DFDB] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#ECF0EF]">
                <h3 className="text-sm font-semibold text-[#0A1F18]">
                  Planlagte fravær
                </h3>
                <p className="text-xs text-[#7A8C85] mt-0.5">
                  Perioder hvor instruktøren ikke er tilgjengelig
                </p>
              </div>

              {blockedTimes.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#ECF0EF] flex items-center justify-center mb-3">
                    <Ban className="w-6 h-6 text-[#7A8C85]" />
                  </div>
                  <p className="text-sm text-[#7A8C85]">
                    Ingen blokkerte tider registrert
                  </p>
                  <p className="text-xs text-[#7A8C85] mt-1">
                    Bruk skjemaet over for å legge til fravær
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-[#ECF0EF]">
                  {blockedTimes.map((bt, index) => (
                    <motion.li
                      key={bt.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between px-6 py-4 hover:bg-[#ECF0EF] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#EF4444]/5 flex items-center justify-center">
                          <Ban className="w-5 h-5 text-[#EF4444]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0A1F18]">
                            {format(new Date(bt.startTime), "d. MMMM yyyy", { locale: nb })}
                            {format(new Date(bt.startTime), "d. MMMM yyyy") !==
                             format(new Date(bt.endTime), "d. MMMM yyyy") && (
                              <span className="text-[#7A8C85]">
                                {" — "}
                                {format(new Date(bt.endTime), "d. MMMM yyyy", { locale: nb })}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#7A8C85]">
                              {format(new Date(bt.startTime), "HH:mm")} — {format(new Date(bt.endTime), "HH:mm")}
                            </span>
                            {bt.reason && (
                              <>
                                <span className="text-[#D5DFDB]">·</span>
                                <span className="text-xs text-[#7A8C85]">{bt.reason}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => handleDeleteBlocked(bt.id)}
                        className="p-2 rounded-lg hover:bg-[#EF4444]/5 text-[#7A8C85] hover:text-[#EF4444] transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
