const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.']
  },
  date: {
    type: String,
    required: [true, 'Date is required.']
  },
  location: {
    type: String,
    required: [true, 'Location is required.']
  },
  description: {
    type: String,
    required: [true, 'Description is required.']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Approved', 'Declined', 'Request', 'Pending'],
    default: 'Pending'
  },
  accountability: {
    type: String,
  },
  projectplanUrl: {
    type: String,
  },
  costingUrl: {
    type: String,
  },
  projectImageUrl: {
    type: String,
    default: "http://www.dronestagr.am/wp-content/uploads/2013/08/GOPR1858.jpg"
  },
  accountabilityUrl: {
    type: String,
  },
  coordinateLat: {
    type: String,
  },
  coordinateLng: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = model('Project', projectSchema);