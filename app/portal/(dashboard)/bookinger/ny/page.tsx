import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { PortalBookingWizard } from "./portal-booking-wizard";

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

  // Transform the nested Supabase structure to BookingServiceType[]
  const services = (serviceTypes ?? []).map((st) => ({
    id: st.id,
    name: st.name,
    description: st.description,
    category: st.category,
    duration: st.duration,
    price: st.price,
    color: st.color,
    maxStudents: st.maxStudents,
    instructors: (st.Instructor ?? []).map((inst: {
      Instructor: {
        id: string;
        title: string;
        User: { name: string; image: string };
      };
    }) => ({
      id: inst.Instructor.id,
      title: inst.Instructor.title,
      user: inst.Instructor.User,
    })),
  }));

  return (
    <div className="p-6 max-w-2xl">
      <PortalBookingWizard services={services} />
    </div>
  );
}
