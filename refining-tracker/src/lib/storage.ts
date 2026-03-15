/**
 * localStorage for sessions and work orders.
 * Solo only — no login.
 */
import type { Session, WorkOrder } from "../types/master";

const SESSIONS_KEY = "mining-tools-sessions";
const WORK_ORDERS_KEY = "mining-tools-work-orders";

export function getSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]) {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch { /* quota */ }
}

export function getWorkOrders(): WorkOrder[] {
  try {
    const raw = localStorage.getItem(WORK_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWorkOrders(orders: WorkOrder[]) {
  try {
    localStorage.setItem(WORK_ORDERS_KEY, JSON.stringify(orders));
  } catch { /* quota */ }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
