import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-un-card-border bg-un-darker py-10">
      <div className="max-w-[1600px] mx-auto px-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Logo className="w-7 h-7" />
          <span className="font-display font-bold text-sm tracking-wide text-un-muted">
            UNDISPUTED NOOBS
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          <a href="/" className="text-xs text-un-muted hover:text-un-accent transition-colors">Home</a>
          <a href="/armor-tracker/" className="text-xs text-un-muted hover:text-un-accent transition-colors">Armour Tracker</a>
          <a href="/exec-hangar-tracker/" className="text-xs text-un-muted hover:text-un-accent transition-colors">Exec Hangar Tracker</a>
          <a href="/wikelo-tracker/" className="text-xs text-un-muted hover:text-un-accent transition-colors">Wikelo Tracker</a>
          <a href="/loadout-planner/" className="text-xs text-un-muted hover:text-un-accent transition-colors">Loadout Planner</a>
          <a href="https://www.youtube.com/@undisputednoobs" target="_blank" rel="noopener noreferrer" className="text-xs text-un-muted hover:text-un-accent transition-colors">YouTube</a>
          <a
            href="https://www.robertsspaceindustries.com/enlist?referral=STAR-23GB-5J3N"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-un-muted hover:text-un-accent transition-colors"
          >
            Join Star Citizen (+50k aUEC)
          </a>
        </div>

        <p className="text-[10px] text-un-muted/50">
          &copy; {new Date().getFullYear()} Undisputed Noobs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
