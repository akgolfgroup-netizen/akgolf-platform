"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Calendar,
  Check,
  X,
  User,
  Loader2,
  CheckCircle,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminDataTable,
  AdminDialog,
  AdminTabs,
  type AdminDataTableColumn,
  type AdminDataTableBulkAction,
} from "@/components/portal/mission-control/ui";
import {
  approveBooking,
  rejectBooking,
  approveActivity,
  rejectActivity,
} from "./actions";

interface PendingItem {
  id: string;
  type: "booking" | "plan" | "activity";
  studentName: string;
  studentEmail: string;
  serviceName: string;
  price: number;
  requestedTime: Date;
  createdAt: Date;
  facilityName?: string;
  activityType?: string;
  conflictNote?: string | null;
}

interface GodkjenningerClientProps {
  pendingItems: PendingItem[];
}

type FilterTab = "all" | "booking" | "activity";

export function GodkjenningerClient({ pendingItems }: GodkjenningerClientProps) {
  const { toggle } = useMCSidebar();
  const [items, setItems] = useState<PendingItem[]>(pendingItems);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [confirmItem, setConfirmItem] = useState<{
    item: PendingItem;
    action: "approve" | "reject";
  } | null>(null);

  const bookingCount = items.filter((i) => i.type === "booking").length;
  const activityCount = items.filter((i) => i.type === "activity").length;

  const filtered = useMemo(() => {
    if (activeTab === "all") return items;
    return items.filter((i) => i.type === activeTab);
  }, [items, activeTab]);

  async function doApprove(item: PendingItem) {
    setProcessingId(item.id);
    const result =
      item.type === "activity"
        ? await approveActivity(item.id)
        : await approveBooking(item.id);
    if (result.success) {
      setItems((prev) => prev.filter((x) => x.id !== item.id));
    }
    setProcessingId(null);
    setConfirmItem(null);
  }

  async function doReject(item: PendingItem) {
    setProcessingId(item.id);
    const result =
      item.type === "activity"
        ? await rejectActivity(item.id)
        : await rejectBooking(item.id);
    if (result.success) {
      setItems((prev) => prev.filter((x) => x.id !== item.id));
    }
    setProcessingId(null);
    setConfirmItem(null);
  }

  async function bulkApprove(rows: PendingItem[]) {
    for (const row of rows) {
      await (row.type === "activity"
        ? approveActivity(row.id)
        : approveBooking(row.id));
    }
    setItems((prev) => prev.filter((x) => !rows.find((r) => r.id === x.id)));
  }

  async function bulkReject(rows: PendingItem[]) {
    if (
      !window.confirm(`Avvise ${rows.length} ventende items? Kan ikke angres.`)
    )
      return;
    for (const row of rows) {
      await (row.type === "activity"
        ? rejectActivity(row.id)
        : rejectBooking(row.id));
    }
    setItems((prev) => prev.filter((x) => !rows.find((r) => r.id === x.id)));
  }

  const columns: AdminDataTableColumn<PendingItem>[] = [
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className={
              row.type === "activity"
                ? "h-8 w-8 rounded-full flex items-center justify-center bg-[var(--color-primary)]/10"
                : "h-8 w-8 rounded-full flex items-center justify-center bg-[var(--color-grey-100)]"
            }
          >
            {row.type === "activity" ? (
              <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
            ) : (
              <User className="h-4 w-4 text-[var(--color-muted)]" />
            )}
          </div>
          <AdminBadge variant={row.type === "activity" ? "info" : "warning"}>
            {row.type === "activity" ? "Aktivitet" : "Booking"}
          </AdminBadge>
        </div>
      ),
    },
    {
      key: "serviceName",
      label: "Beskrivelse",
      sortable: true,
      render: (row) => (
        <div>
          <div className="text-sm font-medium text-[var(--color-text)]">
            {row.type === "activity" ? row.serviceName : row.studentName}
          </div>
          <div className="text-xs text-[var(--color-muted)]">
            {row.type === "activity"
              ? `Opprettet av ${row.studentName}`
              : row.serviceName}
          </div>
        </div>
      ),
    },
    {
      key: "requestedTime",
      label: "Ønsket tid",
      sortable: true,
      render: (row) => (
        <div className="text-sm text-[var(--color-text)] flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-[var(--color-muted)]" />
          {format(new Date(row.requestedTime), "d. MMM 'kl.' HH:mm", {
            locale: nb,
          })}
        </div>
      ),
    },
    {
      key: "price",
      label: "Pris",
      sortable: true,
      align: "right",
      render: (row) =>
        row.type === "activity" ? (
          <span className="text-[var(--color-muted)]">—</span>
        ) : (
          <span className="tabular-nums text-[var(--color-text)]">
            {row.price.toLocaleString("nb-NO")} kr
          </span>
        ),
    },
    {
      key: "createdAt",
      label: "Opprettet",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-[var(--color-muted)]">
          {format(new Date(row.createdAt), "d. MMM HH:mm", { locale: nb })}
        </span>
      ),
    },
    {
      key: "id",
      label: "Handlinger",
      sortable: false,
      align: "right",
      render: (row) => (
        <div
          className="flex items-center justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <AdminButton
            variant="primary"
            icon={
              processingId === row.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )
            }
            onClick={() => setConfirmItem({ item: row, action: "approve" })}
            disabled={processingId === row.id}
          >
            Godkjenn
          </AdminButton>
          <AdminButton
            variant="secondary"
            icon={<X className="h-3.5 w-3.5" />}
            onClick={() => setConfirmItem({ item: row, action: "reject" })}
            disabled={processingId === row.id}
          >
            Avvis
          </AdminButton>
        </div>
      ),
    },
  ];

  const bulkActions: AdminDataTableBulkAction<PendingItem>[] = [
    {
      label: "Godkjenn alle valgte",
      variant: "primary",
      action: bulkApprove,
    },
    {
      label: "Avvis valgte",
      variant: "danger",
      action: bulkReject,
    },
  ];

  if (items.length === 0) {
    return (
      <>
        <MCTopbar
          title="Godkjenninger"
          subtitle="Ingen ventende godkjenninger"
          onMenuClick={toggle}
        />
        <div className="p-6">
          <AdminEmptyState
            icon={<CheckCircle className="h-6 w-6" />}
            title="Alt er godkjent"
            description="Du har ingen ventende godkjenninger"
          />
        </div>
      </>
    );
  }

  // Varsel om konflikt på aktiviteter — vis over tabellen
  const conflictItems = items.filter(
    (i) => i.type === "activity" && i.conflictNote,
  );

  return (
    <>
      <MCTopbar
        title="Godkjenninger"
        subtitle={`${items.length} ventende godkjenning${items.length === 1 ? "" : "er"}`}
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        {conflictItems.length > 0 && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[var(--color-warning)]/10 text-[var(--color-warning)] text-sm">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              {conflictItems.length} aktivitet
              {conflictItems.length === 1 ? "" : "er"} har konflikt-varsel. Se
              detaljer i tabellen nedenfor.
            </span>
          </div>
        )}

        <AdminTabs
          items={[
            { id: "all", label: "Alle", badge: items.length },
            { id: "booking", label: "Bookinger", badge: bookingCount },
            { id: "activity", label: "Aktiviteter", badge: activityCount },
          ]}
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as FilterTab)}
        />

        <AdminDataTable<PendingItem>
          columns={columns}
          data={filtered}
          searchable
          searchPlaceholder="Søk etter elev, tjeneste..."
          pagination={{ pageSize: 15 }}
          bulkActions={bulkActions}
          emptyMessage="Ingen ventende items i denne kategorien."
        />
      </div>

      {/* Dialog — bekreft godkjenn/avvis */}
      <AdminDialog
        open={confirmItem !== null}
        onClose={() => setConfirmItem(null)}
        title={
          confirmItem?.action === "approve"
            ? "Godkjenne forespørsel?"
            : "Avvise forespørsel?"
        }
        description={
          confirmItem
            ? confirmItem.action === "approve"
              ? `Dette vil bekrefte ${
                  confirmItem.item.type === "activity"
                    ? "aktiviteten"
                    : "bookingen"
                } og sende bekreftelse til eleven.`
              : `Dette vil avvise forespørselen. Eleven blir varslet.`
            : undefined
        }
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setConfirmItem(null)}>
              Avbryt
            </AdminButton>
            {confirmItem?.action === "approve" ? (
              <AdminButton
                variant="primary"
                icon={<Check className="h-4 w-4" />}
                loading={processingId === confirmItem.item.id}
                onClick={() => confirmItem && doApprove(confirmItem.item)}
              >
                Ja, godkjenn
              </AdminButton>
            ) : (
              <AdminButton
                variant="primary"
                icon={<X className="h-4 w-4" />}
                loading={
                  confirmItem ? processingId === confirmItem.item.id : false
                }
                onClick={() => confirmItem && doReject(confirmItem.item)}
              >
                Ja, avvis
              </AdminButton>
            )}
          </>
        }
      />
    </>
  );
}
