import { describe, expect, it } from "vitest";
import type { CraftingItem, OutputStat, QualityEffect, RecipeInput } from "../data";
import {
  filterItemsByBrowse,
  filterItemsByScope,
  getCraftabilitySummary,
  outputStatRows,
  sliderKey,
  sortItems,
  type CraftabilitySummary,
} from "./craftingUtils";

function makeOutputStat(overrides: Partial<OutputStat> = {}): OutputStat {
  return {
    stat: "Damage / Shot",
    baseValue: 42.5,
    unit: "",
    precision: 1,
    valueKind: "actual",
    effectStats: ["Damage"],
    higherIsBetter: true,
    provenance: {
      sourceTypes: ["ammo-params"],
      sourceRecordPaths: ["Libs/Foundry/Records/test.xml"],
      valueKind: "actual",
      derivation: "direct",
    },
    ...overrides,
  };
}

function makeEffect(overrides: Partial<QualityEffect> = {}): QualityEffect {
  return {
    stat: "Damage",
    startMultiplier: 0.8,
    baselineMultiplier: 1,
    endMultiplier: 1.2,
    positive: true,
    affectedBy: "Barrel",
    unit: "",
    precision: 1,
    sourceRecordPaths: ["Libs/Foundry/Records/crafting-property.xml"],
    ...overrides,
  };
}

function makeInput(overrides: Partial<RecipeInput> = {}): RecipeInput {
  return {
    slot: "Barrel",
    type: "Raw",
    materialKey: "iron",
    quantity: "3 cSCU",
    amount: 0.03,
    unit: "SCU",
    requirement: "Iron",
    acquisition: "",
    minQuality: 0,
    effects: ["Damage"],
    ...overrides,
  };
}

function makeItem(overrides: Partial<CraftingItem> = {}): CraftingItem {
  const name = overrides.name ?? "A03 Canuto";
  return {
    id: overrides.id ?? name.toLowerCase().replace(/\s+/g, "-"),
    name,
    manufacturer: overrides.manufacturer ?? "Gemini",
    category: overrides.category ?? "Weapons",
    subcategory: overrides.subcategory ?? "Sniper",
    armorClass: overrides.armorClass,
    armorSlot: overrides.armorSlot,
    weaponClass: overrides.weaponClass ?? "Sniper",
    blueprintName: overrides.blueprintName ?? `${name} Blueprint`,
    blueprintStatus: overrides.blueprintStatus ?? "mapped",
    blueprintSource: overrides.blueprintSource ?? "Destroy Headhunter Stolen Data",
    blueprintSources:
      overrides.blueprintSources ??
      [
        {
          kind: "mission",
          missionName: "Destroy Headhunter Stolen Data",
          missionGiver: "Citizens for Prosperity",
          missionType: "Mercenary",
          location: "Pyro / Region C",
        },
      ],
    blueprintNote: overrides.blueprintNote ?? "",
    craftTime: overrides.craftTime ?? "3m",
    craftTimeSeconds: overrides.craftTimeSeconds ?? 180,
    inputs: overrides.inputs ?? [makeInput()],
    materials: overrides.materials ?? ["Iron"],
    qualityEffects: overrides.qualityEffects ?? [makeEffect()],
    outputStats: overrides.outputStats ?? [makeOutputStat({})],
  };
}

describe("craftingUtils filtering", () => {
  const weapon = makeItem({
    id: "weapon",
    name: 'A03 "Canuto" Sniper Rifle',
    category: "Weapons",
    subcategory: "Sniper",
    weaponClass: "Sniper",
    materials: ["Iron", "Taranite"],
  });
  const armour = makeItem({
    id: "armour",
    name: "A23 Helmet Woodland",
    category: "Armour",
    subcategory: "Helmet",
    armorClass: "Light",
    armorSlot: "Helmet",
    weaponClass: undefined,
    materials: ["Silicon"],
    outputStats: [makeOutputStat({ stat: "Damage Mitigation", baseValue: 0.2, effectStats: ["Damage Mitigation"] })],
    qualityEffects: [makeEffect({ stat: "Damage Mitigation", affectedBy: "Liner" })],
    inputs: [makeInput({ slot: "Liner", materialKey: "silicon", requirement: "Silicon" })],
  });

  it("filters by search, category, and specialist fields", () => {
    const filtered = filterItemsByBrowse([weapon, armour], {
      search: "helmet",
      category: "Armour",
      armorClass: "Light",
      armorSlot: "Helmet",
      weaponClass: "All",
    });

    expect(filtered.map((item) => item.id)).toEqual(["armour"]);
  });

  it("filters by mission/location text as part of search", () => {
    const filtered = filterItemsByBrowse([weapon, armour], {
      search: "pyro",
      category: "All",
      armorClass: "All",
      armorSlot: "All",
      weaponClass: "All",
    });

    expect(filtered).toHaveLength(2);
  });

  it("filters crafting scope by craftability and blueprint ownership", () => {
    const summaries: Record<string, CraftabilitySummary> = {
      weapon: getCraftabilitySummary(weapon, { iron: 0.03 }),
      armour: getCraftabilitySummary(armour, {}),
    };

    const crafting = filterItemsByScope(
      [weapon, armour],
      {
        activeTab: "crafting",
        craftabilityFilter: "craftable",
        blueprintOwnershipFilter: "all",
      },
      summaries,
      () => false,
    );

    expect(crafting.map((item) => item.id)).toEqual(["weapon"]);

    const craftingOwned = filterItemsByScope(
      [weapon, armour],
      {
        activeTab: "crafting",
        craftabilityFilter: "all",
        blueprintOwnershipFilter: "owned",
      },
      summaries,
      (itemId) => itemId === "armour",
    );

    expect(craftingOwned.map((item) => item.id)).toEqual(["armour"]);

    const blueprints = filterItemsByScope(
      [weapon, armour],
      {
        activeTab: "blueprints",
        craftabilityFilter: "all",
        blueprintOwnershipFilter: "owned",
      },
      summaries,
      (itemId) => itemId === "armour",
    );

    expect(blueprints.map((item) => item.id)).toEqual(["armour"]);
  });
});

describe("craftingUtils sorting", () => {
  const fast = makeItem({ id: "fast", name: "A03", craftTimeSeconds: 90, blueprintSources: [] });
  const slow = makeItem({ id: "slow", name: "P6-LR", craftTimeSeconds: 240, blueprintSources: [makeItem({}).blueprintSources[0], makeItem({}).blueprintSources[0]] });
  const summaries: Record<string, CraftabilitySummary> = {
    fast: {
      craftable: true,
      missingCount: 0,
      shortageLabel: "Ready to craft",
      requirements: [],
    },
    slow: {
      craftable: false,
      missingCount: 2,
      shortageLabel: "Short on 2 materials",
      requirements: [],
    },
  };

  it("sorts by name, time, missions, and craftable state", () => {
    expect(sortItems([slow, fast], "name", summaries).map((item) => item.id)).toEqual(["fast", "slow"]);
    expect(sortItems([fast, slow], "time-desc", summaries).map((item) => item.id)).toEqual(["slow", "fast"]);
    expect(sortItems([fast, slow], "missions-desc", summaries).map((item) => item.id)).toEqual(["slow", "fast"]);
    expect(sortItems([slow, fast], "craftable", summaries).map((item) => item.id)).toEqual(["fast", "slow"]);
  });
});

describe("craftability summaries", () => {
  it("aggregates duplicate materials and reports shortfalls", () => {
    const item = makeItem({
      inputs: [
        makeInput({ slot: "Frame", materialKey: "iron", amount: 0.02, quantity: "2 cSCU" }),
        makeInput({ slot: "Barrel", materialKey: "iron", amount: 0.03, quantity: "3 cSCU" }),
        makeInput({ slot: "Stock", materialKey: "taranite", amount: 0.01, quantity: "1 cSCU", requirement: "Taranite" }),
      ],
      materials: ["Iron", "Taranite"],
    });

    const summary = getCraftabilitySummary(item, { iron: 0.03, taranite: 0.01 });

    expect(summary.craftable).toBe(false);
    expect(summary.missingCount).toBe(1);
    const iron = summary.requirements.find((requirement) => requirement.materialKey === "iron");
    const taranite = summary.requirements.find((requirement) => requirement.materialKey === "taranite");

    expect(iron).toMatchObject({ amount: 0.05, owned: 0.03 });
    expect(iron?.shortfall).toBeCloseTo(0.02, 6);
    expect(taranite).toMatchObject({ amount: 0.01, owned: 0.01, shortfall: 0 });
  });
});

describe("quality interpolation and lower-is-better handling", () => {
  it("interpolates around the baseline and improves higher-is-better stats", () => {
    const item = makeItem({
      id: "interpolation",
      inputs: [makeInput({ slot: "Barrel" })],
      qualityEffects: [makeEffect({ stat: "Damage", affectedBy: "Barrel", startMultiplier: 0.8, endMultiplier: 1.2 })],
      outputStats: [makeOutputStat({ stat: "Damage / Shot", baseValue: 100, effectStats: ["Damage"], higherIsBetter: true })],
    });

    const baseRows = outputStatRows(item, { [sliderKey(item.id, "Barrel")]: 500 }, 500);
    const highRows = outputStatRows(item, { [sliderKey(item.id, "Barrel")]: 1000 }, 500);
    const lowRows = outputStatRows(item, { [sliderKey(item.id, "Barrel")]: 0 }, 500);

    expect(baseRows[0].nextValue).toBe(100);
    expect(highRows[0].nextValue).toBe(120);
    expect(highRows[0].deltaPercent).toBe(20);
    expect(lowRows[0].nextValue).toBe(80);
    expect(lowRows[0].deltaPercent).toBe(-20);
  });

  it("treats lower-is-better stats as positive when the number goes down", () => {
    const item = makeItem({
      id: "lower-better",
      inputs: [makeInput({ slot: "Frame" })],
      qualityEffects: [makeEffect({ stat: "Recoil Smoothness", affectedBy: "Frame", startMultiplier: 1.2, endMultiplier: 0.8 })],
      outputStats: [
        makeOutputStat({
          stat: "Recoil Smoothness",
          baseValue: 0.09,
          unit: "s",
          precision: 3,
          effectStats: ["Recoil Smoothness"],
          higherIsBetter: false,
        }),
      ],
    });

    const improved = outputStatRows(item, { [sliderKey(item.id, "Frame")]: 1000 }, 500)[0];
    const worsened = outputStatRows(item, { [sliderKey(item.id, "Frame")]: 0 }, 500)[0];

    expect(improved.nextValue).toBeCloseTo(0.072, 6);
    expect(improved.trend).toBe("better");
    expect(improved.deltaPercent).toBeCloseTo(20, 6);

    expect(worsened.nextValue).toBeCloseTo(0.108, 6);
    expect(worsened.trend).toBe("worse");
    expect(worsened.deltaPercent).toBeCloseTo(-20, 6);
  });
});
