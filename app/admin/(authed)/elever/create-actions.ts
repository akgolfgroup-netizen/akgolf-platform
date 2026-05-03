"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { autoCreateUser } from "@/lib/portal/booking/auto-create-user";

// Norsk telefonformat: aksepterer 8 siffer (auto-prefiks +47) eller +47XXXXXXXX.
// Mellomrom og bindestrek strippes før validering.
const PhoneSchema = z.string().trim().transform((v, ctx) => {
  const digits = v.replace(/[\s-]/g, "");
  if (/^\+47\d{8}$/.test(digits)) return digits;
  if (/^\d{8}$/.test(digits)) return `+47${digits}`;
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Ugyldig norsk telefonnummer (8 siffer eller +47XXXXXXXX)",
  });
  return z.NEVER;
});

const CreateStudentSchema = z.object({
  name: z.string().trim().min(2, "Navn må være minst 2 tegn"),
  phone: PhoneSchema,
  email: z
    .string()
    .trim()
    .email("Ugyldig e-postadresse")
    .optional()
    .or(z.literal("")),
});

export type CreateStudentInput = z.input<typeof CreateStudentSchema>;
export type CreateStudentResult = {
  userId: string;
  isNewUser: boolean;
  tempPassword?: string;
};

/**
 * Opprett ny User med STUDENT-rolle.
 * - Med email: gjenbruker autoCreateUser (sjekker eksisterende, genererer bcrypt-passord, oppretter Notion-profil).
 * - Uten email: oppretter direkte i Prisma uten passord. Innlogging kan settes opp senere.
 */
export async function createStudent(
  input: CreateStudentInput
): Promise<CreateStudentResult> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const parsed = CreateStudentSchema.parse(input);
  const emailLower = parsed.email ? parsed.email.toLowerCase() : null;

  if (emailLower) {
    const result = await autoCreateUser(emailLower, parsed.name, parsed.phone);
    revalidatePath("/admin/elever");
    return result;
  }

  const id = randomUUID();
  await prisma.user.create({
    data: {
      id,
      name: parsed.name,
      phone: parsed.phone,
      role: "STUDENT",
      subscriptionTier: "VISITOR",
      isActive: true,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/admin/elever");
  return { userId: id, isNewUser: true };
}
