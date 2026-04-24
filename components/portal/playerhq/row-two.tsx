"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";

interface ListGroup {
  label: string;
  items?: { icon: string; name: string; detail: string }[];
  defaultOpen?: boolean;
}

export function ListCard({ groups }: { groups: ListGroup[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(
    groups.findIndex((g) => g.defaultOpen),
  );
  return (
    <div className="overflow-hidden rounded-[20px] border border-outline-variant bg-surface-container py-2.5">
      {groups.map((g, i) => {
        const isOpen = openIdx === i;
        const hasItems = Boolean(g.items?.length);
        return (
          <div
            key={i}
            className={
              i < groups.length - 1 ? "border-b border-dashed border-outline-variant" : ""
            }
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="flex w-full cursor-pointer items-center justify-between px-[22px] py-3.5 text-left"
            >
              <span className="text-[13px] font-medium text-on-surface">{g.label}</span>
              <Icon
                name={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                size={16}
                className="text-on-surface-variant"
              />
            </button>
            {isOpen && hasItems && (
              <div className="px-[22px] pb-3.5">
                {g.items!.map((it, k) => (
                  <div key={k} className="flex items-center gap-3 py-1.5">
                    <span
                      className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg"
                      style={{ background: "var(--color-surface-container-low)" }}
                    >
                      <Icon name={it.icon} size={16} className="text-on-surface" />
                    </span>
                    <div className="flex-1">
                      <div className="text-[12px] font-semibold text-on-surface">{it.name}</div>
                      <div className="mt-0.5 text-[10px] text-on-surface-variant">{it.detail}</div>
                    </div>
                    <Icon name="more_vert" size={14} className="text-on-surface-variant" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface CalendarEvent {
  id: string;
  dayIndex: number;
  startMinutes: number;
  durationMinutes: number;
  title: string;
  subtitle: string;
  tone: "dark" | "accent";
  attendees: string[];
}

interface CalendarCardProps {
  monthLabel: string;
  prevMonth: string;
  nextMonth: string;
  days: { d: string; n: number; active?: boolean }[];
  hours: string[];
  events: CalendarEvent[];
}

export function CalendarCard({
  monthLabel,
  prevMonth,
  nextMonth,
  days,
  hours,
  events,
}: CalendarCardProps) {
  const hourHeight = 28;
  return (
    <div className="flex flex-col gap-2.5 rounded-[20px] border border-outline-variant bg-surface-container px-[22px] py-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-on-surface-variant">{prevMonth}</span>
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-on-surface">
          {monthLabel}
        </span>
        <span className="text-[11px] text-on-surface-variant">{nextMonth}</span>
      </div>

      <div
        className="grid items-center gap-1.5 pb-1.5 pt-0.5"
        style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}
      >
        <div />
        {days.map((d, i) => (
          <div key={i} className="text-center">
            <div className="text-[10px] font-medium text-on-surface-variant">{d.d}</div>
            <div
              className={
                d.active
                  ? "mt-0.5 text-[15px] font-semibold text-on-surface"
                  : "mt-0.5 text-[15px] font-semibold text-on-surface-variant"
              }
            >
              {d.n}
            </div>
          </div>
        ))}
      </div>

      <div className="relative" style={{ minHeight: hours.length * hourHeight }}>
        {hours.map((h, i) => (
          <div
            key={h}
            className="grid items-center"
            style={{
              gridTemplateColumns: "56px 1fr",
              height: hourHeight,
              borderTop: i === 0 ? "none" : "1px dashed var(--color-outline-variant)",
            }}
          >
            <span className="text-[10px] text-on-surface-variant">{h}</span>
            <div />
          </div>
        ))}

        {events.map((ev) => {
          const top = ((ev.startMinutes - minutesFromFirst(hours)) / 60) * hourHeight;
          const isDark = ev.tone === "dark";
          const bg = isDark ? "var(--color-on-surface)" : "var(--color-secondary-fixed)";
          const textColor = isDark ? "#fff" : "var(--color-on-secondary-fixed)";
          const borderColor = isDark
            ? "var(--color-on-surface)"
            : "var(--color-secondary-fixed)";
          return (
            <div
              key={ev.id}
              className="absolute flex items-center gap-2.5 rounded-full px-3 py-1.5"
              style={{
                top,
                left: ev.dayIndex === 0 ? 62 : `${(ev.dayIndex / days.length) * 100}%`,
                width: `${Math.max(30, (ev.durationMinutes / 60) * 18)}%`,
                background: bg,
                color: textColor,
              }}
            >
              <div className="flex-1">
                <div className="text-[11px] font-semibold">{ev.title}</div>
                <div className="text-[9px] opacity-70">{ev.subtitle}</div>
              </div>
              <div className="flex">
                {ev.attendees.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="inline-block h-4.5 w-4.5 rounded-full"
                    style={{
                      background: c,
                      border: `1.5px solid ${borderColor}`,
                      marginLeft: i === 0 ? 0 : -6,
                      width: 18,
                      height: 18,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function minutesFromFirst(hours: string[]) {
  const [h] = hours[0]?.split(":").map(Number) ?? [0];
  return h * 60;
}

interface TaskItem {
  id: string;
  icon: string;
  label: string;
  time: string;
  date: string;
  done: boolean;
}

interface TasksCardProps {
  title: string;
  tasks: TaskItem[];
  ctaLabel: string;
  ctaHref: string;
}

export function TasksCard({ title, tasks, ctaLabel, ctaHref }: TasksCardProps) {
  const doneCount = tasks.filter((t) => t.done).length;
  return (
    <div
      className="flex flex-col rounded-[20px] p-[22px] text-white"
      style={{
        background: "#022c22",
        boxShadow: "inset 0 0 0 1px rgba(210,240,0,0.06)",
      }}
    >
      <div className="mb-3.5 flex items-center justify-between">
        <div className="text-[15px] font-semibold tracking-[-0.01em] text-white">{title}</div>
        <div className="text-[13px] font-semibold tabular-nums text-white">
          {doneCount}/{tasks.length}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-xl px-2.5 py-2.5"
            style={{
              background: "rgba(210,240,0,0.05)",
              opacity: t.done ? 0.55 : 1,
            }}
          >
            <span
              className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-md"
              style={{ background: "rgba(210,240,0,0.1)" }}
            >
              <Icon name={t.icon} size={16} style={{ color: "var(--color-secondary-fixed)" }} />
            </span>
            <div className="flex-1">
              <div
                className="text-[12px] font-semibold text-white"
                style={{
                  textDecoration: t.done ? "line-through" : "none",
                  textDecorationColor: "rgba(255,255,255,0.3)",
                }}
              >
                {t.label}
              </div>
              <div className="mt-0.5 text-[10px] tabular-nums" style={{ color: "rgba(237,245,218,0.6)" }}>
                {t.date} · {t.time}
              </div>
            </div>
            <span
              className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full"
              style={{
                width: 18,
                height: 18,
                background: t.done ? "var(--color-secondary-fixed)" : "transparent",
                border: t.done ? "none" : "1.5px solid rgba(237,245,218,0.25)",
              }}
            >
              {t.done && (
                <Icon
                  name="check"
                  size={12}
                  style={{ color: "var(--color-on-secondary-fixed)" }}
                />
              )}
            </span>
          </div>
        ))}
      </div>

      <Link
        href={ctaHref}
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[12px] font-semibold"
        style={{
          background: "var(--color-secondary-fixed)",
          color: "var(--color-on-secondary-fixed)",
        }}
      >
        <Icon name="play_arrow" size={14} />
        {ctaLabel}
      </Link>
    </div>
  );
}

interface PlayerHQRowTwoProps {
  listGroups: ListGroup[];
  calendar: CalendarCardProps;
  tasks: TasksCardProps;
}

export function PlayerHQRowTwo({ listGroups, calendar, tasks }: PlayerHQRowTwoProps) {
  return (
    <div
      className="grid gap-3.5"
      style={{ gridTemplateColumns: "1fr 1.6fr 1.1fr" }}
    >
      <ListCard groups={listGroups} />
      <CalendarCard {...calendar} />
      <TasksCard {...tasks} />
    </div>
  );
}
