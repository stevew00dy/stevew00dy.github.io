import { execSync } from "child_process";
import { mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

function run(cmd, cwd) {
  console.log(`\n→ ${cmd} (in ${cwd})`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

console.log("=== Building Undisputed Noobs Landing Page ===\n");

mkdirSync(dist, { recursive: true });

run("npx vite build --outDir ../../dist --emptyOutDir", join(root, "apps/landing"));

writeFileSync(join(dist, "CNAME"), "undisputednoobs.com");

// SPA fallback: 404.html = index.html so /training (and other client routes) load the app
const indexHtml = readFileSync(join(dist, "index.html"), "utf-8");
writeFileSync(join(dist, "404.html"), indexHtml);

console.log("\n=== Build complete! Output in dist/ ===");
console.log("  /                      → Landing page");
console.log("  /training               → Basic Training (SPA route)");
console.log("  /armor-tracker/        → Armor Tracker (separate repo)");
console.log("  /exec-hangar-tracker/  → Exec Hangar Tracker (separate repo)");
console.log("  /wikelo-tracker/       → Wikelo Tracker (separate repo)");
