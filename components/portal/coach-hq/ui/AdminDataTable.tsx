"use client";


import { Icon } from "@/components/ui/icon";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface AdminDataTableColumn<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
}

export interface AdminDataTableBulkAction<T> {
  label: string;
  action: (rows: T[]) => void;
  variant?: "primary" | "secondary" | "danger";
}

interface AdminDataTableProps<T extends { id: string | number }> {
  columns: AdminDataTableColumn<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: { pageSize: number };
  bulkActions?: AdminDataTableBulkAction<T>[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

type SortDir = "asc" | "desc" | null;

export function AdminDataTable<T extends { id: string | number }>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = "Søk...",
  pagination,
  bulkActions,
  onRowClick,
  emptyMessage = "Ingen data.",
  className,
}: AdminDataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>(null);
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Set<string | number>>(
    new Set(),
  );

  const filtered = React.useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const raw = row[col.key];
        return String(raw ?? "")
          .toLowerCase()
          .includes(q);
      }),
    );
  }, [data, query, columns]);

  const sorted = React.useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const as = String(av);
      const bs = String(bv);
      return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const pageSize = pagination?.pageSize ?? sorted.length;
  const totalPages = pagination
    ? Math.max(1, Math.ceil(sorted.length / pageSize))
    : 1;
  const currentPage = Math.min(page, totalPages);
  const paginated = pagination
    ? sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sorted;

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    if (sortDir === "asc") {
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortKey(null);
      setSortDir(null);
    } else {
      setSortDir("asc");
    }
  };

  const toggleRow = (id: string | number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((row) => row.id)));
    }
  };

  const selectedRows = React.useMemo(
    () => data.filter((row) => selected.has(row.id)),
    [data, selected],
  );

  return (
    <div className={cn("admin-card p-0 overflow-hidden", className)}>
      {(searchable || (bulkActions && selectedRows.length > 0)) && (
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 border-b"
          style={{ borderColor: "var(--color-muted)" }}
        >
          {searchable && (
            <div className="relative flex-1 max-w-xs">
              <Icon name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--color-muted)" }} />
              <input
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="admin-input pl-9"
              />
            </div>
          )}
          {bulkActions && selectedRows.length > 0 && (
            <div className="flex items-center gap-2">
              <span
                className="text-xs"
                style={{ color: "var(--color-muted)" }}
              >
                {selectedRows.length} valgt
              </span>
              {bulkActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => action.action(selectedRows)}
                  className={cn(
                    "admin-btn",
                    action.variant === "danger"
                      ? "admin-btn-danger"
                      : action.variant === "secondary"
                        ? "admin-btn-secondary"
                        : "admin-btn-primary",
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-left border-b"
              style={{
                borderColor: "var(--color-muted)",
                background: "var(--color-surface)",
              }}
            >
              {bulkActions && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      paginated.length > 0 &&
                      paginated.every((row) => selected.has(row.id))
                    }
                    onChange={toggleAll}
                    aria-label="Velg alle"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 font-semibold uppercase tracking-wide text-xs"
                  style={{
                    color: "var(--color-muted)",
                    width: col.width,
                    textAlign: col.align ?? "left",
                  }}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-[color:var(--color-text)]"
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === "asc" ? (
                          <Icon name="arrow_upward" className="w-3 h-3" />
                        ) : (
                          <Icon name="arrow_downward" className="w-3 h-3" />
                        )
                      ) : (
                        <Icon name="arrow_upward"Down className="w-3 h-3 opacity-50" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (bulkActions ? 1 : 0)}
                  className="text-center py-8"
                  style={{ color: "var(--color-muted)" }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b transition-colors",
                    onRowClick && "cursor-pointer hover:bg-[color:var(--color-surface)]",
                  )}
                  style={{ borderColor: "var(--color-muted)" }}
                >
                  {bulkActions && (
                    <td
                      className="w-10 px-4 py-3"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        aria-label="Velg rad"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3"
                      style={{
                        textAlign: col.align ?? "left",
                        color: "var(--color-text)",
                      }}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && sorted.length > pageSize && (
        <div
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: "var(--color-muted)" }}
        >
          <span className="text-xs" style={{ color: "var(--color-muted)" }}>
            Side {currentPage} av {totalPages} · {sorted.length} rader
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="admin-btn admin-btn-ghost disabled:opacity-40"
              aria-label="Forrige side"
            >
              <Icon name="chevron_left" className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="admin-btn admin-btn-ghost disabled:opacity-40"
              aria-label="Neste side"
            >
              <Icon name="chevron_right" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
