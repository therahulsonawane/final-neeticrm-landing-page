/**
 * Builds a single self-contained preview file that can be sent on WhatsApp or email and opened
 * with a double-click: CSS, JS, fonts and images are embedded, nothing else is needed.
 *   node scripts/build-single.cjs   ->  ../share/neetisis-preview.html
 *
 * Differences from the real page, on purpose:
 * - the Meta Pixel is removed, so people opening the preview do not count as site visits in your ads data;
 * - it is marked noindex, so it never competes with neetisis.com if someone uploads it somewhere;
 * - each image is embedded once, at its sharpest size, instead of the responsive set.
 * Run it again after editing the site; it always reads the current files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT, '../share');
const OUT = path.join(OUT_DIR, 'neetisis-preview.html');

const MIME = { '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const dataUri = (file) => `data:${MIME[path.extname(file)]};base64,${fs.readFileSync(file).toString('base64')}`;
const rel = (p) => path.join(ROOT, p);

let html = fs.readFileSync(rel('index.html'), 'utf8');
const css = fs.readFileSync(rel('assets/css/site.css'), 'utf8');
const js = fs.readFileSync(rel('assets/js/site.js'), 'utf8');

function mustReplace(pattern, replacement, label) {
  const before = html;
  html = html.replace(pattern, replacement);
  if (html === before) throw new Error(`Could not find: ${label}`);
}

// Meta Pixel (script in <head> and the <noscript> image in <body>)
mustReplace(/<!-- Meta Pixel Code[\s\S]*?<!-- End Meta Pixel Code -->\n?/, '', 'Meta Pixel script');
mustReplace(/<noscript><img[^>]*facebook\.com\/tr[^>]*><\/noscript>\n?/, '', 'Meta Pixel noscript');

// Preloads and icons point at files that will not travel with the preview
html = html.replace(/<link rel="preload"[^>]*>\n?/g, '');
html = html.replace(/<link rel="(icon|apple-touch-icon|manifest)"[^>]*>\n?/g, '');
mustReplace('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
  `<meta name="robots" content="noindex, nofollow">\n<link rel="icon" href="${dataUri(rel('favicon-32.png'))}">`, 'robots meta');

// Styles with fonts embedded
const inlineCss = css.replace(/url\(\.\.\/fonts\/([^)]+)\)/g, (_, f) => `url(${dataUri(rel('assets/fonts/' + f))})`);
mustReplace('<link rel="stylesheet" href="assets/css/site.css">', `<style>\n${inlineCss}\n</style>`, 'stylesheet link');

// Script: inline scripts cannot be deferred, so it moves to the end of <body>
mustReplace('<script src="assets/js/site.js" defer></script>\n', '', 'script tag');
mustReplace('</body>', `<script>\n${js}\n</script>\n</body>`, '</body>');

// Images: keep the sharpest candidate from srcset, embed it, drop srcset/sizes
html = html.replace(/<img\b[^>]*>/g, (tag) => {
  let src = (tag.match(/\ssrc="([^"]+)"/) || [])[1];
  const srcset = (tag.match(/\ssrcset="([^"]+)"/) || [])[1];
  if (srcset) {
    const best = srcset.split(',').map((s) => s.trim().split(/\s+/)).sort((a, b) => parseInt(b[1], 10) - parseInt(a[1], 10))[0];
    src = best[0];
  }
  if (!src || !src.startsWith('assets/')) return tag;
  return tag
    .replace(/\s(srcset|sizes)="[^"]*"/g, '')
    .replace(/\ssrc="[^"]+"/, ` src="${dataUri(rel(src))}"`);
});

// Site-relative links only work on neetisis.com itself
html = html.replace(/href="\/sales_hiring\/"/g, 'href="https://neetisis.com/sales_hiring/"');
html = html.replace(/href="\.\/"/g, 'href="#main"');

const leftovers = html.match(/(src|href)="assets\/[^"]+"/g);
if (leftovers) throw new Error('Unembedded files left: ' + leftovers.join(', '));

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`${path.relative(process.cwd(), OUT)}  ${(fs.statSync(OUT).size / 1024 / 1024).toFixed(2)} MB`);
