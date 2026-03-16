/**
 * Shared nav and footer link data for all Undisputed Noobs apps.
 * Import from ../shared/nav-footer-links (or ../../shared from stevew00dy.github.io/apps/landing)
 */

export const TOOL_LINKS = [
  { href: "/armor-tracker/", label: "Rare Armor Tracker" },
  { href: "/exec-hangar-tracker/", label: "Exec Hangar Tracker" },
  { href: "/wikelo-tracker/", label: "Wikelo Tracker" },
  { href: "/fps-loadout-tracker/", label: "FPS Loadout Tracker" },
  { href: "/refining-tracker/", label: "Refining Tracker" },
] as const;

export const FOOTER_LINKS: { href: string; label: string; external?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/training", label: "Training" },
  ...TOOL_LINKS,
  { href: "https://www.youtube.com/@undisputednoobs", label: "YouTube", external: true },
  { href: "https://x.com/UndisputedNoobs", label: "X", external: true },
  {
    href: "https://www.robertsspaceindustries.com/enlist?referral=STAR-23GB-5J3N",
    label: "Join Star Citizen (+50k aUEC)",
    external: true,
  },
];

export const STAR_CITIZEN_URL =
  "https://robertsspaceindustries.com/enlist?referral=STAR-23GB-5J3N";
