# neetisis.com landing page

The public home page for Neeti SIS (formerly NeetiCRM). It's plain HTML, CSS and JavaScript with no framework and no build step: this folder **is** the site.

```
index.html              the page (all copy, SEO tags and structured data live here)
assets/css/site.css     styles
assets/js/site.js       motion and interactions (optional: the page is complete without it)
assets/img/             screenshots, logo mark (generated, see below)
assets/fonts/           Inter + Plus Jakarta Sans, self-hosted (SIL Open Font License)
og-image.png            picture shown when the link is shared on WhatsApp, LinkedIn, Facebook
robots.txt, sitemap.xml, site.webmanifest, favicons, 404.html, netlify.toml
scripts/                asset builders and a local preview server
```

## Preview

```bash
node scripts/serve.cjs        # http://localhost:8771
```

## Deploy (Netlify, where neetisis.com runs today)

1. Copy everything in this folder into the root of the neetisis.com Netlify site, replacing the old `index.html`.
2. **Keep the existing `sales_hiring/` folder.** The footer links to `/sales_hiring/` and the sitemap lists it.
3. Deploy, then open https://neetisis.com and check that the hero plays, the pricing toggle works and the WhatsApp buttons open a chat.

The Meta Pixel (`2566818950420146`) and the Facebook domain-verification tag from the old page are kept. The pixel now starts after the page has loaded, so it no longer slows the first paint; page views are still recorded. Clicks on "Start free trial" send a custom `StartTrialClick` event and WhatsApp clicks send the standard `Contact` event.

## Things to change in one place

| What | Where |
|---|---|
| Sign-up and sign-in links | `https://app.neeticrm.com/signup` and `/login` in `index.html` and `404.html` |
| WhatsApp number | `918329984679` in `index.html` (and in the JSON-LD `telephone`) |
| Legal pages | footer links point to `neeticrm.com/privacy-policy`, `/terms-of-service`, `/refund-policy`. Move them to neetisis.com before redirecting neeticrm.com |
| Prices | the plan cards, the `PRICES` table in `assets/js/site.js`, the FAQ answer, and the FAQ + `offers` JSON-LD in `<head>` |
| Customer numbers (15+, 459+, 14K+) | the "Built by people who sell real estate" block |

FAQ text appears twice: once on the page and once in the `FAQPage` JSON-LD in `<head>`. Google requires them to match, so edit both.

## Rebuilding images

Screenshots come from the scrubbed demo-mode captures in `../launch-video/public/captures/` (fake names and numbers only). To refresh them, retake the captures there, then:

```bash
npm install          # sharp + puppeteer-core
npm run assets       # resized WebP screenshots, logo mark, favicons
npm run og           # og-image.png from scripts/og.html (uses the installed Chrome)
```

If a section's height changes a lot, update its `contain-intrinsic-size` in `site.css` (the measured heights are noted there). These sizes let the browser skip off-screen sections and keep in-page links landing in the right place.

## SEO: what is done, and what only you can do

**On the page (done):** the title and H1 target "lead CRM"; the meta description, canonical, robots and Open Graph tags are set; there are `Organization`, `WebSite`, `SoftwareApplication` (with the three prices) and `FAQPage` structured data; there is one H1 and an ordered heading structure; every screenshot has descriptive alt text; there's a sitemap and robots.txt. The page is fast: about 140 KB on first load plus Meta's pixel, no layout shift, and the LCP is about 2.5 to 2.7 s on a throttled slow-4G phone profile.

Nobody can promise first place on Google for "leads CRM". That query is dominated by large, long-established sites, and ranking depends mostly on things outside the page. In order of impact:

1. **Google Search Console:** verify neetisis.com, submit `https://neetisis.com/sitemap.xml`, and request indexing of the home page. Check the "Enhancements" report for the FAQ and software structured data.
2. **Move NeetiCRM's authority to the new name:** once the legal pages live on neetisis.com, 301-redirect every neeticrm.com URL to its neetisis.com equivalent. Don't leave two sites competing.
3. **Google Business Profile** for Neeti SIS at the Kothrud address, with the website link. This drives "CRM in Pune" style searches.
4. **Links from real sites:** Estate Autopilots' website, real estate associations and portals you work with, SaaS directories (G2, Capterra, GetApp, SoftwareSuggest, Techjockey), and LinkedIn company and founder pages that all point to neetisis.com.
5. **One page per search intent.** The home page targets "lead CRM". Separate pages win the long tail: "real estate CRM", "CRM for builders", "WhatsApp CRM for real estate", "CRM with call recording", "99acres / MagicBricks lead integration". Then add short guides (for example "How fast should you call a property lead?"). Each page links back to the home page.
6. **Reviews and case studies** from the 15+ client teams, with names and permission. They also replace the testimonial section the page deliberately does not have.
