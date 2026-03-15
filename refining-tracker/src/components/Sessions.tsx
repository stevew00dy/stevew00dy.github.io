import { useState, useEffect, useMemo } from "react";
import { Calendar, Plus, Trash2, Zap, History, Pencil } from "lucide-react";
import { getSessions, saveSessions, getWorkOrders, saveWorkOrders, generateId } from "../lib/storage";
import type { Session, WorkOrder } from "../types/master";
import WorkOrderLog from "./WorkOrderLog";
import AddWorkOrder from "./AddWorkOrder";

function isLiveSession(sessionId: string): boolean {
  const orders = getWorkOrders().filter((o) => o.sessionId === sessionId);
  const now = Date.now();
  return orders.some((o) => o.timerEndsAt > now || (o.timerEndsAt <= now && !o.completed));
}

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [editingOrder, setEditingOrder] = useState<WorkOrder | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewFilter, setViewFilter] = useState<"live" | "history" | "all">("live");
  const [tick, setTick] = useState(0);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  useEffect(() => {
    if (sessions.length > 0) saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const { liveSessions, historySessions } = useMemo(() => {
    const live = sessions.filter((s) => isLiveSession(s.id));
    const history = sessions.filter((s) => !isLiveSession(s.id));
    return { liveSessions: live, historySessions: history };
  }, [sessions, refreshKey, tick]);

  function createSession() {
    const id = generateId();
    const defaultName = `Session ${new Date().toLocaleDateString()}`;
    const session: Session = {
      id,
      name: defaultName,
      workOrders: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((s) => [session, ...s]);
    setActiveSessionId(id);
    setEditingSessionId(id);
    setEditingName(defaultName);
  }

  function updateSessionName(id: string, name: string) {
    const trimmed = name.trim() || "Session";
    setSessions((s) =>
      s.map((x) => (x.id === id ? { ...x, name: trimmed, updatedAt: Date.now() } : x))
    );
    setEditingSessionId(null);
  }

  function startEditingName() {
    if (activeSession) {
      setEditingSessionId(activeSession.id);
      setEditingName(activeSession.name);
    }
  }

  function deleteSession(id: string) {
    const orders = getWorkOrders().filter((o) => o.sessionId !== id);
    saveWorkOrders(orders);
    setSessions((s) => s.filter((x) => x.id !== id));
    if (activeSessionId === id) setActiveSessionId(null);
  }

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const displayedSessions =
    viewFilter === "live" ? liveSessions : viewFilter === "history" ? historySessions : sessions;

  const orderCountBySession = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of getWorkOrders()) {
      counts[o.sessionId] = (counts[o.sessionId] ?? 0) + 1;
    }
    return counts;
  }, [sessions, refreshKey]);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-accent-green" />
          Sessions
        </h2>
        <p className="text-sm text-text-dim mb-4">
          Track refinery jobs across locations. Create a session, add work orders, monitor timers.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={createSession}
            className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-accent-green/15 text-accent-green border border-accent-green/30 hover:bg-accent-green/25 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            New Session
          </button>
          <div className="flex gap-1 border border-dark-700 rounded-lg p-0.5">
            <button
              onClick={() => setViewFilter("live")}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded text-xs font-medium transition-colors ${
                viewFilter === "live" ? "bg-accent-amber/20 text-accent-amber" : "text-text-dim hover:text-text"
              }`}
            >
              <Zap size={12} />
              Live ({liveSessions.length})
            </button>
            <button
              onClick={() => setViewFilter("history")}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded text-xs font-medium transition-colors ${
                viewFilter === "history" ? "bg-accent-amber/20 text-accent-amber" : "text-text-dim hover:text-text"
              }`}
            >
              <History size={12} />
              Complete ({historySessions.length})
            </button>
            <button
              onClick={() => setViewFilter("all")}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded text-xs font-medium transition-colors ${
                viewFilter === "all" ? "bg-accent-amber/20 text-accent-amber" : "text-text-dim hover:text-text"
              }`}
            >
              All ({sessions.length})
            </button>
          </div>
        </div>

        {sessions.length === 0 ? (
          <p className="py-8 text-center text-text-dim text-sm">
            No sessions yet. Create one to start tracking work orders.
          </p>
        ) : displayedSessions.length === 0 ? (
          <p className="py-6 text-center text-text-dim text-sm">
            {viewFilter === "live" && "No live sessions. All timers done or no work orders."}
            {viewFilter === "history" && "No completed sessions yet."}
          </p>
        ) : (
          <div className="overflow-x-auto -mx-1.5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-3 text-text-dim font-medium">Session</th>
                  <th className="text-left py-3 px-3 text-text-dim font-medium">Date</th>
                  <th className="text-left py-3 px-3 text-text-dim font-medium">Time</th>
                  <th className="text-center py-3 px-3 text-text-dim font-medium">Status</th>
                  <th className="text-center py-3 px-3 text-text-dim font-medium">Orders</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {displayedSessions.map((s) => {
                  const live = isLiveSession(s.id);
                  const orderCount = orderCountBySession[s.id] ?? 0;
                  return (
                    <tr
                      key={s.id}
                      onClick={() => setActiveSessionId(s.id)}
                      className={`border-b border-dark-700/50 cursor-pointer transition-colors ${
                        activeSessionId === s.id
                          ? "bg-accent-amber/15 border-l-4 border-l-accent-amber"
                          : "hover:bg-dark-800/50"
                      }`}
                    >
                      <td className="py-3 px-3 font-medium">
                        <span className="block min-w-[80px]">{s.name}</span>
                      </td>
                      <td className="py-3 px-3 text-text-dim text-xs whitespace-nowrap">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-text-dim text-xs whitespace-nowrap">
                        {new Date(s.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            live ? "bg-accent-green/20 text-accent-green" : "bg-dark-700 text-text-muted"
                          }`}
                        >
                          {live ? "Live" : "Complete"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">{orderCount}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete this session?")) deleteSession(s.id);
                          }}
                          className="p-1.5 rounded hover:bg-accent-red/20 text-accent-red transition-colors"
                          title="Delete session"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeSession && (
        <>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {editingSessionId === activeSession.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => updateSessionName(activeSession.id, editingName)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateSessionName(activeSession.id, editingName);
                    if (e.key === "Escape") setEditingSessionId(null);
                  }}
                  className="px-2 py-1 rounded bg-dark-800 border border-dark-600 text-base font-semibold focus:outline-none focus:ring-1 focus:ring-accent-amber min-w-[120px]"
                  autoFocus
                />
              ) : (
                <>
                  <h3 className="text-base font-semibold">{activeSession.name} — Work Orders</h3>
                  <button
                    onClick={startEditingName}
                    className="p-1.5 rounded hover:bg-dark-700 text-text-muted hover:text-text transition-colors"
                    title="Edit session name"
                  >
                    <Pencil size={14} />
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => {
                setEditingOrder(null);
                setShowAddOrder(true);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-blue/15 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue/25 text-sm font-medium"
            >
              <Plus size={14} />
              Add Work Order
            </button>
          </div>
          <WorkOrderLog
            sessionId={activeSession.id}
            refreshKey={refreshKey}
            onOrderClick={(order) => setEditingOrder(order)}
            onDeleted={() => {
              setSessions(getSessions());
              setRefreshKey((k) => k + 1);
            }}
          />
        </>
      )}

      {(showAddOrder || editingOrder) && activeSession && (
        <AddWorkOrder
          sessionId={activeSession.id}
          order={editingOrder}
          onClose={() => {
            setShowAddOrder(false);
            setEditingOrder(null);
          }}
          onAdded={() => {
            setShowAddOrder(false);
            setEditingOrder(null);
            setSessions(getSessions());
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
