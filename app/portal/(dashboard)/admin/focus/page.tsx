"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Circle } from "lucide-react";
import {
  MCTopbar,
  MCModeToggle,
  MCCard,
  MCCardHeader,
  MCCardTitle,
  MCCardBody,
  DivisionTabs,
  useMCSidebar,
  type Division,
} from "@/components/portal/mission-control";

// Mock data - in production, this would come from Notion API
const MOCK_PROJECTS = {
  coaching: [
    {
      id: "1",
      name: "Performance Pro Launch",
      progress: 75,
      dueDate: "15. apr",
    },
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

const priorityColors = {
  urgent: "bg-[#D14343] text-white",
  important: "bg-[#FF9500] text-white",
  normal: "bg-[#2D6A4F] text-white",
};

export default function FocusPage() {
  const [selectedDivision, setSelectedDivision] = useState<Division>("coaching");
  const router = useRouter();
  const { toggle } = useMCSidebar();

  const projects = MOCK_PROJECTS[selectedDivision];
  const tasks = MOCK_TASKS[selectedDivision];
  const sessions = MOCK_SESSIONS[selectedDivision];

  return (
    <>
      <MCTopbar
        title="Hub — Focus"
        subtitle="Konsentrert visning"
        onMenuClick={toggle}
        notificationCount={3}
      >
        <Link href="/portal/admin">
          <MCModeToggle
            activeMode="focus"
            onModeChange={(mode) => {
              if (mode === "oversikt") {
                router.push("/portal/admin");
              }
            }}
          />
        </Link>
      </MCTopbar>

      {/* Division Selector */}
      <div className="bg-white px-5 py-3 border-b border-[#E8E8ED]">
        <DivisionTabs
          selected={selectedDivision}
          onChange={setSelectedDivision}
        />
      </div>

      {/* Focus Content */}
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Projects Column */}
          <MCCard>
            <MCCardHeader>
              <MCCardTitle>Prosjekter</MCCardTitle>
              <span className="text-[10px] text-[#86868B]">
                {projects.length} aktive
              </span>
            </MCCardHeader>
            <MCCardBody className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="p-3 bg-[#F5F5F7] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-[#1D1D1F]">
                      {project.name}
                    </span>
                    <span className="text-[9px] text-[#86868B]">
                      {project.dueDate}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-[#E8E8ED] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2D6A4F] rounded-full transition-[width]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-[#86868B] mt-1">
                    {project.progress}% fullfort
                  </div>
                </div>
              ))}
            </MCCardBody>
          </MCCard>

          {/* Tasks Column */}
          <MCCard>
            <MCCardHeader>
              <MCCardTitle>Oppgaver</MCCardTitle>
              <span className="text-[10px] text-[#86868B]">
                {tasks.length} a gjore
              </span>
            </MCCardHeader>
            <MCCardBody className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-2 p-2 hover:bg-[#F5F5F7] rounded-lg transition-colors cursor-pointer"
                >
                  <Circle className="w-4 h-4 text-[#86868B] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-[#1D1D1F]">{task.text}</div>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 text-[8px] font-medium rounded ${
                      priorityColors[task.priority as keyof typeof priorityColors]
                    }`}
                  >
                    {task.priority === "urgent"
                      ? "Haster"
                      : task.priority === "important"
                      ? "Viktig"
                      : "Normal"}
                  </span>
                </div>
              ))}
            </MCCardBody>
          </MCCard>

          {/* Today's Schedule */}
          <MCCard>
            <MCCardHeader>
              <MCCardTitle>I dag</MCCardTitle>
              <Calendar className="w-4 h-4 text-[#86868B]" />
            </MCCardHeader>
            <MCCardBody className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-3 p-2 hover:bg-[#F5F5F7] rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-center w-12 h-8 bg-[#1D1D1F] text-white rounded text-[10px] font-semibold">
                    {session.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-[#1D1D1F] truncate">
                      {session.name}
                    </div>
                    <div className="text-[9px] text-[#86868B]">{session.type}</div>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-[10px] text-[#86868B] text-center py-4">
                  Ingen okter i dag
                </div>
              )}
            </MCCardBody>
          </MCCard>
        </div>
      </div>
    </>
  );
}
