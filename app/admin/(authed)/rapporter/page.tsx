"use client";

import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";
import { Calendar, TrendingUp, Users, DollarSign, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminSelect,
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
import { MonoLabel, BentoGrid, BentoCard, NightSurface } from "@/components/portal/patterns";

// ─── Typer ───

type ReportTypeId = "monthly" | "students" | "financial" | "capacity";

interface ReportType {
  id: ReportTypeId;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconBgClass: string;
  iconColorClass: string;
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
    iconBgClass: "bg-primary/10",
    iconColorClass: "text-primary",
    lastGenerated: "1. april 2024",
  },
  {
    id: "students",
    name: "Elev-statistikk",
    description: "Detaljert analyse av elevaktivitet og fremgang",
    icon: Users,
    iconBgClass: "bg-success/10",
    iconColorClass: "text-success",
    lastGenerated: "5. april 2024",
  },
  {
    id: "financial",
    name: "Økonomisk rapport",
    description: "Inntekter, utgifter og lønnsomhet",
    icon: DollarSign,
    iconBgClass: "bg-secondary-fixed/20",
    iconColorClass: "text-secondary-fixed",
    lastGenerated: "1. april 2024",
  },
  {
    id: "capacity",
    name: "Kapasitetsrapport",
    description: "Utnyttelse og booking-trender",
    icon: TrendingUp,
    iconBgClass: "bg-warning/10",
    iconColorClass: "text-warning",
    lastGenerated: "3. april 2024",
  },
];

// Planlagte og nylig genererte rapporter mangler en datakilde —
// vises som tomme tabeller inntil vi har en Reports-modell.
const scheduledReports: ScheduledReport[] = [];
const recentReports: RecentReportRow[] = [];

const exportFormats = ["CSV"] as const;
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
        {/* Heritage Grid Header */}
        <div className="space-y-2">
          <MonoLabel size="xs" uppercase className="block text-outline">
            CoachHQ
          </MonoLabel>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Rapporter<span className="text-outline">.</span>
          </h1>
          <p className="text-on-surface-variant">
            Generer, planlegg og last ned rapporter fra akademiet
          </p>
        </div>

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
        <BentoGrid cols={4} gap="md">
          {reportTypes.map((report) => {
            const ReportIcon = report.icon;
            const isSelected = selectedReport === report.id;
            return (
              <BentoCard
                key={report.id}
                variant="light"
                interactive
                padding="md"
                onClick={() => setSelectedReport(report.id)}
                className={cn(
                  isSelected && "ring-2 ring-outline",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                    report.iconBgClass,
                  )}
                >
                  <ReportIcon
                    className={cn("w-5 h-5", report.iconColorClass)}
                  />
                </div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">
                  {report.name}
                </h3>
                <p className="text-xs text-on-surface-variant/80 mb-3">
                  {report.description}
                </p>
                <div className="flex items-center justify-between">
                  <MonoLabel size="xs" className="text-on-surface-variant/80">
                    Sist: {report.lastGenerated}
                  </MonoLabel>
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
              </BentoCard>
            );
          })}
        </BentoGrid>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generate Report */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
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
              <Button
                variant="accent"
                className="w-full justify-center"
                onClick={() => generateType && handleExport(generateType as ReportTypeId)}
                disabled={!generateType || isPending}
              >
                {isPending ? <Icon name="progress_activity" className="w-4 h-4 animate-spin mr-2" /> : <Icon name="description" className="w-4 h-4 mr-2" />}
                {isPending ? "Genererer..." : "Generer CSV"}
              </Button>
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-0 overflow-hidden">
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
            <div className="divide-y divide-outline-variant">
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
                          ? "bg-success"
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
        <NightSurface variant="ambient" className="rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <MonoLabel size="xs" uppercase className="text-surface/60 block">
              Nylig genererte rapporter
            </MonoLabel>
            <span className="text-xs text-surface/60">
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
        </NightSurface>
      </div>

      {/* Dialog: Ny rapport */}
      <AdminDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Generer ny rapport"
        description="Velg rapporttype og periode. Eksporten leveres som CSV."
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
        </div>
      </AdminDialog>
    </>
  );
}
