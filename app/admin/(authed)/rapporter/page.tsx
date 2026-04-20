"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";
import { Calendar, TrendingUp, Users, DollarSign, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminSelect,
  AdminInput,
  AdminPageHeader,
  AdminDataTable,
  AdminDropdown,
  AdminDialog,
  AdminDateRangePicker,
  type AdminDataTableColumn,
  type AdminDateRange,
  type AdminDropdownItem,
} from "@/components/portal/mission-control/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  exportBookingsCSV,
  exportRevenueCSV,
  exportStudentsCSV,
} from "./actions";

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

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RapporterPage() {
  const { toggle } = useMCSidebar();
  const [selectedReport, setSelectedReport] = useState<ReportTypeId | null>(
    null,
  );
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("CSV");
  const [generateType, setGenerateType] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [dialogRange, setDialogRange] = useState<AdminDateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 29)),
    to: new Date(),
  });

  function handleExport(type: ReportTypeId) {
    const from = dialogRange.from.toISOString();
    const to = dialogRange.to.toISOString();

    startTransition(async () => {
      let result;
      if (type === "financial") {
        result = await exportRevenueCSV(from, to);
      } else if (type === "students") {
        result = await exportStudentsCSV();
      } else {
        result = await exportBookingsCSV(from, to);
      }
      downloadCsv(result.csv, result.filename);
    });
  }

  function handleGenerate() {
    if (!generateType) return;
    handleExport(generateType as ReportTypeId);
    setDialogOpen(false);
  }

  // ── Tabell-kolonner for nylig genererte rapporter ─────────────────────────

  const recentColumns: AdminDataTableColumn<RecentReportRow>[] = [
    {
      key: "name",
      label: "Navn",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-surface-container">
            <Icon name="description" className="w-4 h-4 text-on-surface-variant/80" />
          </div>
          <span className="font-medium text-on-surface">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (row) => <Badge variant="info">{row.type}</Badge>,
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
              className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant/80 transition-colors"
              aria-label={`Handlinger for ${row.name}`}
            >
              <Icon name="more_horiz" className="w-4 h-4" />
            </button>
          }
          items={[
            {
              id: "excel",
              label: "Last ned som Excel (CSV)",
              icon: <FileSpreadsheet className="w-4 h-4" />,
              onSelect: () => {
                const map: Record<string, ReportTypeId> = { "Månedlig": "monthly", "Kvartalsvis": "financial", "Årlig": "financial" };
                handleExport(map[row.type] ?? "monthly");
              },
            },
            {
              id: "csv",
              label: "Last ned som CSV",
              icon: <Icon name="description" className="w-4 h-4" />,
              onSelect: () => {
                const map: Record<string, ReportTypeId> = { "Månedlig": "monthly", "Kvartalsvis": "financial", "Årlig": "financial" };
                handleExport(map[row.type] ?? "monthly");
              },
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
            <Button
              variant="accent"
              onClick={() => setDialogOpen(true)}
            >
              <Icon name="add" className="w-4 h-4 mr-2" />
              Ny rapport
            </Button>
          }
        />

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isSelected = selectedReport === report.id;
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={cn(
                  "bg-surface-container-lowest rounded-xl shadow-card p-5 cursor-pointer transition-all hover:shadow-lg",
                  isSelected && "ring-2 ring-grey-600",
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
                <h3 className="text-sm font-semibold text-on-surface mb-1">
                  {report.name}
                </h3>
                <p className="text-xs text-on-surface-variant/80 mb-3">
                  {report.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant/80">
                    Sist: {report.lastGenerated}
                  </span>
                  <AdminDropdown
                    label="Eksporter"
                    align="right"
                    trigger={
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant/80 transition-colors"
                        aria-label={`Last ned ${report.name}`}
                      >
                        <Icon name="download" className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      {
                        id: "excel",
                        label: "Excel (CSV)",
                        icon: <FileSpreadsheet className="w-4 h-4" />,
                        onSelect: () => handleExport(report.id),
                      },
                      {
                        id: "csv",
                        label: "CSV",
                        icon: <Icon name="description" className="w-4 h-4" />,
                        onSelect: () => handleExport(report.id),
                      },
                    ]}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generate Report */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card p-5">
            <h3 className="text-sm font-semibold text-on-surface mb-4">
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
                            ? "bg-inverse-surface text-surface border-inverse-surface/30"
                            : "bg-surface-container-lowest text-on-surface-variant/90 border-outline-variant/30 hover:bg-surface",
                        )}
                      >
                        {fmt}
                      </button>
                    );
                  })}
                </div>
              </div>
              <Button
                variant="accent"
                className="w-full justify-center"
                onClick={() => generateType && handleExport(generateType as ReportTypeId)}
                disabled={!generateType || isPending}
              >
                {isPending ? <Icon name="progress_activity" className="w-4 h-4 animate-spin mr-2" /> : <Icon name="description" className="w-4 h-4 mr-2" />}
                {isPending ? "Genererer..." : "Generer rapport"}
              </Button>
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-on-surface">
                Automatiske rapporter
              </h3>
              <button
                type="button"
                disabled
                className="p-1.5 rounded-md text-on-surface-variant opacity-50 cursor-not-allowed"
                aria-label="Legg til automatisk rapport"
                title="Kommer snart"
              >
                <Icon name="add" className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-grey-200">
              {scheduledReports.map((report) => (
                <div key={report.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-on-surface">
                        {report.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant/80">
                        {report.frequency}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5",
                        report.active
                          ? "bg-emerald-500"
                          : "bg-surface-variant",
                      )}
                      aria-label={report.active ? "Aktiv" : "Inaktiv"}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant/80">
                    <span className="flex items-center gap-1">
                      <Icon name="mail" className="w-3 h-3" />
                      {report.recipients}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="schedule" className="w-3 h-3" />
                      Neste: {report.nextRun}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nylig genererte rapporter — DataTable */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-on-surface">
              Nylig genererte rapporter
            </h3>
            <span className="text-xs text-on-surface-variant/80">
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
            <Button
              variant="secondary"
              onClick={() => setDialogOpen(false)}
            >
              Avbryt
            </Button>
            <Button
              variant="accent"
              onClick={handleGenerate}
              disabled={!generateType || isPending}
            >
              {isPending ? <Icon name="progress_activity" className="w-4 h-4 animate-spin mr-2" /> : <Icon name="description" className="w-4 h-4 mr-2" />}
              {isPending ? "Genererer..." : "Generer"}
            </Button>
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
                        ? "bg-inverse-surface text-surface border-inverse-surface/30"
                        : "bg-surface-container-lowest text-on-surface-variant/90 border-outline-variant/30 hover:bg-surface",
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
