import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { ORE_TYPES } from "../data/master";
import { getLocationsByMaterial, SYSTEMS, PLANETS_BY_SYSTEM, ALL_PLANETS } from "../data/planet-materials";
import { LocationPills, SystemPills } from "./LocationPills";

type LocationFilter = "space" | "planet" | "cave";

const LOCATION_LABELS: Record<LocationFilter, string> = {
  space: "Space",
  planet: "Planet",
  cave: "Cave",
};

const locationMap = getLocationsByMaterial();

function getWhereToFind(oreName: string) {
  return locationMap.get(oreName) ?? { ship: [], planet: [], cave: [] };
}

export default function MaterialFinder() {
  const [search, setSearch] = useState("");
  const [systemFilter, setSystemFilter] = useState("");
  const [planetFilter, setPlanetFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState<LocationFilter | "">("");

  const planets = systemFilter ? (PLANETS_BY_SYSTEM[systemFilter] ?? []) : ALL_PLANETS;

  const filtered = useMemo(() => {
    let list = ORE_TYPES;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => {
        if (o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q)) return true;
        const locs = getWhereToFind(o.name);
        const allLocs = [...new Set([...locs.ship, ...locs.planet, ...locs.cave])];
        for (const loc of allLocs) {
          const [sys, pl] = loc.split(" / ");
          if ((sys ?? "").toLowerCase().includes(q) || (pl ?? "").toLowerCase().includes(q)) return true;
        }
        const locLabels = (o.locationTypes ?? []).map((t) => LOCATION_LABELS[t].toLowerCase());
        if (locLabels.some((l) => l.includes(q))) return true;
        return false;
      });
    }
    if (locationFilter) {
      list = list.filter((o) => o.locationTypes?.includes(locationFilter));
    }
    if (systemFilter || planetFilter) {
      list = list.filter((o) => {
        const locs = getWhereToFind(o.name);
        const allLocs = [...new Set([...locs.ship, ...locs.planet, ...locs.cave])];
        let pairs = allLocs.map((s) => {
          const [sys, pl] = s.split(" / ");
          return { system: sys ?? "", planet: pl ?? "" };
        });
        if (systemFilter) pairs = pairs.filter((p) => p.system === systemFilter);
        if (planetFilter) pairs = pairs.filter((p) => p.planet === planetFilter);
        return pairs.length > 0;
      });
    }
    // Hide materials with no system data (for now)
    list = list.filter((o) => {
      const locs = getWhereToFind(o.name);
      const allLocs = [...new Set([...locs.ship, ...locs.planet, ...locs.cave])];
      return allLocs.length > 0;
    });
    return list.sort((a, b) => (a.name < b.name ? -1 : 1));
  }, [search, locationFilter, systemFilter, planetFilter]);

  const hasActiveFilters = !!(search.trim() || systemFilter || planetFilter || locationFilter);
  const clearFilters = () => {
    setSearch("");
    setSystemFilter("");
    setPlanetFilter("");
    setLocationFilter("");
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search size={18} className="text-accent-blue" />
          Material Finder
        </h2>
        <p className="text-sm text-text-dim mb-4">
          What material do you need? Where do you find it? What equipment do you need? Ship can mine space and planet large rocks; vehicles are limited to smaller planet rocks. Planet/moon locations are from Stanton, Pyro, and Nyx (in-game starmap).
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm focus:outline-none focus:ring-2 focus:ring-accent-amber/50"
            />
          </div>
          <select
            value={systemFilter}
            onChange={(e) => {
              setSystemFilter(e.target.value);
              setPlanetFilter("");
            }}
            className="px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm text-text-dim focus:outline-none focus:ring-2 focus:ring-accent-amber/50 min-w-[100px]"
          >
            <option value="">System</option>
            {SYSTEMS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={planetFilter}
            onChange={(e) => setPlanetFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm text-text-dim focus:outline-none focus:ring-2 focus:ring-accent-amber/50 min-w-[120px]"
          >
            <option value="">Planet</option>
            {planets.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter((e.target.value || "") as LocationFilter | "")}
            className="px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm text-text-dim focus:outline-none focus:ring-2 focus:ring-accent-amber/50 min-w-[100px]"
          >
            <option value="">Location</option>
            {(["space", "planet", "cave"] as const).map((m) => (
              <option key={m} value={m}>
                {LOCATION_LABELS[m]}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark-700 text-text-dim hover:text-text hover:bg-dark-600 text-sm font-medium transition-colors"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto -mx-1.5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-2 px-4 text-text-dim font-medium">ID</th>
                <th className="text-left py-2 px-4 text-text-dim font-medium">Material</th>
                <th className="text-left py-2 px-4 text-text-dim font-medium">Location</th>
                <th className="text-left py-2 px-4 text-text-dim font-medium">System</th>
                <th className="text-left py-2 px-4 text-text-dim font-medium">Planet</th>
                <th className="text-right py-2 px-4 text-text-dim font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ore) => {
                const locs = getWhereToFind(ore.name);
                const allLocs = [...new Set([...locs.ship, ...locs.planet, ...locs.cave])];
                let pairs = allLocs.map((s) => {
                  const [system, planet] = s.split(" / ");
                  return { system: system ?? "—", planet: planet ?? "—" };
                });
                if (systemFilter) pairs = pairs.filter((p) => p.system === systemFilter);
                if (planetFilter) pairs = pairs.filter((p) => p.planet === planetFilter);
                const systems = [...new Set(pairs.map((p) => p.system))].filter((s) => s !== "—").sort();
                const planets = [...new Set(pairs.map((p) => p.planet))].sort().join(", ");
                const hasData = pairs.length > 0;
                return (
                  <tr key={ore.id} className="border-b border-dark-700/50 hover:bg-dark-800/50 transition-colors">
                    <td className="py-2 px-4 font-mono text-xs text-text-muted">{ore.code}</td>
                    <td className="py-2 px-4 font-medium">{ore.name}</td>
                    <td className="py-2 px-4">
                      <LocationPills types={ore.locationTypes} />
                    </td>
                    <td className="py-2 px-4">
                      <SystemPills systems={hasData ? systems : undefined} />
                    </td>
                    <td className="py-2 px-4 text-xs text-text-dim break-words whitespace-normal align-top">{hasData ? planets : "—"}</td>
                    <td className="py-2 px-4 text-right font-mono">
                      {ore.value != null ? ore.value.toLocaleString() : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className="py-8 text-center text-text-dim text-sm">No materials match your filters.</p>
        )}
      </div>
    </div>
  );
}
