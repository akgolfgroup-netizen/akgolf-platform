// TODO: koble til ekte data
// - facilities: prisma.facility.findMany() med relasjon til Equipment + Bookings
// - utilization: aggregat fra FacilityBooking siste 7/30 dager
// - nextSlot: lib/portal/booking/available-slots for facility
// - equipment: prisma.facilityEquipment med kalibrering/SN/status

export type EquipmentStatus = "ok" | "due" | "warn";
export type FacilityState = "live-i-bruk" | "ledig";

export type EquipIcon =
  | "radar"
  | "camera"
  | "monitor"
  | "wifi"
  | "circle-dot"
  | "square"
  | "bluetooth";

export interface Equipment {
  icon: EquipIcon;
  name: string;
  meta?: string;
  status: EquipmentStatus;
  statusLabel: string;
}

export interface FacilityCardData {
  id: string;
  state: FacilityState;
  badgeText: string;
  location: string;
  title: string;
  utilization: number; // 0-100
  utilColor?: string; // override for non-accent
  bookingsMonth: string;
  nextSlot: string;
  nextSlotLabel: string;
  equipment: Equipment[];
}

export const FACILITIES: FacilityCardData[] = [
  {
    id: "bogstad-bay-04",
    state: "live-i-bruk",
    badgeText: "● LIVE · I BRUK",
    location: "BOGSTAD GK · BAY 04",
    title: "Outdoor Trackman bay",
    utilization: 94,
    bookingsMonth: "68",
    nextSlot: "17:30",
    nextSlotLabel: "Neste ledig",
    equipment: [
      {
        icon: "radar",
        name: "Trackman 4",
        meta: "SN: TM-4-2810 · KALIBRERT 12. APR",
        status: "ok",
        statusLabel: "OK",
      },
      {
        icon: "camera",
        name: "Foresight GCQuad-cam",
        meta: "1080p · 30 FPS",
        status: "ok",
        statusLabel: "OK",
      },
      {
        icon: "monitor",
        name: "55\" 4K skjerm",
        meta: "SAMSUNG · 2023",
        status: "ok",
        statusLabel: "OK",
      },
      {
        icon: "wifi",
        name: "Studio WiFi 5G",
        meta: "BANDBREDDE 600 Mbps",
        status: "ok",
        statusLabel: "OK",
      },
    ],
  },
  {
    id: "skullerud-studio-b",
    state: "ledig",
    badgeText: "LEDIG NÅ",
    location: "SKULLERUD INDOOR · STUDIO B",
    title: "Quintic putting-lab",
    utilization: 68,
    utilColor: "#6BB1FF",
    bookingsMonth: "42",
    nextSlot: "15:00",
    nextSlotLabel: "Neste økt",
    equipment: [
      {
        icon: "circle-dot",
        name: "Quintic Ball Roll",
        meta: "SN: QBR-1144 · KAL 8. MAR",
        status: "due",
        statusLabel: "KAL DUE",
      },
      {
        icon: "camera",
        name: "Highspeed putting-cam",
        meta: "240 FPS",
        status: "ok",
        statusLabel: "OK",
      },
      {
        icon: "square",
        name: "Wellputt-matte L",
        status: "ok",
        statusLabel: "OK",
      },
      {
        icon: "monitor",
        name: "75\" PuttView projector",
        meta: "FULL HD · 144 HZ",
        status: "ok",
        statusLabel: "OK",
      },
    ],
  },
  {
    id: "bogstad-bay-02",
    state: "live-i-bruk",
    badgeText: "● LIVE · I BRUK",
    location: "BOGSTAD GK · BAY 02",
    title: "Outdoor Trackman bay",
    utilization: 88,
    bookingsMonth: "61",
    nextSlot: "18:00",
    nextSlotLabel: "Neste ledig",
    equipment: [
      {
        icon: "radar",
        name: "Trackman 4",
        meta: "SN: TM-4-1907",
        status: "ok",
        statusLabel: "OK",
      },
      { icon: "camera", name: "Side-cam HD", status: "warn", statusLabel: "FOKUS" },
      { icon: "monitor", name: "43\" skjerm", status: "ok", statusLabel: "OK" },
      {
        icon: "square",
        name: "Range-matter (4x)",
        meta: "FILA · 2024",
        status: "ok",
        statusLabel: "OK",
      },
    ],
  },
  {
    id: "holtsmark-coaching",
    state: "ledig",
    badgeText: "LEDIG NÅ",
    location: "HOLTSMARK GK · COACHING-BAY",
    title: "Mobil coaching-rigg",
    utilization: 42,
    utilColor: "#E8B967",
    bookingsMonth: "14",
    nextSlot: "FRE 10:00",
    nextSlotLabel: "Neste økt",
    equipment: [
      {
        icon: "radar",
        name: "Mobil Trackman",
        meta: "BÆRBAR · M/STATIV",
        status: "ok",
        statusLabel: "OK",
      },
      {
        icon: "camera",
        name: "iPhone 14 Pro · cam-rigg",
        status: "ok",
        statusLabel: "OK",
      },
      { icon: "bluetooth", name: "Hotspot 5G", status: "ok", statusLabel: "OK" },
    ],
  },
];
