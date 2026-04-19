"use client";

import React, { useState } from "react";
import { Clock, Plus, Trash2, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface WorkHours {
  day: string;
  label: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface SpecialDate {
  id: string;
  date: string;
  label: string;
  type: "closed" | "vacation" | "extended";
  openTime?: string;
  closeTime?: string;
}

const defaultWorkHours: WorkHours[] = [
  { day: "monday", label: "Mandag", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "tuesday", label: "Tirsdag", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "wednesday", label: "Onsdag", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "thursday", label: "Torsdag", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "friday", label: "Fredag", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "saturday", label: "Lørdag", isOpen: true, openTime: "10:00", closeTime: "14:00" },
  { day: "sunday", label: "Søndag", isOpen: false, openTime: "10:00", closeTime: "14:00" },
];

const defaultSpecialDates: SpecialDate[] = [
  { id: "1", date: "2026-05-17", label: "Nasjonaldagen", type: "closed" },
  { id: "2", date: "2026-12-24", label: "Julaften", type: "closed" },
  { id: "3", date: "2026-12-25", label: "Første juledag", type: "closed" },
];

function TimeInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        "px-2 py-1.5 rounded-lg border border-grey-200 text-sm font-medium",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        disabled && "bg-grey-50 text-grey-300 cursor-not-allowed"
      )}
    />
  );
}

function WorkDayRow({
  hours,
  onToggle,
  onTimeChange,
}: {
  hours: WorkHours;
  onToggle: () => void;
  onTimeChange: (field: "openTime" | "closeTime", value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-grey-50 transition-colors">
      <div className="flex items-center gap-4">
        <Switch checked={hours.isOpen} onCheckedChange={onToggle} />
        <span className={cn("text-sm font-medium", !hours.isOpen && "text-grey-300")}>
          {hours.label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <TimeInput
          value={hours.openTime}
          onChange={(v) => onTimeChange("openTime", v)}
          disabled={!hours.isOpen}
        />
        <span className="text-grey-300">til</span>
        <TimeInput
          value={hours.closeTime}
          onChange={(v) => onTimeChange("closeTime", v)}
          disabled={!hours.isOpen}
        />
      </div>
    </div>
  );
}

function SpecialDateItem({
  date,
  onDelete,
}: {
  date: SpecialDate;
  onDelete: () => void;
}) {
  const typeLabels = {
    closed: "Stengt",
    vacation: "Ferie",
    extended: "Utvidet",
  };

  const typeColors = {
    closed: "bg-error-light text-error",
    vacation: "bg-warning-light text-warning",
    extended: "bg-success-light text-success",
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-grey-50 transition-colors group">
      <div className="flex items-center gap-3">
        <CalendarDays className="w-4 h-4 text-grey-400" />
        <div>
          <p className="text-sm font-medium text-black">{date.label}</p>
          <p className="text-xs text-grey-400">
            {new Date(date.date).toLocaleDateString("nb-NO", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", typeColors[date.type])}>
          {typeLabels[date.type]}
        </span>
        {date.type === "extended" && date.openTime && date.closeTime && (
          <span className="text-xs text-grey-400">
            {date.openTime} - {date.closeTime}
          </span>
        )}
        <button
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center rounded-lg text-grey-400 hover:text-error"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function AvailabilitySettings() {
  const [workHours, setWorkHours] = useState<WorkHours[]>(defaultWorkHours);
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>(defaultSpecialDates);

  const toggleDay = (index: number) => {
    setWorkHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, isOpen: !h.isOpen } : h))
    );
  };

  const updateTime = (index: number, field: "openTime" | "closeTime", value: string) => {
    setWorkHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  };

  const deleteSpecialDate = (id: string) => {
    setSpecialDates((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Standard Work Hours */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-grey-400" />
            <h2 className="text-sm font-semibold text-black">Standard arbeidstider</h2>
          </div>
        </div>
        <div className="divide-y divide-grey-50">
          {workHours.map((hours, index) => (
            <WorkDayRow
              key={hours.day}
              hours={hours}
              onToggle={() => toggleDay(index)}
              onTimeChange={(field, value) => updateTime(index, field, value)}
            />
          ))}
        </div>
      </Card>

      {/* Special Dates */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-grey-400" />
            <h2 className="text-sm font-semibold text-black">Spesielle datoer</h2>
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-grey-200 text-grey-700 hover:bg-grey-50 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Legg til</span>
          </button>
        </div>
        <div className="divide-y divide-grey-50">
          {specialDates.length > 0 ? (
            specialDates.map((date) => (
              <SpecialDateItem
                key={date.id}
                date={date}
                onDelete={() => deleteSpecialDate(date.id)}
              />
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-grey-400">Ingen spesielle datoer</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
