import { useState } from "react";
import { Wrench, Mountain, Car, Rocket } from "lucide-react";
import {
  SHIP_LASERS,
  SHIP_MODULES,
  SHIP_GADGETS,
  SHIP_NOTES,
} from "../data/master/equipment-ship";
import {
  VEHICLE_MINING_HEADS,
  VEHICLE_MODULES,
} from "../data/master/equipment-vehicle";
import {
  HAND_ATTACHMENTS,
  ATLS_GEO_WEAPONS,
  ATLS_GEO_FEATURES,
} from "../data/master/equipment-hand";

type LoadoutTab = "hand" | "vehicle" | "ship";

const TAB_CONFIG: { id: LoadoutTab; label: string; icon: typeof Mountain; context: string }[] = [
  { id: "hand", label: "Hand", icon: Mountain, context: "Caves" },
  { id: "vehicle", label: "Vehicle", icon: Car, context: "Planet (small rocks)" },
  { id: "ship", label: "Ship", icon: Rocket, context: "Space + planet (large)" },
];

function modifierCellClass(val: string | undefined): string {
  const s = (val ?? "").trim();
  if (s.startsWith("+")) return "bg-accent-green/20 text-accent-green";
  if (s.startsWith("-")) return "bg-accent-red/20 text-accent-red";
  return "";
}

function EquipmentTable({
  title,
  columns,
  rows,
  rightAlignCols,
  modifierCols,
  hideOnMobile,
}: {
  title: string;
  columns: string[];
  rows: { cells: (string | undefined)[] }[];
  rightAlignCols?: number[];
  modifierCols?: number[];
  hideOnMobile?: number[];
}) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-sm font-semibold text-text-dim uppercase tracking-wide mb-3">{title}</h3>
      <div className="overflow-x-auto -mx-1.5 rounded-lg border border-dark-700">
        <table className="w-full text-sm min-w-[400px]">
          <thead>
            <tr className="border-b border-dark-700 bg-dark-800/50">
              {columns.map((c, i) => (
                <th
                  key={c}
                  className={`py-2.5 px-3 text-text-dim font-medium ${hideOnMobile?.includes(i) ? "hidden lg:table-cell" : ""} ${modifierCols?.includes(i) ? "w-[5.5rem] min-w-[5.5rem]" : ""} ${rightAlignCols?.includes(i) ? "text-right" : "text-left"}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-dark-700/50 last:border-0 hover:bg-dark-800/50 transition-colors">
                {row.cells.map((cell, j) => {
                  const modClass = modifierCols?.includes(j) ? modifierCellClass(cell) : "";
                  const isMod = modifierCols?.includes(j);
                  const hide = hideOnMobile?.includes(j);
                  return (
                    <td
                      key={j}
                      className={`py-2 px-3 ${hide ? "hidden lg:table-cell" : ""} ${isMod ? "w-[5.5rem] min-w-[5.5rem] align-middle" : ""} ${rightAlignCols?.includes(j) ? "text-right font-mono tabular-nums" : ""}`}
                    >
                      {modClass ? (
                        <span className={`inline-block px-2 py-0.5 rounded text-center min-w-[4rem] ${modClass}`}>
                          {cell ?? "—"}
                        </span>
                      ) : (
                        cell ?? "—"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Loadouts() {
  const [subTab, setSubTab] = useState<LoadoutTab>("ship");

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Wrench size={18} className="text-accent-amber" />
          Loadouts & Components
        </h2>
        <p className="text-sm text-text-dim mb-4">
          Mining equipment by context. <strong>Hand</strong> (multi-tool, ATLS Geo exosuit). <strong>Vehicle</strong> (planet, smaller rocks only). <strong>Ship</strong> (space + planet large rocks). On smaller screens, some columns hide — scroll horizontally for full data.
        </p>

        <div className="flex gap-1 border border-dark-700 rounded-lg p-0.5 mb-6">
          {TAB_CONFIG.map(({ id, label, icon: Icon, context }) => (
            <button
              key={id}
              onClick={() => setSubTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                subTab === id ? "bg-accent-amber/20 text-accent-amber" : "text-text-dim hover:text-text"
              }`}
            >
              <Icon size={14} />
              {label}
              <span className="text-[10px] opacity-75">({context})</span>
            </button>
          ))}
        </div>

        {subTab === "hand" && (
          <>
            <EquipmentTable
              title="Attachments"
              columns={["Name", "Effect", "Notes"]}
              rows={HAND_ATTACHMENTS.map((a) => ({
                cells: [a.name, a.effect, a.notes],
              }))}
            />
            <EquipmentTable
              title="ATLS Geo (exosuit)"
              columns={["Name", "Notes"]}
              rows={ATLS_GEO_WEAPONS.map((w) => ({
                cells: [w.name, w.notes],
              }))}
            />
            <EquipmentTable
              title="ATLS Geo — Built-in"
              columns={["Name", "Effect", "Notes"]}
              rows={ATLS_GEO_FEATURES.map((f) => ({
                cells: [f.name, f.effect, f.notes],
              }))}
            />
          </>
        )}

        {subTab === "vehicle" && (
          <>
            <EquipmentTable
              title="Mining Heads (ROC)"
              columns={["Name", "Vehicle", "Notes"]}
              rows={VEHICLE_MINING_HEADS.map((h) => ({
                cells: [h.name, h.vehicle, h.notes],
              }))}
            />
            <EquipmentTable
              title="Modules"
              columns={["Name", "Type", "Effect", "Debuff"]}
              rows={VEHICLE_MODULES.map((m) => ({
                cells: [m.name, m.type, m.effect, m.debuff],
              }))}
            />
          </>
        )}

        {subTab === "ship" && (
          <div className="space-y-8">
            <div>
              <EquipmentTable
                title="Lasers"
                columns={["Name", "Size", "Slots", "Opt Range", "Max Range", "Min Power %", "Min", "Max", "Extract", "Resistance", "Instability", "Charge Rate", "Charge Window", "Inert", "Notes"]}
                modifierCols={[9, 10, 11, 12, 13]}
                hideOnMobile={[3, 4, 5, 6, 7]}
                rows={SHIP_LASERS.map((l) => ({
                  cells: [
                    l.name,
                    l.size > 0 ? l.size.toString() : "S0",
                    l.slots.toString(),
                    l.optRange?.toString(),
                    l.maxRange?.toString(),
                    l.minPowerPct != null ? `${l.minPowerPct}%` : undefined,
                    l.minPower?.toString(),
                    l.maxPower?.toString(),
                    l.extractPower?.toString(),
                    l.resistance,
                    l.instability,
                    l.chargeRate,
                    l.chargeWindow,
                    l.inertMaterials,
                    l.notes,
                  ],
                }))}
                rightAlignCols={[1, 2, 3, 4, 5, 6, 7, 8]}
              />
            </div>
            <div>
              <EquipmentTable
                title="Modules"
                columns={["Name", "Type", "Power", "Resistance", "Instability", "Charge Rate", "Charge Window", "Inert", "Overcharge", "Clustering", "Extract Mod", "Notes"]}
                modifierCols={[2, 3, 4, 5, 6, 7, 8, 9, 10]}
                hideOnMobile={[5, 6, 7, 8, 9]}
                rows={SHIP_MODULES.map((m) => ({
                  cells: [
                    m.name,
                    m.type,
                    m.laserPowerMod,
                    m.resistance,
                    m.instability,
                    m.chargeRate,
                    m.chargeWindow,
                    m.inertMaterials,
                    m.overchargeRate,
                    m.clustering,
                    m.extractPowerMod,
                    m.notes,
                  ],
                }))}
                rightAlignCols={[]}
              />
            </div>
            <div>
              <EquipmentTable
                title="Gadgets"
                columns={["Name", "Power", "Resistance", "Instability", "Charge Rate", "Charge Window", "Clustering", "Extract Mod", "Notes"]}
                modifierCols={[1, 2, 3, 4, 5, 6, 7]}
                hideOnMobile={[4, 5, 6]}
                rows={SHIP_GADGETS.map((g) => ({
                  cells: [
                    g.name,
                    g.laserPowerMod,
                    g.resistance,
                    g.instability,
                    g.chargeRate,
                    g.chargeWindow,
                    g.clustering,
                    g.extractPowerMod,
                    g.notes,
                  ],
                }))}
              />
            </div>
            {Object.keys(SHIP_NOTES).length > 0 && (
              <div className="p-4 rounded-lg bg-dark-800/50 border border-dark-700">
                <h3 className="text-sm font-semibold text-text-dim uppercase tracking-wide mb-3">Ship Notes</h3>
                <ul className="space-y-2 text-sm text-text-dim">
                  {Object.entries(SHIP_NOTES).map(([ship, note]) => (
                    <li key={ship} className="flex gap-2">
                      <span className="font-medium text-text shrink-0">{ship}:</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
