"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  UserPlus,
  ChevronDown,
  Mail,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar, HGStudentListItem } from "@/components/portal/mission-control";

// Mock data - replace with actual data fetching
const mockStudents = [
  {
    id: "1",
    name: "Olav Hansen",
    email: "olav@example.com",
    initials: "OH",
    tags: [
      { label: "Elite", variant: "primary" as const },
      { label: "Coaching", variant: "default" as const },
    ],
    status: "active" as const,
    lastActive: "2 timer siden",
    nextBooking: "I morgen 10:00",
  },
  {
    id: "2",
    name: "Mari Kristiansen",
    email: "mari@example.com",
    initials: "MK",
    tags: [
      { label: "Pro", variant: "success" as const },
      { label: "Junior", variant: "default" as const },
    ],
    status: "active" as const,
    lastActive: "1 dag siden",
    nextBooking: "Fredag 14:00",
  },
  {
    id: "3",
    name: "Erik Johansen",
    email: "erik@example.com",
    initials: "EJ",
    tags: [
      { label: "Starter", variant: "warning" as const },
    ],
    status: "at-risk" as const,
    lastActive: "14 dager siden",
    nextBooking: undefined,
  },
  {
    id: "4",
    name: "Sofie Berg",
    email: "sofie@example.com",
    initials: "SB",
    tags: [
      { label: "Pro", variant: "success" as const },
    ],
    status: "active" as const,
    lastActive: "3 timer siden",
    nextBooking: "I dag 16:00",
  },
  {
    id: "5",
    name: "Anders Pettersen",
    email: "anders@example.com",
    initials: "AP",
    tags: [
      { label: "Elite", variant: "primary" as const },
      { label: "Coaching", variant: "default" as const },
    ],
    status: "inactive" as const,
    lastActive: "2 måneder siden",
    nextBooking: undefined,
  },
];

const filters = [
  { label: "Alle", value: "all", count: 142 },
  { label: "Aktive", value: "active", count: 128 },
  { label: "Inaktive", value: "inactive", count: 14 },
  { label: "Trenger oppfølging", value: "at-risk", count: 5 },
];

const subscriptionFilters = [
  { label: "Alle typer", value: "all" },
  { label: "Elite", value: "elite" },
  { label: "Pro", value: "pro" },
  { label: "Starter", value: "starter" },
  { label: "Junior", value: "junior" },
];

export default function StudentsPage() {
  const { toggle } = useMCSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSubFilter, setActiveSubFilter] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  function handleExport() {
    const csv = [
      "Navn,E-post,Status,Sist aktiv",
      ...filteredStudents.map((s) => `"${s.name}","${s.email}","${s.status}","${s.lastActive}"`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elever-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || student.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedStudents(newSelection);
  };

  return (
    <>
      <MCTopbar
        title="Elever"
        subtitle="Administrer medlemskap og coaching-historikk"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="hg-card p-4">
            <span className="hg-label">Totalt</span>
            <span className="text-2xl font-bold text-[var(--hg-text)] tabular-nums block mt-1">142</span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Aktive</span>
            <span className="text-2xl font-bold text-[var(--hg-success)] tabular-nums block mt-1">128</span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Nye denne måned</span>
            <span className="text-2xl font-bold text-[var(--hg-primary)] tabular-nums block mt-1">12</span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Trenger oppfølging</span>
            <span className="text-2xl font-bold text-[var(--hg-warning)] tabular-nums block mt-1">5</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="hg-card p-4 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg px-3 py-2.5 focus-within:border-[var(--hg-primary)] focus-within:shadow-[0_0_0_3px_var(--hg-primary-glow)] transition-all">
              <Search className="w-4 h-4 text-[var(--hg-text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Søk etter navn, e-post..."
                className="flex-1 bg-transparent text-sm text-[var(--hg-text)] placeholder:text-[var(--hg-text-muted)] outline-none"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative group">
              <button className="hg-btn hg-btn-secondary">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={handleExport} className="hg-btn hg-btn-secondary">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Eksporter</span>
              </button>
              <Link href="/admin/elever/ny" className="hg-btn hg-btn-primary">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Ny elev</span>
              </Link>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                  activeFilter === filter.value
                    ? "bg-[var(--hg-primary)] text-[var(--hg-bg)]"
                    : "bg-[var(--hg-surface-raised)] text-[var(--hg-text-secondary)] hover:text-[var(--hg-text)]"
                )}
              >
                {filter.label}
                <span className="ml-1.5 opacity-60">({filter.count})</span>
              </button>
            ))}
          </div>

          {/* Subscription Filters */}
          <div className="flex flex-wrap gap-2">
            {subscriptionFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveSubFilter(filter.value)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors border",
                  activeSubFilter === filter.value
                    ? "border-[var(--hg-primary)] text-[var(--hg-primary)] bg-[var(--hg-primary-glow)]"
                    : "border-[var(--hg-border)] text-[var(--hg-text-muted)] hover:border-[var(--hg-border-hover)]"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions (when selections exist) */}
        {selectedStudents.size > 0 && (
          <div className="hg-card p-3 flex items-center justify-between bg-[var(--hg-primary-glow)] border-[var(--hg-primary)]">
            <span className="text-sm text-[var(--hg-primary)]">
              {selectedStudents.size} elev{selectedStudents.size !== 1 ? "er" : ""} valgt
            </span>
            <div className="flex gap-2">
              <button className="hg-btn hg-btn-ghost text-[var(--hg-primary)]">
                <Mail className="w-4 h-4" />
                Send e-post
              </button>
              <button className="hg-btn hg-btn-ghost text-[var(--hg-primary)]">
                <Calendar className="w-4 h-4" />
                Book for
              </button>
            </div>
          </div>
        )}

        {/* Student List */}
        <div className="hg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
            <h3 className="hg-section-title">
              {filteredStudents.length} elev{filteredStudents.length !== 1 ? "er" : ""}
            </h3>
            <button className="p-1.5 rounded-md hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-[var(--hg-border-subtle)]">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center px-4">
                <input
                  type="checkbox"
                  checked={selectedStudents.has(student.id)}
                  onChange={() => toggleSelection(student.id)}
                  className="w-4 h-4 rounded border-[var(--hg-border)] bg-[var(--hg-surface)] text-[var(--hg-primary)] focus:ring-[var(--hg-primary)] focus:ring-offset-0 mr-3"
                />
                <div className="flex-1">
                  <HGStudentListItem {...student} />
                </div>
              </div>
            ))}
          </div>
          {filteredStudents.length === 0 && (
            <div className="py-12 text-center">
              <span className="text-sm text-[var(--hg-text-muted)]">
                Ingen elever funnet
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
