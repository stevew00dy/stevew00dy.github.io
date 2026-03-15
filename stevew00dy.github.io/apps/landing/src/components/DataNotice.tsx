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
    <div className="w-full relative bg-un-gold/10 border-b border-un-gold/30">
      <div className="w-full px-6 py-3">
        <div className="flex gap-4 items-start">
          <Info className="w-5 h-5 text-un-gold shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-un-muted leading-relaxed">
              <strong className="text-un-text">Your data, your responsibility.</strong> Our uNoob trackers don&apos;t store any personal information — no login, we never see your data. Progress stays in your browser. If you clear your cache, you&apos;ll lose it. Please use Export in each tool to back up regularly.
            </p>
          </div>
          <button
            onClick={dismiss}
            className="p-1 rounded text-un-muted hover:text-un-text hover:bg-un-gold/20 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
