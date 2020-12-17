const hbs = require('hbs');

//Handlebar register helper
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