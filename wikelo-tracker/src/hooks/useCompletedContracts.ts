import { useState, useCallback } from "react";

const STORAGE_KEY = "wikelo-completed";

function loadCompleted(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCompleted(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useCompletedContracts() {
  const [completedIds, setCompletedIds] = useState<string[]>(loadCompleted);

  const isCompleted = useCallback(
    (id: string) => completedIds.includes(id),
    [completedIds]
  );

  const markCompleted = useCallback((id: string) => {
    setCompletedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveCompleted(next);
      return next;
    });
  }, []);

  const unmarkCompleted = useCallback((id: string) => {
    setCompletedIds((prev) => {
      const next = prev.filter((x) => x !== id);
      saveCompleted(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setCompletedIds([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { completedIds, isCompleted, markCompleted, unmarkCompleted, clearAll };
}

export type CompletedHook = ReturnType<typeof useCompletedContracts>;
