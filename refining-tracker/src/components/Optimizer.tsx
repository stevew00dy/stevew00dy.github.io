import { useState, useMemo } from "react";
import { Search, TrendingUp, Clock, DollarSign, ArrowUpDown, Gem, ChevronUp, ChevronDown } from "lucide-react";
import type { RefiningData } from "../uex-api";
import { RATING_LABELS } from "../data/refineries";

type SortKey = "yield" | "cost" | "speed";
type ComparisonSortCol = "method" | "yield" | "cost" | "speed" | "bestFor";

function RatingDots({ value, max = 3, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-all ${
            i < value ? color : "bg-dark-700"
          }`}
        />
      ))}
    </div>
  );
}

export default function Optimizer({ data }: { data: RefiningData }) {
  const [search, setSearch] = useState("");
  const [selectedOreId, setSelectedOreId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("yield");
  const [comparisonSortCol, setComparisonSortCol] = useState<ComparisonSortCol | null>(null);
  const [comparisonSortDir, setComparisonSortDir] = useState<"asc" | "desc">("asc");

  const filteredOres = useMemo(
    () =>
      data.ores.filter(
        (o) =>
          o.name.toLowerCase().includes(search.toLowerCase()) ||
          o.code.toLowerCase().includes(search.toLowerCase())
      ),
    [data.ores, search]
  );

  const selectedOre = useMemo(
    () => data.ores.find((o) => o.rawId === selectedOreId) ?? null,
    [data.ores, selectedOreId]
  );

  const sorted = useMemo(() => {
    const methods = [...data.methods];
    switch (sortBy) {
      case "yield":
        return methods.sort((a, b) => b.ratingYield - a.ratingYield || a.ratingCost - b.ratingCost);
      case "cost":
        return methods.sort((a, b) => a.ratingCost - b.ratingCost || b.ratingYield - a.ratingYield);
      case "speed":
        return methods.sort((a, b) => b.ratingSpeed - a.ratingSpeed || b.ratingYield - a.ratingYield);
    }
  }, [data.methods, sortBy]);

  const bestForOrder = (bf: string) =>
    bf === "Max Profit" ? 4 : bf === "Quick Runs" ? 3 : bf === "Budget" ? 2 : bf === "Balanced" ? 1 : 0;

  const comparisonMethods = useMemo(() => {
    if (!comparisonSortCol) return data.methods;
    const m = [...data.methods];
    const dir = comparisonSortDir === "asc" ? 1 : -1;
    m.sort((a, b) => {
      switch (comparisonSortCol) {
        case "method":
          return dir * (a.name.localeCompare(b.name) || a.code.localeCompare(b.code));
        case "yield":
          return dir * (a.ratingYield - b.ratingYield || a.ratingCost - b.ratingCost);
        case "cost":
          return dir * (a.ratingCost - b.ratingCost || b.ratingYield - a.ratingYield);
        case "speed":
          return dir * (a.ratingSpeed - b.ratingSpeed || b.ratingYield - a.ratingYield);
        case "bestFor": {
          const bfA =
            a.ratingYield === 3 && a.ratingCost <= 2
              ? "Max Profit"
              : a.ratingSpeed === 3 && a.ratingYield >= 1
                ? "Quick Runs"
                : a.ratingCost === 1
                  ? "Budget"
                  : a.ratingYield >= 2 && a.ratingSpeed >= 2
                    ? "Balanced"
                    : "Niche";
          const bfB =
            b.ratingYield === 3 && b.ratingCost <= 2
              ? "Max Profit"
              : b.ratingSpeed === 3 && b.ratingYield >= 1
                ? "Quick Runs"
                : b.ratingCost === 1
                  ? "Budget"
                  : b.ratingYield >= 2 && b.ratingSpeed >= 2
                    ? "Balanced"
                    : "Niche";
          return dir * (bestForOrder(bfA) - bestForOrder(bfB));
        }
        default:
          return 0;
      }
    });
    return m;
  }, [data.methods, comparisonSortCol, comparisonSortDir]);

  function handleComparisonSort(col: ComparisonSortCol) {
    if (comparisonSortCol === col) {
      setComparisonSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setComparisonSortCol(col);
      setComparisonSortDir("asc");
    }
  }

  const yieldColor = (val: number) =>
    val === 3 ? "text-accent-green" : val === 2 ? "text-accent-amber" : "text-accent-red";
  const costColor = (val: number) =>
    val === 1 ? "text-accent-green" : val === 2 ? "text-accent-amber" : "text-accent-red";
  const speedColor = (val: number) =>
    val === 3 ? "text-accent-green" : val === 2 ? "text-accent-amber" : "text-accent-red";

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <Search size={18} className="text-accent-blue" />
          Select Ore
        </h2>
        <p className="text-sm text-text-dim mb-4">
          Pick an ore to see the best refining methods for it. Prices are refined sell values (aUEC per SCU) from UEX Corp.
        </p>
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search ores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {filteredOres.map((ore) => (
            <button
              key={ore.rawId}
              onClick={() => setSelectedOreId(ore.rawId === selectedOreId ? null : ore.rawId)}
              className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                ore.rawId === selectedOreId
                  ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                  : "border-dark-700 bg-dark-800/50 text-text-secondary hover:border-dark-600 hover:bg-dark-700/50"
              }`}
            >
              <span className="font-medium block truncate">{ore.name}</span>
              <span className="font-mono text-xs text-text-muted">
                {ore.refinedPriceSell.toLocaleString()} aUEC/SCU
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedOre && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-accent-green" />
              Best Methods for {selectedOre.name}
            </h2>
            <div className="flex gap-1">
              {(["yield", "cost", "speed"] as SortKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                    sortBy === key
                      ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/30"
                      : "bg-dark-800 text-text-dim border border-dark-700 hover:bg-dark-700"
                  }`}
                >
                  {key === "yield" && <TrendingUp size={12} />}
                  {key === "cost" && <DollarSign size={12} />}
                  {key === "speed" && <Clock size={12} />}
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {sorted.map((method, idx) => (
              <div
                key={method.id}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                  idx === 0
                    ? "border-accent-green/30 bg-accent-green/5"
                    : "border-dark-700 bg-dark-800/30"
                }`}
              >
                <span
                  className={`font-mono text-lg font-bold w-8 text-center ${
                    idx === 0 ? "text-accent-green" : "text-text-muted"
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{method.name}</div>
                  <span className="font-mono text-xs text-text-muted">{method.code}</span>
                </div>
                <div className="flex gap-6 text-xs">
                  <div className="text-center">
                    <div className="text-text-muted mb-0.5 flex items-center gap-1">
                      <TrendingUp size={10} /> Yield
                    </div>
                    <div className={`font-mono font-semibold ${yieldColor(method.ratingYield)}`}>
                      {RATING_LABELS[method.ratingYield]}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-text-muted mb-0.5 flex items-center gap-1">
                      <DollarSign size={10} /> Cost
                    </div>
                    <div className={`font-mono font-semibold ${costColor(method.ratingCost)}`}>
                      {RATING_LABELS[method.ratingCost]}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-text-muted mb-0.5 flex items-center gap-1">
                      <Clock size={10} /> Speed
                    </div>
                    <div className={`font-mono font-semibold ${speedColor(method.ratingSpeed)}`}>
                      {RATING_LABELS[method.ratingSpeed]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowUpDown size={18} className="text-accent-purple" />
          Method Comparison
        </h2>
        <p className="text-sm text-text-dim mb-6">
          All 9 refining methods compared. Higher yield = more refined output. Higher speed = faster
          processing. Lower cost = cheaper.
        </p>

        <div className="overflow-x-auto -mx-1.5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-3 text-text-dim font-medium">
                  <button
                    type="button"
                    onClick={() => handleComparisonSort("method")}
                    className="flex items-center gap-1 hover:text-text transition-colors"
                  >
                    Method
                    {comparisonSortCol === "method" &&
                      (comparisonSortDir === "asc" ? <ChevronUp size={12} className="text-accent-amber" /> : <ChevronDown size={12} className="text-accent-amber" />)}
                  </button>
                </th>
                <th className="text-center py-3 px-3 text-text-dim font-medium">
                  <button
                    type="button"
                    onClick={() => handleComparisonSort("yield")}
                    className="flex items-center justify-center gap-1 w-full hover:text-text transition-colors"
                  >
                    <TrendingUp size={12} /> Yield
                    {comparisonSortCol === "yield" &&
                      (comparisonSortDir === "asc" ? <ChevronUp size={12} className="text-accent-amber" /> : <ChevronDown size={12} className="text-accent-amber" />)}
                  </button>
                </th>
                <th className="text-center py-3 px-3 text-text-dim font-medium">
                  <button
                    type="button"
                    onClick={() => handleComparisonSort("cost")}
                    className="flex items-center justify-center gap-1 w-full hover:text-text transition-colors"
                  >
                    <DollarSign size={12} /> Cost
                    {comparisonSortCol === "cost" &&
                      (comparisonSortDir === "asc" ? <ChevronUp size={12} className="text-accent-amber" /> : <ChevronDown size={12} className="text-accent-amber" />)}
                  </button>
                </th>
                <th className="text-center py-3 px-3 text-text-dim font-medium">
                  <button
                    type="button"
                    onClick={() => handleComparisonSort("speed")}
                    className="flex items-center justify-center gap-1 w-full hover:text-text transition-colors"
                  >
                    <Clock size={12} /> Speed
                    {comparisonSortCol === "speed" &&
                      (comparisonSortDir === "asc" ? <ChevronUp size={12} className="text-accent-amber" /> : <ChevronDown size={12} className="text-accent-amber" />)}
                  </button>
                </th>
                <th className="text-center py-3 px-3 text-text-dim font-medium">
                  <button
                    type="button"
                    onClick={() => handleComparisonSort("bestFor")}
                    className="flex items-center justify-center gap-1 w-full hover:text-text transition-colors"
                  >
                    Best For
                    {comparisonSortCol === "bestFor" &&
                      (comparisonSortDir === "asc" ? <ChevronUp size={12} className="text-accent-amber" /> : <ChevronDown size={12} className="text-accent-amber" />)}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonMethods.map((method) => {
                const bestFor =
                  method.ratingYield === 3 && method.ratingCost <= 2
                    ? "Max Profit"
                    : method.ratingSpeed === 3 && method.ratingYield >= 1
                      ? "Quick Runs"
                      : method.ratingCost === 1
                        ? "Budget"
                        : method.ratingYield >= 2 && method.ratingSpeed >= 2
                          ? "Balanced"
                          : "Niche";
                const bestForColor =
                  bestFor === "Max Profit"
                    ? "text-accent-green bg-accent-green/10"
                    : bestFor === "Quick Runs"
                      ? "text-accent-blue bg-accent-blue/10"
                      : bestFor === "Budget"
                        ? "text-accent-amber bg-accent-amber/10"
                        : bestFor === "Balanced"
                          ? "text-accent-purple bg-accent-purple/10"
                          : "text-text-muted bg-dark-700";

                return (
                  <tr
                    key={method.id}
                    className="border-b border-dark-700/50 hover:bg-dark-800/50 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="font-medium">{method.name}</div>
                      <div className="font-mono text-xs text-text-muted">{method.code}</div>
                    </td>
                    <td className="py-3 px-3">
                      <RatingDots value={method.ratingYield} color="bg-accent-green" />
                      <div className="text-xs text-center mt-1 text-text-muted font-mono">
                        {RATING_LABELS[method.ratingYield]}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <RatingDots
                        value={method.ratingCost}
                        color={method.ratingCost <= 1 ? "bg-accent-green" : method.ratingCost === 2 ? "bg-accent-amber" : "bg-accent-red"}
                      />
                      <div className="text-xs text-center mt-1 text-text-muted font-mono">
                        {RATING_LABELS[method.ratingCost]}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <RatingDots value={method.ratingSpeed} color="bg-accent-blue" />
                      <div className="text-xs text-center mt-1 text-text-muted font-mono">
                        {RATING_LABELS[method.ratingSpeed]}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${bestForColor}`}
                      >
                        {bestFor}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-accent-green/20 bg-accent-green/5">
            <div className="flex items-center gap-2 mb-2">
              <Gem size={16} className="text-accent-green" />
              <span className="font-semibold text-sm text-accent-green">Best Yield</span>
            </div>
            <div className="text-sm text-text-secondary">
              {data.methods
                .filter((m) => m.ratingYield === 3)
                .map((m) => m.name)
                .join(", ")}
            </div>
          </div>
          <div className="p-4 rounded-lg border border-accent-amber/20 bg-accent-amber/5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-accent-amber" />
              <span className="font-semibold text-sm text-accent-amber">Cheapest</span>
            </div>
            <div className="text-sm text-text-secondary">
              {data.methods
                .filter((m) => m.ratingCost === 1)
                .map((m) => m.name)
                .join(", ")}
            </div>
          </div>
          <div className="p-4 rounded-lg border border-accent-blue/20 bg-accent-blue/5">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-accent-blue" />
              <span className="font-semibold text-sm text-accent-blue">Fastest</span>
            </div>
            <div className="text-sm text-text-secondary">
              {data.methods
                .filter((m) => m.ratingSpeed === 3)
                .map((m) => m.name)
                .join(", ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
