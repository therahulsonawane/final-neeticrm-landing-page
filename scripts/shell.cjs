// Shared page chrome (nav, footer, enquiry CTA) used by build-pages.cjs and build-blog.cjs
const WA = 'https://wa.me/918329984679';
const SIGNUP = 'https://app.neeticrm.com/signup';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SVG_WA = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>';

function formHtml(p) {
  const roles = [['', 'Select type'], ['Developer', 'Real Estate Developer'], ['Mandate Firm', 'Mandate Sales Firm'], ['Channel Partner', 'Channel Partner / Broker'], ['Marketing Agency', 'Marketing Agency'], ['Other', 'Other']]
    .map(([v, t]) => `<option value="${v}"${v === p.role ? ' selected' : ''}>${t}</option>`).join('');
  return `<div class="pg-form-card">
        <p class="pg-form-card__k">Free demo &middot; Get a quote</p>
        <h3>Book your free 30-minute demo</h3>
        <p>Share a few details and we&rsquo;ll prepare a walkthrough using your kind of leads, usually within 15 minutes.</p>
        <form id="page-enquiry-form" class="pg-form" name="page-enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" data-page="${p.slug}" novalidate>
          <input type="hidden" name="form-name" value="page-enquiry">
          <input type="hidden" name="source_page" value="${p.slug}">
          <input name="bot-field" style="position:absolute;opacity:0;pointer-events:none;height:0;width:0" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="pg-form__grid">
            <div><label for="pg-name">Full name <em>*</em></label><input id="pg-name" name="name" type="text" required placeholder="Rahul Sharma" autocomplete="name"></div>
            <div><label for="pg-phone">Phone <em>*</em></label><div class="pg-phone-wrap"><span>+91</span><input id="pg-phone" name="phone" type="tel" inputmode="numeric" required placeholder="98200 00000" autocomplete="tel-national"></div></div>
          </div>
          <div class="pg-form__grid">
            <div><label for="pg-email">Work email <em>*</em></label><input id="pg-email" name="email" type="email" required placeholder="rahul@company.com" autocomplete="email"></div>
            <div><label for="pg-company">Company <em>*</em></label><input id="pg-company" name="company" type="text" required placeholder="Skyline Realty" autocomplete="organization"></div>
          </div>
          <div class="pg-form__grid">
            <div><label for="pg-role">Business type</label><select id="pg-role" name="role">${roles}</select></div>
            <div><label for="pg-team">Team size</label><select id="pg-team" name="team_size"><option value="">Select size</option><option value="1-5">1 &ndash; 5</option><option value="6-15">6 &ndash; 15</option><option value="16-50">16 &ndash; 50</option><option value="50+">50+</option></select></div>
          </div>
          <div style="margin-bottom:12px"><label for="pg-location">City / location <small>(optional)</small></label><input id="pg-location" name="location" type="text" placeholder="e.g. Pune, Mumbai, Bangalore" autocomplete="address-level2"></div>
          <div style="margin-bottom:16px"><label for="pg-message">What would you like to improve? <small>(optional)</small></label><textarea id="pg-message" name="message" rows="2" placeholder="e.g. We get 250 leads a month from Meta and want to reduce leakage"></textarea></div>
          <div id="pg-alert" class="pg-form__alert" role="alert"></div>
          <button id="pg-submit" class="pg-form__submit" type="submit"><span id="pg-submit-label">Request free demo &amp; get quote &#8599;</span></button>
          <p class="pg-form__fine">&#128274; No spam. Confidential under our <a href="/privacy-policy.html">Privacy Policy</a>.</p>
        </form>
      </div>`;
}

function ctaHtml(p) {
  return `
    <section class="pg-cta" id="enquiry" aria-labelledby="pg-cta-t">
      <div class="rail pg-cta__rail">
        <div>
          <p class="pg-kicker">Free demo</p>
          <h2 id="pg-cta-t">See Neeti CRM working on your own leads</h2>
          <p class="pg-cta__lede">Tell us a little about your team. We&rsquo;ll set up a 30-minute walkthrough around how you sell today.</p>
          <ul class="pg-cta__list">
            <li><i>&#10003;</i><div><strong>Assisted setup</strong><span>We configure the pipeline, sources and workflows with you before the trial clock starts.</span></div></li>
            <li><i>&#10003;</i><div><strong>15-day free trial, no credit card</strong><span>Start with one user and add more as your team grows.</span></div></li>
            <li><i>&#10003;</i><div><strong>Works with the team you have</strong><span>Simple workflows, WhatsApp automation and Android call recording.</span></div></li>
          </ul>
          <a class="pg-wa" href="${WA}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20Neeti%20CRM." target="_blank" rel="noopener" data-track="whatsapp">${SVG_WA}<span>Prefer WhatsApp? +91 832 998 4679</span></a>
        </div>
        ${formHtml(p)}
      </div>
    </section>`;
}

function navHtml() {
  return `  <a class="skip" href="#main">Skip to content</a>
  <header class="nav" data-nav>
    <div class="nav__inner">
      <a class="brand" href="/" aria-label="Neeti CRM home">
        <img class="brand__mark" src="/assets/img/mark-64.png" width="34" height="32" alt="">
        <span class="brand__name">Neeti <span class="brand__sis">CRM</span></span>
      </a>
      <nav class="nav__links" aria-label="Primary">
        <a href="/#solutions">Solutions</a>
        <a href="/#product">How it works</a>
        <a href="/real-estate-crm-pricing/">Pricing</a>
        <a href="/#faq">FAQ</a>
        <a href="/blog/">Blog</a>
        <a href="#enquiry">Enquire</a>
      </nav>
      <div class="nav__actions">
        <a class="btn btn--quiet" href="https://app.neeticrm.com/login">Sign in</a>
        <a class="btn btn--primary" href="#enquiry" data-track="demo"><span class="btn__text">Book a free demo</span><span class="btn__text-mobile">Demo</span> &#8599;</a>
      </div>
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle aria-label="Toggle navigation menu">
        <span class="nav__toggle-bar"></span><span class="nav__toggle-bar"></span><span class="nav__toggle-bar"></span>
      </button>
    </div>
    <div class="menu-backdrop" data-menu-backdrop hidden></div>
    <div class="menu" id="menu" data-menu hidden>
      <a href="/#solutions">Solutions</a>
      <a href="/#product">How it works</a>
      <a href="/real-estate-crm-pricing/">Pricing</a>
      <a href="/#faq">FAQ</a>
        <a href="/blog/">Blog</a>
      <a href="https://app.neeticrm.com/login">Sign in</a>
      <a class="btn btn--primary btn--block" href="#enquiry" data-track="demo">Book a free demo &#8599;</a>
    </div>
  </header>`;
}

function footerHtml() {
  return `  <footer class="footer">
    <div class="rail footer__rail">
      <div class="footer__brand">
        <a class="brand brand--light" href="/" aria-label="Neeti CRM home">
          <img class="brand__mark" src="/assets/img/mark-64.png" width="34" height="32" alt="">
          <span class="brand__name">Neeti <span class="brand__sis">CRM</span></span>
        </a>
        <p>AI-Powered Sales Intelligence System built specifically for real estate businesses.</p>
        <p class="footer__addr">Kothrud, Pune, Maharashtra<br><a href="${WA}" data-track="whatsapp" rel="noopener" target="_blank">+91 832 998 4679</a> on WhatsApp</p>
      </div>
      <nav class="footer__cols" aria-label="Footer">
        <div>
          <p class="footer__h">Solutions</p>
          <a href="/real-estate-crm-for-developers/">Developers</a>
          <a href="/crm-for-channel-partners/">Channel partners</a>
          <a href="/crm-for-mandate-firms/">Mandate firms</a>
        </div>
        <div>
          <p class="footer__h">Product</p>
          <a href="/real-estate-lead-management-software/">Lead management</a>
          <a href="/whatsapp-crm-for-real-estate/">WhatsApp CRM</a>
          <a href="/ai-call-analysis-for-real-estate-sales/">AI call analysis</a>
          <a href="/real-estate-crm-pricing/">Pricing</a>
        </div>
        <div>
          <p class="footer__h">Company</p>
          <a href="/blog/">Blog</a>
          <a href="#enquiry">Book a demo</a>
          <a href="${WA}" data-track="whatsapp" rel="noopener" target="_blank">Contact</a>
          <a href="https://app.neeticrm.com/login">Sign in</a>
          <a href="${SIGNUP}" data-track="signup">Start free trial</a>
        </div>
        <div>
          <p class="footer__h">Legal</p>
          <a href="/terms-of-service.html">Terms of Service</a>
          <a href="/privacy-policy.html">Privacy Policy</a>
          <a href="/refund-policy.html">Refund Policy</a>
          <a href="/security.html">Security Policy</a>
        </div>
      </nav>
    </div>
    <div class="rail footer__base">
      <p>&copy; 2026 Neeti CRM. All rights reserved.</p>
      <p>Prices in Indian rupees, excluding GST.</p>
    </div>
  </footer>

  <aside class="mobile-cta-bar" data-mobile-bar aria-label="Quick Actions">
    <div class="mobile-cta-bar__inner">
      <a class="btn btn--line btn--mobile-wa" href="${WA}?text=Hi%2C%20I%27d%20like%20more%20info%20about%20Neeti%20CRM." target="_blank" rel="noopener" data-track="whatsapp">${SVG_WA}<span>WhatsApp</span></a>
      <a class="btn btn--primary btn--mobile-demo" href="#enquiry" data-track="demo">Book Free Demo &#8599;</a>
    </div>
  </aside>`;
}

/* ---------- Real product screenshots (assets/img) ---------- */
const IMG = {
  dashboard: { base: 'dashboard', w: 1600, h: 1000, set: [960, 1600, 2400], pick: 1, alt: 'Neeti CRM Sales Intelligence Dashboard showing qualified leads, site visits and bookings', url: 'app.neeticrm.com/dashboard' },
  leads: { base: 'leads', w: 1400, h: 1016, set: [800, 1400], pick: 0, alt: 'Lead management list in Neeti CRM with campaign and source for each lead, buyer score, repeat lead and SLA breach flags', url: 'app.neeticrm.com/leads' },
  command: { base: 'command-centre', w: 1400, h: 711, set: [800, 1400], pick: 0, alt: 'Daily command centre in Neeti CRM showing priority leads queue with first-call timers', url: 'app.neeticrm.com/today' },
  whatsapp: { base: 'whatsapp', w: 1400, h: 1016, set: [800, 1400], pick: 0, alt: 'WhatsApp CRM inbox in Neeti CRM: the AI assistant replies to a buyer, sends project brochure with site visit buttons', url: 'app.neeticrm.com/whatsapp' },
  automation: { base: 'automation', w: 1000, h: 744, set: [600, 1000], pick: 0, alt: 'WhatsApp automation flow builder: lead created, assign agent, send template, wait for reply, then notify or create call task', url: 'app.neeticrm.com/automations' },
  project: { base: 'project360', w: 1400, h: 1016, set: [800, 1400], pick: 0, alt: 'Marketing funnel report in Neeti CRM: cost per lead, cost per site visit and cost per booking split by source', url: 'app.neeticrm.com/reports' },
  team: { base: 'team', w: 1200, h: 358, set: [700, 1200], pick: 0, alt: 'Agent scorecard with calls, talk time, visits, bookings and status: On track, Improving, Needs coaching', url: 'app.neeticrm.com/team' }
};
const PHONE = {
  home: { base: 'm-home', alt: "Neeti CRM mobile app home screen: a new lead waiting with Call now and WhatsApp buttons, today's numbers and the agent's priority queue" },
  leadcalls: { base: 'm-lead-calls', alt: 'Lead profile on mobile with site visit scheduled, recorded calls with QA and intent scores' },
  postcall: { base: 'm-postcall', alt: 'Call outcome screen after a call: connected, choose interested, follow up, call back later, not interested or wrong number' },
  objection: { base: 'm-objection', alt: 'Objection coach on Neeti CRM mobile app: explaining what a buyer means and what the agent can say' },
  callbrain: { base: 'm-call-brain', alt: 'AI call analysis on Neeti CRM mobile app: conversation quality score, discovery, objection handling, coaching opportunity' }
};

function frame(key, { eager = false, sizes = '(min-width: 980px) 560px, 92vw' } = {}) {
  const i = IMG[key];
  const src = `/assets/img/${i.base}-${i.set[i.pick]}.webp`;
  const srcset = i.set.map((w) => `/assets/img/${i.base}-${w}.webp ${w}w`).join(', ');
  return `<div class="pg-frame"><div class="pg-frame__bar"><i></i><i></i><i></i><span>${esc(i.url)}</span></div>
          <img src="${src}" srcset="${srcset}" sizes="${sizes}" width="${i.w}" height="${i.h}" alt="${esc(i.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`;
}
function phones(keys, { eager = false, hero = false } = {}) {
  const items = keys.map((k) => {
    const p = PHONE[k];
    return `<div class="pg-phone"><img src="/assets/img/${p.base}-360.webp" srcset="/assets/img/${p.base}-360.webp 360w, /assets/img/${p.base}-720.webp 720w" sizes="220px" width="360" height="779" alt="${esc(p.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`;
  }).join('\n          ');
  return `<div class="pg-phones pg-phones--${keys.length}${hero ? ' pg-phones--hero' : ''}">\n          ${items}\n        </div>`;
}


module.exports = { WA, SIGNUP, esc, SVG_WA, formHtml, ctaHtml, navHtml, footerHtml, IMG, PHONE, frame, phones };
