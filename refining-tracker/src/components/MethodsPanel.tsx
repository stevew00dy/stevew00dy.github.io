import { useState, useEffect } from "react";
import { X, Loader2, TrendingUp, DollarSign, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { getRefiningData, type RefiningData } from "../uex-api";
import { FALLBACK_METHODS } from "../data/refineries";
import { RATING_LABELS } from "../data/refineries";

function RatingCell({ value, type }: { value: number; type: "yield" | "cost" | "speed" }) {
  const color =
    type === "yield"
      ? value === 3
        ? "text-accent-green"
        : value === 2
          ? "text-accent-amber"
          : "text-accent-red"
      : type === "cost"
        ? value === 1
          ? "text-accent-green"
          : value === 2
            ? "text-accent-amber"
            : "text-accent-red"
        : value === 3
          ? "text-accent-green"
          : value === 2
            ? "text-accent-amber"
            : "text-accent-red";
  return <span className={`text-sm font-medium ${color}`}>{RATING_LABELS[value] ?? "—"}</span>;
}

type SortCol = "yield" | "cost" | "speed";

export default function MethodsPanel({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<RefiningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortCol | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    getRefiningData()
      .then(setData)
      .catch(() =>
        setData({
          ores: [],
          methods: FALLBACK_METHODS,
          yields: [],
          fromCache: false,
          fetchedAt: Date.now(),
        })
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card w-full min-w-0 md:min-w-[520px] shrink-0 flex flex-col items-center justify-center py-16">
        <Loader2 size={24} className="text-accent-amber animate-spin mb-3" />
        <p className="text-text-dim text-sm">Loading...</p>
      </div>
    );
  }

  if (!data || !Array.isArray(data.methods)) return null;

  const methods = data.methods;
  const sorted = sortBy
    ? [...methods].sort((a, b) => {
        const av = sortBy === "yield" ? a.ratingYield : sortBy === "cost" ? a.ratingCost : a.ratingSpeed;
        const bv = sortBy === "yield" ? b.ratingYield : sortBy === "cost" ? b.ratingCost : b.ratingSpeed;
        return sortDir === "asc" ? av - bv : bv - av;
      })
    : methods;

  function handleSort(col: SortCol) {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  }

  return (
    <div className="card w-full min-w-0 md:min-w-[520px] shrink-0 max-h-[85vh] overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between mb-5 sticky top-0 bg-dark-900 pt-0.5 pb-3 -mt-0.5 -mx-4 px-4 border-b border-dark-700 z-10">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <TrendingUp size={16} className="text-accent-purple" />
          All Methods
        </h3>
        <button onClick={onClose} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-dark-700 transition-colors" title="Close" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left py-3 px-4 text-text-dim font-medium">Method</th>
              <th className="text-center py-3 px-4 text-text-dim font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("yield")}
                  className="flex items-center justify-center gap-1 w-full hover:text-text transition-colors"
                >
                  <TrendingUp size={12} /> Yield
                  {sortBy === "yield" && (sortDir === "asc" ? <ChevronUp size={12} className="text-accent-amber" /> : <ChevronDown size={12} className="text-accent-amber" />)}
                </button>
              </th>
              <th className="text-center py-3 px-4 text-text-dim font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("cost")}
                  className="flex items-center justify-center gap-1 w-full hover:text-text transition-colors"
                >
                  <DollarSign size={12} /> Cost
                  {sortBy === "cost" && (sortDir === "asc" ? <ChevronUp size={12} className="text-accent-amber" /> : <ChevronDown size={12} className="text-accent-amber" />)}
                </button>
              </th>
              <th className="text-center py-3 px-4 text-text-dim font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("speed")}
                  className="flex items-center justify-center gap-1 w-full hover:text-text transition-colors"
                >
                  <Clock size={12} /> Speed
                  {sortBy === "speed" && (sortDir === "asc" ? <ChevronUp size={12} className="text-accent-amber" /> : <ChevronDown size={12} className="text-accent-amber" />)}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((method) => (
              <tr
                key={String(method.id)}
                className="border-b border-dark-700/50 hover:bg-dark-800/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="font-medium">{method.name}</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <RatingCell value={method.ratingYield} type="yield" />
                </td>
                <td className="py-3 px-4 text-center">
                  <RatingCell value={method.ratingCost} type="cost" />
                </td>
                <td className="py-3 px-4 text-center">
                  <RatingCell value={method.ratingSpeed} type="speed" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
