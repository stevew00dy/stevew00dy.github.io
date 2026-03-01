import sharp from "sharp";
import { join } from "path";

const inPath = "C:/Users/info/.cursor/projects/d-Cursor/assets/c__Users_info_AppData_Roaming_Cursor_User_workspaceStorage_8379fc235b3a8971f91319e4ad838410_images_image-3d559359-f3df-44fd-8983-d8fda21c7eec.png";
const outPath = join("d:/Cursor/undisputed-noobs/apps/landing/public/lesson-thumbnails/basic-training-stack.png");

async function run() {
  const { data, info } = await sharp(inPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Uint8Array(data);

  for (let i = 0; i < width * height; i++) {
    const offset = i * 4;
    const r = pixels[offset];
    const g = pixels[offset + 1];
    const b = pixels[offset + 2];

    // Checkered background: alternating white and light grey
    const isLight = r > 160 && g > 160 && b > 160;
    if (isLight) {
      pixels[offset + 3] = 0; // fully transparent
    }
  }

  await sharp(pixels, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outPath);

  console.log("Done:", outPath);
}

run().catch(e => { console.error(e); process.exit(1); });
