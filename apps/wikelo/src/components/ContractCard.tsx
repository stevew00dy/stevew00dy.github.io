import { Star, CheckCircle, Undo2, Hammer } from "lucide-react";
import type { Contract } from "../data/contracts";
import { materialMap } from "../data/materials";
import type { InventoryHook } from "../hooks/useInventory";

interface ContractCardProps {
  contract: Contract;
  inventory: InventoryHook;
  isTracked: boolean;
  isCompleted: boolean;
  onToggleTrack: () => void;
  onCraft: () => void;
  onUncomplete: () => void;
  onSelectMaterial: (materialId: string) => void;
}

function StatusDot({ owned, needed }: { owned: number; needed: number }) {
  const color = owned >= needed ? "bg-accent-green" : owned > 0 ? "bg-accent-amber" : "bg-accent-red";
  return <span className={`w-2 h-2 rounded-full ${color} shrink-0 mt-1`} />;
}

export function ContractCard({
  contract,
  inventory,
  isTracked,
  isCompleted,
  onToggleTrack,
  onCraft,
  onUncomplete,
  onSelectMaterial,
}: ContractCardProps) {
  const ingredientStatuses = contract.ingredients.map((ing) => {
    const owned = inventory.get(ing.materialId);
    return { ...ing, owned, complete: owned >= ing.quantity };
  });

  const completedIngredients = ingredientStatuses.filter((i) => i.complete).length;
  const totalIngredients = ingredientStatuses.length;
  const progress = totalIngredients > 0 ? completedIngredients / totalIngredients : 0;
  const isCraftable = progress === 1 && !isCompleted;

  return (
    <div
      className={`card p-4 transition-all duration-300 ${
        isCompleted
          ? "border-accent-green/30 opacity-60"
          : isCraftable
            ? "animate-glow-green border-accent-green/40"
            : progress > 0
              ? "border-dark-600 hover:border-dark-600"
              : "hover:border-dark-600"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold break-words">{contract.name}</h3>
            {isCompleted && (
              <CheckCircle className="w-4 h-4 text-accent-green shrink-0" />
            )}
          </div>
          <p className="text-xs text-accent-purple break-words">{contract.reward}</p>
        </div>
        <button
          onClick={onToggleTrack}
          className={`p-1 rounded transition-all duration-200 shrink-0 ${
            isTracked
              ? "text-accent-amber"
              : "text-text-muted hover:text-accent-amber/60"
          }`}
          title={isTracked ? "Untrack" : "Track this contract"}
        >
          <Star className={`w-4 h-4 ${isTracked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-text-muted">
            {isCompleted ? "Completed" : `${completedIngredients}/${totalIngredients} ingredients`}
          </span>
          <span
            className={`font-mono font-semibold ${
              isCompleted || isCraftable ? "text-accent-green text-glow" : "text-text-dim"
            }`}
          >
            {isCompleted ? "100%" : `${Math.round(progress * 100)}%`}
          </span>
        </div>
        <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted || isCraftable
                ? "bg-accent-green"
                : progress > 0
                  ? "bg-accent-amber"
                  : "bg-dark-600"
            }`}
            style={{ width: isCompleted ? "100%" : `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Ingredients */}
      {!isCompleted && (
        <div className="space-y-1 mb-3">
          {ingredientStatuses.map((ing) => {
            const mat = materialMap.get(ing.materialId);
            return (
              <div key={ing.materialId} className="flex items-start gap-2 text-xs">
                <StatusDot owned={ing.owned} needed={ing.quantity} />
                <button
                onClick={() => onSelectMaterial(ing.materialId)}
                className="flex-1 min-w-0 break-words leading-tight text-text-dim hover:text-accent-blue text-left transition-colors duration-200 cursor-pointer"
              >
                  {mat?.name ?? ing.materialId}
              </button>
                <span className="font-mono shrink-0">
                  <span
                    className={
                      ing.complete
                        ? "text-accent-green"
                        : ing.owned > 0
                          ? "text-accent-amber"
                          : "text-text-muted"
                    }
                  >
                    {ing.owned}
                  </span>
                  <span className="text-text-muted">/{ing.quantity}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Craft / Undo button */}
      {isCraftable && (
        <button
          onClick={onCraft}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-accent-green/20 text-accent-green text-xs font-semibold hover:bg-accent-green/30 transition-all duration-200"
        >
          <Hammer className="w-3.5 h-3.5" />
          Hand In Contract
        </button>
      )}
      {isCompleted && (
        <button
          onClick={onUncomplete}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg bg-dark-700 text-text-muted text-xs hover:text-text hover:bg-dark-600 transition-all duration-200"
        >
          <Undo2 className="w-3 h-3" />
          Undo
        </button>
      )}
    </div>
  );
}
