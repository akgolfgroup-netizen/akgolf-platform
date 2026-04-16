"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HeatmapData {
  day: string;
  hour: number;
  value: number; // 0-4 scale
}

interface ActivityHeatmapProps {
  data?: HeatmapData[];
  title?: string;
}

const days = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

// Generate mock heatmap data
const generateHeatmapData = (): HeatmapData[] => {
  const data: HeatmapData[] = [];
  days.forEach((day) => {
    hours.forEach((hour) => {
      // Higher activity during typical coaching hours
      let baseValue = 0;
      if (hour >= 9 && hour <= 17) {
        baseValue = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
      }
      // Weekends have different patterns
      if (day === "Lør" || day === "Søn") {
        baseValue = hour >= 10 && hour <= 14 ? Math.floor(Math.random() * 3) + 1 : 0;
      }
      data.push({ day, hour, value: baseValue });
    });
  });
  return data;
};

const defaultData = generateHeatmapData();

const intensityColors = [
  "bg-grey-100",
  "bg-success-light",
  "bg-success/30",
  "bg-success/60",
  "bg-success",
];

const intensityLabels = ["Ingen", "Lav", "Medium", "Høy", "Maks"];

export function ActivityHeatmap({ data = defaultData, title = "Booking-aktivitet" }: ActivityHeatmapProps) {
  const getValue = (day: string, hour: number) => {
    const item = data.find((d) => d.day === day && d.hour === hour);
    return item?.value ?? 0;
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-black">{title}</h3>
        <div className="flex items-center gap-2">
          {intensityLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              <div className={cn("w-3 h-3 rounded", intensityColors[i])} />
              <span className="text-[10px] text-grey-400 hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header row with hours */}
          <div className="flex">
            <div className="w-10" /> {/* Spacer for day labels */}
            <div className="flex-1 grid grid-cols-12 gap-1">
              {hours.map((hour) => (
                <div key={hour} className="text-center">
                  <span className="text-[10px] text-grey-400">{hour}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day rows */}
          <div className="space-y-1 mt-2">
            {days.map((day) => (
              <div key={day} className="flex items-center">
                <div className="w-10 text-right pr-2">
                  <span className="text-xs font-medium text-grey-400">{day}</span>
                </div>
                <div className="flex-1 grid grid-cols-12 gap-1">
                  {hours.map((hour) => {
                    const value = getValue(day, hour);
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={cn(
                          "h-6 rounded transition-all duration-200 hover:scale-110 cursor-pointer",
                          intensityColors[value]
                        )}
                        title={`${day} ${hour}:00 - ${intensityLabels[value]}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-grey-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-black tabular-nums">156</p>
          <p className="text-[10px] text-grey-400 uppercase tracking-wide">Bookinger</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-black tabular-nums">42</p>
          <p className="text-[10px] text-grey-400 uppercase tracking-wide">Treningsøkter</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-black tabular-nums">28</p>
          <p className="text-[10px] text-grey-400 uppercase tracking-wide">Runder</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-black tabular-nums">89%</p>
          <p className="text-[10px] text-grey-400 uppercase tracking-wide">Engasjement</p>
        </div>
      </div>
    </Card>
  );
}
