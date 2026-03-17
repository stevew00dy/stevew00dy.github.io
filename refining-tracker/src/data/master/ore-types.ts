/**
 * Ore types — master data for 4.7.
 * locationTypes: Space (asteroids), Planet (surface/ROC), Cave (hand).
 * Based on wiki: ROC mines planet surface; ship mines asteroids + planet large rocks; hand mines caves.
 */
import type { OreType } from "../../types/master";

export const ORE_TYPES: OreType[] = [
  { id: "quan", code: "QUAN", name: "Quantainium", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "legendary", rsSignature: 3170, instability: "high", resistance: "high", density: "high", value: 200000, locationConstraints: "Rarer in 4.7" },
  { id: "stil", code: "STIL", name: "Stileron", acquisitionMethod: "ship", locationTypes: ["space"], rarity: "legendary", instability: "low", resistance: "extreme", density: "medium", value: 140000 },
  { id: "savr", code: "SAVR", name: "Savrilium", acquisitionMethod: "ship", locationTypes: ["space"], rarity: "legendary", rsSignature: 3200, instability: "medium", resistance: "extreme", density: "high", value: 130000, locationConstraints: "Nyx only (Glacium ring)" },
  { id: "ricc", code: "RICC", name: "Riccite", acquisitionMethod: "ship", locationTypes: ["space"], rarity: "epic", instability: "medium", resistance: "extreme", density: "medium", value: 66000 },
  { id: "gold", code: "GOLD", name: "Gold", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "rare", instability: "medium", resistance: "high", density: "high", value: 32000 },
  { id: "lind", code: "LIND", name: "Lindinium", acquisitionMethod: "ship", locationTypes: ["space"], rarity: "epic", instability: "extreme", resistance: "extreme", density: "high", locationConstraints: "Nyx only (Glacium ring)" },
  { id: "bexa", code: "BEXA", name: "Bexalite", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "rare" },
  { id: "bora", code: "BORA", name: "Borase", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "rare" },
  { id: "tara", code: "TARA", name: "Taranite", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "rare" },
  { id: "bery", code: "BERY", name: "Beryl", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "rare" },
  { id: "diam", code: "DIAM", name: "Diamond", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "rare", instability: "low", resistance: "low", density: "medium", value: 7686 },
  { id: "lara", code: "LARA", name: "Laranite", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "uncommon" },
  { id: "alum", code: "ALUM", name: "Aluminum", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "common", instability: "low", resistance: "low", density: "low" },
  { id: "copp", code: "COPP", name: "Copper", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "common", instability: "low", resistance: "low", density: "medium" },
  { id: "iron", code: "IRON", name: "Iron", acquisitionMethod: "ship", locationTypes: ["space"], rarity: "common", rsSignature: 4270, instability: "low", resistance: "low", density: "medium", value: 3400 },
  { id: "ice", code: "ICE", name: "Ice", acquisitionMethod: "ship", locationTypes: ["space"], rarity: "common", rsSignature: 4300, instability: "low", resistance: "low", density: "low" },
  { id: "quar", code: "QUAR", name: "Quartz", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "common", instability: "low", resistance: "low", density: "low", value: 1700 },
  { id: "sili", code: "SILI", name: "Silicon", acquisitionMethod: "ship", locationTypes: ["space"], rarity: "common", instability: "low", resistance: "low", density: "low", value: 2200, locationConstraints: "Now in Stanton" },
  { id: "tin", code: "TIN", name: "Tin", acquisitionMethod: "ship", locationTypes: ["space"], rarity: "common", instability: "low", resistance: "low", density: "medium", locationConstraints: "Now in Stanton" },
  { id: "coru", code: "CORU", name: "Corundum", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "common", instability: "low", resistance: "low", density: "low" },
  { id: "heph", code: "HEPH", name: "Hephaestanite", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "common" },
  { id: "tori", code: "TORI", name: "Torite", acquisitionMethod: "ship", locationTypes: ["space"], rarity: "uncommon", instability: "extreme", resistance: "medium", density: "low", locationConstraints: "Asteroids only (any field)" },
  { id: "tung", code: "TUNG", name: "Tungsten", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "uncommon" },
  { id: "tita", code: "TITA", name: "Titanium", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "uncommon" },
  { id: "agri", code: "AGRI", name: "Agricium", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "uncommon" },
  { id: "asla", code: "ASLA", name: "Aslarite", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "uncommon" },
  { id: "oura", code: "OURA", name: "Ouratite", acquisitionMethod: "ship", locationTypes: ["space", "planet"], rarity: "epic" },
  { id: "hada", code: "HADA", name: "Hadanite", acquisitionMethod: "hand", locationTypes: ["planet", "cave"], locationConstraints: "Hand mineable" },
  { id: "doli", code: "DOLI", name: "Dolivine", acquisitionMethod: "hand", locationTypes: ["planet", "cave"], locationConstraints: "Hand mineable" },
  { id: "apho", code: "APHO", name: "Aphorite", acquisitionMethod: "hand", locationTypes: ["planet", "cave"], locationConstraints: "Hand mineable" },
  { id: "jana", code: "JANA", name: "Janalite", acquisitionMethod: "hand", locationTypes: ["cave"], locationConstraints: "Caves only" },
  { id: "sada", code: "SADA", name: "Sadaryx", acquisitionMethod: "hand", locationTypes: ["planet", "cave"], locationConstraints: "Hand mineable" },
  { id: "cari", code: "CARI", name: "Carinite", acquisitionMethod: "hand", locationTypes: ["planet"], locationConstraints: "Hathor sandbox event only; mine must be opened first" },
  { id: "jacl", code: "JACL", name: "Jaclium", acquisitionMethod: "hand", locationTypes: ["planet", "cave"], locationConstraints: "Hand mineable" },
  { id: "sald", code: "SALD", name: "Saldynium", acquisitionMethod: "hand", locationTypes: ["planet", "cave"], locationConstraints: "Hand mineable" },
  { id: "bera", code: "BERA", name: "Beradom", acquisitionMethod: "ROC", locationTypes: ["planet"], locationConstraints: "ROC mineable" },
  { id: "feyn", code: "FEYN", name: "Feynmaline", acquisitionMethod: "ROC", locationTypes: ["planet"], locationConstraints: "ROC mineable" },
  { id: "glac", code: "GLAC", name: "Glacosite", acquisitionMethod: "ROC", locationTypes: ["planet"], locationConstraints: "ROC mineable" },
];
