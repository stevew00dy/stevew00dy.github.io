import { useEffect, useMemo, useRef, useState } from "react";
import {
  AppNavDropdown,
  NavExportAllButton,
  NavExportButton,
  NavImportButton,
  NavResetButton,
} from "../../shared/AppNavDropdown";
import { FOOTER_LINKS } from "../../shared/nav-footer-links";
import { exportAllToolsData } from "../../shared/exportAllTools";
import { Check, MapPin, Menu, Search, Shield, Sparkles, Star, Tag } from "lucide-react";
import DataNotice from "./components/DataNotice";
import { armors } from "./data/armorAll";
import type { ArmorItem, ArmorType } from "./types";

type ArmorFilter = "all" | ArmorType;

interface ArmorProgress {
  favorite: boolean;
  pieces: Record<string, boolean>;
}

const NEW_STATE_PREFIX = "personal-armour-state-";
const LEGACY_PREFIXES = ["personal-armour", "personal-armor"];
const SETTINGS_KEY = "personal-armour-tracker-settings";

function startsWithArmorPrefix(key: string) {
  return LEGACY_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function normalizeToken(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function coerceBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1 ? true : value === 0 ? false : undefined;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "owned", "found", "checked"].includes(normalized)) return true;
    if (["false", "0", "no", "missing", "unchecked"].includes(normalized)) return false;
  }
  return undefined;
}

function safeParse(raw: string | null): unknown | undefined {
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function extractProgress(value: unknown, keyHint = ""): Partial<ArmorProgress> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const owned = coerceBoolean(
      record.owned ??
        record.found ??
        record.checked ??
        record.complete ??
        record.completed ??
        record.collected ??
        record.tracked,
    );
    const favorite = coerceBoolean(record.favorite ?? record.favourite ?? record.starred);
    const pieces = record.pieces && typeof record.pieces === "object" && !Array.isArray(record.pieces)
      ? Object.fromEntries(
          Object.entries(record.pieces as Record<string, unknown>).map(([pieceKey, pieceValue]) => [
            pieceKey,
            coerceBoolean(pieceValue) ?? false,
          ]),
        )
      : undefined;

    if (owned !== undefined || favorite !== undefined || pieces !== undefined) {
      return {
        favorite: favorite ?? false,
        pieces,
      };
    }
  }

  const primitiveBool = coerceBoolean(value);
  if (primitiveBool !== undefined) {
    if (keyHint.includes("fav") || keyHint.includes("star")) {
      return { favorite: primitiveBool };
    }
    return { pieces: { __all__: primitiveBool } };
  }

  return null;
}

function createPieceState(armor: ArmorItem, fill = false) {
  return Object.fromEntries((armor.setPieces ?? []).map((piece) => [piece.slot, fill]));
}

function isArmorComplete(armor: ArmorItem, progress: ArmorProgress | undefined) {
  const pieces = armor.setPieces ?? [];
  if (pieces.length === 0) return false;
  return pieces.every((piece) => progress?.pieces?.[piece.slot]);
}

function getArmorById(id: string) {
  return armors.find((armor) => armor.id === id);
}

function getArmorStorageEntries() {
  const entries: Array<[string, unknown]> = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || !startsWithArmorPrefix(key)) continue;
    entries.push([key, safeParse(localStorage.getItem(key))]);
  }

  return entries;
}

function loadProgress() {
  const next: Record<string, ArmorProgress> = {};
  const entries = getArmorStorageEntries();

  for (const armor of armors) {
    next[armor.id] = {
      favorite: false,
      pieces: createPieceState(armor),
    };

    const direct = extractProgress(safeParse(localStorage.getItem(`${NEW_STATE_PREFIX}${armor.id}`)));
    if (direct) {
      next[armor.id] = {
        favorite: direct.favorite ?? next[armor.id].favorite,
        pieces: direct.pieces?.__all__
          ? createPieceState(armor, true)
          : {
              ...next[armor.id].pieces,
              ...(direct.pieces ?? {}),
            },
      };
      continue;
    }

    const normalizedId = normalizeToken(armor.id);
    const normalizedName = normalizeToken(armor.name);

    for (const [key, rawValue] of entries) {
      if (key === SETTINGS_KEY) continue;

      const normalizedKey = normalizeToken(key);
      if (!normalizedKey.includes(normalizedId) && !normalizedKey.includes(normalizedName)) {
        continue;
      }

      const inferred = extractProgress(rawValue, normalizedKey);
      if (!inferred) continue;

      next[armor.id] = {
        favorite: inferred.favorite ?? next[armor.id].favorite,
        pieces: inferred.pieces?.__all__
          ? createPieceState(armor, true)
          : {
              ...next[armor.id].pieces,
              ...(inferred.pieces ?? {}),
            },
      };
    }
  }

  return next;
}

function saveProgress(progress: Record<string, ArmorProgress>) {
  for (const armor of armors) {
    const state = progress[armor.id] ?? { favorite: false, pieces: createPieceState(armor) };
    const key = `${NEW_STATE_PREFIX}${armor.id}`;
    const hasCheckedPieces = Object.values(state.pieces).some(Boolean);

    if (!hasCheckedPieces && !state.favorite) {
      localStorage.removeItem(key);
      continue;
    }

    localStorage.setItem(
      key,
      JSON.stringify({
        favorite: state.favorite,
        pieces: state.pieces,
      }),
    );
  }
}

function clearArmorStorage() {
  const keysToRemove: string[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && startsWithArmorPrefix(key)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

function exportData() {
  const items: Record<string, unknown> = {};
  getArmorStorageEntries().forEach(([key, value]) => {
    items[key] = value;
  });

  const blob = new Blob(
    [
      JSON.stringify(
        {
          version: 1,
          exportedAt: new Date().toISOString(),
          items,
        },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `armor-tracker-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function importData(file: File) {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target?.result as string);
      if (!data || typeof data !== "object" || typeof data.items !== "object" || !data.items) {
        throw new Error("bad format");
      }

      Object.entries(data.items as Record<string, unknown>).forEach(([key, value]) => {
        if (!startsWithArmorPrefix(key)) return;
        localStorage.setItem(key, JSON.stringify(value));
      });

      window.location.reload();
    } catch {
      alert("Invalid backup file. Expected an Armor Tracker JSON export.");
    }
  };
  reader.readAsText(file);
}

function typeClasses(type: ArmorType | undefined) {
  switch (type) {
    case "Heavy":
      return "bg-accent-red/10 text-accent-red border-accent-red/20";
    case "Medium":
      return "bg-accent-amber/10 text-accent-amber border-accent-amber/20";
    case "Light":
      return "bg-accent-blue/10 text-accent-blue border-accent-blue/20";
    default:
      return "bg-dark-800 text-text-dim border-dark-700";
  }
}

function ArmorCard({
  armor,
  progress,
  onTogglePiece,
  onToggleFavorite,
}: {
  armor: ArmorItem;
  progress: ArmorProgress;
  onTogglePiece: (pieceSlot: string) => void;
  onToggleFavorite: () => void;
}) {
  const base = import.meta.env.BASE_URL;
  const hasImage = Boolean(armor.image);
  const totalPieces = armor.setPieces?.length ?? 0;
  const foundPieces = (armor.setPieces ?? []).filter((piece) => progress.pieces[piece.slot]).length;
  const complete = isArmorComplete(armor, progress);

  return (
    <article
      className={`card p-4 transition-all duration-200 ${
        complete
          ? "border-accent-green/40 bg-accent-green/5"
          : progress.favorite
            ? "border-accent-amber/40"
            : "border-dark-700"
      }`}
    >
      <div className="space-y-4">
        <div className="rounded-xl overflow-hidden border border-dark-700 bg-dark-900/60 aspect-[4/3]">
          {hasImage ? (
            <img
              src={`${base}${armor.image}`}
              alt={armor.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-text-muted">
              <Sparkles className="w-10 h-10 mb-3 text-accent-amber" />
              <p className="text-sm font-semibold text-text">Image coming soon</p>
              <p className="text-xs text-text-muted mt-1">{armor.name}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-text">{armor.name}</h2>
                {armor.type && (
                  <span
                    className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${typeClasses(armor.type)}`}
                  >
                    {armor.type}
                  </span>
                )}
                {armor.rare && (
                  <span className="px-2.5 py-1 rounded-full border border-accent-purple/20 bg-accent-purple/10 text-accent-purple text-xs font-semibold">
                    Rare
                  </span>
                )}
              </div>
              <p className="text-sm text-text-dim">{armor.manufacturer}</p>
              {totalPieces > 0 && (
                <p className="text-xs text-text-muted mt-2">
                  <span className={`font-mono font-semibold ${complete ? "text-accent-green" : "text-text-dim"}`}>
                    {foundPieces}/{totalPieces}
                  </span>{" "}
                  pieces found
                </p>
              )}
            </div>

            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-lg border transition-colors shrink-0 ${
                progress.favorite
                  ? "border-accent-amber/30 bg-accent-amber/10 text-accent-amber"
                  : "border-dark-700 bg-dark-800 text-text-muted hover:text-accent-amber"
              }`}
              aria-label={progress.favorite ? "Remove favorite" : "Add favorite"}
              title={progress.favorite ? "Favorited" : "Favorite"}
            >
              <Star className={`w-4 h-4 ${progress.favorite ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="rounded-xl border border-dark-700 bg-dark-900/50 p-4">
            <div className="flex items-center gap-2 text-accent-green mb-3">
              <Check className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-text">Set pieces</h3>
            </div>
            {armor.setPieces && armor.setPieces.length > 0 ? (
              <div className="space-y-2">
                {armor.setPieces.map((piece) => {
                  const checked = progress.pieces[piece.slot] ?? false;
                  return (
                    <button
                      key={`${armor.id}-${piece.slot}`}
                      onClick={() => onTogglePiece(piece.slot)}
                      className={`w-full flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                        checked
                          ? "border-accent-green/30 bg-accent-green/10"
                          : "border-dark-700 bg-dark-800/70 hover:border-dark-600"
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                          checked
                            ? "border-accent-green bg-accent-green text-dark-950"
                            : "border-dark-600 text-transparent"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${checked ? "text-accent-green" : "text-text-secondary"}`}>
                          {piece.slot}
                        </div>
                        <div className={`text-xs ${checked ? "text-text-dim" : "text-text-muted"}`}>{piece.item}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No tracked pieces listed for this set yet.</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-dark-700 bg-dark-900/50 p-4">
              <div className="flex items-center gap-2 text-accent-blue mb-2">
                <MapPin className="w-4 h-4" />
                <h3 className="text-sm font-semibold text-text">Where to find it</h3>
              </div>
              <p className="text-sm text-text-dim leading-relaxed">{armor.where}</p>
              {armor.how && <p className="text-sm text-text-muted leading-relaxed mt-3">{armor.how}</p>}
            </div>

            <div className="rounded-xl border border-dark-700 bg-dark-900/50 p-4">
              <div className="flex items-center gap-2 text-accent-amber mb-2">
                <Tag className="w-4 h-4" />
                <h3 className="text-sm font-semibold text-text">Value</h3>
              </div>
              <p className="text-sm text-text-dim">{armor.val}</p>
            </div>
          </div>

          {armor.variants.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wide font-semibold text-text-muted mb-2">Variants</h3>
              <div className="flex flex-wrap gap-2">
                {armor.variants.map((variant) => (
                  <span
                    key={`${armor.id}-${variant}`}
                    className="px-2.5 py-1 rounded-full bg-dark-800 border border-dark-700 text-xs text-text-dim"
                  >
                    {variant}
                  </span>
                ))}
              </div>
              {armor.variantNote && <p className="text-xs text-text-muted mt-2">{armor.variantNote}</p>}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Header({
  ownedCount,
  favoriteCount,
  totalCount,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  onExport,
  onExportAll,
  onImport,
  onReset,
}: {
  ownedCount: number;
  favoriteCount: number;
  totalCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  filter: ArmorFilter;
  onFilterChange: (value: ArmorFilter) => void;
  onExport: () => void;
  onExportAll: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!navOpen) return;

    function handleClick(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setNavOpen(false);
        setConfirming(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [navOpen]);

  const filters: ArmorFilter[] = ["all", "Heavy", "Medium", "Light"];

  return (
    <header className="sticky top-0 z-50 border-b border-dark-700 bg-dark-900/80 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-accent-purple/20 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-accent-purple" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight">Rare Armor Tracker</h1>
              <p className="text-xs text-text-muted">Star Citizen rare loot guide</p>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="hidden sm:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-green" />
                <span className="text-text-dim">
                  <span className="font-mono font-semibold text-accent-green">{ownedCount}</span>
                  <span className="text-text-muted">/{totalCount}</span> found
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-amber" />
                <span className="text-text-dim">
                  <span className="font-mono font-semibold text-accent-amber">{favoriteCount}</span> favorites
                </span>
              </div>
            </div>

            <div className="relative" ref={navRef}>
              <button
                onClick={() => {
                  setNavOpen(!navOpen);
                  setConfirming(false);
                }}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  navOpen ? "text-text bg-dark-700" : "text-text-muted hover:text-text hover:bg-dark-800"
                }`}
                title="Menu"
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              {navOpen && (
                <AppNavDropdown
                  activePath="/armor-tracker/"
                  onClose={() => {
                    setNavOpen(false);
                    setConfirming(false);
                  }}
                  progressSection={
                    <>
                      <NavExportButton onClick={() => { onExport(); setNavOpen(false); }} />
                      <NavExportAllButton onClick={() => { onExportAll(); setNavOpen(false); }} />
                      <NavImportButton
                        inputRef={fileRef}
                        onClick={() => fileRef.current?.click()}
                        onFileChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) onImport(file);
                          event.target.value = "";
                        }}
                      />
                      <NavResetButton
                        confirming={confirming}
                        onResetClick={() => setConfirming(true)}
                        onConfirmReset={() => {
                          onReset();
                          setConfirming(false);
                          setNavOpen(false);
                        }}
                        onCancel={() => setConfirming(false)}
                      />
                    </>
                  }
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex sm:hidden items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-green" />
            <span className="text-text-dim">
              <span className="font-mono font-semibold text-accent-green">{ownedCount}</span>
              <span className="text-text-muted">/{totalCount}</span> found
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-amber" />
            <span className="text-text-dim">
              <span className="font-mono font-semibold text-accent-amber">{favoriteCount}</span> favorites
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search armor, locations, variants..."
              className="w-full rounded-lg border border-dark-600 bg-dark-800 text-text text-sm pl-10 pr-3 py-2.5 outline-none focus:border-accent-amber"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((value) => {
              const active = filter === value;

              return (
                <button
                  key={value}
                  onClick={() => onFilterChange(value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors border ${
                    active
                      ? "border-accent-amber/30 bg-accent-amber/10 text-accent-amber"
                      : "border-dark-700 bg-dark-800 text-text-muted hover:text-text"
                  }`}
                >
                  {value === "all" ? "All" : value}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [progress, setProgress] = useState<Record<string, ArmorProgress>>(() => loadProgress());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ArmorFilter>("all");

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const ownedCount = useMemo(
    () => armors.filter((armor) => isArmorComplete(armor, progress[armor.id])).length,
    [progress],
  );
  const favoriteCount = useMemo(
    () => armors.filter((armor) => progress[armor.id]?.favorite).length,
    [progress],
  );
  const foundPieceCount = useMemo(
    () =>
      armors.reduce(
        (total, armor) => total + (armor.setPieces ?? []).filter((piece) => progress[armor.id]?.pieces?.[piece.slot]).length,
        0,
      ),
    [progress],
  );
  const totalPieceCount = useMemo(
    () => armors.reduce((total, armor) => total + (armor.setPieces?.length ?? 0), 0),
    [],
  );

  const filteredArmors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...armors]
      .filter((armor) => (filter === "all" ? true : armor.type === filter))
      .filter((armor) => {
        if (!normalizedQuery) return true;

        const haystack = [
          armor.name,
          armor.type ?? "",
          armor.manufacturer,
          armor.where,
          armor.how ?? "",
          armor.val,
          armor.variants.join(" "),
          armor.setPieces?.map((piece) => `${piece.slot} ${piece.item}`).join(" ") ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .sort((left, right) => {
        const leftFavorite = progress[left.id]?.favorite ? 1 : 0;
        const rightFavorite = progress[right.id]?.favorite ? 1 : 0;
        if (leftFavorite !== rightFavorite) return rightFavorite - leftFavorite;

        const leftOwned = isArmorComplete(left, progress[left.id]) ? 1 : 0;
        const rightOwned = isArmorComplete(right, progress[right.id]) ? 1 : 0;
        if (leftOwned !== rightOwned) return rightOwned - leftOwned;

        return left.name.localeCompare(right.name);
      });
  }, [filter, progress, query]);

  function updateArmor(id: string, updates: Partial<ArmorProgress>) {
    const armor = getArmorById(id);
    if (!armor) return;

    setProgress((current) => ({
      ...current,
      [id]: {
        favorite: current[id]?.favorite ?? false,
        pieces: current[id]?.pieces ?? createPieceState(armor),
        ...updates,
      },
    }));
  }

  function togglePiece(armor: ArmorItem, pieceSlot: string) {
    updateArmor(armor.id, {
      pieces: {
        ...(progress[armor.id]?.pieces ?? createPieceState(armor)),
        [pieceSlot]: !(progress[armor.id]?.pieces?.[pieceSlot] ?? false),
      },
    });
  }

  function handleReset() {
    clearArmorStorage();
    setProgress(loadProgress());
  }

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent-amber focus:text-dark-950 focus:font-medium focus:w-auto focus:h-auto focus:m-0 focus:overflow-visible focus:clip-auto"
      >
        Skip to main content
      </a>

      <Header
        ownedCount={ownedCount}
        favoriteCount={favoriteCount}
        totalCount={armors.length}
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        onExport={exportData}
        onExportAll={exportAllToolsData}
        onImport={importData}
        onReset={handleReset}
      />

      <DataNotice />

      <main id="main" className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-xs uppercase tracking-wide font-semibold text-text-muted mb-2">
              Sets completed
            </p>
            <div className="flex items-end gap-2">
              <span className="font-mono text-3xl font-black text-accent-green">{ownedCount}</span>
              <span className="text-text-muted pb-1">of {armors.length} sets fully checked</span>
            </div>
          </div>
          <div className="card p-4">
            <p className="text-xs uppercase tracking-wide font-semibold text-text-muted mb-2">Pieces found</p>
            <div className="flex items-end gap-2">
              <span className="font-mono text-3xl font-black text-accent-blue">{foundPieceCount}</span>
              <span className="text-text-muted pb-1">of {totalPieceCount} tracked pieces checked</span>
            </div>
          </div>
          <div className="card p-4">
            <p className="text-xs uppercase tracking-wide font-semibold text-text-muted mb-2">Favorites</p>
            <div className="flex items-end gap-2">
              <span className="font-mono text-3xl font-black text-accent-amber">{favoriteCount}</span>
              <span className="text-text-muted pb-1">sets pinned for quick reference</span>
            </div>
          </div>
        </section>

        {filteredArmors.length === 0 ? (
          <section className="card p-8 text-center">
            <p className="text-lg font-semibold text-text">No armor matches that search.</p>
            <p className="text-sm text-text-muted mt-2">
              Try a different search term or switch the armor type filter.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            {filteredArmors.map((armor) => (
              <ArmorCard
                key={armor.id}
                armor={armor}
                progress={progress[armor.id] ?? { favorite: false, pieces: createPieceState(armor) }}
                onTogglePiece={(pieceSlot) => togglePiece(armor, pieceSlot)}
                onToggleFavorite={() =>
                  updateArmor(armor.id, { favorite: !(progress[armor.id]?.favorite ?? false) })
                }
              />
            ))}
          </section>
        )}
      </main>

      <footer className="border-t border-dark-700 mt-12 py-6">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {FOOTER_LINKS.map(({ href, label, external }) => (
              <a
                key={href}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`text-xs transition-colors ${
                  href === "/armor-tracker/" ? "text-accent-amber font-medium" : "text-text-muted hover:text-accent-amber"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
          <p className="text-[10px] text-text-muted/50">
            Unofficial fan-made tool. Not affiliated with Cloud Imperium Games. All data may be inaccurate -
            use at your own risk.
          </p>
        </div>
      </footer>
    </div>
  );
}
