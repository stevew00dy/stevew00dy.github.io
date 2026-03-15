import { Rocket, Globe, Mountain } from "lucide-react";

export type LocationType = "space" | "planet" | "cave";

const LOCATION_LABELS: Record<LocationType, string> = {
  space: "Space",
  planet: "Planet",
  cave: "Cave",
};

const LOCATION_PILL_STYLES: Record<LocationType, string> = {
  space: "bg-dark-900 border-dark-600 text-text",
  planet: "bg-accent-green/25 border-accent-green/60 text-accent-green",
  cave: "bg-accent-yellow/25 border-accent-yellow/60 text-accent-yellow",
};

export function LocationPills({ types }: { types?: LocationType[] }) {
  if (!types?.length) return <span className="text-text-dim">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {types.map((t) => (
        <span
          key={t}
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-medium border ${LOCATION_PILL_STYLES[t]}`}
        >
          {t === "space" && <Rocket size={10} />}
          {t === "planet" && <Globe size={10} />}
          {t === "cave" && <Mountain size={10} />}
          {LOCATION_LABELS[t]}
        </span>
      ))}
    </div>
  );
}

export type SystemType = "Stanton" | "Pyro" | "Nyx";

const SYSTEM_PILL_STYLES: Record<SystemType, string> = {
  Stanton: "bg-accent-blue/30 text-accent-blue",
  Pyro: "bg-accent-amber/30 text-accent-amber",
  Nyx: "bg-accent-purple/30 text-accent-purple",
};

export function SystemPills({ systems }: { systems?: string[] }) {
  if (!systems?.length) return <span className="text-text-dim">—</span>;
  const valid = systems.filter((s): s is SystemType => s === "Stanton" || s === "Pyro" || s === "Nyx");
  if (!valid.length) return <span className="text-text-dim">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {valid.map((s) => (
        <span
          key={s}
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium ${SYSTEM_PILL_STYLES[s]}`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}
