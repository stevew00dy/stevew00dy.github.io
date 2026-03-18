import { useCallback, useState } from "react";

const STORAGE_KEY = "crafting-tracker-material-inventory";
type MaterialInventoryStorage = {
  version: 1;
  patches: Record<string, Record<string, number>>;
};

function emptyStorage(): MaterialInventoryStorage {
  return {
    version: 1,
    patches: {},
  };
}

function readStorage(): MaterialInventoryStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStorage();
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "patches" in parsed) {
      return {
        version: 1,
        patches: typeof parsed.patches === "object" && parsed.patches ? parsed.patches as Record<string, Record<string, number>> : {},
      };
    }
    return emptyStorage();
  } catch {
    return emptyStorage();
  }
}

function normalizeQuantity(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value * 1_000_000) / 1_000_000);
}

function inventoryForPatch(storage: MaterialInventoryStorage, gameVersion: string) {
  return storage.patches[gameVersion] ?? {};
}

function writeStorage(storage: MaterialInventoryStorage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

export function useMaterialInventory(gameVersion: string) {
  const [inventory, setInventory] = useState<Record<string, number>>(() => inventoryForPatch(readStorage(), gameVersion));

  const get = useCallback((materialKey: string) => inventory[materialKey] ?? 0, [inventory]);

  const set = useCallback((materialKey: string, quantity: number) => {
    setInventory((current) => {
      const next = { ...current, [materialKey]: normalizeQuantity(quantity) };
      const storage = readStorage();
      storage.patches[gameVersion] = next;
      writeStorage(storage);
      return next;
    });
  }, [gameVersion]);

  const increment = useCallback((materialKey: string, step = 1) => {
    setInventory((current) => {
      const next = { ...current, [materialKey]: normalizeQuantity((current[materialKey] ?? 0) + step) };
      const storage = readStorage();
      storage.patches[gameVersion] = next;
      writeStorage(storage);
      return next;
    });
  }, [gameVersion]);

  const decrement = useCallback((materialKey: string, step = 1) => {
    setInventory((current) => {
      const next = { ...current, [materialKey]: normalizeQuantity((current[materialKey] ?? 0) - step) };
      const storage = readStorage();
      storage.patches[gameVersion] = next;
      writeStorage(storage);
      return next;
    });
  }, [gameVersion]);

  const resetAll = useCallback(() => {
    setInventory({});
    const storage = readStorage();
    delete storage.patches[gameVersion];
    if (Object.keys(storage.patches).length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    writeStorage(storage);
  }, [gameVersion]);

  const replaceAll = useCallback(
    (nextInventory: Record<string, number>) => {
      const normalized = Object.fromEntries(
        Object.entries(nextInventory).map(([materialKey, quantity]) => [materialKey, normalizeQuantity(quantity)]),
      );
      setInventory(normalized);
      const storage = readStorage();
      storage.patches[gameVersion] = normalized;
      writeStorage(storage);
    },
    [gameVersion],
  );

  return { inventory, get, set, increment, decrement, resetAll, replaceAll, gameVersion };
}

export type MaterialInventoryHook = ReturnType<typeof useMaterialInventory>;
