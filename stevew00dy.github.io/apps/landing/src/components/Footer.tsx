import Logo from "./Logo";
import { FOOTER_LINKS } from "../../../../../shared/nav-footer-links";

const ACTIVE_PATH = "/"; // Home is active on landing

export default function Footer() {
  return (
    <footer className="border-t border-un-card-border bg-un-darker py-14 md:py-16">
      <div className="max-w-[1600px] mx-auto px-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Logo className="w-7 h-7" />
          <span className="font-display font-bold text-sm tracking-wide text-un-muted">
            UNDISPUTED NOOBS
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          {FOOTER_LINKS.map(({ href, label, external }) => (
            <a
              key={href}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`text-xs transition-colors ${
                href === ACTIVE_PATH ? "text-un-accent font-medium" : "text-un-muted hover:text-un-accent"
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        <p className="text-[10px] text-un-muted/50">
          &copy; {new Date().getFullYear()} Undisputed Noobs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
