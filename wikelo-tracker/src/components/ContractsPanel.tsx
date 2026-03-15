import { useState, useMemo } from "react";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import type { FilterMode } from "./FilterBar";
import { ContractCard } from "./ContractCard";
import { contracts } from "../data/contracts";
import type { ContractCategory } from "../data/contracts";
import { materials } from "../data/materials";
import type { InventoryHook } from "../hooks/useInventory";
import type { TrackedHook } from "../hooks/useTrackedContracts";
import type { CompletedHook } from "../hooks/useCompletedContracts";

interface ContractsPanelProps {
  inventory: InventoryHook;
  tracked: TrackedHook;
  completed: CompletedHook;
  onSelectMaterial: (materialId: string) => void;
}

const materialNameMap = new Map(materials.map((m) => [m.id, m.name]));

function contractMatchesSearch(contract: typeof contracts[number], q: string): boolean {
  return (
    contract.name.toLowerCase().includes(q) ||
    contract.reward.toLowerCase().includes(q) ||
    contract.category.toLowerCase().includes(q) ||
    contract.ingredients.some((ing) =>
      (materialNameMap.get(ing.materialId) ?? "").toLowerCase().includes(q)
    )
  );
}

export function ContractsPanel({ inventory, tracked, completed, onSelectMaterial }: ContractsPanelProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [category, setCategory] = useState<ContractCategory | "all">("all");

  const enriched = useMemo(
    () =>
      contracts.map((c) => {
        const isComplete = completed.isCompleted(c.id);
        const statuses = c.ingredients.map((ing) => ({
          ...ing,
          owned: inventory.get(ing.materialId),
          complete: inventory.get(ing.materialId) >= ing.quantity,
        }));
        const done = statuses.filter((s) => s.complete).length;
        const total = statuses.length;
        return {
          contract: c,
          progress: total > 0 ? done / total : 0,
          isCraftable: done === total && !isComplete,
          isInProgress: done > 0 && done < total && !isComplete,
          isTracked: tracked.isTracked(c.id),
          isCompleted: isComplete,
        };
      }),
    [inventory, tracked, completed]
  );

  const baseFiltered = useMemo(() => {
    let result = enriched;
    if (category !== "all") {
      result = result.filter((e) => e.contract.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) => contractMatchesSearch(e.contract, q));
    }
    return result;
  }, [enriched, search, category]);

  const counts: Record<FilterMode, number> = useMemo(() => ({
    all: baseFiltered.length,
    craftable: baseFiltered.filter((e) => e.isCraftable).length,
    "in-progress": baseFiltered.filter((e) => e.isInProgress).length,
    tracked: baseFiltered.filter((e) => e.isTracked).length,
  }), [baseFiltered]);

  const categoryCounts = useMemo(() => {
    let pool = enriched;
    if (search) {
      const q = search.toLowerCase();
      pool = pool.filter((e) => contractMatchesSearch(e.contract, q));
    }
    const result: Record<ContractCategory | "all", number> = {
      all: pool.length,
      armor: 0,
      weapon: 0,
      ship: 0,
      vehicle: 0,
      currency: 0,
    };
    for (const e of pool) {
      result[e.contract.category]++;
    }
    return result;
  }, [enriched, search]);

  const filtered = useMemo(() => {
    let result = baseFiltered;
    switch (filter) {
      case "craftable":
        result = result.filter((e) => e.isCraftable);
        break;
      case "in-progress":
        result = result.filter((e) => e.isInProgress);
        break;
      case "tracked":
        result = result.filter((e) => e.isTracked);
        break;
    }

    return result.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      if (a.isTracked !== b.isTracked) return a.isTracked ? -1 : 1;
      if (a.isCraftable !== b.isCraftable) return a.isCraftable ? -1 : 1;
      return b.progress - a.progress;
    });
  }, [baseFiltered, filter]);

  const handleCraft = (contractId: string) => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return;
    inventory.deductBatch(contract.ingredients);
    completed.markCompleted(contractId);
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <FilterBar
          active={filter}
          onChange={setFilter}
          counts={counts}
          activeCategory={category}
          onCategoryChange={setCategory}
          categoryCounts={categoryCounts}
        />
        <div className="sm:w-64">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search contracts, rewards or ingredients..."
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-text-muted text-sm">No contracts match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <ContractCard
              key={e.contract.id}
              contract={e.contract}
              inventory={inventory}
              isTracked={e.isTracked}
              isCompleted={e.isCompleted}
              onToggleTrack={() => tracked.toggle(e.contract.id)}
              onCraft={() => handleCraft(e.contract.id)}
              onUncomplete={() => completed.unmarkCompleted(e.contract.id)}
              onSelectMaterial={onSelectMaterial}
            />
          ))}
        </div>
      )}
    </div>
  );
}
