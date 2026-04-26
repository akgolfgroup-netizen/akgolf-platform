import Link from "next/link";

interface QuickRowProps {
  href: string;
  tag: string;
  name: string;
  detail: string;
  price: string;
  priceUnit?: string;
}

export function QuickRow({ href, tag, name, detail, price, priceUnit }: QuickRowProps) {
  return (
    <Link href={href} className="quick-row">
      <span className="tag">{tag}</span>
      <div className="name">
        {name}
        <small>{detail}</small>
      </div>
      <div className="price">
        {price}
        {priceUnit ? <small>{priceUnit}</small> : null}
      </div>
      <div className="arr-circle">→</div>
    </Link>
  );
}
