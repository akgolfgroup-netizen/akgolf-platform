interface SectionHeadingProps {
  title: string;
  sub?: string;
}

export function SectionHeading({ title, sub }: SectionHeadingProps) {
  return (
    <div className="mb-3.5 mt-8 flex items-end justify-between">
      <h2 className="m-0 font-display text-[22px] font-extrabold tracking-[-0.025em] text-white">
        {title}
      </h2>
      {sub ? (
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
          {sub}
        </div>
      ) : null}
    </div>
  );
}
