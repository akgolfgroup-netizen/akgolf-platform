"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  Repeat,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import { useSuccessToast, useErrorToast } from "@/components/portal/ui/toast";
import {
  getAvailability,
  upsertAvailability,
  getBlockedTimes,
  createBlockedTime,
  deleteBlockedTime,
  syncGoogleCalendar,
  getInstructors,
} from "./actions";

interface Instructor {
  id: string;
  name: string;
  email: string;
}

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface BlockedTime {
  id: string;
  startTime: string;
  endTime: string;
  reason: string | null;
  source: string;
}

const days = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const dayIndices = [1, 2, 3, 4, 5, 6, 0]; // Monday = 1, Sunday = 0

export default function TilgjengelighetPage() {
  const { toggle } = useMCSidebar();
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingSlots, setEditingSlots] = useState<Record<number, Array<{ start: string; end: string }>>>({});
  const [showAddException, setShowAddException] = useState(false);
  const [exceptionForm, setExceptionForm] = useState({
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    reason: "",
  });

  // Load instructors on mount
  useEffect(() => {
    getInstructors().then((data) => {
      if (data.length > 0) {
        setInstructors(data);
        setSelectedInstructor(data[0].id);
      }
    });
  }, []);

  // Load data when instructor changes
  const loadData = useCallback(async () => {
    if (!selectedInstructor) return;
    
    setIsLoading(true);
    try {
      const [availData, blockedData] = await Promise.all([
        getAvailability(selectedInstructor),
        getBlockedTimes(selectedInstructor),
      ]);

      setAvailability(availData);
      setBlockedTimes(blockedData);

      // Convert to editing format
      const slots: Record<number, Array<{ start: string; end: string }>> = {};
      dayIndices.forEach((dayIdx) => {
        slots[dayIdx] = [];
      });
      
      availData.forEach((slot) => {
        if (!slots[slot.dayOfWeek]) slots[slot.dayOfWeek] = [];
        slots[slot.dayOfWeek].push({ start: slot.startTime, end: slot.endTime });
      });
      
      setEditingSlots(slots);
    } catch (error) {
      showError("Kunne ikke laste tilgjengelighet");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedInstructor]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveAvailability = async () => {
    if (!selectedInstructor) return;
    
    setIsSaving(true);
    try {
      // Convert editingSlots to array format
      const slots: AvailabilitySlot[] = [];
      Object.entries(editingSlots).forEach(([dayOfWeek, daySlots]) => {
        daySlots.forEach((slot) => {
          slots.push({
            dayOfWeek: parseInt(dayOfWeek),
            startTime: slot.start,
            endTime: slot.end,
          });
        });
      });

      await upsertAvailability(selectedInstructor, slots);
      showSuccess("Tilgjengelighet lagret");
      
      // Trigger cache revalidation
      await fetch("/api/portal/public/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructorId: selectedInstructor }),
      });
    } catch (error) {
      showError("Kunne ikke lagre tilgjengelighet");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSlot = (dayIndex: number) => {
    setEditingSlots((prev) => ({
      ...prev,
      [dayIndex]: [...(prev[dayIndex] || []), { start: "09:00", end: "17:00" }],
    }));
  };

  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    setEditingSlots((prev) => ({
      ...prev,
      [dayIndex]: prev[dayIndex].filter((_, i) => i !== slotIndex),
    }));
  };

  const handleUpdateSlot = (
    dayIndex: number,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    setEditingSlots((prev) => ({
      ...prev,
      [dayIndex]: prev[dayIndex].map((slot, i) =>
        i === slotIndex ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const handleAddException = async () => {
    if (!selectedInstructor || !exceptionForm.date) return;

    try {
      const startTime = new Date(`${exceptionForm.date}T${exceptionForm.startTime}`);
      const endTime = new Date(`${exceptionForm.date}T${exceptionForm.endTime}`);

      await createBlockedTime({
        instructorId: selectedInstructor,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        reason: exceptionForm.reason || "Ferie/Fravær",
      });

      showSuccess("Unntak lagt til");
      setShowAddException(false);
      setExceptionForm({ date: "", startTime: "09:00", endTime: "17:00", reason: "" });
      loadData();
    } catch (error) {
      showError("Kunne ikke legge til unntak");
      console.error(error);
    }
  };

  const handleDeleteException = async (id: string) => {
    try {
      await deleteBlockedTime(id);
      showSuccess("Unntak slettet");
      loadData();
    } catch (error) {
      showError("Kunne ikke slette unntak");
      console.error(error);
    }
  };

  const handleSyncGoogleCalendar = async () => {
    if (!selectedInstructor) return;
    
    setIsSyncing(true);
    try {
      const result = await syncGoogleCalendar(selectedInstructor);
      if (result.success) {
        showSuccess(`Synkronisert ${result.count} hendelser fra Google Calendar`);
        loadData();
      } else {
        showError(result.error || "Synkronisering feilet");
      }
    } catch (error) {
      showError("Kunne ikke synkronisere med Google Calendar");
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const selectedInstructorData = instructors.find((i) => i.id === selectedInstructor);
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });

  return (
    <>
      <MCTopbar
        title="Tilgjengelighet"
        subtitle="Sett arbeidstider og unntak for instruktører"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Instructor Selector */}
        <div className="hg-card p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm text-[var(--hg-text-muted)]">Velg instruktør:</span>
            <div className="flex gap-2 flex-wrap">
              {instructors.map((instructor) => (
                <button
                  key={instructor.id}
                  onClick={() => setSelectedInstructor(instructor.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                    selectedInstructor === instructor.id
                      ? "bg-[var(--hg-surface-raised)] ring-2 ring-[var(--hg-primary)]"
                      : "hover:bg-[var(--hg-surface-raised)]"
                  )}
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--hg-primary)]" />
                  <span className="text-sm text-[var(--hg-text)]">{instructor.name}</span>
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={handleSyncGoogleCalendar}
                disabled={isSyncing || !selectedInstructor}
                className="hg-btn hg-btn-secondary text-sm flex items-center gap-2"
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Sync Google Calendar
              </button>
              <button
                onClick={() => setShowAddException(true)}
                disabled={!selectedInstructor}
                className="hg-btn hg-btn-primary text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Legg til unntak
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="hg-card p-8 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--hg-primary)]" />
          </div>
        ) : (
          <>
            {/* Weekly Schedule */}
            <div className="hg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
                <h3 className="hg-section-title">Faste arbeidstider</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-[var(--hg-text-muted)]" />
                    <span className="text-xs text-[var(--hg-text-muted)]">Gjentas ukentlig</span>
                  </div>
                  <button
                    onClick={handleSaveAvailability}
                    disabled={isSaving}
                    className="hg-btn hg-btn-primary text-sm flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Lagre
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 divide-x divide-[var(--hg-border)]">
                {days.map((day, i) => {
                  const dayIndex = dayIndices[i];
                  const slots = editingSlots[dayIndex] || [];
                  
                  return (
                    <div key={day} className="p-4">
                      <div className="text-center mb-3">
                        <span className="text-xs font-medium text-[var(--hg-text-muted)] uppercase">
                          {day}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {slots.length > 0 ? (
                          slots.map((slot, j) => (
                            <div
                              key={j}
                              className="p-2 bg-[var(--hg-success-bg)] rounded text-center space-y-1"
                            >
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="time"
                                  value={slot.start}
                                  onChange={(e) =>
                                    handleUpdateSlot(dayIndex, j, "start", e.target.value)
                                  }
                                  className="w-16 text-xs bg-transparent border-0 p-0 text-[var(--hg-success)] text-center"
                                />
                                <span className="text-xs text-[var(--hg-success)]">-</span>
                                <input
                                  type="time"
                                  value={slot.end}
                                  onChange={(e) =>
                                    handleUpdateSlot(dayIndex, j, "end", e.target.value)
                                  }
                                  className="w-16 text-xs bg-transparent border-0 p-0 text-[var(--hg-success)] text-center"
                                />
                              </div>
                              <button
                                onClick={() => handleRemoveSlot(dayIndex, j)}
                                className="text-[10px] text-[var(--hg-error)] hover:underline"
                              >
                                Fjern
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-2 bg-[var(--hg-surface-raised)] rounded text-center">
                            <span className="text-xs text-[var(--hg-text-muted)]">Fri</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddSlot(dayIndex)}
                        className="w-full mt-2 p-1.5 rounded border border-dashed border-[var(--hg-border)] hover:border-[var(--hg-primary)] hover:text-[var(--hg-primary)] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 mx-auto text-[var(--hg-text-muted)]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exceptions */}
            <div className="hg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
                <h3 className="hg-section-title">Unntak (ferie, sykdom, blokkeringer)</h3>
                <span className="hg-badge hg-badge-warning">
                  {blockedTimes.length} kommende
                </span>
              </div>
              <div className="divide-y divide-[var(--hg-border-subtle)]">
                {blockedTimes.length === 0 ? (
                  <div className="p-4 text-center text-sm text-[var(--hg-text-muted)]">
                    Ingen kommende unntak
                  </div>
                ) : (
                  blockedTimes.map((exception) => {
                    const startDate = new Date(exception.startTime);
                    const isGoogleCalendar = exception.source === "GOOGLE_CALENDAR";
                    
                    return (
                      <div key={exception.id} className="p-4 flex items-center gap-4">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            isGoogleCalendar
                              ? "bg-[var(--hg-info-bg)] text-[var(--hg-info)]"
                              : "bg-[var(--hg-warning-bg)] text-[var(--hg-warning)]"
                          )}
                        >
                          {isGoogleCalendar ? (
                            <ExternalLink className="w-4 h-4" />
                          ) : (
                            <Calendar className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[var(--hg-text)]">
                              {exception.reason || "Blokkert tid"}
                            </span>
                            {isGoogleCalendar && (
                              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[var(--hg-info-bg)] text-[var(--hg-info)]">
                                Google Calendar
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[var(--hg-text-muted)]">
                            {format(startDate, "EEEE d. MMMM HH:mm", { locale: nb })}
                            {" - "}
                            {format(new Date(exception.endTime), "HH:mm", { locale: nb })}
                            {" • "}
                            {selectedInstructorData?.name}
                          </div>
                        </div>
                        {!isGoogleCalendar && (
                          <button
                            onClick={() => handleDeleteException(exception.id)}
                            className="p-1.5 rounded-md hover:bg-[var(--hg-error-bg)] text-[var(--hg-text-muted)] hover:text-[var(--hg-error)] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Calendar Preview */}
            <div className="hg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
                <h3 className="hg-section-title">Kalendervisning</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                    className="p-1.5 rounded-lg hover:bg-[var(--hg-surface-raised)]"
                  >
                    <ChevronLeft className="w-4 h-4 text-[var(--hg-text-muted)]" />
                  </button>
                  <span className="text-sm text-[var(--hg-text)]">
                    {format(weekStart, "d. MMM", { locale: nb })} -{" "}
                    {format(addDays(weekStart, 6), "d. MMM", { locale: nb })}
                  </span>
                  <button
                    onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                    className="p-1.5 rounded-lg hover:bg-[var(--hg-surface-raised)]"
                  >
                    <ChevronRight className="w-4 h-4 text-[var(--hg-text-muted)]" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, i) => {
                    const date = addDays(weekStart, i);
                    const dateStr = format(date, "yyyy-MM-dd");
                    const dayBlockedTimes = blockedTimes.filter((bt) => {
                      const btDate = new Date(bt.startTime);
                      return format(btDate, "yyyy-MM-dd") === dateStr;
                    });
                    const isBlocked = dayBlockedTimes.length > 0;

                    return (
                      <div key={day} className="text-center">
                        <span className="text-xs text-[var(--hg-text-muted)]">{day}</span>
                        <div
                          className={cn(
                            "mt-1 p-3 rounded-lg border min-h-[80px]",
                            isBlocked
                              ? "bg-[var(--hg-error-bg)] border-[var(--hg-error)]"
                              : "bg-[var(--hg-surface-raised)] border-[var(--hg-border)]"
                          )}
                        >
                          <span className="text-sm font-medium text-[var(--hg-text)]">
                            {format(date, "d")}
                          </span>
                          {isBlocked && (
                            <div className="mt-1">
                              <span className="text-[10px] text-[var(--hg-error)]">
                                {dayBlockedTimes.length} blokkering
                                {dayBlockedTimes.length > 1 ? "er" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Exception Modal */}
      {showAddException && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="hg-card w-full max-w-md p-6 space-y-4">
            <h3 className="hg-section-title">Legg til unntak</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-[var(--hg-text-muted)] mb-1">
                  Dato
                </label>
                <input
                  type="date"
                  value={exceptionForm.date}
                  onChange={(e) =>
                    setExceptionForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full hg-input"
                  min={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[var(--hg-text-muted)] mb-1">
                    Fra kl
                  </label>
                  <input
                    type="time"
                    value={exceptionForm.startTime}
                    onChange={(e) =>
                      setExceptionForm((prev) => ({ ...prev, startTime: e.target.value }))
                    }
                    className="w-full hg-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--hg-text-muted)] mb-1">
                    Til kl
                  </label>
                  <input
                    type="time"
                    value={exceptionForm.endTime}
                    onChange={(e) =>
                      setExceptionForm((prev) => ({ ...prev, endTime: e.target.value }))
                    }
                    className="w-full hg-input"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-[var(--hg-text-muted)] mb-1">
                  Årsak (valgfritt)
                </label>
                <input
                  type="text"
                  value={exceptionForm.reason}
                  onChange={(e) =>
                    setExceptionForm((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="F.eks. Ferie, Sykdom..."
                  className="w-full hg-input"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddException(false)}
                className="flex-1 hg-btn hg-btn-secondary"
              >
                Avbryt
              </button>
              <button
                onClick={handleAddException}
                disabled={!exceptionForm.date}
                className="flex-1 hg-btn hg-btn-primary"
              >
                Lagre
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
