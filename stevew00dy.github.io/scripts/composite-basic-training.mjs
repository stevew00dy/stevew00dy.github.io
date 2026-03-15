import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, "../apps/landing/public/lesson-thumbnails");
const outPath = join(dir, "basic-training-stack.png");

// Front = bottom-left, Back = top-right
const sources = [
  { file: "basic-training-profile.png",     scale: 0.78 }, // back
  { file: "basic-training-dogfighting.png", scale: 0.89 }, // middle
  { file: "basic-training-ui.png",          scale: 1.00 }, // front
];

const FRONT_W       = 820;
const STAGGER_X     = 15;   // small left-shift per layer (right edges nearly aligned)
const STAGGER_Y     = 44;
const PAD           = 50;
const CORNER_R      = 12;       // outer corner radius
const INNER_PAD     = 6;        // padding between screenshot and border
const INNER_COLOR   = { r: 11, g: 17, b: 32, alpha: 255 }; // dark navy matching UI
const SHADOW_BLUR   = 20;
const SHADOW_OFFSET = 12;
const SHADOW_ALPHA  = 180;
const BORDER_COLOR  = "rgba(0,180,216,0.50)";
const BORDER_WIDTH  = 1.5;

// Round corners using SVG mask
async function roundCorners(buf, w, h, r) {
  const svg = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="white"/></svg>`
  );
  return sharp(buf).composite([{ input: svg, blend: "dest-in" }]).png().toBuffer();
}

// Add crisp border stroke
async function addBorder(buf, w, h, r) {
  const svg = Buffer.from(
    `<svg width="${w}" height="${h}">
      <rect x="${BORDER_WIDTH / 2}" y="${BORDER_WIDTH / 2}"
            width="${w - BORDER_WIDTH}" height="${h - BORDER_WIDTH}"
            rx="${r}" ry="${r}"
            fill="none" stroke="${BORDER_COLOR}" stroke-width="${BORDER_WIDTH}"/>
    </svg>`
  );
  return sharp(buf).composite([{ input: svg, blend: "over" }]).png().toBuffer();
}

// Create a rounded drop shadow (properly clipped, not a plain rect)
async function createShadow(w, h, r) {
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="white"/></svg>`
  );
  const base = await sharp({
    create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: SHADOW_ALPHA } },
  })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  return sharp(base).blur(SHADOW_BLUR).png().toBuffer();
}

// Reduce PNG opacity
async function applyOpacity(buf, opacity) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = new Uint8Array(data);
  for (let p = 3; p < px.length; p += 4) px[p] = Math.round(px[p] * opacity);
  return sharp(Buffer.from(px), { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function run() {
  const layers = [];

  for (const src of sources) {
    const file = join(dir, src.file);
    const meta = await sharp(file).metadata();
    const sw = Math.round(FRONT_W * src.scale);
    const sh = Math.round(meta.height * (sw / meta.width));

    // Resize screenshot
    const screenshotBuf = await sharp(file).resize(sw, sh).png().toBuffer();

    // Add inner padding (dark fill around the screenshot)
    const fw = sw + INNER_PAD * 2;
    const fh = sh + INNER_PAD * 2;
    const padded = await sharp({
      create: { width: fw, height: fh, channels: 4, background: INNER_COLOR },
    })
      .composite([{ input: screenshotBuf, left: INNER_PAD, top: INNER_PAD }])
      .png()
      .toBuffer();

    // Rounded corners on the full padded frame
    const outerR = CORNER_R + INNER_PAD;
    const masked = await roundCorners(padded, fw, fh, outerR);

    // Crisp border on top
    const withBorder = await addBorder(masked, fw, fh, outerR);

    layers.push({ buf: withBorder, w: fw, h: fh, r: outerR });
  }

  const n = layers.length;

  // Align all card RIGHT edges — depth shows only via top-peek and left-step
  // front (i=2) anchors the right edge; back cards shift slightly left
  const frontRight = PAD + layers[n - 1].w;
  const positions = layers.map(({ w }, i) => ({
    left: frontRight - w - STAGGER_X * (n - 1 - i),
    top:  PAD + STAGGER_Y * i,
  }));

  // Canvas size — clip right edge flush to front card (no shadow bleed on right)
  const canvasW = frontRight + PAD;
  let maxBottom = 0;
  for (let i = 0; i < n; i++) {
    maxBottom = Math.max(maxBottom, positions[i].top + layers[i].h + PAD + SHADOW_OFFSET);
  }
  const maxRight = canvasW;

  const composites = [];

  for (let i = 0; i < n; i++) {
    const { buf, w, h, r } = layers[i];
    const { left, top } = positions[i];
    const opacity = [0.60, 0.80, 1.0][i];

    // Properly rounded shadow
    const shadow = await createShadow(w, h, r);
    composites.push({ input: shadow, left: left + SHADOW_OFFSET, top: top + SHADOW_OFFSET });

    // Screenshot (faded for back layers)
    const final = opacity < 1 ? await applyOpacity(buf, opacity) : buf;
    composites.push({ input: final, left, top });
  }

  await sharp({
    create: { width: maxRight, height: maxBottom, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(composites)
    .png()
    .toFile(outPath);

  console.log(`Done: ${maxRight}×${maxBottom}`);
}

run().catch(e => { console.error(e); process.exit(1); });
