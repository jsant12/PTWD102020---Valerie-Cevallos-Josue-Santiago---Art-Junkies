const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ArtworkSchema = new Schema(
  {
    title: {
      type: {},
      required: true
    },
    artist: {
      type: {},
      required: true
    },
    description: {
      type: String
    },
    medium: {
      type: String
    },
    image: {
      type: {},
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Artwork', artworkSchema);
