/**
 * Shared nav dropdown for all Undisputed Noobs tracker apps.
 * Tools links and active highlighting come from this file.
 * Progress (Export/Import/Reset) is app-specific and passed as children.
 */

import type React from "react";
import { Download, Upload, RotateCcw, X, Home } from "lucide-react";
import { TOOL_LINKS, STAR_CITIZEN_URL } from "./nav-footer-links";

export interface AppNavDropdownProps {
  /** Path of the current app (e.g. "/refining-tracker/") for active link highlight */
  activePath: string;
  /** App-specific Progress section: Export, Import, Reset buttons */
  progressSection: React.ReactNode;
  onClose: () => void;
  /** Override Home icon color (e.g. "text-text-muted" for muted) */
  homeIconClassName?: string;
}

export function AppNavDropdown({
  activePath,
  progressSection,
  onClose,
  homeIconClassName = "text-accent-amber",
}: AppNavDropdownProps) {
  return (
    <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full sm:mt-2 w-[calc(100vw-1rem)] sm:w-[18.25rem] max-w-[18.25rem] p-4 shadow-2xl z-50 rounded-2xl border border-dark-700/90 bg-dark-900/98 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.12em]">
          Progress
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded text-text-muted hover:text-text transition-colors"
          aria-label="Close menu"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-1 mb-3">{progressSection}</div>
      <div className="border-t border-dark-700 my-3" />
      <h3 className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.12em] mb-2">
        Tools
      </h3>
      {TOOL_LINKS.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          className={`block px-3 py-2.5 rounded-lg text-[13px] leading-none transition-all duration-200 ${
            href === activePath
              ? "text-accent-amber font-medium"
              : "text-text-dim hover:text-text hover:bg-dark-700"
          }`}
        >
          {label}
        </a>
      ))}
      <div className="border-t border-dark-700 my-3" />
      <a
        href="/"
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] leading-none text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
      >
        <Home className={`w-3.5 h-3.5 ${homeIconClassName}`} />
        Undisputed Noobs
      </a>
      <a
        href={STAR_CITIZEN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] leading-none text-accent-blue hover:bg-dark-700 transition-all duration-200"
      >
        Play Star Citizen
        <span className="text-[10px] text-text-muted">↗</span>
      </a>
    </div>
  );
}

/** Reusable Export button for Progress section */
export function NavExportButton({
  onClick,
  iconClassName = "text-accent-blue",
}: {
  onClick: () => void;
  iconClassName?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
    >
      <Download className={`w-3.5 h-3.5 ${iconClassName}`} />
      Export Progress
      <span className="ml-auto text-[10px] text-text-muted">.json</span>
    </button>
  );
}

export function NavExportAllButton({
  onClick,
  iconClassName = "text-accent-blue",
}: {
  onClick: () => void;
  iconClassName?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] leading-none text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
    >
      <Download className={`w-3.5 h-3.5 ${iconClassName}`} />
      Export All Tools
      <span className="ml-auto text-[10px] text-text-muted">.json</span>
    </button>
  );
}

/** Reusable Import button for Progress section (with file input) */
export function NavImportButton({
  onClick,
  inputRef,
  onFileChange,
  iconClassName = "text-accent-amber",
}: {
  onClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconClassName?: string;
}) {
  return (
    <>
      <button
        onClick={onClick}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
      >
        <Upload className={`w-3.5 h-3.5 ${iconClassName}`} />
        Import Progress
        <span className="ml-auto text-[10px] text-text-muted">.json</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={onFileChange}
      />
    </>
  );
}

/** Import button that delegates to parent (e.g. Loadout Planner uses parent's file input) */
export function NavImportButtonSimple({ onClick, iconClassName = "text-accent-amber" }: { onClick: () => void; iconClassName?: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
    >
      <Upload className={`w-3.5 h-3.5 ${iconClassName}`} />
      Import Progress
      <span className="ml-auto text-[10px] text-text-muted">.json</span>
    </button>
  );
}

/** Reusable Reset button - inline confirmation variant (Refining, Wikelo, Exec Hangar) */
export function NavResetButton({
  confirming,
  onResetClick,
  onConfirmReset,
  onCancel,
}: {
  confirming: boolean;
  onResetClick: () => void;
  onConfirmReset: () => void;
  onCancel: () => void;
}) {
  if (confirming) {
    return (
      <div className="px-3 py-2 rounded-lg bg-dark-800/80">
        <p className="text-xs text-accent-red mb-2">
          Reset all progress? This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onConfirmReset}
            className="flex-1 py-1.5 text-xs rounded-md bg-accent-red/20 text-accent-red hover:bg-accent-red/30 transition-colors font-medium"
          >
            Yes, reset
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-1.5 text-xs rounded-md bg-dark-700 text-text-muted hover:text-text transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  return (
    <button
      onClick={onResetClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-all duration-200"
    >
      <RotateCcw className="w-3.5 h-3.5" />
      Reset All Progress
    </button>
  );
}

/** Simple Reset button - parent handles confirm dialog (Loadout Planner) */
export function NavResetButtonSimple({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-all duration-200"
    >
      <RotateCcw className="w-3.5 h-3.5" />
      Reset All Progress
    </button>
  );
}
