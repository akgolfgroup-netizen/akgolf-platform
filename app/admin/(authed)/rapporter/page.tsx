"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Mail,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Plus,
  MoreHorizontal,
  FileSpreadsheet,
  FileType,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminSelect,
  AdminInput,
  AdminPageHeader,
  AdminDataTable,
  AdminDropdown,
  AdminDialog,
  AdminDateRangePicker,
  AdminBadge,
  type AdminDataTableColumn,
  type AdminDateRange,
  type AdminDropdownItem,
} from "@/components/portal/mission-control/ui";

// ─── Typer ───

type ReportTypeId = "monthly" | "students" | "financial" | "capacity";

interface ReportType {
  id: ReportTypeId;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  colorVar: string;
  lastGenerated: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  recipients: string;
  nextRun: string;
  active: boolean;
}

interface RecentReportRow {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  size: string;
}

// ─── Mock data ───

const reportTypes: ReportType[] = [
  {
    id: "monthly",
    name: "Månedsrapport",
    description: "Oversikt over omsetning, elever og aktivitet",
    icon: Calendar,
    colorVar: "var(--color-primary)",
    lastGenerated: "1. april 2024",
  },
  {
    id: "students",
    name: "Elev-statistikk",
    description: "Detaljert analyse av elevaktivitet og fremgang",
    icon: Users,
    colorVar: "var(--color-success)",
    lastGenerated: "5. april 2024",
  },
  {
    id: "financial",
    name: "Økonomisk rapport",
    description: "Inntekter, utgifter og lønnsomhet",
    icon: DollarSign,
    colorVar: "var(--color-accent-cta)",
    lastGenerated: "1. april 2024",
  },
  {
    id: "capacity",
    name: "Kapasitetsrapport",
    description: "Utnyttelse og booking-trender",
    icon: TrendingUp,
    colorVar: "var(--color-warning)",
    lastGenerated: "3. april 2024",
  },
];

const scheduledReports: ScheduledReport[] = [
  {
    id: "1",
    name: "Månedsrapport",
    frequency: "Månedlig",
    recipients: "anders@akgolf.no",
    nextRun: "1. mai 2024",
    active: true,
  },
  {
    id: "2",
    name: "Ukentlig oppsummering",
    frequency: "Ukentlig",
    recipients: "anders@akgolf.no",
    nextRun: "8. april 2024",
    active: true,
  },
];

const recentReports: RecentReportRow[] = [
  {
    id: "1",
    name: "Månedsrapport - Mars 2024",
    type: "Månedlig",
    generatedAt: "1. april 2024",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Elev-statistikk Q1",
    type: "Kvartalsvis",
    generatedAt: "28. mars 2024",
    size: "1.8 MB",
  },
  {
    id: "3",
    name: "Årsrapport 2023",
    type: "Årlig",
    generatedAt: "5. januar 2024",
    size: "5.2 MB",
  },
  {
    id: "4",
    name: "Kapasitetsrapport - Mars",
    type: "Månedlig",
    generatedAt: "2. april 2024",
    size: "1.1 MB",
  },
  {
    id: "5",
    name: "Økonomirapport Q1 2024",
    type: "Kvartalsvis",
    generatedAt: "3. april 2024",
    size: "3.7 MB",
  },
];

const exportFormats = ["PDF", "Excel", "CSV"] as const;
type ExportFormat = (typeof exportFormats)[number];

export default function RapporterPage() {
  const { toggle } = useMCSidebar();
  const [selectedReport, setSelectedReport] = useState<ReportTypeId | null>(
    null,
  );
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("PDF");
  const [generateType, setGenerateType] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogRange, setDialogRange] = useState<AdminDateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 29)),
    to: new Date(),
  });

  // ── Tabell-kolonner for nylig genererte rapporter ─────────────────────────

  const recentColumns: AdminDataTableColumn<RecentReportRow>[] = [
    {
      key: "name",
      label: "Navn",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--color-grey-100)]">
            <FileText className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <span className="font-medium text-[var(--color-text)]">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (row) => <AdminBadge variant="info">{row.type}</AdminBadge>,
    },
    {
      key: "generatedAt",
      label: "Generert",
      sortable: true,
    },
    {
      key: "size",
      label: "Størrelse",
      sortable: true,
      align: "right",
    },
    {
      key: "id",
      label: "",
      align: "right",
      render: (row) => (
        <AdminDropdown
          align="right"
          trigger={
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-[var(--color-grey-100)] text-[var(--color-muted)] transition-colors"
              aria-label={`Handlinger for ${row.name}`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
          items={[
            {
              id: "pdf",
              label: "Last ned som PDF",
              icon: <FileType className="w-4 h-4" />,
              onSelect: () => console.log("PDF", row.id),
            },
            {
              id: "excel",
              label: "Last ned som Excel",
              icon: <FileSpreadsheet className="w-4 h-4" />,
              onSelect: () => console.log("Excel", row.id),
            },
            {
              id: "csv",
              label: "Last ned som CSV",
              icon: <FileText className="w-4 h-4" />,
              onSelect: () => console.log("CSV", row.id),
            },
            {
              id: "email",
              label: "Send på e-post",
              icon: <Mail className="w-4 h-4" />,
              onSelect: () => console.log("Email", row.id),
            },
            {
              id: "delete",
              label: "Slett",
              variant: "danger",
              onSelect: () => console.log("Delete", row.id),
            },
          ] satisfies AdminDropdownItem[]}
        />
      ),
    },
  ];

  return (
    <>
      <MCTopbar
        title="Rapporter"
        subtitle="Generer og eksporter rapporter"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Rapporter"
          subtitle="Generer, planlegg og last ned rapporter fra akademiet"
          actions={
            <AdminButton
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setDialogOpen(true)}
            >
              Ny rapport
            </AdminButton>
          }
        />

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isSelected = selectedReport === report.id;
            return (
              <AdminCard
                key={report.id}
                hover
                onClick={() => setSelectedReport(report.id)}
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected &&
                    "ring-2 ring-[var(--color-primary)] border-[var(--color-primary)]",
                )}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${report.colorVar}1A` }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: report.colorVar }}
                  />
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
                  {report.name}
                </h3>
                <p className="text-xs text-[var(--color-muted)] mb-3">
                  {report.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--color-muted)]">
                    Sist: {report.lastGenerated}
                  </span>
                  <AdminDropdown
                    label="Eksporter"
                    align="right"
                    trigger={
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-md hover:bg-[var(--color-grey-100)] text-[var(--color-primary)] transition-colors"
                        aria-label={`Last ned ${report.name}`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      {
                        id: "pdf",
                        label: "PDF",
                        icon: <FileType className="w-4 h-4" />,
                        onSelect: () => console.log("pdf", report.id),
                      },
                      {
                        id: "excel",
                        label: "Excel",
                        icon: <FileSpreadsheet className="w-4 h-4" />,
                        onSelect: () => console.log("excel", report.id),
                      },
                      {
                        id: "csv",
                        label: "CSV",
                        icon: <FileText className="w-4 h-4" />,
                        onSelect: () => console.log("csv", report.id),
                      },
                    ]}
                  />
                </div>
              </AdminCard>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generate Report */}
          <AdminCard>
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">
              Generer ny rapport
            </h3>
            <div className="space-y-4">
              <AdminSelect
                label="Rapporttype"
                value={generateType}
                onChange={(e) => setGenerateType(e.target.value)}
              >
                <option value="">Velg rapport...</option>
                {reportTypes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </AdminSelect>
              <div>
                <label className="admin-label block mb-1.5">
                  Rapportperiode
                </label>
                <AdminDateRangePicker
                  value={dialogRange}
                  onChange={setDialogRange}
                />
              </div>
              <div>
                <label className="admin-label block mb-1.5">Format</label>
                <div className="flex gap-2">
                  {exportFormats.map((fmt) => {
                    const isActive = selectedFormat === fmt;
                    return (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setSelectedFormat(fmt)}
                        className={cn(
                          "flex-1 py-2 text-xs font-medium rounded-lg border transition-colors",
                          isActive
                            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                            : "bg-white text-[var(--color-text)] border-[var(--color-grey-200)] hover:bg-[var(--color-grey-100)]",
                        )}
                      >
                        {fmt}
                      </button>
                    );
                  })}
                </div>
              </div>
              <AdminButton
                variant="primary"
                icon={<FileText className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Generer rapport
              </AdminButton>
            </div>
          </AdminCard>

          {/* Scheduled Reports */}
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-grey-200)] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Automatiske rapporter
              </h3>
              <button
                type="button"
                className="p-1.5 rounded-md hover:bg-[var(--color-grey-100)] text-[var(--color-muted)] transition-colors"
                aria-label="Legg til automatisk rapport"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-[var(--color-grey-200)]">
              {scheduledReports.map((report) => (
                <div key={report.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-[var(--color-text)]">
                        {report.name}
                      </h4>
                      <p className="text-xs text-[var(--color-muted)]">
                        {report.frequency}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5",
                        report.active
                          ? "bg-[var(--color-success)]"
                          : "bg-[var(--color-muted)]",
                      )}
                      aria-label={report.active ? "Aktiv" : "Inaktiv"}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {report.recipients}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Neste: {report.nextRun}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* Nylig genererte rapporter — DataTable */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Nylig genererte rapporter
            </h3>
            <span className="text-xs text-[var(--color-muted)]">
              {recentReports.length} rapporter
            </span>
          </div>
          <AdminDataTable<RecentReportRow>
            columns={recentColumns}
            data={recentReports}
            searchable
            searchPlaceholder="Søk i rapporter..."
            pagination={{ pageSize: 10 }}
            emptyMessage="Ingen rapporter ennå."
          />
        </div>
      </div>

      {/* Dialog: Ny rapport */}
      <AdminDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Generer ny rapport"
        description="Velg rapporttype, periode og format."
        size="md"
        footer={
          <>
            <AdminButton
              variant="secondary"
              onClick={() => setDialogOpen(false)}
            >
              Avbryt
            </AdminButton>
            <AdminButton
              variant="primary"
              icon={<FileText className="w-4 h-4" />}
              onClick={() => setDialogOpen(false)}
            >
              Generer
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminSelect
            label="Rapporttype"
            value={generateType}
            onChange={(e) => setGenerateType(e.target.value)}
          >
            <option value="">Velg rapport...</option>
            {reportTypes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </AdminSelect>
          <div>
            <label className="admin-label block mb-1.5">Rapportperiode</label>
            <AdminDateRangePicker
              value={dialogRange}
              onChange={setDialogRange}
            />
          </div>
          <AdminInput label="Tittel (valgfritt)" placeholder="f.eks. Mars 2024" />
          <div>
            <label className="admin-label block mb-1.5">Format</label>
            <div className="flex gap-2">
              {exportFormats.map((fmt) => {
                const isActive = selectedFormat === fmt;
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelectedFormat(fmt)}
                    className={cn(
                      "flex-1 py-2 text-xs font-medium rounded-lg border transition-colors",
                      isActive
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                        : "bg-white text-[var(--color-text)] border-[var(--color-grey-200)] hover:bg-[var(--color-grey-100)]",
                    )}
                  >
                    {fmt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </AdminDialog>
    </>
  );
}
