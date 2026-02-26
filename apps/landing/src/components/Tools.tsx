import {
  Crosshair,
  Timer,
  Hammer,
  Wrench,
  TrendingUp,
  ExternalLink,
  Shield,
  Rocket,
  Users,
  Swords,
  Gauge,
  Pickaxe,
} from "lucide-react";

const tools = [
  {
    icon: <Crosshair className="w-8 h-8" />,
    title: "Rare Armour Tracker",
    desc: "Track and find every rare armour set in Star Citizen. Locations, screenshots, and checklist.",
    tag: "uNoob",
    url: "/armor-tracker/",
    external: false,
    color: "text-purple-400",
    tagBg: "bg-purple-400/10 text-purple-400",
  },
  {
    icon: <Timer className="w-8 h-8" />,
    title: "Exec Hangar Tracker",
    desc: "Executive Hangar timer, compboard checklist, supervisor keycards, vault door, and ship rewards.",
    tag: "uNoob",
    url: "/exec-hangar-tracker/",
    external: false,
    color: "text-un-accent",
    tagBg: "bg-un-accent/10 text-un-accent",
  },
  {
    icon: <Hammer className="w-8 h-8" />,
    title: "Wikelo Tracker",
    desc: "Track Wikelo contracts, manage your inventory, and craft rewards. All materials and recipes in one place.",
    tag: "uNoob",
    url: "/wikelo-tracker/",
    external: false,
    color: "text-amber-400",
    tagBg: "bg-amber-400/10 text-amber-400",
  },
  {
    icon: <Swords className="w-8 h-8" />,
    title: "FPS Loadout Tracker",
    desc: "Plan your FPS loadouts with UEX-powered autocomplete. Buy locations, prices, and system filtering.",
    tag: "uNoob",
    url: "/loadout-planner/",
    external: false,
    color: "text-emerald-400",
    tagBg: "bg-emerald-400/10 text-emerald-400",
  },
  {
    icon: <Pickaxe className="w-8 h-8" />,
    title: "Refining Tracker",
    desc: "Find the best refining method and station for your ore. Side-by-side method comparison and yield bonuses.",
    tag: "uNoob",
    url: "/refining-tracker/",
    external: false,
    color: "text-orange-400",
    tagBg: "bg-orange-400/10 text-orange-400",
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: "Erkul Games",
    desc: "Ship loadout builder and DPS calculator. The go-to tool for fitting out your ships.",
    tag: "Community",
    url: "https://www.erkul.games/",
    external: true,
    color: "text-sky-400",
    tagBg: "bg-sky-400/10 text-sky-400",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "UEX Corp",
    desc: "Live trade prices, mining data, refining calculators, and commodity routes across the 'verse.",
    tag: "Community",
    url: "https://uexcorp.space/",
    external: true,
    color: "text-emerald-400",
    tagBg: "bg-emerald-400/10 text-emerald-400",
  },
  {
    icon: <Gauge className="w-8 h-8" />,
    title: "SPViewer",
    desc: "Ship performance database. Compare speed, fuel, shields, and components across every ship in the game.",
    tag: "Community",
    url: "https://www.spviewer.eu/",
    external: true,
    color: "text-orange-400",
    tagBg: "bg-orange-400/10 text-orange-400",
  },
  {
    icon: <Pickaxe className="w-8 h-8" />,
    title: "Regolith Co.",
    desc: "Mining loadout calculator, ore data, refinery prices, and profit splitting for solo and crew mining ops.",
    tag: "Community",
    url: "https://regolith.rocks/",
    external: true,
    color: "text-yellow-400",
    tagBg: "bg-yellow-400/10 text-yellow-400",
  },
];

export default function Tools() {
  return (
    <section id="tools" className="py-24 relative">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-un-gold font-display text-sm tracking-widest uppercase mb-4">
            Star Citizen Tools
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Tools that save you <span className="gradient-text">time</span>
          </h2>
          <p className="text-un-muted max-w-2xl mx-auto">
            Our own trackers plus the best community tools out there.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <a
              key={tool.title}
              href={tool.url}
              {...(tool.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="bg-un-card border border-un-card-border rounded-xl p-6 card-glow transition-all hover:border-un-accent/30 group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${tool.color} group-hover:opacity-80 transition-opacity`}>
                  {tool.icon}
                </div>
                <span className={`text-xs font-semibold ${tool.tagBg} px-2.5 py-1 rounded-full`}>
                  {tool.tag}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-un-accent transition-colors">
                {tool.title}
              </h3>
              <p className="text-un-muted text-sm leading-relaxed flex-1">
                {tool.desc}
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-un-accent/60 mt-3 group-hover:text-un-accent transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                {tool.external ? "Visit Site" : "Open Tool"}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-6">
          <a
            href="https://www.ueepathfinders.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-un-card border border-un-card-border rounded-xl p-6 card-glow transition-all hover:border-un-accent/30 group flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-un-accent/50 via-un-gold/30 to-transparent" />
            <div className="flex items-center gap-4">
              <div className="text-un-accent shrink-0">
                <Shield className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-lg group-hover:text-un-accent transition-colors">
                  UEE Pathfinders
                </h3>
                <p className="text-un-muted text-sm">
                  Hardcore mil-sim. Structured ops, anti-piracy, fleet strikes.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-un-accent/10 text-un-accent border border-un-accent/20 px-4 py-1.5 rounded-lg text-xs font-semibold shrink-0 group-hover:bg-un-accent/20 transition-all">
                Enlist
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>

          <a
            href="https://x.com/CosmicCoal"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-un-card border border-un-card-border rounded-xl p-6 card-glow transition-all hover:border-sky-400/30 group flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/50 via-sky-400/20 to-transparent" />
            <div className="flex items-center gap-4">
              <div className="text-sky-400 shrink-0">
                <Rocket className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-lg group-hover:text-sky-400 transition-colors">
                  Cosmic Coalition
                </h3>
                <p className="text-un-muted text-sm">
                  Casual org. Chill sessions, group play, no pressure.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-sky-400/10 text-sky-400 border border-sky-400/20 px-4 py-1.5 rounded-lg text-xs font-semibold shrink-0 group-hover:bg-sky-400/20 transition-all">
                Follow
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>

          <a
            href="https://www.facebook.com/groups/623473311006319"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-un-card border border-un-card-border rounded-xl p-6 card-glow transition-all hover:border-blue-400/30 group flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-blue-400/20 to-transparent" />
            <div className="flex items-center gap-4">
              <div className="text-blue-400 shrink-0">
                <Users className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-lg group-hover:text-blue-400 transition-colors">
                  Star Citizen Facebook Group
                </h3>
                <p className="text-un-muted text-sm">
                  Community group. News, discussions, and meetups.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-blue-400/10 text-blue-400 border border-blue-400/20 px-4 py-1.5 rounded-lg text-xs font-semibold shrink-0 group-hover:bg-blue-400/20 transition-all">
                Join
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
