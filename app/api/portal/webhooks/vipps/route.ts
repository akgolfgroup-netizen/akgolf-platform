import { NextResponse } from "next/server";

// Stub — Vipps eCommerce v2 callbacks are delivered to
// /api/webhooks/vipps/v2/payments/{orderId} (see [orderId]/route.ts).
// This route exists only to handle any stray requests to the prefix path.
export async function POST(req: Request) {
  const body = await req.text().catch(() => "(unreadable)");
  console.warn("[Vipps Webhook] Stray POST to prefix path (expected /v2/payments/{orderId}):", body.slice(0, 200));
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
