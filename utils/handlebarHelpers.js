const hbs = require('hbs');

// Handlebars register helper
hbs.registerHelper('ifIsAdmin', (userRole) => {
  return userRole === 'ADMIN';
});

hbs.registerHelper('ifIsCommittee', (userRole) => {
  return userRole === 'COMMITTEE';
});

hbs.registerHelper('ifIsApplicant', (userRole) => {
  return userRole === 'APPLICANT';
});

hbs.registerHelper('ifNotLoggedIn', (userRole) => {
  if (userRole !== 'ADMIN' && userRole !== 'COMMITTEE' && userRole !== 'APPLICANT') {
    return true;
  }
});

// hbs.registerHelper('projectStatus', (status) => {
//   if (status == 'Approved'){
//     document.getElementById("project-status").className = "btn btn-success";
//     // button success
//   } else if (status == 'Declined'){
//     document.getElementById("project-status").className = "btn btn-danger";
//         // button danger
//   } else if (status == 'Request'){
//     document.getElementById("project-status").className = "btn btn-info";
//     // button info
//   } else {
//     document.getElementById("project-status").className = "btn btn-warning";
//     // button warning
//   }
// });