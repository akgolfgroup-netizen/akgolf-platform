import { randomBytes, randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { createServiceClient } from "@/lib/supabase/server";
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
  const supabase = createServiceClient();
  
  // Check if user already exists
  const { data: existing, error: existingError } = await supabase
    .from("User")
    .select("id")
    .eq("email", email)
    .single();

  if (existingError && existingError.code !== "PGRST116") {
    logger.error(`[AutoCreate] Error fetching user:`, existingError);
  }

  if (existing) {
    return { userId: existing.id, isNewUser: false };
  }

  // Generate a random password (will be sent in welcome email)
  const tempPassword = randomBytes(6).toString("base64url"); // ~8 chars
  
  // Hash the password with bcrypt
  const hashedPassword = await bcrypt.hash(tempPassword, SALT_ROUNDS);

  // Create user with hashed password
  const { data: user, error: createError } = await supabase
    .from("User")
    .insert({
      id: randomUUID(),
      email,
      name,
      role: "STUDENT",
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (createError || !user) {
    logger.error(`[AutoCreate] Failed to create user:`, createError);
    throw createError || new Error("Failed to create user");
  }

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
    const { error: updateError } = await supabase
      .from("User")
      .update({ notionPageId })
      .eq("id", user.id);
    
    if (updateError) {
      logger.error(`[AutoCreate] Failed to update user with notionPageId:`, updateError);
    }
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
