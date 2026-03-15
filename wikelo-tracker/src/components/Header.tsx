import { Package, Menu } from "lucide-react";
import { AppNavDropdown, NavExportButton, NavImportButton, NavResetButton } from "../../../shared/AppNavDropdown";
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
              <AppNavDropdown
                activePath="/wikelo-tracker/"
                onClose={() => { setNavOpen(false); setConfirming(false); }}
                progressSection={
                  <>
                    <NavExportButton onClick={() => { exportData(); setNavOpen(false); }} />
                    <NavImportButton
                      inputRef={fileRef}
                      onClick={() => fileRef.current?.click()}
                      onFileChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) importData(file);
                        e.target.value = "";
                      }}
                    />
                    <NavResetButton
                      confirming={confirming}
                      onResetClick={() => setConfirming(true)}
                      onConfirmReset={() => { onReset(); setConfirming(false); setNavOpen(false); }}
                      onCancel={() => setConfirming(false)}
                    />
                  </>
                }
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
