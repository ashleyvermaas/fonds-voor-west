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
const User          = require('./models/User.model');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');
require('./configs/session.config')(app);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
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
            return done(null, false, { message: 'Incorrect email' });
          }
 
          if (!bcrypt.compareSync(password, user.passwordHash)) {
            return done(null, false, { message: 'Incorrect password' });
          }
 
          done(null, user);
        })
        .catch(err => done(err));
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth.routes');
app.use('/', authRouter); 

const projectRoutes = require('./routes/project.routes');
app.use('/',ensureAuthenticated, projectRoutes);

const userRouter = require('./routes/user.routes');
app.use('/',ensureAuthenticated, userRouter); 

// User authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}



module.exports = app;

