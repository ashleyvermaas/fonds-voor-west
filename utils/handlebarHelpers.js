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

hbs.registerHelper('statusApproved', (status) => {
  if (status == 'Approved')
  return true;
});

hbs.registerHelper('statusDeclined', (status) => {
  if (status == 'Declined')
  return true;
});

hbs.registerHelper('statusRequest', (status) => {
  if (status == 'Request')
  return true;
});

hbs.registerHelper('statusPending', (status) => {
  if (status == 'Pending')
  return true;
});


// hbs.registerHelper('checkStatus', (status) => {
//   let buttonstatus = document.querySelector("#project-status");
//   let buttonvalue = document.querySelector("#project-status").innerHTML;

//   if (status === 'Approved') {
//     buttonstatus.className = "btn btn-success";
//   } else if (status === 'Declined'){
//     buttonstatus.className = "btn btn-danger";
//   } else if (status === 'Request for information') {
//     buttonstatus.className = "btn btn-info";
//   } else {
//     buttonstatus.className = "btn btn-warning";
//   }
// });
