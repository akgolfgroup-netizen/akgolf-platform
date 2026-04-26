export const FACILITIES = [
  "Driving Range",
  "Performance Studio",
  "Putting Green",
  "Short Game Area",
  "Korthullsbane",
] as const;

export type FacilityName = (typeof FACILITIES)[number];

/** Soner synlige som klikkbare polygoner på flyfoto-kartet. Korthullsbane vises off-map. */
export const ON_MAP_FACILITIES: FacilityName[] = [
  "Driving Range",
  "Performance Studio",
  "Putting Green",
  "Short Game Area",
];

export const ACTIVITY_TYPES = [
  "Trening",
  "Coaching",
  "Turnering",
  "Event",
  "Vedlikehold",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const FACILITY_CAPACITY: Record<FacilityName, number> = {
  "Driving Range": 14,
  "Performance Studio": 4,
  "Putting Green": 8,
  "Short Game Area": 6,
  Korthullsbane: 12,
};

export interface FacilityBookingDTO {
  id: string;
  facility: string;
  person: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  userId: string | null;
  createdAt: string;
}

export interface CreateFacilityBookingInput {
  facility: FacilityName;
  person: string;
  type: ActivityType;
  date: string;
  startTime: string;
  durationMinutes: number;
}

export interface LiveStatus {
  facility: FacilityName;
  activeNow: number;
  nextStart: string | null;
  nextPerson: string | null;
}
