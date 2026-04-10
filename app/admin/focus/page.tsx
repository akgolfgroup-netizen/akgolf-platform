"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Circle,
  Clock,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
} from "@/components/portal/mission-control/ui";

// Mock data
const MOCK_PROJECTS = {
  coaching: [
    { id: "1", name: "Performance Pro Launch", progress: 75, dueDate: "15. apr" },
    { id: "2", name: "TrackMan Integration", progress: 40, dueDate: "30. apr" },
    { id: "3", name: "Vinter-camp 2027", progress: 10, dueDate: "1. nov" },
  ],
  junior: [
    { id: "4", name: "Sommerskole 2026", progress: 90, dueDate: "1. jun" },
    { id: "5", name: "Junior Tour Kalender", progress: 60, dueDate: "20. apr" },
  ],
  gfgk: [
    { id: "6", name: "Sesongstart 2026", progress: 85, dueDate: "1. mai" },
    { id: "7", name: "Foreldre-kveld", progress: 20, dueDate: "25. apr" },
  ],
};

const MOCK_TASKS = {
  coaching: [
    { id: "t1", text: "Ring Maria L. — oppfolging", priority: "urgent" },
    { id: "t2", text: "Oppdater Erik S. pakke", priority: "important" },
    { id: "t3", text: "Forbered TrackMan-rapport", priority: "normal" },
  ],
  junior: [
    { id: "t4", text: "Godkjenn 2 nye pameldinger", priority: "urgent" },
    { id: "t5", text: "Send foreldre-nyhetsbrev", priority: "important" },
  ],
  gfgk: [
    { id: "t6", text: "Bestill utstyr til gruppe A", priority: "normal" },
    { id: "t7", text: "Koordiner med GFGK-styre", priority: "normal" },
  ],
};

const MOCK_SESSIONS = {
  coaching: [
    { id: "s1", time: "09:00", name: "Kari Haugen", type: "Elite" },
    { id: "s2", time: "15:30", name: "Thomas Rasmussen", type: "Performance" },
  ],
  junior: [
    { id: "s3", time: "10:30", name: "Sofie Andersen", type: "Junior 16-17" },
    { id: "s4", time: "16:00", name: "Jonas Bakken", type: "Junior 13-15" },
  ],
  gfgk: [{ id: "s5", time: "14:00", name: "Gruppetrening", type: "Gruppe A" }],
};

const priorityVariant: Record<string, "error" | "warning" | "info"> = {
  urgent: "error",
  important: "warning",
  normal: "info",
};

const priorityLabels: Record<string, string> = {
  urgent: "Haster",
  important: "Viktig",
  normal: "Normal",
};

export default function FocusPage() {
  const [selectedDivision, setSelectedDivision] = useState<
    "coaching" | "junior" | "gfgk"
  >("coaching");
  const { toggle } = useMCSidebar();

  const projects = MOCK_PROJECTS[selectedDivision];
  const tasks = MOCK_TASKS[selectedDivision];
  const sessions = MOCK_SESSIONS[selectedDivision];

  const divisions = [
    { id: "coaching", label: "Coaching", icon: Target },
    { id: "junior", label: "Junior", icon: Users },
    { id: "gfgk", label: "GFGK", icon: TrendingUp },
  ] as const;

  return (
    <>
      <MCTopbar
        title="Focus Mode"
        subtitle="Konsentrert visning uten distraksjoner"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        {/* Division Selector */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white border border-[var(--color-grey-200)]">
          {divisions.map((div) => {
            const Icon = div.icon;
            const isActive = selectedDivision === div.id;
            return (
              <button
                key={div.id}
                type="button"
                onClick={() => setSelectedDivision(div.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-grey-100)]",
                )}
              >
                <Icon className="w-4 h-4" />
                {div.label}
              </button>
            );
          })}
        </div>

        {/* Focus Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Column */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
              <h3 className="admin-section-title">Prosjekter</h3>
              <span className="text-xs text-[var(--color-muted)]">
                {projects.length} aktive
              </span>
            </div>
            <div className="p-4 space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-3 rounded-xl bg-[var(--color-grey-50)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[var(--color-text)]">
                      {project.name}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">
                      {project.dueDate}
                    </span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-[var(--color-muted)] mt-1.5 tabular-nums">
                    {project.progress}% fullfort
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Tasks Column */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
              <h3 className="admin-section-title">Oppgaver</h3>
              <span className="text-xs text-[var(--color-muted)]">
                {tasks.length} a gjore
              </span>
            </div>
            <div className="p-4 space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-grey-50)] transition-colors cursor-pointer group"
                >
                  <Circle className="w-5 h-5 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[var(--color-text)]">
                      {task.text}
                    </div>
                  </div>
                  <AdminBadge variant={priorityVariant[task.priority] ?? "info"}>
                    {priorityLabels[task.priority] ?? task.priority}
                  </AdminBadge>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Today's Schedule */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
              <h3 className="admin-section-title">I dag</h3>
              <Calendar className="w-4 h-4 text-[var(--color-muted)]" />
            </div>
            <div className="p-4 space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-grey-50)] transition-colors"
                >
                  <div className="flex items-center justify-center w-14 h-9 bg-[var(--color-primary)] text-white rounded-lg text-xs font-semibold tabular-nums">
                    {session.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--color-text)] truncate">
                      {session.name}
                    </div>
                    <div className="text-xs text-[var(--color-muted)]">
                      {session.type}
                    </div>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-8 text-[var(--color-muted)]">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Ingen okter i dag</p>
                </div>
              )}
            </div>
          </AdminCard>
        </div>

        {/* Quick Actions */}
        <AdminCard>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin">
              <AdminButton variant="secondary">Tilbake til Hub</AdminButton>
            </Link>
            <Link href="/admin/elever">
              <AdminButton
                variant="secondary"
                icon={<Users className="w-4 h-4" />}
              >
                Elever
              </AdminButton>
            </Link>
            <Link href="/admin/bookinger/ny">
              <AdminButton
                variant="primary"
                icon={<Calendar className="w-4 h-4" />}
              >
                Ny booking
              </AdminButton>
            </Link>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
