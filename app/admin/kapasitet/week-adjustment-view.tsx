"use client";

import { useState, useEffect, useTransition } from "react";
import { WeekSelector } from "@/components/admin/week-selector";
import { CapacityGauge } from "@/components/admin/capacity-gauge";
import { WeekAdjustmentGrid } from "@/components/admin/week-adjustment-grid";
import { OverbookingAlert } from "@/components/admin/overbooking-alert";
import { User } from "lucide-react";
import {
  getWeekCapacityWithOverrides,
  saveWeekOverride,
  deleteWeekOverride,
  getPackageDemand,
  getInstructors,
  type WeekCapacityData,
  type PackageDemand,
} from "./week-actions";

export function WeekAdjustmentView() {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [instructors, setInstructors] = useState<{ id: string; name: string }[]>([]);
  const [weekData, setWeekData] = useState<WeekCapacityData | null>(null);
  const [demand, setDemand] = useState<PackageDemand | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  // Last instruktorer ved mount
  useEffect(() => {
    const loadInstructors = async () => {
      const list = await getInstructors();
      setInstructors(list);
      if (list.length > 0 && !selectedInstructor) {
        setSelectedInstructor(list[0].id);
      }
    };
    loadInstructors();
  }, []);

  // Last uke-data når instruktør eller uke endres
  useEffect(() => {
    if (!selectedInstructor) return;

    startTransition(async () => {
      const [data, demandData] = await Promise.all([
        getWeekCapacityWithOverrides(selectedWeek, selectedInstructor),
        getPackageDemand(),
      ]);
      setWeekData(data);
      setDemand(demandData);
    });
  }, [selectedWeek, selectedInstructor]);

  const handleSaveOverride = async (
    date: Date,
    startTime: string,
    endTime: string
  ) => {
    if (!selectedInstructor) return;

    setSaving(true);
    try {
      await saveWeekOverride({
        instructorId: selectedInstructor,
        date,
        startTime,
        endTime,
      });

      // Refresh data
      const data = await getWeekCapacityWithOverrides(
        selectedWeek,
        selectedInstructor
      );
      setWeekData(data);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOverride = async (date: Date) => {
    if (!selectedInstructor) return;

    setSaving(true);
    try {
      await deleteWeekOverride(selectedInstructor, date);

      // Refresh data
      const data = await getWeekCapacityWithOverrides(
        selectedWeek,
        selectedInstructor
      );
      setWeekData(data);
    } finally {
      setSaving(false);
    }
  };

  // Finn etterspørsel for valgt instruktør
  const instructorDemand = demand?.instructorDemand.find(
    (d) => d.instructorId === selectedInstructor
  );

  return (
    <div className="space-y-6">
      {/* Instructor Selector */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-[var(--color-grey-500)] uppercase tracking-wide mb-2">
            <User className="w-3.5 h-3.5 inline-block mr-1" />
            Instruktor
          </label>
          <select
            value={selectedInstructor ?? ""}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[var(--color-grey-200)] rounded-xl text-[var(--color-grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/20"
          >
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-[var(--color-grey-500)] uppercase tracking-wide mb-2">
            Uke
          </label>
          <WeekSelector
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
          />
        </div>
      </div>

      {/* Loading State */}
      {isPending && !weekData && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-grey-200)] border-t-[var(--color-grey-900)]" />
        </div>
      )}

      {/* Content */}
      {weekData && (
        <>
          {/* Capacity Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gauge */}
            <div className="bg-white rounded-xl border border-[var(--color-grey-200)] p-6 flex items-center justify-center">
              <CapacityGauge
                bookedHours={weekData.totalBookedHours}
                totalHours={weekData.totalEffectiveHours}
                label="Belegg denne uken"
              />
            </div>

            {/* Stats */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-grey-200)] p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-[var(--color-grey-500)] uppercase tracking-wide">
                    Fast kapasitet
                  </p>
                  <p className="text-2xl font-bold text-[var(--color-grey-900)] mt-1">
                    {weekData.totalRegularHours.toFixed(0)}t
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-grey-500)] uppercase tracking-wide">
                    Justert kapasitet
                  </p>
                  <p className="text-2xl font-bold text-[var(--color-grey-900)] mt-1">
                    {weekData.totalEffectiveHours.toFixed(0)}t
                  </p>
                  {weekData.totalEffectiveHours !== weekData.totalRegularHours && (
                    <span
                      className={`text-xs ${
                        weekData.totalEffectiveHours < weekData.totalRegularHours
                          ? "text-[var(--color-error)]"
                          : "text-[var(--color-success)]"
                      }`}
                    >
                      {weekData.totalEffectiveHours > weekData.totalRegularHours ? "+" : ""}
                      {(weekData.totalEffectiveHours - weekData.totalRegularHours).toFixed(0)}t
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[var(--color-grey-500)] uppercase tracking-wide">
                    Booket
                  </p>
                  <p className="text-2xl font-bold text-[var(--color-grey-900)] mt-1">
                    {weekData.totalBookedHours.toFixed(1)}t
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-grey-500)] uppercase tracking-wide">
                    Ledig
                  </p>
                  <p className="text-2xl font-bold text-[var(--color-success)] mt-1">
                    {(weekData.totalEffectiveHours - weekData.totalBookedHours).toFixed(1)}t
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Overbooking Alert */}
          {instructorDemand && (
            <OverbookingAlert
              expectedSessions={instructorDemand.sessions}
              availableHours={weekData.totalEffectiveHours}
            />
          )}

          {/* Week Grid */}
          <WeekAdjustmentGrid
            days={weekData.days}
            onSaveOverride={handleSaveOverride}
            onDeleteOverride={handleDeleteOverride}
            saving={saving}
          />
        </>
      )}
    </div>
  );
}
