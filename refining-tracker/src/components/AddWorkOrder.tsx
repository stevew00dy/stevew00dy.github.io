import { useState, useCallback } from "react";
import { X, ExternalLink } from "lucide-react";
import { getSessions, saveSessions, getWorkOrders, saveWorkOrders, generateId } from "../lib/storage";
import { ORE_TYPES, REFINERY_STATIONS, REFINERY_METHODS, MINING_SHIPS_FLYABLE, MINING_SHIPS_COMING_SOON, MINING_VEHICLES, MINING_HAND_CRAFTS } from "../data/master";
import type { WorkOrder } from "../types/master";
import MethodsPanel from "./MethodsPanel";
import { computeRefiningDurationMs } from "../lib/timer";

export default function AddWorkOrder({
  sessionId,
  order: editOrder,
  onClose,
  onAdded,
}: {
  sessionId: string;
  order?: WorkOrder | null;
  onClose: () => void;
  onAdded: () => void;
}) {
  const isEdit = Boolean(editOrder);
  const [activity, setActivity] = useState<WorkOrder["activity"]>(editOrder?.activity ?? "ship");
  const [craftId, setCraftId] = useState<string>(() => {
    if (editOrder?.craftId) return editOrder.craftId;
    if (editOrder?.activity === "FPS") return MINING_HAND_CRAFTS[0]?.id ?? "hand";
    if (editOrder?.activity === "ROC") return MINING_VEHICLES[0]?.id ?? "roc";
    return MINING_SHIPS_FLYABLE[0]?.id ?? "";
  });
  const [showMethods, setShowMethods] = useState(false);
  const [methodsClosing, setMethodsClosing] = useState(false);

  const handleMethodsClose = useCallback(() => {
    if (methodsClosing) return;
    setMethodsClosing(true);
  }, [methodsClosing]);

  const handleMethodsCloseComplete = useCallback(() => {
    setShowMethods(false);
    setMethodsClosing(false);
  }, []);

  const [refineryId, setRefineryId] = useState(editOrder?.refineryId ?? REFINERY_STATIONS[0]?.id ?? "");
  const [methodId, setMethodId] = useState<string>(editOrder?.methodId ?? REFINERY_METHODS[0]?.id ?? "");
  const defaultOre = ORE_TYPES.find((o) => o.acquisitionMethod === "ship")?.id ?? ORE_TYPES[0]?.id ?? "";
  const [oreId, setOreId] = useState(editOrder?.oreId ?? defaultOre);
  const [quantity, setQuantity] = useState(editOrder?.quantity ?? 1);
  const [yieldScu, setYieldScu] = useState(editOrder?.yieldScu ?? 1);
  const [quality, setQuality] = useState(editOrder?.quality ?? 500);
  const [pricePerUnit, setPricePerUnit] = useState(
    editOrder ? Math.round((editOrder.grossAuec / (editOrder.yieldScu || 1)) * 100) / 100 : 0
  );
  const [refineryFee, setRefineryFee] = useState(editOrder?.refineryFee ?? 0);
  const [customTimerMinutes, setCustomTimerMinutes] = useState<string>(() => {
    if (editOrder && !editOrder.completed && editOrder.timerEndsAt > Date.now()) {
      const remaining = Math.ceil((editOrder.timerEndsAt - Date.now()) / 60000);
      return remaining > 0 ? String(remaining) : "";
    }
    return "";
  });

  const ore = ORE_TYPES.find((o) => o.id === oreId);
  const method = REFINERY_METHODS.find((m) => m.id === methodId);
  const grossAuec = pricePerUnit * yieldScu;
  const netAuec = grossAuec - refineryFee;
  const estimatedDurationMs = computeRefiningDurationMs(
    methodId,
    quantity,
    yieldScu,
    method?.ratingSpeed ?? 2
  );
  const estimatedMinutes = Math.round(estimatedDurationMs / 60000);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const customMin = customTimerMinutes.trim() ? parseInt(customTimerMinutes, 10) : null;
    const durationMs =
      customMin != null && !isNaN(customMin) && customMin > 0
        ? customMin * 60 * 1000
        : computeRefiningDurationMs(methodId, quantity, yieldScu, method?.ratingSpeed ?? 2);
    if (isEdit && editOrder) {
      const updated: WorkOrder = {
        ...editOrder,
        activity,
        craftId: activity === "ship" || activity === "ROC" || activity === "FPS" ? craftId : undefined,
        refineryId,
        methodId,
        oreId,
        quantity,
        yieldScu,
        quality,
        grossAuec,
        netAuec,
        refineryFee,
        timerEndsAt: editOrder.completed ? editOrder.timerEndsAt : Date.now() + durationMs,
      };
      const orders = getWorkOrders().map((o) => (o.id === editOrder.id ? updated : o));
      saveWorkOrders(orders);
    } else {
      const id = generateId();
      const order: WorkOrder = {
        id,
        sessionId,
        activity,
        craftId: activity === "ship" || activity === "ROC" || activity === "FPS" ? craftId : undefined,
        refineryId,
        methodId,
        oreId,
        quantity,
        yieldScu,
        quality,
        grossAuec,
        netAuec,
        refineryFee,
        timerEndsAt: Date.now() + durationMs,
        sold: false,
        completed: false,
        createdAt: Date.now(),
      };
      const orders = [...getWorkOrders(), order];
      saveWorkOrders(orders);

      const sessions = getSessions().map((s) =>
        s.id === sessionId ? { ...s, workOrders: [...s.workOrders, id], updatedAt: Date.now() } : s
      );
      saveSessions(sessions);
    }
    onAdded();
  }

  const activityToAcquisition: Record<WorkOrder["activity"], "ship" | "hand" | "ROC" | "harvest"> = {
    ship: "ship",
    ROC: "ROC",
    FPS: "hand",
    salvage: "ship",
  };
  const acquisition = activityToAcquisition[activity];
  const activityOres = ORE_TYPES.filter((o) => o.acquisitionMethod === acquisition);
  const oresForSelect = activityOres.length > 0 ? activityOres : ORE_TYPES.filter((o) => o.acquisitionMethod === "ship");

  function onActivityChange(next: WorkOrder["activity"]) {
    setActivity(next);
    if (next === "ship") setCraftId(MINING_SHIPS_FLYABLE[0]?.id ?? "");
    else if (next === "ROC") setCraftId(MINING_VEHICLES[0]?.id ?? "");
    else if (next === "FPS") setCraftId(MINING_HAND_CRAFTS[0]?.id ?? "");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="flex flex-col md:flex-row gap-3 items-stretch max-w-full w-full md:max-w-none max-h-[90vh] md:max-h-[90vh]">
        <div className="card max-w-lg w-full max-h-[85vh] md:max-h-[90vh] overflow-y-auto shrink-0 order-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{isEdit ? "Edit Work Order" : "Add Work Order"}</h3>
          <button onClick={onClose} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-dark-700 transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-dim mb-1">Activity</label>
            <div className="flex gap-2">
              {[
                { value: "FPS" as const, label: "Hand" },
                { value: "ROC" as const, label: "Vehicle" },
                { value: "ship" as const, label: "Ship" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onActivityChange(value)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activity === value
                      ? "bg-accent-amber text-dark-950"
                      : "bg-dark-800 border border-dark-700 text-text hover:bg-dark-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activity === "ship" && (
            <div>
              <label className="block text-xs font-medium text-text-dim mb-1">Ship</label>
              <select
                value={craftId}
                onChange={(e) => setCraftId(e.target.value)}
                className="ship-select w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
              >
                {MINING_SHIPS_FLYABLE.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
                <option disabled>────────────</option>
                <option disabled>Coming soon™</option>
                {MINING_SHIPS_COMING_SOON.map((s) => (
                  <option key={s.id} value={s.id} disabled>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activity === "FPS" && (
            <div>
              <label className="block text-xs font-medium text-text-dim mb-1">Hand mining</label>
              <select
                value={craftId}
                onChange={(e) => setCraftId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
              >
                {MINING_HAND_CRAFTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activity === "ROC" && (
            <div>
              <label className="block text-xs font-medium text-text-dim mb-1">Vehicle</label>
              <select
                value={craftId}
                onChange={(e) => setCraftId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
              >
                {MINING_VEHICLES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-text-dim mb-1">Refinery</label>
            <select
              value={refineryId}
              onChange={(e) => setRefineryId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
            >
              {REFINERY_STATIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName} ({s.system})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-dim mb-1">Method</label>
            <div className="flex gap-2 w-full">
              <select
                value={methodId}
                onChange={(e) => setMethodId(e.target.value)}
                className="flex-1 min-w-0 px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
              >
                {REFINERY_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => (showMethods ? handleMethodsClose() : setShowMethods(true))}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dark-700 bg-dark-800 text-accent-amber hover:bg-dark-700 hover:border-accent-amber/30 text-sm font-medium transition-colors shrink-0"
              >
                <ExternalLink size={14} />
                View methods
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-dim mb-1">Ore</label>
            <select
              value={oreId}
              onChange={(e) => setOreId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
            >
              {oresForSelect.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-dim mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-dim mb-1">Yield (SCU)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={yieldScu}
                onChange={(e) => setYieldScu(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-dim mb-1">Quality (0–1000)</label>
              <input
                type="number"
                min={0}
                max={1000}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-dim mb-1">Price per unit (aUEC)</label>
              <input
                type="number"
                min={0}
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                placeholder={ore?.value?.toString()}
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-dim mb-1">Refinery fee (aUEC)</label>
            <input
              type="number"
              min={0}
              value={refineryFee}
              onChange={(e) => setRefineryFee(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <div className="flex-1 p-3 rounded-lg bg-dark-800 border border-dark-700">
              <div className="text-xs text-text-dim">Gross</div>
              <div className="font-mono font-medium">{grossAuec.toLocaleString()} aUEC</div>
            </div>
            <div className="flex-1 p-3 rounded-lg bg-accent-green/10 border border-accent-green/30">
              <div className="text-xs text-accent-green">Net</div>
              <div className="font-mono font-medium text-accent-green">{netAuec.toLocaleString()} aUEC</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-dark-800/50 border border-dark-700">
            <div className="text-xs text-text-dim mb-1">Est. refining time</div>
            <div className="font-mono text-sm mb-2">
              {estimatedMinutes >= 60
                ? `${Math.floor(estimatedMinutes / 60)}h ${estimatedMinutes % 60}m`
                : `${estimatedMinutes} min`}
            </div>
            <label className="block text-xs text-text-dim mb-1">Custom timer (min) — overrides estimate</label>
            <input
              type="number"
              min={1}
              placeholder="Leave empty for estimate"
              value={customTimerMinutes}
              onChange={(e) => setCustomTimerMinutes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm"
            />
          </div>

          <div className="flex gap-2 pt-4">
<button
            type="submit"
            className="flex-1 px-4 py-2 rounded-lg bg-accent-amber text-dark-950 font-medium hover:bg-accent-yellow transition-colors"
          >
            {isEdit ? "Save" : "Add Work Order"}
          </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-dark-700 hover:bg-dark-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
        {showMethods && (
          <div
            className={`shrink-0 order-2 w-full md:w-auto ${methodsClosing ? "methods-panel-retract" : "methods-panel-expand"}`}
            onAnimationEnd={(e) => {
              if (methodsClosing && e.animationName === "methods-panel-retract") {
                handleMethodsCloseComplete();
              }
            }}
          >
            <MethodsPanel onClose={handleMethodsClose} />
          </div>
        )}
      </div>
    </div>
  );
}
