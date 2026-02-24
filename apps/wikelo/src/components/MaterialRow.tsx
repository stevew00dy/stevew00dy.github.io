import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Info } from "lucide-react";
import type { Material } from "../data/materials";
import { materialTips } from "../data/tips";

interface MaterialRowProps {
  material: Material;
  quantity: number;
  isHighlighted: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onSet: (qty: number) => void;
}

export function MaterialRow({
  material,
  quantity,
  isHighlighted,
  onIncrement,
  onDecrement,
  onSet,
}: MaterialRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showTip, setShowTip] = useState(false);
  const tip = materialTips[material.id];

  useEffect(() => {
    if (isHighlighted && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);

  return (
    <div
      ref={rowRef}
      className={`relative py-1.5 group rounded-md px-1 transition-all duration-300 ${
        isHighlighted ? "bg-accent-blue/15 ring-1 ring-accent-blue/40" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-xs text-text-dim flex-1 min-w-0 break-words leading-tight group-hover:text-text transition-colors duration-200">
            {material.name}
          </span>
          {tip && (
            <button
              onClick={() => setShowTip(!showTip)}
              className={`shrink-0 p-0.5 rounded transition-colors duration-200 ${
                showTip
                  ? "text-accent-blue"
                  : "text-text-muted/40 hover:text-accent-blue/70"
              }`}
              title="Farming tip"
            >
              <Info className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onDecrement}
            disabled={quantity <= 0}
            className="w-6 h-6 flex items-center justify-center rounded bg-dark-700 text-text-muted hover:bg-accent-red/20 hover:text-accent-red disabled:opacity-30 disabled:hover:bg-dark-700 disabled:hover:text-text-muted transition-all duration-200"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => onSet(parseInt(e.target.value) || 0)}
            className="w-12 h-6 text-center text-xs font-mono bg-dark-800 border border-dark-700 rounded text-text focus:outline-none focus:border-accent-blue/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={onIncrement}
            className="w-6 h-6 flex items-center justify-center rounded bg-dark-700 text-text-muted hover:bg-accent-green/20 hover:text-accent-green transition-all duration-200"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      {showTip && tip && (
        <div className="mt-1 px-1 py-1.5 text-[10px] leading-relaxed text-text-dim bg-dark-800 border border-dark-700 rounded-md">
          {tip}
        </div>
      )}
    </div>
  );
}
