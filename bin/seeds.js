const mongoose = require('mongoose');
const User = require('../models/User.model');
const Projects = require('../models/Project.model');
const bcrypt = require('bcryptjs');


const DB_NAME = 'project-2';

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const users = 

    { 
      firstname: 'Admin', 
      lastname: 'Ismylastname', 
      email: 'admin@admin.com', 
      password: `${process.env.ADMIN_PASSWORD}`,
      role: 'ADMIN',      
    }
  ;


const projects = [{
  name: 'Nam ut turpis',
  date: '2020-12-17',
  location: 'Schoolyard',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel justo nulla. Donec suscipit interdum augue non pellentesque. Sed ut mauris at tellus consectetur feugiat. Proin et odio et elit suscipit auctor. Sed auctor rhoncus nisi a laoreet. Integer vel purus justo. Vivamus ullamcorper vitae arcu ut bibendum. Ut sit amet pulvinar ligula. Proin eleifend hendrerit mi sed vestibulum. Sed dictum vel augue in dictum.',
  status: 'Approved'
},
{
  name: 'Phasellus',
  date: '2021-12-17',
  location: 'Community Centre',
  description: 'Etiam sollicitudin augue eu ultricies mattis. Morbi arcu mauris, eleifend et elit at, feugiat auctor sapien. Pellentesque vitae velit feugiat, pulvinar orci rhoncus, imperdiet mi. Maecenas sed eros tempor, viverra urna in, consequat neque. Morbi posuere bibendum massa, non mollis ex posuere id. Vestibulum lobortis enim at velit bibendum, non consectetur orci auctor. Donec efficitur nibh erat, vel dapibus tellus condimentum vel. Duis pulvinar maximus vulputate. Duis eget urna velit. Sed nibh libero, condimentum quis gravida ac, pellentesque id tellus. Vivamus ante nunc, tristique id tincidunt ac, ultricies sed arcu.',
  status: 'Declined'
},
{
  name: 'Curabitur',
  date: '2021-10-06',
  location: 'Amsterdam West',
  description: 'Curabitur eu dolor neque. Morbi tincidunt pellentesque gravida. Aliquam vel mi nibh. Mauris libero ligula, condimentum vitae aliquam a, sollicitudin sed ex. Nam ullamcorper iaculis orci, in fringilla mauris pharetra vitae. Sed gravida mollis varius. Nunc est enim, molestie sit amet luctus sed, varius sit amet mi. Etiam eget justo neque. Morbi in eros vel est porta pellentesque. Donec nec ligula tellus. Quisque sed vulputate neque. Vestibulum vel facilisis tellus.',
  status: 'Request'
},
{
  name: 'Maecenas',
  date: '2021-01-05',
  location: 'Spreeuwenpark 24-1, 1021 GX',
  description: 'Pellentesque ut nisi dictum, commodo nulla vitae, ultricies ante. Cras ut magna consequat, sagittis justo at, vestibulum velit. Aliquam erat volutpat. Aliquam erat volutpat. Sed porta iaculis ex, luctus ultrices elit volutpat commodo. Maecenas iaculis vitae turpis non sagittis. Aliquam sit amet varius erat. Aliquam sit amet ultrices lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque tempus euismod rutrum. Aenean in dui urna. Aliquam faucibus velit elit, ut tempor elit sodales sit amet.',
  status: 'Pending'
},
];

function createUsers(users) {
  const saltRounds = 10;

  const {firstname, lastname, email, password, role} = users;

  bcrypt.genSalt(saltRounds)
  .then(salt => bcrypt.hash(password, salt))
  .then(hashedPassword => {
    return User.create({
      firstname,
      lastname,
      email,
      role,
      passwordHash: hashedPassword
    });
  })
  .then(usersFromDb => {
    console.log(`Created ${usersFromDb.length} users`);
    mongoose.connection.close();
})
.catch(err => console.log(`An error occurred while creating users in the DB: ${err}`));
}

Projects.create(projects)
.then(projectsFromDb => {
    console.log(`Created ${projectsFromDb.length} projects`);
    mongoose.connection.close();
})
.catch(err => console.log(`An error occurred while creating projects in the DB: ${err}`));

createUsers(users)