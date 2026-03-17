/**
 * Planet & moon materials — Stanton, Pyro, Nyx.
 * From in-game starmap descriptions (4.7 PTU).
 */

export interface PlanetMaterial {
  id: string;
  system: string;
  name: string;
  shipMineables: string[];
  groundVehicleMineables: string[];
  handMineables: string[];
}

/** Normalize game material names to match ORE_TYPES */
const MATERIAL_ALIASES: Record<string, string> = {
  Aluminum: "Aluminum",
  Aluminium: "Aluminum",
  Alumium: "Aluminum",
  Quantanium: "Quantainium",
  Quantainium: "Quantainium",
  Tarantite: "Taranite",
  Beradon: "Beradom",
  Savrillium: "Savrilium",
  "Janalite (Caves only)": "Janalite",
};

function normalize(name: string): string {
  return MATERIAL_ALIASES[name] ?? name;
}

export const PLANET_MATERIALS: PlanetMaterial[] = [
  // Stanton
  {
    id: "Stanton1",
    system: "Stanton",
    name: "Hurston",
    shipMineables: ["Aluminium", "Tin", "Ouratite", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Stanton1a",
    system: "Stanton",
    name: "Arial",
    shipMineables: ["Aluminium", "Tin", "Hephaestanite", "Corundum", "Ouratite", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Stanton1b",
    system: "Stanton",
    name: "Aberdeen",
    shipMineables: ["Aluminium", "Titanium", "Ouratite", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Carinite"],
  },
  {
    id: "Stanton1c",
    system: "Stanton",
    name: "Magda",
    shipMineables: ["Aluminium", "Titanium", "Aslarite", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Stanton1d",
    system: "Stanton",
    name: "Ita",
    shipMineables: ["Aluminium", "Tin", "Aslarite", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Stanton2a",
    system: "Stanton",
    name: "Cellin",
    shipMineables: ["Quartz", "Agricium", "Taranite", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Stanton2b",
    system: "Stanton",
    name: "Daymar",
    shipMineables: ["Quartz", "Agricium", "Silicon", "Quantanium", "Titanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite", "Carinite"],
  },
  {
    id: "Stanton2c",
    system: "Stanton",
    name: "Yela",
    shipMineables: ["Quartz", "Agricium", "Taranite", "Silicon", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite"],
  },
  {
    id: "Stanton3a",
    system: "Stanton",
    name: "Lyria",
    shipMineables: ["Iron", "Copper", "Laranite", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Janalite"],
  },
  {
    id: "Stanton3b",
    system: "Stanton",
    name: "Wala",
    shipMineables: ["Iron", "Laranite", "Beryl", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Janalite"],
  },
  {
    id: "Stanton4",
    system: "Stanton",
    name: "microTech",
    shipMineables: ["Iron", "Ice", "Hephaestanite", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Janalite"],
  },
  {
    id: "Stanton4a",
    system: "Stanton",
    name: "Calliope",
    shipMineables: ["Iron", "Ice", "Hephaestanite", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Janalite"],
  },
  {
    id: "Stanton4b",
    system: "Stanton",
    name: "Clio",
    shipMineables: ["Ice", "Copper", "Taranite", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Janalite"],
  },
  {
    id: "Stanton4c",
    system: "Stanton",
    name: "Euterpe",
    shipMineables: ["Ice", "Copper", "Taranite", "Quantanium"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Janalite"],
  },
  // Pyro
  {
    id: "Pyro1",
    system: "Pyro",
    name: "Pyro I",
    shipMineables: ["Iron", "Copper", "Tin", "Stileron"],
    groundVehicleMineables: ["Beradom"],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Pyro2",
    system: "Pyro",
    name: "Monox",
    shipMineables: ["Hephaestanite", "Iron", "Tin", "Stileron"],
    groundVehicleMineables: ["Glacosite"],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Pyro3",
    system: "Pyro",
    name: "Bloom",
    shipMineables: ["Quartz", "Borase", "Riccite", "Stileron"],
    groundVehicleMineables: ["Beradom"],
    handMineables: ["Aphorite", "Dolivine", "Janalite"],
  },
  {
    id: "Pyro4",
    system: "Pyro",
    name: "Pyro IV",
    shipMineables: ["Copper", "Laranite", "Borase", "Stileron"],
    groundVehicleMineables: ["Feynmaline"],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  // Pyro 5 moons
  {
    id: "Pyro5a",
    system: "Pyro",
    name: "Ignis",
    shipMineables: ["Tin", "Silicon", "Gold", "Riccite"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Pyro5b",
    system: "Pyro",
    name: "Vatra",
    shipMineables: ["Iron", "Silicon", "Gold", "Riccite"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Pyro5c",
    system: "Pyro",
    name: "Adir",
    shipMineables: ["Iron", "Tungsten", "Borase", "Riccite"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Pyro5d",
    system: "Pyro",
    name: "Fairo",
    shipMineables: ["Silicon", "Tungsten", "Gold", "Bexalite"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Pyro5e",
    system: "Pyro",
    name: "Fuego",
    shipMineables: ["Hephaestanite", "Aslarite", "Borase", "Bexalite"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Pyro5f",
    system: "Pyro",
    name: "Vuur",
    shipMineables: ["Hephaestanite", "Agricium", "Aslarite", "Bexalite"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Hadanite", "Janalite"],
  },
  {
    id: "Pyro6",
    system: "Pyro",
    name: "Terminus",
    shipMineables: ["Ice", "Copper", "Agricium", "Titanium", "Gold", "Riccite", "Stileron"],
    groundVehicleMineables: [],
    handMineables: ["Aphorite", "Dolivine", "Janalite"],
  },
  // Nyx (planets have no mineables in starmap data; asteroids/Glacium ring are space-only)
  {
    id: "NyxGlacium",
    system: "Nyx",
    name: "Glacium ring",
    shipMineables: ["Lindinium", "Savrilium"],
    groundVehicleMineables: [],
    handMineables: [],
  },
  {
    id: "Nyx1",
    system: "Nyx",
    name: "Nyx I",
    shipMineables: [],
    groundVehicleMineables: [],
    handMineables: [],
  },
  {
    id: "Nyx2",
    system: "Nyx",
    name: "Nyx II",
    shipMineables: [],
    groundVehicleMineables: [],
    handMineables: [],
  },
  {
    id: "Nyx3",
    system: "Nyx",
    name: "Nyx III",
    shipMineables: [],
    groundVehicleMineables: [],
    handMineables: [],
  },
];

export type LocationMethods = { ship: string[]; planet: string[]; cave: string[] };

export const SYSTEMS = [...new Set(PLANET_MATERIALS.map((p) => p.system))].sort();
export const PLANETS_BY_SYSTEM = SYSTEMS.reduce(
  (acc, sys) => {
    acc[sys] = [...new Set(PLANET_MATERIALS.filter((p) => p.system === sys).map((p) => p.name))].sort();
    return acc;
  },
  {} as Record<string, string[]>
);
export const ALL_PLANETS = [...new Set(PLANET_MATERIALS.map((p) => p.name))].sort();

/** Build reverse index: material name → locations by method (ship / planet / cave) */
export function getLocationsByMaterial(): Map<string, LocationMethods> {
  const map = new Map<string, LocationMethods>();

  for (const p of PLANET_MATERIALS) {
    const loc = `${p.system} / ${p.name}`;
    for (const m of p.shipMineables) {
      const key = normalize(m);
      if (!map.has(key)) map.set(key, { ship: [], planet: [], cave: [] });
      const entry = map.get(key)!;
      if (!entry.ship.includes(loc)) entry.ship.push(loc);
    }
    for (const m of p.groundVehicleMineables) {
      const key = normalize(m);
      if (!map.has(key)) map.set(key, { ship: [], planet: [], cave: [] });
      const entry = map.get(key)!;
      if (!entry.planet.includes(loc)) entry.planet.push(loc);
    }
    for (const m of p.handMineables) {
      const key = normalize(m);
      if (!map.has(key)) map.set(key, { ship: [], planet: [], cave: [] });
      const entry = map.get(key)!;
      if (!entry.cave.includes(loc)) entry.cave.push(loc);
    }
  }
  return map;
}
