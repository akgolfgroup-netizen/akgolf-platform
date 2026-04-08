import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { StartRoundClient } from "./start-round-client";

export const dynamic = "force-dynamic";

export default async function NyRundePage() {
  await requirePortalUser();

  const supabase = await createServerSupabase();
  const { data: courses } = await supabase
    .from("Course")
    .select("id, name, location, par, courseRating, slopeRating")
    .eq("country", "NO")
    .order("name", { ascending: true });

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
          Ny runde
        </h1>
        <p className="text-[var(--color-grey-500)] mt-1">
          Velg bane og start registrering
        </p>
      </div>

      <StartRoundClient courses={courses ?? []} />
    </div>
  );
}
