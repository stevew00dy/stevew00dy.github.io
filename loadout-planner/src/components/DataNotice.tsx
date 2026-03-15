import { useState, useEffect } from "react";
import { Info, X } from "lucide-react";

const STORAGE_KEY = "unoob-data-notice-dismissed";

export default function DataNotice() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  if (dismissed) return null;

  return (
    <div className="w-full border-b border-accent-amber/30 bg-accent-amber/10">
      <div className="max-w-[1600px] mx-auto px-4 py-3">
        <div className="flex gap-4 items-start">
          <Info className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-dim leading-relaxed">
              <strong className="text-text">Your data, your responsibility.</strong> Our uNoob trackers don&apos;t store any personal information — no login, we never see your data. Progress stays in your browser. If you clear your cache, you&apos;ll lose it. Please use Export in each tool to back up regularly.
            </p>
          </div>
          <button
            onClick={dismiss}
            className="p-1 rounded text-text-muted hover:text-text hover:bg-accent-amber/20 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
