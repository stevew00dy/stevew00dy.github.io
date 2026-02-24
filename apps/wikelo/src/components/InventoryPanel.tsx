import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronRight, Backpack, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { MaterialRow } from "./MaterialRow";
import { materials, categoryLabels, categoryOrder, materialMap } from "../data/materials";
import type { MaterialCategory } from "../data/materials";
import type { InventoryHook } from "../hooks/useInventory";

interface InventoryPanelProps {
  inventory: InventoryHook;
  isOpen: boolean;
  onToggle: () => void;
  highlightedMaterialId: string | null;
}

export function InventoryPanel({ inventory, isOpen, onToggle, highlightedMaterialId }: InventoryPanelProps) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!highlightedMaterialId) return;
    const mat = materialMap.get(highlightedMaterialId);
    if (!mat) return;
    setCollapsed((prev) => ({ ...prev, [mat.category]: false }));
    setSearch("");
  }, [highlightedMaterialId]);

  const filtered = search
    ? materials.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      )
    : materials;

  const grouped = categoryOrder.reduce(
    (acc, cat) => {
      const items = filtered.filter((m) => m.category === cat);
      if (items.length > 0) acc.push({ category: cat, items });
      return acc;
    },
    [] as { category: MaterialCategory; items: typeof materials }[]
  );

  const toggleCategory = (cat: string) =>
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const allCollapsed = useMemo(
    () => grouped.length > 0 && grouped.every(({ category }) => collapsed[category]),
    [grouped, collapsed]
  );

  const toggleAll = () => {
    const next: Record<string, boolean> = {};
    for (const { category } of grouped) {
      next[category] = !allCollapsed;
    }
    setCollapsed(next);
  };

  const totalOwned = materials.reduce(
    (sum, m) => sum + inventory.get(m.id),
    0
  );

  const panelContent = (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Backpack className="w-4 h-4 text-accent-amber" />
          <h2 className="text-sm font-semibold">Inventory</h2>
          <span className="text-xs text-text-muted font-mono">{totalOwned} items</span>
        </div>
        <button
          onClick={toggleAll}
          className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-dark-700 transition-all duration-200"
          title={allCollapsed ? "Expand all" : "Collapse all"}
        >
          {allCollapsed ? (
            <ChevronsUpDown className="w-4 h-4" />
          ) : (
            <ChevronsDownUp className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="mb-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search materials..."
        />
      </div>
      <div className="space-y-1">
        {grouped.map(({ category, items }) => (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center gap-1.5 py-1.5 text-xs font-medium text-text-dim hover:text-text transition-colors"
            >
              {collapsed[category] ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              {categoryLabels[category]}
              <span className="text-text-muted font-mono ml-auto">{items.length}</span>
            </button>
            {!collapsed[category] && (
              <div className="pl-2 border-l border-dark-700 ml-1.5">
                {items.map((m) => (
                  <MaterialRow
                    key={m.id}
                    material={m}
                    quantity={inventory.get(m.id)}
                    isHighlighted={m.id === highlightedMaterialId}
                    onIncrement={() => inventory.increment(m.id)}
                    onDecrement={() => inventory.decrement(m.id)}
                    onSet={(qty) => inventory.set(m.id, qty)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        {grouped.length === 0 && (
          <p className="text-xs text-text-muted py-4 text-center">No materials match your search</p>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={onToggle}
        className="lg:hidden w-full card p-3 mb-4 flex items-center justify-between text-sm font-medium"
      >
        <div className="flex items-center gap-2">
          <Backpack className="w-4 h-4 text-accent-amber" />
          Inventory
          <span className="text-xs text-text-muted font-mono">{totalOwned} items</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-muted" />
        )}
      </button>
      {isOpen && (
        <div className="lg:hidden card p-4 mb-4">{panelContent}</div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 sticky top-[73px] max-h-[calc(100vh-73px-2rem)] overflow-y-auto card p-4">
        {panelContent}
      </aside>
    </>
  );
}
