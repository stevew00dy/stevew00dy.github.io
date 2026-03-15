import { Flame, Menu, RefreshCw, Download, Upload, RotateCcw, X, Home } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { exportToJson, importFromJson } from "../lib/export";

interface HeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function Header({ loading, onRefresh }: HeaderProps) {
  const [confirming, setConfirming] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
    <header className="sticky top-0 z-50 border-b border-dark-700 bg-dark-900/80 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-amber/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-accent-amber" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Refining Tracker</h1>
            <p className="text-xs text-text-muted leading-tight">Star Citizen 4.7</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-lg transition-all duration-200 text-text-muted hover:text-text hover:bg-dark-800 disabled:opacity-50"
            title="Refresh data from UEX"
            aria-label="Refresh data"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>

          <div ref={navRef} className="relative">
            <button
              onClick={() => { setNavOpen(!navOpen); setConfirming(false); }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                navOpen ? "text-text bg-dark-700" : "text-text-muted hover:text-text hover:bg-dark-800"
              }`}
              aria-label="Open menu"
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
                    onClick={() => { exportToJson(); setNavOpen(false); }}
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
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const { ok, error } = await importFromJson(file);
                        if (ok) window.location.reload();
                        else alert(error || "Invalid backup file");
                      }
                      e.target.value = "";
                    }}
                  />
                  {confirming ? (
                    <div className="px-3 py-2 rounded-lg bg-dark-800/80">
                      <p className="text-xs text-accent-red mb-2">Reset all progress? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            localStorage.removeItem("mining-tools-sessions");
                            localStorage.removeItem("mining-tools-work-orders");
                            setConfirming(false);
                            setNavOpen(false);
                            window.location.reload();
                          }}
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
                <a href="/wikelo-tracker/" className="block px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">Wikelo Tracker</a>
                <a href="/loadout-planner/" className="block px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">FPS Loadout Tracker</a>
                <a href="/refining-tracker/" className="block px-3 py-2 rounded-lg text-xs text-accent-amber font-medium">Refining Tracker</a>
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
