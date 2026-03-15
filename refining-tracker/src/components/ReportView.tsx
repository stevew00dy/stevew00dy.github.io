/**
 * Print/PDF report — opens in new window for clean print output.
 */
import { getSessions, getWorkOrders } from "../lib/storage";
import { computeStats } from "../lib/stats";
import { ORE_TYPES, REFINERY_STATIONS, MINING_SHIPS, MINING_VEHICLES, MINING_HAND_CRAFTS } from "../data/master";
import type { WorkOrder } from "../types/master";

const ACTIVITY_LABELS: Record<WorkOrder["activity"], string> = {
  ship: "Ship",
  ROC: "Vehicle",
  FPS: "Hand",
  salvage: "Salvage",
};

function getActivityLabel(o: WorkOrder): string {
  if (o.activity === "ship" && o.craftId) {
    const s = MINING_SHIPS.find((x) => x.id === o.craftId);
    return s?.name ?? ACTIVITY_LABELS.ship;
  }
  if (o.activity === "ROC" && o.craftId) {
    const v = MINING_VEHICLES.find((x) => x.id === o.craftId);
    return v?.name ?? ACTIVITY_LABELS.ROC;
  }
  if (o.activity === "FPS" && o.craftId) {
    const c = MINING_HAND_CRAFTS.find((x) => x.id === o.craftId);
    return c?.name ?? ACTIVITY_LABELS.FPS;
  }
  return ACTIVITY_LABELS[o.activity];
}

function buildReportHtml(): string {
  const sessions = getSessions();
  const orders = getWorkOrders();
  const stats = computeStats();

  const oreById = Object.fromEntries(ORE_TYPES.map((o) => [o.id, o]));
  const refineryById = Object.fromEntries(REFINERY_STATIONS.map((r) => [r.id, r]));

  const ordersBySession = orders.reduce<Record<string, WorkOrder[]>>((acc, o) => {
    if (!acc[o.sessionId]) acc[o.sessionId] = [];
    acc[o.sessionId].push(o);
    return acc;
  }, {});

  const sessionRows = sessions
    .map((s) => {
      const sessOrders = ordersBySession[s.id] ?? [];
      const gross = sessOrders.reduce((a, o) => a + o.grossAuec, 0);
      const net = sessOrders.reduce((a, o) => a + o.netAuec, 0);
      return `
        <tr>
          <td>${s.name}</td>
          <td>${new Date(s.createdAt).toLocaleDateString()}</td>
          <td>${sessOrders.length}</td>
          <td>${gross.toLocaleString()}</td>
          <td>${net.toLocaleString()}</td>
        </tr>
      `;
    })
    .join("");

  const orderRows = orders
    .map((o) => {
      const ore = oreById[o.oreId];
      const refinery = refineryById[o.refineryId];
      return `
        <tr>
          <td>${ore?.name ?? o.oreId}</td>
          <td>${getActivityLabel(o)}</td>
          <td>${refinery?.shortName ?? o.refineryId}</td>
          <td>${o.yieldScu}</td>
          <td>${o.quality}</td>
          <td>${o.grossAuec.toLocaleString()}</td>
          <td>${o.netAuec.toLocaleString()}</td>
          <td>${o.sold ? "Yes" : "No"}</td>
        </tr>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Refining Tracker Report</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; font-size: 12px; color: #1a1a1a; padding: 24px; max-width: 900px; margin: 0 auto; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @media print { body { padding: 16px; } }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .meta { color: #666; font-size: 11px; margin-bottom: 20px; }
    h2 { font-size: 14px; margin: 20px 0 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #eee; }
    th { background: #f5f5f5; font-weight: 600; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
    .summary-box { padding: 12px; background: #f8f8f8; border-radius: 6px; }
    .summary-box .label { font-size: 10px; color: #666; text-transform: uppercase; }
    .summary-box .value { font-size: 16px; font-weight: 700; }
  </style>
</head>
<body>
  <h1>Refining Tracker Report</h1>
  <p class="meta">Generated ${new Date().toLocaleString()} · Star Citizen</p>

  <h2>Summary</h2>
  <div class="summary">
    <div class="summary-box">
      <div class="label">Sessions</div>
      <div class="value">${stats.totalSessions}</div>
    </div>
    <div class="summary-box">
      <div class="label">Work Orders</div>
      <div class="value">${stats.totalWorkOrders}</div>
    </div>
    <div class="summary-box">
      <div class="label">Total Gross</div>
      <div class="value">${stats.totalGrossAuec.toLocaleString()} aUEC</div>
    </div>
    <div class="summary-box">
      <div class="label">Total Net</div>
      <div class="value">${stats.totalNetAuec.toLocaleString()} aUEC</div>
    </div>
  </div>

  <h2>Sessions</h2>
  <table>
    <thead>
      <tr><th>Session</th><th>Date</th><th>Orders</th><th class="num">Gross</th><th class="num">Net</th></tr>
    </thead>
    <tbody>${sessionRows || "<tr><td colspan='5'>No sessions</td></tr>"}</tbody>
  </table>

  <h2>Work Orders</h2>
  <table>
    <thead>
      <tr><th>Ore</th><th>Activity</th><th>Refinery</th><th class="num">Yield</th><th class="num">Quality</th><th class="num">Gross</th><th class="num">Net</th><th>Sold</th></tr>
    </thead>
    <tbody>${orderRows || "<tr><td colspan='8'>No work orders</td></tr>"}</tbody>
  </table>

  <p class="meta" style="margin-top: 24px;">Unofficial fan-made tool. Not affiliated with Cloud Imperium Games.</p>
</body>
</html>
  `.trim();
}

export function openReportForPrint(): void {
  const html = buildReportHtml();
  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (!win) {
    alert("Please allow pop-ups to view the report.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
}
