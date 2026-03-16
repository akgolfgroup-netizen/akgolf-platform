import { createServerSupabase } from "@/lib/supabase/server";
import { prisma } from "@/lib/portal/prisma";
import { redirect } from "next/navigation";

export type PortalUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  subscriptionTier: string;
};

export async function getPortalUser(): Promise<PortalUser | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser?.email) return null;

  // Try to find by supabaseId first, then by email
  let user = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      subscriptionTier: true,
    },
  });

  if (!user) {
    // First login — link Supabase identity to existing Prisma user by email
    user = await prisma.user.findUnique({
      where: { email: supabaseUser.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        subscriptionTier: true,
      },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { supabaseId: supabaseUser.id },
      });
    }
  }

  if (!user || !user.email) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    subscriptionTier: user.subscriptionTier,
  };
}

export async function requirePortalUser(): Promise<PortalUser> {
  const user = await getPortalUser();
  if (!user) {
    redirect("/portal/login");
  }
  return user;
}
