import { createServiceClient } from "@/lib/supabase/server";
import type { Facility, InstructorFacilityDefault } from "@prisma/client";

/**
 * Henter standard fasilitet for en instruktør basert på tjenestetype
 * @param instructorId - ID for instruktøren
 * @param serviceTypeId - ID for tjenestetypen (valgfritt)
 * @returns Fasilitet eller null hvis ingen default er satt
 */
export async function getDefaultFacility(
  instructorId: string,
  serviceTypeId?: string
): Promise<Facility | null> {
  const supabase = createServiceClient();

  // Hent alle defaults for instruktøren
  const { data: defaults } = await supabase
    .from("InstructorFacilityDefault")
    .select(`
      *,
      Facility:FacilityId(*)
    `)
    .eq("instructorId", instructorId)
    .or(serviceTypeId 
      ? `serviceTypeId.eq.${serviceTypeId},serviceTypeId.is.null` 
      : "serviceTypeId.is.null")
    .order("serviceTypeId", { ascending: false })
    .order("priority", { ascending: false })
    .returns<(InstructorFacilityDefault & { Facility: Facility })[]>();

  // Returner første match
  if (defaults && defaults.length > 0) {
    // Hvis vi har en serviceTypeId, prioriter den som matcher
    const specificMatch = defaults.find((d) => d.serviceTypeId === serviceTypeId);
    if (specificMatch) {
      return specificMatch.Facility;
    }
    // Ellers returner høyeste prioritet
    return defaults[0].Facility;
  }

  return null;
}

/**
 * Henter alle fasiliteter for en lokasjon
 */
export async function getFacilitiesByLocation(locationId: string): Promise<Facility[]> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("Facility")
    .select("*")
    .eq("locationId", locationId)
    .eq("isActive", true)
    .order("sortOrder", { ascending: true });

  return data || [];
}

/**
 * Henter alle aktive fasiliteter
 */
export async function getAllFacilities(): Promise<(Facility & { Location?: { id: string; name: string } })[]> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("Facility")
    .select(`
      *,
      Location:locationId(id, name)
    `)
    .eq("isActive", true)
    .order("Location(name)", { ascending: true })
    .order("sortOrder", { ascending: true })
    .returns<(Facility & { Location?: { id: string; name: string } })[]>();

  return data || [];
}

/**
 * Henter fasilitet basert på slug
 */
export async function getFacilityBySlug(slug: string): Promise<(Facility & { Location?: { id: string; name: string } }) | null> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("Facility")
    .select(`
      *,
      Location:locationId(id, name)
    `)
    .eq("slug", slug)
    .single();

  return (data as unknown as (Facility & { Location?: { id: string; name: string } }) | null);
}
