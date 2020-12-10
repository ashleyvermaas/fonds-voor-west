// User model (admin/applicant)
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
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
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    }, 
    role: {
      type: String,
      enum: ['GUEST', 'COMMITTEE', 'APPLICANT', 'ADMIN'],
      default: 'GUEST'
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);  



