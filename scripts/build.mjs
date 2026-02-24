import { execSync } from "child_process";
import { cpSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

function run(cmd, cwd) {
  console.log(`\n→ ${cmd} (in ${cwd})`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

console.log("=== Building Undisputed Noobs Monorepo ===\n");

mkdirSync(dist, { recursive: true });

// 1. Build landing page → dist/
console.log("\n[1/4] Building landing page...");
run("npx vite build --outDir ../../dist --emptyOutDir", join(root, "apps/landing"));

// 2. Build exec tracker → dist/exec/
console.log("\n[2/4] Building Exec Hangar Tracker...");
run(`npx vite build --outDir ../../dist/exec`, join(root, "apps/exec"));

// 3. Build wikelo tracker → dist/wikelo/
console.log("\n[3/4] Building Wikelo Tracker...");
run(`npx vite build --outDir ../../dist/wikelo`, join(root, "apps/wikelo"));

// 4. Copy armour tracker (pre-built) → dist/armour/
console.log("\n[4/4] Copying Armour Tracker (pre-built)...");
const armourSrc = join(root, "apps/armour");
const armourDist = join(dist, "armour");
mkdirSync(armourDist, { recursive: true });
cpSync(armourSrc, armourDist, {
  recursive: true,
  filter: (src) => !src.includes(".git") && !src.includes("DEPLOY.md") && !src.includes("README.md"),
});

// 5. Write CNAME for custom domain
writeFileSync(join(dist, "CNAME"), "undisputednoobs.com");

// 6. Write 404.html for SPA routing on GitHub Pages
const notFoundHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Undisputed Noobs</title>
  <script>
    // Redirect to the correct sub-app or home
    var path = window.location.pathname;
    if (path.startsWith('/exec')) window.location.replace('/exec/');
    else if (path.startsWith('/wikelo')) window.location.replace('/wikelo/');
    else if (path.startsWith('/armour')) window.location.replace('/armour/');
    else window.location.replace('/');
  </script>
</head>
<body></body>
</html>`;
writeFileSync(join(dist, "404.html"), notFoundHtml);

console.log("\n=== Build complete! Output in dist/ ===");
console.log("  /          → Landing page");
console.log("  /exec/     → Exec Hangar Tracker");
console.log("  /wikelo/   → Wikelo Tracker");
console.log("  /armour/   → Armour Tracker");
