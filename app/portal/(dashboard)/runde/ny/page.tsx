import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { StartRoundClient } from "./start-round-client";

export const dynamic = "force-dynamic";

type Course = {
  id: string;
  name: string;
  location: string | null;
  par: number;
  courseRating: number;
  slopeRating: number;
};

export default async function NyRundePage() {
  await requirePortalUser();

  let courses: Course[] = [];
  let dbError: string | null = null;

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("Course")
      .select("id, name, location, par, courseRating, slopeRating")
      .order("name", { ascending: true });

    if (error) {
      dbError = error.message;
    } else if (data) {
      courses = data as Course[];
    }
  } catch {
    dbError = "Kunne ikke koble til database";
  }

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
          <p className="text-sm text-on-surface-variant/80 mt-2">
            Ingen baner registrert ennå. Kontakt trener for å få lagt til
            din hjemmebane.
          </p>
        )}
        {dbError && (
          <p className="text-xs text-error mt-1">
            Databasefeil: {dbError}
          </p>
        )}
      </div>

      {courses.length > 0 && <StartRoundClient courses={courses} />}
    </div>
  );
}
