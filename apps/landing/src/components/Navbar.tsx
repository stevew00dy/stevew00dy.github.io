import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ExternalLink, Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV_LINKS: [string, string | null][] = [
  ["Sherpa Steve", "/#sherpa"],
  ["Guides", null], // dropdown
  ["Tools", "#tools"],
  ["Our Mission", "/#why"],
  ["Values", "/#values"],
  ["Our Promise", "/#promise"],
  ["Community", "/#community"],
];

const GUIDE_LINKS: { title: string; url: string }[] = [
  { title: "Basic Training", url: "/training" },
];

const TOOL_LINKS: { title: string; url: string; external?: boolean }[] = [
  { title: "Rare Armor Tracker", url: "/armor-tracker/" },
  { title: "Exec Hangar Tracker", url: "/exec-hangar-tracker/" },
  { title: "Wikelo Tracker", url: "/wikelo-tracker/" },
  { title: "FPS Loadout Planner", url: "/loadout-planner/" },
  { title: "Refining Tracker", url: "/refining-tracker/" },
  { title: "Erkul Games", url: "https://www.erkul.games/", external: true },
  { title: "UEX Corp", url: "https://uexcorp.space/", external: true },
  { title: "SPViewer", url: "https://www.spviewer.eu/", external: true },
  { title: "Regolith Co.", url: "https://regolith.rocks/", external: true },
];

const INTERNAL_TOOLS = TOOL_LINKS.filter((t) => !t.external);
const COMMUNITY_TOOLS = TOOL_LINKS.filter((t) => t.external);

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const renderNavLink = (label: string, href: string | null) => {
    if (label === "Guides") {
      return (
        <div key={label} className="relative group">
          <a
            href="/#guides"
            className="text-sm text-un-muted hover:text-un-accent transition-colors font-medium inline-flex items-center gap-1"
          >
            {label}
            <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
          </a>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
            <div className="bg-un-darker/95 backdrop-blur-md border border-un-card-border rounded-xl py-2 min-w-[200px] shadow-xl">
              {GUIDE_LINKS.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className="flex items-center justify-between px-4 py-2 text-sm text-un-muted hover:text-un-accent hover:bg-un-card-border/30 transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }
    if (label === "Tools") {
      return (
        <div key={label} className="relative group">
          <a
            href="/#tools"
            className="text-sm text-un-muted hover:text-un-accent transition-colors font-medium inline-flex items-center gap-1"
          >
            {label}
            <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
          </a>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
            <div className="bg-un-darker/95 backdrop-blur-md border border-un-card-border rounded-xl py-2 min-w-[200px] shadow-xl">
              {INTERNAL_TOOLS.map((tool) => (
                <a
                  key={tool.title}
                  href={tool.url}
                  className="flex items-center justify-between px-4 py-2 text-sm text-un-muted hover:text-un-accent hover:bg-un-card-border/30 transition-colors"
                >
                  {tool.title}
                </a>
              ))}
              <div className="border-t border-un-card-border my-2" />
              <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wide text-un-muted/80">
                Community resources
              </p>
              {COMMUNITY_TOOLS.map((tool) => (
                <a
                  key={tool.title}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-2 text-sm text-un-muted hover:text-un-accent hover:bg-un-card-border/30 transition-colors"
                >
                  {tool.title}
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>
              ))}
              <div className="border-t border-un-card-border my-1" />
              <a
                href="/#tools"
                className="flex items-center px-4 py-2 text-sm text-un-accent/70 hover:text-un-accent transition-colors font-medium"
              >
                View all tools
              </a>
            </div>
          </div>
        </div>
      );
    }
    return (
      <a
        key={label}
        href={href ?? "#"}
        className="text-sm text-un-muted hover:text-un-accent transition-colors font-medium"
      >
        {label}
      </a>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-un-darker/80 backdrop-blur-md border-b border-un-card-border">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <Logo className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="font-display font-bold text-base tracking-wide text-un-text group-hover:text-un-accent transition-colors leading-tight">
              UNDISPUTED NOOBS
            </span>
            <span className="text-[10px] text-un-muted tracking-widest uppercase leading-tight">
              Led by Sherpa Steve
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(([label, href]) => renderNavLink(label, href))}
          <a
            href="https://www.robertsspaceindustries.com/enlist?referral=STAR-23GB-5J3N"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-1.5 rounded-lg bg-un-accent text-un-darker text-sm font-bold hover:bg-un-accent/90 transition-colors"
          >
            Play Star Citizen
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 text-un-muted hover:text-un-accent transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-un-card-border bg-un-darker/95 backdrop-blur-md">
          <div className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map(([label, href]) => (
              <div key={label}>
                {label === "Guides" ? (
                  <>
                    <a
                      href="/#guides"
                      onClick={() => setOpen(false)}
                      className="text-sm text-un-muted hover:text-un-accent transition-colors font-medium py-2 block"
                    >
                      {label}
                    </a>
                    <div className="flex flex-col pl-4 gap-0.5 mb-1">
                      <Link
                        to="/training"
                        onClick={() => setOpen(false)}
                        className="text-xs text-un-muted/70 hover:text-un-accent transition-colors py-1.5"
                      >
                        Basic Training
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <a
                      href={href ?? "#"}
                      onClick={() => setOpen(false)}
                      className="text-sm text-un-muted hover:text-un-accent transition-colors font-medium py-2 block"
                    >
                      {label}
                    </a>
                    {label === "Tools" && (
                      <div className="flex flex-col pl-4 gap-0.5 mb-1">
                        {INTERNAL_TOOLS.map((tool) => (
                          <a
                            key={tool.title}
                            href={tool.url}
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between text-xs text-un-muted/70 hover:text-un-accent transition-colors py-1.5"
                          >
                            {tool.title}
                          </a>
                        ))}
                        <div className="border-t border-un-card-border my-1.5" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-un-muted/60 pt-0.5">
                          Community resources
                        </p>
                        {COMMUNITY_TOOLS.map((tool) => (
                          <a
                            key={tool.title}
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between text-xs text-un-muted/70 hover:text-un-accent transition-colors py-1.5"
                          >
                            {tool.title}
                            <ExternalLink className="w-3 h-3 opacity-40" />
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            <a
              href="https://www.robertsspaceindustries.com/enlist?referral=STAR-23GB-5J3N"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-2 rounded-lg bg-un-accent text-un-darker text-sm font-bold hover:bg-un-accent/90 transition-colors text-center"
            >
              Play Star Citizen
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
