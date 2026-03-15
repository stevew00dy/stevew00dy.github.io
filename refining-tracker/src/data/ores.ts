export interface Ore {
  id: number;
  rawId: number;
  name: string;
  code: string;
  kind: string;
  refinedPriceSell: number;
}

export const FALLBACK_ORES: Ore[] = [
  { id: 124, rawId: 163, name: "Riccite", code: "RICC", kind: "Metal", refinedPriceSell: 84115 },
  { id: 122, rawId: 162, name: "Stileron", code: "STIL", kind: "Mineral", refinedPriceSell: 88198 },
  { id: 188, rawId: 187, name: "Savrilium", code: "SAVR", kind: "Metal", refinedPriceSell: 81530 },
  { id: 58, rawId: 59, name: "Quantainium", code: "QUAN", kind: "Mineral", refinedPriceSell: 84615 },
  { id: 184, rawId: 185, name: "Lindinium", code: "LIND", kind: "Metal", refinedPriceSell: 22525 },
  { id: 110, rawId: 165, name: "Cobalt", code: "COBA", kind: "Mineral", refinedPriceSell: 21550 },
  { id: 73, rawId: 74, name: "Taranite", code: "TARA", kind: "Mineral", refinedPriceSell: 20818 },
  { id: 13, rawId: 14, name: "Bexalite", code: "BEXA", kind: "Mineral", refinedPriceSell: 18567 },
  { id: 25, rawId: 26, name: "Diamond", code: "DIAM", kind: "Metal", refinedPriceSell: 7686 },
  { id: 33, rawId: 34, name: "Gold", code: "GOLD", kind: "Metal", refinedPriceSell: 7377 },
  { id: 15, rawId: 16, name: "Borase", code: "BORA", kind: "Metal", refinedPriceSell: 6430 },
  { id: 47, rawId: 48, name: "Laranite", code: "LARA", kind: "Metal", refinedPriceSell: 5133 },
  { id: 11, rawId: 12, name: "Beryl", code: "BERY", kind: "Mineral", refinedPriceSell: 4803 },
  { id: 1, rawId: 2, name: "Agricium", code: "AGRI", kind: "Metal", refinedPriceSell: 4073 },
  { id: 39, rawId: 40, name: "Hephaestanite", code: "HEPH", kind: "Mineral", refinedPriceSell: 4001 },
  { id: 77, rawId: 78, name: "Tungsten", code: "TUNG", kind: "Metal", refinedPriceSell: 2311 },
  { id: 190, rawId: 189, name: "Torite", code: "TORI", kind: "Metal", refinedPriceSell: 2158 },
  { id: 44, rawId: 45, name: "Iron", code: "IRON", kind: "Metal", refinedPriceSell: 2079 },
  { id: 75, rawId: 76, name: "Titanium", code: "TITA", kind: "Metal", refinedPriceSell: 2056 },
  { id: 60, rawId: 61, name: "Quartz", code: "QUAR", kind: "Metal", refinedPriceSell: 1756 },
  { id: 22, rawId: 23, name: "Corundum", code: "CORU", kind: "Mineral", refinedPriceSell: 1751 },
  { id: 20, rawId: 21, name: "Copper", code: "COPP", kind: "Metal", refinedPriceSell: 1698 },
  { id: 5, rawId: 6, name: "Aluminium", code: "ALUM", kind: "Metal", refinedPriceSell: 1671 },
  { id: 103, rawId: 176, name: "Tin", code: "TIN", kind: "Metal", refinedPriceSell: 1613 },
  { id: 100, rawId: 161, name: "Silicon", code: "SILI", kind: "Raw Materials", refinedPriceSell: 1171 },
];
