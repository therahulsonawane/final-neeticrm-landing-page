/* Neeti SIS landing page behaviour. No dependencies.
   Everything here is enhancement: with JavaScript off the page shows its final state. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) root.classList.add('motion');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function formatInr(n) { return Math.round(n).toLocaleString('en-IN'); }
  function mmss(total) {
    var m = Math.floor(total / 60);
    var s = total % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* Run cb once, the first time each element scrolls into view. */
  function onceInView(els, cb, rootMargin) {
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(cb); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        cb(entry.target);
      });
    }, { rootMargin: rootMargin || '0px 0px -12% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Ad tracking: the Meta Pixel was already on the previous page ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (!el || typeof window.fbq !== 'function') return;
    var kind = el.getAttribute('data-track');
    if (kind === 'whatsapp') window.fbq('track', 'Contact');
    if (kind === 'signup') window.fbq('trackCustom', 'StartTrialClick');
  });

  /* ---------- In-page links: jump, then re-aim once the sections in between have rendered ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = link.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (target.tagName === 'DETAILS') target.open = true;
    var land = function () { target.scrollIntoView({ block: 'start' }); };
    land();
    window.requestAnimationFrame(function () { window.requestAnimationFrame(land); });
    window.setTimeout(land, 250);
    if (window.history && window.history.pushState) window.history.pushState(null, '', '#' + id);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ---------- Mobile menu & backdrop ---------- */
  var menuToggle = $('[data-menu-toggle]');
  var menu = $('[data-menu]');
  var menuBackdrop = $('[data-menu-backdrop]');
  function setMenu(open) {
    if (menuToggle) menuToggle.setAttribute('aria-expanded', String(open));
    if (menu) menu.hidden = !open;
    if (menuBackdrop) menuBackdrop.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  }
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function () { setMenu(menu.hidden); });
    if (menuBackdrop) {
      menuBackdrop.addEventListener('click', function () { setMenu(false); });
    }
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuToggle.focus(); }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (mq) { if (mq.matches) setMenu(false); });
  }

  /* ---------- Floating Mobile Quick Action Bar ---------- */
  var mobileBar = $('[data-mobile-bar]');
  if (mobileBar) {
    var checkMobileBar = function () {
      var hero = $('.hero');
      var threshold = hero ? (hero.offsetTop + hero.offsetHeight - 140) : 380;
      mobileBar.classList.toggle('is-visible', window.scrollY > threshold);
    };
    window.addEventListener('scroll', checkMobileBar, { passive: true });
    window.addEventListener('resize', checkMobileBar);
    checkMobileBar();
  }

  /* ---------- Source ticker runs only while on screen ---------- */
  var marquee = $('[data-marquee]');
  if (marquee && !reduceMotion && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      marquee.classList.toggle('is-live', entries[0].isIntersecting);
    }).observe(marquee);
  }

  /* ---------- Reveal on scroll (screens and cells) ---------- */
  onceInView($$('[data-reveal]'), function (el) { el.classList.add('is-in'); });

  /* ---------- Statement: words light up as it scrolls through ---------- */
  var statement = $('[data-words]');
  var words = [];
  if (statement && !reduceMotion) {
    var text = statement.textContent.trim().split(/\s+/);
    statement.textContent = '';
    text.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'w';
      span.textContent = word;
      statement.appendChild(span);
      if (i < text.length - 1) statement.appendChild(document.createTextNode(' '));
      words.push(span);
    });
  }

  /* ---------- Scroll-linked effects, batched into one frame ---------- */
  var nav = $('[data-nav]');
  var scene = $('.hero__scene');
  var chapters = $$('[data-chapter]');
  var chapterLinks = $$('[data-chapter-link]');
  var phonesGroup = $('[data-parallax-group]');
  var phones = $$('[data-parallax]');
  var ticking = false;
  var litCount = -1;
  var live = { statement: false, chapters: false, phones: false };
  if ('IntersectionObserver' in window) {
    var watch = function (el, key) {
      if (!el) return;
      new IntersectionObserver(function (entries) {
        live[key] = entries[0].isIntersecting;
        if (live[key]) requestFrame();
      }, { rootMargin: '200px 0px' }).observe(el);
    };
    watch(statement, 'statement');
    watch($('.chapters'), 'chapters');
    watch(phonesGroup, 'phones');
  } else {
    live = { statement: true, chapters: true, phones: true };
  }

  function onFrame() {
    ticking = false;
    var vh = window.innerHeight;
    var y = window.scrollY;

    if (nav) nav.classList.toggle('is-scrolled', y > 8);

    if (reduceMotion) return;

    // Hero product: starts tilted back, flattens as you scroll into it.
    if (scene) {
      var p = clamp(y / (vh * 0.55), 0, 1);
      var maxTilt = window.innerWidth < 760 ? 8 : 14;
      scene.style.setProperty('--tilt', (maxTilt * (1 - easeOut(p))).toFixed(2));
      scene.style.setProperty('--scale', (0.95 + 0.05 * easeOut(p)).toFixed(4));
    }

    if (words.length && live.statement) {
      var r = statement.getBoundingClientRect();
      var start = vh * 0.88;
      var end = vh * 0.42;
      var progress = clamp((start - r.top) / (start - end + r.height * 0.6), 0, 1);
      var lit = Math.round(progress * words.length);
      if (lit !== litCount) {
        for (var i = 0; i < words.length; i++) words[i].classList.toggle('is-on', i < lit);
        litCount = lit;
      }
    }

    if (chapters.length && chapterLinks.length && live.chapters) {
      var mid = vh * 0.45;
      var active = 0;
      chapters.forEach(function (ch, idx) {
        var cr = ch.getBoundingClientRect();
        if (cr.top <= mid) active = idx;
        var fill = clamp((mid - cr.top) / cr.height, 0, 1);
        if (chapterLinks[idx]) chapterLinks[idx].style.setProperty('--fill', fill.toFixed(3));
      });
      chapterLinks.forEach(function (a, idx) {
        a.classList.toggle('is-active', idx === active);
        if (idx === active) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
      });
    }

    if (phonesGroup && phones.length && live.phones) {
      var gr = phonesGroup.getBoundingClientRect();
      if (gr.bottom > 0 && gr.top < vh) {
        var t = (gr.top + gr.height / 2 - vh / 2) / vh; // about -1..1
        phones.forEach(function (ph) {
          ph.style.setProperty('--py', (t * parseFloat(ph.getAttribute('data-parallax'))).toFixed(1) + 'px');
        });
      }
    }
  }
  function requestFrame() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onFrame); }
  }
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);
  requestFrame();

  /* ---------- Hero: the first minutes of one lead ---------- */
  var clock = $('[data-clock]');
  if (clock && !reduceMotion) {
    var events = $$('li', clock);
    var timeEl = $('[data-clock-time]', clock);
    var replay = $('[data-clock-replay]', clock);
    var END = parseInt(events[events.length - 1].getAttribute('data-at'), 10);
    var DURATION = 6400;
    var raf = 0;

    var resetClock = function () {
      clock.classList.add('is-playing');
      clock.classList.remove('is-done');
      events.forEach(function (li) { li.classList.remove('is-on'); });
      timeEl.textContent = '00:00';
      replay.hidden = true;
    };
    var play = function () {
      window.cancelAnimationFrame(raf);
      resetClock();
      var t0 = 0;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var k = clamp((ts - t0) / DURATION, 0, 1);
        var secs = Math.round(easeInOut(k) * END);
        timeEl.textContent = mmss(secs);
        events.forEach(function (li) {
          if (secs >= parseInt(li.getAttribute('data-at'), 10)) li.classList.add('is-on');
        });
        if (k < 1) raf = window.requestAnimationFrame(step);
        else { clock.classList.add('is-done'); replay.hidden = false; }
      };
      raf = window.requestAnimationFrame(step);
    };

    resetClock();
    replay.addEventListener('click', play);
    // The card fades in about a second after load; start once it is visible and on screen.
    onceInView([clock], function () { window.setTimeout(play, 1100); }, '0px');
  }

  /* ---------- Cells: small live details ---------- */
  $$('[data-countdown]').forEach(function (el) {
    var cell = el.closest('.cell');
    var ring = cell && $('.ui-sla__arc', cell);
    var total = 600; // a 10 minute first-call timer
    var left = parseInt(el.getAttribute('data-countdown'), 10);
    var timer = 0;
    var render = function () {
      el.textContent = mmss(left);
      if (ring) ring.style.setProperty('--off', (100 - (left / total) * 100).toFixed(2));
    };
    render();
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      window.clearInterval(timer);
      if (visible) timer = window.setInterval(function () { left = left > 0 ? left - 1 : 252; render(); }, 1000);
    }).observe(el);
  });

  onceInView($$('[data-tick-to]'), function (el) {
    if (reduceMotion) { el.textContent = el.getAttribute('data-tick-to'); return; }
    window.setTimeout(function () {
      el.textContent = el.getAttribute('data-tick-to');
      el.classList.add('bump');
    }, 1200);
  });

  /* ---------- Numbers count up once ---------- */
  onceInView($$('[data-count]'), function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduceMotion) { el.textContent = target; return; }
    var t0 = 0;
    var dur = 1400;
    var step = function (ts) {
      if (!t0) t0 = ts;
      var k = clamp((ts - t0) / dur, 0, 1);
      el.textContent = Math.round(easeOut(k) * target);
      if (k < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, '0px 0px -20% 0px');

  /* ---------- Cell spotlight follows the pointer ---------- */
  $$('.cell').forEach(function (cell) {
    cell.addEventListener('pointermove', function (e) {
      var r = cell.getBoundingClientRect();
      cell.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      cell.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Intelligence tabs: auto-advance until someone picks one ---------- */
  var tabsRoot = $('[data-tabs]');
  if (tabsRoot) {
    var tabs = $$('[role="tab"]', tabsRoot);
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var ask = $('[data-ask]', tabsRoot);
    var current = 0;
    var auto = !reduceMotion;
    var askTimer = 0;

    var runAsk = function () {
      if (!ask) return;
      var q = $('[data-type]', ask);
      var full = q.getAttribute('data-full') || q.textContent;
      q.setAttribute('data-full', full);
      window.clearTimeout(askTimer);
      ask.classList.remove('is-answered');
      if (reduceMotion) { q.textContent = full; ask.classList.add('is-answered'); return; }
      q.textContent = '';
      ask.classList.add('is-typing');
      var i = 0;
      var type = function () {
        q.textContent = full.slice(0, ++i);
        if (i < full.length) askTimer = window.setTimeout(type, 34);
        else {
          ask.classList.remove('is-typing');
          askTimer = window.setTimeout(function () { ask.classList.add('is-answered'); }, 450);
        }
      };
      askTimer = window.setTimeout(type, 350);
    };

    var select = function (idx, fromUser) {
      current = (idx + tabs.length) % tabs.length;
      tabs.forEach(function (tab, i) {
        var on = i === current;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
        panels[i].classList.remove('is-shown');
      });
      var panel = panels[current];
      void panel.offsetWidth; // restart the entry animation
      panel.classList.add('is-shown');
      if (panel.contains(ask)) runAsk();
      if (fromUser && auto) {
        auto = false;
        tabsRoot.classList.remove('is-auto');
      }
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i, true); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = current + 1;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = current - 1;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        select(next, true);
        tabs[current].focus();
      });
      // The progress line under the active tab drives the auto-advance.
      $('.intel__progress', tab).addEventListener('animationend', function () {
        if (auto && i === current) select(current + 1, false);
      });
    });

    if (auto && 'IntersectionObserver' in window) {
      tabsRoot.style.setProperty('--dur', '7s');
      tabsRoot.classList.add('is-paused');
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        tabsRoot.classList.toggle('is-paused', !visible);
        if (visible && auto && !tabsRoot.classList.contains('is-auto')) {
          tabsRoot.classList.add('is-auto');
          select(current, false);
        }
      }, { rootMargin: '0px 0px -25% 0px' }).observe(tabsRoot);
    } else {
      select(0, false);
    }
  }

  /* ---------- Pricing: billing cycle ---------- */
  var cycle = $('[data-cycle]');
  if (cycle) {
    var PRICES = {
      basic: { monthly: 599, quarterly: 569, halfyearly: 539, annual: 509 },
      pro: { monthly: 1199, quarterly: 1139, halfyearly: 1079, annual: 1019 },
      ent: { monthly: 1999, quarterly: 1899, halfyearly: 1799, annual: 1699 }
    };
    var BILLING = {
      monthly: 'Billed monthly.',
      quarterly: 'Billed every 3 months, 5% off.',
      halfyearly: 'Billed every 6 months, 10% off.',
      annual: 'Billed yearly, 15% off.'
    };
    var MIN_SEATS = { basic: 3, pro: 5, ent: 5 };
    var options = $$('[data-cycle-option]', cycle);
    var shown = { basic: 599, pro: 1199, ent: 1999 };

    var animatePrice = function (plan, to) {
      var el = $('[data-price="' + plan + '"]');
      var from = shown[plan];
      shown[plan] = to;
      if (reduceMotion || from === to) { el.textContent = formatInr(to); return; }
      var t0 = 0;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var k = clamp((ts - t0) / 380, 0, 1);
        el.textContent = formatInr(from + (to - from) * easeOut(k));
        if (k < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    var choose = function (btn, focus) {
      var key = btn.getAttribute('data-cycle-option');
      options.forEach(function (o) {
        var on = o === btn;
        o.setAttribute('aria-checked', String(on));
        o.tabIndex = on ? 0 : -1;
      });
      if (focus) btn.focus();
      Object.keys(PRICES).forEach(function (plan) {
        animatePrice(plan, PRICES[plan][key]);
        $('[data-bill="' + plan + '"]').textContent = BILLING[key] + ' Minimum ' + MIN_SEATS[plan] + ' seats.';
      });
    };

    options.forEach(function (btn, i) {
      btn.addEventListener('click', function () { choose(btn, false); });
      btn.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        choose(options[(i + d + options.length) % options.length], true);
      });
    });
  }
})();
