const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const gallerySchema = new Schema({
//these keys will pull in all the information by ObjectId from the respective collection

  title: [{type: Schema.Types.ObjectId, ref: 'Artwork'}],
  artist: [{type: Schema.Types.ObjectId, ref: 'User'}],
  image: [{type: Schema.Types.ObjectId, ref: 'Artwork'}],
}, 
{
  timestamps: true
});

module.exports = model('Gallery', gallerySchema);