import { describe, it, expect } from "vitest";
import { buildRefundIdempotencyKey } from "@/lib/portal/booking/refund-idempotency";

describe("buildRefundIdempotencyKey", () => {
  it("returnerer samme key for samme input", () => {
    const a = buildRefundIdempotencyKey("booking_123", 50000);
    const b = buildRefundIdempotencyKey("booking_123", 50000);
    expect(a).toBe(b);
  });

  it("returnerer ulik key for ulik bookingId", () => {
    const a = buildRefundIdempotencyKey("booking_123", 50000);
    const b = buildRefundIdempotencyKey("booking_456", 50000);
    expect(a).not.toBe(b);
  });

  it("returnerer ulik key for ulik amount (delvis vs full refund)", () => {
    const full = buildRefundIdempotencyKey("booking_123", 50000);
    const partial = buildRefundIdempotencyKey("booking_123", 25000);
    expect(full).not.toBe(partial);
  });

  it("har refund-prefix", () => {
    const key = buildRefundIdempotencyKey("booking_123", 50000);
    expect(key.startsWith("refund-")).toBe(true);
  });

  it("er deterministisk — ikke tidsbasert (Date.now-uavhengig)", () => {
    const a = buildRefundIdempotencyKey("booking_x", 1000);
    const sleep = new Promise((resolve) => setTimeout(resolve, 5));
    return sleep.then(() => {
      const b = buildRefundIdempotencyKey("booking_x", 1000);
      expect(a).toBe(b);
    });
  });
});
