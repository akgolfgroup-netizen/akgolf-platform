"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { logger } from "@/lib/logger";
import {
  createStripeServiceProduct,
  archiveStripePrice,
} from "@/lib/portal/stripe/catalog";
import type { ServiceCategory } from "@prisma/client";

export interface ServiceTypeRow {
  id: string;
  name: string;
  description: string | null;
  category: ServiceCategory;
  duration: number;
  price: number;
  isActive: boolean;
  isPublic: boolean;
  isRecurring: boolean;
  recurringInterval: string | null;
  stripeProductId: string | null;
  stripePriceId: string | null;
  bufferAfter: number;
  bufferBefore: number;
  minNoticeHours: number;
  maxAdvanceDays: number;
  allowStripe: boolean;
  allowVipps: boolean;
  allowInvoice: boolean;
  sortOrder: number;
  createdAt: Date;
}

export async function listServiceTypes(): Promise<ServiceTypeRow[]> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const rows = await prisma.serviceType.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return rows as ServiceTypeRow[];
}

export interface CreateServiceTypeInput {
  name: string;
  description?: string;
  category: ServiceCategory;
  duration: number;
  priceKr: number;
  isRecurring: boolean;
  recurringInterval?: "month" | "year";
  isPublic?: boolean;
  bufferAfter?: number;
  bufferBefore?: number;
  minNoticeHours?: number;
  maxAdvanceDays?: number;
  allowStripe?: boolean;
  allowVipps?: boolean;
  allowInvoice?: boolean;
}

/**
 * Opprett ny ServiceType + tilhørende Stripe Product/Price.
 * Hvis Stripe feiler, opprettes ikke ServiceType (atomisk).
 */
export async function createServiceType(
  input: CreateServiceTypeInput,
): Promise<{ id: string }> {
  const user = await requirePortalUser();
  if (!user?.id || user.role !== "ADMIN") {
    throw new Error("Kun admin kan opprette nye tjenester");
  }

  if (!input.name.trim()) throw new Error("Navn kreves");
  if (input.duration <= 0) throw new Error("Varighet må være større enn 0");
  if (input.priceKr < 0) throw new Error("Pris kan ikke være negativ");
  if (input.isRecurring && !input.recurringInterval) {
    throw new Error("Recurring-tjeneste krever interval (month/year)");
  }

  // 1. Opprett Stripe Product + Price først (atomisk: hvis dette feiler, abort)
  let stripe;
  try {
    stripe = await createStripeServiceProduct({
      name: input.name.trim(),
      description: input.description?.trim(),
      priceKr: input.priceKr,
      isRecurring: input.isRecurring,
      recurringInterval: input.recurringInterval,
    });
  } catch (err) {
    logger.error("[createServiceType] Stripe failed", err);
    throw new Error(
      `Kunne ikke opprette Stripe-katalog: ${
        err instanceof Error ? err.message : "ukjent feil"
      }`,
    );
  }

  // 2. Opprett DB-record
  const id = randomUUID();
  await prisma.serviceType.create({
    data: {
      id,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      category: input.category,
      duration: input.duration,
      price: Math.round(input.priceKr),
      isActive: true,
      isPublic: input.isPublic ?? true,
      isRecurring: input.isRecurring,
      recurringInterval: input.isRecurring
        ? input.recurringInterval ?? "month"
        : null,
      stripeProductId: stripe.productId,
      stripePriceId: stripe.priceId,
      bufferBefore: input.bufferBefore ?? 0,
      bufferAfter: input.bufferAfter ?? 15,
      minNoticeHours: input.minNoticeHours ?? 24,
      maxAdvanceDays: input.maxAdvanceDays ?? 60,
      allowStripe: input.allowStripe ?? true,
      allowVipps: input.allowVipps ?? true,
      allowInvoice: input.allowInvoice ?? false,
      sortOrder: 0,
      vatRate: 0,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/tjenester");
  updateTag("services");
  return { id };
}

export interface UpdateServiceTypeInput {
  id: string;
  name?: string;
  description?: string;
  duration?: number;
  priceKr?: number;
  isPublic?: boolean;
  isActive?: boolean;
  bufferAfter?: number;
  bufferBefore?: number;
  minNoticeHours?: number;
  maxAdvanceDays?: number;
  allowStripe?: boolean;
  allowVipps?: boolean;
  allowInvoice?: boolean;
}

/**
 * Oppdater ServiceType. Hvis pris endres → arkivér gammel Stripe Price + opprett ny.
 * Stripe Product gjenbrukes.
 */
export async function updateServiceType(
  input: UpdateServiceTypeInput,
): Promise<void> {
  const user = await requirePortalUser();
  if (!user?.id || user.role !== "ADMIN") {
    throw new Error("Kun admin kan endre tjenester");
  }

  const existing = await prisma.serviceType.findUnique({
    where: { id: input.id },
  });
  if (!existing) throw new Error("Tjeneste ikke funnet");

  let newStripePriceId: string | undefined;
  const priceChanged =
    input.priceKr !== undefined && input.priceKr !== existing.price;

  if (priceChanged && existing.stripeProductId) {
    // Arkivér gammel Price (best effort)
    if (existing.stripePriceId) {
      await archiveStripePrice(existing.stripePriceId);
    }
    // Lag ny Price på samme Product
    const stripe = await createStripeServiceProduct({
      name: input.name?.trim() || existing.name,
      description: input.description?.trim() || existing.description || undefined,
      priceKr: input.priceKr ?? existing.price,
      isRecurring: existing.isRecurring,
      recurringInterval:
        existing.recurringInterval === "year" ? "year" : "month",
    });
    newStripePriceId = stripe.priceId;
  }

  await prisma.serviceType.update({
    where: { id: input.id },
    data: {
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.description !== undefined && {
        description: input.description.trim() || null,
      }),
      ...(input.duration !== undefined && { duration: input.duration }),
      ...(input.priceKr !== undefined && { price: Math.round(input.priceKr) }),
      ...(input.isPublic !== undefined && { isPublic: input.isPublic }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.bufferAfter !== undefined && { bufferAfter: input.bufferAfter }),
      ...(input.bufferBefore !== undefined && {
        bufferBefore: input.bufferBefore,
      }),
      ...(input.minNoticeHours !== undefined && {
        minNoticeHours: input.minNoticeHours,
      }),
      ...(input.maxAdvanceDays !== undefined && {
        maxAdvanceDays: input.maxAdvanceDays,
      }),
      ...(input.allowStripe !== undefined && { allowStripe: input.allowStripe }),
      ...(input.allowVipps !== undefined && { allowVipps: input.allowVipps }),
      ...(input.allowInvoice !== undefined && {
        allowInvoice: input.allowInvoice,
      }),
      ...(newStripePriceId && { stripePriceId: newStripePriceId }),
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/tjenester");
  updateTag("services");
}
