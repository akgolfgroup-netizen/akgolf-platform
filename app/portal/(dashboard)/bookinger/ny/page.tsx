import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { BookCoachingForm } from "./book-coaching-form";

export default async function NyBookingPage() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();

  const { data: serviceTypes } = await supabase
    .from("ServiceType")
    .select(`
      *,
      Instructor:InstructorServiceType(
        Instructor:instructorId(
          id,
          title,
          User:userId(name, image)
        )
      )
    `)
    .eq("isActive", true)
    .eq("isPublic", true)
    .order("sortOrder", { ascending: true });

  // Transform the nested data structure
  const transformedServiceTypes = (serviceTypes ?? []).map((st) => ({
    ...st,
    Instructor: (st.Instructor ?? []).map((inst: { 
      Instructor: { 
        id: string; 
        title: string; 
        User: { name: string; image: string } 
      } 
    }) => ({
      id: inst.Instructor.id,
      title: inst.Instructor.title,
      User: inst.Instructor.User,
    })),
  }));

  return (
    <div className="p-6 max-w-2xl">
      <BookCoachingForm serviceTypes={transformedServiceTypes} />
    </div>
  );
}
