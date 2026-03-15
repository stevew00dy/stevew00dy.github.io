/**
 * Compute accumulated statistics from sessions and work orders.
 */
import type { WorkOrder } from "../types/master";
import { getSessions, getWorkOrders } from "./storage";

export interface Stats {
  totalSessions: number;
  totalWorkOrders: number;
  totalGrossAuec: number;
  totalNetAuec: number;
  totalRefineryFees: number;
  totalYieldScu: number;
  soldCount: number;
  byActivity: Record<WorkOrder["activity"], { count: number; gross: number; net: number }>;
  byCraft: Record<string, { count: number; gross: number; net: number }>;
  byOre: Record<string, { count: number; yieldScu: number; gross: number; net: number }>;
  firstSessionAt: number | null;
  lastSessionAt: number | null;
}

export interface StatsDateFilter {
  from: number;
  to: number;
}

export function computeStats(dateFilter?: StatsDateFilter): Stats {
  let sessions = getSessions();
  let orders = getWorkOrders();

  if (dateFilter) {
    sessions = sessions.filter((s) => s.createdAt >= dateFilter.from && s.createdAt <= dateFilter.to);
    const sessionIds = new Set(sessions.map((s) => s.id));
    orders = orders.filter((o) => sessionIds.has(o.sessionId));
  }

  const byActivity: Stats["byActivity"] = {
    ship: { count: 0, gross: 0, net: 0 },
    ROC: { count: 0, gross: 0, net: 0 },
    FPS: { count: 0, gross: 0, net: 0 },
    salvage: { count: 0, gross: 0, net: 0 },
  };

  const byCraft: Record<string, { count: number; gross: number; net: number }> = {};
  const byOre: Record<string, { count: number; yieldScu: number; gross: number; net: number }> = {};

  let totalGross = 0;
  let totalNet = 0;
  let totalFees = 0;
  let totalYield = 0;
  let soldCount = 0;

  for (const o of orders) {
    totalGross += o.grossAuec;
    totalNet += o.netAuec;
    totalFees += o.refineryFee;
    totalYield += o.yieldScu;
    if (o.sold) soldCount++;

    byActivity[o.activity].count++;
    byActivity[o.activity].gross += o.grossAuec;
    byActivity[o.activity].net += o.netAuec;

    const craftKey = (o.activity === "ship" || o.activity === "ROC" || o.activity === "FPS") && o.craftId ? o.craftId : o.activity;
    if (!byCraft[craftKey]) byCraft[craftKey] = { count: 0, gross: 0, net: 0 };
    byCraft[craftKey].count++;
    byCraft[craftKey].gross += o.grossAuec;
    byCraft[craftKey].net += o.netAuec;

    if (!byOre[o.oreId]) byOre[o.oreId] = { count: 0, yieldScu: 0, gross: 0, net: 0 };
    byOre[o.oreId].count++;
    byOre[o.oreId].yieldScu += o.yieldScu;
    byOre[o.oreId].gross += o.grossAuec;
    byOre[o.oreId].net += o.netAuec;
  }

  const sessionTimes = sessions.map((s) => s.createdAt).filter(Boolean);
  const firstSessionAt = sessionTimes.length > 0 ? Math.min(...sessionTimes) : null;
  const lastSessionAt = sessionTimes.length > 0 ? Math.max(...sessionTimes) : null;

  return {
    totalSessions: sessions.length,
    totalWorkOrders: orders.length,
    totalGrossAuec: totalGross,
    totalNetAuec: totalNet,
    totalRefineryFees: totalFees,
    totalYieldScu: totalYield,
    soldCount,
    byActivity,
    byCraft,
    byOre,
    firstSessionAt,
    lastSessionAt,
  };
}
