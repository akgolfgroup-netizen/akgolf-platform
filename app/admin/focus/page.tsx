"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Circle, CheckCircle2, Clock, TrendingUp, Users, Target } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";

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
    { id: "t1", text: "Ring Maria L. — oppfølging", priority: "urgent" },
    { id: "t2", text: "Oppdater Erik S. pakke", priority: "important" },
    { id: "t3", text: "Forbered TrackMan-rapport", priority: "normal" },
  ],
  junior: [
    { id: "t4", text: "Godkjenn 2 nye påmeldinger", priority: "urgent" },
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

const priorityColors = {
  urgent: "bg-[var(--hg-error)] text-white",
  important: "bg-[var(--hg-warning)] text-[var(--hg-bg)]",
  normal: "bg-[var(--hg-primary)] text-[var(--hg-bg)]",
};

const priorityLabels = {
  urgent: "Haster",
  important: "Viktig",
  normal: "Normal",
};

export default function FocusPage() {
  const [selectedDivision, setSelectedDivision] = useState<"coaching" | "junior" | "gfgk">("coaching");
  const router = useRouter();
  const { toggle } = useMCSidebar();

  const projects = MOCK_PROJECTS[selectedDivision];
  const tasks = MOCK_TASKS[selectedDivision];
  const sessions = MOCK_SESSIONS[selectedDivision];

  return (
    <>
      <MCTopbar
        title="Focus Mode"
        subtitle="Konsentrert visning uten distraksjoner"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Division Selector */}
        <div className="hg-tabs">
          {[
            { id: "coaching", label: "Coaching", icon: Target },
            { id: "junior", label: "Junior", icon: Users },
            { id: "gfgk", label: "GFGK", icon: TrendingUp },
          ].map((div) => (
            <button
              key={div.id}
              onClick={() => setSelectedDivision(div.id as typeof selectedDivision)}
              className={cn("hg-tab flex items-center gap-2", selectedDivision === div.id && "active")}
            >
              <div.icon className="w-4 h-4" />
              {div.label}
            </button>
          ))}
        </div>

        {/* Focus Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Projects Column */}
          <div className="hg-card">
            <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
              <h3 className="hg-section-title">Prosjekter</h3>
              <span className="text-xs text-[var(--hg-text-muted)]">
                {projects.length} aktive
              </span>
            </div>
            <div className="p-4 space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="p-3 rounded-xl bg-[var(--hg-surface-raised)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[var(--hg-text)]">
                      {project.name}
                    </span>
                    <span className="text-xs text-[var(--hg-text-muted)]">
                      {project.dueDate}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--hg-surface)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--hg-primary)] rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-[var(--hg-text-muted)] mt-1">
                    {project.progress}% fullført
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Column */}
          <div className="hg-card">
            <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
              <h3 className="hg-section-title">Oppgaver</h3>
              <span className="text-xs text-[var(--hg-text-muted)]">
                {tasks.length} å gjøre
              </span>
            </div>
            <div className="p-4 space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--hg-surface-raised)] transition-colors cursor-pointer group"
                >
                  <Circle className="w-5 h-5 text-[var(--hg-text-muted)] group-hover:text-[var(--hg-primary)] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[var(--hg-text)]">{task.text}</div>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[10px] font-medium rounded-full flex-shrink-0",
                      priorityColors[task.priority as keyof typeof priorityColors]
                    )}
                  >
                    {priorityLabels[task.priority as keyof typeof priorityLabels]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="hg-card">
            <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
              <h3 className="hg-section-title">I dag</h3>
              <Calendar className="w-4 h-4 text-[var(--hg-text-muted)]" />
            </div>
            <div className="p-4 space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--hg-surface-raised)] transition-colors"
                >
                  <div className="flex items-center justify-center w-14 h-8 bg-[var(--hg-primary)] text-[var(--hg-bg)] rounded-lg text-xs font-semibold">
                    {session.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--hg-text)] truncate">
                      {session.name}
                    </div>
                    <div className="text-xs text-[var(--hg-text-muted)]">{session.type}</div>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-8 text-[var(--hg-text-muted)]">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Ingen økter i dag</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="hg-card p-4">
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="hg-btn hg-btn-secondary">
              Tilbake til Hub
            </Link>
            <Link href="/admin/elever" className="hg-btn hg-btn-secondary">
              <Users className="w-4 h-4" />
              Elever
            </Link>
            <Link href="/admin/bookinger/ny" className="hg-btn hg-btn-primary">
              <Calendar className="w-4 h-4" />
              Ny booking
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
