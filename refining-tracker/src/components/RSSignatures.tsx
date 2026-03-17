import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { ORE_TYPES } from "../data/master";
import { RS_SIGNATURES, getClusterSignature } from "../data/master/rs-signatures";
import { getLocationsByMaterial } from "../data/planet-materials";
import { LocationPills } from "./LocationPills";
import type { RarityTier } from "../types/master";

const RARITY_ORDER: RarityTier[] = ["common", "uncommon", "rare", "epic", "legendary"];
const CLUSTER_SIZES = [1, 2, 3, 4, 5, 6] as const;
const locationByOreId = Object.fromEntries(ORE_TYPES.map((ore) => [ore.id, ore.locationTypes ?? []]));
const locationMap = getLocationsByMaterial();
const signatureByOreId = Object.fromEntries(RS_SIGNATURES.map((row) => [row.oreId, row]));

const RARITY_COLORS: Record<RarityTier, string> = {
  common: "text-text-dim",
  uncommon: "text-accent-green",
  rare: "text-accent-blue",
  epic: "text-accent-purple",
  legendary: "text-accent-amber",
};

type SortCol = "material" | "rarity" | "location" | "planetLocations" | 1 | 2 | 3 | 4 | 5 | 6;
type LocationFilter = "all" | "space" | "planet" | "cave";

function signatureStartsWith(baseSignature: number, query: string): boolean {
  return CLUSTER_SIZES.some((clusterSize) =>
    String(getClusterSignature(baseSignature, clusterSize)).startsWith(query)
  );
}

function textStartsWithQuery(value: string, query: string): boolean {
  return value.toLowerCase().startsWith(query);
}

function formatLocationRows(oreName: string) {
  const locations = locationMap.get(oreName) ?? { ship: [], planet: [], cave: [] };
  const rows = [
    ...locations.ship.map((loc) => ({ kind: "Ship", loc })),
    ...locations.planet.map((loc) => ({ kind: "Planet", loc })),
    ...locations.cave.map((loc) => ({ kind: "Cave", loc })),
  ].map(({ kind, loc }) => {
    const [system, planet] = loc.split(" / ");
    return {
      kind,
      system: system ?? "-",
      planet: planet ?? "-",
    };
  });

  return rows.sort((a, b) => {
    if (a.system !== b.system) return a.system.localeCompare(b.system);
    if (a.planet !== b.planet) return a.planet.localeCompare(b.planet);
    return a.kind.localeCompare(b.kind);
  });
}

function groupLocationsBySystem(locationRows: ReturnType<typeof formatLocationRows>) {
  const systems = new Map<string, { system: string; locations: string[] }>();

  locationRows.forEach((location) => {
    const existing = systems.get(location.system);
    if (existing) {
      if (!existing.locations.includes(location.planet)) {
        existing.locations.push(location.planet);
      }
      return;
    }

    systems.set(location.system, {
      system: location.system,
      locations: [location.planet],
    });
  });

  return Array.from(systems.values())
    .map((entry) => ({
      ...entry,
      locations: entry.locations.sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.system.localeCompare(b.system));
}

export default function RSSignatures() {
  const [signatureSearch, setSignatureSearch] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const [sortCol, setSortCol] = useState<SortCol>("material");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/") return;
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      event.preventDefault();
      searchInputRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const rows = ORE_TYPES.map((ore) => {
    const signature = signatureByOreId[ore.id] as (typeof RS_SIGNATURES)[number] | undefined;
    return {
      oreId: ore.id,
      name: signature?.name ?? ore.name,
      rarity: signature?.rarity ?? ore.rarity,
      baseSignature: signature?.baseSignature ?? null,
      locationTypes: locationByOreId[ore.id] ?? [],
      locationRows: formatLocationRows(signature?.name ?? ore.name),
      locationSystems: groupLocationsBySystem(formatLocationRows(signature?.name ?? ore.name)),
    };
  });

  const signatureQuery = signatureSearch.replace(/,/g, "").trim();
  const isValidSignatureSearch = /^\d+$/.test(signatureQuery);
  const materialQuery = materialSearch.trim().toLowerCase();

  const filtered = rows.filter((row) => {
    if (isValidSignatureSearch) {
      if (row.baseSignature === null || !signatureStartsWith(row.baseSignature, signatureQuery)) {
        return false;
      }
    }

    if (materialQuery) {
      if (!textStartsWithQuery(row.name, materialQuery)) return false;
    }

    if (locationFilter !== "all" && !row.locationTypes.includes(locationFilter)) {
      return false;
    }

    return true;
  });

  function handleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortCol(col);
    setSortDir("asc");
  }

  const sorted = [...filtered].sort((a, b) => {
    const direction = sortDir === "asc" ? 1 : -1;

    if (sortCol === "material") {
      return direction * a.name.localeCompare(b.name);
    }

    if (sortCol === "rarity") {
      const rarityA = a.rarity ? RARITY_ORDER.indexOf(a.rarity) : Number.MAX_SAFE_INTEGER;
      const rarityB = b.rarity ? RARITY_ORDER.indexOf(b.rarity) : Number.MAX_SAFE_INTEGER;
      if (rarityA !== rarityB) return direction * (rarityA - rarityB);
      return direction * a.name.localeCompare(b.name);
    }

    if (sortCol === "location") {
      return direction * a.locationTypes.join(",").localeCompare(b.locationTypes.join(","));
    }

    if (sortCol === "planetLocations") {
      const locationsA = a.locationSystems.map((row) => `${row.system}/${row.locations.join(",")}`).join("|");
      const locationsB = b.locationSystems.map((row) => `${row.system}/${row.locations.join(",")}`).join("|");
      return direction * locationsA.localeCompare(locationsB);
    }

    const clusterNumber = sortCol;
    const signatureA = typeof a.baseSignature === "number" ? getClusterSignature(a.baseSignature, clusterNumber) : -1;
    const signatureB = typeof b.baseSignature === "number" ? getClusterSignature(b.baseSignature, clusterNumber) : -1;
    if (signatureA !== signatureB) return direction * (signatureA - signatureB);
    return direction * a.name.localeCompare(b.name);
  });

  function SortableHeader({
    col,
    label,
    align = "left",
  }: {
    col: SortCol;
    label: string;
    align?: "left" | "center" | "right";
  }) {
    const isActive = sortCol === col;
    return (
      <th
        onClick={() => handleSort(col)}
        className={`select-none cursor-pointer py-2 px-3 text-text-dim font-medium hover:text-text transition-colors ${
          align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"
        } ${isActive ? "text-accent-amber" : ""}`}
      >
        <span className={`inline-flex items-center gap-1 ${align === "center" ? "justify-center" : ""}`}>
          {label}
          {isActive ? sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} /> : null}
        </span>
      </th>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
          <Search size={18} className="text-accent-amber" />
          Material Finder
        </h2>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-0.5 text-sm leading-tight text-text-dim">
            <p>Use this table to identify materials from RS signatures and quickly check known planet locations.</p>
            <p>Signature value = base x cluster size. Numbers 1-6 = rocks in the cluster.</p>
          </div>
          <div className="flex flex-wrap items-end gap-3 shrink-0">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-text-dim">Search signature:</span>
              <input
                ref={searchInputRef}
                type="text"
                inputMode="numeric"
                placeholder="e.g. 4300"
                title="Press / to focus"
                value={signatureSearch}
                onChange={(event) => setSignatureSearch(event.target.value)}
                className="w-40 min-w-[10rem] rounded-lg border border-dark-600 bg-dark-800 px-4 py-2.5 text-base font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-accent-amber/50"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-text-dim">Search material:</span>
              <input
                type="text"
                placeholder="e.g. Carinite"
                value={materialSearch}
                onChange={(event) => setMaterialSearch(event.target.value)}
                className="w-52 min-w-[12rem] rounded-lg border border-dark-600 bg-dark-800 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent-amber/50"
              />
            </label>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-text-dim">Filter location:</span>
              <div className="flex items-center gap-1 rounded-lg border border-dark-700 bg-dark-900/70 p-1">
                {[
                  { id: "all", label: "All" },
                  { id: "space", label: "Space" },
                  { id: "planet", label: "Planet" },
                  { id: "cave", label: "Cave" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setLocationFilter(option.id as LocationFilter)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      locationFilter === option.id
                        ? "bg-accent-amber/20 text-accent-amber"
                        : "text-text-dim hover:bg-dark-800 hover:text-text"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-1.5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-600">
                <SortableHeader col="material" label="Material" />
                <SortableHeader col="rarity" label="Rarity" />
                <SortableHeader col="location" label="Location" />
                <SortableHeader col="planetLocations" label="Planet Locations" />
                {CLUSTER_SIZES.map((clusterSize) => (
                  <SortableHeader key={clusterSize} col={clusterSize} label={String(clusterSize)} align="right" />
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const baseSignature = typeof row.baseSignature === "number" ? row.baseSignature : null;

                return (
                  <tr
                    key={row.oreId}
                    className="border-b border-dark-700/50 transition-colors hover:bg-dark-800/50"
                  >
                    <td className="px-3 py-2 font-medium">{row.name}</td>
                    <td className={`px-3 py-2 font-medium capitalize ${row.rarity ? RARITY_COLORS[row.rarity] : "text-text-dim"}`}>
                      {row.rarity ?? "-"}
                    </td>
                    <td className="px-3 py-2">
                      <LocationPills types={row.locationTypes} />
                    </td>
                    <td className="px-3 py-2">
                      {row.locationSystems.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {row.locationSystems.map((systemGroup) => (
                            <div key={`${row.oreId}-${systemGroup.system}`} className="group relative inline-block">
                              <button
                                type="button"
                                aria-label={`Show ${systemGroup.system} locations for ${row.name}`}
                                className={`inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 ${
                                  systemGroup.system === "Stanton"
                                    ? "border-accent-blue/40 bg-accent-blue/15 text-accent-blue focus:ring-accent-blue/40"
                                    : systemGroup.system === "Pyro"
                                      ? "border-accent-amber/40 bg-accent-amber/15 text-accent-amber focus:ring-accent-amber/40"
                                      : "border-accent-purple/40 bg-accent-purple/15 text-accent-purple focus:ring-accent-purple/40"
                                }`}
                              >
                                {systemGroup.system}
                              </button>
                              <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden min-w-[220px] rounded-lg border border-dark-600 bg-dark-900/95 p-3 shadow-xl backdrop-blur group-hover:block group-focus-within:block">
                                <div className="mb-2 text-xs font-semibold text-text">{systemGroup.system} Locations</div>
                                <ul className="space-y-1 text-xs text-text">
                                  {systemGroup.locations.map((location) => (
                                    <li key={`${row.oreId}-${systemGroup.system}-${location}`} className="border-b border-dark-800 py-1 last:border-0">
                                      {location}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-text-dim">-</span>
                      )}
                    </td>
                    {CLUSTER_SIZES.map((clusterSize) => {
                      if (baseSignature === null) {
                        return (
                          <td key={clusterSize} className="px-3 py-2 text-right font-mono tabular-nums text-text-dim">
                            -
                          </td>
                        );
                      }

                      const cellValue = getClusterSignature(baseSignature, clusterSize);
                      const cellMatches = isValidSignatureSearch && String(cellValue).startsWith(signatureQuery);
                      return (
                        <td
                          key={clusterSize}
                          className={`px-3 py-2 text-right font-mono tabular-nums ${
                            cellMatches ? "font-semibold text-accent-amber" : "text-text-dim"
                          }`}
                        >
                          {cellValue.toLocaleString()}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-1 rounded-lg border border-dark-700 bg-dark-800 p-3 text-xs text-text-dim">
          <p><strong>Location Legend:</strong> Space = ship mining. Planet = ground vehicle or ship mining. Cave = hand mining.</p>
          <p><strong>Asteroid vs Planet:</strong> Same base signature for both - observed in-game for space asteroids and planet/moon surface rocks.</p>
          <p><strong>Note:</strong> Hover a system pill to view mapped moons, planets, and cave locations. Materials without RS data stay in the table with blank cluster values.</p>
        </div>
      </div>
    </div>
  );
}
