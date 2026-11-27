/* Inquiry form for the generated landing pages. Same CRM webhook and thank-you page as the homepage form. */
(function () {
  'use strict';
  var WEBHOOK = 'https://api.neeticrm.com/api/webhooks/inbound/ca23f30c7d0a6ca2aba977243a73301f39de81652d3099b0';
  var REDIRECT = '/bookdemothankyou';
  var form = document.getElementById('page-enquiry-form');
  if (!form) return;
  var alertBox = document.getElementById('pg-alert');
  var btn = document.getElementById('pg-submit');
  var label = document.getElementById('pg-submit-label');

  function showError(msg) {
    alertBox.textContent = msg;
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function val(fd, k) { return (fd.get(k) || '').toString().trim(); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alertBox.style.display = 'none';
    var fd = new FormData(form);
    if (val(fd, 'bot-field')) { window.location.href = REDIRECT; return; }

    var name = val(fd, 'name'), phone = val(fd, 'phone').replace(/\D/g, '').slice(-10),
        email = val(fd, 'email'), company = val(fd, 'company');
    if (name.length < 2) return showError('Please enter your full name.');
    if (!/^[0-9]{10}$/.test(phone)) return showError('Please enter a valid 10-digit mobile number.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return showError('Please enter a valid work email.');
    if (company.length < 2) return showError('Please enter your company name.');

    btn.disabled = true;
    label.textContent = 'Sending…';
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', { content_name: 'Page Enquiry: ' + form.dataset.page, content_category: val(fd, 'role') || 'Real Estate' });
    }

    var payload = {
      name: name, full_name: name, phone: phone, mobile: phone, email: email,
      company: company, company_name: company, role: val(fd, 'role'),
      team_size: val(fd, 'team_size'), location: val(fd, 'location'), city: val(fd, 'location'),
      message: val(fd, 'message'), notes: val(fd, 'message'),
      source: 'Website Page: ' + form.dataset.page, form_name: 'page-enquiry',
      page_url: window.location.href, submitted_at: new Date().toISOString()
    };
    var params = new URLSearchParams();
    fd.forEach(function (v, k) { params.append(k, v); });

    var done = false;
    function go() { if (done) return; done = true; window.location.href = REDIRECT; }
    var timer = setTimeout(go, 6000);

    var jobs = [];
    if (window.fetch) {
      jobs.push(fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) }).catch(function () {}));
      jobs.push(fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() }).catch(function () {}));
      Promise.all(jobs).then(function () { clearTimeout(timer); go(); });
    } else { go(); }
  });
})();
