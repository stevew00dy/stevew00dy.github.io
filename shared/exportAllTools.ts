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

const textEncoder = new TextEncoder();

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

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function createCrc32Table() {
  const table = new Uint32Array(256);

  for (let i = 0; i < 256; i += 1) {
    let current = i;
    for (let bit = 0; bit < 8; bit += 1) {
      current = (current & 1) === 1 ? 0xedb88320 ^ (current >>> 1) : current >>> 1;
    }
    table[i] = current >>> 0;
  }

  return table;
}

const crc32Table = createCrc32Table();

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;

  for (let i = 0; i < data.length; i += 1) {
    crc = crc32Table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function uint16Bytes(value: number) {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
}

function uint32Bytes(value: number) {
  return new Uint8Array([
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  ]);
}

function concatBytes(parts: Uint8Array[]) {
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  parts.forEach((part) => {
    result.set(part, offset);
    offset += part.length;
  });

  return result;
}

function createZip(files: Array<{ name: string; content: string }>) {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  files.forEach(({ name, content }) => {
    const nameBytes = textEncoder.encode(name);
    const contentBytes = textEncoder.encode(content);
    const checksum = crc32(contentBytes);

    const localHeader = concatBytes([
      uint32Bytes(0x04034b50),
      uint16Bytes(20),
      uint16Bytes(0),
      uint16Bytes(0),
      uint16Bytes(0),
      uint16Bytes(0),
      uint32Bytes(checksum),
      uint32Bytes(contentBytes.length),
      uint32Bytes(contentBytes.length),
      uint16Bytes(nameBytes.length),
      uint16Bytes(0),
      nameBytes,
      contentBytes,
    ]);

    const centralHeader = concatBytes([
      uint32Bytes(0x02014b50),
      uint16Bytes(20),
      uint16Bytes(20),
      uint16Bytes(0),
      uint16Bytes(0),
      uint16Bytes(0),
      uint16Bytes(0),
      uint32Bytes(checksum),
      uint32Bytes(contentBytes.length),
      uint32Bytes(contentBytes.length),
      uint16Bytes(nameBytes.length),
      uint16Bytes(0),
      uint16Bytes(0),
      uint16Bytes(0),
      uint16Bytes(0),
      uint32Bytes(0),
      uint32Bytes(offset),
      nameBytes,
    ]);

    localParts.push(localHeader);
    centralParts.push(centralHeader);
    offset += localHeader.length;
  });

  const centralDirectory = concatBytes(centralParts);
  const localDirectory = concatBytes(localParts);
  const endOfCentralDirectory = concatBytes([
    uint32Bytes(0x06054b50),
    uint16Bytes(0),
    uint16Bytes(0),
    uint16Bytes(files.length),
    uint16Bytes(files.length),
    uint32Bytes(centralDirectory.length),
    uint32Bytes(localDirectory.length),
    uint16Bytes(0),
  ]);

  return new Blob([localDirectory, centralDirectory, endOfCentralDirectory], {
    type: "application/zip",
  });
}

function buildArmorTrackerExport(exportedAt: string) {
  return {
    version: 1,
    exportedAt,
    items: collectArmorTrackerItems(),
  };
}

function buildExecHangarTrackerExport(exportedAt: string) {
  const data: Record<string, unknown> = {
    version: 1,
    exportedAt,
  };

  EXEC_STORAGE_KEYS.forEach((key) => {
    const value = safeReadJson(key);
    if (value !== undefined) {
      data[key] = value;
    }
  });

  return data;
}

function buildWikeloTrackerExport(exportedAt: string) {
  const items = collectKeys(WIKELO_STORAGE_KEYS);
  return {
    version: 1,
    exportedAt,
    inventory: items["wikelo-inventory"] ?? {},
    tracked: items["wikelo-tracked"] ?? [],
    completed: items["wikelo-completed"] ?? [],
  };
}

function buildFpsLoadoutTrackerExport(exportedAt: string) {
  return {
    version: 1,
    tool: "fps-loadout-tracker",
    exportedAt,
    loadouts: safeReadJson(LOADOUT_STORAGE_KEYS[0]) ?? [],
  };
}

function buildRefiningTrackerExport() {
  const items = collectKeys(REFINING_STORAGE_KEYS);
  return {
    version: 1,
    exportedAt: Date.now(),
    sessions: items["mining-tools-sessions"] ?? [],
    workOrders: items["mining-tools-work-orders"] ?? [],
  };
}

export async function exportAllToolsData() {
  const exportedAt = new Date().toISOString();
  const dateStamp = exportedAt.slice(0, 10);
  const blob = createZip([
    {
      name: `armor-tracker-${dateStamp}.json`,
      content: JSON.stringify(buildArmorTrackerExport(exportedAt), null, 2),
    },
    {
      name: `exec-hangar-tracker-${dateStamp}.json`,
      content: JSON.stringify(buildExecHangarTrackerExport(exportedAt), null, 2),
    },
    {
      name: `wikelo-tracker-${dateStamp}.json`,
      content: JSON.stringify(buildWikeloTrackerExport(exportedAt), null, 2),
    },
    {
      name: `fps-loadout-tracker-${dateStamp}.json`,
      content: JSON.stringify(buildFpsLoadoutTrackerExport(exportedAt), null, 2),
    },
    {
      name: `refining-tracker-backup-${dateStamp}.json`,
      content: JSON.stringify(buildRefiningTrackerExport(), null, 2),
    },
    {
      name: "README.txt",
      content: [
        "Undisputed Noobs - Export All Tools",
        "",
        "This zip contains one JSON backup per tool.",
        "Import each JSON file from the matching app menu.",
        "",
        `Exported at: ${exportedAt}`,
      ].join("\n"),
    },
  ]);
  downloadBlob(`undisputednoobs-all-tools-${dateStamp}.zip`, blob);
}
