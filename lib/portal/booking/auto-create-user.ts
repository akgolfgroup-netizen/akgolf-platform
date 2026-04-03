import { randomBytes, randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/portal/prisma";
import { createPlayerProfile } from "@/lib/portal/notion/player-profiles";
import { logger } from "@/lib/logger";

interface AutoCreateResult {
  userId: string;
  isNewUser: boolean;
  tempPassword?: string;
}

const SALT_ROUNDS = 12;

/**
 * Find existing user by email, or create a new STUDENT user with a hashed password.
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
  
  // Hash the password with bcrypt
  const hashedPassword = await bcrypt.hash(tempPassword, SALT_ROUNDS);

  // Create user with hashed password
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      email,
      name,
      role: "STUDENT",
      password: hashedPassword,
      updatedAt: new Date(),
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
    logger.error(`[AutoCreate] Notion profile creation failed for ${email}:`, error);
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

/**
 * Verify a password against a hashed password.
 * Used by NextAuth Credentials provider.
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
