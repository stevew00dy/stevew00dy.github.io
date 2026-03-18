import { Flame, Menu, RefreshCw } from "lucide-react";
import { AppNavDropdown, NavExportAllButton, NavExportButton, NavImportButton, NavResetButton } from "../../../shared/AppNavDropdown";
import { useState, useRef, useEffect } from "react";
import { exportToJson, importFromJson } from "../lib/export";
import { exportAllToolsData } from "../../../shared/exportAllTools";

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
        <a
          href="/"
          className="flex items-center gap-3 rounded-lg transition-colors hover:text-accent-amber focus:outline-none focus:ring-2 focus:ring-accent-amber/40"
        >
          <div className="w-9 h-9 rounded-lg bg-accent-amber/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-accent-amber" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Refining Tracker</h1>
            <p className="text-xs text-text-muted leading-tight">Star Citizen 4.7</p>
          </div>
        </a>

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
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
                navOpen ? "text-text bg-dark-700" : "text-text-muted hover:text-text hover:bg-dark-800"
              }`}
              aria-label="Open menu"
              title="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            {navOpen && (
              <AppNavDropdown
                activePath="/refining-tracker/"
                onClose={() => { setNavOpen(false); setConfirming(false); }}
                progressSection={
                  <>
                    <NavExportButton onClick={() => { exportToJson(); setNavOpen(false); }} />
                    <NavExportAllButton onClick={() => { exportAllToolsData(); setNavOpen(false); }} />
                    <NavImportButton
                      inputRef={fileRef}
                      onClick={() => fileRef.current?.click()}
                      onFileChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const { ok, error } = await importFromJson(file);
                          if (ok) window.location.reload();
                          else alert(error || "Invalid backup file");
                        }
                        e.target.value = "";
                      }}
                    />
                    <NavResetButton
                      confirming={confirming}
                      onResetClick={() => setConfirming(true)}
                      onConfirmReset={() => {
                        localStorage.removeItem("mining-tools-sessions");
                        localStorage.removeItem("mining-tools-work-orders");
                        setConfirming(false);
                        setNavOpen(false);
                        window.location.reload();
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
    </header>
  );
}
