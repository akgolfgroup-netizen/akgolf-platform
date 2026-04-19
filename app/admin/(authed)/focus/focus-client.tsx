"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";
import { Target, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
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
  IN_PROGRESS: { label: "Pågår", next: "DONE" },
  DONE: { label: "Ferdig", next: null },
};

const PRIORITY_CONFIG: Record<AdminPriority, { label: string; color: string }> = {
  URGENT: { label: "Haster", color: "bg-red-100 text-red-700" },
  IMPORTANT: { label: "Viktig", color: "bg-amber-100 text-amber-700" },
  NORMAL: { label: "Normal", color: "bg-slate-100 text-slate-700" },
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
      <MCTopbar title="Focus" subtitle="Oppgaver og dagsoversikt per divisjon" onMenuClick={toggle} />

      <div className="p-6 space-y-6">
        {/* Division selector */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white border border-grey-200">
          {DIVISIONS.map((d) => {
            const Icon = d.icon;
            return (
              <button key={d.id} onClick={() => setDivision(d.id)} className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                division === d.id 
                  ? "bg-black text-white" 
                  : "text-grey-400 hover:text-black hover:bg-grey-50",
              )}>
                <Icon className="w-4 h-4" />{d.label}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Å gjøre" value={divStats?.todo ?? 0} />
          <StatCard label="Pågår" value={divStats?.inProgress ?? 0} />
          <StatCard label="Ferdig" value={divStats?.done ?? 0} />
        </div>

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
                className="p-1.5 rounded-lg hover:bg-grey-50 text-grey-400 hover:text-black transition-colors"
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
          <div className="bg-white border border-grey-200 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-grey-200 flex items-center justify-between bg-grey-50">
              <h3 className="text-sm font-semibold text-black">I dag</h3>
              <Icon name="calendar_today" className="w-4 h-4 text-grey-400" />
            </div>
            <div className="p-4 space-y-2 flex-1">
              {divBookings.length === 0 ? (
                <div className="text-center py-8 text-grey-400">
                  <Icon name="schedule" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Ingen økter i dag</p>
                </div>
              ) : divBookings.map((b) => (
                <div 
                  key={b.id} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-grey-50 transition-colors border border-transparent hover:border-grey-200"
                >
                  <div className="flex items-center justify-center w-14 h-9 bg-black text-white rounded-lg text-xs font-semibold tabular-nums">
                    {format(new Date(b.time), "HH:mm")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-black truncate">{b.studentName}</div>
                    <div className="text-xs text-grey-400">{b.serviceName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Done (collapsed) */}
        {doneTasks.length > 0 && (
          <div className="bg-white border border-grey-200 rounded-xl overflow-hidden">
            <details>
              <summary className="px-5 py-4 text-sm font-semibold text-black cursor-pointer select-none hover:bg-grey-50 transition-colors border-b border-grey-200 list-none flex items-center justify-between">
                <span>Ferdig ({doneTasks.length})</span>
                <span className="text-grey-400">▼</span>
              </summary>
              <div className="p-4 space-y-1">
                {doneTasks.map((t) => (
                  <div 
                    key={t.id} 
                    className="flex items-center gap-3 p-2 text-sm text-grey-400 line-through"
                  >
                    <Icon name="check"Circle2 className="w-4 h-4 text-grey-400 shrink-0" />
                    {t.title}
                  </div>
                ))}
              </div>
            </details>
          </div>
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
    <div className="bg-white border border-grey-200 rounded-xl p-4">
      <div className="text-2xl font-bold text-black">{value}</div>
      <div className="text-sm text-grey-400">{label}</div>
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
    <div className="bg-white border border-grey-200 rounded-xl overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-grey-200 flex items-center justify-between bg-grey-50">
        <h3 className="text-sm font-semibold text-black">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-grey-400 bg-grey-50 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
          {headerAction}
        </div>
      </div>
      <div className="p-4 space-y-2 flex-1">
        {tasks.length === 0 && (
          <p className="text-xs text-grey-400 text-center py-4">Ingen oppgaver</p>
        )}
        {tasks.map((task) => {
          const priCfg = PRIORITY_CONFIG[task.priority];
          return (
            <div 
              key={task.id} 
              className="flex items-start gap-3 p-3 rounded-lg bg-grey-50 border border-grey-200 hover:border-grey-300 transition-colors group"
            >
              <button
                onClick={() => onToggle(task.id, task.status)}
                disabled={isPending}
                className="mt-0.5 shrink-0 text-grey-400 hover:text-grey-400 transition-colors disabled:opacity-50"
                title={STATUS_CONFIG[task.status].next ? `Flytt til ${STATUS_CONFIG[STATUS_CONFIG[task.status].next!].label}` : "Ferdig"}
              >
                {task.status === "IN_PROGRESS" ? (
                  <Icon name="check"Circle2 className="w-5 h-5" />
                ) : (
                  <Icon name="circle" className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-black">{task.title}</div>
                {task.dueDate && (
                  <div className="text-xs text-grey-400 mt-0.5">
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
                  className="p-1 rounded-md opacity-0 group-hover:opacity-100 text-grey-400 hover:text-red-500 transition-all"
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
