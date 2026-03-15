import { useState, useEffect } from "react";
import { Zap, Clock, CheckCircle, ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { getWorkOrders, saveWorkOrders, getSessions, saveSessions } from "../lib/storage";
import { ORE_TYPES, MINING_SHIPS, MINING_VEHICLES, MINING_HAND_CRAFTS, REFINERY_STATIONS } from "../data/master";
import type { WorkOrder } from "../types/master";

type OrderStatus = "active" | "ready" | "completed";
type StatusFilter = "all" | "live" | "pending" | "completed";
type SortCol = "status" | "type" | "ore" | "location" | "yield" | "quality" | "gross" | "net" | "timer";

const ACTIVITY_LABELS: Record<WorkOrder["activity"], string> = {
  ship: "Ship",
  ROC: "Vehicle",
  FPS: "Hand",
  salvage: "Salvage",
};

function getOrderStatus(order: WorkOrder, now: number): OrderStatus {
  if (order.completed) return "completed";
  return order.timerEndsAt > now ? "active" : "ready";
}

function getTypeLabel(order: WorkOrder): string {
  if (order.activity === "ship" && order.craftId) {
    const ship = MINING_SHIPS.find((s) => s.id === order.craftId);
    return ship?.name ?? ACTIVITY_LABELS.ship;
  }
  if (order.activity === "ROC" && order.craftId) {
    const v = MINING_VEHICLES.find((v) => v.id === order.craftId);
    return v?.name ?? ACTIVITY_LABELS.ROC;
  }
  if (order.activity === "FPS" && order.craftId) {
    const c = MINING_HAND_CRAFTS.find((c) => c.id === order.craftId);
    return c?.name ?? ACTIVITY_LABELS.FPS;
  }
  return ACTIVITY_LABELS[order.activity];
}

function formatTimer(ms: number): string {
  if (ms <= 0) return "Done";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function LiveTimer({ endsAt }: { endsAt: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-xs tabular-nums">{formatTimer(endsAt - now)}</span>;
}

export default function WorkOrderLog({
  sessionId,
  refreshKey = 0,
  onOrderClick,
  onDeleted,
}: {
  sessionId: string;
  refreshKey?: number;
  onOrderClick?: (order: WorkOrder) => void;
  onDeleted?: () => void;
}) {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sortCol, setSortCol] = useState<SortCol>("status");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [now, setNow] = useState(Date.now());

  function handleSort(col: SortCol) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  useEffect(() => {
    setOrders(getWorkOrders().filter((o) => o.sessionId === sessionId));
  }, [sessionId, refreshKey]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  function completeOrder(order: WorkOrder) {
    const updated = { ...order, completed: true };
    const all = getWorkOrders().map((o) => (o.id === order.id ? updated : o));
    saveWorkOrders(all);
    setOrders(all.filter((o) => o.sessionId === sessionId));
  }

  function deleteOrder(order: WorkOrder) {
    if (!confirm("Delete this work order?")) return;
    const all = getWorkOrders().filter((o) => o.id !== order.id);
    saveWorkOrders(all);
    const sessions = getSessions().map((s) =>
      s.id === sessionId ? { ...s, workOrders: s.workOrders.filter((id) => id !== order.id), updatedAt: Date.now() } : s
    );
    saveSessions(sessions);
    setOrders(all.filter((o) => o.sessionId === sessionId));
    onDeleted?.();
  }

  const oreById = Object.fromEntries(ORE_TYPES.map((o) => [o.id, o]));
  const refineryById = Object.fromEntries(REFINERY_STATIONS.map((r) => [r.id, r]));

  const filtered = orders.filter((o) => {
    const status = getOrderStatus(o, now);
    if (statusFilter === "live" && status !== "active") return false;
    if (statusFilter === "pending" && status !== "ready") return false;
    if (statusFilter === "completed" && status !== "completed") return false;
    if (locationFilter !== "all" && o.refineryId !== locationFilter) return false;
    return true;
  });

  const statusOrder = { active: 0, ready: 1, completed: 2 };
  const display = [...filtered].sort((a, b) => {
    const statusA = getOrderStatus(a, now);
    const statusB = getOrderStatus(b, now);
    const mult = sortDir === "asc" ? 1 : -1;
    switch (sortCol) {
      case "status":
        return mult * (statusOrder[statusA] - statusOrder[statusB]);
      case "type":
        return mult * (getTypeLabel(a).localeCompare(getTypeLabel(b)));
      case "ore":
        return mult * ((oreById[a.oreId]?.name ?? a.oreId).localeCompare(oreById[b.oreId]?.name ?? b.oreId));
      case "location":
        return mult * ((refineryById[a.refineryId]?.shortName ?? a.refineryId).localeCompare(refineryById[b.refineryId]?.shortName ?? b.refineryId));
      case "yield":
        return mult * (a.yieldScu - b.yieldScu);
      case "quality":
        return mult * (a.quality - b.quality);
      case "gross":
        return mult * (a.grossAuec - b.grossAuec);
      case "net":
        return mult * (a.netAuec - b.netAuec);
      case "timer":
        return mult * (a.timerEndsAt - b.timerEndsAt);
      default:
        return 0;
    }
  });
  const totals = display.reduce(
    (acc, o) => ({
      gross: acc.gross + o.grossAuec,
      net: acc.net + o.netAuec,
    }),
    { gross: 0, net: 0 }
  );

  const liveCount = orders.filter((o) => getOrderStatus(o, now) === "active").length;
  const pendingCount = orders.filter((o) => getOrderStatus(o, now) === "ready").length;
  const completedCount = orders.filter((o) => o.completed).length;

  return (
    <div className="card">
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold">Work Order Log</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 border border-dark-700 rounded-lg p-0.5">
            <button
              onClick={() => setStatusFilter("all")}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded text-xs font-medium transition-colors ${
                statusFilter === "all" ? "bg-accent-amber/20 text-accent-amber" : "text-text-dim hover:text-text"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("live")}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded text-xs font-medium transition-colors ${
                statusFilter === "live" ? "bg-accent-amber/20 text-accent-amber" : "text-text-dim hover:text-text"
              }`}
            >
              <Zap size={12} />
              Live ({liveCount})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded text-xs font-medium transition-colors ${
                statusFilter === "pending" ? "bg-accent-amber/20 text-accent-amber" : "text-text-dim hover:text-text"
              }`}
            >
              <Clock size={12} />
              Ready to Collect ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded text-xs font-medium transition-colors ${
                statusFilter === "completed" ? "bg-accent-amber/20 text-accent-amber" : "text-text-dim hover:text-text"
              }`}
            >
              <CheckCircle size={12} />
              Completed ({completedCount})
            </button>
          </div>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-dark-700 bg-dark-800 text-sm"
          >
            <option value="all">All locations</option>
            {REFINERY_STATIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.shortName} ({r.system})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1.5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-700">
              {[
                { col: "status" as SortCol, label: "Status", align: "left" },
                { col: "type" as SortCol, label: "Type", align: "left" },
                { col: "ore" as SortCol, label: "Ore", align: "left" },
                { col: "location" as SortCol, label: "Location", align: "left" },
                { col: "yield" as SortCol, label: "Yield", align: "right" },
                { col: "quality" as SortCol, label: "Quality", align: "right" },
                { col: "gross" as SortCol, label: "Gross", align: "right" },
                { col: "net" as SortCol, label: "Net", align: "right" },
                { col: "timer" as SortCol, label: "Timer", align: "left" },
              ].map(({ col, label, align }) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className={`py-3 px-3 text-text-dim font-medium cursor-pointer select-none hover:text-text transition-colors ${
                    align === "right" ? "text-right" : "text-left"
                  } ${sortCol === col ? "text-accent-amber" : ""}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {sortCol === col && (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </span>
                </th>
              ))}
              <th className="text-center py-3 px-3 text-text-dim font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {display.map((o) => {
              const ore = oreById[o.oreId];
              const status = getOrderStatus(o, now);
              return (
                <tr
                  key={o.id}
                  onClick={() => onOrderClick?.(o)}
                  className={`border-b border-dark-700/50 transition-colors ${onOrderClick ? "cursor-pointer hover:bg-dark-800/50" : ""}`}
                >
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        status === "active"
                          ? "bg-accent-green/20 text-accent-green"
                          : status === "ready"
                            ? "bg-accent-amber/20 text-accent-amber"
                            : "bg-dark-700 text-text-muted"
                      }`}
                    >
                      {status === "active" ? "Active" : status === "ready" ? "Ready to Collect" : "Completed"}
                    </span>
                  </td>
                  <td className="py-3 px-3">{getTypeLabel(o)}</td>
                  <td className="py-3 px-3">{ore?.name ?? o.oreId}</td>
                  <td className="py-3 px-3 text-text-dim">{refineryById[o.refineryId]?.shortName ?? o.refineryId}</td>
                  <td className="py-3 px-3 text-right font-mono">{o.yieldScu}</td>
                  <td className="py-3 px-3 text-right font-mono">{o.quality}</td>
                  <td className="py-3 px-3 text-right font-mono">{o.grossAuec.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-mono text-accent-green">{o.netAuec.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <LiveTimer endsAt={o.timerEndsAt} />
                  </td>
                  <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      {status === "ready" && (
                        <button
                          onClick={() => completeOrder(o)}
                          className="px-2 py-1 rounded text-xs font-medium bg-accent-green/20 text-accent-green hover:bg-accent-green/30 min-h-[32px]"
                        >
                          Complete
                        </button>
                      )}
                      {status === "completed" && (
                        <>
                          <button
                            onClick={() => onOrderClick?.(o)}
                            className="p-1.5 rounded hover:bg-dark-600 text-text-dim hover:text-text transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteOrder(o)}
                            className="p-1.5 rounded hover:bg-accent-red/20 text-text-dim hover:text-accent-red transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-dark-600 font-medium">
              <td colSpan={6} className="py-3 px-3">Total</td>
              <td className="py-3 px-3 text-right font-mono">{totals.gross.toLocaleString()}</td>
              <td className="py-3 px-3 text-right font-mono text-accent-green">{totals.net.toLocaleString()}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      {display.length === 0 && (
        <p className="py-8 text-center text-text-dim text-sm">
          No work orders yet. Add one to get started.
        </p>
      )}
    </div>
  );
}
