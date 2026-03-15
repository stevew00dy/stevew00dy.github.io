import { type Ore, FALLBACK_ORES } from "./data/ores";
import { type RefineryMethod, type YieldBonus, FALLBACK_METHODS } from "./data/refineries";

const API = "https://api.uexcorp.uk/2.0";
const CACHE_KEY = "refining-tracker-cache";
const CACHE_TTL = 24 * 60 * 60 * 1000;

export interface RefiningData {
  ores: Ore[];
  methods: RefineryMethod[];
  yields: YieldBonus[];
  fromCache: boolean;
  fetchedAt: number;
}

interface CachePayload {
  ores: Ore[];
  methods: RefineryMethod[];
  yields: YieldBonus[];
  fetchedAt: number;
}

function readCache(): CachePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data: CachePayload = JSON.parse(raw);
    if (Date.now() - data.fetchedAt > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(payload: CachePayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch { /* quota exceeded */ }
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

function parseOres(raw: any[]): Ore[] {
  const byId = new Map(raw.map((c) => [c.id, c]));
  const rawOres = raw.filter((c) => c.is_refinable === 1);

  const ores: Ore[] = [];
  const seen = new Set<number>();

  for (const rawOre of rawOres) {
    const refinedId = rawOre.id_parent;
    if (!refinedId || seen.has(refinedId)) continue;
    const refined = byId.get(refinedId);
    if (!refined) continue;

    seen.add(refinedId);
    ores.push({
      id: refined.id,
      rawId: rawOre.id,
      name: refined.name,
      code: refined.code,
      kind: refined.kind,
      refinedPriceSell: refined.price_sell ?? 0,
    });
  }

  return ores.sort((a, b) => b.refinedPriceSell - a.refinedPriceSell);
}

function parseMethods(raw: any[]): RefineryMethod[] {
  return raw.map((m) => ({
    id: m.id,
    name: m.name,
    code: m.code,
    ratingYield: m.rating_yield,
    ratingCost: m.rating_cost,
    ratingSpeed: m.rating_speed,
  }));
}

function parseYields(raw: any[]): YieldBonus[] {
  return raw
    .filter((y) => y.id_commodity && y.value != null && y.value !== 0)
    .map((y) => ({
      oreCode: String(y.id_commodity),
      stationId: String(y.id_space_station || y.id_terminal || 0),
      stationName: y.space_station_name ?? y.terminal_name ?? "",
      commodityName: y.commodity_name ?? "",
      yieldBonus: y.value,
    }));
}

let _fetchPromise: Promise<RefiningData> | null = null;

export async function getRefiningData(force = false): Promise<RefiningData> {
  if (!force) {
    const cached = readCache();
    if (cached) {
      return { ...cached, fromCache: true };
    }
  }

  if (!force && _fetchPromise) return _fetchPromise;

  _fetchPromise = (async () => {
    const [rawCommodities, rawMethods, rawYields] = await Promise.allSettled([
      fetchJson<any[]>("/commodities/"),
      fetchJson<any[]>("/refineries_methods/"),
      fetchJson<any[]>("/refineries_yields/"),
    ]);

    const commodities = rawCommodities.status === "fulfilled" ? rawCommodities.value : null;
    const methodsRaw = rawMethods.status === "fulfilled" ? rawMethods.value : null;
    const yieldsRaw = rawYields.status === "fulfilled" ? rawYields.value : null;

    const ores = commodities && Array.isArray(commodities) ? parseOres(commodities) : FALLBACK_ORES;
    const methods = methodsRaw && Array.isArray(methodsRaw) ? parseMethods(methodsRaw) : FALLBACK_METHODS;
    const yields = yieldsRaw && Array.isArray(yieldsRaw) ? parseYields(yieldsRaw) : [];

    const payload: CachePayload = { ores, methods, yields, fetchedAt: Date.now() };

    if (ores.length > 0 && methods.length > 0) {
      writeCache(payload);
    }

    _fetchPromise = null;
    return { ...payload, fromCache: false };
  })();

  return _fetchPromise;
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
  _fetchPromise = null;
}
