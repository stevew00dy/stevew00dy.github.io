import type { RefObject } from "react";
import { ChevronDown, MapPinned, PackageSearch, X } from "lucide-react";
import type { CraftingItem } from "../data";
import type { CraftabilitySummary, InputQualitiesState, SetInputQualities, SortKey } from "../lib/craftingUtils";
import { detailLabel } from "../lib/craftingUtils";
import {
  BlueprintExpandedRow,
  CraftingExpandedRow,
  MaterialShortageIndicator,
  MissionPoolDropdown,
  SectionHeader,
  TableSortHeader,
} from "./CraftingSections";

type MaterialInventoryReader = {
  get: (materialKey: string) => number;
};

function isColumnSortActive(sortBy: SortKey, ascendingKey: SortKey, descendingKey: SortKey) {
  return sortBy === ascendingKey || sortBy === descendingKey;
}

function isColumnSortDescending(sortBy: SortKey, descendingKey: SortKey) {
  return sortBy === descendingKey;
}

export function CraftingRecipeTable(props: {
  items: CraftingItem[];
  expandedCraftingId: string;
  onExpandedChange: (itemId: string) => void;
  craftabilityByItem: Record<string, CraftabilitySummary>;
  inputQualities: InputQualitiesState;
  setInputQualities: SetInputQualities;
  materialInventory: MaterialInventoryReader;
  qualityBaseline: number;
  sortBy: SortKey;
  onToggleColumnSort: (ascendingKey: SortKey, descendingKey: SortKey) => void;
  recipeLoadMoreRef: RefObject<HTMLDivElement | null>;
  renderedCount: number;
  totalCount: number;
  onFindMaterial?: (materialName: string) => void;
}) {
  return (
    <section className="panel mt-6 overflow-hidden p-0">
      <div className="border-b border-dark-700 px-5 py-4">
        <SectionHeader
          icon={<PackageSearch className="h-5 w-5 text-accent-blue" />}
          title="Recipe Table"
          description="Select a row to open the full recipe breakdown directly underneath it."
        />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1120px]">
          <div className="grid grid-cols-[2.1fr_0.85fr_0.95fr_1.35fr_0.55fr_0.75fr_0.7fr] gap-4 border-b border-dark-700 bg-dark-900/60 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-text-muted">
            <TableSortHeader
              label="Item"
              active={isColumnSortActive(props.sortBy, "name", "name-desc")}
              descending={isColumnSortDescending(props.sortBy, "name-desc")}
              onClick={() => props.onToggleColumnSort("name", "name-desc")}
            />
            <TableSortHeader
              label="Type"
              active={isColumnSortActive(props.sortBy, "category", "category-desc")}
              descending={isColumnSortDescending(props.sortBy, "category-desc")}
              onClick={() => props.onToggleColumnSort("category", "category-desc")}
            />
            <TableSortHeader
              label="Detail"
              active={isColumnSortActive(props.sortBy, "detail", "detail-desc")}
              descending={isColumnSortDescending(props.sortBy, "detail-desc")}
              onClick={() => props.onToggleColumnSort("detail", "detail-desc")}
            />
            <TableSortHeader
              label="Materials"
              active={isColumnSortActive(props.sortBy, "materials", "materials-desc")}
              descending={isColumnSortDescending(props.sortBy, "materials-desc")}
              onClick={() => props.onToggleColumnSort("materials", "materials-desc")}
            />
            <TableSortHeader
              label="Need"
              active={isColumnSortActive(props.sortBy, "need", "need-desc")}
              descending={isColumnSortDescending(props.sortBy, "need-desc")}
              align="center"
              onClick={() => props.onToggleColumnSort("need", "need-desc")}
            />
            <TableSortHeader
              label="Time"
              active={isColumnSortActive(props.sortBy, "time-asc", "time-desc")}
              descending={isColumnSortDescending(props.sortBy, "time-desc")}
              align="right"
              onClick={() => props.onToggleColumnSort("time-asc", "time-desc")}
            />
            <TableSortHeader
              label="Missions"
              active={isColumnSortActive(props.sortBy, "missions", "missions-desc")}
              descending={isColumnSortDescending(props.sortBy, "missions-desc")}
              align="right"
              onClick={() => props.onToggleColumnSort("missions", "missions-desc")}
            />
          </div>

          <div>
            {props.items.map((item) => {
              const isSelected = item.id === props.expandedCraftingId;
              const summary = props.craftabilityByItem[item.id];
              return (
                <div key={item.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (props.expandedCraftingId === item.id) {
                        props.onExpandedChange("");
                        return;
                      }
                      props.onExpandedChange(item.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        if (props.expandedCraftingId === item.id) {
                          props.onExpandedChange("");
                          return;
                        }
                        props.onExpandedChange(item.id);
                      }
                    }}
                    className={`grid cursor-pointer grid-cols-[2.1fr_0.85fr_0.95fr_1.35fr_0.55fr_0.75fr_0.7fr] gap-4 border-b border-dark-700/70 px-5 py-3 text-left transition-colors ${
                      isSelected ? "bg-accent-blue/12" : "hover:bg-dark-900/45"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <ChevronDown className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${isSelected ? "rotate-180" : "-rotate-90"}`} />
                        <p className={`truncate text-sm font-semibold ${isSelected ? "text-text" : "text-text-secondary"}`}>{item.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-text-dim">{item.category}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-text-dim">{detailLabel(item)}</span>
                    </div>
                    <div className="flex items-center min-w-0">
                      <span className="truncate text-sm text-text-muted">{item.materials.join(", ")}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <MaterialShortageIndicator summary={summary} />
                    </div>
                    <div className="flex items-center justify-end">
                      <span className={`font-mono text-xs ${isSelected ? "text-accent-blue" : "text-text-dim"}`}>{item.craftTime}</span>
                    </div>
                    <div className="flex items-center justify-end">
                      <span
                        className={`inline-flex min-w-9 items-center justify-center rounded-lg border px-2.5 py-1 text-[11px] font-mono ${
                          isSelected
                            ? "border-accent-blue/30 bg-accent-blue/12 text-accent-blue"
                            : "border-dark-700 bg-dark-900/70 text-text-dim"
                        }`}
                      >
                        {item.blueprintSources.length}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="crafting-expanded-row px-5 py-5">
                      <CraftingExpandedRow
                        item={item}
                        inputQualities={props.inputQualities}
                        setInputQualities={props.setInputQualities}
                        materialInventory={props.materialInventory}
                        craftability={props.craftabilityByItem[item.id]}
                        qualityBaseline={props.qualityBaseline}
                        onFindMaterial={props.onFindMaterial}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {props.totalCount === 0 && (
              <div className="p-8 text-center">
                <X className="mx-auto mb-3 h-5 w-5 text-text-muted" />
                <p className="font-medium text-text">No items match this filter.</p>
              </div>
            )}

            {props.totalCount > 0 && (
              <div ref={props.recipeLoadMoreRef} className="border-t border-dark-700/70 px-5 py-4 text-center text-xs text-text-muted">
                {props.renderedCount < props.totalCount
                  ? `Loading more recipes as you scroll • ${props.renderedCount} of ${props.totalCount}`
                  : `Showing all ${props.totalCount} recipes`}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BlueprintTable(props: {
  items: CraftingItem[];
  expandedBlueprintId: string;
  onExpandedChange: (itemId: string) => void;
  isOwned: (itemId: string) => boolean;
  onToggleOwned: (itemId: string) => void;
}) {
  return (
    <section className="panel overflow-hidden p-0">
      <div className="border-b border-dark-700 px-5 py-4">
        <SectionHeader
          icon={<MapPinned className="h-5 w-5 text-accent-amber" />}
          title="Blueprint Table"
          description="Select a blueprint row to open mission, location, and linked recipe details underneath."
        />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[940px]">
          <div className="grid grid-cols-[0.8fr_2.8fr_1fr_0.9fr_0.7fr] gap-4 border-b border-dark-700 bg-dark-900/60 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-text-muted">
            <span>Owned</span>
            <span>Blueprint</span>
            <span>Type</span>
            <span>Detail</span>
            <span className="text-right">Missions</span>
          </div>

          <div className="max-h-[760px] overflow-y-auto">
            {props.items.map((item) => {
              const isSelected = item.id === props.expandedBlueprintId;
              const owned = props.isOwned(item.id);
              return (
                <div key={item.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isSelected}
                    onClick={() => {
                      if (props.expandedBlueprintId === item.id) {
                        props.onExpandedChange("");
                        return;
                      }
                      props.onExpandedChange(item.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        if (props.expandedBlueprintId === item.id) {
                          props.onExpandedChange("");
                          return;
                        }
                        props.onExpandedChange(item.id);
                      }
                    }}
                    className={`grid cursor-pointer grid-cols-[0.8fr_2.8fr_1fr_0.9fr_0.7fr] gap-4 border-b border-dark-700/70 px-5 py-3 text-left transition-colors ${
                      isSelected ? "bg-accent-amber/10" : "hover:bg-dark-900/45"
                    }`}
                  >
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          props.onToggleOwned(item.id);
                        }}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          owned
                            ? "border-accent-green/30 bg-accent-green/12 text-accent-green"
                            : "border-accent-red/30 bg-accent-red/12 text-accent-red hover:border-accent-red/45"
                        }`}
                      >
                        {owned ? "Owned" : "Missing"}
                      </button>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-text-muted transition-transform ${
                            isSelected ? "rotate-180" : "-rotate-90"
                          }`}
                        />
                        <p className={`truncate text-sm font-semibold ${isSelected ? "text-text" : "text-text-secondary"}`}>{item.blueprintName}</p>
                      </div>
                      <p className="mt-1 truncate pl-6 text-xs text-text-muted">{item.blueprintNote}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-text-dim">{item.category}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-text-dim">{detailLabel(item)}</span>
                    </div>
                    <div className="flex items-center justify-end">
                      <MissionPoolDropdown item={item} />
                    </div>
                  </div>

                  {isSelected && (
                    <div className="blueprint-expanded-row px-5 py-5">
                      <BlueprintExpandedRow item={item} isOwned={owned} onToggleOwned={() => props.onToggleOwned(item.id)} />
                    </div>
                  )}
                </div>
              );
            })}

            {props.items.length === 0 && (
              <div className="p-8 text-center">
                <X className="mx-auto mb-3 h-5 w-5 text-text-muted" />
                <p className="font-medium text-text">No items match this filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
