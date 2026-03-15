/**
 * Hand/FPS mining equipment — multi-tool attachments.
 * Pyro RYT multi-tool: Ore Bit only. Arbor/Helix/Lancet MH1 are ship lasers.
 * Context: Caves, surface hand mining.
 */
export interface HandMiningTool {
  id: string;
  name: string;
  extractPower?: number;
  clustering?: number;
  inertMatLevel?: number;
  laserRange?: number;
  laserModes?: string[];
  notes?: string;
}

export interface HandAttachment {
  id: string;
  name: string;
  effect?: string;
  notes?: string;
}

export const HAND_MINING_TOOLS: HandMiningTool[] = [];

export const HAND_ATTACHMENTS: HandAttachment[] = [
  { id: "ore-bit", name: "Ore Bit", effect: "Mining attachment", notes: "Pyro RYT multi-tool: Ore Bit only" },
];

/** ATLS Geo exosuit — built-in and swappable S0 mining equipment. */
export interface AtlsGeoWeapon {
  id: string;
  name: string;
  notes?: string;
}

export interface AtlsGeoFeature {
  id: string;
  name: string;
  effect?: string;
  notes?: string;
}

export const ATLS_GEO_WEAPONS: AtlsGeoWeapon[] = [
  { id: "lawson-s0", name: "Lawson Mining Laser (S0)", notes: "Default; 5m optimal range; ALT+4 to switch FPS/ROC mode" },
];

export const ATLS_GEO_FEATURES: AtlsGeoFeature[] = [
  { id: "tractor", name: "Tractor beam", effect: "Collect ore", notes: "Built-in" },
  { id: "storage", name: "Ore container", effect: "0.1 SCU (~100 ROC chunks)", notes: "Detachable" },
  { id: "jetpack", name: "Jetpack", effect: "Thrust, no fall damage", notes: "Recharges when idle" },
];
