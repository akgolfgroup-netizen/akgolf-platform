import Link from "next/link";

interface InstructorCardProps {
  id: "anders" | "markus";
  name: string;
  role: string;
  badge: string;
  bio: string;
  image: string;
  fallbackBg: string;
  stats: { v: string; l: string }[];
  availability: string;
  selected?: boolean;
  hrefBase: string;
}

export function InstructorCard({
  id,
  name,
  role,
  badge,
  bio,
  image,
  fallbackBg,
  stats,
  availability,
  selected,
  hrefBase,
}: InstructorCardProps) {
  // Use fallback solid color for trainers without portrait yet (e.g. Markus)
  const portraitStyle =
    id === "markus"
      ? { backgroundColor: fallbackBg }
      : { backgroundImage: `url('${image}')` };

  return (
    <Link
      href={`${hrefBase}&trainer=${id}`}
      className={`inst-card${selected ? " selected" : ""}`}
      data-pick={id}
    >
      <div className="inst-portrait" style={portraitStyle}>
        <span className="badge">{badge}</span>
        <span className="availability">{availability}</span>
      </div>
      <div className="inst-body">
        <div>
          <h3 className="inst-name">{name}</h3>
          <p className="inst-role">{role}</p>
        </div>
        <p className="inst-bio">{bio}</p>
        <div className="inst-stats">
          {stats.map((s, i) => (
            <div key={i} className="s">
              <div className="v">{s.v}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
