/* Onjaal — pricing estimator. Pure arithmetic in the browser; nothing is sent anywhere.
   Rates mirror the published 150-user estimate on this page. */
(function () {
  'use strict';
  var RATE = 59;            // ₹ per user per month
  var IMPLEMENTATION = 60000; // ₹ one-time
  var BIOMETRIC = 15000;      // ₹ one-time, optional

  var range = document.getElementById('calc-range');
  var num = document.getElementById('calc-users');
  var bio = document.getElementById('calc-bio');
  if (!range || !num || !bio) return;

  var fmt = new Intl.NumberFormat('en-IN');
  function inr(n) { return '₹' + fmt.format(n); }
  function el(id) { return document.getElementById(id); }

  function clamp(v) {
    v = parseInt(v, 10);
    if (isNaN(v)) v = 1;
    return Math.min(1000, Math.max(1, v));
  }

  function render(users) {
    var yearly = users * RATE * 12;
    var oneTime = IMPLEMENTATION + (bio.checked ? BIOMETRIC : 0);
    el('calc-users-out').textContent = fmt.format(users) + (users === 1 ? ' user' : ' users');
    el('calc-monthly').textContent = inr(users * RATE);
    el('calc-yearly').textContent = inr(yearly);
    el('calc-onetime').textContent = inr(oneTime);
    el('calc-first').textContent = inr(yearly + oneTime);
    el('calc-renew').textContent = inr(yearly);
    var cta = el('calc-cta');
    if (cta) cta.href = '/contact/?interest=pricing&users=' + users;
  }

  function set(v, source) {
    var users = clamp(v);
    if (source !== range) range.value = Math.min(users, +range.max);
    if (source !== num) num.value = users;
    render(users);
  }

  range.addEventListener('input', function () { set(range.value, range); });
  num.addEventListener('input', function () { if (num.value !== '') set(num.value, num); });
  num.addEventListener('blur', function () { set(num.value, null); });
  bio.addEventListener('change', function () { set(num.value, null); });
  set(num.value, null);
})();
