const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const artworkSchema = new Schema(
  {
    //this key will be used to pull in the artwork's title from the Gallery collection
    title: { 
      type: String,
      required: true
    },
    //this key will be used to pull in the artist's full name from the Profile collection
    artist: [{type: Schema.Types.ObjectId, ref: 'User'}],
    
    description: {
      type: String
    },
    medium: {
      type: String
    },
    //this key will be used to pull in the artwork's title from the Gallery collection
    upload: {
      type: [String]
    },
    
    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Artwork', artworkSchema);
