"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  UserPlus,
  Mail,
  Calendar,
  Users,
  UserCheck,
  UserX,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminBadge,
  AdminTable,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableHeaderCell,
  AdminTableCell,
  AdminStatCard,
  AdminPageHeader,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";

// Mock data - replace with actual data fetching
type StudentStatus = "active" | "inactive" | "at-risk";
type TierKey = "elite" | "pro" | "starter" | "junior";

interface MockStudent {
  id: string;
  name: string;
  email: string;
  initials: string;
  tier: TierKey;
  status: StudentStatus;
  lastActive: string;
  nextBooking?: string;
}

const mockStudents: MockStudent[] = [
  {
    id: "1",
    name: "Olav Hansen",
    email: "olav@example.com",
    initials: "OH",
    tier: "elite",
    status: "active",
    lastActive: "2 timer siden",
    nextBooking: "I morgen 10:00",
  },
  {
    id: "2",
    name: "Mari Kristiansen",
    email: "mari@example.com",
    initials: "MK",
    tier: "pro",
    status: "active",
    lastActive: "1 dag siden",
    nextBooking: "Fredag 14:00",
  },
  {
    id: "3",
    name: "Erik Johansen",
    email: "erik@example.com",
    initials: "EJ",
    tier: "starter",
    status: "at-risk",
    lastActive: "14 dager siden",
  },
  {
    id: "4",
    name: "Sofie Berg",
    email: "sofie@example.com",
    initials: "SB",
    tier: "pro",
    status: "active",
    lastActive: "3 timer siden",
    nextBooking: "I dag 16:00",
  },
  {
    id: "5",
    name: "Anders Pettersen",
    email: "anders@example.com",
    initials: "AP",
    tier: "elite",
    status: "inactive",
    lastActive: "2 måneder siden",
  },
];

const statusFilters: Array<{ label: string; value: "all" | StudentStatus; count: number }> = [
  { label: "Alle", value: "all", count: 142 },
  { label: "Aktive", value: "active", count: 128 },
  { label: "Inaktive", value: "inactive", count: 14 },
  { label: "Trenger oppfølging", value: "at-risk", count: 5 },
];

const tierFilters: Array<{ label: string; value: "all" | TierKey }> = [
  { label: "Alle typer", value: "all" },
  { label: "Elite", value: "elite" },
  { label: "Pro", value: "pro" },
  { label: "Starter", value: "starter" },
  { label: "Junior", value: "junior" },
];

const TIER_LABEL: Record<TierKey, string> = {
  elite: "Elite",
  pro: "Pro",
  starter: "Starter",
  junior: "Junior",
};

const STATUS_LABEL: Record<StudentStatus, string> = {
  active: "Aktiv",
  inactive: "Inaktiv",
  "at-risk": "Oppfølging",
};

const STATUS_VARIANT: Record<StudentStatus, "success" | "muted" | "warning"> = {
  active: "success",
  inactive: "muted",
  "at-risk": "warning",
};

export default function StudentsPage() {
  const { toggle } = useMCSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | StudentStatus>("all");
  const [activeTierFilter, setActiveTierFilter] = useState<"all" | TierKey>(
    "all",
  );
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set(),
  );

  const filteredStudents = mockStudents.filter((student) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      student.name.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q);
    const matchesStatus =
      activeFilter === "all" || student.status === activeFilter;
    const matchesTier =
      activeTierFilter === "all" || student.tier === activeTierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

  function handleExport() {
    const csv = [
      "Navn,E-post,Status,Sist aktiv",
      ...filteredStudents.map(
        (s) =>
          `"${s.name}","${s.email}","${STATUS_LABEL[s.status]}","${s.lastActive}"`,
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elever-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleSelection(id: string) {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.id)));
    }
  }

  return (
    <>
      <MCTopbar
        title="Elever"
        subtitle="Administrer medlemskap og coaching-historikk"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Elever"
          subtitle="Oversikt over aktive elever, medlemskap og coaching"
          actions={
            <>
              <AdminButton
                variant="secondary"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExport}
              >
                Eksporter
              </AdminButton>
              <Link href="/admin/elever/ny">
                <AdminButton
                  variant="primary"
                  icon={<UserPlus className="w-4 h-4" />}
                >
                  Ny elev
                </AdminButton>
              </Link>
            </>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Totalt"
            value={142}
            icon={<Users className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Aktive"
            value={128}
            icon={<UserCheck className="w-5 h-5" />}
            change={{ value: 4, positive: true }}
          />
          <AdminStatCard
            label="Nye denne måneden"
            value={12}
            icon={<UserPlus className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Trenger oppfølging"
            value={5}
            icon={<AlertCircle className="w-5 h-5" />}
          />
        </div>

        {/* Filters & Search */}
        <AdminCard>
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
                <AdminInput
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Søk etter navn eller e-post..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border",
                    activeFilter === filter.value
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                      : "bg-white border-[var(--color-grey-200)] text-[var(--color-text)] hover:bg-[var(--color-grey-100)]",
                  )}
                >
                  {filter.label}
                  <span className="ml-1.5 opacity-70">({filter.count})</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {tierFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveTierFilter(filter.value)}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors border",
                    activeTierFilter === filter.value
                      ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5"
                      : "border-[var(--color-grey-200)] text-[var(--color-muted)] hover:border-[var(--color-grey-300)]",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </AdminCard>

        {/* Bulk Actions */}
        {selectedStudents.size > 0 && (
          <AdminCard className="border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-primary)]">
                {selectedStudents.size}{" "}
                {selectedStudents.size === 1 ? "elev" : "elever"} valgt
              </span>
              <div className="flex gap-2">
                <AdminButton
                  variant="ghost"
                  icon={<Mail className="w-4 h-4" />}
                >
                  Send e-post
                </AdminButton>
                <AdminButton
                  variant="ghost"
                  icon={<Calendar className="w-4 h-4" />}
                >
                  Book for
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        )}

        {/* Student Table */}
        {filteredStudents.length === 0 ? (
          <AdminEmptyState
            icon={<Users className="w-6 h-6" />}
            title="Ingen elever funnet"
            description="Prøv å justere søk eller filter for å finne det du leter etter."
          />
        ) : (
          <AdminTable>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableHeaderCell className="w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedStudents.size === filteredStudents.length &&
                      filteredStudents.length > 0
                    }
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-[var(--color-grey-300)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
                  />
                </AdminTableHeaderCell>
                <AdminTableHeaderCell>Navn</AdminTableHeaderCell>
                <AdminTableHeaderCell>Medlemskap</AdminTableHeaderCell>
                <AdminTableHeaderCell>Status</AdminTableHeaderCell>
                <AdminTableHeaderCell>Sist aktiv</AdminTableHeaderCell>
                <AdminTableHeaderCell>Neste booking</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <AdminTableBody>
              {filteredStudents.map((student) => (
                <AdminTableRow
                  key={student.id}
                  className="hover:bg-[var(--color-grey-100)] transition-colors"
                >
                  <AdminTableCell onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => toggleSelection(student.id)}
                      className="w-4 h-4 rounded border-[var(--color-grey-300)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
                    />
                  </AdminTableCell>
                  <AdminTableCell>
                    <Link
                      href={`/admin/elever/${student.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-semibold">
                        {student.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                          {student.name}
                        </div>
                        <div className="text-xs text-[var(--color-muted)] truncate">
                          {student.email}
                        </div>
                      </div>
                    </Link>
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminBadge variant="info">
                      {TIER_LABEL[student.tier]}
                    </AdminBadge>
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminBadge variant={STATUS_VARIANT[student.status]}>
                      {STATUS_LABEL[student.status]}
                    </AdminBadge>
                  </AdminTableCell>
                  <AdminTableCell className="text-sm text-[var(--color-muted)]">
                    {student.lastActive}
                  </AdminTableCell>
                  <AdminTableCell className="text-sm text-[var(--color-text)]">
                    {student.nextBooking ?? (
                      <span className="text-[var(--color-muted)]">—</span>
                    )}
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
        )}
      </div>
    </>
  );
}
