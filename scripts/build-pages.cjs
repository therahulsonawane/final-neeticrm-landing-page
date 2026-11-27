// Generates the SEO landing pages as <slug>/index.html. Run from the site root:
//   node scripts/build-pages.cjs
// Copy, FAQs, screenshots and schema live in the PAGES list below. Edit it and re-run;
// do not hand-edit the generated files. Also rewrites sitemap.xml.
const fs = require('fs');
const { seoTags, applyStatic } = require('./seo-tags.cjs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const SITE = 'https://neeticrm.com';
const TODAY = '2026-11-27';
const { WA, SIGNUP, SVG_WA, formHtml, ctaHtml, navHtml, footerHtml, IMG, PHONE, frame, phones } = require('./shell.cjs');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SOURCES = ['Meta Ads', 'Google Ads', '99acres', 'MagicBricks', 'Housing.com', 'WhatsApp', 'Website forms', 'CSV import'];

const STEPS = [
  ['Configure', 'We set up your pipeline, stages and teams to match how you sell.'],
  ['Activate', 'Lead sources, WhatsApp and workflows are connected and tested with real leads.'],
  ['Onboard', 'Your sales team is trained on the web and mobile app.'],
  ['Use for 15 days', 'Your 15-day free trial starts once the essentials are ready. No credit card needed.']
];

/* role = value pre-selected in the inquiry form */
const PAGES = [
  {
    slug: 'real-estate-crm-for-developers', label: 'CRM for developers', role: 'Developer',
    title: 'Real Estate CRM for Developers in India | Neeti CRM',
    desc: 'Neeti CRM gives real estate developers one pipeline for every project: lead capture, first-call timers, site visits, bookings and cost per booking.',
    badge: 'For real estate developers', h1: 'The real estate CRM built for developers',
    intro: 'You pay for leads on several portals and ad platforms at once, then lose many of them to slow first calls and missed follow-ups. Neeti CRM puts every project, source and salesperson in one system, so you can see what each rupee of marketing turns into.',
    trust: ['Every project in one account', 'Cost per booking by project', '15-day free trial'],
    hero: { frame: 'dashboard' },
    problem: { kicker: 'The problem', title: 'Most lead loss happens after the lead arrives', text: 'Buying more leads rarely fixes a leaking funnel. These are the three gaps that cost developers the most.', cards: [
      ['Lead leakage', 'Enquiries arrive from portals, ads and WhatsApp, and some are called late or never.'],
      ['Weak conversions', 'Follow-ups depend on memory, and sales conversations vary from caller to caller.'],
      ['Limited visibility', 'It is hard to say which source, project or salesperson is actually producing bookings.'] ] },
    rows: [
      { kicker: 'Capture', title: 'Every project and every source in one lead list', text: 'Leads from every portal, ad platform and form land in one list, each tagged with its campaign and source, so nothing sits in an inbox or a spreadsheet.',
        bullets: ['Campaign and source recorded on every lead', 'Buyer score, repeat-lead and SLA-breach flags at a glance', 'Buyer profile with BHK, budget and timeline', 'Repeat buyers recognised instead of logged as new'], shot: { frame: 'leads' }, cap: 'The lead list: source, buyer score and SLA flags per lead.' },
      { kicker: 'Respond', title: 'A daily command centre so no lead goes cold', text: 'Each salesperson opens the day to a priority queue. First-call timers you set keep new enquiries from waiting, and assignment knows who is available.',
        bullets: ['First-call timers you configure', 'Leave-aware lead assignment', 'Site visits scheduled with reminders', 'Priority queue for every agent'], shot: { frame: 'command' }, cap: 'The daily command centre with first-call timers.' },
      { kicker: 'Measure', title: 'Know your cost per booking, project by project', text: 'Funnel reports show what each source costs at every stage, so you can move budget to the channels that convert and fix the stages that leak.',
        bullets: ['Cost per lead, per site visit and per booking', 'Split by source, project and salesperson', 'Target versus actual, always visible'], shot: { frame: 'project' }, cap: 'The marketing funnel report by source.' } ],
    wide: { kicker: 'Team', title: 'A scorecard for the whole sales team', text: 'Calls, talk time, site visits and bookings per agent, with a clear status: on track, improving or needs coaching.', shot: { frame: 'team' } },
    phoneSec: { kicker: 'Mobile app', title: 'Built for site and telecalling teams', text: 'The mobile app works offline, sends push alerts for new leads and records call outcomes in one tap, so your CRM is always up to date. Automatic call recording works on Android.', keys: ['home', 'postcall', 'leadcalls'] },
    faq: [
      ['Can we run multiple projects in one account?', 'Yes. You can run several projects with one team and see leads, site visits, bookings and cost per booking for each project.'],
      ['Which lead sources can Neeti CRM connect to?', 'Supported sources include Meta, Google Ads, 99acres, MagicBricks, Housing.com, WhatsApp, website forms (WordPress, Elementor) and CSV import. Specifics are confirmed during setup.'],
      ['Can we start with a small team?', 'Yes. Plans can start with one user and add more as the team grows.'],
      ['Is our data kept separate from other customers?', 'Yes. Each organisation’s data is kept separate, access depends on role, and two-factor sign-in is available to all users.'] ]
  },
  {
    slug: 'crm-for-channel-partners', label: 'CRM for channel partners', role: 'Channel Partner',
    title: 'CRM for Real Estate Channel Partners | Neeti CRM',
    desc: 'A CRM for team-based real estate channel partners: organise prospects, speed up follow-ups, track calls and coach your team. Free 15-day trial.',
    badge: 'For channel partners', h1: 'A CRM for real estate channel partners and brokerage teams',
    intro: 'Team-based channel partners juggle prospects across several developers and a team of callers. Neeti CRM keeps every prospect, follow-up and site visit in one place, and shows you who called whom, how the call went and who needs coaching.',
    trust: ['Start with one user', 'Mobile app with offline mode', '15-day free trial'],
    hero: { frame: 'team' },
    problem: { kicker: 'The problem', title: 'Prospects scattered across sheets and chats', text: 'When prospects live in personal phones and spreadsheets, follow-ups slip and you cannot tell what your team is really doing.', cards: [
      ['No single list', 'Leads sit in WhatsApp chats, notebooks and sheets, so duplicates and gaps are common.'],
      ['Follow-ups slip', 'Without reminders, a warm prospect cools before the next call.'],
      ['Coaching by guesswork', 'Call counts do not show call quality, so it is hard to know who needs help.'] ] },
    rows: [
      { kicker: 'Organise', title: 'One list for every prospect, with the buyer’s details', text: 'Capture prospects from portals, ads, WhatsApp, website forms and CSV import. Every lead records the buyer’s BHK, budget and timeline.',
        bullets: ['Give every lead a next step and a follow-up date', 'Repeat enquiries flagged, not duplicated', 'Schedule site visits with reminders so buyers turn up'], shot: { frame: 'leads' }, cap: 'One lead list across all your sources.' },
      { kicker: 'Follow up', title: 'Start every day with who to call first', text: 'A priority queue and first-call timers tell each caller exactly who to call next, so warm prospects are never left waiting.',
        bullets: ['Priority queue per caller', 'First-call timers you set', 'One-tap call outcomes in the mobile app'], shot: { frame: 'command' }, cap: 'The daily command centre for each caller.' },
      { kicker: 'Coach', title: 'Coach with real conversations, not guesswork', text: 'With the Sales Intelligence plan, AI call analysis scores conversation quality and an objection coach explains what a buyer means, so coaching is based on real calls.',
        bullets: ['Conversation quality score on every recorded call', 'Objection coach in the mobile app', 'See who needs coaching and on which skills'], shot: { phones: ['callbrain', 'objection'] }, cap: 'AI call analysis and the objection coach on mobile.' } ],
    wide: { kicker: 'Team', title: 'Know who called whom, and how it went', text: 'Calls made, talk time, site visits and bookings per team member, with target versus actual always visible.', shot: { frame: 'team' } },
    faq: [
      ['Is there a mobile app for my callers?', 'Yes. It offers offline mode, push alerts and one-tap call outcomes. Automatic call recording works on Android.'],
      ['Can I start with one user?', 'Yes. Plans can start with one user and add more as the team grows.'],
      ['How does the free trial work?', 'The 15-day trial starts after essential activation: pipeline setup, integrations, workflows and initial onboarding. No credit card is required.'],
      ['How much can I save by paying in advance?', 'Subscriptions run for three, six or twelve months paid in advance, with 5%, 10% or 15% off the standard per-user monthly rate.'] ]
  },
  {
    slug: 'crm-for-mandate-firms', label: 'CRM for mandate firms', role: 'Mandate Firm',
    title: 'CRM for Real Estate Mandate Sales Firms | Neeti CRM',
    desc: 'Manage sales across developer projects with one consistent funnel and clear reporting. Neeti CRM for mandate firms replaces spreadsheets with a real pipeline.',
    badge: 'For mandate sales firms', h1: 'One funnel across every developer project you sell',
    intro: 'Mandate firms sell several developers’ projects at once, and every developer wants to see numbers. Neeti CRM gives you one consistent funnel across projects, with reporting you can stand behind, instead of spreadsheets that drift apart.',
    trust: ['Report by project and source', 'Leave-aware assignment', '15-day free trial'],
    hero: { frame: 'project' },
    problem: { kicker: 'The problem', title: 'Many projects, many spreadsheets, no single truth', text: 'When each project is tracked differently, reporting takes days and nobody trusts the numbers.', cards: [
      ['Inconsistent funnels', 'Every project follows slightly different stages, so projects cannot be compared fairly.'],
      ['Manual reporting', 'Weekly developer reports are rebuilt by hand from exports and chats.'],
      ['Hidden bottlenecks', 'It is hard to see where leads stall between enquiry, visit and booking.'] ] },
    rows: [
      { kicker: 'Consistent funnel', title: 'The same stages for every project', text: 'Every project follows the same path from new lead to site visit to booking, so you can compare projects fairly and spot exactly where leads stall.',
        bullets: ['Leads from ads, portals, WhatsApp, forms and CSV import in one list', 'Buyer profiles and repeat-buyer recognition across projects', 'Lead assignment that respects who is on leave'], shot: { frame: 'leads' }, cap: 'A single lead list across projects.' },
      { kicker: 'Reporting', title: 'Reports you can share with developers', text: 'Funnel reports by source, project and salesperson show cost per lead, cost per site visit and cost per booking, without rebuilding spreadsheets each week.',
        bullets: ['Cost per lead, site visit and booking', 'Split by project, source and salesperson', 'Target versus actual for every team'], shot: { frame: 'project' }, cap: 'Funnel reporting by source and project.' },
      { kicker: 'Speed', title: 'Faster response, while your team is on calls', text: 'First-call timers keep response times short. WhatsApp flows follow up automatically while your team is on calls, and branch based on whether the buyer replied.',
        bullets: ['First-call timers you configure', 'WhatsApp flows that wait and branch', 'Tasks created for the team when a buyer replies'], shot: { frame: 'automation' }, cap: 'A WhatsApp follow-up flow in the builder.' } ],
    wide: { kicker: 'Team', title: 'A scorecard for every salesperson', text: 'Calls, talk time, visits and bookings against target, with on-track, improving and needs-coaching statuses. On the Sales Intelligence plan, AI call analysis helps managers coach the whole team.', shot: { frame: 'team' } },
    faq: [
      ['Can we track several developers’ projects separately?', 'Yes. Leads, site visits and bookings are reported by project, source and salesperson.'],
      ['Is our data kept separate from other customers?', 'Yes. Each organisation’s data is kept separate, access depends on role, and two-factor sign-in is available to all users.'],
      ['Do you offer a demo?', 'Yes. You can book a free 30-minute demo using your live leads.'],
      ['Can we import our existing leads?', 'Yes. CSV import is supported, along with portal, ad and WhatsApp sources.'] ]
  },
  {
    slug: 'whatsapp-crm-for-real-estate', label: 'WhatsApp CRM', role: 'Developer',
    title: 'WhatsApp CRM for Real Estate Sales Teams | Neeti CRM',
    desc: 'Automate WhatsApp follow-ups for property leads. Neeti CRM combines a shared WhatsApp inbox, flows that wait and branch, and an AI concierge.',
    badge: 'WhatsApp automation', h1: 'WhatsApp CRM for real estate sales teams',
    intro: 'Property buyers answer on WhatsApp, not email. Neeti CRM connects WhatsApp to your lead pipeline so every enquiry gets a fast reply and a follow-up that does not depend on someone remembering.',
    trust: ['AI concierge for buyer questions', 'Flows that wait and branch', 'Included from the Professional plan'],
    hero: { frame: 'whatsapp' },
    problem: { kicker: 'The problem', title: 'The first reply decides who wins the site visit', text: 'Buyers enquire with several developers at once. Slow or inconsistent WhatsApp replies lose visits.', cards: [
      ['Slow first reply', 'Enquiries wait until someone is free to answer.'],
      ['Follow-ups forgotten', 'Nobody remembers to message the buyer who did not reply yesterday.'],
      ['Chats outside the CRM', 'Conversations live on personal phones, invisible to managers.'] ] },
    rows: [
      { kicker: 'AI concierge', title: 'Answers from your project, nothing invented', text: 'The AI assistant replies to buyers in the WhatsApp inbox using your project information, shares the brochure and offers site visit buttons, moving buyers toward a visit.',
        bullets: ['Replies drawn from your own project details', 'Brochure and site visit buttons in the chat', 'Conversations sit in the CRM inbox with your leads'], shot: { frame: 'whatsapp' }, cap: 'The WhatsApp inbox with the AI assistant replying to a buyer.' },
      { kicker: 'Automation', title: 'Flows that wait, branch and hand over', text: 'Build a follow-up once and let it run: when a lead is created, assign an agent, send a template, wait for a reply, then notify the agent or create a call task.',
        bullets: ['Template messages sent automatically', 'Waits and branches on whether the buyer replied', 'Creates call tasks and notifies the right agent'], shot: { frame: 'automation' }, cap: 'The WhatsApp flow builder.' },
      { kicker: 'One pipeline', title: 'WhatsApp leads join the same pipeline', text: 'Leads from WhatsApp enter the same list as portal and ad leads, with source and campaign recorded, so marketing-source analysis shows which channels produce conversations that turn into visits.',
        bullets: ['One lead list across all sources', 'Source and campaign on every lead', 'Call now and WhatsApp buttons on mobile'], shot: { frame: 'leads' }, cap: 'Every source, including WhatsApp, in one list.' } ],
    phoneSec: { kicker: 'Mobile app', title: 'Call or WhatsApp in one tap', text: 'Agents see a new lead the moment it arrives, with Call now and WhatsApp buttons on the home screen and a priority queue for the day.', keys: ['home', 'postcall'] },
    faq: [
      ['Which plan includes WhatsApp automation?', 'WhatsApp automation is included in the Professional plan and above.'],
      ['Can WhatsApp leads enter the CRM automatically?', 'Yes. WhatsApp is a supported lead source and leads join the same pipeline as other sources. Specifics are confirmed during setup.'],
      ['Does the AI answer with made-up information?', 'The assistant answers from your project information; the aim is answers from your project, nothing invented.'],
      ['Can we start with one user?', 'Yes. Plans can start with one user and add more as the team grows.'] ]
  },
  {
    slug: 'ai-call-analysis-for-real-estate-sales', label: 'AI call analysis', role: 'Channel Partner',
    title: 'AI Call Analysis for Real Estate Sales Teams | Neeti CRM',
    desc: 'Score every sales call, coach objection handling and see which callers need help. AI call recording analysis built for real estate teams in India.',
    badge: 'AI call analysis', h1: 'AI call analysis for real estate sales teams',
    intro: 'Most CRMs only know what your team types in. Neeti CRM listens to calls and turns them into coaching, so managers improve conversations instead of guessing from call counts.',
    trust: ['Conversation quality score', 'Objection coach on mobile', 'Sales Intelligence plan'],
    hero: { phones: ['callbrain', 'leadcalls', 'objection'] },
    problem: { kicker: 'The problem', title: 'Call counts do not tell you how good the calls are', text: 'Two callers can make the same number of calls and get very different results. Managers rarely have time to listen.', cards: [
      ['Calls are a black box', 'Nobody can listen to every call, so coaching is based on hunches.'],
      ['Objections go unanswered', 'New callers struggle when buyers raise price, location or timing.'],
      ['Training is generic', 'Without data, coaching cannot target the specific skill each caller lacks.'] ] },
    rows: [
      { kicker: 'Score', title: 'A scorecard for every call', text: 'Recorded calls are analysed and scored on conversation quality: discovery, objection handling and next-step clarity, with a clear coaching opportunity flagged.',
        bullets: ['Conversation quality score per call', 'Discovery, objection handling and next-step clarity', 'Recorded calls with their quality review on the lead profile'], shot: { phones: ['callbrain', 'leadcalls'] }, cap: 'The call scorecard and the lead profile with recorded calls.' },
      { kicker: 'Coach', title: 'An objection coach in every pocket', text: 'In the mobile app the objection coach explains what a buyer really means and what the agent can say, so callers are supported in the moment.',
        bullets: ['Explains the buyer’s objection in plain language', 'Shows what the agent can say next', 'Available inside the mobile app'], shot: { phones: ['objection', 'postcall'] }, cap: 'The objection coach and the post-call outcome screen.' } ],
    wide: { kicker: 'Team', title: 'See who needs coaching, and on what', text: 'Team scorecards show calls, talk time, visits and bookings with a clear status: on track, improving or needs coaching. Target-versus-actual intelligence connects call quality to site visits and bookings.', shot: { frame: 'team' } },
    faq: [
      ['Does Neeti CRM include AI call analysis?', 'Yes, in the Sales Intelligence tier, subject to agreed allowances and setup. Some premium AI features may depend on launch readiness.'],
      ['Does call recording work on iPhone?', 'Automatic call recording works on Android.'],
      ['Will AI call analysis guarantee more bookings?', 'No uplift is guaranteed. The 30% figure is an initial testing target over a suitable measurement period, and booking cycles may run longer.'],
      ['Can I see AI call analysis with my own calls?', 'Book a demo and ask us to walk through it using your call flow.'] ]
  },
  {
    slug: 'real-estate-lead-management-software', label: 'Lead management', role: 'Developer',
    title: 'Real Estate Lead Management Software | Neeti CRM',
    desc: 'Capture leads from 99acres, MagicBricks, Housing.com, Meta, Google Ads and WhatsApp in one pipeline, and stop lead leakage with first-call timers.',
    badge: 'Lead management', h1: 'Real estate lead management software that stops lead leakage',
    intro: 'If leads arrive from five places and live in five places, some will be missed. Neeti CRM brings every source into one pipeline and makes sure each lead has an owner, a timer and a next step.',
    trust: ['Portals, ads and WhatsApp', 'First-call timers', 'Lead leakage audit for founding customers'],
    hero: { frame: 'leads' },
    problem: { kicker: 'The problem', title: 'Where leads actually get lost', text: 'Most leakage is not about lead volume. It is about what happens in the first hours and days.', cards: [
      ['Late first call', 'The lead waits while the team is busy or the enquiry sits in an inbox.'],
      ['No owner', 'Nobody is clearly responsible, especially when the assigned agent is on leave.'],
      ['No source data', 'You cannot tell which portal or campaign produces visits and bookings.'] ] },
    rows: [
      { kicker: 'Capture', title: 'Every source in one list', text: 'Leads from every portal, ad platform and form arrive in one list. Each lead keeps its campaign and source, so reports can compare channels honestly.',
        bullets: ['Meta, Google Ads, 99acres, MagicBricks, Housing.com, WhatsApp, website forms and CSV import', 'Buyer score, repeat-lead and SLA-breach flags', 'Buyer profile: BHK, budget and timeline'], shot: { frame: 'leads' }, cap: 'Every lead with its campaign, source and flags.' },
      { kicker: 'Respond', title: 'Close the response gap', text: 'The command centre puts the leads that need attention first, with first-call timers you configure, and assignment that knows who is in.',
        bullets: ['First-call timers on every new lead', 'Leave-aware assignment', 'Follow-up tasks and site visit scheduling with reminders'], shot: { frame: 'command' }, cap: 'The priority queue with first-call timers.' },
      { kicker: 'Measure', title: 'Know which sources pay off', text: 'Marketing funnel reports show cost per lead, cost per site visit and cost per booking by source and project. That is how you decide whether to spend more on a portal or fix what happens after the lead arrives.',
        bullets: ['Cost per lead, visit and booking', 'Split by source and project', 'Target versus actual'], shot: { frame: 'project' }, cap: 'Funnel report by source.' } ],
    faq: [
      ['Can I import existing leads?', 'Yes. CSV import is supported.'],
      ['Which portals are supported?', 'Supported sources include 99acres, MagicBricks and Housing.com, along with Meta, Google Ads, WhatsApp and website forms. Specifics are confirmed during setup.'],
      ['Are the launch bonuses free?', 'They are complimentary for eligible founding-customer Sales Intelligence packages during a defined launch period or cohort. They include a lead leakage audit, a sales conversion playbook and a 30-day sales improvement roadmap.'],
      ['Can we start with one user?', 'Yes. Plans can start with one user and add more as the team grows.'] ]
  },
  {
    slug: 'real-estate-crm-pricing', label: 'Pricing & plans', role: '', pricing: true,
    title: 'Real Estate CRM Pricing & Plans | Neeti CRM',
    desc: 'Compare Neeti CRM plans: Basic, Professional and Sales Intelligence. Per-user pricing in INR, 15-day free trial, and 5-15% off on prepaid plans.',
    badge: 'Plans & pricing', h1: 'Simple per-user pricing for real estate sales teams',
    intro: 'Neeti CRM is priced per user per month in Indian rupees, excluding GST. Pick the foundation you need today and move up when your team is ready. Every plan includes a 15-day free trial with no credit card required.',
    trust: ['Start with one user', '5-15% off prepaid plans', 'No credit card for the trial'],
    hero: { frame: 'dashboard' },
    plans: [
      { name: 'Basic', for: 'Never lose track of a lead.', items: ['Lead capture and pipeline', 'Assignment and notifications', 'Tasks and follow-up tracking', 'Site visit scheduling', 'Essential dashboards', 'Mobile app with offline mode'] },
      { name: 'Professional', for: 'Automate follow-ups and improve visibility.', all: 'Everything in Basic, plus', items: ['WhatsApp automation', 'Advanced follow-up workflows', 'Marketing-source analysis', 'Sales performance dashboards', 'Limited AI objection assistance'] },
      { name: 'Sales Intelligence', for: 'AI-powered sales performance improvement.', feature: true, all: 'Everything in Professional, plus', items: ['Advanced AI objection handling', 'AI call recording analysis', 'Personalised coaching insights', 'Advanced target-versus-actual intelligence', 'Assisted setup and launch bonuses', 'A dedicated account manager'] } ],
    discounts: [['5%', 'off for 3 months paid in advance'], ['10%', 'off for 6 months paid in advance'], ['15%', 'off for 12 months paid in advance']],
    rows: [
      { kicker: 'See it first', title: 'What you get on the Sales Intelligence plan', text: 'The dashboard ties every lead to site visits and bookings, with funnel reports, team scorecards and AI call analysis in one place.',
        bullets: ['Funnel reporting by source, project and salesperson', 'AI call analysis and objection coaching', 'Dedicated account manager and assisted launch'], shot: { frame: 'dashboard' }, cap: 'The Sales Intelligence dashboard.' } ],
    faq: [
      ['How is Neeti CRM priced?', 'Per user per month in Indian rupees, excluding GST, with 5%, 10% or 15% off for three, six or twelve months paid in advance. Request a quote for your team size.'],
      ['Is there a free trial?', 'Yes, 15 days with no credit card required. It starts after essential activation: pipeline setup, integrations, workflows and initial onboarding. Third-party approvals and timely access from your team can affect the start date.'],
      ['Can we start with one user?', 'Yes. Plans can start with one user and add more as the team grows.'],
      ['Which plan includes WhatsApp automation and AI call analysis?', 'WhatsApp automation starts at the Professional plan. AI call analysis is in the Sales Intelligence plan, subject to agreed allowances and setup.'] ]
  }
];

const BLURB = {
  'real-estate-crm-for-developers': 'One pipeline for every project',
  'crm-for-channel-partners': 'Organise prospects and coach your team',
  'crm-for-mandate-firms': 'One funnel across developer projects',
  'whatsapp-crm-for-real-estate': 'Fast replies and automatic follow-ups',
  'ai-call-analysis-for-real-estate-sales': 'Score calls and coach objections',
  'real-estate-lead-management-software': 'Every source, every lead, one pipeline',
  'real-estate-crm-pricing': 'Plans, discounts and free trial'
};


function shotHtml(shot, cap) {
  const inner = shot.frame ? frame(shot.frame) : phones(shot.phones);
  return `<figure class="pg-fig">${inner}${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`;
}


function render(p) {
  const url = `${SITE}/${p.slug}/`;
  const hero = p.hero.frame ? frame(p.hero.frame, { eager: true }) : phones(p.hero.phones, { eager: true, hero: true });

  const problem = p.problem ? `
    <section class="pg-sec pg-night" aria-labelledby="pg-problem-t">
      <div class="rail">
        <div class="pg-head"><p class="pg-kicker">${esc(p.problem.kicker)}</p><h2 class="pg-h2" id="pg-problem-t">${esc(p.problem.title)}</h2><p class="pg-sub">${esc(p.problem.text)}</p></div>
        <div class="pg-cards">${p.problem.cards.map((c, i) => `<div class="pg-card"><span class="pg-card__n">${i + 1}</span><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p></div>`).join('')}</div>
      </div>
    </section>` : '';

  const plans = p.plans ? `
    <section class="pg-sec" id="plans" aria-labelledby="pg-plans-t">
      <div class="rail">
        <div class="pg-head"><p class="pg-kicker">Plans</p><h2 class="pg-h2" id="pg-plans-t">Choose the right plan for your team</h2><p class="pg-sub">Prices are per user per month in Indian rupees, excluding GST. Request a quote for your team size.</p></div>
        <div class="pg-plans">${p.plans.map((pl) => `
          <article class="pg-plan${pl.feature ? ' pg-plan--feature' : ''}">
            ${pl.feature ? '<span class="pg-plan__flag">&#9733; Recommended</span>' : ''}
            <h3>${esc(pl.name)}</h3><p class="pg-plan__for">${esc(pl.for)}</p>
            <ul class="pg-list">${pl.all ? `<li class="pg-list__all">${esc(pl.all)}</li>` : ''}${pl.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
            <a class="btn ${pl.feature ? 'btn--primary' : 'btn--line'} btn--block" href="#enquiry" data-track="get-quote">Get a quote &#8599;</a>
          </article>`).join('')}</div>
        <div class="pg-head" style="margin-top:56px"><p class="pg-kicker">Save more</p><h2 class="pg-h2">Prepay for three, six or twelve months</h2></div>
        <div class="pg-disc">${p.discounts.map((d) => `<div><strong>${d[0]}</strong><span>${esc(d[1])}</span></div>`).join('')}</div>
      </div>
    </section>` : '';

  const rows = p.rows && p.rows.length ? `
    <section class="pg-sec pg-sec--flush">
      <div class="rail">${p.rows.map((r, i) => `
        <div class="pg-row${i % 2 ? ' pg-row--flip' : ''}">
          <div class="pg-row__text"><p class="pg-kicker">${esc(r.kicker)}</p><h2 class="pg-h2">${esc(r.title)}</h2><p>${esc(r.text)}</p>
            <ul class="pg-list">${r.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul></div>
          <div class="pg-row__shot">${shotHtml(r.shot, r.cap)}</div>
        </div>`).join('')}
      </div>
    </section>` : '';

  const wide = p.wide ? `
    <section class="pg-sec pg-mist" aria-label="${esc(p.wide.title)}">
      <div class="rail">
        <div class="pg-head"><p class="pg-kicker">${esc(p.wide.kicker)}</p><h2 class="pg-h2">${esc(p.wide.title)}</h2><p class="pg-sub">${esc(p.wide.text)}</p></div>
        <div style="margin-top:34px">${shotHtml(p.wide.shot)}</div>
      </div>
    </section>` : '';

  const phoneSec = p.phoneSec ? `
    <section class="pg-sec" aria-label="${esc(p.phoneSec.title)}">
      <div class="rail pg-phones-sec">
        <div><p class="pg-kicker">${esc(p.phoneSec.kicker)}</p><h2 class="pg-h2">${esc(p.phoneSec.title)}</h2><p class="pg-sub">${esc(p.phoneSec.text)}</p></div>
        <div>${phones(p.phoneSec.keys)}</div>
      </div>
    </section>` : '';

  const steps = `
    <section class="pg-sec pg-mist" aria-labelledby="pg-steps-t">
      <div class="rail">
        <div class="pg-head"><p class="pg-kicker">Getting started</p><h2 class="pg-h2" id="pg-steps-t">Live on your own leads before the trial clock starts</h2><p class="pg-sub">We complete essential setup with you first, then your 15-day free trial begins. No credit card is required.</p></div>
        <div class="pg-steps">${STEPS.map((s) => `<div class="pg-step"><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></div>`).join('')}</div>
      </div>
    </section>`;

  const faq = `
    <section class="pg-sec" aria-labelledby="pg-faq-t">
      <div class="rail pg-faq-wrap">
        <div class="pg-head"><p class="pg-kicker">FAQ</p><h2 class="pg-h2" id="pg-faq-t">Questions, answered</h2><p class="pg-sub">Still unsure? <a href="#enquiry" style="color:var(--cobalt);font-weight:600">Ask our team</a> and we&rsquo;ll reply within 15 minutes.</p></div>
        <div class="pg-faq">${p.faq.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('')}</div>
      </div>
    </section>`;

  const cta = ctaHtml(p);

  const related = PAGES.filter((o) => o.slug !== p.slug).slice(0, 6)
    .map((o) => `<a href="/${o.slug}/"><strong>${esc(o.label)}</strong><span>${esc(BLURB[o.slug])}</span></a>`).join('');
  const more = `
    <section class="pg-sec pg-sec--end" aria-labelledby="pg-more-t" style="border-bottom:0">
      <div class="rail">
        <div class="pg-head"><p class="pg-kicker">Explore</p><h2 class="pg-h2" id="pg-more-t">More from Neeti CRM</h2></div>
        <div class="pg-related">${related}</div>
        <p class="pg-note">The 30% improvement mentioned on our home page is a market-testing target, not a guaranteed or proven customer result. Outcomes depend on your baseline and implementation.</p>
      </div>
    </section>`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url + '#webpage', url, name: p.title, description: p.desc, isPartOf: { '@id': SITE + '/#website' }, about: { '@id': SITE + '/#app' }, dateModified: TODAY, inLanguage: 'en-IN', primaryImageOfPage: { '@type': 'ImageObject', url: SITE + '/assets/img/og/' + p.slug + '.jpg', width: 1200, height: 630 } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: p.label, item: url } ] },
      { '@type': 'FAQPage', mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) }
    ]
  };

  return `<!doctype html>
<html lang="en-IN" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  ${seoTags()}
  <title>${esc(p.title)}</title>
  <meta name="description" content="${esc(p.desc)}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en-IN" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${url}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Neeti CRM">
  <meta property="og:locale" content="en_IN">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(p.title)}">
  <meta property="og:description" content="${esc(p.desc)}">
  <meta property="og:image" content="${SITE}/assets/img/og/${p.slug}.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(p.h1)} - Neeti CRM">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(p.title)}">
  <meta name="twitter:description" content="${esc(p.desc)}">
  <meta name="twitter:image" content="${SITE}/assets/img/og/${p.slug}.jpg">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48">
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/assets/fonts/jakarta-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/pages.css">
  <script>document.documentElement.classList.add('js')</script>
  <script src="/assets/js/site.js" defer></script>
  <script src="/assets/js/page-enquiry.js" defer></script>
  <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
  </script>
</head>
<body>
  ${navHtml()}

  <main id="main" class="pg-main">
    <section class="pg-hero" aria-labelledby="pg-h1">
      <div class="rail pg-hero__rail">
        <div>
          <nav class="pg-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">&rsaquo;</span><span>${esc(p.label)}</span></nav>
          <span class="pg-badge">${esc(p.badge)}</span>
          <h1 class="pg-h1" id="pg-h1">${esc(p.h1)}</h1>
          <p class="pg-lede">${esc(p.intro)}</p>
          <div class="pg-ctas">
            <a class="btn btn--primary btn--lg" href="#enquiry" data-track="demo">Book your free demo &#8599;</a>
            <a class="btn btn--line btn--lg" href="${SIGNUP}" data-track="signup">Start 15-day free trial</a>
          </div>
          <p class="pg-trust">${p.trust.map((t) => `<span>${esc(t)}</span>`).join('')}</p>
        </div>
        <div>${hero}</div>
      </div>
    </section>

    <section class="pg-sources" aria-label="Lead sources">
      <div class="rail pg-sources__rail"><span class="pg-sources__label">Connects to</span>${SOURCES.map((s) => `<span class="pg-chip">${esc(s)}</span>`).join('')}</div>
    </section>
${problem}${plans}${rows}${wide}${phoneSec}${steps}${faq}${cta}${more}
  </main>

  ${footerHtml()}
</body>
</html>
`;
}

for (const p of PAGES) {
  const dir = path.join(root, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render(p));
  console.log('wrote', p.slug + '/index.html');
}

const urls = [
  ['/', '1.0'], ['/bookdemo', '0.8'],
  ...PAGES.map((p) => ['/' + p.slug + '/', p.pricing ? '0.9' : '0.8']),
  ['/blog/', '0.7'], ...require('./build-blog.cjs').posts.map((b) => ['/blog/' + b.slug + '/', '0.7']),
  ['/security.html', '0.3'], ['/privacy-policy.html', '0.2'],
  ['/terms-of-service.html', '0.2'], ['/refund-policy.html', '0.2']
];
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(([u, pr]) => `  <url><loc>${SITE}${u}</loc>${pr >= '0.7' ? `<lastmod>${TODAY}</lastmod>` : ''}<priority>${pr}</priority></url>`).join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log('wrote sitemap.xml');

// Share-image manifest: scripts/make-og.py renders one 1200x630 card per entry into assets/img/og/.
const blogMod = require('./build-blog.cjs');
const cards = [
  ...PAGES.map((p) => ({ file: p.slug, kicker: p.badge, title: p.h1 })),
  { file: 'blog', kicker: 'The Neeti CRM blog', title: 'Real estate sales, explained plainly' },
  ...blogMod.posts.map((b) => ({ file: 'blog-' + b.slug, kicker: b.category, title: b.h1 || b.title }))
];
fs.writeFileSync(path.join(__dirname, 'og-cards.json'), JSON.stringify(cards, null, 2) + '\n');
console.log('wrote og-cards.json (' + cards.length + ' cards)');
console.log('seo tags applied to', applyStatic(), 'hand-written pages');
