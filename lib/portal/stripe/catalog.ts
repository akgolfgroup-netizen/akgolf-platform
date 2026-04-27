/**
 * Stripe-katalog for coaching-tjenester (Fase C).
 *
 * Brukes når en coach lager en ny tjeneste i CoachHQ. Oppretter Stripe Product
 * og tilhørende Price (recurring eller one-time). Lagrer ID-ene på ServiceType
 * slik at booking-flyten kan referere prisen direkte i Checkout.
 *
 * For Performance + Performance Pro: recurring (interval=month).
 * For alt annet (Flex, On-Course, Foundation Test, First Tee, etc.): one-time.
 */

import { stripe } from "@/lib/portal/stripe";
import { logger } from "@/lib/logger";

export interface CreateStripeProductInput {
  name: string;
  description?: string;
  /** Pris i HELE kroner (DB-format). Konverteres til øre internt. */
  priceKr: number;
  isRecurring: boolean;
  /** "month" eller "year". Ignoreres hvis !isRecurring. */
  recurringInterval?: "month" | "year";
}

export interface StripeProductResult {
  productId: string;
  priceId: string;
}

/**
 * Opprett Stripe Product + Price.
 * Idempotent på navn — hvis et Product med samme navn allerede finnes,
 * gjenbruker vi det og lager bare ny Price.
 */
export async function createStripeServiceProduct(
  input: CreateStripeProductInput,
): Promise<StripeProductResult> {
  const { name, description, priceKr, isRecurring, recurringInterval } = input;

  if (priceKr < 0) {
    throw new Error("Pris kan ikke være negativ");
  }
  if (isRecurring && !recurringInterval) {
    throw new Error("Recurring-tjeneste krever recurringInterval");
  }

  // 1. Søk etter eksisterende product med samme navn (idempotency)
  const search = await stripe.products.search({
    query: `name:'${name.replace(/'/g, "\\'")}' AND active:'true'`,
    limit: 1,
  });

  let productId: string;
  if (search.data.length > 0) {
    productId = search.data[0].id;
    logger.info(`[stripe-catalog] Reusing existing product ${productId} for "${name}"`);
  } else {
    const product = await stripe.products.create({
      name,
      description: description?.slice(0, 500),
      metadata: { source: "akgolf-coachhq" },
    });
    productId = product.id;
    logger.info(`[stripe-catalog] Created product ${productId} for "${name}"`);
  }

  // 2. Lag ny Price (vi gjenbruker ikke eksisterende prices — da blir
  // historikk-amounts feil hvis coach senere endrer pris).
  const priceParams: import("stripe").Stripe.PriceCreateParams = {
    product: productId,
    currency: "nok",
    unit_amount: Math.round(priceKr * 100),
    metadata: { source: "akgolf-coachhq" },
  };

  if (isRecurring) {
    priceParams.recurring = { interval: recurringInterval ?? "month" };
  }

  const price = await stripe.prices.create(priceParams);
  logger.info(`[stripe-catalog] Created price ${price.id} for product ${productId}`);

  return { productId, priceId: price.id };
}

/**
 * Arkiver en Stripe Price (sett active=false). Brukes når coach endrer pris
 * på en eksisterende tjeneste — gammel Price arkiveres, ny opprettes og kobles.
 */
export async function archiveStripePrice(priceId: string): Promise<void> {
  try {
    await stripe.prices.update(priceId, { active: false });
    logger.info(`[stripe-catalog] Archived price ${priceId}`);
  } catch (err) {
    logger.error(`[stripe-catalog] Failed to archive price ${priceId}`, err);
  }
}

/**
 * Arkiver et Stripe Product (sett active=false). Brukes når en tjeneste
 * deaktiveres permanent.
 */
export async function archiveStripeProduct(productId: string): Promise<void> {
  try {
    await stripe.products.update(productId, { active: false });
    logger.info(`[stripe-catalog] Archived product ${productId}`);
  } catch (err) {
    logger.error(`[stripe-catalog] Failed to archive product ${productId}`, err);
  }
}
