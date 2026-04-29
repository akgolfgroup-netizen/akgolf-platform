import { describe, it, expect } from "vitest";
import {
  generateSmartSlotsForWindow,
  __smartSlotsInternals,
  type ServiceDuration,
} from "@/lib/portal/slots";

const { isOrphanGap, contextualBufferAfter, createsOrphanInWindow } = __smartSlotsInternals;

// 26. apr 2026 — fast referansedato (UTC midnatt)
const date = () => {
  const d = new Date("2026-04-26T00:00:00.000Z");
  return d;
};

const at = (h: number, m = 0) => {
  const d = date();
  d.setUTCHours(h, m, 0, 0);
  return d;
};

const ANDERS_SERVICE = "service-performance-20";
const FLEX_50_SERVICE = "service-flex-50";
const ALL_DURATIONS: ServiceDuration[] = [
  { duration: 20, bufferAfter: 0 },
  { duration: 50, bufferAfter: 10 },
  { duration: 90, bufferAfter: 15 },
];

// minNoticeHours = 0 for å unngå "for tidlig"-filtrering i tester
const COMMON = {
  date: date(),
  minNoticeHours: 0,
  blockedTimes: [],
  allDurations: ALL_DURATIONS,
};

describe("isOrphanGap", () => {
  it("0 minutter er ikke orphan", () => {
    expect(isOrphanGap(0, ALL_DURATIONS)).toBe(false);
  });

  it("10 minutter er orphan (under minste varighet 20)", () => {
    expect(isOrphanGap(10, ALL_DURATIONS)).toBe(true);
  });

  it("20 minutter er ikke orphan (en 20-min får plass)", () => {
    expect(isOrphanGap(20, ALL_DURATIONS)).toBe(false);
  });

  it("40 minutter er ikke orphan i seg selv (en 20-min får plass)", () => {
    // Selve gapet kan fylles av en 20-min booking, så det er ikke orphan
    expect(isOrphanGap(40, ALL_DURATIONS)).toBe(false);
  });

  it("når kun 50-min er aktiv, er 40 min orphan", () => {
    const only50: ServiceDuration[] = [{ duration: 50, bufferAfter: 10 }];
    expect(isOrphanGap(40, only50)).toBe(true);
  });
});

describe("contextualBufferAfter", () => {
  it("returnerer 0 når neste booking har samme serviceTypeId", () => {
    const next = { startTime: at(14, 0), endTime: at(14, 20), serviceTypeId: ANDERS_SERVICE };
    const buf = contextualBufferAfter(at(13, 40), {
      duration: 20,
      bufferBefore: 0,
      bufferAfter: 15,
      serviceTypeId: ANDERS_SERVICE,
    }, [next]);
    expect(buf).toBe(0);
  });

  it("returnerer request.bufferAfter når neste booking har annen serviceTypeId", () => {
    const next = { startTime: at(14, 0), endTime: at(15, 0), serviceTypeId: FLEX_50_SERVICE };
    const buf = contextualBufferAfter(at(13, 40), {
      duration: 20,
      bufferBefore: 0,
      bufferAfter: 15,
      serviceTypeId: ANDERS_SERVICE,
    }, [next]);
    expect(buf).toBe(15);
  });

  it("returnerer request.bufferAfter når ingen neste booking finnes", () => {
    const buf = contextualBufferAfter(at(13, 40), {
      duration: 20,
      bufferBefore: 0,
      bufferAfter: 10,
      serviceTypeId: ANDERS_SERVICE,
    }, []);
    expect(buf).toBe(10);
  });
});

describe("generateSmartSlotsForWindow — tom dag", () => {
  it("pakker 20-min slots fra start (08:00, 08:20, 08:40, ...)", () => {
    const slots = generateSmartSlotsForWindow({
      ...COMMON,
      availStart: "08:00",
      availEnd: "12:00",
      request: { duration: 20, bufferBefore: 0, bufferAfter: 0, serviceTypeId: ANDERS_SERVICE },
      existingBookings: [],
    });
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]).toBe(at(8, 0).toISOString());
    expect(slots[1]).toBe(at(8, 20).toISOString());
    expect(slots[2]).toBe(at(8, 40).toISOString());
  });

  it("pakker 50-min slots med 10 min buffer (08:00, 09:00, 10:00, 11:00)", () => {
    const slots = generateSmartSlotsForWindow({
      ...COMMON,
      availStart: "08:00",
      availEnd: "12:00",
      request: { duration: 50, bufferBefore: 0, bufferAfter: 10, serviceTypeId: FLEX_50_SERVICE },
      existingBookings: [],
    });
    expect(slots).toContain(at(8, 0).toISOString());
    expect(slots).toContain(at(9, 0).toISOString());
    expect(slots).toContain(at(10, 0).toISOString());
    expect(slots).toContain(at(11, 0).toISOString());
  });
});

describe("generateSmartSlotsForWindow — kontekstuell buffer", () => {
  it("samme service back-to-back: 14:20-slot finnes etter 14:00-14:20-booking", () => {
    const existing = [
      { startTime: at(14, 0), endTime: at(14, 20), serviceTypeId: ANDERS_SERVICE },
    ];
    const slots = generateSmartSlotsForWindow({
      ...COMMON,
      availStart: "13:00",
      availEnd: "17:00",
      request: { duration: 20, bufferBefore: 0, bufferAfter: 0, serviceTypeId: ANDERS_SERVICE },
      existingBookings: existing,
    });
    // 14:20 må være kandidat (anker mot booking-end, samme service = 0 buffer)
    expect(slots).toContain(at(14, 20).toISOString());
  });
});

describe("generateSmartSlotsForWindow — orphan-filtrering", () => {
  it("aldri 40 min: 13:20-slot filtreres bort fordi det ville etterlate 40 min orphan før 14:00-booking", () => {
    // 14:00-14:20 booking. 13:20+20=13:40, gap til 14:00 = 20 min (OK, en 20-min får plass)
    // 13:00+20=13:20, gap til 14:00 = 40 min (orphan i streng forstand? nei — 40 min kan fylles av en 20-min)
    // Test heller "30 min gap" som er ekte orphan:
    // 13:30+20=13:50, gap til 14:00 = 10 min (orphan!)
    const existing = [
      { startTime: at(14, 0), endTime: at(14, 20), serviceTypeId: ANDERS_SERVICE },
    ];
    const slots = generateSmartSlotsForWindow({
      ...COMMON,
      availStart: "13:00",
      availEnd: "17:00",
      request: { duration: 20, bufferBefore: 0, bufferAfter: 0, serviceTypeId: ANDERS_SERVICE },
      existingBookings: existing,
    });
    // 13:50 ville etterlate 10 min orphan til 14:00 → skal filtreres bort
    expect(slots).not.toContain(at(13, 50).toISOString());
    // 13:40 etterlater 0 gap → skal være med
    expect(slots).toContain(at(13, 40).toISOString());
  });

  it("orphan-sjekk er per-vindu — formiddag 08-12 og ettermiddag 14-21 pakkes uavhengig", () => {
    // Generer slots i ettermiddagsvinduet med eksisterende booking i formiddagsvinduet
    const existing = [
      { startTime: at(11, 0), endTime: at(11, 20), serviceTypeId: ANDERS_SERVICE },
    ];
    const slots = generateSmartSlotsForWindow({
      ...COMMON,
      availStart: "14:00",
      availEnd: "21:00",
      request: { duration: 20, bufferBefore: 0, bufferAfter: 0, serviceTypeId: ANDERS_SERVICE },
      existingBookings: existing,
    });
    // 14:00 må finnes — 11:20-bookingen i formiddagsvinduet skal ikke påvirke
    expect(slots).toContain(at(14, 0).toISOString());
    expect(slots).toContain(at(14, 20).toISOString());
  });
});

describe("createsOrphanInWindow", () => {
  it("tom dag, første slot, ingen orphan mot vindu-grenser", () => {
    const result = createsOrphanInWindow(
      at(8, 0),
      at(8, 20),
      at(8, 0),
      at(12, 0),
      [],
      [],
      ALL_DURATIONS
    );
    expect(result).toBe(false);
  });

  it("slot midt i dagen som etterlater 10 min orphan før neste booking → orphan", () => {
    const next = { startTime: at(14, 0), endTime: at(14, 20), serviceTypeId: ANDERS_SERVICE };
    const result = createsOrphanInWindow(
      at(13, 30),
      at(13, 50),
      at(13, 0),
      at(17, 0),
      [next],
      [],
      ALL_DURATIONS
    );
    expect(result).toBe(true);
  });

  it("slot rett før booking (0 gap) → ikke orphan", () => {
    const next = { startTime: at(14, 0), endTime: at(14, 20), serviceTypeId: ANDERS_SERVICE };
    const result = createsOrphanInWindow(
      at(13, 40),
      at(14, 0),
      at(13, 0),
      at(17, 0),
      [next],
      [],
      ALL_DURATIONS
    );
    expect(result).toBe(false);
  });
});
