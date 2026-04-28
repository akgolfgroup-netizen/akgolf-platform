"use client";

import { MapPin, Users, Repeat } from "lucide-react";

export interface Course {
  id: string;
  name: string;
  location: string;
  par?: number;
  courseRating?: number;
  slopeRating?: number;
  totalLength?: number;
}

interface CourseHeroProps {
  courses: Course[];
  selectedCourseId: string;
  onChange: (id: string) => void;
  loading?: boolean;
}

export function CourseHero({
  courses,
  selectedCourseId,
  onChange,
  loading,
}: CourseHeroProps) {
  const course = courses.find((c) => c.id === selectedCourseId);

  return (
    <section
      className="rounded-2xl"
      style={{
        background:
          "radial-gradient(circle at 80% 20%, rgba(209,248,67,0.10), transparent 50%), #0F2E23",
        border: "1.5px solid rgba(209,248,67,0.30)",
        boxShadow: "0 0 32px rgba(209,248,67,0.08)",
        padding: "24px 28px",
      }}
    >
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#D1F843",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Aktiv bane
          </div>
          <h2
            style={{
              fontFamily: "'Inter Tight', Inter, sans-serif",
              margin: 0,
              fontSize: 30,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
            }}
          >
            {course?.name ?? "Velg bane"}
          </h2>
          {course ? (
            <div
              className="flex gap-4 mt-2 flex-wrap"
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 12.5,
              }}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {course.location}
              </span>
              {course.par ? (
                <span className="flex items-center gap-1.5">
                  Par {course.par}
                </span>
              ) : null}
              {course.totalLength ? (
                <span className="flex items-center gap-1.5">
                  {course.totalLength} m
                </span>
              ) : null}
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Solo / 4-ball
              </span>
            </div>
          ) : null}
        </div>

        <select
          value={selectedCourseId}
          disabled={loading || courses.length === 0}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg px-3 py-2 inline-flex items-center gap-1.5 disabled:opacity-50"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.85)",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {courses.map((c) => (
            <option
              key={c.id}
              value={c.id}
              style={{ background: "#0F2E23", color: "#fff" }}
            >
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div
        className="grid gap-3.5 py-4"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Stat label="Par" value={course?.par ?? "—"} />
        <Stat
          label="Lengde"
          value={course?.totalLength ?? "—"}
          smallSuffix={course?.totalLength ? "m" : undefined}
        />
        <Stat
          label="Slope / CR"
          value={
            course?.slopeRating && course?.courseRating
              ? `${course.slopeRating} / ${course.courseRating.toFixed(1)}`
              : "—"
          }
        />
        <Stat label="Hull" value={courses.length > 0 ? "18" : "—"} />
      </div>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.06em",
          }}
        >
          <Repeat className="w-3.5 h-3.5" /> Bytt bane
        </button>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  smallSuffix,
}: {
  label: string;
  value: string | number;
  smallSuffix?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {label}
      </div>
      <div
        className="mt-1"
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        {smallSuffix ? (
          <small
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              marginLeft: 3,
              fontWeight: 500,
            }}
          >
            {smallSuffix}
          </small>
        ) : null}
      </div>
    </div>
  );
}
