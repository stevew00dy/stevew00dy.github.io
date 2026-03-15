import { useState, useEffect } from "react";
import {
  Flame,
  TrendingUp,
  Building2,
  Loader2,
  Search,
  BarChart3,
  Wrench,
  Radio,
} from "lucide-react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Optimizer from "./components/Optimizer";
import StationBonuses from "./components/StationBonuses";
import Sessions from "./components/Sessions";
import MaterialFinder from "./components/MaterialFinder";
import Statistics from "./components/Statistics";
import Loadouts from "./components/Loadouts";
import RSSignatures from "./components/RSSignatures";
import DataNotice from "./components/DataNotice";
import { getRefiningData, clearCache, type RefiningData } from "./uex-api";

type Tab = "sessions" | "stats" | "loadouts" | "signatures" | "optimizer" | "stations" | "finder";

export default function App() {
  const [tab, setTab] = useState<Tab>("sessions");
  const [data, setData] = useState<RefiningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getRefiningData()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
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
      <Header loading={loading} onRefresh={handleRefresh} />
      <DataNotice />

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

      <Footer />
    </div>
  );
}
