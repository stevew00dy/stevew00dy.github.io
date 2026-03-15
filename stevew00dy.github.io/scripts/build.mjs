import { execSync } from "child_process";
import { mkdirSync, writeFileSync, readFileSync, cpSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const monorepo = join(root, "..");
const dist = join(root, "dist");

function run(cmd, cwd) {
  console.log(`\n→ ${cmd} (in ${cwd})`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

console.log("=== Building Undisputed Noobs ===\n");

mkdirSync(dist, { recursive: true });

console.log("Building landing page...");
run("npx vite build --outDir ../../dist --emptyOutDir", join(root, "apps/landing"));

// Build and copy all tracker apps from monorepo
const apps = [
  { name: "refining-tracker", path: "refining-tracker" },
  { name: "exec-hangar-tracker", path: "exec-hangar-tracker" },
  { name: "wikelo-tracker", path: "wikelo-tracker" },
  { name: "loadout-planner", path: "loadout-planner" },
  { name: "armor-tracker", path: "armor-tracker" },
];

for (const app of apps) {
  const appPath = join(monorepo, app.path);
  if (existsSync(join(appPath, "package.json"))) {
    console.log(`\nBuilding ${app.name}...`);
    run("npm run build", appPath);
    const appDist = join(appPath, "dist");
    const appOut = join(dist, app.name);
    mkdirSync(appOut, { recursive: true });
    cpSync(appDist, appOut, { recursive: true });
  }
}

writeFileSync(join(dist, "CNAME"), "undisputednoobs.com");

// SPA fallback: 404.html = index.html so /training (and other client routes) load the app
const indexHtml = readFileSync(join(dist, "index.html"), "utf-8");
writeFileSync(join(dist, "404.html"), indexHtml);

console.log("\n=== Build complete! Output in dist/ ===");
console.log("  /                      → Landing page");
console.log("  /training               → Basic Training (SPA route)");
console.log("  /refining-tracker/      → Refining Tracker");
console.log("  /exec-hangar-tracker/  → Exec Hangar Tracker");
console.log("  /wikelo-tracker/       → Wikelo Tracker");
console.log("  /loadout-planner/      → FPS Loadout Planner");
console.log("  /armor-tracker/        → Armor Tracker");
