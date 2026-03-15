import { useState, useCallback } from "react";

const STORAGE_KEY = "wikelo-tracked";

function loadTracked(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTracked(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useTrackedContracts() {
  const [trackedIds, setTrackedIds] = useState<string[]>(loadTracked);

  const isTracked = useCallback(
    (id: string) => trackedIds.includes(id),
    [trackedIds]
  );

  const toggle = useCallback((id: string) => {
    setTrackedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveTracked(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setTrackedIds([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { trackedIds, isTracked, toggle, clearAll };
}

export type TrackedHook = ReturnType<typeof useTrackedContracts>;
