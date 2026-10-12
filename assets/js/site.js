/* Onjaal — small progressive enhancements. The page works without this file. */
(function () {
  'use strict';

  /* Mobile navigation */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  var label = toggle ? toggle.querySelector('.menu-label') : null;

  function setMenu(open, returnFocus) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close' : 'Menu';
    if (!open && returnFocus) toggle.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true', false);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false, false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-header')) setMenu(false, false);
    });
    window.matchMedia('(min-width: 881px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false, false);
    });
  }

  /* Footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* Enquiry form: clearer inline validation. Action, method, field names and
     FormSubmit settings are untouched; a valid form submits exactly as before. */
  var form = document.getElementById('demo-form');
  if (!form) return;
  var button = document.getElementById('submit-btn');
  var status = document.getElementById('form-status');
  var fields = Array.prototype.slice.call(form.querySelectorAll('input[required], select[required]'));

  form.setAttribute('novalidate', '');

  function errorFor(field) {
    return document.getElementById(field.id + '-error');
  }
  function showError(field) {
    var err = errorFor(field);
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
    var evt = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(evt, function () {
      if (field.getAttribute('aria-invalid') === 'true') showError(field);
    });
    field.addEventListener('blur', function () {
      if (field.value.trim() !== '' || field.getAttribute('aria-invalid') === 'true') showError(field);
    });
  });

  form.addEventListener('submit', function (e) {
    var firstInvalid = null;
    fields.forEach(function (field) {
      if (field.tagName !== 'SELECT' && field.type !== 'email') field.value = field.value.trim() === '' ? '' : field.value;
      if (showError(field) && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      e.preventDefault();
      status.textContent = 'Please check the highlighted fields.';
      firstInvalid.focus();
      return;
    }
    status.textContent = 'Sending your enquiry. You’ll be taken to a short confirmation step.';
    button.disabled = true;
  });

  /* If the visitor comes back with the browser's Back button, re-enable the form */
  window.addEventListener('pageshow', function () {
    button.disabled = false;
    status.textContent = '';
  });
})();
