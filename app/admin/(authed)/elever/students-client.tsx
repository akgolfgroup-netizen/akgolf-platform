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
  AdminStatCard,
  AdminPageHeader,
  AdminDataTable,
  AdminDrawer,
  AdminDropdown,
  type AdminDataTableColumn,
  type AdminDataTableBulkAction,
} from "@/components/portal/mission-control/ui";
import { Button, Badge } from "@/components/ui";
import { type StudentListData, type StudentRow } from "./actions";

import { MonoLabel } from "@/components/portal/patterns";
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
          <div className="w-9 h-9 rounded-full bg-grey-50 text-black flex items-center justify-center text-xs font-semibold border border-grey-200">
            {getInitials(row.name)}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-black group-hover:text-grey-400 transition-colors">
              {row.name ?? "Uten navn"}
            </div>
            <div className="text-xs text-grey-400 truncate">
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
        <Badge variant="info">
          {TIER_LABEL[row.subscriptionTier] ?? row.subscriptionTier}
        </Badge>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (row) => {
        const status = getStatus(row);
        return (
          <Badge variant={STATUS_VARIANT[status]}>
            {STATUS_LABEL[status]}
          </Badge>
        );
      },
    },
    {
      key: "handicap",
      label: "HCP",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="tabular-nums text-black">
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
        <span className="tabular-nums font-semibold text-black">
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
        <span className="tabular-nums text-black">
          {row.sessionsThisMonth}
        </span>
      ),
    },
    {
      key: "lastActiveAt",
      label: "Sist aktiv",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-grey-400">
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
          <span className="text-sm text-text">
            {formatFutureDate(row.nextBookingDate)}
          </span>
        ) : (
          <span className="text-grey-300">—</span>
        ),
    },
    {
      key: "hasActivePlan",
      label: "Plan",
      sortable: false,
      align: "center",
      render: (row) =>
        row.hasActivePlan ? (
          <CheckCircle className="w-4 h-4 text-success-text mx-auto" />
        ) : (
          <XCircle className="w-4 h-4 text-grey-200 mx-auto" />
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
            sparklineColor="#C48A32"
          />
        </div>

        {/* Filter-chips - bg-white rounded-xl shadow-card pattern */}
        <div className="bg-white rounded-xl border border-grey-200 p-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <MonoLabel size="xs" uppercase className="text-grey-400 mr-2">Status</MonoLabel>
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
                      ? "px-3 py-1 text-xs font-medium rounded-full bg-black text-white"
                      : "px-3 py-1 text-xs font-medium rounded-full bg-grey-50 text-grey-500 hover:text-black hover:bg-grey-100 transition-colors"
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <MonoLabel size="xs" uppercase className="text-grey-400 mr-2">Medlemskap</MonoLabel>
              <button
                type="button"
                onClick={() => setTierFilter("all")}
                className={
                  tierFilter === "all"
                    ? "px-3 py-1 text-xs font-medium rounded-full bg-black text-white"
                    : "px-3 py-1 text-xs font-medium rounded-full bg-grey-50 text-grey-500 hover:text-black hover:bg-grey-100 transition-colors"
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
                      ? "px-3 py-1 text-xs font-medium rounded-full bg-black text-white"
                      : "px-3 py-1 text-xs font-medium rounded-full bg-grey-50 text-grey-500 hover:text-black hover:bg-grey-100 transition-colors"
                  }
                >
                  {TIER_LABEL[tier] ?? tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DataTable - bg-white rounded-xl shadow-card wrapper */}
        <div className="bg-white rounded-xl border border-grey-200 overflow-hidden">
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
              <Button variant="secondary">
                <MessageSquare className="w-4 h-4" />
                Send melding
              </Button>
              <Link href={`/admin/elever/${previewStudent.id}`}>
                <Button variant="accent">
                  <FileText className="w-4 h-4" />
                  Apne profil
                </Button>
              </Link>
            </div>
          )
        }
      >
        {previewStudent && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-grey-50 text-black flex items-center justify-center text-lg font-semibold border border-grey-200">
                {getInitials(previewStudent.name)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="info">
                    {TIER_LABEL[previewStudent.subscriptionTier] ?? previewStudent.subscriptionTier}
                  </Badge>
                  <Badge variant={STATUS_VARIANT[getStatus(previewStudent)]}>
                    {STATUS_LABEL[getStatus(previewStudent)]}
                  </Badge>
                  {previewStudent.category && (
                    <Badge variant="muted">
                      Kat {previewStudent.category}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1 text-sm text-grey-400">
                  <a
                    href={`mailto:${previewStudent.email}`}
                    className="flex items-center gap-1.5 hover:text-black transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {previewStudent.email}
                  </a>
                  {previewStudent.phone && (
                    <a
                      href={`tel:${previewStudent.phone}`}
                      className="flex items-center gap-1.5 hover:text-black transition-colors"
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

            <div className="bg-grey-50 rounded-lg p-4 border border-grey-100">
              <h4 className="text-sm font-semibold text-black mb-2">Neste booking</h4>
              {previewStudent.nextBookingDate ? (
                <div className="flex items-center gap-2 text-sm text-text">
                  <Calendar className="w-4 h-4 text-grey-400" />
                  {new Date(previewStudent.nextBookingDate).toLocaleDateString(
                    "nb-NO",
                    { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" },
                  )}
                </div>
              ) : (
                <p className="text-sm text-grey-400">
                  Ingen kommende bookinger.
                </p>
              )}
            </div>

            <div className="bg-grey-50 rounded-lg p-4 border border-grey-100">
              <h4 className="text-sm font-semibold text-black mb-2">Treningsplan</h4>
              {previewStudent.hasActivePlan ? (
                <div className="flex items-center gap-2 text-sm text-success-text">
                  <CheckCircle className="w-4 h-4" />
                  Aktiv treningsplan
                </div>
              ) : (
                <p className="text-sm text-grey-400">
                  Ingen aktiv treningsplan.
                </p>
              )}
            </div>
          </div>
        )}
      </AdminDrawer>
    </>
  );
}
