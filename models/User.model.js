// User model (admin/applicant)
const bcrypt = require('bcryptjs');


const { Schema, model } = require('mongoose');

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


module.exports = model('User', userSchema);

