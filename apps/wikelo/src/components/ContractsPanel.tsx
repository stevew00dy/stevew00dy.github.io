import { useState, useMemo } from "react";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import type { FilterMode } from "./FilterBar";
import { ContractCard } from "./ContractCard";
import { contracts } from "../data/contracts";
import type { InventoryHook } from "../hooks/useInventory";
import type { TrackedHook } from "../hooks/useTrackedContracts";
import type { CompletedHook } from "../hooks/useCompletedContracts";

interface ContractsPanelProps {
  inventory: InventoryHook;
  tracked: TrackedHook;
  completed: CompletedHook;
  onSelectMaterial: (materialId: string) => void;
}

export function ContractsPanel({ inventory, tracked, completed, onSelectMaterial }: ContractsPanelProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

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

  const counts: Record<FilterMode, number> = useMemo(() => {
    const searchFiltered = search
      ? enriched.filter(
          (e) =>
            e.contract.name.toLowerCase().includes(search.toLowerCase()) ||
            e.contract.reward.toLowerCase().includes(search.toLowerCase())
        )
      : enriched;
    return {
      all: searchFiltered.length,
      craftable: searchFiltered.filter((e) => e.isCraftable).length,
      "in-progress": searchFiltered.filter((e) => e.isInProgress).length,
      tracked: searchFiltered.filter((e) => e.isTracked).length,
    };
  }, [enriched, search]);

  const filtered = useMemo(() => {
    let result = enriched;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.contract.name.toLowerCase().includes(q) ||
          e.contract.reward.toLowerCase().includes(q)
      );
    }

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
  }, [enriched, search, filter]);

  const handleCraft = (contractId: string) => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return;
    inventory.deductBatch(contract.ingredients);
    completed.markCompleted(contractId);
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <FilterBar active={filter} onChange={setFilter} counts={counts} />
        <div className="sm:w-64">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search contracts or rewards..."
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
