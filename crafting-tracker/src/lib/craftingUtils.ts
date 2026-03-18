import type { Dispatch, SetStateAction } from "react";
import type { CraftingItem, InputType, QualityEffect, StatProvenance } from "../data";

export type SortKey =
  | "name"
  | "name-desc"
  | "category"
  | "category-desc"
  | "detail"
  | "detail-desc"
  | "materials"
  | "materials-desc"
  | "need"
  | "need-desc"
  | "missions"
  | "missions-desc"
  | "time-asc"
  | "time-desc"
  | "craftable";

export type RequirementSummary = {
  materialKey: string;
  name: string;
  amount: number;
  unit: string;
  owned: number;
  shortfall: number;
  acquisition: string;
  type: InputType;
};

export type CraftabilitySummary = {
  craftable: boolean;
  missingCount: number;
  shortageLabel: string;
  requirements: RequirementSummary[];
};

export type OutputStatRow = {
  stat: string;
  affectedBy: string[];
  baseValue: number;
  nextValue: number;
  unit: string;
  precision: number;
  valueKind: CraftingItem["outputStats"][number]["valueKind"];
  provenance: StatProvenance;
  trend: "better" | "worse" | "same";
  deltaPercent: number;
};

export type InputQualitiesState = Record<string, number>;
export type SetInputQualities = Dispatch<SetStateAction<InputQualitiesState>>;

export type BrowseFilterState = {
  search: string;
  category: string;
  armorClass: string;
  armorSlot: string;
  weaponClass: string;
};

export type ScopedFilterState = {
  activeTab: "crafting" | "blueprints";
  craftabilityFilter: "all" | "craftable" | "missing";
  blueprintOwnershipFilter: "all" | "owned" | "missing";
};

const CSCU_PER_SCU = 100;

export const ALLOWED_ARMOR_CLASSES = ["Heavy", "Medium", "Light"] as const;
export const ALLOWED_ARMOR_SLOTS = ["Helmet", "Core", "Legs", "Arms", "Backpack", "Undersuit"] as const;

export function sliderKey(itemId: string, slot: string) {
  return `${itemId}:${slot}`;
}

export function createInitialQualities(items: CraftingItem[], qualityBaseline: number) {
  return Object.fromEntries(
    items.flatMap((item) => item.inputs.map((input) => [sliderKey(item.id, input.slot), qualityBaseline])),
  ) as InputQualitiesState;
}

export function typeClasses(type: InputType) {
  if (type === "Raw") return "border-accent-blue/20 bg-accent-blue/10 text-accent-blue";
  return "border-accent-amber/20 bg-accent-amber/10 text-accent-amber";
}

function interpolateMultiplier(effect: QualityEffect, quality: number, qualityBaseline: number) {
  if (quality === qualityBaseline) return effect.baselineMultiplier;

  if (quality < qualityBaseline) {
    const t = quality / qualityBaseline;
    return effect.startMultiplier + (effect.baselineMultiplier - effect.startMultiplier) * t;
  }

  const t = (quality - qualityBaseline) / qualityBaseline;
  return effect.baselineMultiplier + (effect.endMultiplier - effect.baselineMultiplier) * t;
}

function statTrend(baseValue: number, nextValue: number, higherIsBetter: boolean) {
  if (Math.abs(baseValue - nextValue) < 0.0001) return "same";
  if (higherIsBetter) {
    return nextValue > baseValue ? "better" : "worse";
  }
  return nextValue < baseValue ? "better" : "worse";
}

function performanceDeltaPercent(baseValue: number, nextValue: number, higherIsBetter: boolean) {
  if (Math.abs(baseValue) < 0.0001) return 0;
  const rawPercent = ((nextValue - baseValue) / baseValue) * 100;
  return higherIsBetter ? rawPercent : -rawPercent;
}

export function outputStatRows(item: CraftingItem, inputQualities: InputQualitiesState, qualityBaseline: number): OutputStatRow[] {
  return item.outputStats
    .map((outputStat) => {
      const matchingEffects = item.qualityEffects.filter((entry) => outputStat.effectStats.includes(entry.stat));
      const multiplier = matchingEffects.reduce((product, effect) => {
        const quality = inputQualities[sliderKey(item.id, effect.affectedBy)] ?? qualityBaseline;
        return product * interpolateMultiplier(effect, quality, qualityBaseline);
      }, 1);
      const nextValue = outputStat.baseValue * multiplier;
      const affectedBy = [...new Set(matchingEffects.map((effect) => effect.affectedBy))];

      return {
        stat: outputStat.stat,
        affectedBy,
        baseValue: outputStat.baseValue,
        nextValue,
        unit: outputStat.unit,
        precision: outputStat.precision,
        valueKind: outputStat.valueKind,
        provenance: outputStat.provenance,
        trend: statTrend(outputStat.baseValue, nextValue, outputStat.higherIsBetter),
        deltaPercent: performanceDeltaPercent(outputStat.baseValue, nextValue, outputStat.higherIsBetter),
      } satisfies OutputStatRow;
    })
    .filter((row): row is OutputStatRow => row !== null);
}

export function formatGeneratedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export function formatStatValue(value: number, unit: string, precision: number) {
  const formatted = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(value);

  if (!unit) return formatted;
  if (unit === "%") return `${formatted}%`;
  return `${formatted} ${unit}`;
}

export function formatOutputValue(
  value: number,
  unit: string,
  precision: number,
  valueKind: CraftingItem["outputStats"][number]["valueKind"],
) {
  if (valueKind === "modifier") {
    return `${value.toFixed(Math.min(Math.max(precision, 2), 3)).replace(/\.?0+$/, "")}x`;
  }

  return formatStatValue(value, unit, precision);
}

export function formatDeltaPercent(value: number) {
  const sign = value > 0.0001 ? "+" : value < -0.0001 ? "" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatQuantity(value: number, unit: string) {
  if (unit !== "SCU") return `${formatNumber(value, 0)} ${unit}`;

  if (value >= 1) {
    return `${formatNumber(value, 2)} SCU`;
  }

  return `${formatNumber(value * CSCU_PER_SCU, 2)} cSCU`;
}

export function formatStorageNote(value: number, unit: string) {
  if (unit !== "SCU") return `${formatNumber(value, 0)} ${unit}`;

  return `${formatNumber(value * CSCU_PER_SCU, 2)} cSCU`;
}

export function editorDisplayUnit(_value: number, unit: string) {
  if (unit !== "SCU") return unit;
  return "cSCU";
}

export function inputUnitLabel(unit: string, value = 0) {
  if (unit === "SCU") return `Edit in ${editorDisplayUnit(value, unit)}`;
  return unit;
}

export function formatOwned(value: number, unit: string) {
  return formatQuantity(value, unit);
}

export function stepForUnit(unit: string, _value = 0) {
  if (unit !== "SCU") return 1;
  return 1;
}

export function toEditorValue(value: number, unit: string) {
  if (unit === "SCU") {
    return Math.round(value * CSCU_PER_SCU * 100) / 100;
  }
  return value;
}

export function fromEditorValue(value: number, unit: string, _displayUnit?: string) {
  if (!Number.isFinite(value)) return 0;
  if (unit === "SCU") {
    return value / CSCU_PER_SCU;
  }
  return value;
}

export function clampQuality(value: number, qualityBaseline: number) {
  if (!Number.isFinite(value)) return qualityBaseline;
  return Math.max(0, Math.min(1000, Math.round(value)));
}

export function detailLabel(item: CraftingItem) {
  if (item.category === "Armour") return [getArmorClass(item), getArmorSlot(item)].filter(Boolean).join(" ");
  return item.weaponClass ?? item.subcategory;
}

export function getArmorClass(item: CraftingItem) {
  if (item.armorClass && ALLOWED_ARMOR_CLASSES.includes(item.armorClass as (typeof ALLOWED_ARMOR_CLASSES)[number])) {
    return item.armorClass;
  }

  const haystack = `${item.name} ${item.blueprintName} ${item.subcategory}`.toLowerCase();
  if (haystack.includes("heavy")) return "Heavy";
  if (haystack.includes("medium")) return "Medium";
  if (haystack.includes("light")) return "Light";
  return undefined;
}

export function getArmorSlot(item: CraftingItem) {
  if (item.armorSlot && ALLOWED_ARMOR_SLOTS.includes(item.armorSlot as (typeof ALLOWED_ARMOR_SLOTS)[number])) {
    return item.armorSlot;
  }

  const haystack = `${item.name} ${item.blueprintName} ${item.subcategory}`.toLowerCase();
  if (haystack.includes("helmet")) return "Helmet";
  if (haystack.includes("backpack")) return "Backpack";
  if (haystack.includes("undersuit") || haystack.includes("flightsuit")) return "Undersuit";
  if (haystack.includes(" arms")) return "Arms";
  if (haystack.includes(" core")) return "Core";
  if (haystack.includes(" legs")) return "Legs";
  return undefined;
}

export function summarizeRequirements(item: CraftingItem, inventory: Record<string, number>): RequirementSummary[] {
  const requirements = new Map<string, RequirementSummary>();
  for (const input of item.inputs) {
    const existing = requirements.get(input.materialKey);
    if (existing) {
      existing.amount += input.amount;
      existing.shortfall = Math.max(0, existing.amount - existing.owned);
      continue;
    }
    const owned = inventory[input.materialKey] ?? 0;
    requirements.set(input.materialKey, {
      materialKey: input.materialKey,
      name: input.requirement,
      amount: input.amount,
      unit: input.unit,
      owned,
      shortfall: Math.max(0, input.amount - owned),
      acquisition: input.acquisition,
      type: input.type,
    });
  }
  return [...requirements.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function getCraftabilitySummary(item: CraftingItem, inventory: Record<string, number>): CraftabilitySummary {
  const requirements = summarizeRequirements(item, inventory);
  const missing = requirements.filter((requirement) => requirement.shortfall > 0.0001);
  if (missing.length === 0) {
    return {
      craftable: true,
      missingCount: 0,
      shortageLabel: "Ready to craft",
      requirements,
    };
  }
  return {
    craftable: false,
    missingCount: missing.length,
    shortageLabel: `Short on ${missing.length} material${missing.length === 1 ? "" : "s"}`,
    requirements,
  };
}

export function filterItemsByBrowse(items: CraftingItem[], filters: BrowseFilterState) {
  const query = filters.search.trim().toLowerCase();
  return items.filter((item) => {
    const matchesQuery =
      !query ||
      [
        item.name,
        item.category,
        item.subcategory,
        item.blueprintName,
        detailLabel(item),
        ...item.materials,
        ...item.blueprintSources.flatMap((source) => [
          source.missionName,
          source.missionGiver,
          source.missionType,
          source.location,
        ]),
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    const matchesCategory = filters.category === "All" || item.category === filters.category;
    const matchesArmorClass = filters.armorClass === "All" || getArmorClass(item) === filters.armorClass;
    const matchesArmorSlot = filters.armorSlot === "All" || getArmorSlot(item) === filters.armorSlot;
    const matchesWeaponClass = filters.weaponClass === "All" || item.weaponClass === filters.weaponClass;
    return matchesQuery && matchesCategory && matchesArmorClass && matchesArmorSlot && matchesWeaponClass;
  });
}

export function filterItemsByScope(
  items: CraftingItem[],
  filters: ScopedFilterState,
  craftabilityByItem: Record<string, CraftabilitySummary>,
  isOwned: (itemId: string) => boolean,
) {
  return items.filter((item) => {
    const summary = craftabilityByItem[item.id];
    const owned = isOwned(item.id);
    const matchesCraftability =
      filters.activeTab === "crafting"
        ? filters.craftabilityFilter === "all" ||
          (filters.craftabilityFilter === "craftable" && summary.craftable) ||
          (filters.craftabilityFilter === "missing" && !summary.craftable)
        : true;
    const matchesOwnership =
      filters.activeTab === "crafting" || filters.activeTab === "blueprints"
        ? filters.blueprintOwnershipFilter === "all" ||
          (filters.blueprintOwnershipFilter === "owned" && owned) ||
          (filters.blueprintOwnershipFilter === "missing" && !owned)
        : true;
    return matchesCraftability && matchesOwnership;
  });
}

export function sortItems(items: CraftingItem[], sortBy: SortKey, summaries: Record<string, CraftabilitySummary>) {
  const copy = [...items];
  copy.sort((left, right) => {
    if (sortBy === "category") return left.category.localeCompare(right.category) || left.name.localeCompare(right.name);
    if (sortBy === "category-desc") return right.category.localeCompare(left.category) || left.name.localeCompare(right.name);
    if (sortBy === "detail") return detailLabel(left).localeCompare(detailLabel(right)) || left.name.localeCompare(right.name);
    if (sortBy === "detail-desc") return detailLabel(right).localeCompare(detailLabel(left)) || left.name.localeCompare(right.name);
    if (sortBy === "materials") return left.materials.join(", ").localeCompare(right.materials.join(", ")) || left.name.localeCompare(right.name);
    if (sortBy === "materials-desc") return right.materials.join(", ").localeCompare(left.materials.join(", ")) || left.name.localeCompare(right.name);
    if (sortBy === "need") return summaries[left.id].missingCount - summaries[right.id].missingCount || left.name.localeCompare(right.name);
    if (sortBy === "need-desc") return summaries[right.id].missingCount - summaries[left.id].missingCount || left.name.localeCompare(right.name);
    if (sortBy === "missions") return left.blueprintSources.length - right.blueprintSources.length || left.name.localeCompare(right.name);
    if (sortBy === "missions-desc") return right.blueprintSources.length - left.blueprintSources.length || left.name.localeCompare(right.name);
    if (sortBy === "name-desc") return right.name.localeCompare(left.name);
    if (sortBy === "time-asc") return left.craftTimeSeconds - right.craftTimeSeconds || left.name.localeCompare(right.name);
    if (sortBy === "time-desc") return right.craftTimeSeconds - left.craftTimeSeconds || left.name.localeCompare(right.name);
    if (sortBy === "craftable") {
      const leftSummary = summaries[left.id];
      const rightSummary = summaries[right.id];
      if (leftSummary.craftable !== rightSummary.craftable) return leftSummary.craftable ? -1 : 1;
      if (leftSummary.missingCount !== rightSummary.missingCount) return leftSummary.missingCount - rightSummary.missingCount;
      return left.name.localeCompare(right.name);
    }
    return left.name.localeCompare(right.name);
  });
  return copy;
}

function missionContextParts(note?: string) {
  return (note ?? "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function missionLocationFromNote(note?: string) {
  const parts = missionContextParts(note);
  const system = parts.find((part) => part.toLowerCase().startsWith("system:"));
  if (system) {
    return system.replace(/^system:\s*/i, "");
  }

  const region = parts.find((part) => part.toLowerCase().startsWith("region:"));
  if (region) {
    return region.replace(/^region:\s*/i, "");
  }

  return "Unknown";
}

function labelFromSourceType(sourceType: StatProvenance["sourceTypes"][number]) {
  const labels: Record<StatProvenance["sourceTypes"][number], string> = {
    "weapon-fire-action": "Weapon action",
    "weapon-spread-params": "Weapon spread",
    "physics-controller": "Physics controller",
    "ammo-params": "Ammo params",
    "ammo-container": "Ammo container",
    "damage-params": "Damage params",
    "entity-params": "Item params",
    "crafting-property": "Crafting property",
    computed: "Computed",
  };
  return labels[sourceType];
}

export function formatProvenanceSummary(provenance: StatProvenance) {
  const derivation = provenance.derivation === "direct" ? "Direct" : "Composed";
  const valueKind = provenance.valueKind === "actual" ? "actual" : "modifier";
  const sourceLabel = provenance.sourceTypes.map(labelFromSourceType).join(" + ");
  return `${derivation} ${valueKind} · ${sourceLabel}`;
}

export function formatProvenanceTitle(provenance: StatProvenance) {
  const summary = formatProvenanceSummary(provenance);
  if (provenance.sourceRecordPaths.length === 0) return summary;
  return `${summary}\n${provenance.sourceRecordPaths.join("\n")}`;
}
