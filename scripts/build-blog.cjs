// Builds /blog/ and /blog/<slug>/ from content/blog/*.md. Run via `node scripts/build-pages.cjs`
// (which calls this) or directly: `node scripts/build-blog.cjs`.
// Post format: frontmatter (title, slug, desc, category, read, image, faq lines "Q || A") then Markdown-lite body.
const fs = require('fs');
const path = require('path');
const { SITE_URL, esc, navHtml, footerHtml, ctaHtml, frame, SIGNUP } = Object.assign({ SITE_URL: 'https://neeticrm.com' }, require('./shell.cjs'));
const root = path.resolve(__dirname, '..');
const SITE = SITE_URL;
const TODAY = '2026-11-27';
const AUTHOR = 'Neeti CRM Team';

function parse(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('No frontmatter: ' + file);
  const meta = { faq: [] };
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':'); if (i < 0) continue;
    const k = line.slice(0, i).trim(), v = line.slice(i + 1).trim();
    if (k === 'faq') { const [q, a] = v.split('||').map((x) => x.trim()); meta.faq.push([q, a]); } else meta[k] = v;
  }
  meta.body = m[2].trim();
  return meta;
}

const slugify = (t) => t.toLowerCase().replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function inline(t) {
  return esc(t)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, a, u) => `<a href="${u}"${/^https?:/.test(u) ? ' rel="noopener"' : ''}>${a}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function renderBody(md) {
  const blocks = md.split(/\n{2,}/); const out = []; const toc = [];
  for (const b of blocks) {
    const t = b.trim(); if (!t) continue;
    let m;
    if ((m = t.match(/^## (.+)$/))) { const id = slugify(m[1]); toc.push([id, m[1]]); out.push(`<h2 id="${id}">${inline(m[1])}</h2>`); }
    else if ((m = t.match(/^### (.+)$/))) out.push(`<h3>${inline(m[1])}</h3>`);
    else if (/^\{\{fig:/.test(t)) { m = t.match(/^\{\{fig:([a-z]+)\|?(.*)\}\}$/); out.push(`<figure class="bl-fig">${frame(m[1], { sizes: '(min-width: 1100px) 720px, 92vw' })}${m[2] ? `<figcaption>${inline(m[2])}</figcaption>` : ''}</figure>`); }
    else if (/^\{\{cta\|/.test(t)) { m = t.match(/^\{\{cta\|(.+?)\|(.+)\}\}$/); out.push(`<aside class="bl-inline-cta"><div><strong>${inline(m[1])}</strong><span>${inline(m[2])}</span></div><a class="btn btn--primary" href="#enquiry" data-track="demo">Book a free demo &#8599;</a></aside>`); }
    else if (/^(- .+(\n|$))+$/.test(t)) out.push('<ul>' + t.split('\n').map((l) => `<li>${inline(l.replace(/^- /, ''))}</li>`).join('') + '</ul>');
    else if (/^(\d+\. .+(\n|$))+$/.test(t)) out.push('<ol>' + t.split('\n').map((l) => `<li>${inline(l.replace(/^\d+\. /, ''))}</li>`).join('') + '</ol>');
    else if (/^> /.test(t)) out.push(`<blockquote class="bl-callout">${t.split('\n').map((l) => inline(l.replace(/^> ?/, ''))).join('<br>')}</blockquote>`);
    else if (/^\|/.test(t)) {
      const rows = t.split('\n').filter((l) => !/^\|\s*-/.test(l)).map((l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
      out.push(`<div class="bl-table"><table><thead><tr>${rows[0].map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
    } else out.push(`<p>${inline(t)}</p>`);
  }
  return { html: out.join('\n'), toc };
}

const posts = fs.readdirSync(path.join(root, 'content/blog')).filter((f) => f.endsWith('.md')).sort()
  .map((f) => Object.assign(parse(path.join(root, 'content/blog', f)), { file: f }))
  .sort((a, b) => Number(a.order) - Number(b.order));

const head = (title, desc, url, type, extra = '') => `<!doctype html>
<html lang="en-IN" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#111827">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="Neeti CRM">
  <meta property="og:locale" content="en_IN">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${SITE}/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Neeti CRM - AI-Powered Sales Intelligence System for Real Estate">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${SITE}/og-image.jpg">${extra}
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/assets/fonts/jakarta-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/pages.css">
  <script>document.documentElement.classList.add('js')</script>
  <script src="/assets/js/site.js" defer></script>
  <script src="/assets/js/page-enquiry.js" defer></script>`;

const ld = (o) => `  <script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n  </script>\n</head>`;
const publisher = { '@type': 'Organization', name: 'Neeti CRM', url: SITE + '/', logo: { '@type': 'ImageObject', url: SITE + '/icon-512.png' } };
const fmt = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

function card(p, big) {
  return `<a class="bl-card${big ? ' bl-card--big' : ''}" href="/blog/${p.slug}/"><span class="bl-card__cat">${esc(p.category)}</span><strong>${esc(p.title)}</strong><span class="bl-card__ex">${esc(p.excerpt || p.desc)}</span><span class="bl-card__meta">${p.read} min read &middot; Read article &rarr;</span></a>`;
}

function renderPost(p, i) {
  const url = `${SITE}/blog/${p.slug}/`;
  const { html, toc } = renderBody(p.body);
  const words = p.body.split(/\s+/).length;
  const related = posts.filter((o) => o.slug !== p.slug);
  const next = [1, 2, 3].map((k) => related[(i + k - 1) % related.length]);
  const faq = p.faq.length ? `<section class="bl-faq" aria-labelledby="bl-faq-t"><h2 id="bl-faq-t">Frequently asked questions</h2>${p.faq.map((f, n) => `<details${n === 0 ? ' open' : ''}><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('')}</section>` : '';
  const graph = [
    { '@type': 'BlogPosting', '@id': url + '#post', headline: p.title, description: p.desc, url, mainEntityOfPage: url, datePublished: TODAY, dateModified: TODAY, inLanguage: 'en-IN', wordCount: words, articleSection: p.category, image: SITE + '/og-image.jpg', author: { '@type': 'Organization', name: AUTHOR, url: SITE + '/' }, publisher, isPartOf: { '@type': 'Blog', '@id': SITE + '/blog/#blog' } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/' },
      { '@type': 'ListItem', position: 3, name: p.title, item: url } ] }
  ];
  if (p.faq.length) graph.push({ '@type': 'FAQPage', mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) });
  return head(p.title + ' | Neeti CRM', p.desc, url, 'article', `\n  <meta property="article:published_time" content="${TODAY}">\n  <meta property="article:section" content="${esc(p.category)}">`)
    + '\n' + ld({ '@context': 'https://schema.org', '@graph': graph }) + `
<body>
  <a class="skip" href="#main">Skip to content</a>
${navHtml().replace(/^[\s\S]*?<header/, '<header')}
  <main id="main" class="pg-main">
    <section class="bl-head">
      <div class="rail bl-head__rail">
        <nav class="pg-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">&rsaquo;</span><a href="/blog/">Blog</a><span aria-hidden="true">&rsaquo;</span><span>${esc(p.category)}</span></nav>
        <span class="pg-badge">${esc(p.category)}</span>
        <h1 class="bl-h1">${esc(p.h1 || p.title)}</h1>
        <p class="bl-dek">${esc(p.excerpt || p.desc)}</p>
        <p class="bl-meta"><span>By ${AUTHOR}</span><span>${fmt(TODAY)}</span><span>${p.read} min read</span></p>
      </div>
    </section>
    <section class="bl-wrap">
      <div class="rail bl-grid">
        <article class="bl-article">
${html}
          <aside class="bl-end-cta"><h2>See it on your own leads</h2><p>Neeti CRM gives real estate sales teams instant lead alerts, WhatsApp follow-ups, call coaching and a marketing-to-booking dashboard in one system. Setup is assisted, and your 15-day free trial starts once the essentials are live.</p><div class="pg-ctas"><a class="btn btn--primary btn--lg" href="#enquiry" data-track="demo">Book your free demo &#8599;</a><a class="btn btn--line btn--lg" href="${SIGNUP}" data-track="signup">Start 15-day free trial</a></div></aside>
          ${faq}
        </article>
        <aside class="bl-side" aria-label="On this page">
          <div class="bl-toc"><p>In this article</p><ol>${toc.map((t) => `<li><a href="#${t[0]}">${esc(t[1])}</a></li>`).join('')}</ol></div>
          <div class="bl-side-card"><strong>Built for real estate sales teams</strong><span>Lead capture, WhatsApp follow-ups, AI call analysis and cost per booking.</span><a class="btn btn--primary btn--block" href="#enquiry" data-track="demo">Book a free demo &#8599;</a><a class="bl-side-link" href="/real-estate-lead-management-software/">Explore lead management &rarr;</a></div>
        </aside>
      </div>
    </section>
${ctaHtml({ slug: 'blog-' + p.slug, role: '' })}
    <section class="pg-sec pg-sec--end" aria-labelledby="bl-more-t" style="border-bottom:0">
      <div class="rail">
        <div class="pg-head"><p class="pg-kicker">Keep reading</p><h2 class="pg-h2" id="bl-more-t">More from the Neeti CRM blog</h2></div>
        <div class="bl-cards">${next.map((o) => card(o)).join('')}</div>
        <p class="pg-note">Neeti CRM&rsquo;s 30% improvement figure is a market-testing target, not a guaranteed or proven customer result. Outcomes depend on your starting point and implementation.</p>
      </div>
    </section>
  </main>
${footerHtml().replace(/^\s*/, '  ')}
</body>
</html>
`;
}

function renderIndex() {
  const url = SITE + '/blog/';
  const title = 'Real Estate CRM & Sales Blog | Neeti CRM';
  const desc = 'Practical guides for real estate developers, mandate firms and channel partners: lead management, WhatsApp follow-ups, site visits, objection handling and cost per booking.';
  const graph = [
    { '@type': 'Blog', '@id': url + '#blog', url, name: 'Neeti CRM Blog', description: desc, inLanguage: 'en-IN', publisher,
      blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}/blog/${p.slug}/`, datePublished: TODAY })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: url }] }
  ];
  return head(title, desc, url, 'website') + '\n' + ld({ '@context': 'https://schema.org', '@graph': graph }) + `
<body>
  <a class="skip" href="#main">Skip to content</a>
${navHtml().replace(/^[\s\S]*?<header/, '<header')}
  <main id="main" class="pg-main">
    <section class="bl-head bl-head--index">
      <div class="rail bl-head__rail">
        <nav class="pg-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">&rsaquo;</span><span>Blog</span></nav>
        <span class="pg-badge">The Neeti CRM blog</span>
        <h1 class="bl-h1">Real estate sales, explained plainly</h1>
        <p class="bl-dek">Practical guides on lead management, follow-ups, site visits and sales coaching for developers, mandate firms and channel partners. No jargon, no filler.</p>
      </div>
    </section>
    <section class="bl-wrap">
      <div class="rail">
        <div class="bl-cards bl-cards--index">${posts.map((p, i) => card(p, i === 0)).join('')}</div>
      </div>
    </section>
${ctaHtml({ slug: 'blog', role: '' })}
  </main>
${footerHtml().replace(/^\s*/, '  ')}
</body>
</html>
`;
}

fs.mkdirSync(path.join(root, 'blog'), { recursive: true });
fs.writeFileSync(path.join(root, 'blog/index.html'), renderIndex());
posts.forEach((p, i) => {
  const dir = path.join(root, 'blog', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderPost(p, i));
});
console.log('wrote blog index +', posts.length, 'posts');
module.exports = { posts };
