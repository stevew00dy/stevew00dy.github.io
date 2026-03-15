import { useState, useRef, useEffect } from "react";
import { Radio } from "lucide-react";
import { RS_SIGNATURES, getClusterSignature } from "../data/master/rs-signatures";
import { ORE_TYPES } from "../data/master";
import type { RarityTier } from "../types/master";
import { LocationPills } from "./LocationPills";

const RARITY_ORDER: RarityTier[] = ["common", "uncommon", "rare", "epic", "legendary"];
const CLUSTER_SIZES = [1, 2, 3, 4, 5, 6] as const;
const locationByOreId = Object.fromEntries(ORE_TYPES.map((o) => [o.id, o.locationTypes ?? []]));

const RARITY_COLORS: Record<RarityTier, string> = {
  common: "text-text-dim",
  uncommon: "text-accent-green",
  rare: "text-accent-blue",
  epic: "text-accent-purple",
  legendary: "text-accent-amber",
};

function rowMatchesSignature(row: { baseSignature: number }, searchVal: number): boolean {
  return CLUSTER_SIZES.some((n) => getClusterSignature(row.baseSignature, n) === searchVal);
}

export default function RSSignatures() {
  const [signatureSearch, setSignatureSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/") return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      e.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const sorted = [...RS_SIGNATURES].sort((a, b) => {
    const rarityA = RARITY_ORDER.indexOf(a.rarity);
    const rarityB = RARITY_ORDER.indexOf(b.rarity);
    if (rarityA !== rarityB) return rarityA - rarityB;
    return b.baseSignature - a.baseSignature;
  });

  const searchVal = signatureSearch.trim() ? parseInt(signatureSearch.replace(/,/g, ""), 10) : NaN;
  const isValidSearch = !isNaN(searchVal) && searchVal > 0;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Radio size={18} className="text-accent-amber" />
          RS Signatures — Scan Lookup
        </h2>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div className="text-sm text-text-dim leading-tight space-y-0.5">
            <p>When you scan, the signature value = base × cluster size. Use this table to identify what you found.</p>
            <p>Each rock has <strong>1 material</strong>. Numbers 1–6 = cluster size (rocks in cluster).</p>
          </div>
          <label className="flex flex-col gap-1.5 shrink-0">
            <span className="text-sm text-text-dim">Search signature:</span>
            <input
              ref={searchInputRef}
              type="text"
              inputMode="numeric"
              placeholder="e.g. 4300"
              title="Press / to focus"
              value={signatureSearch}
              onChange={(e) => setSignatureSearch(e.target.value)}
              className="w-48 min-w-[12rem] px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-600 text-base font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-accent-amber/50"
            />
          </label>
        </div>

        <div className="overflow-x-auto -mx-1.5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-600">
                <th className="text-left py-2 px-3 text-text-dim font-medium">Rock</th>
                <th className="text-left py-2 px-3 text-text-dim font-medium">Rarity</th>
                <th className="text-left py-2 px-3 text-text-dim font-medium">Location</th>
                <th colSpan={6} className="text-center py-1.5 px-3 text-text-dim font-medium">
                  Clusters
                </th>
              </tr>
              <tr className="border-b border-dark-700">
                <th className="py-0" />
                <th className="py-0" />
                <th className="py-0" />
                {CLUSTER_SIZES.map((n) => (
                  <th key={n} className="text-right py-2 px-3 text-text-dim font-medium">
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const isHighlighted = isValidSearch && rowMatchesSignature(row, searchVal);
                return (
                <tr
                  key={row.oreId}
                  className={`border-b border-dark-700/50 hover:bg-dark-800/50 transition-colors ${
                    isHighlighted ? "bg-accent-amber/15 ring-1 ring-inset ring-accent-amber/40" : ""
                  }`}
                >
                  <td className="py-2 px-3 font-medium">{row.name}</td>
                  <td className={`py-2 px-3 capitalize font-medium ${RARITY_COLORS[row.rarity]}`}>{row.rarity}</td>
                  <td className="py-2 px-3">
                    <LocationPills types={locationByOreId[row.oreId]} />
                  </td>
                  {CLUSTER_SIZES.map((n) => {
                    const cellVal = getClusterSignature(row.baseSignature, n);
                    const cellMatches = isValidSearch && cellVal === searchVal;
                    return (
                      <td
                        key={n}
                        className={`py-2 px-3 text-right font-mono tabular-nums ${
                          cellMatches ? "text-accent-amber font-semibold" : "text-text-dim"
                        }`}
                      >
                        {cellVal.toLocaleString()}
                      </td>
                    );
                  })}
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-dark-800 border border-dark-700 text-xs text-text-dim space-y-1">
          <p><strong>Asteroid vs Planet:</strong> Same base signature for both — observed in-game for space asteroids and planet/moon surface rocks.</p>
          <p><strong>Note:</strong> RS on planets/moons can be unreliable; more reliable in asteroid fields. Stanton ice clusters can have up to ~10 rocks.</p>
        </div>
      </div>
    </div>
  );
}
