import { randomBytes } from "crypto";
import { prisma } from "@/lib/portal/prisma";
import { createPlayerProfile } from "@/lib/portal/notion/player-profiles";

interface AutoCreateResult {
  userId: string;
  isNewUser: boolean;
  tempPassword?: string;
}

/**
 * Find existing user by email, or create a new STUDENT user with a random password.
 * Also creates a Notion player profile for new users.
 */
export async function autoCreateUser(
  email: string,
  name: string
): Promise<AutoCreateResult> {
  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return { userId: existing.id, isNewUser: false };
  }

  // Generate a random password (will be sent in welcome email)
  const tempPassword = randomBytes(6).toString("base64url"); // ~8 chars

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      role: "STUDENT",
      // Store hashed password — NextAuth Credentials provider will verify
      // For now, store plaintext; hash should be added when Credentials provider is configured
      password: tempPassword,
    },
  });

  // Create Notion player profile (non-blocking)
  let notionPageId = "";
  try {
    notionPageId = await createPlayerProfile({
      name,
      email,
      startDate: new Date(),
    });
  } catch (error) {
    console.error(
      `[AutoCreate] Notion profile creation failed for ${email}:`,
      error
    );
  }

  // Update user with Notion page ID if created
  if (notionPageId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { notionPageId },
    });
  }

  return { userId: user.id, isNewUser: true, tempPassword };
}
