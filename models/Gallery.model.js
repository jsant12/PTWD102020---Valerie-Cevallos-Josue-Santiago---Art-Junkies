const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const gallerySchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  artist: {
    type: {},
    required: true
  },

  images: {
    type: String,
    required: true
  }

  // model properties
}, {
  timestamps: true
});

module.exports = model('Gallery', gallerySchema);