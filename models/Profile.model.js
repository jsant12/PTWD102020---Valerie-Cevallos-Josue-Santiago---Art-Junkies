const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const profileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required']
    },
    email: {
      type: {},
      required: true
    },
    profilePicture: {
      type: String
    },
    uploads: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Profile', profileSchema);
