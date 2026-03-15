export interface RefineryMethod {
  id: number;
  name: string;
  code: string;
  ratingYield: number;
  ratingCost: number;
  ratingSpeed: number;
}

export const FALLBACK_METHODS: RefineryMethod[] = [
  { id: 1, name: "Cormack", code: "COR", ratingYield: 1, ratingCost: 2, ratingSpeed: 3 },
  { id: 2, name: "Dinyx Solventation", code: "DIN", ratingYield: 3, ratingCost: 1, ratingSpeed: 1 },
  { id: 3, name: "Electrostarolysis", code: "EST", ratingYield: 2, ratingCost: 2, ratingSpeed: 2 },
  { id: 4, name: "Gaskin Process", code: "GAS", ratingYield: 2, ratingCost: 3, ratingSpeed: 3 },
  { id: 5, name: "Pyrometric Chromalysis", code: "PYR", ratingYield: 3, ratingCost: 3, ratingSpeed: 1 },
  { id: 6, name: "Kazen Winnowing", code: "KZW", ratingYield: 1, ratingCost: 2, ratingSpeed: 2 },
  { id: 7, name: "Thermonatic Deposition", code: "TND", ratingYield: 2, ratingCost: 2, ratingSpeed: 1 },
  { id: 8, name: "Ferron Exchange", code: "FRX", ratingYield: 3, ratingCost: 2, ratingSpeed: 1 },
  { id: 9, name: "XCR Reaction", code: "XCR", ratingYield: 1, ratingCost: 3, ratingSpeed: 3 },
];

export interface RefineryStation {
  id: string;
  name: string;
  shortName: string;
  system: string;
}

export const STATIONS: RefineryStation[] = [
  { id: "arc-l1", name: "ARC-L1 Wide Forest Station", shortName: "ARC-L1", system: "Stanton" },
  { id: "arc-l2", name: "ARC-L2 Lively Pathway Station", shortName: "ARC-L2", system: "Stanton" },
  { id: "arc-l4", name: "ARC-L4 Faint Glen Station", shortName: "ARC-L4", system: "Stanton" },
  { id: "cru-l1", name: "CRU-L1 Ambitious Dream Station", shortName: "CRU-L1", system: "Stanton" },
  { id: "hur-l1", name: "HUR-L1 Green Glade Station", shortName: "HUR-L1", system: "Stanton" },
  { id: "hur-l2", name: "HUR-L2 Faithful Dream Station", shortName: "HUR-L2", system: "Stanton" },
  { id: "mic-l1", name: "MIC-L1 Shallow Frontier Station", shortName: "MIC-L1", system: "Stanton" },
  { id: "mic-l5", name: "MIC-L5 Modern Icarus Station", shortName: "MIC-L5", system: "Stanton" },
  { id: "pyro-gw", name: "Pyro Gateway", shortName: "Pyro GW", system: "Stanton" },
  { id: "magnus-gw", name: "Magnus Gateway", shortName: "Magnus GW", system: "Stanton" },
  { id: "terra-gw", name: "Terra Gateway", shortName: "Terra GW", system: "Stanton" },
  { id: "stanton-gw", name: "Stanton Gateway", shortName: "Stanton GW", system: "Pyro" },
  { id: "nyx-gw", name: "Nyx Gateway", shortName: "Nyx GW", system: "Pyro" },
  { id: "orbituary", name: "Orbituary", shortName: "Orbituary", system: "Pyro" },
  { id: "checkmate", name: "Checkmate Station", shortName: "Checkmate", system: "Pyro" },
  { id: "ruin", name: "Ruin Station", shortName: "Ruin", system: "Pyro" },
];

export interface YieldBonus {
  oreCode: string;
  stationId: string;
  stationName: string;
  commodityName: string;
  yieldBonus: number;
}

export const RATING_LABELS: Record<number, string> = {
  1: "Low",
  2: "Moderate",
  3: "High",
};
