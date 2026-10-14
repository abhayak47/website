/* Onjaal HRMS interactive preview: rendering.
   Pure functions that turn preview state into HTML strings. No side effects. */
window.OnjaalPreviewViews = (function () {
  'use strict';

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var ATT_LABEL = { P: 'Present', A: 'Absent', L: 'On leave' };
  var ATT_CLASS = { P: 'is-good', A: 'is-bad', L: 'is-info' };
  var EMP_CLASS = { 'Active': 'is-good', 'Probation': 'is-info', 'Notice period': 'is-warn' };
  var LEAVE_CLASS = { 'Pending': 'is-warn', 'Approved': 'is-good', 'Declined': 'is-muted' };

  function badge(text, cls) {
    return '<span class="pv-badge ' + cls + '">' + esc(text) + '</span>';
  }
  function initials(name) {
    return name.split(' ').map(function (p) { return p.charAt(0); }).join('').slice(0, 2);
  }
  function person(emp, sub) {
    return '<span class="pv-person"><span class="pv-avatar" aria-hidden="true">' + esc(initials(emp.name)) + '</span>' +
      '<span><span class="pv-person-name">' + esc(emp.name) + '</span>' +
      (sub ? '<span class="pv-person-sub">' + esc(sub) + '</span>' : '') + '</span></span>';
  }

  /* ---------- Static shell (rendered once) ---------- */
  var TABS = [
    { id: 'overview', label: 'Overview', icon: '<path d="M3 3h6v7H3zM11 3h6v4h-6zM11 9h6v8h-6zM3 12h6v5H3z"/>' },
    { id: 'employees', label: 'Employees', icon: '<circle cx="10" cy="6.5" r="3.2"/><path d="M3.5 17c.8-3.4 3.4-5.2 6.5-5.2s5.7 1.8 6.5 5.2"/>' },
    { id: 'attendance', label: 'Attendance', icon: '<rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14M7 2.5v3M13 2.5v3M7 12l2 2 4-4"/>' },
    { id: 'leave', label: 'Leave & approvals', icon: '<path d="M4 10.5l3.5 3.5L16 5.5"/><path d="M3 3h14v14H3z" opacity=".35"/>' }
  ];

  function shell(D, markSrc) {
    var tabs = TABS.map(function (t, i) {
      return '<button type="button" role="tab" class="pv-tab" id="pv-tab-' + t.id + '" data-tab="' + t.id + '"' +
        ' aria-controls="pv-panel-' + t.id + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' +
        '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">' + t.icon + '</svg>' +
        '<span>' + t.label + '</span>' +
        (t.id === 'leave' ? '<span class="pv-count" data-bind="pending-count"></span>' : '') +
        '</button>';
    }).join('');

    var deptOptions = D.departments.map(function (d) {
      return '<option value="' + esc(d) + '">' + esc(d) + '</option>';
    }).join('');

    var dayButtons = D.days.map(function (d, i) {
      return '<button type="button" class="pv-seg" data-action="att-day" data-day="' + i + '" aria-pressed="false">' +
        esc(d) + (i === D.today ? ' <span class="pv-seg-note">today</span>' : '') + '</button>';
    }).join('');

    return '' +
      '<div class="pv-bar">' +
        '<p class="pv-disclosure"><strong>Interactive product preview — sample data</strong> ' +
        '<span>A conceptual preview with fictional people and figures. Nothing you do here is saved or sent.</span></p>' +
        '<div class="pv-bar-actions">' +
          '<button type="button" class="pv-btn" data-action="reset" disabled>Reset sample data</button>' +
          '<button type="button" class="pv-btn" data-action="expand" aria-haspopup="dialog">Expand</button>' +
        '</div>' +
      '</div>' +
      '<div class="pv-app">' +
        '<div class="pv-side">' +
          '<p class="pv-brand"><img src="' + esc(markSrc) + '" width="48" height="54" alt="">Onjaal HRMS</p>' +
          '<div class="pv-tabs" role="tablist" aria-label="Preview sections" aria-orientation="vertical">' + tabs + '</div>' +
          '<p class="pv-side-note">' + esc(D.companyLabel) + '<br>' + D.employees.length + ' employees</p>' +
        '</div>' +
        '<div class="pv-main">' +

          '<section class="pv-panel" id="pv-panel-overview" role="tabpanel" aria-labelledby="pv-tab-overview" tabindex="-1">' +
            '<header class="pv-head"><div><h3>Overview</h3><p>Friday in a sample working week</p></div></header>' +
            '<div data-region="overview"></div>' +
          '</section>' +

          '<section class="pv-panel" id="pv-panel-employees" role="tabpanel" aria-labelledby="pv-tab-employees" tabindex="-1" hidden>' +
            '<header class="pv-head"><div><h3>Employees</h3><p>Search the sample directory or filter by department</p></div></header>' +
            '<div class="pv-controls">' +
              '<div class="pv-field pv-field-grow"><label for="pv-search">Search employees</label>' +
                '<input id="pv-search" type="search" placeholder="Name, role or ID" autocomplete="off" spellcheck="false" data-action="dir-search"></div>' +
              '<div class="pv-field"><label for="pv-dept">Department</label>' +
                '<select id="pv-dept" data-action="dir-dept"><option value="all">All departments</option>' + deptOptions + '</select></div>' +
            '</div>' +
            '<p class="pv-result-count" data-bind="dir-count" aria-live="polite"></p>' +
            '<div data-region="directory"></div>' +
          '</section>' +

          '<section class="pv-panel" id="pv-panel-attendance" role="tabpanel" aria-labelledby="pv-tab-attendance" tabindex="-1" hidden>' +
            '<header class="pv-head"><div><h3>Attendance</h3><p>Choose a day in the sample week</p></div></header>' +
            '<div class="pv-controls pv-controls-stack">' +
              '<div class="pv-segs" role="group" aria-label="Day">' + dayButtons + '</div>' +
              '<div class="pv-chips" role="group" aria-label="Show status" data-region="att-chips"></div>' +
            '</div>' +
            '<p class="pv-summary" data-bind="att-summary" aria-live="polite"></p>' +
            '<div data-region="attendance"></div>' +
            '<p class="pv-footnote">Sample records only. Attendance in this preview isn’t connected to any biometric device.</p>' +
          '</section>' +

          '<section class="pv-panel" id="pv-panel-leave" role="tabpanel" aria-labelledby="pv-tab-leave" tabindex="-1" hidden>' +
            '<header class="pv-head"><div><h3>Leave &amp; approvals</h3><p>Approve or decline sample requests and watch attendance update</p></div></header>' +
            '<p class="pv-note">These buttons change sample data in your browser only. No one is notified and no record changes.</p>' +
            '<div class="pv-chips" role="group" aria-label="Show requests" data-region="leave-chips"></div>' +
            '<div data-region="leave"></div>' +
          '</section>' +

        '</div>' +
        '<p class="pv-toast" role="status" aria-live="polite" data-bind="toast"></p>' +
      '</div>' +
      '<div class="pv-cta"><p>Want to see the live product with your own processes?</p>' +
        '<a class="btn btn-primary" href="/contact/?interest=hrms">Request a demo</a></div>';
  }

  /* ---------- Overview ---------- */
  function overview(m) {
    var c = m.dayCounts(m.D.today);
    var total = m.D.employees.length;
    var pending = m.pendingLeaves();

    var stats = [
      { label: 'Total employees', value: total, action: 'go-employees', hint: 'Open the employee directory' },
      { label: 'Present today', value: c.P, action: 'go-present', hint: 'View today’s attendance' },
      { label: 'On leave today', value: c.L, action: 'go-onleave', hint: 'View who is on leave today' },
      { label: 'Pending approvals', value: pending.length, action: 'go-pending', hint: 'Review leave requests' }
    ].map(function (s) {
      return '<button type="button" class="pv-stat" data-action="' + s.action + '">' +
        '<span class="pv-stat-label">' + s.label + '</span>' +
        '<span class="pv-stat-value">' + s.value + '</span>' +
        '<span class="pv-stat-hint">' + s.hint + '</span></button>';
    }).join('');

    var bars = m.D.days.map(function (d, i) {
      var dc = m.dayCounts(i);
      var pct = Math.round((dc.P / total) * 100);
      return '<li><button type="button" class="pv-week-day" data-action="go-day" data-day="' + i + '"' +
        ' aria-label="' + m.D.dayNames[i] + ': ' + dc.P + ' of ' + total + ' present. View attendance">' +
        '<span class="pv-week-bar"><span style="height:' + pct + '%"></span></span>' +
        '<span class="pv-week-num">' + dc.P + '</span>' +
        '<span class="pv-week-label">' + d + '</span></button></li>';
    }).join('');

    var attention = pending.length ? '<ul class="pv-list">' + pending.slice(0, 3).map(function (l) {
      var emp = m.emp(l.employee);
      return '<li class="pv-list-row">' + person(emp, l.type + ', ' + l.dates) +
        '<button type="button" class="pv-btn pv-btn-sm" data-action="review" data-id="' + l.id + '">Review<span class="sr-only"> ' + esc(emp.name) + '’s request</span></button></li>';
    }).join('') + '</ul>' +
      (pending.length > 3 ? '<button type="button" class="pv-link" data-action="go-pending">View all ' + pending.length + ' pending requests</button>' : '')
      : '<div class="pv-empty pv-empty-sm"><p>No pending requests.</p></div>';

    var activity = '<ul class="pv-activity">' + m.state.activity.slice(0, 6).map(function (a) {
      return '<li' + (a.fresh ? ' class="is-fresh"' : '') + '><span class="pv-activity-when">' + esc(a.when) + '</span><span>' + esc(a.text) + '</span></li>';
    }).join('') + '</ul>';

    return '<div class="pv-stats">' + stats + '</div>' +
      '<div class="pv-ov-grid">' +
        '<article class="pv-card pv-ov-week"><h4>Present this week</h4><p class="pv-card-sub">Employees present each day, out of ' + total + '</p><ol class="pv-week">' + bars + '</ol></article>' +
        '<article class="pv-card"><h4>Needs your attention</h4>' + attention + '</article>' +
        '<article class="pv-card pv-ov-activity"><h4>Recent activity</h4>' + activity + '</article>' +
      '</div>';
  }

  /* ---------- Directory ---------- */
  function directory(m, list, limit) {
    if (!list.length) {
      var q = m.state.dirQuery.trim();
      var where = m.state.dirDept === 'all' ? '' : ' in ' + m.state.dirDept;
      return '<div class="pv-empty"><p><strong>No employees match' + (q ? ' “' + esc(q) + '”' : '') + esc(where) + '.</strong></p>' +
        '<p>Try another name, role or employee ID.</p>' +
        '<button type="button" class="pv-btn" data-action="dir-clear">Clear search and filter</button></div>';
    }
    var shown = limit ? list.slice(0, limit) : list;
    var body = shown.map(function (e) {
      return '<div role="row" class="pv-tr">' +
        '<span role="cell" class="pv-td pv-td-main" data-label="Employee">' + person(e, e.id) + '</span>' +
        '<span role="cell" class="pv-td" data-label="Department">' + esc(e.department) + '</span>' +
        '<span role="cell" class="pv-td" data-label="Role">' + esc(e.role) + '</span>' +
        '<span role="cell" class="pv-td" data-label="Status">' + badge(e.status, EMP_CLASS[e.status]) + '</span>' +
        '</div>';
    }).join('');
    var more = limit && list.length > limit
      ? '<button type="button" class="pv-btn pv-more" data-action="dir-more">Show all ' + list.length + ' employees</button>' : '';
    return '<div role="table" class="pv-table pv-table-dir" aria-label="Sample employee directory" aria-rowcount="' + (list.length + 1) + '">' +
      '<div role="rowgroup" class="pv-thead"><div role="row" class="pv-tr">' +
        '<span role="columnheader" class="pv-th">Employee</span><span role="columnheader" class="pv-th">Department</span>' +
        '<span role="columnheader" class="pv-th">Role</span><span role="columnheader" class="pv-th">Status</span>' +
      '</div></div><div role="rowgroup" class="pv-tbody">' + body + '</div></div>' + more;
  }

  /* ---------- Attendance ---------- */
  function attendanceChips(m) {
    var c = m.dayCounts(m.state.attDay);
    var total = m.D.employees.length;
    return [['all', 'All', total], ['P', 'Present', c.P], ['A', 'Absent', c.A], ['L', 'On leave', c.L]].map(function (x) {
      return '<button type="button" class="pv-chip" data-action="att-filter" data-filter="' + x[0] + '" aria-pressed="' + (m.state.attFilter === x[0]) + '">' +
        x[1] + ' <span class="pv-chip-n">' + x[2] + '</span></button>';
    }).join('');
  }
  function attendanceSummary(m) {
    var c = m.dayCounts(m.state.attDay);
    return m.D.dayNames[m.state.attDay] + (m.state.attDay === m.D.today ? ' (today)' : '') + ': ' +
      c.P + ' present, ' + c.A + ' absent and ' + c.L + ' on leave, out of ' + m.D.employees.length + ' employees.';
  }
  function attendance(m) {
    var day = m.state.attDay, f = m.state.attFilter;
    var list = m.D.employees.filter(function (e) { return f === 'all' || m.att(e.id, day) === f; });
    if (!list.length) {
      return '<div class="pv-empty"><p><strong>No one is marked ' + ATT_LABEL[f].toLowerCase() + ' on ' + m.D.dayNames[day] + '.</strong></p>' +
        '<button type="button" class="pv-btn" data-action="att-filter" data-filter="all">Show everyone</button></div>';
    }
    var body = list.map(function (e) {
      var code = m.att(e.id, day);
      var note = m.attNote(e.id, day);
      return '<div role="row" class="pv-tr">' +
        '<span role="cell" class="pv-td pv-td-main" data-label="Employee">' + person(e, e.department) + '</span>' +
        '<span role="cell" class="pv-td" data-label="Status">' + badge(ATT_LABEL[code], ATT_CLASS[code]) + '</span>' +
        '<span role="cell" class="pv-td pv-num" data-label="Check-in">' + (code === 'P' ? m.D.checkIn(e.index, day) : '<span aria-label="None">–</span>') + '</span>' +
        '<span role="cell" class="pv-td pv-muted" data-label="Note">' + (note ? esc(note) : '') + '</span>' +
        '</div>';
    }).join('');
    return '<div role="table" class="pv-table pv-table-att" aria-label="Sample attendance for ' + m.D.dayNames[day] + '">' +
      '<div role="rowgroup" class="pv-thead"><div role="row" class="pv-tr">' +
        '<span role="columnheader" class="pv-th">Employee</span><span role="columnheader" class="pv-th">Status</span>' +
        '<span role="columnheader" class="pv-th">Check-in</span><span role="columnheader" class="pv-th">Note</span>' +
      '</div></div><div role="rowgroup" class="pv-tbody">' + body + '</div></div>';
  }

  /* ---------- Leave ---------- */
  function leaveChips(m) {
    var all = m.state.leaves;
    function n(s) { return all.filter(function (l) { return l.status === s; }).length; }
    return [['Pending', n('Pending')], ['Approved', n('Approved')], ['Declined', n('Declined')], ['All', all.length]].map(function (x) {
      return '<button type="button" class="pv-chip" data-action="leave-filter" data-filter="' + x[0] + '" aria-pressed="' + (m.state.leaveFilter === x[0]) + '">' +
        x[0] + ' <span class="pv-chip-n">' + x[1] + '</span></button>';
    }).join('');
  }
  function leave(m) {
    var f = m.state.leaveFilter;
    var list = m.state.leaves.filter(function (l) {
      return f === 'All' || l.status === f || (f === 'Pending' && m.state.justProcessed.indexOf(l.id) !== -1);
    });
    if (!list.length) {
      var msg = f === 'Pending' ? 'No pending requests. You’re all caught up.' : 'No ' + f.toLowerCase() + ' requests.';
      return '<div class="pv-empty"><p><strong>' + msg + '</strong></p>' +
        (m.state.dirty ? '<button type="button" class="pv-btn" data-action="reset">Reset sample data</button>' : '') + '</div>';
    }
    return '<ul class="pv-requests">' + list.map(function (l) {
      var emp = m.emp(l.employee);
      var actions = l.status === 'Pending'
        ? '<div class="pv-actions">' +
            '<button type="button" class="pv-btn pv-btn-dark" data-action="approve" data-id="' + l.id + '">Approve<span class="sr-only"> ' + esc(emp.name) + '’s ' + esc(l.type.toLowerCase()) + '</span></button>' +
            '<button type="button" class="pv-btn" data-action="decline" data-id="' + l.id + '">Decline<span class="sr-only"> ' + esc(emp.name) + '’s ' + esc(l.type.toLowerCase()) + '</span></button>' +
          '</div>'
        : '<p class="pv-decided">' + (l.decidedNow ? esc(l.status) + ' just now in this preview' : esc(l.status) + ' earlier') + '</p>';
      return '<li class="pv-request' + (l.decidedNow ? ' is-decided' : '') + '" id="pv-req-' + l.id + '" tabindex="-1">' +
        '<div class="pv-request-who">' + person(emp, emp.department) + badge(l.status, LEAVE_CLASS[l.status]) + '</div>' +
        '<dl class="pv-request-meta">' +
          '<div><dt>Type</dt><dd>' + esc(l.type) + '</dd></div>' +
          '<div><dt>Dates</dt><dd>' + esc(l.dates) + '</dd></div>' +
          '<div><dt>Days</dt><dd>' + l.days + '</dd></div>' +
          '<div><dt>Requested</dt><dd>' + esc(l.requested) + '</dd></div>' +
        '</dl>' + actions + '</li>';
    }).join('') + '</ul>';
  }

  return {
    esc: esc,
    shell: shell,
    overview: overview,
    directory: directory,
    attendanceChips: attendanceChips,
    attendanceSummary: attendanceSummary,
    attendance: attendance,
    leaveChips: leaveChips,
    leave: leave
  };
})();
