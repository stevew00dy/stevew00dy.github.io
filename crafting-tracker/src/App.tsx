import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Filter, Hammer, PackageCheck, Search } from "lucide-react";
import { AppNavDropdown, NavExportAllButton, NavExportButton, NavImportButton, NavResetButton } from "../../shared/AppNavDropdown";
import { exportAllToolsData } from "../../shared/exportAllTools";
import { FOOTER_LINKS } from "../../shared/nav-footer-links";
import { TrackerHeader } from "../../shared/TrackerHeader";
import { CRAFTING_DATA, type CraftingItem } from "./data";
import { BlueprintOverviewPanel, FilterChip, SectionHeader } from "./components/CraftingSections";
import { MaterialInventoryPanel, TrackerFilterPanel } from "./components/TrackerPanels";
import { BlueprintTable, CraftingRecipeTable } from "./components/TrackerTables";
import { useMaterialInventory } from "./hooks/useMaterialInventory";
import { useOwnedBlueprints } from "./hooks/useOwnedBlueprints";
import {
  ALLOWED_ARMOR_CLASSES,
  ALLOWED_ARMOR_SLOTS,
  createInitialQualities,
  filterItemsByBrowse,
  filterItemsByScope,
  getCraftabilitySummary,
  sortItems,
  type CraftabilitySummary,
  type SortKey,
} from "./lib/craftingUtils";
import { exportCraftingTrackerState, parseCraftingTrackerImport } from "./lib/localState";

type AppTab = "blueprints" | "crafting";
type CraftabilityFilter = "all" | "craftable" | "missing";
type BlueprintOwnershipFilter = "all" | "owned" | "missing";

const PATCH = CRAFTING_DATA.manifest.gameVersion;
const ITEMS: CraftingItem[] = CRAFTING_DATA.items;
const QUALITY_BASELINE = CRAFTING_DATA.manifest.qualityBaseline;
const RECIPE_TABLE_BATCH_SIZE = 120;
const ACTIVE_TAB_STORAGE_KEY = "crafting-tracker-active-tab";
const CATEGORY_OPTIONS = ["All", ...new Set(ITEMS.map((item) => item.category))];
const ARMOR_CLASS_OPTIONS = ["All", ...ALLOWED_ARMOR_CLASSES];
const ARMOR_SLOT_OPTIONS = ["All", ...ALLOWED_ARMOR_SLOTS];
const WEAPON_CLASS_OPTIONS = ["All", ...new Set(ITEMS.map((item) => item.weaponClass).filter(Boolean) as string[])];

function loadActiveTab(): AppTab {
  try {
    const stored = localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
    return stored === "blueprints" ? "blueprints" : "crafting";
  } catch {
    return "crafting";
  }
}

function persistActiveTab(tab: AppTab) {
  try {
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, tab);
  } catch {
    // Ignore storage failures and keep the in-memory tab state.
  }
}

export default function App() {
  const materialInventory = useMaterialInventory(PATCH);
  const ownedBlueprints = useOwnedBlueprints();
  const [activeTab, setActiveTab] = useState<AppTab>(loadActiveTab);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [armorClass, setArmorClass] = useState("All");
  const [armorSlot, setArmorSlot] = useState("All");
  const [weaponClass, setWeaponClass] = useState("All");
  const [craftabilityFilter, setCraftabilityFilter] = useState<CraftabilityFilter>("all");
  const [blueprintOwnershipFilter, setBlueprintOwnershipFilter] = useState<BlueprintOwnershipFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [expandedCraftingId, setExpandedCraftingId] = useState("");
  const [expandedBlueprintId, setExpandedBlueprintId] = useState("");
  const [renderedRecipeCount, setRenderedRecipeCount] = useState(RECIPE_TABLE_BATCH_SIZE);
  const [navOpen, setNavOpen] = useState(false);
  const [inputQualities, setInputQualities] = useState<Record<string, number>>(() =>
    createInitialQualities(ITEMS, QUALITY_BASELINE),
  );
  const navRef = useRef<HTMLDivElement>(null);
  const recipeLoadMoreRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    if (!navOpen) return;

    function handleClick(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setNavOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [navOpen]);

  useEffect(() => {
    persistActiveTab(activeTab);
  }, [activeTab]);

  const craftabilityByItem = useMemo(
    () =>
      Object.fromEntries(ITEMS.map((item) => [item.id, getCraftabilitySummary(item, materialInventory.inventory)])) as Record<
        string,
        CraftabilitySummary
      >,
    [materialInventory.inventory],
  );

  const baseScopedItems = useMemo(
    () =>
      filterItemsByBrowse(ITEMS, {
        search,
        category,
        armorClass,
        armorSlot,
        weaponClass,
      }),
    [armorClass, armorSlot, category, search, weaponClass],
  );

  const filteredItems = useMemo(
    () =>
      filterItemsByScope(
        baseScopedItems,
        {
          activeTab,
          craftabilityFilter,
          blueprintOwnershipFilter,
        },
        craftabilityByItem,
        ownedBlueprints.isOwned,
      ),
    [activeTab, baseScopedItems, blueprintOwnershipFilter, craftabilityByItem, craftabilityFilter, ownedBlueprints],
  );

  const visibleItems = useMemo(() => sortItems(filteredItems, sortBy, craftabilityByItem), [craftabilityByItem, filteredItems, sortBy]);
  const renderedCraftingItems = useMemo(
    () => (activeTab === "crafting" ? visibleItems.slice(0, renderedRecipeCount) : visibleItems),
    [activeTab, renderedRecipeCount, visibleItems],
  );

  useEffect(() => {
    setRenderedRecipeCount(RECIPE_TABLE_BATCH_SIZE);
  }, [search, category, armorClass, armorSlot, weaponClass, craftabilityFilter, blueprintOwnershipFilter, sortBy]);

  useEffect(() => {
    if (category !== "Armour") {
      setArmorClass("All");
      setArmorSlot("All");
    }
    if (category !== "Weapons") {
      setWeaponClass("All");
    }
  }, [category]);

  useEffect(() => {
    if (activeTab !== "blueprints") return;
    if (sortBy === "name" || sortBy === "name-desc" || sortBy === "time-asc" || sortBy === "time-desc") return;
    setSortBy("name");
  }, [activeTab, sortBy]);

  useEffect(() => {
    if (activeTab !== "crafting") return;
    if (!visibleItems.some((item) => item.id === expandedCraftingId)) {
      setExpandedCraftingId("");
    }
  }, [activeTab, expandedCraftingId, visibleItems]);

  useEffect(() => {
    if (activeTab !== "blueprints") return;
    if (!visibleItems.some((item) => item.id === expandedBlueprintId)) {
      setExpandedBlueprintId("");
    }
  }, [activeTab, expandedBlueprintId, visibleItems]);

  useEffect(() => {
    if (activeTab !== "crafting") return;
    if (renderedRecipeCount >= visibleItems.length) return;
    const target = recipeLoadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setRenderedRecipeCount((current) => Math.min(current + RECIPE_TABLE_BATCH_SIZE, visibleItems.length));
      },
      { rootMargin: "360px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [activeTab, renderedRecipeCount, visibleItems.length]);

  const allMaterials = useMemo(() => {
    const materialMap = new Map<string, { materialKey: string; name: string; unit: string }>();
    for (const item of ITEMS) {
      for (const input of item.inputs) {
        if (!materialMap.has(input.materialKey)) {
          materialMap.set(input.materialKey, { materialKey: input.materialKey, name: input.requirement, unit: input.unit });
        }
      }
    }
    return [...materialMap.values()].sort((left, right) => left.name.localeCompare(right.name));
  }, []);

  const scopedMaterials = useMemo(() => {
    const materialMap = new Map<string, { materialKey: string; name: string; unit: string }>();
    for (const item of baseScopedItems) {
      for (const input of item.inputs) {
        if (!materialMap.has(input.materialKey)) {
          materialMap.set(input.materialKey, { materialKey: input.materialKey, name: input.requirement, unit: input.unit });
        }
      }
    }
    return [...materialMap.values()].sort((left, right) => left.name.localeCompare(right.name));
  }, [baseScopedItems]);

  const inventoryMaterials = scopedMaterials.length > 0 ? scopedMaterials : allMaterials;
  const craftableCount = ITEMS.filter((item) => craftabilityByItem[item.id].craftable).length;
  const ownedBlueprintCount = ITEMS.filter((item) => ownedBlueprints.isOwned(item.id)).length;
  const missingBlueprintCount = ITEMS.length - ownedBlueprintCount;
  const linkedBlueprintCount = ITEMS.filter((item) => item.blueprintSources.length > 0).length;
  const showArmourFilters = activeTab === "crafting" && category === "Armour";
  const showWeaponFilters = activeTab === "crafting" && category === "Weapons";

  function toggleColumnSort(ascendingKey: SortKey, descendingKey: SortKey) {
    setSortBy((current) => (current === ascendingKey ? descendingKey : ascendingKey));
  }

  function handleTabChange(nextTab: AppTab) {
    persistActiveTab(nextTab);
    setActiveTab(nextTab);
  }

  function exportLocalProgress() {
    exportCraftingTrackerState({
      gameVersion: PATCH,
      ownedBlueprints: ownedBlueprints.owned,
      materialInventory: materialInventory.inventory,
    });
  }

  async function importLocalProgress(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseCraftingTrackerImport(text, PATCH);
      ownedBlueprints.replaceAll(parsed.ownedBlueprints);
      if (parsed.appliesInventoryToCurrentPatch) {
        materialInventory.replaceAll(parsed.materialInventory);
        window.alert(`Imported blueprint ownership and material inventory for patch ${PATCH}.`);
      } else {
        window.alert(
          `Imported blueprint ownership from patch ${parsed.sourceGameVersion}. Material inventory was not applied because the current patch is ${PATCH}.`,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to import Crafting Tracker data.";
      window.alert(message);
    } finally {
      event.target.value = "";
    }
  }

  function resetLocalProgress() {
    materialInventory.resetAll();
    ownedBlueprints.resetAll();
    setConfirmingReset(false);
  }

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:h-auto focus:w-auto focus:m-0 focus:overflow-visible focus:rounded-lg focus:bg-accent-amber focus:px-4 focus:py-2 focus:font-medium focus:text-dark-950 focus:clip-auto"
      >
        Skip to main content
      </a>

      <TrackerHeader
        title="Crafting Tracker"
        subtitle={`Star Citizen ${PATCH}`}
        icon={<Hammer className="h-5 w-5 text-accent-blue" />}
        metrics={[
          {
            key: "recipes",
            dotClassName: "bg-accent-blue",
            content: (
              <>
                <span className="font-mono font-semibold text-accent-blue">{ITEMS.length}</span> recipes
              </>
            ),
          },
          {
            key: "craftable",
            dotClassName: "bg-accent-green",
            content: (
              <>
                <span className="font-mono font-semibold text-accent-green">{craftableCount}</span> craftable now
              </>
            ),
          },
          {
            key: "patch",
            dotClassName: "bg-accent-amber",
            hiddenClassName: "hidden sm:flex",
            content: (
              <>
                Patch <span className="font-mono font-semibold text-accent-amber">{PATCH}</span>
              </>
            ),
          },
        ]}
        navOpen={navOpen}
        navRef={navRef}
        onToggleNav={() => setNavOpen((open) => !open)}
        menuContent={
          <AppNavDropdown
            activePath="/crafting-tracker/"
            onClose={() => setNavOpen(false)}
            progressSection={
              <>
                <NavExportButton
                  onClick={() => {
                    exportLocalProgress();
                    setNavOpen(false);
                  }}
                />
                <NavImportButton
                  onClick={() => importInputRef.current?.click()}
                  inputRef={importInputRef}
                  onFileChange={(event) => {
                    void importLocalProgress(event);
                    setNavOpen(false);
                  }}
                />
                <NavResetButton
                  confirming={confirmingReset}
                  onResetClick={() => setConfirmingReset(true)}
                  onConfirmReset={() => {
                    resetLocalProgress();
                    setNavOpen(false);
                  }}
                  onCancel={() => setConfirmingReset(false)}
                />
                <NavExportAllButton
                  onClick={() => {
                    exportAllToolsData();
                    setNavOpen(false);
                  }}
                />
              </>
            }
          />
        }
      />

      <nav className="border-b border-dark-700 bg-dark-900/70">
        <div className="mx-auto flex max-w-[1600px] gap-1 overflow-x-auto px-4">
          {[
            { id: "crafting" as const, label: "Crafting", activeClass: "border-accent-blue text-accent-blue" },
            { id: "blueprints" as const, label: "Blueprint Tracker", activeClass: "border-accent-amber text-accent-amber" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`min-h-[44px] whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? tab.activeClass : "border-transparent text-text-dim hover:border-dark-600 hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main id="main" className="mx-auto max-w-[1600px] px-4 py-5">
        {activeTab === "crafting" ? (
          <>
            <MaterialInventoryPanel inventoryMaterials={inventoryMaterials} materialInventory={materialInventory} />

            <TrackerFilterPanel
              activeTab="crafting"
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              armorClass={armorClass}
              onArmorClassChange={setArmorClass}
              armorSlot={armorSlot}
              onArmorSlotChange={setArmorSlot}
              weaponClass={weaponClass}
              onWeaponClassChange={setWeaponClass}
              blueprintOwnershipFilter={blueprintOwnershipFilter}
              onBlueprintOwnershipFilterChange={setBlueprintOwnershipFilter}
              craftabilityFilter={craftabilityFilter}
              onCraftabilityFilterChange={setCraftabilityFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              showArmourFilters={showArmourFilters}
              showWeaponFilters={showWeaponFilters}
              categoryOptions={CATEGORY_OPTIONS}
              armorClassOptions={ARMOR_CLASS_OPTIONS}
              armorSlotOptions={ARMOR_SLOT_OPTIONS}
              weaponClassOptions={WEAPON_CLASS_OPTIONS}
            />

            <CraftingRecipeTable
              items={renderedCraftingItems}
              expandedCraftingId={expandedCraftingId}
              onExpandedChange={setExpandedCraftingId}
              craftabilityByItem={craftabilityByItem}
              inputQualities={inputQualities}
              setInputQualities={setInputQualities}
              materialInventory={materialInventory}
              qualityBaseline={QUALITY_BASELINE}
              sortBy={sortBy}
              onToggleColumnSort={toggleColumnSort}
              recipeLoadMoreRef={recipeLoadMoreRef}
              renderedCount={renderedCraftingItems.length}
              totalCount={visibleItems.length}
            />
          </>
        ) : (
          <>
            <BlueprintOverviewPanel
              totalCount={ITEMS.length}
              ownedCount={ownedBlueprintCount}
              missingCount={missingBlueprintCount}
              linkedCount={linkedBlueprintCount}
            />

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,0.34fr)_minmax(0,1fr)]">
              <aside className="panel self-start p-5 sm:p-6">
                <SectionHeader
                  icon={<Filter className="h-5 w-5 text-accent-amber" />}
                  title="Find The Blueprint"
                  description="Filter the full blueprint list by ownership and gear family."
                />

                <div className="mt-5 space-y-4">
                  <label className="panel-muted flex items-center gap-3 px-4 py-3">
                    <Search className="h-4 w-4 shrink-0 text-text-muted" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search blueprint, item or mission"
                      className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
                    />
                  </label>

                  <label className="panel-muted flex items-center gap-2 px-3 py-3 text-sm text-text-dim">
                    <PackageCheck className="h-4 w-4 shrink-0 text-text-muted" />
                    <select
                      value={blueprintOwnershipFilter}
                      onChange={(event) => setBlueprintOwnershipFilter(event.target.value as BlueprintOwnershipFilter)}
                      className="w-full bg-transparent pr-7 outline-none"
                    >
                      <option value="all" className="bg-dark-900 text-text">All blueprints</option>
                      <option value="owned" className="bg-dark-900 text-text">Owned blueprints</option>
                      <option value="missing" className="bg-dark-900 text-text">Missing blueprints</option>
                    </select>
                  </label>

                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-text-muted">Top level</p>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_OPTIONS.map((option) => (
                        <FilterChip key={option} active={category === option} onClick={() => setCategory(option)} tone="amber">
                          {option}
                        </FilterChip>
                      ))}
                    </div>
                  </div>

                  {(category === "All" || category === "Armour") && (
                    <>
                      <div>
                        <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-text-muted">Armour class</p>
                        <div className="flex flex-wrap gap-2">
                          {ARMOR_CLASS_OPTIONS.map((option) => (
                            <FilterChip key={option} active={armorClass === option} onClick={() => setArmorClass(option)} tone="amber">
                              {option}
                            </FilterChip>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-text-muted">Armour slot</p>
                        <div className="flex flex-wrap gap-2">
                          {ARMOR_SLOT_OPTIONS.map((option) => (
                            <FilterChip key={option} active={armorSlot === option} onClick={() => setArmorSlot(option)} tone="amber">
                              {option}
                            </FilterChip>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {(category === "All" || category === "Weapons") && (
                    <div>
                      <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-text-muted">Weapon class</p>
                      <div className="flex flex-wrap gap-2">
                        {WEAPON_CLASS_OPTIONS.map((option) => (
                          <FilterChip key={option} active={weaponClass === option} onClick={() => setWeaponClass(option)} tone="amber">
                            {option}
                          </FilterChip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              <BlueprintTable
                items={visibleItems}
                expandedBlueprintId={expandedBlueprintId}
                onExpandedChange={setExpandedBlueprintId}
                isOwned={ownedBlueprints.isOwned}
                onToggleOwned={ownedBlueprints.toggle}
              />
            </div>
          </>
        )}
      </main>

      <footer className="mt-12 border-t border-dark-700 py-6">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-3 px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {FOOTER_LINKS.map(({ href, label, external }) => (
              <a
                key={href}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`text-xs transition-colors ${
                  href === "/crafting-tracker/" ? "font-medium text-accent-amber" : "text-text-muted hover:text-accent-amber"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
