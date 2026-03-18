import { useCallback, useState } from "react";

const STORAGE_KEY = "crafting-tracker-owned-blueprints";

function loadOwnedBlueprints(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOwnedBlueprints(state: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useOwnedBlueprints() {
  const [owned, setOwned] = useState<Record<string, boolean>>(loadOwnedBlueprints);

  const isOwned = useCallback((itemId: string) => owned[itemId] === true, [owned]);

  const toggle = useCallback((itemId: string) => {
    setOwned((current) => {
      const next = { ...current, [itemId]: !current[itemId] };
      saveOwnedBlueprints(next);
      return next;
    });
  }, []);

  const setAll = useCallback((itemId: string, value: boolean) => {
    setOwned((current) => {
      const next = { ...current, [itemId]: value };
      saveOwnedBlueprints(next);
      return next;
    });
  }, []);

  const replaceAll = useCallback((nextOwned: Record<string, boolean>) => {
    const normalized = Object.fromEntries(
      Object.entries(nextOwned).map(([itemId, value]) => [itemId, value === true]),
    );
    setOwned(normalized);
    saveOwnedBlueprints(normalized);
  }, []);

  const resetAll = useCallback(() => {
    setOwned({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { owned, isOwned, toggle, setAll, replaceAll, resetAll };
}
