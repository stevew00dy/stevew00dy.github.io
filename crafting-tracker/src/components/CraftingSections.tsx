import { useEffect, useState, type ReactNode } from "react";
import { Beaker, Boxes, ChevronDown, CircleAlert, MapPinned } from "lucide-react";
import type { CraftingItem } from "../data";
import type {
  CraftabilitySummary,
  InputQualitiesState,
  SetInputQualities,
} from "../lib/craftingUtils";
import {
  clampQuality,
  detailLabel,
  formatDeltaPercent,
  formatOutputValue,
  formatOwned,
  formatProvenanceTitle,
  formatQuantity,
  outputStatRows,
  sliderKey,
  typeClasses,
} from "../lib/craftingUtils";

const UNRESOLVED_FIELD_LABEL = "Unknown";
const NO_MISSION_SOURCE_TITLE = "No mission source mapped";
const NO_MISSION_SOURCE_BODY = "This blueprint has no mission source mapped in the current dataset.";
const NO_OUTPUT_STATS_TITLE = "No mapped output stats";
const NO_OUTPUT_STATS_BODY =
  "This recipe has no output stats with both a source-backed base value and a mapped crafting effect in the current dataset.";

type MaterialInventoryReader = {
  get: (materialKey: string) => number;
};

export function SectionHeader(props: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark-700 bg-dark-800">
        {props.icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-text">{props.title}</h2>
        <p className="text-sm text-text-muted">{props.description}</p>
      </div>
    </div>
  );
}

export function FilterChip(props: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  tone?: "blue" | "amber";
}) {
  const activeClass =
    props.tone === "amber"
      ? "border-accent-amber/30 bg-accent-amber/12 text-accent-amber"
      : "border-accent-blue/30 bg-accent-blue/12 text-accent-blue";

  return (
    <button
      onClick={props.onClick}
      className={`inline-flex min-h-[34px] items-center justify-center rounded-lg border px-3.5 py-2 text-sm font-medium leading-none transition-colors ${
        props.active
          ? activeClass
          : "border-dark-700 bg-dark-900/70 text-text-dim hover:text-text"
      } ${props.className ?? ""}`}
    >
      {props.children}
    </button>
  );
}

export function FilterGroup(props: { label: string; hint?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`filter-group min-w-[220px] self-start ${props.className ?? ""}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">{props.label}</p>
        {props.hint && <p className="text-[11px] text-text-muted">{props.hint}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{props.children}</div>
    </div>
  );
}

export function TableSortHeader(props: {
  label: string;
  active: boolean;
  descending: boolean;
  align?: "left" | "center" | "right";
  onClick: () => void;
}) {
  const justifyClass =
    props.align === "right" ? "justify-end" : props.align === "center" ? "justify-center" : "justify-start";
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`inline-flex w-full items-center gap-1.5 ${justifyClass} text-left transition-colors ${
        props.active ? "text-text" : "text-text-muted hover:text-text-dim"
      }`}
      aria-label={`Sort by ${props.label}`}
      aria-pressed={props.active}
    >
      <span>{props.label}</span>
      <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${props.descending ? "rotate-0" : "rotate-180"}`} />
    </button>
  );
}

export function CollapsibleSection(props: {
  icon: ReactNode;
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="panel-muted overflow-hidden" open={props.defaultOpen ?? true}>
      <summary className="flex list-none items-start justify-between gap-4 px-4 py-4">
        <div className="min-w-0 flex-1">
          <SectionHeader icon={props.icon} title={props.title} description={props.description} />
        </div>
        <span className="details-chevron inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark-700 bg-dark-900/70 text-text-dim transition-transform">
          <ChevronDown className="h-4 w-4" />
        </span>
      </summary>
      <div className="border-t border-dark-700 px-4 pb-4 pt-4">{props.children}</div>
    </details>
  );
}

function SourceMetaChip(props: { tone?: "neutral" | "amber" | "blue"; children: ReactNode }) {
  const toneClass =
    props.tone === "amber"
      ? "border-accent-amber/20 bg-accent-amber/10 text-accent-amber"
      : props.tone === "blue"
        ? "border-accent-blue/20 bg-accent-blue/10 text-accent-blue"
        : "border-dark-700 bg-dark-800 text-text-dim";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClass}`}>
      {props.children}
    </span>
  );
}

export function MissionSourceCard(props: { source: CraftingItem["blueprintSources"][number] }) {
  const missionType = props.source.missionType.trim() || UNRESOLVED_FIELD_LABEL;
  const location = props.source.location.trim() || UNRESOLVED_FIELD_LABEL;

  return (
    <div className="mission-source-card rounded-xl border border-dark-700 px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text">{props.source.missionName}</p>
          <p className="mt-1 text-xs text-text-muted">{props.source.missionGiver}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <SourceMetaChip tone="amber">{missionType}</SourceMetaChip>
          <SourceMetaChip tone="blue">{`Location: ${location}`}</SourceMetaChip>
        </div>
      </div>
    </div>
  );
}

export function MissionPoolDropdown(props: { item: CraftingItem; align?: "left" | "right" }) {
  return (
    <details
      className="relative"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <summary className="flex list-none items-center justify-end">
        <span className="inline-flex items-center gap-1 rounded-lg border border-dark-700 bg-dark-900/70 px-2.5 py-1 text-[11px] text-text-dim transition-colors hover:text-text">
          <MapPinned className="h-3.5 w-3.5 text-accent-amber" />
          <span className="font-mono">{props.item.blueprintSources.length}</span>
        </span>
      </summary>
      <div
        className={`absolute z-30 mt-2 min-w-[320px] overflow-hidden rounded-xl border border-dark-700 bg-dark-950/98 shadow-2xl ${
          props.align === "left" ? "left-0" : "right-0"
        }`}
      >
        <div className="border-b border-dark-700 bg-dark-900/70 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Linked missions</p>
          <p className="mt-1 text-xs text-text-muted">
            {props.item.blueprintSources.length} source{props.item.blueprintSources.length === 1 ? "" : "s"} found
          </p>
        </div>
        <div className="space-y-3 px-4 py-3">
          {props.item.blueprintSources.map((source) => (
            <MissionSourceCard key={`${props.item.id}-${source.missionGiver}-${source.missionName}-${source.location}`} source={source} />
          ))}
        </div>
      </div>
    </details>
  );
}

export function MaterialShortageIndicator(props: { summary: CraftabilitySummary }) {
  if (props.summary.craftable) {
    return <span className="text-xs text-text-muted">-</span>;
  }

  const missingItems = props.summary.requirements.filter((requirement) => requirement.shortfall > 0.0001);

  return (
    <details
      className="relative"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <summary className="flex list-none items-center justify-center">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-accent-amber/25 bg-accent-amber/10 text-accent-amber transition-colors hover:border-accent-amber/40 hover:text-accent-amber">
          <CircleAlert className="h-4 w-4" />
        </span>
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-[280px] overflow-hidden rounded-xl border border-dark-700 bg-dark-950/98 shadow-2xl">
        <div className="border-b border-dark-700 bg-dark-900/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-amber">Missing materials</p>
          <p className="mt-1 text-sm text-text-muted">{props.summary.shortageLabel}</p>
        </div>
        <div className="px-4 py-3">
          <div className="space-y-2">
            {missingItems.map((requirement) => (
              <div key={requirement.materialKey} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-text">{requirement.name}</span>
                <span className="text-right text-text-muted">{formatOwned(requirement.shortfall, requirement.unit)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}

export function RequirementEffectsHover(props: { slot: string; effects: string[] }) {
  if (props.effects.length === 0) {
    return <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-text-muted">{props.slot}</p>;
  }

  return (
    <div className="group/slot requirement-slot-hover relative mt-1 inline-flex cursor-help items-center" tabIndex={0}>
      <p className="text-[11px] uppercase tracking-[0.14em] text-text-muted">{props.slot}</p>
      <div className="requirement-slot-popover pointer-events-none absolute left-0 top-full z-20 mt-2 min-w-[220px] translate-y-1 rounded-xl border border-dark-700 bg-dark-950/98 p-3 opacity-0 shadow-2xl transition-all duration-150 group-hover/slot:pointer-events-auto group-hover/slot:translate-y-0 group-hover/slot:opacity-100 group-focus-within/slot:pointer-events-auto group-focus-within/slot:translate-y-0 group-focus-within/slot:opacity-100">
        <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-text-muted">Affected stats</p>
        <div className="overflow-hidden rounded-lg border border-dark-700/80 bg-dark-900/70">
          <div className="grid grid-cols-[1fr] border-b border-dark-700/80 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-text-muted">
            <span>Stat</span>
          </div>
          <div>
            {props.effects.map((effect) => (
              <div key={`${props.slot}-${effect}`} className="border-b border-dark-700/60 px-3 py-2 text-xs text-text last:border-b-0">
                {effect}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CraftingExpandedRow(props: {
  item: CraftingItem;
  inputQualities: InputQualitiesState;
  setInputQualities: SetInputQualities;
  materialInventory: MaterialInventoryReader;
  craftability: CraftabilitySummary;
  qualityBaseline: number;
  onFindMaterial?: (materialName: string) => void;
}) {
  const [selectedRequirementSlot, setSelectedRequirementSlot] = useState<string | null>(null);
  const [qualityDrafts, setQualityDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedRequirementSlot(null);
    setQualityDrafts({});
  }, [props.item.id]);

  const selectedInputs = props.item.inputs.map((input) => ({
    ...input,
    quality: props.inputQualities[sliderKey(props.item.id, input.slot)] ?? props.qualityBaseline,
  }));

  const aggregateQuality = Math.round(
    selectedInputs.reduce((sum, input) => sum + input.quality, 0) / Math.max(selectedInputs.length, 1),
  );
  const coveredRequirements = props.craftability.requirements.filter((requirement) => requirement.shortfall <= 0.0001).length;
  const missingRequirements = props.craftability.requirements.length - coveredRequirements;
  const outputRows = outputStatRows(props.item, props.inputQualities, props.qualityBaseline);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <CollapsibleSection
        icon={<Boxes className="h-5 w-5 text-accent-blue" />}
        title="Requirements"
        description="Use the Material Inventory above to check what you have, adjust material quality to preview the output on the right, and click a material to see which stats it affects."
        defaultOpen
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-accent-blue/20 bg-accent-blue/10 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Craft time</p>
              <p className="font-mono text-xl text-accent-blue">{props.item.craftTime}</p>
            </div>
            <div className="rounded-xl border border-dark-700 bg-dark-900/70 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Inputs</p>
              <p className="font-mono text-xl text-text">{selectedInputs.length}</p>
            </div>
            <div className="rounded-xl border border-accent-green/20 bg-accent-green/10 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Covered</p>
              <p className="font-mono text-xl text-accent-green">{coveredRequirements}</p>
            </div>
            <div className="rounded-xl border border-accent-amber/20 bg-accent-amber/10 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Missing</p>
              <p className="font-mono text-xl text-accent-amber">{missingRequirements}</p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {selectedInputs.map((input) => {
              const key = sliderKey(props.item.id, input.slot);
              const draftValue = qualityDrafts[key] ?? String(input.quality);
              const owned = props.materialInventory.get(input.materialKey);
              const shortfall = Math.max(0, input.amount - owned);
              const isSelected = selectedRequirementSlot === input.slot;
              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedRequirementSlot((current) => (current === input.slot ? null : input.slot))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedRequirementSlot((current) => (current === input.slot ? null : input.slot));
                    }
                  }}
                  className={`requirement-card rounded-xl border border-dark-700 p-3.5 transition-colors ${
                    isSelected ? "requirement-card-active" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold leading-none text-text">{input.requirement}</h3>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${typeClasses(input.type)}`}>
                          {input.type}
                        </span>
                        {props.onFindMaterial && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              props.onFindMaterial?.(input.requirement);
                            }}
                            onKeyDown={(event) => event.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded-full border border-accent-green/20 bg-accent-green/10 px-2.5 py-1 text-[11px] font-medium text-accent-green transition-colors hover:border-accent-green/35"
                            aria-label={`Find ${input.requirement} locations`}
                          >
                            <MapPinned className="h-3.5 w-3.5" />
                            Find
                          </button>
                        )}
                      </div>
                      <RequirementEffectsHover slot={input.slot} effects={input.effects} />
                    </div>

                    <div className="grid min-w-[16rem] grid-cols-3 gap-2 self-start">
                      <div className="requirement-metric rounded-lg border border-dark-700 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-text-muted">Required</p>
                        <p className="mt-1 text-sm font-semibold text-text">{formatQuantity(input.amount, input.unit)}</p>
                      </div>
                      <div className="requirement-metric rounded-lg border border-dark-700 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-text-muted">Owned</p>
                        <p className="mt-1 text-sm font-semibold text-text">{formatOwned(owned, input.unit)}</p>
                      </div>
                      <div
                        className={`rounded-lg border px-3 py-2 ${
                          shortfall > 0 ? "border-accent-amber/20 bg-accent-amber/10" : "border-accent-green/20 bg-accent-green/10"
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.14em] text-text-muted">Status</p>
                        <p className={`mt-1 text-sm font-semibold ${shortfall > 0 ? "text-accent-amber" : "text-accent-green"}`}>
                          {shortfall > 0 ? `Need ${formatOwned(shortfall, input.unit)}` : "Ready"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border border-dark-700 bg-dark-900/55 px-3 py-3">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-text-muted">Material quality</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="1"
                        value={input.quality}
                        onChange={(event) =>
                          props.setInputQualities((current) => ({
                            ...current,
                            [key]: clampQuality(Number(event.target.value), props.qualityBaseline),
                          }))
                        }
                        className="requirement-quality-slider w-full accent-[var(--color-accent-blue)]"
                      />
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        step="1"
                        value={draftValue}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          const nextRaw = event.target.value;
                          setQualityDrafts((current) => ({ ...current, [key]: nextRaw }));
                          if (nextRaw.trim() === "") return;

                          const parsed = Number(nextRaw);
                          if (!Number.isFinite(parsed)) return;

                          props.setInputQualities((current) => ({
                            ...current,
                            [key]: clampQuality(parsed, props.qualityBaseline),
                          }));
                        }}
                        onBlur={() => {
                          const raw = qualityDrafts[key];
                          if (raw === undefined) return;

                          const trimmed = raw.trim();
                          if (trimmed === "") {
                            setQualityDrafts((current) => {
                              const next = { ...current };
                              delete next[key];
                              return next;
                            });
                            return;
                          }

                          const parsed = Number(trimmed);
                          props.setInputQualities((current) => ({
                            ...current,
                            [key]: clampQuality(parsed, props.qualityBaseline),
                          }));
                          setQualityDrafts((current) => {
                            const next = { ...current };
                            delete next[key];
                            return next;
                          });
                        }}
                        className="w-20 rounded-lg border border-dark-700 bg-dark-900/80 px-3 py-2 text-right font-mono text-sm font-semibold text-text-secondary outline-none transition-colors focus:border-accent-blue/40 focus:text-text"
                        aria-label={`${input.slot} material quality`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CollapsibleSection>

      <div className="space-y-5">
        <CollapsibleSection
          icon={<Beaker className="h-5 w-5 text-accent-blue" />}
          title="Output Quality"
          description="All mapped stat changes, with baseline and adjusted values based on your current material quality."
          defaultOpen
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-accent-blue/20 bg-accent-blue/10 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-text-dim">Fabricated Item Quality</span>
                <span className="font-mono text-2xl text-accent-blue">{aggregateQuality}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-dark-800">
                <div className="h-full bg-gradient-to-r from-accent-red via-accent-amber to-accent-green" style={{ width: `${aggregateQuality / 10}%` }} />
              </div>
            </div>

            {outputRows.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-dark-700 bg-dark-900/65">
                <div className="grid grid-cols-[1.15fr_0.75fr_0.9fr_0.75fr] gap-3 border-b border-dark-700 bg-dark-900/70 px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-text-muted">
                  <span>Stat</span>
                  <span>Base</span>
                  <span>New</span>
                  <span>Delta</span>
                </div>
                <div>
                  {outputRows.map((row) => (
                    <div
                      key={`${props.item.id}-${row.stat}-${row.affectedBy.join("-") || "base"}`}
                      className={`grid grid-cols-[1.15fr_0.75fr_0.9fr_0.75fr] gap-3 border-b border-dark-700/70 px-4 py-3 last:border-b-0 ${
                        selectedRequirementSlot && row.affectedBy.includes(selectedRequirementSlot) ? "output-row-active" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="cursor-help text-sm font-semibold text-text" title={formatProvenanceTitle(row.provenance)}>
                          {row.stat}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          {row.affectedBy.length > 0 ? `Affected by ${row.affectedBy.join(", ")}` : "Base item stat"}
                        </p>
                      </div>
                      <div className="text-sm text-text-secondary">
                        {formatOutputValue(row.baseValue, row.unit, row.precision, row.valueKind)}
                      </div>
                      <div className="text-sm">
                        <span
                          className={
                            row.trend === "better"
                              ? "text-accent-green"
                              : row.trend === "worse"
                                ? "text-accent-red"
                                : "text-text"
                          }
                        >
                          {formatOutputValue(row.nextValue, row.unit, row.precision, row.valueKind)}
                        </span>
                      </div>
                      <div
                        className={`text-sm ${
                          row.deltaPercent > 0.0001
                            ? "text-accent-green"
                            : row.deltaPercent < -0.0001
                              ? "text-accent-red"
                              : "text-text-muted"
                        }`}
                      >
                        {formatDeltaPercent(row.deltaPercent)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dark-700 bg-dark-900/65 px-4 py-3">
                <p className="text-sm font-semibold text-text">{NO_OUTPUT_STATS_TITLE}</p>
                <p className="mt-1 text-xs text-text-muted">{NO_OUTPUT_STATS_BODY}</p>
              </div>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          icon={<MapPinned className="h-5 w-5 text-accent-amber" />}
          title="Blueprint Source"
          description="Missions currently linked to this blueprint."
          defaultOpen={false}
        >
          <div className="space-y-3">
            {props.item.blueprintSources.length > 0 ? (
              <>
                {props.item.blueprintSources.map((source) => (
                  <MissionSourceCard
                    key={`${props.item.id}-${source.missionGiver}-${source.missionName}-${source.location}`}
                    source={source}
                  />
                ))}
                <MissionPoolDropdown item={props.item} align="left" />
              </>
            ) : (
              <div className="rounded-xl border border-dark-700 bg-dark-900/65 px-4 py-3">
                <p className="text-sm font-semibold text-text">{NO_MISSION_SOURCE_TITLE}</p>
                <p className="mt-1 text-xs text-text-muted">{NO_MISSION_SOURCE_BODY}</p>
              </div>
            )}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function BlueprintStatCard(props: {
  label: string;
  value: number;
  valueClassName: string;
  className: string;
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${props.className}`}>
      <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">{props.label}</p>
      <p className={`mt-2 font-mono text-2xl ${props.valueClassName}`}>{props.value}</p>
    </div>
  );
}

export function BlueprintOverviewPanel(props: {
  totalCount: number;
  ownedCount: number;
  missingCount: number;
  linkedCount: number;
}) {
  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Overall Stats</h2>
          <p className="mt-1 text-sm text-text-muted">
            Collection progress and mission-source coverage across every blueprint in the tracker.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{props.totalCount} total blueprints</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <BlueprintStatCard
          label="Total blueprints"
          value={props.totalCount}
          valueClassName="text-accent-blue"
          className="border-accent-blue/20 bg-accent-blue/10"
        />
        <BlueprintStatCard
          label="Owned blueprints"
          value={props.ownedCount}
          valueClassName="text-accent-green"
          className="border-accent-green/20 bg-accent-green/10"
        />
        <BlueprintStatCard
          label="Missing blueprints"
          value={props.missingCount}
          valueClassName="text-text"
          className="border-dark-700 bg-dark-900/70"
        />
        <BlueprintStatCard
          label="Mission-linked"
          value={props.linkedCount}
          valueClassName="text-accent-amber"
          className="border-accent-amber/20 bg-accent-amber/10"
        />
      </div>
    </section>
  );
}

export function BlueprintExpandedRow(props: {
  item: CraftingItem;
  isOwned: boolean;
  onToggleOwned: () => void;
  onFindMaterial?: (materialName: string) => void;
}) {
  const blueprintStatus =
    props.item.blueprintStatus === "mapped"
      ? "Source mapped"
      : props.item.blueprintStatus === "partial"
        ? "Source partial"
        : "Source unknown";

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-dark-700 bg-dark-900/65 px-4 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Blueprint details</p>
            <h3 className="mt-2 text-lg font-semibold text-text">{props.item.blueprintName}</h3>
            <p className="mt-1 text-sm text-text-muted">{props.item.blueprintNote}</p>
          </div>
          <button
            type="button"
            onClick={props.onToggleOwned}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
              props.isOwned
                ? "border-accent-green/30 bg-accent-green/12 text-accent-green"
                : "border-accent-red/30 bg-accent-red/12 text-accent-red hover:border-accent-red/45"
            }`}
          >
            {props.isOwned ? "Owned" : "Mark owned"}
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border border-dark-700 bg-dark-900/70 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Crafts</p>
            <p className="mt-2 text-sm font-semibold text-text">{props.item.name}</p>
          </div>
          <div className="rounded-xl border border-dark-700 bg-dark-900/70 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Type</p>
            <p className="mt-2 text-sm font-semibold text-text">{props.item.category}</p>
          </div>
          <div className="rounded-xl border border-dark-700 bg-dark-900/70 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Detail</p>
            <p className="mt-2 text-sm font-semibold text-text">{detailLabel(props.item)}</p>
          </div>
          <div className="rounded-xl border border-dark-700 bg-dark-900/70 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Manufacturer</p>
            <p className="mt-2 text-sm font-semibold text-text">{props.item.manufacturer}</p>
          </div>
          <div className="rounded-xl border border-dark-700 bg-dark-900/70 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Craft time</p>
            <p className="mt-2 font-mono text-sm font-semibold text-accent-blue">{props.item.craftTime}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-dark-700 bg-dark-900/70 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Source status</p>
            <p className="mt-2 text-sm font-semibold text-text">{blueprintStatus}</p>
          </div>
          <div className="rounded-xl border border-dark-700 bg-dark-900/70 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Mission sources</p>
            <p className="mt-2 text-sm font-semibold text-text">
              {props.item.blueprintSources.length} mission{props.item.blueprintSources.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="rounded-xl border border-dark-700 bg-dark-900/70 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Recipe inputs</p>
            <p className="mt-2 text-sm font-semibold text-text">{props.item.inputs.length} inputs</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Recipe inputs</p>
          <div className="mt-3 overflow-hidden rounded-xl border border-dark-700 bg-dark-900/65">
            <div className="grid grid-cols-[0.8fr_1.3fr_0.9fr] gap-3 border-b border-dark-700 px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-text-muted">
              <span>Slot</span>
              <span>Material</span>
              <span>Amount</span>
            </div>
            <div>
              {props.item.inputs.map((input) => (
                <div
                  key={`${props.item.id}-${input.slot}`}
                  className="grid grid-cols-[0.8fr_1.3fr_0.9fr] gap-3 border-b border-dark-700/70 px-4 py-3 text-sm last:border-b-0"
                >
                  <span className="text-text-secondary">{input.slot}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-text">{input.requirement}</span>
                    {props.onFindMaterial && (
                      <button
                        type="button"
                        onClick={() => props.onFindMaterial?.(input.requirement)}
                        className="inline-flex items-center gap-1 rounded-full border border-accent-green/20 bg-accent-green/10 px-2 py-0.5 text-[11px] font-medium text-accent-green transition-colors hover:border-accent-green/35"
                        aria-label={`Find ${input.requirement} locations`}
                      >
                        <MapPinned className="h-3.5 w-3.5" />
                        Find
                      </button>
                    )}
                  </div>
                  <span className="text-text-muted">{formatQuantity(input.amount, input.unit)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-dark-700 bg-dark-900/65 px-4 py-4">
        <SectionHeader
          icon={<MapPinned className="h-5 w-5 text-accent-amber" />}
          title="Mission Sources"
          description="Expanded mission, giver, and location details for this blueprint."
        />

        <div className="mt-4 space-y-3">
          {props.item.blueprintSources.length > 0 ? (
            props.item.blueprintSources.map((source) => (
              <MissionSourceCard
                key={`${props.item.id}-${source.missionGiver}-${source.missionName}-${source.location}`}
                source={source}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dark-700 bg-dark-900/65 px-4 py-3">
              <p className="text-sm font-semibold text-text">{NO_MISSION_SOURCE_TITLE}</p>
              <p className="mt-1 text-xs text-text-muted">{NO_MISSION_SOURCE_BODY}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
