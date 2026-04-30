import Link from "next/link";
import { AKLogo } from "@/components/website/AKLogo";
import { BRAND } from "./copy";

export function TopBar() {
  return (
    <header className="top">
      <Link className="brand" href="/booking-v2">
        <AKLogo variant="black" size={28} />
        <span className="brand-name">
          {BRAND.name}
          <small>{BRAND.subline}</small>
        </span>
      </Link>
      <div className="top-meta">
        <Link href="/portal">Min side</Link>
        <span>·</span>
        <span>NO</span>
        <span>·</span>
        <Link href="#hjelp">Hjelp</Link>
      </div>
    </header>
  );
}
