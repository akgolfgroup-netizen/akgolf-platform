"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Download,
  UserPlus,
  Mail,
  Calendar,
  Users,
  UserCheck,
  AlertCircle,
  Phone,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminButton,
  AdminBadge,
  AdminStatCard,
  AdminPageHeader,
  AdminDataTable,
  AdminDrawer,
  AdminDropdown,
  AdminCard,
  type AdminDataTableColumn,
  type AdminDataTableBulkAction,
} from "@/components/portal/mission-control/ui";
import { type StudentListData, type StudentRow } from "./actions";

// ---------------------------------------------------------------------------
// Mappings
// ---------------------------------------------------------------------------

type StudentStatus = "active" | "inactive" | "at-risk";

const TIER_LABEL: Record<string, string> = {
  ELITE: "Elite",
  PRO: "Pro",
  STARTER: "Starter",
  ACADEMY: "Academy",
  VISITOR: "Visitor",
};

const STATUS_LABEL: Record<StudentStatus, string> = {
  active: "Aktiv",
  inactive: "Inaktiv",
  "at-risk": "Oppfolging",
};

const STATUS_VARIANT: Record<StudentStatus, "success" | "muted" | "warning"> = {
  active: "success",
  inactive: "muted",
  "at-risk": "warning",
};

function getStatus(student: StudentRow): StudentStatus {
  if (!student.isActive) return "inactive";
  if (!student.lastActiveAt) return "active";
  const daysSince =
    (Date.now() - new Date(student.lastActiveAt).getTime()) / 86400000;
  if (daysSince > 30) return "at-risk";
  return "active";
}

function getInitials(name: string | null): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 0) return "I dag";
    if (absDays === 1) return "I morgen";
    return `Om ${absDays} dager`;
  }
  if (diffDays === 0) return "I dag";
  if (diffDays === 1) return "I gar";
  if (diffDays < 7) return `${diffDays} dager siden`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} uker siden`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} mnd siden`;
  return `${Math.floor(diffDays / 365)} ar siden`;
}

function formatFutureDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 0) return "—";
  if (diffDays === 0) return "I dag";
  if (diffDays === 1) return "I morgen";

  return date.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  initialData: StudentListData;
}

export function StudentsClient({ initialData }: Props) {
  const { toggle } = useMCSidebar();
  const [data] = useState(initialData);
  const [tierFilter, setTierFilter] = useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | StudentStatus>("all");
  const [previewStudent, setPreviewStudent] = useState<StudentRow | null>(null);

  const filtered = useMemo(() => {
    return data.students.filter((s) => {
      const matchesTier =
        tierFilter === "all" || s.subscriptionTier === tierFilter;
      const matchesStatus =
        statusFilter === "all" || getStatus(s) === statusFilter;
      return matchesTier && matchesStatus;
    });
  }, [data.students, tierFilter, statusFilter]);

  function handleExport(rows: StudentRow[] = filtered) {
    const csv = [
      "Navn,E-post,Telefon,Medlemskap,Status,HCP,Kategori,Sist aktiv",
      ...rows.map(
        (s) =>
          `"${s.name ?? ""}","${s.email ?? ""}","${s.phone ?? ""}","${TIER_LABEL[s.subscriptionTier] ?? s.subscriptionTier}","${STATUS_LABEL[getStatus(s)]}","${s.handicap ?? ""}","${s.category ?? ""}","${s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleDateString("nb-NO") : ""}"`,
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

  // ---------------------------------------------------------------------------
  // Tabellkolonner
  // ---------------------------------------------------------------------------

  const columns: AdminDataTableColumn<StudentRow>[] = [
    {
      key: "name",
      label: "Navn",
      sortable: true,
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPreviewStudent(row);
          }}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-semibold">
            {getInitials(row.name)}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
              {row.name ?? "Uten navn"}
            </div>
            <div className="text-xs text-[var(--color-muted)] truncate">
              {row.email}
            </div>
          </div>
        </button>
      ),
    },
    {
      key: "subscriptionTier",
      label: "Medlemskap",
      sortable: true,
      render: (row) => (
        <AdminBadge variant="info">
          {TIER_LABEL[row.subscriptionTier] ?? row.subscriptionTier}
        </AdminBadge>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (row) => {
        const status = getStatus(row);
        return (
          <AdminBadge variant={STATUS_VARIANT[status]}>
            {STATUS_LABEL[status]}
          </AdminBadge>
        );
      },
    },
    {
      key: "handicap",
      label: "HCP",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="tabular-nums text-[var(--color-text)]">
          {row.handicap !== null ? row.handicap.toFixed(1) : "—"}
        </span>
      ),
    },
    {
      key: "category",
      label: "Kat",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="tabular-nums font-semibold text-[var(--color-text)]">
          {row.category ?? "—"}
        </span>
      ),
    },
    {
      key: "sessionsThisMonth",
      label: "Okter/mnd",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="tabular-nums text-[var(--color-text)]">
          {row.sessionsThisMonth}
        </span>
      ),
    },
    {
      key: "lastActiveAt",
      label: "Sist aktiv",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-[var(--color-muted)]">
          {formatRelativeDate(row.lastActiveAt)}
        </span>
      ),
    },
    {
      key: "nextBookingDate",
      label: "Neste booking",
      sortable: false,
      render: (row) =>
        row.nextBookingDate ? (
          <span className="text-sm text-[var(--color-text)]">
            {formatFutureDate(row.nextBookingDate)}
          </span>
        ) : (
          <span className="text-[var(--color-muted)]">—</span>
        ),
    },
    {
      key: "hasActivePlan",
      label: "Plan",
      sortable: false,
      align: "center",
      render: (row) =>
        row.hasActivePlan ? (
          <CheckCircle className="w-4 h-4 text-[var(--color-success)] mx-auto" />
        ) : (
          <XCircle className="w-4 h-4 text-[var(--color-grey-300)] mx-auto" />
        ),
    },
  ];

  const bulkActions: AdminDataTableBulkAction<StudentRow>[] = [
    {
      label: "Send e-post",
      variant: "primary",
      action: (rows) => {
        const emails = rows.map((r) => r.email).filter(Boolean).join(",");
        window.location.href = `mailto:${emails}`;
      },
    },
    {
      label: "Eksporter valgte",
      variant: "secondary",
      action: (rows) => handleExport(rows),
    },
  ];

  // Unike tiers fra data
  const availableTiers = useMemo(() => {
    const tiers = new Set(data.students.map((s) => s.subscriptionTier));
    return Array.from(tiers).sort();
  }, [data.students]);

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
              <AdminDropdown
                label="Handlinger"
                items={[
                  {
                    id: "export-all",
                    label: "Eksporter alle",
                    icon: <Download className="w-4 h-4" />,
                    onSelect: () => handleExport(data.students),
                  },
                  {
                    id: "mail-all",
                    label: "Send e-post til alle aktive",
                    icon: <Mail className="w-4 h-4" />,
                    onSelect: () => {
                      const active = data.students
                        .filter((s) => getStatus(s) === "active")
                        .map((s) => s.email)
                        .filter(Boolean)
                        .join(",");
                      window.location.href = `mailto:${active}`;
                    },
                  },
                ]}
              />
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
            value={data.stats.total}
            icon={<Users className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Aktive"
            value={data.stats.active}
            icon={<UserCheck className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Nye denne maneden"
            value={data.stats.newThisMonth}
            icon={<UserPlus className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Trenger oppfolging"
            value={data.stats.atRisk}
            icon={<AlertCircle className="w-5 h-5" />}
            sparklineColor="var(--color-warning)"
          />
        </div>

        {/* Filter-chips */}
        <AdminCard>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mr-2">
                Status
              </span>
              {(
                [
                  { label: "Alle", value: "all" as const },
                  { label: "Aktive", value: "active" as const },
                  { label: "Inaktive", value: "inactive" as const },
                  { label: "Oppfolging", value: "at-risk" as const },
                ] satisfies { label: string; value: "all" | StudentStatus }[]
              ).map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setStatusFilter(f.value)}
                  className={
                    statusFilter === f.value
                      ? "px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-primary)] text-white"
                      : "px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] mr-2">
                Medlemskap
              </span>
              <button
                type="button"
                onClick={() => setTierFilter("all")}
                className={
                  tierFilter === "all"
                    ? "px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-primary)] text-white"
                    : "px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                }
              >
                Alle
              </button>
              {availableTiers.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setTierFilter(tier)}
                  className={
                    tierFilter === tier
                      ? "px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-primary)] text-white"
                      : "px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                  }
                >
                  {TIER_LABEL[tier] ?? tier}
                </button>
              ))}
            </div>
          </div>
        </AdminCard>

        {/* DataTable */}
        <AdminDataTable<StudentRow>
          columns={columns}
          data={filtered}
          searchable
          searchPlaceholder="Sok etter navn eller e-post..."
          pagination={{ pageSize: 20 }}
          bulkActions={bulkActions}
          emptyMessage="Ingen elever funnet. Prov a justere filter."
          onRowClick={(row) => setPreviewStudent(row)}
        />
      </div>

      {/* Drawer — hurtigvisning av elev */}
      <AdminDrawer
        open={previewStudent !== null}
        onClose={() => setPreviewStudent(null)}
        title={previewStudent?.name ?? "Elev"}
        description={previewStudent?.email ?? ""}
        width="lg"
        footer={
          previewStudent && (
            <div className="flex items-center justify-end gap-2">
              <AdminButton
                variant="secondary"
                icon={<MessageSquare className="w-4 h-4" />}
              >
                Send melding
              </AdminButton>
              <Link href={`/admin/elever/${previewStudent.id}`}>
                <AdminButton
                  variant="primary"
                  icon={<FileText className="w-4 h-4" />}
                >
                  Apne profil
                </AdminButton>
              </Link>
            </div>
          )
        }
      >
        {previewStudent && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-lg font-semibold">
                {getInitials(previewStudent.name)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <AdminBadge variant="info">
                    {TIER_LABEL[previewStudent.subscriptionTier] ?? previewStudent.subscriptionTier}
                  </AdminBadge>
                  <AdminBadge variant={STATUS_VARIANT[getStatus(previewStudent)]}>
                    {STATUS_LABEL[getStatus(previewStudent)]}
                  </AdminBadge>
                  {previewStudent.category && (
                    <AdminBadge variant="muted">
                      Kat {previewStudent.category}
                    </AdminBadge>
                  )}
                </div>
                <div className="space-y-1 text-sm text-[var(--color-muted)]">
                  <a
                    href={`mailto:${previewStudent.email}`}
                    className="flex items-center gap-1.5 hover:text-[var(--color-primary)]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {previewStudent.email}
                  </a>
                  {previewStudent.phone && (
                    <a
                      href={`tel:${previewStudent.phone}`}
                      className="flex items-center gap-1.5 hover:text-[var(--color-primary)]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {previewStudent.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <AdminStatCard
                label="Handicap"
                value={previewStudent.handicap !== null ? previewStudent.handicap.toFixed(1) : "—"}
              />
              <AdminStatCard
                label="Okter denne mnd"
                value={previewStudent.sessionsThisMonth}
              />
              <AdminStatCard
                label="Sist aktiv"
                value={formatRelativeDate(previewStudent.lastActiveAt)}
              />
            </div>

            <AdminCard>
              <h4 className="admin-section-title mb-2">Neste booking</h4>
              {previewStudent.nextBookingDate ? (
                <div className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                  <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                  {new Date(previewStudent.nextBookingDate).toLocaleDateString(
                    "nb-NO",
                    { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" },
                  )}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-muted)]">
                  Ingen kommende bookinger.
                </p>
              )}
            </AdminCard>

            <AdminCard>
              <h4 className="admin-section-title mb-2">Treningsplan</h4>
              {previewStudent.hasActivePlan ? (
                <div className="flex items-center gap-2 text-sm text-[var(--color-success)]">
                  <CheckCircle className="w-4 h-4" />
                  Aktiv treningsplan
                </div>
              ) : (
                <p className="text-sm text-[var(--color-muted)]">
                  Ingen aktiv treningsplan.
                </p>
              )}
            </AdminCard>
          </div>
        )}
      </AdminDrawer>
    </>
  );
}
