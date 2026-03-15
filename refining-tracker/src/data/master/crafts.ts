/**
 * Mining ships and vehicles — for work order selection.
 * Ship: space + planet large rocks. Vehicle: planet smaller rocks only.
 * Flyable: in-game as of 4.7. Coming soon: not yet released.
 */
export const MINING_SHIPS_FLYABLE = [
  { id: "prospector", name: "Prospector" },
  { id: "mole", name: "Mole" },
  { id: "golem", name: "Golem" },
] as const;

export const MINING_SHIPS_COMING_SOON = [
  { id: "expanse", name: "Expanse" },
  { id: "arrastra", name: "Arrastra" },
  { id: "orion", name: "Orion" },
] as const;

/** All mining ships (flyable + coming soon) — for display/lookup of existing work orders */
export const MINING_SHIPS = [...MINING_SHIPS_FLYABLE, ...MINING_SHIPS_COMING_SOON] as const;

export const MINING_VEHICLES = [
  { id: "roc", name: "ROC" },
  { id: "roc-ds", name: "ROC-DS" },
] as const;

/** Hand/FPS mining options — multi-tool or exosuit. */
export const MINING_HAND_CRAFTS = [
  { id: "hand", name: "Multi-tool" },
  { id: "atls-geo", name: "ATLS Geo" },
] as const;
