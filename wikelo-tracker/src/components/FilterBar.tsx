import type { ContractCategory } from "../data/contracts";

export type FilterMode = "all" | "craftable" | "in-progress" | "tracked";

interface FilterBarProps {
  active: FilterMode;
  onChange: (mode: FilterMode) => void;
  counts: Record<FilterMode, number>;
  activeCategory: ContractCategory | "all";
  onCategoryChange: (cat: ContractCategory | "all") => void;
  categoryCounts: Record<ContractCategory | "all", number>;
}

const filters: { key: FilterMode; label: string }[] = [
  { key: "all", label: "All" },
  { key: "craftable", label: "Craftable" },
  { key: "in-progress", label: "In Progress" },
  { key: "tracked", label: "Tracked" },
];

const categories: { key: ContractCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "armor", label: "Armor" },
  { key: "weapon", label: "Weapons" },
  { key: "ship", label: "Ships" },
  { key: "vehicle", label: "Vehicles" },
  { key: "currency", label: "Exchanges" },
];

export function FilterBar({ active, onChange, counts, activeCategory, onCategoryChange, categoryCounts }: FilterBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-1 p-1 bg-dark-800 rounded-lg">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              active === key
                ? "bg-dark-600 text-text shadow-sm"
                : "text-text-muted hover:text-text-dim"
            }`}
          >
            {label}
            <span
              className={`ml-1.5 font-mono text-[10px] ${
                active === key ? "text-accent-blue" : "text-text-muted"
              }`}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>
      <div className="flex gap-1 p-1 bg-dark-800 rounded-lg">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
              activeCategory === key
                ? "bg-dark-600 text-text shadow-sm"
                : "text-text-muted hover:text-text-dim"
            }`}
          >
            {label}
            <span
              className={`ml-1 font-mono text-[10px] ${
                activeCategory === key ? "text-accent-blue" : "text-text-muted"
              }`}
            >
              {categoryCounts[key]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
