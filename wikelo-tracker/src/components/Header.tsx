import { Package, Download, Upload, RotateCcw, X, Home, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  completedCount: number;
  craftableCount: number;
  totalCount: number;
  onReset: () => void;
}

function exportData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    inventory: JSON.parse(localStorage.getItem("wikelo-inventory") || "{}"),
    tracked: JSON.parse(localStorage.getItem("wikelo-tracked") || "[]"),
    completed: JSON.parse(localStorage.getItem("wikelo-completed") || "[]"),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wikelo-tracker-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      if (typeof data !== "object" || !data) throw new Error("bad format");
      if (data.inventory) localStorage.setItem("wikelo-inventory", JSON.stringify(data.inventory));
      if (data.tracked) localStorage.setItem("wikelo-tracked", JSON.stringify(data.tracked));
      if (data.completed) localStorage.setItem("wikelo-completed", JSON.stringify(data.completed));
      window.location.reload();
    } catch {
      alert("Invalid backup file. Expected a Wikelo Tracker JSON export.");
    }
  };
  reader.readAsText(file);
}

export function Header({ completedCount, craftableCount, totalCount, onReset }: HeaderProps) {
  const [confirming, setConfirming] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    if (!navOpen) return;
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavOpen(false);
        setConfirming(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [navOpen]);

  return (
    <header className="border-b border-dark-700 bg-dark-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-purple/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-accent-purple" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Wikelo Tracker</h1>
            <p className="text-xs text-text-muted">Star Citizen Contract Tracker</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              <span className="text-text-dim">
                <span className="font-mono font-semibold text-accent-green">{completedCount}</span>
                <span className="text-text-muted">/{totalCount}</span> complete
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-amber" />
              <span className="text-text-dim">
                <span className="font-mono font-semibold text-accent-amber">{craftableCount}</span> craftable
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="font-mono font-semibold text-text-dim">{pct}%</span>
              <div className="w-20 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-green rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="relative" ref={navRef}>
            <button
              onClick={() => { setNavOpen(!navOpen); setConfirming(false); }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                navOpen ? "text-text bg-dark-700" : "text-text-muted hover:text-text hover:bg-dark-800"
              }`}
              title="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            {navOpen && (
              <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full sm:mt-2 w-[calc(100vw-1rem)] sm:w-64 max-w-[16rem] p-3 shadow-xl z-50 rounded-xl border border-dark-700 bg-dark-900">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wide">Progress</h3>
                  <button
                    onClick={() => { setNavOpen(false); setConfirming(false); }}
                    className="p-0.5 rounded text-text-muted hover:text-text transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-0.5 mb-2">
                  <button
                    onClick={() => { exportData(); setNavOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
                  >
                    <Download className="w-3.5 h-3.5 text-accent-blue" />
                    Export Progress
                    <span className="ml-auto text-[10px] text-text-muted">.json</span>
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
                  >
                    <Upload className="w-3.5 h-3.5 text-accent-amber" />
                    Import Progress
                    <span className="ml-auto text-[10px] text-text-muted">.json</span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) importData(file);
                      e.target.value = "";
                    }}
                  />
                  {confirming ? (
                    <div className="px-3 py-2 rounded-lg bg-dark-800/80">
                      <p className="text-xs text-accent-red mb-2">Reset all progress? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { onReset(); setConfirming(false); setNavOpen(false); }}
                          className="flex-1 py-1.5 text-xs rounded-md bg-accent-red/20 text-accent-red hover:bg-accent-red/30 transition-colors font-medium"
                        >
                          Yes, reset
                        </button>
                        <button
                          onClick={() => setConfirming(false)}
                          className="flex-1 py-1.5 text-xs rounded-md bg-dark-700 text-text-muted hover:text-text transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirming(true)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-all duration-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset All Progress
                    </button>
                  )}
                </div>
                <div className="border-t border-dark-700 my-2" />
                <h3 className="text-[10px] font-semibold text-text-dim uppercase tracking-wide mb-1.5">Tools</h3>
                <a href="/armor-tracker/" className="block px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">Rare Armor Tracker</a>
                <a href="/exec-hangar-tracker/" className="block px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">Exec Hangar Tracker</a>
                <a href="/wikelo-tracker/" className="block px-3 py-2 rounded-lg text-xs text-accent-amber font-medium">Wikelo Tracker</a>
                <a href="/loadout-planner/" className="block px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">FPS Loadout Tracker</a>
                <a href="/refining-tracker/" className="block px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">Refining Tracker</a>
                <div className="border-t border-dark-700 my-1.5" />
                <a href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">
                  <Home className="w-3.5 h-3.5 text-accent-amber" />
                  Undisputed Noobs
                </a>
                <a href="https://robertsspaceindustries.com/enlist?referral=STAR-23GB-5J3N" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-accent-blue hover:bg-dark-700 transition-all duration-200">
                  Play Star Citizen
                  <span className="text-[10px] text-text-muted">↗</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
