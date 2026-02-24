import { execSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
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

const notFoundHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Undisputed Noobs</title>
  <script>
    var path = window.location.pathname;
    if (path.startsWith('/armor-tracker')) window.location.replace('/armor-tracker/');
    else if (path.startsWith('/exec-hangar-tracker')) window.location.replace('/exec-hangar-tracker/');
    else if (path.startsWith('/wikelo-tracker')) window.location.replace('/wikelo-tracker/');
    else window.location.replace('/');
  </script>
</head>
<body></body>
</html>`;
writeFileSync(join(dist, "404.html"), notFoundHtml);

console.log("\n=== Build complete! Output in dist/ ===");
console.log("  /                      → Landing page");
console.log("  /armor-tracker/        → Armor Tracker (separate repo)");
console.log("  /exec-hangar-tracker/  → Exec Hangar Tracker (separate repo)");
console.log("  /wikelo-tracker/       → Wikelo Tracker (separate repo)");
