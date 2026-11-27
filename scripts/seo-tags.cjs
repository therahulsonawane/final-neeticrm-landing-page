// Search Console verification + Google Analytics 4 tags, driven by site.config.json.
// Leave a value empty to emit nothing. Fill it in, then run `node scripts/build-pages.cjs`.
// That rebuilds every generated page and rewrites the marked block in the hand-written pages.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));
const gsc = (process.env.SEO_GSC || cfg.gscVerification || '').trim();
const ga4 = (process.env.SEO_GA4 || cfg.ga4Id || '').trim();
if (ga4 && !/^G-[A-Z0-9]{6,}$/.test(ga4)) throw new Error('ga4Id must look like G-XXXXXXXXXX');
if (gsc && !/^[A-Za-z0-9_-]{20,}$/.test(gsc)) throw new Error('gscVerification must be the token only (the content="..." value), not the whole tag');

function seoTags() {
  const out = [];
  if (gsc) out.push(`<meta name="google-site-verification" content="${gsc}">`);
  if (ga4) out.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4}"></script>\n  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4}');</script>`);
  return out.join('\n  ');
}

// Hand-written pages: keep a marked block right after the viewport meta tag.
const START = '<!-- seo-tags:start -->', END = '<!-- seo-tags:end -->';
function applyStatic() {
  const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
  const block = `${START}${seoTags() ? '\n  ' + seoTags() + '\n  ' : ''}${END}`;
  let n = 0;
  for (const f of files) {
    const p = path.join(root, f); let s = fs.readFileSync(p, 'utf8'); const before = s;
    if (s.includes(START)) s = s.replace(new RegExp(START + '[\\s\\S]*?' + END), block);
    else if (/<meta name="viewport"[^>]*>/.test(s)) s = s.replace(/(<meta name="viewport"[^>]*>)/, `$1\n  ${block}`);
    else continue;
    if (s !== before) { fs.writeFileSync(p, s); n++; }
  }
  return n;
}
module.exports = { seoTags, applyStatic };
