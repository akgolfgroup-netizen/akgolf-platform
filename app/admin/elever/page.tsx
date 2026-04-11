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
  UserX,
  AlertCircle,
  Phone,
  FileText,
  MessageSquare,
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

// ---------------------------------------------------------------------------
// Mock-data — beholdes intakt frem til vi kobler til ekte data.
// ---------------------------------------------------------------------------

type StudentStatus = "active" | "inactive" | "at-risk";
type TierKey = "elite" | "pro" | "starter" | "junior";

interface MockStudent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  initials: string;
  tier: TierKey;
  status: StudentStatus;
  lastActive: string;
  nextBooking?: string;
  sessionsThisMonth: number;
  handicap?: number;
}

const mockStudents: MockStudent[] = [
  {
    id: "1",
    name: "Olav Hansen",
    email: "olav@example.com",
    phone: "+47 123 45 678",
    initials: "OH",
    tier: "elite",
    status: "active",
    lastActive: "2 timer siden",
    nextBooking: "I morgen 10:00",
    sessionsThisMonth: 8,
    handicap: 15.8,
  },
  {
    id: "2",
    name: "Mari Kristiansen",
    email: "mari@example.com",
    phone: "+47 987 65 432",
    initials: "MK",
    tier: "pro",
    status: "active",
    lastActive: "1 dag siden",
    nextBooking: "Fredag 14:00",
    sessionsThisMonth: 5,
    handicap: 22.1,
  },
  {
    id: "3",
    name: "Erik Johansen",
    email: "erik@example.com",
    initials: "EJ",
    tier: "starter",
    status: "at-risk",
    lastActive: "14 dager siden",
    sessionsThisMonth: 1,
    handicap: 28.4,
  },
  {
    id: "4",
    name: "Sofie Berg",
    email: "sofie@example.com",
    phone: "+47 456 78 910",
    initials: "SB",
    tier: "pro",
    status: "active",
    lastActive: "3 timer siden",
    nextBooking: "I dag 16:00",
    sessionsThisMonth: 6,
    handicap: 18.9,
  },
  {
    id: "5",
    name: "Anders Pettersen",
    email: "anders@example.com",
    initials: "AP",
    tier: "elite",
    status: "inactive",
    lastActive: "2 måneder siden",
    sessionsThisMonth: 0,
    handicap: 12.5,
  },
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

// Sparkline-data — mock trend (nye elever per måned, aktive per dag, osv.)
const TREND_TOTAL = [120, 124, 128, 132, 135, 138, 140, 142];
const TREND_ACTIVE = [110, 115, 118, 122, 124, 126, 127, 128];
const TREND_NEW = [4, 6, 5, 7, 8, 10, 9, 12];
const TREND_AT_RISK = [3, 4, 4, 5, 6, 5, 6, 5];

export default function StudentsPage() {
  const { toggle } = useMCSidebar();
  const [tierFilter, setTierFilter] = useState<"all" | TierKey>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | StudentStatus>("all");
  const [previewStudent, setPreviewStudent] = useState<MockStudent | null>(null);

  const filtered = useMemo(() => {
    return mockStudents.filter((s) => {
      const matchesTier = tierFilter === "all" || s.tier === tierFilter;
      const matchesStatus =
        statusFilter === "all" || s.status === statusFilter;
      return matchesTier && matchesStatus;
    });
  }, [tierFilter, statusFilter]);

  function handleExport(rows: MockStudent[] = filtered) {
    const csv = [
      "Navn,E-post,Telefon,Tier,Status,Sist aktiv",
      ...rows.map(
        (s) =>
          `"${s.name}","${s.email}","${s.phone ?? ""}","${TIER_LABEL[s.tier]}","${STATUS_LABEL[s.status]}","${s.lastActive}"`,
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

  const columns: AdminDataTableColumn<MockStudent>[] = [
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
            {row.initials}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
              {row.name}
            </div>
            <div className="text-xs text-[var(--color-muted)] truncate">
              {row.email}
            </div>
          </div>
        </button>
      ),
    },
    {
      key: "tier",
      label: "Medlemskap",
      sortable: true,
      render: (row) => (
        <AdminBadge variant="info">{TIER_LABEL[row.tier]}</AdminBadge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <AdminBadge variant={STATUS_VARIANT[row.status]}>
          {STATUS_LABEL[row.status]}
        </AdminBadge>
      ),
    },
    {
      key: "handicap",
      label: "HCP",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="tabular-nums text-[var(--color-text)]">
          {row.handicap ?? "—"}
        </span>
      ),
    },
    {
      key: "sessionsThisMonth",
      label: "Økter/mnd",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="tabular-nums text-[var(--color-text)]">
          {row.sessionsThisMonth}
        </span>
      ),
    },
    {
      key: "lastActive",
      label: "Sist aktiv",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-[var(--color-muted)]">
          {row.lastActive}
        </span>
      ),
    },
    {
      key: "nextBooking",
      label: "Neste booking",
      sortable: false,
      render: (row) =>
        row.nextBooking ? (
          <span className="text-sm text-[var(--color-text)]">
            {row.nextBooking}
          </span>
        ) : (
          <span className="text-[var(--color-muted)]">—</span>
        ),
    },
  ];

  const bulkActions: AdminDataTableBulkAction<MockStudent>[] = [
    {
      label: "Send e-post",
      variant: "primary",
      action: (rows) => {
        const emails = rows.map((r) => r.email).join(",");
        window.location.href = `mailto:${emails}`;
      },
    },
    {
      label: "Eksporter valgte",
      variant: "secondary",
      action: (rows) => handleExport(rows),
    },
  ];

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
                    onSelect: () => handleExport(mockStudents),
                  },
                  {
                    id: "mail-all",
                    label: "Send e-post til alle aktive",
                    icon: <Mail className="w-4 h-4" />,
                    onSelect: () => {
                      const active = mockStudents
                        .filter((s) => s.status === "active")
                        .map((s) => s.email)
                        .join(",");
                      window.location.href = `mailto:${active}`;
                    },
                  },
                  {
                    id: "deactivate",
                    label: "Deaktiver inaktive",
                    icon: <UserX className="w-4 h-4" />,
                    variant: "danger",
                    onSelect: () => {
                      /* placeholder */
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

        {/* Stats med sparklines */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Totalt"
            value={142}
            icon={<Users className="w-5 h-5" />}
            sparkline={TREND_TOTAL}
          />
          <AdminStatCard
            label="Aktive"
            value={128}
            icon={<UserCheck className="w-5 h-5" />}
            change={{ value: 4, positive: true }}
            sparkline={TREND_ACTIVE}
          />
          <AdminStatCard
            label="Nye denne måneden"
            value={12}
            icon={<UserPlus className="w-5 h-5" />}
            change={{ value: 20, positive: true }}
            sparkline={TREND_NEW}
          />
          <AdminStatCard
            label="Trenger oppfølging"
            value={5}
            icon={<AlertCircle className="w-5 h-5" />}
            sparkline={TREND_AT_RISK}
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
                  { label: "Oppfølging", value: "at-risk" as const },
                ]
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
              {(
                [
                  { label: "Alle", value: "all" as const },
                  { label: "Elite", value: "elite" as const },
                  { label: "Pro", value: "pro" as const },
                  { label: "Starter", value: "starter" as const },
                  { label: "Junior", value: "junior" as const },
                ]
              ).map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setTierFilter(f.value)}
                  className={
                    tierFilter === f.value
                      ? "px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-primary)] text-white"
                      : "px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </AdminCard>

        {/* DataTable */}
        <AdminDataTable<MockStudent>
          columns={columns}
          data={filtered}
          searchable
          searchPlaceholder="Søk etter navn eller e-post..."
          pagination={{ pageSize: 10 }}
          bulkActions={bulkActions}
          emptyMessage="Ingen elever funnet. Prøv å justere filter."
        />
      </div>

      {/* Drawer — hurtigvisning av elev */}
      <AdminDrawer
        open={previewStudent !== null}
        onClose={() => setPreviewStudent(null)}
        title={previewStudent?.name}
        description={previewStudent?.email}
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
                  Åpne profil
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
                {previewStudent.initials}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <AdminBadge variant="info">
                    {TIER_LABEL[previewStudent.tier]}
                  </AdminBadge>
                  <AdminBadge variant={STATUS_VARIANT[previewStudent.status]}>
                    {STATUS_LABEL[previewStudent.status]}
                  </AdminBadge>
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
                value={previewStudent.handicap ?? "—"}
              />
              <AdminStatCard
                label="Økter denne mnd"
                value={previewStudent.sessionsThisMonth}
              />
              <AdminStatCard label="Sist aktiv" value={previewStudent.lastActive} />
            </div>

            <AdminCard>
              <h4 className="admin-section-title mb-2">Neste booking</h4>
              {previewStudent.nextBooking ? (
                <div className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                  <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                  {previewStudent.nextBooking}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-muted)]">
                  Ingen kommende bookinger.
                </p>
              )}
            </AdminCard>
          </div>
        )}
      </AdminDrawer>
    </>
  );
}
