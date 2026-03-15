const EXEC_STORAGE_KEYS = [
  "cz-hangar-sync",
  "cz-vault-sync",
  "cz-compboards",
  "cz-ships",
  "cz-supervisor-collected",
  "cz-supervisor-timers",
];

const WIKELO_STORAGE_KEYS = [
  "wikelo-inventory",
  "wikelo-tracked",
  "wikelo-completed",
];

const LOADOUT_STORAGE_KEYS = ["loadout-planner-data"];

const REFINING_STORAGE_KEYS = [
  "mining-tools-sessions",
  "mining-tools-work-orders",
];

function safeReadJson(key: string): unknown | undefined {
  const raw = localStorage.getItem(key);
  if (raw === null) return undefined;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function collectKeys(keys: readonly string[]) {
  const snapshot: Record<string, unknown> = {};

  keys.forEach((key) => {
    const value = safeReadJson(key);
    if (value !== undefined) {
      snapshot[key] = value;
    }
  });

  return snapshot;
}

function collectArmorTrackerItems() {
  const items: Record<string, unknown> = {};

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (!key.startsWith("personal-armour") && !key.startsWith("personal-armor")) {
      continue;
    }

    const value = safeReadJson(key);
    if (value !== undefined) {
      items[key] = value;
    }
  }

  return items;
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportAllToolsData() {
  const exportedAt = new Date().toISOString();
  const dateStamp = exportedAt.slice(0, 10);

  downloadJson(`undisputednoobs-all-tools-${dateStamp}.json`, {
    version: 1,
    source: "undisputed-noobs",
    exportedAt,
    tools: {
      armorTracker: {
        tool: "armor-tracker",
        items: collectArmorTrackerItems(),
      },
      execHangarTracker: {
        tool: "exec-hangar-tracker",
        items: collectKeys(EXEC_STORAGE_KEYS),
      },
      wikeloTracker: {
        tool: "wikelo-tracker",
        items: collectKeys(WIKELO_STORAGE_KEYS),
      },
      loadoutPlanner: {
        tool: "loadout-planner",
        items: collectKeys(LOADOUT_STORAGE_KEYS),
      },
      refiningTracker: {
        tool: "refining-tracker",
        items: collectKeys(REFINING_STORAGE_KEYS),
      },
    },
  });
}
