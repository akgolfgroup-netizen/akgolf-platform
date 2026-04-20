import * as React from "react";
import { cn } from "@/lib/utils";

interface AdminTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export function AdminTable({
  className,
  containerClassName,
  children,
  ...props
}: AdminTableProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto bg-surface-container-lowest border border-[var(--color-grey-200)] rounded-xl",
        containerClassName,
      )}
    >
      <table className={cn("admin-table", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function AdminTableHead({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
}

export function AdminTableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export function AdminTableRow({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}

export function AdminTableHeaderCell({
  className,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={className} {...props}>
      {children}
    </th>
  );
}

export function AdminTableCell({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={className} {...props}>
      {children}
    </td>
  );
}
