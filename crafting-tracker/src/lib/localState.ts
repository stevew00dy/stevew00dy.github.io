const EXPORT_VERSION = 1;
const TOOL_ID = "crafting-tracker";

export type CraftingTrackerLocalExport = {
  version: number;
  tool: typeof TOOL_ID;
  exportedAt: string;
  gameVersion: string;
  state: {
    ownedBlueprints: Record<string, boolean>;
    materialInventory: {
      gameVersion: string;
      items: Record<string, number>;
    };
  };
};

export type ParsedCraftingTrackerImport = {
  ownedBlueprints: Record<string, boolean>;
  materialInventory: Record<string, number>;
  sourceGameVersion: string;
  appliesInventoryToCurrentPatch: boolean;
};

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportCraftingTrackerState(payload: {
  gameVersion: string;
  ownedBlueprints: Record<string, boolean>;
  materialInventory: Record<string, number>;
}) {
  const exportedAt = new Date().toISOString();
  const dateStamp = exportedAt.slice(0, 10);
  const data: CraftingTrackerLocalExport = {
    version: EXPORT_VERSION,
    tool: TOOL_ID,
    exportedAt,
    gameVersion: payload.gameVersion,
    state: {
      ownedBlueprints: payload.ownedBlueprints,
      materialInventory: {
        gameVersion: payload.gameVersion,
        items: payload.materialInventory,
      },
    },
  };

  downloadJson(`crafting-tracker-${payload.gameVersion}-${dateStamp}.json`, data);
}

export function parseCraftingTrackerImport(rawText: string, currentGameVersion: string): ParsedCraftingTrackerImport {
  const parsed = JSON.parse(rawText) as Partial<CraftingTrackerLocalExport>;
  if (parsed.tool !== TOOL_ID || !parsed.state) {
    throw new Error("This file is not a Crafting Tracker export.");
  }

  const ownedBlueprints =
    parsed.state.ownedBlueprints && typeof parsed.state.ownedBlueprints === "object" ? parsed.state.ownedBlueprints : {};
  const materialInventoryItems =
    parsed.state.materialInventory?.items && typeof parsed.state.materialInventory.items === "object"
      ? parsed.state.materialInventory.items
      : {};
  const sourceGameVersion = parsed.state.materialInventory?.gameVersion ?? parsed.gameVersion ?? "Unknown";

  return {
    ownedBlueprints,
    materialInventory: materialInventoryItems,
    sourceGameVersion,
    appliesInventoryToCurrentPatch: sourceGameVersion === currentGameVersion,
  };
}
