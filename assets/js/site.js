/* Onjaal — site behaviour. Progressive enhancement: every page works without it. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  var label = toggle ? toggle.querySelector('.menu-label') : null;
  function setMenu(open, returnFocus) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    doc.classList.toggle('nav-open', open);
    if (label) label.textContent = open ? 'Close' : 'Menu';
    if (!open && returnFocus) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true', false); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false, false); });
    window.matchMedia('(min-width: 1021px)').addEventListener('change', function (mq) { if (mq.matches) setMenu(false, false); });
  }

  /* ---------- Products dropdown (disclosure) ---------- */
  var dd = document.querySelector('[data-dropdown]');
  var ddPanel = dd ? document.getElementById(dd.getAttribute('aria-controls')) : null;
  function setDropdown(open, returnFocus) {
    if (!dd || !ddPanel) return;
    dd.setAttribute('aria-expanded', String(open));
    ddPanel.hidden = !open;
    if (!open && returnFocus) dd.focus();
  }
  if (dd && ddPanel) {
    dd.addEventListener('click', function () { setDropdown(dd.getAttribute('aria-expanded') !== 'true', false); });
    document.addEventListener('click', function (e) {
      if (dd.getAttribute('aria-expanded') === 'true' && !e.target.closest('.has-menu')) setDropdown(false, false);
    });
    ddPanel.addEventListener('focusout', function (e) {
      if (window.matchMedia('(min-width: 1021px)').matches && e.relatedTarget && !e.relatedTarget.closest('.has-menu')) setDropdown(false, false);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (dd && dd.getAttribute('aria-expanded') === 'true') { setDropdown(false, true); return; }
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('[data-reveal], .journey');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Spotlight that follows the pointer on dark tiles ---------- */
  if (!reduceMotion.matches) {
    document.querySelectorAll('.tile-dark').forEach(function (tile) {
      tile.addEventListener('pointermove', function (e) {
        var r = tile.getBoundingClientRect();
        tile.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        tile.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Enquiry form ---------- */
  var form = document.getElementById('demo-form');
  if (!form) return;

  // Preselect the area of interest from links such as /contact/?interest=crm
  var interest = new URLSearchParams(location.search).get('interest');
  var map = { hrms: 'HRMS / employee management', pricing: 'Implementation and pricing', biometric: 'Biometric integration',
    crm: 'Onjaal CRM (early access)', erp: 'Onjaal ERP (early access)', accounts: 'Onjaal Accounts (early access)' };
  var need = document.getElementById('need');
  if (interest && need && map[interest]) need.value = map[interest];

  // Preselect the team-size band from /contact/?users=120 (set by the pricing estimator)
  var users = parseInt(new URLSearchParams(location.search).get('users'), 10);
  var size = document.getElementById('employees');
  if (users > 0 && size) {
    var bands = [[25, 0], [50, 1], [100, 2], [150, 3], [300, 4]];
    var idx = 5;
    for (var i = 0; i < bands.length; i++) { if (users <= bands[i][0]) { idx = bands[i][1]; break; } }
    size.selectedIndex = idx + 1;
  }

  var button = document.getElementById('submit-btn');
  var status = document.getElementById('form-status');
  var fields = Array.prototype.slice.call(form.querySelectorAll('input[required], select[required]'));
  form.setAttribute('novalidate', '');

  function showError(field) {
    var err = document.getElementById(field.id + '-error');
    var invalid = !field.checkValidity();
    field.setAttribute('aria-invalid', String(invalid));
    if (!err) return invalid;
    if (invalid) {
      err.textContent = err.getAttribute('data-message');
      err.classList.add('is-visible');
      field.setAttribute('aria-describedby', err.id);
    } else {
      err.textContent = '';
      err.classList.remove('is-visible');
      field.removeAttribute('aria-describedby');
    }
    return invalid;
  }
  fields.forEach(function (field) {
    field.addEventListener(field.tagName === 'SELECT' ? 'change' : 'input', function () {
      if (field.getAttribute('aria-invalid') === 'true') showError(field);
    });
    field.addEventListener('blur', function () {
      if (field.value.trim() !== '' || field.getAttribute('aria-invalid') === 'true') showError(field);
    });
  });
  var ENDPOINT = 'https://formsubmit.co/ajax/tech@onjaal.com';
  form.addEventListener('submit', function (e) {
    var firstInvalid = null;
    fields.forEach(function (field) {
      if (field.tagName !== 'SELECT' && field.value.trim() === '') field.value = '';
      if (showError(field) && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      e.preventDefault();
      status.classList.remove('is-error');
      status.textContent = 'Please check the highlighted fields.';
      firstInvalid.focus();
      return;
    }
    // Enhanced path: send in the background and confirm on this page.
    // If anything goes wrong, fall back to the normal form post.
    if (!window.fetch || !window.FormData) {
      status.textContent = 'Sending your enquiry. You’ll be taken to a short confirmation step.';
      button.disabled = true;
      return;
    }
    e.preventDefault();
    var honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return; // bot: do nothing
    button.disabled = true;
    status.classList.remove('is-error');
    status.textContent = 'Sending your enquiry…';
    fetch(ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (res) {
        if (res && (res.success === false || res.success === 'false')) throw new Error('rejected');
        form.classList.add('is-sent');
        var done = document.getElementById('form-success');
        if (done) done.focus();
      })
      .catch(function () {
        status.classList.add('is-error');
        status.textContent = 'We couldn’t send that just now. Please try again, or email tech@onjaal.com.';
        button.disabled = false;
      });
  });
  window.addEventListener('pageshow', function () { button.disabled = false; status.textContent = ''; });
})();
