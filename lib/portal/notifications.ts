import { prisma } from "@/lib/portal/prisma";
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
  return prisma.notification.create({
    data: {
      id: nanoid(),
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      linkUrl: input.linkUrl,
    },
  });
}

export async function createNotifications(inputs: CreateNotificationInput[]) {
  return prisma.notification.createMany({
    data: inputs.map((input) => ({
      id: nanoid(),
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      linkUrl: input.linkUrl,
    })),
  });
}
