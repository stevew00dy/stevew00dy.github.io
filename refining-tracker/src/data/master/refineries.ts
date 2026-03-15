/**
 * Refineries — master data for 4.7.
 * 9 methods, Stanton/Pyro/Nyx stations.
 */
import type { Refinery } from "../../types/master";

export const REFINERY_METHODS = [
  { id: "cor", name: "Cormack", code: "COR", ratingYield: 1, ratingCost: 2, ratingSpeed: 3 },
  { id: "din", name: "Dinyx Solventation", code: "DIN", ratingYield: 3, ratingCost: 1, ratingSpeed: 1 },
  { id: "est", name: "Electrostarolysis", code: "EST", ratingYield: 2, ratingCost: 2, ratingSpeed: 2 },
  { id: "gas", name: "Gaskin Process", code: "GAS", ratingYield: 2, ratingCost: 3, ratingSpeed: 3 },
  { id: "pyr", name: "Pyrometric Chromalysis", code: "PYR", ratingYield: 3, ratingCost: 3, ratingSpeed: 1 },
  { id: "kzw", name: "Kazen Winnowing", code: "KZW", ratingYield: 1, ratingCost: 2, ratingSpeed: 2 },
  { id: "tnd", name: "Thermonatic Deposition", code: "TND", ratingYield: 2, ratingCost: 2, ratingSpeed: 1 },
  { id: "frx", name: "Ferron Exchange", code: "FRX", ratingYield: 3, ratingCost: 2, ratingSpeed: 1 },
  { id: "xcr", name: "XCR Reaction", code: "XCR", ratingYield: 1, ratingCost: 3, ratingSpeed: 3 },
] as const;

export const REFINERY_STATIONS: Refinery[] = [
  { id: "arc-l1", name: "ARC-L1 Wide Forest Station", shortName: "ARC-L1", system: "Stanton", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "arc-l2", name: "ARC-L2 Lively Pathway Station", shortName: "ARC-L2", system: "Stanton", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "arc-l4", name: "ARC-L4 Faint Glen Station", shortName: "ARC-L4", system: "Stanton", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "cru-l1", name: "CRU-L1 Ambitious Dream Station", shortName: "CRU-L1", system: "Stanton", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "hur-l1", name: "HUR-L1 Green Glade Station", shortName: "HUR-L1", system: "Stanton", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "hur-l2", name: "HUR-L2 Faithful Dream Station", shortName: "HUR-L2", system: "Stanton", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "mic-l1", name: "MIC-L1 Shallow Frontier Station", shortName: "MIC-L1", system: "Stanton", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "mic-l5", name: "MIC-L5 Modern Icarus Station", shortName: "MIC-L5", system: "Stanton", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "pyro-gw", name: "Pyro Gateway", shortName: "Pyro GW", system: "Stanton", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "magnus-gw", name: "Magnus Gateway", shortName: "Magnus GW", system: "Stanton", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "terra-gw", name: "Terra Gateway", shortName: "Terra GW", system: "Stanton", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "stanton-gw", name: "Stanton Gateway", shortName: "Stanton GW", system: "Pyro", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "nyx-gw", name: "Nyx Gateway", shortName: "Nyx GW", system: "Pyro", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "orbituary", name: "Orbituary", shortName: "Orbituary", system: "Pyro", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "checkmate", name: "Checkmate Station", shortName: "Checkmate", system: "Pyro", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "ruin", name: "Ruin Station", shortName: "Ruin", system: "Pyro", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
  { id: "levski", name: "Levski", shortName: "Levski", system: "Nyx", methods: ["cor", "din", "est", "gas", "pyr", "kzw", "tnd", "frx", "xcr"] },
];
