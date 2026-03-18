import type { ReactNode, RefObject } from "react";
import { Menu } from "lucide-react";

type HeaderMetric = {
  key: string;
  dotClassName: string;
  content: ReactNode;
  hiddenClassName?: string;
};

interface TrackerHeaderProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  metrics?: HeaderMetric[];
  navOpen: boolean;
  navRef: RefObject<HTMLDivElement | null>;
  onToggleNav: () => void;
  menuContent?: ReactNode;
}

export function TrackerHeader({
  title,
  subtitle,
  icon,
  metrics = [],
  navOpen,
  navRef,
  onToggleNav,
  menuContent,
}: TrackerHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-dark-700 bg-dark-900/80 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-blue/20 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-text">{title}</h1>
            <p className="text-xs text-text-muted">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {metrics.length > 0 && (
            <div className="flex items-center gap-4 text-xs">
              {metrics.map((metric) => (
                <div key={metric.key} className={`flex items-center gap-1.5 ${metric.hiddenClassName ?? ""}`}>
                  <span className={`w-2 h-2 rounded-full ${metric.dotClassName}`} />
                  <span className="text-text-dim">{metric.content}</span>
                </div>
              ))}
            </div>
          )}

          <div className="relative" ref={navRef}>
            <button
              onClick={onToggleNav}
              className={`p-2 rounded-lg transition-all duration-200 ${
                navOpen ? "text-text bg-dark-700" : "text-text-muted hover:text-text hover:bg-dark-800"
              }`}
              title="Menu"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            {navOpen && menuContent}
          </div>
        </div>
      </div>
    </header>
  );
}
