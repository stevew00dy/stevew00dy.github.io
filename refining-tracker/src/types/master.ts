/**
 * Master data schema for Regolith rebuild.
 * All features derive from this. Versioned per patch (4.5, 4.7).
 */

export type AcquisitionMethod = "ship" | "hand" | "harvest" | "ROC";
export type RarityTier = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type InstabilityLevel = "low" | "medium" | "high" | "extreme";
export type ResistanceLevel = "low" | "medium" | "high" | "extreme";
export type DensityLevel = "low" | "medium" | "high";

export type LocationType = "space" | "planet" | "cave";

export interface OreType {
  id: string;
  code: string;
  name: string;
  acquisitionMethod: AcquisitionMethod;
  locationTypes?: LocationType[]; // Space (asteroids), Planet (surface), Cave (hand)
  rarity?: RarityTier;
  locationConstraints?: string;
  rsSignature?: number;
  instability?: InstabilityLevel;
  resistance?: ResistanceLevel;
  density?: DensityLevel;
  value?: number;
  secondaryMaterialIds?: string[];
  tertiaryMaterialIds?: string[];
}

export interface RockType {
  id: string;
  name: string;
  primaryMaterialId: string;
  secondaryMaterialId?: string;
  tertiaryMaterialId?: string;
  composition?: { oreId: string; percent: number }[];
  mass?: number;
  resistance?: number;
  instability?: number;
  compositionScu?: number;
}

export interface Location {
  id: string;
  name: string;
  system: string;
  type: "planet" | "moon" | "asteroid_belt" | "station";
  parentId?: string;
}

export interface LocationCommodityMap {
  locationId: string;
  commodityId: string;
  spawnType: "surface" | "caves" | "asteroids";
}

export interface Refinery {
  id: string;
  name: string;
  shortName: string;
  system: string;
  methods: string[];
  oreBonusMatrix?: Record<string, number>;
}

export interface Commodity {
  id: string;
  code: string;
  name: string;
  acquisitionMethod?: AcquisitionMethod;
  locationConstraints?: string;
  unrefinedAuec?: number;
  refinedAuec?: number;
  quality?: number;
}

export interface WorkOrder {
  id: string;
  sessionId: string;
  activity: "ship" | "ROC" | "FPS" | "salvage";
  craftId?: string; // e.g. prospector, mole, roc, roc-ds
  refineryId: string;
  methodId: string;
  oreId: string;
  quantity: number;
  yieldScu: number;
  quality: number;
  grossAuec: number;
  netAuec: number;
  refineryFee: number;
  timerEndsAt: number;
  sold: boolean;
  completed?: boolean; // true once collected from refinery
  createdAt: number;
}

export interface Session {
  id: string;
  name: string;
  locationId?: string;
  refineryId?: string;
  workOrders: string[];
  createdAt: number;
  updatedAt: number;
}
