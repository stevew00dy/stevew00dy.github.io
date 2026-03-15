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
}

export function AppNavDropdown({
  activePath,
  progressSection,
  onClose,
}: AppNavDropdownProps) {
  return (
    <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full sm:mt-2 w-[calc(100vw-1rem)] sm:w-64 max-w-[16rem] p-3 shadow-xl z-50 rounded-xl border border-dark-700 bg-dark-900">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wide">
          Progress
        </h3>
        <button
          onClick={onClose}
          className="p-0.5 rounded text-text-muted hover:text-text transition-colors"
          aria-label="Close menu"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-0.5 mb-2">{progressSection}</div>
      <div className="border-t border-dark-700 my-2" />
      <h3 className="text-[10px] font-semibold text-text-dim uppercase tracking-wide mb-1.5">
        Tools
      </h3>
      {TOOL_LINKS.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          className={`block px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
            href === activePath
              ? "text-accent-amber font-medium"
              : "text-text-dim hover:text-text hover:bg-dark-700"
          }`}
        >
          {label}
        </a>
      ))}
      <div className="border-t border-dark-700 my-1.5" />
      <a
        href="/"
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
      >
        <Home className="w-3.5 h-3.5 text-accent-amber" />
        Undisputed Noobs
      </a>
      <a
        href={STAR_CITIZEN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-accent-blue hover:bg-dark-700 transition-all duration-200"
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
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
    >
      <Download className="w-3.5 h-3.5 text-accent-blue" />
      Export Progress
      <span className="ml-auto text-[10px] text-text-muted">.json</span>
    </button>
  );
}

/** Reusable Import button for Progress section (with file input) */
export function NavImportButton({
  onClick,
  inputRef,
  onFileChange,
}: {
  onClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <button
        onClick={onClick}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
      >
        <Upload className="w-3.5 h-3.5 text-accent-amber" />
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
export function NavImportButtonSimple({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-dim hover:text-text hover:bg-dark-700 transition-all duration-200"
    >
      <Upload className="w-3.5 h-3.5 text-accent-amber" />
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
