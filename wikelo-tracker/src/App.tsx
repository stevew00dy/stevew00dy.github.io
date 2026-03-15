import { useState, useCallback, useRef } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { InventoryPanel } from "./components/InventoryPanel";
import { ContractsPanel } from "./components/ContractsPanel";
import { useInventory } from "./hooks/useInventory";
import { useTrackedContracts } from "./hooks/useTrackedContracts";
import { useCompletedContracts } from "./hooks/useCompletedContracts";
import { contracts } from "./data/contracts";

export default function App() {
  const inventory = useInventory();
  const tracked = useTrackedContracts();
  const completed = useCompletedContracts();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [highlightedMaterial, setHighlightedMaterial] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSelectMaterial = useCallback((materialId: string) => {
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    setInventoryOpen(true);
    setHighlightedMaterial(materialId);
    highlightTimer.current = setTimeout(() => setHighlightedMaterial(null), 2000);
  }, []);

  const completedCount = completed.completedIds.length;

  const craftableCount = contracts.filter(
    (c) =>
      !completed.isCompleted(c.id) &&
      c.ingredients.every((i) => inventory.get(i.materialId) >= i.quantity)
  ).length;

  return (
    <div className="min-h-screen bg-dark-950 text-text font-body">
      <Header
        completedCount={completedCount}
        craftableCount={craftableCount}
        totalCount={contracts.length}
        onReset={() => {
          inventory.resetAll();
          tracked.clearAll();
          completed.clearAll();
        }}
      />
      <main className="max-w-[1600px] mx-auto px-4 py-6 lg:flex lg:gap-6">
        <InventoryPanel
          inventory={inventory}
          isOpen={inventoryOpen}
          onToggle={() => setInventoryOpen(!inventoryOpen)}
          highlightedMaterialId={highlightedMaterial}
        />
        <ContractsPanel
          inventory={inventory}
          tracked={tracked}
          completed={completed}
          onSelectMaterial={handleSelectMaterial}
        />
      </main>
      <Footer />
    </div>
  );
}
