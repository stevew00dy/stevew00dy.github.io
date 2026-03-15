import { useState, useEffect, useRef } from "react";
import {
  Flame,
  Menu,
  Home,
  RefreshCw,
  TrendingUp,
  Building2,
  Loader2,
  Search,
  BarChart3,
  Wrench,
  Radio,
  AlertTriangle,
} from "lucide-react";
import Optimizer from "./components/Optimizer";
import StationBonuses from "./components/StationBonuses";
import Sessions from "./components/Sessions";
import MaterialFinder from "./components/MaterialFinder";
import Statistics from "./components/Statistics";
import Loadouts from "./components/Loadouts";
import RSSignatures from "./components/RSSignatures";
import { getRefiningData, clearCache, type RefiningData } from "./uex-api";

type Tab = "sessions" | "stats" | "loadouts" | "signatures" | "optimizer" | "stations" | "finder";

export default function App() {
  const [tab, setTab] = useState<Tab>("sessions");
  const [data, setData] = useState<RefiningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRefiningData()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleRefresh() {
    setLoading(true);
    setError(null);
    clearCache();
    try {
      const d = await getRefiningData(true);
      setData(d);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof TrendingUp }[] = [
    { id: "sessions", label: "Sessions", icon: Flame },
    { id: "loadouts", label: "Loadouts", icon: Wrench },
    { id: "optimizer", label: "Methods", icon: TrendingUp },
    { id: "stations", label: "Stations", icon: Building2 },
    { id: "signatures", label: "RS Signatures", icon: Radio },
    { id: "finder", label: "Material Finder", icon: Search },
    { id: "stats", label: "Statistics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-dark-700 bg-dark-900/95 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-amber/15 flex items-center justify-center">
              <Flame size={20} className="text-accent-amber" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Refining Tracker</h1>
              <p className="text-[11px] text-text-muted leading-tight">Star Citizen 4.7</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-dark-800 border border-dark-700 hover:bg-dark-700 transition-colors disabled:opacity-50"
              title="Refresh data from UEX"
              aria-label="Refresh data"
            >
              <RefreshCw size={16} className={`text-text-dim ${loading ? "animate-spin" : ""}`} />
            </button>

            <div ref={navRef} className="relative">
              <button
                onClick={() => setNavOpen(!navOpen)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-dark-800 border border-dark-700 hover:bg-dark-700 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={16} className="text-text-dim" />
              </button>
              {navOpen && (
                <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full sm:mt-2 w-[calc(100vw-1rem)] sm:w-56 max-w-[14rem] p-2 shadow-xl z-50 rounded-xl border border-dark-700 bg-dark-900">
                  <h3 className="text-[10px] font-semibold text-text-dim uppercase tracking-wide mb-1.5">Tools</h3>
                  <a href="/armor-tracker/" className="block px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200">Rare Armour Tracker</a>
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

      <div className="border-b border-accent-amber/30 bg-accent-amber/10">
        <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm text-accent-amber font-medium">
          <AlertTriangle size={16} className="shrink-0" />
          WARNING — THIS APP IS BEING BUILT — MIGHT NOT WORK AS INTENDED
        </div>
      </div>

      <nav className="border-b border-dark-700 bg-dark-900/80">
        <div className="max-w-[1600px] mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 min-h-[44px] text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  tab === t.id
                    ? "border-accent-amber text-accent-amber"
                    : "border-transparent text-text-dim hover:text-text-secondary hover:border-dark-600"
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-6">
        {(tab === "sessions" || tab === "stats" || tab === "loadouts" || tab === "signatures" || tab === "finder") ? (
          <>
            {tab === "sessions" && <Sessions />}
            {tab === "stats" && <Statistics />}
            {tab === "loadouts" && <Loadouts />}
            {tab === "signatures" && <RSSignatures />}
            {tab === "finder" && <MaterialFinder />}
          </>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={36} className="text-accent-amber animate-spin mb-4" />
            <p className="text-text-dim text-sm">Loading refining data from UEX...</p>
          </div>
        ) : error ? (
          <div className="card text-center py-12">
            <p className="text-accent-red mb-2 font-medium">Failed to load data</p>
            <p className="text-text-dim text-sm mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-accent-blue/15 text-accent-blue text-sm font-medium rounded-lg border border-accent-blue/30 hover:bg-accent-blue/25 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : data ? (
          <>
            {tab === "optimizer" && <Optimizer data={data} />}
            {tab === "stations" && <StationBonuses data={data} />}
          </>
        ) : null}

        {data && tab !== "sessions" && tab !== "stats" && tab !== "loadouts" && tab !== "signatures" && tab !== "finder" && (
          <div className="mt-4 text-center text-[10px] text-text-muted">
            Data {data.fromCache ? "from cache" : "fetched live"} · Last updated{" "}
            {new Date(data.fetchedAt).toLocaleString()}
          </div>
        )}
      </main>

      <footer className="border-t border-dark-700 mt-12 py-6">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <a href="/" className="text-xs text-text-muted hover:text-accent-amber transition-colors">Home</a>
            <a href="/armor-tracker/" className="text-xs text-text-muted hover:text-accent-amber transition-colors">Rare Armour Tracker</a>
            <a href="/exec-hangar-tracker/" className="text-xs text-text-muted hover:text-accent-amber transition-colors">Exec Hangar Tracker</a>
            <a href="/wikelo-tracker/" className="text-xs text-text-muted hover:text-accent-amber transition-colors">Wikelo Tracker</a>
            <a href="/loadout-planner/" className="text-xs text-text-muted hover:text-accent-amber transition-colors">FPS Loadout Tracker</a>
            <a href="/refining-tracker/" className="text-xs text-accent-amber font-medium">Refining Tracker</a>
            <a href="https://www.youtube.com/@undisputednoobs" target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-accent-amber transition-colors">YouTube</a>
          </div>
          <p className="text-[10px] text-text-muted/50">Unofficial fan-made tool. Not affiliated with Cloud Imperium Games. All data may be inaccurate — use at your own risk.</p>
        </div>
      </footer>
    </div>
  );
}
