import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Globe, Mountain, Rocket, Search } from "lucide-react";
import { SectionHeader } from "./CraftingSections";
import { ORE_TYPES } from "../../../refining-tracker/src/data/master";
import { RS_SIGNATURES, getClusterSignature } from "../../../refining-tracker/src/data/master/rs-signatures";
import { getLocationsByMaterial } from "../../../refining-tracker/src/data/planet-materials";
import type { RarityTier } from "../../../refining-tracker/src/types/master";

type LocationType = "space" | "planet" | "cave";
type SortCol = "material" | "rarity" | "location" | "planetLocations" | 1 | 2 | 3 | 4 | 5 | 6;
type LocationFilter = "all" | "space" | "planet" | "cave";

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

const LOCATION_LABELS: Record<LocationType, string> = {
  space: "Space",
  planet: "Planet",
  cave: "Cave",
};

const LOCATION_PILL_STYLES: Record<LocationType, string> = {
  space: "border-dark-700 bg-dark-900 text-text",
  planet: "border-accent-green/35 bg-accent-green/12 text-accent-green",
  cave: "border-accent-yellow/35 bg-accent-yellow/12 text-accent-yellow",
};

function signatureStartsWith(baseSignature: number, query: string): boolean {
  return CLUSTER_SIZES.some((clusterSize) => String(getClusterSignature(baseSignature, clusterSize)).startsWith(query));
}

function textMatchesQuery(value: string, query: string): boolean {
  return value.toLowerCase().includes(query);
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

function LocationPills(props: { types?: LocationType[] }) {
  if (!props.types?.length) {
    return <span className="text-text-dim">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {props.types.map((type) => (
        <span
          key={type}
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium ${LOCATION_PILL_STYLES[type]}`}
        >
          {type === "space" && <Rocket className="h-3 w-3" />}
          {type === "planet" && <Globe className="h-3 w-3" />}
          {type === "cave" && <Mountain className="h-3 w-3" />}
          {LOCATION_LABELS[type]}
        </span>
      ))}
    </div>
  );
}

function SystemLocationPills(props: { oreId: string; oreName: string; locationSystems: { system: string; locations: string[] }[] }) {
  if (props.locationSystems.length === 0) {
    return <span className="text-text-dim">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {props.locationSystems.map((systemGroup) => (
        <div key={`${props.oreId}-${systemGroup.system}`} className="group relative inline-block">
          <button
            type="button"
            aria-label={`Show ${systemGroup.system} locations for ${props.oreName}`}
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
          <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden min-w-[220px] rounded-lg border border-dark-700 bg-dark-950/95 p-3 shadow-xl backdrop-blur group-hover:block group-focus-within:block">
            <div className="mb-2 text-xs font-semibold text-text">{systemGroup.system} Locations</div>
            <ul className="space-y-1 text-xs text-text">
              {systemGroup.locations.map((location) => (
                <li key={`${props.oreId}-${systemGroup.system}-${location}`} className="border-b border-dark-800 py-1 last:border-0">
                  {location}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function SortableHeader(props: {
  col: SortCol;
  sortCol: SortCol;
  sortDir: "asc" | "desc";
  label: string;
  align?: "left" | "center" | "right";
  onSort: (col: SortCol) => void;
}) {
  const isActive = props.sortCol === props.col;
  return (
    <th
      onClick={() => props.onSort(props.col)}
      className={`cursor-pointer select-none px-3 py-2 font-medium transition-colors ${
        props.align === "center" ? "text-center" : props.align === "right" ? "text-right" : "text-left"
      } ${isActive ? "text-accent-green" : "text-text-dim hover:text-text"}`}
    >
      <span className={`inline-flex items-center gap-1 ${props.align === "center" ? "justify-center" : ""}`}>
        {props.label}
        {isActive ? props.sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" /> : null}
      </span>
    </th>
  );
}

export function MaterialFinderPanel(props: {
  icon: ReactNode;
  focusedMaterial?: { name: string; nonce: number } | null;
}) {
  const [signatureSearch, setSignatureSearch] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const [sortCol, setSortCol] = useState<SortCol>("material");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const materialSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!props.focusedMaterial) return;
    setMaterialSearch(props.focusedMaterial.name);
    setSignatureSearch("");
    setLocationFilter("all");
    materialSearchRef.current?.focus();
  }, [props.focusedMaterial]);

  const rows = useMemo(
    () =>
      ORE_TYPES.map((ore) => {
        const signature = signatureByOreId[ore.id] as (typeof RS_SIGNATURES)[number] | undefined;
        const name = signature?.name ?? ore.name;
        const locationRows = formatLocationRows(name);
        return {
          oreId: ore.id,
          name,
          rarity: signature?.rarity ?? ore.rarity,
          baseSignature: signature?.baseSignature ?? null,
          locationTypes: locationByOreId[ore.id] ?? [],
          locationRows,
          locationSystems: groupLocationsBySystem(locationRows),
        };
      }),
    [],
  );

  const signatureQuery = signatureSearch.replace(/,/g, "").trim();
  const isValidSignatureSearch = /^\d+$/.test(signatureQuery);
  const materialQuery = materialSearch.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        if (isValidSignatureSearch) {
          if (row.baseSignature === null || !signatureStartsWith(row.baseSignature, signatureQuery)) {
            return false;
          }
        }

        if (materialQuery && !textMatchesQuery(row.name, materialQuery)) {
          return false;
        }

        if (locationFilter !== "all" && !row.locationTypes.includes(locationFilter)) {
          return false;
        }

        return true;
      }),
    [isValidSignatureSearch, locationFilter, materialQuery, rows, signatureQuery],
  );

  function handleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortCol(col);
    setSortDir("asc");
  }

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
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
    return copy;
  }, [filtered, sortCol, sortDir]);

  return (
    <section className="panel overflow-hidden p-0">
      <div className="border-b border-dark-700 px-5 py-4">
        <SectionHeader
          icon={props.icon}
          title="Material Finder"
          description="Check mining location types, mapped systems, and RS signatures for each crafting material."
        />
      </div>

      <div className="px-5 py-5">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-1 text-sm text-text-dim">
            <p>Jump here from recipe requirements or your inventory to see where a material is found.</p>
            <p>RS signature value = base signature x cluster size. Hover a system pill to see mapped planets and moons.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(180px,0.8fr)_minmax(220px,1fr)_auto] xl:items-end">
            <label className="panel-muted flex items-center gap-3 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-text-muted" />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Search signature"
                title="Filter by scanned RS value"
                value={signatureSearch}
                onChange={(event) => setSignatureSearch(event.target.value)}
                className="w-full bg-transparent font-mono text-sm text-text outline-none placeholder:text-text-muted"
              />
            </label>

            <label className="panel-muted flex items-center gap-3 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-text-muted" />
              <input
                ref={materialSearchRef}
                type="text"
                placeholder="Search material"
                value={materialSearch}
                onChange={(event) => setMaterialSearch(event.target.value)}
                className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dark-700 bg-dark-900/70 p-1">
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
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    locationFilter === option.id
                      ? "bg-accent-green/16 text-accent-green"
                      : "text-text-dim hover:bg-dark-800 hover:text-text"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1100px] overflow-hidden rounded-xl border border-dark-700 bg-dark-900/45">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700 bg-dark-900/65 text-[11px] uppercase tracking-[0.16em]">
                  <SortableHeader col="material" sortCol={sortCol} sortDir={sortDir} label="Material" onSort={handleSort} />
                  <SortableHeader col="rarity" sortCol={sortCol} sortDir={sortDir} label="Rarity" onSort={handleSort} />
                  <SortableHeader col="location" sortCol={sortCol} sortDir={sortDir} label="Location" onSort={handleSort} />
                  <SortableHeader
                    col="planetLocations"
                    sortCol={sortCol}
                    sortDir={sortDir}
                    label="Mapped Systems"
                    onSort={handleSort}
                  />
                  {CLUSTER_SIZES.map((clusterSize) => (
                    <SortableHeader
                      key={clusterSize}
                      col={clusterSize}
                      sortCol={sortCol}
                      sortDir={sortDir}
                      label={String(clusterSize)}
                      align="right"
                      onSort={handleSort}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((row) => {
                  const baseSignature = typeof row.baseSignature === "number" ? row.baseSignature : null;

                  return (
                    <tr key={row.oreId} className="border-b border-dark-700/60 transition-colors hover:bg-dark-800/45">
                      <td className="px-3 py-2 font-medium text-text">{row.name}</td>
                      <td className={`px-3 py-2 font-medium capitalize ${row.rarity ? RARITY_COLORS[row.rarity] : "text-text-dim"}`}>
                        {row.rarity ?? "-"}
                      </td>
                      <td className="px-3 py-2">
                        <LocationPills types={row.locationTypes as LocationType[]} />
                      </td>
                      <td className="px-3 py-2">
                        <SystemLocationPills oreId={row.oreId} oreName={row.name} locationSystems={row.locationSystems} />
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
                              cellMatches ? "font-semibold text-accent-green" : "text-text-dim"
                            }`}
                          >
                            {cellValue.toLocaleString("en-GB")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-text-muted">
                      No materials match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-dark-700 bg-dark-900/60 px-4 py-3 text-xs text-text-dim">
          <p>{sorted.length} material entries shown.</p>
          <p>Space = ship mining. Planet = surface mining with ship or ROC depending on the material. Cave = hand mining.</p>
          <p>Materials without RS signature data stay visible with blank cluster values so the location mapping still helps.</p>
        </div>
      </div>
    </section>
  );
}
