import { cn } from "@/lib/portal/utils/cn";

interface MCTableProps {
  children: React.ReactNode;
  className?: string;
}

export function MCTable({ children, className }: MCTableProps) {
  return (
    <table className={cn("w-full border-collapse", className)}>
      {children}
    </table>
  );
}

interface MCTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function MCTableHeader({ children, className }: MCTableHeaderProps) {
  return <thead className={className}>{children}</thead>;
}

interface MCTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function MCTableBody({ children, className }: MCTableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

interface MCTableRowProps {
  children: React.ReactNode;
  className?: string;
  warning?: boolean;
  onClick?: () => void;
}

export function MCTableRow({ children, className, warning, onClick }: MCTableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "transition-colors",
        warning ? "bg-[#FFFBEB] hover:bg-[#FEF3C7]" : "hover:bg-[#F5F5F7]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </tr>
  );
}

interface MCTableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export function MCTableHead({ children, className }: MCTableHeadProps) {
  return (
    <th
      className={cn(
        "text-left px-3.5 py-2.5 text-[9px] font-semibold text-[#86868B] uppercase tracking-[0.5px] bg-[#F5F5F7]",
        className
      )}
    >
      {children}
    </th>
  );
}

interface MCTableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

export function MCTableCell({ children, className, colSpan }: MCTableCellProps) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "px-3.5 py-3 border-t border-[#E8E8ED] text-[11px] text-[#1D1D1F]",
        className
      )}
    >
      {children}
    </td>
  );
}
