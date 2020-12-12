const hbs = require('hbs');


//Handlebar register helper
hbs.registerHelper('ifIsAdmin', (userRole) => {
  return userRole == 'ADMIN'
});

hbs.registerHelper('ifIsCommittee', (userRole) => {
  return userRole === 'COMMITTEE'
});

hbs.registerHelper('ifIsApplicant', (userRole) => {
  return userRole === 'APPLICANT'
});

