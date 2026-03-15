import { mkdirSync, readFileSync, writeFileSync, cpSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

const OLD_BASE = "/star-citizen-rare-armor/";
const NEW_BASE = "/armor-tracker/";

function replaceBase(content) {
  return content.replaceAll(OLD_BASE, NEW_BASE);
}

console.log("Building armor-tracker (copying legacy app)...");

mkdirSync(dist, { recursive: true });

// Copy assets, armor-images, vite.svg
cpSync(join(root, "assets"), join(dist, "assets"), { recursive: true });
cpSync(join(root, "armor-images"), join(dist, "armor-images"), { recursive: true });
cpSync(join(root, "vite.svg"), join(dist, "vite.svg"));

// Copy nav and theme assets
cpSync(join(root, "scripts", "armor-nav.css"), join(dist, "assets", "armor-nav.css"));
cpSync(join(root, "scripts", "armor-nav.js"), join(dist, "assets", "armor-nav.js"));
cpSync(join(root, "scripts", "armor-theme.css"), join(dist, "assets", "armor-theme.css"));

const wrapperHtml = readFileSync(join(root, "scripts", "armor-wrapper.html"), "utf-8");

// Read and adapt index.html
let html = readFileSync(join(root, "index.html"), "utf-8");
html = replaceBase(html);

// Force dark mode always (replace theme script)
html = html.replace(
  /try\{var s=localStorage\.getItem\('personal-armour-tracker-settings'\);if\(s\)\{var p=JSON\.parse\(s\);if\(p\.theme==='dark'\)document\.documentElement\.classList\.add\('dark'\);\}\}catch\(_\)\{\}/,
  "document.documentElement.classList.add('dark');"
);

// Inject nav + theme CSS (theme loads last to override app styles)
html = html.replace(
  "</head>",
  `<link rel="stylesheet" href="${NEW_BASE}assets/armor-nav.css">\n    <link rel="stylesheet" href="${NEW_BASE}assets/armor-theme.css">\n  </head>`
);

// Inject wrapper HTML at start of body (before <div id="root">)
html = html.replace(
  "<body>",
  `<body>\n${wrapperHtml}\n  `
);

// Inject nav script before </body>
html = html.replace(
  "</body>",
  `<script src="${NEW_BASE}assets/armor-nav.js"></script>\n  </body>`
);

writeFileSync(join(dist, "index.html"), html);

// Replace base path in built JS and CSS
const jsPath = join(dist, "assets", "index-BoS9ciyU.js");
let js = readFileSync(jsPath, "utf-8");
writeFileSync(jsPath, replaceBase(js));

const cssPath = join(dist, "assets", "index-COH93EfI.css");
let css = readFileSync(cssPath, "utf-8");
writeFileSync(cssPath, replaceBase(css));

console.log("✓ armor-tracker built to dist/");
