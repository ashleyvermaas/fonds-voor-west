const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema(
{
  name: {
    type: String
  },
  date: {
    type: String
  },
  location: {
    type: String,
    required: [true, 'Location is required.']
  },
  description: {
    type: String,
    required: [true, 'Description is required.']
  }
}, 
{
  timestamps: true
}
);

module.exports = model('Project', projectSchema);