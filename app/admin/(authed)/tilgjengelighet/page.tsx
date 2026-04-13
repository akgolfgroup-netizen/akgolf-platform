"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Repeat,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  ExternalLink,
  Clock as ClockIcon,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminInput,
  AdminTabs,
  AdminDialog,
  AdminDataTable,
  useToast,
} from "@/components/portal/mission-control/ui";
import type {
  AdminTabItem,
  AdminDataTableColumn,
} from "@/components/portal/mission-control/ui";
import { format, startOfWeek, addDays } from "date-fns";
import { nb } from "date-fns/locale";
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

interface BlockedTimeRow {
  id: string;
  reason: string;
  startTime: string;
  endTime: string;
  source: string;
  when: string;
  time: string;
}

const days = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const dayIndices = [1, 2, 3, 4, 5, 6, 0]; // Monday = 1, Sunday = 0

const tabItems: AdminTabItem[] = [
  {
    id: "hours",
    label: "Arbeidstider",
    icon: <ClockIcon className="w-4 h-4" />,
  },
  {
    id: "blocked",
    label: "Blokkerte tider",
    icon: <Ban className="w-4 h-4" />,
  },
  {
    id: "google",
    label: "Google Calendar",
    icon: <ExternalLink className="w-4 h-4" />,
  },
];

export default function TilgjengelighetPage() {
  const { toggle } = useMCSidebar();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("hours");
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingSlots, setEditingSlots] = useState<
    Record<number, Array<{ start: string; end: string }>>
  >({});
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

      setBlockedTimes(
        blockedData.map((bt) => ({
          ...bt,
          startTime: bt.startTime.toISOString(),
          endTime: bt.endTime.toISOString(),
        })),
      );

      // Convert to editing format
      const slots: Record<number, Array<{ start: string; end: string }>> = {};
      dayIndices.forEach((dayIdx) => {
        slots[dayIdx] = [];
      });

      availData.forEach((slot) => {
        if (!slots[slot.dayOfWeek]) slots[slot.dayOfWeek] = [];
        slots[slot.dayOfWeek].push({
          start: slot.startTime,
          end: slot.endTime,
        });
      });

      setEditingSlots(slots);
    } catch (error) {
      toast({ variant: "error", title: "Kunne ikke laste tilgjengelighet" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInstructor]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveAvailability = async () => {
    if (!selectedInstructor) return;

    setIsSaving(true);
    try {
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
      toast({ variant: "success", title: "Tilgjengelighet lagret" });

      await fetch("/api/portal/public/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructorId: selectedInstructor }),
      });
    } catch (error) {
      toast({ variant: "error", title: "Kunne ikke lagre tilgjengelighet" });
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
    value: string,
  ) => {
    setEditingSlots((prev) => ({
      ...prev,
      [dayIndex]: prev[dayIndex].map((slot, i) =>
        i === slotIndex ? { ...slot, [field]: value } : slot,
      ),
    }));
  };

  const handleAddException = async () => {
    if (!selectedInstructor || !exceptionForm.date) return;

    try {
      const startTime = new Date(
        `${exceptionForm.date}T${exceptionForm.startTime}`,
      );
      const endTime = new Date(
        `${exceptionForm.date}T${exceptionForm.endTime}`,
      );

      await createBlockedTime({
        instructorId: selectedInstructor,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        reason: exceptionForm.reason || "Ferie/Fravær",
      });

      toast({ variant: "success", title: "Unntak lagt til" });
      setShowAddException(false);
      setExceptionForm({
        date: "",
        startTime: "09:00",
        endTime: "17:00",
        reason: "",
      });
      loadData();
    } catch (error) {
      toast({ variant: "error", title: "Kunne ikke legge til unntak" });
      console.error(error);
    }
  };

  const handleDeleteException = async (id: string) => {
    try {
      await deleteBlockedTime(id);
      toast({ variant: "success", title: "Unntak slettet" });
      loadData();
    } catch (error) {
      toast({ variant: "error", title: "Kunne ikke slette unntak" });
      console.error(error);
    }
  };

  const handleSyncGoogleCalendar = async () => {
    if (!selectedInstructor) return;

    setIsSyncing(true);
    try {
      const result = await syncGoogleCalendar(selectedInstructor);
      if (result.success) {
        toast({
          variant: "success",
          title: "Synkronisert",
          description: `${result.count} hendelser fra Google Calendar`,
        });
        loadData();
      } else {
        toast({
          variant: "error",
          title: "Synkronisering feilet",
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: "error",
        title: "Kunne ikke synkronisere med Google Calendar",
      });
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const selectedInstructorData = instructors.find(
    (i) => i.id === selectedInstructor,
  );
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });

  // Blokkerte tider — data til tabell
  const blockedRows = useMemo<BlockedTimeRow[]>(
    () =>
      blockedTimes.map((bt) => {
        const start = new Date(bt.startTime);
        const end = new Date(bt.endTime);
        return {
          id: bt.id,
          reason: bt.reason || "Blokkert tid",
          startTime: bt.startTime,
          endTime: bt.endTime,
          source: bt.source,
          when: format(start, "EEEE d. MMMM", { locale: nb }),
          time: `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`,
        };
      }),
    [blockedTimes],
  );

  const blockedColumns: AdminDataTableColumn<BlockedTimeRow>[] = [
    {
      key: "reason",
      label: "Årsak",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="text-[#0A1F18]">{r.reason}</span>
          {r.source === "GOOGLE_CALENDAR" && (
            <AdminBadge variant="info">Google</AdminBadge>
          )}
        </div>
      ),
    },
    { key: "when", label: "Dag", sortable: true, render: (r) => <span className="text-[#324D45]">{r.when}</span> },
    { key: "time", label: "Tid", align: "right", render: (r) => <span className="text-[#324D45]">{r.time}</span> },
    {
      key: "id",
      label: "",
      align: "right",
      render: (r) =>
        r.source !== "GOOGLE_CALENDAR" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteException(r.id);
            }}
            className="p-1.5 rounded-md hover:bg-[#EF4444]/10 text-[#7A8C85] hover:text-[#EF4444] transition-colors"
            aria-label="Slett unntak"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : null,
    },
  ];

  return (
    <>
      <MCTopbar
        title="Tilgjengelighet"
        subtitle="Sett arbeidstider og unntak for instruktører"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        {/* Instructor Selector */}
        <AdminCard compact>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm text-[#5A6E66]">
              Velg instruktør:
            </span>
            <div className="flex gap-2 flex-wrap">
              {instructors.map((instructor) => (
                <button
                  key={instructor.id}
                  onClick={() => setSelectedInstructor(instructor.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                    selectedInstructor === instructor.id
                      ? "bg-[#ECF0EF] ring-2 ring-[#0A1F18]"
                      : "hover:bg-[#F5F8F7]",
                  )}
                >
                  <div className="w-2 h-2 rounded-full bg-[#0A1F18]" />
                  <span className="text-sm text-[#0A1F18]">
                    {instructor.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <AdminButton
                variant="primary"
                onClick={() => setShowAddException(true)}
                disabled={!selectedInstructor}
                icon={<Plus className="w-4 h-4" />}
              >
                Legg til unntak
              </AdminButton>
            </div>
          </div>
        </AdminCard>

        {/* Tabs */}
        <AdminTabs
          items={tabItems}
          value={activeTab}
          onValueChange={setActiveTab}
        />

        {isLoading ? (
          <AdminCard>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#0A1F18]" />
            </div>
          </AdminCard>
        ) : (
          <>
            {/* Tab: Arbeidstider */}
            {activeTab === "hours" && (
              <>
                <div className="bg-white rounded-xl border border-[#D5DFDB] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#D5DFDB] flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[#0A1F18]">Faste arbeidstider</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Repeat className="w-4 h-4 text-[#7A8C85]" />
                        <span className="text-xs text-[#5A6E66]">
                          Gjentas ukentlig
                        </span>
                      </div>
                      <AdminButton
                        variant="primary"
                        onClick={handleSaveAvailability}
                        loading={isSaving}
                        icon={<CheckCircle className="w-4 h-4" />}
                      >
                        Lagre
                      </AdminButton>
                    </div>
                  </div>
                  <div className="divide-y divide-[#D5DFDB]">
                    {days.map((day, i) => {
                      const dayIndex = dayIndices[i];
                      const slots = editingSlots[dayIndex] || [];

                      return (
                        <div key={day} className="px-4 py-3 flex items-start gap-4">
                          <div className="w-12 shrink-0 pt-1">
                            <span className="text-sm font-semibold text-[#0A1F18]">
                              {day}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {slots.length > 0 ? (
                                slots.map((slot, j) => (
                                  <div
                                    key={j}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ECF0EF] rounded-full text-sm text-[#1A4D36]"
                                  >
                                    <span className="tabular-nums">
                                      {slot.start} – {slot.end}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSlot(dayIndex, j)}
                                      className="w-5 h-5 rounded-full hover:bg-[#D5DFDB] flex items-center justify-center text-[#5A6E66] hover:text-[#EF4444] transition-colors"
                                      aria-label="Fjern slot"
                                      title="Fjern slot"
                                    >
                                      <span className="text-xs leading-none">×</span>
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <span className="text-sm text-[#5A6E66] py-1.5">
                                  Fri
                                </span>
                              )}
                              <AdminButton
                                variant="secondary"
                                onClick={() => handleAddSlot(dayIndex)}
                                icon={<Plus className="w-3.5 h-3.5" />}
                                className="text-sm px-3 py-1.5 h-auto"
                              >
                                Legg til slot
                              </AdminButton>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar Preview */}
                <div className="bg-white rounded-xl border border-[#D5DFDB] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#D5DFDB] flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[#0A1F18]">Kalendervisning</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                        className="p-1.5 rounded-lg hover:bg-[#F5F8F7]"
                      >
                        <ChevronLeft className="w-4 h-4 text-[#5A6E66]" />
                      </button>
                      <span className="text-sm text-[#324D45]">
                        {format(weekStart, "d. MMM", { locale: nb })} -{" "}
                        {format(addDays(weekStart, 6), "d. MMM", {
                          locale: nb,
                        })}
                      </span>
                      <button
                        onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                        className="p-1.5 rounded-lg hover:bg-[#F5F8F7]"
                      >
                        <ChevronRight className="w-4 h-4 text-[#5A6E66]" />
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
                            <span className="text-xs text-[#5A6E66]">
                              {day}
                            </span>
                            <div
                              className={cn(
                                "mt-1 p-3 rounded-lg border min-h-[80px]",
                                isBlocked
                                  ? "bg-[#EF4444]/10 border-[#EF4444]/30"
                                  : "bg-[#F5F8F7] border-[#D5DFDB]",
                              )}
                            >
                              <span className="text-sm font-medium text-[#0A1F18]">
                                {format(date, "d")}
                              </span>
                              {isBlocked && (
                                <div className="mt-1">
                                  <span className="text-[10px] text-[#EF4444]">
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

            {/* Tab: Blokkerte tider */}
            {activeTab === "blocked" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#0A1F18]">
                      Unntak (ferie, sykdom, blokkeringer)
                    </h3>
                    <p className="text-xs text-[#5A6E66] mt-0.5">
                      {selectedInstructorData?.name ?? "Instruktør"} —{" "}
                      {blockedRows.length} kommende
                    </p>
                  </div>
                  <AdminButton
                    variant="primary"
                    onClick={() => setShowAddException(true)}
                    disabled={!selectedInstructor}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Ny blokkering
                  </AdminButton>
                </div>
                <AdminDataTable
                  columns={blockedColumns}
                  data={blockedRows}
                  searchable
                  searchPlaceholder="Søk årsak..."
                  emptyMessage="Ingen kommende unntak."
                  pagination={{ pageSize: 10 }}
                />
              </div>
            )}

            {/* Tab: Google Calendar */}
            {activeTab === "google" && (
              <AdminCard>
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-[#ECF0EF] flex items-center justify-center mb-3">
                    <Calendar className="w-6 h-6 text-[#0A1F18]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0A1F18]">
                    Google Calendar-synk
                  </h3>
                  <p className="text-sm text-[#324D45] mt-1 max-w-md">
                    Synkroniser hendelser fra Google Calendar til{" "}
                    {selectedInstructorData?.name ?? "instruktøren"} som
                    blokkerte tider.
                  </p>
                  <div className="mt-5">
                    <AdminButton
                      variant="primary"
                      onClick={handleSyncGoogleCalendar}
                      disabled={!selectedInstructor}
                      loading={isSyncing}
                      icon={<RefreshCw className="w-4 h-4" />}
                    >
                      Synkroniser nå
                    </AdminButton>
                  </div>
                  {blockedTimes.filter(
                    (bt) => bt.source === "GOOGLE_CALENDAR",
                  ).length > 0 && (
                    <p className="text-xs text-[#5A6E66] mt-4">
                      {
                        blockedTimes.filter(
                          (bt) => bt.source === "GOOGLE_CALENDAR",
                        ).length
                      }{" "}
                      hendelser synkronisert
                    </p>
                  )}
                </div>
              </AdminCard>
            )}
          </>
        )}
      </div>

      {/* Add Exception Dialog */}
      <AdminDialog
        open={showAddException}
        onClose={() => setShowAddException(false)}
        title="Legg til unntak"
        description="Blokker tid for ferie, sykdom eller andre hendelser"
        footer={
          <>
            <AdminButton
              variant="secondary"
              onClick={() => setShowAddException(false)}
            >
              Avbryt
            </AdminButton>
            <AdminButton
              variant="primary"
              onClick={handleAddException}
              disabled={!exceptionForm.date}
            >
              Lagre
            </AdminButton>
          </>
        }
      >
        <div className="space-y-3">
          <AdminInput
            label="Dato"
            type="date"
            value={exceptionForm.date}
            onChange={(e) =>
              setExceptionForm((prev) => ({ ...prev, date: e.target.value }))
            }
            min={format(new Date(), "yyyy-MM-dd")}
          />

          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Fra kl"
              type="time"
              value={exceptionForm.startTime}
              onChange={(e) =>
                setExceptionForm((prev) => ({
                  ...prev,
                  startTime: e.target.value,
                }))
              }
            />
            <AdminInput
              label="Til kl"
              type="time"
              value={exceptionForm.endTime}
              onChange={(e) =>
                setExceptionForm((prev) => ({
                  ...prev,
                  endTime: e.target.value,
                }))
              }
            />
          </div>

          <AdminInput
            label="Årsak (valgfritt)"
            type="text"
            value={exceptionForm.reason}
            onChange={(e) =>
              setExceptionForm((prev) => ({
                ...prev,
                reason: e.target.value,
              }))
            }
            placeholder="F.eks. Ferie, Sykdom..."
          />
        </div>
      </AdminDialog>
    </>
  );
}
