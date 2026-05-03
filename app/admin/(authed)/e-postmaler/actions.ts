"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function getTemplates() {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) throw new Error("Ingen tilgang");

  const supabase = createServiceClient();

  const { data: templates } = await supabase
    .from("EmailTemplate")
    .select("*")
    .order("name", { ascending: true });

  return templates || [];
}

export async function createTemplate(data: {
  name: string;
  subject: string;
  htmlContent: string;
  variables: string[];
}) {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) throw new Error("Ingen tilgang");

  if (!data.name || !data.subject) {
    throw new Error("Navn og emne er obligatorisk");
  }

  const supabase = createServiceClient();

  const { data: template } = await supabase
    .from("EmailTemplate")
    .insert({
      id: nanoid(),
      updatedAt: new Date().toISOString(),
      name: data.name,
      subject: data.subject,
      htmlContent: data.htmlContent,
      variables: data.variables,
    })
    .select()
    .single();

  revalidatePath("/admin/e-postmaler");
  return template;
}

export async function updateTemplate(
  id: string,
  data: {
    name?: string;
    subject?: string;
    htmlContent?: string;
    variables?: string[];
  }
) {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) throw new Error("Ingen tilgang");

  const supabase = createServiceClient();

  const { data: template } = await supabase
    .from("EmailTemplate")
    .update({
      name: data.name,
      subject: data.subject,
      htmlContent: data.htmlContent,
      variables: data.variables,
    })
    .eq("id", id)
    .select()
    .single();

  revalidatePath("/admin/e-postmaler");
  return template;
}

export async function deleteTemplate(id: string) {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) throw new Error("Ingen tilgang");

  const supabase = createServiceClient();

  await supabase.from("EmailTemplate").delete().eq("id", id);

  revalidatePath("/admin/e-postmaler");
}
