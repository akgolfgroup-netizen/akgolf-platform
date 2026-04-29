"use client";

import { useEffect, useState } from "react";

import { StrategiShell } from "@/components/portal/strategi/v2/strategi-shell";
import { StrategiPageHeader } from "@/components/portal/strategi/v2/strategi-page-header";
import { CourseHero, type Course } from "@/components/portal/strategi/v2/course-hero";
import { StrategiAiSummary } from "@/components/portal/strategi/v2/strategi-ai-summary";
import { HoleCard } from "@/components/portal/strategi/v2/hole-card";
import { NineToggle } from "@/components/portal/strategi/v2/nine-toggle";
import {
  StrategiSectionHeading,
  StrategiLegend,
} from "@/components/portal/strategi/v2/strategi-section-heading";
import {
  buildHoleCardData,
  type Hole,
} from "@/components/portal/strategi/v2/strategi-helpers";
import {
  LoadingBlock,
  EmptyCourses,
  EmptyHoles,
  NineTotal,
} from "@/components/portal/strategi/v2/strategi-empty-states";

export default function StrategiPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [holes, setHoles] = useState<Hole[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingHoles, setLoadingHoles] = useState(false);
  const [nine, setNine] = useState<"front" | "back">("front");

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/portal/courses");
        if (res.ok) {
          const data = await res.json();
          const list: Course[] = Array.isArray(data) ? data : data.courses || [];
          setCourses(list);
          if (list.length > 0 && !selectedCourseId) {
            setSelectedCourseId(list[0].id);
          }
        }
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, [selectedCourseId]);

  useEffect(() => {
    if (!selectedCourseId) return;

    async function loadHoles() {
      setLoadingHoles(true);
      try {
        const res = await fetch(`/api/portal/courses/${selectedCourseId}/holes`);
        if (res.ok) {
          const data = await res.json();
          setHoles(data.holes || []);
        }
      } finally {
        setLoadingHoles(false);
      }
    }
    loadHoles();
  }, [selectedCourseId]);

  const course = courses.find((c) => c.id === selectedCourseId);
  const hasBackNine = holes.length > 9;
  const visibleHoles = holes
    .filter((h) => (nine === "front" ? h.holeNumber <= 9 : h.holeNumber > 9))
    .sort((a, b) => a.holeNumber - b.holeNumber);

  const totalLen = visibleHoles.reduce((s, h) => s + h.lengthMeter, 0);
  const totalPar = visibleHoles.reduce((s, h) => s + h.par, 0);

  return (
    <StrategiShell>
      <StrategiPageHeader courseName={course?.name} />

      {loadingCourses ? (
        <LoadingBlock label="Laster baner…" />
      ) : courses.length === 0 ? (
        <EmptyCourses />
      ) : (
        <>
          <div
            className="grid gap-4.5 mb-6"
            style={{ gridTemplateColumns: "1.2fr 1fr" }}
          >
            <CourseHero
              courses={courses}
              selectedCourseId={selectedCourseId}
              onChange={setSelectedCourseId}
              loading={loadingCourses}
            />
            <StrategiAiSummary
              courseName={course?.name}
              keys={[
                { value: `${holes.length} hull`, label: "lastet" },
                {
                  value: course?.par ? String(course.par) : "—",
                  label: "Par",
                },
                {
                  value:
                    course?.totalLength != null ? `${course.totalLength} m` : "—",
                  label: "Total lengde",
                },
              ]}
            />
          </div>

          <StrategiSectionHeading
            title="Hull-for-hull plan"
            right={
              <>
                <StrategiLegend />
                <NineToggle
                  value={nine}
                  onChange={setNine}
                  hasBackNine={hasBackNine}
                />
              </>
            }
          />

          {loadingHoles ? (
            <LoadingBlock label="Laster hull…" />
          ) : visibleHoles.length === 0 ? (
            <EmptyHoles />
          ) : (
            <>
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
              >
                {visibleHoles.map((hole) => (
                  <HoleCard key={hole.id} hole={buildHoleCardData(hole)} />
                ))}
              </div>

              <div
                className="mt-4 rounded-xl flex justify-between items-center gap-6"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  padding: "14px 18px",
                }}
              >
                <div className="flex gap-6">
                  <NineTotal
                    label={nine === "front" ? "Front 9 par" : "Back 9 par"}
                    value={totalPar}
                  />
                  <NineTotal label="Total m" value={totalLen} />
                  <NineTotal label="Hull" value={visibleHoles.length} />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </StrategiShell>
  );
}
