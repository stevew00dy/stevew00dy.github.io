export function parseHashTab<T extends string>(hash: string, validTabs: readonly T[]): T | null {
  const normalized = hash.replace(/^#/, "").trim().toLowerCase();
  return validTabs.find((tab) => tab.toLowerCase() === normalized) ?? null;
}

export function updateTabHash<T extends string>(tab: T, validTabs: readonly T[], mode: "push" | "replace") {
  const current = parseHashTab(window.location.hash, validTabs);
  if (current === tab) return;

  const url = new URL(window.location.href);
  url.hash = tab;

  if (mode === "replace") {
    window.history.replaceState(null, "", url);
    return;
  }

  window.history.pushState(null, "", url);
}
