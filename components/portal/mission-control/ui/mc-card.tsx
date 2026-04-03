import { cn } from "@/lib/portal/utils/cn";

interface MCCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MCCard({ children, className }: MCCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-[#E8E8ED] overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

interface MCCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function MCCardHeader({ children, className }: MCCardHeaderProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-b border-[#E8E8ED] flex items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
}

interface MCCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function MCCardTitle({ children, className }: MCCardTitleProps) {
  return (
    <h3 className={cn("text-[13px] font-semibold text-[#1D1D1F]", className)}>
      {children}
    </h3>
  );
}

interface MCCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function MCCardBody({ children, className }: MCCardBodyProps) {
  return <div className={cn("p-4", className)}>{children}</div>;
}

interface MCCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function MCCardFooter({ children, className }: MCCardFooterProps) {
  return (
    <div
      className={cn("px-4 py-3 border-t border-[#E8E8ED] bg-[#F5F5F7]", className)}
    >
      {children}
    </div>
  );
}
