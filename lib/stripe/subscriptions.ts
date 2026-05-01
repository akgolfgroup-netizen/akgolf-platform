// VERIFY: Stripe subscription service — sentral håndtering
// Kilde: docs/superpowers/specs/2026-05-01-integrasjoner-plan.md

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-02-25.clover",
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Essensiell treningsplanlegging",
    priceMonthly: 299,
    priceYearly: 2990,
    features: [
      "Personlig treningsplan",
      "Dagbok",
      "Statistikk",
      "Kalender-synk",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Full analyse og coaching",
    priceMonthly: 599,
    priceYearly: 5990,
    features: [
      "Alt i Basic",
      "Videoanalyse",
      "Coach-agent",
      "TrackMan-integrasjon",
      "Prioritert support",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    description: "For dedikerte spillere",
    priceMonthly: 999,
    priceYearly: 9990,
    features: [
      "Alt i Pro",
      "Ukentlig coach-samtale",
      "Tilpasset utstyr",
      "Turneringsforberedelse",
      "Fysisk testbatteri",
    ],
  },
];

/** Oppretter en Stripe Checkout session for abonnement */
export async function createSubscriptionCheckout(
  customerId: string,
  planId: string,
  billingInterval: "month" | "year",
  successUrl: string,
  cancelUrl: string,
) {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error(`Ukjent plan: ${planId}`);

  const priceId = billingInterval === "month"
    ? plan.stripePriceIdMonthly
    : plan.stripePriceIdYearly;

  if (!priceId) {
    throw new Error(`Stripe price ID ikke konfigurert for ${planId}/${billingInterval}`);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: { planId, billingInterval },
    },
  });

  return session;
}

/** Håndterer Stripe webhook for subscription-events */
export async function handleSubscriptionWebhook(payload: string, signature: string) {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET ?? "",
  );

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      return {
        type: event.type,
        customerId: sub.customer as string,
        subscriptionId: sub.id,
        status: sub.status,
        planId: sub.metadata?.planId,
        billingInterval: sub.metadata?.billingInterval,
        currentPeriodStart: new Date((sub as unknown as Record<string, number>).current_period_start * 1000),
        currentPeriodEnd: new Date((sub as unknown as Record<string, number>).current_period_end * 1000),
      };
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      return {
        type: event.type,
        customerId: sub.customer as string,
        subscriptionId: sub.id,
        status: "canceled",
      };
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      return {
        type: event.type,
        customerId: invoice.customer as string,
        subscriptionId: (invoice as unknown as Record<string, unknown>).subscription as string,
        status: "payment_failed",
      };
    }

    default:
      return { type: event.type, handled: false };
  }
}

/** Oppretter eller oppdaterer Stripe customer */
export async function upsertCustomer(userId: string, email: string, name?: string) {
  // Sjekk om customer allerede finnes
  const { data: existing } = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existing.length > 0) {
    return existing[0];
  }

  return stripe.customers.create({
    email,
    name,
    metadata: { userId },
  });
}
