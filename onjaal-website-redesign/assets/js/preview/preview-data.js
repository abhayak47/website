/* Onjaal HRMS interactive preview: fictional sample data.
   Every person, figure and event here is invented for the website preview.
   Nothing in this file is customer data or a real operational result.

   Attendance covers one sample working week (Mon to Fri). "Today" is Friday.
   Codes: P = present, A = absent, L = on leave.
   Pending leave days are marked A until the request is approved. */
window.OnjaalPreviewData = (function () {
  'use strict';

  var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  var dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  var today = 4;

  var departments = ['Finance', 'Human Resources', 'Operations', 'Production', 'Quality', 'Sales'];

  // id, name, department, role, employment status, attendance Mon..Fri
  var rows = [
    ['E101', 'Ananya Kulkarni', 'Operations', 'Operations executive', 'Active', 'PPPPP'],
    ['E102', 'Rohan Deshmukh', 'Sales', 'Sales manager', 'Active', 'PPPPA'],
    ['E103', 'Sneha Patil', 'Finance', 'Accounts executive', 'Active', 'PPPAA'],
    ['E104', 'Imran Shaikh', 'Production', 'Shift supervisor', 'Active', 'PPPPP'],
    ['E105', 'Kavya Iyer', 'Human Resources', 'HR executive', 'Active', 'PPPPP'],
    ['E106', 'Arjun Mehta', 'Quality', 'Quality inspector', 'Active', 'LLPPP'],
    ['E107', 'Priya Nair', 'Operations', 'Logistics coordinator', 'Active', 'PPLLL'],
    ['E108', 'Meera Joshi', 'Sales', 'Sales executive', 'Active', 'PPPPP'],
    ['E109', 'Vikram Rao', 'Production', 'Machine operator', 'Active', 'PAPPA'],
    ['E110', 'Farhan Qureshi', 'Production', 'Machine operator', 'Probation', 'PPPAP'],
    ['E111', 'Neha Gupta', 'Finance', 'Finance manager', 'Active', 'PPPPP'],
    ['E112', 'Siddharth Pawar', 'Operations', 'Operations manager', 'Active', 'PPPPP'],
    ['E113', 'Aditi Kale', 'Quality', 'Quality engineer', 'Active', 'PPPPP'],
    ['E114', 'Rahul Bhosale', 'Production', 'Maintenance technician', 'Active', 'PPPPP'],
    ['E115', 'Pooja Shinde', 'Human Resources', 'HR manager', 'Active', 'PPPPP'],
    ['E116', 'Karan Malhotra', 'Sales', 'Sales executive', 'Notice period', 'PPPPP'],
    ['E117', 'Anjali Menon', 'Operations', 'Purchase executive', 'Active', 'PPPPP'],
    ['E118', 'Deepak Jadhav', 'Production', 'Production planner', 'Active', 'PPPPP'],
    ['E119', 'Ritu Agarwal', 'Finance', 'Payroll executive', 'Active', 'PPPPP'],
    ['E120', 'Nikhil Gaikwad', 'Quality', 'Quality inspector', 'Probation', 'PPPPP'],
    ['E121', 'Swati More', 'Operations', 'Store keeper', 'Active', 'PPPPP'],
    ['E122', 'Aakash Thakur', 'Sales', 'Business development executive', 'Active', 'PPPPP'],
    ['E123', 'Tanvi Sawant', 'Production', 'Machine operator', 'Active', 'PPPPP'],
    ['E124', 'Manoj Pillai', 'Quality', 'Quality manager', 'Active', 'PPPPP']
  ];

  var employees = rows.map(function (r, i) {
    return { id: r[0], name: r[1], department: r[2], role: r[3], status: r[4], index: i };
  });

  var attendance = {};
  rows.forEach(function (r) { attendance[r[0]] = r[5].split(''); });

  // Sample check-in times, fixed per person and day so the preview is repeatable.
  function checkIn(employeeIndex, day) {
    var minutes = (employeeIndex * 7 + day * 11) % 26;
    return '09:' + (minutes < 10 ? '0' : '') + minutes;
  }

  // weekDays: which sample-week days the request covers (0 = Mon). Empty = outside the sample week.
  var leaves = [
    { id: 'L1', employee: 'E102', type: 'Casual leave', dates: 'Fri', days: 1, weekDays: [4], requested: 'Thu', status: 'Pending' },
    { id: 'L2', employee: 'E103', type: 'Sick leave', dates: 'Thu – Fri', days: 2, weekDays: [3, 4], requested: 'Thu', status: 'Pending' },
    { id: 'L3', employee: 'E104', type: 'Earned leave', dates: 'Next Mon – Wed', days: 3, weekDays: [], requested: 'Wed', status: 'Pending' },
    { id: 'L4', employee: 'E105', type: 'Casual leave', dates: 'Next Thu', days: 1, weekDays: [], requested: 'Wed', status: 'Pending' },
    { id: 'L5', employee: 'E107', type: 'Earned leave', dates: 'Wed – Fri', days: 3, weekDays: [2, 3, 4], requested: 'Mon', status: 'Approved' },
    { id: 'L6', employee: 'E106', type: 'Earned leave', dates: 'Mon – Tue', days: 2, weekDays: [0, 1], requested: 'Last Fri', status: 'Approved' },
    { id: 'L7', employee: 'E108', type: 'Casual leave', dates: 'Wed', days: 1, weekDays: [2], requested: 'Tue', status: 'Declined' }
  ];

  var activity = [
    { when: 'Thu', text: 'Rohan Deshmukh requested casual leave for Fri' },
    { when: 'Thu', text: 'Sneha Patil requested sick leave for Thu – Fri' },
    { when: 'Wed', text: 'Imran Shaikh requested earned leave for next Mon – Wed' },
    { when: 'Tue', text: 'Meera Joshi’s casual leave for Wed was declined' },
    { when: 'Mon', text: 'Priya Nair’s earned leave for Wed – Fri was approved' }
  ];

  return {
    companyLabel: 'Sample company',
    days: days,
    dayNames: dayNames,
    today: today,
    departments: departments,
    employees: employees,
    attendance: attendance,
    leaves: leaves,
    activity: activity,
    checkIn: checkIn
  };
})();
