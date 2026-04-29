import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  label: string;
  width?: string;
  render: (row: T) => ReactNode;
}

interface McTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyText?: string;
}

export function McTable<T>({
  columns,
  rows,
  keyExtractor,
  onRowClick,
  emptyText = "Ingen data",
}: McTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-[13px] text-white/40"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "cursor-pointer hover:bg-white/[0.03] transition-colors" : ""}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
