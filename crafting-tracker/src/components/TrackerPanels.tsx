import type { ReactNode } from "react";
import { ChevronDown, Filter, Layers3, MapPinned, Minus, PackageCheck, Plus, Search } from "lucide-react";
import type { SortKey } from "../lib/craftingUtils";
import {
  editorDisplayUnit,
  formatStorageNote,
  fromEditorValue,
  stepForUnit,
  toEditorValue,
} from "../lib/craftingUtils";
import { FilterChip, FilterGroup, SectionHeader } from "./CraftingSections";

type MaterialInventoryController = {
  get: (materialKey: string) => number;
  set: (materialKey: string, quantity: number) => void;
};

type MaterialInventoryEntry = {
  materialKey: string;
  name: string;
  unit: string;
};

type FilterOption = string;

export function MaterialInventoryPanel(props: {
  inventoryMaterials: MaterialInventoryEntry[];
  materialInventory: MaterialInventoryController;
  onFindMaterial?: (materialName: string) => void;
}) {
  return (
    <details className="panel overflow-hidden">
      <summary className="flex list-none flex-wrap items-start justify-between gap-4 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex-1">
          <SectionHeader
            icon={<PackageCheck className="h-5 w-5 text-accent-green" />}
            title="Material Inventory"
            description="Track what you already have before browsing the recipes below."
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-dark-700 bg-dark-900/70 text-text-dim transition-transform details-chevron">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </summary>

      <div className="border-t border-dark-700 px-5 pb-5 pt-1 sm:px-6 sm:pb-6">
        <div className="mt-5 rounded-2xl border border-dark-700 bg-dark-900/60 px-4 py-3 text-sm text-text-muted">
          <p className="font-medium text-text">Inventory volume note</p>
          <p className="mt-1">
            Fabrication material quantities are shown in cargo volume. The tracker now follows the kiosk pattern and
            shows material inventory amounts in <span className="font-semibold text-text">cSCU</span> so every
            crafting material uses one consistent unit.
          </p>
          <p className="mt-1 text-text-dim">
            1 SCU = 100 cSCU. Inventory values are still normalized internally, but the editor now stays in cSCU for
            fabrication materials.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {props.inventoryMaterials.map((entry) => {
            const owned = props.materialInventory.get(entry.materialKey);
            const displayUnit = editorDisplayUnit(owned, entry.unit);
            const step = stepForUnit(entry.unit, owned);
            const editorValue = toEditorValue(owned, entry.unit);

            return (
              <div key={entry.materialKey} className="panel-muted p-3">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">{entry.name}</p>
                    <p className="mt-1 text-xs text-text-secondary">{formatStorageNote(owned, entry.unit)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {props.onFindMaterial && (
                      <button
                        type="button"
                        onClick={() => props.onFindMaterial?.(entry.name)}
                        className="inline-flex items-center gap-1 rounded-md border border-accent-green/20 bg-accent-green/10 px-2 py-1 text-[11px] text-accent-green transition-colors hover:border-accent-green/35"
                        aria-label={`Find ${entry.name} locations`}
                      >
                        <MapPinned className="h-3.5 w-3.5" />
                        Find
                      </button>
                    )}
                    <button
                      onClick={() => props.materialInventory.set(entry.materialKey, 0)}
                      className="rounded-md border border-dark-700 px-2 py-1 text-[11px] text-text-muted transition-colors hover:text-text"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      props.materialInventory.set(
                        entry.materialKey,
                        fromEditorValue(editorValue - step, entry.unit, displayUnit),
                      )
                    }
                    className="rounded-lg border border-dark-700 bg-dark-900/70 p-2 text-text-dim transition-colors hover:text-text"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    step={step}
                    value={editorValue}
                    onChange={(event) =>
                      props.materialInventory.set(
                        entry.materialKey,
                        fromEditorValue(Number(event.target.value), entry.unit, displayUnit),
                      )
                    }
                    className="min-w-0 flex-1 rounded-lg border border-dark-700 bg-dark-900/70 px-3 py-2 text-sm text-text outline-none"
                    aria-label={`${entry.name} quantity in ${displayUnit}`}
                  />
                  <button
                    onClick={() =>
                      props.materialInventory.set(
                        entry.materialKey,
                        fromEditorValue(editorValue + step, entry.unit, displayUnit),
                      )
                    }
                    className="rounded-lg border border-dark-700 bg-dark-900/70 p-2 text-text-dim transition-colors hover:text-text"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </details>
  );
}

function SearchField(props: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={`panel-muted flex w-full items-center gap-3 px-4 py-3 ${props.className ?? ""}`}>
      <Search className="h-4 w-4 shrink-0 text-text-muted" />
      <input
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder}
        className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
      />
    </label>
  );
}

function SelectField(props: {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="panel-muted flex items-center gap-2 px-3 py-3 text-sm text-text-dim">
      {props.icon}
      <select value={props.value} onChange={(event) => props.onChange(event.target.value)} className="w-full bg-transparent pr-7 outline-none">
        {props.children}
      </select>
    </label>
  );
}

export function TrackerFilterPanel(props: {
  activeTab: "crafting" | "blueprints";
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  armorClass: string;
  onArmorClassChange: (value: string) => void;
  armorSlot: string;
  onArmorSlotChange: (value: string) => void;
  weaponClass: string;
  onWeaponClassChange: (value: string) => void;
  blueprintOwnershipFilter: "all" | "owned" | "missing";
  onBlueprintOwnershipFilterChange: (value: "all" | "owned" | "missing") => void;
  craftabilityFilter: "all" | "craftable" | "missing";
  onCraftabilityFilterChange: (value: "all" | "craftable" | "missing") => void;
  sortBy: SortKey;
  onSortByChange: (value: SortKey) => void;
  showArmourFilters: boolean;
  showWeaponFilters: boolean;
  categoryOptions: FilterOption[];
  armorClassOptions: FilterOption[];
  armorSlotOptions: FilterOption[];
  weaponClassOptions: FilterOption[];
}) {
  return (
    <section className="panel mt-6 p-5 sm:p-6">
      <div className="flex flex-col gap-4">
        <div
          className={`flex flex-col gap-3 ${
            props.activeTab === "crafting" ? "xl:flex-row xl:items-start xl:gap-6" : "xl:flex-row xl:items-start xl:justify-between xl:gap-4"
          }`}
        >
          <div className="min-w-0 w-fit max-w-full xl:flex-none">
            <SectionHeader
              icon={<Filter className={`h-5 w-5 ${props.activeTab === "crafting" ? "text-accent-blue" : "text-accent-amber"}`} />}
              title={props.activeTab === "crafting" ? "Find The Item" : "Find The Blueprint"}
              description={
                props.activeTab === "crafting"
                  ? "Top-level filters first, detailed gear filters second, then material and inventory narrowing."
                  : "List every blueprint, filter by gear family, and mark what you already own."
              }
            />
          </div>

          {props.activeTab === "crafting" ? (
            <div className="flex min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:items-start xl:justify-end">
              <SearchField
                value={props.search}
                onChange={props.onSearchChange}
                placeholder="Search item, type, material or mission"
                className="xl:max-w-[520px] xl:flex-1"
              />

              <div className="flex flex-wrap items-start gap-3 xl:flex-nowrap">
                <div className="flex flex-col gap-1">
                  <FilterChip
                    active={props.blueprintOwnershipFilter === "all"}
                    onClick={() => props.onBlueprintOwnershipFilterChange("all")}
                    className="min-w-[172px] h-[24px] px-4 text-xs text-center whitespace-nowrap"
                  >
                    All blueprints
                  </FilterChip>
                  <FilterChip
                    active={props.blueprintOwnershipFilter === "owned"}
                    onClick={() => props.onBlueprintOwnershipFilterChange("owned")}
                    className="min-w-[172px] h-[24px] px-4 text-xs text-center whitespace-nowrap"
                  >
                    Blueprints owned
                  </FilterChip>
                </div>

                <div className="flex flex-col gap-1">
                  <FilterChip
                    active={props.craftabilityFilter === "all"}
                    onClick={() => props.onCraftabilityFilterChange("all")}
                    className="min-w-[172px] h-[24px] px-4 text-xs text-center whitespace-nowrap"
                  >
                    All materials
                  </FilterChip>
                  <FilterChip
                    active={props.craftabilityFilter === "craftable"}
                    onClick={() => props.onCraftabilityFilterChange("craftable")}
                    className="min-w-[172px] h-[24px] px-4 text-xs text-center whitespace-nowrap"
                  >
                    Materials you own
                  </FilterChip>
                </div>
              </div>
            </div>
          ) : (
            <SearchField
              value={props.search}
              onChange={props.onSearchChange}
              placeholder="Search blueprint, item or mission"
              className="xl:max-w-[560px]"
            />
          )}
        </div>

        {props.activeTab !== "crafting" && (
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(220px,0.95fr)_minmax(220px,0.95fr)]">
            <SelectField
              icon={<PackageCheck className="h-4 w-4 shrink-0 text-text-muted" />}
              value={props.blueprintOwnershipFilter}
              onChange={(value) => props.onBlueprintOwnershipFilterChange(value as "all" | "owned" | "missing")}
            >
              <option value="all" className="bg-dark-900 text-text">All blueprints</option>
              <option value="owned" className="bg-dark-900 text-text">Owned blueprints</option>
              <option value="missing" className="bg-dark-900 text-text">Missing blueprints</option>
            </SelectField>

            <SelectField
              icon={<Layers3 className="h-4 w-4 shrink-0 text-text-muted" />}
              value={props.sortBy}
              onChange={(value) => props.onSortByChange(value as SortKey)}
            >
              <option value="name" className="bg-dark-900 text-text">Sort: Title A-Z</option>
              <option value="name-desc" className="bg-dark-900 text-text">Sort: Title Z-A</option>
              <option value="category" className="bg-dark-900 text-text">Sort: Type A-Z</option>
              <option value="category-desc" className="bg-dark-900 text-text">Sort: Type Z-A</option>
              <option value="detail" className="bg-dark-900 text-text">Sort: Detail A-Z</option>
              <option value="detail-desc" className="bg-dark-900 text-text">Sort: Detail Z-A</option>
              <option value="materials" className="bg-dark-900 text-text">Sort: Materials A-Z</option>
              <option value="materials-desc" className="bg-dark-900 text-text">Sort: Materials Z-A</option>
              <option value="need" className="bg-dark-900 text-text">Sort: Need low-high</option>
              <option value="need-desc" className="bg-dark-900 text-text">Sort: Need high-low</option>
              <option value="missions" className="bg-dark-900 text-text">Sort: Missions low-high</option>
              <option value="missions-desc" className="bg-dark-900 text-text">Sort: Missions high-low</option>
              <option value="craftable" className="bg-dark-900 text-text">Sort: Craftable first</option>
              <option value="time-asc" className="bg-dark-900 text-text">Sort: Fastest craft</option>
              <option value="time-desc" className="bg-dark-900 text-text">Sort: Longest craft</option>
            </SelectField>
          </div>
        )}

        <div className={`mt-1 flex flex-col gap-3 ${props.activeTab === "crafting" ? "xl:flex-row xl:items-start" : ""}`}>
          <FilterGroup label="Type" hint="Applies to everything" className="min-w-0 w-fit max-w-fit xl:flex-none">
            {props.categoryOptions.map((option) => (
              <FilterChip key={option} active={props.category === option} onClick={() => props.onCategoryChange(option)}>
                {option}
              </FilterChip>
            ))}
          </FilterGroup>

          {props.showArmourFilters && (
            <FilterGroup label="Armour" hint="Only for armour recipes" className="min-w-0 flex-1">
              <div className="grid w-full gap-4 xl:grid-cols-[minmax(240px,0.85fr)_minmax(420px,1.15fr)]">
                <div className="flex min-w-0 items-start gap-3">
                  <p className="pt-3 text-[10px] uppercase tracking-[0.16em] text-text-muted">Class</p>
                  <div className="flex flex-wrap gap-2">
                    {props.armorClassOptions.map((option) => (
                      <FilterChip key={`class-${option}`} active={props.armorClass === option} onClick={() => props.onArmorClassChange(option)}>
                        {option}
                      </FilterChip>
                    ))}
                  </div>
                </div>
                <div className="flex min-w-0 items-start gap-3">
                  <p className="pt-3 text-[10px] uppercase tracking-[0.16em] text-text-muted">Slot</p>
                  <div className="flex flex-wrap gap-2">
                    {props.armorSlotOptions.map((option) => (
                      <FilterChip key={`slot-${option}`} active={props.armorSlot === option} onClick={() => props.onArmorSlotChange(option)}>
                        {option}
                      </FilterChip>
                    ))}
                  </div>
                </div>
              </div>
            </FilterGroup>
          )}

          {props.showWeaponFilters && (
            <FilterGroup label="Weapons" hint="Only for weapon recipes" className="min-w-0 flex-1">
              {props.weaponClassOptions.map((option) => (
                <FilterChip key={option} active={props.weaponClass === option} onClick={() => props.onWeaponClassChange(option)}>
                  {option}
                </FilterChip>
              ))}
            </FilterGroup>
          )}
        </div>
      </div>
    </section>
  );
}
