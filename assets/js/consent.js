/* Onjaal — consent-aware analytics (Google Analytics 4).
 *
 * OFF by default. While GA4_ID is empty this file does nothing: no banner, no requests,
 * and the privacy page ("no analytics, no cookies") stays accurate.
 *
 * To turn analytics on:
 *   1. Paste your Measurement ID below, e.g. 'G-ABC123XYZ9'.
 *   2. Update privacy/index.html and security/index.html (they currently say there is no analytics).
 *   3. Verify in GA4 DebugView that nothing loads until a visitor clicks "Accept".
 *
 * Consent Mode v2 defaults are 'denied'. The GA script is injected only after "Accept".
 * The visitor's choice is stored in localStorage ('onjaal-consent') and can be changed from the
 * footer link "Cookie settings" (any element with [data-consent-settings]).
 */
(function () {
  'use strict';
  var GA4_ID = ''; // <- paste G-XXXXXXXXXX here to enable analytics
  if (!GA4_ID) { window.onjaalTrack = function () {}; return; }

  var KEY = 'onjaal-consent';
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* choice lasts for this page view only */ } }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

  var loaded = false;
  function load() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA4_ID, { anonymize_ip: true });
  }

  function apply(choice) {
    if (choice === 'granted') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
      load();
    } else {
      gtag('consent', 'update', { analytics_storage: 'denied' });
    }
  }

  window.onjaalTrack = function (name, params) {
    if (read() === 'granted' && window.gtag) window.gtag('event', name, params || {});
  };

  function banner() {
    if (document.getElementById('consent-banner')) return;
    var el = document.createElement('div');
    el.id = 'consent-banner';
    el.className = 'consent';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Analytics preferences');
    el.innerHTML =
      '<p>We would like to use privacy-conscious analytics to understand which pages help visitors. Nothing is collected unless you accept. ' +
      '<a href="/privacy/">Privacy policy</a></p>' +
      '<div class="consent-actions"><button type="button" class="btn btn-outline" data-consent="denied">Reject</button>' +
      '<button type="button" class="btn btn-primary" data-consent="granted">Accept</button></div>';
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      var v = b.getAttribute('data-consent');
      write(v);
      apply(v);
      el.remove();
    });
    document.body.appendChild(el);
  }

  window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-consent-settings]').forEach(function (el) { el.hidden = false; });
  });

  var saved = read();
  if (saved === 'granted' || saved === 'denied') apply(saved); else window.addEventListener('DOMContentLoaded', banner);

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-consent-settings]')) { e.preventDefault(); banner(); return; }
    var a = e.target.closest('a[href*="/contact/"]');
    if (a) window.onjaalTrack('cta_click', { link_text: (a.textContent || '').trim().slice(0, 40), link_url: a.getAttribute('href') });
  });
})();
