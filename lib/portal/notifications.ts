import { createServiceClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import type { NotificationType } from "@prisma/client";

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
}

export async function createNotification(input: CreateNotificationInput) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from("Notification")
    .insert({
      id: nanoid(),
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      linkUrl: input.linkUrl,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function createNotifications(inputs: CreateNotificationInput[]) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from("Notification")
    .insert(
      inputs.map((input) => ({
        id: nanoid(),
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        linkUrl: input.linkUrl,
      }))
    )
    .select();
  
  if (error) throw error;
  return data;
}
