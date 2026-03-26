"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";

export async function getTemplates() {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) throw new Error("Ingen tilgang");

  return prisma.emailTemplate.findMany({
    orderBy: { name: "asc" },
  });
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

  const template = await prisma.emailTemplate.create({
    data: {
      name: data.name,
      subject: data.subject,
      htmlContent: data.htmlContent,
      variables: data.variables,
    },
  });

  revalidatePath("/portal/admin/e-postmaler");
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

  const template = await prisma.emailTemplate.update({
    where: { id },
    data: {
      name: data.name,
      subject: data.subject,
      htmlContent: data.htmlContent,
      variables: data.variables,
    },
  });

  revalidatePath("/portal/admin/e-postmaler");
  return template;
}

export async function deleteTemplate(id: string) {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) throw new Error("Ingen tilgang");

  await prisma.emailTemplate.delete({
    where: { id },
  });

  revalidatePath("/portal/admin/e-postmaler");
}
