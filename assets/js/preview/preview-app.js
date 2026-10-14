/* Onjaal HRMS interactive preview: state and behaviour.
   Runs entirely in the browser on fictional data. It makes no network requests,
   stores nothing, and is separate from the enquiry form. */
(function () {
  'use strict';

  var D = window.OnjaalPreviewData;
  var V = window.OnjaalPreviewViews;
  var mount = document.getElementById('hrms-preview');
  if (!mount || !D || !V) return;

  var MOBILE_LIMIT = 8;
  var narrow = window.matchMedia('(max-width: 760px)');

  /* ---------- State ---------- */
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function freshState(tab) {
    return {
      tab: tab || 'overview',
      attendance: clone(D.attendance),
      leaves: clone(D.leaves),
      activity: clone(D.activity),
      dirQuery: '',
      dirDept: 'all',
      dirShowAll: false,
      attDay: D.today,
      attFilter: 'all',
      leaveFilter: 'Pending',
      justProcessed: [],
      dirty: false
    };
  }
  var state = freshState();

  var byId = {};
  D.employees.forEach(function (e) { byId[e.id] = e; });

  /* ---------- Derived values ---------- */
  var model = {
    D: D,
    get state() { return state; },
    emp: function (id) { return byId[id]; },
    att: function (id, day) { return state.attendance[id][day]; },
    dayCounts: function (day) {
      var c = { P: 0, A: 0, L: 0 };
      D.employees.forEach(function (e) { c[state.attendance[e.id][day]]++; });
      return c;
    },
    pendingLeaves: function () {
      return state.leaves.filter(function (l) { return l.status === 'Pending'; });
    },
    attNote: function (id, day) {
      var code = state.attendance[id][day];
      if (code !== 'A') return '';
      for (var i = 0; i < state.leaves.length; i++) {
        var l = state.leaves[i];
        if (l.employee === id && l.weekDays.indexOf(day) !== -1) {
          if (l.status === 'Pending') return 'Leave request pending';
          if (l.status === 'Declined') return 'Leave request declined';
        }
      }
      return '';
    }
  };

  function directoryList() {
    var q = state.dirQuery.trim().toLowerCase();
    return D.employees.filter(function (e) {
      if (state.dirDept !== 'all' && e.department !== state.dirDept) return false;
      if (!q) return true;
      return (e.name + ' ' + e.role + ' ' + e.id + ' ' + e.department).toLowerCase().indexOf(q) !== -1;
    });
  }

  /* ---------- Build the shell once ---------- */
  var markSrc = mount.getAttribute('data-mark') || '';
  var root = document.createElement('div');
  root.className = 'pv';
  root.innerHTML = V.shell(D, markSrc);
  mount.innerHTML = '';
  mount.appendChild(root);
  mount.classList.add('is-ready');

  function q(sel) { return root.querySelector(sel); }
  function qa(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  var regions = {
    overview: q('[data-region="overview"]'),
    directory: q('[data-region="directory"]'),
    attChips: q('[data-region="att-chips"]'),
    attendance: q('[data-region="attendance"]'),
    leaveChips: q('[data-region="leave-chips"]'),
    leave: q('[data-region="leave"]')
  };
  var search = q('#pv-search');
  var dept = q('#pv-dept');
  var toast = q('[data-bind="toast"]');
  var toastTimer;

  /* ---------- Rendering ---------- */
  function render() {
    // tabs
    qa('[role="tab"]').forEach(function (t) {
      var on = t.getAttribute('data-tab') === state.tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    qa('[role="tabpanel"]').forEach(function (p) {
      p.hidden = p.id !== 'pv-panel-' + state.tab;
    });
    // keep the selected tab visible in the swipeable mobile tab bar
    var tablist = q('[role="tablist"]');
    var current = q('#pv-tab-' + state.tab);
    if (tablist && current && tablist.scrollWidth > tablist.clientWidth) {
      var left = current.offsetLeft - tablist.offsetLeft - 12;
      if (left < tablist.scrollLeft || left + current.offsetWidth > tablist.scrollLeft + tablist.clientWidth) tablist.scrollLeft = Math.max(0, left);
    }
    var pending = model.pendingLeaves().length;
    q('[data-bind="pending-count"]').textContent = pending ? String(pending) : '';
    q('[data-bind="pending-count"]').setAttribute('aria-label', pending + ' pending');

    regions.overview.innerHTML = V.overview(model);

    var list = directoryList();
    var limit = narrow.matches && !state.dirShowAll ? MOBILE_LIMIT : 0;
    regions.directory.innerHTML = V.directory(model, list, limit);
    var shown = limit ? Math.min(limit, list.length) : list.length;
    q('[data-bind="dir-count"]').textContent = list.length
      ? 'Showing ' + shown + ' of ' + list.length + (list.length === D.employees.length ? ' employees' : ' matching employees')
      : '';
    if (search.value !== state.dirQuery) search.value = state.dirQuery;
    if (dept.value !== state.dirDept) dept.value = state.dirDept;

    qa('[data-action="att-day"]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-day')) === state.attDay));
    });
    regions.attChips.innerHTML = V.attendanceChips(model);
    q('[data-bind="att-summary"]').textContent = V.attendanceSummary(model);
    regions.attendance.innerHTML = V.attendance(model);

    regions.leaveChips.innerHTML = V.leaveChips(model);
    regions.leave.innerHTML = V.leave(model);

    qa('[data-action="reset"]').forEach(function (b) { b.disabled = !state.dirty; });
  }

  function say(message) {
    clearTimeout(toastTimer);
    toast.textContent = '';
    // a brief gap lets screen readers announce repeated messages
    setTimeout(function () {
      toast.textContent = message;
      toast.classList.add('is-visible');
      toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 5000);
    }, 30);
  }

  function setTab(tab, focusPanel) {
    if (tab !== state.tab) state.justProcessed = [];
    state.tab = tab;
    render();
    if (focusPanel) {
      var panel = q('#pv-panel-' + tab);
      if (panel) panel.focus({ preventScroll: true });
      scrollAppIntoView();
    }
  }
  function scrollAppIntoView() {
    var main = q('.pv-main');
    if (main) main.scrollTop = 0;
  }

  /* ---------- Leave decisions ---------- */
  function decide(id, approve) {
    var l = state.leaves.filter(function (x) { return x.id === id; })[0];
    if (!l || l.status !== 'Pending') return; // never process twice
    var emp = byId[l.employee];
    l.status = approve ? 'Approved' : 'Declined';
    l.decidedNow = true;
    if (approve) {
      l.weekDays.forEach(function (d) { state.attendance[l.employee][d] = 'L'; });
    }
    state.justProcessed.push(id);
    state.dirty = true;
    state.activity.unshift({
      when: 'Now',
      fresh: true,
      text: 'You ' + (approve ? 'approved' : 'declined') + ' ' + emp.name + '’s ' + l.type.toLowerCase() + ' for ' + lower(l.dates)
    });
    render();

    var follow;
    if (approve && l.weekDays.length) {
      follow = 'Attendance now shows On leave for ' + l.dates + '.';
    } else if (!approve && l.weekDays.length) {
      follow = 'Attendance stays Absent for ' + l.dates + '.';
    } else {
      follow = 'The dates fall outside the sample week.';
    }
    say((approve ? 'Approved ' : 'Declined ') + emp.name + '’s ' + l.type.toLowerCase() + '. ' + follow);

    var card = q('#pv-req-' + id);
    if (card) card.focus({ preventScroll: false });
  }
  function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  /* ---------- Events ---------- */
  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action], [role="tab"]');
    if (!el || !root.contains(el)) return;
    if (el.getAttribute('role') === 'tab') { setTab(el.getAttribute('data-tab'), false); return; }
    var action = el.getAttribute('data-action');
    var id = el.getAttribute('data-id');
    switch (action) {
      case 'approve': decide(id, true); break;
      case 'decline': decide(id, false); break;
      case 'reset':
        state = freshState(state.tab);
        render();
        say('Sample data reset to its original state.');
        var tab = q('#pv-tab-' + state.tab);
        if (tab) tab.focus();
        break;
      case 'expand': toggleExpanded(); break;
      case 'go-employees': setTab('employees', true); break;
      case 'go-present': state.attDay = D.today; state.attFilter = 'P'; setTab('attendance', true); break;
      case 'go-onleave': state.attDay = D.today; state.attFilter = 'L'; setTab('attendance', true); break;
      case 'go-day': state.attDay = Number(el.getAttribute('data-day')); state.attFilter = 'all'; setTab('attendance', true); break;
      case 'go-pending': state.leaveFilter = 'Pending'; setTab('leave', true); break;
      case 'review':
        state.leaveFilter = 'Pending';
        setTab('leave', false);
        var req = q('#pv-req-' + id);
        if (req) req.focus();
        break;
      case 'dir-clear':
        state.dirQuery = ''; state.dirDept = 'all'; state.dirShowAll = false;
        render(); search.focus();
        break;
      case 'dir-more':
        state.dirShowAll = true; render();
        var rows = qa('.pv-table-dir .pv-tbody .pv-tr');
        if (rows[MOBILE_LIMIT]) { rows[MOBILE_LIMIT].setAttribute('tabindex', '-1'); rows[MOBILE_LIMIT].focus(); }
        break;
      case 'att-day':
        state.attDay = Number(el.getAttribute('data-day')); render();
        break;
      case 'att-filter':
        state.attFilter = el.getAttribute('data-filter'); render();
        var chip = q('[data-action="att-filter"][data-filter="' + state.attFilter + '"]');
        if (chip && el.closest('.pv-chips')) chip.focus();
        break;
      case 'leave-filter':
        state.leaveFilter = el.getAttribute('data-filter'); state.justProcessed = []; render();
        var lchip = q('[data-action="leave-filter"][data-filter="' + state.leaveFilter + '"]');
        if (lchip) lchip.focus();
        break;
    }
  });

  search.addEventListener('input', function () {
    state.dirQuery = search.value; state.dirShowAll = false; render();
  });
  dept.addEventListener('change', function () {
    state.dirDept = dept.value; state.dirShowAll = false; render();
  });
  narrow.addEventListener('change', render);

  // Tabs: arrow keys, Home and End (WAI-ARIA tabs pattern, automatic activation)
  q('[role="tablist"]').addEventListener('keydown', function (e) {
    var tabs = qa('[role="tab"]');
    var i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    var next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    setTab(tabs[next].getAttribute('data-tab'), false);
    tabs[next].focus();
  });

  /* ---------- Expanded view (native modal dialog) ---------- */
  var dialog = null;
  var expandBtn = q('[data-action="expand"]');
  function toggleExpanded() {
    if (dialog && dialog.open) { dialog.close(); return; }
    if (typeof HTMLDialogElement === 'undefined') return;
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'pv-dialog';
      dialog.setAttribute('aria-label', 'Onjaal HRMS interactive preview, expanded');
      document.body.appendChild(dialog);
      dialog.addEventListener('close', function () {
        mount.appendChild(root);
        mount.style.minHeight = '';
        root.classList.remove('is-expanded');
        expandBtn.textContent = 'Expand';
        expandBtn.setAttribute('aria-haspopup', 'dialog');
        document.documentElement.classList.remove('pv-locked');
        expandBtn.focus();
      });
      dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    }
    mount.style.minHeight = mount.offsetHeight + 'px';
    dialog.appendChild(root);
    root.classList.add('is-expanded');
    expandBtn.textContent = 'Close full view';
    expandBtn.removeAttribute('aria-haspopup');
    document.documentElement.classList.add('pv-locked');
    dialog.showModal();
    expandBtn.focus();
  }

  // The demo link inside the preview closes the full view first, then scrolls to the form
  document.addEventListener('click', function (e) {
    var link = e.target.closest('.pv-cta a');
    if (link && dialog && dialog.open && dialog.contains(link)) dialog.close();
  });

  if (typeof HTMLDialogElement === 'undefined') expandBtn.hidden = true;
  render();
})();
