import { useState, useCallback } from "react";

const STORAGE_KEY = "wikelo-inventory";

function loadInventory(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveInventory(inv: Record<string, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inv));
}

export function useInventory() {
  const [inventory, setInventory] = useState<Record<string, number>>(loadInventory);

  const get = useCallback(
    (materialId: string) => inventory[materialId] ?? 0,
    [inventory]
  );

  const set = useCallback((materialId: string, quantity: number) => {
    const clamped = Math.max(0, Math.floor(quantity));
    setInventory((prev) => {
      const next = { ...prev, [materialId]: clamped };
      saveInventory(next);
      return next;
    });
  }, []);

  const increment = useCallback((materialId: string) => {
    setInventory((prev) => {
      const next = { ...prev, [materialId]: (prev[materialId] ?? 0) + 1 };
      saveInventory(next);
      return next;
    });
  }, []);

  const decrement = useCallback((materialId: string) => {
    setInventory((prev) => {
      const current = prev[materialId] ?? 0;
      if (current <= 0) return prev;
      const next = { ...prev, [materialId]: current - 1 };
      saveInventory(next);
      return next;
    });
  }, []);

  const deductBatch = useCallback(
    (items: { materialId: string; quantity: number }[]) => {
      setInventory((prev) => {
        const next = { ...prev };
        for (const { materialId, quantity } of items) {
          next[materialId] = Math.max(0, (next[materialId] ?? 0) - quantity);
        }
        saveInventory(next);
        return next;
      });
    },
    []
  );

  const resetAll = useCallback(() => {
    setInventory({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { inventory, get, set, increment, decrement, deductBatch, resetAll };
}

export type InventoryHook = ReturnType<typeof useInventory>;
