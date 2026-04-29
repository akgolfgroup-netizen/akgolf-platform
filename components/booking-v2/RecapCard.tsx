interface RecapLine {
  label: string;
  value: string;
  small?: string;
}

interface RecapCardProps {
  heading: string;
  lines: RecapLine[];
  total?: { label: string; value: string };
  policy?: string;
}

export function RecapCard({ heading, lines, total, policy }: RecapCardProps) {
  return (
    <aside className="recap-card">
      <h4>{heading}</h4>
      {lines.map((line, i) => (
        <div key={i} className="line">
          <span className="l">{line.label}</span>
          <span className="v">
            {line.value}
            {line.small ? <small>{line.small}</small> : null}
          </span>
        </div>
      ))}
      {total ? (
        <div className="total">
          <span className="l">{total.label}</span>
          <span className="v">{total.value}</span>
        </div>
      ) : null}
      {policy ? <p className="policy">{policy}</p> : null}
    </aside>
  );
}
