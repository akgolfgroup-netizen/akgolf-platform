"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CoachHQDarkShell,
  PageHead,
  Card,
  CardHeader,
  Button,
  Pill,
} from "@/components/admin/coachhq-dark";
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay, getISOWeek } from "date-fns";
import { nb } from "date-fns/locale";
import type { WeekBooking, WeekStats } from "./actions";

interface ThisWeekDarkClientProps {
  bookings: WeekBooking[];
  stats: WeekStats;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
}

const DAY_LABELS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const HOUR_SLOTS = ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];
const SLOT_HEIGHT = 60; // px per 2-hour slot
const HOUR_PX = SLOT_HEIGHT / 2; // px per hour

type EventTone = "green" | "lime" | "coral" | "violet" | "muted";

function pickTone(b: WeekBooking): EventTone {
  if (b.status === "PENDING") return "muted";
  const name = b.service.name.toLowerCase();
  if (name.includes("bane") || name.includes("course")) return "coral";
  if (name.includes("gruppe") || name.includes("junior")) return "violet";
  if (b.status === "COMPLETED") return "green";
  return "green";
}

const TONE_STYLES: Record<EventTone, { bg: string; color: string; border: string }> = {
  green: {
    bg: "rgba(42,125,90,0.22)",
    color: "#6FCBA1",
    border: "2px solid #2A7D5A",
  },
  lime: {
    bg: "rgba(209,248,67,0.16)",
    color: "#D1F843",
    border: "2px solid #D1F843",
  },
  coral: {
    bg: "rgba(184,66,51,0.18)",
    color: "#F49283",
    border: "2px solid #B84233",
  },
  violet: {
    bg: "rgba(175,82,222,0.18)",
    color: "#C896E8",
    border: "2px solid #AF52DE",
  },
  muted: {
    bg: "rgba(255,255,255,0.025)",
    color: "rgba(255,255,255,0.55)",
    border: "2px dashed rgba(50,77,69,0.45)",
  },
};

function bookingTopAndHeight(start: Date, end: Date): { top: number; height: number } {
  const minStart = 7; // 07:00
  const startMin = start.getHours() + start.getMinutes() / 60;
  const endMin = end.getHours() + end.getMinutes() / 60;
  const top = Math.max(0, (startMin - minStart) * HOUR_PX);
  const height = Math.max(28, (endMin - startMin) * HOUR_PX);
  return { top, height };
}

export function ThisWeekDarkClient({
  bookings,
  stats,
  user,
}: ThisWeekDarkClientProps) {
  const router = useRouter();
  const [weekOffset, setWeekOffset] = useState(0);
  const now = addDays(new Date(), weekOffset * 7);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekNum = getISOWeek(weekStart);

  const weekStartLabel = format(weekStart, "d MMM", { locale: nb });
  const weekEndLabel = format(addDays(weekStart, 6), "d MMM", { locale: nb });

  // Group bookings by day-of-week index
  const bookingsByDay: WeekBooking[][] = Array.from({ length: 7 }, () => []);
  for (const b of bookings) {
    const idx = (new Date(b.startTime).getDay() + 6) % 7;
    bookingsByDay[idx].push(b);
  }

  const heaviestDayIdx = bookingsByDay.reduce(
    (max, day, idx, arr) => (day.length > arr[max].length ? idx : max),
    0,
  );
  const heaviestDayName = [
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag",
    "Søndag",
  ][heaviestDayIdx];

  const capacityPct = Math.min(
    100,
    Math.round((stats.totalBookings / 30) * 100),
  );
  const expectedRevenueK = Math.round(stats.weeklyRevenue / 1000);

  return (
    <CoachHQDarkShell
      user={user}
      title="Denne uken"
      meta={`Uke ${weekNum} · ${weekStartLabel} — ${weekEndLabel}`}
    >
      <PageHead
        eyebrow={`Uke ${weekNum} · ${weekStartLabel} — ${weekEndLabel}`}
        title={`${stats.totalBookings} økter · ${capacityPct}% kapasitet`}
        description={`${heaviestDayName} har ${bookingsByDay[heaviestDayIdx].length} økter — tyngste dag.`}
        actions={
          <>
            <Button
              variant="ghost"
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
              onClick={() => setWeekOffset((o) => o - 1)}
            >
              Forrige
            </Button>
            <Button
              variant="ghost"
              onClick={() => setWeekOffset((o) => o + 1)}
            >
              Neste <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              icon={<Filter className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/team")}
            >
              Anders + Markus
            </Button>
            <Button
              variant="primary"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => router.push("/admin/bookinger/ny")}
            >
              Ny økt
            </Button>
          </>
        }
      />

      {/* Week summary */}
      <div className="grid grid-cols-4 gap-3.5 mb-[18px]">
        <SummaryCard
          label="Planlagte økter"
          value={stats.totalBookings}
          delta="+4"
          barPct={Math.min(100, stats.totalBookings * 3.5)}
        />
        <SummaryCard
          label="Kapasitet brukt"
          value={`${capacityPct}%`}
          delta="+8%"
          barPct={capacityPct}
        />
        <SummaryCard
          label="Forventet inntekt"
          value={`${expectedRevenueK}k`}
          delta="+12%"
          barPct={Math.min(100, expectedRevenueK)}
        />
        <SummaryCard
          label="Aktive spillere"
          value={stats.uniqueStudents}
          deltaLabel={`av 42`}
          barPct={Math.min(100, (stats.uniqueStudents / 42) * 100)}
        />
      </div>

      {/* Grid + side panel */}
      <div
        className="grid gap-4 items-start"
        style={{ gridTemplateColumns: "1fr 320px" }}
      >
        <Card padding="14px">
          <CardHeader
            title={`Uke ${weekNum}`}
            action={<Legend />}
            className="mb-3"
          />

          <div
            className="overflow-hidden"
            style={{
              border: "1px solid #1a4a3a",
              borderRadius: 14,
              background: "#0D2E23",
              boxShadow: "0 1px 2px rgba(10,31,24,0.03), 0 6px 20px rgba(255,255,255,0.04)",
            }}
          >
            <div
              className="grid"
              style={{ gridTemplateColumns: "64px repeat(7, 1fr)" }}
            >
              {/* Header row */}
              <div
                className="px-2 py-2.5 text-center"
                style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid #1a4a3a" }}
              />
              {weekDays.map((d, idx) => {
                const isToday = isSameDay(d, now);
                return (
                  <div
                    key={idx}
                    className="px-2 py-2.5 text-center"
                    style={{
                      background: isToday
                        ? "rgba(209,248,67,0.06)"
                        : "rgba(255,255,255,0.025)",
                      borderBottom: "1px solid #1a4a3a",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      {DAY_LABELS[idx]}
                    </div>
                    <div
                      className="font-semibold"
                      style={{
                        fontSize: 18,
                        color: isToday ? "#D1F843" : "#FFFFFF",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {format(d, "dd")}
                    </div>
                  </div>
                );
              })}

              {/* Time-axis column */}
              <div className="flex flex-col">
                {HOUR_SLOTS.map((slot) => (
                  <div
                    key={slot}
                    className="text-right pr-2 pt-1"
                    style={{
                      height: SLOT_HEIGHT,
                      borderBottom: "1px solid #1a4a3a",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {slot}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDays.map((d, dayIdx) => {
                const isToday = isSameDay(d, now);
                return (
                  <div
                    key={dayIdx}
                    className="relative"
                    style={{
                      borderLeft: "1px solid #1a4a3a",
                      background: isToday ? "rgba(209,248,67,0.025)" : undefined,
                    }}
                  >
                    {HOUR_SLOTS.map((slot) => (
                      <div
                        key={slot}
                        style={{
                          height: SLOT_HEIGHT,
                          borderBottom: "1px solid #1a4a3a",
                        }}
                      />
                    ))}
                    {bookingsByDay[dayIdx].map((b) => {
                      const start = new Date(b.startTime);
                      const end = new Date(b.endTime);
                      const { top, height } = bookingTopAndHeight(start, end);
                      const tone = pickTone(b);
                      const styles = TONE_STYLES[tone];
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => router.push(`/admin/bookinger?id=${b.id}`)}
                          className="absolute px-2 py-1.5 overflow-hidden cursor-pointer text-left"
                          style={{
                            left: 4,
                            right: 4,
                            top,
                            height,
                            background: styles.bg,
                            color: styles.color,
                            borderLeft: styles.border,
                            borderRadius: 6,
                            fontSize: 11,
                            lineHeight: 1.3,
                          }}
                        >
                          <strong className="block font-semibold truncate">
                            {b.student.name?.split(" ")[0] ?? "Spiller"}
                          </strong>
                          <small
                            className="block truncate"
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 9,
                              letterSpacing: "0.06em",
                              opacity: 0.85,
                              marginTop: 2,
                            }}
                          >
                            {b.service.name.split(" ")[0]} · {b.service.duration}m
                          </small>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Ukens fokus" sub="3 prioriteter" />
            <div className="flex flex-col gap-3">
              <FocusItem
                title="Short-game block"
                description="3 spillere på SG-putting under -0.4 — 4 økter dedikert"
                accent
              />
              <FocusItem
                title="Junior turneringsuke"
                description="Junior A+B+C får forberedelse til regions-turnering 12 mai"
              />
              <FocusItem
                title="Re-engagement"
                description="Emma + Henrik booket inn etter inaktivitet"
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Åpne slots" sub="6 ledige" />
            <div className="flex flex-col gap-2">
              {OPEN_SLOTS.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center px-2.5 py-2 rounded-md"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  <div className="text-[12px]" style={{ color: "#E6EAE8" }}>
                    {slot.when}
                  </div>
                  <Pill>{slot.where}</Pill>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full justify-center mt-3"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => router.push("/admin/bookinger")}
            >
              Send til venteliste
            </Button>
          </Card>
        </div>
      </div>
    </CoachHQDarkShell>
  );
}

function SummaryCard({
  label,
  value,
  delta,
  deltaLabel,
  barPct,
}: {
  label: string;
  value: string | number;
  delta?: string;
  deltaLabel?: string;
  barPct: number;
}) {
  return (
    <div
      className="px-4 py-4 rounded-xl"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {label}
      </div>
      <div
        className="mt-1.5 text-[28px] font-bold tabular-nums"
        style={{ color: "#FFFFFF", letterSpacing: "-0.025em" }}
      >
        {value}
        {delta && (
          <small
            className="ml-1.5 font-medium"
            style={{ fontSize: 11, color: "#6FCBA1" }}
          >
            {delta}
          </small>
        )}
        {deltaLabel && (
          <small
            className="ml-1.5 font-medium"
            style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}
          >
            {deltaLabel}
          </small>
        )}
      </div>
      <div
        className="mt-3 h-1 rounded-sm overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-sm"
          style={{ width: `${barPct}%`, background: "#D1F843" }}
        />
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex gap-3.5 items-center">
      <LegendItem color="#2A7D5A" label="1-til-1" />
      <LegendItem color="#D1F843" label="Pågår" />
      <LegendItem color="#AF52DE" label="Gruppe" />
      <LegendItem color="#B84233" label="Banecoach" />
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="text-[11px] inline-flex items-center"
      style={{ color: "rgba(255,255,255,0.6)" }}
    >
      <span
        className="w-2.5 h-2.5 rounded-sm inline-block mr-1.5"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

function FocusItem({
  title,
  description,
  accent,
}: {
  title: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <div
      className="px-3 py-2.5"
      style={{
        background: accent ? "rgba(209,248,67,0.06)" : "rgba(255,255,255,0.025)",
        borderLeft: accent
          ? "2px solid #D1F843"
          : "2px solid rgba(50,77,69,0.4)",
        borderRadius: "0 8px 8px 0",
      }}
    >
      <div className="text-[12px] font-semibold" style={{ color: "#FFFFFF" }}>
        {title}
      </div>
      <div
        className="mt-0.5 text-[11px]"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        {description}
      </div>
    </div>
  );
}

const OPEN_SLOTS = [
  { when: "Ons 30 · 07:00", where: "Studio 1" },
  { when: "Ons 30 · 09:30", where: "Range" },
  { when: "Fre 02 · 15:00", where: "Putting" },
  { when: "Søn 04 · 09:30", where: "Studio 2" },
];
