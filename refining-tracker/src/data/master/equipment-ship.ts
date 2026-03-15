/**
 * Ship mining equipment — lasers, modules, gadgets.
 * Community-sourced stats for 4.7.
 */
export interface ShipLaser {
  id: string;
  name: string;
  size: number;
  slots: number;
  optRange?: number;
  maxRange?: number;
  minPowerPct?: number;
  minPower?: number;
  maxPower?: number;
  extractPower?: number;
  resistance?: string;
  instability?: string;
  chargeRate?: string;
  chargeWindow?: string;
  inertMaterials?: string;
  notes?: string;
}

export interface ShipModule {
  id: string;
  name: string;
  type: "passive" | "active";
  laserPowerMod?: string;
  resistance?: string;
  instability?: string;
  chargeRate?: string;
  chargeWindow?: string;
  inertMaterials?: string;
  overchargeRate?: string;
  clustering?: string;
  shatterDamage?: string;
  extractPowerMod?: string;
  uses?: number;
  durationSec?: number;
  notes?: string;
}

export interface ShipGadget {
  id: string;
  name: string;
  laserPowerMod?: string;
  resistance?: string;
  instability?: string;
  chargeRate?: string;
  chargeWindow?: string;
  inertMaterials?: string;
  clustering?: string;
  extractPowerMod?: string;
  notes?: string;
}

export const SHIP_LASERS: ShipLaser[] = [
  { id: "arbor-mh1", name: "Arbor MH1", size: 1, slots: 1, optRange: 60, maxRange: 180, minPowerPct: 10, minPower: 189, maxPower: 1890, extractPower: 1850, resistance: "+25%", instability: "-35%", chargeRate: "+40%", chargeWindow: "-30%", notes: "Stock on Prospector" },
  { id: "arbor-mh2", name: "Arbor MH2", size: 2, slots: 2, optRange: 90, maxRange: 270, minPowerPct: 20, minPower: 480, maxPower: 2400, extractPower: 2590, resistance: "+25%", instability: "-35%", chargeRate: "+40%", chargeWindow: "-40%", notes: "Stock on Mole" },
  { id: "arbor-mhv", name: "Arbor MHV", size: 0, slots: 0, optRange: 15, maxRange: 20, notes: "Vehicle (ROC)" },
  { id: "helix-i", name: "Helix I", size: 1, slots: 2, optRange: 15, maxRange: 45, minPowerPct: 20, minPower: 630, maxPower: 3150, extractPower: 1850, resistance: "-30%", chargeRate: "-40%", chargeWindow: "-30%", notes: "Most powerful; sledgehammer" },
  { id: "helix-ii", name: "Helix II", size: 2, slots: 3, optRange: 30, maxRange: 90, minPowerPct: 25, minPower: 1020, maxPower: 4080, extractPower: 2590, resistance: "-30%", chargeRate: "-40%", chargeWindow: "-40%", notes: "" },
  { id: "hofstede-s1", name: "Hofstede-S1", size: 1, slots: 1, optRange: 45, maxRange: 135, minPowerPct: 5, minPower: 105, maxPower: 2100, extractPower: 1295, resistance: "-30%", instability: "+10%", chargeRate: "+20%", chargeWindow: "+60%", inertMaterials: "-30%", notes: "5% min power; scalpel" },
  { id: "hofstede-s2", name: "Hofstede-S2", size: 2, slots: 2, optRange: 60, maxRange: 180, minPowerPct: 10, minPower: 336, maxPower: 3360, extractPower: 1295, resistance: "-30%", instability: "+10%", chargeRate: "+20%", chargeWindow: "+60%", inertMaterials: "-40%", notes: "" },
  { id: "impact-i", name: "Impact I", size: 1, slots: 2, optRange: 45, maxRange: 135, minPowerPct: 20, minPower: 420, maxPower: 2100, extractPower: 2775, resistance: "+10%", instability: "-10%", chargeRate: "-40%", chargeWindow: "+20%", inertMaterials: "-30%", notes: "+resistance, -instability" },
  { id: "impact-ii", name: "Impact II", size: 2, slots: 3, optRange: 60, maxRange: 180, minPowerPct: 25, minPower: 840, maxPower: 3360, extractPower: 3145, resistance: "+10%", instability: "-10%", chargeRate: "-40%", chargeWindow: "+20%", inertMaterials: "-40%", notes: "" },
  { id: "klein-s1", name: "Klein-S1", size: 1, slots: 0, optRange: 45, maxRange: 135, minPowerPct: 17, minPower: 378, maxPower: 2220, extractPower: 2220, resistance: "-45%", instability: "+35%", chargeRate: "+20%", chargeWindow: "-30%", notes: "Lowest module count" },
  { id: "klein-s2", name: "Klein-S2", size: 2, slots: 1, optRange: 60, maxRange: 180, minPowerPct: 20, minPower: 720, maxPower: 3600, extractPower: 2775, resistance: "-45%", instability: "+35%", chargeRate: "+20%", chargeWindow: "-40%", notes: "" },
  { id: "lancet-mh1", name: "Lancet MH1", size: 1, slots: 1, optRange: 30, maxRange: 90, minPowerPct: 20, minPower: 504, maxPower: 2520, extractPower: 1850, instability: "-10%", chargeRate: "+40%", chargeWindow: "-60%", inertMaterials: "-30%", notes: "Good for sub-breaks" },
  { id: "lancet-mh2", name: "Lancet MH2", size: 2, slots: 2, optRange: 45, maxRange: 135, minPowerPct: 25, minPower: 900, maxPower: 3600, extractPower: 2590, instability: "-10%", chargeRate: "+40%", chargeWindow: "-60%", inertMaterials: "-40%", notes: "" },
  { id: "lawson", name: "Lawson", size: 0, slots: 0, optRange: 25, maxRange: 25, notes: "S0; hand/ATLS" },
  { id: "pitman", name: "Pitman", size: 0, slots: 2, optRange: 40, maxRange: 45, minPowerPct: 20, minPower: 630, maxPower: 3150, extractPower: 1295, resistance: "+25%", instability: "+35%", chargeRate: "-40%", chargeWindow: "+40%", inertMaterials: "-40%", notes: "Golem bespoke" },
  { id: "s0-helix", name: "S0 Helix", size: 0, slots: 0, optRange: 30, maxRange: 30, minPowerPct: 0, chargeRate: "+20%", chargeWindow: "-40%", notes: "S0" },
  { id: "s00-hofstede", name: "S00 Hofstede", size: 0, slots: 0, optRange: 30, maxRange: 30, resistance: "-40%", instability: "+30%", chargeRate: "+20%", chargeWindow: "+40%", notes: "S00" },
];

export const SHIP_MODULES: ShipModule[] = [
  { id: "brandt", name: "Brandt", type: "active", laserPowerMod: "+35%", resistance: "+15%", inertMaterials: "-30%" },
  { id: "forel", name: "Forel", type: "active", laserPowerMod: "+15%", inertMaterials: "-60%", extractPowerMod: "+50%" },
  { id: "lifeline", name: "Lifeline", type: "active", laserPowerMod: "-15%", resistance: "-20%", chargeWindow: "+60%" },
  { id: "optimum", name: "Optimum", type: "active", laserPowerMod: "-15%", instability: "-10%", inertMaterials: "-80%" },
  { id: "rime", name: "Rime", type: "active", laserPowerMod: "-15%", resistance: "-25%", inertMaterials: "-10%" },
  { id: "stampede", name: "Stampede", type: "active", laserPowerMod: "+35%", instability: "-10%", overchargeRate: "-10%", chargeWindow: "-15%" },
  { id: "surge", name: "Surge", type: "active", laserPowerMod: "+50%", resistance: "-15%", instability: "+10%" },
  { id: "torpid", name: "Torpid", type: "active", laserPowerMod: "+60%", chargeRate: "-60%", extractPowerMod: "+40%" },
  { id: "fltr", name: "FLTR", type: "passive", resistance: "-20%", inertMaterials: "-15%" },
  { id: "fltr-l", name: "FLTR-L", type: "passive", resistance: "-23%", inertMaterials: "-10%" },
  { id: "fltr-xl", name: "FLTR-XL", type: "passive", resistance: "-24%", inertMaterials: "-5%" },
  { id: "focus", name: "Focus", type: "passive", laserPowerMod: "-15%", chargeWindow: "+30%" },
  { id: "focus-ii", name: "Focus II", type: "passive", laserPowerMod: "-10%", chargeWindow: "+37%" },
  { id: "focus-iii", name: "Focus III", type: "passive", laserPowerMod: "-5%", chargeWindow: "+40%" },
  { id: "rieger", name: "Rieger", type: "passive", laserPowerMod: "+15%", chargeWindow: "-10%" },
  { id: "rieger-c2", name: "Rieger-C2", type: "passive", laserPowerMod: "+20%", chargeWindow: "-3%" },
  { id: "rieger-c3", name: "Rieger-C3", type: "passive", laserPowerMod: "+25%", chargeWindow: "-1%" },
  { id: "torrent", name: "Torrent", type: "passive", laserPowerMod: "+30%", resistance: "-10%" },
  { id: "torrent-ii", name: "Torrent II", type: "passive", laserPowerMod: "+35%", resistance: "-3%" },
  { id: "torrent-iii", name: "Torrent III", type: "passive", laserPowerMod: "+40%", resistance: "-1%" },
  { id: "vaux", name: "Vaux", type: "passive", laserPowerMod: "-20%", clustering: "+15%" },
  { id: "vaux-c2", name: "Vaux-C2", type: "passive", laserPowerMod: "-15%", clustering: "+20%" },
  { id: "vaux-c3", name: "Vaux-C3", type: "passive", laserPowerMod: "-5%", clustering: "+25%" },
  { id: "xtr", name: "XTR", type: "passive", laserPowerMod: "+15%", resistance: "-5%", inertMaterials: "-15%" },
  { id: "xtr-l", name: "XTR-L", type: "passive", laserPowerMod: "+22%", resistance: "-6%", inertMaterials: "-10%" },
  { id: "xtr-xl", name: "XTR-XL", type: "passive", laserPowerMod: "+25%", resistance: "-6%", inertMaterials: "-5%" },
  { id: "klein-mod", name: "Klein module", type: "passive", resistance: "-45%", instability: "+35%", notes: "1 slot; ship-mounted" },
];

export const SHIP_GADGETS: ShipGadget[] = [
  { id: "boremax", name: "BoreMax", laserPowerMod: "+10%", resistance: "-70%", clustering: "+30%" },
  { id: "okunis", name: "Okunis", laserPowerMod: "+100%", resistance: "+50%", chargeWindow: "-20%" },
  { id: "optimax", name: "OptiMax", resistance: "-30%", chargeRate: "-30%", clustering: "+60%", notes: "Also: OptiMax" },
  { id: "sabir", name: "Sabir", resistance: "-50%", instability: "+15%", chargeWindow: "+50%", notes: "Also: Seabir" },
  { id: "stalwart", name: "Stalwart", resistance: "-35%", chargeRate: "+50%", chargeWindow: "-30%", extractPowerMod: "+30%" },
  { id: "waveshift", name: "Waveshift", resistance: "-35%", chargeRate: "-30%", chargeWindow: "+100%" },
];

export const SHIP_NOTES: Record<string, string> = {
  Prospector: "2 mod slots; stock Arbor MH1",
  Mole: "3 lasers, 3 mod slots; stock Arbor MH2",
  Golem: "Bespoke Pitman S1",
};
