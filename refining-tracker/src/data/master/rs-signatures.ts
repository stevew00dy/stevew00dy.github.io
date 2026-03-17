/**
 * RS (Resource Signature) scan lookup table.
 * Base signature × cluster size = value shown when scanning.
 * Each rock has 1 material.
 * Community-sourced from in-game scanning (4.7 PTU).
 *
 * Asteroid vs Planet: Same base signature for both — observed in-game for
 * space asteroids and planet/moon surface rocks of the same material.
 */
import type { RarityTier } from "../../types/master";

export interface RSSignatureRow {
  oreId: string;
  name: string;
  rarity: RarityTier;
  baseSignature: number;
}

export const RS_SIGNATURES: RSSignatureRow[] = [
  { oreId: "ice", name: "Ice", rarity: "common", baseSignature: 4300 },
  { oreId: "alum", name: "Aluminum", rarity: "common", baseSignature: 4285 },
  { oreId: "iron", name: "Iron", rarity: "common", baseSignature: 4270 },
  { oreId: "sili", name: "Silicon", rarity: "common", baseSignature: 4255 },
  { oreId: "copp", name: "Copper", rarity: "common", baseSignature: 4240 },
  { oreId: "coru", name: "Corundum", rarity: "common", baseSignature: 4225 },
  { oreId: "quar", name: "Quartz", rarity: "common", baseSignature: 4210 },
  { oreId: "tin", name: "Tin", rarity: "common", baseSignature: 4195 },
  { oreId: "heph", name: "Hephaestanite", rarity: "common", baseSignature: 4180 },
  { oreId: "tori", name: "Torite", rarity: "uncommon", baseSignature: 3900 },
  { oreId: "agri", name: "Agricium", rarity: "uncommon", baseSignature: 3885 },
  { oreId: "tung", name: "Tungsten", rarity: "uncommon", baseSignature: 3870 },
  { oreId: "tita", name: "Titanium", rarity: "uncommon", baseSignature: 3855 },
  { oreId: "asla", name: "Aslarite", rarity: "uncommon", baseSignature: 3840 },
  { oreId: "lara", name: "Laranite", rarity: "uncommon", baseSignature: 3825 },
  { oreId: "bexa", name: "Bexalite", rarity: "rare", baseSignature: 3600 },
  { oreId: "gold", name: "Gold", rarity: "rare", baseSignature: 3585 },
  { oreId: "bora", name: "Borase", rarity: "rare", baseSignature: 3570 },
  { oreId: "tara", name: "Taranite", rarity: "rare", baseSignature: 3555 },
  { oreId: "bery", name: "Beryl", rarity: "rare", baseSignature: 3540 },
  { oreId: "oura", name: "Ouratite", rarity: "epic", baseSignature: 3370 },
  { oreId: "lind", name: "Lindinium", rarity: "epic", baseSignature: 3400 },
  { oreId: "ricc", name: "Riccite", rarity: "epic", baseSignature: 3385 },
  { oreId: "stil", name: "Stileron", rarity: "legendary", baseSignature: 3185 },
  { oreId: "quan", name: "Quantainium", rarity: "legendary", baseSignature: 3170 },
  { oreId: "savr", name: "Savrilium", rarity: "legendary", baseSignature: 3200 },
];

export function getClusterSignature(base: number, clusterSize: number): number {
  return base * clusterSize;
}
