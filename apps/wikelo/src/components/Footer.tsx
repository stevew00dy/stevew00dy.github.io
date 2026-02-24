import { ExternalLink } from "lucide-react";

const links = [
  { label: "Undisputed Noobs", href: "/" },
  { label: "Armour Tracker", href: "/armour/" },
  { label: "Exec Hangar Tracker", href: "/exec/" },
];

export function Footer() {
  return (
    <footer className="border-t border-dark-700 mt-12">
      <div className="max-w-[1600px] mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-text-muted">
          Undisputed Noobs &middot; Star Citizen Tools
        </span>
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-text-muted hover:text-accent-purple transition-colors duration-200"
            >
              {link.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
