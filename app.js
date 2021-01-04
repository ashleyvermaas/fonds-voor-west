require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

// Passport
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const bcrypt       = require('bcryptjs');
const passport     = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


const User          = require('./models/User.model');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Require database configuration
require('./configs/db.config');
require('./configs/session.config')(app);

// Require Handlebars
require('./utils/handlebarHelpers');

// Middleware setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express view engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Passport installation
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: false // <== false if you don't want to save empty session object to the store
  })
);

passport.serializeUser((user, done) => done(null, user._id));
 
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
    (req, email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, { errorMessage: 'Incorrect email' });
          }
 
          if (!bcrypt.compareSync(password, user.passwordHash)) {
            return done(null, false, { errorMessage: 'Incorrect password' });
          }
 
          done(null, user);
        })
        .catch(err => done(err));
    }
  )
);

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  User.create({ 
    firstname: profile.name.givenName, 
    lastname: profile.name.familyName,
    email: profile.emails[0].value,
    googleId: profile.id ,
    
  }, function (err, user) {
    return done(err, user);
  });
}
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ["email", "name"]
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile)

  User.create({ 
    firstname: profile.name.givenName, 
    lastname: profile.name.familyName,
    email: profile.email,
    facebookId: profile.id 
  }, function (err, user) {
    return cb(err, user);
  });
}
));

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_KEY,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: "/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_liteprofile'],
  state: true
}, function(accessToken, refreshToken, profile, done) {
  User.create({
    firstname: profile.name.givenName, 
    lastname: profile.name.familyName,
    email: profile.emails[0].value,
    linkedInId: profile.id ,
  }), 
  function (err, user) {
    return done(null, profile);
  };
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.user = req.user;
  next();
});

// Routes
const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth.routes');
app.use('/', authRouter); 

const projectRoutes = require('./routes/project.routes');
app.use('/',ensureAuthenticated, projectRoutes);

const userRouter = require('./routes/user.routes');
app.use('/',ensureAuthenticated, userRouter); 

const mailRouter = require('./routes/mailer.routes');
app.use('/', mailRouter); 

// User authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Role authentication
const checkRoles = role => (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === role) {
    return next();
  } else {
    res.redirect('/login');
  }
};

const checkGuest = checkRoles('GUEST');
const checkCommittee = checkRoles('COMMITTEE');
const checkApplicant = checkRoles('APPLICANT');
const checkAdmin = checkRoles('ADMIN');


module.exports = app;

