import { useMemo, useState } from "react";
import { Building2, Search } from "lucide-react";
import type { RefiningData } from "../uex-api";

export default function StationBonuses({ data }: { data: RefiningData }) {
  const [search, setSearch] = useState("");

  const stations = useMemo(() => {
    const map = new Map<string, string>();
    for (const y of data.yields) {
      if (y.stationId !== "0" && y.stationName) {
        map.set(y.stationId, y.stationName);
      }
    }
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data.yields]);

  const yieldMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const y of data.yields) {
      const key = `${y.oreCode}::${y.stationId}`;
      map.set(key, y.yieldBonus);
    }
    return map;
  }, [data.yields]);

  const oresWithYields = useMemo(() => {
    const oreIds = new Set(data.yields.map((y) => y.oreCode));
    return data.ores.filter((o) => oreIds.has(String(o.rawId)));
  }, [data.ores, data.yields]);

  const filteredOres = useMemo(
    () =>
      oresWithYields.filter(
        (o) =>
          o.name.toLowerCase().includes(search.toLowerCase()) ||
          o.code.toLowerCase().includes(search.toLowerCase())
      ),
    [oresWithYields, search]
  );

  const bonusColor = (val: number) => {
    if (val > 0) return "text-accent-green bg-accent-green/10";
    if (val < 0) return "text-accent-red bg-accent-red/10";
    return "text-text-muted";
  };

  const hasYieldData = data.yields.length > 0 && stations.length > 0;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Building2 size={18} className="text-accent-amber" />
        Station Yield Bonuses
      </h2>

      {!hasYieldData ? (
        <div className="text-center py-12 text-text-dim">
          <Building2 size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            Station yield bonus data is not currently available from the API.
          </p>
          <p className="text-xs text-text-muted mt-1">
            This section will populate automatically when the UEX API provides per-station yield data.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-dim mb-4">
            Yield bonuses per ore at each refinery station. Green = bonus yield, red = penalty.
          </p>
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Filter ores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent-blue/50 transition-colors"
            />
          </div>

          <div className="overflow-x-auto -mx-1.5">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-2 px-2 text-text-dim font-medium sticky left-0 bg-dark-900 z-10 min-w-[140px]">
                    Station
                  </th>
                  {filteredOres.map((ore) => (
                    <th
                      key={ore.rawId}
                      className="text-center py-2 px-1 text-text-dim font-medium whitespace-nowrap"
                    >
                      {ore.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stations.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-dark-700/30 hover:bg-dark-800/50"
                  >
                    <td className="py-2 px-2 font-medium sticky left-0 bg-dark-900/95 z-10 whitespace-nowrap">
                      {s.name}
                    </td>
                    {filteredOres.map((ore) => {
                      const bonus = yieldMap.get(`${ore.rawId}::${s.id}`) ?? 0;
                      return (
                        <td key={ore.rawId} className="py-2 px-1 text-center">
                          {bonus !== 0 ? (
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold ${bonusColor(bonus)}`}
                            >
                              {bonus > 0 ? "+" : ""}
                              {bonus}%
                            </span>
                          ) : (
                            <span className="text-text-muted/30">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
