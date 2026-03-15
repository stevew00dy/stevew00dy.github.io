/**
 * Export/import for sessions and work orders.
 * JSON backup and restore.
 */
import type { Session, WorkOrder } from "../types/master";
import { getSessions, getWorkOrders, saveSessions, saveWorkOrders } from "./storage";

export interface ExportData {
  version: 1;
  exportedAt: number;
  sessions: Session[];
  workOrders: WorkOrder[];
}

export function exportToJson(): void {
  const data: ExportData = {
    version: 1,
    exportedAt: Date.now(),
    sessions: getSessions(),
    workOrders: getWorkOrders(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `refining-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJson(file: File): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = reader.result as string;
        const data = JSON.parse(raw) as ExportData;
        if (!data.version || !Array.isArray(data.sessions) || !Array.isArray(data.workOrders)) {
          resolve({ ok: false, error: "Invalid backup format" });
          return;
        }
        saveSessions(data.sessions);
        saveWorkOrders(data.workOrders);
        resolve({ ok: true });
      } catch (e) {
        resolve({ ok: false, error: e instanceof Error ? e.message : "Parse error" });
      }
    };
    reader.onerror = () => resolve({ ok: false, error: "Failed to read file" });
    reader.readAsText(file);
  });
}
