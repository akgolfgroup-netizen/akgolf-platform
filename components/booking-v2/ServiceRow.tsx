import Link from "next/link";
import type { BookingService } from "./copy";

interface ServiceRowProps {
  service: BookingService;
  index: number;
}

export function ServiceRow({ service, index }: ServiceRowProps) {
  return (
    <Link
      href={`/booking-v2/velg-trener?service=${service.id}`}
      className="service-row"
      data-pick={service.id}
    >
      <span className="idx">{String(index + 1).padStart(2, "0")}</span>
      <div className="head">
        <h3 className="title">
          {service.name}
          {service.nameEm ? <em>{service.nameEm}</em> : null}
        </h3>
        <div className="meta">
          {service.meta.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
      <p className="desc">{service.description}</p>
      <div className="price">
        {service.price}
        {service.priceUnit ? <small>{service.priceUnit}</small> : null}
      </div>
      <div className="arr-circle">→</div>
    </Link>
  );
}
