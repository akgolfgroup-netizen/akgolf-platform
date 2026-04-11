"use client";

import { useState, useTransition } from "react";
import {
  Calendar, Circle, CheckCircle2, Clock, Plus,
  Target, Users, TrendingUp, Trash2,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard, AdminBadge, AdminStatCard,
} from "@/components/portal/mission-control/ui";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
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
  IN_PROGRESS: { label: "Pagar", next: "DONE" },
  DONE: { label: "Ferdig", next: null },
};

const PRIORITY_CONFIG: Record<AdminPriority, { label: string; variant: "error" | "warning" | "info" }> = {
  URGENT: { label: "Haster", variant: "error" },
  IMPORTANT: { label: "Viktig", variant: "warning" },
  NORMAL: { label: "Normal", variant: "info" },
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
  const { toggle } = useMCSidebar();
  const [isPending, startTransition] = useTransition();
  const [division, setDivision] = useState<Division>("COACHING");
  const [tasks, setTasks] = useState(initialTasks);
  const [stats, setStats] = useState(initialStats);
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
      <MCTopbar title="Focus" subtitle="Oppgaver og dagsoversikt per divisjon" onMenuClick={toggle} />

      <div className="p-6 space-y-6">
        {/* Division selector */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white border border-[var(--color-grey-200)]">
          {DIVISIONS.map((d) => {
            const Icon = d.icon;
            return (
              <button key={d.id} onClick={() => setDivision(d.id)} className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                division === d.id ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-grey-100)]",
              )}>
                <Icon className="w-4 h-4" />{d.label}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <AdminStatCard label="A gjore" value={divStats?.todo ?? 0} />
          <AdminStatCard label="Pagar" value={divStats?.inProgress ?? 0} />
          <AdminStatCard label="Ferdig" value={divStats?.done ?? 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Todo */}
          <TaskColumn
            title="A gjore"
            tasks={todoTasks}
            isPending={isPending}
            onToggle={handleToggleStatus}
            onDelete={handleDelete}
            headerAction={
              <button onClick={() => setShowCreate(true)} className="p-1 rounded-md hover:bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            }
          />

          {/* In Progress */}
          <TaskColumn title="Pagar" tasks={inProgressTasks} isPending={isPending} onToggle={handleToggleStatus} onDelete={handleDelete} />

          {/* Today's bookings */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
              <h3 className="admin-section-title">I dag</h3>
              <Calendar className="w-4 h-4 text-[var(--color-muted)]" />
            </div>
            <div className="p-4 space-y-2">
              {divBookings.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-muted)]">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Ingen okter i dag</p>
                </div>
              ) : divBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-grey-50)] transition-colors">
                  <div className="flex items-center justify-center w-14 h-9 bg-[var(--color-primary)] text-white rounded-lg text-xs font-semibold tabular-nums">
                    {format(new Date(b.time), "HH:mm")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--color-text)] truncate">{b.studentName}</div>
                    <div className="text-xs text-[var(--color-muted)]">{b.serviceName}</div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* Done (collapsed) */}
        {doneTasks.length > 0 && (
          <AdminCard>
            <details>
              <summary className="admin-section-title cursor-pointer select-none">
                Ferdig ({doneTasks.length})
              </summary>
              <div className="mt-3 space-y-1">
                {doneTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-2 text-sm text-[var(--color-muted)] line-through">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                    {t.title}
                  </div>
                ))}
              </div>
            </details>
          </AdminCard>
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

function TaskColumn({ title, tasks, isPending, onToggle, onDelete, headerAction }: {
  title: string;
  tasks: FocusTask[];
  isPending: boolean;
  onToggle: (id: string, status: AdminTaskStatus) => void;
  onDelete: (id: string) => void;
  headerAction?: React.ReactNode;
}) {
  return (
    <AdminCard className="p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
        <h3 className="admin-section-title">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-muted)]">{tasks.length}</span>
          {headerAction}
        </div>
      </div>
      <div className="p-4 space-y-2">
        {tasks.length === 0 && (
          <p className="text-xs text-[var(--color-muted)] text-center py-4">Ingen oppgaver</p>
        )}
        {tasks.map((task) => {
          const priCfg = PRIORITY_CONFIG[task.priority];
          return (
            <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-grey-50)] transition-colors group">
              <button
                onClick={() => onToggle(task.id, task.status)}
                disabled={isPending}
                className="mt-0.5 shrink-0 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
                title={STATUS_CONFIG[task.status].next ? `Flytt til ${STATUS_CONFIG[STATUS_CONFIG[task.status].next!].label}` : "Ferdig"}
              >
                {task.status === "IN_PROGRESS" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[var(--color-text)]">{task.title}</div>
                {task.dueDate && (
                  <div className="text-xs text-[var(--color-muted)] mt-0.5">
                    {format(new Date(task.dueDate), "d. MMM", { locale: nb })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <AdminBadge variant={priCfg.variant}>{priCfg.label}</AdminBadge>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-1 rounded-md opacity-0 group-hover:opacity-100 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminCard>
  );
}

// ── Helpers ─────────────────────────────────────────────────

function matchesDivision(category: string, division: Division): boolean {
  if (division === "COACHING") return ["INDIVIDUAL", "DIGITAL"].includes(category);
  if (division === "JUNIOR") return category === "JUNIOR" || category === "CAMP";
  if (division === "GFGK") return category === "GROUP";
  return false;
}
