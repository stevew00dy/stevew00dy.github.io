import { describe, expect, it } from "vitest";
import { parseCraftingTrackerImport } from "./localState";

describe("local state import parsing", () => {
  it("accepts same-patch inventory imports", () => {
    const parsed = parseCraftingTrackerImport(
      JSON.stringify({
        version: 1,
        tool: "crafting-tracker",
        exportedAt: "2026-03-17T00:00:00Z",
        gameVersion: "4.7",
        state: {
          ownedBlueprints: { a03: true },
          materialInventory: {
            gameVersion: "4.7",
            items: { iron: 0.03 },
          },
        },
      }),
      "4.7",
    );

    expect(parsed.ownedBlueprints).toEqual({ a03: true });
    expect(parsed.materialInventory).toEqual({ iron: 0.03 });
    expect(parsed.appliesInventoryToCurrentPatch).toBe(true);
  });

  it("keeps ownership but flags mismatched inventory patches", () => {
    const parsed = parseCraftingTrackerImport(
      JSON.stringify({
        version: 1,
        tool: "crafting-tracker",
        exportedAt: "2026-03-17T00:00:00Z",
        gameVersion: "4.7",
        state: {
          ownedBlueprints: { a03: true },
          materialInventory: {
            gameVersion: "4.7",
            items: { iron: 0.03 },
          },
        },
      }),
      "4.8",
    );

    expect(parsed.ownedBlueprints).toEqual({ a03: true });
    expect(parsed.materialInventory).toEqual({ iron: 0.03 });
    expect(parsed.appliesInventoryToCurrentPatch).toBe(false);
    expect(parsed.sourceGameVersion).toBe("4.7");
  });

  it("rejects non-crafting exports", () => {
    expect(() =>
      parseCraftingTrackerImport(JSON.stringify({ tool: "refining-tracker", state: {} }), "4.7"),
    ).toThrow("This file is not a Crafting Tracker export.");
  });
});
