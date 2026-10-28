/**
 * Builds every image the site serves from the source captures and brand files.
 * Run from marketing/website:  npm install && npm run assets
 * (or, without installing: NODE_PATH=../../backend/node_modules node scripts/build-assets.cjs)
 *
 * Sources
 *   ../launch-video/public/captures/{web,mobile}/*.png  scrubbed demo-mode screenshots of the real app
 *   ../launch-video/public/brand/light_logo.png         full logo; the N mark is cropped from it
 *   ../../mobile/assets/images/logo-mark.png            rounded app icon (favicons)
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const CAPTURES = path.resolve(ROOT, '../launch-video/public/captures');
const BRAND = path.resolve(ROOT, '../launch-video/public/brand');
const APP_ICON = path.resolve(ROOT, '../../mobile/assets/images/latest-icon.png');
const OUT = path.join(ROOT, 'assets/img');
fs.mkdirSync(OUT, { recursive: true });

// Web captures are 2880x1800 (1440x900 CSS px at 2x). The app sidebar is the first 400 px.
const SIDEBAR = 400;
const WEB = [
  // name, source, crop (in source px) or null, output widths
  ['dashboard', 'web/dashboard.png', null, [960, 1600, 2400]],
  ['leads', 'web/leads.png', { left: SIDEBAR, top: 0, width: 2880 - SIDEBAR, height: 1800 }, [800, 1400]],
  ['command-centre', 'web/dashboard.png', { left: SIDEBAR, top: 0, width: 2880 - SIDEBAR, height: 1260 }, [800, 1400]],
  ['whatsapp', 'web/whatsapp.png', { left: SIDEBAR, top: 0, width: 2880 - SIDEBAR, height: 1800 }, [800, 1400]],
  ['automation', 'web/automation-flow.png', { left: SIDEBAR + 60, top: 610, width: 1600, height: 1190 }, [600, 1000]],
  ['project360', 'web/project360.png', { left: SIDEBAR, top: 0, width: 2880 - SIDEBAR, height: 1600 }, [800, 1400]],
  ['meta-ads', 'web/meta-ads.png', { left: SIDEBAR, top: 0, width: 2880 - SIDEBAR, height: 1620 }, [800, 1400]],
  ['team', 'web/team-agents.png', { left: SIDEBAR + 20, top: 340, width: 2420, height: 560 }, [700, 1200]],
];

// Mobile captures are 1170x2532 (390x844 CSS px at 3x).
const MOBILE = [
  ['m-home', 'mobile/home.png'],
  ['m-call-brain', 'mobile/call-brain.png'],
  ['m-objection', 'mobile/objection.png'],
  ['m-postcall', 'mobile/postcall.png'],
  ['m-lead-calls', 'mobile/lead-calls.png'],
  ['m-assistant', 'mobile/assistant.png'],
];
const MOBILE_WIDTHS = [360, 720];

async function webp(input, file, width, opts = {}) {
  const info = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: opts.quality || 80, effort: 6, smartSubsample: true })
    .toFile(path.join(OUT, file));
  return `${file} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`;
}

async function main() {
  const log = [];

  for (const [name, src, crop, widths] of WEB) {
    let base = sharp(path.join(CAPTURES, src));
    if (crop) base = base.extract(crop);
    const buf = await base.png().toBuffer();
    for (const w of widths) log.push(await webp(buf, `${name}-${w}.webp`, w));
  }

  for (const [name, src] of MOBILE) {
    const buf = await sharp(path.join(CAPTURES, src)).png().toBuffer();
    for (const w of MOBILE_WIDTHS) log.push(await webp(buf, `${name}-${w}.webp`, w, { quality: 82 }));
  }

  // Brand: the N mark sits in the first 450 px of the transparent wordmark.
  const mark = await sharp(path.join(BRAND, 'light_logo.png'))
    .extract({ left: 0, top: 0, width: 450, height: 421 })
    .png()
    .toBuffer();
  for (const h of [64, 128]) {
    const info = await sharp(mark).resize({ height: h }).png({ compressionLevel: 9 }).toFile(path.join(OUT, `mark-${h}.png`));
    log.push(`mark-${h}.png ${info.width}x${info.height}`);
  }
  log.push(await webp(mark, 'mark-256.webp', 256, { quality: 90 }));

  // Icons: the rounded app icon. Its corners are opaque black, so mask them to a rounded rect.
  const iconSrc = await sharp(APP_ICON).png().toBuffer();
  const meta = await sharp(iconSrc).metadata();
  const inset = Math.round(meta.width * 0.03);
  const size = meta.width - inset * 2;
  const radius = Math.round(size * 0.225);
  const roundMask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}"/></svg>`
  );
  const icon = await sharp(iconSrc)
    .extract({ left: inset, top: inset, width: size, height: size })
    .composite([{ input: roundMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const ROOT_FILES = [
    ['favicon-32.png', 32],
    ['favicon-48.png', 48],
    ['apple-touch-icon.png', 180],
    ['icon-192.png', 192],
    ['icon-512.png', 512],
  ];
  for (const [file, s] of ROOT_FILES) {
    let img = sharp(icon).resize(s, s);
    // iOS draws its own rounded corners and shows transparency as black: give it a full-bleed square.
    if (file === 'apple-touch-icon.png') {
      img = sharp(iconSrc).extract({ left: inset, top: inset, width: size, height: size }).resize(s, s).flatten({ background: '#05071a' });
    }
    await img.png({ compressionLevel: 9 }).toFile(path.join(ROOT, file));
    log.push(`${file} ${s}x${s}`);
  }

  // favicon.ico: a single 48x48 PNG wrapped in an ICO container (browsers ask for /favicon.ico by default).
  const png48 = fs.readFileSync(path.join(ROOT, 'favicon-48.png'));
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(48, 6); // width
  header.writeUInt8(48, 7); // height
  header.writeUInt8(0, 8); // palette
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png48.length, 14); // image size
  header.writeUInt32LE(22, 18); // image offset
  fs.writeFileSync(path.join(ROOT, 'favicon.ico'), Buffer.concat([header, png48]));
  log.push('favicon.ico 48x48');

  console.log(log.join('\n'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
