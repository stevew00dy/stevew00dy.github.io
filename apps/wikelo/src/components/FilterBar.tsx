export type FilterMode = "all" | "craftable" | "in-progress" | "tracked";

interface FilterBarProps {
  active: FilterMode;
  onChange: (mode: FilterMode) => void;
  counts: Record<FilterMode, number>;
}

const filters: { key: FilterMode; label: string }[] = [
  { key: "all", label: "All" },
  { key: "craftable", label: "Craftable" },
  { key: "in-progress", label: "In Progress" },
  { key: "tracked", label: "Tracked" },
];

export function FilterBar({ active, onChange, counts }: FilterBarProps) {
  return (
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
  );
}
