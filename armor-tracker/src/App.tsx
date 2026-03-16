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
import { Check, ChevronDown, MapPin, Menu, Search, Shield, Sparkles, Star } from "lucide-react";
import DataNotice from "./components/DataNotice";
import { armors } from "./data/armorAll";
import type { ArmorItem, ArmorType, ArmorVariant } from "./types";

type ArmorFilter = "all" | ArmorType;

interface ArmorProgress {
  favorite: boolean;
  variants: Record<string, Record<string, boolean>>;
}

interface ParsedArmorProgress {
  favorite?: boolean;
  pieces?: Record<string, boolean>;
  variants?: Record<string, Record<string, boolean>>;
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

function extractProgress(value: unknown, keyHint = ""): ParsedArmorProgress | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const favorite = coerceBoolean(record.favorite ?? record.favourite ?? record.starred);
    const pieces = record.pieces && typeof record.pieces === "object" && !Array.isArray(record.pieces)
      ? Object.fromEntries(
          Object.entries(record.pieces as Record<string, unknown>).map(([pieceKey, pieceValue]) => [
            pieceKey,
            coerceBoolean(pieceValue) ?? false,
          ]),
        )
      : undefined;
    const variants = record.variants && typeof record.variants === "object" && !Array.isArray(record.variants)
      ? Object.fromEntries(
          Object.entries(record.variants as Record<string, unknown>).map(([variantId, variantValue]) => [
            variantId,
            variantValue && typeof variantValue === "object" && !Array.isArray(variantValue)
              ? Object.fromEntries(
                  Object.entries(variantValue as Record<string, unknown>).map(([pieceKey, pieceValue]) => [
                    pieceKey,
                    coerceBoolean(pieceValue) ?? false,
                  ]),
                )
              : {},
          ]),
        )
      : undefined;
    const owned = coerceBoolean(
      record.owned ??
        record.found ??
        record.checked ??
        record.complete ??
        record.completed ??
        record.collected ??
        record.tracked,
    );

    if (owned !== undefined || favorite !== undefined || pieces !== undefined || variants !== undefined) {
      return {
        favorite: favorite ?? false,
        pieces,
        variants,
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

function createVariantState(armor: ArmorItem, fill = false) {
  return Object.fromEntries(
    armor.variants.map((variant) => [
      variant.id,
      Object.fromEntries(variant.pieces.map((piece) => [piece.slot, fill])),
    ]),
  );
}

function getDefaultVariantId(armor: ArmorItem) {
  return armor.variants.find((variant) => variant.id === "base")?.id ?? armor.variants[0]?.id;
}

function mergeVariantState(
  armor: ArmorItem,
  current: Record<string, Record<string, boolean>>,
  incoming?: Record<string, Record<string, boolean>>,
) {
  if (!incoming) return current;

  const merged = { ...current };

  for (const variant of armor.variants) {
    merged[variant.id] = {
      ...(current[variant.id] ?? {}),
      ...(incoming[variant.id] ?? {}),
    };
  }

  return merged;
}

function applyLegacyPieceState(
  armor: ArmorItem,
  current: Record<string, Record<string, boolean>>,
  incoming?: Record<string, boolean>,
) {
  if (!incoming) return current;

  const targetVariantId = getDefaultVariantId(armor);
  if (!targetVariantId) return current;

  const next = { ...current };
  const targetVariant = armor.variants.find((variant) => variant.id === targetVariantId);
  if (!targetVariant) return current;

  next[targetVariantId] = { ...(next[targetVariantId] ?? {}) };

  if (incoming.__all__) {
    for (const piece of targetVariant.pieces) {
      next[targetVariantId][piece.slot] = true;
    }
    return next;
  }

  for (const piece of targetVariant.pieces) {
    if (piece.slot in incoming) {
      next[targetVariantId][piece.slot] = incoming[piece.slot];
    }
  }

  return next;
}

function isVariantComplete(variant: ArmorVariant, checkedPieces: Record<string, boolean> | undefined) {
  if (variant.pieces.length === 0) return false;
  return variant.pieces.every((piece) => checkedPieces?.[piece.slot]);
}

function isArmorComplete(armor: ArmorItem, progress: ArmorProgress | undefined) {
  return armor.variants.some((variant) => isVariantComplete(variant, progress?.variants?.[variant.id]));
}

function countArmorFoundPieces(armor: ArmorItem, progress: ArmorProgress | undefined) {
  return armor.variants.reduce(
    (total, variant) =>
      total + variant.pieces.filter((piece) => progress?.variants?.[variant.id]?.[piece.slot]).length,
    0,
  );
}

function countArmorTotalPieces(armor: ArmorItem) {
  return armor.variants.reduce((total, variant) => total + variant.pieces.length, 0);
}

function countCompletedVariants(armor: ArmorItem, progress: ArmorProgress | undefined) {
  return armor.variants.filter((variant) => isVariantComplete(variant, progress?.variants?.[variant.id])).length;
}

function percentage(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

function ProgressBar({
  value,
  colorClassName,
}: {
  value: number;
  colorClassName: string;
}) {
  return (
    <div className="w-full h-2 rounded-full bg-dark-800 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ${colorClassName}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
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
      variants: createVariantState(armor),
    };

    const direct = extractProgress(safeParse(localStorage.getItem(`${NEW_STATE_PREFIX}${armor.id}`)));
    if (direct) {
      next[armor.id] = {
        favorite: direct.favorite ?? next[armor.id].favorite,
        variants: applyLegacyPieceState(
          armor,
          mergeVariantState(armor, next[armor.id].variants, direct.variants),
          direct.pieces,
        ),
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
        variants: applyLegacyPieceState(
          armor,
          mergeVariantState(armor, next[armor.id].variants, inferred.variants),
          inferred.pieces,
        ),
      };
    }
  }

  return next;
}

function saveProgress(progress: Record<string, ArmorProgress>) {
  for (const armor of armors) {
    const state = progress[armor.id] ?? { favorite: false, variants: createVariantState(armor) };
    const key = `${NEW_STATE_PREFIX}${armor.id}`;
    const hasCheckedPieces = Object.values(state.variants).some((variant) => Object.values(variant).some(Boolean));

    if (!hasCheckedPieces && !state.favorite) {
      localStorage.removeItem(key);
      continue;
    }

    localStorage.setItem(
      key,
      JSON.stringify({
        favorite: state.favorite,
        variants: state.variants,
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
  onTogglePiece: (variantId: string, pieceSlot: string) => void;
  onToggleFavorite: () => void;
}) {
  const base = import.meta.env.BASE_URL;
  const hasImage = Boolean(armor.image);
  const totalPieces = countArmorTotalPieces(armor);
  const foundPieces = countArmorFoundPieces(armor, progress);
  const complete = isArmorComplete(armor, progress);
  const completedVariants = countCompletedVariants(armor, progress);
  const armorProgressPercent = percentage(completedVariants, armor.variants.length);
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(armor.variants.map((variant, index) => [variant.id, armor.variants.length === 1 || index === 0])),
  );

  function toggleVariant(variantId: string) {
    setExpandedVariants((current) => ({
      ...current,
      [variantId]: !current[variantId],
    }));
  }

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
              {totalPieces > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-text-muted">
                    <span className={`font-mono font-semibold ${complete ? "text-accent-green" : "text-text-dim"}`}>
                      {foundPieces}/{totalPieces}
                    </span>{" "}
                    pieces found across{" "}
                    <span className={complete ? "text-accent-green" : "text-text-dim"}>
                      {completedVariants}/{armor.variants.length}
                    </span>{" "}
                    variants
                  </p>
                  <ProgressBar
                    value={armorProgressPercent}
                    colorClassName={complete ? "bg-accent-green" : "bg-accent-blue"}
                  />
                </div>
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
            <div className="flex items-center gap-2 text-accent-blue mb-2">
              <MapPin className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-text">Where to find it</h3>
            </div>
            <p className="text-sm text-text-dim leading-relaxed">{armor.where}</p>
            {armor.how && <p className="text-sm text-text-muted leading-relaxed mt-3">{armor.how}</p>}
          </div>

          <div className="rounded-xl border border-dark-700 bg-dark-900/50 p-4">
            <div className="flex items-center gap-2 text-accent-green mb-3">
              <Check className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-text">Variants</h3>
            </div>
            {armor.variants.length > 0 ? (
              <div className="space-y-3">
                {armor.variants.map((variant) => {
                  const variantProgress = progress.variants[variant.id] ?? {};
                  const variantFoundCount = variant.pieces.filter((piece) => variantProgress[piece.slot]).length;
                  const variantComplete = isVariantComplete(variant, variantProgress);
                  const variantProgressPercent = percentage(variantFoundCount, variant.pieces.length);
                  const expanded = expandedVariants[variant.id] ?? false;

                  return (
                    <div
                      key={`${armor.id}-${variant.id}`}
                      className={`rounded-xl border ${
                        variantComplete
                          ? "border-accent-green/30 bg-accent-green/5"
                          : "border-dark-700 bg-dark-800/40"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleVariant(variant.id)}
                        className="w-full flex items-center justify-between gap-3 px-3 py-3 text-left"
                        aria-expanded={expanded}
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-text">{variant.name}</h4>
                          <p className="text-xs text-text-muted mt-1">
                            {variantFoundCount}/{variant.pieces.length} pieces found
                          </p>
                          <div className="mt-2 pr-2">
                            <ProgressBar
                              value={variantProgressPercent}
                              colorClassName={variantComplete ? "bg-accent-green" : "bg-accent-amber"}
                            />
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 text-text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>

                      {expanded && (
                        <div className="px-3 pb-3 pt-1 border-t border-dark-700/70">
                          <div className="flex flex-wrap gap-2">
                            {variant.pieces.map((piece) => {
                              const checked = variantProgress[piece.slot] ?? false;
                              return (
                                <button
                                  key={`${armor.id}-${variant.id}-${piece.slot}`}
                                  type="button"
                                  onClick={() => onTogglePiece(variant.id, piece.slot)}
                                  title={piece.item}
                                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                                    checked
                                      ? "border-accent-green/30 bg-accent-green/10 text-accent-green"
                                      : "border-dark-700 bg-dark-900/60 text-text-secondary hover:border-dark-600 hover:text-text"
                                  }`}
                                >
                                  <span
                                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                      checked
                                        ? "border-accent-green bg-accent-green text-dark-950"
                                        : "border-dark-600 text-transparent"
                                    }`}
                                  >
                                    <Check className="w-3 h-3" />
                                  </span>
                                  {piece.slot}
                                </button>
                              );
                            })}
                          </div>

                          {variant.note && <p className="text-xs text-text-muted mt-3">{variant.note}</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No trackable variants listed for this armor yet.</p>
            )}
          </div>

          {armor.variantNote && <p className="text-xs text-text-muted">{armor.variantNote}</p>}
        </div>
      </div>
    </article>
  );
}

function Header({
  ownedCount,
  totalCount,
  piecesFound,
  piecesTotal,
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
  totalCount: number;
  piecesFound: number;
  piecesTotal: number;
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
                  <span className="text-text-muted">/{totalCount}</span> variants
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-blue" />
                <span className="text-text-dim">
                  <span className="font-mono font-semibold text-accent-blue">{piecesFound}</span>
                  <span className="text-text-muted">/{piecesTotal}</span> pieces
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
              <span className="text-text-muted">/{totalCount}</span> variants
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-blue" />
            <span className="text-text-dim">
              <span className="font-mono font-semibold text-accent-blue">{piecesFound}</span>
              <span className="text-text-muted">/{piecesTotal}</span> pieces
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
    () =>
      armors.reduce(
        (total, armor) => total + armor.variants.filter((variant) => isVariantComplete(variant, progress[armor.id]?.variants?.[variant.id])).length,
        0,
      ),
    [progress],
  );
  const foundPieceCount = useMemo(
    () =>
      armors.reduce(
        (total, armor) => total + countArmorFoundPieces(armor, progress[armor.id]),
        0,
      ),
    [progress],
  );
  const totalPieceCount = useMemo(
    () => armors.reduce((total, armor) => total + countArmorTotalPieces(armor), 0),
    [],
  );
  const totalVariantCount = useMemo(
    () => armors.reduce((total, armor) => total + armor.variants.length, 0),
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
          armor.variants
            .map((variant) => [variant.name, ...variant.pieces.map((piece) => `${piece.slot} ${piece.item}`)].join(" "))
            .join(" "),
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
        variants: current[id]?.variants ?? createVariantState(armor),
        ...updates,
      },
    }));
  }

  function togglePiece(armor: ArmorItem, variantId: string, pieceSlot: string) {
    updateArmor(armor.id, {
      variants: {
        ...(progress[armor.id]?.variants ?? createVariantState(armor)),
        [variantId]: {
          ...(progress[armor.id]?.variants?.[variantId] ?? {}),
          [pieceSlot]: !(progress[armor.id]?.variants?.[variantId]?.[pieceSlot] ?? false),
        },
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
        totalCount={totalVariantCount}
        piecesFound={foundPieceCount}
        piecesTotal={totalPieceCount}
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
                progress={progress[armor.id] ?? { favorite: false, variants: createVariantState(armor) }}
                onTogglePiece={(variantId, pieceSlot) => togglePiece(armor, variantId, pieceSlot)}
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
