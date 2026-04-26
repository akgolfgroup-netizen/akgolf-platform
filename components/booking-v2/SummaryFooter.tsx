import Link from "next/link";

export interface SummaryFooterItem {
  label: string;
  value: string;
}

interface SummaryFooterProps {
  items: SummaryFooterItem[];
  backHref: string;
  nextHref: string;
  nextLabel?: string;
  nextVariant?: "primary" | "accent";
}

export function SummaryFooter({
  items,
  backHref,
  nextHref,
  nextLabel = "Fortsett",
  nextVariant = "primary",
}: SummaryFooterProps) {
  return (
    <div className="summary-foot">
      <div className="recap">
        {items.map((item, i) => (
          <div key={i} className="item">
            <span className="l">{item.label}</span>
            <span className="v">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="actions">
        <Link href={backHref} className="btn btn-secondary">
          ← Tilbake
        </Link>
        <Link href={nextHref} className={`btn btn-${nextVariant}`}>
          {nextLabel} →
        </Link>
      </div>
    </div>
  );
}
