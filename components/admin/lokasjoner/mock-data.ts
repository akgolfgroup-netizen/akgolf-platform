// TODO: koble til ekte data
// - prisma.location.findMany med facility-relasjoner
// - belegg-uke aggregert fra Booking siste 7 dager
// - sesong-status fra Location.season-felt eller dato-grenser
// - kart-pinner fra Location.lat/lng (nå hardkodet pixel-percentages mot mockup)

export type LocationKind = "PRIMAER" | "PARTNER" | "INDOOR";

export type LocationStat = {
  label: string;
  value: string;
};

export type LocationCard = {
  id: string;
  kind: LocationKind;
  photoLabel: string;
  name: string;
  address: string;
  description: string;
  features: string[];
  bottom: LocationStat[];
};

export type MapPin = {
  id: string;
  label: string;
  variant: "primaer" | "partner" | "indoor";
  top: string;
  left: string;
};

export const LOCATIONS_LIST: LocationCard[] = [
  {
    id: "bogstad",
    kind: "PRIMAER",
    photoLabel: "BOGSTAD GK · DRIVING RANGE",
    name: "Bogstad Golfklubb",
    address: "SØRKEDALSVEIEN 815 · 0758 OSLO",
    description:
      "Hovedsete for utendørs coaching. Driving range med 18 bays, putting-green, short-game-area, banetilgang for medlemmer og inviterte juniorer.",
    features: ["18 BAYS", "TRACKMAN 2x", "PUTTING-GREEN", "SHORT-GAME", "18 HULL"],
    bottom: [
      { label: "Bays", value: "18" },
      { label: "Belegg uke", value: "81%" },
      { label: "Sesong", value: "APR–OKT" },
    ],
  },
  {
    id: "skullerud",
    kind: "INDOOR",
    photoLabel: "SKULLERUD INDOOR STUDIO",
    name: "Skullerud Indoor Studio",
    address: "SKULLERUDVEIEN 27 · 0686 OSLO",
    description:
      "Heldekkende vintersesong-studio. Trackman 4 + Quintic putting-rig. Brukes til video-analyse, instrumented testing, kvelds-økter hele året.",
    features: ["2 STUDIOS", "TRACKMAN 4", "QUINTIC PUTTING", "VIDEO 4K", "TPI-MAT"],
    bottom: [
      { label: "Studios", value: "2" },
      { label: "Belegg", value: "94%" },
      { label: "Sesong", value: "HELE ÅRET" },
    ],
  },
  {
    id: "oslo-gk",
    kind: "PRIMAER",
    photoLabel: "OSLO GK · COACHING-OMRÅDE",
    name: "Oslo Golfklubb",
    address: "BOGSTAD · 0379 OSLO",
    description:
      "Tilgjengelig via samarbeid for medlemmer. Coaching-rom + range-tilgang i sesong. Brukes spesielt for damegruppe og senior-økter.",
    features: ["RANGE-TILGANG", "COACHING-ROM", "BANE", "BAR & KAFE"],
    bottom: [
      { label: "Bays", value: "10" },
      { label: "Belegg uke", value: "62%" },
      { label: "Avtale", value: "SAMARBEID" },
    ],
  },
  {
    id: "holtsmark",
    kind: "PARTNER",
    photoLabel: "HOLTSMARK GK · SOMMER",
    name: "Holtsmark Golfklubb",
    address: "HOLTSMARK · 3409 LIER",
    description:
      "Sesongbasert partnerklubb. Brukes for Tour-camp og NM-forberedelse. Bookbar mai–oktober, 35 min med bil fra Oslo.",
    features: ["RANGE", "18 HULL", "SHORT-GAME", "SESONG MAI–OKT"],
    bottom: [
      { label: "Bays", value: "12" },
      { label: "Tilgjengelighet", value: "SESONG" },
      { label: "Avstand", value: "35 MIN" },
    ],
  },
];

export const MAP_PINS: MapPin[] = [
  { id: "bogstad", label: "Bogstad GK · primær", variant: "primaer", top: "65%", left: "32%" },
  { id: "skullerud", label: "Skullerud Indoor · primær", variant: "indoor", top: "50%", left: "48%" },
  { id: "oslo", label: "Oslo GK · primær", variant: "primaer", top: "42%", left: "62%" },
  { id: "holtsmark", label: "Holtsmark · partner", variant: "partner", top: "80%", left: "74%" },
  { id: "tjuvholmen", label: "Tjuvholmen · partner", variant: "partner", top: "25%", left: "80%" },
];
