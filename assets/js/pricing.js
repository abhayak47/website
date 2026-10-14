/* Onjaal — pricing page behaviour: billing toggle and cost estimator.
   Pure arithmetic in the browser; nothing is sent anywhere.
   Keep RATES in sync with PLANS in tools/build_pricing.py. */
(function () {
  'use strict';
  var RATES = { standard: { annual: 59, monthly: 71, name: 'Standard' }, premium: { annual: 99, monthly: 119, name: 'Premium' } };
  var IMPLEMENTATION = 60000; // one-time, 150-user scope
  var BIOMETRIC = 15000;      // one-time, included in Premium
  var FREE_LIMIT = 5;

  var fmt = new Intl.NumberFormat('en-IN');
  function inr(n) { return '₹' + fmt.format(Math.round(n)); }
  function $(id) { return document.getElementById(id); }

  /* ---------- Billing toggle on the plan cards ---------- */
  var toggles = document.querySelectorAll('input[name="billing"]');
  function applyBilling(mode) {
    document.querySelectorAll('.amt[data-annual]').forEach(function (el) {
      el.textContent = '₹' + el.getAttribute('data-' + mode);
    });
    document.querySelectorAll('[data-unit-annual]').forEach(function (el) { el.hidden = mode !== 'annual'; });
    document.querySelectorAll('[data-unit-monthly]').forEach(function (el) { el.hidden = mode !== 'monthly'; });
  }
  toggles.forEach(function (t) {
    t.addEventListener('change', function () { if (t.checked) applyBilling(t.value); });
  });

  /* ---------- Estimator ---------- */
  var range = $('calc-range'), num = $('calc-users'), annual = $('calc-annual'),
      impl = $('calc-impl'), bio = $('calc-bio');
  if (!range || !num || !annual || !impl || !bio) return;
  var planInputs = document.querySelectorAll('input[name="calc-plan"]');

  function plan() {
    var v = 'standard';
    planInputs.forEach(function (p) { if (p.checked) v = p.value; });
    return v;
  }
  function clamp(v) {
    v = parseInt(v, 10);
    if (isNaN(v)) v = 1;
    return Math.min(1000, Math.max(1, v));
  }

  function render() {
    var users = clamp(num.value);
    var key = plan();
    var r = RATES[key];
    var free = users <= FREE_LIMIT;
    var perUser = free ? 0 : (annual.checked ? r.annual : r.monthly);
    var perMonth = users * perUser;
    var perYear = perMonth * 12;

    var bioIncluded = key === 'premium' && !free;
    bio.disabled = bioIncluded;
    if (bioIncluded) bio.checked = false;
    var oneTime = (impl.checked ? IMPLEMENTATION : 0) + (bio.checked ? BIOMETRIC : 0);

    $('calc-users-out').textContent = fmt.format(users) + (users === 1 ? ' user' : ' users');
    $('calc-plan-line').textContent = free ? 'Free plan (up to 5 users)' : r.name + ' plan, billed ' + (annual.checked ? 'annually' : 'monthly');
    $('calc-rate').textContent = inr(perUser);
    $('calc-monthly').textContent = inr(perMonth);
    $('calc-yearly').textContent = inr(perYear);
    $('calc-onetime').textContent = inr(oneTime);
    $('calc-first').textContent = inr(perYear + oneTime);

    var note = 'Applicable taxes are confirmed in your written proposal.';
    if (free) note = 'Teams of up to 5 users are free. ' + note;
    else if (bioIncluded) note = 'Biometric integration is included in Premium. ' + note;
    $('calc-note').textContent = note;

    var cta = $('calc-cta');
    cta.href = '/contact/?interest=' + (free ? 'free' : key) + '&users=' + users;
  }

  function sync(v, source) {
    var users = clamp(v);
    if (source !== range) range.value = Math.min(users, +range.max);
    if (source !== num) num.value = users;
    render();
  }

  range.addEventListener('input', function () { sync(range.value, range); });
  num.addEventListener('input', function () { if (num.value !== '') sync(num.value, num); });
  num.addEventListener('blur', function () { sync(num.value, null); });
  [annual, impl, bio].forEach(function (el) { el.addEventListener('change', render); });
  planInputs.forEach(function (p) { p.addEventListener('change', render); });
  sync(num.value, null);
})();
