import { useState, useEffect } from "react";
import { BarChart3, Download, Upload, Calendar } from "lucide-react";
import { computeStats, type StatsDateFilter } from "../lib/stats";
import { exportToJson, importFromJson } from "../lib/export";
import { ORE_TYPES, MINING_SHIPS, MINING_VEHICLES, MINING_HAND_CRAFTS } from "../data/master";
import type { Stats } from "../lib/stats";
import type { WorkOrder } from "../types/master";

const ACTIVITY_LABELS: Record<WorkOrder["activity"], string> = {
  ship: "Ship",
  ROC: "Vehicle",
  FPS: "Hand",
  salvage: "Salvage",
};

export default function Statistics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const dateFilter: StatsDateFilter | undefined =
    dateFrom && dateTo
      ? {
          from: new Date(dateFrom).setHours(0, 0, 0, 0),
          to: new Date(dateTo).setHours(23, 59, 59, 999),
        }
      : undefined;

  useEffect(() => {
    setStats(computeStats(dateFilter));
  }, [dateFrom, dateTo]);

  function handleExportJson() {
    exportToJson();
  }

  async function handleImportJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setImportError(null);
    setImportSuccess(false);
    if (!file) return;
    const result = await importFromJson(file);
    if (result.ok) {
      setImportSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      setImportError(result.error ?? "Import failed");
    }
  }

  if (!stats) return null;

  const oreById = Object.fromEntries(ORE_TYPES.map((o) => [o.id, o]));

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 size={18} className="text-accent-amber" />
            Statistics
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-dark-700 border border-dark-600 hover:bg-dark-600 text-sm font-medium"
            >
              <Download size={14} />
              Export JSON
            </button>
            <label className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-dark-700 border border-dark-600 hover:bg-dark-600 text-sm font-medium cursor-pointer">
              <Upload size={14} />
              Import JSON
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportJson}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {importError && (
          <div className="mb-4 p-3 rounded-lg bg-accent-red/15 border border-accent-red/30 text-accent-red text-sm">
            {importError}
          </div>
        )}
        {importSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-accent-green/15 border border-accent-green/30 text-accent-green text-sm">
            Import successful. Data restored.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mb-6 p-3 rounded-lg bg-dark-800/50 border border-dark-700">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-text-dim" />
            <span className="text-sm text-text-dim">Date range:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-1.5 rounded bg-dark-800 border border-dark-600 text-sm"
            />
            <span className="text-text-dim">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-1.5 rounded bg-dark-800 border border-dark-600 text-sm"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="text-xs text-text-dim hover:text-text"
            >
              Clear filter
            </button>
          )}
          {stats && (stats.firstSessionAt || stats.lastSessionAt) && !dateFrom && !dateTo && (
            <span className="text-xs text-text-dim">
              All data: {stats.firstSessionAt && new Date(stats.firstSessionAt).toLocaleDateString()}
              {stats.firstSessionAt && stats.lastSessionAt && " → "}
              {stats.lastSessionAt && new Date(stats.lastSessionAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-dark-800 border border-dark-700">
            <div className="text-xs text-text-dim uppercase tracking-wide">Sessions</div>
            <div className="text-xl font-bold font-mono mt-1">{stats.totalSessions}</div>
          </div>
          <div className="p-4 rounded-lg bg-dark-800 border border-dark-700">
            <div className="text-xs text-text-dim uppercase tracking-wide">Work Orders</div>
            <div className="text-xl font-bold font-mono mt-1">{stats.totalWorkOrders}</div>
          </div>
          <div className="p-4 rounded-lg bg-dark-800 border border-dark-700">
            <div className="text-xs text-text-dim uppercase tracking-wide">Total Gross</div>
            <div className="text-xl font-bold font-mono text-accent-amber mt-1">
              {stats.totalGrossAuec.toLocaleString()} aUEC
            </div>
          </div>
          <div className="p-4 rounded-lg bg-dark-800 border border-dark-700">
            <div className="text-xs text-text-dim uppercase tracking-wide">Total Net</div>
            <div className="text-xl font-bold font-mono text-accent-green mt-1">
              {stats.totalNetAuec.toLocaleString()} aUEC
            </div>
          </div>
          <div className="p-4 rounded-lg bg-dark-800 border border-dark-700">
            <div className="text-xs text-text-dim uppercase tracking-wide">Refinery Fees</div>
            <div className="text-xl font-bold font-mono mt-1">
              {stats.totalRefineryFees.toLocaleString()} aUEC
            </div>
          </div>
          <div className="p-4 rounded-lg bg-dark-800 border border-dark-700">
            <div className="text-xs text-text-dim uppercase tracking-wide">Total SCU</div>
            <div className="text-xl font-bold font-mono mt-1">{stats.totalYieldScu.toFixed(1)}</div>
          </div>
          <div className="p-4 rounded-lg bg-dark-800 border border-dark-700">
            <div className="text-xs text-text-dim uppercase tracking-wide">Sold</div>
            <div className="text-xl font-bold font-mono mt-1">
              {stats.soldCount} / {stats.totalWorkOrders}
            </div>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-text-dim uppercase tracking-wide mb-3">By Activity</h3>
        <div className="overflow-x-auto -mx-1.5 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-2 px-3 text-text-dim font-medium">Activity</th>
                <th className="text-right py-2 px-3 text-text-dim font-medium">Orders</th>
                <th className="text-right py-2 px-3 text-text-dim font-medium">Gross</th>
                <th className="text-right py-2 px-3 text-text-dim font-medium">Net</th>
              </tr>
            </thead>
            <tbody>
              {(Object.entries(stats.byActivity) as [WorkOrder["activity"], Stats["byActivity"][WorkOrder["activity"]]][]).map(
                ([activity, data]) => (
                  <tr key={activity} className="border-b border-dark-700/50">
                    <td className="py-2 px-3">{ACTIVITY_LABELS[activity]}</td>
                    <td className="py-2 px-3 text-right font-mono">{data.count}</td>
                    <td className="py-2 px-3 text-right font-mono">{data.gross.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono text-accent-green">{data.net.toLocaleString()}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold text-text-dim uppercase tracking-wide mb-3">By Craft</h3>
        <div className="overflow-x-auto -mx-1.5 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-2 px-3 text-text-dim font-medium">Craft</th>
                <th className="text-right py-2 px-3 text-text-dim font-medium">Orders</th>
                <th className="text-right py-2 px-3 text-text-dim font-medium">Gross</th>
                <th className="text-right py-2 px-3 text-text-dim font-medium">Net</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.byCraft)
                .map(([craftId, data]) => {
                  const ship = MINING_SHIPS.find((s) => s.id === craftId);
                  const vehicle = MINING_VEHICLES.find((v) => v.id === craftId);
                  const handCraft = MINING_HAND_CRAFTS.find((c) => c.id === craftId);
                  const label = ship?.name ?? vehicle?.name ?? handCraft?.name ?? ACTIVITY_LABELS[craftId as WorkOrder["activity"]] ?? craftId;
                  return { craftId, label, data };
                })
                .sort((a, b) => b.data.net - a.data.net)
                .map(({ craftId, label, data }) => (
                  <tr key={craftId} className="border-b border-dark-700/50">
                    <td className="py-2 px-3">{label}</td>
                    <td className="py-2 px-3 text-right font-mono">{data.count}</td>
                    <td className="py-2 px-3 text-right font-mono">{data.gross.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono text-accent-green">{data.net.toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold text-text-dim uppercase tracking-wide mb-3">By Ore</h3>
        <div className="overflow-x-auto -mx-1.5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-2 px-3 text-text-dim font-medium">Ore</th>
                <th className="text-right py-2 px-3 text-text-dim font-medium">Orders</th>
                <th className="text-right py-2 px-3 text-text-dim font-medium">SCU</th>
                <th className="text-right py-2 px-3 text-text-dim font-medium">Gross</th>
                <th className="text-right py-2 px-3 text-text-dim font-medium">Net</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.byOre)
                .sort(([, a], [, b]) => b.net - a.net)
                .map(([oreId, data]) => (
                  <tr key={oreId} className="border-b border-dark-700/50">
                    <td className="py-2 px-3">{oreById[oreId]?.name ?? oreId}</td>
                    <td className="py-2 px-3 text-right font-mono">{data.count}</td>
                    <td className="py-2 px-3 text-right font-mono">{data.yieldScu.toFixed(1)}</td>
                    <td className="py-2 px-3 text-right font-mono">{data.gross.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono text-accent-green">{data.net.toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {Object.keys(stats.byOre).length === 0 && (
          <p className="py-6 text-center text-text-dim text-sm">No work orders yet. Add some to see stats.</p>
        )}
      </div>
    </div>
  );
}
