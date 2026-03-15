import { mkdirSync, readFileSync, writeFileSync, cpSync, readdirSync } from "fs";
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

function findAsset(assetsDir, pattern) {
  const files = readdirSync(assetsDir);
  const match = files.find((f) => pattern.test(f));
  if (!match) throw new Error(`No asset matching ${pattern} in ${assetsDir}`);
  return match;
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

const assetsDir = join(dist, "assets");
const jsFile = findAsset(assetsDir, /^index-\w+\.js$/);
const cssFile = findAsset(assetsDir, /^index-\w+\.css$/);

const wrapperHtml = readFileSync(join(root, "scripts", "armor-wrapper.html"), "utf-8");
const footerHtml = readFileSync(join(root, "scripts", "armor-footer.html"), "utf-8");

// Read and adapt index.html (replace asset refs with dynamic filenames in case they change)
let html = readFileSync(join(root, "index.html"), "utf-8");
html = html.replace(/\/star-citizen-rare-armor\/assets\/index-\w+\.js/, `${OLD_BASE}assets/${jsFile}`);
html = html.replace(/\/star-citizen-rare-armor\/assets\/index-\w+\.css/, `${OLD_BASE}assets/${cssFile}`);
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

// Inject footer and nav script before </body>
html = html.replace(
  "</body>",
  `\n${footerHtml}\n  <script src="${NEW_BASE}assets/armor-nav.js"></script>\n  </body>`
);

writeFileSync(join(dist, "index.html"), html);

// Replace base path in built JS and CSS (use dynamic filenames)
const jsPath = join(assetsDir, jsFile);
let js = readFileSync(jsPath, "utf-8");
writeFileSync(jsPath, replaceBase(js));

const cssPath = join(assetsDir, cssFile);
let css = readFileSync(cssPath, "utf-8");
writeFileSync(cssPath, replaceBase(css));

console.log("✓ armor-tracker built to dist/");
