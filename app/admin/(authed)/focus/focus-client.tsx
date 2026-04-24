"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";
import { Target, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { CoachHQTopbar, useCoachHQSidebar } from "@/components/portal/coach-hq";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { MonoLabel, BentoGrid, BentoCard, NightSurface, GlassPanel } from "@/components/portal/patterns";
import {
  getTasks, updateTaskStatus, deleteTask,
  type FocusTask, type DivisionStats,
} from "./actions";
import { CreateTaskDialog } from "./create-task-dialog";
import type { AdminTaskStatus, AdminPriority } from "@prisma/client";

// ── Config ──────────────────────────────────────────────────

type Division = "COACHING" | "JUNIOR" | "GFGK";

const DIVISIONS = [
  { id: "COACHING" as const, label: "Coaching", icon: Target },
  { id: "JUNIOR" as const, label: "Junior", icon: Users },
  { id: "GFGK" as const, label: "GFGK", icon: TrendingUp },
];

const STATUS_CONFIG: Record<AdminTaskStatus, { label: string; next: AdminTaskStatus | null }> = {
  TODO: { label: "Ny", next: "IN_PROGRESS" },
  IN_PROGRESS: { label: "Pågår", next: "DONE" },
  DONE: { label: "Ferdig", next: null },
};

const PRIORITY_CONFIG: Record<AdminPriority, { label: string; color: string }> = {
  URGENT: { label: "Haster", color: "bg-red-100 text-red-700" },
  IMPORTANT: { label: "Viktig", color: "bg-amber-100 text-amber-700" },
  NORMAL: { label: "Normal", color: "bg-surface-container text-inverse-on-surface/90" },
};

interface TodayBooking {
  id: string;
  time: string;
  studentName: string;
  serviceName: string;
  category: string;
}

interface Props {
  initialTasks: FocusTask[];
  initialStats: DivisionStats[];
  todayBookings: TodayBooking[];
}

// ── Component ───────────────────────────────────────────────

export function FocusClient({ initialTasks, initialStats, todayBookings }: Props) {
  const { toggle } = useCoachHQSidebar();
  const [isPending, startTransition] = useTransition();
  const [division, setDivision] = useState<Division>("COACHING");
  const [tasks, setTasks] = useState(initialTasks);
  const [stats] = useState(initialStats);
  const [showCreate, setShowCreate] = useState(false);

  const divTasks = tasks.filter((t) => t.division === division);
  const todoTasks = divTasks.filter((t) => t.status === "TODO");
  const inProgressTasks = divTasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = divTasks.filter((t) => t.status === "DONE");
  const divStats = stats.find((s) => s.division === division);
  const divBookings = todayBookings.filter((b) => matchesDivision(b.category, division));

  function refresh() {
    startTransition(async () => {
      const updated = await getTasks();
      setTasks(updated);
    });
  }

  async function handleToggleStatus(taskId: string, currentStatus: AdminTaskStatus) {
    const next = STATUS_CONFIG[currentStatus].next;
    if (!next) return;
    startTransition(async () => {
      await updateTaskStatus(taskId, next);
      const updated = await getTasks();
      setTasks(updated);
    });
  }

  async function handleDelete(taskId: string) {
    if (!window.confirm("Slett oppgave?")) return;
    startTransition(async () => {
      await deleteTask(taskId);
      const updated = await getTasks();
      setTasks(updated);
    });
  }

  return (
    <>
      <CoachHQTopbar title="Focus" subtitle="Oppgaver og dagsoversikt per divisjon" onMenuClick={toggle} />

      <div className="p-6 space-y-6">
        {/* Heritage Grid Header */}
        <div className="space-y-2">
          <MonoLabel size="xs" uppercase className="block text-outline">CoachHQ</MonoLabel>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Focus<span className="text-outline">.</span></h1>
          <p className="text-on-surface-variant">Oppgaver og dagsoversikt per divisjon</p>
        </div>

        {/* Division selector */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
          {DIVISIONS.map((d) => {
            const Icon = d.icon;
            return (
              <button key={d.id} onClick={() => setDivision(d.id)} className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                division === d.id 
                  ? "bg-on-surface text-surface" 
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface",
              )}>
                <Icon className="w-4 h-4" />{d.label}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <BentoGrid cols={3} gap="md">
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">Å gjøre</MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">{divStats?.todo ?? 0}</p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">Pågår</MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">{divStats?.inProgress ?? 0}</p>
          </BentoCard>
          <BentoCard variant="light" padding="md">
            <MonoLabel size="xs" uppercase className="text-outline block">Ferdig</MonoLabel>
            <p className="text-2xl font-bold text-on-surface mt-1">{divStats?.done ?? 0}</p>
          </BentoCard>
        </BentoGrid>

        <div className="hidden">
          <StatCard label="Å gjøre" value={divStats?.todo ?? 0} />
          <StatCard label="Pågår" value={divStats?.inProgress ?? 0} />
          <StatCard label="Ferdig" value={divStats?.done ?? 0} />
        </div>

        <NightSurface variant="ambient" className="rounded-2xl p-6">
          <MonoLabel size="xs" uppercase className="text-surface/60 block mb-4">Oppgaveboard</MonoLabel>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Todo */}
          <TaskColumn
            title="Å gjøre"
            tasks={todoTasks}
            isPending={isPending}
            onToggle={handleToggleStatus}
            onDelete={handleDelete}
            headerAction={
              <button 
                onClick={() => setShowCreate(true)} 
                className="p-1.5 rounded-lg hover:bg-surface text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <Icon name="add" className="w-4 h-4" />
              </button>
            }
          />

          {/* In Progress */}
          <TaskColumn 
            title="Pågår" 
            tasks={inProgressTasks} 
            isPending={isPending} 
            onToggle={handleToggleStatus} 
            onDelete={handleDelete} 
          />

          {/* Today's bookings */}
          <GlassPanel variant="dark" padding="md">
            <div className="flex items-center justify-between mb-4">
              <MonoLabel size="xs" uppercase className="text-surface/60">I dag</MonoLabel>
              <Icon name="calendar_today" className="w-4 h-4 text-surface/60" />
            </div>
            <div className="space-y-2">
              {divBookings.length === 0 ? (
                <div className="text-center py-8 text-surface/60">
                  <Icon name="schedule" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Ingen økter i dag</p>
                </div>
              ) : divBookings.map((b) => (
                <div 
                  key={b.id} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                >
                  <div className="flex items-center justify-center w-14 h-9 bg-secondary-fixed text-on-secondary-fixed rounded-lg text-xs font-semibold tabular-nums">
                    {format(new Date(b.time), "HH:mm")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#F2F5F1] truncate">{b.studentName}</div>
                    <div className="text-xs text-surface/60">{b.serviceName}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
          </div>
        </NightSurface>

        {/* Done (collapsed) */}
        {doneTasks.length > 0 && (
          <GlassPanel variant="light" padding="md">
            <details>
              <summary className="text-sm font-semibold text-on-surface cursor-pointer select-none hover:bg-surface-container transition-colors list-none flex items-center justify-between">
                <span>Ferdig ({doneTasks.length})</span>
                <span className="text-on-surface-variant">▼</span>
              </summary>
              <div className="mt-4 space-y-1">
                {doneTasks.map((t) => (
                  <div 
                    key={t.id} 
                    className="flex items-center gap-3 p-2 text-sm text-on-surface-variant line-through"
                  >
                    <Icon name="check_circle" className="w-4 h-4 text-on-surface-variant shrink-0" />
                    {t.title}
                  </div>
                ))}
              </div>
            </details>
          </GlassPanel>
        )}
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={showCreate}
        division={division}
        onClose={() => setShowCreate(false)}
        onCreated={refresh}
      />
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4">
      <div className="text-2xl font-bold text-on-surface">{value}</div>
      <div className="text-sm text-on-surface-variant">{label}</div>
    </div>
  );
}

function TaskColumn({ title, tasks, isPending, onToggle, onDelete, headerAction }: {
  title: string;
  tasks: FocusTask[];
  isPending: boolean;
  onToggle: (id: string, status: AdminTaskStatus) => void;
  onDelete: (id: string) => void;
  headerAction?: React.ReactNode;
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface">
        <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-on-surface-variant bg-surface px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
          {headerAction}
        </div>
      </div>
      <div className="p-4 space-y-2 flex-1">
        {tasks.length === 0 && (
          <p className="text-xs text-on-surface-variant text-center py-4">Ingen oppgaver</p>
        )}
        {tasks.map((task) => {
          const priCfg = PRIORITY_CONFIG[task.priority];
          return (
            <div 
              key={task.id} 
              className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-outline-variant/30 hover:border-outline-variant/50 transition-colors group"
            >
              <button
                onClick={() => onToggle(task.id, task.status)}
                disabled={isPending}
                className="mt-0.5 shrink-0 text-on-surface-variant hover:text-on-surface-variant transition-colors disabled:opacity-50"
                title={STATUS_CONFIG[task.status].next ? `Flytt til ${STATUS_CONFIG[STATUS_CONFIG[task.status].next!].label}` : "Ferdig"}
              >
                {task.status === "IN_PROGRESS" ? (
                  <Icon name="check_circle" className="w-5 h-5" />
                ) : (
                  <Icon name="circle" className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-on-surface">{task.title}</div>
                {task.dueDate && (
                  <div className="text-xs text-on-surface-variant mt-0.5">
                    {format(new Date(task.dueDate), "d. MMM", { locale: nb })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide", priCfg.color)}>
                  {priCfg.label}
                </span>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-1 rounded-md opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-red-500 transition-all"
                >
                  <Icon name="delete" className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────

function matchesDivision(category: string, division: Division): boolean {
  if (division === "COACHING") return ["INDIVIDUAL", "DIGITAL"].includes(category);
  if (division === "JUNIOR") return category === "JUNIOR" || category === "CAMP";
  if (division === "GFGK") return category === "GROUP";
  return false;
}
