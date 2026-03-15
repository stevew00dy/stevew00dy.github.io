/**
 * Vehicle mining equipment — ROC, ROC mining head, modules.
 * Source: mining guides, Frontier Consolidated (when available).
 */
export interface VehicleMiningHead {
  id: string;
  name: string;
  vehicle: string;
  effect?: string;
  notes?: string;
}

export interface VehicleModule {
  id: string;
  name: string;
  type: "passive" | "consumable";
  effect: string;
  debuff?: string;
}

export const ROC_VEHICLE = "ROC";
export const ROC_DS_VEHICLE = "ROC-DS";

export const VEHICLE_MINING_HEADS: VehicleMiningHead[] = [
  { id: "roc-stock", name: "ROC Stock Head", vehicle: ROC_VEHICLE, notes: "Default mining head" },
  { id: "roc-ds-stock", name: "ROC-DS Stock Head", vehicle: ROC_DS_VEHICLE, notes: "Default on ROC-DS" },
];

export const VEHICLE_MODULES: VehicleModule[] = [
  { id: "rieger-c3-roc", name: "Rieger C3", type: "passive", effect: "+25% power", debuff: "-1% green zone" },
  { id: "focus-3-roc", name: "Focus 3", type: "passive", effect: "+40% green zone", debuff: "-5% power" },
  { id: "surge-roc", name: "Surge", type: "consumable", effect: "+50% power, -15% resistance", debuff: "+10% instability" },
  { id: "stampede-roc", name: "Stampede", type: "consumable", effect: "+35% power", debuff: "-10% instability" },
];
