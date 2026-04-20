import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { StartRoundClient } from "./start-round-client";

export const dynamic = "force-dynamic";

const MOCK_COURSES = [
  { id: "mock-oslo-gc", name: "Oslo Golfklubb", location: "Oslo", par: 72, courseRating: 72.1, slopeRating: 130 },
  { id: "mock-bærums-gc", name: "Bærums Golfklubb", location: "Bærum", par: 71, courseRating: 71.2, slopeRating: 128 },
  { id: "mock-miklagard", name: "Miklagard Golf", location: "Akershus", par: 72, courseRating: 73.4, slopeRating: 135 },
  { id: "mock-vestfold", name: "Vestfold Golfklubb", location: "Vestfold", par: 70, courseRating: 69.8, slopeRating: 122 },
  { id: "mock-kristiansand", name: "Kristiansand Golfklubb", location: "Kristiansand", par: 72, courseRating: 72.5, slopeRating: 132 },
  { id: "mock-trondheim", name: "Trondheim Golfklubb", location: "Trondheim", par: 71, courseRating: 71.0, slopeRating: 126 },
  { id: "mock-stavanger", name: "Stavanger Golfklubb", location: "Stavanger", par: 72, courseRating: 72.8, slopeRating: 134 },
  { id: "mock-bergen", name: "Bergen Golfklubb", location: "Bergen", par: 70, courseRating: 70.2, slopeRating: 124 },
];

export default async function NyRundePage() {
  await requirePortalUser();

  let courses: typeof MOCK_COURSES = [];
  let dbError: string | null = null;

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("Course")
      .select("id, name, location, par, courseRating, slopeRating")
      .order("name", { ascending: true });

    if (error) {
      dbError = error.message;
    } else if (data && data.length > 0) {
      courses = data as typeof MOCK_COURSES;
    }
  } catch {
    dbError = "Kunne ikke koble til database";
  }

  // Fallback til mock-baner hvis databasen er tom
  const displayCourses = courses.length > 0 ? courses : MOCK_COURSES;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">
          Ny runde
        </h1>
        <p className="text-on-surface-variant mt-1">
          Velg bane og start registrering
        </p>
        {courses.length === 0 && !dbError && (
          <p className="text-xs text-on-surface-variant/60 mt-1">
            Viser demo-baner — ingen baner funnet i databasen
          </p>
        )}
        {dbError && (
          <p className="text-xs text-error mt-1">
            Databasefeil: {dbError}
          </p>
        )}
      </div>

      <StartRoundClient courses={displayCourses} />
    </div>
  );
}
