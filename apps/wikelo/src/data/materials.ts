export type MaterialCategory =
  | "currency"
  | "ores"
  | "creature"
  | "medals"
  | "components"
  | "weapons"
  | "armor";

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
}

export const categoryLabels: Record<MaterialCategory, string> = {
  currency: "Currency & Scrip",
  ores: "Ores & Minerals",
  creature: "Creature Drops",
  medals: "Medals & Artifacts",
  components: "Components & Tech",
  weapons: "Weapons",
  armor: "Armor & Gear",
};

export const categoryOrder: MaterialCategory[] = [
  "currency",
  "ores",
  "creature",
  "medals",
  "components",
  "weapons",
  "armor",
];

export const materials: Material[] = [
  // Currency & Scrip
  { id: "wikelo-favor", name: "Wikelo Favor", category: "currency" },
  { id: "mg-scrip", name: "MG Scrip", category: "currency" },
  { id: "polaris-bit", name: "Polaris Bit", category: "currency" },

  // Ores & Minerals
  { id: "quantainium", name: "Quantainium", category: "ores" },
  { id: "carinite", name: "Carinite", category: "ores" },
  { id: "carinite-pure", name: "Carinite (Pure)", category: "ores" },
  { id: "jaclium", name: "Jaclium (Ore)", category: "ores" },
  { id: "saldynium", name: "Saldynium (Ore)", category: "ores" },
  { id: "copper", name: "Copper", category: "ores" },
  { id: "tungsten", name: "Tungsten", category: "ores" },
  { id: "corundum", name: "Corundum", category: "ores" },

  // Creature Drops
  { id: "valakkar-pearl-aaa", name: "Irradiated Valakkar Pearl (AAA)", category: "creature" },
  { id: "valakkar-pearl-aa", name: "Irradiated Valakkar Pearl (AA)", category: "creature" },
  { id: "valakkar-fang-apex", name: "Irradiated Valakkar Fang (Apex)", category: "creature" },
  { id: "valakkar-fang-adult", name: "Irradiated Valakkar Fang (Adult)", category: "creature" },
  { id: "valakkar-fang-juvenile", name: "Irradiated Valakkar Fang (Juvenile)", category: "creature" },
  { id: "tundra-kopion-horn", name: "Tundra Kopion Horn", category: "creature" },
  { id: "irradiated-kopion-horn", name: "Irradiated Kopion Horn", category: "creature" },
  { id: "yormandi-eye", name: "Yormandi Eye", category: "creature" },
  { id: "yormandi-tongue", name: "Yormandi Tongue", category: "creature" },

  // Medals & Artifacts
  { id: "uee-medal", name: "UEE 6th Platoon Medal (Pristine)", category: "medals" },
  { id: "tevarin-marker", name: "Tevarin War Service Marker (Pristine)", category: "medals" },
  { id: "gov-medal", name: "Government Cartography Agency Medal (Pristine)", category: "medals" },
  { id: "artefact-fragment", name: "Large Artefact Fragment (Pristine)", category: "medals" },

  // Components & Tech
  { id: "asd-secure-drive", name: "ASD Secure Drive", category: "components" },
  { id: "comp-board", name: "DCHS-05 Orbital Positioning Comp-Board", category: "components" },
  { id: "rcmbnt-rgl-1", name: "RCMBNT-RGL-1", category: "components" },
  { id: "rcmbnt-rgl-2", name: "RCMBNT-RGL-2", category: "components" },
  { id: "rcmbnt-rgl-3", name: "RCMBNT-RGL-3", category: "components" },
  { id: "rcmbnt-pwl-1", name: "RCMBNT-PWL-1", category: "components" },
  { id: "rcmbnt-pwl-2", name: "RCMBNT-PWL-2", category: "components" },
  { id: "rcmbnt-pwl-3", name: "RCMBNT-PWL-3", category: "components" },
  { id: "rcmbnt-xtl-1", name: "RCMBNT-XTL-1", category: "components" },
  { id: "rcmbnt-xtl-2", name: "RCMBNT-XTL-2", category: "components" },
  { id: "rcmbnt-xtl-3", name: "RCMBNT-XTL-3", category: "components" },
  { id: "nn-13-cannon", name: "NN-13 Cannon", category: "components" },

  // Weapons
  { id: "boomtube-launcher", name: "Boomtube Rocket Launcher", category: "weapons" },
  { id: "parallax-rifle", name: "Parallax Energy Assault Rifle", category: "weapons" },
  { id: "prism-shotgun", name: "Prism Laser Shotgun", category: "weapons" },
  { id: "zenith-sniper", name: "Zenith Sniper Rifle", category: "weapons" },
  { id: "fresnel-lmg", name: "Fresnel Energy LMG", category: "weapons" },
  { id: "fresnel-deepwater", name: "Fresnel 'Deepwater' Energy LMG", category: "weapons" },

  // Armor & Gear
  { id: "argo-atls", name: "Argo ATLS", category: "armor" },
  { id: "argo-atls-geo", name: "Argo ATLS Geo", category: "armor" },
  { id: "argo-atls-ikti", name: "Argo ATLS Ikti", category: "armor" },
  { id: "ace-helmet", name: "Ace Interceptor Helmet", category: "armor" },
  { id: "vanduul-plating", name: "Vanduul Plating", category: "armor" },
  { id: "vanduul-metal", name: "Vanduul Metal", category: "armor" },
  { id: "antium-helmet", name: "Antium Helmet", category: "armor" },
  { id: "antium-core", name: "Antium Core", category: "armor" },
  { id: "antium-legs", name: "Antium Legs", category: "armor" },
  { id: "antium-arms", name: "Antium Arms", category: "armor" },
  { id: "antium-midnight-helmet", name: "Antium Midnight Helmet", category: "armor" },
  { id: "antium-midnight-core", name: "Antium Midnight Core", category: "armor" },
  { id: "antium-midnight-legs", name: "Antium Midnight Legs", category: "armor" },
  { id: "antium-midnight-arms", name: "Antium Midnight Arms", category: "armor" },
  { id: "corbel-helmet", name: "Corbel Mire Helmet", category: "armor" },
  { id: "corbel-core", name: "Corbel Mire Core", category: "armor" },
  { id: "corbel-legs", name: "Corbel Mire Legs", category: "armor" },
  { id: "corbel-arms", name: "Corbel Mire Arms", category: "armor" },
  { id: "corbel-backpack", name: "Corbel Mire Novikov Backpack", category: "armor" },
  { id: "geist-helmet", name: "Geist ASD Helmet", category: "armor" },
  { id: "geist-core", name: "Geist ASD Core", category: "armor" },
  { id: "geist-legs", name: "Geist ASD Legs", category: "armor" },
  { id: "geist-arms", name: "Geist ASD Arms", category: "armor" },
  { id: "geist-backpack", name: "Geist ASD Backpack", category: "armor" },
  { id: "palatino-helmet", name: "Palatino Helmet", category: "armor" },
  { id: "palatino-core", name: "Palatino Core", category: "armor" },
  { id: "palatino-legs", name: "Palatino Legs", category: "armor" },
  { id: "palatino-arms", name: "Palatino Arms", category: "armor" },
  { id: "palatino-backpack", name: "Palatino Backpack", category: "armor" },
  { id: "testudo-helmet", name: "Testudo Turfwar Helmet", category: "armor" },
  { id: "testudo-core", name: "Testudo Turfwar Core", category: "armor" },
  { id: "testudo-arms", name: "Testudo Turfwar Arms", category: "armor" },
  { id: "testudo-legs", name: "Testudo Turfwar Legs", category: "armor" },
  { id: "testudo-backpack", name: "Testudo Turfwar Backpack", category: "armor" },
];

export const materialMap = new Map(materials.map((m) => [m.id, m]));
