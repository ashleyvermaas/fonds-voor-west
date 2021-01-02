// User model (admin/applicant)
const bcrypt = require('bcryptjs');


const { Schema, model } = require('mongoose');

// const userSchema = new Schema({
//   firstname: {
//     type: String,
//     trim: true,
//     required: [true, 'First name is required.'],
//   },
//   lastname: {
//     type: String,
//     trim: true,
//     required: [true, 'Last name is required.'],
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required.'],
//     match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   passwordHash: {
//     type: String,
//     // required: [true, 'Password is required.']
//   },
//   resetPasswordToken: {
//     type: String
//   },
//   resetPasswordExpires: {
//     type: Date
//   },
//   role: {
//     type: String,
//     enum: ['COMMITTEE', 'APPLICANT', 'ADMIN'],
//     default: 'APPLICANT'
//   },
//   imageUrl: {
//     type: String,
//     default: 'https://via.placeholder.com/150'
//   },
//   projects: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Projects'
//   }]
// }, 
// {
//   timestamps: true
// }, {
//   googleId: String,
//   linkedInId: String,

// });

// userSchema.pre('save', function(next) {
//   var user = this;
//   var SALT_FACTOR = 12; // 12 or more for better security

//   if (!user.isModified('password')) return next();

//   console.log(user.password) // Check accident password update

//   bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
//      if (err) return next(err);

//      bcrypt.hash(user.password, salt, null, function(err, hash) {
//         if (err) return next(err);
//         user.password = hash;
//         next();
//      });
//   });
// });

// module.exports = model('User', userSchema);

const userSchema = new Schema({
    firstname: {
      type: String,
      trim: true,
      required: [true, 'First name is required.'],
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, 'Last name is required.'],
    },
    email: {
      type: String,
      // required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      // required: [true, 'Password is required.']
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    },
    role: {
      type: String,
      enum: ['COMMITTEE', 'APPLICANT', 'ADMIN'],
      default: 'APPLICANT'
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    projects: [{
      type: Schema.Types.ObjectId,
      ref: 'Projects'
    }]
  }, 
  {
    timestamps: true
  }, {
    googleId: String,
    linkedInId: String,
    facebookId: String,
  });

  userSchema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 5;
  
    if (!user.isModified('password')) return next();
  
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      if (err) return next(err);
  
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  });
  
  userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

module.exports = model('User', userSchema);

// var User = mongoose.model('User', userSchema);